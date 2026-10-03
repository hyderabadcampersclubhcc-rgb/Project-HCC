/**
 * Analytics bridge. Everything goes to window.dataLayer; GTM (Phase 6) routes
 * events to GA4, Google Ads and Meta. Components declare tracking in markup:
 *
 *   <a data-track="select_item" data-track-params='{"item_id":"ooty-coonoor"}'>
 *
 * Auto-tracked: tel: links → click_call, external links → outbound_click.
 * Never send personal data (names, phone numbers) in event params.
 */
type Params = Record<string, string | number | boolean | null | undefined | object>;

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export function track(event: string, params: Params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  if (import.meta.env.DEV) console.debug('[track]', event, params);
}

function parseParams(el: Element): Params {
  const raw = el.getAttribute('data-track-params');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function initClickTracking() {
  document.addEventListener(
    'click',
    (e) => {
      const target = e.target as Element | null;
      const el = target?.closest<HTMLElement>('[data-track]');
      if (el) track(el.dataset.track!, { ...parseParams(el), cta_location: el.dataset.ctaLocation });

      const a = target?.closest<HTMLAnchorElement>('a[href]');
      if (!a || el?.dataset.track) return;
      if (a.protocol === 'tel:') track('click_call', { cta_location: a.dataset.ctaLocation ?? 'inline' });
      else if (a.host && a.host !== location.host && !a.hasAttribute('data-wa'))
        track('outbound_click', { link_url: a.href, link_domain: a.host });
    },
    { capture: true },
  );
}
