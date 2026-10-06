'use client';

import { BookingCard } from '@/features/property/components/BookingCard';
import { PropertyAmenities } from '@/features/property/components/PropertyAmenities';
import { PropertyDescription } from '@/features/property/components/PropertyDescription';
import { PropertyGallery } from '@/features/property/components/PropertyGallery';
import { PropertyHeaderBar } from '@/features/property/components/PropertyHeaderBar';
import { PropertyHighlights } from '@/features/property/components/PropertyHighlights';
import { PropertyReviews } from '@/features/property/components/PropertyReviews';
import { PropertyTitle } from '@/features/property/components/PropertyTitle';
import { UnitPicker } from '@/features/property/components/UnitPicker';
import { usePublicUnitDetail } from '@/features/property/hooks/usePropertyData';
import { usePropertyBookingStore } from '@/features/property/store/property-booking-store';
import { MobileTabBar } from '@/shared/components/MobileTabBar';
import {
  ErrorState,
  Skeleton,
  SkeletonText,
} from '@/shared/components';
import { formatNaira, shortArea } from '@/shared/lib/format';
import { Box, Button, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

type PropertyPageProps = {
  slug: string;
};

export function PropertyPage({ slug }: PropertyPageProps) {
  const router = useRouter();
  const { data, isError, isPending } = usePublicUnitDetail(slug);
  const property = data?.property;
  const reviews = data?.reviews ?? [];
  const houseRules = data?.houseRules ?? null;
  const selectedUnitId = usePropertyBookingStore((s) => s.selectedUnitId);
  const setSelectedUnitId = usePropertyBookingStore((s) => s.setSelectedUnitId);
  const checkIn = usePropertyBookingStore((s) => s.checkIn);
  const checkOut = usePropertyBookingStore((s) => s.checkOut);
  const guests = usePropertyBookingStore((s) => s.guests);

  useEffect(() => {
    if (property?.units[0] && !selectedUnitId) {
      setSelectedUnitId(property.units[0].id);
    }
  }, [property, selectedUnitId, setSelectedUnitId]);

  const selectedUnit = useMemo(
    () => property?.units.find((u) => u.id === selectedUnitId) ?? property?.units[0] ?? null,
    [property, selectedUnitId],
  );

  if (isPending) {
    return <PropertyPageSkeleton />;
  }

  if (isError || !property) {
    return (
      <Box maxW="1440px" mx="auto" minH="60vh" px={{ base: 4, md: 8, lg: '120px' }} py={10}>
        <ErrorState
          title="Property not found"
          description="This stay may have been removed or the link is incorrect."
          actionLabel="Back to search"
          actionHref="/search"
          mt={0}
          icon={<Building2 size={22} strokeWidth={1.9} />}
        />
      </Box>
    );
  }

  const nightly =
    selectedUnit?.nightly_rate ?? property.pricing.nightly_rate;
  const capacity = property.capacity;
  const locationLabel =
    shortArea(property.address.display) || property.address.city || 'Lagos';
  const searchHref = '/search?tab=all';

  return (
    <Box bg="bg" maxW="1440px" mx="auto" minH="100vh" pb={{ base: '100px', md: 0 }}>
      <PropertyHeaderBar
        locationLabel={locationLabel}
        searchHref={searchHref}
      />

      <Box as="main" px={{ base: 4, md: 8, lg: '120px' }}>
        <PropertyTitle property={property} />
        <PropertyGallery
          images={
            property.images.length
              ? property.images
              : [
                  {
                    id: 'fallback',
                    url: property.picture,
                    alt: property.public_name,
                    sort_order: 0,
                    is_primary: true,
                  },
                ]
          }
          title={property.public_name}
        />

        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 400px' }}
          gap={{ base: 8, lg: '90px' }}
          mt={{ base: 6, md: '40px' }}
        >
          <Box>
            <Flex
              align="center"
              gap="16px"
              pb="28px"
              borderBottom="1px solid"
              borderColor="line"
            >
              <Box flex="1">
                <Heading
                  as="h2"
                  fontSize={{ base: '18px', md: '22px' }}
                  fontWeight="700"
                  letterSpacing="-0.01em"
                >
                  {property.summary}
                </Heading>
                <Text color="ink.2" fontSize="14px" mt={1}>
                  {capacity.max} guests · {capacity.bedrooms} bedrooms ·{' '}
                  {capacity.beds} beds · {capacity.bathrooms} baths
                </Text>
              </Box>
              <Flex
                w="52px"
                h="52px"
                borderRadius="full"
                bg="brand.500"
                color="white"
                align="center"
                justify="center"
                fontSize="18px"
                fontWeight="700"
                flexShrink={0}
              >
                H
              </Flex>
            </Flex>

            <Box borderBottom="1px solid" borderColor="line">
              <PropertyHighlights highlights={property.highlights} />
            </Box>

            <PropertyDescription
              description={property.description}
              houseRules={houseRules}
            />

            <Box borderBottom="1px solid" borderColor="line">
              <UnitPicker units={property.units} />
            </Box>

            <Box borderBottom="1px solid" borderColor="line">
              <PropertyAmenities labels={property.amenity_labels} />
            </Box>
          </Box>

          <Box display={{ base: 'none', lg: 'block' }}>
            <BookingCard property={property} selectedUnit={selectedUnit} />
          </Box>
        </Grid>

        <Box
          display={{ base: 'block', lg: 'none' }}
          mt={6}
          mb={4}
        >
          <BookingCard property={property} selectedUnit={selectedUnit} />
        </Box>

        <Box borderTop="1px solid" borderColor="line" mt={{ base: 4, md: 3 }}>
          <PropertyReviews property={property} reviews={reviews} />
        </Box>
      </Box>

      {/* Mobile sticky reserve bar */}
      <Flex
        display={{ base: 'flex', lg: 'none' }}
        position="fixed"
        bottom="72px"
        left={0}
        right={0}
        bg="white"
        borderTop="1px solid"
        borderColor="line"
        px={5}
        py={3}
        align="center"
        justify="space-between"
        zIndex={45}
        maxW="1440px"
        mx="auto"
      >
        <Box>
          <Text>
            <Text as="b" fontSize="16px" fontWeight="700">
              {formatNaira(nightly)}
            </Text>{' '}
            <Text as="span" color="ink.3" fontSize="13px">
              night
            </Text>
          </Text>
          <Text fontSize="13px" textDecoration="underline" fontWeight="600">
            Oct 12 – 16
          </Text>
        </Box>
        <Button
          h="48px"
          px="30px"
          borderRadius="12px"
          bg="brand.500"
          color="white"
          fontWeight="700"
          _hover={{ bg: 'brand.600' }}
          onClick={() =>
            router.push(
              `/checkout?property=${property.slug}${selectedUnit ? `&unit=${selectedUnit.id}` : ''}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
            )
          }
        >
          Reserve
        </Button>
      </Flex>

      <MobileTabBar />
    </Box>
  );
}

function PropertyPageSkeleton() {
  return (
    <Box bg="bg" maxW="1440px" mx="auto" minH="100vh" px={{ base: 4, md: 8, lg: '120px' }} py={6} aria-busy="true">
      <Skeleton h="28px" w="220px" mb={4} borderRadius="full" />
      <Skeleton h="18px" w="160px" mb={6} borderRadius="full" />
      <Skeleton h={{ base: '240px', md: '420px' }} borderRadius="lg" mb={8} />
      <Grid templateColumns={{ base: '1fr', lg: '1fr 360px' }} gap={8}>
        <Box>
          <SkeletonText lines={4} />
          <Skeleton h="120px" mt={6} borderRadius="lg" />
          <Skeleton h="180px" mt={6} borderRadius="lg" />
        </Box>
        <Skeleton h="360px" borderRadius="22px" />
      </Grid>
    </Box>
  );
}
