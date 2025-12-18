"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Feather, Award, CheckCircle, Sparkles } from "lucide-react";
import { useCategoryStore } from "@/GlobalState/CategoryStore";

// --- Sub-Component: Individual Step ---
const StepItem = ({ step, index, isActive, color, isDarkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" }); // Triggers when element is in center of screen

  // Update parent state when this specific item hits the center
  useEffect(() => {
    if (isInView) step.onActive(index);
  }, [isInView, index, step]);

  return (
    <motion.div
      ref={ref}
      className={`relative pl-8 sm:pl-12 py-8 transition-all duration-500 ease-out ${
        isActive ? "opacity-100 scale-100" : "opacity-40 scale-95 blur-[1px]"
      }`}
    >
      {/* Timeline Dot (Pulse Effect) */}
      <div
        className="absolute left-[-5px] top-12 w-3 h-3 rounded-full border-2 transition-colors duration-500 z-20 bg-white dark:bg-gray-900"
        style={{ borderColor: isActive ? color : isDarkMode ? "#374151" : "#D1D5DB" }}
      >
        {isActive && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: color }} />
        )}
      </div>

      {/* Content Card */}
      <div
        className={`rounded-3xl overflow-hidden border transition-all duration-500 shadow-xl ${
          isActive
            ? "border-opacity-100 bg-white dark:bg-gray-800 shadow-2xl"
            : "border-transparent bg-gray-50 dark:bg-gray-800/50 shadow-none"
        }`}
        style={{ borderColor: isActive ? `${color}40` : "transparent" }}
      >
        {/* Header Section */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: isActive ? color : "#9CA3AF" }}
            >
              <step.icon size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{step.title}</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 pl-[3.25rem]">{step.desc}</p>
        </div>

        {/* Visual Mockup Area */}
        <div className="p-4 pt-2">
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            {step.content}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function HowItWorksSection() {
  const { activeCategory } = useCategoryStore();
  const [activeStep, setActiveStep] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect Dark Mode for color logic
  useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(matcher.matches);
    const listener = (e) => setIsDarkMode(e.matches);
    matcher.addEventListener("change", listener);
    return () => matcher.removeEventListener("change", listener);
  }, []);

  // Theme Colors
  const themeColors = { Wedding: "#BE185D", Anniversary: "#D97706", Birthday: "#2563EB", Default: "#4B5563" };
  const darkThemeColors = { Wedding: "#F472B6", Anniversary: "#FBBF24", Birthday: "#60A5FA", Default: "#9CA3AF" };
  const color =
    (isDarkMode ? darkThemeColors : themeColors)[activeCategory] ||
    (isDarkMode ? darkThemeColors.Default : themeColors.Default);

  const STEPS = [
    {
      title: "Share Vision",
      desc: "Input your requirements. We use AI to understand your style.",
      icon: Feather,
      content: (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Event Brief</div>
            <Sparkles size={14} className="text-cyan-500 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-1 rounded-md bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-300 text-[10px] font-bold">
              Beach
            </span>
            <span className="px-2 py-1 rounded-md bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-300 text-[10px] font-bold">
              200 Pax
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Get Matches",
      desc: "Receive 3 curated proposals from elite, verified vendors.",
      icon: Award,
      content: (
        <div className="p-4 space-y-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Top Picks For You</div>
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                <Award size={14} />
              </div>
              <div className="flex-1">
                <div className="h-2 w-20 bg-gray-200 dark:bg-gray-600 rounded-full mb-1" />
                <div className="h-1.5 w-12 bg-gray-100 dark:bg-gray-700 rounded-full" />
              </div>
              <div className="text-[10px] font-bold text-green-600">98% Match</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Book Securely",
      desc: "Finalize contracts and payments. Your event is insured.",
      icon: CheckCircle,
      content: (
        <div className="p-4 flex flex-col items-center justify-center text-center py-8">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">All Systems Go!</h4>
          <p className="text-[10px] text-gray-500 mt-1">Vendor secured. Timeline generated.</p>
        </div>
      ),
    },
  ];

  return (
    <section className="py-16 pt-0 px-4 bg-white dark:bg-black overflow-hidden">
      <div className="max-w-md mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Process</span>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2 tracking-tight">How It Works</h2>
        </div>

        <div className="relative">
          {/* Vertical Progress Line */}
          <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            {/* Animated Fill Bar */}
            <motion.div
              className="w-full bg-gradient-to-b from-transparent to-current rounded-full"
              style={{
                height: `${((activeStep + 0.5) / STEPS.length) * 100}%`,
                color: color,
                transition: "height 0.5s ease-out",
              }}
            />
          </div>

          {/* Steps Loop */}
          <div className="space-y-2">
            {STEPS.map((step, i) => (
              <StepItem
                key={i}
                index={i}
                step={{ ...step, onActive: setActiveStep }}
                isActive={activeStep === i}
                color={color}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
