export type Project = {
  slug: string;
  name: string;
  year: string;
  kind: { fr: string; en: string };
  /** Une phrase, pour la carte. */
  summary: { fr: string; en: string };
  /** Accroche de la page détail. */
  pitch: { fr: string; en: string };
  problem: { fr: string; en: string };
  built: { fr: string; en: string };
  highlights: { fr: string[]; en: string[] };
  stack: string[];
  url?: string;
  status: 'public' | 'wip';
  featured?: boolean;
  /** Captures et graphiques réellement présents dans le dépôt public. */
  media?: Array<{
    src: string;
    alt: { fr: string; en: string };
    caption: { fr: string; en: string };
    width: number;
    height: number;
    /** 'light' pour les visuels conçus sur fond clair (graphiques générés). */
    tone?: 'light';
  }>;
};

/**
 * Projets affichés sur le site.
 * Règle : uniquement des dépôts publics et vérifiables. Aucun chiffre inventé.
 */
export const projects: Project[] = [
  {
    slug: 'ollama-inference-benchmarks',
    name: 'ollama-inference-benchmarks',
    year: '2026',
    kind: { fr: 'Outil · Benchmark', en: 'Tooling · Benchmark' },
    summary: {
      fr: 'Mesurer ce que coûte réellement un LLM local sur une machine sans GPU.',
      en: 'Measuring what a local LLM actually costs on a GPU-less machine.',
    },
    pitch: {
      fr: 'Un banc de mesure reproductible pour choisir un modèle local sur des critères chiffrés, pas au ressenti.',
      en: 'A reproducible test bench for choosing a local model on measured criteria instead of gut feeling.',
    },
    problem: {
      fr: "On lit partout qu'un modèle est « rapide ». Sur un VPS sans GPU, la latence dépend du modèle, de la quantification et de la longueur de sortie. Sans protocole reproduisible, le choix se fait sur une impression. Et le premier run est toujours trompeur, parce que le modèle n'est pas encore chargé.",
      en: 'Everyone claims their model is "fast". On a GPU-less VPS, latency depends on the model, the quantization and the output length. Without a reproducible protocol the choice is made on a feeling. And the first run always lies, because the model is not loaded yet.',
    },
    built: {
      fr: "Une CLI Typer avec modèles Pydantic, une suite de neuf prompts en trois catégories (raisonnement court, extraction structurée, texte long), la mesure de latence cold et warm via `--runs`, deux backends interchangeables (llama.cpp et vLLM via une interface compatible OpenAI) et un export CSV. Livré avec image Docker, CI GitHub Actions, 43 tests, mypy strict et ruff propre.",
      en: 'A Typer CLI with Pydantic models, a nine-prompt suite across three categories (short reasoning, structured extraction, long text), cold/warm latency measurement via `--runs`, two swappable backends (llama.cpp and vLLM through an OpenAI-compatible interface) and CSV export. Shipped with a Docker image, GitHub Actions CI, 43 tests, strict mypy and clean ruff.',
    },
    highlights: {
      fr: [
        'Les backends sont interchangeables derrière une interface unique : changer de moteur coûte une sous-classe.',
        'La distinction cold/warm est mesurée, pas supposée. C’est elle qui invalide la plupart des benchmarks publiés.',
        'Résultat concret : Qwen3 1.7B offre le meilleur compromis qualité/latence sur ce matériel.',
      ],
      en: [
        'Backends are swappable behind one interface: changing engine costs a subclass.',
        'The cold/warm distinction is measured, not assumed. It invalidates most published benchmarks.',
        'Concrete outcome: Qwen3 1.7B gives the best quality/latency trade-off on this hardware.',
      ],
    },
    stack: ['Python', 'Typer', 'Pydantic', 'Docker', 'GitHub Actions'],
    media: [
      {
        src: '/media/ollama-inference-benchmarks/2026-11-15-vps-4vcpu-throughput.svg',
        alt: {
          fr: 'Graphique en barres du débit en tokens par seconde, par modèle, mesuré sur un VPS à 4 vCPU.',
          en: 'Bar chart of throughput in tokens per second per model, measured on a 4-vCPU VPS.',
        },
        caption: {
          fr: 'Débit mesuré (tokens/s), VPS 4 vCPU, 2026-11-15. Graphique produit par le protocole de mesure du dépôt.',
          en: 'Measured throughput (tokens/s), 4-vCPU VPS, 2026-11-15. Chart produced by the repository measurement protocol.',
        },
        width: 720,
        height: 276,
        tone: 'light',
      },
      {
        src: '/media/ollama-inference-benchmarks/2026-11-15-vps-4vcpu-ttft.svg',
        alt: {
          fr: 'Graphique en barres du temps médian avant le premier token, par modèle, sur un VPS à 4 vCPU.',
          en: 'Bar chart of median time to first token per model on a 4-vCPU VPS.',
        },
        caption: {
          fr: 'Temps médian avant le premier token (TTFT), même campagne de mesure.',
          en: 'Median time to first token (TTFT), same measurement run.',
        },
        width: 720,
        height: 276,
        tone: 'light',
      },
    ],
    url: 'https://github.com/TKonate/ollama-inference-benchmarks',
    status: 'public',
    featured: true,
  },
  {
    slug: 'hermes-infrastructure',
    name: 'hermes-infrastructure',
    year: '2026',
    kind: { fr: 'Étude d’architecture', en: 'Architecture study' },
    summary: {
      fr: 'Faire tourner un système multi-agents chez soi, sans cloud, en gardant la main sur les données.',
      en: 'Running a multi-agent system at home, without the cloud, and keeping control of the data.',
    },
    pitch: {
      fr: 'Comment j’organise un système d’agents qui tient sur un seul serveur, et ce que je refuse de lui confier.',
      en: 'How I organise an agent system on a single server, and what I refuse to give it.',
    },
    problem: {
      fr: 'Un système multi-agents qui passe par une API tierce envoie tout son contexte chez ce tiers. Pour des données personnelles, ce n’est pas un détail d’implémentation : c’est une décision d’architecture, et elle se prend avant d’écrire la première ligne.',
      en: 'A multi-agent system routed through a third-party API sends all of its context to that third party. For personal data this is not an implementation detail: it is an architecture decision, and it is taken before the first line of code.',
    },
    built: {
      fr: "Une étude d'architecture complète : routage des modèles selon la tâche et la sensibilité des données, orchestrateur multi-profils avec workers spécialisés, services auto-hébergés (inférence locale, automatisation, coffre de secrets), et stratégie de sauvegarde. La version publique est expurgée de toute donnée d'infrastructure réelle.",
      en: 'A full architecture study: model routing by task and data sensitivity, a multi-profile orchestrator with specialised workers, self-hosted services (local inference, automation, secrets vault) and a backup strategy. The public version is stripped of any real infrastructure data.',
    },
    highlights: {
      fr: [
        'Séparation nette entre l’orchestrateur et les workers : une tâche simple ne réveille pas cinq agents.',
        'Le routage arbitre entre coût, latence et confidentialité, pas seulement la qualité.',
        'Toute publication passe par une sanitisation systématique : aucun nom d’hôte, port ou secret.',
      ],
      en: [
        'Clean separation between orchestrator and workers: a simple task does not wake five agents.',
        'Routing arbitrates between cost, latency and confidentiality, not quality alone.',
        'Every publication goes through systematic sanitisation: no hostname, port or secret.',
      ],
    },
    stack: ['Markdown', 'Ollama', 'n8n', 'Docker'],
    url: 'https://github.com/TKonate/hermes-infrastructure',
    status: 'public',
    featured: true,
  },
  {
    slug: 'alfred',
    name: 'alfred',
    year: '2026',
    kind: { fr: 'Site · Documentation', en: 'Site · Documentation' },
    summary: {
      fr: 'Un assistant personnel qui collecte des données intimes doit d’abord expliquer ce qu’il collecte.',
      en: 'A personal assistant collecting intimate data must first explain what it collects.',
    },
    pitch: {
      fr: 'La politique de données du projet, écrite avant le code et publiée.',
      en: 'The project’s data policy, written before the code and published.',
    },
    problem: {
      fr: 'Un assistant personnel voit des messages, un agenda, des habitudes. La question qui compte n’est pas « quelles fonctionnalités ? » mais « qui a accès à quoi, et comment je le supprime ? ». La réponse doit être lisible par quelqu’un qui ne lit pas de code.',
      en: 'A personal assistant sees messages, a calendar, habits. The question that matters is not "which features?" but "who has access to what, and how do I delete it?". The answer must be readable by someone who does not read code.',
    },
    built: {
      fr: "Une page publique et une documentation qui détaillent les données collectées, celles qui ne le sont pas, l’endroit du stockage et la procédure de suppression. Hébergement statique sur GitHub Pages, aucun traceur.",
      en: 'A public page and documentation detailing which data is collected, which is not, where it is stored and how to delete it. Statically hosted on GitHub Pages, with no tracker.',
    },
    highlights: {
      fr: [
        'La politique de données est un livrable du projet, pas une page ajoutée à la fin.',
        'Aucun script tiers, aucun traceur : ce qui est promis est vérifiable dans la page.',
      ],
      en: [
        'The data policy is a project deliverable, not a page bolted on at the end.',
        'No third-party script, no tracker: what is promised can be checked in the page itself.',
      ],
    },
    stack: ['HTML', 'CSS', 'GitHub Pages'],
    url: 'https://github.com/TKonate/alfred',
    status: 'public',
  },
  {
    slug: 'portfolio-manager',
    name: 'portfolio-manager',
    year: '2026',
    kind: { fr: 'CLI Python', en: 'Python CLI' },
    summary: {
      fr: 'La documentation de portfolio se fait toujours à la fin, donc jamais. Automatisons-la.',
      en: 'Portfolio documentation always happens at the end, so never. Let us automate it.',
    },
    pitch: {
      fr: 'Générer des entrées de portfolio en Markdown à partir de métadonnées de projet.',
      en: 'Generating Markdown portfolio entries from project metadata.',
    },
    problem: {
      fr: 'Documenter un projet après coup demande de se souvenir de ce qu’on a fait, pourquoi, et de retrouver les chiffres. Résultat : des portfolios vides ou des descriptions vagues. Le format Markdown, lui, reste portable et versionnable.',
      en: 'Documenting a project after the fact means remembering what was done, why, and finding the numbers again. The result: empty portfolios or vague descriptions. Markdown, meanwhile, stays portable and versionable.',
    },
    built: {
      fr: 'Un outil en ligne de commande qui prend des métadonnées de projet et produit une entrée de portfolio structurée en Markdown. Tests unitaires et intégration continue pour que la sortie reste stable d’une version à l’autre.',
      en: 'A command-line tool that takes project metadata and produces a structured Markdown portfolio entry. Unit tests and continuous integration keep the output stable across versions.',
    },
    highlights: {
      fr: [
        'Sortie Markdown : lisible dans Obsidian comme sur GitHub, sans dépendance à un format propriétaire.',
        'Tests et CI dès la v1 : un générateur qui casse silencieusement est pire que pas de générateur.',
      ],
      en: [
        'Markdown output: readable in Obsidian as well as on GitHub, with no proprietary format lock-in.',
        'Tests and CI from v1: a generator that silently breaks is worse than no generator.',
      ],
    },
    stack: ['Python', 'pytest', 'GitHub Actions'],
    media: [
      {
        src: '/media/portfolio-manager/screenshot.png',
        alt: {
          fr: "Capture de l'interface Portfolio Manager v1.0.0, onglet Entries : liste des entrées à gauche, métadonnées de l'entrée sélectionnée « OSINT collection pipeline » à droite.",
          en: 'Screenshot of the Portfolio Manager v1.0.0 interface, Entries tab: entry list on the left, metadata of the selected entry "OSINT collection pipeline" on the right.',
        },
        caption: {
          fr: "Onglet Entries : recherche, filtres par type, statut et domaine, et métadonnées de l'entrée sélectionnée.",
          en: 'The Entries tab: search, filters by type, status and domain, and metadata of the selected entry.',
        },
        width: 1280,
        height: 577,
      },
    ],
    url: 'https://github.com/TKonate/portfolio-manager',
    status: 'public',
  },
  {
    slug: 'palantir-research-workflow',
    name: 'palantir-research-workflow',
    year: '2026',
    kind: { fr: 'Méthode · Cas d’étude', en: 'Method · Case study' },
    summary: {
      fr: 'Une recherche non structurée produit des conclusions invérifiables. La méthode compte plus que l’outil.',
      en: 'Unstructured research produces unverifiable conclusions. The method matters more than the tool.',
    },
    pitch: {
      fr: 'Collecter, vérifier, synthétiser : documenté sur un cas réel, limites comprises.',
      en: 'Collect, verify, synthesise: documented on a real case, limits included.',
    },
    problem: {
      fr: 'Un modèle de recherche peut produire une synthèse convaincante à partir de rien. Sans étape de vérification explicite et sans traçabilité des sources, l’output est indistinguable d’une hallucination soignée.',
      en: 'A research model can produce a convincing synthesis out of nothing. Without an explicit verification step and source traceability, the output is indistinguishable from a well-dressed hallucination.',
    },
    built: {
      fr: 'Un workflow en trois temps (collecter, vérifier, synthétiser) où chaque étape a ses sources et ses limites documentées. Le dépôt contient également des cas d’étude issus de recherches réelles, avec les points où la méthode a échoué.',
      en: 'A three-step workflow (collect, verify, synthesise) where each step carries its sources and documented limits. The repository also contains case studies from real research, including where the method failed.',
    },
    highlights: {
      fr: [
        'Chaque affirmation remonte à une source identifiable.',
        'Les limites sont écrites dans le livrable, pas dans une conversation privée.',
      ],
      en: [
        'Every claim traces back to an identifiable source.',
        'Limits are written into the deliverable, not left in a private conversation.',
      ],
    },
    stack: ['Markdown', 'Méthode'],
    url: 'https://github.com/TKonate/palantir-research-workflow',
    status: 'public',
  },
  {
    slug: 'site-t-konate',
    name: 'site-t-konate',
    year: '2026',
    kind: { fr: 'Site web', en: 'Website' },
    summary: {
      fr: 'Cette vitrine : statique, bilingue, sans CMS ni base de données.',
      en: 'This showcase: static, bilingual, no CMS and no database.',
    },
    pitch: {
      fr: 'Un site que son propriétaire peut modifier dans un éditeur de texte, sans dépendre d’un service tiers.',
      en: 'A site its owner can edit in a text editor, without depending on a third party.',
    },
    problem: {
      fr: 'Les constructeurs de sites enferment le contenu dans leur interface, ajoutent des scripts de suivi et rendent la migration coûteuse. Pour un portfolio technique, ce compromis n’a pas de sens : le contenu doit rester du texte versionné.',
      en: 'Website builders lock content inside their interface, add tracking scripts and make migration expensive. For a technical portfolio that trade-off makes no sense: the content must stay versioned text.',
    },
    built: {
      fr: 'Un générateur statique avec du contenu typé, deux langues avec détection de la langue du navigateur et bascule manuelle, une page par projet générée depuis un fichier de données, et un formulaire de contact servi par une fonction déployée avec le site. Aucun CMS, aucune base de données, aucun cookie.',
      en: 'A static generator with typed content, two languages with browser-language detection and manual switching, one page per project generated from a data file, and a contact form served by a function deployed alongside the site. No CMS, no database, no cookies.',
    },
    highlights: {
      fr: [
        'Zéro dépendance UI, polices système : aucun appel à un CDN externe.',
        'Les pages projet sont générées depuis un seul fichier typé : ajouter un projet coûte un objet.',
        'Le formulaire retombe proprement sur un lien mailto si l’envoi n’est pas configuré.',
      ],
      en: [
        'Zero UI dependency, system fonts: no call to an external CDN.',
        'Project pages are generated from a single typed file: adding a project costs one object.',
        'The form degrades cleanly to a mailto link when sending is not configured.',
      ],
    },
    stack: ['Astro', 'TypeScript', 'Cloudflare Pages'],
    url: 'https://github.com/TKonate',
    status: 'wip',
    featured: true,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
