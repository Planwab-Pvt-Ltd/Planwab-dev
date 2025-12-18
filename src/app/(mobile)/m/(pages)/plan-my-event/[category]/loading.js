import React from "react";

// --- Reusable Shimmer Component ---
const ShimmerBlock = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent" />
  </div>
);

export default function Loading() {
  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 relative">
      {/* --- GLOBAL STYLES --- */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* 1. Mobile Header Skeleton (Visible on LG and below) */}
      <div className="lg:hidden w-full p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm fixed top-0 left-0 z-20 flex justify-between items-center">
        <ShimmerBlock className="h-6 w-24 rounded-md" /> {/* Logo */}
        <div className="flex items-center gap-2">
          <ShimmerBlock className="w-5 h-5 rounded-full" />
          <ShimmerBlock className="h-4 w-16 rounded-md" />
        </div>
      </div>

      {/* 2. Left Panel Skeleton (Desktop Only) */}
      <div className="hidden lg:flex fixed top-0 left-0 w-[40%] h-screen flex-col items-center justify-between py-8 px-8 bg-white dark:bg-gray-800/50 shadow-xl rounded-r-3xl overflow-hidden z-10 border-r border-gray-200 dark:border-gray-700/50">
        <ShimmerBlock className="w-32 h-11 rounded-xl" /> {/* Logo */}
        <div className="flex flex-col items-center gap-8 w-full">
          {/* Icon Card */}
          <div className="relative p-3 w-64 h-40 rounded-3xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <ShimmerBlock className="w-full h-full rounded-2xl" />
          </div>

          {/* Text Content */}
          <div className="space-y-4 w-full flex flex-col items-center">
            <ShimmerBlock className="h-6 w-48 rounded-md" />
            <ShimmerBlock className="h-4 w-64 rounded-md" />
            <ShimmerBlock className="h-4 w-56 rounded-md" />
          </div>
        </div>
        {/* Features Row */}
        <div className="flex gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <ShimmerBlock className="w-16 h-16 rounded-full" />
              <ShimmerBlock className="h-3 w-12 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Main Content Skeleton */}
      <main className="flex-1 lg:ml-[40%] relative pt-20 lg:pt-14 w-full">
        {/* Exit Button Skeleton */}
        <div className="fixed top-4 right-4 lg:top-11 lg:right-5 z-30">
          <ShimmerBlock className="w-10 h-10 lg:w-12 lg:h-12 rounded-full" />
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] lg:min-h-screen py-12 px-4 sm:px-10 lg:px-20">
          <div className="w-full max-w-4xl space-y-8">
            {/* Step Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <ShimmerBlock className="h-4 w-20 rounded-md" />
                <ShimmerBlock className="flex-1 h-1.5 rounded-full" />
              </div>
              <ShimmerBlock className="h-8 w-3/4 rounded-lg mb-2" />
              <ShimmerBlock className="h-8 w-1/2 rounded-lg" />
            </div>

            {/* Input Grid (Simulating City/Date Step) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-32 flex flex-col items-center justify-center gap-3"
                >
                  <ShimmerBlock className="w-8 h-8 rounded-full" />
                  <ShimmerBlock className="h-4 w-20 rounded-md" />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            {/* <div className="flex justify-between items-center pt-8">
               <ShimmerBlock className="w-12 h-12 rounded-full" />
               <ShimmerBlock className="w-32 h-12 rounded-xl" />
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}
