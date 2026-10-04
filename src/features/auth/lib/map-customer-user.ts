import type { CustomerLoginResult, CustomerUserDto } from '@/data/api/customers';
import type { AuthUser } from '@/features/auth/types';

function isUserDto(value: unknown): value is CustomerUserDto {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.email === 'string' &&
    typeof record.firstName === 'string' &&
    typeof record.lastName === 'string'
  );
}

export function initialsFromName(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);
  const value = `${first}${last}`.toUpperCase();
  return value || firstName.trim().slice(0, 2).toUpperCase() || 'SM';
}

export function usernameFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim() ?? '';
  return local || 'guest';
}

export function mapCustomerUser(
  result: CustomerLoginResult | null | undefined,
  fallback: { email: string; firstName?: string; lastName?: string },
): AuthUser {
  const nested = result?.profile?.user;
  const flatProfile = result?.profile;
  const user =
    (isUserDto(nested) && nested) ||
    (isUserDto(result?.user) && result.user) ||
    (isUserDto(flatProfile) && flatProfile) ||
    null;

  const firstName = user?.firstName || fallback.firstName || '';
  const lastName = user?.lastName || fallback.lastName || '';
  const email = user?.email || fallback.email;

  return {
    id: user?.id || email,
    email,
    firstName: firstName || email.split('@')[0] || 'Guest',
    lastName,
    username: usernameFromEmail(email),
    avatarInitials: initialsFromName(
      firstName || email,
      lastName,
    ),
  };
}
