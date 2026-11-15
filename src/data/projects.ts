export type Project = {
  slug: string;
  name: string;
  year: string;
  kind: { fr: string; en: string };
  summary: { fr: string; en: string };
  stack: string[];
  url?: string;
  status: 'public' | 'wip';
  featured?: boolean;
};

/** Projets affichés sur la vitrine. Uniquement des dépôts publics vérifiables. */
export const projects: Project[] = [
  {
    slug: 'ollama-inference-benchmarks',
    name: 'ollama-inference-benchmarks',
    year: '2026',
    kind: { fr: 'Outil · Benchmark', en: 'Tooling · Benchmark' },
    summary: {
      fr: "Benchmark reproductible de LLM locaux sur un VPS sans GPU. Suite de neuf prompts sur trois catégories, latence cold/warm, backends llama.cpp et vLLM interchangeables. 43 tests, mypy strict, CI et image Docker.",
      en: 'Reproducible benchmarking of local LLMs on a GPU-less VPS. Nine-prompt suite across three categories, cold/warm latency, swappable llama.cpp and vLLM backends. 43 tests, strict mypy, CI and a Docker image.',
    },
    stack: ['Python', 'Typer', 'Pydantic', 'Docker', 'GitHub Actions'],
    url: 'https://github.com/TKonate/ollama-inference-benchmarks',
    status: 'public',
    featured: true,
  },
  {
    slug: 'hermes-infrastructure',
    name: 'hermes-infrastructure',
    year: '2026',
    kind: { fr: 'Étude d\'architecture', en: 'Architecture study' },
    summary: {
      fr: "Architecture d'un système d'agents IA auto-hébergé : routage de modèles, orchestrateur multi-profils, messagerie, sauvegardes. Version publique expurgée de toute donnée d'infrastructure.",
      en: 'Architecture of a self-hosted AI agent system: model routing, multi-profile orchestration, messaging, backups. Public version stripped of any infrastructure data.',
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
      fr: "Vitrine et documentation d'un assistant personnel privé : ce qui est collecté, ce qui ne l'est pas, et pourquoi. Déployé sur GitHub Pages.",
      en: 'Landing page and documentation for a privacy-first personal assistant: what is collected, what is not, and why. Deployed on GitHub Pages.',
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
      fr: 'Outil en ligne de commande qui génère des entrées de portfolio en Markdown à partir de métadonnées de projet. Tests unitaires et intégration continue.',
      en: 'Command-line tool generating Markdown portfolio entries from project metadata. Unit tests and continuous integration.',
    },
    stack: ['Python', 'pytest', 'GitHub Actions'],
    url: 'https://github.com/TKonate/portfolio-manager',
    status: 'public',
  },
  {
    slug: 'palantir-research-workflow',
    name: 'palantir-research-workflow',
    year: '2026',
    kind: { fr: 'Méthode · Cas d\'étude', en: 'Method · Case study' },
    summary: {
      fr: "Workflow de recherche structurée en trois temps — collecter, vérifier, synthétiser — documenté sur un cas réel, avec les sources et les limites de chaque étape.",
      en: 'Three-step structured research workflow — collect, verify, synthesise — documented on a real case, with sources and the limits of each step.',
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
      fr: "Cette vitrine : site statique bilingue en Astro, contenu versionné en TypeScript, formulaire de contact servi par une Cloudflare Pages Function. Pas de CMS, pas de base de données.",
      en: 'This very site: a bilingual static site in Astro, content versioned in TypeScript, contact form served by a Cloudflare Pages Function. No CMS, no database.',
    },
    stack: ['Astro', 'TypeScript', 'Cloudflare Pages'],
    url: 'https://github.com/TKonate',
    status: 'wip',
  },
];
