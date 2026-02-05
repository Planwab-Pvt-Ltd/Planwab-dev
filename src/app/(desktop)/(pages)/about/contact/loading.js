"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="w-8 h-8" />
        </div>
      </div>

      <div className="p-4 space-y-6 pb-8">
        {/* Hero Section Skeleton */}
        <div className="text-center py-6 space-y-3">
          <div className="w-48 h-7 bg-gray-200 rounded animate-pulse mx-auto" />
          <div className="w-64 h-4 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>

        {/* Quick Contact Methods Skeleton */}
        <div className="space-y-3">
          <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-40 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Office Information Skeleton */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-4">
          <div className="w-28 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mt-0.5" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-36 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Skeleton */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-4">
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />

          {/* Form Fields */}
          <div className="space-y-4">
            {/* User Type Toggle */}
            <div className="space-y-2">
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="flex-1 h-8 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 h-8 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Input Fields */}
            {[...Array(5)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            ))}

            {/* Message Field */}
            <div className="space-y-2">
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-24 bg-gray-200 rounded-xl animate-pulse" />
            </div>

            {/* Submit Button */}
            <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* FAQ Skeleton */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-3">
          <div className="w-48 h-5 bg-gray-200 rounded animate-pulse" />
          {[...Array(5)].map((_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="w-56 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Social Media Skeleton */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-3">
          <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
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
