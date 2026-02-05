import React from "react";

// --- Reusable Shimmer Component ---
const ShimmerBlock = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
  </div>
);

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* 1. Sticky Header Skeleton */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 safe-area-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <ShimmerBlock className="w-8 h-8 rounded-xl" /> {/* Back Arrow */}
          <ShimmerBlock className="w-24 h-6 rounded-md" /> {/* Title */}
          <div className="w-10" />
        </div>

        {/* Progress Steps Skeleton */}
        <div className="px-4 py-3 bg-white">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-2">
                  <ShimmerBlock className="w-10 h-10 rounded-full" />
                  <ShimmerBlock className="w-8 h-3 rounded-md" />
                </div>
                {i < 4 && <ShimmerBlock className="flex-1 h-0.5 mx-2 mb-4" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Main Content Skeleton */}
      <main className="px-4 py-4 space-y-4">
        {/* Section Title */}
        <ShimmerBlock className="w-32 h-4 rounded-md mb-2" />

        {/* Cart Item Skeleton (x2) */}
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 mb-3">
            <div className="flex gap-3">
              <ShimmerBlock className="w-20 h-20 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <ShimmerBlock className="w-3/4 h-4 rounded-md" />
                <div className="flex gap-2">
                  <ShimmerBlock className="w-8 h-3 rounded-md" />
                  <ShimmerBlock className="w-12 h-3 rounded-md" />
                </div>
                <div className="flex gap-2 mt-2">
                  <ShimmerBlock className="w-20 h-5 rounded-lg" />
                  <ShimmerBlock className="w-16 h-5 rounded-lg" />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
              <ShimmerBlock className="w-24 h-6 rounded-md" />
              <ShimmerBlock className="w-16 h-4 rounded-md" />
            </div>
          </div>
        ))}

        {/* Coupon Section Skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <ShimmerBlock className="w-10 h-10 rounded-xl" />
            <div className="space-y-1">
              <ShimmerBlock className="w-24 h-4 rounded-md" />
              <ShimmerBlock className="w-32 h-3 rounded-md" />
            </div>
          </div>
          <ShimmerBlock className="w-5 h-5 rounded-full" />
        </div>

        {/* Price Summary Skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 mt-4">
          <div className="flex justify-between">
            <ShimmerBlock className="w-20 h-4 rounded-md" />
            <ShimmerBlock className="w-24 h-3 rounded-md" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <ShimmerBlock className="w-16 h-3 rounded-md" />
              <ShimmerBlock className="w-12 h-3 rounded-md" />
            </div>
          ))}
          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <ShimmerBlock className="w-24 h-5 rounded-md" />
            <ShimmerBlock className="w-20 h-6 rounded-md" />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center gap-4 mt-6">
          <ShimmerBlock className="w-16 h-4 rounded-md" />
          <ShimmerBlock className="w-16 h-4 rounded-md" />
          <ShimmerBlock className="w-16 h-4 rounded-md" />
        </div>
      </main>

      {/* 3. Bottom Action Bar Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-area-bottom">
        <div className="px-4 pt-3 pb-2 flex justify-between items-center bg-gray-50">
          <div>
            <ShimmerBlock className="w-20 h-3 rounded-md mb-1" />
            <ShimmerBlock className="w-24 h-6 rounded-md" />
          </div>
          <ShimmerBlock className="w-24 h-8 rounded-lg" />
        </div>
        <div className="px-4 pb-4 pt-2">
          <ShimmerBlock className="w-full h-14 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
