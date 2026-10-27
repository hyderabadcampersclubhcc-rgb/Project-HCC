# SEO content sprint: 20 travel guides (27 Oct 2026)

Status of every article, the facts still awaiting HCC confirmation, overlap decisions and how the
articles are managed in the CMS. All 20 are **published on staging but noindex** (`draft: false`,
`indexable: false`), the same review gate as the existing guides: they stay out of Google and the
sitemap until HCC reviews each one and switches **Show in Google (indexable)** on in the CMS.

## How the articles stay accurate

- Prices, dates and the advance/cancellation wording are **never typed by hand**. Articles use
  plain-text tokens that the site fills from live trip data on every build (`src/lib/guide-tokens.ts`):
  `{{trip-table: id, id | Caption}}`, `{{trip: id}}`, `{{price: id}}`, `{{price: id@city}}`,
  `{{next: id}}`, `{{advance-summary}}`. A price change on a trip page updates every article.
- `npm run check:integrity` (rule 11) fails the build if a token names a trip that doesn't exist or
  a token is left unexpanded on a page.
- HCC trip facts (inclusions, times, routes, rules) come from the trip and destination files.
- Outside facts were kept to stable, checked basics (Gandikota: Kadapa district gov't site and
  Wikipedia; Mullayanagiri height; Bhongir Fort distance; Dandeli rafting depending on dam releases).
  Where sources disagree, the article qualifies the fact or leaves it out.
- No reviews, ratings, popularity claims, festive prices or invented timings. `check:integrity`
  enforces the claim rules (it caught and we removed 3 "most popular" phrases and 2 variant-price phrases).

## CMS

- The 20 articles are `.md` files in `src/content/guides/`, editable in **Travel guides** in `/admin/`
  (title, slug, description, excerpt, category, tags, dates, hero image + alt, quick answer, related
  trips and destinations, FAQs, SEO title/description, draft, **indexable** (new field), body).
- The body field's help text explains the live-data tokens.
- **Limitation:** the 5 older guides are `.mdx` (they use components), so they don't appear in the
  CMS. Converting them to `.md` with tokens is a format-only change that needs HCC's approval.
- Revision history: every CMS save is a Git commit (restore is part of admin-panel step 3.7).

## The 20 articles

URL prefix: `/travel-guides/`. "Links" = main internal links in the body (all articles also show
related-trip cards, FAQs and "More guides").

