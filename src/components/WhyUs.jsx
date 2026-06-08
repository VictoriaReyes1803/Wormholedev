import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Puzzle, Users, Zap, Shield } from 'lucide-react'
import { SectionHeader } from './Services.jsx'
import { iconBounce } from '../lib/animations.js'

const icons = [Puzzle, Users, Zap, Shield]

const gradients = [
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500',
]

export default function WhyUs() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const items = t('whyUs.items', { returnObjects: true }).slice(0, 4)

  return (
    <section id="why-us" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t('whyUs.badge')}
          title={<>{t('whyUs.title1')} <span className="gradient-text">{t('whyUs.title2')}</span></>}
        />

        <div ref={ref} className="grid grid-cols-2 gap-6 lg:gap-8">
          {items.map((r, i) => {
            const Icon = icons[i]
            const direction = i % 2 === 0 ? 'left' : 'right'
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: direction === 'left' ? -36 : 36 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group p-8 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800/60 hover:shadow-md dark:hover:shadow-gray-900/50 bg-gray-50/50 dark:bg-gray-900/50 transition-all duration-250 flex flex-col items-start gap-5"
              >
                <motion.div
                  whileHover={iconBounce}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center shadow-lg`}
                >
                  <Icon size={28} className="text-white" />
                </motion.div>
                <h3 className="text-lg font-700 text-gray-900 dark:text-white leading-snug">{r.title}</h3>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
