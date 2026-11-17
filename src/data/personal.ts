/** Contenu propre au mode « portfolio personnel » (commercial: false). */
export const personal = {
  fr: {
    meta: {
      title: 'Tibério Konate · Projets, systèmes auto-hébergés et IA locale',
      description:
        "Étudiant en informatique et électronique. Agents IA auto-hébergés, outils Python, outillage de sécurité : des projets publics, testés et documentés.",
    },
    hero: {
      kicker: 'Portfolio · Systèmes, IA locale, outillage',
      title: 'Je construis des systèmes que je fais tourner moi-même.',
      lead:
        "Étudiant en informatique et électronique. Agents IA multi-profils, routage de modèles, cybersécurité et benchmarks sur du matériel modeste. Tout ce qui est ici est public, testé et documenté, pas des slides.",
      ctaPrimary: 'Voir mes projets',
      ctaSecondary: 'Me contacter',
      badges: ['Code et documentation publics', 'Projets testés en conditions réelles', 'Réponse sous 24 h'],
    },
    contact: {
      title: 'Me contacter',
      intro:
        "Une question sur un projet, une idée de collaboration, un retour à me faire ? Écris-moi, je réponds sous 24 h.",
    },
  },
  en: {
    meta: {
      title: 'Tibério Konate · Projects, self-hosted systems and local AI',
      description:
        'Computer science and electronics student. Self-hosted AI agents, Python tooling, security work: public, tested and documented projects.',
    },
    hero: {
      kicker: 'Portfolio · Systems, local AI, tooling',
      title: 'I build systems I run myself.',
      lead:
        'Computer science and electronics student. Multi-profile AI agents, model routing, cybersecurity and benchmarks on modest hardware. Everything here is public, tested and documented, not slides.',
      ctaPrimary: 'See my projects',
      ctaSecondary: 'Get in touch',
      badges: ['Public code and documentation', 'Projects tested for real', 'Reply within 24h'],
    },
    contact: {
      title: 'Get in touch',
      intro:
        'A question about a project, an idea for collaboration, feedback to share? Write to me, I reply within 24h.',
    },
  },
} as const;
