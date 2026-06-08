import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Globe, Smartphone, Layers, Wrench, TrendingUp, Bot,
  Database, Brain, HeadphonesIcon, Lightbulb
} from 'lucide-react'
import { iconBounce, viewportOpts } from '../lib/animations.js'

const icons = [Globe, Smartphone, Layers, Wrench, TrendingUp, Bot, Database, Brain, HeadphonesIcon, Lightbulb]

const colors = ['blue', 'cyan', 'violet', 'indigo', 'emerald', 'orange', 'teal', 'purple', 'rose', 'amber']

const colorMap = {
  blue:    { icon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',    hover: 'hover:border-blue-200 dark:hover:border-blue-700' },
  cyan:    { icon: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',    hover: 'hover:border-cyan-200 dark:hover:border-cyan-700' },
  violet:  { icon: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400', hover: 'hover:border-violet-200 dark:hover:border-violet-700' },
  indigo:  { icon: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400', hover: 'hover:border-indigo-200 dark:hover:border-indigo-700' },
  emerald: { icon: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', hover: 'hover:border-emerald-200 dark:hover:border-emerald-700' },
  orange:  { icon: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400', hover: 'hover:border-orange-200 dark:hover:border-orange-700' },
  teal:    { icon: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',    hover: 'hover:border-teal-200 dark:hover:border-teal-700' },
  purple:  { icon: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', hover: 'hover:border-purple-200 dark:hover:border-purple-700' },
  rose:    { icon: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',    hover: 'hover:border-rose-200 dark:hover:border-rose-700' },
  amber:   { icon: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', hover: 'hover:border-amber-200 dark:hover:border-amber-700' },
}

export function SectionHeader({ badge, title, sub }) {
  const ref = useRef(null)
  const inView = useInView(ref, viewportOpts)
  return (
    <div ref={ref} className="text-center max-w-2xl mx-auto mb-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-400 text-sm font-medium mb-5"
      >
        {badge}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="text-4xl sm:text-5xl font-800 tracking-tight text-gray-900 dark:text-white mb-4"
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed"
        >
          {sub}
        </motion.p>
      )}
    </div>
  )
}

export default function Services() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const items = t('services.items', { returnObjects: true })

  return (
    <section id="services" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t('services.badge')}
          title={<>{t('services.title1')} <span className="gradient-text">{t('services.title2')}</span></>}
        />

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((s, i) => {
            const Icon = icons[i]
            const c = colorMap[colors[i]]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 ${c.hover} hover:shadow-lg dark:hover:shadow-gray-900/50 transition-colors duration-250`}
              >
                <motion.div
                  whileHover={iconBounce}
                  className={`w-14 h-14 rounded-2xl ${c.icon} flex items-center justify-center mb-5`}
                >
                  <Icon size={26} />
                </motion.div>
                <h3 className="text-base font-700 text-gray-900 dark:text-white mb-2 leading-snug">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{s.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
