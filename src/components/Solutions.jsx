import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Building2, Cpu, RefreshCw, Users2, Sparkles, ArrowUpCircle, ArrowRight } from 'lucide-react'
import { SectionHeader } from './Services.jsx'

const icons = [Building2, RefreshCw, Users2, Sparkles, Cpu, ArrowUpCircle]

const styles = [
  { gradient: 'from-blue-500 to-blue-600',    bg: 'bg-blue-50 dark:bg-blue-950/20',    border: 'border-blue-100 dark:border-blue-900/40' },
  { gradient: 'from-cyan-500 to-cyan-600',    bg: 'bg-cyan-50 dark:bg-cyan-950/20',    border: 'border-cyan-100 dark:border-cyan-900/40' },
  { gradient: 'from-violet-500 to-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/20', border: 'border-violet-100 dark:border-violet-900/40' },
  { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-purple-100 dark:border-purple-900/40' },
  { gradient: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/20', border: 'border-indigo-100 dark:border-indigo-900/40' },
  { gradient: 'from-teal-500 to-teal-600',    bg: 'bg-teal-50 dark:bg-teal-950/20',    border: 'border-teal-100 dark:border-teal-900/40' },
]

export default function Solutions() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const items = t('solutions.items', { returnObjects: true })

  const handleContact = () => {
    const el = document.querySelector('#contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="solutions" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t('solutions.badge')}
          title={<>{t('solutions.title1')} <span className="gradient-text">{t('solutions.title2')}</span></>}
          sub={t('solutions.sub')}
        />

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {items.map((s, i) => {
            const Icon = icons[i]
            const st = styles[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative p-7 rounded-2xl border ${st.border} ${st.bg} hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-250 overflow-hidden`}
              >
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${st.gradient} opacity-5 group-hover:opacity-10 blur-2xl transition-opacity`} />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${st.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-700 text-gray-900 dark:text-white mb-3 leading-snug">{s.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.55 }}
          className="relative rounded-3xl overflow-hidden gradient-bg p-10 text-center shadow-xl shadow-blue-500/20"
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 0%, transparent 60%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 60%)` }}
          />
          <div className="relative">
            <h3 className="text-2xl sm:text-3xl font-800 text-white mb-3">{t('solutions.ctaTitle')}</h3>
            <p className="text-blue-100 text-base mb-6 max-w-lg mx-auto">{t('solutions.ctaSub')}</p>
            <button
              onClick={handleContact}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-blue-600 font-700 rounded-xl hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
            >
              {t('solutions.ctaBtn')}
              <ArrowRight size={17} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
