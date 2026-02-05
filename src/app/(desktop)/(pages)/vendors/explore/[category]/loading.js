import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* =========================================
          1. Header Skeleton
          Matches: Fixed header with Back Btn, Title, Cart
      ========================================= */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back Button Circle */}
          <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
          <div className="flex flex-col gap-1.5">
            {/* Title Line */}
            <div className="w-24 h-4 bg-slate-200 rounded-md animate-pulse" />
            {/* Location Line */}
            <div className="w-16 h-2.5 bg-slate-200 rounded-md animate-pulse" />
          </div>
        </div>
        {/* Cart Circle */}
        <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
      </div>

      <main className="pt-16 max-w-7xl mx-auto">
        {/* =========================================
            2. Search Bar Skeleton
            Matches: Sticky Search Bar
        ========================================= */}
        <div className="sticky top-16 z-30 px-5 pt-2 pb-4 bg-slate-50/95">
          <div className="w-full h-12 bg-white rounded-2xl border border-slate-200 animate-pulse" />
        </div>

        <div className="mt-4 space-y-8">
          {/* =========================================
              3. Hero Carousel Skeleton (Grid)
              Matches: Two-row grid layout from image
          ========================================= */}
          <div className="mb-8">
            <div className="px-5 mb-4">
              <div className="w-40 h-6 bg-slate-200 rounded-lg animate-pulse" />
            </div>

            {/* Horizontal Scroll Container */}
            <div className="overflow-hidden px-4 pb-4">
              <div className="grid grid-rows-2 grid-flow-col gap-4 w-max">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-40 h-48 bg-white rounded-xl border border-slate-100 overflow-hidden">
                    {/* Image Area (65%) */}
                    <div className="h-[65%] w-full bg-slate-200 animate-pulse" />
                    {/* Text Area (35%) */}
                    <div className="h-[35%] w-full p-3 flex flex-col justify-center gap-2">
                      <div className="w-20 h-4 bg-slate-200 rounded animate-pulse" />
                      <div className="w-12 h-3 bg-slate-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-1">
              <div className="w-4 h-1.5 bg-slate-300 rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-pulse" />
            </div>
          </div>

          {/* =========================================
              4. Promo Banner Skeleton
              Matches: Large rounded gradient card
          ========================================= */}
          <div className="px-5">
            <div className="w-full h-40 bg-slate-200 rounded-3xl animate-pulse" />
          </div>

          {/* =========================================
              5. Horizontal Vendor Sections
              Matches: Featured Vendors & Planners
          ========================================= */}
          {[1, 2].map((section) => (
            <div key={section} className="py-2 mb-4">
              {/* Section Header */}
              <div className="px-5 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
                  <div className="flex flex-col gap-2">
                    <div className="w-32 h-4 bg-slate-200 rounded animate-pulse" />
                    <div className="w-24 h-3 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
              </div>

              {/* Vendor Cards Row */}
              <div className="flex gap-4 overflow-hidden px-5 pb-8">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-60 bg-white rounded-2xl border border-slate-100 overflow-hidden"
                  >
                    {/* Card Image */}
                    <div className="h-40 bg-slate-200 animate-pulse" />

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
                        <div className="w-4 h-4 bg-slate-200 rounded-full animate-pulse" />
                      </div>
                      <div className="w-32 h-3 bg-slate-200 rounded animate-pulse" />

                      <div className="h-px w-full bg-slate-100 my-2" />

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <div className="w-12 h-2.5 bg-slate-200 rounded animate-pulse" />
                          <div className="w-16 h-4 bg-slate-200 rounded animate-pulse" />
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-slate-200 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* =========================================
          6. Floating Cart Skeleton
      ========================================= */}
      <div className="fixed bottom-6 left-4 right-4 z-50">
        <div className="w-full h-16 bg-slate-800/80 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}
