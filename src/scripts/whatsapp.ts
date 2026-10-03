/**
 * WhatsApp click handling. Every WhatsApp CTA is an <a data-wa> with a
 * server-built wa.me href. On click we:
 *   1. append a short attribution ref, e.g. "[ref: OOTY-1009 · ig]"
 *   2. fire click_whatsapp (a Google Ads / GA4 conversion)
 * The link works without JS; JS only enriches it.
 */
import { sourceTag } from './attribution';
import { track } from './analytics';

export function initWhatsApp() {
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[data-wa]');
      if (!a) return;
      try {
        const url = new URL(a.href);
        const text = url.searchParams.get('text') ?? '';
        const ref = [a.dataset.waRef, sourceTag()].filter(Boolean).join(' · ');
        if (ref && !text.includes('[ref:')) {
          url.searchParams.set('text', `${text}\n[ref: ${ref}]`);
          a.href = url.toString();
        }
      } catch {
        /* keep original href */
      }
      track('click_whatsapp', {
        cta_location: a.dataset.ctaLocation ?? 'unknown',
        trip_id: a.dataset.tripId,
        trip_name: a.dataset.tripName,
        departure_date: a.dataset.departureDate,
      });
    },
    { capture: true },
  );
}
