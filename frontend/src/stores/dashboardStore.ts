import { create } from "zustand";
import type { SortDirection, SortField } from "../types";

interface DashboardState {
  selectedCoinId: string | null;
  sortField: SortField;
  sortDirection: SortDirection;
  selectCoin: (id: string) => void;
  clearSelection: () => void;
  setSort: (field: SortField, direction: SortDirection) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedCoinId: null,
  sortField: "market_cap",
  sortDirection: "desc",
  selectCoin: (id) => set({ selectedCoinId: id }),
  clearSelection: () => set({ selectedCoinId: null }),
  setSort: (field, direction) => set({ sortField: field, sortDirection: direction }),
}));
