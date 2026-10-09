'use client';

import { useSearchUiStore } from '@/features/search/store/search-ui-store';
import {
  bedsGuestsLabel,
  formatNaira,
  formatNairaShort,
} from '@/shared/lib/format';
import type { Property } from '@/data/types';
import { CoverImage } from '@/shared/components/CoverImage';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Minus, Plus, Star } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

type SearchMapProps = {
  properties: Property[];
};

/** Deterministic pin positions from property id (mock map). */
function pinPosition(id: string, index: number): { left: string; top: string } {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const left = 8 + ((hash + index * 37) % 78);
  const top = 12 + ((hash / 7 + index * 53) % 70);
  return { left: `${left}%`, top: `${top}%` };
}

export function SearchMap({ properties }: SearchMapProps) {
  const activePropertyId = useSearchUiStore((s) => s.activePropertyId);
  const setActivePropertyId = useSearchUiStore((s) => s.setActivePropertyId);

  const active = useMemo(
    () =>
      properties.find((p) => p.id === activePropertyId) ?? properties[0] ?? null,
    [activePropertyId, properties],
  );

  return (
    <Box
      position="relative"
      bg="#E8EEE9"
      overflow="hidden"
      h="100%"
      minH={{ lg: 'calc(100vh - 140px)' }}
      display={{ base: 'none', lg: 'block' }}
    >
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 600 900"
        preserveAspectRatio="none"
        aria-hidden
      >
        <rect width="600" height="900" fill="#EDF1EC" />
        <path
          d="M0 640 C 150 600, 300 680, 600 620 L600 900 L0 900Z"
          fill="#CFE3EE"
        />
        <path
          d="M0 140 C 120 110, 180 180, 260 140 S 420 80, 600 120 L600 0 L0 0Z"
          fill="#D6E7EF"
        />
        <rect x="60" y="360" width="120" height="90" rx="10" fill="#DCEBD8" />
        <rect x="380" y="480" width="150" height="110" rx="12" fill="#DCEBD8" />
        <g stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round">
          <path d="M-10 420 C 200 400, 400 460, 610 400" />
          <path d="M220 120 L 260 700" />
          <path d="M470 100 L 430 690" />
        </g>
        <g stroke="#fff" strokeWidth="4" fill="none">
          <path d="M0 280 L600 320" />
          <path d="M0 540 L600 520" />
          <path d="M100 120 L140 690" />
          <path d="M340 120 L360 690" />
        </g>
        <text
          x="220"
          y="410"
          fontSize="13"
          fill="#8A938C"
          fontFamily="Plus Jakarta Sans"
          fontWeight="600"
        >
          Admiralty Way
        </text>
        <text
          x="40"
          y="720"
          fontSize="14"
          fill="#7FA3B6"
          fontFamily="Plus Jakarta Sans"
          fontWeight="600"
        >
          Lekki Lagoon
        </text>
      </svg>

      {properties.map((property, index) => {
        const pos = pinPosition(property.id, index);
        const on = property.id === (activePropertyId ?? active?.id);
        return (
          <Box
            key={property.id}
            as="button"
            position="absolute"
            left={pos.left}
            top={pos.top}
            bg={on ? 'ink' : 'white'}
            color={on ? 'white' : 'ink'}
            borderRadius="full"
            px="13px"
            py="7px"
            fontWeight="800"
            fontSize="13px"
            boxShadow="0 3px 12px rgba(0,0,0,.18)"
            transform={on ? 'scale(1.08)' : 'none'}
            zIndex={on ? 3 : 2}
            cursor="pointer"
            border="none"
            onClick={() => setActivePropertyId(property.id)}
          >
            {formatNairaShort(property.pricing.nightly_rate)}
          </Box>
        );
      })}

      {active ? (
        <Box
          asChild
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          w="300px"
          maxW="90%"
          bg="white"
          borderRadius="16px"
          overflow="hidden"
          boxShadow="lg"
          zIndex={4}
        >
          <Link href={`/properties/${active.slug}`}>
            <Box position="relative" h="170px">
              <CoverImage
                src={active.picture}
                alt={active.name}
                sizes="300px"
              />
            </Box>
            <Box p="14px 16px">
              <Flex justify="space-between" gap={2} fontWeight="700" fontSize="15px">
                <Text lineClamp={1}>{active.name}</Text>
                <Flex align="center" gap="4px" fontSize="14px" flexShrink={0}>
                  <Star size={14} fill="currentColor" stroke="none" />
                  {active.review_summary.rating.toFixed(2)}
                </Flex>
              </Flex>
              <Text color="ink.2" fontSize="14px">
                {bedsGuestsLabel(active.capacity.beds, active.capacity.max)}
              </Text>
              <Text mt={1} fontSize="15px">
                <Text as="span" fontWeight="800">
                  {formatNaira(active.pricing.nightly_rate)}
                </Text>{' '}
                <Text as="span" color="ink.3">
                  night
                </Text>
              </Text>
            </Box>
          </Link>
        </Box>
      ) : null}

      <Flex
        position="absolute"
        right="20px"
        top="20px"
        direction="column"
        bg="white"
        borderRadius="12px"
        boxShadow="md"
        zIndex={4}
      >
        <Flex w="42px" h="42px" align="center" justify="center">
          <Plus size={18} strokeWidth={1.9} />
        </Flex>
        <Box borderTop="1px solid" borderColor="line" />
        <Flex w="42px" h="42px" align="center" justify="center">
          <Minus size={18} strokeWidth={1.9} />
        </Flex>
      </Flex>
    </Box>
  );
}
