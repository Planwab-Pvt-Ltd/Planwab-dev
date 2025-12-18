import React from "react";

// --- 1. Reusable Shimmer Component ---
// This creates the sliding light effect (YouTube/Facebook style)
// Using pure CSS ensures it runs on the GPU and doesn't block the main thread.
const ShimmerBlock = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent" />
  </div>
);

// --- 2. Card Skeleton ---
// Matches the exact aspect ratio of your "UnifiedCard"
const VendorCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 h-full">
    {/* Image Area */}
    <ShimmerBlock className="h-40 w-full" />

    {/* Content Area */}
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-3/4">
          <ShimmerBlock className="h-5 w-3/4 rounded-md" /> {/* Title */}
          <ShimmerBlock className="h-3 w-1/2 rounded-md" /> {/* Location */}
        </div>
        <ShimmerBlock className="h-6 w-12 rounded-lg" /> {/* Rating Badge */}
      </div>

      {/* Stats Row */}
      <div className="flex gap-2 pt-2">
        <ShimmerBlock className="h-5 w-20 rounded-md" />
        <ShimmerBlock className="h-5 w-20 rounded-md" />
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <ShimmerBlock className="h-6 w-24 rounded-md" /> {/* Price */}
        <ShimmerBlock className="h-8 w-20 rounded-xl" /> {/* Button */}
      </div>
    </div>
  </div>
);

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* --- GLOBAL STYLES --- */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* --- 1. HEADER SKELETON --- */}
      {/* Matches the sticky header height to prevent layout shift */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-4 pt-4 pb-2">
        <div className="flex justify-between items-center mb-3">
          <div className="space-y-1">
            <ShimmerBlock className="h-6 w-32 rounded-lg" /> {/* Title */}
            <ShimmerBlock className="h-3 w-20 rounded-md" /> {/* Subtitle */}
          </div>
          <div className="flex gap-2">
            <ShimmerBlock className="h-10 w-10 rounded-xl" /> {/* Action Button */}
            <ShimmerBlock className="h-10 w-10 rounded-xl" /> {/* Action Button */}
          </div>
        </div>

        {/* Search Bar */}
        <ShimmerBlock className="h-12 w-full rounded-2xl mb-4" />

        {/* Sort Tabs */}
        <div className="flex gap-2 overflow-hidden pb-2">
          {[1, 2, 3].map((i) => (
            <ShimmerBlock key={i} className="h-8 w-24 rounded-full shrink-0" />
          ))}
        </div>
      </div>

      {/* --- 2. MAIN CONTENT SKELETON --- */}
      <div className="px-4 pt-4 space-y-6">
        {/* Promo Carousel */}
        <div className="space-y-3">
          <div className="flex justify-between px-1">
            <ShimmerBlock className="h-4 w-28 rounded-md" />
            <ShimmerBlock className="h-4 w-16 rounded-md" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2].map((i) => (
              <ShimmerBlock key={i} className="h-36 min-w-[280px] rounded-2xl shrink-0" />
            ))}
          </div>
        </div>

        {/* Vendor Grid */}
        <div className="grid gap-4 grid-cols-1">
          {[1, 2, 3, 4].map((i) => (
            <VendorCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
