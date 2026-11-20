import express from "express";
import * as v from "valibot";
import { Resend } from "resend";
import { httpServerHandler } from "cloudflare:node";
import { env } from "cloudflare:workers";

// Corre como Cloudflare Worker: Express escucha en un puerto "virtual" y
// httpServerHandler le pasa las peticiones del Worker (ver wrangler.jsonc).
const port = 3000;
const app = express();

app.use(express.json({ limit: "10kb" }));

// ---------------------------------------------------------------------------
// Config desde el env del Worker (vars + secretos; en local, server/.env).
// Se lee con `env` de cloudflare:workers (process.env no recibía los secretos en producción).
//   RESEND_API_KEY, MAIL_TO, TURNSTILE_SECRET_KEY: secretos
//   MAIL_FROM: remitente del dominio verificado en Resend (var)
//   ALLOWED_HOSTNAMES: hostnames aceptados para Origin y Turnstile, separados por coma (var; vacío = no se revisa)
//   DAILY_LIMIT: tope de correos por día (var, por defecto 50). Necesita el binding KV CONTACT_LIMITS
// ---------------------------------------------------------------------------
function getConfig() {
    const { RESEND_API_KEY, MAIL_FROM, MAIL_TO, TURNSTILE_SECRET_KEY, ALLOWED_HOSTNAMES = "", DAILY_LIMIT } = env;
    const missing = Object.entries({ RESEND_API_KEY, MAIL_FROM, MAIL_TO, TURNSTILE_SECRET_KEY })
        .filter(([, value]) => !value)
        .map(([key]) => key);
    return {
        RESEND_API_KEY,
        MAIL_FROM,
        MAIL_TO,
        TURNSTILE_SECRET_KEY,
        allowedHostnames: ALLOWED_HOSTNAMES.split(",").map((host) => host.trim()).filter(Boolean),
        dailyLimit: Number(DAILY_LIMIT) || 50,
        limits: env.CONTACT_LIMITS ?? null,
        missing,
    };
}

// ---------------------------------------------------------------------------
// Validación (mismas reglas que los textos de ayuda del formulario en Contact.jsx)
// ---------------------------------------------------------------------------
const MIN_ELAPSED_MS = 3000; // un humano no llena el formulario en menos de 3 s

// Sin saltos de línea en campos que terminan en headers del correo (asunto, reply_to)
const singleLine = v.regex(/^[^\r\n]*$/, "must be a single line");

const ContactSchema = v.object({
    subject: v.pipe(v.string(), v.trim(), v.minLength(3), v.maxLength(80), singleLine),
    name: v.pipe(v.string(), v.trim(), v.minLength(2), v.maxLength(60), singleLine),
    email: v.pipe(v.string(), v.trim(), v.maxLength(100), v.email(), singleLine),
    phone: v.optional(
        v.pipe(
            v.string(),
            v.transform((value) => value.replace(/[\s()-]/g, "")),
            v.regex(/^(\+?\d{8,15})?$/, "must be 8 to 15 digits"),
        ),
        "",
    ),
    message: v.pipe(v.string(), v.trim(), v.minLength(20), v.maxLength(1000)),
});

// ---------------------------------------------------------------------------
// Turnstile: verifica el token contra Cloudflare. Cada token sirve una sola vez y vence a los 5 min
// ---------------------------------------------------------------------------
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstile({ token, ip, secret, allowedHostnames }) {
    if (typeof token !== "string" || !token) return false;

    const body = new FormData();
    body.append("secret", secret);
    body.append("response", token);
    if (ip) body.append("remoteip", ip);

    const response = await fetch(SITEVERIFY_URL, { method: "POST", body });
    const result = await response.json();

    if (!result.success) {
        console.warn("Turnstile failed:", result["error-codes"]);
        return false;
    }
    if (allowedHostnames.length > 0 && !allowedHostnames.includes(result.hostname)) {
        console.warn("Turnstile hostname not allowed:", result.hostname);
        return false;
    }
    return true;
}

// ---------------------------------------------------------------------------
// Tope global diario en KV (protege la cuota de Resend si atacan desde muchas IPs).
// KV no es atómico: en ráfagas puede pasarse por poco, sirve como tope aproximado.
// ---------------------------------------------------------------------------
const todayKey = () => `sent:${new Date().toISOString().slice(0, 10)}`;

