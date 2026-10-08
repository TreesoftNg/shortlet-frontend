import { queryKeys } from '@/data/query-keys';
import { describe, expect, it } from 'vitest';

describe('queryKeys', () => {
  it('keeps content keys hierarchical', () => {
    expect(queryKeys.content.website()).toEqual(['content', 'website']);
  });

  it('includes params in property list keys', () => {
    const params = { featured: true, sort: 'price_asc' as const };
    expect(queryKeys.properties.list(params)).toEqual([
      'properties',
      'list',
      params,
    ]);
  });

  it('scopes property detail by slug', () => {
    expect(queryKeys.properties.detail('azure')).toEqual([
      'properties',
      'detail',
      'azure',
    ]);
  });

  it('scopes featured and public unit lists by tab', () => {
    expect(queryKeys.properties.featured('studios')).toEqual([
      'properties',
      'featured',
      'studios',
    ]);
    const params = { tab: 'all' as const, limit: 4 };
    expect(queryKeys.publicUnits.list(params)).toEqual([
      'public-units',
      'list',
      params,
    ]);
  });

  it('scopes bookings by tab', () => {
    expect(queryKeys.bookings.list('upcoming')).toEqual([
      'bookings',
      'list',
      'upcoming',
    ]);
    expect(queryKeys.bookings.list()).toEqual(['bookings', 'list', 'all']);
  });

  it('scopes reviews by property id', () => {
    expect(queryKeys.reviews.byProperty('p1')).toEqual([
      'reviews',
      'property',
      'p1',
    ]);
  });
});
