# HCC Website — Phase 1: Strategy, Architecture & Design Direction

**Project:** Hyderabad Campers Club (HCC) website
**Status:** Proposal for review. No code yet.
**Date:** 3 Oct 2026

---

## 0. The core idea in one line

**A fast, photography-led trip catalogue from Hyderabad where every page answers "what, from where, how long, when, how much, what's included, how do I book, can I trust them" without scrolling, and every page has a one-tap path to WhatsApp.**

Priority order, as briefed: Conversion → Trust → Speed → SEO → Mobile UX → Visual appeal → Animation.

---

## 1. Competitor analysis

I reviewed the homepage, a trip page and a category page of each reference site (3 Oct 2026).

### 1.1 Travloger (primary UX reference)

**What it does well**
- **City-first discovery.** Tabs (Domestic / International / Weekend) plus a city switch (Hyderabad / Bangalore). A visitor picks their city once and every card makes sense.
- **Dense but readable trip cards.** Duration chip (2N/3D), destination, a one-line hook, inclusion tags (Stays · Cabs · Sightseeing), route, *actual departure dates on the card*, strike-through plus current price, and a single CTA.
- **Trip page leads with the date picker.** Dates, availability and price come before the itinerary, with a booking card showing the advance amount (₹3,000) and a WhatsApp-backed booking button.
- **In-page tab navigation** on trip pages (Dates · Highlights · Itinerary · Stays · Inclusions · FAQs).
- **Strong trust stack.** Google rating and review count, a traveller count, corporate logos, plus *"half of every group travels alone"*, a smart solo-traveller reassurance.
- **Clear support hours** ("WhatsApp 9am–9pm") repeated in the header and footer.
- **SEO-friendly URLs** such as `/trip/ooty-coonoor-trip-from-hyderabad` and `/weekend-getaways-from-hyderabad`.

**What it's missing / where it's weak**
- No real search on the homepage. Discovery is browse-only.
- The homepage is very long, so key content sits deep in the scroll.
- CTA labels compete with each other ("View dates", "Customise", "See packages").
- "Pay just 30%" (the low-friction advance) is buried mid-page.
- Accommodation is vague ("villa or homestay").
- Conditional inclusions (for example "toy train subject to availability") create expectation risk.
- Duplicate testimonials appear in the carousel.

### 1.2 Weekend Yaari (SEO reference)

**What it does well**
- **City-plus-intent category pages** such as `/tour-category/weekend-trips-from-hyderabad/` that target exact search phrases.
- **Trip slugs that carry the keyword**, for example `/trip/gokarna-dandeli-murudeshwar-package-from-hyderabad/`.
- **A seasonal blog** ("best weekend getaways from Hyderabad during monsoon 2026") that captures informational searches.
- **Clear sorting** (price, popularity) on category pages.

**What it's missing**
- **Thin category pages:** one intro paragraph, then a product grid. No FAQs, no guidance, no reason to rank.
- **Placeholder trust stats ("0+ travellers")**, which damage credibility.
- **WordPress/WooCommerce feel** ("Showing 1–12 of 35 results", generic sorting).
- **Date-based blog URLs** (`/2026/07/01/...`), which age badly and can't be refreshed cleanly.
- **A blog with almost no links to trips.** Informational traffic doesn't flow to bookable pages.

### 1.3 HTC (trust and community reference)

**What it does well**
- **Explicit safety positioning:** "Top Safety", trained trek leaders, risk management, "No Fake Tickets".
- **Operational credibility:** years of experience, a physical Hyderabad office address, a registered company.
- **Separate phone lines** for weekend events and backpacking, which signals a real operation.
- **Seasonal and occasion-led merchandising** (Gandhi Jayanthi long weekend, monsoon specials).
- **WhatsApp chat widget** that is persistent but not intrusive.

**What it's missing**
- Availability hidden behind "Check Calendar".
- A cluttered, dated layout, a duplicated nav, and confusingly similar trip names ("BB COMBO" variants).
- No individual reviews, only an aggregate.
- No FAQs, no native booking flow, weak mobile hierarchy.

### 1.4 Synthesis: what HCC takes, rejects and does better

| Take | From | HCC version |
|---|---|---|
| City switch + trip-type tabs | Travloger | "From Hyderabad" is the default. The city switch only appears once a second departure city exists, so there's no dead Bangalore tab. |
| Dates on the card | Travloger | The next 2–3 departures appear as chips on every card, generated from departure data and never typed by hand. |
| Date-first trip page | Travloger | The booking card (date → price → advance → Book/WhatsApp) sits above the fold, and the advance amount is visible on the card itself. |
| Solo-traveller reassurance | Travloger | Made a pillar: "Come alone. Leave with a crew." |
| City + intent landing pages | Weekend Yaari | Kept, but each page gets real content: a comparison table, best season, travel modes, FAQs, related guides. |
| Keyword-rich trip slugs | Weekend Yaari | Kept, with shorter, cleaner slugs. |
| Safety and operations proof | HTC | A "How we run trips" section with only claims HCC can prove (coordinator per trip, verified stays, emergency line). |
| Occasion merchandising | HTC | Driven by the announcement bar and "collections" (Long Weekend, Monsoon, New Year), all data-driven. |

