import { getNeighborhoods } from '@/data/api/neighborhoods';
import { getPublicUnits } from '@/data/api/public-units';
import { buildWebsiteContent } from '@/data/lib/brand-defaults';
import type { WebsiteContent } from '@/data/types';

/**
 * Assemble homepage/about content from live public APIs.
 * Staging has no CMS/website endpoint yet — neighbourhoods + units drive the copy.
 */
export async function getWebsiteContent(): Promise<WebsiteContent> {
  const [neighborhoods, unitsPage] = await Promise.all([
    getNeighborhoods(),
    getPublicUnits({ tab: 'all', limit: 1 }),
  ]);

  const heroImage =
    unitsPage.items[0]?.picture ||
    neighborhoods.find((n) => n.image)?.image ||
    null;

  return buildWebsiteContent({
    areaNames: neighborhoods.map((n) => n.name || n.city),
    heroImage,
  });
}
