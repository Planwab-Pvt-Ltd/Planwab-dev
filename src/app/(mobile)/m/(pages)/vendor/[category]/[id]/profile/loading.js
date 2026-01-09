"use client";

const VendorProfileLoading = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-black pb-20">
      {/* HEADER SKELETON */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="flex-1 text-center px-4">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>
        </div>
      </div>

      {/* PROFILE SECTION SKELETON */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start gap-4 mb-4">
          {/* Profile Picture Skeleton */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse" />
          </div>

          {/* Stats Skeleton */}
          <div className="flex-1 flex justify-around pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center min-w-0 gap-1">
                <div className="h-5 w-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Bio Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="space-y-1.5 mt-2">
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-3 w-3/5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mt-2" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>

        {/* Highlights Skeleton */}
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
          <div className="flex gap-4 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-[68px]">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse" />
                <div className="h-2.5 w-14 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS SKELETON */}
      <div className="sticky top-[57px] z-40 bg-white dark:bg-black border-t border-b border-gray-200 dark:border-gray-800">
        <div className="flex">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 py-3 flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT GRID SKELETON */}
      <div className="grid grid-cols-3 gap-1 pb-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-sm relative overflow-hidden"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        ))}
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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
};

export default VendorProfileLoading;
