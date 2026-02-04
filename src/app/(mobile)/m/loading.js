import React from "react";

export default function Loading() {
  return (
    // High z-index ensures it covers everything while loading
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      {/* This uses the exact video styling from your previous LoaderStarter 
        but without the heavy framer-motion logic.
      */}
      <video
        src="/Loading/loading1.mp4"
        autoPlay
        muted
        loop // Loops in case the user has a slow connection
        playsInline
        className="w-full object-contain max-h-[25vh]"
      />
    </div>
  );
}