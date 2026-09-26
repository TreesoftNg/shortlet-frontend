'use client';

import {
  badgeLabel,
  bedsGuestsLabel,
  bedsOnlyLabel,
  formatLocation,
  formatNaira,
  shortArea,
} from '@/shared/lib/format';
import type { Property } from '@/data/types';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type PropertyCardProps = {
  property: Property;
  initiallySaved?: boolean;
  variant?: 'home' | 'search';
  nights?: number;
  onHover?: (id: string | null) => void;
  isActive?: boolean;
};

export function PropertyCard({
  property,
  initiallySaved = false,
  variant = 'home',
  nights = 4,
  onHover,
  isActive = false,
}: PropertyCardProps) {
  const [saved, setSaved] = useState(initiallySaved);
  const [hovered, setHovered] = useState(false);
  const badge = property.badges[0];
  const imageCount = Math.min(property.images.length || 1, 4);
  const total = property.pricing.nightly_rate * nights;
  const liftImage = variant === 'search' && (hovered || isActive);

  return (
    <Box asChild>
      <Link
        href={`/properties/${property.slug}`}
        onMouseEnter={() => {
          setHovered(true);
          onHover?.(property.id);
        }}
        onMouseLeave={() => {
          setHovered(false);
          onHover?.(null);
        }}
      >
        <Box
          position="relative"
          borderRadius={{ base: '16px', md: 'md' }}
          overflow="hidden"
          aspectRatio={
            variant === 'search'
              ? '1 / 1'
              : { base: '1 / 0.9', md: '1 / 0.95' }
          }
        >
          <Box
            position="absolute"
            inset={0}
            transition="transform 0.25s ease"
            transform={liftImage ? 'scale(1.04)' : 'scale(1)'}
          >
            <Image
              src={property.picture}
              alt={property.public_name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              style={{ objectFit: 'cover' }}
            />
          </Box>
          {badge ? (
            <Box
              position="absolute"
              top="14px"
              left="14px"
              bg="white"
              borderRadius="full"
              px="12px"
              py="5px"
              fontSize="12px"
              fontWeight="700"
              boxShadow="md"
            >
              {badgeLabel(badge)}
            </Box>
          ) : null}
          <Box
            as="button"
            position="absolute"
            top="14px"
            right="14px"
            color="white"
            filter="drop-shadow(0 1px 3px rgba(0,0,0,.4))"
            bg="transparent"
            border="none"
            cursor="pointer"
            p={0}
            onClick={(e) => {
              e.preventDefault();
              setSaved((v) => !v);
            }}
            aria-label={saved ? 'Unsave' : 'Save'}
          >
            <Heart
              size={24}
              strokeWidth={1.9}
              fill={saved ? '#0E7C6B' : 'none'}
              color="white"
            />
          </Box>
          <Flex
            position="absolute"
            bottom="12px"
            left="50%"
            transform="translateX(-50%)"
            gap="5px"
          >
            {Array.from({ length: imageCount }).map((_, i) => (
              <Box
                key={i}
                w="6px"
                h="6px"
                borderRadius="full"
                bg={i === 0 ? 'white' : 'rgba(255,255,255,.6)'}
              />
            ))}
          </Flex>
        </Box>

        <Box pt="12px">
          {variant === 'search' ? (
            <>
              <Flex
                justify="space-between"
                gap="10px"
                fontWeight="700"
                fontSize="15px"
              >
                <Text as="span" lineClamp={1}>
                  {property.name}
                </Text>
                <Flex
                  as="span"
                  align="center"
                  gap="4px"
                  fontWeight="600"
                  fontSize="14px"
                  flexShrink={0}
                >
                  <Star size={14} fill="currentColor" stroke="none" />
                  {property.review_summary.rating.toFixed(
                    property.review_summary.rating % 1 === 0 ? 1 : 2,
                  )}
                </Flex>
              </Flex>
              <Text color="ink.2" fontSize="14px" mt="2px">
                {shortArea(property.address.display)} ·{' '}
                {bedsOnlyLabel(property.capacity.beds)}
              </Text>
              <Text mt="6px" fontSize="15px">
                <Text as="span" fontWeight="800">
                  {formatNaira(property.pricing.nightly_rate)}
                </Text>{' '}
                <Text as="span" color="ink.3">
                  night ·
                </Text>{' '}
                <Text as="span" color="ink.3" textDecoration="underline">
                  {formatNaira(total)} total
                </Text>
              </Text>
            </>
          ) : (
            <>
              <Flex
                justify="space-between"
                gap="10px"
                fontWeight="700"
                fontSize="15px"
              >
                <Text as="span" lineClamp={1}>
                  {formatLocation(property.address.display)}
                </Text>
                <Flex
                  as="span"
                  align="center"
                  gap="4px"
                  fontWeight="600"
                  fontSize="14px"
                  flexShrink={0}
                >
                  <Star size={14} fill="currentColor" stroke="none" />
                  {property.review_summary.rating.toFixed(
                    property.review_summary.rating % 1 === 0 ? 1 : 2,
                  )}
                </Flex>
              </Flex>
              <Text color="ink.2" fontSize="14px" mt="2px" lineClamp={1}>
                {property.name}
              </Text>
              <Text color="ink.2" fontSize="14px">
                {bedsGuestsLabel(property.capacity.beds, property.capacity.max)}
              </Text>
              <Text mt="6px" fontSize="15px">
                <Text as="span" fontWeight="800">
                  {formatNaira(property.pricing.nightly_rate)}
                </Text>{' '}
                <Text as="span" color="ink.3">
                  night
                </Text>
              </Text>
            </>
          )}
        </Box>
      </Link>
    </Box>
  );
}
