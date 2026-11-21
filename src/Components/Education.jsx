import { animate, motion, useMotionValue, useMotionValueEvent } from "motion/react"
import { inUp, inDown, fadeIn } from "../animations"

import { useRef, useState } from "react"

const stateClasses = {
    active: "bg-active",
    inactive: "bg-inactive",
    inProgress: "bg-inProgress",
}

// Timeline: la línea se dibuja de arriba hacia abajo (progress 0 → 1 = scaleY) y
// cada rombo aparece justo cuando la línea llega a su altura. La altura se mide
// al arrancar, así funciona igual con las secciones abiertas o cerradas.
const LINE_DURATION = 1.3

function TimelineDiamond({ progress, containerRef }) {
    const ref = useRef(null)
    const [shown, setShown] = useState(false)

    useMotionValueEvent(progress, "change", (p) => {
        if (shown || !ref.current || !containerRef.current) return
        const c = containerRef.current.getBoundingClientRect()
        const d = ref.current.getBoundingClientRect()
        if (p >= (d.top + d.height / 2 - c.top) / c.height) setShown(true)
    })

    return (
        <motion.span
            ref={ref}
            aria-hidden="true"
            className="absolute -left-[46px] top-5 h-[18px] w-[18px] rotate-45 border-[3px] border-page-bg bg-red-primary"
            initial={{ opacity: 0, scale: 0 }}
            animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
        />
    )
}

function CurrentState({ state }) {
    return <div className={`h-3 w-3 rounded-xl ${stateClasses[state] ?? stateClasses.inactive}`} />
}

const sections = {
    certification: { title: "CERTIFICATIONS" },
    course: { title: "COURSES" },
    future: { title: "FUTURE PLANS" },
}

const education = [
    { type: "course", name: "Desarrollo Web Completo HTML5, CSS, JS, AJAX, PHP, MySQL", issuer: "Udemy", status: "active" },
    { type: "course", name: "Unity y C# Fundamental", issuer: "Udemy", status: "active" },
    { type: "course", name: "Preparación AWS Certified Cloud Practitioner CLF-C02", issuer: "Udemy", status: "active" },
    { type: "course", name: "JavaScript Essentials", issuer: "NETACAD", status: "active" },
    { type: "course", name: "Introduction to CyberSecurity", issuer: "NETACAD", link: "https://drive.google.com/file/d/1A7Yt0UYCkCXiRacZujsAfrVAA_nsxNHW/view?usp=sharing", status: "active" },
    { type: "course", name: "Defensa de la red", issuer: "NETACAD", link: "https://drive.google.com/file/d/1AqLFbUuKrK_FPgJFFT7TinNTk_2BNn6l/view?usp=sharing", status: "active" },
    { type: "course", name: "Launching a Business Venture", issuer: "NETACAD", link:"https://drive.google.com/file/d/1TV5sqgcvZpJ_ZhjAaXMqdCHqwhxMmlMj/view?usp=sharing", status: "active" },
    { type: "course", name: "Claude 101", issuer: "Claude Academy", link: "https://drive.google.com/file/d/1jqvv4bu3wcz065RahGdRF8ZnjblfV6Tf/view?usp=sharing", status: "active" },
    { type: "course", name: "AI Fluency: Framework and Foundations", issuer: "Claude Academy", link: "https://drive.google.com/file/d/1jUocyCjM9Lc65eiVMj2RFN10-mgCaWm6/view?usp=sharing", status: "active" },
    { type: "course", name: "AI Capabilities and Limitations", issuer: "Claude Academy", link: "https://drive.google.com/file/d/1WLAtUp-5bp0bbaCcklEXQB8d26Dan-yK/view?usp=sharing", status: "active" },
    { type: "course", name: "Claude Code 101", issuer: "Claude Academy", status: "active" },
    { type: "course", name: "Claude Code in Action", issuer: "Claude Academy", status: "active" },
    { type: "course", name: "Introduction to Agent Skills", issuer: "Claude Academy", status: "active" },
    { type: "course", name: "Introduction to Model Context Protocol", issuer: "Claude Academy", status: "active" },
    { type: "course", name: "Curso de Docker", issuer: "Edutin", status: "active" },
    { type: "course", name: "Herdr: domina la terminal y tus agentes", issuer: "Hola Mundo", link: "https://drive.google.com/file/d/1kRsRfGCW5nVU8gK3QwsPgFvM2zpVZ75o/view?usp=sharing", status: "active" },
    { type: "certification", name: "AWS Cloud Practitioner (examen programado próximamente)", issuer: "Amazon Web Services", status: "inProgress" },
    { type: "future", name: "GitHub Essentials", issuer: "GitHub", status: "inactive" },
    { type: "future", name: "AWS Certified AI Practitioner", issuer: "Amazon Web Services", status: "inactive" },
    { type: "future", name: "AWS Certified Solutions Architect Associate", issuer: "Amazon Web Services", status: "inactive" },
    { type: "future", name: "AWS Certified Developer Associate", issuer: "Amazon Web Services", status: "inactive" },
    { type: "future", name: "AWS Certified Generative AI Developer", issuer: "Amazon Web Services", status: "inactive" },
]

