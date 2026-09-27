'use client';

import type { PaymentMethod } from '@/data/hooks';
import { Box, Flex, Text } from '@chakra-ui/react';
import { CreditCard, Landmark, ShieldCheck, Smartphone } from 'lucide-react';

const methods: {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  icon: typeof CreditCard;
}[] = [
  {
    id: 'card',
    title: 'Debit / Credit card',
    subtitle: 'Visa, Mastercard, Verve',
    icon: CreditCard,
  },
  {
    id: 'transfer',
    title: 'Bank transfer',
    subtitle: 'Pay into a one-time account number',
    icon: Landmark,
  },
  {
    id: 'ussd',
    title: 'USSD',
    subtitle: 'Pay from any Nigerian bank',
    icon: Smartphone,
  },
];

type PaymentMethodsProps = {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
};

export function PaymentMethods({ value, onChange }: PaymentMethodsProps) {
  return (
    <Box>
      <Flex justify="space-between" align="center" mb="16px">
        <Flex align="center">
          <Flex
            w="28px"
            h="28px"
            borderRadius="full"
            bg="ink"
            color="white"
            align="center"
            justify="center"
            fontSize="13px"
            fontWeight="700"
            mr="12px"
          >
            3
          </Flex>
          <Text fontSize="18px" fontWeight="700">
            Pay with
          </Text>
        </Flex>
        <Flex align="center" gap="6px" color="ink.2" fontSize="14px">
          <ShieldCheck size={16} strokeWidth={1.9} color="#1F9D55" />
          Encrypted &amp; secure
        </Flex>
      </Flex>

      {methods.map((method) => {
        const Icon = method.icon;
        const on = value === method.id;
        return (
          <Flex
            key={method.id}
            as="button"
            w="full"
            align="center"
            gap="14px"
            border={on ? '2px solid' : '1px solid'}
            borderColor={on ? 'brand.500' : 'line'}
            borderRadius="14px"
            p={on ? '17px' : '18px'}
            mb="10px"
            bg={on ? 'brand.50' : 'white'}
            cursor="pointer"
            textAlign="left"
            onClick={() => onChange(method.id)}
          >
            <Box
              w="22px"
              h="22px"
              borderRadius="full"
              border={on ? '7px solid' : '2px solid'}
              borderColor={on ? 'brand.500' : '#C9C9C4'}
              flexShrink={0}
            />
            <Flex
              w="42px"
              h="42px"
              borderRadius="10px"
              bg="white"
              border="1px solid"
              borderColor="line"
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Icon size={20} strokeWidth={1.9} />
            </Flex>
            <Box flex="1">
              <Text as="b" fontWeight="700">
                {method.title}
              </Text>
              <Text color="ink.2" fontSize="14px">
                {method.subtitle}
              </Text>
            </Box>
          </Flex>
        );
      })}

      <Text color="ink.3" fontSize="13px" mt="8px">
        You&apos;ll complete payment on our secure payment partner&apos;s page.
      </Text>
    </Box>
  );
}
