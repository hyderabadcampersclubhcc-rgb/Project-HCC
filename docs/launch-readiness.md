# Launch readiness (production go-live)

Status as of 9 Oct 2026. Production (hyderabadcampersclubhcc.in) is still the old WordPress site. **Nothing launches until the owner approves.** The go-live procedure itself (backup, move WordPress aside, deploy, smoke test, rollback) is in `docs/deployment-hostinger.md` §7.

## A. Technical: done and checked automatically

Run before launch: `PUBLIC_ALLOW_INDEXING=true npm run build && npm run check:all`

| Area | Status | How it's checked |
|---|---|---|
| Titles, meta descriptions, one H1, self-canonical, valid structured data, image alt text | ✅ | `check:seo` |
| Internal links | ✅ 0 broken | `check:links` |
| Sitemap = exactly the indexable pages; no duplicate canonicals | ✅ 62 URLs | `check:integrity` |
| Required structured data per page type, and FAQ markup matching visible Q&As | ✅ | `check:integrity` |
| Legacy WordPress 301s: every target built, no chains | ✅ 49 rules | `check:integrity` (2 targets are deliberately noindex for now: `/terms/`, `/travel-guides/`) |
| One price per person; no upgrade, room or "extra cost" price wording | ✅ | `check:integrity` |
| No unsupported claims (ratings, traveller counts, "No. 1", urgency) | ✅ | `check:integrity` |
| No past departures; the same dates on every page; city data not mixed (Hyderabad/Bangalore) | ✅ | `check:integrity` + nightly rebuild at 00:05 IST |
| Trip pages indexed only when owner-approved and conflict-free | ✅ | `check:integrity` + `catalog/verification.json` |
| Index policy: Bangalore hub, guides, Terms, Privacy and new Ananthagiri camps stay noindex | ✅ | `check:integrity` |
| Mobile 375/390 px: no horizontal scroll | ✅ key pages | manual browser check |
| Performance (Lighthouse mobile/desktop) | ✅ home 89–90 / 99; key pages 88–98 / 99; CLS 0 | manual Lighthouse runs |
| Accessibility | ✅ 100 on home and hubs; trip-page issues (gallery counter contrast, date-button names) fixed 9 Oct | Lighthouse |
| Staging is noindex + robots disallow; production build allows indexing | ✅ | build flag `PUBLIC_ALLOW_INDEXING` |
| Weekly SEO report and catalog audit | ✅ | `npm run seo:report`, `npm run catalog:audit` |

## B. Owner: business details and content (needed before or at launch)

| Item | Why | Where it goes |
|---|---|---|
| Approve staging (all pages) | Launch gate | — |
| Missing trip facts (97 flagged fields: stay types, pickup points/times, advance amounts, etc.) | Completeness; not blocking | `catalog/catalog-status.md` → fill in trip files |
| Dates for 2027 and for the 21 undated trip/city pages | Current dates are a competitive advantage; existing dates end 31 Dec 2026 | `tools/departure-schedules.json` |
| Crossed-out "reference" prices: genuine? | Consumer-protection risk | trip files (`originalPrice`) |
| Ananthagiri camps: dates, payment, cancellation, GST, children, photos; then approve each page | Pages stay noindex until approved | `catalog/campsites-ananthagiri.md` |
| Real trip photos (no HCC photos yet; stock and labelled AI only) | Trust and conversion | send per trip; replaced in the trip files |
| Genuine Google reviews (optional cards) | Trust | `src/content/reviews/` |
| Privacy policy: remaining details (grievance contact, retention period, tracking tools) | Legal; page is noindex until complete | `src/content/pages/privacy-policy.md` |
| Terms & Conditions wording approval | Hidden until approved | `src/content/pages/terms.md` |
| WhatsApp support hours (optional) | Trust | `src/data/site.json` |
| Tracking IDs (GA4 / Ads / Meta), if wanted | Analytics; the cookie banner appears only when an ID is set | CMS → Site settings → Tracking |
| Google Sheet for leads + `api/config.php` on the server | Enquiry form backup to the Sheet | `docs/deployment-hostinger.md` §4 |

## C. At and after launch (owner accounts + Claude)

1. Follow `docs/deployment-hostinger.md` §7 (backup, move WordPress aside, deploy, smoke test).
2. Search Console: verify the domain, submit `sitemap-index.xml`, and inspect the home page, the Hyderabad hub and 2–3 trip pages.
3. Bing Webmaster Tools: import from Search Console.
4. Google Business Profile: set the website to `https://hyderabadcampersclubhcc.in/`. Instagram and Facebook bios link to the site.
5. Week 1: run `npm run seo:report` with the first Search Console export (`seo/README.md` §4). Check the redirects of old WordPress URLs in Search Console → Pages.
6. Monthly: `seo/monthly-report-template.md`.
