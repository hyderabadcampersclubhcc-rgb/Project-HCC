# Phase C: Bangalore working schedule, Oct–Dec 2026 (internal)

**Status:** live in the site data (`src/content/departures/*-bangalore-*.yml`, 44 files), imported 5 Oct 2026.
**Source:** the competitor reference page for Bangalore weekend trips (see `docs/phase-b/bangalore-date-comparison.md`). Only **dates and timing patterns** were used. No text, reviews, photos or branding were copied, and the source is not named anywhere on the site.
**HCC data was kept:** HCC trip names, itineraries, inclusions, policies, prices and WhatsApp flow are unchanged. Every difference is listed below instead of overwriting HCC data.

## Rules used
- **Fridays only.** Every HCC Bangalore trip leaves on a Friday night (Gokarna: KSR 11 pm; Coorg: group meets 6 am Saturday). The reference's Christmas-week dates (20, 22, 24, 26, 28 and 30 Dec) fall mid-week and suit its 1-night trips, so they weren't added.
- `startDate` is the Friday the group leaves Bangalore. `endDate` is the last trip day, when the return journey starts. For a 2N/3D trip that's the Monday; for Kerala (3N/4D) it's the Tuesday.
- **Price:** HCC's price is kept (no `price` override on the departures).
- **Status:** `open`, with no seat numbers. HCC can change either per date in the CMS (*Departures*).

## Summary

| Trip | Bangalore dates added | Departure time | Price on site | Conflicts with HCC data (not overwritten) | Information still missing |
|---|---|---|---|---|---|
| **Coorg & Chikmagalur** (2N/3D) | 11 Fridays: 9, 16, 23, 30 Oct; 6, 13, 20, 27 Nov; 4, 11, 18 Dec | Not in either source. HCC: group meets **6:00 am Saturday** | ₹6,999 (HCC) | Reference Coorg trip is **1N/2D at ₹4,599** (strikethrough ₹5,199), back in Bangalore **Sunday ~11:30 pm**. HCC's Bangalore plan is 3 days (Sat–Mon), so travellers need Monday off. | Meeting point; Friday-night travel (bus/train? included?); return arrival time |
| **Gokarna, Dandeli & Murudeshwar** (2N/3D) | 10 Fridays: 9 Oct – 11 Dec | **KSR Bengaluru, Fri 11:00 pm** (HCC, kept) | ₹5,999 (HCC) | Reference long-weekend Gokarna & Dandeli leaves **~8:30 pm** at **₹8,999**, and only on 16 Oct and 6 Nov. Its weekly Gokarna–Murudeshwar trip is ₹4,999. | Bangalore arrival time on Tuesday; whether the 3AC upgrade (+₹1,700) is the same from Bangalore; 18 and 25 Dec departures? |
| **Gokarna & Dandeli for Couples** (2N/3D) | 10 Fridays: 9 Oct – 11 Dec (same as main Gokarna trip) | **KSR Bengaluru, Fri 11:00 pm** (HCC) | ₹18,500 pp (HCC) | No couples trip in the reference; dates follow the main Gokarna trip. | Confirm couples run on every group date; Bangalore arrival time |
| **Munnar** (2N/3D) | 11 Fridays: 9 Oct – 18 Dec | Not in either source (HCC: "Train to Coimbatore") | ₹8,999 (HCC) | Reference Munnar is **1N/2D at ₹6,599** (card showed ₹7,999). | Bangalore station and train time; return arrival time. **Added:** "back in Bangalore the next morning" (both sources agree on overnight return) |
| **Kerala: Munnar & Alleppey** (3N/4D) | 2 long weekends: Fri 16 Oct, Fri 6 Nov | Not added. The reference 8:00 pm departure is for a road trip on another route (Varkala–Alleppey–Kochi); HCC uses a sleeper train. | ₹12,999 (HCC) | Reference long weekend is **2N/3D, Varkala–Alleppey–Kochi, ₹10,999**, by road. Its weekly Kochi–Alleppey is 1N/2D at ₹5,899. HCC previously said "Group dates on request". | Bangalore station and train time; return time; whether to run weekly |

**Total:** 44 Bangalore departures (Coorg 11, Gokarna 10, Couples 10, Munnar 11, Kerala 2). No Hyderabad or Vijayawada dates were added.

## Potential Bangalore expansion (not HCC trips; nothing created)

| Destination | Reference pattern | HCC today |
|---|---|---|
| Ooty & Coonoor | Weekly Fridays + Christmas week; 2N/3D (incl. Kotagiri) on 16 Oct, 6 Nov | Hyderabad only |
| Wayanad | Weekly Fridays + Christmas week; 2N/3D on 16 Oct, 6 Nov | Hyderabad only |
| Coorg–Wayanad (2N/3D) | 16 Oct, 6 Nov | Not an HCC trip |
| Chikmagalur–Sakleshpur (2N/3D) | 16 Oct, 6 Nov | Not an HCC trip (HCC's Chikmagalur is inside Coorg & Chikmagalur) |
| Hampi | Weekly Fridays + Christmas week | Hyderabad only (Hampi–Gokarna) |
| Pondicherry | Weekly Fridays + Christmas week | Hyderabad only |
| Kochi–Alleppey / Varkala (short) | Weekly 1N/2D; Varkala 2N/3D on 16 Oct, 6 Nov | Not as a short trip |
| Others (ideas only) | Kodaikanal, Valparai, Vagamon, Udupi–Malpe, Agumbe, Dudhsagar, one-day trips | None |

## Site changes in this phase
- Bangalore trip pages show "Next departure Fri 9 Oct" plus the dates table. Homepage "Upcoming" cards say "From Bangalore".
- The header's "Coming up" menu now shows the city on each date (e.g. "9 Oct · Bangalore · from ₹5,999") so Hyderabad visitors aren't misled.
- `/weekend-trips-from-bangalore/` is **still noindex**. Make it indexable once the missing details above are filled in.
