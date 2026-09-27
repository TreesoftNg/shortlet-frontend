import { request } from '@/data/api/client';
import { neighborhoods } from '@/data/mocks';
import type { Neighborhood } from '@/data/types';

export async function getNeighborhoods(): Promise<Neighborhood[]> {
  return request(neighborhoods);
}

export async function getNeighborhoodBySlug(
  slug: string,
): Promise<Neighborhood | null> {
  return request(neighborhoods.find((n) => n.slug === slug) ?? null);
}
