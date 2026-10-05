# Phase C: Hyderabad (and Vijayawada) working schedule, Oct–Dec 2026 (internal)

**Source:** HCC's own trip data only (each trip's stated departure pattern in `src/content/trips/*.md`). Imported 5 Oct 2026 as `src/content/departures/{trip}-{city}-{date}.yml` (123 files; 175 after the Thursday batches were added the same day).
**Rule:** dates were created only where HCC's data names a weekday ("Every Friday", "Every Thursday", "Every Saturday"). HCC prices are unchanged. `endDate` is the last trip day, when the return journey starts (same rule as Bangalore).

## Dated departures added

| Trip | City | Pattern (HCC data) | Dates added | Trip days |
|---|---|---|---|---|
| Coorg & Chikmagalur | Hyderabad | **Confirmed 5 Oct: every Thursday & Friday, 7:00 pm** | 25 (13 Thu + 12 Fri) | Thu → Mon 6 am · Fri → Tue 6 am |
| Gokarna, Dandeli & Murudeshwar | Hyderabad | **Confirmed 5 Oct: every Thursday & Friday, 3:00 pm** | 25 (13 Thu + 12 Fri) | Thu → Mon 10 am · Fri → Tue 10 am |
| Gokarna, Dandeli & Murudeshwar | Vijayawada | Every Friday, 2 pm | 12 Fridays | Fri → Mon |
| Gokarna & Dandeli for Couples | Hyderabad | Every Friday, 3:45 pm | 12 Fridays | Fri → Mon |
| Isha, Ooty & Coonoor | Hyderabad | **Confirmed 5 Oct: every Thursday & Friday, 7:00 pm** | 25 (13 Thu + 12 Fri) | Thu → Mon 6 am · Fri → Tue 6 am |
| Ooty & Coonoor | Hyderabad | **Confirmed 5 Oct: every Thursday & Friday, 7:00 pm** | 25 (13 Thu + 12 Fri) | Thu → Mon 6 am · Fri → Tue 6 am |
| Araku, Vanajangi & Vizag | Hyderabad | Every Thursday, Kacheguda 5:30 pm | 13 Thursdays, 8 Oct – 31 Dec | Thu → Sun (back Mon 7 am) |
| Wayanad | Hyderabad | Every Thursday, 7 pm | 13 Thursdays | Thu → Sun |
| Lonavala & Matheran | Hyderabad | Every Thursday | 13 Thursdays | Thu → Sun |
| Narsapur Forest Camping | Hyderabad | Every Saturday | 12 Saturdays, 10 Oct – 26 Dec | Sat → Sun |

## No dates added (HCC data has no weekday, or dates are on request)

| Trip | HCC data says | What's needed |
|---|---|---|
| Munnar (Hyderabad, Vijayawada) | Weekly departures | Departure weekday and train time |
| Pondicherry | Weekly departures, Nampally 5 pm | Weekday |
| Arunachalam, Pondicherry & Mahabalipuram | Weekly departures | Weekday |
| Goa | Weekly departures | Weekday |
| Hampi, Gokarna & Murudeshwar | Weekly departures, sleeper bus 9 pm | Weekday |
| Gandikota camping | Weekly departures, 6 am | Weekday |
| Dudhsagar & Dandeli | Weekly departures (monsoon trip) | Whether it runs Oct–Dec |
| Coorg from Mysore | Weekly departures | Weekday |
| Andharban/Devkund, Harishchandragad treks | Weekly in the monsoon | Not dated (season over) |
| Ananthagiri camping | Call to check availability | Stays on request |
| Kerala trips, Golden Triangle, Kashmir, Manali, Shimla–Manali, Wayanad–Ooty–Mysore, couples Ooty, Kerala honeymoon | Group dates / your dates on request | Group dates, if any |

These pages keep showing their pattern ("Weekly departures", "Group dates on request") with a WhatsApp prompt.

## Confirmed schedules (5 Oct 2026)

The four trips above marked **Confirmed** run two weekly batches. They are generated from `tools/departure-schedules.json` with `npm run departures`; for these, `endDate` is the return morning. The earlier Friday/Sunday conflicts on Coorg & Chikmagalur and Ooty & Coonoor are resolved: the departure and return lines now read "Thursday or Friday 7:00 pm" and "back … Monday (Thursday batch) or Tuesday (Friday batch)". The day-by-day plans were unchanged, apart from the arrival times (Coorg 5:30 → 6:00 am, Gokarna 10–11 → 10 am).

### Coorg & Chikmagalur (Hyderabad), 25 departures

