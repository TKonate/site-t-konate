/**
 * Single source of site identity and of the mode switch.
 *
 * `commercial: false` means a personal technical portfolio: no service offer, no
 * company status, published without a SIRET.
 *
 * `commercial: true` means a company showcase (Polaris): it turns on the Studio
 * section, the method, the legal status and the full legal notice. Flip it the day
 * the SIRET exists; it is the only line that needs to change.
 *
 * `url` names the apex, not www. The static site is served from www.t-konate.dev
 * while the apex answers 301 to www (decision D16, deploy/cloudflare/). Every
 * canonical, hreflang and sitemap URL is derived from this value, so it is the one
 * place where that choice is made.
 */
export const SITE = {
  commercial: false,

  brandBusiness: 'Polaris',
  brandTaglineBusiness: { fr: 'Studio d\'automatisation', en: 'Automation studio' },
  brandTaglinePersonal: { fr: 'Portfolio technique', en: 'Technical portfolio' },

  owner: 'Tibério Konate',
  domain: 't-konate.dev',
  url: 'https://t-konate.dev',
  email: 'contact@t-konate.dev',
  github: 'https://github.com/TKonate',
  linkedin: 'https://www.linkedin.com/in/tiberio-konate',
  location: { fr: 'Paris · à distance', en: 'Paris · remote' },

  legal: {
    status: { fr: 'Auto-entrepreneur · code APE 6201Z', en: 'Sole trader · APE code 6201Z' },
    // Fill both in before switching commercial to true; the legal notice shows a
    // warning while they are empty.
    siret: '',
    address: '',
  },
} as const;

/** Displayed name: the brand in commercial mode, the person otherwise. */
export const BRAND = SITE.commercial ? SITE.brandBusiness : SITE.owner;

export const TAGLINE = SITE.commercial
  ? SITE.brandTaglineBusiness
  : SITE.brandTaglinePersonal;

export const STATUS_LINE = SITE.commercial
  ? SITE.legal.status
  : { fr: 'Site personnel', en: 'Personal site' };
