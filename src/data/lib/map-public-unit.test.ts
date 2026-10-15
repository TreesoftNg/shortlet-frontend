import { toAppMediaUrl } from '@/data/lib/app-media-url';
import {
  mapPublicUnitDetailToProperty,
  mapPublicUnitToProperty,
} from '@/data/lib/map-public-unit';
import { toCategoryId, toPublicUnitsTab } from '@/data/lib/public-unit-tabs';
import type {
  PublicUnitCard,
  PublicUnitDetail,
} from '@/data/types/public-unit';
import { describe, expect, it } from 'vitest';

const sample: PublicUnitCard = {
  id: 'unit-1',
  tenantId: 'tenant-1',
  name: 'Lekki Studio',
  summary: 'Bright studio',
  pictureUrl:
    'http://localhost:4000/media/tenants/t1/units/unit-1/photos/p1/medium.webp',
  propertyType: 'apartment',
  roomType: 'Entire Home',
  guests: 2,
  bedrooms: 0,
  beds: 1,
  bathrooms: '1.0',
  currency: 'NGN',
  nightlyRate: '45000.00',
  instantBook: true,
  location: {
    city: 'Lekki',
    state: 'Lagos',
    country: 'NG',
    neighbourhood: 'Phase 1',
    display: null,
  },
  reviews: { averageRating: 4.8, totalCount: 3 },
};

const detailSample: PublicUnitDetail = {
  ...sample,
  description: 'Bright studio near the beach',
  floor: '2',
  cleaningFee: '10000.00',
  weeklyDiscountPercent: null,
  monthlyDiscountPercent: null,
  minNights: 3,
  maxNights: 10,
  checkInTime: '15:00',
  checkOutTime: '11:00',
  timezone: 'Africa/Lagos',
  houseRules: null,
  property: null,
  amenities: [],
  media: [],
  reviews: null,
};

describe('toPublicUnitsTab', () => {
  it('maps UI category ids to API tabs', () => {
    expect(toPublicUnitsTab('1-bedroom')).toBe('one_bedroom');
    expect(toPublicUnitsTab('events')).toBe('events_allowed');
    expect(toPublicUnitsTab('power')).toBe('power_24_7');
    expect(toPublicUnitsTab('all')).toBe('all');
  });

  it('passes through API tab values', () => {
    expect(toPublicUnitsTab('two_bedroom')).toBe('two_bedroom');
  });

  it('maps API tabs back to category ids', () => {
    expect(toCategoryId('one_bedroom')).toBe('1-bedroom');
    expect(toCategoryId('power_24_7')).toBe('power');
  });
});

describe('toAppMediaUrl', () => {
  it('rewrites absolute API media URLs onto the configured API origin', () => {
    expect(
      toAppMediaUrl(
        'http://localhost:4000/media/tenants/t1/units/u1/photos/p1/medium.webp',
      ),
    ).toBe('https://api-staging.sunmadeapartments.com/media/tenants/t1/units/u1/photos/p1/medium.webp');
  });

  it('leaves non-media URLs unchanged', () => {
    expect(toAppMediaUrl('https://images.unsplash.com/photo.jpg')).toBe(
      'https://images.unsplash.com/photo.jpg',
    );
  });
});

describe('mapPublicUnitToProperty', () => {
  it('maps browse cards into Property listing shape', () => {
    const property = mapPublicUnitToProperty(sample);

    expect(property.id).toBe('unit-1');
    expect(property.slug).toBe('unit-1');
    expect(property.pricing.nightly_rate).toBe(45000);
    expect(property.capacity.bathrooms).toBe(1);
    expect(property.address.display).toBe('Phase 1, Lekki, Lagos');
    expect(property.picture).toBe(
      'https://api-staging.sunmadeapartments.com/media/tenants/t1/units/unit-1/photos/p1/medium.webp',
    );
    expect(property.images[0]?.url).toBe(property.picture);
    expect(property.review_summary).toMatchObject({
      rating: 4.8,
      count: 3,
    });
  });

  it('defaults review summary when the API omits reviews', () => {
    const { reviews: _reviews, ...withoutReviews } = sample;
    const property = mapPublicUnitToProperty(withoutReviews);
    expect(property.review_summary).toMatchObject({ rating: 0, count: 0 });
  });
});

describe('mapPublicUnitDetailToProperty', () => {
  it('carries the effective stay limits onto the unit', () => {
    const { property } = mapPublicUnitDetailToProperty(detailSample);
    expect(property.units[0]?.stay_limits).toEqual({
      min_nights: 3,
      max_nights: 10,
    });
  });

  it('treats a null maximum as no upper limit', () => {
    const { property } = mapPublicUnitDetailToProperty({
      ...detailSample,
      minNights: 2,
      maxNights: null,
    });
    expect(property.units[0]?.stay_limits).toEqual({
      min_nights: 2,
      max_nights: null,
    });
  });

  it('defaults to one night with no maximum when the API omits limits', () => {
    const withoutLimits: Partial<PublicUnitDetail> = { ...detailSample };
    delete withoutLimits.minNights;
    delete withoutLimits.maxNights;
    const { property } = mapPublicUnitDetailToProperty(
      withoutLimits as PublicUnitDetail,
    );
    expect(property.units[0]?.stay_limits).toEqual({
      min_nights: 1,
      max_nights: null,
    });
  });

  it('defaults to one night when the API sends a null or non-positive minimum', () => {
    const fromNull = mapPublicUnitDetailToProperty({
      ...detailSample,
      minNights: null as unknown as number,
      maxNights: null,
    });
    const fromZero = mapPublicUnitDetailToProperty({
      ...detailSample,
      minNights: 0,
      maxNights: 0,
    });
    expect(fromNull.property.units[0]?.stay_limits.min_nights).toBe(1);
    expect(fromZero.property.units[0]?.stay_limits).toEqual({
      min_nights: 1,
      max_nights: null,
    });
  });

  it('never lets the maximum fall below the minimum', () => {
    const { property } = mapPublicUnitDetailToProperty({
      ...detailSample,
      minNights: 5,
      maxNights: 3,
    });
    expect(property.units[0]?.stay_limits).toEqual({
      min_nights: 5,
      max_nights: 5,
    });
  });
});
