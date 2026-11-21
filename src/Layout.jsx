import { useRef, useState } from "react"
import { Outlet } from "react-router-dom"
import { motion, useMotionValue, useMotionValueEvent, useScroll } from "motion/react"
import QuickNav from "./Components/nav/QuickNav"
import ScrollProgress from "./Components/nav/ScrollProgress"
import MobileNav from "./Components/nav/MobileNav"
import { getActiveSection } from "./Components/nav/sections"

// Rieles simétricos: QuickNav (izq.) y ScrollProgress (der.) fijos y centrados
// en la pantalla en desktop; MobileNav arriba en < lg. Posiciones en index.css
// (--rail-inset, --rail-clear, --rail-h).
export default function Layout() {
  const { scrollY, scrollYProgress } = useScroll()
  const [active, setActive] = useState(1)
  // Contact es full-bleed y más ancho que el hueco entre rieles: cuando su borde
  // superior llega al borde inferior de los rieles, la página los empuja hacia
  // arriba (como un sticky que termina) para que no tapen título ni formulario.
  const railShift = useMotionValue(0)
  const railRef = useRef(null)

  // Arranca en 1 (Hero). Si el navegador restaura el scroll al recargar,
  // eso dispara un "change" y se corrige solo.
  useMotionValueEvent(scrollY, "change", () => {
    setActive(getActiveSection())

    const contactTop = document.getElementById("contact")?.getBoundingClientRect().top ?? Infinity
    const railBottom = window.innerHeight / 2 + (railRef.current?.offsetHeight ?? 0) / 2
    railShift.set(Math.min(0, contactTop - railBottom - 40)) // 40 px de aire
  })

  return (
    <>
      <MobileNav active={active} />
      <motion.div className="pointer-events-none fixed inset-0 z-40 hidden lg:block" style={{ y: railShift }}>
        <QuickNav active={active} />
        <ScrollProgress ref={railRef} active={active} progress={scrollYProgress} />
      </motion.div>

      <Outlet />
    </>
  )
}
