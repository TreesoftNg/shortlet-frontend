'use client';

import { Box } from '@chakra-ui/react';
import Image from 'next/image';

type CoverImageProps = {
  src: string | null | undefined;
  alt: string;
  sizes: string;
  priority?: boolean;
};

/** next/image rejects empty `src`; show a soft fill when media is missing. */
export function CoverImage({ src, alt, sizes, priority }: CoverImageProps) {
  const url = typeof src === 'string' ? src.trim() : '';
  if (!url) {
    return <Box position="absolute" inset={0} bg="bg.soft" aria-hidden />;
  }

  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      style={{ objectFit: 'cover' }}
    />
  );
}
