import { useEffect, useRef, useState } from "react"
import { AlertCircle } from "lucide-react"

// alert: nodo opcional (ej. <Tooltip .../>) que se muestra al hacer click en el ícono
// alertClassName: posición/ancho del popup (clases completas, ver gotcha de Tailwind)
export default function SectionTitle({title, subtitle, subtitleX=2, subtitleY=5, alert=null, alertClassName="absolute right-0 top-8 w-72"}){

    const [open, setOpen] = useState(false)
    const alertRef = useRef(null)

    useEffect(() => {
        if (!open) return

        const handlePointerDown = (event) => {
            if (!alertRef.current?.contains(event.target)) setOpen(false)
        }
        const handleKeyDown = (event) => {
            if (event.key === "Escape") setOpen(false)
        }

        document.addEventListener("pointerdown", handlePointerDown)
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [open])

    return(

        <>
            <div className="flex flex-col justify-center items-center">
            <div className="relative">
            <h1 className='text-6xl font-bold font-akira text-end'>{title}
            <p className={`z-50 text-lg text-red-primary text-md font-bold -translate-y-${subtitleY} -translate-x--${subtitleX}`}>{subtitle}</p>
            </h1>
            {alert && (
                <div ref={alertRef} className="absolute -right-8 -top-2 z-50">
                    <button
                        type="button"
                        onClick={() => setOpen((current) => !current)}
                        aria-expanded={open}
                        aria-label="Show notice"
                        className="relative flex h-5 w-5 cursor-pointer items-center justify-center"
                    >
                        <AlertCircle size={20} className="absolute animate-ping text-cream/40" aria-hidden="true" />
                        <AlertCircle size={20} className="relative text-cream/40" aria-hidden="true" />
                    </button>
                    {open && (
                        <div role="dialog" className={`${alertClassName} text-left`}>
                            {alert}
                        </div>
                    )}
                </div>
            )}
            </div>
            </div>
            
        
        </>

    )

}
