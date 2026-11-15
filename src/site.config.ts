/**
 * Configuration unique du site.
 * Changer le nom de la marque (Polaris) = changer `brand` ici, rien d'autre.
 */
export const SITE = {
  brand: 'Polaris',
  brandTagline: { fr: 'Studio d\'automatisation', en: 'Automation studio' },
  owner: 'Tibério Konate',
  domain: 't-konate.dev',
  url: 'https://t-konate.dev',
  email: 'tiberio.konatepro@gmail.com',
  github: 'https://github.com/TKonate',
  linkedin: 'https://www.linkedin.com/in/tiberio-konate',
  location: { fr: 'Paris · à distance', en: 'Paris · remote' },
  // Renseigner avant publication publique. Vide = non affiché.
  legal: {
    status: { fr: 'Auto-entrepreneur — code APE 6201Z', en: 'Sole trader — APE code 6201Z' },
    siret: '',
    address: '',
  },
} as const;
