import { getNeighborhoods } from '@/data/api/neighborhoods';
import { buildWebsiteContent } from '@/data/lib/brand-defaults';
import type { WebsiteContent } from '@/data/types';

/**
 * Assemble homepage/about content from live public APIs.
 * Staging has no CMS/website endpoint yet — neighbourhoods drive the area copy.
 * Hero image stays the brand hero (not a random unit thumbnail).
 */
export async function getWebsiteContent(): Promise<WebsiteContent> {
  const neighborhoods = await getNeighborhoods();

  return buildWebsiteContent({
    areaNames: neighborhoods.map((n) => n.name || n.city),
    // Keep the former brand hero; unit/neighbourhood photos are for listings.
    heroImage: null,
  });
}
