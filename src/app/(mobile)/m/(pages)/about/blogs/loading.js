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
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="px-4 pb-4">
          <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Featured Post Skeleton */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Large Featured Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-16 h-5 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                  <div className="space-y-1">
                    <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Topics Skeleton */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-3">
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Recent Articles Skeleton */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Image */}
                <div className="h-32 bg-gray-200 animate-pulse" />

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-5 bg-gray-200 rounded-full animate-pulse" />
                  </div>

                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />

                  <div className="space-y-2">
                    <div className="w-full h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="w-5/6 h-3 bg-gray-200 rounded animate-pulse" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                      <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                      <div className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                      <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                      <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load More Skeleton */}
        <div className="text-center pt-6">
          <div className="w-40 h-12 bg-gray-200 rounded-xl mx-auto animate-pulse" />
        </div>

        {/* Newsletter Skeleton */}
        <div className="bg-gray-300 rounded-xl p-5 text-center space-y-4 animate-pulse">
          <div className="w-24 h-5 bg-gray-400 rounded mx-auto" />
          <div className="w-64 h-4 bg-gray-400 rounded mx-auto" />
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-gray-400 rounded-lg" />
            <div className="w-20 h-10 bg-gray-400 rounded-lg" />
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
