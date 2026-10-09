'use client';

import { LabeledField } from '@/shared/components';
import { Flex, Input } from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const fieldInputProps = {
  unstyled: true,
  fontSize: '15px',
  w: 'full',
  outline: 'none',
  lineHeight: '1.4',
  color: 'ink',
  _placeholder: { color: 'ink.3', fontWeight: '500' },
} as const;

type PasswordFieldProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  mb?: string | number;
  'aria-label'?: string;
};

export function PasswordField({
  label = 'Password',
  value,
  onChange,
  placeholder = 'Password',
  autoComplete = 'current-password',
  mb = '12px',
  'aria-label': ariaLabel = 'Password',
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <LabeledField label={label} mb={mb}>
      <Flex align="center" justify="space-between" gap="10px">
        <Input
          {...fieldInputProps}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          autoComplete={autoComplete}
        />
        <Flex
          as="button"
          align="center"
          justify="center"
          flexShrink={0}
          w="28px"
          h="28px"
          color="ink.3"
          bg="transparent"
          border="none"
          cursor="pointer"
          borderRadius="full"
          _hover={{ color: 'ink', bg: 'bg.soft' }}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? (
            <EyeOff size={18} strokeWidth={1.9} />
          ) : (
            <Eye size={18} strokeWidth={1.9} />
          )}
        </Flex>
      </Flex>
    </LabeledField>
  );
}
