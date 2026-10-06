import { toAppMediaUrl } from '@/data/lib/app-media-url';
import type { Property, PropertyImage, Review, Unit } from '@/data/types';
import type {
  PublicUnitCard,
  PublicUnitDetail,
  PublicUnitLocation,
  PublicUnitReviews,
} from '@/data/types/public-unit';

export type PublicUnitDetailMapped = {
  property: Property;
  reviews: Review[];
  /** Full house-rules text from the API (not truncated). */
  houseRules: string | null;
};

function toNumber(value: string | number | null | undefined, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function locationDisplay(loc: PublicUnitLocation | null | undefined): string {
  if (!loc) return '';
  if (loc.display) return loc.display;
  return [loc.neighbourhood, loc.city, loc.state].filter(Boolean).join(', ');
}

function mapLocation(loc: PublicUnitLocation | null | undefined) {
  const city = loc?.city ?? '';
  const state = loc?.state ?? null;
  const country = loc?.country ?? 'NG';
  const neighbourhood = loc?.neighbourhood ?? null;
  const display = locationDisplay(loc) || city;

  return {
    number: loc?.number ?? null,
    street: loc?.street ?? neighbourhood,
    city,
    state,
    country,
    postcode: loc?.zip ?? null,
    coordinates: {
      latitude: loc?.latitude ?? 0,
      longitude: loc?.longitude ?? 0,
    },
    display,
  };
}

function emptyReviewSummary() {
  return {
    rating: 0,
    count: 0,
    scores: {
      cleanliness: 0,
      accuracy: 0,
      check_in: 0,
      communication: 0,
      location: 0,
      value: 0,
    },
  };
}

function slugifyLocation(value: string | null | undefined): string {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Map a public unit browse card into the Property shape used by listing cards. */
export function mapPublicUnitToProperty(unit: PublicUnitCard): Property {
  const picture = toAppMediaUrl(unit.pictureUrl);
  const nightly = toNumber(unit.nightlyRate);
  const bathrooms = toNumber(unit.bathrooms);
  const neighborhoodId =
    slugifyLocation(unit.location?.neighbourhood) ||
    slugifyLocation(unit.location?.city);

  return {
    id: unit.id,
    slug: unit.id,
    name: unit.name,
    public_name: unit.name,
    picture,
    address: mapLocation(unit.location),
    timezone: '+0100',
    listed: true,
    amenities: [],
    description: unit.summary ?? '',
    summary: unit.summary ?? '',
    'check-in': '15:00',
    'check-out': '11:00',
    currency: unit.currency || 'NGN',
    capacity: {
      max: unit.guests,
      bedrooms: unit.bedrooms,
      beds: unit.beds,
      bathrooms,
    },
    room_details: [],
    house_rules: {
      pets_allowed: null,
      smoking_allowed: null,
      events_allowed: null,
    },
    listings: [],
    property_type: unit.propertyType,
    room_type: unit.roomType,
    neighborhood_id: neighborhoodId,
    featured: true,
    badges: [],
    images: picture
      ? [
          {
            id: `${unit.id}-primary`,
            url: picture,
            alt: unit.name,
            sort_order: 0,
            is_primary: true,
          },
        ]
      : [],
    units: [],
    pricing: {
      currency: unit.currency || 'NGN',
      nightly_rate: nightly,
      cleaning_fee: 0,
      service_fee: 0,
      caution_deposit: 0,
    },
    review_summary: emptyReviewSummary(),
    highlights: [],
    amenity_labels: [],
  };
}

function mapDetailImages(unit: PublicUnitDetail): PropertyImage[] {
  const photos = (unit.media ?? [])
    .filter((m) => m.kind === 'photo')
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (photos.length) {
    return photos.map((media, index) => {
      const url =
        toAppMediaUrl(media.sizes?.large) ||
        toAppMediaUrl(media.sizes?.medium) ||
        toAppMediaUrl(media.url);
      return {
        id: media.id,
        url,
        alt: media.altText || media.caption || unit.name,
        sort_order: media.sortOrder ?? index,
        is_primary: media.isCover || index === 0,
      };
    });
  }

  const picture = toAppMediaUrl(unit.pictureUrl);
  return picture
    ? [
        {
          id: `${unit.id}-primary`,
          url: picture,
          alt: unit.name,
          sort_order: 0,
          is_primary: true,
        },
      ]
    : [];
}

function mapDetailUnit(unit: PublicUnitDetail, nightly: number): Unit {
  const bathrooms = toNumber(unit.bathrooms);
  return {
    id: unit.id,
    property_id: unit.property?.id ?? unit.id,
    code: 'A',
    name: unit.name,
    floor: unit.floor,
    features: [],
    capacity: {
      max: unit.guests,
      bedrooms: unit.bedrooms,
      beds: unit.beds,
      bathrooms,
    },
    nightly_rate: nightly,
    currency: unit.currency || 'NGN',
    status: 'available',
  };
}

function mapReviews(
  unitId: string,
  reviews: PublicUnitReviews | null | undefined,
): { summary: ReturnType<typeof emptyReviewSummary>; items: Review[] } {
  const items = (reviews?.items ?? [])
    .filter((item) => item.status === 'published' || !item.status)
    .map((item) => ({
      id: item.id,
      property_id: unitId,
      author_name: item.guestFullName || item.guestFirstName || 'Guest',
      author_avatar: '',
      rating: toNumber(item.rating),
      body: typeof item.comment === 'string' ? item.comment : '',
      stayed_nights: 0,
      created_at: item.createdAt,
    }));

  const count = reviews?.totalCount ?? items.length;
  const rating =
    reviews?.averageRating != null
      ? toNumber(reviews.averageRating)
      : items.length
        ? items.reduce((sum, r) => sum + r.rating, 0) / items.length
        : 0;

  return {
    summary: {
      ...emptyReviewSummary(),
      rating,
      count,
    },
    items,
  };
}

/** Map GET /api/v1/public/units/:id into Property + reviews from the same payload. */
export function mapPublicUnitDetailToProperty(
  unit: PublicUnitDetail,
): PublicUnitDetailMapped {
  const images = mapDetailImages(unit);
  const picture =
    images.find((img) => img.is_primary)?.url ||
    images[0]?.url ||
    toAppMediaUrl(unit.pictureUrl);
  const nightly = toNumber(unit.nightlyRate);
  const bathrooms = toNumber(unit.bathrooms);
  const amenityLabels = (unit.amenities ?? []).map((a) => a.name);
  const summary = unit.summary || unit.property?.summary || '';
  const description =
    unit.description || unit.property?.description || summary;
  const { summary: reviewSummary, items: reviewItems } = mapReviews(
    unit.id,
    unit.reviews,
  );

  return {
    property: {
      id: unit.id,
      slug: unit.id,
      name: unit.name,
      public_name: unit.name,
      picture,
      address: mapLocation(unit.location),
      timezone: unit.timezone || 'Africa/Lagos',
      listed: true,
      amenities: amenityLabels.map((label) =>
        label.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      ),
      description,
      summary,
      'check-in': unit.checkInTime || '15:00',
      'check-out': unit.checkOutTime || '11:00',
      currency: unit.currency || 'NGN',
      capacity: {
        max: unit.guests,
        bedrooms: unit.bedrooms,
        beds: unit.beds,
        bathrooms,
      },
      room_details: [],
      house_rules: {
        pets_allowed: null,
        smoking_allowed: null,
        events_allowed: null,
      },
      listings: [],
      property_type: unit.propertyType,
      room_type: unit.roomType,
      neighborhood_id: unit.property?.slug ?? '',
      featured: true,
      badges: [],
      images,
      units: [mapDetailUnit(unit, nightly)],
      pricing: {
        currency: unit.currency || 'NGN',
        nightly_rate: nightly,
        cleaning_fee: toNumber(unit.cleaningFee),
        service_fee: 0,
        caution_deposit: 0,
      },
      review_summary: reviewSummary,
      highlights: unit.houseRules
        ? [
            {
              icon: 'clipboard-list',
              title: 'House rules',
              description: unit.houseRules.split('\n')[0] ?? unit.houseRules,
            },
          ]
        : [],
      amenity_labels: amenityLabels,
    },
    reviews: reviewItems,
    houseRules: unit.houseRules,
  };
}
