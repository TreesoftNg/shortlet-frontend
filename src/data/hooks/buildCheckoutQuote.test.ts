import { DEMO_STAY } from '@/data/demo-stay';
import { buildCheckoutQuote } from '@/data/hooks';
import type { Property } from '@/data/types';
import { describe, expect, it } from 'vitest';

const property = {
  id: 'unit-1',
  slug: 'unit-1',
  name: 'Test loft',
  public_name: 'Test loft',
  picture: 'https://example.com/photo.webp',
  address: {
    number: null,
    street: null,
    city: 'Lagos',
    state: null,
    country: 'NG',
    postcode: null,
    coordinates: { latitude: 0, longitude: 0 },
    display: 'Lagos, NG',
  },
  timezone: '+0100',
  listed: true,
  amenities: [],
  description: '',
  summary: '',
  'check-in': '15:00',
  'check-out': '11:00',
  currency: 'NGN',
  capacity: { max: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
  room_details: [],
  house_rules: {
    pets_allowed: null,
    smoking_allowed: null,
    events_allowed: null,
  },
  listings: [],
  property_type: 'apartment',
  room_type: 'entire_home',
  neighborhood_id: 'lagos',
  featured: true,
  badges: [],
  images: [],
  units: [
    {
      id: 'unit-1',
      property_id: 'unit-1',
      code: 'A',
      name: 'Unit A',
      features: [],
      capacity: { max: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
      nightly_rate: 50000,
      currency: 'NGN',
      status: 'available',
    },
  ],
  pricing: {
    currency: 'NGN',
    nightly_rate: 50000,
    cleaning_fee: 10000,
    service_fee: 5000,
    caution_deposit: 25000,
  },
  review_summary: {
    rating: 4.8,
    count: 12,
    scores: {
      cleanliness: 5,
      accuracy: 5,
      check_in: 5,
      communication: 5,
      location: 4,
      value: 4,
    },
  },
  highlights: [],
  amenity_labels: [],
} satisfies Property;

describe('buildCheckoutQuote', () => {
  it('uses the selected unit nightly rate', () => {
    const unit = property.units[0]!;
    const quote = buildCheckoutQuote(property, unit.id);

    expect(quote.unit?.id).toBe(unit.id);
    expect(quote.nightly).toBe(unit.nightly_rate);
    expect(quote.nights).toBe(DEMO_STAY.nights);
    expect(quote.stay).toBe(unit.nightly_rate * DEMO_STAY.nights);
  });

  it('falls back to the first unit when id is missing', () => {
    const quote = buildCheckoutQuote(property, null);
    expect(quote.unit?.id).toBe(property.units[0]?.id);
  });

  it('totals stay + cleaning + service + deposit', () => {
    const quote = buildCheckoutQuote(property, property.units[0]!.id);
    expect(quote.total).toBe(
      quote.stay + quote.cleaning + quote.service + quote.tax + quote.deposit,
    );
  });
});
