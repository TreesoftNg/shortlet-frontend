'use client';
import { useEffect, useRef, useState } from 'react';
import { Box, Input, Text } from '@chakra-ui/react';
import { validateIdFile, type IdDocumentType } from '@/data/api/id-documents';
import { useUploadIdDocument } from '../hooks/useUploadIdDocument';
export function IdDocumentUpload({
  onUploaded,
}: {
  onUploaded: (id: string | null) => void;
}) {
  const upload = useUploadIdDocument();
  const [documentType, setType] = useState<IdDocumentType>('passport');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState<
    'empty' | 'uploading' | 'ready' | 'error'
  >('empty');
  const [error, setError] = useState('');
  const version = useRef(0);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(
    () => () => {
      version.current++;
    },
    [],
  );
  const select = async (file?: File) => {
    const request = ++version.current;
    onUploaded(null);
    setError('');
    setFileName(file?.name ?? '');
    if (!file) {
      setStatus('empty');
      return;
    }
    const invalid = validateIdFile(file);
    if (invalid) {
      setStatus('error');
      setError(invalid);
      return;
    }
    setStatus('uploading');
    try {
      const doc = await upload.mutateAsync({ documentType, file });
      if (request !== version.current) return;
      setStatus('ready');
      onUploaded(doc.id);
    } catch (err) {
      if (request !== version.current) return;
      setStatus('error');
      setError(
        err instanceof Error ? err.message : 'Upload failed. Please try again.',
      );
    }
  };
  return (
    <Box
      mt="12px"
      border="1px solid"
      borderColor="#D5D5D0"
      borderRadius="12px"
      p="16px"
    >
      <Text fontWeight="700" mb="8px">
        ID document (required)
      </Text>
      <label htmlFor="guest-id-type">Document type</label>
      <select
        id="guest-id-type"
        value={documentType}
        onChange={(event) => {
          version.current++;
          setType(event.target.value as IdDocumentType);
          onUploaded(null);
          setStatus('empty');
          setFileName('');
          setError('');
          if (fileInput.current) fileInput.current.value = '';
        }}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          marginBottom: '8px',
        }}
      >
        <option value="drivers_licence">Driver’s licence</option>
        <option value="nin">NIN</option>
        <option value="passport">Passport</option>
      </select>
      <Input
        ref={fileInput}
        type="file"
        aria-label="Upload ID document"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        capture="environment"
        onChange={(event) => void select(event.target.files?.[0])}
      />
      <Text fontSize="13px" mt="8px" role="status">
        {status === 'uploading'
          ? `Uploading ${fileName}…`
          : status === 'ready'
            ? `✓ ${fileName} uploaded`
            : 'Photo or PDF, up to 10 MB. Your ID is private and deleted 90 days after check-out.'}
      </Text>
      {error && (
        <Text role="alert" color="red.600">
          {error}
        </Text>
      )}
    </Box>
  );
}
