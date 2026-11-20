import express from "express";
import { Resend } from "resend";
import { httpServerHandler } from "cloudflare:node";
import { env } from "cloudflare:workers";

// Corre como Cloudflare Worker: Express escucha en un puerto "virtual" y
// httpServerHandler le pasa las peticiones del Worker (ver wrangler.jsonc).
const port = 3000;
const app = express();

app.use(express.json());

// Config desde el env del Worker (vars + secretos; en local, server/.env).
// Se lee con `env` de cloudflare:workers (process.env no recibía los secretos en producción).
// MAIL_FROM: remitente del dominio verificado en Resend. MAIL_TO: correo que recibe los mensajes
// TURNSTILE_SECRET_KEY: secret del widget de Turnstile (en local, la clave de prueba de Cloudflare)
// TURNSTILE_HOSTNAMES (opcional): hostnames aceptados en la verificación, separados por coma
function getConfig() {
    const { RESEND_API_KEY, MAIL_FROM, MAIL_TO, TURNSTILE_SECRET_KEY, TURNSTILE_HOSTNAMES = "" } = env;
    const missing = Object.entries({ RESEND_API_KEY, MAIL_FROM, MAIL_TO, TURNSTILE_SECRET_KEY })
        .filter(([, value]) => !value)
        .map(([key]) => key);
    const allowedHostnames = TURNSTILE_HOSTNAMES.split(",").map((host) => host.trim()).filter(Boolean);
    return { RESEND_API_KEY, MAIL_FROM, MAIL_TO, TURNSTILE_SECRET_KEY, allowedHostnames, missing };
}

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Verifica el token del widget contra Cloudflare. Cada token sirve una sola vez y vence a los 5 min
async function verifyTurnstile({ token, ip, secret, allowedHostnames }) {
    if (!token) return false;

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

// Por ahora sin validaciones de campos: el correo del visitante es solo información de contacto
app.post("/api/contact", async (req, res) => {
    const { RESEND_API_KEY, MAIL_FROM, MAIL_TO, TURNSTILE_SECRET_KEY, allowedHostnames, missing } = getConfig();
    if (missing.length > 0) {
        console.error(`Missing env vars: ${missing.join(", ")}`);
        return res.status(500).json({ ok: false });
    }

    const body = req.body ?? {};

    const isHuman = await verifyTurnstile({
        token: body["cf-turnstile-response"],
        ip: req.get("cf-connecting-ip"),
        secret: TURNSTILE_SECRET_KEY,
        allowedHostnames,
    });
    if (!isHuman) {
        return res.status(403).json({ ok: false, error: "captcha" });
    }

    const { subject = "", name = "", email = "", phone = "", message = "" } = body;

    const text = [
        `Nombre: ${name}`,
        `Correo de contacto: ${email}`,
        `Teléfono: ${phone || "-"}`,
        "",
        "Mensaje:",
        message,
    ].join("\n");

    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
        from: MAIL_FROM,
        to: MAIL_TO,
        subject: `[Portfolio] ${subject}`,
        text,
    });

    if (error) {
        console.error("Resend error:", error);
        return res.status(500).json({ ok: false });
    }

    res.json({ ok: true });
});

app.listen(port);

export default httpServerHandler({ port });
