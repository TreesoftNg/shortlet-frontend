'use client';

import { Box, type BoxProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type SurfaceRadius = 'md' | 'lg' | 'xl';

type SurfaceProps = BoxProps & {
  children: ReactNode;
  radius?: SurfaceRadius;
};

const radiusMap: Record<SurfaceRadius, string> = {
  md: '16px',
  lg: '18px',
  xl: '20px',
};

export function Surface({
  children,
  radius = 'lg',
  ...rest
}: SurfaceProps) {
  return (
    <Box
      border="1px solid"
      borderColor="line"
      borderRadius={radiusMap[radius]}
      bg="bg"
      overflow="hidden"
      {...rest}
    >
      {children}
    </Box>
  );
}
