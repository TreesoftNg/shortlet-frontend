/** POST /api/v1/reviews — CreateReviewDto */
export type CreateReviewInput = {
  bookingId: string;
  unitId: string;
  rating: number;
  comment?: string;
};

/** ReviewListItemDto from POST /api/v1/reviews */
export type CustomerReview = {
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
  status: 'pending' | 'published' | 'hidden' | string;
  adminResponse: string | null;
  respondedAt: string | null;
  canRespond: boolean;
  createdAt: string;
};
