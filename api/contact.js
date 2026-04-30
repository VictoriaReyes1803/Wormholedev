const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { message: 'Method not allowed' })
  }

  const apiKey = process.env.BREVO_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL || 'info@wormholedev.space'
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'info@wormholedev.space'
  const fromName = process.env.CONTACT_FROM_NAME || 'WormholeDev'

  if (!apiKey) {
    return json(res, 500, { message: 'Email service is not configured' })
  }

  const {
    name,
    email,
    company,
    service,
    budget,
    message,
    website,
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

  const htmlContent = `
    <h2>New WormholeDev contact request</h2>
    ${fieldRow('Name', cleanedName)}
    ${fieldRow('Email', cleanedEmail)}
    ${fieldRow('Company', company)}
    ${fieldRow('Service', service)}
    ${fieldRow('Budget', budget)}
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
    `Budget: ${clean(budget) || '-'}`,
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
