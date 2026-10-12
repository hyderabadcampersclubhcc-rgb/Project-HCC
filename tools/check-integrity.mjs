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
import { pageStatus } from '../catalog/verification.mjs';

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

// 1b. Legacy 301 redirects (old WordPress URLs → new pages, from dist/.htaccess): every target must be
// a built page, no target may itself be redirected (chains), and noindex targets are flagged.
const htaccess = path.join(DIST, '.htaccess');
if (existsSync(htaccess)) {
  const rules = [...(await readFile(htaccess, 'utf8')).matchAll(/^RewriteRule \^(.+?)\/\?\$ (\/[^\s]*) \[R=301,L\]/gm)].map((m) => ({ from: `/${m[1]}/`, to: m[2] }));
  const sources = new Set(rules.map((r) => r.from));
  for (const r of rules) {
    const target = r.to.split(/[?#]/)[0];
    if (sources.has(target)) errors.push(`redirect chain: ${r.from} → ${r.to}, which redirects again`);
    else if (!pages.has(target)) errors.push(`redirect ${r.from} → ${r.to}: target page isn't built`);
    else if (!pages.get(target).indexable) warnings.push(`redirect ${r.from} → ${r.to}: target is noindex`);
  }
  if (!rules.length) warnings.push('no legacy 301 rules found in .htaccess');
}

// 2. Index policy
for (const [u, p] of pages) if (p.indexable && MUST_BE_NOINDEX.some((r) => r.test(u))) errors.push(`${u} is indexable but must stay noindex until the owner approves`);
for (const u of MUST_NOT_EXIST) if (pages.has(u)) errors.push(`${u} is placeholder content and must not be published`);
// Trip pages may be indexed only when the owner approved the page and no essential fact is in
// CONFLICT (catalog/verification.json, rule in catalog/verification.mjs). Missing facts are flagged, not blocking.
const verification = JSON.parse(await readFile('catalog/verification.json', 'utf8'));
for (const [tripId, t] of Object.entries(verification.trips))
  for (const city of t.publishApproved ?? []) {
    const s = pageStatus(verification, tripId, city);
    if (s.conflicts.length) errors.push(`/trips/${tripId}-from-${city}/ is approved but has conflicting essential facts: ${s.conflicts.join(', ')}`);
  }
// Draft records awaiting approval (e.g. campsites drafted from competitor references) must never be live pages.
for (const [tripId, t] of Object.entries(verification.trips))
  if (t.status === 'PENDING_APPROVAL' && [...pages.keys()].some((u) => u.startsWith(`/trips/${tripId}-from-`)))
    errors.push(`/trips/${tripId}-from-…/ is built as a live trip page but its record is PENDING_APPROVAL (set status: draft until the owner approves)`);
for (const [u, p] of pages) {
  const m = u.match(/^\/trips\/(.+)-from-([a-z]+)\/$/);
  if (m && p.indexable && !pageStatus(verification, m[1], m[2]).indexable)
    errors.push(`${u} is indexable but not owner-approved, or has a conflicting essential fact (catalog/verification.json)`);
}

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
// 7b. Reach-it-yourself camps (At a glance → Transport: "…yourself" / "on your own") have no HCC group
// journey: their visible text and FAQ structured data must not suggest a group meeting or pickup.
const GROUP_WORDING = /\b(the group meets|meets? the group|join(s|ing)? the group|travel(s|ling)? with the group|group (journey|departure|travel)|group trip from|pick-?up points? in)\b/i;
for (const [u, p] of pages) {
  if (!/^\/trips\/.+-from-[a-z]+\/$/.test(u)) continue;
  const glance = visible(p.html.match(/<section id="glance"[\s\S]*?<\/section>/)?.[0] ?? '');
  if (!/Transport (Reach the campsite yourself|[^|]*on your own)/i.test(glance)) continue;
  const ld = [...p.html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join(' ');
  for (const [where, text] of [['page text', p.text], ['structured data', ld]]) {
    const m = text.match(GROUP_WORDING);
    if (m) errors.push(`${u}: reach-it-yourself camp, but the ${where} implies a group journey: "…${ctx(text, m.index)}…"`);
  }
}

// 8. Structured data each page type must carry (indexable pages), and FAQPage must match visible Q&As.
const ldTypes = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap((m) => {
    try {
      return [JSON.parse(m[1])].flat();
    } catch {
      return [];
    }
  });
for (const [u, p] of pages) {
  if (!p.indexable) continue;
  const nodes = ldTypes(p.html);
  const types = new Set(nodes.map((n) => n['@type']));
  const need = [];
  if (u === '/') need.push('Organization', 'WebSite');
  else need.push('BreadcrumbList');
  if (/^\/trips\/.+-from-[a-z]+\/$/.test(u)) need.push('TouristTrip', 'Organization');
  if (/^\/destinations\/[^/]+\/$/.test(u)) need.push('TouristDestination');
  if (['/trips/', '/weekend-trips-from-hyderabad/', '/camping-near-hyderabad/'].includes(u)) need.push('ItemList');
  if (/<section id="faqs"|id="dest-faq"|id="cat-faq"/.test(p.html)) need.push('FAQPage');
  for (const t of need) if (!types.has(t)) errors.push(`${u}: missing ${t} structured data`);
  for (const faq of nodes.filter((n) => n['@type'] === 'FAQPage'))
    for (const q of faq.mainEntity ?? []) {
      const name = decode(q.name).replace(/\s+/g, ' ').trim();
      if (!p.text.includes(name)) errors.push(`${u}: FAQPage question not visible on the page: "${name.slice(0, 70)}"`);
    }
}

// 9. Duplicate trip pages (two URLs with the same H1)
const byH1 = new Map();
for (const [u, p] of pages) {
  if (!u.startsWith('/trips/') || !p.indexable) continue;
  const h1 = visible(p.html.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? '').trim();
  if (h1) byH1.set(h1, [...(byH1.get(h1) ?? []), u]);
}
for (const [h, us] of byH1) if (us.length > 1) errors.push(`duplicate trip pages "${h}": ${us.join(', ')}`);

// 10. Dates are the same everywhere: every dated link (?d=YYYY-MM-DD) on any page must be a
// future departure listed on that trip page's Dates section.
const tripDates = new Map();
for (const [u, p] of pages) {
  if (!/^\/trips\/.+-from-[a-z]+\/$/.test(u)) continue;
  const sec = p.html.match(/<section id="dates"[\s\S]*?<\/section>/)?.[0] ?? '';
  tripDates.set(u, new Set([...sec.matchAll(/data-dep-start="(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1])));
}
const dateIssues = new Set();
for (const [u, p] of pages) {
  for (const m of p.html.matchAll(/href="(\/trips\/[^"?#]+\/)\?d=(\d{4}-\d{2}-\d{2})"/g)) {
    const [, trip, date] = m;
    if (date < TODAY) dateIssues.add(`${u}: links a past departure ${date} for ${trip} (rebuild needed)`);
    else if (tripDates.has(trip) && !tripDates.get(trip).has(date)) dateIssues.add(`${u}: links ${trip} on ${date}, which isn't in that trip's dates`);
  }
}
errors.push(...dateIssues);

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
