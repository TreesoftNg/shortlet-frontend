import {
  getProperties,
  getPropertyBySlug,
} from '@/data/api/properties';
import { getBookings, getBookingCounts } from '@/data/api/bookings';
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

describe('bookings api', () => {
  it('returns an empty list when unsigned-in', async () => {
    const list = await getBookings();
    expect(list).toEqual([]);
  });

  it('returns empty upcoming list when unsigned-in', async () => {
    const list = await getBookings('upcoming');
    expect(list).toEqual([]);
  });

  it('returns zero counts when unsigned-in', async () => {
    const counts = await getBookingCounts();
    expect(counts).toEqual({ upcoming: 0, past: 0, cancelled: 0 });
  });
});