**Do NOT copy**
- Corporate client logo walls (unless HCC actually has these clients).
- Any number HCC can't evidence ("0+" or invented counts).
- Fake-scarcity patterns.
- Date-stamped blog URLs.
- Duplicated menus.
- Their names, copy, photos or colour schemes.

**Where HCC goes further than all three**
1. **A real trip finder in the hero** (destination, month, style) that filters actual departure data. None of the three has one.
2. **A "Compare trips" view:** up to 3 trips side by side, showing duration, price, transport, stay type, difficulty and best season. Nobody in this segment does this, and it directly serves "allow users to easily compare trips".
3. **Honest inclusions:** every conditional item gets a visible "subject to availability" tag plus the fallback. This turns Travloger's weakness into a trust signal.
4. **Stay transparency:** stay type, room sharing (twin/triple/quad), and washroom attached or shared, shown as structured fields.
5. **Guides that sell:** every guide auto-renders a "Trips to this destination" block and a WhatsApp CTA that names the destination.
6. **Campaign-matched landing:** ad and UTM-aware pages that keep the visitor on the exact trip they clicked, with lead attribution stored server-side.

---

## 2. Recommended tech stack (decision needed; see §14)

| Layer | Recommendation | Why |
|---|---|---|
| Framework | **Astro 5** (static output + islands) | Ships no JavaScript by default, which gives the best Core Web Vitals for an image-heavy content site. Interactive bits (filters, booking card, forms, compare) are small islands. Strong SEO control per page. |
| Content | **Astro Content Collections** with Zod schemas (trips, departures, destinations, guides, reviews, settings) | Typed data, so a missing price or a malformed date fails the build instead of shipping. One trip record feeds every card, page, schema tag and sitemap entry. |
| CMS | **Decap CMS** (git-based, free, at `/admin`) — *or* **Sanity** if budget allows | The marketing team edits prices, dates, seats, banners and blogs in a form UI with no code. Decap needs no extra service. Sanity offers a nicer editor, instant previews and scheduled publishing. |
| Images | `astro:assets` → AVIF/WebP, responsive `srcset`, explicit dimensions, lazy loading below the fold | Keeps LCP under 2.0s on 4G and CLS at roughly 0. |
| Hosting | **Cloudflare Pages** or **Netlify** (free tier is enough at launch) | Global CDN, Mumbai/Chennai edge, serverless functions for lead capture, auto-rebuild on CMS save (about 1 minute). |
| Leads | Serverless function → **Google Sheet** (day 1) and/or CRM, plus an email/WhatsApp notification to the team | Each lead stores trip, departure, UTM, gclid/fbclid and landing page. |
| Payments (phase 2) | **Razorpay** payment links/checkout for the advance amount | Fits the "reserve your seat with an advance" flow. Fires `begin_checkout` and `purchase`. |
| Tracking | **GTM** (single container) → GA4, Google Ads, Meta Pixel. **Meta CAPI** from the lead function. | One place for marketing to manage tags without deploys. |
| Fonts | Self-hosted, subsetted (Fontsource) | No render-blocking third-party font requests. |

**Why not WordPress:** it is easy to edit, but the plugin weight, theme bloat and performance ceiling are exactly what makes the reference sites feel dated.
**Why not a full Next.js app:** more JavaScript and more infrastructure than a catalogue + leads site needs. Astro can grow into server rendering (SSR) later if live inventory is needed.

---

## 3. Information architecture & URL map

### 3.1 Key decision: search-intent ownership

The biggest SEO risk for a site like this is **keyword cannibalisation**: three of your own pages competing for "Hyderabad to Ooty trip". Each intent gets exactly one owner:

| Search intent | Example query | Owner page |
|---|---|---|
| Transactional, specific trip | "ooty coonoor trip from hyderabad", "hyderabad to ooty group trip" | **Trip page** `/trips/ooty-coonoor-from-hyderabad/` |
| Commercial, destination-level | "ooty tour packages from hyderabad", "ooty trip packages" | **Destination page** `/destinations/ooty/` (lists all Ooty trips, season, how to reach, guides) |
| Category / city | "weekend trips from hyderabad", "camping near hyderabad" | **Collection page** `/weekend-trips-from-hyderabad/`, `/camping/` |
| Informational | "hyderabad to ooty travel guide", "ooty vs coorg", "how to reach ooty from hyderabad" | **Guide** `/travel-guides/hyderabad-to-ooty-travel-guide/` |

Every page links *up* (breadcrumbs) and *across* to the other owners, using anchor text that matches that owner's intent.

### 3.2 URL map

