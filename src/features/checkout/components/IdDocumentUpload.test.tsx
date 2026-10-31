import { useState } from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/data/api/http';
import { renderWithProviders } from '@/test/render';
import { IdDocumentUpload } from './IdDocumentUpload';
const { upload } = vi.hoisted(() => ({ upload: vi.fn() }));
vi.mock('../hooks/useUploadIdDocument', () => ({
  useUploadIdDocument: () => ({ mutateAsync: upload }),
}));
function Checkout() {
  const [id, setId] = useState<string | null>(null);
  return (
    <>
      <IdDocumentUpload onUploaded={setId} />
      <button disabled={!id}>Pay</button>
    </>
  );
}
beforeEach(() => {
  upload.mockReset();
});
describe('ID upload before payment', () => {
  it('keeps Pay disabled until upload completes and resets when type changes', async () => {
    let finish!: (result: { id: string }) => void;
    upload.mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    renderWithProviders(<Checkout />);
    expect(screen.getByRole('button', { name: 'Pay' })).toBeDisabled();
    await userEvent.upload(
      screen.getByLabelText('Upload ID document'),
      new File(['%PDF-'], 'passport.pdf', { type: 'application/pdf' }),
    );
    expect(screen.getByText('Uploading…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pay' })).toBeDisabled();
    await act(async () => finish({ id: 'd1' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Pay' })).toBeEnabled(),
    );
    expect(screen.getByText('passport.pdf')).toBeInTheDocument();
    expect(screen.getByText(/Uploaded · 1 KB/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: 'NIN slip' }));
    expect(screen.getByRole('radio', { name: 'NIN slip' })).toBeChecked();
    expect(screen.getByText('Upload your NIN slip')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pay' })).toBeDisabled();
  });
  it('shows upload errors and keeps Pay disabled', async () => {
    upload.mockRejectedValue(new Error('Upload unavailable'));
    renderWithProviders(<Checkout />);
    await userEvent.upload(
      screen.getByLabelText('Upload ID document'),
      new File(['%PDF-'], 'id.pdf', { type: 'application/pdf' }),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Upload unavailable',
    );
    expect(screen.getByRole('button', { name: 'Pay' })).toBeDisabled();
  });
  it('rejects files above 10 MB before sending them', async () => {
    renderWithProviders(<Checkout />);
    await userEvent.upload(
      screen.getByLabelText('Upload ID document'),
      new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large.pdf', {
        type: 'application/pdf',
      }),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('10 MB');
    expect(upload).not.toHaveBeenCalled();
  });
  it('shows the field message from the API, not the generic one', async () => {
    upload.mockRejectedValue(
      new ApiError({
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'The request contains invalid data',
        details: { fields: { file: ['Choose a JPEG, PNG, WebP or PDF file'] } },
      }),
    );
    renderWithProviders(<Checkout />);
    await userEvent.upload(
      screen.getByLabelText('Upload ID document'),
      new File(['%PDF-'], 'id.pdf', { type: 'application/pdf' }),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Choose a JPEG, PNG, WebP or PDF file',
    );
  });
  it('lets the guest retry with the same file after a failure', async () => {
    upload
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ id: 'd2' });
    renderWithProviders(<Checkout />);
    const file = new File(['%PDF-'], 'id.pdf', { type: 'application/pdf' });
    await userEvent.upload(screen.getByLabelText('Upload ID document'), file);
    await screen.findByRole('alert');
    await userEvent.upload(screen.getByLabelText('Upload ID document'), file);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Pay' })).toBeEnabled(),
    );
    expect(upload).toHaveBeenCalledTimes(2);
  });
  it('lets phones choose a saved photo or file, not only the camera', () => {
    renderWithProviders(<Checkout />);
    expect(screen.getByLabelText('Upload ID document')).not.toHaveAttribute(
      'capture',
    );
  });
});
