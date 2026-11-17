/**
 * Configuration unique du site.
 *
 * `commercial: false` → portfolio technique personnel.
 *   Aucune offre de service, aucun statut d'entreprise : publié sans SIRET.
 *
 * `commercial: true` → vitrine d'entreprise (Polaris).
 *   Active la section Studio, la méthode, le statut légal et les mentions complètes.
 *   À basculer le jour où le SIRET existe — c'est la seule ligne à changer.
 */
export const SITE = {
  commercial: false,

  brandBusiness: 'Polaris',
  brandTaglineBusiness: { fr: 'Studio d\'automatisation', en: 'Automation studio' },
  brandTaglinePersonal: { fr: 'Portfolio technique', en: 'Technical portfolio' },

  owner: 'Tibério Konate',
  domain: 't-konate.dev',
  url: 'https://t-konate.dev',
  email: 'tiberio.konatepro@gmail.com',
  github: 'https://github.com/TKonate',
  linkedin: 'https://www.linkedin.com/in/tiberio-konate',
  location: { fr: 'Paris · à distance', en: 'Paris · remote' },

  legal: {
    status: { fr: 'Auto-entrepreneur · code APE 6201Z', en: 'Sole trader · APE code 6201Z' },
    // Renseigner avant de passer commercial à true.
    siret: '',
    address: '',
  },
} as const;

/** Nom affiché : la marque en mode entreprise, la personne sinon. */
export const BRAND = SITE.commercial ? SITE.brandBusiness : SITE.owner;

export const TAGLINE = SITE.commercial
  ? SITE.brandTaglineBusiness
  : SITE.brandTaglinePersonal;

export const STATUS_LINE = SITE.commercial
  ? SITE.legal.status
  : { fr: 'Site personnel', en: 'Personal site' };
