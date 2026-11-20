const express = require("express");
const { Resend } = require("resend");

const app = express();
const port = 3000;

// Config desde el env (server/.env en local, ver .env.example)
// MAIL_FROM: remitente del dominio verificado en Resend. MAIL_TO: correo que recibe los mensajes
const { RESEND_API_KEY, MAIL_FROM, MAIL_TO } = process.env;

const missing = Object.entries({ RESEND_API_KEY, MAIL_FROM, MAIL_TO })
    .filter(([, value]) => !value)
    .map(([key]) => key);
if (missing.length > 0) {
    console.error(`Missing env vars: ${missing.join(", ")}. Copy server/.env.example to server/.env and fill them in.`);
    process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

app.use(express.json());

// Por ahora sin validaciones: el correo del visitante es solo información de contacto
app.post("/api/contact", async (req, res) => {
    const { subject = "", name = "", email = "", phone = "", message = "" } = req.body ?? {};

    const text = [
        `Nombre: ${name}`,
        `Correo de contacto: ${email}`,
        `Teléfono: ${phone || "-"}`,
        "",
        "Mensaje:",
        message,
    ].join("\n");

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

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
