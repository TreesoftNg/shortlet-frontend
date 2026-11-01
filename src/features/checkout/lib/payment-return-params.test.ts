import { paymentVerifyFromReturnParams } from '@/features/checkout/lib/payment-return-params';
import { describe, expect, it } from 'vitest';

describe('paymentVerifyFromReturnParams', () => {
  it('reads Flutterwave transaction_id', () => {
    const params = new URLSearchParams({
      bookingId: 'b1',
      transaction_id: '987654',
      tx_ref: 'our-ref',
    });
    expect(paymentVerifyFromReturnParams(params)).toEqual({
      transactionId: '987654',
    });
  });

  it('reads Paystack reference and trxref', () => {
    expect(
      paymentVerifyFromReturnParams(
        new URLSearchParams({ reference: 'psk-ref-1', status: 'success' }),
      ),
    ).toEqual({ reference: 'psk-ref-1' });

    expect(
      paymentVerifyFromReturnParams(
        new URLSearchParams({ trxref: 'psk-ref-2' }),
      ),
    ).toEqual({ reference: 'psk-ref-2' });
  });

  it('prefers reference over trxref when both are present', () => {
    expect(
      paymentVerifyFromReturnParams(
        new URLSearchParams({ reference: 'a', trxref: 'b' }),
      ),
    ).toEqual({ reference: 'a' });
  });
});
