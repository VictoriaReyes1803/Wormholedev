# Dependency Security Review — WormholeDev

**Date:** 2026-04-29
**Tool:** Static analysis of package.json and package-lock.json
**Note:** This is a static analysis. For a live CVE scan, run: npm audit

---

## Direct Runtime Dependencies

| Package | Version in package.json | Resolved Version | Status |
|---------|--------------------------|------------------|--------|
| react | ^19.2.4 | 19.2.4 | Current stable — no known CVEs |
| react-dom | ^19.2.4 | 19.2.4 | Current stable |
| framer-motion | ^12.38.0 | 12.38.0 | Current |
| i18next | ^26.0.2 | 26.0.2 | Current |
| i18next-browser-languagedetector | ^8.2.1 | 8.2.1 | Current |
| react-i18next | ^17.0.1 | 17.0.1 | Current |
| lucide-react | ^1.7.0 | 1.7.0 | Current |
| tailwindcss | ^4.2.2 | 4.2.2 | Current (v4 is latest major) |
| @tailwindcss/vite | ^4.2.2 | 4.2.2 | Current |

**Assessment:** All direct runtime dependencies are at current versions. None have known CVEs.

---

## Direct Development Dependencies

| Package | Version in package.json | Resolved Version | Status |
|---------|--------------------------|------------------|--------|
| vite | ^8.0.1 | 8.0.3 | Current (v8 is latest major) |
| @vitejs/plugin-react | ^6.0.1 | 6.0.1 | Current |
| eslint | ^9.39.4 | 9.39.4 | Current |
| @eslint/js | ^9.39.4 | 9.39.4 | Current |
| eslint-plugin-react | ^7.37.5 | 7.37.5 | Current |
| eslint-plugin-react-hooks | ^7.0.1 | 7.0.1 | Current |
| eslint-plugin-react-refresh | ^0.5.2 | 0.5.2 | Current |
| globals | ^17.4.0 | 17.4.0 | Current |
| jest | ^30.3.0 | 30.3.0 | Current |

---

## Notable Transitive Dependencies

| Package | Version | Notes |
|---------|---------|-------|
| semver | 6.3.1 | Transitive (via build tools). semver < 7.5.2 had CVE-2022-25883 (ReDoS). Version 6.3.1 is NOT in the affected range of that CVE (which affected 7.x only). No known CVE in 6.3.1. |
| nanoid | 3.3.11 | Transitive (via Vite/PostCSS). Current in 3.x branch. nanoid < 3.1.31 had CVE-2021-23566 (predictable IDs). Version 3.3.11 is well past that fix. No known CVE. |
| punycode | 2.3.1 | Transitive dep. Deprecated in Node.js built-in module (not this npm package). The npm punycode package itself has no known CVEs. Low risk. |
| postcss | 8.5.8 | Transitive (Tailwind/Vite). postcss < 8.4.31 had CVE-2023-44270 (line return parsing). Version 8.5.8 is well past the fix. No known CVE. |
| lightningcss | 1.32.0 | Transitive (Tailwind CSS 4). Current. No known CVEs. |
| cross-spawn | 7.0.6 | Transitive (ESLint/Jest). cross-spawn < 7.0.5 had CVE-2024-21538 (ReDoS). Version 7.0.6 is patched. No CVE. |
| anymatch | 3.1.3 | Transitive (Jest/Chokidar). Current. No known CVEs. |

---

## Packages Not Present (Low Attack Surface)

The following commonly CVE-prone packages are NOT in the dependency tree:

- axios — not present (no HTTP client library used in frontend)
- lodash — not present
- express / body-parser — not present (Vercel runtime handles HTTP)
- multer / formidable — not present (no file uploads)
- node-fetch / got / superagent / request — not present (native fetch used)
- minimist — not present
- serialize-javascript — not present
- jsdom (except via jest-environment-jsdom) — only in test context
- sanitize-html / DOMPurify — not present (not needed; no HTML sanitization required)
- marked / showdown — not present (no markdown rendering)
- sharp / jimp — not present (no image processing)

---

## API Handler Dependencies

The `api/contact.js` and `api/security-config.js` serverless functions use only Node.js built-ins
and the global `fetch` API (Node.js 18+ built-in). No npm packages are imported in the API code.
This is the correct approach — minimal attack surface for the production-facing API.

---

## Recommendations

1. **Run `npm audit` regularly** — especially before deploying after dependency updates
2. **Enable Dependabot or Renovate** on the GitHub repository for automated dependency update PRs
3. **Pin exact versions** in production deployments (consider using exact versions instead of ^ ranges in package.json)
4. The dependency footprint is appropriately minimal for the project scope

---

## Summary

No currently known CVEs were identified in any resolved dependency version. All direct dependencies
are at their current stable versions. The transitive dependency tree is lean and dominated by
build tools (Vite, ESLint, Babel, PostCSS) which are not included in production deployments.
The production API code has zero npm dependencies — only built-in Node.js APIs.
