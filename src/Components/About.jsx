import { motion } from "motion/react"
import { fadeIn, inRight } from "../animations"
import SectionTitle from "./ui/titles/SectionTitle"
import { Download } from "lucide-react"


// Móvil: título → subtítulo → hr rojo → párrafo → hr → años (en fila) → CV.
// md+: fila con barra roja vertical | párrafo | divisor vertical | años (en columna).
export default function About() {

    const experienceClassname = "font-bold text-4xl font-akira"

    return(

        <div id="about" className='my-10 flex flex-col items-center justify-center gap-6 md:m-10'>
            <SectionTitle title="About" subtitle="1. について"/>
            <div className='flex w-full max-w-100 flex-col gap-6 md:w-auto md:max-w-none md:flex-row md:items-center md:gap-4'>
                <div aria-hidden="true" className='h-1.5 w-full bg-red-primary md:h-29 md:w-3 md:shrink-0'></div>
                <motion.p className='font-dm-sans md:max-w-100' {...fadeIn()}>Computer Science Engineering Degree,  passionate and oriented to frontend development with fullstack and cloud services experience.
                    I love combining modern design and development to create functional, scalable, and interactive interfaces.</motion.p>
                <div aria-hidden="true" className='h-px w-full bg-cream md:h-20 md:w-px md:shrink-0'></div>
                <div className='flex flex-row justify-center gap-8 md:flex-col md:gap-2'>
                    <motion.div className='flex gap-2 items-center' {...inRight()}>
                        <h2 className={experienceClassname}>+2</h2>
                        <p className="flex flex-col gap-0 font-dm-sans text-sm">Years <span>In Dev</span></p>
                    </motion.div>
                    <motion.div className='flex gap-2 items-center' {...inRight({ delay: 0.4 })}>
                        <h2 className={experienceClassname}>+10</h2>
                        <p className="font-dm-sans flex flex-col text-sm gap-0">Projects in <span>professional fields</span></p>
                    </motion.div>
                </div>
            </div>
            <a href="/cv-yeshua-rodriguez.pdf" download="Yeshua-Rodriguez-CV.pdf" className="mt-6 flex gap-4 rounded-md border-2 border-red-400 bg-red-primary p-3 font-bold tracking-wider text-page-bg hover:animate-pulse md:mt-20">Download CV <Download aria-hidden="true"/></a>
        </div>

    )


}
