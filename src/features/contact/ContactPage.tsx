'use client';

import { ApiError } from '@/data/api/http';
import { submitContactMessage } from '@/data/api/contact';
import { usePublicContactDetails } from '@/data/hooks';
import {
  AppButton,
  AppPage,
  LabeledField,
  PageHero,
  Skeleton,
  Surface,
} from '@/shared/components';
import { Box, Flex, Grid, Heading, Input, Text, Textarea } from '@chakra-ui/react';
import { Check, Clock3, Mail, MessageCircle, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

type DetailItem = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}

export function ContactPage() {
  const { data: contact, isLoading: contactLoading } = usePublicContactDetails();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const details = useMemo((): DetailItem[] => {
    const items: DetailItem[] = [];
    const email = contact?.supportEmail?.trim();
    const phone = contact?.supportPhone?.trim();
    const whatsapp = contact?.whatsapp?.trim();

    if (email) {
      items.push({ icon: Mail, label: 'Email', value: email });
    }
    if (phone) {
      items.push({ icon: Phone, label: 'Phone', value: phone });
    }
    if (whatsapp) {
      items.push({ icon: MessageCircle, label: 'WhatsApp', value: whatsapp });
    }
    items.push({
      icon: Clock3,
      label: 'Support hours',
      value: '24/7 guest support',
    });
    return items;
  }, [contact]);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim() || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || undefined,
        message: message.trim(),
      });
      setSent(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
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
                  setError(null);
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
                  placeholder="Your name"
                  fontSize="15px"
                  w="full"
                  outline="none"
                  disabled={submitting}
                />
              </LabeledField>
              <LabeledField label="Email">
                <Input
                  unstyled
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  fontSize="15px"
                  w="full"
                  outline="none"
                  disabled={submitting}
                />
              </LabeledField>
              <LabeledField label="Subject">
                <Input
                  unstyled
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Booking question, check-in help, partnership"
                  fontSize="15px"
                  w="full"
                  outline="none"
                  disabled={submitting}
                />
              </LabeledField>
              <LabeledField label="Message">
                <Textarea
                  unstyled
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help…"
                  fontSize="15px"
                  w="full"
                  minH="140px"
                  outline="none"
                  resize="vertical"
                  disabled={submitting}
                />
              </LabeledField>

              {error ? (
                <Text color="red.500" fontSize="14px" fontWeight="600">
                  {error}
                </Text>
              ) : null}

              <AppButton
                size="lg"
                fullWidth
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Sending…' : 'Send message'}
              </AppButton>
            </Flex>
          )}
        </Surface>

        <Flex direction="column" gap="12px">
          {contactLoading
            ? Array.from({ length: 4 }, (_, index) => (
                <Surface key={index} radius="md" p="18px 20px">
                  <Flex align="center" gap="14px">
                    <Skeleton w="44px" h="44px" borderRadius="12px" />
                    <Box flex="1" minW={0}>
                      <Skeleton h="12px" w="64px" borderRadius="full" />
                      <Skeleton h="16px" w="70%" mt="8px" borderRadius="full" />
                    </Box>
                  </Flex>
                </Surface>
              ))
            : details.map((item) => {
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
