import { http } from '@/data/api/http';
import type {
  CreateReviewInput,
  CustomerReview,
} from '@/data/types/review-api';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asNullableString(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === 'string') return value;
  return null;
}

/** Normalise ReviewListItemDto (comment/adminResponse may be loose in OpenAPI). */
export function mapCustomerReview(payload: unknown): CustomerReview {
  const record = isRecord(payload) ? payload : {};
  return {
    id: String(record.id ?? ''),
    bookingId: String(record.bookingId ?? ''),
    unitId: String(record.unitId ?? ''),
    unitName: String(record.unitName ?? ''),
    customerId: String(record.customerId ?? ''),
    guestFirstName: String(record.guestFirstName ?? ''),
    guestLastName: String(record.guestLastName ?? ''),
    guestFullName: String(record.guestFullName ?? ''),
    guestEmail: String(record.guestEmail ?? ''),
    rating: Number(record.rating) || 0,
    comment: asNullableString(record.comment),
    status: String(record.status ?? 'pending'),
    adminResponse: asNullableString(record.adminResponse),
    respondedAt: asNullableString(record.respondedAt),
    canRespond: Boolean(record.canRespond),
    createdAt: String(record.createdAt ?? ''),
  };
}

/**
 * POST /api/v1/reviews — one review per completed booking (customer bearer).
 * Response: ReviewListItemDto (usually status `pending` until staff publish).
 */
export async function createCustomerReview(
  input: CreateReviewInput,
  accessToken: string,
): Promise<CustomerReview> {
  const comment = input.comment?.trim();
  const body: CreateReviewInput = {
    bookingId: input.bookingId,
    unitId: input.unitId,
    rating: input.rating,
    ...(comment ? { comment } : {}),
  };

  const payload = await http<unknown>('/api/v1/reviews', {
    body,
    token: accessToken,
  });
  return mapCustomerReview(payload);
}

export type { CreateReviewInput, CustomerReview };
