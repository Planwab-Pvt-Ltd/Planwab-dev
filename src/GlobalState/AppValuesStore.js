import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppValuesStore = create(
  persist(
    (set, get) => ({
      canContinue: false,
      allowedAction: null,
      leadData: null,
      sessionId: null,
      isVendorProfileVerified: false,

      setCanContinue: (value) => set({ canContinue: value }),

      setAllowedAction: (action) => set({ allowedAction: action }),

      setLeadData: (data) => set({ leadData: data }),

      setSessionId: (id) => set({ sessionId: id }),

      setIsVendorProfileVerified: (value) => set({ isVendorProfileVerified: value }),

      checkActionPermission: (requiredAction) => {
        const { canContinue, allowedAction } = get();
        return canContinue && allowedAction === requiredAction;
      },

      resetPermissions: () =>
        set({
          canContinue: false,
          allowedAction: null,
        }),

      resetAll: () =>
        set({
          canContinue: false,
          allowedAction: null,
          leadData: null,
          sessionId: null,
        }),
    }),
    {
      name: "app-values-storage",
      partialize: (state) => ({
        canContinue: state.canContinue,
        allowedAction: state.allowedAction,
        sessionId: state.sessionId,
        isVendorProfileVerified: state.isVendorProfileVerified,
      }),
    }
  )
);