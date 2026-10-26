'use client';

import { Box, Text } from '@chakra-ui/react';
import { useState } from 'react';

type PropertyDescriptionProps = {
  description: string;
  houseRules?: string | null;
};

export function PropertyDescription({
  description,
  houseRules,
}: PropertyDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const fullText = [description.trim(), houseRules?.trim()]
    .filter(Boolean)
    .join('\n\n');

  if (!fullText) return null;

  const needsToggle = fullText.length > 160 || fullText.includes('\n');

  return (
    <Box py="28px" borderBottom="1px solid" borderColor="line">
      <Text
        color="ink.2"
        whiteSpace="pre-wrap"
        lineClamp={expanded || !needsToggle ? undefined : 3}
      >
        {fullText}
      </Text>
      {needsToggle ? (
        <Text
          as="button"
          mt="10px"
          color="ink"
          textDecoration="underline"
          fontWeight="700"
          cursor="pointer"
          bg="transparent"
          border="none"
          p={0}
          fontSize="14px"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </Text>
      ) : null}
    </Box>
  );
}
