/**
 * The catalog: the single place that turns Trip + Departure content into the
 * resolved data every surface uses (cards, upcoming rails, trip pages,
 * destination pages, guides, search index, schema, sitemap).
 *
 * Rules implemented here (see docs/phase-2-design-system.html §6):
 *  - price  = departure.optionPrices[combo] ?? (departure.price ?? trip.basePrice) + option deltas
 *  - from ₹ = min price over future, bookable departures for that origin
 *  - seats  = shown only when entered, status open, and ≤ settings.urgency.seatThreshold
 *  - sample content is excluded unless PUBLIC_SHOW_SAMPLES=true or { samples: true }
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { settings } from './settings';
import { isoDate, todayIST } from './format';

export type TripEntry = CollectionEntry<'trips'>;
export type DepartureEntry = CollectionEntry<'departures'>;
export type DestinationEntry = CollectionEntry<'destinations'>;

export type Urgency = 'seats' | 'filling' | null;

export interface ResolvedDeparture {
  id: string;
  tripId: string;
  origin: string;
  start: string; // YYYY-MM-DD
  end: string;
  status: DepartureEntry['data']['status'];
  bookable: boolean; // open or waitlist
  /** Final per-person price for every available transport|stay combo. */
  prices: Record<string, number>;
  /** Cheapest available combo. */
  price: number;
  originalPrice: number | null;
  options: { transport: string[]; stay: string[] };
  seatsLeft: number | null; // only set when it should be displayed
  urgency: Urgency;
  note: string | null;
  bookingMode: 'enquiry' | 'payment';
}

export interface TripOriginView {
  city: string;
  label: string;
  indexable: boolean;
  url: string;
  departures: ResolvedDeparture[]; // future, not cancelled/closed, sorted (sold out kept for proof of demand)
  bookable: ResolvedDeparture[];
  next: ResolvedDeparture | null;
  fromPrice: number | null;
  fromOriginalPrice: number | null;
  /** City-specific values, falling back to the trip's (Phase B). */
  recurrence: string | undefined;
  itinerary: TripEntry['data']['itinerary'];
  inclusions: TripEntry['data']['inclusions'];
  exclusions: string[];
  transportOptions: TripEntry['data']['transportOptions'];
  /** Destination names on this city's route (route line, schema). */
  destinationNames: string[];
}

export interface TripView {
  id: string;
  entry: TripEntry;
  data: TripEntry['data'];
  origins: TripOriginView[];
  primary: TripOriginView; // first origin (Hyderabad for HCC)
  url: string;
  destinationNames: string[];
}

export const comboKey = (transport: string, stay: string) => `${transport}|${stay}`;

export const tripUrl = (tripId: string, city: string) => `/trips/${tripId}-from-${city}/`;
export const destinationUrl = (id: string) => `/destinations/${id}/`;
export const guideUrl = (id: string) => `/travel-guides/${id}/`;

const SHOW_SAMPLES = import.meta.env.PUBLIC_SHOW_SAMPLES === 'true';

interface Options {
  /** Include sample entries (style guide). */
  samples?: boolean;
  /** Override "today" (tests / previews). */
  today?: string;
}

function resolvePrice(trip: TripEntry['data'], dep: DepartureEntry['data'], transport: string, stay: string) {
  // Most specific override wins: exact combo > single dimension.
  const overrides = dep.optionPrices
    .filter((p) => (!p.transport || p.transport === transport) && (!p.stay || p.stay === stay))
    .sort((a, b) => Number(!!b.transport) + Number(!!b.stay) - (Number(!!a.transport) + Number(!!a.stay)));
  if (overrides[0]) return overrides[0].price;

  const t = trip.transportOptions.find((o) => o.id === transport)!;
  const s = trip.stayOptions.find((o) => o.id === stay)!;
  const cityBase = trip.origins.find((o) => o.city === dep.origin)?.basePrice;
  return (dep.price ?? cityBase ?? trip.basePrice) + t.priceDelta + s.priceDelta;
}

