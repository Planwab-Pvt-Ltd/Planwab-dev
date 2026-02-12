import React from "react";

// Helper component for the shimmer animation
const ShimmerEffect = ({ className }) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent" />
  </div>
);

export default function VendorProfileLoading() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black pb-24">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <ShimmerEffect className="w-9 h-9 rounded-full" />
            <ShimmerEffect className="w-28 h-4 rounded-full" />
          </div>
          <div className="flex gap-1.5">
            <ShimmerEffect className="w-9 h-9 rounded-full" />
            <ShimmerEffect className="w-9 h-9 rounded-full" />
          </div>
        </div>
      </header>

      <div className="pt-14" />

      <div className="bg-white dark:bg-gray-900">
        <div className="px-4 pt-5 pb-5">
          {/* Profile Info Section Skeleton */}
          <div className="flex items-start gap-5 mb-6">
            {/* Profile Picture */}
            <div className="relative flex-shrink-0">
              <ShimmerEffect className="w-24 h-24 rounded-full" />
              <ShimmerEffect className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-[3px] border-white dark:border-gray-900" />
            </div>

            {/* Profile Details */}
            <div className="flex-1 min-w-0 pt-2 space-y-3">
              <div className="flex items-center gap-2">
                <ShimmerEffect className="w-36 h-6 rounded-lg" />
                <ShimmerEffect className="w-12 h-5 rounded-full" />
              </div>
              <ShimmerEffect className="w-28 h-5 rounded-lg" />
              <div className="flex items-center gap-1.5">
                <ShimmerEffect className="w-4 h-4 rounded-full" />
                <ShimmerEffect className="w-32 h-4 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Stats Section Skeleton */}
          <div className="flex justify-around mb-5 py-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 px-4">
                <ShimmerEffect className="w-12 h-6 rounded-lg" />
                <ShimmerEffect className="w-14 h-3 rounded-full" />
              </div>
            ))}
          </div>

          {/* Bio Section Skeleton */}
          <div className="mb-5 space-y-2">
            <ShimmerEffect className="w-full h-4 rounded-lg" />
            <ShimmerEffect className="w-11/12 h-4 rounded-lg" />
            <ShimmerEffect className="w-4/5 h-4 rounded-lg" />
            <ShimmerEffect className="w-3/4 h-4 rounded-lg" />
            <ShimmerEffect className="w-2/3 h-4 rounded-lg" />
          </div>

          {/* Social Links Skeleton */}
          <div className="flex items-center gap-2 mb-5">
            <ShimmerEffect className="w-24 h-9 rounded-full" />
            <ShimmerEffect className="w-28 h-9 rounded-full" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-2 mb-5">
            <ShimmerEffect className="flex-[2] h-12 rounded-xl" />
            <ShimmerEffect className="flex-1 h-12 rounded-xl" />
            <ShimmerEffect className="flex-1 h-12 rounded-xl" />
          </div>

          {/* Highlights Section Skeleton */}
          <div className="flex gap-4 py-1 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-[72px]">
                <ShimmerEffect className="w-16 h-16 rounded-2xl" />
                <ShimmerEffect className="w-12 h-3 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section Skeleton */}
      <div className="sticky top-14 z-30 bg-white dark:bg-gray-900 border-b border-gray-200/80 dark:border-gray-800/80">
        <div className="flex">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 py-3.5 flex items-center justify-center gap-2">
              <ShimmerEffect className="w-5 h-5 rounded" />
              <ShimmerEffect className="w-12 h-3 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="bg-white dark:bg-gray-900 min-h-[50vh]">
        <div className="grid grid-cols-3 gap-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            /* Replaced motion.div with div to avoid hydration errors in loading.js */
            <div key={i} className="aspect-square">
              <ShimmerEffect className="w-full h-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Button Skeleton */}
      <div className="fixed bottom-6 right-6 z-50">
        <ShimmerEffect className="w-14 h-14 rounded-full" />
      </div>

      {/* CSS for Shimmer Animation */}
      {/* Note: In Next.js App Router, using a global css file is preferred, 
          but this style tag works for standalone skeletons */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </main>
  );
}