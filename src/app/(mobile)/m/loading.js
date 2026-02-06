import React from "react";

export default function Loading() {
  return (
    <>
      <div className="min-h-screen" aria-hidden="true" />

      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white px-4">
        <div className="relative flex flex-col items-center gap-6">
          {/* Logo with border fallback */}
          <div className="animate-pulse">
            <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-2xl border-2 border-gray-100 bg-gray-50/50 flex items-center justify-center overflow-hidden shadow-sm">
              <img
                src="/planwablogo.png"
                alt="PlanWAB"
                width={140}
                height={140}
                className="w-full h-full object-contain"
                draggable={false}
                fetchPriority="high"
                decoding="sync"
                loading="eager"
              />
            </div>
          </div>

          {/* Bouncing dots */}
          <div className="flex items-center gap-2">
            {[
              { color: "bg-blue-600", delay: "0ms" },
              { color: "bg-blue-500", delay: "150ms" },
              { color: "bg-blue-400", delay: "300ms" },
            ].map((dot, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${dot.color} animate-bounce`}
                style={{
                  animationDelay: dot.delay,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>

          {/* Loading text */}
          <p className="text-sm font-medium text-gray-300 tracking-wide animate-pulse">
            Loading...
          </p>
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-8 sm:bottom-10 px-4">
          <p className="text-[11px] font-semibold text-gray-300 tracking-[0.2em] uppercase text-center">
            Plan your celebration
          </p>
        </div>
      </div>
    </>
  );
}