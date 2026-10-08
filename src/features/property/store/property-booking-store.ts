/**
 * Property-page UI selection only (not server data).
 */

import { getDefaultStay } from '@/shared/lib/default-stay';
import { create } from 'zustand';

type PropertyBookingUiState = {
  selectedUnitId: string | null;
  guests: number;
  checkIn: string;
  checkOut: string;
  setSelectedUnitId: (id: string) => void;
  setGuests: (guests: number) => void;
  setDates: (checkIn: string, checkOut: string) => void;
  reset: () => void;
};

function buildDefaults() {
  const stay = getDefaultStay();
  return {
    selectedUnitId: null as string | null,
    guests: stay.guests,
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
  };
}

const defaults = buildDefaults();

export const usePropertyBookingStore = create<PropertyBookingUiState>(
  (set) => ({
    ...defaults,
    setSelectedUnitId: (id) => set({ selectedUnitId: id }),
    setGuests: (guests) => set({ guests: Math.min(16, Math.max(1, guests)) }),
    setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
    reset: () => set({ ...buildDefaults() }),
  }),
);
