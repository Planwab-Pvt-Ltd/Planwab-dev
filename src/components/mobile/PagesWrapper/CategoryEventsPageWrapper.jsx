"use client";

import { useState, useEffect } from "react";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
import HeroSection from "@/components/mobile/ui/EventsPage/HeroSection";
import Banner1 from "@/components/mobile/ui/EventsPage/Banner1";
import HowItWorksSection from "@/components/mobile/ui/EventsPage/HowItWorks";

export default function CategoryEventsPageWrapper() {
  const activeCategory = useCategoryStore((state) => state.activeCategory);

  // Theme Config - Simplified for Mobile Performance
  const categoryThemes = {
    Wedding: {
      primary: "from-rose-50/50 via-white to-rose-50/50 dark:from-gray-900 dark:via-rose-950/10 dark:to-gray-900",
      accent: "from-rose-100/30 to-transparent",
      glow: "bg-rose-400/20",
    },
    Anniversary: {
      primary: "from-amber-50/50 via-white to-amber-50/50 dark:from-gray-900 dark:via-amber-950/10 dark:to-gray-900",
      accent: "from-amber-100/30 to-transparent",
      glow: "bg-amber-400/20",
    },
    Birthday: {
      primary: "from-blue-50/50 via-white to-blue-50/50 dark:from-gray-900 dark:via-blue-950/10 dark:to-gray-900",
      accent: "from-blue-100/30 to-transparent",
      glow: "bg-blue-400/20",
    },
  };

  const currentTheme = categoryThemes[activeCategory] || categoryThemes.Wedding;

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-white dark:bg-black">
      {/* Optimized Background Layers */}
      <div className={`fixed inset-0 bg-gradient-to-b ${currentTheme.primary} z-0`} />

      {/* Animated Glow Orbs (Reduced count for mobile GPU) */}
      <div
        className={`fixed top-[-10%] right-[-20%] w-[300px] h-[300px] rounded-full blur-[80px] ${currentTheme.glow} opacity-60 animate-pulse`}
        style={{ animationDuration: "4s" }}
      />
      <div
        className={`fixed bottom-[-10%] left-[-20%] w-[250px] h-[250px] rounded-full blur-[60px] ${currentTheme.glow} opacity-50`}
      />

      {/* Content */}
      <div className="relative z-10 pb-20">
        <HeroSection />
        <Banner1 />
        <HowItWorksSection />
      </div>
    </main>
  );
}
