import { useLenis } from "lenis/react"
import { sections, goTo } from "./sections"

// Riel izquierdo (desktop): números de sección y, bajo el activo, su nombre.
// El divisor de 2 px a la derecha es parte del diseño "Rieles simétricos".
export default function QuickNav({ active }) {
    const lenis = useLenis()
    return (
        <nav
            aria-label="Quick navigation"
            className="pointer-events-auto fixed top-1/2 left-(--rail-inset) hidden h-(--rail-h) w-24 -translate-y-1/2 lg:block"
        >
            <ul className="flex h-full flex-col justify-center gap-5.5">
                {sections.map((section, i) => {
                    const on = i + 1 === active
                    return (
                        <li key={section.id}>
                            <button
                                type="button"
                                onClick={() => goTo(section.id, lenis)}
                                aria-current={on ? "location" : undefined}
                                aria-label={`${section.n}. ${section.name}`}
                                className={`flex cursor-pointer flex-col items-start gap-0.75 text-left font-akira text-base transition-colors ${on ? "text-red-primary" : "text-cream/55 hover:text-red-primary"}`}
                            >
                                <span>{section.n}.</span>
                                {on && (
                                    <span className="font-dm-sans text-[10px] font-medium tracking-[0.16em] text-cream">
                                        {section.name}
                                    </span>
                                )}
                            </button>
                        </li>
                    )
                })}
            </ul>
            <div aria-hidden="true" className="absolute top-0 right-0 h-full w-0.5 bg-page-accent" />
        </nav>
    )
}
