import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Menu, X, Zap, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Navbar({ dark, setDark }) {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.whyUs'), href: '#why-us' },
    { label: t('nav.process'), href: '#process' },
    { label: t('nav.solutions'), href: '#solutions' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.contact'), href: '#contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleLang = () => {
    const next = i18n.language.startsWith('es') ? 'en' : 'es'
    i18n.changeLanguage(next)
  }

  const currentLang = i18n.language.startsWith('es') ? 'ES' : 'EN'

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm border-b border-gray-200/60 dark:border-gray-800/60'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <a
            href="#"
            onClick={e => handleNavClick(e, 'body')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="text-lg font-800 tracking-tight text-gray-900 dark:text-white">
              Wormhole<span className="gradient-text font-900">Dev</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => handleNavClick(e, link.href)}
                className="px-3.5 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              aria-label="Toggle language"
              title={currentLang === 'EN' ? 'Cambiar a Español' : 'Switch to English'}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-cyan-400 transition-all duration-200"
            >
              <Globe size={15} />
              <span className="text-xs font-700 tracking-wide">{currentLang}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setDark(d => !d)}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <AnimatePresence mode="wait">
                {dark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={18} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* CTA button (desktop) */}
            <a
              href="#contact"
              onClick={e => handleNavClick(e, '#contact')}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-600 gradient-bg text-white rounded-lg shadow-sm hover:opacity-90 hover:shadow-md transition-all duration-200"
            >
              {t('nav.cta')}
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => handleNavClick(e, link.href)}
                  className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={e => handleNavClick(e, '#contact')}
                className="mt-2 px-4 py-3 text-sm font-600 gradient-bg text-white rounded-lg text-center shadow-sm"
              >
                {t('nav.cta')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
