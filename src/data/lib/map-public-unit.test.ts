import { toAppMediaUrl } from '@/data/lib/app-media-url';
import { mapPublicUnitToProperty } from '@/data/lib/map-public-unit';
import { toCategoryId, toPublicUnitsTab } from '@/data/lib/public-unit-tabs';
import type { PublicUnitCard } from '@/data/types/public-unit';
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
  it('rewrites absolute API media URLs through /backend', () => {
    expect(
      toAppMediaUrl(
        'http://localhost:4000/media/tenants/t1/units/u1/photos/p1/medium.webp',
      ),
    ).toBe('/backend/media/tenants/t1/units/u1/photos/p1/medium.webp');
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
      '/backend/media/tenants/t1/units/unit-1/photos/p1/medium.webp',
    );
    expect(property.images[0]?.url).toBe(property.picture);
  });
});
