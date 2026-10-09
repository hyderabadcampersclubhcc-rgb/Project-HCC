# HCC competitor gap report

**Internal document. Never name competitors on the website.** Created 9 Oct 2026.

**Sources (observations only, no traffic or keyword-volume figures):**
- Phase 1 site reviews of Travloger, Weekend Yaari and HTC (homepage, one trip page, one category page each), 3 Oct 2026: `docs/phase-1-strategy.md` §1.
- Tripper Trails' public Bangalore weekend page and trip pages, 5 Oct 2026: `docs/phase-b/`.
- Search results observed 8 Oct 2026 with a US-based search tool: `seo/competitors.md`.
- HCC's own measurements:
  - production-mode build of 9 Oct 2026;
  - Lighthouse runs of 8 Oct 2026;
  - `npm run catalog:audit` → `catalog/catalog-status.md`.

**Caveats:**
- HCC's site is on staging (noindex), so **HCC has no organic rankings yet**. The comparison is about what the sites offer, not how they rank.
- Competitors' backlinks, reviews and speed were not measured with tools; the entries below say "not measured" where that applies.

> **Owner decision, 9 Oct 2026 (final):** Weekend Yaari is a competitor, but its trip data is the same as HCC's and is HCC's **working reference** data. Keep HCC prices and owner-confirmed schedules; flag only specific missing or conflicting fields (`catalog/verification.json`). All previously indexable trip pages remain indexable.

## Priority scale

- **CRITICAL**: blocks launch or risks trust or legal problems.
- **HIGH**: directly limits rankings or enquiries for core searches.
- **MEDIUM**: worth doing within 90 days.
- **LOW**: nice to have.

## Gaps

