import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Zap, Target, Heart, Globe, Code2, Sparkles } from 'lucide-react'
import { floatAnim } from '../lib/animations.js'

const valueIcons = [Target, Heart, Zap, Globe]
const valueGradients = [
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500',
]

export default function About() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const values = t('about.values', { returnObjects: true })

  return (
    <section id="about" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left: text + value chips */}
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

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-8"
            >
              {t('about.p1')}
            </motion.p>

            {/* Value chips */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="grid grid-cols-2 gap-3"
            >
              {values.map((v, i) => {
                const Icon = valueIcons[i]
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-800"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${valueGradients[i]} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={15} className="text-white" />
                    </div>
                    <span className="text-sm font-600 text-gray-800 dark:text-gray-200">{v.label}</span>
                  </div>
                )
              })}
            </motion.div>
          </div>

          {/* Right: product/code illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 24 }}
            animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-80 lg:h-[420px] rounded-3xl overflow-hidden"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 gradient-bg opacity-90" />
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)' }}
            />

            {/* Browser mockup */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="w-full max-w-xs bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/20 shadow-2xl">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3 bg-white/10 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-white/40" />
                  <div className="w-3 h-3 rounded-full bg-white/40" />
                  <div className="w-3 h-3 rounded-full bg-white/40" />
                  <div className="flex-1 mx-3 h-4 bg-white/20 rounded-full" />
                </div>
                {/* Content lines */}
                <div className="p-5 space-y-2.5">
                  <div className="h-3 bg-white/40 rounded-full w-2/3" />
                  <div className="h-3 bg-white/25 rounded-full w-full" />
                  <div className="h-3 bg-white/25 rounded-full w-4/5" />
                  <div className="h-3 bg-white/15 rounded-full w-1/2 mb-4" />
                  <div className="h-20 bg-white/10 rounded-xl" />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="h-10 bg-white/15 rounded-xl" />
                    <div className="h-10 bg-white/20 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent elements */}
            <motion.div {...floatAnim(0)} className="absolute top-8 right-8">
              <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-lg backdrop-blur-sm">
                <Code2 size={19} className="text-white" />
              </div>
            </motion.div>
            <motion.div {...floatAnim(0.6)} className="absolute bottom-10 left-8">
              <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-lg backdrop-blur-sm">
                <Sparkles size={19} className="text-white" />
              </div>
            </motion.div>
            <motion.div {...floatAnim(1.1)} className="absolute top-1/2 left-6">
              <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <Zap size={14} className="text-white" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
