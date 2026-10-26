'use client';

import { AppButton } from '@/shared/components';
import { Box, Flex, Textarea } from '@chakra-ui/react';
import { useState } from 'react';

type MessageComposerProps = {
  disabled?: boolean;
  sending?: boolean;
  onSend: (content: string) => Promise<void> | void;
  onTyping?: () => void;
  onStopTyping?: () => void;
};

export function MessageComposer({
  disabled = false,
  sending = false,
  onSend,
  onTyping,
  onStopTyping,
}: MessageComposerProps) {
  const [value, setValue] = useState('');
  const canSend = !disabled && !sending && value.trim().length > 0;

  async function handleSubmit() {
    if (!canSend) return;
    const content = value.trim();
    setValue('');
    onStopTyping?.();
    await onSend(content);
  }

  return (
    <Box
      borderTop="1px solid"
      borderColor="line"
      pt={3}
      pb={{ base: 2, md: 0 }}
    >
      <Flex gap={2} align="flex-end">
        <Textarea
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            onTyping?.();
          }}
          onBlur={() => onStopTyping?.()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void handleSubmit();
            }
          }}
          placeholder="Write a message…"
          rows={2}
          resize="none"
          disabled={disabled || sending}
          borderColor="line"
          _focusVisible={{ borderColor: 'brand.500', boxShadow: 'none' }}
          flex="1"
        />
        <AppButton
          size="md"
          disabled={!canSend}
          onClick={() => void handleSubmit()}
        >
          {sending ? 'Sending…' : 'Send'}
        </AppButton>
      </Flex>
    </Box>
  );
}