| # | Title | URL slug | Primary intent / keyword (assumed, no keyword tool used) | Status | Main internal links | Facts awaiting confirmation |
|---|---|---|---|---|---|---|
| 1 | Best Weekend Trips from Hyderabad by Budget | weekend-trips-from-hyderabad-by-budget | Commercial research: "weekend trips from hyderabad by budget" | Staging, noindex, awaiting review | Camping hub, 9 trip pages, under-8000 guide, couple guide, policy | None (prices live) |
| 2 | Weekend Trips from Hyderabad Under ₹5,000 | weekend-trips-from-hyderabad-under-5000 | Commercial: "weekend trips from hyderabad under 5000" | Staging, noindex | 4 Ananthagiri camps, Gandikota, camping hub, budget guide, Gandikota guide | Balance deadline for 3 camps; paid extras |
| 3 | Best 2-Day and 3-Day Group Trips from Hyderabad | 2-day-and-3-day-group-trips-from-hyderabad | Informational: "2 day trip from hyderabad" | Staging, noindex | Camps, 7 weekend trips, Kerala/Hampi, long-weekend 2027 guide | Ooty return times |
| 4 | Solo Group Trips from Hyderabad: What to Expect on Your First One | solo-group-trips-from-hyderabad | Informational: "solo group trips from hyderabad" | Staging, noindex, **overlap flag** | Existing solo guide, 4 trips, packing list | Rooming arrangement per trip |
| 5 | Couple Trips and Family Weekend Getaways from Hyderabad | couple-and-family-weekend-getaways-from-hyderabad | Commercial research: "couple trips from hyderabad" | Staging, noindex | 3 couple trips, camps, Wayanad, Ooty, Golden Triangle, Kerala guide | Children's policy; Gokarna couple-trip accommodation type |
| 6 | Best Time to Visit Gokarna and Dandeli | best-time-to-visit-gokarna-and-dandeli | Informational: "best time to visit gokarna and dandeli" | Staging, noindex | Gokarna trips, Dudhsagar, budget/itinerary guide, Christmas guide, destination pages | Rafting season (depends on dam releases) |
| 7 | Gokarna Trip Budget and Itinerary from Hyderabad | gokarna-trip-budget-and-itinerary-from-hyderabad | Informational: "gokarna trip from hyderabad" | Staging, noindex | Gokarna trip, packages guide, season guide, packing list | None |
| 8 | Coorg and Chikmagalur Travel Guide | coorg-and-chikmagalur-travel-guide | Informational: "coorg and chikmagalur travel guide" | Staging, noindex | Coorg trip card, packages guide, destinations, Ooty vs Coorg | None |
| 9 | Ooty and Coonoor Itinerary from Hyderabad | ooty-coonoor-itinerary-from-hyderabad | Informational: "ooty coonoor itinerary from hyderabad" | Staging, noindex | Ooty trips, prices guide, Wayanad, Ooty vs Coorg | Ooty boarding point, departure and return times (confirm on WhatsApp) |
| 10 | Kerala Trip Planning Guide from Hyderabad | kerala-trip-planning-guide-from-hyderabad | Informational: "kerala trip from hyderabad" | Staging, noindex | 4 Kerala trips, Munnar/Alleppey destinations | Kerala group dates (on request) |
| 11 | Camping Near Hyderabad: Locations, Costs and Facilities Explained | camping-near-hyderabad-costs-and-facilities | Informational/commercial: "camping near hyderabad cost" (hub keeps "camping near hyderabad") | Staging, noindex, **overlap flag** | Camping hub, Ananthagiri and Gandikota guides, policy | GST, children's policy, group size, safety, check-in times (3 camps), Trance Veechika rain dance, Sarpanpally extras |
| 12 | Ananthagiri Hills Camping Guide | ananthagiri-hills-camping-guide | Informational: "ananthagiri hills camping guide" (comparison page keeps "ananthagiri hills camping") | Staging, noindex | Comparison page, 4 camps, costs guide, packing list | Check-in times (3 camps); balance deadlines |
| 13 | Gandikota Camping and Canyon Travel Guide | gandikota-camping-guide | Informational: "gandikota camping" | Staging, noindex | Gandikota trip card, destination, Ananthagiri guide, costs guide | Meals: trip page says 2 breakfasts but the itinerary shows 1 (**data conflict**); child rate amount; balance deadline |
| 14 | What to Pack for a Camping Trip | what-to-pack-for-a-camping-trip | Informational: "what to pack for camping" | Staging, noindex | 2 camps, camping guides | None |
| 15 | Beginner-Friendly Treks Near Hyderabad: Where to Start | beginner-friendly-treks-from-hyderabad | Informational: "beginner treks near hyderabad" | Staging, noindex | 2 camps, Gandikota, Coorg, Gokarna, 2 Sahyadri treks | Bhongir Fort entry rules/timings (not HCC; told to check locally) |
| 16 | Gokarna Group Tour Packages from Hyderabad: Compared | gokarna-group-tour-packages-from-hyderabad | Commercial: "gokarna tour package from hyderabad" | Staging, noindex | 4 Gokarna trips (+ Bangalore, Vijayawada), itinerary and season guides | Gokarna couple-trip accommodation; GST on trips other than Hampi |
| 17 | Ooty Group Trip Prices and Inclusions from Hyderabad | ooty-group-trip-prices-and-inclusions | Commercial: "ooty group trip price" | Staging, noindex | 4 Ooty trips, itinerary guide, Ooty vs Coorg | Ooty travel details (confirm on WhatsApp) |
| 18 | Coorg Packages from Hyderabad: Group Trip Options Compared | coorg-packages-from-hyderabad | Commercial: "coorg package from hyderabad" | Staging, noindex | 3 Coorg trip pages, travel guide | None |
| 19 | Christmas and New Year Group Trips from Hyderabad (2026–27) | christmas-and-new-year-group-trips-from-hyderabad | Seasonal commercial: "new year trips from hyderabad" | Staging, noindex | 8 trips with departures on 24/25/31 Dec | Ooty return dates; **January 2027 dates not confirmed** (article says so); no festive prices or events listed |
| 20 | Train vs Bus for Weekend Group Trips from Hyderabad | train-vs-bus-for-weekend-group-trips-from-hyderabad | Informational: "train vs bus weekend trip hyderabad" | Staging, noindex | Trips by transport type, duration/solo/budget guides | Arunachalam train-or-bus per departure |

