// Librería de animaciones (motion / Framer Motion).
// Cada función devuelve props para esparcir en un componente `motion.*`:
//
//   import { motion } from "motion/react"
//   import { inUp, fadeIn } from "../animations"
//
//   <motion.h2 {...inUp()}>Hola</motion.h2>
//   <motion.p {...fadeIn({ delay: 0.2 })}>...</motion.p>
//
// Se disparan al entrar en pantalla (whileInView), una sola vez por defecto.
// Opciones comunes: delay (por defecto 0.2 s, para que no salga apenas entra) y duration (segundos), once (false = se repite cada
// vez que entra) y amount (cuánto del elemento debe verse: 0–1 o "some"/"all").

const EASE_OUT = [0.25, 1, 0.5, 1] // ease-out-quart: arranca rápido y frena suave

function reveal(hidden, visible, { delay = 0.2, duration = 0.6, once = true, amount = 0.3 } = {}) {
    return {
        initial: hidden,
        whileInView: visible,
        viewport: { once, amount },
        transition: { duration, delay, ease: EASE_OUT },
    }
}

// Aparece de abajo hacia arriba. `distance` en px.
export const inUp = ({ distance = 32, ...options } = {}) =>
    reveal({ opacity: 0, y: distance }, { opacity: 1, y: 0 }, options)

// Aparece de arriba hacia abajo. `distance` en px.
export const inDown = ({ distance = 32, ...options } = {}) =>
    reveal({ opacity: 0, y: -distance }, { opacity: 1, y: 0 }, options)

// Aparece moviéndose hacia la derecha (entra desde la izquierda). `distance` en px.
export const inRight = ({ distance = 32, ...options } = {}) =>
    reveal({ opacity: 0, x: -distance }, { opacity: 1, x: 0 }, options)

// Aparece suave con un poquito de blur. `blur` en px.
export const fadeIn = ({ blur = 6, duration = 0.8, ...options } = {}) =>
    reveal(
        { opacity: 0, filter: `blur(${blur}px)` },
        { opacity: 1, filter: "blur(0px)" },
        { duration, ...options },
    )
