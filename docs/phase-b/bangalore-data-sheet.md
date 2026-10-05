# Bangalore data sheet (what HCC's data has today)

Source of truth: `src/content/trips/*.md` (the Bangalore `origins` entry of each trip). Read 5 Oct 2026.
**Confirmed HCC dates: none yet.** `src/content/departures/` is empty; the site shows the departure pattern ("Every Friday from Bangalore") until real dates are added.

## HCC Bangalore trips

| Destination | HCC Bangalore trip | Current HCC price | Pickup point | Departure time | Return time | Transport | Confirmed HCC dates | Missing information |
|---|---|---|---|---|---|---|---|---|
| **Coorg & Chikmagalur** | Coorg & Chikmagalur, 2N/3D (own Bangalore plan: Golden Temple → Mandalpatti, Abbey Falls, Belur, Yagachi → Mullayanagiri, Jhari Falls) | ₹6,999 | ⚠️ Not in data | Group meets **6:00 am Saturday**; where and how the group travels on Friday night aren't in the data | "Return train to Bangalore on day 3"; arrival time not in data | Site shows **Sleeper train**, but the Bangalore inclusions list only local transport, so travel from Bangalore is ⚠️ unclear | None | Meeting point; Friday-night travel (train/bus? included?); return arrival time; dates |
| **Gokarna, Dandeli & Murudeshwar** | 2N/3D, every Friday | ₹5,999 | **KSR Bengaluru** | **Friday 11:00 pm** (overnight train to Hubballi) | Train from Hubballi **9:05 pm** on day 3; Bangalore arrival time not in data | Sleeper train; 3AC +₹1,700 (the upgrade price comes from Hyderabad data) | None | Bangalore arrival time; confirm the 3AC upgrade price from Bangalore; dates |
| **Munnar** | 2N/3D | ₹8,999 | ⚠️ Not in data | Train to Coimbatore (arrives 8 am); Bangalore station and time not in data | Train from Coimbatore on day 3; time not in data | Sleeper train | None | Station and departure time; return time; dates |
| **Kerala: Munnar & Alleppey** | 3N/4D | ₹12,999 | ⚠️ Not in data | Sleeper train to Kochi (arrives about noon); Bangalore station and time not in data | From Kochi on day 4; time not in data | Sleeper train | None | Station and departure time; return time; dates (currently "Group dates on request") |
| **Gokarna & Dandeli for couples** | 2N/3D, every Friday | ₹18,500 per person (₹37,000 per couple) | **KSR Bengaluru** | **Friday 11:00 pm** | Train from Hubballi **9:05 pm** on day 3; arrival not in data | Sleeper train | None | Bangalore arrival time; dates |

## Potential Bangalore expansion (opportunity only, not HCC departures)

| Destination | HCC today | HCC price (Hyderabad trip) | Reference demand (Tripper Trails, dates only) | What HCC would need to add a Bangalore departure |
|---|---|---|---|---|
| **Ooty & Coonoor** | Hyderabad only (Mysore Express, Fridays) | ₹7,999 | Weekly Fridays 9 Oct–18 Dec + Christmas week; 2-night version 16 Oct, 6 Nov | Bangalore route (Mysore pickup?), price, dates, day-by-day plan |
| **Wayanad** | Hyderabad only (Thursdays) | ₹7,999 | Weekly Fridays + Christmas week; 2-night version 16 Oct, 6 Nov | Bangalore route, price, dates, plan |
| **Hampi** | Hyderabad only (Hampi–Gokarna, sleeper bus) | ₹8,999 | Weekly Fridays + Christmas week | Decide: Hampi-only from Bangalore, or the same Hampi–Gokarna loop; price, dates |
| **Pondicherry** | Hyderabad only | ₹7,199 | Weekly Fridays + Christmas week | Bangalore route, price, dates, plan |

## How a Bangalore departure goes live
1. Add the missing fields to the trip's Bangalore entry (pickup, times, transport, price if different).
2. Add each confirmed date in the CMS (*Departures → New*: trip, city = Bangalore, date, status, optional seats).
3. Cards, trip pages, the homepage switch and WhatsApp messages then show "Next departure: Fri, 16 Oct" automatically.
4. When the details and dates are in, set `/weekend-trips-from-bangalore/` to "Ready for Google".
