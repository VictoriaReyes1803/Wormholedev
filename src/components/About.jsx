import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Zap, Target, Heart, Globe } from 'lucide-react'


const icons = [Target, Heart, Zap, Globe]

export default function About() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const values = t('about.values', { returnObjects: true })

  return (
    <section id="about" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-400 text-sm font-medium mb-6"
            >
              {t('about.badge')}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-800 tracking-tight text-gray-900 dark:text-white mb-6 leading-tight"
            >
              {t('about.title1')}{' '}
              <span className="gradient-text">{t('about.title2')}</span>{' '}
              {t('about.title3')}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="space-y-4 text-gray-600 dark:text-gray-400 text-base leading-relaxed"
            >
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
              <p>{t('about.p3')}</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {values.map((v, i) => {
              const Icon = icons[i]
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800/60 hover:-translate-y-1 hover:shadow-md transition-all duration-250"
                >
                  <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center shadow-md mb-4">
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-base font-700 text-gray-900 dark:text-white mb-1.5">{v.label}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
