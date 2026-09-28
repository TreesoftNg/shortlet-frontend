/**
 * Property-page UI selection only (not server data).
 * Dates / nights live in `DEMO_STAY` until calendar is real.
 */

import { DEMO_STAY } from '@/data/demo-stay';
import { create } from 'zustand';

type PropertyBookingUiState = {
  selectedUnitId: string | null;
  guests: number;
  setSelectedUnitId: (id: string) => void;
  setGuests: (guests: number) => void;
  reset: () => void;
};

export const usePropertyBookingStore = create<PropertyBookingUiState>(
  (set) => ({
    selectedUnitId: null,
    guests: DEMO_STAY.guests,
    setSelectedUnitId: (id) => set({ selectedUnitId: id }),
    setGuests: (guests) => set({ guests }),
    reset: () =>
      set({ selectedUnitId: null, guests: DEMO_STAY.guests }),
  }),
);
