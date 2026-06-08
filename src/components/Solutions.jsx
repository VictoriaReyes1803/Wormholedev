import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Building2, Cpu, RefreshCw, Users2, Sparkles, ArrowUpCircle, ArrowRight } from 'lucide-react'
import { SectionHeader } from './Services.jsx'

const icons = [Building2, RefreshCw, Users2, Sparkles, Cpu, ArrowUpCircle]

const styles = [
  { gradient: 'from-blue-500 to-blue-600',    bg: 'bg-blue-50 dark:bg-blue-950/20',    border: 'border-blue-100 dark:border-blue-900/40', ring: 'hover:border-blue-300 dark:hover:border-blue-700' },
  { gradient: 'from-cyan-500 to-cyan-600',    bg: 'bg-cyan-50 dark:bg-cyan-950/20',    border: 'border-cyan-100 dark:border-cyan-900/40', ring: 'hover:border-cyan-300 dark:hover:border-cyan-700' },
  { gradient: 'from-violet-500 to-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/20', border: 'border-violet-100 dark:border-violet-900/40', ring: 'hover:border-violet-300 dark:hover:border-violet-700' },
  { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-purple-100 dark:border-purple-900/40', ring: 'hover:border-purple-300 dark:hover:border-purple-700' },
  { gradient: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/20', border: 'border-indigo-100 dark:border-indigo-900/40', ring: 'hover:border-indigo-300 dark:hover:border-indigo-700' },
  { gradient: 'from-teal-500 to-teal-600',    bg: 'bg-teal-50 dark:bg-teal-950/20',    border: 'border-teal-100 dark:border-teal-900/40', ring: 'hover:border-teal-300 dark:hover:border-teal-700' },
]

export default function Solutions() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const items = t('solutions.items', { returnObjects: true })
  const [hovered, setHovered] = useState(null)

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
        />

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {items.map((s, i) => {
            const Icon = icons[i]
            const st = styles[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`relative group p-8 rounded-2xl border ${st.border} ${st.ring} ${st.bg} transition-all duration-250 overflow-hidden min-h-[160px] flex flex-col items-start justify-center cursor-default`}
              >
                {/* Default state: icon + title */}
                <motion.div
                  animate={{ opacity: hovered === i ? 0 : 1, y: hovered === i ? -6 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-4 w-full"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${st.gradient} flex items-center justify-center shadow-md`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-base font-700 text-gray-900 dark:text-white leading-snug">{s.title}</h3>
                </motion.div>

                {/* Hover reveal: description */}
                <AnimatePresence>
                  {hovered === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute inset-0 p-8 flex flex-col justify-center"
                    >
                      <div className={`absolute inset-0 ${st.bg} opacity-95`} />
                      <div className="relative">
                        <h3 className="text-sm font-700 text-gray-900 dark:text-white mb-2">{s.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
