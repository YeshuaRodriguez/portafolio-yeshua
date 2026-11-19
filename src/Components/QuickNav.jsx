const links = [
    { label: "1.", target: "about" },
    { label: "2.", target: "stack" },
    { label: "3.", target: "education" },
    { label: "4.", target: "projects" },
    { label: "5.", target: "contact" },
]

export default function QuickNav() {

    const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

    return (
        <nav aria-label="Quick navigation" className="flex flex-col">
            {links.map((link) => (
                <button
                    key={link.target}
                    type="button"
                    onClick={() => goTo(link.target)}
                    className="cursor-pointer px-4 py-10 font-akira text-lg text-page-accent transition-colors border-r-5 border-page-accent hover:text-red-primary hover:border-red-primary"
                >
                    {link.label}
                </button>
            ))}
        </nav>
    )

}
