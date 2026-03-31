import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Puzzle, Users, Zap, Shield, LineChart, Clock, MessageSquare } from 'lucide-react'
import { SectionHeader } from './Services.jsx'

const icons = [Puzzle, Users, Zap, Shield, LineChart, Clock, MessageSquare, CheckCircle2]

export default function WhyUs() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const items = t('whyUs.items', { returnObjects: true })

  return (
    <section id="why-us" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t('whyUs.badge')}
          title={<>{t('whyUs.title1')} <span className="gradient-text">{t('whyUs.title2')}</span></>}
          sub={t('whyUs.sub')}
        />

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((r, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="group p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800/60 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-gray-900/50 bg-gray-50/50 dark:bg-gray-900/50 transition-all duration-250"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-200">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-base font-700 text-gray-900 dark:text-white mb-2">{r.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{r.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
