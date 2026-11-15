/** Libellés des pages intérieures (index projets, page projet, à propos, contact). */
export const pages = {
  fr: {
    projects: {
      kicker: 'Travaux',
      title: 'Projets',
      intro:
        "Six projets, chacun avec sa page : le problème de départ, ce que j'ai réellement construit, et les points techniques qui ont demandé un arbitrage. Le code est public — vous pouvez vérifier plutôt que me croire.",
      count: (n: number) => `${n} projets`,
    },
    project: {
      back: 'Tous les projets',
      problem: 'Le problème',
      built: 'Ce que j’ai construit',
      highlights: 'Points techniques',
      stack: 'Stack',
      repo: 'Voir le dépôt',
      next: 'Projet suivant',
      statusWip: 'En cours',
      statusPublic: 'Public',
    },
    about: {
      kicker: 'Profil',
      title: 'À propos',
      sections: {
        approach: 'Approche',
        toolbox: 'Boîte à outils',
        elsewhere: 'Ailleurs',
      },
      toolbox: {
        langages: 'Langages',
        infra: 'Infrastructure',
        data: 'Données & IA',
        practice: 'Pratique',
      },
      linksIntro: 'Le code, les profils, et ce qui se passe en dehors des projets.',
    },
    contact: {
      kicker: 'Contact',
      title: 'Me contacter',
      intro:
        "Une question sur un projet, une idée de collaboration, un retour à me faire ? Écris-moi, je réponds sous 24 h.",
      links: 'Ailleurs',
    },
  },
  en: {
    projects: {
      kicker: 'Work',
      title: 'Projects',
      intro:
        'Six projects, each with its own page: the original problem, what I actually built, and the technical points that required a decision. The code is public — check it rather than take my word.',
      count: (n: number) => `${n} projects`,
    },
    project: {
      back: 'All projects',
      problem: 'The problem',
      built: 'What I built',
      highlights: 'Technical points',
      stack: 'Stack',
      repo: 'View repository',
      next: 'Next project',
      statusWip: 'In progress',
      statusPublic: 'Public',
    },
    about: {
      kicker: 'Profile',
      title: 'About',
      sections: {
        approach: 'Approach',
        toolbox: 'Toolbox',
        elsewhere: 'Elsewhere',
      },
      toolbox: {
        langages: 'Languages',
        infra: 'Infrastructure',
        data: 'Data & AI',
        practice: 'Practice',
      },
      linksIntro: 'The code, the profiles, and what happens outside of projects.',
    },
    contact: {
      kicker: 'Contact',
      title: 'Get in touch',
      intro:
        'A question about a project, an idea for collaboration, feedback to share? Write to me, I reply within 24h.',
      links: 'Elsewhere',
    },
  },
} as const;

/** Contenu de la section « Boîte à outils » de la page À propos. */
export const toolbox = {
  fr: {
    langages: ['Python', 'TypeScript', 'Bash', 'C', 'SQL'],
    infra: ['Linux', 'Docker', 'Cloudflare', 'systemd', 'Tailscale'],
    data: ['Ollama', 'llama.cpp', 'vLLM', 'n8n', 'RAG'],
    practice: ['Tests (pytest)', 'CI GitHub Actions', 'Git', 'Documentation'],
  },
  en: {
    langages: ['Python', 'TypeScript', 'Bash', 'C', 'SQL'],
    infra: ['Linux', 'Docker', 'Cloudflare', 'systemd', 'Tailscale'],
    data: ['Ollama', 'llama.cpp', 'vLLM', 'n8n', 'RAG'],
    practice: ['Tests (pytest)', 'CI GitHub Actions', 'Git', 'Documentation'],
  },
} as const;
