"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="w-8 h-8" />
        </div>
      </div>

      <div className="pb-8">
        {/* Hero Section Skeleton */}
        <div className="bg-gray-300 p-6 relative overflow-hidden animate-pulse">
          <div className="text-center space-y-4">
            <div className="w-64 h-7 bg-gray-400 rounded mx-auto" />
            <div className="w-80 h-4 bg-gray-400 rounded mx-auto" />
            <div className="w-72 h-4 bg-gray-400 rounded mx-auto" />
            <div className="w-32 h-8 bg-gray-400 rounded-lg mx-auto mt-4" />
          </div>
        </div>

        {/* Stats Section Skeleton */}
        <div className="px-4 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="w-9 h-9 bg-gray-200 rounded-full mx-auto animate-pulse" />
                  <div className="w-12 h-5 bg-gray-200 rounded mx-auto animate-pulse" />
                  <div className="w-16 h-3 bg-gray-200 rounded mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections Skeleton */}
        <div className="p-4 space-y-6 mt-6">
          {/* Mission & Vision Skeleton */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 space-y-4">
            <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Values Skeleton */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 space-y-4">
            <div className="w-28 h-5 bg-gray-200 rounded animate-pulse" />
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-full h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Team Skeleton */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 space-y-4">
            <div className="w-28 h-5 bg-gray-200 rounded animate-pulse" />
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Skeleton */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 space-y-4">
            <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-48 h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials Skeleton */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 space-y-4">
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, starIndex) => (
                    <div key={starIndex} className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-48 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Contact CTA Skeleton */}
          <div className="bg-gray-300 rounded-xl p-5 text-center space-y-4 animate-pulse">
            <div className="w-48 h-5 bg-gray-400 rounded mx-auto" />
            <div className="w-64 h-4 bg-gray-400 rounded mx-auto" />
            <div className="space-y-2">
              <div className="w-full h-12 bg-gray-400 rounded-xl" />
              <div className="flex gap-2">
                <div className="flex-1 h-8 bg-gray-400 rounded-lg" />
                <div className="flex-1 h-8 bg-gray-400 rounded-lg" />
              </div>
            </div>
          </div>
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
