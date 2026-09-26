'use client';

import { Box, Button, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import {
  AirVent,
  Car,
  CookingPot,
  Dumbbell,
  Shield,
  Tv,
  Waves,
  Wifi,
  type LucideIcon,
} from 'lucide-react';

const amenityIcons: LucideIcon[] = [
  Wifi,
  Waves,
  CookingPot,
  Car,
  Tv,
  AirVent,
  Shield,
  Dumbbell,
];

type PropertyAmenitiesProps = {
  labels: string[];
};

export function PropertyAmenities({ labels }: PropertyAmenitiesProps) {
  const shown = labels.slice(0, 8);

  return (
    <Box py="28px">
      <Heading as="h2" fontSize="22px" fontWeight="700" letterSpacing="-0.01em">
        What this place offers
      </Heading>
      <Grid
        templateColumns={{ base: '1fr', sm: '1fr 1fr' }}
        gap="16px"
        mt="20px"
      >
        {shown.map((label, i) => {
          const Icon = amenityIcons[i % amenityIcons.length];
          return (
            <Flex key={label} gap="14px" align="center" fontSize="15px">
              <Icon size={22} strokeWidth={1.6} />
              {label}
            </Flex>
          );
        })}
      </Grid>
      <Button
        mt="24px"
        h="48px"
        px="22px"
        borderRadius="12px"
        border="1px solid"
        borderColor="ink"
        bg="white"
        fontWeight="700"
        fontSize="15px"
      >
        Show all 32 amenities
      </Button>
    </Box>
  );
}
