import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppValuesStore = create(
  persist(
    (set, get) => ({
      canContinue: false,
      allowedAction: null,
      leadData: null,
      sessionId: null,

      setCanContinue: (value) => set({ canContinue: value }),

      setAllowedAction: (action) => set({ allowedAction: action }),

      setLeadData: (data) => set({ leadData: data }),

      setSessionId: (id) => set({ sessionId: id }),

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
      }),
    }
  )
);