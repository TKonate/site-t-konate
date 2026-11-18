export type Lang = 'fr' | 'en';

/** Chemins des pages, par langue. Une seule source de vérité pour les liens. */
export const routes = {
  home: { fr: '/', en: '/en/' },
  projects: { fr: '/projets/', en: '/en/projects/' },
  about: { fr: '/a-propos/', en: '/en/about/' },
  contact: { fr: '/contact/', en: '/en/contact/' },
  writing: { fr: '/ecrits/', en: '/en/writing/' },
  legal: { fr: '/mentions-legales/', en: '/mentions-legales/' },
  project: (slug: string) => ({ fr: `/projets/${slug}/`, en: `/en/projects/${slug}/` }),
  article: (slug: string) => ({ fr: `/ecrits/${slug}/`, en: `/en/writing/${slug}/` }),
} as const;

export const sectionLabels = {
  fr: { projects: 'Projets', about: 'Profil', contact: 'Contact', writing: 'Écrits', home: 'Accueil' },
  en: { projects: 'Projects', about: 'Profile', contact: 'Contact', writing: 'Writing', home: 'Home' },
} as const;
