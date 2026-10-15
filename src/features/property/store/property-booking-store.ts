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
    // Upper bound is enforced by the listing UI (unit/property capacity).
    setGuests: (guests) => set({ guests: Math.max(1, Math.floor(guests) || 1) }),
    setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
    reset: () => set({ ...buildDefaults() }),
  }),
);
