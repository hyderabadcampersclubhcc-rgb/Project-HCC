# HCC Topic Clusters

Each cluster has **one commercial owner page** (where the booking happens) and supporting pages that link into it. Status is taken from the production-mode build of `6ba66f8` (8 Oct 2026). Keyword IDs refer to `keyword-universe.json`.

Legend:
- ✅ indexable
- 🔒 noindex (draft or thin)
- ➕ gap (no page)
- 🚫 deliberately not built

---

## Cluster 1: Weekend trips from Hyderabad (pillar)

| Role | Page | Status | Keywords |
|---|---|---|---|
| **Pillar** | `/weekend-trips-from-hyderabad/` | ✅ | A1, A2, A3, H4, O1 |
| Listing | `/upcoming-trips/` | ✅ | A4 |
| Listing | `/trips/` | ✅ | — |
| Support | `/travel-guides/weekend-trips-from-hyderabad-under-8000/` | 🔒 | G3 |
| Support | `/travel-guides/long-weekend-trips-from-hyderabad-2027/` | 🔒 | I1 |
| Support | `/travel-guides/winter-weekend-trips-from-hyderabad/` | 🔒 | I2, I3 |
| Support | `/travel-guides/solo-trips-from-hyderabad/` | 🔒 | H1, H2 |
| Gap (seasonal) | Summer trips from Hyderabad | ➕ (Mar 2027) | I5 |
| Gap (seasonal) | Monsoon trips from Hyderabad | ➕ (May 2027) | I4 |

**Cannibalisation watch:**
- The pillar vs the "Under ₹8,000" guide. The guide must stay about **price and inclusions**; the pillar is about **choosing a trip**.
- The pillar vs the winter guide. The winter guide is **season-specific**.

## Cluster 2: Ooty & the Nilgiris

| Role | Page | Status | Keywords |
|---|---|---|---|
| **Commercial owner** | `/trips/ooty-coonoor-from-hyderabad/` | ✅ | B1, B2, G1 |
| Commercial | `/trips/isha-ooty-coonoor-from-hyderabad/` | ✅ | B3 |
| Commercial | `/trips/ooty-coonoor-couple-from-hyderabad/` | ✅ | H3 |
| Commercial | `/trips/wayanad-ooty-mysore-from-hyderabad/` | ✅ | — |
| Destination guide | `/destinations/ooty/` | ✅ | F1, K1 |
| Destination guide | `/destinations/coonoor/` | 🔒 thin | — |
| Comparison | `/travel-guides/ooty-vs-coorg-vs-wayanad/` | 🔒 | J1 |
| Sample (not published) | `hyderabad-to-ooty-travel-guide.mdx` | 🚫 placeholder | — |

**Next step:** improve the trip page and the how-to-reach section of the Ooty guide. **Don't** create a separate "Hyderabad to Ooty by train" article while the destination guide can answer it.

## Cluster 3: Coorg & Chikmagalur

| Role | Page | Status | Keywords |
|---|---|---|---|
| **Commercial owner (HYD)** | `/trips/coorg-chikmagalur-from-hyderabad/` | ✅ | B4, B5 |
| Commercial (BLR) | `/trips/coorg-chikmagalur-from-bangalore/` | ✅ | C1 |
| Commercial | `/trips/coorg-from-mysore/` | ✅ | — |
| Destination guide | `/destinations/coorg/` | ✅ | F3, K2 |
| Destination guide | `/destinations/chikmagalur/` | ✅ | B5 |
| Comparison | `/travel-guides/ooty-vs-coorg-vs-wayanad/` | 🔒 | J1 |

## Cluster 4: Gokarna, Dandeli & the Karnataka coast

| Role | Page | Status | Keywords |
|---|---|---|---|
| **Commercial owner (HYD)** | `/trips/gokarna-dandeli-from-hyderabad/` | ✅ | B6, B7, G2, O2 |
| Commercial | `/trips/gokarna-dandeli-from-bangalore/`, `/trips/gokarna-dandeli-from-vijayawada/` | ✅ | C2 |
| Commercial | `/trips/gokarna-dandeli-couple-from-hyderabad/` (+ Bangalore) | ✅ | H3 |
| Commercial | `/trips/hampi-gokarna-murudeshwar-from-hyderabad/` | ✅ | B11 |
| Destination guide | `/destinations/gokarna/` | ✅ | F2 |
| Destination guide | `/destinations/dandeli/` | ✅ | — |
| Destination guide | `/destinations/murudeshwar/` | 🔒 thin | — |

