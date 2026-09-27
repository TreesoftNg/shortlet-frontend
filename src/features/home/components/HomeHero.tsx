'use client';

import { pagePx } from '@/shared/layout';
import { tokens } from '@/shared/theme/tokens';
import { Box, Button, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type HomeHeroProps = {
  headline: string;
  subheadline: string;
  image: string;
};

export function HomeHero({ headline, subheadline, image }: HomeHeroProps) {
  const router = useRouter();

  return (
    <>
      {/* Mobile / tablet compact search — matches design/src/08-mobile.html */}
      <Box
        display={{ base: 'block', lg: 'none' }}
        px={pagePx}
        pt={{ base: 3, md: 4 }}
        pb={2}
      >
        <Flex
          as="button"
          w="full"
          align="center"
          gap="12px"
          px="16px"
          py="12px"
          borderRadius="full"
          border="1px solid"
          borderColor="line"
          bg="white"
          boxShadow="0 3px 14px rgba(0,0,0,.12)"
          cursor="pointer"
          textAlign="left"
          onClick={() => router.push('/search')}
        >
          <Search size={18} strokeWidth={1.9} color={tokens.colors.brand[500]} />
          <Box>
            <Text fontSize="14px" fontWeight="700" color="ink">
              Where to?
            </Text>
            <Text fontSize="12px" color="ink.3">
              Anywhere · Any week · Add guests
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Desktop / large tablet hero */}
      <Box
        position="relative"
        display={{ base: 'none', md: 'block' }}
        mx={pagePx}
        mt={{ md: 4, lg: 6 }}
        h={{ md: '420px', lg: '560px' }}
        borderRadius={{ md: '22px', lg: '28px' }}
        overflow="hidden"
      >
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1440px"
          style={{ objectFit: 'cover' }}
        />
        <Box
          position="absolute"
          inset={0}
          bg="linear-gradient(90deg, rgba(0,0,0,.55), rgba(0,0,0,.1) 60%), linear-gradient(180deg, transparent 50%, rgba(0,0,0,.35))"
        />

        <Box
          position="absolute"
          left={{ md: 8, lg: '64px' }}
          bottom={{ md: '120px', lg: '150px' }}
          zIndex={2}
          color="white"
          maxW={{ md: '480px', lg: '640px' }}
          pr={4}
        >
          <Heading
            as="h1"
            fontSize={{ md: '40px', lg: '56px' }}
            lineHeight="1.05"
            fontWeight="800"
            letterSpacing="-0.03em"
          >
            {headline}
          </Heading>
          <Text fontSize={{ md: '16px', lg: '18px' }} mt="14px" opacity={0.92}>
            {subheadline}
          </Text>
        </Box>

        <Grid
          position="absolute"
          zIndex={3}
          left={{ md: 6, lg: '64px' }}
          right={{ md: 6, lg: '64px' }}
          bottom={{ md: 6, lg: '40px' }}
          bg="white"
          borderRadius="full"
          boxShadow="lg"
          templateColumns={{
            md: '1.4fr auto',
            lg: '1.5fr 1fr 1fr 1fr auto',
          }}
          alignItems="center"
          p={{ md: 2, lg: '8px 8px 8px 12px' }}
          gap={{ md: 2, lg: 0 }}
        >
          {[
            { label: 'Where', value: 'Lekki, Victoria Island, Ikoyi…' },
            { label: 'Check in', value: 'Add dates' },
            { label: 'Check out', value: 'Add dates' },
            { label: 'Guests', value: 'Add guests' },
          ].map((item, index) => (
            <Box
              key={item.label}
              px={{ md: 4, lg: '26px' }}
              py={{ md: 2, lg: '10px' }}
              borderRightWidth={{
                md: 0,
                lg: index < 3 ? '1px' : 0,
              }}
              borderColor="line"
              display={{
                md: index === 0 ? 'block' : 'none',
                lg: 'block',
              }}
            >
              <Text fontSize="12px" fontWeight="700">
                {item.label}
              </Text>
              <Text fontSize="14px" color="ink.3" lineClamp={1}>
                {item.value}
              </Text>
            </Box>
          ))}

          <Button
            h={{ md: '48px', lg: '60px' }}
            px={{ md: 5, lg: '28px' }}
            borderRadius="full"
            bg="brand.500"
            color="white"
            fontWeight="700"
            gap="10px"
            flexShrink={0}
            _hover={{ bg: 'brand.600' }}
            onClick={() => router.push('/search')}
          >
            <Search size={20} strokeWidth={1.9} />
            <Text as="span" display={{ base: 'none', sm: 'inline' }}>
              Search
            </Text>
          </Button>
        </Grid>
      </Box>
    </>
  );
}
