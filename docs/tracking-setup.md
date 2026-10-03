# Tracking setup: Google Analytics, Google Ads, Meta

Everything is already built into the website. Each tool stays **off** until its ID is
entered in **CMS → Site settings → Tracking**, and tags only run on the live domain
(never on staging or previews).

| Tool | Where the ID goes | Needed for |
|---|---|---|
| Google Analytics 4 (`G-…`) | CMS → Site settings → Tracking | Reports, funnels, audiences |
| Google Ads (`AW-…` + 3 labels) | CMS → Site settings → Tracking | Ad conversions, remarketing |
| Meta Pixel ID (digits) | CMS → Site settings → Tracking | Instagram/Facebook ads |
| Meta Conversions API token | `api/config.php` on the server (**never** the CMS) | Leads counted even when the Pixel is blocked |
| Google Tag Manager (`GTM-…`) | CMS (optional) | Only for extra tags later |

> **Do not** also add GA4, Google Ads or Meta Pixel tags inside Tag Manager. They are
> already on the site; adding them again counts everything twice.

---

## 1. Google Analytics 4

1. analytics.google.com → **Admin → Create → Property** → "Hyderabad Campers Club", India, INR.
2. **Data streams → Web** → `https://hyderabadcampersclubhcc.in`. Keep "Enhanced measurement" on.
3. Copy the **Measurement ID** (`G-XXXXXXXXXX`) into the CMS.
4. **Admin → Data display → Events**: after a few days of traffic, mark these as **key events**:
   `generate_lead`, `click_whatsapp`, `click_call`.
5. **Admin → Data retention** → 14 months.
6. **Admin → Product links → Google Ads** → link your Ads account (enables audiences in Ads).

Events the site sends (all automatic):

| Event | When |
|---|---|
| `view_item_list` | Trips list, category page, upcoming trips viewed |
| `select_item` | Trip card tapped |
| `view_item` | Trip page viewed (trip, city, price) |
| `select_departure` | Date picked |
| `begin_checkout` | "Book your seat" / "Enquire" tapped |
| `view_enquiry_sheet`, `form_start`, `form_error`, `form_failed` | Form funnel |
| `generate_lead` ★ | Enquiry saved by our server (has `lead_id`, matches the Google Sheet) |
| `click_whatsapp` ★, `click_call` ★ | Contact buttons |
| `get_itinerary_click`, `search`, `filter_trips`, `compare_trips`, `add_to_compare` | Browsing |
| `consent_update` | Cookie choice made |

Names and phone numbers are never sent to Google.

## 2. Google Ads

1. ads.google.com → **Goals → Conversions → New conversion action → Website** →
   enter the domain → **Add a conversion action manually**. Create three:

   | Name | Category | Value | Count | Use as |
   |---|---|---|---|---|
   | Enquiry | Submit lead form | Don't use a value (or a fixed average) | One | **Primary** |
   | WhatsApp click | Contact | No value | One | Secondary |
   | Call click | Phone call lead | No value | One | Secondary |

2. For each, choose **"Use Google tag" → Install manually**. You'll see
   `send_to: 'AW-123456789/AbCdEfGh…'`. Enter `AW-123456789` as **Google Ads ID**, and
   the part after the slash as the matching **label** in the CMS.
3. Leave "Enhanced conversions" off for now (we don't send phone numbers to Google).
4. Your existing enquiries also carry the `gclid` in the Google Sheet, so offline
   conversion import (booked trips) can be added later.

## 3. Meta (Instagram / Facebook)

1. business.facebook.com → **Events Manager → Connect data → Web** → name it "HCC website".
2. Copy the **Pixel / Dataset ID** (15–16 digits) into the CMS.
3. In the same dataset: **Settings → Conversions API → Generate access token**. Copy it.
4. Open `api/config.php` on the server (Hostinger File Manager → `public_html/api/`) and set:
   ```php
   'meta_capi_token' => 'PASTE-TOKEN-HERE',
   ```
   (The token is a password: never put it in the CMS, GitHub or chat.)
5. **Settings → Automatic advanced matching**: off (we already send what's needed).
6. Standard events the site sends after the visitor allows Advertising:
   `PageView`, `ViewContent` (trip page), `InitiateCheckout` (Book tapped),
   `Lead` (enquiry, browser + server with the same ID so it counts once), `Contact` (WhatsApp/call).
7. In Ads Manager, optimise lead campaigns for **Lead**.

## 4. Remarketing audiences (create once data flows)

| Audience | Where | Rule | Duration |
|---|---|---|---|
| Viewed a trip, no enquiry | GA4 → Admin → Audiences (shared to Google Ads); Meta → Custom audience → Website | `view_item` / ViewContent **and not** `generate_lead` / Lead | 30 days |
| Opened enquiry, didn't send | GA4 + Meta | `begin_checkout` / InitiateCheckout and not lead | 14 days |
| Enquired | GA4 + Meta | `generate_lead` / Lead | 180 days (exclude from acquisition ads) |
| All visitors | GA4 + Meta | All | 90 days |

Only visitors who allowed Advertising join these lists.

## 5. Testing after go-live

- **Google:** tagassistant.google.com → connect `https://hyderabadcampersclubhcc.in` →
  accept cookies → open a trip → tap Book → send a test enquiry (name "TEST").
  Check `view_item`, `begin_checkout`, `generate_lead` and the Ads conversion appear.
  GA4 → Admin → DebugView shows them live.
- **Meta:** Events Manager → **Test events** → copy the test code into
  `api/config.php` as `'meta_test_event_code' => 'TEST12345'`, send a test enquiry,
  and check that **Lead** arrives from both *Browser* and *Server* and shows
  "Deduplicated". **Remove the test code afterwards.**
- Delete the TEST rows from the Google Sheet.

To test on staging before go-live, add the repository variable
`STAGING_ENABLE_TRACKING` = `true` (GitHub → Settings → Secrets and variables → Actions → Variables), then remove it after testing so test
traffic doesn't mix with real reports.
