/**
 * Live trip data inside CMS-editable Markdown guides (.md), which can't hold MDX components.
 * Editors type plain-text tokens that survive any Markdown editor:
 *
 *   {{trip-table: ooty-coonoor, wayanad | Caption}}   on its own line → live comparison table (TripTable)
 *   {{trip: ooty-coonoor}}                            on its own line → live trip card (TripCallout)
 *   {{price: ooty-coonoor}}                           inline → live from-price, e.g. "₹7,999"
 *   {{price: gokarna-dandeli@bangalore}}              inline → from-price for another departure city
 *   {{next: ooty-coonoor}}                            inline → next bookable departure, e.g. "Thu 29 Oct"
 *   {{advance-summary}}, {{cancellation-summary}}, {{hcc-cancellation}}  → the shared policy text (lib/cancellation)
 *
 * A trip that isn't live (or has no price/date) renders "price on request" / "dates on request",
 * so a guide never shows a stale or invented number. `npm run check:integrity` fails on unknown trip ids.
 */
import type { TripView } from './catalog';
import { inr, dateLong } from './format';
import { expandPolicyTokens } from './cancellation';

export type GuideBlock =
  | { kind: 'html'; html: string }
  | { kind: 'table'; trips: string[]; caption?: string }
  | { kind: 'card'; trip: string };

const BLOCK = /<p>\s*\{\{\s*(trip-table|trip)\s*:\s*([^}|]+?)\s*(?:\|\s*([^}]+?)\s*)?\}\}\s*<\/p>/g;
const INLINE = /\{\{\s*(price|next)\s*:\s*([a-z0-9-]+)(?:@([a-z-]+))?\s*\}\}/g;

export const hasGuideTokens = (text: string) => /\{\{\s*((trip-table|trip|price|next)\s*:|advance-summary|cancellation-summary|hcc-cancellation)/.test(text);

/** Replaces inline {{price: …}} / {{next: …}} and policy tokens in plain text or HTML. */
export function expandInlineTokens(text: string, trips: TripView[]) {
  return expandPolicyTokens(text).replace(INLINE, (_m, kind: string, id: string, city?: string) => {
    const trip = trips.find((t) => t.id === id);
    const origin = trip?.origins.find((o) => o.city === (city ?? 'hyderabad')) ?? (city ? undefined : trip?.primary);
    if (kind === 'price') return origin?.fromPrice != null ? inr(origin.fromPrice) : 'price on request';
    return origin?.next ? dateLong(origin.next.start) : 'dates on request';
  });
}

/** Splits rendered guide HTML into HTML runs and live blocks (tables, trip cards). */
export function splitGuideHtml(html: string, trips: TripView[]): GuideBlock[] {
  const blocks: GuideBlock[] = [];
  let last = 0;
  for (const m of html.matchAll(BLOCK)) {
    blocks.push({ kind: 'html', html: expandInlineTokens(html.slice(last, m.index), trips) });
    const ids = m[2].split(',').map((s) => s.trim()).filter(Boolean);
    blocks.push(m[1] === 'trip' ? { kind: 'card', trip: ids[0] } : { kind: 'table', trips: ids, caption: m[3] });
    last = m.index! + m[0].length;
  }
  blocks.push({ kind: 'html', html: expandInlineTokens(html.slice(last), trips) });
  return blocks;
}

/** Every trip id a token refers to (used by the integrity check). */
export function tokenTripIds(text: string) {
  const ids = new Set<string>();
  for (const m of text.matchAll(/\{\{\s*(?:trip-table|trip)\s*:\s*([^}|]+)/g)) m[1].split(',').forEach((s) => ids.add(s.trim()));
  for (const m of text.matchAll(INLINE)) ids.add(m[2]);
  return [...ids].filter(Boolean);
}
