'use client';

import type { CheckoutQuote } from '@/features/checkout/hooks/useCheckoutData';
import { formatNaira } from '@/shared/lib/format';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { Star } from 'lucide-react';
import Image from 'next/image';

type CheckoutSummaryProps = {
  quote: CheckoutQuote;
};

export function CheckoutSummary({ quote }: CheckoutSummaryProps) {
  const { property, unit, nightly, nights, stay, cleaning, service, deposit, total } =
    quote;

  return (
    <Box
      border="1px solid"
      borderColor="line"
      borderRadius="22px"
      p={{ base: 5, md: '26px' }}
      position={{ lg: 'sticky' }}
      top={{ lg: '30px' }}
      bg="white"
    >
      <Flex gap="16px" pb="22px" borderBottom="1px solid" borderColor="line">
        {property.picture ? (
          <Box
            position="relative"
            w="124px"
            h="106px"
            borderRadius="12px"
            overflow="hidden"
            flexShrink={0}
          >
            <Image
              src={property.picture}
              alt={property.public_name}
              fill
              sizes="124px"
              style={{ objectFit: 'cover' }}
            />
          </Box>
        ) : (
          <Box
            w="124px"
            h="106px"
            borderRadius="12px"
            bg="bg.soft"
            flexShrink={0}
          />
        )}
        <Box>
          <Text color="ink.3" fontSize="13px">
            Entire apartment
            {unit ? ` · Unit ${unit.code}` : ''}
          </Text>
          <Text as="b" fontSize="16px" display="block" my="4px" fontWeight="700" lineClamp={2}>
            {property.public_name}
          </Text>
          <Flex align="center" gap="4px" fontSize="14px" fontWeight="600">
            <Star size={14} fill="currentColor" stroke="none" />
            {property.review_summary.rating.toFixed(2)}{' '}
            <Text as="span" color="ink.3" fontWeight="500">
              ({property.review_summary.count})
            </Text>
          </Flex>
        </Box>
      </Flex>

      <Heading as="h3" fontSize="18px" fontWeight="700" mt="22px" mb="6px">
        Price details
      </Heading>

      <Flex justify="space-between" my="12px" color="ink.2" fontSize="15px">
        <Text>
          {formatNaira(nightly)} × {nights} nights
        </Text>
        <Text>{formatNaira(stay)}</Text>
      </Flex>
      <Flex justify="space-between" my="12px" color="ink.2" fontSize="15px">
        <Text>Cleaning fee</Text>
        <Text>{formatNaira(cleaning)}</Text>
      </Flex>
      <Flex justify="space-between" my="12px" color="ink.2" fontSize="15px">
        <Text>Service fee</Text>
        <Text>{formatNaira(service)}</Text>
      </Flex>
      {quote.tax > 0 ? (
        <Flex justify="space-between" my="12px" color="ink.2" fontSize="15px">
          <Text>{quote.apiQuote?.price.tax?.name || 'Tax'}</Text>
          <Text>{formatNaira(quote.tax)}</Text>
        </Flex>
      ) : null}
      <Flex justify="space-between" my="12px" color="ink.2" fontSize="15px" align="center">
        <Flex align="center" gap="4px" flexWrap="wrap">
          Caution deposit
          <Box
            as="span"
            px="10px"
            py="2px"
            borderRadius="full"
            bg="line.2" 
            color="ink.2"
            fontSize="12px"
            fontWeight="700"
          >
            Refundable
          </Box>
        </Flex>
        <Text>{formatNaira(deposit)}</Text>
      </Flex>

      <Flex
        justify="space-between"
        fontWeight="800"
        fontSize="17px"
        pt="18px"
        borderTop="1px solid"
        borderColor="line"
        mt="16px"
      >
        <Text>Total (NGN)</Text>
        <Text>{formatNaira(total)}</Text>
      </Flex>
    </Box>
  );
}
