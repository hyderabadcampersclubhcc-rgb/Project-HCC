/**
 * Thin-content guards. Pages without enough real content still exist (so navigation and
 * old-URL redirects work) but carry noindex and are dropped from the sitemap
 * (integrations/hostinger.mjs removes noindex pages from sitemap-0.xml after the build).
 * Rules from the approved SEO intent map (docs/phase-2-design-system.html §9).
 */
export const words = (md?: string) =>
  (md ?? '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/[#>*_`|[\]()-]/g, ' ')
    .split(/\s+/)
    .filter((w) => /[a-z0-9]/i.test(w)).length;

/** Category page: ≥3 live trips AND ≥150 words of HCC guidance copy AND inside its active window. */
export function categoryIndexable(opts: { tripCount: number; body?: string; activeFrom?: Date; activeUntil?: Date; now?: Date }) {
  const now = opts.now ?? new Date();
  if (opts.activeFrom && now < opts.activeFrom) return false;
  if (opts.activeUntil && now > opts.activeUntil) return false;
  return opts.tripCount >= 3 && words(opts.body) >= 150;
}

/** Destination: ≥1 live trip OR ≥400 words of destination copy. */
export const destinationIndexable = (opts: { tripCount: number; body?: string }) => opts.tripCount >= 1 || words(opts.body) >= 400;
