import { http } from '@/data/api/http';
import { toAppMediaUrl } from '@/data/lib/app-media-url';
import type { Neighborhood } from '@/data/types';

export type PublicNeighbourhood = {
  name: string;
  slug: string;
  city: string;
  unitCount: number;
  pictureUrl: string | null;
};

export function mapPublicNeighbourhood(
  item: PublicNeighbourhood,
): Neighborhood {
  return {
    id: item.slug,
    name: item.name,
    slug: item.slug,
    city: item.city,
    image: toAppMediaUrl(item.pictureUrl),
    property_count: item.unitCount ?? 0,
  };
}

/** GET /api/v1/public/neighbourhoods */
export async function getNeighborhoods(): Promise<Neighborhood[]> {
  const items = await http<PublicNeighbourhood[]>(
    '/api/v1/public/neighbourhoods',
  );
  return (Array.isArray(items) ? items : []).map(mapPublicNeighbourhood);
}

/** Resolve one neighbourhood from the public list by slug. */
export async function getNeighborhoodBySlug(
  slug: string,
): Promise<Neighborhood | null> {
  if (!slug) return null;
  const list = await getNeighborhoods();
  return list.find((n) => n.slug === slug) ?? null;
}
