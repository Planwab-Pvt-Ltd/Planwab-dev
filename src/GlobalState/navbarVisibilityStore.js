import { create } from "zustand";

export const useNavbarVisibilityStore = create((set) => ({
  isNavbarVisible: true, // boolean default
  setIsNavbarVisible: (value) => set(() => ({ isNavbarVisible: Boolean(value) })),
}));
