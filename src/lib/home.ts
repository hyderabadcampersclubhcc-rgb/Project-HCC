/**
 * Homepage content (edited in Decap CMS → "Homepage"). Headings, copy, pillars, steps,
 * FAQ and Instagram tiles live here so marketing can change them without code.
 * Items with empty answers / disabled flags are hidden on the live site.
 */
import type { ImageMetadata } from 'astro';
import { z } from 'astro/zod';
import raw from '../data/home.json';

const text = z.string().trim().default('');
const section = z.object({ title: z.string(), subtitle: text });

const HomeSchema = z.object({
  seo: z.object({ title: z.string().max(70), description: z.string().max(170) }),
  hero: z.object({ overline: text, headline: z.string(), subline: text, image: text, imageAlt: text }),
  upcoming: section.extend({ limit: z.number().int().min(3).max(20) }),
  destinations: section,
  weekend: z.object({ title: z.string(), intro: text }),
  tripTypes: section,
  featured: section,
  why: z.object({
    overline: text,
    title: z.string(),
    solo: z.object({ enabled: z.boolean(), title: text, text }),
    pillars: z.array(
      z.object({
        icon: z.enum(['file', 'train', 'bed', 'users', 'shield', 'heart', 'compass', 'mountain', 'tent', 'whatsapp']),
        title: z.string(),
        text: z.string(),
        enabled: z.boolean(),
      }),
    ),
  }),
  how: z.object({ title: z.string(), steps: z.array(z.object({ title: z.string(), text: z.string() })).length(3) }),
  instagram: section.extend({
    posts: z.array(z.object({ image: z.string(), alt: z.string(), url: z.string(), kind: z.enum(['post', 'reel']).default('post') })),
  }),
  custom: z.object({ title: z.string(), text: text }),
  guides: section,
  faq: z.object({ title: z.string(), items: z.array(z.object({ q: z.string(), a: text })) }),
});

export type Home = z.infer<typeof HomeSchema>;
export const home: Home = HomeSchema.parse(raw);

/** Images uploaded through the CMS (src/assets/uploads/…) resolved for astro:assets optimisation. */
const uploads = import.meta.glob<{ default: ImageMetadata }>('/src/assets/uploads/**/*.{jpg,jpeg,png,webp,avif}', { eager: true });

export function uploadedImage(path: string): ImageMetadata | undefined {
  if (!path) return undefined;
  const key = path.startsWith('/') ? path : `/${path}`;
  return uploads[key]?.default;
}
