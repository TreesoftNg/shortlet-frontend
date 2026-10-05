/** Public browse card from GET /api/v1/public/units */

export type PublicUnitsTab =
  | 'all'
  | 'studios'
  | 'one_bedroom'
  | 'two_bedroom'
  | 'penthouses'
  | 'pool'
  | 'business'
  | 'events_allowed'
  | 'waterfront'
  | 'power_24_7';

export type PublicUnitLocation = {
  city: string | null;
  state: string | null;
  country: string | null;
  neighbourhood: string | null;
  display: string | null;
  number?: string | null;
  street?: string | null;
  line2?: string | null;
  zip?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type PublicUnitCard = {
  id: string;
  tenantId: string;
  name: string;
  summary: string | null;
  pictureUrl: string | null;
  propertyType: string | null;
  roomType: string | null;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: string | number;
  currency: string;
  nightlyRate: string | number;
  instantBook: boolean;
  location: PublicUnitLocation | null;
};

export type PublicUnitAmenity = {
  id: string;
  name: string;
  category: string | null;
};

export type PublicUnitMedia = {
  id: string;
  unitId: string;
  kind: string;
  sortOrder: number;
  isCover: boolean;
  caption: string | null;
  altText: string | null;
  url: string;
  thumbnailUrl: string | null;
  sizes: {
    thumb?: string;
    medium?: string;
    large?: string;
  } | null;
  width: number | null;
  height: number | null;
};

export type PublicUnitPropertyRef = {
  id: string;
  name: string;
  slug: string | null;
  summary: string | null;
  description: string | null;
};

export type PublicUnitReviewItem = {
  id: string;
  bookingId: string;
  unitId: string;
  unitName: string;
  customerId: string;
  guestFirstName: string;
  guestLastName: string;
  guestFullName: string;
  guestEmail: string;
  rating: number;
  comment: string | null;
  status: string;
  adminResponse: string | null;
  respondedAt: string | null;
  canRespond: boolean;
  createdAt: string;
};

export type PublicUnitReviews = {
  averageRating: number | null;
  totalCount: number;
  items: PublicUnitReviewItem[];
};

/** Full stay from GET /api/v1/public/units/:id */
export type PublicUnitDetail = PublicUnitCard & {
  description: string | null;
  floor: string | null;
  cleaningFee: string | number | null;
  weeklyDiscountPercent: string | number | null;
  monthlyDiscountPercent: string | number | null;
  minNights: number | null;
  maxNights: number | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  timezone: string | null;
  houseRules: string | null;
  property: PublicUnitPropertyRef | null;
  amenities: PublicUnitAmenity[];
  media: PublicUnitMedia[];
  reviews?: PublicUnitReviews | null;
};

export type PublicUnitsListMeta = {
  requestId?: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PublicUnitsListResult = {
  items: PublicUnitCard[];
  meta: PublicUnitsListMeta;
};
