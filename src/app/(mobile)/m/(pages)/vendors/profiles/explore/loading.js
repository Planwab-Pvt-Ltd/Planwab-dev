import React from "react";

const ShimmerBlock = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent" />
  </div>
);

const ProfileCarouselCardSkeleton = () => (
  <div className="flex-shrink-0 w-44 h-[236px] rounded-2xl bg-white border border-slate-100 dark:border-slate-800 dark:bg-slate-800 snap-start overflow-hidden shadow-sm">
    <ShimmerBlock className="h-[100px]" />
    <div className="relative pt-[44px] px-3 pb-3 space-y-2">
      <div className="absolute top-[-24px] left-3 w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden border-2 border-white dark:border-slate-800">
        <ShimmerBlock className="w-full h-full" />
      </div>
      <ShimmerBlock className="h-4 w-3/4 rounded" />
      <ShimmerBlock className="h-3 w-1/2 rounded" />
    </div>
  </div>
);

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] pb-20">
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800 h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShimmerBlock className="w-10 h-10 rounded-xl" />
          <ShimmerBlock className="h-5 w-32 rounded-lg" />
        </div>
        <ShimmerBlock className="w-10 h-10 rounded-xl" />
      </div>
      <div className="h-14" />

      <main className="w-full mx-auto pt-4 pb-16 space-y-8">
        
        <div className="px-4">
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col gap-2 shrink-0 w-[110px]">
                <ShimmerBlock className="h-32 w-full rounded-xl bg-gray-300 dark:bg-gray-700" />
                <ShimmerBlock className="h-3 w-3/4 rounded-full mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {[1, 2, 3].map((section) => (
          <div key={section} className="space-y-4">
            <div className="px-4 flex justify-between items-end">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShimmerBlock className="w-5 h-5 rounded-md" />
                  <ShimmerBlock className="h-6 w-32 rounded-md" />
                </div>
                <ShimmerBlock className="h-3 w-48 rounded-md" />
              </div>
              <ShimmerBlock className="h-4 w-12 rounded-full" />
            </div>

            <div className="flex gap-4 overflow-hidden px-4">
              {[1, 2, 3].map(card => (
                <ProfileCarouselCardSkeleton key={card} />
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
