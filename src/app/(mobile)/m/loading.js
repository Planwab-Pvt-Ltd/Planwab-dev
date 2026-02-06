import React from "react";

export default function Loading() {
  return (
    <>
      <div className="min-h-screen" aria-hidden="true" />

      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        <div className="relative flex flex-col items-center gap-8">
          <div className="animate-pulse">
            <img
              src="/planwablogo.png"
              alt="PlanWAB"
              width={140}
              height={140}
              className="object-contain"
              draggable={false}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
              style={{ animationDelay: "0ms", animationDuration: "1s" }}
            />
            <span
              className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: "150ms", animationDuration: "1s" }}
            />
            <span
              className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
              style={{ animationDelay: "300ms", animationDuration: "1s" }}
            />
          </div>
        </div>

        <div className="absolute bottom-10">
          <p className="text-xs font-semibold text-gray-300 tracking-widest uppercase">
            Plan your celebration
          </p>
        </div>
      </div>
    </>
  );
}