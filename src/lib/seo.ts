/** Page-title and meta-description templates generated from content (CMS overrides win). */
import type { TripView, TripOriginView } from './catalog';
import { inr, dateLong, travelSuffix, overnightTitle } from './format';
import { isSelfCamp } from './trip-facts';

const clip = (s: string, max: number) => (s.length <= max ? s : `${s.slice(0, max - 1).replace(/\s+\S*$/, '')}…`);

export function tripSeo(trip: TripView, origin: TripOriginView) {
  const d = trip.data;
  const dur = `${d.durationNights}N/${d.durationDays}D`;
  const from = origin.fromPrice != null ? ` from ${inr(origin.fromPrice)}` : '';
  // A city with overnight journeys both ways says so ("2N/3D + Train"); the price moves to the description to keep the title short.
  const mode = origin.overnightTravel;
  const extra = mode ? ` + ${overnightTitle(mode)}` : from;
  // Longest version that fits Google's ~65 characters: drop the price, then "Trip", then use the short name.
  // "+ Train" is never dropped: it is the overnight-travel clarification, not an optional extra.
  const name = d.seoName ?? d.title;
  const kind = (n: string) => (/\bTrek$/.test(n) ? '' : ' Trip'); // no "Trek Trip"
  const camp = isSelfCamp(trip, origin);
  const price0 = origin.fromPrice != null ? `from ${inr(origin.fromPrice)}` : '';
  // Self-reach camps: campsite name + price, no "Trip from Hyderabad" (the camping hub owns "camping near Hyderabad").
  const campCandidates = [
    `${d.title} · ${dur}${price0 ? `, ${price0}` : ''} | HCC`,
    `${name} · ${dur}${price0 ? `, ${price0}` : ''} | HCC`,
    `${name}${price0 ? ` · ${price0}` : ''} | HCC`,
    `${name} · ${dur} | HCC`,
  ];
  const candidates = camp
    ? campCandidates
    : mode
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
      [`${dur} ${travelSuffix(origin)} from ${origin.label}${origin.travelWindow ? ` (${origin.travelWindow})` : ''}.`, price, d.tagline.replace(/\.?$/, '.')]
    : camp
      ? // Camp + price first so Google's ~160-character cut never drops the price.
        [`${dur} camp near ${origin.label}${origin.fromPrice != null ? `, ${inr(origin.fromPrice)}/person` : ''}.`, d.tagline.replace(/\.?$/, '.')]
      : [d.tagline.replace(/\.?$/, '.'), `${dur} group trip from ${origin.label} by ${travel}.`, price, next];
  const description = d.seo.description ?? clip(parts.filter(Boolean).join(' '), 165);
  return { title, description };
}