async function getSentToday(limits) {
    if (!limits) return 0;
    return Number(await limits.get(todayKey())) || 0;
}

async function incrementSentToday(limits, current) {
    if (!limits) return;
    await limits.put(todayKey(), String(current + 1), { expirationTtl: 60 * 60 * 48 });
}

function isAllowedOrigin(origin, allowedHostnames) {
    if (allowedHostnames.length === 0 || !origin) return true; // sin Origin = no es un navegador
    try {
        return allowedHostnames.includes(new URL(origin).hostname);
    } catch {
        return false;
    }
}

// ---------------------------------------------------------------------------
// Ruta
// Orden: config → Origin/Content-Type → honeypot/tiempo → validación → Turnstile → tope diario → envío
// ---------------------------------------------------------------------------
app.post("/api/contact", async (req, res) => {
    const config = getConfig();
    if (config.missing.length > 0) {
        console.error(`Missing env vars: ${config.missing.join(", ")}`);
        return res.status(500).json({ ok: false, error: "server" });
    }

    if (!isAllowedOrigin(req.get("origin"), config.allowedHostnames)) {
        return res.status(403).json({ ok: false, error: "origin" });
    }
    if (!req.is("application/json")) {
        return res.status(415).json({ ok: false, error: "content-type" });
    }

    const body = req.body ?? {};

    // Honeypot y tiempo mínimo: a los bots se les responde "éxito" sin enviar nada
    const elapsed = Number(body.elapsedMs);
    if (body.website || !Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) {
        console.warn("Bot heuristics triggered", { honeypot: Boolean(body.website), elapsed });
        return res.json({ ok: true });
    }

    const parsed = v.safeParse(ContactSchema, body);
    if (!parsed.success) {
        const fields = [...new Set(parsed.issues.map((issue) => v.getDotPath(issue)).filter(Boolean))];
        return res.status(400).json({ ok: false, error: "invalid", fields });
    }

    const isHuman = await verifyTurnstile({
        token: body["cf-turnstile-response"],
        ip: req.get("cf-connecting-ip"),
        secret: config.TURNSTILE_SECRET_KEY,
        allowedHostnames: config.allowedHostnames,
    });
    if (!isHuman) {
        return res.status(403).json({ ok: false, error: "captcha" });
    }

    const sentToday = await getSentToday(config.limits);
    if (sentToday >= config.dailyLimit) {
        console.warn(`Daily limit reached (${config.dailyLimit})`);
        return res.status(429).json({ ok: false, error: "limit" });
    }

    const { subject, name, email, phone, message } = parsed.output;

    const text = [
        `Nombre: ${name}`,
        `Correo de contacto: ${email}`,
        `Teléfono: ${phone || "-"}`,
        "",
        "Mensaje:",
        message,
    ].join("\n");

    // Remitente siempre fijo (MAIL_FROM); el correo del visitante va solo en reply_to
    const resend = new Resend(config.RESEND_API_KEY);
    const { error } = await resend.emails.send({
        from: config.MAIL_FROM,
        to: config.MAIL_TO,
        replyTo: email,
        subject: `[Portfolio] ${subject}`,
        text,
    });

    if (error) {
        console.error("Resend error:", error);
        return res.status(500).json({ ok: false, error: "server" });
    }

    await incrementSentToday(config.limits, sentToday);
    res.json({ ok: true });
});

// Cualquier otro método en la ruta
app.all("/api/contact", (req, res) => {
    res.set("Allow", "POST").status(405).json({ ok: false, error: "method" });
});

// Errores de express.json (body > 10 kb o JSON roto) como JSON
app.use((err, req, res, next) => {
    if (err.type === "entity.too.large") return res.status(413).json({ ok: false, error: "too-large" });
    if (err.type === "entity.parse.failed") return res.status(400).json({ ok: false, error: "bad-json" });
    console.error(err);
    if (res.headersSent) return next(err);
    res.status(500).json({ ok: false, error: "server" });
});

app.listen(port);

export default httpServerHandler({ port });
