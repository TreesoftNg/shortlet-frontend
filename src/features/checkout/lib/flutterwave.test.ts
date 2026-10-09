import { flutterwavePaymentOptions } from '@/features/checkout/lib/flutterwave';
import { describe, expect, it } from 'vitest';

describe('flutterwavePaymentOptions', () => {
  it('maps UI methods to Flutterwave payment_options', () => {
    expect(flutterwavePaymentOptions('card')).toBe('card');
    expect(flutterwavePaymentOptions('transfer')).toBe('banktransfer');
    expect(flutterwavePaymentOptions('ussd')).toBe('ussd');
  });
});
