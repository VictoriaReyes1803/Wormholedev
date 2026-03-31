import { useTranslation } from 'react-i18next'
import { Zap, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'

const navKeys = [
  { key: 'nav.services', href: '#services' },
  { key: 'nav.whyUs', href: '#why-us' },
  { key: 'nav.process', href: '#process' },
  { key: 'nav.solutions', href: '#solutions' },
  { key: 'nav.about', href: '#about' },
  { key: 'nav.contact', href: '#contact' },
]

const socialLinks = [
  { label: 'GH', title: 'GitHub', href: '#' },
  { label: 'LI', title: 'LinkedIn', href: '#' },
  { label: 'X', title: 'Twitter / X', href: '#' },
]

export default function Footer() {
  const { t } = useTranslation()
  const serviceLinks = t('footer.serviceLinks', { returnObjects: true })

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollTop = e => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-950 dark:bg-gray-950 text-gray-400">
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <a href="#" onClick={scrollTop} className="flex items-center gap-2.5 mb-4 group">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-md">
                  <Zap size={16} className="text-white" fill="white" />
                </div>
                <span className="text-lg font-800 tracking-tight text-white">
                  Wormhole<span className="gradient-text">Dev</span>
                </span>
              </a>
              <p className="text-sm leading-relaxed text-gray-500 mb-6">{t('footer.tagline')}</p>
              <div className="flex gap-2">
                {socialLinks.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.title}
                    title={s.title}
                    className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-200 text-xs font-700"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-xs font-700 text-gray-300 uppercase tracking-widest mb-4">{t('footer.navTitle')}</h4>
              <ul className="space-y-2.5">
                {navKeys.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={e => handleNavClick(e, link.href)}
                      className="text-sm text-gray-500 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <span>{t(link.key)}</span>
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -translate-y-0.5 translate-x-0.5 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xs font-700 text-gray-300 uppercase tracking-widest mb-4">{t('footer.servicesTitle')}</h4>
              <ul className="space-y-2.5">
                {serviceLinks.map(s => (
                  <li key={s}>
                    <a
                      href="#services"
                      onClick={e => handleNavClick(e, '#services')}
                      className="text-sm text-gray-500 hover:text-blue-400 transition-colors duration-200"
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-700 text-gray-300 uppercase tracking-widest mb-4">{t('footer.contactTitle')}</h4>
              <ul className="space-y-3">
                {[
                  { icon: Mail, text: 'hello@wormholedev.com' },
                  { icon: Phone, text: '+52 (871) 5349734' },
                  { icon: MapPin, text: t('footer.location') },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <li key={item.text} className="flex items-center gap-2.5">
                      <Icon size={14} className="text-blue-500 flex-shrink-0" />
                      <span className="text-sm text-gray-500">{item.text}</span>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-6">
                <a
                  href="#contact"
                  onClick={e => handleNavClick(e, '#contact')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 gradient-bg text-white text-sm font-600 rounded-lg hover:opacity-90 transition-all"
                >
                  {t('footer.startProject')}
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            {t('footer.rights', { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs text-gray-600">{t('footer.built')}</p>
        </div>
      </div>
    </footer>
  )
}
