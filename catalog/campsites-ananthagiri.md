# Ananthagiri Hills camping: status record

Updated 9 Oct 2026, on the owner's instruction: build all four campsites with the owner's prices, using travloger.in pages as the working reference. Staging only.

## Pages

| Page | URL | Production indexing |
|---|---|---|
| Comparison / landing | `/camping-near-hyderabad/ananthagiri-hills/` | noindex until owner approval (`indexable: false` in `src/content/landings/ananthagiri-hills-camping.md`) |
| Budget-Friendly Camping Near Ananthagiri Hills (formerly listed as Heaven's), ₹1,600 | `/trips/ananthagiri-camping-from-hyderabad/` (existing page, reused) | indexed, unchanged |
| Harivillu Resort, ₹2,000 | `/trips/ananthagiri-harivillu-camping-from-hyderabad/` | noindex until approved |
| Sarpanpally Lake, ₹2,000 | `/trips/ananthagiri-sarpanpally-lake-camping-from-hyderabad/` | noindex until approved |
| Trance Veechika (premium), ₹2,999 | `/trips/ananthagiri-trance-veechika-camping-from-hyderabad/` | noindex until approved |

To approve:
- **A campsite page:** add `"hyderabad"` to `publishApproved` for that trip in `catalog/verification.json`.
- **The landing page:** set `indexable: true` in its file.
- Then run `PUBLIC_ALLOW_INDEXING=true npm run build && npm run check:all`.

## Prices

Each camp shows one price per person: the owner's HCC price. The reference pages' crossed-out prices, single-tent supplements, child rates and GST notes are **not** shown; they're recorded in `verification.json → <trip>.referenceNotes`.

## Owner checklist: business details still needed

Tick when sent. Until then these items aren't shown on the site, or the site falls back to safe wording ("check availability on WhatsApp", the site-wide cancellation policy).

| Detail | Budget-friendly (₹1,600) | Harivillu (₹2,000) | Sarpanpally Lake (₹2,000) | Trance Veechika (₹2,999) |
|---|---|---|---|---|
| Resort partnership / authorisation to sell (not claimed on the site) | [ ] existing HCC option | [ ] | [ ] | [ ] |
| Actual dates and availability | [ ] | [ ] | [ ] | [ ] |
| Advance amount and when the balance is paid | ₹500 advance, balance at check-in (HCC PDF) | [ ] | [ ] | [ ] |
| Cancellation and date-change terms | "advance non-refundable" (HCC PDF) | [ ] | [ ] | [ ] |
| GST: included in the price, or extra? | [ ] | [ ] | [ ] | [ ] |
| Children's policy (age limits, free / paid) | [ ] | [ ] | [ ] | [ ] |
| Check-in time (reference differs for Heaven's: 3 PM vs HCC 4 PM) | [ ] confirm 4 PM | [ ] 4 PM? | [ ] 3 PM? | [ ] 3 PM? |
| Rain dance included for tents? (reference: cottages only) | [ ] | n/a | n/a | [ ] |
| Optional paid activities HCC wants to mention | n/a | n/a | [ ] | n/a |
| Group size / any minimum | [ ] | [ ] | [ ] | [ ] |
| Safety information HCC can state | [ ] | [ ] | [ ] | [ ] |

## Photo checklist (owner to provide)

**Photos needed: none of the four campsites has an HCC photo yet.** The pages use a licensed Wikimedia view of the Ananthagiri Hills (alt text: "area view, not the campsite") and generic stock images labelled "illustrative". Competitor photos must not be used. For each campsite, please send 6–8 real photos, landscape, ideally ≥1600 px wide:

- [ ] Tents and campsite overview (hero)
- [ ] Inside a tent
- [ ] Signature feature:
  - pool (Heaven's and Trance Veechika);
  - rope course (Harivillu);
  - lake (Sarpanpally);
  - sunrise trek (Trance Veechika).
- [ ] Bonfire or evening
- [ ] Food or dining area
- [ ] Washrooms
- [ ] Guests, only with their consent
