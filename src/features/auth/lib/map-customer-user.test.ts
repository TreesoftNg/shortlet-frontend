import { mapCustomerUser } from '@/features/auth/lib/map-customer-user';
import { isValidGuestPassword } from '@/features/auth/lib/password';
import { describe, expect, it } from 'vitest';

describe('mapCustomerUser', () => {
  it('prefers nested profile.user', () => {
    const user = mapCustomerUser(
      {
        accessToken: 'tok',
        profile: {
          user: {
            id: '1',
            email: 'ada@sunmadeapartments.com',
            firstName: 'Ada',
            lastName: 'Okafor',
          },
        },
      },
      { email: 'fallback@example.com' },
    );

    expect(user.email).toBe('ada@sunmadeapartments.com');
    expect(user.avatarInitials).toBe('AO');
    expect(user.username).toBe('ada');
  });

  it('falls back to the form email when the API omits a profile and JWT', () => {
    const user = mapCustomerUser(
      { accessToken: 'tok' },
      { email: 'guest@example.com', firstName: 'Temi' },
    );
    expect(user.id).toBe('guest@example.com');
    expect(user.firstName).toBe('Temi');
  });

  it('uses JWT sub as the user id when login returns tokens only', () => {
    const header = Buffer.from(
      JSON.stringify({ alg: 'none', typ: 'JWT' }),
    ).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({ sub: 'user-uuid-1', tid: 'tenant-1', sid: 'session-1' }),
    ).toString('base64url');
    const accessToken = `${header}.${payload}.sig`;

    const user = mapCustomerUser(
      { accessToken },
      { email: 'guest@example.com', firstName: 'Temi' },
    );
    expect(user.id).toBe('user-uuid-1');
  });
});

describe('isValidGuestPassword', () => {
  it('accepts the API example password', () => {
    expect(isValidGuestPassword('Sunmade-guest-1')).toBe(true);
  });

  it('rejects short or missing special/uppercase', () => {
    expect(isValidGuestPassword('short')).toBe(false);
    expect(isValidGuestPassword('noupperorspecial1')).toBe(false);
  });
});
