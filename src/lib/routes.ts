export type Lang = 'fr' | 'en';

/** Chemins des pages, par langue. Une seule source de vérité pour les liens. */
export const routes = {
  home: { fr: '/', en: '/en/' },
  projects: { fr: '/projets/', en: '/en/projects/' },
  about: { fr: '/a-propos/', en: '/en/about/' },
  contact: { fr: '/contact/', en: '/en/contact/' },
  legal: { fr: '/mentions-legales/', en: '/mentions-legales/' },
  project: (slug: string) => ({ fr: `/projets/${slug}/`, en: `/en/projects/${slug}/` }),
} as const;

export const sectionLabels = {
  fr: { projects: 'Projets', about: 'À propos', contact: 'Contact', home: 'Accueil' },
  en: { projects: 'Projects', about: 'About', contact: 'Contact', home: 'Home' },
} as const;
