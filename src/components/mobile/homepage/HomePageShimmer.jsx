"use client";

import React from "react";

const ShimmerBlock = ({ className }) => (
  <div className={`relative overflow-hidden bg-gray-200 rounded-xl ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

const HomePageShimmer = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 max-w-md mx-auto overflow-hidden">
      {/* Hero */}
      <ShimmerBlock className="h-[55vh] w-full rounded-none" />

      {/* Offer Ticker */}
      <div className="bg-black px-4 py-3 flex items-center gap-3">
        <ShimmerBlock className="h-5 w-16 bg-gray-700 rounded-md" />
        <ShimmerBlock className="h-4 flex-1 bg-gray-700 rounded-md" />
      </div>

      {/* Banner */}
      <div className="px-3 mt-3">
        <ShimmerBlock className="h-24 w-full" />
      </div>

      {/* Category Grid */}
      <div className="px-3 mt-4 grid grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <ShimmerBlock key={i} className="h-20 w-full" />
        ))}
      </div>

      {/* Vendor Carousel */}
      <div className="mt-6">
        <div className="px-4 mb-3">
          <ShimmerBlock className="h-4 w-40 mb-2" />
          <ShimmerBlock className="h-3 w-56" />
        </div>

        <div className="flex gap-3 px-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <ShimmerBlock key={i} className="w-[170px] h-[230px] flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Below the fold */}
      <div className="px-4 mt-8 space-y-6">
        <ShimmerBlock className="h-[280px] w-full" />
        <ShimmerBlock className="h-[220px] w-full" />
        <ShimmerBlock className="h-[180px] w-full" />
      </div>
    </div>
  );
};

export default HomePageShimmer;
