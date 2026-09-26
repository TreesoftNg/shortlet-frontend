'use client';

import { usePropertyBookingStore } from '@/features/property/store/property-booking-store';
import { formatNaira } from '@/shared/lib/format';
import type { Unit } from '@/data/types';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { useEffect } from 'react';

type UnitPickerProps = {
  units: Unit[];
};

export function UnitPicker({ units }: UnitPickerProps) {
  const selectedUnitId = usePropertyBookingStore((s) => s.selectedUnitId);
  const setSelectedUnitId = usePropertyBookingStore((s) => s.setSelectedUnitId);

  useEffect(() => {
    if (!selectedUnitId && units[0]) {
      setSelectedUnitId(units[0].id);
    }
  }, [selectedUnitId, units, setSelectedUnitId]);

  if (units.length <= 1) return null;

  return (
    <Box py="28px">
      <Heading as="h2" fontSize="22px" fontWeight="700" letterSpacing="-0.01em">
        Choose your unit
      </Heading>
      <Text color="ink.2" fontSize="14px" mt={1}>
        This building has {units.length} units — we&apos;ll hold the one you
        choose.
      </Text>

      <Grid
        templateColumns={{ base: '1fr', sm: '1fr 1fr' }}
        gap="14px"
        mt="18px"
      >
        {units.map((unit) => {
          const on = unit.id === selectedUnitId;
          return (
            <Box
              key={unit.id}
              as="button"
              textAlign="left"
              border={on ? '2px solid' : '1px solid'}
              borderColor={on ? 'ink' : 'line'}
              borderRadius="16px"
              p={on ? '17px' : '18px'}
              bg="white"
              cursor="pointer"
              onClick={() => setSelectedUnitId(unit.id)}
            >
              <Flex justify="space-between" align="center" gap={2}>
                <Text as="b" fontWeight="700">
                  {unit.name}
                </Text>
                <Flex
                  px="10px"
                  py="4px"
                  borderRadius="full"
                  bg="#E6F6EC"
                  color="ok"
                  fontSize="12px"
                  fontWeight="700"
                >
                  Available
                </Flex>
              </Flex>
              <Text color="ink.2" fontSize="14px" mt="6px">
                {[unit.view, ...unit.features].filter(Boolean).join(' · ')}
              </Text>
              <Text mt="10px">
                <Text as="b" fontWeight="800">
                  {formatNaira(unit.nightly_rate)}
                </Text>{' '}
                <Text as="span" color="ink.3">
                  / night
                </Text>
              </Text>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}
