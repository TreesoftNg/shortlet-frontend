import { create } from 'zustand';

type PropertyBookingState = {
  selectedUnitId: string | null;
  guests: number;
  nights: number;
  checkInLabel: string;
  checkOutLabel: string;
  setSelectedUnitId: (id: string) => void;
  setGuests: (guests: number) => void;
};

export const usePropertyBookingStore = create<PropertyBookingState>((set) => ({
  selectedUnitId: null,
  guests: 2,
  nights: 4,
  checkInLabel: '10/12/2026',
  checkOutLabel: '10/16/2026',
  setSelectedUnitId: (id) => set({ selectedUnitId: id }),
  setGuests: (guests) => set({ guests }),
}));
