import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create()(
  persist(
    (set, get) => ({
      activeCategory: "",
      setActiveCategory: (category) => set({ activeCategory: category }),
      cartItems: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find((i) => i._id === item._id);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((i) => (i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)),
            };
          }
          return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
        }),
      removeFromCart: (itemId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i._id !== itemId),
        })),
      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          cartItems:
            quantity <= 0
              ? state.cartItems.filter((i) => i._id !== itemId)
              : state.cartItems.map((i) => (i._id === itemId ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ cartItems: [] }),
      isInCart: (itemId) => get().cartItems.some((i) => i._id === itemId),
      getCartTotal: () => get().cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getCartCount: () => get().cartItems.reduce((sum, item) => sum + item.quantity, 0),
      openCartNavbar: "close",
      setOpenCartNavbar: (value) => set({ openCartNavbar: value }),
    }),
    {
      name: "cart-storage",
    }
  )
);
