import {
  formatDatesRangeLabel,
  nightsBetween,
  toISODate,
} from '@/shared/lib/format';

const DEFAULT_GUESTS = 2;
const DEFAULT_NIGHTS = 4;

function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfLocalDay(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Real default stay window starting today (not a hardcoded demo range). */
export function getDefaultStay(now = new Date()) {
  const checkInDate = startOfLocalDay(now);
  const checkOutDate = addDays(checkInDate, DEFAULT_NIGHTS);
  const checkIn = toISODate(checkInDate);
  const checkOut = toISODate(checkOutDate);
  return {
    guests: DEFAULT_GUESTS,
    nights: DEFAULT_NIGHTS,
    checkIn,
    checkOut,
    datesRangeLabel: formatDatesRangeLabel(checkIn, checkOut),
  };
}

export type StayDatePreset = {
  label: string;
  checkIn: string;
  checkOut: string;
};

/** Quick picks relative to today for search date pickers. */
export function getStayDatePresets(now = new Date()): StayDatePreset[] {
  const today = startOfLocalDay(now);
  const day = today.getDay(); // 0 Sun … 6 Sat

  const daysUntilFriday = (5 - day + 7) % 7 || 7;
  const thisWeekendStart = addDays(today, daysUntilFriday);
  const nextWeekendStart = addDays(thisWeekendStart, 7);
  const nextWeekStart = addDays(today, 7);

  const presets: Array<{ label: string; start: Date; nights: number }> = [
    { label: '4 nights', start: today, nights: 4 },
    {
      label: 'This weekend',
      start: thisWeekendStart,
      nights: 2,
    },
    {
      label: 'Next weekend',
      start: nextWeekendStart,
      nights: 2,
    },
    {
      label: 'Next week',
      start: nextWeekStart,
      nights: 4,
    },
  ];

  return presets.map((preset) => {
    const checkIn = toISODate(preset.start);
    const checkOut = toISODate(addDays(preset.start, preset.nights));
    return {
      label: `${preset.label} · ${formatDatesRangeLabel(checkIn, checkOut)}`,
      checkIn,
      checkOut,
    };
  });
}

export function minBookableDate(now = new Date()): string {
  return toISODate(startOfLocalDay(now));
}

export function stayNights(checkIn: string, checkOut: string): number {
  return nightsBetween(checkIn, checkOut);
}
