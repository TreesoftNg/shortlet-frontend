'use client';

import { SunmadeLogo } from '@/shared/components/brand';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Menu, Search } from 'lucide-react';
import Link from 'next/link';

type SearchMiniBarProps = {
  locationLabel: string;
  datesLabel: string;
  guestsLabel: string;
};

export function SearchMiniBar({
  locationLabel,
  datesLabel,
  guestsLabel,
}: SearchMiniBarProps) {
  return (
    <Flex
      as="header"
      h={{ base: '64px', md: '72px', lg: '80px' }}
      align="center"
      justify="space-between"
      px={{ base: 4, md: 8, lg: 10 }}
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
      <Link href="/">
        <SunmadeLogo size={{ base: '17px', md: '20px' }} wordmarkDisplay={{ base: 'none', sm: 'inline-grid' }} />
      </Link>

      <Flex
        flex="1"
        maxW="520px"
        align="center"
        border="1px solid"
        borderColor="line"
        borderRadius="full"
        boxShadow="0 2px 10px rgba(0,0,0,.06)"
        pl={{ base: 4, md: '22px' }}
        pr="6px"
        py="6px"
        fontSize={{ base: '13px', md: '14px' }}
        fontWeight="600"
        gap={{ base: 2, md: 4 }}
        overflow="hidden"
      >
        <Text lineClamp={1} flexShrink={1}>
          {locationLabel}
        </Text>
        <Box
          w="1px"
          h="22px"
          bg="line"
          flexShrink={0}
          display={{ base: 'none', sm: 'block' }}
        />
        <Text
          lineClamp={1}
          flexShrink={0}
          display={{ base: 'none', sm: 'block' }}
        >
          {datesLabel}
        </Text>
        <Box
          w="1px"
          h="22px"
          bg="line"
          flexShrink={0}
          display={{ base: 'none', md: 'block' }}
        />
        <Text color="ink.3" display={{ base: 'none', md: 'block' }} flexShrink={0}>
          {guestsLabel}
        </Text>
        <Flex
          ml="auto"
          w="38px"
          h="38px"
          borderRadius="full"
          bg="brand.500"
          color="white"
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Search size={16} strokeWidth={1.9} />
        </Flex>
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
          boxShadow="0 1px 2px rgba(0,0,0,.04)"
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
