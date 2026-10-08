// Weekly / monthly SEO report draft (local only: writes a Markdown file, sends nothing anywhere).
//   npm run seo:report            → seo/reports/YYYY-MM-DD.md
// Run after a production-mode build (PUBLIC_ALLOW_INDEXING=true npm run build). It:
//   - runs check-seo, check-links and check-integrity and summarises them;
//   - lists the site inventory (indexable / noindex / sitemap);
//   - checks every keyword-universe row's page still exists with the expected index status;
//   - reads the latest Search Console export in seo/data/gsc/YYYY-MM-DD/ (Queries.csv,
//     Pages.csv), if one exists, for position 4–10 and high-impression / low-CTR queries;
//   - pulls this month's and next month's rows from seo/content-calendar.md;
//   - drafts THIS WEEK / WAIT / DO NOT DO for a human to edit. It never publishes or deploys.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
const DIST = path.resolve('dist');

function run(script) {
  const r = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  const out = (r.stdout + r.stderr).trim();
  const errs = out.match(/^\s{2}.+$/gm) ?? [];
  return { ok: r.status === 0, summary: out.split('\n')[0], issues: r.status === 0 ? [] : errs.map((e) => e.trim()) };
}

// CSV with quoted fields (Search Console exports).
function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') (cell += '"'), i++;
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') row.push(cell), (cell = '');
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell), rows.push(row), (row = []), (cell = '');
    } else cell += c;
  }
  if (cell || row.length) row.push(cell), rows.push(row);
  const [head, ...body] = rows.filter((r) => r.some(Boolean));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), r[i]])));
}
const n = (v) => Number(String(v ?? '').replace(/[%,]/g, '')) || 0;

async function builtPages() {
  const pages = new Map();
  async function walk(dir) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.name === 'index.html') {
        const rel = path.relative(DIST, dir).replace(/\\/g, '/');
        const html = await readFile(p, 'utf8');
        pages.set(rel ? `/${rel}/` : '/', !/<meta name="robots" content="[^"]*noindex/.test(html));
      }
    }
  }
  await walk(DIST);
  return pages;
}

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run: PUBLIC_ALLOW_INDEXING=true npm run build');
  process.exit(1);
}

const checks = { seo: run('tools/check-seo.mjs'), links: run('tools/check-links.mjs'), integrity: run('tools/check-integrity.mjs') };
const pages = await builtPages();
const indexable = [...pages].filter(([, i]) => i).map(([u]) => u);
const noindex = [...pages].filter(([u, i]) => !i && !u.startsWith('/admin/') && u !== '/404/').map(([u]) => u);

// Keyword universe ↔ site
const ku = JSON.parse(await readFile('seo/keyword-universe.json', 'utf8'));
const kwIssues = [];
for (const k of ku.keywords) {
  if (!k.hccPage) continue;
  const p = k.hccPage.replace(/^https?:\/\/[^/]+/, '');
  if (!pages.has(p)) kwIssues.push(`${k.id} "${k.keyword}": page ${p} not built`);
  else if (k.status === 'owned' && !pages.get(p)) kwIssues.push(`${k.id} "${k.keyword}": status is owned but ${p} is noindex`);
  else if (k.status === 'draft-noindex' && pages.get(p)) kwIssues.push(`${k.id} "${k.keyword}": ${p} is now indexable; update status`);
}
const p0 = ku.keywords.filter((k) => k.priority === 'P0');

// Search Console export (optional)
let gsc = null;
const gscRoot = 'seo/data/gsc';
if (existsSync(gscRoot)) {
  const dirs = (await readdir(gscRoot)).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  const latest = dirs.at(-1);
  const qFile = latest && path.join(gscRoot, latest, 'Queries.csv');
  if (qFile && existsSync(qFile)) {
    const rows = parseCsv(await readFile(qFile, 'utf8')).map((r) => ({
      query: r['Top queries'] ?? r.Query ?? Object.values(r)[0],
      clicks: n(r.Clicks),
      impressions: n(r.Impressions),
      ctr: n(r.CTR),
      position: n(r.Position),
    }));
    const pFile = path.join(gscRoot, latest, 'Pages.csv');
    const pageRows = existsSync(pFile)
      ? parseCsv(await readFile(pFile, 'utf8')).map((r) => ({ page: r['Top pages'] ?? Object.values(r)[0], clicks: n(r.Clicks), impressions: n(r.Impressions), ctr: n(r.CTR), position: n(r.Position) }))
      : [];
    const known = new Set(ku.keywords.map((k) => k.keyword.toLowerCase()));
    gsc = {
      latest,
      totals: rows.reduce((a, r) => ({ clicks: a.clicks + r.clicks, impressions: a.impressions + r.impressions }), { clicks: 0, impressions: 0 }),
      near: rows.filter((r) => r.position >= 4 && r.position <= 10 && r.impressions >= 20).sort((a, b) => b.impressions - a.impressions).slice(0, 15),
      lowCtr: rows.filter((r) => r.impressions >= 100 && r.ctr < 1.5).sort((a, b) => b.impressions - a.impressions).slice(0, 10),
      newQueries: rows.filter((r) => !known.has(String(r.query).toLowerCase()) && r.impressions >= 20).sort((a, b) => b.impressions - a.impressions).slice(0, 15),
      commercial: rows.filter((r) => /\b(trip|package|tour|cost|price|from hyderabad|booking|camp)/i.test(r.query)).sort((a, b) => b.impressions - a.impressions).slice(0, 15),
      topPages: pageRows.sort((a, b) => b.impressions - a.impressions).slice(0, 15),
    };
  }
}

