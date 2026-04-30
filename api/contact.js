const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email'
const TURNSTILE_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 5
const rateLimit = new Map()

const json = (res, status, body) => {
  res.status(status).json(body)
}

const clean = value => String(value || '').trim()

const escapeHtml = value =>
  clean(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const fieldRow = (label, value) => {
  const safeValue = escapeHtml(value) || '-'
  return `<p><strong>${label}:</strong> ${safeValue}</p>`
}

const getClientIp = req =>
  clean(req.headers?.['cf-connecting-ip'])
  || clean(req.headers?.['x-forwarded-for']).split(',')[0]
  || clean(req.socket?.remoteAddress)
  || 'unknown'

const isRateLimited = ip => {
  const now = Date.now()
  const bucket = rateLimit.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS }

  if (now > bucket.resetAt) {
    bucket.count = 0
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS
  }

  bucket.count += 1
  rateLimit.set(ip, bucket)
  return bucket.count > RATE_LIMIT_MAX
}

const getTurnstileSecret = () =>
  process.env.TURNSTILE_SECRET_KEY
  || process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
  || process.env.secret_key
  || process.env.SECRET_KEY

const verifyTurnstile = async ({ token, remoteIp, secret }) => {
  if (!token) return false

  const body = new URLSearchParams({
    secret,
    response: token,
  })

  if (remoteIp && remoteIp !== 'unknown') {
    body.set('remoteip', remoteIp)
  }

  try {
    const response = await fetch(TURNSTILE_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    return data.success === true
  } catch (err) {
    console.error('Turnstile verification failed:', err)
    return false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { message: 'Method not allowed' })
  }

  const clientIp = getClientIp(req)
  if (isRateLimited(clientIp)) {
    return json(res, 429, { message: 'Too many requests. Please wait a minute and try again.' })
  }

  const apiKey = process.env.BREVO_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL || 'info@wormholedev.space'
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'info@wormholedev.space'
  const fromName = process.env.CONTACT_FROM_NAME || 'WormholeDev'
  const turnstileSecret = getTurnstileSecret()

  if (!apiKey) {
    return json(res, 500, { message: 'Email service is not configured' })
  }

  const {
    name,
    email,
    company,
    service,
    budgetCurrency,
    budget,
    message,
    website,
    turnstileToken,
  } = req.body || {}

  if (clean(website)) {
    return json(res, 200, { ok: true })
  }

  const cleanedName = clean(name)
  const cleanedEmail = clean(email).toLowerCase()
  const cleanedMessage = clean(message)

  if (!cleanedName || !EMAIL_RE.test(cleanedEmail) || !cleanedMessage) {
    return json(res, 400, { message: 'Please provide a valid name, email, and message' })
  }

  if (turnstileSecret) {
    const isHuman = await verifyTurnstile({
      token: clean(turnstileToken),
      remoteIp: clientIp,
      secret: turnstileSecret,
    })

    if (!isHuman) {
      return json(res, 403, { message: 'Security verification failed. Please try again.' })
    }
  }

  const htmlContent = `
    <h2>New WormholeDev contact request</h2>
    ${fieldRow('Name', cleanedName)}
    ${fieldRow('Email', cleanedEmail)}
    ${fieldRow('Company', company)}
    ${fieldRow('Service', service)}
    ${fieldRow('Budget currency', budgetCurrency)}
    ${fieldRow('Budget range', budget)}
    <hr />
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(cleanedMessage).replace(/\n/g, '<br />')}</p>
  `

  const textContent = [
    'New WormholeDev contact request',
    '',
    `Name: ${cleanedName}`,
    `Email: ${cleanedEmail}`,
    `Company: ${clean(company) || '-'}`,
    `Service: ${clean(service) || '-'}`,
    `Budget currency: ${clean(budgetCurrency) || '-'}`,
    `Budget range: ${clean(budget) || '-'}`,
    '',
    'Message:',
    cleanedMessage,
  ].join('\n')

  const brevoRes = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: fromName, email: fromEmail },
      to: [{ email: toEmail }],
      replyTo: { email: cleanedEmail, name: cleanedName },
      subject: `New contact request from ${cleanedName}`,
      htmlContent,
      textContent,
    }),
  })

  if (!brevoRes.ok) {
    let detail = 'Brevo request failed'
    try {
      const data = await brevoRes.json()
      detail = data.message || detail
    } catch {
      detail = await brevoRes.text()
    }

    console.error('Brevo contact email failed:', detail)
    return json(res, 502, { message: 'Could not send email' })
  }

  return json(res, 200, { ok: true })
}
