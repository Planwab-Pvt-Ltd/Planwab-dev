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

      <div className="p-4 space-y-6 pb-8">
        {/* Hero Section Skeleton */}
        <div className="text-center py-6 space-y-6">
          <div className="space-y-2">
            <div className="w-48 h-7 bg-gray-200 rounded animate-pulse mx-auto" />
            <div className="w-64 h-4 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>

          {/* Billing Toggle Skeleton */}
          <div className="inline-flex bg-gray-200 rounded-xl p-1 animate-pulse">
            <div className="w-20 h-8 bg-gray-300 rounded-lg" />
            <div className="w-20 h-8 bg-gray-300 rounded-lg ml-1" />
          </div>
        </div>

        {/* Pricing Cards Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 border-2 border-gray-200 relative overflow-hidden">
              {/* Badge Skeleton */}
              {index === 1 && (
                <div className="absolute top-0 right-0 w-20 h-6 bg-gray-200 rounded-bl-lg animate-pulse" />
              )}

              {/* Plan Info Skeleton */}
              <div className="mb-4 space-y-2">
                <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-48 h-4 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Price Skeleton */}
              <div className="flex items-baseline gap-2 mb-4">
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-200 rounded-full animate-pulse" />
              </div>

              {/* Features List Skeleton */}
              <div className="space-y-3 mb-6">
                {[...Array(8)].map((_, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
                    <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Button Skeleton */}
              <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>

        {/* Features Section Skeleton */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 space-y-4">
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mx-auto" />
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-11 h-11 bg-gray-200 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Skeleton */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 space-y-4">
          <div className="w-36 h-5 bg-gray-200 rounded animate-pulse mx-auto" />
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, starIndex) => (
                  <div key={starIndex} className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Enterprise Section Skeleton */}
        <div className="bg-gray-200 rounded-xl p-5 animate-pulse">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 bg-gray-300 rounded mx-auto" />
            <div className="w-40 h-5 bg-gray-300 rounded mx-auto" />
            <div className="w-56 h-4 bg-gray-300 rounded mx-auto" />
            <div className="space-y-2">
              <div className="w-full h-12 bg-gray-300 rounded-xl" />
              <div className="w-48 h-3 bg-gray-300 rounded mx-auto" />
            </div>
          </div>
        </div>

        {/* FAQ Section Skeleton */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 space-y-3">
          <div className="w-48 h-5 bg-gray-200 rounded animate-pulse" />
          {[...Array(5)].map((_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="w-56 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Section Skeleton */}
        <div className="bg-gray-100 border border-gray-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Contact Support Skeleton */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 space-y-4">
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mx-auto" />
          <div className="w-56 h-4 bg-gray-200 rounded animate-pulse mx-auto" />
          <div className="space-y-3">
            <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
            <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Bottom CTA Skeleton */}
        <div className="text-center py-6 space-y-6">
          <div className="space-y-2">
            <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mx-auto" />
            <div className="w-64 h-4 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
          <div className="space-y-3">
            <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
            <div className="w-56 h-3 bg-gray-200 rounded animate-pulse mx-auto" />
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
