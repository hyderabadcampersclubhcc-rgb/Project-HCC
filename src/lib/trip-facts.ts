/**
 * Facts for a trip × departure city, built only from trip data (the source of truth).
 * Used by the "At a glance" block and by the data-driven FAQs, so the visible page, the
 * FAQPage schema and the facts always agree. A field without real data is simply left out.
 *
 * One trip price per person (HCC, Oct 2026): only the transport and stays the base price
 * includes are listed here, never paid alternatives or upgrade prices.
 */
import type { TripView, TripOriginView } from './catalog';
import { inr, travelSuffix } from './format';
import { settings } from './settings';

export interface TripFact {
  label: string;
  value: string;
  href?: string;
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Transport the base price includes (priceDelta 0); falls back to the first option. */
export function includedTransport(origin: TripOriginView) {
  const inc = origin.transportOptions.filter((t) => t.priceDelta === 0);
  return inc.length ? inc : [origin.transportOptions[0]];
}

/**
 * A reach-it-yourself overnight camp (Ananthagiri campsites): camping, and every included transport is
 * "reach the campsite yourself". Its pages say "… near Hyderabad", never "group trip from Hyderabad".
 */
export function isSelfCamp(trip: TripView, origin: TripOriginView) {
  return trip.data.tripTypes.includes('camping') && includedTransport(origin).every((t) => t.mode === 'self');
}

/** Page heading / schema name: "{Title} near {City}" for self-reach camps, else "{Title} Group Trip from {City}". */
export const tripHeading = (trip: TripView, origin: TripOriginView) =>
  isSelfCamp(trip, origin) ? `${trip.data.title} near ${origin.label}` : `${trip.data.title} Group Trip from ${origin.label}`;

function rawOrigin(trip: TripView, origin: TripOriginView) {
  return trip.data.origins.find((o) => o.city === origin.city);
}

export const durationText = (trip: TripView, origin: TripOriginView) =>
  `${trip.data.durationNights} night${trip.data.durationNights === 1 ? '' : 's'} / ${trip.data.durationDays} day${trip.data.durationDays === 1 ? '' : 's'}` +
  (travelSuffix(origin) ? ` ${travelSuffix(origin)}` : '');

export function priceText(trip: TripView, origin: TripOriginView) {
  if (origin.fromPrice == null) return null;
  return `From ${inr(origin.fromPrice)} per person` + (trip.data.gstPercent ? ` (plus ${trip.data.gstPercent}% GST)` : '');
}

export function tripFacts(trip: TripView, origin: TripOriginView): TripFact[] {
  const d = trip.data;
  const raw = rawOrigin(trip, origin);
  const start = raw?.pickupPoints[0];
  const facts: (TripFact | false | null | undefined | '')[] = [
    { label: 'Departure city', value: origin.label },
    origin.destinationNames.length > 0 && { label: 'Places', value: origin.destinationNames.join(', ') },
    { label: 'Duration', value: durationText(trip, origin) },
    priceText(trip, origin) && { label: 'Price', value: priceText(trip, origin)! },
    origin.recurrence && { label: 'Departures', value: origin.recurrence },
    origin.travelWindow && { label: 'Leaves → back', value: origin.travelWindow },
    !origin.travelWindow && raw?.outbound && { label: 'Leaves', value: raw.outbound },
    !origin.travelWindow && raw?.return && { label: 'Returns', value: raw.return },
    start && { label: 'Starting point', value: start.time ? `${start.name}, ${start.time}` : start.name },
    { label: 'Transport', value: includedTransport(origin).map((t) => t.label).join(' or ') },
    d.stays.length > 0 && { label: 'Stay', value: [...new Set(d.stays.map((s) => (s.location ? `${s.type} (${s.location})` : s.type)))].join('; ') },
    { label: 'Difficulty', value: d.difficulty[0].toUpperCase() + d.difficulty.slice(1) },
    d.groupSize && { label: 'Group size', value: `${d.groupSize.min}–${d.groupSize.max} people` },
    d.suitableFor.length > 0 && { label: 'Best suited for', value: d.suitableFor.join(', ') },
    { label: 'How to book', value: 'Pick a date on this page and tap Book Your Seat, or message HCC on WhatsApp' },
  ];
  return facts.filter((f): f is TripFact => !!f);
}

/**
 * Data-driven answers to the questions people ask before booking. Added only for topics the
 * trip's own FAQs don't already cover, and only when the data exists.
 */
const TOPICS: { key: string; covered: RegExp }[] = [
  { key: 'cost', covered: /\b(cost|price|how much)\b/i },
  { key: 'when', covered: /\b(when|which days?|how long|how many days|leave|depart)/i },
  { key: 'start', covered: /\b(where).*(start|meet|board|pick ?up|report)/i },
  { key: 'book', covered: /\bbook/i },
  { key: 'solo', covered: /\b(solo|alone)\b/i },
  { key: 'cancel', covered: /\b(cancel|refund)/i },
];

export function quickFaqs(trip: TripView, origin: TripOriginView): { q: string; a: string }[] {
  const d = trip.data;
  const name = d.seoName ?? d.title;
  const raw = rawOrigin(trip, origin);
  const has = (key: string) => d.faqs.some((f) => TOPICS.find((t) => t.key === key)!.covered.test(f.q));
  const out: { q: string; a: string }[] = [];

  const price = priceText(trip, origin);
  if (price && !has('cost')) {
    const inc = origin.inclusions.slice(0, 3).map((i) => lower(i.text));
    out.push({
      q: isSelfCamp(trip, origin) ? `How much does ${name} cost?` : `How much does the ${name} trip from ${origin.label} cost?`,
      a: `${price}.` + (inc.length ? ` It includes ${inc.join('; ')}. The full list is under What's included.` : ''),
    });
  }
  if (!has('when')) {
    const parts = [`${name} is ${durationText(trip, origin)}.`];
    if (origin.recurrence) parts.push(`${origin.recurrence.replace(/\.$/, '')}.`);
    if (origin.travelWindow) parts.push(`You leave and return: ${origin.travelWindow}.`);
    else if (raw?.outbound) parts.push(`Outbound: ${raw.outbound.replace(/\.$/, '')}.`);
    out.push({ q: isSelfCamp(trip, origin) ? 'When does the camp run, and how long is it?' : `When does it leave ${origin.label}, and how long is it?`, a: parts.join(' ') });
  }
  if (raw?.pickupPoints.length && !has('start')) {
    if (isSelfCamp(trip, origin)) {
      // No HCC transport or meeting point: name the campsite and how to reach it, from trip data only.
      const site = raw.pickupPoints.find((p) => /campsite/i.test(p.name)) ?? raw.pickupPoints[0];
      const how = raw.outbound ? ` Getting there: ${raw.outbound.replace(/\.$/, '')}.` : '';
      // "Campsite: Harivillu Resort, …" / "Campsite, Ananthagiri Hills (Vikarabad)" → the place itself.
      const place = site.name.replace(/^Campsite[:,]\s*/i, '');
      // "16:00" → "4:00 pm"
      const time = site.time?.replace(/^(\d{1,2}):(\d{2})$/, (_m, h: string, m: string) => `${Number(h) % 12 || 12}:${m} ${Number(h) < 12 ? 'am' : 'pm'}`);
      out.push({
        q: 'Where is the campsite, and how do I get there?',
        a: `You travel to the campsite on your own; there's no HCC transport from ${origin.label}. The campsite is at ${place}${time ? `; check-in is at ${time}` : ''}.${how}`,
      });
    } else {
      const pts = raw.pickupPoints.map((p) => (p.time ? `${p.name} at ${p.time}` : p.name));
      out.push({ q: 'Where does the trip start?', a: `From ${origin.label}, the group meets at ${pts.join(', or ')}.` });
    }
  }
  if (!has('book')) {
    const wa = settings.contact.whatsapp;
    out.push({
      q: 'How do I book?',
      a:
        `Choose a date on this page and tap Book Your Seat, or message HCC on WhatsApp${wa ? ` (${wa})` : ''}.` +
        (d.advanceAmount ? ` A ${inr(d.advanceAmount)} per person advance reserves your seat.` : ''),
    });
  }
  if (d.suitableFor.some((s) => /solo/i.test(s)) && !has('solo')) {
    out.push({
      ...(isSelfCamp(trip, origin)
        ? {
            q: 'Can I book on my own?',
            a: 'Yes. You can enquire and book individually on WhatsApp. The price is per person, the same whether you come alone or with friends, and you travel to the campsite on your own.',
          }
        : {
            q: 'Can I join on my own?',
            a: 'Yes. Solo travellers join the group, and the price is the same per person whether you come alone or with friends.',
          }),
    });
  }
  if (d.cancellationPolicy && !has('cancel')) {
    out.push({ q: 'What if I need to cancel?', a: `${d.cancellationPolicy} The full cancellation policy is linked under Good to know.` });
  }
  return out;
}

/** The trip's own FAQs followed by the data-driven ones: what the page shows and what FAQPage marks up. */
export const tripFaqs = (trip: TripView, origin: TripOriginView) => [...trip.data.faqs, ...quickFaqs(trip, origin)];
