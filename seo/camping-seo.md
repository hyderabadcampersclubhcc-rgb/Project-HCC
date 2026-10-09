# Camping cluster: research, keyword map and plan

Started 9 Oct 2026. Part of the HCC SEO engine; it extends Cluster 5 in `topic-clusters.md`. Keyword rows: `keyword-universe.json` → D1–D17 and K4. Owner checklist: `catalog/campsites-ananthagiri.md`.

**Data honesty:**
- Search Console isn't connected, and staging is noindex. **HCC has no rankings, impressions or traffic yet.**
- No search volumes, keyword difficulty or backlink numbers are stated here.
- SERP notes come from a US-based web-search tool on 9 Oct 2026; Indian results and the local map pack may differ.

## 1. What ranks today (observed 9 Oct 2026)

| Search | Who ranks | Intent | What HCC can do better |
|---|---|---|---|
| camping near Hyderabad | Publishers and listicles: TravelTriangle, Siasat (two articles), Tripoto, Trawell, Explurger, Agoda, Myles Cars | Choose a place, then book | Most listicles name places, not bookable camps, and some are years old. HCC can be the page with real campsites, one clear price, check-in times and directions |
| Ananthagiri Hills camping price / packages | Aggregators and coupon listings (Thrillophilia, upto75, Expedia, cozycozy), Trekgo, Telangana360 | Compare prices, then book | Listings conflict (old coupons, expired offers). HCC's comparison of four camps with current single prices is clearer |
| Lakeside camping near Hyderabad / Sarpanpally Lake | Siasat (Sarpanpally Lake article: Wilderness, Penguin Lakeside), Telangana Tourism blog, TravelTriangle | Find a lakeside camp | Very few booking pages. The Sarpanpally page plus a comparison FAQ answers it directly |
| Camping with swimming pool near Hyderabad | Farmstays and Airbnb pools, resort listings | A pool and an overnight stay | No camp pages rank. HCC has two camps with pools (Heaven's, Trance Veechika) |
| Harivillu Resort camping | Coupon listing (₹2,000 camping, expired offer), TravelTriangle, Housing.com | Resort-specific | An HCC page named after the resort, with an itinerary |
| Trance Veechika | TravelTriangle, MakeMyTrip (rooms from ₹7,860), Wanderlog; one conflicting listing | Resort rooms | HCC sells the camping package. Distinct intent, small volume (inference) |
| Heaven's Resort camping | **Not found under that name** | – | Confirm the official name customers use |
| Best camping places near Hyderabad (families, couples) | Listicles, as above | Ideas | Answer only with HCC's own camps. Don't build a listicle of places HCC doesn't run |

**Patterns:**
- **Operators rarely rank;** publishers own the head terms.
- **Best-time advice varies by source:** "monsoon / July–October", or "August–October". HCC uses its own July–February data.
- **Safety:** a Telangana Today report notes a boating accident at Sarpanpally Lake. HCC makes no safety claims; water activities belong to the campsite.
- **Competitors from earlier research:**
  - Travloger, which has a dedicated Ananthagiri camping page with four camps, Google rating, FAQs and price comparison, did **not** appear in this tool's results for these queries. Verify in Indian Google.
  - Weekend Yaari and HTC didn't appear for camping queries in this run.

**Sources:**
- [TravelTriangle: camping near Hyderabad](https://traveltriangle.com/blog/camping-near-hyderabad/)
- [Siasat: top 5 camping spots near Hyderabad](https://www.siasat.com/christmas-holidays-top-5-camping-spots-near-hyderabad-2939465/amp/)
- [Siasat: Sarpanpally Lake](https://www.siasat.com/sarpanpally-lake-a-hidden-escape-just-2-hours-from-hyderabad-3270139/)
- [upto75: Harivillu packages](https://www.upto75.com/harivillu-resorts-day-outing-and-camping-packages-anantagiri-hills-vikarabad-near-hyderabad-discount-offers)
- [Thrillophilia: Ananthagiri resorts](https://www.thrillophilia.com/resorts-in-ananthagiri-hills)
- [TravelTriangle: hotels near Anantagiri](https://traveltriangle.com/blog/hotels-near-anantagiri-hills/)
- [Telangana Today: Sarpanpally lake](https://telanganatoday.com/tag/sarpanpally-lake)
- [Telangana360: Ananthagiri](https://www.telangana360.com/2016/06/ananthagiri-hills-vikarabad.html)

## 2. Keyword → page map

| Intent | Target page | Status |
|---|---|---|
| camping near Hyderabad; night, tent and weekend camping near Hyderabad; best camping places near Hyderabad | `/camping-near-hyderabad/` (broad guide: the four camps, how a night works, when to go, getting there, what to carry) | indexable |
| Ananthagiri Hills camping, price, packages; camping with a pool | `/camping-near-hyderabad/ananthagiri-hills/` (detailed side-by-side comparison, 10 FAQs) | **noindex until owner approval** |
| Each resort's camping (Heaven's, Harivillu, Sarpanpally Lake, Trance Veechika) | the four campsite pages | Heaven's indexable; the three new pages noindex until approved |
| Ananthagiri Hills best time / how to reach / things to do | `/destinations/ananthagiri/` (travel guide) | indexable |

**Cannibalisation, resolved:**
- **Hub vs comparison page:** the hub is now the broad guide, and the comparison page holds the detailed comparison.
- **Heaven's trip page:** it no longer chases the broad "Ananthagiri Hills camping" term; its title names the resort.
- **Travel guide:** it stays informational and links to both.

**No new pages:**
- **Packing, prices, lakeside vs pool:** each is already answered on the hub, the comparison page or the guide. A separate guide would duplicate them.
- **Narsapur:** retired. Its old URLs 301 to the hub.

## 3. Implemented (9 Oct 2026, local, awaiting approval to commit)

- **Camp pages:**
  - "reach-it-yourself" camps get their own title, heading, description, structured-data name and FAQ wording:
    - title: "{Campsite}, Ananthagiri Hills · from ₹X | HCC";
    - heading: "… near Hyderabad", replacing "Group Trip from Hyderabad";
    - the description leads with the camp and price.
  - The broken "…by reach the campsite yourself" description is fixed.
  - Each camp page links to the comparison page, the travel guide and the camping hub.
- **Camping hub:** restructured as the broad guide. FAQs added: what's included, best time, getting there without a car.
- **Comparison page:** six new FAQs, and the Saturday claim corrected (Heaven's: check availability).
- **Ananthagiri travel guide:** describes all four campsites (it showed only one), plus "when to go" and links to the comparison page.
- **Earlier the same day:** Narsapur retired with 301s; a natural WhatsApp message per camp; four-card hub.

## 4. Local SEO and authority (owner actions)

1. **Google Business Profile:**
   - Website set to the main domain at launch.
   - Categories that describe what HCC actually does (tour operator / travel agency).
   - Real camp photos.
   - Ask every camper for an honest Google review after the trip. Never incentivise or write reviews.
2. **Real photos** of all four campsites (`catalog/campsites-ananthagiri.md`).
3. **Genuine links:**
   - the campsites themselves (ask each resort to list HCC as a booking partner if that's true);
   - Hyderabad trekking and camping communities HCC takes part in;
   - local press for a real event.
   - No paid or spam links.
4. **Consistent identity:** the same business name, phone and address on GBP, Instagram, Facebook and the website.

## 5. Measurement plan (after production launch)

| What | Where | Needs |
|---|---|---|
| Impressions, clicks, CTR, position for D1–D17 queries; landing pages | Google Search Console → Performance (export to `seo/data/gsc/`, then `npm run seo:report`) | GSC domain verification (owner), sitemap submitted |
| Indexing of the hub, comparison page and camp pages | GSC → Pages / URL inspection | as above |
| Organic sessions to camping pages | GA4 (organic search, landing page) | GA4 ID in CMS → Site settings → Tracking |
| WhatsApp enquiry clicks per camp | GA4 event `click_whatsapp` (cta_location, trip_id, page_path); already implemented | GA4 ID |
| Qualified enquiries and bookings | WhatsApp: the ref code in each message (e.g. "[ref: ANANTH …]"); lead sheet | Owner logs bookings per ref |

**Baseline:** the first full 28 days after indexing. No improvement is claimed before a baseline exists. No ranking position or timeline is guaranteed.

## 6. 30 / 60 / 90 days

- **Before launch (owner):**
  - confirm the campsite details in the checklist;
  - send photos;
  - approve the comparison page and the three campsite pages for indexing (`publishApproved` + `indexable: true`).
- **Days 0–30:**
  - launch, verify GSC, submit the sitemap;
  - inspect the hub, the comparison page and the four camp pages;
  - first `seo:report`;
  - add real photos;
  - start review requests.
- **Days 31–60:**
  - **Low click-through:** for camping queries showing at positions 4–15, improve titles and FAQs from the actual GSC queries.
  - **Seasonal dates:** add real Saturday dates to the generator once HCC confirms them; dated departures in structured data.
- **Days 61–90:**
  - compare camping impressions and clicks against the baseline;
  - decide whether a separate guide is justified (only if GSC shows a distinct query cluster with no matching page);
  - pursue 2–3 genuine local links.
