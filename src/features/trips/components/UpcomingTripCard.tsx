'use client';

import type { Booking } from '@/data/types';
import { Box, Button, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { MapPin, MessageCircle, PlaneLanding } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type UpcomingTripCardProps = {
  booking: Booking;
};

export function UpcomingTripCard({ booking }: UpcomingTripCardProps) {
  const router = useRouter();

  return (
    <Grid
      templateColumns={{ base: '1fr', md: '1.1fr 1fr' }}
      border="1px solid"
      borderColor="line"
      borderRadius="24px"
      overflow="hidden"
      boxShadow="md"
    >
      <Box position="relative" minH={{ base: '220px', md: '360px' }}>
        <Image
          src={booking.property_image}
          alt={booking.property_name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'cover' }}
          priority
        />
      </Box>

      <Flex direction="column" p={{ base: 5, md: '34px' }}>
        {booking.countdown_label ? (
          <Flex
            align="center"
            gap="8px"
            bg="brand.50"
            color="brand.600"
            fontWeight="700"
            fontSize="13px"
            px="12px"
            py="6px"
            borderRadius="full"
            mb="14px"
            alignSelf="flex-start"
          >
            <PlaneLanding size={16} strokeWidth={1.9} />
            {booking.countdown_label}
          </Flex>
        ) : null}

        <Heading
          as="h2"
          fontSize={{ base: '22px', md: '26px' }}
          fontWeight="700"
          letterSpacing="-0.01em"
        >
          {booking.property_name}
        </Heading>
        <Text color="ink.2" fontSize="14px" mt={1}>
          {booking.unit_label ? `${booking.unit_label} · ` : ''}
          {booking.location_label}
        </Text>

        <Grid
          templateColumns="1fr 1fr"
          gap="20px"
          my="24px"
          py="22px"
          borderTop="1px solid"
          borderBottom="1px solid"
          borderColor="line"
        >
          <Box>
            <Text
              fontSize="12px"
              color="ink.3"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              Check-in
            </Text>
            <Text as="b" display="block" mt="2px" fontWeight="700">
              {booking.check_in_label}
            </Text>
          </Box>
          <Box>
            <Text
              fontSize="12px"
              color="ink.3"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              Checkout
            </Text>
            <Text as="b" display="block" mt="2px" fontWeight="700">
              {booking.check_out_label}
            </Text>
          </Box>
          <Box>
            <Text
              fontSize="12px"
              color="ink.3"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              Reference
            </Text>
            <Text
              as="b"
              display="block"
              mt="2px"
              fontWeight="700"
              fontFamily="ui-monospace, monospace"
            >
              {booking.reference}
            </Text>
          </Box>
          <Box>
            <Text
              fontSize="12px"
              color="ink.3"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              Status
            </Text>
            <Flex
              as="span"
              display="inline-flex"
              mt="2px"
              px="10px"
              py="4px"
              borderRadius="full"
              bg={booking.status === 'confirmed' ? '#E6F6EC' : 'bg.soft'}
              color={booking.status === 'confirmed' ? 'ok' : 'ink.2'}
              fontSize="12px"
              fontWeight="700"
            >
              {booking.status === 'confirmed'
                ? 'Confirmed · Paid'
                : booking.status === 'pending'
                  ? 'Awaiting payment'
                  : booking.status}
            </Flex>
          </Box>
        </Grid>

        <Flex
          gap="10px"
          mt="auto"
          direction={{ base: 'column', sm: 'row' }}
          flexWrap="wrap"
        >
          <Button
            flex="1"
            h="48px"
            borderRadius="12px"
            bg="brand.500"
            color="white"
            fontWeight="700"
            _hover={{ bg: 'brand.600' }}
            onClick={() =>
              router.push(`/properties/${booking.property_slug}`)
            }
          >
            Manage booking
          </Button>
          <Button
            h="48px"
            px="16px"
            borderRadius="12px"
            bg="bg.soft"
            color="ink"
            fontWeight="700"
            gap="8px"
          >
            <MessageCircle size={18} strokeWidth={1.9} />
            Message
          </Button>
          <Button
            h="48px"
            px="16px"
            borderRadius="12px"
            bg="bg.soft"
            color="ink"
            fontWeight="700"
            gap="8px"
          >
            <MapPin size={18} strokeWidth={1.9} />
            Directions
          </Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
