import type { WebsiteContent } from '@/data/types';

/** Category chips — ids map to public units `tab` values. */
export const PUBLIC_UNIT_CATEGORIES = [
  { id: 'all', label: 'All stays', icon: 'sparkles' },
  { id: 'studios', label: 'Studios', icon: 'building-2' },
  { id: '1-bedroom', label: '1 Bedroom', icon: 'bed-double' },
  { id: '2-bedroom', label: '2 Bedroom', icon: 'sofa' },
  { id: 'penthouses', label: 'Penthouses', icon: 'castle' },
  { id: 'pool', label: 'Pool', icon: 'waves' },
  { id: 'business', label: 'Business', icon: 'briefcase' },
  { id: 'events', label: 'Events allowed', icon: 'party-popper' },
  { id: 'waterfront', label: 'Waterfront', icon: 'sunset' },
  { id: 'power', label: '24/7 Power', icon: 'zap' },
] as const;

/**
 * Static brand copy used when assembling website content from live
 * neighbourhood / units APIs (no CMS endpoint on staging yet).
 */
export const BRAND_DEFAULTS = {
  brand_name: 'Sunmade Apartments & Suites',
  currency: 'NGN',
  currency_symbol: '₦',
  hero: {
    headline: 'Stay somewhere that feels like home.',
    fallbackImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=80',
  },
  trust: {
    title: 'Why guests book with Sunmade',
    subtitle:
      'Every apartment is inspected, cleaned by professionals and supported round the clock.',
    items: [
      {
        icon: 'shield-check',
        title: 'Verified apartments',
        description: 'Photos match reality, always.',
      },
      {
        icon: 'credit-card',
        title: 'Secure payments',
        description: 'Pay safely with card or transfer.',
      },
      {
        icon: 'headphones',
        title: '24/7 support',
        description: "We're a message away.",
      },
    ],
  },
} as const;

export function formatAreaList(areas: string[]): string {
  const unique = [...new Set(areas.map((a) => a.trim()).filter(Boolean))];
  if (unique.length === 0) return 'Lagos';
  if (unique.length === 1) return unique[0]!;
  if (unique.length === 2) return `${unique[0]} & ${unique[1]}`;
  return `${unique.slice(0, -1).join(', ')} & ${unique[unique.length - 1]}`;
}

export function buildWebsiteContent(input: {
  areaNames: string[];
  heroImage?: string | null;
}): WebsiteContent {
  const areas = formatAreaList(input.areaNames);
  return {
    brand_name: BRAND_DEFAULTS.brand_name,
    currency: BRAND_DEFAULTS.currency,
    currency_symbol: BRAND_DEFAULTS.currency_symbol,
    hero: {
      headline: BRAND_DEFAULTS.hero.headline,
      subheadline: `Serviced shortlet apartments across ${areas} — verified, fully furnished, instantly bookable.`,
      image: input.heroImage || BRAND_DEFAULTS.hero.fallbackImage,
    },
    trust: {
      title: BRAND_DEFAULTS.trust.title,
      subtitle: BRAND_DEFAULTS.trust.subtitle,
      items: [...BRAND_DEFAULTS.trust.items],
    },
    categories: PUBLIC_UNIT_CATEGORIES.map((c) => ({ ...c })),
  };
}
