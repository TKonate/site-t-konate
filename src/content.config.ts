import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Collection for the Markdown files under src/content/articles.
 *
 * The same article exists once per language, as two files. `slug` is the path
 * segment in the file's own language and `translation` is the counterpart's
 * slug: those two fields are what the hreflang alternate and the language
 * switch follow. A wrong `translation` sends the reader to a 404 instead of the
 * translated article, and the build stays green, so the pairing is the part to
 * check when adding an article.
 */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['fr', 'en']),
    /** Path segment of this article in its own language. */
    slug: z.string(),
    /** Slug of the same article in the other language. */
    translation: z.string(),
    readingTime: z.string(),
  }),
});

export const collections = { articles };
