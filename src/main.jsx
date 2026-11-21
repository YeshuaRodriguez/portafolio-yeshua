import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactLenis } from 'lenis/react'
import { MotionConfig } from 'motion/react'
import 'lenis/dist/lenis.css'
import './index.css'
import Router from './Router.jsx'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Lenis: smooth scroll de toda la página. Con reduced motion, scroll nativo. */}
    <ReactLenis root options={{ autoRaf: true, smoothWheel: !prefersReducedMotion }} />
    {/* reducedMotion="user": con reduced motion, motion quita los desplazamientos y deja solo la opacidad */}
    <MotionConfig reducedMotion="user">
      <Router />
    </MotionConfig>
  </StrictMode>,
)
