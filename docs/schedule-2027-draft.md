# HCC 2027 departure schedule: DRAFT

> **Draft for owner review. Not bookable, not published, not loaded by the website.** No departure files were
> created; `tools/departure-schedules.json` and `src/content/departures/` are unchanged. Generated 12 Oct 2026
> from the 2026 patterns. Nothing here is confirmed for 2027 until HCC says so.

## How this was drafted

- **Confirmed pattern (section A):** the four Hyderabad trips in `tools/departure-schedules.json` (confirmed by HCC on
  5 Oct 2026 for 8 Oct to 31 Dec 2026). The same weekdays, departure times and return rules were carried into 2027.
- **Confirmed pattern, other cities (section A2):** Coorg & Chikmagalur from Bangalore, from the same confirmed file.
- **Inferred pattern (section B):** other trip/city pairs have dated 2026 files but no confirmed weekly rule. Their
  weekday and length were read from those files. Lower confidence: confirm each one before use.
- Return date = departure date + the same number of days as in 2026.
- Every date in 2027 on a batch weekday is listed: no holidays, blackout dates, seasonal breaks or price changes
  were applied, because none are confirmed.

## A. Confirmed-pattern trips from Hyderabad (Thursday and Friday batches)

| Trip | Batch | Departs | Back | Return rule |
|---|---|---|---|---|
| Coorg & Chikmagalur (`coorg-chikmagalur`) | Thu | 19:00 | Monday 06:00 | +4 days |
| Coorg & Chikmagalur (`coorg-chikmagalur`) | Fri | 19:00 | Tuesday 06:00 | +4 days |
| Ooty & Coonoor (`ooty-coonoor`) | Thu | 19:00 | Monday 06:00 | +4 days |
| Ooty & Coonoor (`ooty-coonoor`) | Fri | 19:00 | Tuesday 06:00 | +4 days |
| Gokarna, Dandeli & Murudeshwar (`gokarna-dandeli`) | Thu | 15:00 | Monday 10:00 | +4 days |
| Gokarna, Dandeli & Murudeshwar (`gokarna-dandeli`) | Fri | 15:00 | Tuesday 10:00 | +4 days |
| Isha, Ooty & Coonoor (`isha-ooty-coonoor`) | Thu | 19:00 | Monday 06:00 | +4 days |
| Isha, Ooty & Coonoor (`isha-ooty-coonoor`) | Fri | 19:00 | Tuesday 06:00 | +4 days |

All four trips share the same 2027 calendar (105 departures each, 420 in total):

| Month | Thursday batches (back Monday) | Friday batches (back Tuesday) | Count |
|---|---|---|---|
| Jan | 7, 14, 21, 28 | 1, 8, 15, 22, 29 | 9 |
| Feb | 4, 11, 18, 25 | 5, 12, 19, 26 | 8 |
| Mar | 4, 11, 18, 25 | 5, 12, 19, 26 | 8 |
| Apr | 1, 8, 15, 22, 29 | 2, 9, 16, 23, 30 | 10 |
| May | 6, 13, 20, 27 | 7, 14, 21, 28 | 8 |
| Jun | 3, 10, 17, 24 | 4, 11, 18, 25 | 8 |
| Jul | 1, 8, 15, 22, 29 | 2, 9, 16, 23, 30 | 10 |
| Aug | 5, 12, 19, 26 | 6, 13, 20, 27 | 8 |
| Sep | 2, 9, 16, 23, 30 | 3, 10, 17, 24 | 9 |
| Oct | 7, 14, 21, 28 | 1, 8, 15, 22, 29 | 9 |
| Nov | 4, 11, 18, 25 | 5, 12, 19, 26 | 8 |
| Dec | 2, 9, 16, 23, 30 | 3, 10, 17, 24, 31 | 10 |

Totals per trip: 52 Thursday + 53 Friday = 105. First: Fri 1 Jan (back Tue 5 Jan). Last: Fri 31 Dec (back Tue 4 Jan 2028).

### A2. Confirmed-pattern trips from other cities

| Trip | City | Batch | Departs | Back | Return rule | 2027 draft count | First / last 2027 |
|---|---|---|---|---|---|---|---|
| Coorg & Chikmagalur | bangalore | Fri | 06:00 | Sunday (no fixed time shown) | +2 days | 53 | Fri 1 Jan / Fri 31 Dec |
| Coorg & Chikmagalur | bangalore | Sat | 06:00 | Monday ~18:00 | +2 days | 52 | Sat 2 Jan / Sat 25 Dec |

## B. Inferred-pattern trips (from 2026 files, lower confidence)

