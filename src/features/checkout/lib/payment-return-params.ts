/** Query params the payment provider may put on the guest return URL. */
export function paymentVerifyFromReturnParams(params: {
  get: (key: string) => string | null;
}): { transactionId?: string; reference?: string } {
  const transactionId =
    params.get('transaction_id') ?? params.get('transactionId') ?? undefined;
  const reference =
    params.get('reference') ?? params.get('trxref') ?? undefined;
  return {
    ...(transactionId ? { transactionId } : {}),
    ...(reference ? { reference } : {}),
  };
}
