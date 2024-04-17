import { create } from "zustand";

export const useStore = create((set) => ({
  pageLoading: false,
  setPageLoading: (pageLoading) => set({ pageLoading }),
}));
