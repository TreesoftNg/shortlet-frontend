'use client';

import { SunmadeLogo } from '@/shared/components/brand';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export function CheckoutHeader() {
  return (
    <Flex
      as="header"
      h={{ base: '64px', md: '80px' }}
      align="center"
      justify="space-between"
      px={{ base: 4, md: 10, lg: '80px' }}
      borderBottom="1px solid"
      borderColor="line"
      bg="bg"
      maxW="1440px"
      mx="auto"
      w="full"
    >
      <Flex asChild align="center" h="full">
        <Link href="/">
          <SunmadeLogo size={{ base: '17px', md: '20px' }} />
        </Link>
      </Flex>

      <Flex align="center" gap="8px" color="ink.2" fontSize="14px" fontWeight="600">
        <Lock size={16} strokeWidth={1.9} />
        <Text>Secure checkout</Text>
      </Flex>
    </Flex>
  );
}
