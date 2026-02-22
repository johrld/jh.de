// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const siteUrl = process.env.SITE_URL || 'https://www.jh.de';

export default defineConfig({
  site: siteUrl,
  integrations: [mdx(), sitemap()],
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  vite: {
    server: {
      allowedHosts: ['jh.ixr.dev', 'localhost'],
    },
  },
});
