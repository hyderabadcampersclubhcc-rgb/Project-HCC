# Phase 7 audit (2026-10-03)

Audited the production build (with sample trips switched on so every template had content),
mobile Lighthouse 12 (simulated 4G, mid-range phone), plus scripted checks.
Re-run any time: `npm run audit` (type check → build → link check → SEO check).

## Scores after fixes (mobile)

| Page | Performance | Accessibility | Best practices | SEO | LCP |
|---|---|---|---|---|---|
| Home | 96 | 96* | 100 | 92† | 2.0 s |
| Trip page | 98 | 96* | 100 | 92† | 2.0 s |
| All trips | 99 | 96* | 100 | 100 | 2.0 s |
| Upcoming trips | 98 | 100 | 100 | 100 | 1.8 s |
| Destination | 98 | 100 | 100 | 100 | 1.7 s |
| Travel guide | 98 | 100 | 100 | 100 | 1.8 s |
| Contact | 97 | 100 | 100 | 92† | 1.8 s |
| Customised trips | 98 | 100 | 100 | 92† | 1.8 s |

CLS ≈ 0 and Total Blocking Time 0 ms everywhere.

\* Only remaining flag: sold-out dates are intentionally faded. Inactive items are exempt from
WCAG contrast rules.
† WhatsApp fallback links have no address until HCC's WhatsApp number is entered in
Site settings. They then score 100.

## Fixed in this phase

- **Contrast (WCAG AA):** grey helper text, alert red, link green, step numbers and the guide
  "Quick answer" label were all darkened to at least 4.5:1.
- **ARIA:** trip-length stubs and route lines now have a valid `role="img"` for their labels.
- **Heading order:** trip cards on /trips/ and category pages are now `h2` (they were `h3`
  directly under the `h1`).
- **Security:** every inline JSON block (structured data, booking data, compare data) escapes `<`,
  so text from the CMS can never break out of a `<script>` tag.
- **Sharing:** every page now has a share image. Pages without their own photo use the brand card
  `public/og-default.png` (regenerate with `npm run make:og`).
- **Titles:** " | HCC" is dropped when it would push a title past 65 characters, so Google
  doesn't cut off the important words.
- **Homepage description:** trimmed to 159 characters.
- **Compare tray:** keeps the selection in memory when browser storage is blocked.

## Checks that passed

- **Links:** 0 broken internal links (1,700+ checked). All 47 legacy WordPress URLs redirect to
  existing pages.
- **SEO:** each indexable page has exactly one `h1`, a unique title and description, a canonical
  URL pointing to itself, Open Graph tags, valid JSON-LD, and `alt` on every image.
  Draft and thin pages are noindex and left out of the sitemap.
- **Instagram / Facebook in-app browser:** tested at phone size with storage blocked (the
  worst case). The campaign date link pre-selects the date and price, the booking sheet opens,
  the form validates, and a failed send shows the error with the WhatsApp fallback.
  Attribution falls back to memory for that visit.
- **Staging server:** HTTPS; security headers (HSTS, nosniff, frame, referrer, permissions);
  Brotli compression; one-year immutable caching for build assets; `config.php` blocked (403);
  old WordPress endpoints return 410; staging robots.txt blocks everything.
- **Tracking (Phase 6):** consent defaults to denied. Events reach GA4, Ads and Meta only
  after consent. The Meta server event shares its ID with the browser event so it is counted once.

## Go-live blockers (content and setup from HCC)

1. **WhatsApp number** (Site settings). Every booking fallback depends on it.
2. **Real trips, departures and photos**, replacing the samples.
3. **Google Sheet connection** (deferred step, about 10 minutes).
4. **Policy pages:** review the privacy policy, add terms and cancellation text, then switch off
   "Draft".
5. **`api/config.php` on the live server**, then a test enquiry.
6. **Optional at launch:** tracking IDs (see `docs/tracking-setup.md`).

## Known limitation (not a defect)

- The build prints "The collection reviews does not exist or is empty". This is expected until the
  first genuine review is added; review sections stay hidden until then.
