import { getWebsiteContent } from '@/data/api/content';
import { buildWebsiteContent, formatAreaList } from '@/data/lib/brand-defaults';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/data/api/neighborhoods', () => ({
  getNeighborhoods: vi.fn(async () => [
    {
      id: 'ikeja',
      name: 'Ikeja',
      slug: 'ikeja',
      city: 'Ikeja',
      image: '/backend/media/ikeja.webp',
      property_count: 4,
    },
    {
      id: 'lekki',
      name: 'Lekki',
      slug: 'lekki',
      city: 'Lekki',
      image: '/backend/media/lekki.webp',
      property_count: 1,
    },
  ]),
}));

vi.mock('@/data/api/public-units', () => ({
  getPublicUnits: vi.fn(async () => ({
    items: [
      {
        id: 'u1',
        picture: '/backend/media/unit.webp',
      },
    ],
    meta: { page: 1, limit: 1, total: 1, totalPages: 1 },
  })),
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
      heroImage: '/backend/media/unit.webp',
    });
    expect(content.hero.subheadline).toContain('Ikeja & Lekki');
    expect(content.hero.image).toBe('/backend/media/unit.webp');
    expect(content.categories.length).toBeGreaterThan(0);
  });
});

describe('content api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('assembles website content from neighbourhoods and units', async () => {
    const content = await getWebsiteContent();
    expect(content.brand_name).toContain('Sunmade');
    expect(content.hero.subheadline).toContain('Ikeja');
    expect(content.hero.image).toBe('/backend/media/unit.webp');
  });
});
