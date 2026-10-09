export type BookingStatus =
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'pending'
  | 'expired'
  | 'checked_in';

export type TripTab = 'upcoming' | 'past' | 'cancelled';

export type Booking = {
  id: string;
  reference: string;
  property_id: string;
  /** Unit id for POST /api/v1/reviews (CreateReviewDto.unitId). */
  unit_id: string;
  property_slug: string;
  property_name: string;
  property_image: string;
  unit_label: string | null;
  location_label: string;
  city_label: string;
  check_in: string;
  check_out: string;
  check_in_label: string;
  check_out_label: string;
  dates_range_label: string;
  guests: number;
  nights: number;
  status: BookingStatus;
  amount_paid: number;
  currency: string;
  your_rating: number | null;
  review_pending: boolean;
  countdown_label: string | null;
  /** Open Flutterwave checkout while the hold is still active. */
  checkout_url: string | null;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  special_requests: string | null;
  hold_expires_at: string | null;
  cancellation_reason: string | null;
};