## Overlap (cannibalisation) decisions

| New article | Overlaps with | How they differ | Recommendation for HCC |
|---|---|---|---|
| #4 Solo group trips | Existing guide *Solo Trips from Hyderabad* | New one is the step-by-step "first trip" experience; old one is which trips suit solo travellers | Before indexing, either merge #4 into the old URL or index only one |
| #11 Camping costs & facilities | `/camping-near-hyderabad/` hub (indexable) | Hub lists and books the camps; #11 explains costs, facilities and questions to ask | Index #11 only with a different keyword focus ("cost/facilities"), as written |
| #12 Ananthagiri guide | `/camping-near-hyderabad/ananthagiri-hills/` comparison (noindex) | Guide = route, season, camp night, nearby; comparison = side-by-side camps | Fine to index both |
| #1 By budget, #2 Under ₹5,000 | Existing *Under ₹8,000* guide | #1 covers all bands; #2 only one-night camps; under-8000 covers 2-night trips | Consider merging under-8000 into #1 later |
| #9 Ooty itinerary, #17 Ooty prices | Ooty trip page; unpublished sample guide `hyderabad-to-ooty-travel-guide` | #9 day-by-day planning; #17 compares four Ooty trips; trip page books one | Sample guide stays unpublished (integrity rule) |
| #16, #17, #18 package comparisons | Individual trip pages | Each compares several trips; trip pages handle booking | Fine |

## Photos needed (no unrelated images used)

None of the 20 articles has a hero image yet; the page shows the site's neutral placeholder. Real HCC
photos needed, one per article (with suggested alt text):

1. Group at a camp or on a train platform ("HCC group setting off on a weekend trip from Hyderabad")
2. Tents at an Ananthagiri campsite at dusk
3. Group on an overnight train
4. Solo traveller with a group at a viewpoint
5. Couple at Gokarna beach / family at a campsite
6. Om Beach in season and the Kali river at Dandeli
7. Gokarna beach camp at Nirvana Beach
8. Mullayanagiri or a Coorg coffee estate
9. Nilgiri toy train or Coonoor tea gardens
10. Alleppey houseboat on an HCC trip
11. A tent interior and the shared facilities at an Ananthagiri camp
12. Ananthagiri forest view from a campsite
13. Gandikota gorge at sunrise on an HCC trip
14. A packed camping bag laid out
15. Group on a trail (Trance Veechika sunrise trek or a Sahyadri trek)
16. Gokarna or Dandeli activity photo
17. Ooty group photo
18. Coorg viewpoint group photo
19. A December trip photo (hills or beach)
20. Sleeper-train berths with the group

## Decisions for HCC

1. Review each article and switch **Show in Google** on (CMS) when happy; each one then joins the
   sitemap and appears on its destination and category pages automatically.
2. Solo-guide overlap (#4): merge or index only one.
3. Allow trip pages to show "Guides for this trip" links (needs a small template change; would only
   list approved guides).
4. Convert the 5 older `.mdx` guides to `.md` so they can be edited in the CMS.
5. Confirm the facts in the table above (camps, Ooty travel details, Gandikota meals, January 2027 dates).
