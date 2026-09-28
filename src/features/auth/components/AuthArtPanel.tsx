'use client';

import { SunmadeLogo } from '@/shared/components/brand';
import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';

export function AuthArtPanel() {
  return (
    <Box
      position="relative"
      m={{ base: 0, md: 4 }}
      borderRadius={{ base: 0, md: '28px' }}
      overflow="hidden"
      minH={{ base: '240px', md: 'auto' }}
      h={{ md: 'calc(100vh - 32px)', lg: '960px' }}
      maxH={{ md: '960px' }}
    >
      <Image
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80"
        alt=""
        fill
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: 'cover' }}
      />
      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.6))"
      />

      <Box
        position="absolute"
        top={{ base: 5, md: '36px' }}
        left={{ base: 5, md: '44px' }}
        zIndex={2}
      >
        <SunmadeLogo size="22px" variant="light" />
      </Box>

      <Box
        position="absolute"
        left={{ base: 5, md: '44px' }}
        right={{ base: 5, md: '44px' }}
        bottom={{ base: 5, md: '44px' }}
        color="white"
        zIndex={2}
        display={{ base: 'none', md: 'block' }}
      >
        <Text
          fontSize={{ md: '22px', lg: '26px' }}
          fontWeight="700"
          lineHeight="1.3"
          letterSpacing="-0.01em"
        >
          &ldquo;Booking took two minutes and the apartment was even better than
          the photos.&rdquo;
        </Text>
        <Flex gap="12px" align="center" mt="18px">
          <Box
            position="relative"
            w="40px"
            h="40px"
            borderRadius="full"
            overflow="hidden"
          >
            <Image
              src="https://i.pravatar.cc/100?img=47"
              alt="Amaka O."
              fill
              sizes="40px"
              style={{ objectFit: 'cover' }}
            />
          </Box>
          <Box>
            <Text as="b" fontWeight="700">
              Amaka O.
            </Text>
            <Text opacity={0.8} fontSize="14px">
              Stayed in Lekki
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
