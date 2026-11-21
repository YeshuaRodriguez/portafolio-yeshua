import { motion } from "motion/react"
import { formatCounter } from "./sections"

// Riel derecho (desktop): barra de progreso del scroll, contador de sección
// arriba y "SCROLL ↓" vertical abajo. Espejo del riel izquierdo.
// `ref` (prop en React 19): Layout lo usa para medir el alto del riel.
export default function ScrollProgress({ ref, active, progress }) {
    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="fixed top-1/2 right-(--rail-inset) hidden h-(--rail-h) w-24 -translate-y-1/2 lg:flex"
        >
            <div className="h-full w-1 overflow-hidden rounded-xs bg-page-accent">
                <motion.div className="h-full w-full origin-top rounded-xs bg-red-primary" style={{ scaleY: progress }} />
            </div>
            <div className="ml-5 flex h-full flex-col items-start justify-between">
                <span className="font-akira text-[13px] text-red-primary">{formatCounter(active)}</span>
                <span className="text-[11px] tracking-[0.3em] text-cream/55 [writing-mode:vertical-rl]">SCROLL ↓</span>
            </div>
        </div>
    )
}