| Trip | City | 2026 pattern seen | 2026 files | 2027 draft count | First / last 2027 |
|---|---|---|---|---|---|
| Araku Valley, Vanajangi & Vizag | hyderabad | Thu +3d (back Sun) | 13 (2026-10-08 → 2026-12-31) | 52 | Thu 7 Jan / Thu 30 Dec |
| Gokarna & Dandeli for Couples | bangalore | Fri +3d (back Mon) | 10 (2026-10-09 → 2026-12-11) | 53 | Fri 1 Jan / Fri 31 Dec |
| Gokarna & Dandeli for Couples | hyderabad | Fri +3d (back Mon) | 12 (2026-10-09 → 2026-12-25) | 53 | Fri 1 Jan / Fri 31 Dec |
| Gokarna, Dandeli & Murudeshwar | bangalore | Fri +3d (back Mon) | 10 (2026-10-09 → 2026-12-11) | 53 | Fri 1 Jan / Fri 31 Dec |
| Gokarna, Dandeli & Murudeshwar | vijayawada | Fri +3d (back Mon) | 12 (2026-10-09 → 2026-12-25) | 53 | Fri 1 Jan / Fri 31 Dec |
| Kerala: Munnar & Alleppey | bangalore | Fri +4d (back Tue) | 2 (2026-10-16 → 2026-11-06) | 53 | Fri 1 Jan / Fri 31 Dec |
| Lonavala & Matheran | hyderabad | Thu +3d (back Sun) | 13 (2026-10-08 → 2026-12-31) | 52 | Thu 7 Jan / Thu 30 Dec |
| Munnar | bangalore | Fri +3d (back Mon) | 11 (2026-10-09 → 2026-12-18) | 53 | Fri 1 Jan / Fri 31 Dec |
| Wayanad | hyderabad | Thu +3d (back Sun) | 13 (2026-10-08 → 2026-12-31) | 52 | Thu 7 Jan / Thu 30 Dec |

Section B dates follow the same weekday rule as section A, so they can be read off a calendar; they are not listed one by one.

## Validation

- Weekdays: every section A date is a Thursday or a Friday (passed). Every Thursday batch returns on a Monday and every Friday batch on a Tuesday (passed).
- Duplicates and collisions: none. No duplicate dates per trip, and no 2027 date already has a departure file.
- Every trip id exists in `src/content/trips/`: passed.
- Total draft departures: 420 (section A) + 105 (section A2) + 474 (section B) = 999.

## Assumptions (need HCC confirmation)

1. The Thursday and Friday batches, departure times and return times confirmed for Oct–Dec 2026 continue unchanged through all of 2027.
2. The trips run every week of the year, including the monsoon (June–September) and summer. Monsoon operation of Gokarna/Dandeli water activities, Coorg and Wayanad is not confirmed.
3. 2027 prices, inclusions and itineraries are the same as 2026. Nothing here changes any price.
4. Section B patterns (Bangalore, Vijayawada, Thursday-only Hyderabad trips, couple trip) were inferred from dated files, not from a confirmed weekly rule.
5. No holiday or long-weekend extra batches were added, and no dates were removed for festivals.

## Conflicts and points to check

1. **Year boundary.** The confirmed 2026 schedule ends on 31 Dec 2026. 2027 starts on a Friday, so the first 2027 batch is Fri 1 Jan, the day after the Thu 31 Dec 2026 batch. Confirm both run.
2. **53 Fridays.** 2027 has 53 Fridays and 52 Thursdays. The last Friday batch (Fri 31 Dec) returns on Tue 4 Jan 2028, in 2028.
3. **Fixed-date holidays** (moving festivals such as Holi, Ugadi, Diwali, Dussehra and Sankranti are not checked here; their 2027 dates need confirming): Republic Day (Tue 26 Jan): falls during the Fri 22 Jan batch; Independence Day (Sun 15 Aug): falls during the Thu 12 Aug and Fri 13 Aug batches; Gandhi Jayanti (Sat 2 Oct): falls during the Thu 30 Sep and Fri 1 Oct batches; Christmas (Sat 25 Dec): falls during the Thu 23 Dec and Fri 24 Dec batches. Holiday weeks may need extra batches or different prices; none were assumed.
4. **Overlapping batches.** The Thursday batch (back Monday) and the Friday batch (back Tuesday) of the same trip are on the road at the same time every week, as in 2026. Confirm that HCC can run both batches of every trip in the same week all year.
5. **Bangalore Coorg-Chikmagalur** returns are recorded as "Sunday (no fixed time shown)" and "Monday ~18:00". Return times are not confirmed.
6. **Kerala Munnar-Alleppey from Bangalore** had only 2 dates in 2026 (16 Oct and 6 Nov). It may not be a weekly trip; a weekly 2027 pattern is a guess.
7. **Hyderabad Gokarna-Dandeli** (Thu/Fri, +4 days, confirmed) and **Gokarna-Dandeli Couple** (Fri only, +3 days, inferred) share a destination. Check that both are meant to run.
8. **Bangalore December gap.** The 2026 Bangalore dates stop before the end of the year (Coorg & Chikmagalur 19 Dec, confirmed range; Gokarna 11 Dec; Munnar 18 Dec; Kerala 6 Nov), while Hyderabad runs to 31 Dec. If that is a deliberate year-end break, the late-December 2027 Bangalore dates in this draft are wrong.

## Next step

When HCC confirms the 2027 pattern (and any breaks), add 2027 entries to `tools/departure-schedules.json` and run `npm run departures`. Until then nothing is bookable.
