import Hero from './Components/Hero'
import About from './Components/About'
import MyCurrentStack from './Components/MyCurrentStack'
import Education from './Components/Education'
import './App.css'
import Projects from './Components/Projects'
import Contact from './Components/Contact'

function App() {
  // pt-28 = alto de la MobileNav fija; en lg+ el padding lateral deja libres los rieles (index.css)
  return (
    <main className="flex min-h-screen flex-col gap-50 bg-page-bg px-4 pt-28 pb-6 font-dm-sans text-cream sm:px-6 lg:px-(--rail-clear) lg:pt-6">

      <Hero />

      <About/>
      <MyCurrentStack/>
      <Education/>
      <Projects/>
      <Contact/>

    </main>
  )
}

export default App
