# HCC SEO Engine

A small, file-based SEO system for hyderabadcampersclubhcc.in. It decides **what to do next** and **what not to do**. It never publishes anything by itself.

## 1. Files

| File | Purpose | Update frequency |
|---|---|---|
| `strategy.md` | Permanent strategy and hard rules (accuracy, no mass content, approvals) | Rarely; owner-approved |
| `keyword-universe.json` | Every keyword HCC cares about, mapped to one page, with priority and status | Monthly (from Search Console) |
| `topic-clusters.md` | Clusters: commercial owner page + supporting pages + gaps | When pages change |
| `content-calendar.md` | Dated plan of improvements, index decisions and new items | Monthly |
| `internal-linking.md` | Required links and monthly link checks | Monthly |
| `competitors.md` | Who ranks, and what to learn (never copy) | Monthly, light touch |
| `authority-plan.md` | Reviews, GBP, photos, mentions, video | Quarterly |
| `seasonal-calendar.md` | Seasons, long weekends, publish-by dates | Yearly + monthly check |
| `monthly-report-template.md` | The 15 questions + TOP 10 ACTIONS | Copy each month to `reports/YYYY-MM.md` |

## 2. Current data status (8 Oct 2026)

- **Google Search Console: NOT CONNECTED.** The site isn't in production yet (staging is noindex). All ranking, impression, click and CTR fields are `null`.
- Bing Webmaster Tools: not connected.
- Analytics: tracking IDs in `src/data/site.json` are empty.
- Everything in these files that isn't measured is labelled as observation, trend information or inference.

## 3. Weekly workflow (about 20 minutes)

Run on Monday:

```bash
PUBLIC_ALLOW_INDEXING=true npm run build
npm run seo:report
```

This writes `seo/reports/YYYY-MM-DD.md` (local only; nothing is sent or published). It runs all the checks below, reads the latest Search Console export if there is one, and drafts the list below. Then ask Claude: *"Review this week's SEO report"* to turn the draft into:

```
THIS WEEK:
1. <highest-value action>  (page, evidence, approval needed?)
2. <second>
3. <third>

WAIT:
- <lower-value work that can slip a week or more>

DO NOT DO:
- <tempting but low-value work, duplicates, unnecessary content>
```

What the check inspects:

| Check | How | Available now? |
|---|---|---|
| Search Console queries/pages | exports in `seo/data/gsc/` (see §4) | ❌ after launch |
| Indexation and sitemap | `npm run check:integrity` (sitemap ↔ indexable pages, duplicate canonicals) + GSC Pages export | ✅ (GSC part after launch) |
| Index policy (Bangalore hub, guides, Terms, Privacy stay noindex; the sample Ooty guide is never published) | `npm run check:integrity` | ✅ |
| Broken links | `npm run check:links` | ✅ |
| Titles, descriptions, one H1, self-canonical, valid JSON-LD, image alt | `npm run check:seo` | ✅ |
| One price per person (no `+₹`, 3AC/room upgrade or "extra cost" wording) | `npm run check:integrity` | ✅ |
| Unsupported claims (popularity, traveller counts, ratings, urgency) and Review/AggregateRating schema | `npm run check:integrity` | ✅ |
| Past departures in structured data | `npm run check:integrity` | ✅ |
| City consistency (no Hyderabad pickup details on Bangalore pages and vice versa) | `npm run check:integrity` | ✅ |
| Price consistency ("At a glance" price = cheapest offer; written "from ₹X" next to a trip link = live price) | `npm run check:integrity` | ✅ |
| Links from indexable pages to noindex pages | `npm run check:integrity` (warnings) | ✅ |
| Keyword universe ↔ pages (page exists, index status matches) | `npm run seo:report` | ✅ |
| Queries at position 4–10, low CTR, new queries | `npm run seo:report` with a GSC export | ❌ after launch |
| Seasonal timing | `seo:report` (content calendar for this and next month) + `seasonal-calendar.md` | ✅ |

All three checks together: `npm run check:all` (after a production-mode build).

## 4. Search Console export intake (no credentials needed)

Once the site is live and verified in Search Console:
1. Go to **Performance → Search results**, set the date range to the last 28 days, and click **Export → CSV** (or Google Sheets, then download).
2. Unzip, then save `Queries.csv` and `Pages.csv` into `seo/data/gsc/YYYY-MM-DD/`.
3. Optional: export **Pages** (indexing report) to the same folder.
4. Run `npm run seo:report`. It picks up the newest folder automatically (position 4–10 queries, high impressions / low CTR, commercial and new queries, top pages).
5. Ask Claude: *"Update the keyword universe from seo/data/gsc/YYYY-MM-DD"* to fill the ranking, impressions, clicks and ctr fields.

Decision needed before the first import: whether `seo/data/` is committed or gitignored. GSC data isn't secret, but it is business data.

## 5. Automation

**Built (local, 8 Oct 2026):** `tools/check-integrity.mjs`, `tools/seo-report.mjs` and the npm scripts `check:integrity`, `check:all`, `seo:report`. They read the built site and these files and write a local report. They never publish, deploy, email or call external services.

**Not built: scheduled GitHub Actions report (proposal below).** The existing deploy workflow wasn't touched.

Goal: recurring analysis without the owner having to ask, and **never** auto-publishing.

**Option A (recommended to start): manual export + Claude.** No credentials, no new infrastructure. The weekly and monthly prompts above.

**Option B: GitHub Actions, report-only.** Implement only after owner approval. This is a **separate** workflow file; `deploy.yml` is not touched.

```yaml
# .github/workflows/seo-report.yml  (proposal)
name: SEO weekly report
on:
  schedule: [{ cron: '30 3 * * 1' }]   # Monday 09:00 IST
  workflow_dispatch:
permissions:
  contents: read
  issues: write
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: PUBLIC_ALLOW_INDEXING=true npm run build
      - run: npm run check:all
      # Optional, only if the owner adds a service-account key as a GitHub Secret:
      # - run: node tools/seo/gsc-pull.mjs   # reads secrets.GSC_SERVICE_ACCOUNT_JSON from env, never from the repo
      - run: npm run seo:report
      - run: gh issue create --title "SEO weekly $(date +%F)" --body-file seo/reports/$(date +%F).md
        env: { GH_TOKEN: '${{ github.token }}' }
```

Properties:
- It only **reads** the repo and **opens an issue** with the report. There's no commit, push, deploy or FTP step.
- Credentials (if Search Console API access is ever wanted) live only in GitHub Secrets, read through `env`. Nothing is hardcoded and no key is placed in the repo or `.secrets/`.
- The report script exists (`tools/seo-report.mjs`); only the scheduled workflow file needs approval. A Search Console API pull would be a separate script reading a key from GitHub Secrets.
- Drafting content is **not** automated. Drafts are created only when the owner asks.

## 6. Approval gates (from `strategy.md` §17)

Automation and Claude **may**: collect data, analyse it, update these `/seo/` files and reports, recommend, and draft when asked.

The **owner must approve**:
- publishing an article or making any page indexable;
- changing important page copy;
- changing prices, dates, schedules, transport, inclusions or accommodation;
- creating new indexable pages;
- deleting or redirecting pages;
- any commit, push or deploy.

## 7. Standing exclusions

- The five travel guides stay noindex until the owner approves each one.
- The Bangalore hub stays noindex until Bangalore operational data is complete.
- The sample guide `hyderabad-to-ooty-travel-guide.mdx` is placeholder content and must not be published as is.
- Never mention Tripper Trails on the site. Never copy competitor content.
- AI images are always labelled and are never presented as HCC photos.
