/**
 * JSON-LD builders. Only fields with real values are emitted. No ratings, no invented
 * opening hours, no address unless the full NAP is filled in settings.
 */
import { settings } from './settings';
import type { TripView, TripOriginView } from './catalog';
import { tripHeading } from './trip-facts';

export function organizationLd(site: URL) {
  const c = settings.contact;
  const a = c.address;
  const sameAs = Object.values(settings.social).filter(Boolean);
  const hasAddress = !!(a.street && a.postalCode && a.city);
  const phone = c.phone || c.whatsapp;

  return {
    '@context': 'https://schema.org',
    '@type': hasAddress ? 'TravelAgency' : 'Organization',
    '@id': new URL('/#organization', site).href,
    name: settings.brand.name,
    // "HCC" and the full "Hyderabad Campers Club (HCC)" form, so the brand isn't confused with similarly named businesses.
    alternateName: [settings.brand.short, `${settings.brand.name} (${settings.brand.short})`],
    url: new URL('/', site).href,
    logo: new URL('/hcc-logo.png', site).href, // official HCC badge, 512×512 PNG from src/assets/brand/hcc-logo.png (Google needs a raster logo, 112px+)
    description: `${settings.brand.name} (${settings.brand.short}): ${settings.brand.tagline}`,
    ...(sameAs.length ? { sameAs } : {}),
    ...(c.email ? { email: c.email } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(hasAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: a.street,
            addressLocality: a.locality || a.city,
            addressRegion: a.region,
            postalCode: a.postalCode,
            addressCountry: a.country || 'IN',
          },
          areaServed: { '@type': 'City', name: 'Hyderabad' },
        }
      : {}),
  };
}

/**
 * TouristTrip for a trip page: itinerary as an ItemList of destinations, one Offer per
 * future departure with real availability. No ratings (see Reviews policy).
 */
export function touristTripLd(trip: TripView, origin: TripOriginView, site: URL, imageUrl?: string) {
  const d = trip.data;
  const url = new URL(origin.url, site).href;
  const AVAIL: Record<string, string> = {
    open: 'https://schema.org/InStock',
    waitlist: 'https://schema.org/PreOrder',
    soldout: 'https://schema.org/SoldOut',
  };
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': `${url}#trip`,
    name: tripHeading(trip, origin),
    description: d.seo.description ?? d.tagline,
    url,
    ...(imageUrl ? { image: imageUrl } : {}),
    touristType: d.tripTypes.map((t) => ({ weekend: 'Weekend travellers', trek: 'Trekkers', camping: 'Campers', backpacking: 'Backpackers', long: 'Long-trip travellers', couple: 'Couples', family: 'Families', corporate: 'Corporate groups' })[t]),
    // City-specific: the day-by-day plan for this departure city, else the places on its route.
    itinerary: origin.itinerary.length
      ? {
          '@type': 'ItemList',
          numberOfItems: origin.itinerary.length,
          itemListElement: [...origin.itinerary]
            .sort((a, b) => a.day - b.day)
            .map((day, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: `Day ${day.day}: ${day.title}`,
              // Same text as the page: start line, description, then the day's points.
              description: [day.start, day.description, ...(day.points ?? [])]
                .filter(Boolean)
                .map((s) => s!.trim().replace(/([^.!?])$/, '$1.'))
                .join(' '),
            })),
        }
      : {
          '@type': 'ItemList',
          numberOfItems: origin.destinationNames.length,
          itemListElement: origin.destinationNames.map((name, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: { '@type': 'TouristDestination', name },
          })),
        },
    provider: { '@id': new URL('/#organization', site).href },
    ...(origin.departures.length
      ? {
          offers: origin.departures.slice(0, 20).map((dep) => ({
            '@type': 'Offer',
            name: `${d.title}, departing ${dep.start}`,
            price: dep.price,
            priceCurrency: 'INR',
            availability: AVAIL[dep.status] ?? 'https://schema.org/InStock',
            validThrough: dep.start,
            url: `${url}?d=${dep.start}`,
            ...(dep.seatsLeft != null && dep.status === 'open' ? { inventoryLevel: { '@type': 'QuantitativeValue', value: dep.seatsLeft } } : {}),
          })),
        }
      : {}),
  };
}

/** FAQPage from Q&As already published on the page (never extra text). */
export function faqLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function websiteLd(site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': new URL('/#website', site).href,
    name: settings.brand.name,
    url: new URL('/', site).href,
    publisher: { '@id': new URL('/#organization', site).href },
    inLanguage: 'en-IN',
  };
}