function resolveDeparture(entry: DepartureEntry, trip: TripEntry): ResolvedDeparture {
  const d = entry.data;
  const t = trip.data;
  const cityTransport = t.origins.find((o) => o.city === d.origin)?.transport;
  const transport = d.availableOptions.transport ?? cityTransport ?? t.transportOptions.map((o) => o.id);
  const stay = d.availableOptions.stay ?? t.stayOptions.map((o) => o.id);

  const prices: Record<string, number> = {};
  for (const tr of transport) for (const st of stay) prices[comboKey(tr, st)] = resolvePrice(t, d, tr, st);
  const price = Math.min(...Object.values(prices));

  const original = d.originalPrice ?? (d.price == null ? t.originalPrice : undefined) ?? null;
  const bookable = d.status === 'open' || d.status === 'waitlist';

  const showSeats = d.status === 'open' && d.seatsLeft != null && d.seatsLeft > 0 && d.seatsLeft <= settings.urgency.seatThreshold;
  const urgency: Urgency = showSeats ? 'seats' : d.status === 'open' && d.fillingFast ? 'filling' : null;

  return {
    id: entry.id,
    tripId: trip.id,
    origin: d.origin,
    start: isoDate(d.startDate),
    end: isoDate(d.endDate),
    status: d.status,
    bookable,
    prices,
    price,
    originalPrice: original && original > price ? original : null,
    options: { transport, stay },
    seatsLeft: showSeats ? d.seatsLeft! : null,
    urgency,
    note: d.note ?? null,
    bookingMode: settings.payments.enabled ? (d.bookingMode ?? settings.payments.defaultBookingMode) : 'enquiry',
  };
}

function validate(trips: TripEntry[], deps: DepartureEntry[]) {
  const errors: string[] = [];
  const byId = new Map(trips.map((t) => [t.id, t]));
  for (const dep of deps) {
    const trip = byId.get(dep.data.trip.id);
    const where = `departures/${dep.id}`;
    if (!trip) {
      errors.push(`${where}: trip "${dep.data.trip.id}" does not exist`);
      continue;
    }
    if (!trip.data.origins.some((o) => o.city === dep.data.origin))
      errors.push(`${where}: origin "${dep.data.origin}" is not listed in trips/${trip.id} origins`);
    for (const id of dep.data.availableOptions.transport ?? [])
      if (!trip.data.transportOptions.some((o) => o.id === id)) errors.push(`${where}: unknown transport option "${id}"`);
    for (const id of dep.data.availableOptions.stay ?? [])
      if (!trip.data.stayOptions.some((o) => o.id === id)) errors.push(`${where}: unknown stay option "${id}"`);
    for (const p of dep.data.optionPrices) {
      if (p.transport && !trip.data.transportOptions.some((o) => o.id === p.transport))
        errors.push(`${where}: optionPrices uses unknown transport "${p.transport}"`);
      if (p.stay && !trip.data.stayOptions.some((o) => o.id === p.stay))
        errors.push(`${where}: optionPrices uses unknown stay "${p.stay}"`);
    }
    if (dep.data.sample && !trip.data.sample) errors.push(`${where}: sample departure attached to a real trip`);
  }
  if (errors.length) throw new Error(`Content validation failed:\n  - ${errors.join('\n  - ')}`);
}

const cache = new Map<string, Promise<TripView[]>>();

/** All live trips with resolved departures, sorted by sortOrder then next departure. */
export function getTrips(opts: Options = {}): Promise<TripView[]> {
  const key = `${opts.samples ?? SHOW_SAMPLES}|${opts.today ?? ''}`;
  if (!cache.has(key)) cache.set(key, loadTrips(opts));
  return cache.get(key)!;
}

async function loadTrips(opts: Options): Promise<TripView[]> {
  const includeSamples = opts.samples ?? SHOW_SAMPLES;
  const today = opts.today ?? todayIST();

  const allTrips = await getCollection('trips');
  const allDeps = await getCollection('departures');
  const destNames = new Map((await getCollection('destinations')).map((d) => [d.id, d.data.name]));
  validate(allTrips, allDeps);
  const missingDest = allTrips.flatMap((t) => t.data.destinations.filter((d) => !destNames.has(d.id)).map((d) => `trips/${t.id}: destination "${d.id}" does not exist`));
  if (missingDest.length) throw new Error(`Content validation failed:\n  - ${missingDest.join('\n  - ')}`);

  const trips = allTrips.filter((t) => t.data.status === 'live' && (includeSamples || !t.data.sample));

  const views = trips.map((entry): TripView => {
    const resolved = allDeps
      .filter((d) => d.data.trip.id === entry.id)
      .map((d) => resolveDeparture(d, entry))
      .filter((d) => d.start >= today && d.status !== 'cancelled' && d.status !== 'closed')
      .sort((a, b) => a.start.localeCompare(b.start));

    const origins = entry.data.origins.map((o): TripOriginView => {
      const departures = resolved.filter((d) => d.origin === o.city);
      const bookable = departures.filter((d) => d.bookable);
      const cheapest = bookable.reduce<ResolvedDeparture | null>((m, d) => (!m || d.price < m.price ? d : m), null);
      const recurrence = o.recurrence ?? entry.data.recurrence;
      // A city itinerary reuses the photo of the trip's day with the same number.
      const itinerary = o.itinerary
        ? o.itinerary.map((day) => {
            if (day.image) return day;
            const base = entry.data.itinerary.find((x) => x.day === day.day);
            return { ...day, image: base?.image, imageAlt: base?.imageAlt, imageCredit: base?.imageCredit };
          })
        : entry.data.itinerary;
      return {
        city: o.city,
        label: o.label,
        indexable: o.indexable,
        url: tripUrl(entry.id, o.city),
        departures,
        bookable,
        next: bookable[0] ?? null,
        // No dated departure yet → fall back to the trip's base price (e.g. recurring trips).
        fromPrice: cheapest?.price ?? (recurrence ? (o.basePrice ?? entry.data.basePrice) : null),
        fromOriginalPrice: cheapest ? cheapest.originalPrice : recurrence ? (o.originalPrice ?? entry.data.originalPrice ?? null) : null,
        recurrence,
        itinerary,
        inclusions: o.inclusions ?? entry.data.inclusions,
        exclusions: o.exclusions ?? entry.data.exclusions,
        transportOptions: o.transport ? entry.data.transportOptions.filter((x) => o.transport!.includes(x.id)) : entry.data.transportOptions,
        destinationNames: (o.stops ?? entry.data.destinations.map((d) => d.id)).map((id) => destNames.get(id) ?? id),
      };
    });

    return {
      id: entry.id,
      entry,
      data: entry.data,
      origins,
      primary: origins[0],
      url: origins[0].url,
      destinationNames: entry.data.destinations.map((d) => destNames.get(d.id)!),
    };
  });

  return views.sort(
    (a, b) =>
      a.data.sortOrder - b.data.sortOrder ||
      (a.primary.next?.start ?? '9999').localeCompare(b.primary.next?.start ?? '9999'),
  );
}

