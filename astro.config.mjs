import { defineConfig } from 'astro/config';

/**
 * Build configuration.
 *
 * `site` is duplicated from src/site.config.ts on purpose: Astro needs an
 * absolute origin while compiling, and components need SITE.url at render time.
 * Both name the apex domain, not www. The site is served from www.t-konate.dev
 * while every canonical points at the apex, which answers 301 to www (decision
 * D16); editing this value rewrites every canonical, every hreflang and the
 * sitemap, so it is not a cosmetic change.
 *
 * `prefixDefaultLocale: false` serves French at the root and English under
 * /en/. Every path in src/lib/routes.ts follows that split, and so does
 * x-default in the layout.
 */
export default defineConfig({
  site: 'https://t-konate.dev',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
});
