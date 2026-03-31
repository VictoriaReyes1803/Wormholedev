import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Sparkles, Code2, Smartphone, Brain } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
})

const floatAnim = (delay = 0) => ({
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3.5, delay, repeat: Infinity, ease: 'easeInOut' },
  },
})

export default function Hero() {
  const { t } = useTranslation()

  const floatingCards = [
    { icon: Code2, label: t('nav.services'), sub: t('hero.cardBuilt'), color: 'from-blue-500 to-blue-600', delay: 0, pos: 'top-12 right-0 lg:right-8' },
    { icon: Smartphone, label: 'Mobile Apps', sub: 'iOS & Android', color: 'from-cyan-500 to-cyan-600', delay: 0.15, pos: 'top-36 right-4 lg:right-24' },
    { icon: Brain, label: 'AI Solutions', sub: t('hero.badge'), color: 'from-violet-500 to-violet-600', delay: 0.3, pos: 'top-60 right-0 lg:right-4' },
  ]

  const handleScroll = (href) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-950 pt-16">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-blue-100/60 dark:bg-blue-900/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-100/50 dark:bg-cyan-900/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-100/30 dark:bg-violet-900/10 blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(90deg, #1e40af 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: copy */}
          <div className="max-w-xl">
            <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-400 text-sm font-medium mb-6">
              <Sparkles size={14} />
              {t('hero.badge')}
            </motion.div>

            <motion.h1 {...fadeUp(0.2)} className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-900 leading-[1.05] tracking-tight text-gray-900 dark:text-white mb-6">
              {t('hero.headline1')}{' '}
              <span className="gradient-text">{t('hero.headline2')}</span>{' '}
              {t('hero.headline3')}{' '}
              <span className="gradient-text">{t('hero.headline4')}</span>
            </motion.h1>

            <motion.p {...fadeUp(0.3)} className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8 font-400">
              {t('hero.sub')}
            </motion.p>

            <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleScroll('#contact')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 gradient-bg text-white font-600 rounded-xl shadow-lg shadow-blue-500/25 hover:opacity-90 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200 text-base"
              >
                {t('hero.ctaPrimary')}
                <ArrowRight size={17} />
              </button>
              <button
                onClick={() => handleScroll('#services')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-600 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 hover:-translate-y-0.5 transition-all duration-200 text-base"
              >
                {t('hero.ctaSecondary')}
              </button>
            </motion.div>

            <motion.div {...fadeUp(0.5)} className="mt-12 flex flex-wrap gap-8">
              {[
                { val: t('hero.stat1Val'), label: t('hero.stat1Label') },
                { val: t('hero.stat2Val'), label: t('hero.stat2Label') },
                { val: t('hero.stat3Val'), label: t('hero.stat3Label') },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-800 gradient-text">{s.val}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-400">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: floating cards */}
          <div className="relative hidden lg:block h-[480px]">
            {floatingCards.map((card) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + card.delay, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute ${card.pos}`}
                >
                  <motion.div {...floatAnim(card.delay)}>
                    <div className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-2xl px-5 py-4 shadow-xl dark:shadow-gray-900/60 border border-gray-100 dark:border-gray-800">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-700 text-gray-900 dark:text-white">{card.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{card.sub}</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                <div className="w-64 h-64 rounded-3xl gradient-bg opacity-10 dark:opacity-20 blur-2xl absolute inset-0" />
                <div className="relative w-64 h-64 rounded-3xl border border-blue-200 dark:border-blue-800/60 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center mx-auto shadow-xl mb-4">
                      <Code2 size={40} className="text-white" />
                    </div>
                    <div className="text-sm font-600 text-gray-700 dark:text-gray-300">{t('hero.cardBuilt')}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400"
      >
        <span className="text-xs tracking-widest uppercase font-500">{t('hero.scrollLabel')}</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  )
}
