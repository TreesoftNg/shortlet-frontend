import {
  createCustomerAccount,
  loginCustomer,
  resendCustomerOtp,
  verifyCustomerOtp,
} from '@/data/api/customers';
import { afterEach, describe, expect, it, vi } from 'vitest';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('customers api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates an account', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}, 201));
    vi.stubGlobal('fetch', fetchMock);

    await createCustomerAccount({
      email: 'guest@example.com',
      firstName: 'Ada',
      lastName: 'Okafor',
      password: 'Sunmade-guest-1',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/backend/api/v1/create-account',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'guest@example.com',
          firstName: 'Ada',
          lastName: 'Okafor',
          password: 'Sunmade-guest-1',
        }),
      }),
    );
  });

  it('verifies and resends OTP', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ success: true }))
      .mockResolvedValueOnce(jsonResponse({ success: true }));
    vi.stubGlobal('fetch', fetchMock);

    await verifyCustomerOtp({ email: 'guest@example.com', otp: '123456' });
    await resendCustomerOtp({ email: 'guest@example.com' });

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/backend/api/v1/verify-otp');
    expect(fetchMock.mock.calls[1]?.[0]).toBe('/backend/api/v1/resend-otp');
  });

  it('signs in and returns tokens', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          success: true,
          data: {
            accessToken: 'access',
            refreshToken: 'refresh',
            profile: {
              user: {
                id: 'usr_1',
                email: 'guest@example.com',
                firstName: 'Ada',
                lastName: 'Okafor',
              },
            },
          },
        }),
      ),
    );

    const result = await loginCustomer({
      email: 'guest@example.com',
      password: 'Sunmade-guest-1',
    });

    expect(result.accessToken).toBe('access');
    expect(result.profile?.user?.firstName).toBe('Ada');
  });
});
