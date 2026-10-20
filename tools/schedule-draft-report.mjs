/**
 * Validates tools/departure-schedules-2027.draft.json and writes docs/schedule-2027-draft.md for owner review.
 *
 *   node tools/schedule-draft-report.mjs                  validate and write the report
 *   node tools/schedule-draft-report.mjs --check [file]   validate only (optionally another draft file)
 *
 * Read-only for site data: it never writes src/content/departures or tools/departure-schedules.json.
 * Checks: every date on its batch weekday; return = start + returnDays; the same return rule as the route's
 * 2026 departures; no duplicate dates; no clash with an existing departure file; trip/origin exist in trip data.
 * Lists: returns in 2028, fixed-date public holidays inside a trip, monsoon dates, Bangalore late-December dates.
 * Exits 1 if a check fails.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const checkOnly = process.argv.includes('--check');
const DRAFT = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'tools/departure-schedules-2027.draft.json';
const OUT = 'docs/schedule-2027-draft.md';
const DAYS = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const d0 = (iso) => new Date(`${iso}T00:00:00Z`);
const add = (iso, n) => new Date(d0(iso).getTime() + n * 864e5).toISOString().slice(0, 10);
const wd = (iso) => d0(iso).getUTCDay();
const fmt = (iso) => `${WD[wd(iso)]} ${Number(iso.slice(8))} ${MON[Number(iso.slice(5, 7)) - 1]}${iso.startsWith('2027') ? '' : ' ' + iso.slice(0, 4)}`;

const draft = JSON.parse(readFileSync(DRAFT, 'utf8'));
const live = JSON.parse(readFileSync('tools/departure-schedules.json', 'utf8')).schedules;
const files = readdirSync('src/content/departures');
const existing = new Set(files.map((f) => f.replace(/\.ya?ml$/, '')));

// 2026 return rule per route + weekday, read from the departure files themselves.
const rule2026 = {};
for (const f of files) {
  const t = readFileSync(`src/content/departures/${f}`, 'utf8');
  const get = (k) => t.match(new RegExp(`^${k}:\\s*(\\S+)`, 'm'))?.[1];
  const s = get('startDate'), e = get('endDate');
  const key = `${get('trip')}|${get('origin')}|${wd(s)}`;
  (rule2026[key] ??= new Set()).add((d0(e) - d0(s)) / 864e5);
}
const tripFile = (id) => {
  try { return readFileSync(`src/content/trips/${id}.md`, 'utf8'); } catch { return null; }
};
const title = (id) => (tripFile(id)?.match(/^title:\s*(.+)$/m)?.[1] ?? id).replace(/^["']|["']$/g, '');
const cityLabel = (o) => o[0].toUpperCase() + o.slice(1);

const errors = [];
const routes = draft.schedules.map((s) => {
  const out = [];
  const tf = tripFile(s.trip);
  if (!tf) errors.push(`${s.trip}: no trip file`);
  else if (!new RegExp(`- city: ${s.origin}\\b`).test(tf)) errors.push(`${s.trip}/${s.origin}: origin not in trip data`);
  for (let d = draft.from; d <= draft.to; d = add(d, 1)) {
    const b = s.batches.find((x) => DAYS[x.weekday] === wd(d));
    if (b) out.push({ start: d, end: add(d, b.returnDays), b });
  }
  const seen = new Set();
  for (const x of out) {
    if (seen.has(x.start)) errors.push(`${s.trip}/${s.origin}: duplicate ${x.start}`);
    seen.add(x.start);
    if (wd(x.start) !== DAYS[x.b.weekday]) errors.push(`${s.trip}/${s.origin}: ${x.start} is not a ${x.b.weekday}`);
    if ((d0(x.end) - d0(x.start)) / 864e5 !== x.b.returnDays || x.end <= x.start) errors.push(`${s.trip}/${s.origin}: bad return ${x.start} → ${x.end}`);
    if (existing.has(`${s.trip}-${s.origin}-${x.start}`)) errors.push(`${s.trip}/${s.origin}: ${x.start} already has a departure file`);
  }
  for (const b of s.batches) {
    const r = rule2026[`${s.trip}|${s.origin}|${DAYS[b.weekday]}`];
    if (!r) errors.push(`${s.trip}/${s.origin}: no 2026 ${b.weekday} departures to compare the return rule with`);
    else if (r.size !== 1 || !r.has(b.returnDays)) errors.push(`${s.trip}/${s.origin}: ${b.weekday} returnDays ${b.returnDays} differs from 2026 (${[...r].join('/')})`);
  }
  const liveEntries = live.filter((l) => l.trip === s.trip && l.origin === s.origin);
  if (liveEntries.length > 1) errors.push(`${s.trip}/${s.origin}: ${liveEntries.length} entries in departure-schedules.json (generator would delete dates)`);
  return { ...s, out, inLiveConfig: liveEntries.length === 1 };
});
const dupRoutes = Object.entries(routes.reduce((a, r) => ((a[`${r.trip}|${r.origin}`] = (a[`${r.trip}|${r.origin}`] ?? 0) + 1), a), {})).filter(([, n]) => n > 1);
for (const [k] of dupRoutes) errors.push(`${k}: listed twice in the draft`);

// ---------- report ----------
const L = [];
const p = (s = '') => L.push(s);
const tierName = { 'confirmed-2026': 'A', 'trip-data-weekday': 'B' };
const total = routes.reduce((n, r) => n + r.out.length, 0);
const calendar = (out, label) => {
  const days = [...new Set(out.map((x) => wd(x.start)))].sort();
  p(`| Month | ${days.map((d) => `${WD[d]} batches`).join(' | ')} | Count |`);
  p(`|---|${days.map(() => '---').join('|')}|---|`);
  for (let m = 1; m <= 12; m++) {
    const mm = String(m).padStart(2, '0');
    const inM = out.filter((x) => x.start.slice(5, 7) === mm);
    p(`| ${MON[m - 1]} | ${days.map((d) => inM.filter((x) => wd(x.start) === d).map((x) => Number(x.start.slice(8))).join(', ')).join(' | ')} | ${inM.length} |`);
  }
  p();
  const last = out.at(-1);
  p(`${label}: ${out.length} departures per route. First ${fmt(out[0].start)}; last ${fmt(last.start)}, end date ${fmt(last.end)}.`);
  p();
};
const sig = (r) => r.batches.map((b) => `${b.weekday}+${b.returnDays}`).join(',');
const groups = {};
for (const r of routes) (groups[`${r.tier}|${sig(r)}`] ??= []).push(r);

p('# HCC 2027 departure schedule: DRAFT for owner review');
p();
p('> **Not confirmed, not published, not bookable.** Generated by `node tools/schedule-draft-report.mjs` from');
p('> `tools/departure-schedules-2027.draft.json`. Nothing is written to `src/content/departures/`, and `npm run departures`');
p('> does not read the draft. Patterns, departure times and return rules are copied unchanged from the 2026 schedule');
p('> and trip data. Dates from competitors or other travel companies are not treated as HCC confirmation.');
p();
p('## Where each pattern comes from');
p();
p('- **A. Confirmed for 2026 by HCC (5 Oct 2026):** weekly batches you confirmed for Oct–Dec 2026, carried into 2027 unchanged. Still needs your confirmation for 2027.');
p('- **B. Weekday from HCC trip data:** the trip page names the weekday ("Every Thursday" / "Every Friday"), from the owner-approved working reference. Never confirmed as a weekly schedule.');
p('- **Not drafted:** routes with no weekday in HCC data whose 2026 dates came only from a competitor reference.');
p();
p('| Group | Trip | From | Batch | Departs | Back | End date rule | 2027 dates |');
p('|---|---|---|---|---|---|---|---|');
for (const r of routes)
  for (const b of r.batches)
    p(`| ${tierName[r.tier]} | ${title(r.trip)} | ${cityLabel(r.origin)} | ${WD[DAYS[b.weekday]]} | ${b.departs ?? '**not in data**'} | ${b.returns} | +${b.returnDays} days | ${r.out.filter((x) => wd(x.start) === DAYS[b.weekday]).length} |`);
p();
p(`**Total draft departures: ${total}** across ${routes.length} routes.`);
p();
p('## Draft calendars');
p();
for (const [k, rs] of Object.entries(groups)) {
  const names = rs.map((r) => `${title(r.trip)} (${cityLabel(r.origin)})`).join(', ');
  p(`### Group ${tierName[rs[0].tier]}: ${names}`);
  p();
  calendar(rs[0].out, rs.length > 1 ? 'Same calendar for each route above' : 'This route');
}
p('## Not drafted (needs your weekly rule first)');
p();
for (const n of draft.notDrafted) p(`- **${title(n.trip)} from ${cityLabel(n.origin)}:** ${n.reason}`);
p();

// ---------- validation ----------
p('## Validation');
p();
p(`- Weekday, return-date, duplicate and existing-file checks: ${errors.length ? `**${errors.length} problem(s)**` : 'passed for every draft date'}.`);
p('- Return rule: each route uses the same number of days as its 2026 departures for that weekday (checked against the files).');
p('- Trip and departure city: each route exists in the trip data.');
for (const e of errors) p(`  - ${e}`);
const y28 = routes.flatMap((r) => r.out.filter((x) => x.end >= '2028-01-01').map((x) => `${title(r.trip)} (${cityLabel(r.origin)}) ${fmt(x.start)} → ${fmt(x.end)}`));
p(`- **End dates in 2028:** ${y28.length ? y28.join('; ') : 'none'}.`);
p();

// ---------- assumptions & conflicts ----------
const fixed = [['2027-01-01', "New Year's Day"], ['2027-01-26', 'Republic Day'], ['2027-06-02', 'Telangana Formation Day'], ['2027-08-15', 'Independence Day'], ['2027-10-02', 'Gandhi Jayanti'], ['2027-12-25', 'Christmas']];
const hyd = routes.find((r) => r.trip === 'coorg-chikmagalur' && r.origin === 'hyderabad');
const monsoon = (r) => r.out.filter((x) => x.start >= '2027-06-01' && x.start <= '2027-09-30').length;
const blr = routes.filter((r) => r.origin === 'bangalore');
p('## Needs your confirmation');
p();
p('1. **2027 at all:** whether every group A and B route runs in 2027 on the same weekdays, times and return rules.');
p(`2. **Monsoon (June–September):** the draft runs every week, including ${monsoon(hyd)} Coorg (Hyderabad) dates in that window. Monsoon operation of the Gokarna beach and Dandeli river camps, Coorg, Wayanad and Lonavala is not confirmed.`);
p(`3. **Public holidays:** only fixed dates were checked (festivals that move with the lunar calendar, such as Sankranti, Ugadi, Holi, Ramzan, Dussehra and Diwali, need the official 2027 list). On the Hyderabad Thu/Fri calendar: ${fixed
  .map(([d, n]) => {
    const hits = hyd.out.filter((x) => x.start <= d && d <= x.end).map((x) => fmt(x.start));
    return `${n} (${fmt(d)})${hits.length ? `: during the ${hits.join(' and ')} batch${hits.length > 1 ? 'es' : ''}` : ': no batch on the road'}`;
  })
  .join('; ')}. No extra holiday batches or holiday prices were assumed.`);
p(`4. **Bangalore December:** 2026 Bangalore dates stopped early (Coorg 19 Dec, owner-confirmed range with no reason recorded; Gokarna and Couples 11 Dec and Munnar 18 Dec, ranges from a competitor reference). The draft keeps every December week (${blr
  .map((r) => {
    const last = files.filter((f) => f.startsWith(`${r.trip}-${r.origin}-2026-`)).map((f) => f.slice(-14, -4)).sort().at(-1);
    return `${title(r.trip)}: ${r.out.filter((x) => x.start.slice(5) > last.slice(5)).length} dates after its 2026 cut-off of ${fmt(last)}`;
  })
  .join('; ')}). Is there a year-end break?`);
p('5. **Group B routes:** Araku, Wayanad and Lonavala (Thursdays), Gokarna Couples (Hyderabad and Bangalore, Fridays), Gokarna from Vijayawada and Bangalore (Fridays) have never been confirmed as weekly schedules.');
p('6. **Missing or unconfirmed times:** Lonavala & Matheran has no departure time in the data; Gokarna from Vijayawada says 2:00 pm in the trip text but is marked NEEDS CONFIRMATION; the Bangalore Coorg return times are "Sunday (no fixed time shown)" and "Monday ~18:00".');
p('7. **Not drafted:** Munnar and Kerala from Bangalore need a weekday (or "on request") from HCC.');
p();
p('## Data notes found while checking (not changed)');
p();
p('- **What "end date" means differs by route.** Group A routes use the day the group is back (Hyderabad: Thursday batch → Monday morning; Bangalore Coorg: Friday batch → Sunday). Group B routes use the last trip day, before the overnight journey home: for example Araku ends on Sunday in the data although the group is back on Monday at 7 am. The draft keeps each route\'s 2026 rule; HCC may want one rule before 2027 goes live.');
p('- **Overlapping batches.** Each Thu/Fri (and Bangalore Fri/Sat) route has two batches on the road at the same time every week, as in 2026.');
p(`- **Applying the draft:** ${routes.filter((r) => r.inLiveConfig).length} routes already have an entry in \`tools/departure-schedules.json\` (extend its \`to\` date); ${routes.filter((r) => !r.inLiveConfig).length} routes would need a new entry. Their 2026 dates were created outside the generator, so a new entry covering only 2027 would delete their remaining 2026 files: give it a \`from\` date in 2026 that covers them. Never add a second entry for the same trip and city.`);
p();
p('## Next step');
p();
p('When HCC confirms, apply the confirmed routes to `tools/departure-schedules.json` as above, run `npm run departures -- --dry` to review, then `npm run departures`.');

if (!checkOnly) writeFileSync(OUT, L.join('\n') + '\n');
console.log(`${total} draft departures across ${routes.length} routes; ${errors.length} problem(s).${checkOnly ? '' : ` Wrote ${OUT}.`}`);
for (const e of errors) console.log('  ' + e);
process.exit(errors.length ? 1 : 0);
