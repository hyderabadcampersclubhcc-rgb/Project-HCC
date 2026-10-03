import type { APIRoute } from 'astro';
import { getTrips } from '@/lib/catalog';
import { settings } from '@/lib/settings';

/**
 * Price authority for the PHP enquiry endpoint (public/api/intents.php). Generated at build
 * from the same catalog as the pages, so the server re-computes every quote and never trusts
 * a price sent by the browser. Contains only public trip/price data.
 */
export const GET: APIRoute = async () => {
  const trips = await getTrips();
  const body = {
    generatedAt: new Date().toISOString(),
    payments: { enabled: settings.payments.enabled, provider: settings.payments.provider },
    trips: Object.fromEntries(
      trips.map((t) => [
        t.id,
        {
          title: t.data.title,
          advance: t.data.advanceAmount ?? null,
          gstPercent: t.data.gstPercent ?? null,
          origins: t.origins.map((o) => ({ city: o.city, label: o.label, url: o.url })),
          transport: Object.fromEntries(t.data.transportOptions.map((o) => [o.id, o.label])),
          stay: Object.fromEntries(t.data.stayOptions.map((o) => [o.id, o.label])),
          departures: Object.fromEntries(
            t.origins.flatMap((o) =>
              o.departures.map((d) => [d.id, { origin: d.origin, start: d.start, end: d.end, status: d.status, bookable: d.bookable, mode: d.bookingMode, prices: d.prices }]),
            ),
          ),
        },
      ]),
    ),
  };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
