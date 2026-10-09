/** DTOs for customer/guest Booking APIs — see Booking tag in API docs. */

export type BookingGuestInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type CreateBookingInput = {
  returnUrl: string;
  unitId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  infants?: number;
  guest: BookingGuestInput;
  specialRequests?: string | null;
  acceptHouseRules: true;
  expectedTotal: number;
};

export type BookingQuoteGuests = {
  adults: number;
  children: number;
  infants: number;
};

export type BookingQuotePrice = {
  currency: string;
  nights: number;
  nightsSubtotal: string | number;
  cleaningFee: string | number;
  serviceFee?: { percent?: string | number; amount?: string | number } | null;
  tax?: {
    name?: string;
    percent?: string | number;
    amount?: string | number;
  } | null;
  discount?: { amount?: string | number; label?: string } | null;
  total: string | number;
  nightly?: Array<{ date: string; rate: string | number }>;
};

export type BookingQuoteDeposit = {
  nights?: number;
  nightlyRate?: string | number;
  amount: string | number;
};

export type BookingQuote = {
  unitId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: BookingQuoteGuests;
  currency: string;
  price: BookingQuotePrice;
  deposit: BookingQuoteDeposit;
  totalDueNow: string | number;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  houseRules?: string | null;
};

export type BookingCheckoutInfo = {
  checkoutUrl?: string | null;
  paymentReference?: string | null;
  paymentId?: string | null;
  reference?: string | null;
  expiresAt?: string | null;
  /** Server-authoritative amount to charge (preferred over client quote). */
  amount?: string | number | null;
  totalDueNow?: string | number | null;
  currency?: string | null;
};

/** Flexible booking payload from create / get / me list. */
export type ApiBooking = {
  id?: string;
  reference?: string | null;
  status?: string | null;
  accessToken?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  nights?: number | null;
  guests?: number | BookingQuoteGuests | null;
  adults?: number | null;
  currency?: string | null;
  amountPaid?: string | number | null;
  totalPaid?: string | number | null;
  totalDueNow?: string | number | null;
  expectedTotal?: string | number | null;
  /** Live create-booking payload uses totalAmount for amount due. */
  totalAmount?: string | number | null;
  stayTotal?: string | number | null;
  price?: BookingQuotePrice | null;
  deposit?: BookingQuoteDeposit | null;
  unitId?: string | null;
  unit?: {
    id?: string;
    name?: string | null;
    pictureUrl?: string | null;
    location?: {
      city?: string | null;
      display?: string | null;
      neighbourhood?: string | null;
    } | null;
  } | null;
  property?: {
    id?: string;
    name?: string | null;
    slug?: string | null;
  } | null;
  checkout?: BookingCheckoutInfo | null;
  latestPayment?: {
    id?: string;
    status?: string | null;
    checkoutUrl?: string | null;
  } | null;
  guest?: BookingGuestInput | null;
  yourRating?: number | null;
  reviewPending?: boolean | null;
};

export type CreateBookingResult = ApiBooking & {
  accessToken?: string | null;
  checkout?: BookingCheckoutInfo | null;
};

export type VerifyBookingPaymentInput = {
  transactionId?: string;
};

export type CancelBookingInput = {
  reason?: string;
};
