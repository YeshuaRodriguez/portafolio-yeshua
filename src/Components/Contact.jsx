import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import inkSwirl from "../../assets/img/hero/remolino-tinta.webp"

// Las reglas (minLength/maxLength/pattern) son las mismas que valida server/app.js con Valibot
const fields = [
    { id: "subject", label: "SUBJECT", type: "text", placeholder: "What is this about?", help: "Required · 3 to 80 characters", required: true, minLength: 3, maxLength: 80 },
    { id: "name", label: "NAME", type: "text", placeholder: "Your name", help: "Required · 2 to 60 characters", required: true, minLength: 2, maxLength: 60, autoComplete: "name" },
    { id: "email", label: "EMAIL", type: "email", placeholder: "you@email.com", help: "Required · valid email, up to 100 characters", required: true, maxLength: 100, autoComplete: "email" },
    // Acepta espacios, guiones, paréntesis y un + inicial; el server los quita y exige 8 a 15 dígitos.
    // Los navegadores compilan `pattern` con el flag `v`: ( ) y - dentro de [] deben ir escapados
    { id: "phone", label: "PHONE", type: "tel", placeholder: "+504 0000-0000", help: "Optional · digits only, 8 to 15 characters", required: false, maxLength: 25, pattern: "\\+?[\\d\\s\\(\\)\\-]{8,24}", autoComplete: "tel" },
    { id: "message", label: "MESSAGE", type: "textarea", placeholder: "Tell me about your project...", help: "Required · 20 to 1000 characters", required: true, minLength: 20, maxLength: 1000 },
]

const controlClass =
    "w-full rounded-[10px] border-2 border-cream bg-cream/5 px-4 py-3.5 text-base text-cream placeholder:text-cream/40 focus:outline-2 focus:outline-offset-2 focus:outline-red-primary"

function RequiredMark() {
    return (
        <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -mt-[15px] fill-red-primary animate-spin">
            <path d="M12 0 L14.2 8.2 L22.4 5.6 L16.6 12 L22.4 18.4 L14.2 15.8 L12 24 L9.8 15.8 L1.6 18.4 L7.4 12 L1.6 5.6 L9.8 8.2 Z" />
        </svg>
    )
}

function Field({ field }) {
    const { id, label, type, placeholder, help, required, autoComplete, minLength, maxLength, pattern } = field
    const isTextarea = type === "textarea"
    const rules = { required, minLength, maxLength }

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-xs tracking-[0.14em]">
                {label} {!required && <span className="tracking-wider text-cream/40">(OPTIONAL)</span>}
            </label>
            <div className="relative">
                {isTextarea ? (
                    <textarea id={id} name={id} rows={4} placeholder={placeholder} {...rules} className={`${controlClass} block resize-none ${required ? "pr-14" : ""}`} />
                ) : (
                    <input id={id} name={id} type={type} placeholder={placeholder} autoComplete={autoComplete} {...rules} pattern={pattern} className={`${controlClass} ${required ? "pr-14" : ""}`} />
                )}
                {required && <RequiredMark />}
            </div>
            <span className="text-xs italic text-cream/40">{help}</span>
        </div>
    )
}

const statusMessages = {
    sent: { text: "Message sent. Thanks!", className: "text-cream" },
    captcha: { text: "Please complete the verification and try again.", className: "text-red-primary" },
    invalid: { text: "Please check the fields and try again.", className: "text-red-primary" },
    limit: { text: "Too many messages today. Please try again tomorrow.", className: "text-red-primary" },
    error: { text: "Something went wrong, try again.", className: "text-red-primary" },
}

// Cloudflare Turnstile. En dev se usa la site key de prueba (siempre aprueba, funciona en localhost);
// la de producción es pública y solo es válida en los hostnames configurados en el widget.
const TURNSTILE_SITE_KEY = import.meta.env.DEV ? "1x00000000000000000000AA" : "0x4AAAAAAGJ1pj4SJxxq5Lt-"
const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad"

let turnstilePromise = null

// Carga el script de Turnstile una sola vez y resuelve con window.turnstile
function loadTurnstile() {
    if (window.turnstile) return Promise.resolve(window.turnstile)
    if (!turnstilePromise) {
        turnstilePromise = new Promise((resolve, reject) => {
            window.onTurnstileLoad = () => resolve(window.turnstile)
            const script = document.createElement("script")
            script.src = TURNSTILE_SCRIPT
            script.async = true
            script.onerror = () => {
                turnstilePromise = null
                reject(new Error("Turnstile failed to load"))
            }
            document.head.appendChild(script)
        })
    }
    return turnstilePromise
}