```
/                                         Home
/trips/                                   All trips (filterable catalogue + compare)
/trips/{trip-slug}/                       Trip detail   e.g. /trips/ooty-coonoor-from-hyderabad/
/upcoming-trips/                          All departures by date (calendar/list view)

/weekend-trips-from-hyderabad/            ★ Primary local-SEO money page
/treks/                                   Treks & adventure (incl. "treks near Hyderabad")
/camping/                                 Camping (incl. "camping near Hyderabad")
/backpacking-trips/                       Long backpacking trips
/long-trips/                              Himalayan / NE / extended
/couple-trips/
/family-trips/
/corporate-trips/
/customised-trips/                        Custom-trip lead page (form-first)
/collections/{slug}/                      Time-bound: october-long-weekend, new-year, monsoon
                                          (noindex when expired, or 301 to evergreen)

/destinations/                            Destination index (by region: Karnataka, Kerala, TN, AP/Telangana, Himalaya, NE)
/destinations/{slug}/                     e.g. /destinations/ooty/, /destinations/gokarna/

/travel-guides/                           Guides hub (category filters)
/travel-guides/{slug}/                    e.g. /travel-guides/hyderabad-to-coorg-travel-guide/
/travel-guides/category/{slug}/           weekend-getaways, treks, camping, seasonal, comparisons
                                          (tags = on-page filters only, NOT indexed URLs → avoids thin tag pages)

/reviews/                                 All genuine reviews (+ link to Google profile)
/about/                                   Story, team, how we run trips, safety
/contact/                                 NAP, map, WhatsApp, hours
/faq/                                     Booking, payment, safety, solo travel
/cancellation-policy/  /terms/  /privacy-policy/
/sitemap-index.xml  /robots.txt
```

**Notes on your proposed URLs**
- You listed both `/weekend-trips/` and `/weekend-trips-from-hyderabad/`. With only Hyderabad departures, these would be duplicates. I recommend keeping `/weekend-trips-from-hyderabad/` and 301-redirecting `/weekend-trips/` to it. If Bangalore departures start, `/weekend-trips/` becomes a hub linking to each city page.
- The nav says "Travel Stories" but the URL says `/travel-guides/`. I recommend **"Travel Guides"** everywhere, since that matches search intent. Traveller stories can live as a category inside it.
- Trip slugs drop filler words: `/trips/ooty-coonoor-from-hyderabad/`, not `.../ooty-coonoor-trip-package-from-hyderabad/`.
- Trailing slashes are used consistently, and one canonical host (`https://www.<domain>/` or apex; pick one).

### 3.3 Navigation

**Desktop (sticky, about 64px, condensing on scroll)**
```
[HCC logo]  Trips▾  Weekend Getaways  Treks  Camping  Long Trips  Destinations▾  Guides   [WhatsApp ◎] [Explore Trips]
```
- **Trips▾** is a mega-menu. It has columns for trip types (Weekend, Treks, Camping, Backpacking, Long, Couple, Family, Corporate, Customised), Upcoming this month (3 live departures from data), and a "Plan a custom trip" card.
- **Destinations▾** is a mega-menu grouped by region, with thumbnails.
- "About Us" and "Customised Trips" live in the Trips menu and the footer. That keeps the top bar to 7 items, versus 9 in the brief.

**Mobile**
- Top: logo + hamburger (full-screen sheet with big tap targets and search at the top).
- **Bottom action bar** (always visible, about 64px, safe-area aware), with 4 slots:
  `Trips · Dates · Search · WhatsApp`
  On trip pages it becomes the trip CTA: `₹6,999 · Next: 9 Oct  [WhatsApp] [Book Seat]`.
- No floating WhatsApp bubble on top of the bottom bar. One WhatsApp entry point per viewport, so it never feels pushy.

---

## 4. Homepage wireframe (mobile-first)

Each section notes **why it exists** and **its single CTA**.

