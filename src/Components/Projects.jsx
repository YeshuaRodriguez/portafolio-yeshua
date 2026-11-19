import { useState } from "react"
import { Plus, Minus, ArrowUpRight } from "lucide-react"
import SectionTitle from "./ui/titles/SectionTitle"
import TechChip from "./ui/chips/TechChip"
import Tooltip from "./ui/Tooltip"

// image: import de la captura (o null para mostrar el placeholder)
// githubEnabled: muestra u oculta el link aunque haya URL
const projects = [
    {
        id: "01",
        name: "Corporate Landing Page and Administrative Back Office",
        stack: ["React", "Express", "Auth0"],
        year: null,
        description: "Development of a corporate web platform featuring an analytics dashboard, activity logs, ticketing system, and user and role management, establishing the company's digital presence to attract potential new clients.",
        image: null,
        techs: ["React", "Vite", "Express", "Auth0", "Resend", "GA4", "shadcn/ui", "Tailwind CSS", "XLS", "Motion", "Recharts"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "02",
        name: "Internal Reporting Portal",
        stack: ["React", "IBM i DB2"],
        year: null,
        description: "Development of an internal portal for accessing daily reports, automatically updated through SQL queries and connections to IBM i (AS/400) databases using authorized credentials.",
        image: null,
        techs: ["React", "IBM i DB2", "Apache"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "03",
        name: "CTF File Parser",
        stack: ["Electron", "JSON"],
        year: null,
        description: "Development of a desktop application to process CTF files in TC05 TCR0 format and convert their records into human-readable text using a predefined structure.",
        image: null,
        techs: ["Electron Forge", "JSON"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "04",
        name: "BIN File Analysis Application",
        stack: ["Electron", "JSON"],
        year: null,
        description: "Development of a desktop application for analyzing and recounting records in Ficohsa BIN files received from the headquarters through a shared folder.",
        image: null,
        techs: ["Electron Forge", "JSON"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "05",
        name: "POS Terminal Transaction Bus",
        stack: ["Node.js", "ISO 8583", "TCP"],
        year: null,
        description: "Development of a Node.js-based transaction bus for receiving, parsing, storing, and converting JSON messages into ISO 8583 format, followed by routing them to an authorization server for processing. Its architecture supports future integrations and transaction message monitoring.",
        image: null,
        techs: ["Node.js", "SQL", "TCP", "ISO 8583", "JSON"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "06",
        name: "Landing Pages for Small Businesses",
        stack: ["Next.js", "Express"],
        year: null,
        description: "Design and development of websites for small businesses, aimed at strengthening their digital presence and commercial visibility.",
        image: null,
        techs: ["Next.js", "Express", "WhatsApp"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "07",
        name: "IBM i Infrastructure Monitoring",
        stack: ["Zabbix", "SNMP"],
        year: null,
        description: "Implementation of server monitoring for IBM i (AS/400) environments using Zabbix 7.0.32, including the creation and configuration of SNMP metrics, primarily to monitor CPU, RAM, and ASP utilization.",
        image: null,
        techs: ["Zabbix", "SNMP", "IBM i (AS/400)", "Linux"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "08",
        name: "Academic Supervision Dashboard",
        stack: ["React", "TypeScript", "AWS"],
        year: null,
        description: "Led the frontend team in an academic project focused on developing a web-based classroom supervision and monitoring interface, implementing React components and CRUD operations.",
        image: null,
        techs: ["React", "TypeScript", "Prisma", "Auth0", "shadcn/ui", "AWS"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "09",
        name: "Cloud Infrastructure Prototyping",
        stack: ["AWS"],
        year: null,
        description: "Design and prototyping of an enterprise cloud infrastructure, intended for future implementation and deployment.",
        image: null,
        techs: ["AWS"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "10",
        name: "Web Portfolio",
        stack: ["React", "Tailwind"],
        year: null,
        description: "Personal portfolio built with React, Vite and Tailwind CSS, featuring a mouse-driven parallax hero, animated sections, a quick navigation menu and an expandable projects showcase.",
        image: null,
        techs: ["React", "Vite", "Tailwind CSS", "Motion", "JavaScript"],
        github: "",
        githubEnabled: false,
    },
]

const placeholderStyle = {
    backgroundImage:
        "repeating-linear-gradient(135deg, color-mix(in srgb, var(--page-bg) 12%, transparent) 0 6px, transparent 6px 12px)",
}

function ProjectImage({ project }) {
    if (project.image) {
        return (
            <img
                src={project.image}
                alt={`Captura de ${project.name}`}
                loading="lazy"
                className="aspect-[17/10] w-full border-2 border-page-bg object-cover md:w-[340px] md:shrink-0"
            />
        )
    }

    return (
        <div
            style={placeholderStyle}
            className="flex aspect-[17/10] w-full items-center justify-center border-2 border-page-bg text-xs tracking-widest text-page-bg/60 md:w-[340px] md:shrink-0"
        >
            [ CAPTURA ]
        </div>
    )
}

function ProjectRow({ project, isOpen, onToggle }) {
    const panelId = `project-panel-${project.id}`

    return (
        <li className={isOpen ? "border-b border-page-bg bg-white text-page-bg" : "border-b border-white/30"}>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={`flex w-full cursor-pointer items-center gap-4 py-5 text-left transition-[padding] sm:gap-8 ${isOpen ? "px-4 sm:px-6" : "px-2"}`}
            >
                <span className="w-10 shrink-0 font-akira text-sm text-red-primary sm:w-12">{project.id}</span>
                <span className="flex-1 font-akira text-base uppercase sm:text-xl">{project.name}</span>
                {project.stack.length > 0 && (
                    <span className={`hidden text-xs uppercase tracking-widest md:block ${isOpen ? "text-page-bg/60" : "text-white/50"}`}>
                        {project.stack.join(" · ")}
                    </span>
                )}
                <span className={`hidden w-12 text-right text-xs sm:block ${isOpen ? "text-page-bg/60" : "text-white/50"}`}>
                    {project.year ?? ""}
                </span>
                <span className="w-6 shrink-0 text-right" aria-hidden="true">
                    {isOpen ? <Minus className="ml-auto" size={20} /> : <Plus className="ml-auto" size={20} />}
                </span>
            </button>

            {isOpen && (
                <div id={panelId} className="flex flex-col gap-6 px-4 pb-7 pt-1 sm:px-6 md:flex-row md:gap-8 md:pl-[104px]">
                    <ProjectImage project={project} />

                    <div className="flex flex-1 flex-col gap-4">
                        <p className="max-w-[420px] text-[15px] leading-relaxed">{project.description}</p>

                        {project.techs.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {project.techs.map((tech) => (
                                    <TechChip key={tech} name={tech} />
                                ))}
                            </div>
                        )}

                        {project.githubEnabled && project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-auto flex w-fit items-center gap-1 border-b-2 border-red-primary text-[13px] tracking-widest transition-colors hover:text-red-primary"
                            >
                                GITHUB <ArrowUpRight size={14} />
                            </a>
                        )}
                    </div>
                </div>
            )}
        </li>
    )
}

export default function Projects() {
    const [openId, setOpenId] = useState(null)

    const toggle = (id) => setOpenId((current) => (current === id ? null : id))

    return (
        <section id="projects" className="mx-auto flex w-full max-w-6xl scroll-mt-10 flex-col gap-7 py-14">
            <SectionTitle
                title="Projects"
                subtitle="4. 作品"
                alert={<Tooltip title="Disclaimer" content="Lorem ipsum dolor sit amet..." />}
            />

            <ul className="flex flex-col border-t-2 border-white">
                {projects.map((project) => (
                    <ProjectRow
                        key={project.id}
                        project={project}
                        isOpen={openId === project.id}
                        onToggle={() => toggle(project.id)}
                    />
                ))}
            </ul>
        </section>
    )
}
