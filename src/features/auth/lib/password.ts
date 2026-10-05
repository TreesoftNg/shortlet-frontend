/** Matches CreateCustomerAccountDto on the staging Customers API. */
export const GUEST_PASSWORD_HINT =
  'At least 12 characters, with an uppercase letter and a special character.';

export function isValidGuestPassword(password: string): boolean {
  return (
    password.length >= 12 &&
    password.length <= 128 &&
    /[A-Z]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}
