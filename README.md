# Hyderabad Campers Club: website

Astro 7 static site + Decap CMS. Built for conversion (WhatsApp + enquiry), trust, mobile, SEO and speed, in that order.

Strategy and design decisions: [`docs/phase-1-strategy.md`](docs/phase-1-strategy.md) · [`docs/phase-2-design-system.html`](docs/phase-2-design-system.html)

## Run it

```bash
npm install
npm run dev        # http://localhost:4321  ·  style guide at /styleguide/
npm run build      # static output in dist/
npm run check      # type-check .astro + .ts
```

Edit content locally with the CMS: run `npx decap-server` in a second terminal, then open http://localhost:4321/admin/.

| Env var | Purpose |
|---|---|
| `SITE_URL` | Production origin (canonicals, OG, sitemap). Defaults to a placeholder. |
| `PUBLIC_SHOW_SAMPLES=true` | Include `sample: true` content on public pages (local previews only). |

## How content works

| Collection | Folder | Edited |
|---|---|---|
| **Departures** | `src/content/departures/*.yml` | Weekly: dates, status, seats, price overrides |
| **Trips** | `src/content/trips/*.md` | Itinerary, options, inclusions, policies, story |
| Destinations | `src/content/destinations/*.md` | Destination guides |
| Reviews | `src/content/reviews/*.yml` | Genuine reviews only (`consent: true` required) |
| Guides / Authors | `src/content/guides`, `authors` | Blog |
| Landings | `src/content/landings/*.md` | Category pages (trips pulled in by rule) |
| Site settings | `src/data/site.json` | Announcement, contact, trust strip, payments, tracking IDs |

**One trip, many departures.** A Trip holds everything that is true for every date. A Departure holds only what changes. Every card, page, schema tag and search index is generated from these records through [`src/lib/catalog.ts`](src/lib/catalog.ts):

- price = `departure.optionPrices[combo]` ?? (`departure.price` ?? `trip.basePrice`) + option deltas
- "From ₹" = cheapest future bookable departure for that origin
- seat badge only when `seatsLeft` is set, status is open, and it's ≤ `urgency.seatThreshold`
- strike-through only when a genuine higher `originalPrice` exists
- each trip origin gets its own URL: `/trips/{trip}-from-{city}/`

Invalid content (unknown trip/origin/option, end before start, reviews without consent…) **fails the build**, so it never reaches the live site.

**No fake data.** Empty settings values hide their component (trust items, WhatsApp buttons, address, socials). Files marked `sample: true` exist only to render `/styleguide/` and are excluded from public pages.

## Homepage

`/` renders [`HomePage.astro`](src/components/home/HomePage.astro). Copy, hero photo, trust points, steps, FAQ and Instagram tiles live in [`src/data/home.json`](src/data/home.json) (CMS → Homepage). Every section hides itself until it has real data. `/preview/homepage/` shows the same page with sample data and section notes (noindex).

**Indexing safety:** while `SITE_URL` is unset (placeholder `example.com`), every page outputs `noindex`, so staging deploys can't be indexed. Set `SITE_URL` to the real domain at launch.

## Lead forms

Forms with `data-intent-form` ([`src/scripts/intent-form.ts`](src/scripts/intent-form.ts)) validate name + 10-digit mobile, attach attribution, POST JSON to `/api/intents`, and fire `form_start` → `form_submit` → `generate_lead`. If the endpoint is unreachable, the visitor is offered WhatsApp with their details pre-filled.

## Campaign links

Ads link to the canonical trip page plus parameters; there are no separate landing pages:

```
/trips/ooty-coonoor-from-hyderabad/?d=2026-10-09&opt=3a&view=book&utm_source=instagram&utm_medium=paid_social&utm_campaign=…
```

- `d`: preselects that departure (or the next available one, with a note if it's full)
- `opt`: preselects a transport/stay option
- `view`: `dates` | `itinerary` | `book`

UTMs and click IDs (gclid, gbraid, wbraid, fbclid) are stored first-touch + last-touch ([`src/scripts/attribution.ts`](src/scripts/attribution.ts)) and attached to leads and WhatsApp ref codes. Canonicals always use the clean path.

## Booking pipeline (Razorpay-ready)

`BookingCard` → `hcc:book` event (full selection) → EnquirySheet → `/api/intents` (Phase 4). At launch the intent is an enquiry confirmed on WhatsApp. Turning on `payments.enabled` makes the same intent return `next: "pay"` for Razorpay; the components don't change.

## Analytics

Everything is pushed to `window.dataLayer` ([`src/scripts/analytics.ts`](src/scripts/analytics.ts)). Markup declares tracking with `data-track` / `data-track-params`. Current events: `select_item`, `select_content`, `select_promotion`, `search`, `select_departure`, `click_book`, `click_whatsapp`, `click_call`, `outbound_click`. GTM wiring comes in Phase 6.

## Structure

```
src/
  components/ui/        primitives: Button, Badge, Icon, Stub, RouteLine, DateStub, Price, Photo, Field, Logo…
  components/trip/      TripCard, DepartureCard, DestinationCard, FeaturedTripCard, BookingCard, StickyBar
  components/trust/     TrustBar, ReviewCard, Reviews
  components/content/   Breadcrumbs (+JSON-LD), FAQ, BlogCard
  components/search/    TripFinder, FilterBar
  components/cta/       WhatsAppCTA, WhatsAppBand
  components/layout/    AnnouncementBar, Header (+mega menus, mobile sheet), Footer, MobileNav
  components/seo/       SeoHead
  lib/                  catalog (pricing/availability), settings, format, whatsapp, tracking
  scripts/              client: attribution, analytics, whatsapp, booking
  styles/               tokens.css, base.css, primitives.css
public/admin/           Decap CMS
```
