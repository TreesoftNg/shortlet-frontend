'use client';

import { Box, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type LabeledFieldProps = {
  label: string;
  children: ReactNode;
  emphasized?: boolean;
  mb?: string | number;
  flex?: string | number;
};

export function LabeledField({
  label,
  children,
  emphasized = false,
  mb,
  flex,
}: LabeledFieldProps) {
  return (
    <Box
      border={emphasized ? '2px solid' : '1px solid'}
      borderColor={emphasized ? 'ink' : '#D5D5D0'}
      borderRadius="12px"
      px={emphasized ? '15px' : '16px'}
      py={emphasized ? '11px' : '12px'}
      mb={mb}
      flex={flex}
      w="full"
    >
      <Text
        fontSize="11px"
        fontWeight="700"
        textTransform="uppercase"
        letterSpacing="0.04em"
        mb="2px"
      >
        {label}
      </Text>
      {children}
    </Box>
  );
}