function Education() {

    const [closed, setClosed] = useState({})
    const timelineRef = useRef(null)
    const lineProgress = useMotionValue(0)

    const drawTimeline = () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        animate(lineProgress, 1, { duration: reduce ? 0 : LINE_DURATION, delay: reduce ? 0 : 0.2, ease: "easeInOut" })
    }

    const toggle = (type) => setClosed((prev) => ({ ...prev, [type]: !prev[type] }))

    return (

        <section id="education" className="mx-auto flex w-full max-w-6xl scroll-mt-10 flex-col gap-12 lg:flex-row lg:gap-16">

            <div className="flex w-full shrink-0 flex-col gap-3.5 lg:w-[340px]">
                <motion.h2 className="font-akira text-[34px] font-black tracking-wide" {...inUp()}>EDUCATION</motion.h2>
                <motion.p className="text-sm tracking-widest text-red-primary" {...inDown()}>3. 私の教育</motion.p>
                <hr className="my-2.5 h-0.5 w-16 border-0 bg-cream" />
                <motion.p className="text-[17px] leading-snug tracking-wider" {...fadeIn()}>COMPUTER SCIENCE ENGINEERING DEGREE</motion.p>
                <motion.p className="text-[13px] italic text-cream/70" {...fadeIn({ delay: 0.35 })}>Universidad Católica de Honduras - 2026</motion.p>
            </div>

            {/* pl-[38px] = antes pl-9 + border-l-2: la línea ahora es un div aparte para poder animarla */}
            <motion.div
                ref={timelineRef}
                className="relative flex min-w-0 flex-1 flex-col gap-3 pl-[38px]"
                viewport={{ once: true, amount: 0.2 }}
                onViewportEnter={drawTimeline}
            >
                <motion.div
                    aria-hidden="true"
                    className="absolute top-0 left-0 h-full w-0.5 origin-top bg-cream"
                    style={{ scaleY: lineProgress }}
                />
                {Object.entries(sections).map(([type, { title }]) => {
                    const items = education.filter((item) => item.type === type)
                    const isOpen = !closed[type]

                    return (
                        <div key={type} className="relative">
                            <TimelineDiamond progress={lineProgress} containerRef={timelineRef} />

                            <button
                                type="button"
                                onClick={() => toggle(type)}
                                aria-expanded={isOpen}
                                className="flex w-full cursor-pointer items-center gap-4 border-b border-cream/30 py-3.5 text-left"
                            >
                                <span className="flex-1 font-akira text-[19px] font-black">{title}</span>
                                <span className="text-[13px] text-cream/50">{String(items.length).padStart(2, "0")}</span>
                                <span className="w-[22px] text-right text-[22px]" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                            </button>

                            {isOpen && (
                                <ul className="flex flex-col gap-0.5 pb-3.5 pt-2 text-start">
                                    {/* Cascada: cada registro entra 0.1 s después del anterior (y otra vez al reabrir la sección) */}
                                    {items.map((item, i) => (
                                        <motion.li key={item.name} className="flex items-center gap-2 py-1.5" {...inDown({ delay: 0.1 * (i + 1) })}>
                                            <CurrentState state={item.status} />
                                            <span>
                                                {item.link
                                                    ? <a href={item.link} target="_blank" rel="noopener noreferrer" className="underline decoration-cream/30 underline-offset-4 transition-colors hover:text-red-primary">{item.name}</a>
                                                    : item.name} | <span className="font-light text-cream/30">{item.issuer}{item.year ? ` - ${item.year}` : ""}</span>
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )
                })}
            </motion.div>

        </section>

    )

} export default Education
