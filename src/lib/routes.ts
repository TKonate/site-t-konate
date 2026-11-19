/**
 * Route table: the single source of truth for internal links.
 *
 * Every path ends with a slash because the build emits directories
 * (/projets/alfred/index.html). A link written without it costs a redirect hop
 * on Cloudflare Pages, and hreflang alternates must match the canonical form
 * character for character.
 *
 * Slugs are shared across languages: a project is /projets/alfred/ and
 * /en/projects/alfred/, and only the section segment is translated.
 */
export type Lang = 'fr' | 'en';

export const routes = {
  home: { fr: '/', en: '/en/' },
  projects: { fr: '/projets/', en: '/en/projects/' },
  about: { fr: '/a-propos/', en: '/en/about/' },
  contact: { fr: '/contact/', en: '/en/contact/' },
  writing: { fr: '/ecrits/', en: '/en/writing/' },
  // Not translated: the legal notice exists in French only, and both languages
  // link to it. The sitemap relies on this equality to emit no alternate.
  legal: { fr: '/mentions-legales/', en: '/mentions-legales/' },
  project: (slug: string) => ({ fr: `/projets/${slug}/`, en: `/en/projects/${slug}/` }),
  article: (slug: string) => ({ fr: `/ecrits/${slug}/`, en: `/en/writing/${slug}/` }),
} as const;

export const sectionLabels = {
  fr: { projects: 'Projets', about: 'Profil', contact: 'Contact', writing: 'Écrits', home: 'Accueil' },
  en: { projects: 'Projects', about: 'Profile', contact: 'Contact', writing: 'Writing', home: 'Home' },
} as const;
