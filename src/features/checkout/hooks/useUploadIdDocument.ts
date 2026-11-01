'use client';
import { useMutation } from '@tanstack/react-query';
import { uploadIdDocument, type IdDocumentType } from '@/data/api/id-documents';
export function useUploadIdDocument() {
  return useMutation({
    mutationFn: ({
      documentType,
      file,
    }: {
      documentType: IdDocumentType;
      file: File;
    }) => uploadIdDocument(documentType, file),
  });
}
