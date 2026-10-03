/**
 * Site-wide settings (edited in Decap CMS → "Site settings").
 * Parsed with Zod at build time so a malformed edit fails the build instead of
 * shipping. Empty strings mean "not provided": components hide themselves.
 */
import { z } from 'astro/zod';
import raw from '../data/site.json';

const optionalText = z.string().trim().default('');

const TrustItem = z.object({
  icon: z.enum(['star', 'users', 'calendar', 'pin', 'whatsapp', 'shield', 'mountain', 'tent']),
  value: optionalText, // "4.8 ★", "10,000+". Empty → item is hidden
  label: z.string(),
  detail: optionalText, // "312 reviews"
  sourceUrl: optionalText, // where the claim can be verified
  enabled: z.boolean().default(true),
});

const SettingsSchema = z.object({
  brand: z.object({ name: z.string(), short: z.string(), tagline: z.string() }),
  announcement: z.object({
    enabled: z.boolean(),
    text: optionalText,
    linkText: optionalText,
    url: optionalText,
    startsAt: optionalText,
    endsAt: optionalText,
  }),
  contact: z.object({
    whatsapp: optionalText.refine((v) => v === '' || /^\+?[\d\s-]{10,15}$/.test(v), 'WhatsApp number must be 10–15 digits'),
    phone: optionalText,
    email: optionalText,
    hours: optionalText,
    address: z.object({
      street: optionalText,
      locality: optionalText,
      city: optionalText,
      region: optionalText,
      postalCode: optionalText,
      country: optionalText,
      mapUrl: optionalText,
    }),
  }),
  social: z.object({
    instagram: optionalText,
    facebook: optionalText,
    youtube: optionalText,
    googleBusiness: optionalText,
  }),
  trust: z.array(TrustItem),
  payments: z.object({
    enabled: z.boolean(),
    provider: z.enum(['razorpay']),
    defaultBookingMode: z.enum(['enquiry', 'payment']),
  }),
  urgency: z.object({ seatThreshold: z.number().int().min(1).max(30) }),
  // Each tool stays off until its ID is entered. Formats are checked so a typo fails the build.
  tracking: z.object({
    gtmId: optionalText.refine((v) => v === '' || /^GTM-[A-Z0-9]{4,10}$/.test(v), 'GTM ID looks like GTM-XXXXXXX'),
    ga4Id: optionalText.refine((v) => v === '' || /^G-[A-Z0-9]{6,12}$/.test(v), 'GA4 ID looks like G-XXXXXXXXXX'),
    adsId: optionalText.refine((v) => v === '' || /^AW-\d{6,12}$/.test(v), 'Google Ads ID looks like AW-123456789'),
    adsLeadLabel: optionalText,
    adsWhatsappLabel: optionalText,
    adsCallLabel: optionalText,
    metaPixelId: optionalText.refine((v) => v === '' || /^\d{10,20}$/.test(v), 'Meta Pixel ID is 15–16 digits'),
  }),
});

export type Settings = z.infer<typeof SettingsSchema>;
export type TrustItem = z.infer<typeof TrustItem>;

export const settings: Settings = SettingsSchema.parse(raw);

/** Digits only, with India country code, as wa.me expects. Empty if not configured. */
export const whatsappNumber = (() => {
  const digits = settings.contact.whatsapp.replace(/\D/g, '');
  if (!digits) return '';
  return digits.length === 10 ? `91${digits}` : digits;
})();

/** Trust items that have real values; disabled or empty ones are dropped. */
export function visibleTrustItems(s: Settings = settings): TrustItem[] {
  return s.trust.filter((t) => {
    if (!t.enabled || !t.value) return false;
    if (t.icon === 'whatsapp' && !whatsappNumber) return false;
    return true;
  });
}

/** Announcement is shown only when enabled, has text, and today is within its window (IST). */
export function activeAnnouncement(now = new Date()) {
  const a = settings.announcement;
  if (!a.enabled || !a.text) return null;
  const today = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  if (a.startsAt && today < a.startsAt) return null;
  if (a.endsAt && today > a.endsAt) return null;
  return a;
}
