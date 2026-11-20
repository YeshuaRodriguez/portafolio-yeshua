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
function getConfig() {
    const { RESEND_API_KEY, MAIL_FROM, MAIL_TO } = env;
    const missing = Object.entries({ RESEND_API_KEY, MAIL_FROM, MAIL_TO })
        .filter(([, value]) => !value)
        .map(([key]) => key);
    return { RESEND_API_KEY, MAIL_FROM, MAIL_TO, missing };
}

// Por ahora sin validaciones: el correo del visitante es solo información de contacto
app.post("/api/contact", async (req, res) => {
    const { RESEND_API_KEY, MAIL_FROM, MAIL_TO, missing } = getConfig();
    if (missing.length > 0) {
        console.error(`Missing env vars: ${missing.join(", ")}`);
        return res.status(500).json({ ok: false });
    }

    const { subject = "", name = "", email = "", phone = "", message = "" } = req.body ?? {};

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
