/**
 * Flutterwave Checkout (inline). Secret keys stay on the API — never in this app.
 * Set `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` (FLWPUBK_TEST_… or FLWPUBK_…).
 */
export function getFlutterwavePublicKey(): string | null {
  const value = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY?.trim();
  return value || null;
}

export function flutterwavePaymentOptions(
  method: 'card' | 'transfer' | 'ussd',
): string {
  if (method === 'transfer') return 'banktransfer';
  if (method === 'ussd') return 'ussd';
  return 'card';
}
