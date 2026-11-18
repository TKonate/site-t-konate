import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['fr', 'en']),
    /** Slug de cet article dans sa langue. */
    slug: z.string(),
    /** Slug du même article dans l'autre langue. */
    translation: z.string(),
    readingTime: z.string(),
  }),
});

export const collections = { articles };
