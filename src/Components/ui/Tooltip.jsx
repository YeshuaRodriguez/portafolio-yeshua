import { AlertCircle } from "lucide-react"


export default function Tooltip({ title, content }){

    return(

        <>
        
            <div className="p-2 rounded-lg bg-page-bg-140">
                <div className="p-2 rounded-md border-1 border-cream/60 flex flex-col max-h-[70vh] overflow-y-auto">
                <div className="flex gap-2 items-center">
                    <AlertCircle size={15} className="text-cream/40"/>
                    <p className="font-black tracking-widest text-cream/60">{title}</p>
                </div>
                    
                    <div className="font-thin text-cream/60 tracking-wider text-sm">{content}</div>
                </div>
               
            </div>

        </>

    )

}
