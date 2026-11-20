import Hero from './Components/Hero'
import About from './Components/About'
import MyCurrentStack from './Components/MyCurrentStack'
import Education from './Components/Education'
import './App.css'
import QuickNav from './Components/QuickNav'
import Projects from './Components/Projects'
import Contact from './Components/Contact'

function App() {
  return (
    <main className=" flex flex-col min-h-screen bg-page-bg px-4 py-6 text-cream sm:px-6 lg:px-8 font-dm-sans gap-50">

      <div className='flex flex-row justify-center items-center gap-0'>
        <QuickNav/>
        <Hero />
        
      </div>
      
      <About/>
      <MyCurrentStack/>
      <Education/>
      <Projects/>
      <Contact/>

    </main>
  )
}

export default App