export async function getTrip(id: string, opts: Options = {}) {
  return (await getTrips(opts)).find((t) => t.id === id) ?? null;
}

export interface UpcomingItem {
  trip: TripView;
  origin: TripOriginView;
  departure: ResolvedDeparture;
}

/** Flat, date-sorted list of bookable departures across all trips. */
export async function getUpcoming(opts: Options & { limit?: number; origin?: string } = {}): Promise<UpcomingItem[]> {
  const trips = await getTrips(opts);
  const items = trips.flatMap((trip) =>
    trip.origins
      .filter((o) => !opts.origin || o.city === opts.origin)
      .flatMap((origin) => origin.bookable.map((departure) => ({ trip, origin, departure }))),
  );
  items.sort((a, b) => a.departure.start.localeCompare(b.departure.start) || a.departure.price - b.departure.price);
  return opts.limit ? items.slice(0, opts.limit) : items;
}

/** Trips that visit a destination (destination pages, DestinationCard counts). */
export async function getTripsForDestination(destinationId: string, opts: Options = {}) {
  return (await getTrips(opts)).filter((t) => t.data.destinations.some((d) => d.id === destinationId));
}

/** Origin cities that currently have bookable departures (drives the city chip: hidden if ≤1). */
export async function getActiveOrigins(opts: Options = {}) {
  const trips = await getTrips(opts);
  const map = new Map<string, string>();
  for (const t of trips) for (const o of t.origins) if (o.bookable.length) map.set(o.city, o.label);
  return [...map].map(([city, label]) => ({ city, label }));
}

/** Visual fallback tone for imagery-less content (style guide / missing photos). */
export function toneFor(trip: TripEntry['data']): 'hills' | 'beach' | 'dusk' | 'snow' | 'forest' | 'camp' | 'coffee' {
  const dest = trip.destinations.map((d) => d.id).join(' ');
  if (trip.tripTypes.includes('camping')) return 'camp';
  if (/gokarna|goa|varkala|pondicherry|vizag|murudeshwar/.test(dest)) return 'beach';
  if (/manali|kashmir|ladakh|spiti|himachal|sikkim/.test(dest)) return 'snow';
  if (/coorg|chikmagalur|sakleshpur/.test(dest)) return 'coffee';
  if (trip.tripTypes.includes('trek')) return 'forest';
  if (/wayanad|dandeli|araku|maredumilli|munnar/.test(dest)) return 'forest';
  return 'hills';
}

export interface TripRule {
  tripTypes?: string[];
  destinations?: { id: string }[];
  maxNights?: number;
  origin?: string;
}

/** Trips matching a category page's rule (all conditions must hold; empty rule = all trips). */
export async function getTripsForRule(rule: TripRule, opts: Options = {}) {
  const dests = new Set((rule.destinations ?? []).map((d) => d.id));
  return (await getTrips(opts)).filter(
    (t) =>
      (!rule.tripTypes?.length || t.data.tripTypes.some((x) => rule.tripTypes!.includes(x))) &&
      (!dests.size || t.data.destinations.some((d) => dests.has(d.id))) &&
      (rule.maxNights == null || t.data.durationNights <= rule.maxNights) &&
      (!rule.origin || t.origins.some((o) => o.city === rule.origin)),
  );
}
