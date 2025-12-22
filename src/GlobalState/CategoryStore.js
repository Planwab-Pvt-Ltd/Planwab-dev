import { create } from "zustand";

export const useCategoryStore = create((set) => ({
  activeCategory: "Default",
  setActiveCategory: (category) => set({ activeCategory: category }),
}));
