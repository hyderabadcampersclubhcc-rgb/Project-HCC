// Internal link checker for the built site (run after `npm run build`):
//   node tools/check-links.mjs
// Every internal href/src in dist/**/*.html must resolve to a built file, a directory with
// index.html, an .htaccess redirect, or a PHP API route. Exits 1 if anything is broken.
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const API = new Set(['/api/intents', '/api/intents/', '/api/decap-auth', '/api/decap-auth/']);

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const exists = async (p) => stat(p).then(() => true).catch(() => false);

const htaccess = await readFile(path.join(DIST, '.htaccess'), 'utf8').catch(() => '');
const redirects = [...htaccess.matchAll(/^RewriteRule \^(.+?)\/\?\$ (\S+) \[R=301/gm)].map((m) => ({ re: new RegExp(`^/${m[1]}/?$`), to: m[2] }));

async function resolves(url) {
  if (API.has(url)) return true;
  if (redirects.some((r) => r.re.test(url))) return true;
  const rel = decodeURIComponent(url);
  const file = path.join(DIST, rel);
  if (rel.endsWith('/')) return exists(path.join(file, 'index.html'));
  return (await exists(file)) || exists(path.join(file, 'index.html'));
}

const pages = await walk(DIST);
const broken = new Map();
let checked = 0;
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    let url = m[1].replace(/&amp;/g, '&');
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    url = url.split('#')[0].split('?')[0];
    if (!url) continue;
    checked++;
    if (!(await resolves(url))) {
      const from = '/' + path.relative(DIST, page).replace(/\\/g, '/').replace(/index\.html$/, '');
      if (!broken.has(url)) broken.set(url, new Set());
      broken.get(url).add(from);
    }
  }
}

console.log(`Checked ${checked} internal links across ${pages.length} pages.`);
if (broken.size) {
  console.log(`\n${broken.size} broken link target(s):`);
  for (const [url, from] of broken) console.log(`  ${url}\n      from: ${[...from].slice(0, 5).join(', ')}${from.size > 5 ? ` (+${from.size - 5} more)` : ''}`);
  process.exit(1);
}
console.log('No broken internal links.');
