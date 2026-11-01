import { http } from './http';
export type IdDocumentType = 'drivers_licence' | 'nin' | 'passport';
export function validateIdFile(file: File): string | null {
  if (
    !['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(
      file.type,
    )
  )
    return 'Choose a JPEG, PNG, WebP photo or PDF.';
  if (file.size > 10 * 1024 * 1024) return 'The file must be 10 MB or smaller.';
  if (!file.size) return 'Choose a file that is not empty.';
  return null;
}
export async function uploadIdDocument(
  documentType: IdDocumentType,
  file: File,
): Promise<{ id: string; documentType: IdDocumentType }> {
  const error = validateIdFile(file);
  if (error) throw new Error(error);
  const body = new FormData();
  body.set('documentType', documentType);
  body.set('file', file);
  return http('/api/v1/bookings/id-documents', { method: 'POST', body });
}
