'use client';

import {
  AppButton,
  AppPage,
  LabeledField,
  PageHero,
  Surface,
} from '@/shared/components';
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
    <AppPage mainPt={{ base: 8, md: 12 }}>
      <PageHero
        eyebrow="Support"
        title="Contact us"
        description="Questions about a booking, a stay, or partnering with Sunmade? Send a message — we usually reply within a few hours."
      />

      <Grid
        templateColumns={{ base: '1fr', lg: '1.1fr 0.9fr' }}
        gap={{ base: 8, lg: 10 }}
        alignItems="start"
      >
        <Surface radius="xl" p={{ base: 5, md: 7 }}>
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
                Thanks {name.trim().split(' ')[0] || 'there'} — our team will get
                back to you at {email.trim()} shortly.
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
              <LabeledField label="Full name">
                <Input
                  unstyled
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Temitope Aladesiun"
                  fontSize="15px"
                  w="full"
                  outline="none"
                />
              </LabeledField>
              <LabeledField label="Email">
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
              </LabeledField>
              <LabeledField label="Subject">
                <Input
                  unstyled
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Booking question"
                  fontSize="15px"
                  w="full"
                  outline="none"
                />
              </LabeledField>
              <LabeledField label="Message">
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
              </LabeledField>

              <AppButton size="lg" fullWidth onClick={handleSubmit}>
                Send message
              </AppButton>
            </Flex>
          )}
        </Surface>

        <Flex direction="column" gap="12px">
          {details.map((item) => {
            const Icon = item.icon;
            return (
              <Surface key={item.label} radius="md" p="18px 20px">
                <Flex align="center" gap="14px">
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
              </Surface>
            );
          })}
        </Flex>
      </Grid>
    </AppPage>
  );
}