// Content calendar: this month and next
const cal = await readFile('seo/content-calendar.md', 'utf8');
const mon = (d) => d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
const now = new Date();
const months = [mon(now), mon(new Date(now.getFullYear(), now.getMonth() + 1, 15))];
const calRows = cal.split('\n').filter((l) => months.some((m) => l.startsWith(`| ${m} |`)));

// Draft priorities
const thisWeek = [];
for (const [name, c] of Object.entries(checks)) if (!c.ok) thisWeek.push(`Fix ${c.issues.length} ${name} error(s) (see Health).`);
if (kwIssues.length) thisWeek.push(`Resolve ${kwIssues.length} keyword/page mismatch(es) (see Keyword universe).`);
if (gsc?.near.length) thisWeek.push(`Improve the page for "${gsc.near[0].query}" (position ${gsc.near[0].position.toFixed(1)}, ${gsc.near[0].impressions} impressions).`);
for (const r of calRows.filter((r) => !/\|\s*(done|published)[^|]*\|\s*$/.test(r))) thisWeek.push(`Calendar: ${r.split('|')[2].trim()}`);
const tbl = (rows, cols) =>
  rows.length ? [`| ${cols.join(' | ')} |`, `|${cols.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${cols.map((c) => r[c.toLowerCase()] ?? '').join(' | ')} |`)].join('\n') : '_None._';

const md = `# HCC SEO report: ${today}

_Generated by \`npm run seo:report\`. A draft for a human to edit: nothing here was published, sent or deployed._
_Search Console: ${gsc ? `export from ${gsc.latest}` : '**NOT CONNECTED** (no export in seo/data/gsc/). No rankings, clicks or volumes are stated.'}_

## THIS WEEK (draft: pick the top 3)

${thisWeek.length ? thisWeek.slice(0, 6).map((t, i) => `${i + 1}. ${t}`).join('\n') : '1. No errors or due calendar items. Review P0 pages (below) for improvements.'}

**WAIT:** P2/P3 keywords; Bangalore work (on hold); new articles not in the calendar.

**DO NOT DO:** duplicate or keyword-variant pages; content about upgrade prices; indexing guides without owner review; unverified claims, reviews or numbers.

## Health

| Check | Result |
|---|---|
| On-page SEO (check-seo) | ${checks.seo.ok ? '✅' : '❌'} ${checks.seo.summary} |
| Internal links (check-links) | ${checks.links.ok ? '✅' : '❌'} ${checks.links.summary} |
| Integrity: sitemap, index policy, single price, claims, past dates, city & price consistency | ${checks.integrity.ok ? '✅' : '❌'} ${checks.integrity.summary} |

${[...checks.seo.issues, ...checks.links.issues, ...checks.integrity.issues].map((e) => `- ${e}`).join('\n')}

## Inventory

- Indexable pages: **${indexable.length}**
- Noindex pages: **${noindex.length}**: ${noindex.filter((u) => !u.startsWith('/preview/')).join(', ')}

## Keyword universe

${kwIssues.length ? kwIssues.map((k) => `- ${k}`).join('\n') : 'All mapped pages exist with the expected index status.'}

P0 keywords and their pages:

${p0.map((k) => `- ${k.id} **${k.keyword}** → ${k.hccPage ?? '(no page)'}${k.hccPage ? (pages.get(k.hccPage) ? ' ✅ indexable' : ' 🔒 noindex') : ''}`).join('\n')}

## Search Console

${
  gsc
    ? `Totals (export period): ${gsc.totals.clicks} clicks, ${gsc.totals.impressions} impressions.

### Closest to the top 3 (position 4–10)
${tbl(gsc.near.map((r) => ({ ...r, position: r.position.toFixed(1) })), ['Query', 'Impressions', 'Clicks', 'Position'])}

### High impressions, low CTR
${tbl(gsc.lowCtr, ['Query', 'Impressions', 'CTR', 'Position'])}

### Commercial queries
${tbl(gsc.commercial, ['Query', 'Impressions', 'Clicks', 'Position'])}

### New queries (not in keyword-universe.json)
${tbl(gsc.newQueries, ['Query', 'Impressions', 'Position'])}

### Top pages
${tbl(gsc.topPages, ['Page', 'Impressions', 'Clicks', 'Position'])}`
    : 'Not connected. To add data: export Performance → Search results (last 28 days) as CSV and save Queries.csv and Pages.csv in seo/data/gsc/YYYY-MM-DD/. See seo/README.md §4.'
}

## Content calendar (${months.join(', ')})

${calRows.length ? calRows.map((r) => `- ${r.split('|').slice(2, 4).map((s) => s.trim()).join(' · ')} · status: ${r.split('|').at(-2).trim()}`).join('\n') : '_Nothing scheduled._'}

## Monthly questions

For the monthly review, copy the 15 questions and the TOP 10 ACTIONS from \`seo/monthly-report-template.md\`.
`;

await mkdir('seo/reports', { recursive: true });
const out = `seo/reports/${today}.md`;
await writeFile(out, md);
console.log(`Wrote ${out}`);
