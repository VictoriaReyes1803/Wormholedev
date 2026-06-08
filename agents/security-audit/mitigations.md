# Prioritized Mitigation Plan — WormholeDev

**Date:** 2026-04-29
**Ordered by:** Risk (Critical first, then High, Medium, Low)

---

## IMMEDIATE ACTION REQUIRED (Before next deploy)

---

### M-01 — Rotate Brevo API Key [Critical — FINDING-01]

**Risk:** Exposed Brevo API key in git stash allows full Brevo account takeover
**Effort:** 5 minutes

Steps:
1. Go to https://app.brevo.com/settings/keys/api
2. Delete / revoke the key starting with `xkeysib-f6b6e4cc49a...`
3. Create a new API key with the same permissions
4. In Vercel dashboard → Project Settings → Environment Variables, update `BREVO_API_KEY` with the new key
5. Redeploy (or the new env var takes effect on next serverless cold start)
6. Locally: `git stash drop stash@{0}`
7. Locally: `git gc --prune=now --aggressive`
8. Verify the old key no longer works: attempt a test API call to Brevo with the old key — expect 401

---

### M-02 — Set TURNSTILE_SECRET_KEY in Vercel Production [High — FINDING-02]

**Risk:** Without this env var, Turnstile bot protection is completely skipped
**Effort:** 5 minutes

Steps:
1. In Cloudflare dashboard, create a Turnstile widget if not already done
2. Copy the Secret Key from the Cloudflare Turnstile dashboard
3. In Vercel dashboard → Project Settings → Environment Variables:
   - Add `TURNSTILE_SECRET_KEY` with the Cloudflare secret key value
   - Add `SITE_KEY` (or `TURNSTILE_SITE_KEY`) with the Cloudflare site key value
4. Verify the widget appears on the contact form in production

Optional code hardening in `api/contact.js` (prevents silent failure):
```javascript
// After line 101 (const turnstileSecret = getTurnstileSecret())
if (!turnstileSecret) {
  console.error('CRITICAL: TURNSTILE_SECRET_KEY not configured')
  return json(res, 503, { message: 'Contact form temporarily unavailable' })
}
```

---

## HIGH PRIORITY (Complete within 1 week)

---

### M-03 — Create vercel.json with Security Headers [Medium — FINDING-03]

**Risk:** No clickjacking protection, no CSP, no MIME-sniffing protection
**Effort:** 15 minutes

Create `vercel.json` at the project root:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "https://wormholedev.space" },
        { "key": "Access-Control-Allow-Methods", "value": "POST, GET, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type" }
      ]
    }
  ]
}
```

**Important:** The CSP `script-src` includes `https://challenges.cloudflare.com` to allow the
Turnstile widget script dynamically injected in `Contact.jsx` lines 68-77. Without this, the
Turnstile widget would be blocked by the CSP.

**Testing:** After deploying, check browser DevTools Console and Network tab for CSP violations.

---

### M-04 — Add CRLF Stripping to Email Header Values [Medium — FINDING-05]

**Risk:** Theoretical email header injection via name field
**Effort:** 10 minutes
**File:** `api/contact.js`

Add a `headerSafe` helper after the existing `clean` function (after line 12):

```javascript
const headerSafe = value => clean(value).replace(/[\r\n\t]/g, ' ')
```

Then update lines 123 and 179-181:
```javascript
// Line 123 — change:
const cleanedName = clean(name)
// To:
const cleanedName = headerSafe(name)

// Lines 179-181 already use cleanedName, no other changes needed
// replyTo: { email: cleanedEmail, name: cleanedName }   <- now headerSafe
// subject: `New contact request from ${cleanedName}`  <- now headerSafe
```

---

### M-05 — Add Input Length Limits [Low — FINDING-07]

**Risk:** Unbounded field sizes, potential inbox flooding
**Effort:** 10 minutes
**File:** `api/contact.js`

After line 127 (the required field validation), add:

```javascript
if (cleanedName.length > 120) {
  return json(res, 400, { message: 'Name is too long (max 120 characters)' })
}
if (cleanedEmail.length > 254) {
  return json(res, 400, { message: 'Email address is too long' })
}
if (cleanedMessage.length > 5000) {
  return json(res, 400, { message: 'Message is too long (max 5000 characters)' })
}
if (clean(company).length > 200) {
  return json(res, 400, { message: 'Company name is too long' })
}
```

---

## MEDIUM PRIORITY (Complete within 1 month)

---

### M-06 — Replace In-Memory Rate Limiter with Persistent Store [Medium — FINDING-04]

**Risk:** Rate limit bypassable under parallel serverless invocations
**Effort:** 2-3 hours
**Prerequisites:** Vercel KV add-on enabled on the project

Install the Vercel KV client:
```
npm install @vercel/kv
```

