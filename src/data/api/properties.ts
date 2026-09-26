import {
  neighborhoods,
  properties,
  reviews,
  websiteContent,
} from '@/data/mocks';
import type {
  Neighborhood,
  Property,
  Review,
  WebsiteContent,
} from '@/data/types';

/** Simulates network latency so React Query loading states can be exercised. */
const delay = (ms = 200) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export type PropertySort =
  | 'recommended'
  | 'price_asc'
  | 'price_desc'
  | 'rating';

export type PropertyListParams = {
  neighborhood?: string;
  featured?: boolean;
  guests?: number;
  tag?: string;
  minBedrooms?: number;
  amenities?: string[];
  sort?: PropertySort;
};

function matchesNeighborhood(property: Property, value: string): boolean {
  const q = value.toLowerCase();
  const nb = neighborhoods.find(
    (n) => n.id === value || n.slug === q || n.name.toLowerCase() === q,
  );

  if (nb) {
    return property.neighborhood_id === nb.id;
  }

  return (
    property.address.city.toLowerCase().includes(q) ||
    property.address.display.toLowerCase().includes(q) ||
    (property.address.street?.toLowerCase().includes(q) ?? false)
  );
}

export async function getWebsiteContent(): Promise<WebsiteContent> {
  await delay();
  return websiteContent;
}

export async function getNeighborhoods(): Promise<Neighborhood[]> {
  await delay();
  return neighborhoods;
}

export async function getNeighborhoodBySlug(
  slug: string,
): Promise<Neighborhood | null> {
  await delay();
  return neighborhoods.find((n) => n.slug === slug) ?? null;
}

export async function getProperties(
  params: PropertyListParams = {},
): Promise<Property[]> {
  await delay();

  let results = properties.filter((property) => {
    if (!property.listed) return false;
    if (params.featured && !property.featured) return false;
    if (params.neighborhood && !matchesNeighborhood(property, params.neighborhood)) {
      return false;
    }
    if (params.guests && (property.capacity.max ?? 0) < params.guests) {
      return false;
    }
    if (params.tag && params.tag !== 'all' && !property.tags?.includes(params.tag)) {
      return false;
    }
    if (
      params.minBedrooms != null &&
      (property.capacity.bedrooms ?? 0) < params.minBedrooms
    ) {
      return false;
    }
    if (params.amenities?.length) {
      const realAmenities = params.amenities.filter((a) => a !== '__power__');
      const wantsPower = params.amenities.includes('__power__');

      if (realAmenities.length) {
        const hasAll = realAmenities.every((amenity) =>
          property.amenities.includes(amenity),
        );
        if (!hasAll) return false;
      }

      if (wantsPower && !property.tags?.includes('power')) {
        return false;
      }
    }
    return true;
  });

  switch (params.sort) {
    case 'price_asc':
      results = [...results].sort(
        (a, b) => a.pricing.nightly_rate - b.pricing.nightly_rate,
      );
      break;
    case 'price_desc':
      results = [...results].sort(
        (a, b) => b.pricing.nightly_rate - a.pricing.nightly_rate,
      );
      break;
    case 'rating':
      results = [...results].sort(
        (a, b) => b.review_summary.rating - a.review_summary.rating,
      );
      break;
    default:
      results = [...results].sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.review_summary.rating - a.review_summary.rating;
      });
  }

  return results;
}

export async function getPropertyBySlug(
  slug: string,
): Promise<Property | null> {
  await delay();
  return properties.find((property) => property.slug === slug) ?? null;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  await delay();
  return properties.find((property) => property.id === id) ?? null;
}

export async function getReviewsByPropertyId(
  propertyId: string,
): Promise<Review[]> {
  await delay();
  return reviews.filter((review) => review.property_id === propertyId);
}
