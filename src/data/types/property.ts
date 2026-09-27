import type { HospitableProperty } from './hospitable';

/** Bookable inventory under a property (PRD Unit). */
export type UnitStatus = 'available' | 'unavailable' | 'maintenance';

export type Unit = {
  id: string;
  property_id: string;
  code: string;
  name: string;
  floor?: string | null;
  view?: string | null;
  features: string[];
  capacity: {
    max: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  nightly_rate: number;
  currency: string;
  status: UnitStatus;
};

export type PropertyImage = {
  id: string;
  url: string;
  alt: string;
  sort_order: number;
  is_primary: boolean;
};

export type PropertyBadge = 'guest_favourite' | 'new' | 'only_1_left';

export type PropertyHighlight = {
  icon: string;
  title: string;
  description: string;
};

export type PricingSummary = {
  currency: string;
  nightly_rate: number;
  cleaning_fee: number;
  service_fee: number;
  caution_deposit: number;
};

export type ReviewCategoryScores = {
  cleanliness: number;
  accuracy: number;
  check_in: number;
  communication: number;
  location: number;
  value: number;
};

export type ReviewSummary = {
  rating: number;
  count: number;
  scores: ReviewCategoryScores;
};

export type Review = {
  id: string;
  property_id: string;
  author_name: string;
  author_avatar: string;
  rating: number;
  body: string;
  stayed_nights: number;
  created_at: string;
};

/**
 * Website property = Hospitable property fields + Sunmade booking UI fields.
 * Hospitable core stays untouched for future API / Airbnb sync.
 */
export type Property = HospitableProperty & {
  slug: string;
  neighborhood_id: string;
  featured: boolean;
  badges: PropertyBadge[];
  images: PropertyImage[];
  units: Unit[];
  pricing: PricingSummary;
  review_summary: ReviewSummary;
  highlights: PropertyHighlight[];
  amenity_labels: string[];
};

export type Neighborhood = {
  id: string;
  name: string;
  slug: string;
  city: string;
  image: string;
  property_count: number;
};

export type WebsiteContent = {
  brand_name: string;
  hero: {
    headline: string;
    subheadline: string;
    image: string;
  };
  trust: {
    title: string;
    subtitle: string;
    items: { icon: string; title: string; description: string }[];
  };
  categories: { id: string; label: string; icon: string }[];
  currency: string;
  currency_symbol: string;
};
