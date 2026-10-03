# Deploying HCC to Hostinger

The site is static HTML/CSS/JS plus two small PHP scripts:
- `api/intents.php` handles enquiries.
- `api/decap-auth.php` handles the content editor's login.

This runs on every Hostinger plan. GitHub Actions builds the site and uploads it over FTPS.

```
Editor saves in /admin  →  commit to GitHub  →  Actions builds  →  FTPS upload to Hostinger
Visitor submits a form  →  /api/intents (PHP)  →  Google Sheet (+ email alert)  →  backup copy on the server
```

**Golden rule:** the current WordPress site stays untouched until the go-live checklist (§7) is complete. Everything is tested on a staging subdomain first.

---

## 1. Staging subdomain (hPanel)

1. **hPanel → Domains → Subdomains**: create `staging.hyderabadcampersclubhcc.in`. Note its folder, e.g. `public_html/staging`.
2. **hPanel → Security → SSL**: make sure the subdomain has SSL (the free certificate covers it).
3. **hPanel → Files → FTP Accounts**: note the FTP host and username, and set a password. A dedicated FTP user is fine.

## 2. GitHub repository

1. Repository: **github.com/hyderabadcampersclubhcc-rgb/Project-HCC** (private). Already connected; `main` is the deploy branch.
2. **Settings → Secrets and variables → Actions:**

| Type | Name | Value |
|---|---|---|
| Secret | `FTP_SERVER` | FTP host from hPanel |
| Secret | `FTP_USERNAME` | FTP user |
| Secret | `FTP_PASSWORD` | FTP password |
| Variable | `STAGING_URL` | `https://staging.hyderabadcampersclubhcc.in` |
| Variable | `STAGING_DIR` | the subdomain folder relative to the FTP root, ending with `/` |
| Variable | `PRODUCTION_DIR` | `/public_html/` (relative to the FTP root) |
| Variable | `CMS_REPO` | `hyderabadcampersclubhcc-rgb/Project-HCC` (optional, this is the default) |
| Variable | `PRODUCTION_LIVE` | leave **unset** until go-live |
| Variable | `STAGING_SHOW_SAMPLES` | `true` only if you want sample trips on staging for review |

3. **Settings → Environments → production → Required reviewers**: add the owner. Production deploys then wait for approval.

Every push to `main` deploys staging automatically. Production is a manual run (Actions → Build & deploy → Run workflow → production) until `PRODUCTION_LIVE=true`.

## 3. Server config (once per environment)

In hPanel File Manager, copy `api/config.sample.php` to **`api/config.php`** in the staging folder (and later in `public_html`) and fill it in.
- Deploys never overwrite `config.php`.
- `.htaccess` blocks it from the web.

## 4. Google Sheet for leads

1. Create a Google Sheet, e.g. "HCC Leads", on the HCC Google account.
2. **Extensions → Apps Script**: paste [`integrations/google-apps-script/Code.gs`](../integrations/google-apps-script/Code.gs).
3. **Project Settings → Script properties:**
   - `SECRET` = a long random string. It must match `leads_secret` in `config.php`.
   - `NOTIFY_EMAILS` = team emails for instant alerts (optional, comma-separated).
4. **Deploy → New deployment → Web app**: Execute as **Me**, access **Anyone**. Copy the `/exec` URL into `leads_webhook_url`.
5. Test: submit the custom-trip form on staging. A row appears on the "Leads" tab within seconds.

**Backup copy:** every lead is also appended to `hcc-leads/leads-YYYY-MM.jsonl` one level above the web root.
- If Google is unreachable, nothing is lost.
- If that folder isn't writable, the script falls back to `api/.leads/`, which is blocked from the web.

## 5. Content editor login (Decap CMS)

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**:
   - Homepage URL: `https://hyderabadcampersclubhcc.in`
   - Callback URL: `https://hyderabadcampersclubhcc.in/api/decap-auth`
   - Create a second OAuth app for staging with the staging host, or reuse one by switching the callback.
2. Put the client ID and secret into `github_client_id` / `github_client_secret` in `config.php`.
3. Give each editor a GitHub account with write access to the repository.
4. Editors open `/admin/` and click "Login with GitHub". Each save commits to `main`, and the site rebuilds in about 2 minutes.

## 6. What the build generates for Hostinger

`integrations/hostinger.mjs` writes `dist/.htaccess` with:
- HTTPS and the canonical host (non-www) on production
- `/api/intents` and `/api/decap-auth` rewrites
- **301 redirects for every old WordPress URL** (see `src/data/legacy-redirects.ts`), so existing Google rankings and shared links keep working
- custom 404, security headers and caching (hashed `/_astro/` assets are cached for a year, HTML always revalidates)
- 410 Gone for `wp-admin`, `wp-login.php` and `xmlrpc.php` (bots keep requesting them)

When an old trip is re-created in the CMS, add its old URL (e.g. `/ooty-coonoor/`) to the trip's **Old website URLs** field. Its redirect then upgrades from the category page to the new trip page automatically.

**Indexing safety:** only the production job sets `PUBLIC_ALLOW_INDEXING=true`. Staging and local builds output `noindex` on every page and a `Disallow: /` robots.txt.

## 7. Go-live checklist (replacing WordPress)

Do this at a quiet hour. Rollback takes about 5 minutes.

1. **Back up WordPress:** hPanel → Backups → generate a full backup (files + database) and download it.
2. **Verify on staging:**
   - pages, forms (a lead arrives in the Sheet) and the CMS login
   - Lighthouse
   - all real trips, dates and prices entered
3. **Move WordPress aside** (don't delete it): in File Manager, create `public_html/_wp-old/` and move every WordPress file and folder into it, including `index.php`, `wp-*` and the old `.htaccess`. Keep `.well-known/` and the staging folder where they are.
4. **Deploy production:** Actions → Run workflow → production (approve it), or set `PRODUCTION_LIVE=true` and push.
5. Copy `config.php` into `public_html/api/` and update the OAuth callback to the main domain.
6. **Smoke test:**
   - `/`
   - a trip page
   - an old URL such as `/ooty-coonoor/` (should 301)
   - submit a test lead
   - `/robots.txt` (should allow crawling)
   - `/sitemap-index.xml`
7. **Google Search Console:** submit `https://hyderabadcampersclubhcc.in/sitemap-index.xml`. Use URL inspection on a few new pages.
8. After 2–4 weeks with no issues, delete `_wp-old/` and its database. Keep the downloaded backup.

**Rollback:** move the WordPress files back from `_wp-old/` to `public_html/` (replacing `index.html` and `.htaccess`).

## 8. Local testing of the PHP endpoint

```bash
npm run build
```

```bash
php -S localhost:8088 -t dist tools/php-router.php
```

`tools/php-router.php` mimics the `.htaccess` rewrites and provides a mock Sheet at `/__mock-sheet` (secret `local-test-secret`). Put a local `dist/api/config.php` pointing `leads_webhook_url` at a second PHP server running on another port.
