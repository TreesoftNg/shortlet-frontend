import { getPublicUnitById, getPublicUnits } from '@/data/api/public-units';
import { afterEach, describe, expect, it, vi } from 'vitest';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('public units api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches units with tab filter and maps cards', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: [
          {
            id: 'u1',
            tenantId: 't1',
            name: 'Studio One',
            summary: null,
            pictureUrl: null,
            propertyType: 'apartment',
            roomType: null,
            guests: 2,
            bedrooms: 0,
            beds: 1,
            bathrooms: '1.0',
            currency: 'NGN',
            nightlyRate: '40000.00',
            instantBook: true,
            location: {
              city: 'Ikeja',
              state: 'Lagos',
              country: 'NG',
              neighbourhood: null,
              display: 'Ikeja, Lagos',
            },
          },
        ],
        meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const page = await getPublicUnits({ tab: 'all', limit: 4 });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api-staging.sunmadeapartments.com/api/v1/public/units?tab=all&limit=4',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(page.items).toHaveLength(1);
    expect(page.items[0]?.name).toBe('Studio One');
    expect(page.items[0]?.pricing.nightly_rate).toBe(40000);
    expect(page.meta).toMatchObject({
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    });
  });

  it('loads a later page', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: [],
        meta: { page: 2, limit: 4, total: 30, totalPages: 3 },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const page = await getPublicUnits({ tab: 'all', page: 2, limit: 4 });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api-staging.sunmadeapartments.com/api/v1/public/units?tab=all&page=2&limit=4',
      expect.anything(),
    );
    expect(page.meta.page).toBe(2);
    expect(page.meta.totalPages).toBe(3);
    expect(page.items).toEqual([]);
  });

  it('maps UI category ids into API tab query values', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ success: true, data: [] }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await getPublicUnits({ tab: '1-bedroom' });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api-staging.sunmadeapartments.com/api/v1/public/units?tab=one_bedroom',
      expect.anything(),
    );
  });

  it('fetches a single unit by id', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          id: 'aa84b9c6-b348-4cf9-8597-88e3f79119b0',
          tenantId: 't1',
          name: 'Charming 1bedroom',
          summary: 'Near Lekki',
          description: 'Family-friendly stay',
          pictureUrl: 'http://localhost:4000/media/cover.webp',
          propertyType: 'serviced_apartment',
          roomType: 'Entire Home',
          floor: null,
          guests: 2,
          bedrooms: 1,
          beds: 1,
          bathrooms: '1.0',
          currency: 'NGN',
          nightlyRate: '75000.00',
          cleaningFee: '15000.00',
          weeklyDiscountPercent: null,
          monthlyDiscountPercent: null,
          minNights: 1,
          maxNights: null,
          checkInTime: '15:00',
          checkOutTime: '11:00',
          timezone: 'Africa/Lagos',
          instantBook: true,
          houseRules: 'No smoking.\nNo parties.',
          location: {
            city: 'Lagos',
            state: 'Lagos',
            country: 'NG',
            neighbourhood: null,
            display: null,
          },
          property: {
            id: 'prop-1',
            name: 'Sunmade Lekki',
            slug: 'sunmade-lekki',
            summary: null,
            description: null,
          },
          amenities: [
            { id: 'a1', name: 'Wi-Fi', category: 'Essentials' },
            { id: 'a2', name: 'Pool', category: 'Building' },
          ],
          media: [
            {
              id: 'm1',
              unitId: 'aa84b9c6-b348-4cf9-8597-88e3f79119b0',
              kind: 'photo',
              sortOrder: 0,
              isCover: true,
              caption: null,
              altText: null,
              url: 'http://localhost:4000/media/master.jpg',
              thumbnailUrl: null,
              sizes: {
                medium: 'http://localhost:4000/media/medium.webp',
                large: 'http://localhost:4000/media/large.webp',
              },
              width: 2000,
              height: 1334,
            },
          ],
          reviews: {
            averageRating: 5,
            totalCount: 1,
            items: [
              {
                id: 'r1',
                bookingId: 'b1',
                unitId: 'aa84b9c6-b348-4cf9-8597-88e3f79119b0',
                unitName: 'Charming 1bedroom',
                customerId: 'c1',
                guestFirstName: 'Ada',
                guestLastName: 'Okafor',
                guestFullName: 'Ada Okafor',
                guestEmail: 'ada@example.com',
                rating: 5,
                comment: 'Lovely stay',
                status: 'published',
                adminResponse: null,
                respondedAt: null,
                canRespond: false,
                createdAt: '2026-09-01T12:00:00.000Z',
              },
            ],
          },
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const detail = await getPublicUnitById(
      'aa84b9c6-b348-4cf9-8597-88e3f79119b0',
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api-staging.sunmadeapartments.com/api/v1/public/units/aa84b9c6-b348-4cf9-8597-88e3f79119b0',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(detail?.property.name).toBe('Charming 1bedroom');
    expect(detail?.property.pricing.nightly_rate).toBe(75000);
    expect(detail?.property.pricing.cleaning_fee).toBe(15000);
    expect(detail?.property.amenity_labels).toEqual(['Wi-Fi', 'Pool']);
    expect(detail?.property.images[0]?.url).toBe('https://api-staging.sunmadeapartments.com/media/large.webp');
    expect(detail?.property.units).toHaveLength(1);
    expect(detail?.property.review_summary).toEqual(
      expect.objectContaining({ rating: 5, count: 1 }),
    );
    expect(detail?.reviews).toHaveLength(1);
    expect(detail?.reviews[0]?.author_name).toBe('Ada Okafor');
    expect(detail?.reviews[0]?.body).toBe('Lovely stay');
  });

  it('returns null when the unit is missing', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          success: false,
          error: { code: 'RESOURCE_NOT_FOUND', message: 'Not found' },
        },
        404,
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(getPublicUnitById('missing-id')).resolves.toBeNull();
  });
});
