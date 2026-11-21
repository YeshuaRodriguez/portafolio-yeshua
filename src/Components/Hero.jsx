import { useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'motion/react'
import HeroBg from "../../assets/img/hero/HEROBG.webp"
import PanelsBg from "../../assets/img/hero/PANELSBG.webp"
import HeroTitle from "../../assets/img/hero/HEROTITLE.webp"
import HeroProfile from "../../assets/img/hero/HEROPROFILE.webp"
import HeroNoise from "../../assets/img/hero/HERONOISE.webp"


function HeroLayer({ src, zIndex, strength, mouseX, mouseY, className }) {
  const x = useTransform(mouseX, (value) => value * -strength)
  const y = useTransform(mouseY, (value) => value * -strength)

  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden="true"
      draggable="false"
      className={className}
      style={{ x, y, zIndex }}
    />
  )
}

export default function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handlePointerMove = (event) => {
      mouseX.set(event.clientX / window.innerWidth - 0.5)
      mouseY.set(event.clientY / window.innerHeight - 0.5)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [mouseX, mouseY])

  const layers = [
    { src: HeroBg, zIndex: 0, strength: 24, className: 'absolute inset-0 h-full w-full object-cover scale-110', alt: 'Hero background' },
    { src: PanelsBg, zIndex: 1, strength: 18, className: 'absolute inset-0 h-full w-full object-contain', alt: 'Hero panels' },
    { src: HeroTitle, zIndex: 2, strength: 14, className: 'absolute inset-0 h-full w-full object-contain -translate-y-[18%] scale-90 lg:-translate-y-27', alt: 'Hero title' },
    { src: HeroProfile, zIndex: 3, strength: 8, className: 'absolute inset-0 h-full w-full scale-[1.2] object-contain', alt: 'Hero profile' },
    { src: HeroNoise, zIndex: 4, strength: 4, className: 'absolute inset-0 h-full w-full object-cover opacity-70 mix-blend-screen', alt: 'Hero noise' },
  ]

  return (
    // Móvil: imagen 16:10 centrada + línea inferior (diseño "Móvil 9:16").
    // Desktop: imagen 16:10 centrada en pantalla, del mismo alto que los rieles (--rail-h).
    <section className="mx-auto flex min-h-[calc(100svh-8.5rem)] w-full max-w-7xl flex-col items-center justify-center lg:min-h-[calc(100vh-3rem)]">
      <div className="flex w-full flex-1 items-center justify-center">
      <div
        className="relative isolate aspect-[16/10] w-full overflow-hidden rounded-2xl bg-page-bg lg:max-w-[calc(var(--rail-h)*1.6)] lg:rounded-[22px]"
      >
        {layers.map((layer) => {
          return (
            <HeroLayer
              key={layer.alt}
              src={layer.src}
              mouseX={mouseX}
              mouseY={mouseY}
              strength={layer.strength}
              className={layer.className}
              zIndex={layer.zIndex}
            />
          )
        })}
      </div>
      </div>
      <div className="flex w-full justify-between text-[11px] tracking-[0.22em] text-cream/55 lg:hidden">
        <span>WEB DEVELOPER · 2026</span>
        <span aria-hidden="true">SCROLL ↓</span>
      </div>
    </section>
  )
}
