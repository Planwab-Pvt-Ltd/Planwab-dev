import React from "react";

// --- 1. Reusable Shimmer Component ---
const ShimmerBlock = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent" />
  </div>
);

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 overflow-x-hidden">
      <style>{`
        @keyframes shimmer { 
          100% { transform: translateX(100%); } 
        }
      `}</style>

      {/* 1. Header Skeleton */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
        <ShimmerBlock className="w-8 h-8 rounded-full" /> {/* Back Arrow */}
        <div className="flex gap-3">
          <ShimmerBlock className="w-10 h-10 rounded-full" /> {/* Like */}
          <ShimmerBlock className="w-10 h-10 rounded-full" /> {/* Share */}
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* 2. Breadcrumb Skeleton */}
        <div className="flex gap-2 items-center">
          <ShimmerBlock className="h-3 w-12 rounded" />
          <ShimmerBlock className="h-3 w-3 rounded-full" />
          <ShimmerBlock className="h-3 w-20 rounded" />
        </div>

        {/* 3. Carousel Skeleton */}
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-lg h-[280px] w-full bg-gray-200 dark:bg-gray-800">
            <ShimmerBlock className="w-full h-full" />
            {/* Fake Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <ShimmerBlock className="w-10 h-10 rounded-full" />
              <ShimmerBlock className="w-10 h-10 rounded-full" />
            </div>
          </div>
        </div>

        {/* 4. Product Details Card Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          {/* Title & Rating */}
          <div>
            <ShimmerBlock className="h-8 w-3/4 rounded-lg mb-2" />
            <div className="flex gap-2">
              <ShimmerBlock className="h-5 w-16 rounded-md" />
              <ShimmerBlock className="h-5 w-24 rounded-md" />
            </div>
          </div>

          {/* Price & Buttons */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <ShimmerBlock className="h-8 w-32 rounded-lg mb-4" />
            <div className="grid grid-cols-2 gap-3 mb-4">
              <ShimmerBlock className="h-12 w-full rounded-xl" />
              <ShimmerBlock className="h-12 w-full rounded-xl" />
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <ShimmerBlock key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* 5. Tabs Skeleton */}
        <div className="flex gap-3 overflow-hidden pb-2">
          {[1, 2, 3, 4].map((i) => (
            <ShimmerBlock key={i} className="h-10 w-28 rounded-full shrink-0" />
          ))}
        </div>

        {/* 6. Tab Content (Overview) Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
          <ShimmerBlock className="h-6 w-32 rounded-md mb-2" />
          <ShimmerBlock className="h-4 w-full rounded" />
          <ShimmerBlock className="h-4 w-full rounded" />
          <ShimmerBlock className="h-4 w-2/3 rounded" />
        </div>

        {/* 7. Similar Venues Title Skeleton */}
        <div className="pt-4">
          <ShimmerBlock className="h-6 w-40 rounded-lg mb-4" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="min-w-[260px] h-64 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3"
              >
                <ShimmerBlock className="w-full h-36 rounded-xl mb-3" />
                <ShimmerBlock className="h-5 w-3/4 rounded mb-2" />
                <ShimmerBlock className="h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
