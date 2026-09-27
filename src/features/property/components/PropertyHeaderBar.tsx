'use client';

import { SunmadeLogo } from '@/shared/components/brand';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Menu, Search } from 'lucide-react';
import Link from 'next/link';

export function PropertyHeaderBar() {
  return (
    <Flex
      as="header"
      h={{ base: '64px', md: '72px', lg: '80px' }}
      align="center"
      justify="space-between"
      px={{ base: 4, md: 8, lg: '120px' }}
      borderBottom="1px solid"
      borderColor="line"
      bg="bg"
      gap={3}
      position="sticky"
      top={0}
      zIndex={40}
      maxW="1440px"
      mx="auto"
      w="full"
    >
      <Flex asChild align="center" h="full">
        <Link href="/">
          <SunmadeLogo size={{ base: '17px', md: '20px' }} wordmarkDisplay={{ base: 'none', sm: 'inline-grid' }} />
        </Link>
      </Flex>

      <Flex
        asChild
        flex="1"
        maxW="420px"
        align="center"
        gap="14px"
        border="1px solid"
        borderColor="line"
        borderRadius="full"
        pl={{ base: 4, md: '22px' }}
        pr="8px"
        py="8px"
        fontSize="14px"
        fontWeight="600"
        boxShadow="0 2px 10px rgba(0,0,0,.06)"
        display={{ base: 'none', md: 'flex' }}
      >
        <Link href="/search">
          <Text>Anywhere</Text>
          <Text color="ink.3">·</Text>
          <Text>Any week</Text>
          <Text color="ink.3">·</Text>
          <Text color="ink.3">Add guests</Text>
          <Flex
            ml="auto"
            w="34px"
            h="34px"
            borderRadius="full"
            bg="brand.500"
            color="white"
            align="center"
            justify="center"
            flexShrink={0}
          >
            <Search size={16} strokeWidth={1.9} />
          </Flex>
        </Link>
      </Flex>

      <Flex align="center" gap="14px" fontSize="14px" fontWeight="600" flexShrink={0}>
        <Text display={{ base: 'none', lg: 'block' }}>₦ NGN</Text>
        <Flex
          align="center"
          gap="10px"
          py="6px"
          pl="14px"
          pr="6px"
          border="1px solid"
          borderColor="line"
          borderRadius="full"
        >
          <Menu size={18} strokeWidth={1.9} />
          <Flex
            w="32px"
            h="32px"
            borderRadius="full"
            bg="brand.500"
            color="white"
            align="center"
            justify="center"
            fontSize="13px"
            fontWeight="700"
          >
            AT
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
