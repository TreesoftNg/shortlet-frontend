'use client';

import { pagePx } from '@/shared/layout';
import { SunmadeLogo } from '@/shared/components/brand';
import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import Link from 'next/link';

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'All stays', href: '/search' },
      { label: 'Neighbourhoods', href: '/locations' },
      { label: 'Long stays', href: '/search' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help centre', href: '/contact' },
      { label: 'Cancellation policy', href: '/policies' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Terms', href: '/policies' },
      { label: 'Privacy', href: '/policies' },
    ],
  },
];

function SocialIcon({ label, path }: { label: string; path: string }) {
  return (
    <Box as="span" aria-label={label} display="inline-flex">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={path} />
      </svg>
    </Box>
  );
}

export function SiteFooter() {
  return (
    <Box
      as="footer"
      bg="bg.soft"
      borderTop="1px solid"
      borderColor="line"
      pt={{ base: 8, md: '48px' }}
      pb={{ base: '100px', md: '32px' }}
      px={pagePx}
      fontSize="14px"
      color="ink.2"
      maxW="1440px"
      mx="auto"
      w="full"
    >
      <Grid
        templateColumns={{
          base: '1fr',
          sm: '1fr 1fr',
          md: '1.4fr 1fr 1fr 1fr',
        }}
        gap={{ base: 8, md: '40px' }}
      >
        <Box gridColumn={{ base: '1 / -1', sm: '1 / -1', md: 'auto' }}>
          <Box mb="16px">
            <SunmadeLogo size="22px" />
          </Box>
          <Text maxW="320px">
            Premium shortlet apartments for business and leisure.
          </Text>
        </Box>

        {columns.map((col) => (
          <Box key={col.title}>
            <Text color="ink" fontSize="14px" fontWeight="700" mb="14px">
              {col.title}
            </Text>
            <Flex
              as="ul"
              direction="column"
              gap="10px"
              listStyleType="none"
              m={0}
              p={0}
            >
              {col.links.map((link) => (
                <Box as="li" key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </Box>
              ))}
            </Flex>
          </Box>
        ))}
      </Grid>

      <Flex
        mt={{ base: 8, md: '36px' }}
        pt="22px"
        borderTop="1px solid"
        borderColor="line"
        justify="space-between"
        align="center"
        direction={{ base: 'column', sm: 'row' }}
        gap={4}
      >
        <Text>© 2026 Sunmade Apartments & Suites</Text>
        <Text
        mt="14px"
        fontSize="12px"
        color="ink.3"
        textAlign={{ base: 'center', sm: 'left' }}
      >
        Built by Treesoft
      </Text>
        <Flex gap="16px">
          <SocialIcon
            label="Instagram"
            path="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z"
          />
          <SocialIcon
            label="Facebook"
            path="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
          />
          <SocialIcon
            label="X"
            path="M4 4l6.5 8.2L4.2 20h2.4l5-6.1L16.8 20H20l-6.7-8.4L19.8 4h-2.4l-4.6 5.6L7.2 4z"
          />
        </Flex>
      
      </Flex>

      
    </Box>
  );
}
