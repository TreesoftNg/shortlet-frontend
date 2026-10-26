import {
  ApiError,
  apiFieldErrors,
  http,
  httpWithMeta,
  unwrapApiData,
} from '@/data/api/http';
import { afterEach, describe, expect, it, vi } from 'vitest';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('http client', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('unwraps a success envelope', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: { accessToken: 'tok' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await http<{ accessToken: string }>('/api/v1/login', {
      body: { email: 'a@b.com', password: 'x' },
    });

    expect(result.accessToken).toBe('tok');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api-staging.sunmadeapartments.com/api/v1/login',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-tenant-slug': 'sunmade',
        }),
      }),
    );
  });

  it('throws ApiError from the staging error envelope', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            success: false,
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'Email or password is incorrect',
            },
            meta: { requestId: 'req-1' },
          },
          401,
        ),
      ),
    );

    await expect(
      http('/api/v1/login', { body: { email: 'a', password: 'b' } }),
    ).rejects.toMatchObject({
      name: 'ApiError',
      code: 'INVALID_CREDENTIALS',
      status: 401,
      message: 'Email or password is incorrect',
      requestId: 'req-1',
    });
  });

  it('keeps list meta on success envelopes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          success: true,
          data: [{ id: '1' }],
          meta: { page: 2, limit: 12, total: 24, totalPages: 2 },
        }),
      ),
    );

    await expect(httpWithMeta('/api/v1/public/units')).resolves.toEqual({
      data: [{ id: '1' }],
      meta: { page: 2, limit: 12, total: 24, totalPages: 2 },
    });
  });

  it('unwraps nested data payloads', () => {
    expect(unwrapApiData({ success: true, data: { id: '1' } })).toEqual({
      id: '1',
    });
  });

  it('is an ApiError instance', () => {
    const error = new ApiError({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'bad',
    });
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
  });
});

describe('apiFieldErrors', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps the field messages from a validation error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'The request contains invalid data',
              details: {
                fields: {
                  checkOut: ['This unit needs a stay of at least 3 nights'],
                  adults: ['', 42],
                },
              },
            },
          },
          400,
        ),
      ),
    );

    const error = await http('/api/v1/units/u1/quote').catch(
      (caught: unknown) => caught,
    );

    expect(apiFieldErrors(error)).toEqual({
      checkOut: ['This unit needs a stay of at least 3 nights'],
    });
  });

  it('is empty when the error carries no field details', () => {
    expect(
      apiFieldErrors(
        new ApiError({ status: 409, code: 'CONFLICT', message: 'Taken' }),
      ),
    ).toEqual({});
    expect(
      apiFieldErrors(
        new ApiError({
          status: 400,
          code: 'VALIDATION_ERROR',
          message: 'bad',
          details: { fields: 'checkOut' },
        }),
      ),
    ).toEqual({});
    expect(apiFieldErrors(new Error('network'))).toEqual({});
    expect(apiFieldErrors(null)).toEqual({});
  });
});
