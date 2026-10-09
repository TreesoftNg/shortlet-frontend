import { getWebsiteContent } from '@/data/api/content';
import {
  BRAND_DEFAULTS,
  buildWebsiteContent,
  formatAreaList,
} from '@/data/lib/brand-defaults';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/data/api/neighborhoods', () => ({
  getNeighborhoods: vi.fn(async () => [
    {
      id: 'ikeja',
      name: 'Ikeja',
      slug: 'ikeja',
      city: 'Ikeja',
      image: 'https://api-staging.sunmadeapartments.com/media/ikeja.webp',
      property_count: 4,
    },
    {
      id: 'lekki',
      name: 'Lekki',
      slug: 'lekki',
      city: 'Lekki',
      image: 'https://api-staging.sunmadeapartments.com/media/lekki.webp',
      property_count: 1,
    },
  ]),
}));

describe('brand defaults', () => {
  it('formats area lists for copy', () => {
    expect(formatAreaList(['Ikeja'])).toBe('Ikeja');
    expect(formatAreaList(['Ikeja', 'Lekki'])).toBe('Ikeja & Lekki');
    expect(formatAreaList(['Ikeja', 'Lagos', 'Lekki'])).toBe(
      'Ikeja, Lagos & Lekki',
    );
  });

  it('builds website content from live areas', () => {
    const content = buildWebsiteContent({
      areaNames: ['Ikeja', 'Lekki'],
      heroImage: 'https://api-staging.sunmadeapartments.com/media/unit.webp',
    });
    expect(content.hero.subheadline).toContain('Ikeja & Lekki');
    expect(content.hero.image).toBe('https://api-staging.sunmadeapartments.com/media/unit.webp');
    expect(content.categories.length).toBeGreaterThan(0);
  });
});

describe('content api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('keeps the brand hero image and uses live neighbourhood names', async () => {
    const content = await getWebsiteContent();
    expect(content.brand_name).toContain('Sunmade');
    expect(content.hero.subheadline).toContain('Ikeja');
    expect(content.hero.image).toBe(BRAND_DEFAULTS.hero.fallbackImage);
  });
});
