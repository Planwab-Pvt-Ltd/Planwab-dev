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
      {/* 3. The "Paint-Underneath" Strategy
         We render 'children' immediately. This allows React to 
         build the DOM, load images, and run effects in the background.
         
         'aria-hidden' ensures screen readers don't announce the app 
         content while the loader is still visible.
      */}
      <div
        aria-hidden={showLoader}
        className={
          showLoader
            ? "pointer-events-none select-none filter blur-[1px] opacity-90 transition-all duration-500"
            : "opacity-100 blur-0 transition-all duration-500"
        }
      >
        {children}
      </div>

      {/* 4. The Loader Portal
         Rendered conditionally. When onComplete fires, we unmount it.
      */}
      {showLoader && (
        <PlanWABLoader
          videoSrc="/Loading/loading1.mp4"
          onComplete={() => {
            // Optional: You can add a tiny delay here if you want to overlap
            // the door opening with the scroll unlock
            setShowLoader(false);
          }}
        />
      )}
    </>
  );
}
