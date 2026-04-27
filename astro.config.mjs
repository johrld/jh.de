// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';


import cloudflare from "@astrojs/cloudflare";


const siteUrl = process.env.SITE_URL || 'https://www.jh.de';

export default defineConfig({
  site: siteUrl,
  integrations: [mdx()],

  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
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

  adapter: cloudflare()
});