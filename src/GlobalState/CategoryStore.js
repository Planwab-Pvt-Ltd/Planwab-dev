import { create } from 'zustand';

export const useCategoryStore = create((set) => ({
  activeCategory: 'Wedding',
  setActiveCategory: (category) => set({ activeCategory: category }),
}));