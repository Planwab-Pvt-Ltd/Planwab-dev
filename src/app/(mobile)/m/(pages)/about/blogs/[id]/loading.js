import React from "react";
import { ChevronLeft, User, Heart, Bookmark, Share2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 h-16 flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50">
          <ChevronLeft size={24} className="text-gray-300" />
        </div>
        <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
      </div>

      <div className="pb-32">
        {/* Cover Image */}
        <div className="w-full aspect-[4/3] relative bg-gray-200 animate-pulse">
          <div className="absolute bottom-6 left-6">
            <div className="h-6 w-24 bg-gray-300 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="px-6 pt-8">
          {/* Title */}
          <div className="space-y-3 mb-8">
            <div className="h-8 w-full bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-8 w-2/3 bg-gray-200 rounded-xl animate-pulse" />
          </div>

          {/* Author Card */}
          <div className="flex items-center gap-4 mb-10 p-4 bg-gray-50 rounded-[24px]">
            <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>

          {/* Content Body */}
          <div className="space-y-6">
            <div className="border-l-4 border-gray-100 pl-5 mb-8">
              <div className="h-6 w-full bg-gray-50 rounded animate-pulse mb-2" />
              <div className="h-6 w-3/4 bg-gray-50 rounded animate-pulse" />
            </div>
            
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-4 w-full bg-gray-50 rounded animate-pulse" />
            ))}
            <div className="h-4 w-1/2 bg-gray-50 rounded animate-pulse" />
          </div>

          {/* Interaction Bar */}
          <div className="mt-16 pb-6">
            <div className="bg-gray-50/50 border border-gray-100 rounded-[32px] p-2 flex items-center justify-between shadow-sm">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 flex justify-center py-4">
                  <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Continue Reading Section */}
          <div className="mt-20">
            <div className="h-3 w-32 bg-gray-100 rounded animate-pulse mb-6" />
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-24 h-24 rounded-3xl bg-gray-100 animate-pulse shrink-0 shadow-sm" />
                  <div className="flex flex-col justify-center space-y-2 flex-1">
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
