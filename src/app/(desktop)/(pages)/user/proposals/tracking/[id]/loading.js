import React from "react";
import { motion } from "framer-motion";

const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${className}`}>
    <motion.div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
      animate={{ translateX: ["100%", "-100%"] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  </div>
);

// =============================================================================
// HEADER SKELETON
// =============================================================================

const HeaderSkeleton = () => (
  <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
      {/* Top Row */}
      <div className="flex items-center justify-between mb-4">
        <Shimmer className="w-20 h-8 rounded-lg" />
        <div className="flex items-center gap-2">
          <Shimmer className="w-10 h-10 rounded-xl" />
          <Shimmer className="w-10 h-10 rounded-xl" />
        </div>
      </div>

      {/* Event Title & Status */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shimmer className="w-12 h-12 rounded-2xl" />
          <div>
            <Shimmer className="w-40 h-7 rounded-lg mb-2" />
            <Shimmer className="w-24 h-4 rounded-lg" />
          </div>
        </div>
        <Shimmer className="w-32 h-9 rounded-full" />
      </div>
    </div>
  </header>
);

// =============================================================================
// PROGRESS TRACKER SKELETON
// =============================================================================

const ProgressTrackerSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Shimmer className="w-10 h-10 rounded-xl" />
        <div>
          <Shimmer className="w-32 h-5 rounded-lg mb-2" />
          <Shimmer className="w-24 h-4 rounded-lg" />
        </div>
      </div>
      <div className="text-right">
        <Shimmer className="w-12 h-8 rounded-lg mb-1" />
        <Shimmer className="w-16 h-3 rounded-lg" />
      </div>
    </div>

    {/* Progress Bar */}
    <Shimmer className="h-2 rounded-full mb-8" />

    {/* Steps */}
    <div className="space-y-6">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-start gap-4">
          <Shimmer className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1 pt-1">
            <div className="flex items-center justify-between">
              <Shimmer className="w-28 h-5 rounded-lg" />
              <Shimmer className="w-16 h-4 rounded-lg" />
            </div>
            <Shimmer className="w-40 h-4 rounded-lg mt-2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// EVENT DETAILS SKELETON
// =============================================================================

const EventDetailsSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
    {/* Header */}
    <div className="flex items-center gap-3 mb-6">
      <Shimmer className="w-10 h-10 rounded-xl" />
      <div>
        <Shimmer className="w-28 h-5 rounded-lg mb-2" />
        <Shimmer className="w-36 h-4 rounded-lg" />
      </div>
    </div>

    {/* Event Type Badge */}
    <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
      <div className="flex items-center gap-3">
        <Shimmer className="w-12 h-12 rounded-xl" />
        <div>
          <Shimmer className="w-40 h-6 rounded-lg mb-2" />
          <Shimmer className="w-24 h-4 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Details Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-start gap-3">
            <Shimmer className="w-9 h-9 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <Shimmer className="w-16 h-3 rounded-lg mb-2" />
              <Shimmer className="w-full h-5 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// CONTACT INFO SKELETON
// =============================================================================

const ContactInfoSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
    {/* Header */}
    <div className="flex items-center gap-3 mb-6">
      <Shimmer className="w-10 h-10 rounded-xl" />
      <div>
        <Shimmer className="w-36 h-5 rounded-lg mb-2" />
        <Shimmer className="w-28 h-4 rounded-lg" />
      </div>
    </div>

    {/* Contact Details */}
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex items-center gap-3">
            <Shimmer className="w-9 h-9 rounded-lg" />
            <div>
              <Shimmer className="w-12 h-3 rounded-lg mb-2" />
              <Shimmer className="w-32 h-5 rounded-lg" />
            </div>
          </div>
          <Shimmer className="w-8 h-8 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// COUNTDOWN SKELETON
// =============================================================================

const CountdownSkeleton = () => (
  <div className="bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <Shimmer className="w-28 h-4 rounded-lg mb-2 bg-white/20" />
        <div className="flex items-baseline gap-2">
          <Shimmer className="w-20 h-12 rounded-lg bg-white/20" />
          <Shimmer className="w-12 h-6 rounded-lg bg-white/20" />
        </div>
        <Shimmer className="w-32 h-4 rounded-lg mt-2 bg-white/20" />
      </div>
      <Shimmer className="w-20 h-20 rounded-full bg-white/20" />
    </div>
    <div className="mt-4 pt-4 border-t border-white/20">
      <Shimmer className="w-48 h-4 rounded-lg bg-white/20" />
    </div>
  </div>
);

// =============================================================================
// QUICK ACTIONS SKELETON
// =============================================================================

const QuickActionsSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
    {/* Header */}
    <div className="flex items-center gap-3 mb-6">
      <Shimmer className="w-10 h-10 rounded-xl" />
      <div>
        <Shimmer className="w-28 h-5 rounded-lg mb-2" />
        <Shimmer className="w-24 h-4 rounded-lg" />
      </div>
    </div>

    {/* Actions Grid */}
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <Shimmer className="w-10 h-10 rounded-xl mb-3" />
          <Shimmer className="w-20 h-4 rounded-lg mb-2" />
          <Shimmer className="w-24 h-3 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// TIMELINE SKELETON
// =============================================================================

const TimelineSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
    {/* Header */}
    <div className="flex items-center gap-3 mb-6">
      <Shimmer className="w-10 h-10 rounded-xl" />
      <div>
        <Shimmer className="w-32 h-5 rounded-lg mb-2" />
        <Shimmer className="w-24 h-4 rounded-lg" />
      </div>
    </div>

    {/* Timeline Items */}
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-start gap-3">
            <Shimmer className="w-9 h-9 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <Shimmer className="w-28 h-4 rounded-lg" />
                <Shimmer className="w-16 h-3 rounded-lg" />
              </div>
              <Shimmer className="w-48 h-4 rounded-lg mt-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// SUPPORT SKELETON
// =============================================================================

const SupportSkeleton = () => (
  <div className="bg-gray-300 dark:bg-gray-700 rounded-2xl shadow-lg p-6">
    <div className="flex items-start gap-4">
      <Shimmer className="w-12 h-12 rounded-xl bg-white/20 flex-shrink-0" />
      <div className="flex-1">
        <Shimmer className="w-24 h-6 rounded-lg mb-2 bg-white/20" />
        <Shimmer className="w-full h-4 rounded-lg mb-1 bg-white/20" />
        <Shimmer className="w-3/4 h-4 rounded-lg mb-4 bg-white/20" />
        <div className="flex flex-wrap gap-3">
          <Shimmer className="w-24 h-10 rounded-lg bg-white/20" />
          <Shimmer className="w-32 h-10 rounded-lg bg-white/20" />
        </div>
      </div>
    </div>
  </div>
);

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Skeleton */}
      <HeaderSkeleton />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Tracker */}
            <ProgressTrackerSkeleton />

            {/* Event Details */}
            <EventDetailsSkeleton />

            {/* Timeline */}
            <TimelineSkeleton />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Countdown */}
            <CountdownSkeleton />

            {/* Contact Info */}
            <ContactInfoSkeleton />

            {/* Quick Actions */}
            <QuickActionsSkeleton />

            {/* Support */}
            <SupportSkeleton />
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl flex justify-center">
          <Shimmer className="w-64 h-4 rounded-lg" />
        </div>
      </main>
    </div>
  );
}