Thu 8 Oct → Mon 12 Oct · Fri 9 Oct → Tue 13 Oct · Thu 15 Oct → Mon 19 Oct · Fri 16 Oct → Tue 20 Oct · Thu 22 Oct → Mon 26 Oct · Fri 23 Oct → Tue 27 Oct · Thu 29 Oct → Mon 2 Nov · Fri 30 Oct → Tue 3 Nov · Thu 5 Nov → Mon 9 Nov · Fri 6 Nov → Tue 10 Nov · Thu 12 Nov → Mon 16 Nov · Fri 13 Nov → Tue 17 Nov · Thu 19 Nov → Mon 23 Nov · Fri 20 Nov → Tue 24 Nov · Thu 26 Nov → Mon 30 Nov · Fri 27 Nov → Tue 1 Dec · Thu 3 Dec → Mon 7 Dec · Fri 4 Dec → Tue 8 Dec · Thu 10 Dec → Mon 14 Dec · Fri 11 Dec → Tue 15 Dec · Thu 17 Dec → Mon 21 Dec · Fri 18 Dec → Tue 22 Dec · Thu 24 Dec → Mon 28 Dec · Fri 25 Dec → Tue 29 Dec · Thu 31 Dec → Mon 4 Jan

### Ooty & Coonoor (Hyderabad), 25 departures

Thu 8 Oct → Mon 12 Oct · Fri 9 Oct → Tue 13 Oct · Thu 15 Oct → Mon 19 Oct · Fri 16 Oct → Tue 20 Oct · Thu 22 Oct → Mon 26 Oct · Fri 23 Oct → Tue 27 Oct · Thu 29 Oct → Mon 2 Nov · Fri 30 Oct → Tue 3 Nov · Thu 5 Nov → Mon 9 Nov · Fri 6 Nov → Tue 10 Nov · Thu 12 Nov → Mon 16 Nov · Fri 13 Nov → Tue 17 Nov · Thu 19 Nov → Mon 23 Nov · Fri 20 Nov → Tue 24 Nov · Thu 26 Nov → Mon 30 Nov · Fri 27 Nov → Tue 1 Dec · Thu 3 Dec → Mon 7 Dec · Fri 4 Dec → Tue 8 Dec · Thu 10 Dec → Mon 14 Dec · Fri 11 Dec → Tue 15 Dec · Thu 17 Dec → Mon 21 Dec · Fri 18 Dec → Tue 22 Dec · Thu 24 Dec → Mon 28 Dec · Fri 25 Dec → Tue 29 Dec · Thu 31 Dec → Mon 4 Jan

### Gokarna, Dandeli & Murudeshwar (Hyderabad), 25 departures

Thu 8 Oct → Mon 12 Oct · Fri 9 Oct → Tue 13 Oct · Thu 15 Oct → Mon 19 Oct · Fri 16 Oct → Tue 20 Oct · Thu 22 Oct → Mon 26 Oct · Fri 23 Oct → Tue 27 Oct · Thu 29 Oct → Mon 2 Nov · Fri 30 Oct → Tue 3 Nov · Thu 5 Nov → Mon 9 Nov · Fri 6 Nov → Tue 10 Nov · Thu 12 Nov → Mon 16 Nov · Fri 13 Nov → Tue 17 Nov · Thu 19 Nov → Mon 23 Nov · Fri 20 Nov → Tue 24 Nov · Thu 26 Nov → Mon 30 Nov · Fri 27 Nov → Tue 1 Dec · Thu 3 Dec → Mon 7 Dec · Fri 4 Dec → Tue 8 Dec · Thu 10 Dec → Mon 14 Dec · Fri 11 Dec → Tue 15 Dec · Thu 17 Dec → Mon 21 Dec · Fri 18 Dec → Tue 22 Dec · Thu 24 Dec → Mon 28 Dec · Fri 25 Dec → Tue 29 Dec · Thu 31 Dec → Mon 4 Jan

### Isha, Ooty & Coonoor (Hyderabad), 25 departures

Thu 8 Oct → Mon 12 Oct · Fri 9 Oct → Tue 13 Oct · Thu 15 Oct → Mon 19 Oct · Fri 16 Oct → Tue 20 Oct · Thu 22 Oct → Mon 26 Oct · Fri 23 Oct → Tue 27 Oct · Thu 29 Oct → Mon 2 Nov · Fri 30 Oct → Tue 3 Nov · Thu 5 Nov → Mon 9 Nov · Fri 6 Nov → Tue 10 Nov · Thu 12 Nov → Mon 16 Nov · Fri 13 Nov → Tue 17 Nov · Thu 19 Nov → Mon 23 Nov · Fri 20 Nov → Tue 24 Nov · Thu 26 Nov → Mon 30 Nov · Fri 27 Nov → Tue 1 Dec · Thu 3 Dec → Mon 7 Dec · Fri 4 Dec → Tue 8 Dec · Thu 10 Dec → Mon 14 Dec · Fri 11 Dec → Tue 15 Dec · Thu 17 Dec → Mon 21 Dec · Fri 18 Dec → Tue 22 Dec · Thu 24 Dec → Mon 28 Dec · Fri 25 Dec → Tue 29 Dec · Thu 31 Dec → Mon 4 Jan

## How past dates are removed

- The site rebuilds every night at 00:05 IST (GitHub Actions schedule), and every build drops departures before today (IST).
- Safety net in the browser: if a rebuild is late, date lists, date chips, upcoming cards, the header's "Coming up" menu and the booking card ignore any date before today.
