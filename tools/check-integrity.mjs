// Content-integrity checks for the built site (run after `npm run build`):
//   node tools/check-integrity.mjs
// Complements check-seo.mjs (titles, descriptions, H1, canonical) and check-links.mjs.
// Guards the HCC rules that SEO edits must never break:
//   1. Sitemap ↔ index status: every sitemap URL is a built, indexable, self-canonical page,
//      and every indexable page is in the sitemap. No two pages share a canonical.
//   2. Pages that must stay noindex until the owner approves (index policy below).
//   3. One price per person: no upgrade or variant prices in visible text.
//   4. No unsupported claims: popularity/"No. 1"/traveller counts, star ratings, and no
//      Review/AggregateRating structured data (HCC shows only genuine reviews, linked to Google).
//   5. No past departures in TouristTrip offers (a stale build needs the nightly rebuild).
//   6. City consistency: a Bangalore page's trip sections don't mention Hyderabad pickup
//      details, and vice versa.
//   7. Price consistency: a trip's "At a glance" price matches its cheapest offer, and
//      "from ₹X" written next to a trip link elsewhere matches that trip's live price.
// Exits 1 on errors; warnings are printed but don't fail.
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

// Pages that must stay noindex until the owner approves indexing (change only with approval).
const MUST_BE_NOINDEX = [
  /^\/weekend-trips-from-bangalore\/$/, // Bangalore hub: on hold until Bangalore operations data is confirmed
  /^\/travel-guides\//, // guides: each one needs owner review before indexing
  /^\/terms\/$/, // hidden until the owner approves the wording
  /^\/privacy-policy\/$/,
];
// Placeholder content that must never be published.
const MUST_NOT_EXIST = ['/travel-guides/hyderabad-to-ooty-travel-guide/'];

// One customer-facing price per person (HCC, 8 Oct 2026).
const UPGRADE_PRICE = [
  [/\+\s?₹\s?\d[\d,]*/, 'add-on price "+₹…"'],
  [/\b3\s?AC\b[^.]{0,30}(\+|₹)/i, '3AC with a price'],
  [/\bupgrades?\b/i, '"upgrade" wording'],
  [/\b(double|triple|quad|twin)[ -](sharing|room)s?\b[^.]{0,40}₹\s?\d/i, 'room-sharing price tier'],
  [/₹\s?[\d,]+\s+on\s+(double|triple|quad|twin)\b/i, 'room-sharing price tier'],
  [/\bat (an )?extra cost\b|\bcosts? (more|extra)\b/i, '"extra cost" variant wording'],
];
// Claims HCC can't support without evidence.
const CLAIMS = [
  [/\b(most popular|best[- ]?sell(ing|er)|no\.?\s?1\b|#1\b|number one|top[- ]rated|award[- ]winning)/i, 'popularity claim'],
  [/\b\d[\d,]*\+?\s+(happy\s+)?(travell?ers|customers|campers|trips completed)\b/i, 'traveller-count claim'],
  [/\bthousands of (happy )?(travell?ers|customers)\b/i, 'traveller-count claim'],
  // Ratings in words or stars; not gallery counters like "1 / 5".
  [/\b(rated|rating:?)\s+[1-5](\.\d)?\b|\b[1-5](\.\d)?\s?(★|out of 5\b|stars?\b)/i, 'rating claim'],
  [/\b(hurry|selling fast|filling fast|last chance)\b/i, 'urgency claim'],
];
const CITY_TERMS = {
  hyderabad: /\b(Hyderabad|Kacheguda|Nampally|Secunderabad|Lingampalli)\b/,
  bangalore: /\b(Bangalore|Bengaluru|Majestic|KSR)\b/,
};

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}
const decode = (s = '') =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const visible = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<template[\s\S]*?<\/template>/g, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ');
const num = (s) => Number(String(s).replace(/[^\d]/g, ''));
const ctx = (text, i) => text.slice(Math.max(0, i - 50), i + 70).trim();

const errors = [];
const warnings = [];
const pages = new Map(); // path → { html, text, indexable, canonical }

for (const file of await walk(DIST)) {
  const rel = path.relative(DIST, path.dirname(file)).replace(/\\/g, '/');
  const page = rel ? `/${rel}/` : '/';
  if (page.startsWith('/admin/') || page === '/404/') continue;
  const html = await readFile(file, 'utf8');
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';
  pages.set(page, {
    html,
    text: visible(html.match(/<main[\s\S]*<\/main>/)?.[0] ?? html),
    indexable: !robots.includes('noindex'),
    canonical: html.match(/<link rel="canonical" href="([^"]*)"/)?.[1],
  });
}

