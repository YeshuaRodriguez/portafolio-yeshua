import { motion } from "motion/react"
import { inUp, inDown, inRight, fadeIn } from "../animations"
import logoReact from "../../assets/img/Logos/LogoReact.webp"
import logoVite from "../../assets/img/Logos/LogoVite.webp"
import logoTailwind from "../../assets/img/Logos/LogoTailwind.webp"
import logoNextjs from "../../assets/img/Logos/LogoNextjs.webp"
import logoJs from "../../assets/img/Logos/LogoJs.webp"
import logoHtml from "../../assets/img/Logos/LogoHtml.webp"
import logoCss from "../../assets/img/Logos/LogoCss.webp"
import logoMotion from "../../assets/img/Logos/LogoMotion.webp"
import logoNodejs from "../../assets/img/Logos/LogoNodejs.webp"
import logoExpress from "../../assets/img/Logos/LogoExpress.webp"
import logoPostgres from "../../assets/img/Logos/LogoPostgres.webp"
import logoMysql from "../../assets/img/Logos/LogoMysql.webp"
import logoJson from "../../assets/img/Logos/LogoJson.webp"
import logoAws from "../../assets/img/Logos/LogoAws.webp"
import logoCloudflare from "../../assets/img/Logos/LogoCloudflare.webp"
import logoRender from "../../assets/img/Logos/LogoRender.webp"
import logoAuth0 from "../../assets/img/Logos/LogoAuth0.webp"
import logoGithub from "../../assets/img/Logos/LogoGithub.webp"
import logoGit from "../../assets/img/Logos/LogoGit.webp"
import logoDocker from "../../assets/img/Logos/LogoDocker.webp"
import logoExpo from "../../assets/img/Logos/LogoExpo.webp"
import logoElectron from "../../assets/img/Logos/LogoElectron.webp"
import logoClaude from "../../assets/img/Logos/LogoClaudecode.webp"
import logoCodex from "../../assets/img/Logos/LogoCodex.webp"
import logoDb2 from "../../assets/img/Logos/LogoDb2.webp"

import { Brackets } from "lucide-react"
import { CodeXml } from "lucide-react"
import { Database } from "lucide-react"
import { Cloud } from "lucide-react"
import { Wrench } from "lucide-react"
import { BotMessageSquare } from "lucide-react"
import { MonitorSmartphone } from "lucide-react"

const stacks = [
  {
    title: "Frontend",
    img: <CodeXml/>,
    techs: [
      { name: "React", src: logoReact },
      { name: "Vite", src: logoVite },
      { name: "Tailwind", src: logoTailwind },
      { name: "Next.js", src: logoNextjs },
      { name: "JavaScript", src: logoJs },
      { name: "HTML", src: logoHtml },
      { name: "CSS", src: logoCss },
      { name: "Framer Motion", src: logoMotion },
    ],
  },
  {
    title: "Backend",
    img: <Brackets/>,
    techs: [
      { name: "Node.js", src: logoNodejs },
      { name: "Express", src: logoExpress },
    ],
  },
  {
    title: "Database",
    img: <Database/>,
    techs: [
      { name: "PostgreSQL", src: logoPostgres },
      { name: "MySQL", src: logoMysql },
      { name: "JSON", src: logoJson },
      { name: "DB2", src: logoDb2 },
    ],
  },
  {
    title: "Cloud",
    img: <Cloud/>,
    techs: [
      { name: "AWS", src: logoAws },
      { name: "Cloudflare", src: logoCloudflare },
      { name: "Render", src: logoRender },
    ],
  },
  {
    title: "More Tools",
    img: <Wrench/>,
    techs: [
      { name: "Auth0", src: logoAuth0 },
      { name: "GitHub", src: logoGithub },
      { name: "Git", src: logoGit },
      { name: "Docker", src: logoDocker },
    ],
  },
  {
    title: "Mobile/Desktop",
    img: <MonitorSmartphone/>,
    techs: [
      { name: "Expo", src: logoExpo },
      { name: "Electron", src: logoElectron },
    ],
  },  {
    title: "AI Agents",
    img: <BotMessageSquare/>,
    techs: [
      { name: "Claude Code", src: logoClaude },
      { name: "Codex", src: logoCodex },
    ],
  },
]

// Hover: el logo crece un poco con un rebote suave (solo con mouse; con reduced motion no se mueve).
const logoHover = {
  hover: { scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 15 } },
}

// delay: cascada dentro de cada tarjeta (cada tecnología entra 0.1 s después de la anterior)
function TechItem({ tech, delay }) {
  const fallback = tech.name.slice(0, 2).toUpperCase()

  return (
    <motion.li
      className="flex items-center gap-3 rounded-2xl border border-cream/10 bg-cream/5 px-3 py-2 transition-colors hover:bg-cream/10"
      {...inUp({ distance: 16, delay })}
      whileHover="hover"
    >
      <motion.div variants={logoHover} className="flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-xl">
        {tech.src ? (
          <img
            src={tech.src}
            alt={tech.name}
            className="h-full w-full object-contain p-2"
            loading="lazy"
          />
        ) : (
          <span className="text-[0.7rem] font-bold tracking-[0.2em] text-cream/70">
            {fallback}
          </span>
        )}
      </motion.div>
      <span className="text-lg font-light text-cream/90 tracking-wider">{tech.name}</span>
    </motion.li>
  )
}

function StackBlock({ title, techs, img }) {
  return (
    <article className="rounded-[1.75rem] p-5">
      <motion.div className="mb-4 flex items-center gap-3" {...inRight()}>
        {img ? <span className="text-cream/80">{img}</span> : null}
        <h2 className="text-lg font-semibold uppercase tracking-[0.25em] text-cream/80">
          {title}
        </h2>
      </motion.div>
      <ul className="grid gap-3">
        {techs.map((tech, i) => (
          <TechItem key={tech.name} tech={tech} delay={0.1 * (i + 1)} />
        ))}
      </ul>
    </article>
  )
}

export default function MyCurrentStack() {
  return (
    <section id="stack" className="mx-auto w-full max-w-7xl scroll-mt-10 py-12">
      <div className="mb-8 ">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl flex flex-col justify-center font-dm-sans tracking-widest">
          <motion.span {...inUp()}>MY CURRENT</motion.span>
          <motion.span className="text-red-primary text-7xl font-akira" {...inDown()}>STACK</motion.span>
        </h1>
        <motion.p className="mt-3 text-sm font-medium text-cream/60 font-dm-sans tracking-wider" {...fadeIn()}>
          Tech stack by category
        </motion.p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stacks.map((stack) => (
          <StackBlock key={stack.title} title={stack.title} techs={stack.techs} img={stack.img}/>
        ))}
      </div>
    </section>
  )
}

