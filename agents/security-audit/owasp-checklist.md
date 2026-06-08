# OWASP Top 10 Checklist — WormholeDev

**Date:** 2026-04-29
**Reference:** OWASP Top 10:2021

| # | Category | Status | Notes |
|---|----------|--------|-------|
| A01 | Broken Access Control | **PASS** | No access control needed — public page. API rejects non-POST methods (405). No admin routes. |
| A02 | Cryptographic Failures | **FAIL** | Live Brevo API key committed to local git stash (FINDING-01). No TLS issues found (Vercel enforces HTTPS). No client-side secrets found in JS bundles. |
| A03 | Injection | **PASS with notes** | HTML injection: all user content passed to email body is run through escapeHtml() (api/contact.js lines 14-25). XSS: no dangerouslySetInnerHTML in any component. SQL: no database. Email header injection: partially addressed — escapeHtml() is applied but CRLF not stripped from name used in subject/replyTo.name (FINDING-05, Medium). |
| A04 | Insecure Design | **PARTIAL FAIL** | Rate limiter is in-memory and ineffective in serverless (FINDING-04). Turnstile is optional by design — if env var absent, bot protection silently disabled (FINDING-02). No input length limits (FINDING-07). |
| A05 | Security Misconfiguration | **FAIL** | No vercel.json = no HTTP security headers (FINDING-03). No CORS restriction (FINDING-09). Ambiguous env var fallback chain masks misconfiguration (FINDING-08). |
| A06 | Vulnerable and Outdated Components | **PASS** | All direct runtime dependencies are current (React 19.2.4, Framer Motion 12.38, i18next 26.0.2). No known CVE-affected packages detected in dependency tree. See dependencies.md. |
| A07 | Identification and Authentication Failures | **N/A** | No authentication system — public landing page. Brevo API key is server-side only. Turnstile token is used as anti-bot measure. |
| A08 | Software and Data Integrity Failures | **PASS with notes** | package-lock.json is present (integrity enforced). No subresource integrity (SRI) on dynamically injected Turnstile script (Contact.jsx lines 68-77) — low risk as the script is from Cloudflare CDN. No unsigned releases or CI/CD pipeline visible. |
| A09 | Security Logging and Monitoring Failures | **FAIL** | Only console.error on failures. No access logging for successful submissions. No alerts on rate-limit breaches or repeated Turnstile failures. |
| A10 | Server-Side Request Forgery (SSRF) | **PASS** | All outbound fetch() calls use hardcoded constant URLs. No user-supplied URL is passed to any network call. |

---

## Detailed Notes by Category

### A01 — Broken Access Control
- The only API endpoint is POST /api/contact (public contact form). No admin routes, no protected resources.
- GET /api/security-config is intentionally public (returns non-secret site key).
- Method enforcement: contact.js line 87-90 rejects non-POST with 405. security-config.js line 3-5 rejects non-GET with 405.
- No broken access control risk in this architecture.

### A02 — Cryptographic Failures
- .env contains a live Brevo API key committed to git stash (Critical — FINDING-01).
- The key is NOT present in the remote repository HEAD or any remote branch. It is present in local git stash objects.
- No client-side secrets found. No sensitive data stored in localStorage (only theme preference 'wh-theme' and language 'wh-lang').
- Vercel enforces HTTPS on all deployments. No HTTP transport concerns.
- No cryptographic operations in application code.

### A03 — Injection
- **XSS:** No dangerouslySetInnerHTML usage in any component (confirmed by full source scan). React JSX rendering escapes all values. i18next escapeValue:false is safe in React context. Locale files contain no HTML.
- **HTML Injection in Email:** All user-submitted values passed to email HTML body go through escapeHtml() which escapes &, <, >, ", and '. Properly applied to all fields including optional company, service, budget.
- **Email Header Injection:** cleanedName is used in subject and replyTo.name without CRLF stripping (Medium — FINDING-05). Risk is low because Brevo processes these as JSON fields, not raw SMTP.
- **SQL Injection:** No database, no SQL queries anywhere. Not applicable.
- **Command Injection:** No child_process or exec calls. Not applicable.

### A04 — Insecure Design
- Rate limiting: present but architecturally limited (Medium — FINDING-04).
- Turnstile: conditionally applied, silently disabled when env var absent (High — FINDING-02).
- Honeypot: implemented correctly — website field checked before required field validation.
- No input length limits (Low — FINDING-07).
- No content-type validation on request body (Vercel handles this for JSON).

### A05 — Security Misconfiguration
- No vercel.json = no custom security headers (Medium — FINDING-03).
- No CORS restriction on API (Low — FINDING-09).
- Env var fallback chain (Low — FINDING-08).
- index.html has no X-Content-Type-Options or CSP meta tag.
- No server-side error details leaked to clients (all error responses return generic messages).

### A06 — Vulnerable and Outdated Components
- React 19.2.4: current stable release.
- Framer Motion 12.38.0: current.
- i18next 26.0.2: current.
- Vite 8.0.3: current (v8 is the latest major).
- Tailwind CSS 4.2.2: current.
- jest 30.3.0: current.
- No axios, lodash, express, or other historically CVE-prone packages in the dependency tree.
- punycode 2.3.1 is present (transitive dep) — marked deprecated in Node.js but no exploitable CVE.
- semver 6.3.1 is present (transitive dev dep) — patched version, no known CVE in this version.
- Full analysis in dependencies.md.

### A07 — Identification and Authentication Failures
- No authentication system exists (by design for a public landing page).
- Turnstile token is the anti-bot mechanism, conditionally applied.
- No session management, no cookies, no JWT.

### A08 — Software and Data Integrity Failures
- package-lock.json is present and committed: npm install uses locked versions with integrity hashes.
- The Turnstile script is injected dynamically without SRI hash (Contact.jsx lines 73-76). This means if Cloudflare CDN is compromised, the malicious script would execute. Practical risk is very low given Cloudflare reliability, but SRI would eliminate this theoretical risk.
- No CI/CD pipeline visible in the repository. No signing of releases observed.

### A09 — Security Logging and Monitoring Failures
- console.error called on: Brevo API failure (line 196), Turnstile verification error (line 81).
- No logging on: successful submissions, rate-limit trigger, repeated Turnstile failures, malformed requests.
- No structured log format, no SIEM integration, no alerting.

### A10 — Server-Side Request Forgery
- BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email' (constant, line 1)
- TURNSTILE_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify' (constant, line 2)
- No user input used in any fetch() URL. SSRF not possible.
