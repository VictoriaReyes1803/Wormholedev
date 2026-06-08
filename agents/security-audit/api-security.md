# API Security Deep-Dive — /api/contact

**Endpoint:** POST /api/contact
**File:** api/contact.js
**Secondary:** GET /api/security-config (api/security-config.js)
**Date:** 2026-04-29

---

## Endpoint Architecture

The `/api/contact` handler follows this flow:

1. Method check (405 if not POST)
2. IP extraction (cf-connecting-ip → x-forwarded-for → socket.remoteAddress)
3. In-memory rate limit check (5 req/60s per IP)
4. Environment variable validation (require BREVO_API_KEY)
5. Body destructuring (name, email, company, service, budgetCurrency, budget, message, website, turnstileToken)
6. Honeypot check (if website field non-empty, silently return 200)
7. Required field validation (name, email regex, message)
8. Optional Turnstile verification (only if TURNSTILE_SECRET_KEY set)
9. HTML email body construction (escapeHtml applied)
10. Brevo API call
11. Response

---

## Input Validation Analysis

### Required Fields

| Field | Validation Applied | Adequate? |
|-------|--------------------|-----------|
| name | clean() — trim only; non-empty check | Partial — no max length, no CRLF strip |
| email | clean() + EMAIL_RE regex + lowercase | Adequate for format; regex is permissive |
| message | clean() — trim only; non-empty check | Partial — no max length |

### Optional Fields (no validation beyond clean/trim)

| Field | Concern |
|-------|---------|
| company | No validation at all — passed to escapeHtml() for HTML body only |
| service | No validation — select-box on frontend but API accepts any string |
| budget | No validation — select-box on frontend but API accepts any string |
| budgetCurrency | No validation |
| website | Honeypot — non-empty triggers silent 200 without calling Brevo |
| turnstileToken | Passed to Turnstile API; clean() applied |

### Email Regex

```javascript
const EMAIL_RE = /^[^s@]+@[^s@]+.[^s@]+$/  // api/contact.js line 3
```

This is a permissive but functional format check. It accepts RFC-valid emails and rejects clear
garbage. It would accept some technically invalid formats but this is an acceptable tradeoff for UX.
No second-order risk from this regex itself.

### Missing Validation

- **No maximum field lengths** anywhere (FINDING-07)
- **No CRLF stripping** on fields used in email headers (FINDING-05)
- **No content-type check** on request body (relies on Vercel parsing)

---

## Rate Limiting Analysis

### Current Implementation

```javascript
const RATE_LIMIT_WINDOW_MS = 60 * 1000  // 1 minute
const RATE_LIMIT_MAX = 5
const rateLimit = new Map()
```

- Window: 60 seconds, sliding (bucket reset on new window, not true sliding window)
- Limit: 5 requests per IP per window
- Storage: module-level Map (in-process memory)
- IP extraction: cf-connecting-ip (Cloudflare) → x-forwarded-for → socket

### Serverless Limitation

In Vercel serverless, the Map is not shared across instances. Under concurrent load, effective
limit per IP is 5 × N (N = warm instances). This is architecturally insufficient as a primary
defense but acceptable as a secondary layer.

### IP Spoofing Risk

The handler trusts `x-forwarded-for` if `cf-connecting-ip` is absent. If the deployment is
not behind Cloudflare, an attacker can spoof the `x-forwarded-for` header by setting it to
an arbitrary value, bypassing the IP-based rate limit entirely.

Mitigation: Vercel injects its own `x-forwarded-for`. However, if the attacker can set this
header before Vercel processes it, there is a risk. This is a lower-concern issue when deployed
on Vercel directly (Vercel sanitizes headers), but should be noted.

---

## Spam / Abuse Vectors

### Vector 1: Turnstile Bypass (No Env Var)
- If TURNSTILE_SECRET_KEY is not set, the entire bot-check is skipped (FINDING-02)
- An automated script can submit the form at 5 req/60s/IP continuously
- With multiple IPs (VPN rotation, residential proxies), the cap is essentially removed

### Vector 2: Distributed Submission
- With Turnstile active and rate limiter in place, a bot using many different IPs can still submit
  multiple messages per minute (one per IP per minute minimum)
- Mitigation: Turnstile is the primary defense against this

### Vector 3: Honeypot Bypass
- The honeypot field is named `website` and has `class="hidden"` in the React form
- It has `tabIndex={-1}` and `autoComplete="off"` — these are correct attributes
- Risk: JavaScript-aware bots that parse the DOM would see this is a hidden field and skip it
- Mitigation: Turnstile provides defense where honeypot fails

