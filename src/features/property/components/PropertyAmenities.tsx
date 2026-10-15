'use client';

import { AppButton } from '@/shared/components';
import { Box, Flex, Grid, Heading } from '@chakra-ui/react';
import {
  AirVent,
  Briefcase,
  Car,
  CookingPot,
  DoorOpen,
  Dumbbell,
  Shield,
  Tv,
  Waves,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

const PREVIEW_COUNT = 8;

type AmenityIconRule = {
  match: RegExp;
  icon: LucideIcon;
};

/** Match amenity labels to icons by keyword (order = priority). */
const AMENITY_ICON_RULES: AmenityIconRule[] = [
  { match: /wi-?fi|internet|wireless|broadband/i, icon: Wifi },
  { match: /pool|swim/i, icon: Waves },
  { match: /park|garage|car\b/i, icon: Car },
  { match: /gym|fitness|exercise/i, icon: Dumbbell },
  { match: /air.?cond|\bac\b|cooling|climate/i, icon: AirVent },
  { match: /\btv\b|television|netflix|streaming/i, icon: Tv },
  { match: /kitchen|cook|stove|oven|microwave/i, icon: CookingPot },
  { match: /power|generator|electric|inverter|24\/7/i, icon: Zap },
  { match: /balcon|patio|terrace|verandah|veranda/i, icon: DoorOpen },
  { match: /work|desk|office|workspace/i, icon: Briefcase },
  { match: /secur|guard|cctv|safe|lock/i, icon: Shield },
];

function iconForAmenity(label: string): LucideIcon {
  for (const rule of AMENITY_ICON_RULES) {
    if (rule.match.test(label)) return rule.icon;
  }
  return Shield;
}

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
          const Icon = iconForAmenity(label);
          return (
            <Flex key={`${label}-${i}`} gap="14px" align="center" fontSize="15px">
              <Icon size={22} strokeWidth={1.6} />
              {label}
            </Flex>
          );
        })}
      </Grid>
      {canExpand ? (
        <Box mt="20px">
          <AppButton variant="outline" onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Show less' : `Show all ${labels.length} amenities`}
          </AppButton>
        </Box>
      ) : null}
    </Box>
  );
}
