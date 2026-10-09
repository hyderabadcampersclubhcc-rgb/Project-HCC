// Master trip catalog audit (local only, reads files, writes one Markdown report):
//   npm run catalog:audit   → catalog/catalog-status.md
// For every live trip × departure city it checks the master-catalog fields (catalog/README.md)
// against the trip files (src/content/trips) and departures (src/content/departures), and lists
// what HCC still has to confirm. It also checks the WhatsApp catalog intake ledger
// (catalog/whatsapp-intake.json): each entry's classification, status and missing fields, and
// suggests which existing trip it matches. Nothing is published or changed.
// Uses the `yaml` package that Astro already installs (not added to package.json on purpose:
// the deploy runs `npm ci`, which needs package.json and the lockfile to match).
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { pageStatus, isUsable } from '../catalog/verification.mjs';

const TRIPS = 'src/content/trips';
const DEPS = 'src/content/departures';
const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
const NC = 'NEEDS CONFIRMATION';

const frontmatter = (text) => YAML.parse(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
const norm = (s = '') => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();

// Departures by trip|city
const deps = new Map();
for (const f of (await readdir(DEPS)).filter((f) => f.endsWith('.yml'))) {
  const d = YAML.parse(await readFile(path.join(DEPS, f), 'utf8'));
  const key = `${d.trip}|${d.origin}`;
  deps.set(key, [...(deps.get(key) ?? []), d]);
}

// Verification ledger: which facts are confirmed by the HCC catalog / owner, and which trips are approved for Google.
const verification = existsSync('catalog/verification.json') ? JSON.parse(await readFile('catalog/verification.json', 'utf8')) : { trips: {} };

const trips = [];
for (const f of (await readdir(TRIPS)).filter((f) => f.endsWith('.md'))) {
  const id = f.replace(/\.md$/, '');
  const t = frontmatter(await readFile(path.join(TRIPS, f), 'utf8'));
  if (t.sample) continue;
  trips.push({ id, ...t });
}

const rows = [];
const confirm = []; // { trip, city, field, note }
for (const t of trips.filter((t) => t.status === 'live')) {
  t.origins.forEach((o, i) => {
    const primary = i === 0;
    const ask = (field, note) => confirm.push({ trip: t.id, city: o.city, field, note });
    const all = (deps.get(`${t.id}|${o.city}`) ?? []).filter((d) => !['cancelled', 'closed'].includes(d.status));
    const future = all.filter((d) => String(d.startDate) >= TODAY).sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)));
    const recurrence = o.recurrence ?? t.recurrence;
    const itinerary = o.itinerary ?? t.itinerary ?? [];
    const inclusions = o.inclusions ?? t.inclusions ?? [];
    const exclusions = o.exclusions ?? t.exclusions ?? [];
    const transport = (o.transport ? t.transportOptions.filter((x) => o.transport.includes(x.id)) : t.transportOptions).filter((x) => !x.priceDelta);
    const incText = inclusions.map((x) => x.text).join(' ') + ' ' + exclusions.join(' ');
    const meals = itinerary.some((d) => d.meals?.length) || /breakfast|lunch|dinner|meal|food/i.test(incText);
    const captain = /trip captain|coordinator|trip leader/i.test(incText);
    // A photo with a third-party credit is stock (Wikimedia etc.); credit.ai = labelled AI illustration; no credit = HCC's own.
    const credits = [...(t.heroImage ? [t.heroCredit] : []), ...(t.gallery ?? []).map((g) => g.credit)];
    const aiPhotos = credits.filter((c) => c?.ai || /ai-generated/i.test(c?.license ?? '')).length;
    const stockPhotos = credits.filter((c) => c && !(c.ai || /ai-generated/i.test(c.license ?? ''))).length;
    const ownPhotos = credits.length - aiPhotos - stockPhotos;
    if (!ownPhotos) ask('Photos', 'no HCC trip photos yet (' + [stockPhotos && stockPhotos + ' stock', aiPhotos && aiPhotos + ' AI'].filter(Boolean).join(', ') + ')');

    // Fields copied from the trip level onto a second city may describe the first city's journey.
    if (!primary && !o.recurrence && t.recurrence) ask('Departure days', `uses the trip-level "${t.recurrence}"; confirm it applies from ${o.label}`);
    if (!primary && !o.itinerary && itinerary.length) ask('Itinerary', `uses the ${t.origins[0].label} itinerary; confirm or add a ${o.label} itinerary`);
    if (!primary && !o.inclusions && inclusions.length) ask('Inclusions', `uses the ${t.origins[0].label} inclusions; confirm for ${o.label}`);
    if (!o.pickupPoints?.length) ask('Departure point & time', 'no pickup point');
    if (!o.return && !o.travelWindow) ask('Return time', 'not stated');
    if (!future.length) ask('Departure dates', recurrence ? `no dated departures (recurrence text: "${recurrence}")` : 'no dated departures and no recurrence');
    else if (String(future.at(-1).startDate) < '2027-01-01') ask('Departure dates', `dated departures end on ${future.at(-1).startDate}; schedule for 2027 needed`);
    if (t.originalPrice || o.originalPrice) ask('Reference price', `crossed-out price ₹${o.originalPrice ?? t.originalPrice} is shown; confirm it is a genuine previous price`);
    if (!t.advanceAmount) ask('Booking / advance', 'no advance amount');
    if (!t.cancellationPolicy) ask('Cancellation', 'no trip-specific summary (site-wide policy applies)');
    if (!captain) ask('Trip coordinator', 'inclusions do not mention a trip captain/coordinator');
    if (!meals) ask('Food', 'meals not stated in itinerary or inclusions');
    if (!t.stays?.length) ask('Accommodation', 'no stay type');
    if (!t.suitableFor?.length) ask('Suitable for', 'not stated');
    if (!t.groupSize) ask('Group size', 'not stated');
    for (const n of o.incomplete ?? []) ask('Open item', n);

    const vf = verification.trips[t.id]?.cities?.[o.city]?.fields ?? {};
    const vTotal = Object.keys(vf).length;
    const vOk = Object.values(vf).filter((v) => isUsable(v)).length;
    const status = verification.approvalProcess ? pageStatus(verification, t.id, o.city) : { approved: false, conflicts: [], flagged: [], indexable: false };
    const approved = status.approved;
    rows.push({
      trip: t.id,
      verified: vTotal ? `${vOk}/${vTotal}` : 'no ledger',
      approved,
      indexableGate: status.indexable,
      conflicts: status.conflicts,
      flagged: status.flagged,
      title: t.title,
      city: o.label,
      indexable: o.indexable !== false,
      price: o.basePrice ?? t.basePrice,
      refPrice: o.originalPrice ?? t.originalPrice ?? '',
      duration: `${t.durationNights}N/${t.durationDays}D`,
      recurrence: recurrence ?? NC,
      dates: future.length ? `${future.length} (${future[0].startDate} → ${future.at(-1).startDate})` : 'none',
      times: o.travelWindow ?? ([o.pickupPoints?.[0]?.time, o.return ? 'return stated' : ''].filter(Boolean).join(' / ') || NC),
      transport: transport.map((x) => x.label).join(' or ') || NC,
      stay: t.stays?.map((s) => s.type).join('; ') || NC,
      itinerary: itinerary.length ? `${itinerary.length} days${!primary && !o.itinerary ? ' (shared)' : ''}` : NC,
      incExc: `${inclusions.length}/${exclusions.length}`,
      food: meals ? 'stated' : NC,
      advance: t.advanceAmount ? `₹${t.advanceAmount}` : NC,
      cancel: t.cancellationPolicy ? 'trip' : 'site',
      captain: captain ? 'yes' : NC,
      photos: [ownPhotos && ownPhotos + ' HCC', stockPhotos && stockPhotos + ' stock', aiPhotos && aiPhotos + ' AI'].filter(Boolean).join(', ') || 'none',
      faqs: t.faqs?.length ?? 0,
      seo: t.seo?.title ? 'custom' : 'auto',
    });
  });
}

