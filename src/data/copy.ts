export type Lang = 'fr' | 'en';

export const copy = {
  fr: {
    meta: {
      title: 'Polaris — Automatisation Python, connecteurs API et IA auto-hébergée',
      description:
        "Studio d'automatisation par Tibério Konate : scripts Python, connecteurs API, workflows n8n et systèmes d'IA auto-hébergés. Diagnostic gratuit, livrables testés et documentés.",
    },
    nav: { studio: 'Studio', projects: 'Projets', process: 'Méthode', about: 'À propos', contact: 'Contact' },
    hero: {
      kicker: 'Automatisation · Python · IA auto-hébergée',
      title: "J'automatise ce qui vous coûte du temps.",
      lead:
        "Développeur et étudiant en informatique & électronique. Je conçois des automatisations Python, des connecteurs entre vos outils et des systèmes d'IA qui tournent chez vous — livrés testés, documentés, et reprenables sans moi.",
      ctaPrimary: "Discuter d'un projet",
      ctaSecondary: 'Voir mes projets',
      badges: ['Diagnostic gratuit de 20 min', 'Réponse sous 24 h', 'Livrables testés'],
    },
    services: {
      title: 'Ce que je fais',
      intro:
        'Cinq familles de prestations. Aucune n’est un catalogue : chaque mission part d’un diagnostic du besoin réel.',
      items: [
        {
          title: 'Automatisations Python',
          body:
            "Scripts, traitements par lots, reporting récurrent. Ce qui vous prend deux heures par semaine tourne seul, avec des journaux lisibles et des erreurs qui se voient avant de casser quelque chose.",
          tag: 'Livraison : script + doc + tests',
        },
        {
          title: 'Connecteurs et synchronisation d’API',
          body:
            "Deux outils qui ne se parlent pas. J’écris le pont : extraction, transformation, réconciliation des données, reprise en cas d’échec. Sans dépendre d’un middleware opaque.",
          tag: 'REST, webhooks, files d’attente',
        },
        {
          title: 'Workflows n8n et orchestration',
          body:
            "Quand un outil visuel suffit, autant l’utiliser : n8n auto-hébergé pour la plomberie, du code seulement là où la logique métier l’exige. Vous gardez la main sur vos données.",
          tag: 'Auto-hébergé, pas de SaaS imposé',
        },
        {
          title: 'Systèmes d’IA auto-hébergés',
          body:
            "Modèles locaux, agents, recherche augmentée sur vos documents. Vos données ne partent pas chez un fournisseur, et le coût mensuel est prévisible au lieu d’être une facture à l’usage.",
          tag: 'Ollama, RAG, agents',
        },
        {
          title: 'Audit et conseil',
          body:
            "Cartographie de vos tâches répétitives, priorisation par gain réel, chiffrage honnête. Parfois la bonne réponse est : n’automatisez pas ça.",
          tag: 'Rapport priorisé, sans engagement',
        },
      ],
    },
    projects: {
      title: 'Projets',
      intro:
        'Ce que je construis pour moi est la meilleure preuve de ce que je peux construire pour vous. Code public, tests et documentation compris.',
      viewRepo: 'Voir le dépôt',
      allRepos: 'Tous les dépôts sur GitHub',
      wip: 'En cours',
    },
    process: {
      title: 'Comment ça se passe',
      intro: 'Trois étapes, sans engagement avant la deuxième.',
      steps: [
        {
          n: '01',
          title: 'Cadrage',
          body:
            "Vingt minutes pour comprendre le besoin, les contraintes et le volume. Gratuit. Je vous dis tout de suite si c’est de mon ressort.",
        },
        {
          n: '02',
          title: 'Diagnostic chiffré',
          body:
            "Ce qui est automatisable, quel gain réel, à quel prix. Un chiffrage justifié, pas un tarif au doigt mouillé. Vous décidez après.",
        },
        {
          n: '03',
          title: 'Réalisation par étapes',
          body:
            "Livraisons courtes et testées, documentation à chaque étape. Vous gardez le code et le savoir-faire : pas de boîte noire.",
        },
      ],
    },
    about: {
      title: 'À propos',
      body: [
        "Je m’appelle Tibério Konate. Étudiant en informatique et électronique, je passe l’essentiel de mon temps à construire des systèmes que je fais tourner moi-même : agents IA multi-profils, routage de modèles, outillage de sécurité, benchmarks reproductibles sur du matériel modeste.",
        "Cette contrainte — faire beaucoup avec peu de ressources — est exactement celle de la plupart des petites structures. C’est pour ça que je préfère les solutions sobres, mesurables et que vous pouvez reprendre sans moi.",
      ],
      facts: [
        ['Basé à', 'Paris, disponible à distance'],
        ['Formation', 'Informatique & électronique'],
        ['Terrain', 'Auto-hébergement, IA locale, cybersécurité'],
        ['Langues', 'Français, anglais'],
      ],
    },
    contact: {
      title: 'Parlons de votre projet',
      intro:
        "Décrivez en quelques lignes ce qui vous prend du temps aujourd’hui. Je réponds sous 24 h, et le premier échange de cadrage est gratuit.",
      form: {
        name: 'Nom',
        email: 'Email',
        company: 'Structure (optionnel)',
        subject: 'Type de besoin',
        message: 'Votre besoin',
        messagePlaceholder: 'Ce qui vous coûte du temps, les outils concernés, l’échéance si vous en avez une…',
        submit: 'Envoyer le message',
        sending: 'Envoi…',
        consent:
          "Vos informations servent uniquement à répondre à votre message. Elles ne sont ni revendues ni utilisées pour du démarchage.",
        options: [
          'Automatisation Python',
          'Connecteur / intégration d’API',
          'Workflow n8n',
          'IA auto-hébergée',
          'Audit / conseil',
          'Autre',
        ],
        success: 'Message envoyé. Je vous réponds sous 24 h.',
        errorMailto: 'L’envoi automatique n’est pas disponible — écrivez-moi directement :',
        errorGeneric: 'L’envoi a échoué. Réessayez ou écrivez-moi directement :',
      },
      direct: 'Écrire directement',
      availability: {
        pill: 'Disponible pour de nouvelles missions',
        line: "Réponse sous 24 h ouvrées. Premier échange de 20 min, gratuit et sans engagement.",
      },
    },
    footer: {
      built: 'Site statique en Astro, hébergé sur Cloudflare Pages.',
      legal: 'Mentions légales',
      rights: 'Tous droits réservés',
    },
  },
  en: {
    meta: {
      title: 'Polaris — Python automation, API connectors and self-hosted AI',
      description:
        'Automation studio by Tibério Konate: Python scripts, API connectors, n8n workflows and self-hosted AI systems. Free diagnostic, tested and documented deliverables.',
    },
    nav: { studio: 'Studio', projects: 'Projects', process: 'Process', about: 'About', contact: 'Contact' },
    hero: {
      kicker: 'Automation · Python · Self-hosted AI',
      title: 'I automate the work that eats your time.',
      lead:
        'Developer and computer science & electronics student. I build Python automations, connectors between your tools, and AI systems that run on your own hardware — delivered tested, documented, and maintainable without me.',
      ctaPrimary: 'Discuss a project',
      ctaSecondary: 'See my work',
      badges: ['Free 20-min diagnostic', 'Reply within 24h', 'Tested deliverables'],
    },
    services: {
      title: 'What I do',
      intro:
        'Five families of work. None of them is a catalogue: every engagement starts with a diagnostic of the real need.',
      items: [
        {
          title: 'Python automation',
          body:
            'Scripts, batch processing, recurring reporting. The two hours you lose every week run on their own, with readable logs and failures you notice before they break something.',
          tag: 'Delivery: script + docs + tests',
        },
        {
          title: 'API connectors and sync',
          body:
            'Two tools that do not talk to each other. I write the bridge: extraction, transformation, reconciliation, retry on failure. No opaque middleware in between.',
          tag: 'REST, webhooks, queues',
        },
        {
          title: 'n8n workflows and orchestration',
          body:
            'When a visual tool is enough, use it: self-hosted n8n for the plumbing, code only where business logic demands it. You keep control of your data.',
          tag: 'Self-hosted, no forced SaaS',
        },
        {
          title: 'Self-hosted AI systems',
          body:
            'Local models, agents, retrieval over your own documents. Your data never leaves your infrastructure, and the monthly cost is predictable instead of metered.',
          tag: 'Ollama, RAG, agents',
        },
        {
          title: 'Audit and advice',
          body:
            'Map your repetitive tasks, rank them by real gain, price honestly. Sometimes the right answer is: do not automate this.',
          tag: 'Prioritised report, no commitment',
        },
      ],
    },
    projects: {
      title: 'Projects',
      intro:
        'What I build for myself is the best evidence of what I can build for you. Public code, tests and documentation included.',
      viewRepo: 'View repository',
      allRepos: 'All repositories on GitHub',
      wip: 'In progress',
    },
    process: {
      title: 'How it works',
      intro: 'Three steps, no commitment before the second one.',
      steps: [
        {
          n: '01',
          title: 'Scoping',
          body:
            'Twenty minutes to understand the need, the constraints and the volume. Free. I tell you upfront whether it is my kind of work.',
        },
        {
          n: '02',
          title: 'Priced diagnostic',
          body:
            'What can be automated, the actual gain, the price. A justified estimate, not a guess. You decide afterwards.',
        },
        {
          n: '03',
          title: 'Incremental delivery',
          body:
            'Short, tested deliveries with documentation at every step. You keep the code and the knowledge: no black box.',
        },
      ],
    },
    about: {
      title: 'About',
      body: [
        'I am Tibério Konate. A computer science and electronics student, I spend most of my time building systems I run myself: multi-profile AI agents, model routing, security tooling, reproducible benchmarks on modest hardware.',
        'That constraint — doing a lot with few resources — is exactly the one most small organisations face. Which is why I favour sober, measurable solutions you can take over without me.',
      ],
      facts: [
        ['Based in', 'Paris, available remotely'],
        ['Background', 'Computer science & electronics'],
        ['Focus', 'Self-hosting, local AI, cybersecurity'],
        ['Languages', 'French, English'],
      ],
    },
    contact: {
      title: "Let's talk about your project",
      intro:
        'Describe in a few lines what is costing you time today. I reply within 24h, and the first scoping call is free.',
      form: {
        name: 'Name',
        email: 'Email',
        company: 'Company (optional)',
        subject: 'What you need',
        message: 'Your need',
        messagePlaceholder: 'What is costing you time, the tools involved, any deadline you have…',
        submit: 'Send message',
        sending: 'Sending…',
        consent:
          'Your details are only used to answer your message. They are never sold or used for marketing.',
        options: [
          'Python automation',
          'API connector / integration',
          'n8n workflow',
          'Self-hosted AI',
          'Audit / advice',
          'Something else',
        ],
        success: 'Message sent. I will reply within 24h.',
        errorMailto: 'Automatic sending is unavailable — email me directly:',
        errorGeneric: 'Sending failed. Try again or email me directly:',
      },
      direct: 'Email directly',
      availability: {
        pill: 'Available for new work',
        line: 'Reply within one business day. First 20-minute call, free and without commitment.',
      },
    },
    footer: {
      built: 'Static site built with Astro, hosted on Cloudflare Pages.',
      legal: 'Legal notice',
      rights: 'All rights reserved',
    },
  },
} as const;