```
┌─────────────────────────────────────┐
│ ▸ October Long Weekend trips are LIVE → │  1. Announcement (CMS: text, link, start/end date, on/off)
├─────────────────────────────────────┤
│ HCC                         ☰       │  2. Nav
├─────────────────────────────────────┤
│                                     │
│   [ cinematic photo / muted loop ]  │  3. HERO. LCP = poster image (AVIF, preloaded)
│                                     │     Video only on desktop + good connection, after load
│  Your Weekend. Your Adventure.      │     H1 (SEO): visually the tagline; includes
│  Your People.                       │     "Group trips from Hyderabad" in a visually
│  Group trips, weekend getaways,     │     integrated sub-line for keyword relevance
│  treks & escapes from Hyderabad.    │
│                                     │
│ ┌─ Trip finder ───────────────────┐ │     Where? (destination / type, typeahead)
│ │ Where? ▾  When? ▾  Style ▾      │ │     When?  (This weekend / Oct / Nov / Dec…)
│ │ [ Find My Trip ]                │ │     Style  (Weekend / Adventure / Camping / Long)
│ └─────────────────────────────────┘ │     → /trips/?dest=&month=&style= (fires `search`)
│ [Explore Trips]  Plan a Custom Trip │
├─────────────────────────────────────┤
│ ★ 4.x Google · N travellers ·       │  4. TRUST STRIP. Horizontal scroll on mobile.
│ Weekly departures · HYD based ·     │     Every value from settings; an item is HIDDEN
│ Trip support                        │     if its value is empty. Never shows "0+".
├─────────────────────────────────────┤
│ Upcoming Trips                      │  6. UPCOMING DEPARTURES (moved UP: highest intent)
│ Pick a date. Pack your bags…        │     Filter chips: This weekend · Next weekend · Oct ·
│ (This wknd)(Next wknd)(Oct)(Nov)…   │     Nov · Dec  (+ city chip only if >1 city)
│ ◀ [DepartureCard][DepartureCard] ▶  │     Swipeable; "See all dates →" /upcoming-trips/
├─────────────────────────────────────┤
│ Where are you going next?           │  5. DESTINATION DISCOVERY
│ (Weekend)(Long)(Adventure)(Camping) │     Tabs filter trip data; cards show
│ [Card][Card]                        │     image, name, 2N/3D, From ₹, From HYD,
│ [Card][Card]                        │     "Every Friday" / next date, Explore →
├─────────────────────────────────────┤
│ Travel your way                     │  8. TRIP TYPES → SEO landing pages
│ [🌿 Weekend][🏕 Camping][🥾 Treks]  │     Photo tiles with icon, NOT emoji in production
│ [🎒 Backpack][🏔 Long][❤ Couples]  │     (custom line icons for brand consistency)
│ [👨‍👩‍👧 Family][🏢 Corporate][✨ Custom]│
├─────────────────────────────────────┤
│ Weekend Trips From Hyderabad        │  7. LOCAL SEO BLOCK (H2) with ~80 words of genuine
│ Escape Hyderabad for the weekend…   │     copy + 6 destination links + "How far is it?"
│ Ooty · Coorg · Gokarna · Dandeli…   │     mini-table (distance / travel mode / best for)
│ [View all weekend trips →]          │     → /weekend-trips-from-hyderabad/
├─────────────────────────────────────┤
│ ███ Featured: Coorg & Chikmagalur   │  9. FEATURED TRIPS. Large editorial cards with a
│ "Coffee estates, mist, and a        │     2-line story hook + 3 highlight bullets + price.
│  campfire you'll talk about…"       │     Max 4; carousel on mobile.
├─────────────────────────────────────┤
│ Why travel with HCC?                │ 10. TRUST PILLARS (6, icon + 1 line + proof)
│ Real people, real trips · No        │     + "Come alone. Leave with a crew." solo callout
│ confusing packages · Verified stays │     + photo of an actual HCC group
├─────────────────────────────────────┤
│ 01 Choose → 02 Reserve → 03 Travel  │ 11. HOW IT WORKS (shows the advance amount explicitly)
│ [Start Exploring →]                 │
├─────────────────────────────────────┤
│ Real traveller reviews  ★ 4.x Google│ 12. REVIEWS: real only, with source + date.
│ [ReviewCard][ReviewCard] ▶          │     "Read all reviews on Google →"
├─────────────────────────────────────┤
│ See where we've been  @hcc          │ 13. INSTAGRAM: curated grid (not a live embed:
│ [img][reel][img]                    │     embeds are heavy). Each tile → IG post.
│ [img][img][reel]                    │     Follow HCC on Instagram →
├─────────────────────────────────────┤
│ Can't find your perfect trip?       │ 14. CUSTOM TRIP: short form (Name, Phone,
│ [Name][Phone][Where?][When?]        │     Destination, Dates) + "More details" expander
│ [+ travellers, budget, type]        │     (travellers, budget, type). Or WhatsApp.
│ [Plan My Trip]  or  WhatsApp us     │
├─────────────────────────────────────┤
│ Travel Guides & Stories             │ 15. GUIDES: 3 latest + 3 pillar guides
│ [BlogCard][BlogCard][BlogCard]      │
├─────────────────────────────────────┤
│ FAQ (5 Qs: solo? safe for women?    │     Homepage FAQ: answers real objections;
│ how to pay? cancellation? pickup?)  │     FAQPage schema NOT used (Google no longer
│                                     │     shows it for most sites; we keep the content)
├─────────────────────────────────────┤
│ Footer: destinations by region,     │     Footer = internal-link engine + NAP for local SEO
│ trip types, guides, NAP, hours,     │
│ socials, policies                   │
└─────────────────────────────────────┘
│ [Trips] [Dates] [Search] [WhatsApp] │  Mobile bottom bar
```

**Two deliberate deviations from your section order:**
1. **Upcoming Trips moves above "Where are you going next?"** Instagram and ad visitors who land on the homepage are often already decided on *when* (this weekend, the long weekend). Dates are the strongest conversion hook, and Travloger's own trip pages confirm this by leading with dates.
2. **A short homepage FAQ** is added just before the footer, to handle the 5 objections that block a first booking.

