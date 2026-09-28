/**
 * Ephemeral search UI — map pin ↔ card hover sync.
 * Result lists come from React Query (`useProperties`), not this store.
 */

import { create } from 'zustand';

type SearchUiState = {
  activePropertyId: string | null;
  setActivePropertyId: (id: string | null) => void;
};

export const useSearchUiStore = create<SearchUiState>((set) => ({
  activePropertyId: null,
  setActivePropertyId: (id) => set({ activePropertyId: id }),
}));
