import { AlertCircle } from "lucide-react"


export default function Tooltip({ title, content }){

    return(

        <>
        
            <div className="p-2 rounded-lg bg-page-bg-140">
                <div className="p-2 rounded-md border-1 border-white/60 flex flex-col">
                <div className="flex gap-2 items-center">
                    <AlertCircle size={15} className="text-white/40"/>
                    <p className="font-black tracking-widest text-white/60">{title}</p>
                </div>
                    
                    <p className="font-thin text-white/60 tracking-wider text-sm">{content}</p>
                </div>
               
            </div>

        </>

    )

}
