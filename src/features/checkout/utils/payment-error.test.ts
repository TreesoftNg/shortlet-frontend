import { describe, expect, it } from 'vitest';
import { ApiError } from '@/data/api/http';
import { describePaymentError } from './payment-error';

describe('describePaymentError', () => {
  it('asks for a new ID when the upload was stale or already used', () => {
    const error = new ApiError({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'The request contains invalid data',
      details: {
        fields: { idDocumentId: ['Upload a new ID document for this booking'] },
      },
    });

    expect(describePaymentError(error)).toEqual({
      message: 'Upload a new ID document for this booking',
      idDocumentRejected: true,
    });
  });

  it('keeps the ID for other failures', () => {
    expect(
      describePaymentError(
        new ApiError({
          status: 409,
          code: 'BOOKING_UNAVAILABLE',
          message: 'Those dates are no longer free.',
        }),
      ),
    ).toEqual({
      message: 'Those dates are no longer free.',
      idDocumentRejected: false,
    });
    expect(describePaymentError(null).message).toBe('Could not start payment.');
  });
});
