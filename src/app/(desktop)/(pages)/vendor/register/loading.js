"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="w-8 h-8" />
        </div>

        {/* Progress Bar Skeleton */}
        <div className="px-4 pb-4">
          <div className="flex justify-between mb-2">
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse" />
        </div>
      </div>

      {/* Form Content Skeleton */}
      <div className="p-4 pb-24 space-y-6">
        {/* Title Skeleton */}
        <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />

        {/* Form Fields Skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>

        {/* Additional Form Elements */}
        <div className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
          <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }

        .animate-pulse {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 400% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
