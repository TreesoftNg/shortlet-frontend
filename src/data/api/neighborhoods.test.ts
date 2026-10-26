import {
  getNeighborhoodBySlug,
  getNeighborhoods,
  mapPublicNeighbourhood,
} from '@/data/api/neighborhoods';
import { afterEach, describe, expect, it, vi } from 'vitest';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('neighborhoods api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps public neighbourhood cards', () => {
    expect(
      mapPublicNeighbourhood({
        name: 'Lekki',
        slug: 'lekki',
        city: 'Lekki',
        unitCount: 1,
        pictureUrl: 'http://localhost:4000/media/lekki.webp',
      }),
    ).toEqual({
      id: 'lekki',
      name: 'Lekki',
      slug: 'lekki',
      city: 'Lekki',
      image: 'https://api-staging.sunmadeapartments.com/media/lekki.webp',
      property_count: 1,
    });
  });

  it('fetches neighbourhoods from the public API', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: [
          {
            name: 'Ikeja',
            slug: 'ikeja',
            city: 'Ikeja',
            unitCount: 4,
            pictureUrl: 'http://localhost:4000/media/ikeja.webp',
          },
        ],
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const list = await getNeighborhoods();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api-staging.sunmadeapartments.com/api/v1/public/neighbourhoods',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(list).toHaveLength(1);
    expect(list[0]?.name).toBe('Ikeja');
    expect(list[0]?.property_count).toBe(4);
    expect(list[0]?.image).toBe('https://api-staging.sunmadeapartments.com/media/ikeja.webp');
  });

  it('finds a neighbourhood by slug', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() =>
        Promise.resolve(
          jsonResponse({
            success: true,
            data: [
              {
                name: 'Lagos',
                slug: 'lagos',
                city: 'Lagos',
                unitCount: 1,
                pictureUrl: null,
              },
            ],
          }),
        ),
      ),
    );

    await expect(getNeighborhoodBySlug('lagos')).resolves.toMatchObject({
      slug: 'lagos',
      name: 'Lagos',
    });
    await expect(getNeighborhoodBySlug('missing')).resolves.toBeNull();
  });
});
