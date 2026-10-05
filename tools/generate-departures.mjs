/**
 * Regenerates weekly departures from tools/departure-schedules.json.
 *
 *   npm run departures            write the files
 *   npm run departures -- --dry   only print what would change
 *
 * For each schedule (trip + origin), every date in [from, to] that falls on a batch weekday
 * gets src/content/departures/{trip}-{origin}-{date}.yml with endDate = start + returnDays.
 * An existing file for the same date keeps its other fields (status, seats, price, note);
 * only startDate/endDate are rewritten. Files for that trip + origin whose date is no longer
 * in the schedule are removed. Other trips and other origins are never touched.
 */
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/content/departures';
const DAYS = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const dry = process.argv.includes('--dry');
const { schedules } = JSON.parse(readFileSync('tools/departure-schedules.json', 'utf8'));

const addDays = (iso, n) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const weekday = (iso) => new Date(`${iso}T00:00:00Z`).getUTCDay();

let written = 0;
let removed = 0;
for (const s of schedules) {
  const prefix = `${s.trip}-${s.origin}-`;
  const want = new Map(); // start → end
  for (let d = s.from; d <= s.to; d = addDays(d, 1)) {
    const batch = s.batches.find((b) => DAYS[b.weekday] === weekday(d));
    if (batch) want.set(d, addDays(d, batch.returnDays));
  }

  for (const f of readdirSync(DIR)) {
    const m = f.startsWith(prefix) && f.slice(prefix.length).match(/^(\d{4}-\d{2}-\d{2})\.ya?ml$/);
    if (m && !want.has(m[1])) {
      console.log(`remove  ${f}`);
      if (!dry) unlinkSync(join(DIR, f));
      removed++;
    }
  }

  for (const [start, end] of want) {
    const file = join(DIR, `${prefix}${start}.yml`);
    let body = `trip: ${s.trip}\norigin: ${s.origin}\nstartDate: ${start}\nendDate: ${end}\nstatus: open\n`;
    if (existsSync(file)) {
      const old = readFileSync(file, 'utf8');
      body = old.replace(/^startDate:.*$/m, `startDate: ${start}`).replace(/^endDate:.*$/m, `endDate: ${end}`);
      if (body === old) continue;
    }
    console.log(`write   ${prefix}${start}.yml  (${start} → ${end})`);
    if (!dry) writeFileSync(file, body);
    written++;
  }
}
console.log(`${dry ? '[dry run] ' : ''}${written} written, ${removed} removed`);
