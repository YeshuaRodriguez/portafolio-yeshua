import { motion } from "motion/react"
import { inRight } from "../animations"
import { useState } from "react"
import { Plus, Minus, ArrowUpRight } from "lucide-react"
import SectionTitle from "./ui/titles/SectionTitle"
import TechChip from "./ui/chips/TechChip"
import Tooltip from "./ui/Tooltip"
import project1Img from "../../assets/img/projects/1.webp"
import project3Img from "../../assets/img/projects/3.webp"
import project4Img from "../../assets/img/projects/4.webp"
import project5Img from "../../assets/img/projects/5.webp"
import project7Img from "../../assets/img/projects/7.webp"
import project9Img from "../../assets/img/projects/9.webp"
import project10Img from "../../assets/img/projects/10.webp"

// image: import de la captura (o null para mostrar el placeholder)
// imageEnabled: muestra u oculta la imagen (si es false, el panel queda solo con texto)
// githubEnabled: muestra u oculta el link aunque haya URL
const projects = [
    {
        id: "01",
        name: "Corporate Landing Page and Administrative Back Office",
        stack: ["React", "Express", "Auth0"],
        year: 2026,
        description: "Development of a corporate web platform featuring an analytics dashboard, activity logs, ticketing system, and user and role management, establishing the company's digital presence to attract potential new clients.",
        image: project1Img,
        imageEnabled: true,
        techs: ["React", "Vite", "Express", "Auth0", "Resend", "GA4", "shadcn/ui", "Tailwind CSS", "XLS", "Motion", "Recharts"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "02",
        name: "Internal Reporting Portal",
        stack: ["React", "IBM i DB2"],
        year: 2026,
        description: "Development of an internal portal for accessing daily reports, automatically updated through SQL queries and connections to IBM i (AS/400) databases using authorized credentials.",
        image: null,
        imageEnabled: false,
        techs: ["React", "IBM i DB2", "Apache"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "03",
        name: "CTF File Parser",
        stack: ["Electron", "JSON"],
        year: 2026,
        description: "Development of a desktop application to process CTF files in TC05 TCR0 format and convert their records into human-readable text using a predefined structure.",
        image: project3Img,
        imageEnabled: true,
        techs: ["Electron Forge", "JSON"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "04",
        name: "BIN File Analysis Application",
        stack: ["Electron", "JSON"],
        year: 2026,
        description: "Development of a desktop application for analyzing and recounting records in Ficohsa BIN files received from the headquarters through a shared folder.",
        image: project4Img,
        imageEnabled: true,
        techs: ["Electron Forge", "JSON"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "05",
        name: "POS Terminal Transaction Bus",
        stack: ["Node.js", "ISO 8583", "TCP"],
        year: 2026,
        description: "Development of a Node.js-based transaction bus for receiving, parsing, storing, and converting JSON messages into ISO 8583 format, followed by routing them to an authorization server for processing. Its architecture supports future integrations and transaction message monitoring.",
        image: project5Img,
        imageEnabled: true,
        techs: ["Node.js", "SQL", "TCP", "ISO 8583", "JSON"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "06",
        name: "Landing Pages for Small Businesses",
        stack: ["Next.js", "Express"],
        year: 2026,
        description: "Design and development of websites for small businesses, aimed at strengthening their digital presence and commercial visibility.",
        image: null,
        imageEnabled: false,
        techs: ["Next.js", "Express", "WhatsApp"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "07",
        name: "IBM i Infrastructure Monitoring",
        stack: ["Zabbix", "SNMP"],
        year: 2026,
        description: "Implementation of server monitoring for IBM i (AS/400) environments using Zabbix 7.0.32, including the creation and configuration of SNMP metrics, primarily to monitor CPU, RAM, and ASP utilization.",
        image: project7Img,
        imageEnabled: true,
        techs: ["Zabbix", "SNMP", "IBM i (AS/400)", "Linux"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "08",
        name: "Academic Supervision Dashboard",
        stack: ["React", "TypeScript", "AWS"],
        year: 2025,
        description: "Led the frontend team in an academic project focused on developing a web-based classroom supervision and monitoring interface, implementing React components and CRUD operations.",
        image: null,
        imageEnabled: false,
        techs: ["React", "TypeScript", "Prisma", "Auth0", "shadcn/ui", "AWS"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "09",
        name: "Cloud Infrastructure Prototyping",
        stack: ["AWS"],
        year: 2026,
        description: "Design and prototyping of an enterprise cloud infrastructure, intended for future implementation and deployment.",
        image: project9Img,
        imageEnabled: true,
        techs: ["AWS"],
        github: "",
        githubEnabled: false,
    },
    {
        id: "10",
        name: "Web Portfolio",
        stack: ["React", "Tailwind"],
        year: 2026,
        description: "Personal portfolio built with React, Vite and Tailwind CSS, featuring a mouse-driven parallax hero, animated sections, a quick navigation menu and an expandable projects showcase.",
        image: project10Img,
        imageEnabled: true,
        techs: ["React", "Vite", "Tailwind CSS", "Motion", "JavaScript"],
        github: "https://github.com/YeshuaRodriguez/portafolio-yeshua",
        githubEnabled: true,
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
                className="aspect-[17/10] w-full border-2 border-page-bg bg-page-bg object-contain md:w-[340px] md:shrink-0"
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

// delay: cascada de la lista (cada fila entra 0.1 s después de la anterior)
function ProjectRow({ project, isOpen, onToggle, delay }) {
    const panelId = `project-panel-${project.id}`

    return (
        <motion.li className={isOpen ? "border-b border-page-bg bg-cream text-page-bg" : "border-b border-cream/30"} {...inRight({ delay })}>
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
                    <span className={`hidden text-xs uppercase tracking-widest md:block ${isOpen ? "text-page-bg/60" : "text-cream/50"}`}>
                        {project.stack.join(" · ")}
                    </span>
                )}
                <span className={`hidden w-12 text-right text-xs sm:block ${isOpen ? "text-page-bg/60" : "text-cream/50"}`}>
                    {project.year ?? ""}
                </span>
                <span className="w-6 shrink-0 text-right" aria-hidden="true">
                    {isOpen ? <Minus className="ml-auto" size={20} /> : <Plus className="ml-auto" size={20} />}
                </span>
            </button>

            {isOpen && (
                <div id={panelId} className="flex flex-col gap-6 px-4 pb-7 pt-1 sm:px-6 md:flex-row md:gap-8 md:pl-[104px]">
                    {project.imageEnabled && <ProjectImage project={project} />}

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
        </motion.li>
    )
}

const disclaimer = [
    {
        heading: "1. Source Code and Demo Availability",
        text: "Due to contractual agreements, confidentiality policies, and intellectual property rights, most of the projects developed cannot be publicly shared as open-source repositories or made available through public demos. Many of these projects are designed for the financial sector or operate within private infrastructure and restricted environments, making public exposure unauthorized or inappropriate. Whenever permitted, a repository or functional demo is provided alongside the project. Otherwise, no public source code or demo is available.",
    },
    {
        heading: "2. Visual Representation",
        text: "SOME of the images displayed are intended solely for illustrative and aesthetic purposes. They serve as visual references to accompany each project's description, but do not necessarily represent the actual architecture, infrastructure, or implementation of the project. Diagrams should not be interpreted as visual evidence of any production system.",
    },
    {
        heading: "3. Project Ownership, Scope, and Operational Responsibility",
        text: "Projects developed under contractual agreements or collaborations become the property and responsibility of the respective companies, businesses, ventures, associations, or organizations for which they were developed, subject to the applicable agreements. My responsibility as a developer is limited to the scope of work and deliverables assigned to me, which were completed and handed over according to the agreed requirements. Therefore, the current availability, operational continuity, maintenance, further development and integration, or overall performance of delivered systems fall outside my control and responsibility. Whenever a public link to a production project or a deployment independently maintained by me is available, it is provided as a reference. Otherwise, no public link is included.",
    },
]

function ProjectsDisclaimer() {
    return (
        <div className="mt-2 flex flex-col gap-3">
            {disclaimer.map(({ heading, text }) => (
                <div key={heading} className="flex flex-col gap-1">
                    <h3 className="font-bold tracking-wider text-cream/80">{heading}</h3>
                    <p className="leading-relaxed">{text}</p>
                </div>
            ))}
        </div>
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
                alertClassName="fixed inset-x-4 top-24 sm:absolute sm:inset-x-auto sm:right-0 sm:top-8 sm:w-[34rem]"
                alert={<Tooltip title="Project Disclaimer" content={<ProjectsDisclaimer />} />}
            />

            <ul className="flex flex-col border-t-2 border-cream">
                {/* Cascada: 0.1 s, 0.2 s ... 1 s para las 10 filas */}
                {projects.map((project, i) => (
                    <ProjectRow
                        key={project.id}
                        delay={0.1 * (i + 1)}
                        project={project}
                        isOpen={openId === project.id}
                        onToggle={() => toggle(project.id)}
                    />
                ))}
            </ul>
        </section>
    )
}
