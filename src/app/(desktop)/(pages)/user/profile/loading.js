import React from "react";

// --- 1. Reusable Shimmer Component ---
// Uses CSS-only animation for high performance (GPU accelerated)
const ShimmerBlock = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent" />
  </div>
);

// --- 2. Menu Group Skeleton ---
// Replicates the "Account Settings", "Preferences", etc. blocks
const MenuGroupSkeleton = ({ titleWidth = "w-32", items = 3 }) => (
  <div>
    {/* Section Title */}
    <ShimmerBlock className={`h-3 ${titleWidth} mb-2 rounded ml-2`} />

    {/* Card Container */}
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 last:border-none"
        >
          <div className="flex items-center gap-4 w-full">
            {/* Icon Box */}
            <ShimmerBlock className="w-10 h-10 rounded-xl shrink-0" />

            {/* Text Lines */}
            <div className="flex-1 space-y-2">
              <ShimmerBlock className="h-4 w-1/3 rounded" />
              {i === 0 && <ShimmerBlock className="h-3 w-1/4 rounded" />} {/* Simulate sub-label occasionally */}
            </div>
          </div>
          {/* Chevron */}
          <ShimmerBlock className="w-4 h-4 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  </div>
);

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-32 overflow-x-hidden">
      {/* Global CSS for the shimmer effect */}
      <style>{`
        @keyframes shimmer { 
          100% { transform: translateX(100%); } 
        }
      `}</style>

      {/* --- SECTION 1: HEADER PROFILE CARD --- */}
      {/* Matches the rounded-b-[3rem] style */}
      <div className="bg-white dark:bg-gray-900 pb-10 pt-6 rounded-b-[3rem] shadow-sm mb-6 flex flex-col items-center">
        <ShimmerBlock className="h-5 w-16 mb-6 rounded-md" /> {/* Title "Profile" */}
        {/* Avatar Circle */}
        <div className="relative mb-4">
          <ShimmerBlock className="w-28 h-28 rounded-full" />
        </div>
        {/* Name & Email */}
        <ShimmerBlock className="h-8 w-48 rounded-lg mb-2" />
        <ShimmerBlock className="h-4 w-32 rounded-md" />
      </div>

      {/* --- SECTION 2: MAIN CONTENT --- */}
      <div className="px-4 space-y-6">
        {/* Loyalty Gold Card */}
        <div className="relative rounded-2xl h-32 overflow-hidden shadow-sm">
          <ShimmerBlock className="absolute inset-0 w-full h-full" />
        </div>

        {/* Wallet Balance Strip */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between h-[88px]">
          <div className="flex items-center gap-4 w-full">
            <ShimmerBlock className="w-12 h-12 rounded-xl shrink-0" />
            <div className="space-y-2">
              <ShimmerBlock className="h-3 w-24 rounded" />
              <ShimmerBlock className="h-6 w-20 rounded" />
            </div>
          </div>
          <ShimmerBlock className="w-20 h-8 rounded-lg shrink-0" />
        </div>

        {/* Account Settings */}
        <MenuGroupSkeleton titleWidth="w-32" items={3} />

        {/* Preferences */}
        <MenuGroupSkeleton titleWidth="w-24" items={2} />

        {/* Referral Banner */}
        <div className="rounded-2xl h-24 overflow-hidden shadow-sm relative">
          <ShimmerBlock className="absolute inset-0 w-full h-full" />
        </div>

        {/* Support */}
        <MenuGroupSkeleton titleWidth="w-20" items={3} />
      </div>
    </div>
  );
}
