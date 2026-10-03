/**
 * WhatsApp deep links. The server builds a readable, pre-filled message; the
 * client script (src/scripts/whatsapp.ts) appends a short attribution ref code
 * at click time, e.g. "[ref: OOTY-1009 · ig]", so chats can be traced to a
 * campaign without asking the traveller.
 */
import { whatsappNumber } from './settings';
import { dateLong } from './format';

export interface WaContext {
  tripTitle?: string;
  originLabel?: string;
  date?: string; // YYYY-MM-DD
  destination?: string;
  custom?: string; // full custom message
}

export function waMessage(ctx: WaContext = {}): string {
  if (ctx.custom) return ctx.custom;
  if (ctx.tripTitle) {
    const from = ctx.originLabel ? ` from ${ctx.originLabel}` : '';
    const when = ctx.date ? ` (departure: ${dateLong(ctx.date)})` : '';
    return `Hi HCC! I'm interested in the ${ctx.tripTitle} trip${from}${when}.`;
  }
  if (ctx.destination) return `Hi HCC! I'd like to plan a trip to ${ctx.destination}.`;
  return `Hi HCC! I'd like to know about your upcoming trips.`;
}

/** Full wa.me URL, or null when no WhatsApp number is configured (component then hides). */
export function waHref(ctx: WaContext = {}): string | null {
  if (!whatsappNumber) return null;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage(ctx))}`;
}

/** Short trip/date code for attribution, e.g. "OOTY-1009". */
export function waRef(tripId?: string, date?: string): string {
  const code = (tripId ?? 'GEN').split('-')[0].slice(0, 6).toUpperCase();
  return date ? `${code}-${date.slice(5, 7)}${date.slice(8, 10)}` : code;
}
