import { create } from 'zustand';

export const useCategoryStore = create((set) => ({
  activeCategory: '',
  setActiveCategory: (category) => set({ activeCategory: category }),
}));