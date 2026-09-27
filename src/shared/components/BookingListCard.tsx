'use client';

import type { Booking } from '@/data/types';
import { StatusBadge } from '@/shared/components/ui';
import { formatNaira } from '@/shared/lib/format';
import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

type BookingListCardProps = {
  booking: Booking;
};

export function BookingListCard({ booking }: BookingListCardProps) {
  return (
    <Flex
      asChild
      border="1px solid"
      borderColor="line"
      borderRadius="16px"
      overflow="hidden"
      bg="bg"
      _hover={{ borderColor: 'ink.3' }}
      transition="border-color 0.15s ease"
    >
      <Link href={`/properties/${booking.property_slug}`}>
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          w="full"
          align={{ sm: 'stretch' }}
        >
          <Box
            position="relative"
            w={{ base: 'full', sm: '140px' }}
            h={{ base: '160px', sm: 'auto' }}
            minH={{ sm: '120px' }}
            flexShrink={0}
          >
            <Image
              src={booking.property_image}
              alt={booking.property_name}
              fill
              sizes="(max-width: 640px) 100vw, 140px"
              style={{ objectFit: 'cover' }}
            />
          </Box>

          <Flex
            flex="1"
            direction="column"
            justify="space-between"
            gap="10px"
            p={{ base: '14px 16px', md: '16px 20px' }}
            minW={0}
          >
            <Flex
              justify="space-between"
              align="start"
              gap="12px"
              flexWrap="wrap"
            >
              <Box minW={0}>
                <Text fontWeight="700" fontSize="16px" lineClamp={1}>
                  {booking.property_name}
                </Text>
                <Text color="ink.2" fontSize="14px" mt="2px">
                  {booking.location_label}
                  {booking.unit_label ? ` · ${booking.unit_label}` : ''}
                </Text>
              </Box>

              <StatusBadge status={booking.status} />
            </Flex>

            <Flex
              justify="space-between"
              align={{ base: 'start', sm: 'end' }}
              gap="10px"
              direction={{ base: 'column', sm: 'row' }}
              fontSize="14px"
            >
              <Box color="ink.2">
                <Text>{booking.dates_range_label}</Text>
                <Text fontSize="13px" mt="2px">
                  {booking.guests} guest{booking.guests === 1 ? '' : 's'} ·{' '}
                  {booking.nights} night{booking.nights === 1 ? '' : 's'} ·{' '}
                  {booking.reference}
                </Text>
              </Box>
              <Text fontWeight="800" whiteSpace="nowrap">
                {formatNaira(booking.amount_paid)}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Link>
    </Flex>
  );
}
