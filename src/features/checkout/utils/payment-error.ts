import { apiErrorMessage, apiFieldErrors } from '@/data/api/http';

/** What to tell the guest when starting payment fails. */
export function describePaymentError(error: unknown): {
  message: string;
  /** The ID upload was stale or already used: the guest must upload again. */
  idDocumentRejected: boolean;
} {
  return {
    message: apiErrorMessage(error, 'Could not start payment.'),
    idDocumentRejected: Boolean(apiFieldErrors(error).idDocumentId),
  };
}
