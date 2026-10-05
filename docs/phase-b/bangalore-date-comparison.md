# Phase B: Bangalore destination and date comparison (internal)

**Status:** reference only. Nothing here is on the website.
**Sources:**
- HCC data: `src/content/trips/`, `src/content/departures/` (no dated departures yet).
- Tripper Trails (TT) public page `/weekend-getaways/weekend-trips-from-bangalore`, plus their trip pages' published departure dates, read on 5 Oct 2026.

**Rules applied:**
- Only TT's **dates** were used: no prices, wording, descriptions, reviews or claims.
- TT dates are **reference/potential** dates, never HCC departures.
- A date becomes an HCC departure only when HCC confirms it in the CMS.

## TT's Bangalore date pattern (reference)
- **1-night weekend trips:** every **Friday**, 9 Oct → 18 Dec 2026 (11 Fridays), plus extra Christmas/New Year departures on 20, 22, 24, 26, 28 and 30 Dec.
- **2-night "long weekend" trips:** only **Fri 16 Oct** and **Fri 6 Nov 2026**.
- **On-request trips** (Dudhsagar–South Goa, Udupi–Agumbe, Chikmagalur long weekend): no published dates.

## Comparison: destinations HCC operates or could operate from Bangalore

| Destination | HCC Bangalore trip? | TT Bangalore trip? | TT dates (reference only) | HCC confirmed dates | HCC price (Bangalore) | Action |
|---|---|---|---|---|---|---|
| **Coorg (+ Chikmagalur)** | ✅ Coorg & Chikmagalur, 2N/3D, every Friday, group meets 6 am Sat | ✅ Coorg 1N/2D; Coorg–Wayanad 2N/3D | 1N: Fridays 9 Oct–18 Dec. 2N: 16 Oct, 6 Nov | None | ₹6,999 | **Confirm** Bangalore Fridays Oct–Dec; add as departures. Send Bangalore pickup point and return time. |
| **Chikmagalur** | ✅ (inside Coorg & Chikmagalur) | ✅ Chikmagalur 1N/2D; Chikmagalur–Sakleshpur 2N/3D | 1N: Fridays + 15 Oct + Christmas week. 2N: 16 Oct, 6 Nov | None | ₹6,999 | Covered by the Coorg trip; no separate trip needed |
| **Gokarna + Dandeli + Murudeshwar** | ✅ 2N/3D, every Friday 11 pm from KSR Bengaluru | ✅ Gokarna–Murudeshwar–Honnavar 2N; Gokarna & Dandeli 2N/3D | Fridays 9 Oct–11 Dec + Christmas week; long weekend 16 Oct, 6 Nov | None | ₹5,999 | **Confirm** Bangalore Fridays; add as departures. Pickup (KSR) already in data. |
| **Gokarna & Dandeli (couples)** | ✅ 2N/3D, KSR 11 pm | (n/a) | (n/a) | None | ₹18,500 pp (₹37,000/couple) | Dates follow the main Gokarna trip once confirmed |
| **Munnar** | ✅ 2N/3D, train to Coimbatore | ✅ Munnar 1N/2D | Fridays 9 Oct–18 Dec + Christmas week | None | ₹8,999 | **Confirm** Bangalore dates and departure time/station |
| **Kerala: Munnar & Alleppey** | ✅ 3N/4D, train to Kochi | ✅ Kochi–Alleppey 1N/2D; Varkala–Alleppey–Kochi 2N/3D | 1N: Fridays + Christmas week. 2N: 16 Oct, 6 Nov | None | ₹12,999 | **Confirm** dates (likely fewer than weekly) |
| **Ooty & Coonoor** | ❌ Hyderabad only | ✅ Ooty–Coonoor 1N/2D; Ooty–Coonoor–Kotagiri 2N/3D | 1N: Fridays + Christmas week. 2N: 16 Oct, 6 Nov | (n/a) | (n/a) | **Opportunity:** steady weekly Bangalore demand. Consider adding a Bangalore origin. |
| **Wayanad** | ❌ Hyderabad only | ✅ Wayanad 1N/2D; Wayanad 2N/3D | 1N: Fridays + Christmas week. 2N: 16 Oct, 6 Nov | (n/a) | (n/a) | **Opportunity:** consider a Bangalore origin (short drive) |
| **Hampi** | ❌ Hyderabad only | ✅ Hampi 1N/2D | Fridays + Christmas week | (n/a) | (n/a) | **Opportunity:** consider a Bangalore origin |
| **Pondicherry** | ❌ Hyderabad only | ✅ Pondicherry 1N/2D | Fridays + Christmas week | (n/a) | (n/a) | **Opportunity:** consider a Bangalore origin |
| **Dudhsagar** | ❌ Hyderabad only | ✅ Dudhsagar + South Goa (on request) | None published | (n/a) | (n/a) | Low priority |

## Bangalore destinations TT runs that HCC doesn't (ideas only)
Kodaikanal, Valparai, Vagamon, Thekkady–Vagamon, Udupi–Malpe, Agumbe–Sringeri, Madurai–Rameshwaram, Rameshwaram–Dhanushkodi, one-day trips (Shivanasamudra, Adiyogi–Lepakshi, Mandaragiri/DD Hills), Netrani scuba, Mulki surfing.
These are **not** HCC trips. Listed only as possible future ideas.

## Summary
1. **Bangalore trips HCC already operates (5):** Coorg & Chikmagalur, Gokarna–Dandeli–Murudeshwar, Gokarna–Dandeli couples, Munnar, Kerala Munnar & Alleppey.
2. **Bangalore dates HCC already has:** **none** in the data (only "Every Friday"). No date can go live until HCC confirms.
3. **Where TT shows regular Bangalore demand but HCC has no date:** all five of the above. TT runs weekly Fridays Oct–Dec, plus the 16 Oct and 6 Nov long weekends and Christmas week.
4. **Possible new HCC Bangalore origins:** Ooty & Coonoor, Wayanad, Hampi, Pondicherry. These are HCC destinations from Hyderabad that TT runs weekly from Bangalore.

## What HCC needs to confirm (deadline: **Mon 12 Oct 2026**, so dates can be live before the 16 Oct long weekend)
For each of the 5 Bangalore trips:
- [ ] Confirmed departure dates, Oct–Dec 2026 (e.g. every Friday, plus long weekends or Christmas week?)
- [ ] Bangalore pickup point and time (KSR Bengaluru 11 pm is known for Gokarna)
- [ ] Return arrival time in Bangalore
- [ ] Bangalore price, if different from Hyderabad
- [ ] Seats per departure (optional; only shown when you set it)

---

## Phase B progress (no dates published)
- City-specific trip data: each departure city can set its own price, departure pattern, day-by-day plan, inclusions/exclusions and transport options (falls back to the trip's values).
- Bangalore pages no longer show Hyderabad details: Coorg & Chikmagalur (own 3-day plan and inclusions from HCC's Bangalore listing), Gokarna (KSR 11 pm departure, sleeper/3AC only), Gokarna couples. Related trips come from the same city.
- `/weekend-trips-from-bangalore/` built (3 trips + Kerala), **noindex until HCC approves the copy and confirms dates**.
- Homepage: "Where are you travelling from?" Hyderabad / Bangalore switch (remembered, no flash, works without JS), with city panels for weekend and featured trips.
- Hero video now starts on the first scroll/tap and the photo is its poster, keeping homepage mobile speed at 97 (it had dropped to 75).
