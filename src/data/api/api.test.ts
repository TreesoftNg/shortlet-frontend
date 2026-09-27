import {
  getNeighborhoodBySlug,
  getNeighborhoods,
} from '@/data/api/neighborhoods';
import {
  getProperties,
  getPropertyBySlug,
} from '@/data/api/properties';
import { getBookings, getBookingCounts } from '@/data/api/bookings';
import { getWebsiteContent } from '@/data/api/content';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/data/api/client', () => ({
  delay: vi.fn(() => Promise.resolve()),
  request: vi.fn(async <T>(data: T) => data),
}));

describe('properties api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns only listed featured properties', async () => {
    const list = await getProperties({ featured: true });
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => p.listed && p.featured)).toBe(true);
  });

  it('filters by neighborhood slug', async () => {
    const list = await getProperties({ neighborhood: 'lekki' });
    expect(list.length).toBeGreaterThan(0);
    expect(
      list.every((p) => p.neighborhood_id === 'nbh_lekki'),
    ).toBe(true);
  });

  it('sorts by price ascending', async () => {
    const list = await getProperties({ sort: 'price_asc' });
    const rates = list.map((p) => p.pricing.nightly_rate);
    expect(rates).toEqual([...rates].sort((a, b) => a - b));
  });

  it('finds a property by slug', async () => {
    const property = await getPropertyBySlug('azure-2-bed-luxury-apartment');
    expect(property?.public_name).toContain('Azure');
  });

  it('returns null for unknown slug', async () => {
    await expect(getPropertyBySlug('does-not-exist')).resolves.toBeNull();
  });
});

describe('neighborhoods api', () => {
  it('lists neighborhoods', async () => {
    const list = await getNeighborhoods();
    expect(list.some((n) => n.slug === 'lekki')).toBe(true);
  });

  it('finds by slug', async () => {
    const area = await getNeighborhoodBySlug('victoria-island');
    expect(area?.name).toBe('Victoria Island');
  });
});

describe('bookings api', () => {
  it('returns all bookings when no tab is set', async () => {
    const list = await getBookings();
    expect(list.length).toBeGreaterThan(0);
  });

  it('filters upcoming as confirmed', async () => {
    const list = await getBookings('upcoming');
    expect(list.every((b) => b.status === 'confirmed')).toBe(true);
  });

  it('returns counts for each tab', async () => {
    const counts = await getBookingCounts();
    expect(counts.upcoming).toBeGreaterThanOrEqual(0);
    expect(counts.past).toBeGreaterThanOrEqual(0);
    expect(counts.cancelled).toBeGreaterThanOrEqual(0);
  });
});

describe('content api', () => {
  it('returns website content', async () => {
    const content = await getWebsiteContent();
    expect(content.brand_name).toBeTruthy();
    expect(content.hero.headline).toBeTruthy();
  });
});
