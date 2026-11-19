
import SectionTitle from "./ui/titles/SectionTitle"
import { useState } from "react"

import { ChevronDown, ChevronUp } from "lucide-react"
import { GraduationCap } from "lucide-react";
import { BookMarked } from "lucide-react";
import { ClockFading } from "lucide-react";

const stateClasses = {
    active: "bg-active",
    inactive: "bg-inactive",
    inProgress: "bg-inProgress",
}

function CurrentState({ state }) {
    return <div className={`h-3 w-3 rounded-xl ${stateClasses[state] ?? stateClasses.inactive}`} />
}

const sections = {
    certification: { title: "CERTIFICATIONS", icon: <GraduationCap /> },
    course: { title: "COURSES", icon: <BookMarked /> },
    future: { title: "FUTURE PLANS", icon: <ClockFading /> },
}

const education = [
    { type: "course", name: "Desarrollo Web Completo HTML5, CSS, JS, AJAX, PHP, MySQL", issuer: "Udemy", status: "active" },
    { type: "course", name: "Unity y C# Fundamental", issuer: "Udemy", status: "active" },
    { type: "course", name: "Preparación AWS Certified Cloud Practitioner CLF-C02", issuer: "Udemy", status: "active" },
    { type: "course", name: "JavaScript Essentials", issuer: "NETACAD", status: "active" },
    { type: "course", name: "Introduction to CyberSecurity", issuer: "NETACAD", status: "active" },
    { type: "course", name: "Defensa de la red", issuer: "NETACAD", status: "active" },
    { type: "course", name: "Launching a Business Venture", issuer: "NETACAD", status: "active" },
    { type: "course", name: "Claude 101", issuer: "Claude Academy", link: "https://drive.google.com/file/d/1jqvv4bu3wcz065RahGdRF8ZnjblfV6Tf/view?usp=sharing", status: "active" },
    { type: "course", name: "AI Fluency: Framework and Foundations", issuer: "Claude Academy", link: "https://drive.google.com/file/d/1jUocyCjM9Lc65eiVMj2RFN10-mgCaWm6/view?usp=sharing", status: "active" },
    { type: "course", name: "AI Capabilities and Limitations", issuer: "Claude Academy", link: "https://drive.google.com/file/d/1WLAtUp-5bp0bbaCcklEXQB8d26Dan-yK/view?usp=sharing", status: "active" },
    { type: "course", name: "Claude Code 101", issuer: "Claude Academy", status: "active" },
    { type: "course", name: "Claude Code in Action", issuer: "Claude Academy", status: "active" },
    { type: "course", name: "Introduction to Agent Skills", issuer: "Claude Academy", status: "active" },
    { type: "course", name: "Introduction to Model Context Protocol", issuer: "Claude Academy", status: "active" },
    { type: "course", name: "Curso de Docker", issuer: "Edutin", status: "active" },
    { type: "course", name: "Herdr: domina la terminal y tus agentes", issuer: "Hola Mundo", link: "https://drive.google.com/file/d/1kRsRfGCW5nVU8gK3QwsPgFvM2zpVZ75o/view?usp=sharing", status: "active" },
    { type: "certification", name: "AWS Cloud Practitioner (examen programado próximamente)", issuer: "Amazon Web Services", status: "inProgress" },
    { type: "future", name: "GitHub Essentials", issuer: "GitHub", status: "inactive" },
    { type: "future", name: "AWS Certified AI Practitioner", issuer: "Amazon Web Services", status: "inactive" },
    { type: "future", name: "AWS Certified Solutions Architect Associate", issuer: "Amazon Web Services", status: "inactive" },
    { type: "future", name: "AWS Certified Developer Associate", issuer: "Amazon Web Services", status: "inactive" },
    { type: "future", name: "AWS Certified Generative AI Developer", issuer: "Amazon Web Services", status: "inactive" },
]

function Education() {

    const [closed, setClosed] = useState({})

    const toggle = (type) => setClosed((prev) => ({ ...prev, [type]: !prev[type] }))

    return (

        <>
            <div id="education" className="flex flex-col justify-center text-center scroll-mt-10">
                <SectionTitle title="Education" subtitle="3. 私の教育" />

                <div className="flex flex-col max-w-200 justify-center m-auto gap-6">

                    <div className="flex flex-col">
                        <h2 className="text-xl tracking-wider">COMPUTER SCIENCE ENGINEERING DEGREE</h2>
                        <p className="italic text-sm">Universidad Católica de Honduras - 2026</p>
                    </div>

                    <div className="flex flex-col gap-5 min-w-150">
                        {Object.entries(sections).map(([type, { title, icon }]) => (
                            <div key={type} className="flex flex-col items-start">
                                <button className="flex cursor-pointer font-bold tracking-widest text-lg gap-2" onClick={() => toggle(type)}>
                                    {icon} {title} {closed[type] ? <ChevronDown /> : <ChevronUp />}
                                </button>
                                {!closed[type] && (
                                    <ul className="text-start">
                                        {education.filter((item) => item.type === type).map((item) => (
                                            <li key={item.name} className="flex gap-2 items-center">
                                                <CurrentState state={item.status} />
                                                {item.link
                                                    ? <a href={item.link} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-red-primary">{item.name}</a>
                                                    : item.name} | <span className="font-light text-white/30">{item.issuer}{item.year ? ` - ${item.year}` : ""}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>

                </div>

            </div>

        </>

    )



} export default Education
