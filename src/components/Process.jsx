import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MessageCircle, Map, Code2, Rocket } from 'lucide-react'
import { SectionHeader } from './Services.jsx'

const icons = [MessageCircle, Map, Code2, Rocket]

export default function Process() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const steps = t('process.steps', { returnObjects: true })

  return (
    <section id="process" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t('process.badge')}
          title={<>{t('process.title1')} <span className="gradient-text">{t('process.title2')}</span></>}
          sub={t('process.sub')}
        />

        <div ref={ref} className="relative">
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-200 via-cyan-300 to-blue-200 dark:from-blue-800 dark:via-cyan-700 dark:to-blue-800" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => {
              const Icon = icons[i]
              const num = String(i + 1).padStart(2, '0')
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-blue-500/25 z-10 relative">
                        <Icon size={24} className="text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-gray-900 border-2 border-blue-500 flex items-center justify-center z-20">
                        <span className="text-xs font-800 gradient-text leading-none">{i + 1}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-250">
                    <div className="text-xs font-800 text-blue-400 dark:text-blue-500 tracking-widest uppercase mb-2">
                      {t('process.stepLabel')} {num}
                    </div>
                    <h3 className="text-base font-700 text-gray-900 dark:text-white mb-3 leading-snug">
                      {s.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                      {s.desc}
                    </p>
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-500">{s.detail}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
