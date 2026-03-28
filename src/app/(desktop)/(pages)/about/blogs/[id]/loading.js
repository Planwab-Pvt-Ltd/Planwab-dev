import React from "react";
import { ArrowLeft, User, Calendar, Clock, Heart, Bookmark, Share2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Top Background Pattern */}
      <div className="h-[250px] w-full bg-gradient-to-r from-pink-500/5 to-purple-500/5 absolute top-0 left-0 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-10">
        <div className="flex items-center gap-2 text-gray-300 font-semibold mb-8">
          <ArrowLeft size={18} /> <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          {/* Left Column: Content */}
          <div className="lg:col-span-8">
            {/* Header Section */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-7 w-24 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-gray-50 rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-gray-50 rounded-full animate-pulse" />
              </div>

              <div className="space-y-3 mb-8">
                <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-10 w-3/4 bg-gray-200 rounded-xl animate-pulse" />
              </div>

              <div className="flex flex-wrap items-center gap-6 border-l-4 border-gray-100 pl-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 opacity-50">
                  <Calendar size={15} className="text-gray-300" />
                  <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 opacity-50">
                  <Clock size={15} className="text-gray-300" />
                  <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="w-full h-[300px] sm:h-[500px] rounded-[40px] bg-gray-200 animate-pulse mb-12 shadow-sm" />

            {/* Content Body */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 mb-12">
              <div className="space-y-4 mb-10 border-b border-gray-50 pb-10">
                <div className="h-6 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-6 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-6 w-2/3 bg-gray-100 rounded animate-pulse" />
              </div>

              <div className="space-y-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-4 w-full bg-gray-50 rounded animate-pulse" />
                ))}
                <div className="h-4 w-3/4 bg-gray-50 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Author Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="h-3 w-32 bg-gray-100 rounded animate-pulse mb-6" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gray-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-14 bg-gray-50 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>

            {/* Related Stories */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="h-3 w-32 bg-gray-100 rounded animate-pulse mb-6" />
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 animate-pulse shrink-0" />
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
    </div>
  );
}
