# Open questions before launch (internal)

Nothing below has been changed in the site data. Each item waits for HCC's confirmation.

## 1. Hyderabad itinerary contradictions

| Trip | Current statement | Source/location | Conflicting itinerary | What needs confirmation |
|---|---|---|---|---|
| **Coorg & Chikmagalur** (Hyderabad) | "Overnight sleeper train to Mysore, **Friday** 7:00 pm" and "Train from Mysore on **Sunday** 2:30 pm, back **Monday** 5:30 am" | `src/content/trips/coorg-chikmagalur.md` line 23 (`origins[hyderabad].outbound`) and line 24 (`origins[hyderabad].return`). Also "Every Friday" (line 195, `recurrence`), "in one weekend" (line 235, intro), 2N/3D (lines 11–12) | Day-by-day plan (lines 129–175): Day 0 depart Kacheguda 7 pm → Day 1 Mysore & Coorg → Day 2 Chikmagalur → Day 3 Mullayanagiri sunrise, then **the 2:30 pm train** → Day 4 reach Hyderabad 5:30 am. If day 0 is Friday, the 2:30 pm train is on **Monday** and arrival is **Tuesday**. | Is the departure **Thursday** 7 pm (so the return train is Sunday and arrival Monday), or **Friday** (so the return is Monday and arrival Tuesday)? Or is one sightseeing day not in the real plan? |
| **Ooty & Coonoor** (Hyderabad) | "Overnight Mysore Express, **Friday** 7:00 pm" and "Overnight train from Mysore on **Sunday**" | `src/content/trips/ooty-coonoor.md` line 23 (`origins[hyderabad].outbound`) and line 24 (`origins[hyderabad].return`). Also "Every Friday from Hyderabad" (line 151, `recurrence`), "you board the Mysore Express on Friday night… spend the weekend… without taking leave" (line 190, intro), 2N/3D (lines 11–12) | Day-by-day plan (lines 85–125): Day 0 board at Kacheguda 7 pm → Day 1 Mysore to Ooty (stay Ooty) → Day 2 toy train to Coonoor (stay Ooty) → Day 3 Pine Forest, lunch, drive to Mysore for the overnight train. If day 0 is Friday, day 3 (the return train) is **Monday**, not Sunday. | Is the return overnight train on **Sunday** (then the plan has one day too many, or day 1 and day 2 are a single day), or on **Monday**? Is the trip really "without taking leave"? |

**Effect on the dates already published:** these departures start on the Friday and end on the Monday (`endDate` = start + 3, following the day-by-day plan). If HCC confirms a Sunday return, only `endDate` changes (start + 2) on 24 files. If it confirms a Thursday departure, the start dates move by one day.

## 2. Bangalore details still missing (hub stays hidden from Google)

Each item is also stored as `incomplete` on the trip's Bangalore entry. That's internal: it shows in the CMS and never on the site.

| Trip | Missing / conflicting | Shown on the site today |
|---|---|---|
| Coorg & Chikmagalur | Pickup/meeting point; **transport conflict**: the page shows "Sleeper train" (the trip-wide option) but the Bangalore inclusions list only local transport; Friday departure time; arrival time back in Bangalore | "Sleeper train" chip; "group meets at 6:00 am on Saturday"; "Return train to Bangalore on day 3" |
| Munnar | Bangalore station; departure time; arrival time | "Train to Coimbatore"; "back in Bangalore the next morning" |
| Kerala: Munnar & Alleppey | Bangalore station; departure time; return and arrival time | "Sleeper train to Kochi" |
| Gokarna, Dandeli & Murudeshwar | Arrival time back in Bangalore; whether the 3AC upgrade (+₹1,700) is the same from Bangalore | KSR Bengaluru 11 pm; train from Hubballi 9:05 pm on day 3 |
| Gokarna & Dandeli for Couples | Arrival time back in Bangalore | KSR Bengaluru 11 pm |

Nothing in this table was invented or filled from the reference site.
