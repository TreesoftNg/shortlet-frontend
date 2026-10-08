'use client';

import { AppButton } from '@/shared/components';
import { Box, Flex, Grid, Heading } from '@chakra-ui/react';
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
import { useState } from 'react';

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

const PREVIEW_COUNT = 8;

type PropertyAmenitiesProps = {
  labels: string[];
};

export function PropertyAmenities({ labels }: PropertyAmenitiesProps) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = labels.length > PREVIEW_COUNT;
  const shown = expanded || !canExpand ? labels : labels.slice(0, PREVIEW_COUNT);

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
            <Flex key={`${label}-${i}`} gap="14px" align="center" fontSize="15px">
              <Icon size={22} strokeWidth={1.6} />
              {label}
            </Flex>
          );
        })}
      </Grid>
      {canExpand ? (
        <Box mt="24px">
          <AppButton
            variant="outline"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded
              ? 'Show fewer amenities'
              : `Show all ${labels.length} amenities`}
          </AppButton>
        </Box>
      ) : null}
    </Box>
  );
}
