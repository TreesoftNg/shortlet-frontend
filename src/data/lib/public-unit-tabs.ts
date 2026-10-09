import type { PublicUnitsTab } from '@/data/types/public-unit';

const PUBLIC_UNITS_TABS = new Set<PublicUnitsTab>([
  'all',
  'studios',
  'one_bedroom',
  'two_bedroom',
  'penthouses',
  'pool',
  'business',
  'events_allowed',
  'waterfront',
  'power_24_7',
]);

/** UI category strip ids → API `tab` query values. */
const CATEGORY_TO_TAB: Record<string, PublicUnitsTab> = {
  all: 'all',
  studios: 'studios',
  '1-bedroom': 'one_bedroom',
  one_bedroom: 'one_bedroom',
  '2-bedroom': 'two_bedroom',
  two_bedroom: 'two_bedroom',
  penthouses: 'penthouses',
  pool: 'pool',
  business: 'business',
  events: 'events_allowed',
  events_allowed: 'events_allowed',
  waterfront: 'waterfront',
  power: 'power_24_7',
  power_24_7: 'power_24_7',
};

/** API `tab` → home/search category strip id. */
const TAB_TO_CATEGORY: Record<PublicUnitsTab, string> = {
  all: 'all',
  studios: 'studios',
  one_bedroom: '1-bedroom',
  two_bedroom: '2-bedroom',
  penthouses: 'penthouses',
  pool: 'pool',
  business: 'business',
  events_allowed: 'events',
  waterfront: 'waterfront',
  power_24_7: 'power',
};

export function isPublicUnitsTab(value: string): value is PublicUnitsTab {
  return PUBLIC_UNITS_TABS.has(value as PublicUnitsTab);
}

/** Map home/search category ids (or raw API tabs) to a public units tab. */
export function toPublicUnitsTab(
  categoryOrTab: string | null | undefined,
): PublicUnitsTab {
  if (!categoryOrTab) return 'all';
  if (isPublicUnitsTab(categoryOrTab)) return categoryOrTab;
  return CATEGORY_TO_TAB[categoryOrTab] ?? 'all';
}

/** Map an API tab back to the home/search category strip id. */
export function toCategoryId(
  tab: PublicUnitsTab | string | null | undefined,
): string {
  const normalised = toPublicUnitsTab(tab);
  return TAB_TO_CATEGORY[normalised];
}
