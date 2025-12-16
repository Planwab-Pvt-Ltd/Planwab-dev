"use client";

import { useState } from "react";
import PlanWABLoader from "./LoaderStarter";

export default function AppEntryGate({ children }) {
  // Always start as true to show loader on every refresh
  const [showLoader, setShowLoader] = useState(true);

  return (
    <>
      {/* 1. Render the App Content IMMEDIATELY.
        We hide the scrollbar while loading so the user can't scroll 
        while the doors are closed.
      */}
      <main className={showLoader ? "h-screen overflow-hidden" : ""}>{children}</main>

      {/* 2. Render the Loader ON TOP.
        When the loader finishes its internal animation sequence, 
        it calls onComplete, which we use to remove it.
      */}
      {showLoader && <PlanWABLoader videoSrc="/Loading/loading1.mp4" onComplete={() => setShowLoader(false)} />}
    </>
  );
}
