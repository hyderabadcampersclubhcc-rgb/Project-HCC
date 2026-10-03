/**
 * JSON-LD builders. Only fields with real values are emitted. No ratings, no invented
 * opening hours, no address unless the full NAP is filled in settings.
 */
import { settings } from './settings';
import type { TripView, TripOriginView } from './catalog';

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
    alternateName: settings.brand.short,
    url: new URL('/', site).href,
    logo: new URL('/favicon.svg', site).href,
    description: settings.brand.tagline,
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
    name: `${d.title} Group Trip from ${origin.label}`,
    description: d.seo.description ?? d.tagline,
    url,
    ...(imageUrl ? { image: imageUrl } : {}),
    touristType: d.tripTypes.map((t) => ({ weekend: 'Weekend travellers', trek: 'Trekkers', camping: 'Campers', backpacking: 'Backpackers', long: 'Long-trip travellers', couple: 'Couples', family: 'Families', corporate: 'Corporate groups' })[t]),
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: trip.destinationNames.length,
      itemListElement: trip.destinationNames.map((name, i) => ({
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
