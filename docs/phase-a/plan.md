# Phase A plan (for approval)

Nothing below is live yet. The weekend page draft is in `weekend-trips-from-hyderabad.md`.

## B. Grade A destination pages

**Template (H2s):** Why visit · Best time to visit · Main attractions · How to reach from Hyderabad · How to reach from Bangalore (only where HCC runs a Bangalore trip) · HCC trips to {place} (by departure city) · FAQs · Nearby destinations.

**Indexing rule:** a page goes visible to Google only when it has those sections with real content, links to at least one live HCC trip, and doesn't compete with a trip page. The destination page answers "about {place}"; the trip page answers "{place} trip from {city}".

| Destination | HCC trips (live data) | Departure cities | Price range | Available from project | Needed from HCC ⚑ |
|---|---|---|---|---|---|
| Ooty | 4 (Ooty & Coonoor, Isha, Couples, Wayanad–Ooty–Mysore) | Hyderabad | ₹7,999+ | Itineraries, train route via Mysore, attractions visited | Route tips; best months (my current values are general knowledge); **Bangalore Ooty trip?** (none in data yet) |
| Coorg | 2 (Coorg–Chikmagalur, Coorg from Mysore) | Hyderabad, Bangalore, Mysore | ₹6,499–6,999 | Itineraries, attractions, Kacheguda 7 pm | Bangalore pickup, timings |
| Gokarna | 3 (Gokarna–Dandeli, Couples, Hampi–Gokarna) | Hyderabad, Bangalore, Vijayawada | ₹5,999+ | Very detailed: trains, timings, camps, add-ons | Confirm beach camp details |
| Wayanad | 2 | Hyderabad | ₹7,999–12,999 | Itinerary, Thursday 7 pm Kacheguda | Best months, monsoon notes |
| Munnar | 4 (Munnar, 2 Kerala trips, Honeymoon) | Hyderabad, Bangalore, Vijayawada, Kochi | ₹8,999+ | Itineraries, Coimbatore route | Bangalore details |
| Hampi | 1 | Hyderabad | ₹8,999 | Detailed itinerary, sleeper bus | More Hampi tips/photos |
| Chikmagalur | 1 | Hyderabad, Bangalore | ₹6,999 | Itinerary | Covered heavily by Coorg; may merge into one page (see note) |
| Ananthagiri | 1 | Hyderabad | ₹1,600 | Your PDF: trains, campsite, schedule, nearby sights | None, already rich |
| Araku | 1 | Hyderabad | ₹6,999 | Detailed itinerary, Thursday 5:30 pm | Best months |
| Pondicherry | 2 | Hyderabad | ₹7,199–7,499 | Highlights, Nampally 5 pm | Day-wise plan for the Pondicherry trip (none in source) |
| Dandeli | 3 | Hyderabad, Bangalore, Vijayawada | ₹5,999+ | River activities, camp details | Rafting season dates |

Note: **Chikmagalur** has one trip, shared with Coorg. I recommend keeping it indexable only if it gets its own real content (Mullayanagiri, Baba Budangiri, coffee estates); otherwise make it grade B.

⚑ **How-to-reach and best-time facts:** I can write journey options from HCC's own trip data (which train or bus, which station). I won't add journey times or distances unless they're in HCC's data or you confirm them.

## C. Grade B: recommendation

| Enrich now (distinct searches + real HCC trips) | Keep noindex for now (covered by a stronger page) |
|---|---|
| **Kashmir**: big search, full 5-day HCC itinerary | **Coonoor**: covered by Ooty |
| **Manali**: 2 HCC trips (Manali–Kasol, Shimla–Manali) | **Mysore**: a transit stop, not a destination trip |
| **Goa**: full itinerary, distinct search | **Murudeshwar**: covered by Gokarna |
| **Alleppey**: 3 Kerala trips; becomes the "Kerala backwaters" page | **Varkala**: covered by Alleppey/Kerala |
| | **Lonavala**: one trip that starts from Pune; later |
| | **Gandikota**: covered by Camping near Hyderabad |
| | **Dudhsagar**: seasonal; covered by Dandeli |

## D. Grade C: stay noindex
Agra, Jaipur, Delhi, Shimla, Kasol, Matheran, Lohagad, Harishchandragad, Tiruvannamalai, Vizag, Narsapur. **Why:** each is either one stop on a longer trip, or covered by a stronger page (the Golden Triangle trip, Manali, Lonavala, Araku, Camping). The pages stay live for visitors and links, but stay out of Google and the sitemap.

## E. Technical changes (exact list)

| Type | Change |
|---|---|
| **Redirect** | `/camping/` → `/camping-near-hyderabad/` (301). The old WordPress links `/ananthagiri-hills/` and `/ananthagiri/` keep pointing to the Ananthagiri trip. |
| **Canonical** | The new camping page points to itself; nothing points to `/camping/`. No other canonical changes. |
| **Sitemap** | Gains: `/weekend-trips-from-hyderabad/`, `/camping-near-hyderabad/` (once approved), grade A destinations, and Kashmir, Manali, Goa and Alleppey. Loses: the 18 grade B (keep) and C destination pages, which are currently in it. |
| **Indexing** | New `seoTier` field on destinations (A, B or C), editable in the CMS. C, and B pages not yet enriched, are noindex. Category pages keep the existing guard (3+ trips and 150+ words) and an explicit "ready for Google" switch that is only turned on after your approval. |
| **Internal links** | Trip page → its destination page(s) ("About Ooty →") and the city category. Destination page → its trips grouped by departure city. Category page → trips and destinations in the text. Homepage → the city category. No added link blocks or footers. |
| **Schema** | No new types. FAQPage only where FAQs are visible. Existing TouristTrip, ItemList, BreadcrumbList and Organization stay. No Event or LocalBusiness. |
| **Not touched** | Homepage selector, dates, Bangalore hub, reviews, policies, guides, Search Console (later phases). |

⚑ You mentioned `/trips/ooty-coonoor-from-bangalore/`. **There is no Bangalore Ooty trip in HCC's data yet**, so that page doesn't exist. If HCC runs Ooty from Bangalore, send the details in Phase B.

---

## Status: implemented (Oct 2026)
- `/weekend-trips-from-hyderabad/`: approved content live, `indexable: true`
- `/camping/` → `/camping-near-hyderabad/` (301), new content, `indexable: true`
- Destinations graded A/B/C (`seoTier`), all `indexable: false` except **Ooty** and **Gokarna** (enriched)
- Breadcrumbs: category → destination → trip (Bangalore trips no longer link to the Hyderabad page)
- Trip pages link "Plan your visit: {place} travel guide" for approved destinations
- Destination pages group trips by departure city; H1 says "from Hyderabad & Bangalore" only where real
- Fixed mobile overflow on category and destination pages (comparison table)
- Next: remaining Grade A destinations, then Grade B (Kashmir, Manali, Goa, Alleppey)
