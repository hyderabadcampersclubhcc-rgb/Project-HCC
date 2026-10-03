import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getTrips, destinationUrl } from '@/lib/catalog';
import { LEGACY_REDIRECTS } from '@/data/legacy-redirects';

/**
 * Build-time redirect table, consumed and then deleted by integrations/hostinger.mjs,
 * which writes it into dist/.htaccess as 301 rules.
 */
export const GET: APIRoute = async () => {
  const showSamples = import.meta.env.PUBLIC_SHOW_SAMPLES === 'true';
  const trips = await getTrips();
  const destinations = (await getCollection('destinations')).filter((d) => showSamples || !d.data.sample);
  const published = new Set(destinations.map((d) => d.id));

  const claimed = new Map<string, string>();
  for (const d of destinations) for (const p of d.data.legacyPaths) claimed.set(p, destinationUrl(d.id));
  for (const t of trips) for (const p of t.data.legacyPaths) claimed.set(p, t.url); // trips win over destinations

  const table = new Map<string, string>();
  for (const r of LEGACY_REDIRECTS) {
    table.set(r.from, claimed.get(r.from) ?? (r.dest && published.has(r.dest) ? destinationUrl(r.dest) : r.to));
  }
  // Legacy paths claimed by content that aren't in the static list (e.g. newly found old URLs)
  for (const [from, to] of claimed) if (!table.has(from)) table.set(from, to);

  const redirects = [...table].filter(([from, to]) => from !== to).map(([from, to]) => ({ from, to }));
  return new Response(JSON.stringify(redirects), { headers: { 'Content-Type': 'application/json' } });
};
