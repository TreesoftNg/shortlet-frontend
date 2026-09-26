'use client';

import { Box, Flex, Text } from '@chakra-ui/react';
import { Home, Lock } from 'lucide-react';
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
      <Link href="/">
        <Flex
          align="center"
          gap="10px"
          fontWeight="800"
          fontSize={{ base: '18px', md: '22px' }}
          color="brand.500"
          letterSpacing="-0.02em"
        >
          <Flex
            w="34px"
            h="34px"
            borderRadius="10px"
            bg="brand.500"
            color="white"
            align="center"
            justify="center"
          >
            <Home size={20} strokeWidth={1.9} />
          </Flex>
          Haven
        </Flex>
      </Link>

      <Flex align="center" gap="8px" color="ink.2" fontSize="14px" fontWeight="600">
        <Lock size={16} strokeWidth={1.9} />
        <Text>Secure checkout</Text>
      </Flex>
    </Flex>
  );
}
