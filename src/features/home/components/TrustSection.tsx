'use client';

import { pagePx } from '@/shared/layout';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import {
  CreditCard,
  Headphones,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'shield-check': ShieldCheck,
  'credit-card': CreditCard,
  headphones: Headphones,
};

type TrustItem = {
  icon: string;
  title: string;
  description: string;
};

type TrustSectionProps = {
  title: string;
  subtitle: string;
  items: TrustItem[];
};

export function TrustSection({ title, subtitle, items }: TrustSectionProps) {
  return (
    <Grid
      mx={pagePx}
      my={{ base: 10, md: 12, lg: '64px' }}
      bg="brand.50"
      borderRadius={{ base: '20px', md: '28px' }}
      p={{ base: 6, sm: 8, md: 10, lg: '48px 56px' }}
      templateColumns={{
        base: '1fr',
        sm: '1fr',
        md: '1fr 1fr',
        lg: '1.2fr 1fr 1fr 1fr',
      }}
      gap={{ base: 6, md: 8, lg: '40px' }}
      alignItems="center"
      maxW="1440px"
    >
      <Box gridColumn={{ md: '1 / -1', lg: 'auto' }}>
        <Heading
          as="h2"
          fontSize={{ base: '22px', md: '26px', lg: '28px' }}
          fontWeight="700"
          letterSpacing="-0.01em"
        >
          {title}
        </Heading>
        <Text color="ink.2" fontSize="14px" mt="8px" maxW="520px">
          {subtitle}
        </Text>
      </Box>

      {items.map((item) => {
        const Icon = iconMap[item.icon] ?? ShieldCheck;
        return (
          <Box key={item.title}>
            <Flex
              w="48px"
              h="48px"
              borderRadius="14px"
              bg="white"
              color="brand.500"
              align="center"
              justify="center"
              mb="14px"
            >
              <Icon size={22} strokeWidth={1.9} />
            </Flex>
            <Text as="b" display="block" mb="4px" fontWeight="700">
              {item.title}
            </Text>
            <Text color="ink.2" fontSize="14px">
              {item.description}
            </Text>
          </Box>
        );
      })}
    </Grid>
  );
}
