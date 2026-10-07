import {
  createCustomerReview,
  mapCustomerReview,
} from '@/data/api/reviews';
import { afterEach, describe, expect, it, vi } from 'vitest';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('mapCustomerReview', () => {
  it('maps ReviewListItemDto fields and string comment', () => {
    const review = mapCustomerReview({
      id: 'rev-1',
      bookingId: 'bk-1',
      unitId: 'unit-1',
      unitName: 'Studio',
      customerId: 'cust-1',
      guestFirstName: 'Ada',
      guestLastName: 'Okafor',
      guestFullName: 'Ada Okafor',
      guestEmail: 'ada@example.com',
      rating: 5,
      comment: 'Great stay',
      status: 'pending',
      adminResponse: null,
      respondedAt: null,
      canRespond: true,
      createdAt: '2026-10-04T14:00:00.000Z',
    });

    expect(review.id).toBe('rev-1');
    expect(review.rating).toBe(5);
    expect(review.comment).toBe('Great stay');
    expect(review.status).toBe('pending');
  });

  it('coerces non-string comment to null', () => {
    expect(mapCustomerReview({ comment: { text: 'x' } }).comment).toBeNull();
  });
});

describe('createCustomerReview', () => {
  it('POSTs CreateReviewDto and unwraps enveloped data', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          success: true,
          data: {
            id: 'rev-9',
            bookingId: 'bk-9',
            unitId: 'unit-9',
            unitName: 'Loft',
            customerId: 'c-9',
            guestFirstName: 'Temi',
            guestLastName: 'A',
            guestFullName: 'Temi A',
            guestEmail: 'temi@example.com',
            rating: 4,
            comment: 'Solid',
            status: 'pending',
            adminResponse: null,
            respondedAt: null,
            canRespond: true,
            createdAt: '2026-10-07T10:00:00.000Z',
          },
        },
        201,
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const review = await createCustomerReview(
      {
        bookingId: 'bk-9',
        unitId: 'unit-9',
        rating: 4,
        comment: '  Solid  ',
      },
      'access-token',
    );

    expect(review.id).toBe('rev-9');
    expect(review.status).toBe('pending');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/v1/reviews');
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer access-token',
    });
    expect(JSON.parse(String(init.body))).toEqual({
      bookingId: 'bk-9',
      unitId: 'unit-9',
      rating: 4,
      comment: 'Solid',
    });
  });

  it('omits empty comment from the body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          id: 'rev-2',
          bookingId: 'bk-2',
          unitId: 'unit-2',
          unitName: 'A',
          customerId: 'c',
          guestFirstName: 'A',
          guestLastName: 'B',
          guestFullName: 'A B',
          guestEmail: 'a@b.com',
          rating: 5,
          comment: null,
          status: 'pending',
          adminResponse: null,
          respondedAt: null,
          canRespond: true,
          createdAt: '2026-10-07T10:00:00.000Z',
        },
        201,
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await createCustomerReview(
      { bookingId: 'bk-2', unitId: 'unit-2', rating: 5, comment: '   ' },
      'tok',
    );

    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual({
      bookingId: 'bk-2',
      unitId: 'unit-2',
      rating: 5,
    });
  });
});
