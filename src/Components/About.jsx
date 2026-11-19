import SectionTitle from "./ui/titles/SectionTitle"

export default function About() {

    const experienceClassname = "font-bold text-4xl font-akira"

    return(

            <>
        <div id="about" className='flex flex-col justify-center items-center m-10 gap-6 '>
            <SectionTitle title="About" subtitle="1. について"/>
            <div className='flex justify-center items-center gap-4'>
                <div className='bg-red-primary h-29 w-3'></div>
                <p className='max-w-100 font-dm-sans'>Computer Science Engineering Degree,  passionate and oriented to frontend development with fullstack and cloud services experience.
                    I love combining modern design and development to create functional, scalable, and interactive interfaces.</p>
                <hr className='h-20 border-1 ' />
                <div className='flex flex-col justify-center gap-2'>
                    <div className='flex gap-2 items-center'>
                        <h2 className={experienceClassname}>+2</h2>
                        <p className="flex flex-col gap-0 font-dm-sans text-sm">Years <span>In Web Dev</span></p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <h2 className={experienceClassname}>+5</h2>
                        <p className="font-dm-sans flex flex-col text-sm gap-0">Projects in <span>professional fields</span></p>
                    </div>
                </div>
            </div>
        </div>
    </>


    )


}
