# HCC Monthly SEO Report — {Month YYYY}

**Period:** {start} → {end} · **Compared with:** previous 28 days / same month last year (when available)
**Data sources used this month:** {Search Console export: yes/no} · {Bing: yes/no} · {GBP insights: yes/no} · {manual SERP checks: list}

> **Data honesty:** if a source wasn't available, write **"NOT AVAILABLE"** and skip the numbers. Never estimate impressions, clicks, positions or volumes. Label anything that isn't measured as *(inference)*.

## 0. Snapshot

| Metric | This period | Previous | Change | Source |
|---|---|---|---|---|
| Clicks | | | | GSC |
| Impressions | | | | GSC |
| Average CTR | | | | GSC |
| Average position | | | | GSC |
| Indexed pages (valid) | | | | GSC Pages report |
| Pages excluded / errors | | | | GSC |
| Branded clicks ("hyderabad campers club", "hcc") | | | | GSC query filter |
| WhatsApp / enquiry clicks | | | | analytics (if configured) |
| Google reviews (count) | | | | GBP (actual count only) |

## The 15 questions

1. **What grew?** Pages and queries with the largest click and impression gains.
2. **What declined?** The largest losses, and the likely reason (seasonality, a ranking drop, a SERP feature change, the page changed). Mark reasons as *(inference)* unless confirmed.
3. **Which queries are closest to the top 3?** Queries at average position 4–10 with meaningful impressions. These are the cheapest wins.
4. **Which pages gained impressions?**
5. **Which pages lost impressions?**
6. **Which pages have high impressions but low CTR?** Check the title and description against the query intent, and check whether an AI Overview or OTA feature is present (manual SERP check).
7. **Which queries are new?** Queries that weren't in last month's export.
8. **Which keywords are becoming commercially valuable?** New queries containing trip, package, cost, price, from Hyderabad, dates, booking or batch.
9. **Which competitors are gaining?** Manual check of the P0 SERPs (`competitors.md`). Note new entrants and price changes as observations.
10. **Which content gaps exist?** Queries HCC gets impressions for but has no matching page, *and* where HCC sells a matching trip.
11. **Which pages need improvement?** Pages from Q3 and Q6, pages whose trip data changed (out of date), and thin pages.
12. **Which new articles are actually justified?** Only if they pass all three tests in `strategy.md` §6. Most months the answer should be "none" or "one".
13. **Which internal links should be added?** See `internal-linking.md` §4 checks.
14. **Which authority opportunities exist?** Reviews, GBP, real photos, genuine mentions (`authority-plan.md`).
15. **What should HCC do next month?** Feeds into the top 10 below.

## Data-integrity check (every month)

- [ ] Every price, date and schedule mentioned in guides matches the current trip data.
- [ ] Every trip promoted this month has future departures in `src/content/departures/`.
- [ ] No noindex page was indexed by mistake, and no indexable page was dropped (sitemap vs GSC).
- [ ] `npm run check:links` and `npm run check:seo` both pass.

## Keyword universe updates

- Rows updated in `keyword-universe.json` (ranking, impressions, clicks, CTR, status, priority): {list IDs}
- Rows added (only for real queries from GSC that HCC can serve): {list}

---

## TOP 10 ACTIONS FOR HCC

Ranked by expected value. For each action: **what · page · why (evidence) · needs owner approval? · effort.**

1.
2.
3.
4.
5.
6.
7.
8.
9.
10.

**WAIT (next month or later):**
-

**DO NOT DO:**
-
