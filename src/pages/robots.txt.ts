import type { APIRoute } from 'astro';

/**
 * robots.txt. Production (PUBLIC_ALLOW_INDEXING=true) allows crawling with a sitemap link;
 * every other build (local, staging) disallows everything.
 */
export const GET: APIRoute = ({ site }) => {
  const production = import.meta.env.PUBLIC_ALLOW_INDEXING === 'true';
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = production
    ? [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin/',
        'Disallow: /api/',
        'Disallow: /styleguide/',
        'Disallow: /preview/',
        'Disallow: /trips/compare/',
        'Disallow: /thank-you/',
        'Disallow: /go/',
        '',
        `Sitemap: ${sitemap}`,
        '',
      ]
    : ['# Non-production build: not for indexing', 'User-agent: *', 'Disallow: /', ''];
  return new Response(body.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
