// On-page SEO checks for the built site (run after `npm run build`):
//   node tools/check-seo.mjs
// Indexable pages (no robots noindex) must have: one <h1>, a unique 30–65 char <title>,
// a unique 70–165 char meta description, a self-referencing absolute canonical, og:title/
// og:image, valid JSON-LD, and alt on every <img>. Noindex pages only get the JSON-LD/alt
// checks. Exits 1 on errors; warnings are printed but don't fail.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const decode = (s = '') => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const errors = [];
const warnings = [];
const titles = new Map();
const descs = new Map();
let indexable = 0;

for (const file of await walk(DIST)) {
  const url = '/' + path.relative(DIST, path.dirname(file)).replace(/\\/g, '/') + '/';
  const page = url === '//' ? '/' : url;
  const html = await readFile(file, 'utf8');
  const err = (m) => errors.push(`${page}: ${m}`);
  const warn = (m) => warnings.push(`${page}: ${m}`);

  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      for (const node of [data].flat()) if (!node['@context'] || !node['@type']) err('JSON-LD block without @context/@type');
    } catch (e) {
      err(`invalid JSON-LD (${e.message})`);
    }
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (attr(m[0], 'alt') === undefined) err(`<img> without alt: ${m[0].slice(0, 90)}`);

  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';
  if (robots.includes('noindex')) continue;
  indexable++;

  const h1s = html.match(/<h1\b/g)?.length ?? 0;
  if (h1s !== 1) err(`${h1s} <h1> elements`);

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1]);
  if (!title) err('missing <title>');
  else {
    if (title.length < 30 || title.length > 65) warn(`title is ${title.length} chars: "${title}"`);
    titles.set(title, [...(titles.get(title) ?? []), page]);
  }

  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1]);
  if (!desc) err('missing meta description');
  else {
    if (desc.length < 70 || desc.length > 165) warn(`description is ${desc.length} chars`);
    descs.set(desc, [...(descs.get(desc) ?? []), page]);
  }

  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (!canonical) err('missing canonical');
  else if (new URL(canonical).pathname !== page) err(`canonical points elsewhere: ${canonical}`);

  if (!/<meta property="og:title"/.test(html)) err('missing og:title');
  if (!/<meta property="og:image"/.test(html)) warn('missing og:image');
}

for (const [t, pages] of titles) if (pages.length > 1) errors.push(`duplicate title "${t}" on ${pages.join(', ')}`);
for (const [d, pages] of descs) if (pages.length > 1) errors.push(`duplicate description on ${pages.join(', ')}: "${d.slice(0, 60)}…"`);

console.log(`Checked ${indexable} indexable pages.`);
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n  ${warnings.join('\n  ')}`);
if (errors.length) {
  console.log(`\n${errors.length} error(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log('No SEO errors.');
