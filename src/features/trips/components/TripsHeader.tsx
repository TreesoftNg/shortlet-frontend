'use client';

import { Box, Flex, Text } from '@chakra-ui/react';
import { Bell, Home, Menu } from 'lucide-react';
import Link from 'next/link';

const links = [
  { href: '/', label: 'Stays' },
  { href: '/trips', label: 'My trips', active: true },
  { href: '/saved', label: 'Saved' },
  { href: '/inbox', label: 'Messages' },
];

export function TripsHeader() {
  return (
    <Flex
      as="header"
      h={{ base: '64px', md: '80px' }}
      align="center"
      justify="space-between"
      px={{ base: 4, md: 10, lg: '80px' }}
      borderBottom="1px solid"
      borderColor="line"
      bg="bg"
      maxW="1440px"
      mx="auto"
      w="full"
      position="sticky"
      top={0}
      zIndex={40}
    >
      <Link href="/">
        <Flex
          align="center"
          gap="10px"
          fontWeight="800"
          fontSize={{ base: '18px', md: '22px' }}
          color="brand.500"
          letterSpacing="-0.02em"
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

      <Flex
        as="nav"
        gap={{ md: '20px', lg: '30px' }}
        fontWeight="600"
        fontSize="14px"
        color="ink.2"
        display={{ base: 'none', md: 'flex' }}
      >
        {links.map((link) => (
          <Box
            key={link.label}
            asChild
            color={link.active ? 'ink' : 'ink.2'}
            position="relative"
            _after={
              link.active
                ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: '-29px',
                    h: '2px',
                    bg: 'ink',
                  }
                : undefined
            }
          >
            <Link href={link.href}>{link.label}</Link>
          </Box>
        ))}
      </Flex>

      <Flex align="center" gap="14px">
        <Box color="ink.2" display={{ base: 'none', sm: 'block' }}>
          <Bell size={18} strokeWidth={1.9} />
        </Box>
        <Flex
          asChild
          align="center"
          gap="10px"
          py="6px"
          pl="14px"
          pr="6px"
          border="1px solid"
          borderColor="line"
          borderRadius="full"
        >
          <Link href="/account">
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
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}
