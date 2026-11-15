# t-konate.dev — Polaris

Public showcase for a one-person automation studio: Python automation, API
connectors, n8n workflows and self-hosted AI systems. Bilingual (FR/EN) static
site, no CMS, no database.

**Live:** https://t-konate.dev

## Stack

- [Astro](https://astro.build) 5 — static output, zero client framework
- TypeScript for content and configuration
- Cloudflare Pages for hosting; one Pages Function (`/api/contact`) for the form
- Resend for transactional email (optional — the form falls back to `mailto:`)

## Structure

```
src/
├── site.config.ts        brand, contact, legal identifiers (single source of truth)
├── data/
│   ├── copy.ts           all page copy, FR and EN
│   └── projects.ts       project cards shown on the site
├── layouts/Base.astro    <head>, SEO, JSON-LD, header/footer
├── components/           Header, Footer, HomePage, ContactForm
├── pages/
│   ├── index.astro       FR home
│   ├── en/index.astro    EN home
│   └── mentions-legales.astro
└── styles/global.css     design tokens + components, no CSS framework
functions/api/contact.ts  Cloudflare Pages Function (form handler)
```

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
```

To exercise the contact endpoint locally:

```bash
npm run build
npx wrangler pages dev dist --port 8788 --binding RESEND_API_KEY=dummy
```

## Editing content

- **Copy (services, process, about)**: `src/data/copy.ts`, one object per language.
- **Projects**: `src/data/projects.ts`. Keep entries limited to public,
  verifiable repositories.
- **Brand name, email, links**: `src/site.config.ts`.
- **Legal identifiers**: `SITE.legal` in `src/site.config.ts`. The site shows a
  visible reminder on the legal page while `siret` or `address` is empty.

## Deployment (Cloudflare Pages)

1. Create a Pages project connected to this repository.
2. Build command `npm run build`, output directory `dist`.
3. Environment variables: `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`.
4. Custom domain `t-konate.dev` — do not remove the existing DNS records that
   serve the homelab subdomains.

Without `RESEND_API_KEY` the endpoint answers `503` and the front end shows a
`mailto:` fallback — the form never silently drops a message.

## Themes and accessibility

- Colour tokens live in `src/styles/tokens.css`: dark by default, light when the
  system asks for it (`prefers-color-scheme`), plus a manual toggle in the header
  (auto → light → dark, persisted in `localStorage`).
- Every text/background pair is checked against WCAG AA:
  `python3 scripts/check-contrast.py` (fails with a non-zero exit code).
- Full WCAG 2.0/2.1/2.2 A+AA audit with axe-core, on the built site:

  ```bash
  npm run build
  cp node_modules/axe-core/axe.min.js dist/axe.min.js
  npx astro preview    # then run axe from the browser console or CDP
  ```

  Last run: 0 violations on all pages, both themes.
- Keyboard: skip link, visible focus ring, `aria-current` on the active section,
  44px minimum touch targets, `prefers-reduced-motion` respected.
- Illustrations are inline SVG (`src/data/art.ts`), themed by CSS variables, and
  marked `aria-hidden` — purely decorative, no network request.

## Notes

- No cookies, no analytics, no third-party font or script CDN.
- Fonts are the system stack: nothing is fetched from a foreign origin.
