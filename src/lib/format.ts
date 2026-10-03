/** Formatting helpers. All dates are ISO "YYYY-MM-DD" strings (calendar dates, no time zone). */

const inrFmt = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** ₹6,999 */
export const inr = (n: number) => `₹${inrFmt.format(n)}`;

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-IN', { timeZone: 'UTC', ...opts });
const fDay = fmt({ weekday: 'short' });
const fMon = fmt({ month: 'short' });
const fMonthLong = fmt({ month: 'long', year: 'numeric' });

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

/** Date → "YYYY-MM-DD" (uses the UTC calendar date, matching how YAML dates are parsed). */
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Today's calendar date in India. */
export const todayIST = (now = new Date()) => now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

export const dayShort = (iso: string) => fDay.format(toDate(iso)); // "Fri"
export const dayNum = (iso: string) => iso.slice(8, 10); // "09"
export const monShort = (iso: string) => fMon.format(toDate(iso)); // "Oct"
export const monthLong = (ym: string) => fMonthLong.format(toDate(`${ym}-01`)); // "October 2026"
export const dateShort = (iso: string) => `${Number(iso.slice(8, 10))} ${monShort(iso)}`; // "9 Oct"
export const dateLong = (iso: string) => `${dayShort(iso)} ${dateShort(iso)}`; // "Fri 9 Oct"

/** "9–12 Oct" or "30 Oct – 2 Nov" */
export function dateRange(start: string, end: string) {
  if (start === end) return dateShort(start);
  if (start.slice(0, 7) === end.slice(0, 7)) return `${Number(start.slice(8, 10))}–${dateShort(end)}`;
  return `${dateShort(start)} – ${dateShort(end)}`;
}

/** "2N/3D" */
export const durationLabel = (nights: number, days: number) => `${nights}N/${days}D`;

/** Monday-based week helpers for "This weekend" / "Next weekend" chips. Weekend = Thu–Sun departures. */
export function weekendWindow(todayIso: string, weeksAhead = 0): [string, string] {
  const d = toDate(todayIso);
  const dow = d.getUTCDay(); // 0 Sun … 6 Sat
  const toThu = (4 - dow + 7) % 7;
  const thu = new Date(d);
  // If it's already Fri–Sun, "this weekend" is the current one.
  thu.setUTCDate(d.getUTCDate() + (dow >= 5 || dow === 0 ? -((dow + 3) % 7) : toThu) + weeksAhead * 7);
  const sun = new Date(thu);
  sun.setUTCDate(thu.getUTCDate() + 3);
  return [isoDate(thu), isoDate(sun)];
}
