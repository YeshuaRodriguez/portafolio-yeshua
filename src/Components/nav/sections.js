// Secciones que recorren los rieles (QuickNav, ScrollProgress y MobileNav).
// Cada `id` tiene que existir como id de la sección en App.
export const sections = [
    { n: "1", id: "about", name: "ABOUT", jp: "について" },
    { n: "2", id: "stack", name: "STACK", jp: "技術" },
    { n: "3", id: "education", name: "EDUCATION", jp: "私の教育" },
    { n: "4", id: "projects", name: "PROJECTS", jp: "作品" },
    { n: "5", id: "contact", name: "CONTACT", jp: "連絡" },
]

export const formatCounter = (active) => `0${active} / 0${sections.length}`

// Salta a una sección con Lenis (respeta scroll-margin/scroll-padding);
// si Lenis aún no existe, cae al scroll nativo. Con reduced motion, sin animación.
export function goTo(id, lenis) {
    const el = document.getElementById(id)
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (lenis) lenis.scrollTo(el, { immediate: reduce })
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
}

// Sección activa: la última cuyo borde superior pasó la mitad de la pantalla.
// Mientras se ve el Hero queda la 1 (igual que en el diseño). Al llegar al
// fondo de la página se activa la última, aunque no alcance la mitad.
export function getActiveSection() {
    const mid = window.innerHeight / 2
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
    if (atBottom) return sections.length

    let active = 1
    sections.forEach((section, i) => {
        const el = document.getElementById(section.id)
        if (el && el.getBoundingClientRect().top <= mid) active = i + 1
    })
    return active
}
