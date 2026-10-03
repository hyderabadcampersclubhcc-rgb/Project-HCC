/**
 * JSON-LD builders. Only fields with real values are emitted. No ratings, no invented
 * opening hours, no address unless the full NAP is filled in settings.
 */
import { settings } from './settings';

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