---

## 5. Conversion funnel

```
TRAFFIC SOURCE            LANDING                    MICRO-CONVERSIONS              MACRO
─────────────────────────────────────────────────────────────────────────────────────────────
Google organic  ───► Collection / Destination / ─► view_item, select_item ──┐
                     Guide page                                             │
Google Ads      ───► Trip page or collection     ─► view dates, get         ├─► generate_lead
                     (matched to ad group)          itinerary (PDF→lead)    │   (form / WhatsApp)
Instagram/Meta  ───► Trip page directly          ─► click_whatsapp ─────────┤
                     (never the homepage)                                   ├─► begin_checkout
WhatsApp/direct ───► Home / Upcoming trips       ─► search, compare ────────┘   (advance payment)
                                                                                 └─► purchase
```

**Three conversion paths, equal citizens:**
1. **WhatsApp (expected to be #1).** Pre-filled message with trip, date and source. Fires `click_whatsapp`.
2. **Enquiry form.** 2 required fields (name, phone), the rest optional. Fires `form_start`, `form_submit` and `generate_lead`.
3. **Book a seat.** Choose date → sharing type → pay the advance (Razorpay, phase 2). Until then, "Book Your Seat" opens a 3-field form and the team calls back.

**"Get Full Itinerary"** is a soft lead magnet: name + WhatsApp number → itinerary sent on WhatsApp / downloadable PDF. This captures warm visitors who aren't ready to talk yet.

**Pre-filled WhatsApp message pattern**
```
Hi HCC! I'm interested in the Ooty & Coonoor trip from Hyderabad (departure: 9 Oct).
[ref: TRP-OOTY · ig_reel_oct]
```
The short reference code lets the team attribute WhatsApp chats to a campaign without asking the customer.

**Ethical urgency rules (enforced in code)**
- "Only X seats left" renders **only** if `seatsLeft` is set in data and ≤ a threshold (default 8).
- "Filling fast" renders only if the team ticks it for that departure.
- No countdown timers, no fake "12 people viewing", no auto-popups on page load.
- Strike-through price renders only if `originalPrice` is set *and* greater than `price`.

---

## 6. Trip page structure

**URL:** `/trips/ooty-coonoor-from-hyderabad/`
**Title:** `Ooty & Coonoor Group Trip from Hyderabad · 2N/3D from ₹6,999 | HCC`

```
Breadcrumbs: Home › Weekend Trips from Hyderabad › Ooty & Coonoor
┌─────────────────────────────┬──────────────────────┐
│ GALLERY (1 large + 4 thumbs;│ BOOKING CARD (sticky │
│ mobile: swipe, counter 1/12)│ on desktop)          │
│                             │ From ₹6,999 /person  │
│ H1 Ooty & Coonoor Group Trip│ ~₹7,999~ (if set)    │
│ from Hyderabad              │ Select date:         │
│ ⏱ 2N/3D · 🚆 From Hyderabad │ (9 Oct ●)(16 Oct)…   │
│ 📅 Next: Fri 9 Oct · 🚌 Train│ Sharing: Quad/Triple/│
│ ★ rating (only if real)     │ Twin (price per)     │
│                             │ Reserve with ₹X adv. │
│ Quick facts strip:          │ [Book Your Seat]     │
│ Difficulty · Best for ·     │ [WhatsApp HCC]       │
│ Group size · Age range      │ Get Full Itinerary → │
└─────────────────────────────┴──────────────────────┘
Sticky section tabs: Overview · Dates · Itinerary · Stays · Inclusions · Pickup · Policies · FAQs · Reviews

1. Overview: 2–3 paragraph story (unique copy) + 4–6 highlights
2. Dates & prices: table of departures (date, return, price, seats status, Book)
3. Day-wise itinerary: accordion, Day 0 (departure) → Day N, with meals icons
4. Stays: property type, sharing, washroom, photos, "or similar" stated honestly
5. Transport: mode, class (e.g. Sleeper/3AC/AC bus), what happens if unavailable
6. Pickup & drop points: list + map link + reporting time
7. Inclusions ✓ / Exclusions ✗: side by side; conditional items tagged
8. Things to carry · Important info · Who this trip is for / not for
9. Cancellation & payment policy: summarised, link to full
10. FAQs (trip-specific, 5–8)
11. Reviews from this trip (real, with date travelled)
12. Related: same destination · same duration · guides for this destination
```
**Mobile:** the gallery is first, then title and quick facts, then an inline booking card. Once the inline card scrolls away, the bottom bar becomes `₹6,999 · 9 Oct · [WhatsApp] [Book Seat]`.

**Schema:** `TouristTrip` (itinerary as `ItemList` of places), `Offer` per departure (price, priceCurrency INR, availability, validFrom), `BreadcrumbList`. AggregateRating is added only when reviews are first-party, displayed on the page and genuinely collected.

---

## 7. Destination page structure

**URL:** `/destinations/ooty/` · **H1:** "Ooty Trips from Hyderabad"

1. Hero image + H1 + one-line positioning + `[View Ooty Trips]` `[WhatsApp]`
2. **Trips to Ooty** (all trips that include Ooty, from data) with next departures
3. **Ooty at a glance:** distance from Hyderabad, how to reach (train/bus/flight + time), ideal duration, best months (12-month strip with colour bars), weather, budget range
4. **Top experiences** (6–8, each with photo + 2 lines). Written uniquely per destination.
5. **Sample itinerary** (links to the trip page for the full one)
6. **Ooty vs nearby** (e.g. vs Coorg, vs Kodaikanal) mini comparison → guide link
7. **Guides about Ooty** (auto-linked by destination tag)
8. **FAQs** (destination-level: "Is Ooty good in October?")
9. **Nearby destinations** (by region) + CTA band (custom trip)

**Thin-content guardrail:** a destination page is indexable only if it has ≥1 trip *or* ≥400 words of destination content. Otherwise it renders with `noindex` until it's ready. This rule lives in the data schema.

---

## 8. Collection / landing page structure

E.g. `/weekend-trips-from-hyderabad/`

1. H1 + 2-line intro + filter bar (Month · Duration · Budget · Type · Sort)
2. Trip grid (from data), with an Upcoming dates toggle
3. **"Weekend getaway planner" table:** destination · distance · how you get there · trip length · best season · from-price (all generated from data, so it stays accurate)
4. "Which weekend trip is right for you?" (by persona: first-timers, nature, beach, adventure, budget)
5. 300–600 words of editorial guidance (unique per page)
6. FAQs · related guides · nearby collections

---

## 9. Blog / guide structure

**URL:** `/travel-guides/{slug}/`. No dates in URLs, so guides can be refreshed annually ("Best monsoon trips from Hyderabad" keeps one URL forever).

**Data model:** title, slug, metaTitle, metaDescription, excerpt, category, tags[], author (→ author profile with bio and photo; E-E-A-T), publishedAt, updatedAt, heroImage(+alt), relatedTrips[], relatedDestinations[], faqs[], body (MDX).

**Template:**
```
Breadcrumbs › H1 › author · updated date · read time
Hero image
[Quick answer box: 2–3 sentence TL;DR, for featured snippets / AI overviews]
Table of contents (auto from H2s; sticky on desktop, collapsible on mobile)
Body with inline <TripCallout trip="ooty-coonoor-from-hyderabad"/> components
"Trips mentioned in this guide" (relatedTrips)
FAQs
Author box
Related guides (same category / destination)
WhatsApp CTA band: "Want us to plan this for you?"
```
**Schema:** `Article` (headline, author Person, datePublished, dateModified, image), `BreadcrumbList`.

**Launch content plan (12 guides, by priority)**

| # | Guide | Intent / role |
|---|---|---|
| 1 | Best Weekend Getaways from Hyderabad | Pillar, links to every weekend trip |
| 2 | Best Places to Visit Near Hyderabad (within 300 km) | Pillar, short-trip/camping |
| 3 | Hyderabad to Ooty Travel Guide | Cluster → Ooty trip |
| 4 | Hyderabad to Coorg Travel Guide | Cluster → Coorg trip |
| 5 | Hyderabad to Gokarna Travel Guide | Cluster → Gokarna trip |
| 6 | Hyderabad to Wayanad Travel Guide | Cluster → Wayanad trip |
| 7 | Best Treks Near Hyderabad | Pillar → /treks/ |
| 8 | Best Camping Places Near Hyderabad | Pillar → /camping/ |
| 9 | Ooty vs Coorg: Which to Pick? | Comparison (high conversion) |
| 10 | Best Long Weekend Trips from Hyderabad | Seasonal; update each year |
| 11 | Best Monsoon Trips from Hyderabad | Seasonal |
| 12 | Best Summer Trips from Hyderabad | Seasonal |

I'll build the templates and write 2–3 sample guides. All factual travel details (distances, train names, timings) **must be verified by HCC** before publishing.

---

## 10. Analytics & tracking architecture

### 10.1 Plumbing
```
Page → dataLayer.push({...}) → GTM → GA4 · Google Ads · Meta Pixel
Lead form → /api/lead (serverless) → Google Sheet/CRM + team alert
                                   → Meta Conversions API (dedup by event_id)
                                   → (optional) GA4 Measurement Protocol
```
- **Consent:** Google Consent Mode v2 defaults, plus a lightweight consent banner (needed if you'll run ads to EU audiences; good practice anyway under India's DPDP Act).
- **Attribution capture:** on first landing, store `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `gbraid`, `wbraid`, `fbclid`, the landing page and the referrer. Both **first-touch** and **last-touch** go in a first-party cookie/localStorage (90 days). Every form submission and WhatsApp click carries them. They are never put into WhatsApp text in full, only the short ref code.
- **Internal links don't need UTMs.** The stored values persist, which avoids polluting GA4 sessions.

### 10.2 Event spec

| Event | Fires when | Key parameters |
|---|---|---|
| `page_view` | Every page (GA4 auto) | page_type (home/trip/destination/collection/guide) |
| `view_item_list` | Trip grid/list visible | item_list_name (e.g. "upcoming_home"), items[] |
| `select_item` | Trip card clicked | item_list_name, items[{item_id, item_name, item_category=trip_type, price}] |
| `view_item` | Trip page load | trip_id, trip_name, destination, duration, price, departure_city, next_departure_date |
| `search` | Trip finder / filter submit | search_term, destination, month, trip_style |
| `form_start` | First interaction with any form | form_name (custom_trip / book_seat / itinerary / contact), trip_name |
| `form_submit` | Submit clicked (pre-validation) | form_name |
| `generate_lead` | Server accepted the lead (**primary conversion**) | form_name, trip_name, destination, departure_date, value (est.), currency=INR, lead_id |
| `click_whatsapp` | Any WhatsApp CTA (**conversion**) | cta_location (header/bottom_bar/trip_card/booking_card…), trip_name, destination |
| `click_call` | tel: link | cta_location |
| `click_book` | "Book Your Seat" | trip_name, departure_date, sharing_type, price |
| `begin_checkout` | Payment step opened (phase 2) | value=advance, items[] |
| `purchase` | Razorpay success webhook / thank-you page | transaction_id, value, items[] |
| `outbound_click` | Instagram/Google reviews/maps links | link_url, link_domain |
| `compare_trips` | Compare view opened | trip_ids |
| `get_itinerary` | Itinerary lead magnet submitted | trip_name |

Google Ads conversions to import: `generate_lead`, `click_whatsapp`, `purchase` (with value). Meta standard events: `ViewContent`, `Search`, `Lead`, `Contact` (WhatsApp), `InitiateCheckout`, `Purchase`. Remarketing audiences: viewed trip X but no lead · started form · viewed ≥3 trips.

---

## 11. Design direction

### 11.1 Concept: "Field Notes from Hyderabad"
Premium **and** adventurous comes from *restraint plus great photography*, not from gradients and effects. Think of a well-made outdoor-gear brand catalogue crossed with a modern booking app: confident typography, generous imagery, warm natural colours and tiny "trail-marker" details (route dots, duration chips that look like ticket stubs) that are distinctly HCC.

### 11.2 Palette (proposed; adjust to your existing logo if you have one)

| Token | Colour | Use |
|---|---|---|
| `--forest-900` | `#0E3B2E` deep forest green | Primary brand: header, footer, headings on light |
| `--forest-600` | `#1F6B4F` | Hover/secondary surfaces, links |
| `--marigold-500` | `#F4A51C` marigold | **Primary CTA** (Book / Explore). Warm, Indian, high-energy, readable with dark text |
| `--ember-600` | `#D9481C` campfire ember | Sparing accent: urgency badges, "Filling fast" |
| `--sand-50` | `#FBF8F3` | Page background (warmer than pure white, photo-friendly) |
| `--sand-100` | `#F3EDE3` | Section bands, card backgrounds |
| `--ink-900` | `#14191A` | Body text |
| `--ink-600` | `#4A5553` | Secondary text |
| `--line` | `#E4DDD1` | Borders |
| `--whatsapp` | `#25D366` (icon only) | The WhatsApp button itself uses forest/ink so it doesn't clash, with a green icon |

Dark text on marigold passes WCAG AA. All text/background pairs will be contrast-checked in Phase 2.

### 11.3 Typography
- **Display:** *Bricolage Grotesque* (variable): characterful, slightly quirky, young and confident, without being "adventure-brand cliché" stencil fonts.
- **Body/UI:** *Inter* (variable): highly legible at small sizes and on prices/dates (tabular numerals).
- Both self-hosted and subsetted to Latin. The display font is used only for H1–H3 and prices.
- Fluid type scale (clamp): H1 40→64px, H2 28→40px, H3 20→24px, body 16→17px, small 14px.

### 11.4 Components look and feel
- **Cards:** 16px radius, photo-first (4:5 on mobile, 4:3 desktop), duration chip overlaid on the image, price in display font, one clear CTA. Soft shadow only on hover/focus.
- **Badges:** pill shapes, solid for status (Filling fast), outline for meta (2N/3D).
- **Buttons:** primary (marigold, ink text), secondary (forest outline), WhatsApp (ink/forest with a green icon), text link with arrow. Minimum 48px tap height.
- **Motion:** 150–250ms ease-out on hover/press, a fade-up on section reveal (respects `prefers-reduced-motion`), no parallax, no autoplay carousels.
- **Icons:** one line-icon set (Lucide or Phosphor, tree-shaken SVG). No emoji in production UI.
- **Photography rules:** real HCC trip photos wherever possible, people-in-landscape over empty landscapes, warm grading, no stock "business people with suitcases".

### 11.5 Performance budget
| Metric | Target (mobile, 4G) |
|---|---|
| LCP | < 2.0s |
| CLS | < 0.05 |
| INP | < 150ms |
| JS shipped (home) | < 60 KB gz (excluding GTM) |
| Hero image | < 120 KB AVIF |
| Lighthouse | 95+ performance, 100 SEO, 100 accessibility, 100 best practices |

GTM/Pixel load after interaction or idle, using Partytown if feasible, so third-party scripts don't sink LCP.

---

## 12. Data model (the "add 100 trips without redesign" layer)

```ts
Destination { slug, name, region, state, heroImage, gallery[], summary, body,
              distanceFromHyd, howToReach[], bestMonths[1..12], idealDuration,
              highlights[], faqs[], nearby[], seo{title,description,ogImage}, indexable }

Trip        { slug, title, shortTitle, destinations[] → Destination, tripTypes[]
              (weekend|trek|camping|backpacking|long|couple|family|corporate),
              durationNights, durationDays, departureCity, transportMode, transportClass,
              difficulty, groupSize, ageRange, priceFrom, originalPrice?, advanceAmount,
              sharingPrices[{type, price}], storyHook, overview, highlights[],
              itinerary[{day, title, description, meals[], stay?}],
              inclusions[{text, conditional?, fallback?}], exclusions[],
              stays[{name?, type, sharing, washroom, images[]}],
              pickupPoints[{name, time, mapUrl}], thingsToCarry[], importantInfo[],
              cancellationPolicy → Policy, faqs[], gallery[], featured, sortOrder,
              recurring? ("Every Friday"), seo{…}, status (draft|live|archived) }

Departure   { trip → Trip, startDate, endDate, price?, originalPrice?,
              seatsTotal?, seatsLeft?, status (open|filling|soldout|cancelled),
              fillingFast?, notes? }        ← the most-edited record; one per date

Review      { name, tripRef?, destination?, rating, text, date, source
              (google|instagram|direct), sourceUrl?, photo?, consent:true, featured }

Guide       { …see §9 }
Author      { name, slug, bio, photo, socials[] }
Settings    { announcement{text,url,start,end,enabled}, whatsappNumber, phone, email,
              address(NAP), hours, socials, stats{travellers?, googleRating?,
              googleReviewCount?, yearsActive?, …}, gtmId, … }
Collection  { slug, title, intro, filter (tripTypes/destinations/dateRange), body, faqs,
              activeFrom?, activeUntil? }
```
Price, dates, seats and the "next departure" text are **always computed** from `Departure` records. When a date passes, it disappears automatically on the next build (plus a scheduled daily rebuild).

---

## 13. Build plan (Phases 2–7)

| Phase | Output |
|---|---|
| 2. Design system | Tokens (CSS custom properties), type scale, buttons, badges, forms, cards, a live `/styleguide` page |
| 3. Homepage | All 15 sections wired to data, mobile-first, with sample data clearly marked as placeholder |
| 4. Components | TripCard, DepartureCard, DestinationCard, ReviewCard, BlogCard, FAQ, BookingCard, BookingForm, WhatsAppCTA, TrustBadge, Breadcrumbs, FilterBar, SearchBar, CompareTray, Gallery |
| 5. Pages | Trip, destination, collection, guides hub + guide, upcoming, about, contact, FAQ, policies, 404, thank-you |
| 6. SEO + tracking | Meta/OG/Twitter, canonicals, sitemap, robots, JSON-LD, GTM dataLayer, UTM persistence, lead API, Decap CMS config |
| 7. Audit | Lighthouse (mobile) per template, axe accessibility, link checker, schema validator, event QA checklist, 375/390/414/768/1024/1440 visual checks, IG in-app-browser check |

---

## 14. What I need from HCC (blocking the "real" launch, not the build)

I will build with clearly-marked placeholder data. Before going live, HCC must supply:

1. **WhatsApp number + call number + support hours**
2. **Business address** (for Google Business Profile / local SEO; must match exactly), email, domain
3. **Real stats** you can stand behind: travellers count, Google rating & review count, years running, trips run
4. **Logo** (or approval for me to design an interim HCC wordmark)
5. **Trip data** for 5–8 launch trips: itinerary, inclusions/exclusions, stays, transport, pickup points, prices, upcoming dates, advance amount, cancellation policy
6. **Photos** from real HCC trips (originals; I'll optimise them)
7. **Genuine reviews** (Google review text + reviewer consent where you show names/photos)
8. **Instagram handle** + 9–12 chosen posts/reels
9. **Accounts/IDs:** GA4, GTM, Google Ads, Meta Pixel (can be added later)
10. **Payments:** enquiry-only at launch, or Razorpay advance payments from day 1?
