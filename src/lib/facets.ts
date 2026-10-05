/**
 * Listing facets (filters) for /trips/, category pages and /upcoming-trips/.
 * Each listed item gets data-* attributes from here; src/scripts/listing.ts filters on them
 * in the browser. Options are generated from the data, so a filter that would return zero
 * results is never offered (except "This/Next weekend", which the browser hides when empty).
 */
import type { TripView, TripOriginView } from './catalog';
import { monthLong } from './format';

export type FacetKey = 'month' | 'style' | 'dur' | 'budget' | 'travel';

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface FacetGroup {
  key: FacetKey;
  label: string;
  options: FacetOption[];
}

const STYLE_LABEL: Record<string, string> = {
  weekend: 'Weekend',
  trek: 'Treks',
  camping: 'Camping',
  backpacking: 'Backpacking',
  long: 'Long trips',
  couple: 'Couples',
  family: 'Family',
  corporate: 'Corporate',
};

const DUR: { value: string; label: string; test: (n: number) => boolean }[] = [
  { value: '1n', label: '1 night', test: (n) => n <= 1 },
  { value: '2n', label: '2 nights', test: (n) => n === 2 },
  { value: '3-4n', label: '3–4 nights', test: (n) => n >= 3 && n <= 4 },
  { value: '5n', label: '5+ nights', test: (n) => n >= 5 },
];

const BUDGET: { value: string; label: string; test: (p: number) => boolean }[] = [
  { value: 'u5k', label: 'Under ₹5k', test: (p) => p < 5000 },
  { value: '5-10k', label: '₹5k–10k', test: (p) => p >= 5000 && p < 10000 },
  { value: '10-20k', label: '₹10k–20k', test: (p) => p >= 10000 && p < 20000 },
  { value: '20k', label: '₹20k+', test: (p) => p >= 20000 },
];

const TRAVEL: Record<string, { value: string; label: string }> = {
  train: { value: 'train', label: 'Train' },
  bus: { value: 'road', label: 'Bus / road' },
  tempo: { value: 'road', label: 'Bus / road' },
  cab: { value: 'road', label: 'Bus / road' },
  flight: { value: 'flight', label: 'Flight' },
  self: { value: 'self', label: 'Self-drive' },
};

/** data-* attributes for one trip in a listing. */
export function tripItemAttrs(trip: TripView, origin: TripOriginView = trip.primary) {
  const d = trip.data;
  const dates = origin.bookable.map((x) => x.start);
  const price = origin.fromPrice;
  return {
    'data-item': trip.id,
    'data-dates': dates.join(' '),
    'data-months': [...new Set(dates.map((x) => x.slice(0, 7)))].join(' '),
    'data-start': origin.next?.start ?? '',
    'data-style': d.tripTypes.join(' '),
    'data-dur': DUR.find((x) => x.test(d.durationNights))?.value ?? '',
    'data-nights': String(d.durationNights),
    'data-budget': price != null ? (BUDGET.find((x) => x.test(price))?.value ?? '') : '',
    'data-price': price != null ? String(price) : '',
    'data-travel': [...new Set(origin.transportOptions.map((t) => TRAVEL[t.mode]?.value).filter(Boolean))].join(' '),
    'data-origin': trip.origins.map((o) => o.city).join(' '),
    'data-text': [d.title, d.tagline, ...trip.destinationNames, ...d.tripTypes.map((t) => STYLE_LABEL[t] ?? t)].join(' ').toLowerCase(),
  };
}

/** Facet groups with counts for a set of trips (only options with ≥1 match). */
export function tripFacets(trips: TripView[], keys: FacetKey[] = ['month', 'style', 'dur', 'budget', 'travel'], city?: string): FacetGroup[] {
  const items = trips.map((t) => tripItemAttrs(t, (city && t.origins.find((o) => o.city === city)) || t.primary));
  const count = (attr: keyof ReturnType<typeof tripItemAttrs>, value: string) => items.filter((i) => i[attr].split(' ').includes(value)).length;

  const months = [...new Set(items.flatMap((i) => i['data-months'].split(' ').filter(Boolean)))].sort().slice(0, 6);
  const groups: Record<FacetKey, FacetGroup> = {
    month: {
      key: 'month',
      label: 'When',
      options: [
        { value: 'this-weekend', label: 'This weekend', count: -1 },
        { value: 'next-weekend', label: 'Next weekend', count: -1 },
        ...months.map((m) => ({ value: m, label: monthLong(m).split(' ')[0], count: count('data-months', m) })),
      ],
    },
    style: {
      key: 'style',
      label: 'Travel style',
      options: Object.entries(STYLE_LABEL)
        .map(([value, label]) => ({ value, label, count: count('data-style', value) }))
        .filter((o) => o.count > 0),
    },
    dur: {
      key: 'dur',
      label: 'Duration',
      options: DUR.map((o) => ({ value: o.value, label: o.label, count: count('data-dur', o.value) })).filter((o) => o.count > 0),
    },
    budget: {
      key: 'budget',
      label: 'Budget per person',
      options: BUDGET.map((o) => ({ value: o.value, label: o.label, count: count('data-budget', o.value) })).filter((o) => o.count > 0),
    },
    travel: {
      key: 'travel',
      label: 'Getting there',
      options: [...new Map(Object.values(TRAVEL).map((t) => [t.value, t])).values()]
        .map((t) => ({ value: t.value, label: t.label, count: count('data-travel', t.value) }))
        .filter((o) => o.count > 0),
    },
  };
  // A group with a single option filters nothing useful; drop it (months keep weekend chips).
  return keys.map((k) => groups[k]).filter((g) => (g.key === 'month' ? months.length > 0 : g.options.length > 1));
}
