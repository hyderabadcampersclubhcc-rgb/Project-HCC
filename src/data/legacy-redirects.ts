/**
 * URLs from the previous WordPress site (wp-sitemap.xml, 3 Oct 2026) and where they go now.
 * Every one becomes a permanent 301 so existing Google rankings, ads and shared links survive.
 *
 * Resolution at build (src/pages/build-redirects.json.ts), most specific first:
 *   1. a live trip that lists the path in its `legacyPaths`   → that trip page
 *   2. a published destination that lists it in `legacyPaths` → that destination page
 *   3. `dest` below, if that destination is published         → /destinations/{dest}/
 *   4. `to` below (always-valid category fallback)
 *
 * When HCC re-creates an old trip in the CMS, add its old URL to the trip's
 * "Old website URLs" field and the redirect upgrades automatically.
 */
export interface LegacyRedirect {
  from: string;
  to: string;
  dest?: string;
}

export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  // Site structure
  { from: '/home/', to: '/' },
  { from: '/all-trips/', to: '/trips/' },
  { from: '/all-trips-2/', to: '/trips/' },
  { from: '/winter-trips/', to: '/trips/' },
  { from: '/product-category/winter-trips/', to: '/trips/' },
  { from: '/product-category/2days-1night-trips/', to: '/weekend-trips-from-hyderabad/' },
  { from: '/product-category/3days-2nights-trips/', to: '/weekend-trips-from-hyderabad/' },
  { from: '/terms-and-conditions/', to: '/terms/' },
  { from: '/categories/hostel/', to: '/trips/' },
  { from: '/categories/car/', to: '/trips/' },

  // WooCommerce / booking-plugin pages that no longer exist
  { from: '/shop/', to: '/trips/' },
  { from: '/cart/', to: '/trips/' },
  { from: '/checkout/', to: '/trips/' },
  { from: '/my-account/', to: '/' },
  { from: '/ba-wishlist/', to: '/trips/' },
  { from: '/customer-confirmation/', to: '/' },
  { from: '/to_book/chikmagalur/', to: '/trips/', dest: 'chikmagalur' },
  { from: '/to_book/kerala/', to: '/trips/', dest: 'kerala' },

  // Old trip pages (upgrade to the new trip page via the trip's legacyPaths)
  { from: '/ooty-coonoor/', to: '/weekend-trips-from-hyderabad/', dest: 'ooty' },
  { from: '/isha-ooty-coonoor/', to: '/weekend-trips-from-hyderabad/', dest: 'ooty' },
  { from: '/kodaikanal-isha-ooty-coonoor/', to: '/trips/', dest: 'ooty' },
  { from: '/coorg/', to: '/weekend-trips-from-hyderabad/', dest: 'coorg' },
  { from: '/coorg-chikmagalur/', to: '/weekend-trips-from-hyderabad/', dest: 'coorg' },
  { from: '/chikmagalur/', to: '/weekend-trips-from-hyderabad/', dest: 'chikmagalur' },
  { from: '/gokarna/', to: '/weekend-trips-from-hyderabad/', dest: 'gokarna' },
  { from: '/gokarna-dandeli/', to: '/weekend-trips-from-hyderabad/', dest: 'gokarna' },
  { from: '/wayanad/', to: '/weekend-trips-from-hyderabad/', dest: 'wayanad' },
  { from: '/hampi/', to: '/weekend-trips-from-hyderabad/', dest: 'hampi' },
  { from: '/pondicherry/', to: '/weekend-trips-from-hyderabad/', dest: 'pondicherry' },
  { from: '/pondi-and-pichavaram/', to: '/weekend-trips-from-hyderabad/', dest: 'pondicherry' },
  { from: '/araku/', to: '/weekend-trips-from-hyderabad/', dest: 'araku' },
  { from: '/goa/', to: '/trips/', dest: 'goa' },
  { from: '/kerala/', to: '/long-trips/', dest: 'kerala' },
  { from: '/manali/', to: '/long-trips/', dest: 'manali' },
  { from: '/ananthagiri-hills/', to: '/camping-near-hyderabad/', dest: 'ananthagiri' },
  { from: '/ananthagiri/', to: '/camping-near-hyderabad/', dest: 'ananthagiri' },
  // Phase A (Oct 2026): the camping category moved to the search-intent URL.
  { from: '/camping/', to: '/camping-near-hyderabad/' },

  // Old Maharashtra trek pages
  { from: '/ratangadfort/', to: '/treks/' },
  { from: '/devkund/', to: '/treks/' },
  { from: '/dudhsagar-tambdi-waterfalls/', to: '/treks/' },
  { from: '/sandhanvalley/', to: '/treks/' },
  { from: '/hariharfort-triambakeshwar-and-brahmagirihill/', to: '/treks/' },
  { from: '/harishchandragad/', to: '/treks/' },
  { from: '/kalavantin-durg/', to: '/treks/' },

  // Old blog posts (date-based URLs)
  { from: '/2024/10/24/sample-blog/', to: '/travel-guides/' },
  { from: '/2024/10/25/gokarna-and-dandeli/', to: '/travel-guides/', dest: 'gokarna' },
  { from: '/2024/10/29/munnar/', to: '/travel-guides/', dest: 'munnar' },
  { from: '/2025/02/12/ananthagiri-hills-camping-the-ultimate-weekend-getaway-from-hyderabad/', to: '/camping-near-hyderabad/', dest: 'ananthagiri' },
];
