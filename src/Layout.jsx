import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"

export default function Layout() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight

      if (scrollHeight <= 0) {
        setScrollProgress(0)
        return
      }

      const progress = (scrollTop / scrollHeight) * 100
      setScrollProgress(progress)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      <div className="fixed right-0 top-0 z-50 flex h-screen justify-center px-6">
        <div className="my-4 h-70 w-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="w-full rounded-full bg-red-primary transition-[height] duration-75 ease-out"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <Outlet />
    </>
  )
}
