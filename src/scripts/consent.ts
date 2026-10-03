/**
 * Consent store + Google Consent Mode v2 updates.
 * Default state (set inline in <head> before GTM) is "denied" for everything except
 * security. A choice is stored for 180 days in localStorage under `hcc_consent`.
 * Other scripts read it with getConsent() or listen for `hcc:consent`.
 */
import { track } from './analytics';

export type Consent = { analytics: boolean; ads: boolean; ts: number; v: 1 };

const KEY = 'hcc_consent';
const MAX_AGE = 180 * 864e5;

export function getConsent(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Consent | null;
    if (!c || c.v !== 1 || Date.now() - c.ts > MAX_AGE) return null;
    return c;
  } catch {
    return null;
  }
}

function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // Consent commands must be pushed as an `arguments` object, exactly like gtag.js does.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

function apply(c: Pick<Consent, 'analytics' | 'ads'>) {
  const g = (on: boolean) => (on ? 'granted' : 'denied');
  gtag('consent', 'update', {
    analytics_storage: g(c.analytics),
    ad_storage: g(c.ads),
    ad_user_data: g(c.ads),
    ad_personalization: g(c.ads),
  });
  document.dispatchEvent(new CustomEvent('hcc:consent', { detail: c }));
}

function save(c: Pick<Consent, 'analytics' | 'ads'>, source: string) {
  const full: Consent = { ...c, ts: Date.now(), v: 1 };
  try {
    localStorage.setItem(KEY, JSON.stringify(full));
  } catch {
    /* private mode: choice applies to this page view only */
  }
  apply(c);
  track('consent_update', { analytics: c.analytics, ads: c.ads, consent_source: source });
}

export function initConsent() {
  const banner = document.querySelector<HTMLElement>('[data-consent-banner]');
  const dialog = document.querySelector<HTMLDialogElement>('[data-consent-dialog]');
  if (!banner || !dialog) return;
  const forced = banner.hasAttribute('data-force');

  const stored = getConsent();
  if (stored) apply(stored);
  // No tag configured (staging, or before IDs are added): nothing to ask about.
  const t = window.hccTags;
  const anyTag = !!(t && (t.ga4 || t.ads || t.pixel || t.gtm));
  banner.hidden = !forced && (!!stored || !anyTag);

  const sw = (name: string) => dialog.querySelector<HTMLInputElement>(`input[name="${name}"]`)!;
  const open = () => {
    const c = getConsent();
    sw('analytics').checked = c?.analytics ?? false;
    sw('ads').checked = c?.ads ?? false;
    dialog.showModal();
  };
  const done = (c: { analytics: boolean; ads: boolean }, source: string) => {
    save(c, source);
    if (!forced) banner.hidden = true;
    if (dialog.open) dialog.close();
  };

  document.addEventListener('click', (e) => {
    const t = (e.target as Element | null)?.closest<HTMLElement>('[data-consent],[data-consent-open]');
    if (!t) return;
    if (t.hasAttribute('data-consent-open')) {
      e.preventDefault();
      return open();
    }
    const kind = t.dataset.consent;
    if (kind === 'all') done({ analytics: true, ads: true }, dialog.open ? 'dialog' : 'banner');
    else if (kind === 'necessary') done({ analytics: false, ads: false }, 'banner');
    else if (kind === 'save') done({ analytics: sw('analytics').checked, ads: sw('ads').checked }, 'dialog');
  });
}
