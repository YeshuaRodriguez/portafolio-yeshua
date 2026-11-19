import logoReact from "../../img/Logos/LogoReact.png"
import logoVite from "../../img/Logos/LogoVite.png"
import logoTailwind from "../../img/Logos/LogoTailwind.png"
import logoNextjs from "../../img/Logos/LogoNextjs.png"
import logoJs from "../../img/Logos/LogoJs.png"
import logoHtml from "../../img/Logos/LogoHtml.png"
import logoCss from "../../img/Logos/LogoCss.png"
import logoMotion from "../../img/Logos/LogoMotion.png"
import logoNodejs from "../../img/Logos/LogoNodejs.png"
import logoExpress from "../../img/Logos/LogoExpress.png"
import logoPostgres from "../../img/Logos/LogoPostgres.png"
import logoMysql from "../../img/Logos/LogoMysql.png"
import logoJson from "../../img/Logos/LogoJson.png"
import logoAws from "../../img/Logos/LogoAws.png"
import logoCloudflare from "../../img/Logos/LogoCloudflare.png"
import logoRender from "../../img/Logos/LogoRender.png"
import logoAuth0 from "../../img/Logos/LogoAuth0.png"
import logoGithub from "../../img/Logos/LogoGithub.png"
import logoGit from "../../img/Logos/LogoGit.png"
import logoDocker from "../../img/Logos/LogoDocker.png"
import logoExpo from "../../img/Logos/LogoExpo.png"
import logoElectron from "../../img/Logos/LogoElectron.png"

import { Brackets } from "lucide-react"
import { CodeXml } from "lucide-react"
import { Database } from "lucide-react"
import { Cloud } from "lucide-react"
import { Wrench } from "lucide-react"
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
  },
]

function TechItem({ tech }) {
  const fallback = tech.name.slice(0, 2).toUpperCase()

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:bg-white/10">
      <div className="flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-xl">
        {tech.src ? (
          <img
            src={tech.src}
            alt={tech.name}
            className="h-full w-full object-contain p-2"
            loading="lazy"
          />
        ) : (
          <span className="text-[0.7rem] font-bold tracking-[0.2em] text-white/70">
            {fallback}
          </span>
        )}
      </div>
      <span className="text-lg font-light text-white/90 tracking-wider">{tech.name}</span>
    </li>
  )
}

function StackBlock({ title, techs, img }) {
  return (
    <article className="rounded-[1.75rem] p-5">
      <div className="mb-4 flex items-center gap-3">
        {img ? <span className="text-white/80">{img}</span> : null}
        <h2 className="text-lg font-semibold uppercase tracking-[0.25em] text-/80">
          {title}
        </h2>
      </div>
      <ul className="grid gap-3">
        {techs.map((tech) => (
          <TechItem key={tech.name} tech={tech} />
        ))}
      </ul>
    </article>
  )
}

export default function MyCurrentStack() {
  return (
    <section className="mx-auto w-full max-w-7xl py-12">
      <div className="mb-8 ">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl flex flex-col justify-center font-dm-sans tracking-widest">
          MY CURRENT <span className="text-red-primary text-7xl font-akira">STACK</span>
        </h1>
        <p className="mt-3 text-sm font-medium text-white/60 font-dm-sans tracking-wider">
          Tech stack by category
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stacks.map((stack) => (
          <StackBlock key={stack.title} title={stack.title} techs={stack.techs} img={stack.img}/>
        ))}
      </div>
    </section>
  )
}

