export default function TechChip({ name, className = "" }) {
    return (
        <span className={`border-[1.5px] border-current px-2.5 py-1 text-xs tracking-wide ${className}`}>
            {name}
        </span>
    )
}
