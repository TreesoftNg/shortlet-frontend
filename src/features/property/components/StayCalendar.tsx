'use client';

import { shortArea } from '@/shared/lib/format';
import { Box, Grid, Heading, Text } from '@chakra-ui/react';

type StayCalendarProps = {
  areaLabel: string;
  nights: number;
};

/** Static visual calendar matching design mock (Oct–Nov 2026). */
export function StayCalendar({ areaLabel, nights }: StayCalendarProps) {
  const oct = [
    '',
    '',
    '',
    '',
    'x1',
    'x2',
    'x3',
    '4',
    '5',
    '6',
    'x7',
    'x8',
    '9',
    '10',
    '11',
    'sel12',
    'rng13',
    'rng14',
    'rng15',
    'sel16',
    '17',
    '18',
    '19',
    '20',
    '21',
    'x22',
    'x23',
    'x24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
  ];

  const nov = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    'x13',
    'x14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
  ];

  return (
    <Box py="28px" display={{ base: 'none', md: 'block' }}>
      <Heading as="h2" fontSize="22px" fontWeight="700" letterSpacing="-0.01em">
        {nights} nights in {shortArea(areaLabel)}
      </Heading>
      <Text color="ink.2" fontSize="14px" mt={1}>
        Oct 12, 2026 – Oct 16, 2026
      </Text>

      <Grid templateColumns={{ md: '1fr 1fr' }} gap={{ md: 8, lg: '50px' }} mt="18px">
        <MonthGrid title="October 2026" cells={oct} />
        <MonthGrid title="November 2026" cells={nov} />
      </Grid>
    </Box>
  );
}

function MonthGrid({ title, cells }: { title: string; cells: string[] }) {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <Box>
      <Text as="b" display="block" textAlign="center" mb="14px" fontWeight="700">
        {title}
      </Text>
      <Grid templateColumns="repeat(7, 1fr)" textAlign="center" fontSize="13px" rowGap="4px">
        {days.map((d) => (
          <Text key={d} color="ink.3" fontWeight="600" fontSize="12px" pb="6px">
            {d}
          </Text>
        ))}
        {cells.map((cell, i) => {
          if (!cell) return <Box key={`e-${i}`} h="40px" />;
          const blocked = cell.startsWith('x');
          const selected = cell.startsWith('sel');
          const range = cell.startsWith('rng');
          const num = cell.replace(/^(x|sel|rng)/, '');

          return (
            <Box
              key={`${title}-${i}`}
              h="40px"
              display="grid"
              placeItems="center"
              fontWeight={blocked ? 500 : 600}
              color={blocked ? '#C4C4C0' : selected ? 'white' : 'ink'}
              textDecoration={blocked ? 'line-through' : 'none'}
              bg={selected ? 'ink' : range ? 'bg.soft' : 'transparent'}
              borderRadius={selected ? 'full' : range ? '0' : undefined}
            >
              {num}
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}
