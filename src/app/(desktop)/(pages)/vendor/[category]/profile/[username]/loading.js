import React from "react";

const ShimmerEffect = ({ className }) => (
  <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800/60 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-white/[0.07] to-transparent" />
  </div>
);

export default function VendorProfileLoading() {
  return (
    <main className="min-h-screen bg-gray-50/50 dark:bg-black">
      {/* ===== Top Navigation Bar ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl border-b border-gray-200/60 dark:border-gray-800/40">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 py-3.5">
          <div className="flex items-center gap-4">
            <ShimmerEffect className="w-9 h-9 rounded-xl" />
            <ShimmerEffect className="w-36 h-5 rounded-lg" />
          </div>
          {/* Desktop Search Bar */}
          <ShimmerEffect className="w-[320px] h-10 rounded-xl hidden lg:block" />
          <div className="flex items-center gap-2">
            <ShimmerEffect className="w-10 h-10 rounded-xl" />
            <ShimmerEffect className="w-10 h-10 rounded-xl" />
            <ShimmerEffect className="w-10 h-10 rounded-xl" />
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1" />
            <ShimmerEffect className="w-9 h-9 rounded-full" />
          </div>
        </div>
      </header>

      <div className="pt-[68px]" />

      {/* ===== Cover / Banner Area ===== */}
      <div className="relative">
        <ShimmerEffect className="w-full h-[260px] lg:h-[300px]" />
        {/* Fade into content */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50/50 dark:from-black to-transparent" />
      </div>

      {/* ===== Main Content Container ===== */}
      <div className="max-w-[1200px] mx-auto px-8 -mt-16 relative z-10">
        {/* ===== Profile Header Card ===== */}
        <div className="bg-white dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-800/40 shadow-sm p-8 mb-6">
          <div className="flex items-start gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <ShimmerEffect className="w-32 h-32 rounded-3xl ring-4 ring-white dark:ring-gray-900 shadow-lg" />
              <ShimmerEffect className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full border-[3px] border-white dark:border-gray-900" />
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 pt-2">
              <div className="flex items-start justify-between mb-5">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <ShimmerEffect className="w-52 h-7 rounded-lg" />
                    <ShimmerEffect className="w-20 h-6 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <ShimmerEffect className="w-36 h-5 rounded-lg" />
                    <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                    <ShimmerEffect className="w-28 h-5 rounded-lg" />
                  </div>
                  <div className="flex items-center gap-2">
                    <ShimmerEffect className="w-4 h-4 rounded" />
                    <ShimmerEffect className="w-40 h-4 rounded-lg" />
                  </div>
                </div>

                {/* Action Buttons - Desktop */}
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <ShimmerEffect className="w-32 h-11 rounded-xl" />
                  <ShimmerEffect className="w-28 h-11 rounded-xl" />
                  <ShimmerEffect className="w-11 h-11 rounded-xl" />
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-10 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <ShimmerEffect className="w-10 h-6 rounded-md" />
                    <ShimmerEffect className="w-16 h-4 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== Two Column Layout ===== */}
        <div className="flex gap-6 items-start">
          {/* ===== Left Sidebar ===== */}
          <div className="w-[320px] flex-shrink-0 space-y-5 sticky top-[84px]">
            {/* Bio Card */}
            <div className="bg-white dark:bg-gray-900/80 rounded-2xl border border-gray-200/60 dark:border-gray-800/40 shadow-sm p-6">
              <ShimmerEffect className="w-16 h-4 rounded-md mb-4" />
              <div className="space-y-2.5">
                <ShimmerEffect className="w-full h-4 rounded-md" />
                <ShimmerEffect className="w-11/12 h-4 rounded-md" />
                <ShimmerEffect className="w-4/5 h-4 rounded-md" />
                <ShimmerEffect className="w-3/5 h-4 rounded-md" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-5">
                <ShimmerEffect className="w-20 h-7 rounded-full" />
                <ShimmerEffect className="w-24 h-7 rounded-full" />
                <ShimmerEffect className="w-16 h-7 rounded-full" />
                <ShimmerEffect className="w-28 h-7 rounded-full" />
              </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-white dark:bg-gray-900/80 rounded-2xl border border-gray-200/60 dark:border-gray-800/40 shadow-sm p-6">
              <ShimmerEffect className="w-24 h-4 rounded-md mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <ShimmerEffect className="w-9 h-9 rounded-xl" />
                    <div className="flex-1 space-y-1.5">
                      <ShimmerEffect className="w-24 h-3.5 rounded-md" />
                      <ShimmerEffect className="w-32 h-3 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights Card */}
            <div className="bg-white dark:bg-gray-900/80 rounded-2xl border border-gray-200/60 dark:border-gray-800/40 shadow-sm p-6">
              <ShimmerEffect className="w-20 h-4 rounded-md mb-4" />
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <ShimmerEffect className="w-14 h-14 rounded-2xl" />
                    <ShimmerEffect className="w-10 h-2.5 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Right Content Area ===== */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-900/80 rounded-2xl border border-gray-200/60 dark:border-gray-800/40 shadow-sm mb-5 overflow-hidden">
              <div className="flex">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex-1 py-4 flex items-center justify-center gap-2.5 border-b-2 border-transparent"
                  >
                    <ShimmerEffect className="w-5 h-5 rounded-md" />
                    <ShimmerEffect className="w-14 h-4 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Post Grid */}
            <div className="bg-white dark:bg-gray-900/80 rounded-2xl border border-gray-200/60 dark:border-gray-800/40 shadow-sm overflow-hidden">
              <div className="grid grid-cols-3 gap-1 p-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-square relative group">
                    <ShimmerEffect className="w-full h-full rounded-xl" />
                    {/* Fake video icon on some items */}
                    {(i === 1 || i === 4 || i === 7 || i === 10) && (
                      <div className="absolute top-2.5 right-2.5">
                        <ShimmerEffect className="w-6 h-6 rounded-md" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20" />

      {/* Shimmer Animation Keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.8s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}