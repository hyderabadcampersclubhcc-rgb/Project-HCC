/**
 * Navigation + trip-type taxonomy. Each trip type maps to exactly one SEO landing
 * page (see the intent map in docs/phase-2-design-system.html §9).
 */
import type { IconName } from '@/components/ui/Icon.astro';

export interface TripTypeLink {
  type: string;
  label: string;
  href: string;
  icon: IconName;
  blurb: string;
}

export const TRIP_TYPE_LINKS: TripTypeLink[] = [
  { type: 'weekend', label: 'Weekend Getaways', href: '/weekend-trips-from-hyderabad/', icon: 'compass', blurb: 'From Hyderabad, every week' },
  { type: 'camping', label: 'Camping', href: '/camping-near-hyderabad/', icon: 'tent', blurb: 'Campfires, stars, lakesides' },
  { type: 'trek', label: 'Treks & Adventure', href: '/treks/', icon: 'mountain', blurb: 'Trails for every fitness level' },
  { type: 'backpacking', label: 'Backpacking', href: '/backpacking-trips/', icon: 'backpack', blurb: 'Longer, looser, more places' },
  { type: 'long', label: 'Long Trips', href: '/long-trips/', icon: 'route', blurb: 'Himalaya, North-East & beyond' },
  { type: 'couple', label: 'Couple Trips', href: '/couple-trips/', icon: 'heart', blurb: 'Private-room group trips' },
  { type: 'family', label: 'Family Trips', href: '/family-trips/', icon: 'family', blurb: 'Easy pace, all ages' },
  { type: 'corporate', label: 'Corporate Trips', href: '/corporate-trips/', icon: 'briefcase', blurb: 'Offsites & team outings' },
  { type: 'custom', label: 'Customised Trips', href: '/customised-trips/', icon: 'sparkles', blurb: 'Built around your group' },
];

/** Departure-city pages shown in the Trips menus (Phase B). */
export const CITY_LINKS = [
  { label: 'Weekend Trips from Bangalore', href: '/weekend-trips-from-bangalore/', icon: 'route' as const, blurb: 'Coorg, Gokarna, Munnar' },
];

export interface NavItem {
  label: string;
  href: string;
  menu?: 'trips' | 'destinations';
}

/** Desktop primary nav. 7 items max: everything else lives in mega-menus and the footer. */
export const MAIN_NAV: NavItem[] = [
  { label: 'Trips', href: '/trips/', menu: 'trips' },
  { label: 'Weekend Getaways', href: '/weekend-trips-from-hyderabad/' },
  { label: 'Treks', href: '/treks/' },
  { label: 'Camping', href: '/camping-near-hyderabad/' },
  { label: 'Long Trips', href: '/long-trips/' },
  { label: 'Destinations', href: '/destinations/', menu: 'destinations' },
  { label: 'Guides', href: '/travel-guides/' },
];

export const FOOTER_COMPANY = [
  { label: 'About HCC', href: '/about/' },
  { label: 'Upcoming trips', href: '/upcoming-trips/' },
  { label: 'Reviews', href: '/reviews/' },
  { label: 'Travel guides', href: '/travel-guides/' },
  { label: 'FAQs', href: '/faq/' },
  { label: 'Contact', href: '/contact/' },
];

export const FOOTER_LEGAL = [
  { label: 'Cancellation policy', href: '/cancellation-policy/' },
  { label: 'Terms', href: '/terms/' },
  { label: 'Privacy', href: '/privacy-policy/' },
  { label: 'Photo credits', href: '/photo-credits/' },
];

export const REGION_LABELS: Record<string, string> = {
  karnataka: 'Karnataka',
  kerala: 'Kerala',
  'tamil-nadu': 'Tamil Nadu',
  goa: 'Goa',
  'andhra-telangana': 'Andhra & Telangana',
  himalaya: 'Himalaya',
  'north-east': 'North-East',
  rajasthan: 'Rajasthan',
  other: 'More places',
};
