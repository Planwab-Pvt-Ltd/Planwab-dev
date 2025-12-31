"use client";

import { useState, useEffect } from "react";
import PlanWABLoader from "./LoaderStarter";

export default function AppEntryGate({ children }) {
  // 1. State: Manages the loader visibility
  const [showLoader, setShowLoader] = useState(true);

  // 2. Professional Scroll Locking Strategy
  // We lock the BODY, not just the main container.
  // This prevents "overscroll" (pull-to-refresh) effects on mobile while loading.
  useEffect(() => {
    if (showLoader) {
      // Save original style
      const originalOverflow = document.body.style.overflow;
      const originalHeight = document.body.style.height;

      // Lock scroll
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh"; // Locks iOS elastic scroll
      document.body.style.touchAction = "none"; // Disables touch interactions

      // Cleanup function: Unlocks scroll when loader finishes
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.height = originalHeight;
        document.body.style.touchAction = "auto";
      };
    }
  }, [showLoader]);

  return (
    <>
      <div
        aria-hidden={showLoader}
        className={
          showLoader
            ? "pointer-events-none select-none opacity-90 transition-all duration-500"
            : "opacity-100 transition-all duration-500"
        }
      >
        {children}
      </div>
      {showLoader && (
        <PlanWABLoader
          videoSrc="/Loading/loading1.mp4"
          onComplete={() => {
            setShowLoader(false);
          }}
        />
      )}
    </>
  );
}
