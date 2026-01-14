"use client";

import { useState, useEffect } from "react";
import PlanWABLoader from "./LoaderStarter";

let hasAppLoaded = false;

export default function AppEntryGate({ children }) {
  const [showLoader, setShowLoader] = useState(!hasAppLoaded);

  useEffect(() => {
    if (showLoader) {
      const originalOverflow = document.body.style.overflow;
      const originalHeight = document.body.style.height;

      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.body.style.touchAction = "none";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.height = originalHeight;
        document.body.style.touchAction = "auto";
      };
    }
  }, [showLoader]);

  const handleLoaderComplete = () => {
    hasAppLoaded = true; 
    setShowLoader(false); 
  };
  if (hasAppLoaded) {
    return <>{children}</>;
  }

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
          onComplete={handleLoaderComplete}
        />
      )}
    </>
  );
}