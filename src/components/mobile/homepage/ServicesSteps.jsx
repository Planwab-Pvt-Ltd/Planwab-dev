"use client";

import React, { memo } from "react";
import { Check, ArrowRight } from "lucide-react";
import SmartMedia from "../SmartMediaLoader";
import { useSearchParams } from "next/navigation";

// 1. Static Data (Optimized)
const FEATURES = ["Wedding planning", "Budget optimisation", "Event management"];

// 2. Enhanced Theme Configuration
const themeConfig = {
  // Wedding & Event share the same Blue-800 theme
  Wedding: {
    container: "bg-blue-50/80 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30",
    header: "text-blue-900 dark:text-blue-100",
    subtext: "text-blue-800/80 dark:text-blue-200/70",
    listText: "text-blue-950 dark:text-blue-50",
    icon: "text-blue-800 dark:text-blue-400", // Icon matches primary
    button: "bg-blue-800 hover:bg-blue-900 text-white shadow-blue-200 dark:shadow-blue-900/20",
    decoration: "border-blue-200 bg-white dark:bg-blue-950 dark:border-blue-800",
  },
  // Anniversary: Pink-700
  Anniversary: {
    container: "bg-pink-50/80 border-pink-100 dark:bg-pink-950/20 dark:border-pink-900/30",
    header: "text-pink-900 dark:text-pink-100",
    subtext: "text-pink-800/80 dark:text-pink-200/70",
    listText: "text-pink-950 dark:text-pink-50",
    icon: "text-pink-700 dark:text-pink-400",
    button: "bg-pink-700 hover:bg-pink-800 text-white shadow-pink-200 dark:shadow-pink-900/20",
    decoration: "border-pink-200 bg-white dark:bg-pink-950 dark:border-pink-800",
  },
  // Birthday: Yellow-600
  Birthday: {
    container: "bg-yellow-50/80 border-yellow-100 dark:bg-yellow-950/20 dark:border-yellow-900/30",
    header: "text-yellow-950 dark:text-yellow-100", // Darker text for contrast on yellow bg
    subtext: "text-yellow-800/80 dark:text-yellow-200/70",
    listText: "text-yellow-950 dark:text-yellow-50",
    icon: "text-yellow-600 dark:text-yellow-400",
    button: "bg-yellow-600 hover:bg-yellow-700 text-white shadow-yellow-200 dark:shadow-yellow-900/20",
    decoration: "border-yellow-200 bg-white dark:bg-yellow-950 dark:border-yellow-800",
  },
  Default: {
    container: "bg-blue-50/80 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30",
    header: "text-blue-900 dark:text-blue-100",
    subtext: "text-blue-800/80 dark:text-blue-200/70",
    listText: "text-blue-950 dark:text-blue-50",
    icon: "text-blue-800 dark:text-blue-400", // Icon matches primary
    button: "bg-blue-800 hover:bg-blue-900 text-white shadow-blue-200 dark:shadow-blue-900/20",
    decoration: "border-blue-200 bg-white dark:bg-blue-950 dark:border-blue-800",
  },
  default: {
    container: "bg-blue-50/80 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30",
    header: "text-blue-900 dark:text-blue-100",
    subtext: "text-blue-800/80 dark:text-blue-200/70",
    listText: "text-blue-950 dark:text-blue-50",
    icon: "text-blue-800 dark:text-blue-400", // Icon matches primary
    button: "bg-blue-800 hover:bg-blue-900 text-white shadow-blue-200 dark:shadow-blue-900/20",
    decoration: "border-blue-200 bg-white dark:bg-blue-950 dark:border-blue-800",
  },
};

const ServicesSteps = () => {
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category");
  // Normalize category to lowercase to match keys, fallback to default
  const categoryKey = rawCategory ? rawCategory : "default";
  const theme = themeConfig[categoryKey] || themeConfig?.default;

  return (
    <div
      className={`relative mx-4 rounded-3xl border backdrop-blur-sm transition-all duration-300 ${theme?.container}`}
    >
      <div className="flex flex-col lg:flex-row px-4 py-8 lg:px-12 lg:py-16 relative">
        {/* Left Content */}
        <div className="flex flex-col space-y-8 lg:basis-1/2 lg:pr-12 w-full">
          {/* Header */}
          <div className="space-y-4 text-center lg:text-left">
            <h2 className={`font-serif text-3xl font-bold lg:text-5xl leading-tight ${theme?.header}`}>
              End-to-end services
            </h2>
            <p className={`text-base lg:text-lg leading-relaxed font-medium ${theme?.subtext}`}>
              Your one-stop solution for {categoryKey === "default" ? "events" : categoryKey}s.
              <span className="hidden lg:inline">{"\n"}</span>
              From planning to execution.
            </p>
          </div>

          {/* Feature List & Mobile Image */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-8">
            <div className="flex w-full flex-col justify-center space-y-5">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3 lg:gap-4">
                  <div className={`flex-shrink-0 p-1 rounded-full bg-white/50 dark:bg-black/20`}>
                    <Check className={`w-5 h-5 lg:w-6 lg:h-6 ${theme?.icon}`} strokeWidth={3} />
                  </div>
                  <p className={`text-base lg:text-xl font-semibold ${theme?.listText}`}>{feature}</p>
                </div>
              ))}
            </div>

            {/* Mobile Image - FIXED SRC */}
            <div className="lg:hidden w-32 shrink-0 relative rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="rounded-xl overflow-hidden shadow-lg border-2 border-white dark:border-gray-800">
                <SmartMedia
                  // Changed to a stable Unsplash ID
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400&auto=format&fit=crop"
                  type="image"
                  className="w-full h-auto object-cover aspect-square"
                  width={128}
                  height={128}
                  alt="Event decoration details"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            className={`group flex w-full lg:w-fit items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-bold shadow-lg active:scale-95 transition-all ${theme?.button}`}
            aria-label="Talk to Planner"
          >
            Plan My {categoryKey === "default" ? "Event" : categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
            <ArrowRight
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* Desktop Right Image */}
        <div className="hidden lg:flex basis-1/2 items-center justify-center pl-8 relative">
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
            <SmartMedia
              alt="Luxury Wedding Setup"
              src="https://images.unsplash.com/photo-1519225468359-53432b479ea2?q=80&w=800&auto=format&fit=crop"
              type="image"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Decorative Corners */}
        <CornerDecoration position="left" style={theme?.decoration} />
        <CornerDecoration position="right" style={theme?.decoration} />
      </div>
    </div>
  );
};

// Extracted Component
const CornerDecoration = ({ position, style }) => (
  <div
    className={`absolute top-0 w-8 h-8 lg:w-12 lg:h-12 rounded-full border shadow-sm z-10
    ${position === "left" ? "left-0 -translate-x-1/2 -translate-y-1/2" : "right-0 translate-x-1/2 -translate-y-1/2"}
    ${style}
    `}
  />
);

export default memo(ServicesSteps);
