import { create } from "zustand";

export const useCategoryStore = create((set) => ({
  activeCategory: "Default",
  activeCategoryDesktop: "events",
  setActiveCategory: (category) => set({ activeCategory: category }),
  setActiveCategoryDesktop: (category) => set({ activeCategoryDesktop: category }),
}));
