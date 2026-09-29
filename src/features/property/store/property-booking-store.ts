/**
 * Property-page UI selection only (not server data).
 */

import { DEMO_STAY } from '@/data/demo-stay';
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

const defaults = {
  selectedUnitId: null as string | null,
  guests: DEMO_STAY.guests,
  checkIn: DEMO_STAY.checkIn,
  checkOut: DEMO_STAY.checkOut,
};

export const usePropertyBookingStore = create<PropertyBookingUiState>(
  (set) => ({
    ...defaults,
    setSelectedUnitId: (id) => set({ selectedUnitId: id }),
    setGuests: (guests) => set({ guests: Math.min(16, Math.max(1, guests)) }),
    setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
    reset: () => set({ ...defaults }),
  }),
);
