# Phase C: Hyderabad (and Vijayawada) working schedule, Oct–Dec 2026 (internal)

**Source:** HCC's own trip data only (each trip's stated departure pattern in `src/content/trips/*.md`). Imported 5 Oct 2026 as `src/content/departures/{trip}-{city}-{date}.yml` (123 files).
**Rule:** dates were created only where HCC's data names a weekday ("Every Friday", "Every Thursday", "Every Saturday"). HCC prices are unchanged. `endDate` is the last trip day, when the return journey starts (same rule as Bangalore).

## Dated departures added

| Trip | City | Pattern (HCC data) | Dates added | Trip days |
|---|---|---|---|---|
| Coorg & Chikmagalur | Hyderabad | Every Friday, Kacheguda 7 pm | 12 Fridays, 9 Oct – 25 Dec | Fri → Mon |
| Gokarna, Dandeli & Murudeshwar | Hyderabad | Every Friday, Nampally 3:45 pm | 12 Fridays | Fri → Mon (back Tue 10–11 am) |
| Gokarna, Dandeli & Murudeshwar | Vijayawada | Every Friday, 2 pm | 12 Fridays | Fri → Mon |
| Gokarna & Dandeli for Couples | Hyderabad | Every Friday, 3:45 pm | 12 Fridays | Fri → Mon |
| Isha, Ooty & Coonoor | Hyderabad | Every Friday | 12 Fridays | Fri → Mon |
| Ooty & Coonoor | Hyderabad | Every Friday, Kacheguda 7 pm | 12 Fridays | Fri → Mon |
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

## Conflicts inside HCC's own data (flagged, not changed)

- **Coorg & Chikmagalur (Hyderabad):** the trip says "Friday 7 pm" out and "train from Mysore on Sunday 2:30 pm, back Monday 5:30 am", but the day-by-day plan has three days on the ground (the 2:30 pm train is on day 3, which is Monday if you leave Friday). Either the departure is Thursday or the return is Monday. Dates use Friday (the stated departure day).
- **Ooty & Coonoor (Hyderabad):** "overnight train from Mysore on Sunday", but the plan's day 3 (the Mysore train day) is Monday if you leave Friday. Same question.

## How past dates are removed

- The site rebuilds every night at 00:05 IST (GitHub Actions schedule), and every build drops departures before today (IST).
- Safety net in the browser: if a rebuild is late, date lists, date chips, upcoming cards, the header's "Coming up" menu and the booking card ignore any date before today.
