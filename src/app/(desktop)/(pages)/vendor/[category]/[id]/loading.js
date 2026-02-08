"use client";

export default function VendorDetailsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      {/* Header Skeleton */}
      <div className="fixed top-18 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Carousel Skeleton */}
            <div className="relative rounded-3xl overflow-hidden bg-gray-200 dark:bg-gray-800 h-[480px] animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>

            {/* Tabs Skeleton */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-2 border border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex-1 animate-pulse" />
                ))}
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 space-y-6">
              {/* Title */}
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
              </div>

              {/* Content Blocks */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse" />
                  </div>
                </div>
              ))}

              {/* Grid Items */}
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-1 space-y-5">
            {/* Vendor Card Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex gap-4 mb-5">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16 animate-pulse" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-2 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="text-center py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto mb-2 animate-pulse" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto animate-pulse" />
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>

            {/* Additional Sidebar Cards */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3 animate-pulse" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}