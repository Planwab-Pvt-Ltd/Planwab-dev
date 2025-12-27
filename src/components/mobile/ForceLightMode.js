"use client";

import { useLayoutEffect, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// Safe layout effect to avoid server-side rendering warnings
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ForceLightMode({ children }) {
  const { setTheme } = useTheme();

  useIsomorphicLayoutEffect(() => {
    // 1. Direct DOM Manipulation (Fastest Method)
    // We do this directly on the DOM node to bypass React state delays
    const root = window.document.documentElement;

    // If 'dark' class exists, remove it instantly
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      root.classList.add("light");
    } else if (!root.classList.contains("light")) {
      // Ensure light is present if missing
      root.classList.add("light");
    }

    // 2. Update LocalStorage immediately
    // This prevents the ThemeProvider from reverting back on next reload
    localStorage.setItem("planwab-admin-theme", "light");

    // 3. Sync React State
    // Finally, update the context state so the rest of the app knows
    setTheme("light");
  }, [setTheme]);

  return <>{children}</>;
}