| # | Area | Competitor advantage (observed) | HCC gap | Recommended action | Priority | Owner | Status |
|---|---|---|---|---|---|---|---|
| 1 | **Data provenance** | – | Trip data is the weekendyaari.in import (owner-approved working reference) plus 23 owner-confirmed facts. 97 specific fields are missing (flagged) | Fill the flagged fields from the WhatsApp catalog or owner answers; no page is blocked | HIGH | HCC (answers), Claude (apply) | In progress |
| 2 | **Reviews / social proof** | Travloger shows a Google rating, review count and traveller count. HTC shows an aggregate rating | No reviews shown (by design: genuine only). Google Business Profile reviews exist but aren't linked into the page content | Send genuine Google reviews; link the GBP; show verbatim reviews with name and month. No AggregateRating schema unless allowed | **CRITICAL** | HCC (material), Claude (display) | Open, awaiting reviews |
| 3 | **Real photos** | Competitors use their own trip photos (Travloger, HTC) | All 36 trip/city pages use stock (Wikimedia) or labelled AI images; 0 HCC photos | Send 6–10 real photos per Tier 1 trip; replace hero images first | **CRITICAL** | HCC (photos), Claude (optimise + place) | Open |
| 4 | **Production launch** | Competitors are indexed and ranking | HCC is staging/noindex; production is still the old WordPress site | Owner review of staging, then launch, Search Console and Bing, sitemap submission | **CRITICAL** | HCC (approve), Claude (execute) | Open, awaiting go-live approval |
| 5 | **Current departure dates** | Travloger shows dates on cards and leads trip pages with dates. Tripper Trails publishes dates. HTC hides them behind "Check Calendar" | HCC shows dated departures for 15 trip/city pairs, but **all dated departures end by 31 Dec 2026**. 21 pairs have no dates ("Weekly departures" or "on request") | Send the 2027 schedule and the weekday pattern for undated trips. Keep the generator and nightly rebuild | HIGH | HCC (schedule), Claude (generate) | Open, awaiting schedule |
| 6 | **Pricing clarity** | Travloger: strike-through plus current price, advance shown | HCC: one price per person, advance on card, no upgrade prices (done). **35 of 36 pairs show a crossed-out "reference price"** | Confirm each crossed-out price was genuinely charged before; otherwise remove it (consumer-protection risk) | HIGH | HCC (confirm), Claude (remove if not) | Open, awaiting owner |
| 7 | **Commercial landing pages** | Weekend Yaari and Travloger have city + intent pages (e.g. weekend getaways from Hyderabad) | HCC has the Hyderabad hub and camping hub (indexable). The Bangalore hub is on hold | Keep the Bangalore hub on hold until its operational data is confirmed. No extra variant pages | MEDIUM | HCC (Bangalore data) | Hold (by decision) |
| 8 | **Trip page depth** | Travloger: in-page tabs (Dates · Itinerary · Stays · Inclusions · FAQs) | HCC has the same, plus "At a glance", data-driven FAQs, a Good-to-know section, stays & travel | Fill the data gaps (rows 9–11) so every block shows | – | Claude | ✅ Done (8 Oct) |
| 9 | **Accommodation detail** | Travloger vague ("villa or homestay"); others similar | 31 of 36 pairs have no stay type | Send stay type and location per trip (hotel/homestay/camp, sharing) | HIGH | HCC | Open |
| 10 | **Departure point / times** | Travloger and Tripper Trails list pickup and reporting times | 24 pairs have no pickup point; 4 have no return time | Send pickup point, reporting time and return time per trip and city | HIGH | HCC | Open |
| 11 | **Booking / advance and suitability** | Travloger shows the advance amount | 27 pairs have no advance amount; 34 have no "suitable for"; 27 have no group size | Send advance per trip; who it suits; group size | MEDIUM | HCC | Open |
| 12 | **FAQs** | Weekend Yaari category pages have no FAQs. HTC has none | HCC: FAQs on the hubs, destinations and every trip page (data-driven), marked up as FAQPage. FAQ markup added to 15 destination pages and both hubs on 9 Oct | Add real customer questions from WhatsApp over time | LOW | HCC (questions) | ✅ Mostly done |
| 13 | **Structured data** | Not measured on competitors | HCC: Organization, WebSite, BreadcrumbList, TouristDestination, TouristTrip (offers from real dates), ItemList, FAQPage. All built from data; automated checks | Keep the automated checks; no ratings without genuine data | LOW | Claude | ✅ Done |
| 14 | **Internal linking** | Weekend Yaari's blog has almost no links to trips (observed) | HCC: hub → trips, destinations → trips, trips → guide + hub. 33 links from indexable to noindex pages remain (breadcrumbs to held category pages, thin destination cross-links) | Owner decision on thin pages (improve or remove from nav); then clear the warnings | MEDIUM | HCC (decide), Claude (implement) | Open, awaiting decision |
| 15 | **Destination coverage** | Competitors list more destinations and international trips | HCC: 15 indexable destinations, all with live HCC trips. Strategy: fewer, stronger pages | Don't chase coverage. Add a destination only when HCC runs a trip there (via catalog intake) | LOW | – | By design |
| 16 | **Content depth (guides)** | Weekend Yaari has a seasonal blog; Travloger has comparison posts ("Coorg or Ooty?") | HCC has 5 guides drafted, all noindex pending review | Owner review: winter guide first (Oct), then the comparison, long weekends, Under ₹8,000, Solo (`content-calendar.md`) | HIGH | HCC (review), Claude (fix) | Open, awaiting review |
| 17 | **Trust signals** | HTC: safety positioning, office address, registered company, support hours. Travloger: WhatsApp hours | HCC: address on the contact page, phone, Instagram, Facebook, GBP link. No support hours, no safety or coordinator detail (22 pairs don't mention a trip captain) | Send WhatsApp support hours and trip-captain details (training, ratio) if real | MEDIUM | HCC | Open |
| 18 | **Authority / backlinks** | Older domains with years of history (not measured) | New site; old WordPress URLs are 301-mapped (49 redirect rules in the generated .htaccess) so existing links carry over | GBP → site link; Instagram and Facebook bios → site; genuine partner mentions (`authority-plan.md`) | HIGH | HCC (external accounts) | Open, after launch |
| 19 | **Performance** | Not measured; Weekend Yaari runs on WordPress/WooCommerce | HCC: Lighthouse desktop 99–100; mobile 89–90 home, 88–98 key pages; CLS 0; no third-party scripts | Keep the budgets; re-test after photos are added | LOW | Claude | ✅ Done (monitor) |
| 20 | **City coverage** | Travloger and Tripper Trails run Bangalore at scale | HCC has Bangalore trips live (Coorg, Gokarna ×2, Munnar, Kerala); the hub is on hold; Munnar and Kerala lack station and times | Confirm the Bangalore operational data, then the hub | MEDIUM | HCC | Hold (by decision) |
| 21 | **Search Console data** | Competitors presumably use real search data (unknown) | No data until production launch | After launch: weekly `npm run seo:report` with GSC exports; act on position 4–10 queries | HIGH | HCC (verify GSC), Claude (analyse) | Open, after launch |
| 22 | **Conversion: WhatsApp** | HTC has a persistent WhatsApp widget; Travloger shows WhatsApp hours | HCC: floating WhatsApp button with trip-specific messages (9 Oct), plus header, sticky bar and booking card | Add support hours when HCC provides them | LOW | HCC (hours) | ✅ Done |

## Where HCC should win (the strategy, not page count)

Fewer, stronger, accurate pages around trips HCC actually runs. Order of strength:
1. Weekend trips from Hyderabad
2. Ooty, Coorg, Gokarna, Wayanad and Araku from Hyderabad
3. Camping near Hyderabad

The levers competitors can't copy are **real HCC data**: dated Thursday/Friday batches, one clear price, honest inclusions, real photos and genuine reviews. Rows 1–6 decide whether that advantage exists at launch.

## Next update

Refresh this report monthly with the SEO report, or as soon as Search Console data exists. Replace "not measured" with evidence only.
