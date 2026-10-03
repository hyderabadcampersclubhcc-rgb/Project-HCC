/**
 * Content model for HCC.
 *
 * Trip      = everything true for every date (story, itinerary, options, policies).
 * Departure = one dated instance (date, origin, price overrides, seats, status).
 *
 * Every card, page, schema tag, sitemap entry and search index is generated from
 * these collections. Cross-collection rules (a departure's origin must exist on
 * its trip, dates must be ordered, ...) are enforced in src/lib/catalog.ts and
 * fail the build. A typo never reaches the live site.
 *
 * `sample: true` marks illustrative content used by the style guide. Sample
 * entries are excluded from every public page unless PUBLIC_SHOW_SAMPLES=true.
 */
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/* ---------- shared pieces ---------- */

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase-words-with-dashes');

const faq = z.object({ q: z.string().min(5), a: z.string().min(5) });

/** Old WordPress URLs that should 301 to this page, e.g. "/ooty-coonoor/". */
const legacyPaths = z.array(z.string().regex(/^\/[a-z0-9_\/-]*\/$/, 'Use a path like /ooty-coonoor/')).default([]);

const seo = z
  .object({
    title: z.string().max(70).optional(),
    description: z.string().max(170).optional(),
  })
  .default({});

export const TRIP_TYPES = [
  'weekend',
  'trek',
  'camping',
  'backpacking',
  'long',
  'couple',
  'family',
  'corporate',
] as const;

export const TRANSPORT_MODES = ['train', 'bus', 'tempo', 'cab', 'flight', 'self'] as const;
export const MEALS = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;
export const DEPARTURE_STATUS = ['open', 'waitlist', 'soldout', 'closed', 'cancelled'] as const;
export const REGIONS = [
  'karnataka',
  'kerala',
  'tamil-nadu',
  'goa',
  'andhra-telangana',
  'himalaya',
  'north-east',
  'rajasthan',
  'other',
] as const;

/* ---------- destinations ---------- */

const destinations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/destinations' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      region: z.enum(REGIONS),
      state: z.string(),
      summary: z.string().max(220),
      heroImage: image().optional(),
      heroAlt: z.string().optional(),
      distanceFromHydKm: z.number().int().positive().optional(),
      howToReach: z
        .array(z.object({ mode: z.enum(TRANSPORT_MODES), duration: z.string(), note: z.string().optional() }))
        .default([]),
      bestMonths: z.array(z.number().int().min(1).max(12)).default([]),
      idealDuration: z.string().optional(),
      experiences: z
        .array(z.object({ title: z.string(), text: z.string(), image: image().optional(), imageAlt: z.string().optional() }))
        .default([]),
      faqs: z.array(faq).default([]),
      nearby: z.array(reference('destinations')).default([]),
      primaryKeyword: z.string().optional(),
      legacyPaths,
      seo,
      sample: z.boolean().default(false),
    }),
});

/* ---------- trips ---------- */

const origin = z.object({
  city: slug, // e.g. "hyderabad" → URL suffix "-from-hyderabad"
  label: z.string(), // "Hyderabad"
  indexable: z.boolean().default(true),
  pickupPoints: z
    .array(z.object({ name: z.string(), time: z.string().optional(), mapUrl: z.url().optional(), note: z.string().optional() }))
    .default([]),
  outbound: z.string().optional(), // "Overnight sleeper train, Fri 6:30 pm"
  return: z.string().optional(),
});

const transportOption = z.object({
  id: slug,
  label: z.string(), // "Sleeper train"
  mode: z.enum(TRANSPORT_MODES),
  class: z.string().optional(), // "Sleeper", "3AC", "AC sleeper bus"
  priceDelta: z.number().int().default(0),
});

const stayOption = z.object({
  id: slug,
  label: z.string(), // "Quad sharing"
  sharing: z.number().int().min(1).max(12),
  priceDelta: z.number().int().default(0),
});

