/**
 * Routes site events (src/scripts/analytics.ts → track()) to the configured tags.
 * IDs come from window.hccTags (src/components/seo/TrackingHead.astro); a missing ID
 * simply switches that destination off.
 *
 *   GA4          every event (click_book is reported as GA4's begin_checkout)
 *   Google Ads   generate_lead / click_whatsapp / click_call → conversions (labels from CMS)
 *   Meta Pixel   loaded only after Advertising consent; standard events below.
 *                Leads also go server-side (Conversions API in api/intents.php) with the
 *                same event ID, so Meta de-duplicates them.
 *
 * Personal data (names, phone numbers) is never sent from the browser.
 */
import { getConsent } from './consent';

type Params = Record<string, unknown>;

interface TagConfig {
  gtm: string;
  ga4: string;
  ads: string;
  labels: Partial<Record<string, string>>;
  pixel: string;
}

declare global {
  interface Window {
    hccTags?: TagConfig;
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
    _fbq?: unknown;
  }
}

const GA4_NAME: Record<string, string> = { click_book: 'begin_checkout' };

const META: Record<string, string> = {
  view_item: 'ViewContent',
  click_book: 'InitiateCheckout',
  generate_lead: 'Lead',
  click_whatsapp: 'Contact',
  click_call: 'Contact',
};

const clean = (p: Params) => Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined && v !== null && v !== ''));

function metaParams(p: Params): Params {
  const id = (p.trip_id as string) || undefined;
  return clean({
    content_ids: id ? [id] : undefined,
    content_type: id ? 'product' : undefined,
    content_name: p.trip_name,
    value: (p.value as number) ?? (p.price as number),
    currency: p.value || p.price ? 'INR' : undefined,
  });
}

let pixelLoaded = false;
function loadPixel(id: string) {
  if (pixelLoaded || !id) return;
  pixelLoaded = true;
  // Meta's standard base code, unminified.
  const fbq = function (...args: unknown[]) {
    const f = window.fbq as unknown as { callMethod?: (...a: unknown[]) => void; queue: unknown[] };
    if (f.callMethod) f.callMethod(...args);
    else f.queue.push(args);
  } as NonNullable<Window['fbq']> & { push?: unknown; version?: string };
  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
  fbq('init', id);
  fbq('track', 'PageView');
}

/** Called by track() for every event. */
export function routeEvent(event: string, params: Params) {
  const cfg = window.hccTags;
  if (!cfg || !window.gtag) return;
  const p = clean(params);

  if (cfg.ga4) window.gtag('event', GA4_NAME[event] ?? event, { ...p, send_to: cfg.ga4 });

  const label = cfg.labels[event];
  if (cfg.ads && label) {
    window.gtag('event', 'conversion', {
      send_to: `${cfg.ads}/${label}`,
      ...(event === 'generate_lead' && p.lead_id ? { transaction_id: p.lead_id } : {}),
    });
  }

  const metaEvent = META[event];
  if (metaEvent && pixelLoaded && window.fbq) {
    if (event === 'generate_lead' && p.lead_id) window.fbq('track', metaEvent, metaParams(p), { eventID: p.lead_id });
    else window.fbq('track', metaEvent, metaParams(p));
  }
}

/** Meta Pixel follows the Advertising choice: loads on grant (now or later in the visit). */
export function initTags() {
  const pixel = window.hccTags?.pixel;
  if (!pixel) return;
  if (getConsent()?.ads) loadPixel(pixel);
  document.addEventListener('hcc:consent', (e) => {
    if ((e as CustomEvent<{ ads: boolean }>).detail.ads) loadPixel(pixel);
  });
}

/** Meta's first-party cookies, passed to the server for Conversions API matching. */
export function metaCookies() {
  const get = (n: string) => document.cookie.match(new RegExp(`(?:^|; )${n}=([^;]*)`))?.[1];
  return clean({ fbp: get('_fbp'), fbc: get('_fbc') }) as { fbp?: string; fbc?: string };
}
