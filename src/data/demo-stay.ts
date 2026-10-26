/**
 * Default demo stay. Search mini-bar can override dates/guests in UI state.
 * Keep out of Zustand — these are not user session data.
 */
export const DEMO_STAY = {
  nights: 4,
  guests: 2,
  checkIn: '2026-10-12',
  checkOut: '2026-10-16',
  checkInLabel: '10/12/2026',
  checkOutLabel: '10/16/2026',
  datesRangeLabel: 'Oct 12 – 16',
  datesLabel: 'Oct 12 – 16, 2026 · 4 nights',
  checkInShort: 'Mon, Oct 12',
  checkOutShort: 'Fri, Oct 16',
  holdSeconds: 14 * 60 + 52,
} as const;
