/**
 * Campaign attribution. Captures UTM + click IDs on landing and keeps both a
 * first-touch and a last-touch record (first-party localStorage, 90 days).
 * Every lead and WhatsApp click reads from here. Internal links never need UTMs.
 */
const KEY = 'hcc_attr';
const TTL_MS = 90 * 24 * 60 * 60 * 1000;
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid'] as const;

export type Touch = Partial<Record<(typeof PARAMS)[number], string>> & {
  landing: string;
  referrer: string;
  ts: number;
};

export interface Attribution {
  first: Touch | null;
  last: Touch | null;
}

function read(): Attribution {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { first: null, last: null };
    const data = JSON.parse(raw) as Attribution;
    if (data.first && Date.now() - data.first.ts > TTL_MS) return { first: null, last: null };
    return data;
  } catch {
    return { first: null, last: null };
  }
}

function write(data: Attribution) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage blocked (private mode, in-app browsers): attribution falls back to this page only */
  }
}

let memory: Attribution = { first: null, last: null };

export function captureAttribution(loc: Location = location, ref = document.referrer) {
  const qs = new URLSearchParams(loc.search);
  const touch: Touch = { landing: loc.pathname + loc.search, referrer: '', ts: Date.now() };
  let hasCampaign = false;
  for (const p of PARAMS) {
    const v = qs.get(p);
    if (v) {
      touch[p] = v.slice(0, 120);
      hasCampaign = true;
    }
  }
  let externalRef = false;
  try {
    externalRef = !!ref && new URL(ref).host !== loc.host;
  } catch {
    /* malformed referrer */
  }
  if (externalRef) touch.referrer = ref.slice(0, 200);

  const data = read();
  if (!data.first) data.first = touch;
  if (hasCampaign || externalRef || !data.last) data.last = touch;
  memory = data;
  write(data);
}

export function getAttribution(): Attribution {
  const stored = read();
  return stored.first ? stored : memory;
}

/** Short source tag for WhatsApp ref codes: ig, fb, g, wa, yt, or the raw source. */
export function sourceTag(): string {
  const t = getAttribution().last;
  if (!t) return '';
  const src = (t.utm_source ?? '').toLowerCase();
  if (t.gclid || t.gbraid || t.wbraid || src === 'google') return t.utm_medium?.includes('organic') ? 'seo' : 'g';
  if (src.startsWith('ig') || src.includes('instagram')) return 'ig';
  if (t.fbclid || src.includes('facebook') || src === 'fb' || src === 'meta') return 'fb';
  if (src.includes('whatsapp')) return 'wa';
  if (src.includes('youtube')) return 'yt';
  if (src) return src.slice(0, 12);
  if (t.referrer.includes('google.')) return 'seo';
  if (t.referrer.includes('instagram.')) return 'ig';
  return '';
}
