import { ArrowRight } from "lucide-react"

const fields = [
    { id: "subject", label: "SUBJECT", type: "text", placeholder: "What is this about?", help: "Required · 3 to 80 characters", required: true },
    { id: "name", label: "NAME", type: "text", placeholder: "Your name", help: "Required · 2 to 60 characters", required: true, autoComplete: "name" },
    { id: "email", label: "EMAIL", type: "email", placeholder: "you@email.com", help: "Required · valid email, up to 100 characters", required: true, autoComplete: "email" },
    { id: "phone", label: "PHONE", type: "tel", placeholder: "+504 0000-0000", help: "Optional · digits only, 8 to 15 characters", required: false, autoComplete: "tel" },
    { id: "message", label: "MESSAGE", type: "textarea", placeholder: "Tell me about your project...", help: "Required · 20 to 1000 characters", required: true },
]

const controlClass =
    "w-full rounded-[10px] border-2 border-white bg-white/5 px-4 py-3.5 text-base text-white placeholder:text-white/40 focus:outline-2 focus:outline-offset-2 focus:outline-red-primary"

function RequiredMark() {
    return (
        <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -mt-[15px] fill-red-primary">
            <path d="M12 0 L14.2 8.2 L22.4 5.6 L16.6 12 L22.4 18.4 L14.2 15.8 L12 24 L9.8 15.8 L1.6 18.4 L7.4 12 L1.6 5.6 L9.8 8.2 Z" />
        </svg>
    )
}

function Field({ field }) {
    const { id, label, type, placeholder, help, required, autoComplete } = field
    const isTextarea = type === "textarea"

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-xs tracking-[0.14em]">
                {label} {!required && <span className="tracking-wider text-white/40">(OPTIONAL)</span>}
            </label>
            <div className="relative">
                {isTextarea ? (
                    <textarea id={id} name={id} rows={4} placeholder={placeholder} className={`${controlClass} block resize-none ${required ? "pr-14" : ""}`} />
                ) : (
                    <input id={id} name={id} type={type} placeholder={placeholder} autoComplete={autoComplete} className={`${controlClass} ${required ? "pr-14" : ""}`} />
                )}
                {required && <RequiredMark />}
            </div>
            <span className="text-xs italic text-white/40">{help}</span>
        </div>
    )
}

export default function Contact() {
    // Solo frontend por ahora: el envío (Resend) y las validaciones se agregan después
    const handleSubmit = (event) => event.preventDefault()

    return (
        <section id="contact" className="relative mx-auto w-full max-w-7xl scroll-mt-10 py-20">
            <div className="relative flex flex-col gap-12 lg:flex-row lg:gap-20">

                <div className="flex min-w-0 flex-1 flex-col justify-center gap-7">
                    <p className="text-sm tracking-widest text-red-primary">5. 連絡</p>
                    <h2 className="flex flex-col leading-[0.95]">
                        <span className="font-dm-sans text-6xl font-bold tracking-tighter sm:text-8xl lg:text-[110px] xl:text-[124px]">CONTACT</span>
                        <span className="mt-3 font-akira text-7xl font-black text-red-primary sm:text-9xl lg:text-[120px] xl:text-[150px]">ME</span>
                    </h2>
                    <p className="max-w-[420px] text-xl leading-normal text-white/70">
                        Got an idea, a project or just want to say hi? Send me a message and let's turn it into something real.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex w-full shrink-0 flex-col justify-center gap-5 lg:w-[520px] xl:w-[560px]">
                    {fields.map((field) => (
                        <Field key={field.id} field={field} />
                    ))}

                    <button
                        type="submit"
                        className="flex w-fit cursor-pointer items-center gap-3.5 rounded-[10px] border-2 border-red-primary bg-red-primary px-9 py-4 font-akira text-[15px] tracking-widest text-page-bg transition-opacity hover:opacity-90"
                    >
                        SEND <ArrowRight size={18} aria-hidden="true" />
                    </button>
                </form>

            </div>
        </section>
    )
}
