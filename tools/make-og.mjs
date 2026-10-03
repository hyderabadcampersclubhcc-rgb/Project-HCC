// Renders tools/og-card.html to public/og-default.png (1200×630) with headless Chrome.
//   node tools/make-og.mjs            (set CHROME_PATH if Chrome isn't in the default place)
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) throw new Error('Chrome not found: set CHROME_PATH');

const out = path.resolve('public/og-default.png');
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--virtual-time-budget=3000',
  '--window-size=1200,630',
  `--screenshot=${out}`,
  pathToFileURL(path.resolve('tools/og-card.html')).href,
]);
console.log('wrote', out);
