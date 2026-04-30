# WormholeDev

Landing page for WormholeDev, a bilingual software development services site built with React, Vite, Tailwind CSS, Framer Motion, and i18next.

The site includes a Vercel API route for contact form submissions. Messages are sent through Brevo Transactional Email and delivered to the configured WormholeDev inbox.

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Framer Motion
- i18next / react-i18next
- Vercel Functions
- Brevo Transactional Email API
- Jest

## Requirements

- Node.js 22 or newer
- npm
- A Brevo API key with a verified sender/domain

## Environment Variables

Copy `.env.example` to `.env` for local development:

```env
BREVO_API_KEY=your_brevo_api_key
CONTACT_TO_EMAIL=info@wormholedev.space
CONTACT_FROM_EMAIL=info@wormholedev.space
CONTACT_FROM_NAME=WormholeDev
SITE_KEY=your_cloudflare_turnstile_site_key
TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret_key
```

Configure the same variables in Vercel under Project Settings > Environment Variables.

## Development

Install dependencies:

```bash
npm install
```

Run the frontend only:

```bash
npm run dev
```

Run the app with Vercel API routes:

```bash
npx vercel dev
```

Use `vercel dev` when testing the contact form, because Vite alone does not serve `/api/contact`.

## Contact API

The contact form posts to:

```text
POST /api/contact
```

The API validates required fields, uses a hidden honeypot field for basic spam filtering, and sends the message through Brevo. The visitor email is set as `replyTo` so replies go directly to the person who submitted the form while the sender remains the verified WormholeDev address.

## Form Security

The contact form uses several layers of protection:

- Cloudflare Turnstile challenge on the frontend
- Server-side Turnstile token verification before sending email
- Hidden honeypot field for simple bot filtering
- Basic per-IP rate limiting in the Vercel function
- Server-side validation for required fields and email format

The Turnstile site key is public and can be exposed to the browser. The Turnstile secret key must stay private in Vercel environment variables.

## Scripts

```bash
npm run dev       # Start Vite dev server
npm run build     # Build production assets
npm run lint      # Run ESLint
npm test          # Run Jest tests
npm run preview   # Preview the production build locally
```

## Deployment

The project is designed for Vercel. After pushing to GitHub, Vercel can build the React app and deploy the `/api/contact` function automatically.

Before promoting to production, confirm:

- Brevo sender/domain is verified
- Cloudflare Turnstile site key and secret key are configured
- Vercel environment variables are set
- `npm test`, `npm run lint`, and `npm run build` pass
