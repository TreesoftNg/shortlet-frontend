import { describe, expect, it, vi } from 'vitest';
import { uploadIdDocument, validateIdFile } from './id-documents';
describe('ID upload API', () => {
  it('sends multipart without a JSON content type', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      text: async () =>
        JSON.stringify({ data: { id: 'd1', documentType: 'passport' } }),
    });
    vi.stubGlobal('fetch', fetcher);
    const file = new File(['%PDF-'], 'id.pdf', { type: 'application/pdf' });
    expect(await uploadIdDocument('passport', file)).toMatchObject({
      id: 'd1',
    });
    const options = fetcher.mock.calls[0][1];
    expect(options.body).toBeInstanceOf(FormData);
    expect(options.body.get('file')).toBe(file);
    expect(options.headers).not.toHaveProperty('Content-Type');
    vi.unstubAllGlobals();
  });
  it('rejects invalid client file types', () => {
    expect(
      validateIdFile(new File(['x'], 'id.svg', { type: 'image/svg+xml' })),
    ).toContain('JPEG');
  });
});