**Single-price rule (approved 8 Oct 2026):** any remaining upgrade-price wording (3AC, sleeper bus, room types) must be removed before this cluster is promoted. The known instances in the Gokarna FAQ, header transport line and Gokarna guide were cleaned up on 8 Oct 2026. Re-check with the search in `monthly-report-template.md` before promoting.

## Cluster 5: Camping near Hyderabad (brand-defining)

> **Updated 9 Oct 2026:** Narsapur retired (301 to the hub); the hub lists the four Ananthagiri Hills campsites; the comparison page is `/camping-near-hyderabad/ananthagiri-hills/`. Current research, keyword map and 30/60/90 plan: `seo/camping-seo.md`. The table below is the original plan.

| Role | Page | Status | Keywords |
|---|---|---|---|
| **Pillar** | `/camping-near-hyderabad/` | ✅ | D1, D5 |
| Commercial | `/trips/narsapur-camping-from-hyderabad/` | ✅ | D3 |
| Commercial | `/trips/ananthagiri-camping-from-hyderabad/` | ✅ | D2 |
| Commercial | `/trips/gandikota-camping-from-hyderabad/` | ✅ | D4 |
| Destination guide | `/destinations/ananthagiri/` | ✅ | D2 |
| Destination guide | `/destinations/narsapur/` | 🔒 thin | — |
| Destination guide | `/destinations/gandikota/` | 🔒 thin | D4 |

**Next steps:**
- Improve the Gandikota guide until it passes the indexing rules.
- Add a camp comparison table to the pillar.
- Real campsite photos have the highest authority value of any images on the site.

## Cluster 6: Araku & the Eastern Ghats

| Role | Page | Status | Keywords |
|---|---|---|---|
| **Commercial owner** | `/trips/araku-vanajangi-vizag-from-hyderabad/` | ✅ | B9 |
| Destination guide | `/destinations/araku/` | ✅ | F4, K3 |
| Destination guide | `/destinations/vizag/` | 🔒 | — |

**Seasonal hook:** Vanajangi sunrise season (Nov–Jan). Publish improvements in **Oct 2026**.

## Cluster 7: Wayanad

| Role | Page | Status | Keywords |
|---|---|---|---|
| **Commercial owner** | `/trips/wayanad-from-hyderabad/` | ✅ | B8 |
| Destination guide | `/destinations/wayanad/` | ✅ | — |

## Cluster 8: Tier 2 (Pondicherry, Hampi, Goa, Munnar, Kerala, Lonavala)

Trip pages and most destination guides exist. **Main gap:** confirmed weekly schedules, which is a data gap, not a content gap. Don't add content to these clusters until their schedules are confirmed and they show dated departures.

## Cluster 9: Monsoon treks (seasonal)

Pages: Harishchandragad, Andharban–Devkund–Lohagad, Dudhsagar–Dandeli trips (✅). The `/treks/` category and the Lohagad, Harishchandragad and Dudhsagar guides are noindex.
- **Activate in Apr–May 2027** with a refresh, plus one monsoon guide (I4).

## Cluster 10: Long trips (Kashmir, Manali, Shimla, Golden Triangle, Kerala)

Commercial pages exist; demand is OTA-dominated.
- **SEO effort: minimal.** Promote via WhatsApp and social.
- Never imply "from Hyderabad" for trips that start in Delhi, Srinagar or Kochi.

## Cluster 11: Brand & trust

Pages: `/`, `/about/`, `/reviews/`, `/contact/`, `/faq/`, `/cancellation-policy/`, `/privacy-policy/` (🔒), `/terms/` (🔒 hidden).
- See `authority-plan.md`.

---

## AI-search layer (applies to every cluster)

**Implemented on all trip pages (8 Oct 2026, uncommitted):** an "At a glance" block (`src/components/trip/page/AtAGlance.astro`) and data-driven FAQs (`src/lib/trip-facts.ts`), both built only from trip data, with the same Q&As marked up as FAQPage. A field with no data is left out.

AI answer engines (Google AI Overviews / AI Mode, ChatGPT search, Perplexity, Gemini) favour pages that state facts plainly. For each **commercial owner** page, make sure these facts appear once, in plain text, consistent with trip data:

1. Departure city, departure day(s) and time, and the overnight-train note where relevant.
2. Return day and approximate time.
3. Price per person and what it covers. One price only.
4. Transport mode (train, Tempo Traveller, etc.) and stay type, as recorded in trip data.
5. Who it suits (solo, couples, groups) and difficulty.
6. FAQs that are real customer questions, already marked up with FAQPage schema.

**Don't:**
- create Q&A pages just for AI;
- write "AI-optimised" filler;
- add unverifiable superlatives.
