import { useLenis } from "lenis/react"
import { sections, goTo, formatCounter } from "./sections"

// Barra fija superior (< lg), diseño "Hero I · Móvil 9:16": números + contador,
// barra segmentada (rojo hasta la sección activa) y nombre/japonés de la activa.
export default function MobileNav({ active }) {
    const lenis = useLenis()
    const current = sections[active - 1]

    return (
        <nav
            aria-label="Quick navigation"
            className="fixed inset-x-0 top-0 z-50 bg-page-bg/90 px-6 pt-2 pb-3 backdrop-blur-md lg:hidden"
        >
            <div className="flex items-center justify-between">
                <ul className="-ml-3 flex">
                    {sections.map((section, i) => {
                        const on = i + 1 === active
                        return (
                            <li key={section.id}>
                                <button
                                    type="button"
                                    onClick={() => goTo(section.id, lenis)}
                                    aria-current={on ? "location" : undefined}
                                    aria-label={`${section.n}. ${section.name}`}
                                    className={`flex h-11 min-w-11 cursor-pointer items-center justify-center font-akira text-base transition-colors ${on ? "text-red-primary" : "text-cream/55"}`}
                                >
                                    {section.n}.
                                </button>
                            </li>
                        )
                    })}
                </ul>
                <span className="font-akira text-xs text-red-primary">{formatCounter(active)}</span>
            </div>

            <div aria-hidden="true" className="mt-1.5 flex flex-col gap-2.5">
                <div className="flex gap-1.25">
                    {sections.map((section, i) => (
                        <div
                            key={section.id}
                            className={`h-1 flex-1 transition-colors duration-300 ${i + 1 <= active ? "bg-red-primary" : "bg-page-accent"}`}
                        />
                    ))}
                </div>
                <div className="flex justify-between text-[11px] tracking-[0.18em]">
                    <span className="text-cream">{current.n}. {current.name}</span>
                    <span className="text-cream/55">{current.jp}</span>
                </div>
            </div>
        </nav>
    )
}