// Duplicate trips (same normalised title + city)
const seen = new Map();
const dupes = [];
for (const r of rows) {
  const k = `${norm(r.title)}|${r.city}`;
  if (seen.has(k)) dupes.push(`${r.trip} and ${seen.get(k)} (${r.title}, ${r.city})`);
  seen.set(k, r.trip);
}

// WhatsApp catalog intake ledger
const ledgerFile = 'catalog/whatsapp-intake.json';
const ledger = existsSync(ledgerFile) ? JSON.parse(await readFile(ledgerFile, 'utf8')) : { entries: [] };
const CLASSES = ['NEW_TRIP', 'EXISTING_NO_CHANGE', 'EXISTING_UPDATE_NEEDED', 'DUPLICATE', 'CONFLICT'];
const intake = ledger.entries.map((e) => {
  const issues = [];
  if (!CLASSES.includes(e.classification)) issues.push(`classification must be one of ${CLASSES.join(', ')}`);
  if (e.status !== 'PENDING_APPROVAL' && e.status !== 'APPROVED' && e.status !== 'REJECTED') issues.push('status must be PENDING_APPROVAL, APPROVED or REJECTED');
  if (e.source !== 'WhatsApp Business Catalog') issues.push('source must be "WhatsApp Business Catalog"');
  const missing = Object.entries(e.fields ?? {}).filter(([, v]) => v === NC).map(([k]) => k);
  const words = new Set(norm(e.name).split(' ').filter((w) => w.length > 3));
  const matches = trips
    .map((t) => ({ id: t.id, score: norm(t.title).split(' ').filter((w) => words.has(w)).length }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((m) => m.id);
  return { ...e, issues, missing, matches };
});

const esc = (s) => String(s).replace(/\|/g, '/');
const md = `# HCC master trip catalog: status

_Generated ${TODAY} by \`npm run catalog:audit\` from src/content/trips and src/content/departures. Do not edit by hand._
_Field definitions and the intake workflow: catalog/README.md._

## Data status

Sources: owner confirmation, the HCC WhatsApp Business Catalog, and the weekendyaari.in import, which the owner approved on 9 Oct 2026 as HCC's working reference data. Only a specific missing fact is flagged (NEEDS CONFIRMATION); it does not block the trip. A page is blocked only by a CONFLICT in an essential fact, or if the owner hasn't approved it. Code: catalog/verification.mjs. Destination, hub and other pages keep their own indexing rules.

- Trip/city pages indexable in production: **${rows.filter((r) => r.indexableGate).length} of ${rows.length}** (approved: ${rows.filter((r) => r.approved).length}; blocked by a conflict: ${rows.filter((r) => r.conflicts.length).length})
- Usable facts (owner confirmed, catalog-verified or working reference): **${rows.reduce((a, r) => a + Number(String(r.verified).split('/')[0] || 0), 0)} of ${rows.reduce((a, r) => a + Number(String(r.verified).split('/')[1] || 0), 0)}**. Owner-confirmed: ${Object.values(verification.trips).flatMap((t) => Object.values(t.cities ?? {}).flatMap((c) => Object.values(c.fields ?? {}))).filter((v) => /^OWNER CONFIRMED/.test(v)).length}
- Rule: ${verification.approvalProcess?.rule ?? ''}

### Flagged facts per page (missing; not blocking)

| Page | Flagged | Conflicts |
|---|---|---|
${rows.filter((r) => r.flagged.length || r.conflicts.length).map((r) => `| ${r.trip} (${r.city}) | ${r.flagged.join(', ') || '—'} | ${r.conflicts.join(', ') || '—'} |`).join('\n')}

## Live trips × departure cities (${rows.length})

| Trip | City | Usable facts | Indexable | Price | Ref. price | Duration | Departure days | Dated departures (future) | Times | Transport (included) | Stay | Itinerary | Incl/Excl | Food | Advance | Cancel | Coordinator | Photos | FAQs | SEO |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
${rows.map((r) => `| ${r.trip} | ${r.city}${r.indexable ? '' : ' (no page)'} | ${r.verified} | ${r.indexableGate ? '✅' : r.conflicts.length ? 'blocked (conflict)' : '—'} | ₹${r.price} | ${r.refPrice ? '₹' + r.refPrice : ''} | ${r.duration} | ${esc(r.recurrence)} | ${r.dates} | ${esc(r.times)} | ${esc(r.transport)} | ${esc(r.stay)} | ${r.itinerary} | ${r.incExc} | ${r.food} | ${r.advance} | ${r.cancel} | ${r.captain} | ${r.photos} | ${r.faqs} | ${r.seo} |`).join('\n')}

Photos: "HCC" = HCC's own photos (no third-party credit); "stock" = licensed Wikimedia/stock photos; "AI" = labelled AI illustrations.

## ${NC} (${confirm.length})

${Object.entries(Object.groupBy(confirm, (c) => c.field))
  .sort((a, b) => b[1].length - a[1].length)
  .map(([field, items]) => `### ${field} (${items.length})\n\n${items.map((c) => `- **${c.trip}** (${c.city}): ${c.note}`).join('\n')}`)
  .join('\n\n')}

## Duplicate trips

${dupes.length ? dupes.map((d) => `- ${d}`).join('\n') : 'None (no two live trips share a title and departure city).'}

## WhatsApp Business Catalog intake (${intake.length})

${
  intake.length
    ? intake
        .map(
          (e) => `### ${e.id}: ${e.name}
- Classification: **${e.classification}** · Status: **${e.status}** · Received: ${e.received ?? NC}
- Possible existing matches: ${e.matches.join(', ') || 'none'}${e.existingTrip ? ` · Linked trip: ${e.existingTrip}` : ''}
- ${NC}: ${e.missing.join(', ') || 'nothing'}
${e.conflicts?.length ? `- Conflicts: ${e.conflicts.join('; ')}\n` : ''}${e.issues.length ? `- ⚠ Ledger issues: ${e.issues.join('; ')}\n` : ''}`,
        )
        .join('\n')
    : '_No catalog trips received yet._'
}
`;

await writeFile('catalog/catalog-status.md', md);
console.log(`${rows.length} trip/city rows, ${confirm.length} items need confirmation, ${dupes.length} duplicates, ${intake.length} intake entries.`);
console.log('Wrote catalog/catalog-status.md');
const ledgerIssues = intake.filter((e) => e.issues.length);
if (ledgerIssues.length) {
  console.log(`${ledgerIssues.length} intake entries have ledger issues.`);
  process.exit(1);
}
