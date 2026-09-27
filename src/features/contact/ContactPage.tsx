'use client';

import { MobileTabBar } from '@/shared/components/MobileTabBar';
import { SiteFooter } from '@/shared/components/SiteFooter';
import { SiteHeader } from '@/shared/components/SiteHeader';
import { pagePx } from '@/shared/layout';
import { Box, Flex, Grid, Heading, Input, Text, Textarea } from '@chakra-ui/react';
import { Check, Clock3, Mail, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';

const details = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@sunmadeapartments.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+234 800 000 0000',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+234 800 000 0000',
  },
  {
    icon: Clock3,
    label: 'Support hours',
    value: '24/7 guest support',
  },
];

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSent(true);
  };

  return (
    <Box bg="bg" maxW="1440px" mx="auto" minH="100vh">
      <SiteHeader />

      <Box
        as="main"
        px={pagePx}
        pt={{ base: 8, md: 12 }}
        pb={{ base: '40px', md: 12 }}
      >
        <Box maxW="720px" mb={{ base: 8, md: 10 }}>
          <Text
            fontSize="13px"
            fontWeight="700"
            color="brand.500"
            textTransform="uppercase"
            letterSpacing="0.06em"
          >
            Support
          </Text>
          <Heading
            as="h1"
            mt="10px"
            fontSize={{ base: '32px', md: '42px' }}
            fontWeight="800"
            letterSpacing="-0.03em"
            lineHeight="1.15"
          >
            Contact us
          </Heading>
          <Text color="ink.2" fontSize={{ base: '15px', md: '16px' }} mt="14px">
            Questions about a booking, a stay, or partnering with Sunmade? Send a
            message — we usually reply within a few hours.
          </Text>
        </Box>

        <Grid
          templateColumns={{ base: '1fr', lg: '1.1fr 0.9fr' }}
          gap={{ base: 8, lg: 10 }}
          alignItems="start"
        >
          <Box
            border="1px solid"
            borderColor="line"
            borderRadius="20px"
            p={{ base: 5, md: 7 }}
          >
            {sent ? (
              <Flex direction="column" align="start" gap="14px" py={4}>
                <Flex
                  w="48px"
                  h="48px"
                  borderRadius="14px"
                  bg="brand.50"
                  color="brand.500"
                  align="center"
                  justify="center"
                >
                  <Check size={22} strokeWidth={2.2} />
                </Flex>
                <Heading
                  as="h2"
                  fontSize="22px"
                  fontWeight="800"
                  letterSpacing="-0.02em"
                >
                  Message sent
                </Heading>
                <Text color="ink.2" fontSize="15px">
                  Thanks {name.trim().split(' ')[0] || 'there'} — our team will
                  get back to you at {email.trim()} shortly.
                </Text>
                <Text
                  as="button"
                  mt="8px"
                  fontWeight="700"
                  textDecoration="underline"
                  cursor="pointer"
                  bg="transparent"
                  border="none"
                  p={0}
                  onClick={() => {
                    setSent(false);
                    setMessage('');
                  }}
                >
                  Send another message
                </Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="14px">
                <Field label="Full name">
                  <Input
                    unstyled
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Temitope Aladesiun"
                    fontSize="15px"
                    w="full"
                    outline="none"
                  />
                </Field>
                <Field label="Email">
                  <Input
                    unstyled
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    fontSize="15px"
                    w="full"
                    outline="none"
                  />
                </Field>
                <Field label="Subject">
                  <Input
                    unstyled
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Booking question"
                    fontSize="15px"
                    w="full"
                    outline="none"
                  />
                </Field>
                <Field label="Message">
                  <Textarea
                    unstyled
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help?"
                    fontSize="15px"
                    w="full"
                    minH="140px"
                    outline="none"
                    resize="vertical"
                  />
                </Field>

                <Flex
                  as="button"
                  h="52px"
                  align="center"
                  justify="center"
                  borderRadius="12px"
                  bg="brand.500"
                  color="white"
                  fontWeight="700"
                  fontSize="15px"
                  cursor="pointer"
                  border="none"
                  mt="4px"
                  _hover={{ bg: 'brand.600' }}
                  onClick={handleSubmit}
                >
                  Send message
                </Flex>
              </Flex>
            )}
          </Box>

          <Flex direction="column" gap="12px">
            {details.map((item) => {
              const Icon = item.icon;
              return (
                <Flex
                  key={item.label}
                  align="center"
                  gap="14px"
                  border="1px solid"
                  borderColor="line"
                  borderRadius="16px"
                  p="18px 20px"
                  bg="bg"
                >
                  <Flex
                    w="44px"
                    h="44px"
                    borderRadius="12px"
                    bg="bg.soft"
                    color="brand.500"
                    align="center"
                    justify="center"
                    flexShrink={0}
                  >
                    <Icon size={20} strokeWidth={1.9} />
                  </Flex>
                  <Box>
                    <Text fontSize="12px" fontWeight="700" color="ink.3">
                      {item.label}
                    </Text>
                    <Text fontWeight="700" mt="2px">
                      {item.value}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
          </Flex>
        </Grid>
      </Box>

      <SiteFooter />
      <MobileTabBar />
    </Box>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      border="1px solid"
      borderColor="#D5D5D0"
      borderRadius="12px"
      px="16px"
      py="12px"
      w="full"
    >
      <Text
        fontSize="11px"
        fontWeight="700"
        textTransform="uppercase"
        letterSpacing="0.04em"
        mb="2px"
      >
        {label}
      </Text>
      {children}
    </Box>
  );
}
