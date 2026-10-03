import type { APIRoute } from 'astro';

/** robots.txt generated from the configured site URL so the sitemap link is always correct. */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /styleguide/',
    'Disallow: /preview/',
    'Disallow: /thank-you/',
    'Disallow: /go/',
    '',
    `Sitemap: ${sitemap}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