### Vector 4: Large Payload
- No size limit on message field (FINDING-07)
- Vercel implicit 1 MB body limit provides a cap
- Brevo's own API limits provide another cap
- Risk is low but should be explicitly bounded in application code

### Vector 5: Email Relay / Spam Amplification
- The contact form sends one email per submission to the operator (info@wormholedev.space)
- Not a relay — it does not send email to the submitted email address
- The operator inbox could be flooded, but external recipients are not affected
- replyTo is set to the submitter's email — a malicious submission could cause a confused inbox
  manager to reply to a spoofed address, but this is a social engineering concern, not SMTP relay

---

## Email Injection Analysis

### HTML Body Construction

```javascript
const htmlContent = `
  <h2>New WormholeDev contact request</h2>
  ${fieldRow('Name', cleanedName)}     // escapeHtml() applied
  ${fieldRow('Email', cleanedEmail)}    // escapeHtml() applied
  ${fieldRow('Company', company)}       // escapeHtml() applied inside fieldRow
  ${fieldRow('Service', service)}       // escapeHtml() applied inside fieldRow
  ${fieldRow('Budget currency', budgetCurrency)} // escapeHtml() applied
  ${fieldRow('Budget range', budget)}   // escapeHtml() applied
  <p>${escapeHtml(cleanedMessage).replace(/\n/g, '<br />')}</p>
`
```

**HTML injection in email body: MITIGATED.** All user-supplied values go through `escapeHtml()`
which escapes the five critical HTML entities (&, <, >, ", '). This prevents XSS in the email
client rendering the HTML message body.

### Subject Line Construction

```javascript
subject: `New contact request from ${cleanedName}`,
```

`cleanedName` is run through `clean()` (trim) but NOT through `escapeHtml()` and NOT through a
CRLF-stripping function. A name containing `\r\n` could theoretically inject an SMTP header.
This is mitigated by Brevo transport-layer processing (FINDING-05 — Medium).

### Plain Text Body

```javascript
const textContent = [
  `Name: ${cleanedName}`,
  `Email: ${cleanedEmail}`,
  `Company: ${clean(company) || '-'}`,
  ...
  cleanedMessage,
].join('\n')
```

Plain text body also uses `cleanedName` directly without CRLF stripping. The `.join('\n')` call
already adds newlines between entries, but embedded newlines in user values could cause
misformatted entries (e.g., a name with a newline would appear as two lines in the text body).
This is a minor formatting concern rather than a security issue given Brevo JSON transport.

---

## Error Handling and Information Disclosure

### Error Responses

| Status | Message | Information Leak Risk |
|--------|---------|----------------------|
| 405 | "Method not allowed" | None |
| 429 | "Too many requests. Please wait a minute and try again." | Reveals rate limit mechanism |
| 500 | "Email service is not configured" | Reveals missing configuration |
| 400 | "Please provide a valid name, email, and message" | None |
| 403 | "Security verification failed. Please try again." | None |
| 502 | "Could not send email" | None |
| 200 | {"ok": true} | None |

The 500 message "Email service is not configured" reveals that BREVO_API_KEY is missing, which
could help an attacker understand the infrastructure. This is a very minor informational concern.

The Brevo error detail is logged to `console.error` (line 196) but NOT returned to the client —
the client always receives the generic "Could not send email" message. This is correct behavior.

### Exception Handling

Turnstile errors are caught (lines 80-83) and return `false` (treated as failed verification).
No stack traces or internal errors are exposed to clients.
The main handler has no try-catch wrapper — an unhandled exception from `fetch(BREVO_ENDPOINT,...)`
would cause Vercel to return a 500 with a platform error page, not exposing application internals.

---

## CORS Analysis

No CORS headers set in either API handler. Vercel default behavior allows cross-origin requests.
This means any website can POST to /api/contact from a visitor browser (FINDING-09 — Low).

For a contact form with no authentication cookies, the practical impact is:
- Cross-site form submission: any page can trigger a contact email submission
- The honeypot, rate limit, and Turnstile (when active) still apply
- Primary risk: a malicious website embedding the operator domain could submit spam via visitor browsers

---

## GET /api/security-config

This endpoint returns the Cloudflare Turnstile site key. Site keys are intentionally public
(they appear in the HTML page source for the Turnstile widget). The endpoint exists to avoid
hardcoding the site key in the static frontend build.

Security considerations:
- Returns non-secret data by design
- No rate limiting on this endpoint (low risk given it returns public data)
- Fallback to lowercase env var names (FINDING-08 — Low)
- No caching headers set (the key could be cached at CDN edge for performance)
