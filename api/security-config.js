const clean = value => String(value || '').trim()

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const turnstileSiteKey =
    clean(process.env.TURNSTILE_SITE_KEY)
    || clean(process.env.CLOUDFLARE_TURNSTILE_SITE_KEY)
    || clean(process.env.site_key)
    || clean(process.env.SITE_KEY)

  return res.status(200).json({ turnstileSiteKey })
}