Replace the Map-based rate limiter with:
```javascript
import { kv } from '@vercel/kv'

const isRateLimited = async ip => {
  const key = `rl:${ip}`
  const count = await kv.incr(key)
  if (count === 1) {
    await kv.expire(key, 60)  // expire after 60 seconds
  }
  return count > RATE_LIMIT_MAX
}
// Note: handler must also be updated to await isRateLimited(clientIp)
```

Alternative: Use Cloudflare WAF rate-limiting rules at the edge — no code changes required.

---

### M-07 — Standardize Env Var Names, Remove Fallback Chain [Low — FINDING-08]

**Risk:** Silent misconfiguration masking
**Effort:** 15 minutes
**Files:** `api/contact.js` lines 47-51, `api/security-config.js` lines 9-14

In `api/contact.js`, replace:
```javascript
const getTurnstileSecret = () =>
  process.env.TURNSTILE_SECRET_KEY
  || process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
  || process.env.secret_key
  || process.env.SECRET_KEY
```
With:
```javascript
const getTurnstileSecret = () => process.env.TURNSTILE_SECRET_KEY || null
```

In `api/security-config.js`, replace:
```javascript
const turnstileSiteKey =
  clean(process.env.TURNSTILE_SITE_KEY)
  || clean(process.env.CLOUDFLARE_TURNSTILE_SITE_KEY)
  || clean(process.env.site_key)
  || clean(process.env.SITE_KEY)
```
With:
```javascript
const turnstileSiteKey = clean(process.env.TURNSTILE_SITE_KEY)
```

Update `.env.example` and Vercel environment variables to use the canonical names.

---

## LOW PRIORITY (Good practices to implement over time)

---

### M-08 — Install a Pre-Commit Secret Scanner [Critical prevention — FINDING-01]

**Risk:** Prevents future accidental secret commits
**Effort:** 30 minutes (one-time setup)

```
npm install --save-dev @gitguardian/ggshield
# or
brew install gitleaks  # macOS
```

Add to `.git/hooks/pre-commit`:
```bash
#!/bin/sh
gitleaks protect --staged --redact
```

Or use `detect-secrets` with a baseline file.

---

### M-09 — Add Structured Access Logging [Informational — FINDING-10]

**Risk:** Cannot detect or investigate abuse after the fact
**Effort:** 30 minutes
**File:** `api/contact.js`

Add structured logging on successful submission (after line 197, before the final return):
```javascript
// Before: return json(res, 200, { ok: true })
const crypto = require('crypto')
const ipHash = crypto.createHash('sha256').update(clientIp).digest('hex').slice(0, 12)
console.info(JSON.stringify({
  event: 'contact_submitted',
  ts: new Date().toISOString(),
  ip_hash: ipHash,
  turnstile: !!turnstileSecret,
}))
return json(res, 200, { ok: true })
```

---

### M-10 — Add CI Lint Rule for Locale File HTML Purity [Low — FINDING-06]

**Risk:** Future developer accidentally adds HTML to locale files, enabling XSS via Trans component
**Effort:** 15 minutes

Add to `package.json` scripts:
```json
"lint:locales": "node -e \"const en=require('./src/locales/en.js'); const es=require('./src/locales/es.js'); const check=v=>typeof v==='string'&&(v.includes('<')||v.includes('>'))&&process.exit(1); JSON.stringify(en+JSON.stringify(es)).split('').forEach(()=>{})\" "
```

Or more simply, add a test in `api/contact.test.js` or a dedicated locale test file that asserts
no HTML in any locale string value.

---

### M-11 — Move Phone Number to Locale Files [Informational — FINDING-13]

**Risk:** Maintainability — not a security issue
**Effort:** 10 minutes
**Files:** `src/components/Contact.jsx` line 189, `src/components/Footer.jsx` line 108

Move hardcoded contact info to `en.js` and `es.js` under a `contact` key for easier future updates.

---

## Summary Checklist

| Priority | Action | Finding | Status |
|----------|--------|---------|--------|
| Immediate | Rotate Brevo API key | FINDING-01 | TODO |
| Immediate | Set TURNSTILE_SECRET_KEY in Vercel | FINDING-02 | TODO |
| Week 1 | Create vercel.json with security headers | FINDING-03 | TODO |
| Week 1 | Add CRLF stripping to headerSafe() | FINDING-05 | TODO |
| Week 1 | Add input length limits | FINDING-07 | TODO |
| Month 1 | Replace in-memory rate limiter with @vercel/kv | FINDING-04 | TODO |
| Month 1 | Standardize env var names | FINDING-08 | TODO |
| Ongoing | Install pre-commit secret scanner | FINDING-01 prevention | TODO |
| Ongoing | Add structured access logging | FINDING-10 | TODO |
| Ongoing | Add CI locale HTML lint | FINDING-06 | TODO |
