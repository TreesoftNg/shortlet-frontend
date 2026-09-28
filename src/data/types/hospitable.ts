/**
 * Hospitable Public API v2 shapes.
 * Field names match https://public.api.hospitable.com/v2 where possible
 * so property sync / Airbnb listing mapping stays 1:1 later.
 */

export type HospitablePlatform =
  | 'airbnb'
  | 'vrbo'
  | 'booking'
  | 'direct'
  | 'homeaway'
  | 'google';

export type HospitableCoordinates = {
  latitude: number;
  longitude: number;
};

export type HospitableAddress = {
  number: string | null;
  street: string | null;
  city: string;
  state: string | null;
  country: string;
  postcode: string | null;
  coordinates: HospitableCoordinates;
  display: string;
};

export type HospitableCapacity = {
  max: number | null;
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
};

export type HospitableRoomDetail = {
  type: string;
  quantity: number;
};

export type HospitableHouseRules = {
  pets_allowed: boolean | null;
  smoking_allowed: boolean | null;
  events_allowed: boolean | null;
};

export type HospitableCoHost = {
  user_id: string;
  channel_name: string;
};

/** Channel listing (Airbnb / VRBO / etc.) attached to a Hospitable property. */
export type HospitableListing = {
  platform: HospitablePlatform;
  platform_id: string;
  platform_user_id?: string | null;
  platform_name?: string | null;
  platform_email?: string | null;
  co_hosts?: HospitableCoHost[];
};

/**
 * Core property object returned by Hospitable GET /v2/properties/:id
 * (and items inside search / list responses under `data`).
 */
export type HospitableProperty = {
  id: string;
  name: string;
  public_name: string;
  picture: string;
  address: HospitableAddress;
  timezone: string;
  listed: boolean;
  amenities: string[];
  description: string;
  summary: string;
  /** Hospitable uses hyphenated keys for check times. */
  'check-in': string;
  'check-out': string;
  currency: string;
  capacity: HospitableCapacity;
  room_details: HospitableRoomDetail[];
  house_rules: HospitableHouseRules;
  listings: HospitableListing[];
  tags?: string[];
  property_type?: string | null;
  room_type?: string | null;
  calendar_restricted?: boolean;
};
