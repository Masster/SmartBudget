"use client";

import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  addTransactionOpen: boolean;
  setAddTransactionOpen: (open: boolean) => void;

  selectedAccountId: string | null;
  setSelectedAccountId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  addTransactionOpen: false,
  setAddTransactionOpen: (open) => set({ addTransactionOpen: open }),

  selectedAccountId: null,
  setSelectedAccountId: (id) => set({ selectedAccountId: id }),
}));