const trips = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trips' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(), // "Ooty & Coonoor"
        tagline: z.string().max(110), // one-line hook used on cards
        tripTypes: z.array(z.enum(TRIP_TYPES)).min(1),
        destinations: z.array(reference('destinations')).min(1),
        durationNights: z.number().int().min(0),
        durationDays: z.number().int().min(1),
        difficulty: z.enum(['easy', 'moderate', 'challenging']).default('easy'),
        groupSize: z.object({ min: z.number().int(), max: z.number().int() }).optional(),
        ageRange: z.string().optional(),

        origins: z.array(origin).min(1),
        transportOptions: z.array(transportOption).min(1),
        stayOptions: z.array(stayOption).min(1),

        basePrice: z.number().int().positive(), // per person, cheapest option combo
        originalPrice: z.number().int().positive().optional(),
        advanceAmount: z.number().int().positive().optional(), // per person
        gstPercent: z.number().min(0).max(28).optional(),

        highlights: z.array(z.string()).default([]),
        inclusions: z
          .array(
            z.object({
              text: z.string(),
              icon: z.enum(['train', 'bus', 'bed', 'food', 'compass', 'mountain', 'users', 'tent', 'shield', 'check']).default('check'),
              showOnCard: z.boolean().default(false),
              cardLabel: z.string().max(24).optional(), // short label on trip cards, e.g. "Train"
              conditional: z.boolean().default(false),
              fallback: z.string().optional(),
            }),
          )
          .default([]),
        exclusions: z.array(z.string()).default([]),
        itinerary: z
          .array(
            z.object({
              day: z.number().int().min(0),
              title: z.string(),
              description: z.string(),
              meals: z.array(z.enum(MEALS)).default([]),
              stay: z.string().optional(),
            }),
          )
          .default([]),
        stays: z
          .array(
            z.object({
              name: z.string().optional(), // omit if property varies
              type: z.string(), // "Homestay", "Riverside camp"
              location: z.string().optional(),
              washroom: z.enum(['attached', 'shared', 'common']).optional(),
              description: z.string().optional(),
              orSimilar: z.boolean().default(true),
            }),
          )
          .default([]),
        thingsToCarry: z.array(z.string()).default([]),
        importantInfo: z.array(z.string()).default([]),
        suitableFor: z.array(z.string()).default([]),
        notSuitableFor: z.array(z.string()).default([]),
        cancellationPolicy: z.string().optional(), // short summary; full policy page linked
        faqs: z.array(faq).default([]),

        heroImage: image().optional(),
        heroAlt: z.string().optional(),
        gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),

        featured: z.boolean().default(false),
        featuredStory: z.string().max(260).optional(),
        sortOrder: z.number().int().default(100),
        recurrence: z.string().optional(), // "Every Friday" — shown when no dated departure exists
        status: z.enum(['draft', 'live', 'archived']).default('draft'),
        primaryKeyword: z.string().optional(),
        legacyPaths,
        seo,
        sample: z.boolean().default(false),
      })
      .superRefine((t, ctx) => {
        if (t.durationDays < t.durationNights)
          ctx.addIssue({ code: 'custom', message: 'durationDays must be ≥ durationNights', path: ['durationDays'] });
        if (t.originalPrice && t.originalPrice <= t.basePrice)
          ctx.addIssue({ code: 'custom', message: 'originalPrice must be higher than basePrice', path: ['originalPrice'] });
        for (const key of ['transportOptions', 'stayOptions', 'origins'] as const) {
          const ids = t[key].map((o) => ('id' in o ? o.id : o.city));
          if (new Set(ids).size !== ids.length)
            ctx.addIssue({ code: 'custom', message: `Duplicate ids in ${key}`, path: [key] });
        }
        if (t.heroImage && !t.heroAlt)
          ctx.addIssue({ code: 'custom', message: 'heroAlt is required when heroImage is set', path: ['heroAlt'] });
      }),
});

/* ---------- departures (edited most often) ---------- */