// 1. Sitemap ↔ index status, duplicate canonicals
const sitemapFile = path.join(DIST, 'sitemap-0.xml');
if (!existsSync(sitemapFile)) errors.push('sitemap-0.xml missing (production build: PUBLIC_ALLOW_INDEXING=true npm run build)');
else {
  const urls = [...(await readFile(sitemapFile, 'utf8')).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const inMap = new Set(urls);
  for (const u of urls) {
    const p = pages.get(u);
    if (!p) errors.push(`sitemap lists ${u}, which isn't built`);
    else if (!p.indexable) errors.push(`sitemap lists noindex page ${u}`);
  }
  for (const [u, p] of pages) if (p.indexable && !inMap.has(u)) errors.push(`indexable page missing from sitemap: ${u}`);
}
const byCanonical = new Map();
for (const [u, p] of pages) if (p.indexable && p.canonical) byCanonical.set(p.canonical, [...(byCanonical.get(p.canonical) ?? []), u]);
for (const [c, us] of byCanonical) if (us.length > 1) errors.push(`duplicate canonical ${c} on ${us.join(', ')}`);

// 2. Index policy
for (const [u, p] of pages) if (p.indexable && MUST_BE_NOINDEX.some((r) => r.test(u))) errors.push(`${u} is indexable but must stay noindex until the owner approves`);
for (const u of MUST_NOT_EXIST) if (pages.has(u)) errors.push(`${u} is placeholder content and must not be published`);

// 3–4. Wording and claims (visible text inside <main>)
for (const [u, p] of pages) {
  for (const [re, label] of UPGRADE_PRICE) {
    const m = p.text.match(re);
    if (m) errors.push(`${u}: ${label}: "…${ctx(p.text, m.index)}…"`);
  }
  for (const [re, label] of CLAIMS) {
    const m = p.text.match(re);
    if (m) errors.push(`${u}: ${label}: "…${ctx(p.text, m.index)}…"`);
  }
  for (const m of p.html.matchAll(/<img\b[^>]*\salt="([^"]+)"/g))
    if (/^(image|photo|picture|img|hero|banner|thumbnail|untitled)\b/i.test(m[1]) || /\.(jpe?g|png|webp|avif)$/i.test(m[1]))
      warnings.push(`${u}: generic image alt text "${m[1]}"`);
  for (const m of p.html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    if (/"@type":\s*"(AggregateRating|Review)"/.test(m[1]) || /"aggregateRating"|"review"\s*:/.test(m[1]))
      errors.push(`${u}: Review/AggregateRating structured data (only allowed for genuine first-party reviews, with owner approval)`);
  }
}

// Links from an indexable page's main content to noindex pages (nav/footer excluded): warn, so
// each one is a deliberate choice.
for (const [u, p] of pages) {
  if (!p.indexable) continue;
  const main = p.html.match(/<main[\s\S]*<\/main>/)?.[0] ?? '';
  const targets = new Set([...main.matchAll(/href="(\/[^"#?]*)"/g)].map((x) => x[1]).filter((t) => pages.get(t) && !pages.get(t).indexable && t !== u));
  if (targets.size) warnings.push(`${u} links to noindex: ${[...targets].join(', ')}`);
}

// 5–7. Trip pages
const tripPrice = new Map(); // /trips/…/ → "At a glance" price
for (const [u, p] of pages) {
  const m = u.match(/^\/trips\/(.+)-from-([a-z]+)\/$/);
  if (!m) continue;
  const city = m[2];
  const ld = [...p.html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((x) => JSON.parse(x[1]));
  const trip = ld.find((x) => x['@type'] === 'TouristTrip');
  const offers = trip?.offers ?? [];
  for (const o of offers) if (o.validThrough && o.validThrough < TODAY) errors.push(`${u}: past departure ${o.validThrough} in TouristTrip offers (rebuild needed)`);

  const glance = p.html.match(/<section id="glance"[\s\S]*?<\/section>/)?.[0] ?? '';
  const gPrice = visible(glance).match(/Price From ₹([\d,]+)/)?.[1];
  if (gPrice) tripPrice.set(u, num(gPrice));
  if (gPrice && offers.length) {
    const min = Math.min(...offers.map((o) => Number(o.price)));
    if (num(gPrice) !== min) errors.push(`${u}: "At a glance" price ₹${gPrice} ≠ cheapest offer ₹${min}`);
  }
  if (!glance) warnings.push(`${u}: no "At a glance" section`);

  const own = CITY_TERMS[city];
  for (const [other, re] of Object.entries(CITY_TERMS)) {
    if (other === city || !own) continue;
    for (const id of ['glance', 'dates', 'itinerary', 'stays']) {
      const sec = p.html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`))?.[0];
      const hit = sec && visible(sec).match(re);
      if (hit) errors.push(`${u}: "${hit[0]}" appears in the ${id} section of a ${city} page`);
    }
  }
}
// Written "from ₹X" next to a trip link (hubs, guides, destination pages) must match the live price.
for (const [u, p] of pages) {
  for (const block of p.html.matchAll(/<(li|p|tr)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    const links = [...new Set([...block[2].matchAll(/href="(\/trips\/[^"#?]+\/)"/g)].map((x) => x[1]))];
    if (links.length !== 1 || links[0] === u) continue;
    const live = tripPrice.get(links[0]);
    const written = visible(block[2]).match(/\bfrom ₹([\d,]+)/i)?.[1];
    if (live && written && num(written) !== live) errors.push(`${u}: says "from ₹${written}" for ${links[0]}, live price is ₹${live.toLocaleString('en-IN')}`);
  }
}

console.log(`Checked ${pages.size} pages (${[...pages.values()].filter((p) => p.indexable).length} indexable), ${tripPrice.size} trip prices, today ${TODAY} IST.`);
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n  ${warnings.join('\n  ')}`);
if (errors.length) {
  console.log(`\n${errors.length} error(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log('No integrity errors.');