// El widget mete un input oculto `cf-turnstile-response` en el form, así que el token
// viaja solo con el FormData. Devuelve reset() para pedir un token nuevo tras cada envío.
function useTurnstile(containerRef) {
    const widgetIdRef = useRef(null)

    useEffect(() => {
        let cancelled = false

        loadTurnstile()
            .then((turnstile) => {
                if (cancelled || !containerRef.current) return
                widgetIdRef.current = turnstile.render(containerRef.current, {
                    sitekey: TURNSTILE_SITE_KEY,
                    theme: "dark",
                    size: "flexible",
                })
            })
            .catch((error) => console.error(error))

        return () => {
            cancelled = true
            if (widgetIdRef.current !== null) window.turnstile?.remove(widgetIdRef.current)
            widgetIdRef.current = null
        }
    }, [containerRef])

    return () => {
        if (widgetIdRef.current !== null) window.turnstile?.reset(widgetIdRef.current)
    }
}

export default function Contact() {
    // idle | sending | sent | captcha | invalid | limit | error
    const [status, setStatus] = useState("idle")
    const turnstileRef = useRef(null)
    const resetTurnstile = useTurnstile(turnstileRef)
    // Momento en que se mostró el formulario: el server descarta envíos hechos en menos de 3 s
    const startedAtRef = useRef(0)

    useEffect(() => {
        startedAtRef.current = Date.now()
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        const form = event.currentTarget
        const data = Object.fromEntries(new FormData(form))
        data.elapsedMs = Date.now() - startedAtRef.current

        if (!data["cf-turnstile-response"]) {
            setStatus("captcha")
            return
        }

        setStatus("sending")

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            const result = await response.json().catch(() => ({}))
            if (!response.ok) {
                setStatus(statusMessages[result.error] ? result.error : "error")
                return
            }
            form.reset()
            startedAtRef.current = Date.now()
            setStatus("sent")
        } catch {
            setStatus("error")
        } finally {
            // Cada token sirve una sola vez: pedir uno nuevo para el próximo envío
            resetTurnstile()
        }
    }

    const isSending = status === "sending"
    const statusMessage = statusMessages[status]

    return (
        <section id="contact" className="relative -mx-4 scroll-mt-10 overflow-hidden py-20 sm:-mx-6 lg:-mx-8">
            <img
                src={inkSwirl}
                alt=""
                aria-hidden="true"
                draggable="false"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-5"
            />

            <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:flex-row lg:gap-20 lg:px-8">

                <div className="flex min-w-0 flex-1 flex-col justify-center gap-7">
                    <p className="text-sm tracking-widest text-red-primary">5. 連絡</p>
                    <h2 className="flex flex-col leading-[0.95]">
                        <span className="font-dm-sans text-6xl font-bold tracking-tighter sm:text-8xl lg:text-[110px] xl:text-[124px]">CONTACT</span>
                        <span className="mt-3 font-akira text-7xl font-black text-red-primary sm:text-9xl lg:text-[120px] xl:text-[150px]">ME</span>
                    </h2>
                    <p className="max-w-[420px] text-xl leading-normal text-cream/70">
                        Got an idea, a project or just want to say hi? Send me a message and let's turn it into something real.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex w-full shrink-0 flex-col justify-center gap-5 lg:w-[520px] xl:w-[560px]">
                    {fields.map((field) => (
                        <Field key={field.id} field={field} />
                    ))}

                    {/* Honeypot: invisible para personas; si un bot lo llena, el server finge éxito y no envía */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                        <label htmlFor="website">Website</label>
                        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                    </div>

                    <div ref={turnstileRef} className="min-h-[65px] w-full" />

                    <button
                        type="submit"
                        disabled={isSending}
                        className="flex w-fit cursor-pointer items-center gap-3.5 rounded-[10px] border-2 border-red-primary bg-red-primary px-9 py-4 font-akira text-[15px] tracking-widest text-page-bg transition-opacity hover:opacity-90 hover:animate-pulse disabled:cursor-wait disabled:opacity-60 disabled:hover:animate-none"
                    >
                        {isSending ? "SENDING..." : "SEND"} <ArrowRight size={18} aria-hidden="true" />
                    </button>

                    <p role="status" aria-live="polite" className={`min-h-5 text-sm tracking-wider ${statusMessage?.className ?? ""}`}>
                        {statusMessage?.text ?? ""}
                    </p>
                </form>

            </div>
        </section>
    )
}