const departures = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/departures' }),
  schema: z
    .object({
      trip: reference('trips'),
      origin: slug, // must match one of trip.origins[].city
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      status: z.enum(DEPARTURE_STATUS).default('open'),
      price: z.number().int().positive().optional(), // overrides trip.basePrice
      originalPrice: z.number().int().positive().optional(),
      optionPrices: z
        .array(z.object({ transport: slug.optional(), stay: slug.optional(), price: z.number().int().positive() }))
        .default([]),
      availableOptions: z.object({ transport: z.array(slug).optional(), stay: z.array(slug).optional() }).default({}),
      seatsTotal: z.number().int().positive().optional(),
      seatsLeft: z.number().int().min(0).optional(),
      fillingFast: z.boolean().default(false),
      bookingMode: z.enum(['enquiry', 'payment']).optional(), // default from settings.payments
      note: z.string().max(80).optional(),
      sample: z.boolean().default(false),
    })
    .superRefine((d, ctx) => {
      if (d.endDate < d.startDate) ctx.addIssue({ code: 'custom', message: 'endDate is before startDate', path: ['endDate'] });
      if (d.seatsTotal != null && d.seatsLeft != null && d.seatsLeft > d.seatsTotal)
        ctx.addIssue({ code: 'custom', message: 'seatsLeft cannot exceed seatsTotal', path: ['seatsLeft'] });
    }),
});

/* ---------- reviews (real only) ---------- */

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/reviews' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      rating: z.number().int().min(1).max(5),
      text: z.string().min(20),
      date: z.coerce.date(), // date travelled or reviewed
      source: z.enum(['google', 'instagram', 'direct']),
      sourceUrl: z.url().optional(),
      trip: reference('trips').optional(),
      destination: reference('destinations').optional(),
      photo: image().optional(),
      consent: z.literal(true, { error: 'Only publish reviews with the traveller’s consent' }),
      featured: z.boolean().default(false),
    }),
});

/* ---------- guides & authors ---------- */

const authors = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/authors' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      bio: z.string(),
      photo: image().optional(),
      socials: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    }),
});

export const GUIDE_CATEGORIES = ['weekend-getaways', 'destination-guides', 'treks', 'camping', 'seasonal', 'comparisons', 'stories'] as const;

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(170),
      excerpt: z.string().max(220),
      category: z.enum(GUIDE_CATEGORIES),
      tags: z.array(z.string()).default([]),
      author: reference('authors'),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      heroImage: image().optional(),
      heroAlt: z.string().optional(),
      quickAnswer: z.string().max(400).optional(),
      relatedTrips: z.array(reference('trips')).default([]),
      relatedDestinations: z.array(reference('destinations')).default([]),
      faqs: z.array(faq).default([]),
      primaryKeyword: z.string().optional(),
      draft: z.boolean().default(true),
      sample: z.boolean().default(false),
      seo,
    }),
});

/* ---------- landing pages (collections like /weekend-trips-from-hyderabad/) ---------- */

const landings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/landings' }),
  schema: z.object({
    path: z.string().regex(/^\/[a-z0-9/-]+\/$/, 'Path must start and end with /'),
    title: z.string(), // H1
    intro: z.string(),
    rule: z
      .object({
        tripTypes: z.array(z.enum(TRIP_TYPES)).optional(),
        destinations: z.array(reference('destinations')).optional(),
        maxNights: z.number().int().optional(),
        origin: slug.optional(),
      })
      .default({}),
    faqs: z.array(faq).default([]),
    activeFrom: z.coerce.date().optional(),
    activeUntil: z.coerce.date().optional(),
    primaryKeyword: z.string().optional(),
    /** Other category pages to cross-link (by path), e.g. ['/camping/', '/treks/']. */
    related: z.array(z.string()).default([]),
    seo,
    sample: z.boolean().default(false),
  }),
});

export const collections = { destinations, trips, departures, reviews, authors, guides, landings };
