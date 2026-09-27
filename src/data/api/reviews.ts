import { request } from '@/data/api/client';
import { reviews } from '@/data/mocks';
import type { Review } from '@/data/types';

export async function getReviewsByPropertyId(
  propertyId: string,
): Promise<Review[]> {
  return request(reviews.filter((review) => review.property_id === propertyId));
}
