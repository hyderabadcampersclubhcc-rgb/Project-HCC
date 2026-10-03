/** Page-title and meta-description templates generated from content (CMS overrides win). */
import type { TripView, TripOriginView } from './catalog';
import { inr, dateLong } from './format';

const clip = (s: string, max: number) => (s.length <= max ? s : `${s.slice(0, max - 1).replace(/\s+\S*$/, '')}…`);

export function tripSeo(trip: TripView, origin: TripOriginView) {
  const d = trip.data;
  const dur = `${d.durationNights}N/${d.durationDays}D`;
  const from = origin.fromPrice != null ? ` from ${inr(origin.fromPrice)}` : '';
  const title = d.seo.title ?? `${d.title} Trip from ${origin.label} · ${dur}${from} | HCC`;

  const travel = d.transportOptions[0].label.toLowerCase();
  // Most persuasive facts first: Google truncates around 155–160 characters.
  const parts = [
    d.tagline.replace(/\.?$/, '.'),
    `${dur} group trip from ${origin.label} by ${travel}.`,
    origin.fromPrice != null ? `From ${inr(origin.fromPrice)}/person.` : '',
    origin.next ? `Next departure ${dateLong(origin.next.start)}.` : '',
  ];
  const description = d.seo.description ?? clip(parts.filter(Boolean).join(' '), 165);
  return { title, description };
}
