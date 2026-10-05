/** Page-title and meta-description templates generated from content (CMS overrides win). */
import type { TripView, TripOriginView } from './catalog';
import { inr, dateLong } from './format';

const clip = (s: string, max: number) => (s.length <= max ? s : `${s.slice(0, max - 1).replace(/\s+\S*$/, '')}…`);

export function tripSeo(trip: TripView, origin: TripOriginView) {
  const d = trip.data;
  const dur = `${d.durationNights}N/${d.durationDays}D`;
  const from = origin.fromPrice != null ? ` from ${inr(origin.fromPrice)}` : '';
  // A city with overnight journeys both ways says so ("2N/3D + Train"); the price moves to the description to keep the title short.
  const mode = origin.overnightTravel;
  const title =
    d.seo.title ??
    (mode
      ? `${d.title} Trip from ${origin.label} · ${dur} + ${mode[0].toUpperCase()}${mode.slice(1)} | HCC`
      : `${d.title} Trip from ${origin.label} · ${dur}${from} | HCC`);

  const travel = d.transportOptions[0].label.toLowerCase();
  // Most persuasive facts first: Google truncates around 155–160 characters.
  const price = origin.fromPrice != null ? `From ${inr(origin.fromPrice)}/person.` : '';
  const next = origin.next ? `Next departure ${dateLong(origin.next.start)}.` : '';
  const parts = mode
    ? // Overnight-travel trips lead with the schedule and price, so neither is cut off.
      [`${dur} + overnight ${mode} travel from ${origin.label}${origin.travelWindow ? ` (${origin.travelWindow})` : ''}.`, price, d.tagline.replace(/\.?$/, '.')]
    : [d.tagline.replace(/\.?$/, '.'), `${dur} group trip from ${origin.label} by ${travel}.`, price, next];
  const description = d.seo.description ?? clip(parts.filter(Boolean).join(' '), 165);
  return { title, description };
}
