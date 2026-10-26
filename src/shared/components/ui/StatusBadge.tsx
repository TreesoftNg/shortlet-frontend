'use client';

import type { BookingStatus } from '@/data/types';
import { Flex } from '@chakra-ui/react';

type StatusBadgeProps = {
  status: BookingStatus;
  label?: string;
};

const defaultLabel: Record<BookingStatus, string> = {
  confirmed: 'Upcoming',
  completed: 'Completed',
  cancelled: 'Cancelled',
  pending: 'Pending',
  expired: 'Expired',
  checked_in: 'Checked in',
};

const statusStyles: Record<BookingStatus, { bg: string; color: string }> = {
  confirmed: { bg: 'brand.50', color: 'brand.600' },
  completed: { bg: 'line.2', color: 'ink.2' },
  cancelled: { bg: '#FCEAEA', color: '#B42318' },
  pending: { bg: '#FFF6E8', color: '#B54708' },
  expired: { bg: '#FCEAEA', color: '#B42318' },
  checked_in: { bg: '#E6F6EC', color: 'ok' },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = statusStyles[status] ?? statusStyles.cancelled;

  return (
    <Flex
      px="10px"
      py="4px"
      borderRadius="full"
      bg={style.bg}
      color={style.color}
      fontSize="12px"
      fontWeight="700"
      flexShrink={0}
      display="inline-flex"
      align="center"
    >
      {label ?? defaultLabel[status] ?? status}
    </Flex>
  );
}
