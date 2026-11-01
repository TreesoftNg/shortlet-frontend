'use client';
import { useEffect, useRef, useState, type DragEvent } from 'react';
import { Box, Flex, Grid, Spinner, Text } from '@chakra-ui/react';
import { CircleAlert, CircleCheck, Lock, Upload } from 'lucide-react';
import { apiErrorMessage } from '@/data/api/http';
import { validateIdFile, type IdDocumentType } from '@/data/api/id-documents';
import { useUploadIdDocument } from '../hooks/useUploadIdDocument';

const DOCUMENT_TYPES: { id: IdDocumentType; label: string; noun: string }[] =
  [
    { id: 'passport', label: 'Passport', noun: 'passport' },
    { id: 'drivers_licence', label: 'Driver’s licence', noun: 'driver’s licence' },
    { id: 'nin', label: 'NIN slip', noun: 'NIN slip' },
  ];

const FILE_TYPES = 'image/jpeg,image/png,image/webp,application/pdf';

type Status = 'empty' | 'uploading' | 'ready' | 'error';

function formatSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function IdDocumentUpload({
  onUploaded,
}: {
  onUploaded: (id: string | null) => void;
}) {
  const upload = useUploadIdDocument();
  const [documentType, setType] = useState<IdDocumentType>('passport');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('empty');
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const version = useRef(0);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(
    () => () => {
      version.current++;
    },
    [],
  );

  const typeNoun =
    DOCUMENT_TYPES.find((type) => type.id === documentType)?.noun ?? 'ID';

  const select = async (chosen?: File) => {
    const request = ++version.current;
    // Cleared so choosing the same file again (e.g. after a failed upload) fires a change.
    if (fileInput.current) fileInput.current.value = '';
    onUploaded(null);
    setError('');
    setFile(chosen ?? null);
    if (!chosen) {
      setStatus('empty');
      return;
    }
    const invalid = validateIdFile(chosen);
    if (invalid) {
      setStatus('error');
      setError(invalid);
      return;
    }
    setStatus('uploading');
    try {
      const doc = await upload.mutateAsync({ documentType, file: chosen });
      if (request !== version.current) return;
      setStatus('ready');
      onUploaded(doc.id);
    } catch (err) {
      if (request !== version.current) return;
      setStatus('error');
      setError(apiErrorMessage(err, 'Upload failed. Please try again.'));
    }
  };

  const changeType = (next: IdDocumentType) => {
    if (next === documentType) return;
    version.current++;
    setType(next);
    onUploaded(null);
    setStatus('empty');
    setFile(null);
    setError('');
    if (fileInput.current) fileInput.current.value = '';
  };

  const drop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (status === 'uploading') return;
    void select(event.dataTransfer.files[0]);
  };

  const failed = status === 'error';

  return (
    <Box
      position="relative"
      mt="12px"
      border="1px solid"
      borderColor="#D5D5D0"
      borderRadius="12px"
      px="16px"
      py="14px"
      minW={0}
      maxW="100%"
      // The file input is visually hidden; show its keyboard focus on the box after it.
      css={{
        '& #guest-id-file:focus-visible + *': {
          outline: '2px solid',
          outlineColor: 'brand.500',
          outlineOffset: '2px',
        },
      }}
    >
      <Flex justify="space-between" align="center" gap="8px" mb="10px">
        <Text
          id="guest-id-type-label"
          fontSize="11px"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="0.04em"
        >
          Photo ID
        </Text>
        <Text fontSize="12px" color="ink.3">
          Required
        </Text>
      </Flex>

      <Grid
        role="radiogroup"
        aria-labelledby="guest-id-type-label"
        templateColumns="minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1fr)"
        gap="8px"
        mb="12px"
      >
        {DOCUMENT_TYPES.map((type) => {
          const on = type.id === documentType;
          return (
            <Box
              key={type.id}
              asChild
              h="38px"
              px="6px"
              borderRadius="full"
              border="1px solid"
              borderColor={on ? 'brand.500' : 'line'}
              bg={on ? 'brand.50' : 'white'}
              color={on ? 'brand.600' : 'ink.2'}
              fontSize={{ base: '13px', sm: '14px' }}
              fontWeight={on ? '700' : '500'}
              whiteSpace="nowrap"
              cursor="pointer"
              transition="border-color 0.15s, background 0.15s"
              _hover={on ? undefined : { borderColor: 'ink.3' }}
              _disabled={{ opacity: 0.6, cursor: 'not-allowed' }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: 'brand.500',
                outlineOffset: '2px',
              }}
            >
              <button
                type="button"
                role="radio"
                aria-checked={on}
                disabled={status === 'uploading'}
                onClick={() => changeType(type.id)}
              >
                {type.label}
              </button>
            </Box>
          );
        })}
      </Grid>

      <input
        ref={fileInput}
        id="guest-id-file"
        type="file"
        aria-label="Upload ID document"
        accept={FILE_TYPES}
        disabled={status === 'uploading'}
        onChange={(event) => void select(event.target.files?.[0])}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          opacity: 0,
          overflow: 'hidden',
        }}
      />

      {file && status !== 'empty' ? (
        <Flex
          align="center"
          gap="12px"
          border="1px solid"
          borderColor={failed ? 'danger' : 'line'}
          bg={failed ? 'white' : 'bg.soft'}
          borderRadius="10px"
          px="14px"
          py="12px"
          minW={0}
        >
          <Flex
            w="36px"
            h="36px"
            borderRadius="8px"
            bg="white"
            border="1px solid"
            borderColor="line"
            align="center"
            justify="center"
            flexShrink={0}
            color={status === 'ready' ? 'ok' : failed ? 'danger' : 'ink.2'}
          >
            {status === 'uploading' ? (
              <Spinner size="sm" color="brand.500" />
            ) : status === 'ready' ? (
              <CircleCheck size={20} strokeWidth={1.9} />
            ) : (
              <CircleAlert size={20} strokeWidth={1.9} />
            )}
          </Flex>
          <Box flex="1" minW={0}>
            <Text fontSize="14px" fontWeight="600" truncate>
              {file.name}
            </Text>
            <Text fontSize="13px" color="ink.3" role="status">
              {status === 'uploading'
                ? 'Uploading…'
                : status === 'ready'
                  ? `Uploaded · ${formatSize(file.size)}`
                  : 'Not uploaded'}
            </Text>
          </Box>
          {status !== 'uploading' ? (
            <Box
              asChild
              flexShrink={0}
              fontSize="14px"
              fontWeight="700"
              color="brand.600"
              cursor="pointer"
              textDecoration="underline"
              textUnderlineOffset="3px"
            >
              <label htmlFor="guest-id-file">
                {failed ? 'Choose another' : 'Replace'}
              </label>
            </Box>
          ) : null}
        </Flex>
      ) : (
        <Flex
          asChild
          direction="column"
          align="center"
          textAlign="center"
          gap="6px"
          border="1.5px dashed"
          borderColor={dragging ? 'brand.500' : '#C9C9C4'}
          bg={dragging ? 'brand.50' : 'bg.soft'}
          borderRadius="10px"
          px="16px"
          py="22px"
          cursor="pointer"
          transition="border-color 0.15s, background 0.15s"
          _hover={{ borderColor: 'brand.500' }}
        >
          <label
            htmlFor="guest-id-file"
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={drop}
          >
            <Flex
              w="40px"
              h="40px"
              borderRadius="full"
              bg="white"
              border="1px solid"
              borderColor="line"
              align="center"
              justify="center"
              mb="2px"
            >
              <Upload size={18} strokeWidth={1.9} />
            </Flex>
            <Text fontSize="15px" fontWeight="700">
              Upload your {typeNoun}
            </Text>
            <Text fontSize="13px" color="ink.3">
              JPEG, PNG, WebP or PDF · up to 10&nbsp;MB
            </Text>
          </label>
        </Flex>
      )}

      {error ? (
        <Text role="alert" color="danger" fontSize="13px" mt="8px">
          {error}
        </Text>
      ) : null}

      <Flex align="start" gap="6px" mt="10px" color="ink.3" fontSize="12px">
        <Box as="span" mt="2px" flexShrink={0}>
          <Lock size={12} strokeWidth={2} />
        </Box>
        <Text>
          Only our team can see your ID. It’s deleted 90 days after check-out.
        </Text>
      </Flex>
    </Box>
  );
}
