import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'
import { SectionHeader } from './Services.jsx'

export default function Contact() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', budget: '', message: '', website: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const services = t('contact.services', { returnObjects: true })
  const budgets = t('contact.budgets', { returnObjects: true })
  const nextItems = t('contact.next', { returnObjects: true })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Contact request failed')
      }

      setSubmitted(true)
    } catch {
      setError(t('contact.form.error'))
      setStatus('idle')
    }
  }

  return (
    <section id="contact" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t('contact.badge')}
          title={<>{t('contact.title1')} <span className="gradient-text">{t('contact.title2')}</span></>}
          sub={t('contact.sub')}
        />

        <div ref={ref} className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h3 className="text-xl font-700 text-gray-900 dark:text-white mb-2">{t('contact.infoTitle')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t('contact.infoSub')}</p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email', value: 'info@wormholedev.space' },
                { icon: Phone, label: 'Phone', value: '+52 (871) 5349734' },
                { icon: MapPin, label: 'Location', value: t('contact.location') },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-600 text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</div>
                      <div className="text-sm font-500 text-gray-800 dark:text-gray-200">{item.value}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-3">
              <p className="text-xs font-700 text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('contact.nextTitle')}</p>
              {nextItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full min-h-[420px] bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-10 text-center"
              >
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-lg mb-5">
                  <CheckCircle2 size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-700 text-gray-900 dark:text-white mb-2">{t('contact.successTitle')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">{t('contact.successSub')}</p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-7 space-y-5"
              >
                <input
                  id="contact-website"
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-600 text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{t('contact.form.nameRequired')}</label>
                    <input
                      id="contact-name"
                      type="text" name="name" required value={form.name} onChange={handleChange}
                      placeholder="John Smith"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 dark:focus:border-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-600 text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{t('contact.form.email')}</label>
                    <input
                      id="contact-email"
                      type="email" name="email" required value={form.email} onChange={handleChange}
                      placeholder="john@company.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 dark:focus:border-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-company" className="block text-xs font-600 text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{t('contact.form.company')}</label>
                  <input
                    id="contact-company"
                    type="text" name="company" value={form.company} onChange={handleChange}
                    placeholder={t('contact.form.companyPlaceholder')}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 dark:focus:border-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-service" className="block text-xs font-600 text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{t('contact.form.service')}</label>
                    <select
                      id="contact-service"
                      name="service" value={form.service} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
                    >
                      <option value="">{t('contact.form.serviceDefault')}</option>
                      {services.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-budget" className="block text-xs font-600 text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{t('contact.form.budget')}</label>
                    <select
                      id="contact-budget"
                      name="budget" value={form.budget} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
                    >
                      <option value="">{t('contact.form.budgetDefault')}</option>
                      {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-600 text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{t('contact.form.message')}</label>
                  <textarea
                    id="contact-message"
                    name="message" required value={form.message} onChange={handleChange}
                    rows={4} placeholder={t('contact.form.messagePlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 dark:focus:border-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 text-center" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 gradient-bg text-white font-700 rounded-xl shadow-md shadow-blue-500/20 hover:opacity-90 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200"
                >
                  {status === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
                  <Send size={16} />
                </button>

                <p className="text-xs text-center text-gray-400 dark:text-gray-500">{t('contact.form.disclaimer')}</p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
