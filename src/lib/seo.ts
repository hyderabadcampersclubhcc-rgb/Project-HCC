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
  const extra = mode ? ` + ${mode[0].toUpperCase()}${mode.slice(1)}` : from;
  // Longest version that fits Google's ~65 characters: drop the price, then "Trip", then use the short name.
  // "+ Train" is never dropped: it is the overnight-travel clarification, not an optional extra.
  const name = d.seoName ?? d.title;
  const kind = (n: string) => (/\bTrek$/.test(n) ? '' : ' Trip'); // no "Trek Trip"
  const candidates = mode
    ? [
        `${d.title}${kind(d.title)} from ${origin.label} · ${dur}${extra} | HCC`,
        `${d.title} from ${origin.label} · ${dur}${extra} | HCC`,
        `${name}${kind(name)} from ${origin.label} · ${dur}${extra} | HCC`,
        `${name} from ${origin.label} · ${dur}${extra} | HCC`,
      ]
    : [
        `${d.title}${kind(d.title)} from ${origin.label} · ${dur}${extra} | HCC`,
        `${d.title}${kind(d.title)} from ${origin.label} · ${dur} | HCC`,
        `${name}${kind(name)} from ${origin.label} · ${dur}${extra} | HCC`,
        `${name}${kind(name)} from ${origin.label} · ${dur} | HCC`,
        `${name} from ${origin.label} · ${dur} | HCC`,
      ];
  const shortest = candidates.reduce((a, b) => (b.length < a.length ? b : a));
  const title = d.seo.title ?? candidates.find((t) => t.length <= 65) ?? shortest;

  const t0 = origin.transportOptions[0];
  const travel = t0.mode === 'tempo' ? t0.label : t0.label.toLowerCase(); // "Tempo Traveller" is a vehicle name
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
