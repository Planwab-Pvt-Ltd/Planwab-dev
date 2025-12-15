"use client";

import { useState, useEffect } from "react";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
import SkeletonCard from "@/components/desktop/SkeletonCard";
import Wedding from "@/components/desktop/Wedding";
import Anniversary from "@/components/desktop/Anniversary";
import Birthday from "@/components/desktop/Birthday";
import HeroSection from "@/components/desktop/ui/EventsPage/HeroSection";
import Banner1 from "@/components/desktop/ui/EventsPage/Banner1";
import HowItWorksSection from "@/components/desktop/ui/EventsPage/HowItWorks";
import SearchSection from "@/components/ui/desktop/EventsPage/SearchSection";

export default function Home() {
  const activeCategory = useCategoryStore((state) => state.activeCategory);
  const [loading, setLoading] = useState(true);

  const categoryThemes = {
    Wedding: {
      primary: "from-white via-rose-50/30 to-white",
      accent: "from-rose-100/40 to-transparent",
      glow: "bg-rose-200/20",
      particles: "bg-rose-300/60",
    },
    Anniversary: {
      primary: "from-white via-amber-50/30 to-white",
      accent: "from-amber-100/40 to-transparent",
      glow: "bg-amber-200/20",
      particles: "bg-amber-300/60",
    },
    Birthday: {
      primary: "from-white via-blue-50/30 to-white",
      accent: "from-blue-100/40 to-transparent",
      glow: "bg-blue-200/20",
      particles: "bg-blue-300/60",
    },
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [activeCategory]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    switch (activeCategory) {
      case "Wedding":
        return <Wedding />;
      case "Anniversary":
        return <Anniversary />;
      case "Birthday":
        return <Birthday />;
      default:
        return <Wedding />;
    }
  };

  const currentTheme = categoryThemes[activeCategory];

  return (
    <>
      <div className="relative overflow-hidden transition-all duration-1000 ease-out">
        <div
          className={`fixed inset-0 bg-gradient-to-br ${currentTheme?.primary} transition-all duration-1000 ease-out`}
        />

        <div
          className={`fixed inset-0 bg-gradient-radial ${currentTheme?.accent} transition-all duration-1000 ease-out`}
        />

        <div
          className={`fixed top-20 right-20 w-96 h-96 ${currentTheme?.glow} rounded-full blur-3xl opacity-50 transition-all duration-1000 ease-out animate-pulse`}
        />

        <div
          className={`fixed bottom-20 left-20 w-80 h-80 ${currentTheme?.glow} rounded-full blur-2xl opacity-40 transition-all duration-1000 ease-out animate-bounce`}
          style={{ animationDuration: "3s" }}
        />

        <div
          className={`fixed top-1/2 left-1/2 w-64 h-64 ${currentTheme?.glow} rounded-full blur-3xl opacity-30 transition-all duration-1000 ease-out animate-spin`}
          style={{
            transform: "translate(-50%, -50%)",
            animationDuration: "8s",
          }}
        />

        <div className="fixed inset-0 pointer-events-none z-5">
          <div
            className={`absolute top-32 left-1/4 w-3 h-3 ${currentTheme?.particles} rounded-full transition-all duration-1000 animate-ping`}
            style={{ animationDuration: "2s" }}
          />
          <div
            className={`absolute top-48 right-1/3 w-2 h-2 ${currentTheme?.particles} rounded-full transition-all duration-1000 animate-pulse`}
            style={{ animationDuration: "1.5s" }}
          />
          <div
            className={`absolute bottom-1/3 left-1/3 w-4 h-4 ${currentTheme?.particles} rounded-full transition-all duration-1000 animate-bounce`}
            style={{ animationDuration: "2.5s" }}
          />
          <div
            className={`absolute bottom-48 right-1/4 w-2 h-2 ${currentTheme?.particles} rounded-full transition-all duration-1000 animate-ping`}
            style={{ animationDuration: "3s" }}
          />
          <div
            className={`absolute top-2/3 right-20 w-3 h-3 ${currentTheme?.particles} rounded-full transition-all duration-1000 animate-pulse`}
            style={{ animationDuration: "2s" }}
          />
          <div
            className={`absolute top-1/4 right-1/2 w-1 h-1 ${currentTheme?.particles} rounded-full transition-all duration-1000 animate-bounce`}
            style={{ animationDuration: "4s" }}
          />
        </div>

        <div className="relative z-10">
          <HeroSection />
          {/* <Banner1 /> */}
          <HowItWorksSection />
          <div className="px-4 md:px-8 lg:px-12">
            <SearchSection />
            <div className="py-12">{renderContent()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
