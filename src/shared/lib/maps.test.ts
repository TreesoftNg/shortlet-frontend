import { directionsUrl, googleMapsSearchUrl } from '@/shared/lib/maps';
import { describe, expect, it } from 'vitest';

describe('googleMapsSearchUrl', () => {
  it('searches Google Maps for the address', () => {
    expect(googleMapsSearchUrl('5 Admiralty Way, Lekki, Lagos')).toBe(
      'https://www.google.com/maps/search/?api=1&query=5%20Admiralty%20Way%2C%20Lekki%2C%20Lagos',
    );
  });

  it('encodes characters that would break the link', () => {
    expect(googleMapsSearchUrl('  Block 3 & 4, Ikeja #2  ')).toBe(
      'https://www.google.com/maps/search/?api=1&query=Block%203%20%26%204%2C%20Ikeja%20%232',
    );
  });

  it.each([null, undefined, '', '   '])('gives no link for %j', (query) => {
    expect(googleMapsSearchUrl(query)).toBeNull();
  });
});

describe('directionsUrl', () => {
  it("uses the booking's address", () => {
    expect(directionsUrl({ address: '12 Isaac John Street, Ikeja, Lagos' })).toBe(
      'https://www.google.com/maps/search/?api=1&query=12%20Isaac%20John%20Street%2C%20Ikeja%2C%20Lagos',
    );
    expect(directionsUrl({ address: null })).toBeNull();
  });
});
