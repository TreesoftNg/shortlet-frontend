import { describe, expect, it, vi, afterEach } from 'vitest';
import { joinWaitlist, WaitlistApiError } from './join-waitlist';

describe('joinWaitlist', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('posts email with coming-soon source and tenant slug header', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:4000');
    vi.stubEnv('NEXT_PUBLIC_TENANT_SLUG', 'sunmade');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 202,
      json: async () => ({
        success: true,
        data: null,
        message: 'You’re on the waitlist.',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await joinWaitlist('  Guest@Example.com ');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4000/api/v1/public/waitlist',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'X-Tenant-Slug': 'sunmade',
        }),
        body: JSON.stringify({
          email: 'guest@example.com',
          source: 'coming-soon',
        }),
      }),
    );
    expect(result.message).toBe('You’re on the waitlist.');
  });

  it('throws WaitlistApiError on API failure', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:4000');
    vi.stubEnv('NEXT_PUBLIC_TENANT_SLUG', 'sunmade');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({
          success: false,
          error: { code: 'RATE_LIMITED', message: 'Too many requests' },
        }),
      }),
    );

    await expect(joinWaitlist('guest@example.com')).rejects.toMatchObject({
      name: 'WaitlistApiError',
      message: 'Too many requests',
      status: 429,
      code: 'RATE_LIMITED',
    } satisfies Partial<WaitlistApiError>);
  });

  it('throws when API base URL is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_TENANT_SLUG', 'sunmade');
    await expect(joinWaitlist('guest@example.com')).rejects.toBeInstanceOf(
      WaitlistApiError,
    );
  });

  it('throws when tenant slug is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:4000');
    vi.stubEnv('NEXT_PUBLIC_TENANT_SLUG', '');
    await expect(joinWaitlist('guest@example.com')).rejects.toMatchObject({
      code: 'CONFIG_MISSING',
    });
  });
});
