import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { projects } from '../data/projects';
import { SITE } from '../site.config';

/**
 * /sitemap.xml, emitted as a static route at build time.
 *
 * Each entry is a fr/en pair: both URLs are written, each carrying the two
 * xhtml:link alternates. Pairs are listed here rather than read from
 * src/lib/routes.ts because the sitemap also needs the per-project and
 * per-article paths, which come from the data file and the content collection.
 *
 * Not covered: /404, which is not meant to be indexed. The legal notice is
 * present but appears once, without alternates, since it has no translation.
 */
const base = SITE.url.replace(/\/$/, '');

type Pair = { fr: string; en: string };

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles');
  const pairs: Pair[] = [
    { fr: '/', en: '/en/' },
    { fr: '/projets/', en: '/en/projects/' },
    { fr: '/ecrits/', en: '/en/writing/' },
    { fr: '/a-propos/', en: '/en/about/' },
    { fr: '/contact/', en: '/en/contact/' },
    ...projects.map((p) => ({
      fr: `/projets/${p.slug}/`,
      en: `/en/projects/${p.slug}/`,
    })),
    ...articles
      // The French collection drives the pairs: each entry carries the English
      // slug in `translation`, which is the alternate URL the sitemap needs.
      .filter((a) => a.data.lang === 'fr')
      .map((a) => ({
        fr: `/ecrits/${a.data.slug}/`,
        en: `/en/writing/${a.data.translation}/`,
      })),
    { fr: '/mentions-legales/', en: '/mentions-legales/' },
  ];

  const urls = pairs
    .flatMap((pair) => {
      // Same path in both languages means a single untranslated page (the legal
      // notice). Declaring alternates there would point crawlers at a page that
      // does not exist in the other language.
      const alts =
        pair.fr === pair.en
          ? ''
          : `\n    <xhtml:link rel="alternate" hreflang="fr" href="${base}${pair.fr}"/>` +
            `\n    <xhtml:link rel="alternate" hreflang="en" href="${base}${pair.en}"/>`;
      return [pair.fr, pair.en]
        // One <url> per distinct path, so the shared path is not listed twice.
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .map(
          (path) =>
            `  <url>\n    <loc>${base}${path}</loc>${alts}\n    <changefreq>monthly</changefreq>\n  </url>`
        );
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
