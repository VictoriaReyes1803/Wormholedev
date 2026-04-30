# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server (frontend only, no API routes)
npx vercel dev    # Full dev environment including /api/* serverless functions
npm run build     # Production build to /dist
npm run preview   # Preview production build locally
npm run lint      # ESLint (flat config, ESLint 9)
npm test          # Jest with --experimental-vm-modules
```

To run a single test file:
```bash
node --experimental-vm-modules node_modules/.bin/jest api/contact.test.js
```

## Environment

Copy `.env.example` to `.env` and fill in:
- `BREVO_API_KEY` — Brevo transactional email API key
- `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` / `CONTACT_FROM_NAME` — email routing

## Architecture

**WormholeDev** is a bilingual (EN/ES) React SPA landing page for a software dev services company, deployed on Vercel.

### Frontend (`src/`)

Single-page app composed of sequential full-screen sections: Navbar → Hero → Services → WhyUs → Process → Solutions → About → Contact → Footer.

- **`App.jsx`** owns dark-mode state (persisted in `localStorage` as `wh-theme`, toggled via `dark` class on `<html>`). It passes `darkMode`/`toggleDarkMode` down to `Navbar`.
- **`i18n.js`** configures i18next with browser language detection; preference stored in `localStorage` as `wh-lang`. All UI strings live in `src/locales/en.js` and `src/locales/es.js`, keyed by section.
- Components use **Framer Motion** for scroll-triggered entrance animations and **Lucide React** for icons.
- Styling is **Tailwind CSS 4** — use `dark:` variants for theme-aware classes. Custom utilities `gradient-bg` and `gradient-text` are defined in `index.css`.

### API (`api/`)

Vercel serverless functions. Currently one route:

- **`POST /api/contact`** — validates form fields (name, email, message required; honeypot `website` field for spam), sanitizes inputs with HTML escaping, then calls Brevo's transactional email API to forward the contact request. Returns structured JSON errors for 400/405/500/502.

### Deployment

Vercel reads `api/` automatically for serverless functions and serves `dist/` as the static frontend. Push to `main` on GitHub triggers auto-deploy.
