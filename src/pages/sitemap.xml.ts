import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { languages } from '../i18n/config';
import type { Lang } from '../i18n/config';

const siteUrl = 'https://www.jh.de';
const langs = Object.keys(languages) as Lang[];

interface SitemapEntry {
  alternates: Record<string, string>;
  priority: number;
  changefreq: string;
  lastmod?: string;
}

// Pages with different slugs per language
const localizedPages: Record<string, Record<string, string>> = {
  about: { de: 'about', en: 'about' },
  projects: { de: 'projects', en: 'projects' },
  imprint: { de: 'impressum', en: 'imprint' },
  privacy: { de: 'datenschutz', en: 'privacy' },
};

export const GET: APIRoute = async () => {
  const entries: SitemapEntry[] = [];
  const now = new Date().toISOString();

  // 1. Homepage
  entries.push({
    alternates: Object.fromEntries(langs.map(l => [l, `${siteUrl}/${l}/`])),
    priority: 1.0,
    changefreq: 'weekly',
    lastmod: now,
  });

  // 2. Blog index
  entries.push({
    alternates: Object.fromEntries(langs.map(l => [l, `${siteUrl}/${l}/blog/`])),
    priority: 0.8,
    changefreq: 'daily',
    lastmod: now,
  });

  // 3. Localized pages (about, projects, imprint, privacy)
  for (const [, slugMap] of Object.entries(localizedPages)) {
    entries.push({
      alternates: Object.fromEntries(langs.map(l => [l, `${siteUrl}/${l}/${slugMap[l]}/`])),
      priority: 0.6,
      changefreq: 'monthly',
      lastmod: now,
    });
  }

  // 4. Blog posts (grouped by translationKey)
  let posts: any[] = [];
  try {
    posts = await getCollection('posts', ({ data }) => !data.draft);
  } catch {
    // No posts
  }

  const postsByKey = new Map<string, Map<string, any>>();
  for (const post of posts) {
    const key = post.data.translationKey || post.id;
    const postLang = post.data.lang || 'de';
    if (!postsByKey.has(key)) postsByKey.set(key, new Map());
    postsByKey.get(key)!.set(postLang, post);
  }

  for (const [, langPosts] of postsByKey) {
    const alternates: Record<string, string> = {};
    let latestDate = '';

    for (const [postLang, post] of langPosts) {
      const slug = post.id.includes('/') ? post.id.split('/').slice(1).join('/') : post.id;
      alternates[postLang] = `${siteUrl}/${postLang}/blog/${slug}/`;

      const date = (post.data.updatedDate || post.data.pubDate)?.toISOString() || '';
      if (date > latestDate) latestDate = date;
    }

    entries.push({
      alternates,
      priority: 0.7,
      changefreq: 'monthly',
      lastmod: latestDate || now,
    });
  }

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(entry => {
  const altLinks = Object.entries(entry.alternates)
    .map(([lang, url]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}"/>`)
    .join('\n');

  const loc = entry.alternates.de || Object.values(entry.alternates)[0];

  return `  <url>
    <loc>${loc}</loc>
${altLinks}
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
