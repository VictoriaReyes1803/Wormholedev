import { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import WhyUs from './components/WhyUs.jsx'
import Process from './components/Process.jsx'
import Solutions from './components/Solutions.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('wh-theme')
    const isDark = saved ? saved === 'dark' : false
    // Apply immediately to avoid flash
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    return isDark
  })

  useEffect(() => {
    localStorage.setItem('wh-theme', dark ? 'dark' : 'light')
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar dark={dark} setDark={setDark} />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <Process />
        <Solutions />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
