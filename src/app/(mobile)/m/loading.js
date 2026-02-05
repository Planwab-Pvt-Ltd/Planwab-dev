import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[10] flex items-center justify-center bg-white">
      <video
        src="/Loading/loading1.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full object-contain max-h-[25vh]"
      />
    </div>
  );
}