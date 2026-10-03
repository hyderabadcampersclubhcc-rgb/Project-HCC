// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import hostinger from './integrations/hostinger.mjs';

// Canonical production origin. Canonicals, OG URLs, the sitemap and redirects derive from it.
// Staging builds set SITE_URL to the staging host. Indexing is controlled separately by
// PUBLIC_ALLOW_INDEXING (only the production deploy sets it).
const site = process.env.SITE_URL ?? 'https://hyderabadcampersclubhcc.in';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  prefetch: { defaultStrategy: 'hover' },
  integrations: [
    mdx(),
    sitemap({
      // Internal / utility pages never go into the sitemap.
      filter: (page) => !/\/(styleguide|preview|admin|thank-you|go|api|build-redirects\.json)(\/|$)/.test(page) && !/\/trips\/compare\//.test(page),
    }),
    hostinger(),
  ],
  // Self-hosted, Latin-subset variable fonts. Astro generates metric-adjusted
  // fallbacks from the generic family at the end of `fallbacks` to avoid CLS.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Bricolage Grotesque',
      cssVariable: '--font-display',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/bricolage-grotesque-latin-wght-normal.woff2'],
            weight: '200 800',
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-body',
      fallbacks: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/inter-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
  ],
});
