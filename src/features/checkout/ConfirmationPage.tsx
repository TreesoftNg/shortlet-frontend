'use client';

import {
  mockGuest,
  useCheckoutProperty,
  useCheckoutQuote,
} from '@/features/checkout/hooks/useCheckoutData';
import { formatNaira } from '@/shared/lib/format';
import { Box, Button, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import {
  CalendarPlus,
  Check,
  CircleCheck,
  Download,
  Home,
  Mail,
  Menu,
  MessageCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get('property');
  const unitId = searchParams.get('unit');
  const totalParam = searchParams.get('total');

  const { data: property } = useCheckoutProperty(slug);
  const quote = useCheckoutQuote(property, unitId);
  const total = totalParam ? Number(totalParam) : quote?.total;

  if (!property || !quote) {
    return (
      <Box p={10} textAlign="center" bg="bg.soft" minH="100vh">
        <Heading mb={4}>Booking not found</Heading>
        <Button onClick={() => router.push('/')}>Go home</Button>
      </Box>
    );
  }

  return (
    <Box bg="bg.soft" minH="100vh" maxW="1440px" mx="auto">
      <Flex
        as="header"
        h="80px"
        align="center"
        justify="space-between"
        px={{ base: 4, md: 10, lg: '80px' }}
        borderBottom="1px solid"
        borderColor="line"
        bg="bg"
      >
        <Link href="/">
          <Flex
            align="center"
            gap="10px"
            fontWeight="800"
            fontSize="22px"
            color="brand.500"
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
        <Flex align="center" gap="14px" fontWeight="600" fontSize="14px">
          <Link href="/trips">My trips</Link>
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

      <Box
        w="full"
        maxW="720px"
        mx="auto"
        px={{ base: 4, md: 0 }}
        my={{ base: 8, md: '56px' }}
        pb="80px"
      >
        <Flex
          w="76px"
          h="76px"
          borderRadius="full"
          bg="brand.500"
          color="white"
          align="center"
          justify="center"
          mx="auto"
          mb="22px"
          boxShadow="0 0 0 12px var(--brand-100)"
        >
          <Check size={38} strokeWidth={2.5} />
        </Flex>

        <Box textAlign="center">
          <Heading
            as="h1"
            fontSize={{ base: '28px', md: '34px' }}
            fontWeight="800"
            letterSpacing="-0.02em"
          >
            Your stay is booked!
          </Heading>
          <Text color="ink.2" fontSize="16px" mt="8px">
            Payment received. A confirmation has been sent to {mockGuest.email}
          </Text>
        </Box>

        <Box
          bg="white"
          borderRadius="24px"
          overflow="hidden"
          boxShadow="md"
          mt="34px"
        >
          <Box position="relative" h={{ base: '180px', md: '240px' }}>
            <Image
              src={property.picture}
              alt={property.public_name}
              fill
              sizes="720px"
              style={{ objectFit: 'cover' }}
            />
          </Box>
          <Box p={{ base: 5, md: '28px 32px' }}>
            <Flex
              justify="space-between"
              align="start"
              gap={3}
              direction={{ base: 'column', sm: 'row' }}
            >
              <Box>
                <Heading as="h2" fontSize="22px" fontWeight="700">
                  {property.name}
                </Heading>
                <Text color="ink.2" fontSize="14px">
                  {quote.unit ? `${quote.unit.name} · ` : ''}
                  {property.address.display.replace(/,\s*NG$/i, '')}
                </Text>
              </Box>
              <Flex
                align="center"
                gap="5px"
                px="10px"
                py="4px"
                borderRadius="full"
                bg="#E6F6EC"
                color="ok"
                fontSize="12px"
                fontWeight="700"
                flexShrink={0}
              >
                <CircleCheck size={14} strokeWidth={1.9} />
                Confirmed
              </Flex>
            </Flex>

            <Grid
              templateColumns={{ base: '1fr', sm: '1fr 1fr 1fr' }}
              gap="22px"
              py="22px"
              borderTop="1px dashed #D5D5D0"
              borderBottom="1px dashed #D5D5D0"
              my="22px"
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
                <Text as="b" display="block" mt="4px" fontSize="16px" fontWeight="700">
                  {quote.checkInShort}
                </Text>
                <Text color="ink.2" fontSize="14px">
                  After {property['check-in']}
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
                <Text as="b" display="block" mt="4px" fontSize="16px" fontWeight="700">
                  {quote.checkOutShort}
                </Text>
                <Text color="ink.2" fontSize="14px">
                  Before {property['check-out']}
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
                  Guests
                </Text>
                <Text as="b" display="block" mt="4px" fontSize="16px" fontWeight="700">
                  {quote.guests} adults
                </Text>
                <Text color="ink.2" fontSize="14px">
                  {quote.nights} nights
                </Text>
              </Box>
            </Grid>

            <Flex
              justify="space-between"
              align="center"
              direction={{ base: 'column', sm: 'row' }}
              gap={4}
            >
              <Box>
                <Text color="ink.3" fontSize="13px">
                  Booking reference
                </Text>
                <Text
                  as="b"
                  fontSize="20px"
                  fontWeight="700"
                  fontFamily="ui-monospace, monospace"
                  letterSpacing="0.08em"
                >
                  HVN-7Q4K-2291
                </Text>
              </Box>
              <Box textAlign={{ base: 'left', sm: 'right' }}>
                <Text color="ink.3" fontSize="13px">
                  Amount paid
                </Text>
                <Text as="b" fontSize="20px" fontWeight="700">
                  {formatNaira(total ?? quote.total)}
                </Text>
              </Box>
            </Flex>

            <Flex gap="12px" mt="26px" direction={{ base: 'column', sm: 'row' }}>
              <Button
                flex="1"
                h="48px"
                borderRadius="12px"
                bg="brand.500"
                color="white"
                fontWeight="700"
                _hover={{ bg: 'brand.600' }}
                onClick={() => router.push('/trips')}
              >
                View booking
              </Button>
              <Button
                flex="1"
                h="48px"
                borderRadius="12px"
                border="1px solid"
                borderColor="ink"
                bg="white"
                fontWeight="700"
                gap="8px"
              >
                <Download size={18} strokeWidth={1.9} />
                Download receipt
              </Button>
            </Flex>
          </Box>
        </Box>

        <Text fontSize="18px" fontWeight="700" mt="36px" mb="14px">
          What happens next
        </Text>
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap="14px"
        >
          {[
            {
              icon: Mail,
              title: 'Check-in details',
              body: 'Smart lock code sent 24h before arrival.',
            },
            {
              icon: MessageCircle,
              title: 'Message us',
              body: 'Questions? Chat with the team anytime.',
            },
            {
              icon: CalendarPlus,
              title: 'Add to calendar',
              body: 'Google, Apple or Outlook.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Box
                key={item.title}
                bg="white"
                borderRadius="16px"
                p="18px"
                border="1px solid"
                borderColor="line"
              >
                <Box color="brand.500" mb="10px">
                  <Icon size={22} strokeWidth={1.9} />
                </Box>
                <Text as="b" fontWeight="700" display="block">
                  {item.title}
                </Text>
                <Text color="ink.2" fontSize="14px">
                  {item.body}
                </Text>
              </Box>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
