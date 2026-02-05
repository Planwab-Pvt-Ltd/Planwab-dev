import React from "react";

// --- Reusable Shimmer Component ---
const ShimmerBlock = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent" />
  </div>
);

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-24 overflow-x-hidden">
      {/* --- GLOBAL STYLES --- */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* 1. Header Skeleton */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
        <ShimmerBlock className="h-8 w-32 rounded-lg" /> {/* Title: "Bookings" */}
        <ShimmerBlock className="w-10 h-10 rounded-full" /> {/* Icon */}
      </div>

      <div className="p-5 space-y-8">
        {/* 2. Quick Stats Grid Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Total Spent */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 h-32 border border-gray-100 dark:border-gray-800">
            <ShimmerBlock className="h-3 w-20 rounded-md mb-2" />
            <ShimmerBlock className="h-8 w-24 rounded-lg mb-3" />
            <ShimmerBlock className="h-5 w-16 rounded-md" />
          </div>
          {/* Card 2: Active Count */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 h-32 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
            <div>
              <ShimmerBlock className="h-3 w-16 rounded-md mb-2" />
              <ShimmerBlock className="h-8 w-12 rounded-lg" />
            </div>
            <ShimmerBlock className="h-3 w-24 rounded-md" />
          </div>
        </div>

        {/* 3. Active Bookings List Skeleton */}
        <div>
          <ShimmerBlock className="h-6 w-40 rounded-lg mb-4" /> {/* Title: "Active Bookings" */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 h-28 flex gap-4"
              >
                {/* Image Placeholder */}
                <ShimmerBlock className="w-24 h-full rounded-xl shrink-0" />

                {/* Text Details */}
                <div className="flex-1 py-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <ShimmerBlock className="h-5 w-32 rounded-md" /> {/* Vendor Name */}
                      <ShimmerBlock className="h-5 w-16 rounded-full" /> {/* Status Badge */}
                    </div>
                    <ShimmerBlock className="h-3 w-24 rounded-md" /> {/* Category */}
                  </div>

                  <div className="space-y-2">
                    <ShimmerBlock className="h-3 w-28 rounded-md" /> {/* Date */}
                    {i === 1 && <ShimmerBlock className="h-5 w-24 rounded-md" />}{" "}
                    {/* Tasks Pending (Only for one card to vary) */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Upcoming Payments Skeleton */}
        <div>
          <ShimmerBlock className="h-6 w-48 rounded-lg mb-4" />
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 h-40 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
            {/* Simulate gradient card */}
            <ShimmerBlock className="absolute inset-0 opacity-10" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between">
                <ShimmerBlock className="w-10 h-10 rounded-xl" />
                <ShimmerBlock className="w-20 h-5 rounded-md" />
              </div>
              <div className="space-y-2">
                <ShimmerBlock className="h-3 w-24 rounded-md" />
                <ShimmerBlock className="h-8 w-32 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
