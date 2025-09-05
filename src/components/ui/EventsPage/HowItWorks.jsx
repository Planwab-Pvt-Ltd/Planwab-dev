"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, Award, CheckCircle, Check } from "lucide-react";
import { useCategoryStore } from "@/GlobalState/CategoryStore";

export default function HowItWorksSection() {
  const { activeCategory } = useCategoryStore();
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  const STEPS = [
    {
      title: `1. Share Your ${activeCategory} Vision`,
      description:
        "Tell us about your dream event. Our intuitive platform makes it easy to specify every detail, from guest count to aesthetic.",
      icon: Feather,
      content: (
        <div className="p-4 sm:p-6 h-full flex flex-col bg-white">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center mb-3 sm:mb-4">
            <Feather className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 text-cyan-500" />
            Crafting Your Brief
          </h3>
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm flex-grow">
            <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">Event Type</p>
              <p className="font-semibold text-gray-700">{`Beachside ${activeCategory}`}</p>
            </div>
            <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">Location & Guests</p>
              <p className="font-semibold text-gray-700">
                Goa, India ・ Approx. 200
              </p>
            </div>
          </div>
          <button className="w-full mt-3 sm:mt-auto bg-cyan-500 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-cyan-600 transition-colors">
            Get Started
          </button>
        </div>
      ),
    },
    {
      title: "2. Receive Curated Proposals",
      description:
        "Forget endless searching. We match you with vetted, world-class vendors who are perfect for your event.",
      icon: Award,
      content: (
        <div className="p-4 sm:p-6 h-full flex flex-col bg-white">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center mb-3 sm:mb-4">
            <Award className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 text-amber-500" />
            Your Elite Vendor Matches
          </h3>
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm flex-grow">
            <div className="p-2 sm:p-3 bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
              <p className="font-semibold text-gray-800">
                Taj Exotica Resort & Spa
              </p>
              <p className="text-xs text-gray-500">Venue & Catering - ★ 4.9</p>
            </div>
            <div className="p-2 sm:p-3 bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
              <p className="font-semibold text-gray-800">
                Shutterdown Photography
              </p>
              <p className="text-xs text-gray-500">Photography - ★ 5.0</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "3. Book with Confidence",
      description:
        "Finalize your choices with transparent pricing and contracts. We secure your dream team, stress-free.",
      icon: CheckCircle,
      content: (
        <div className="p-4 sm:p-6 h-full flex flex-col items-center justify-center text-center bg-white">
          <div className="w-16 sm:w-20 h-16 sm:h-20 bg-green-50 rounded-full flex items-center justify-center mb-3 sm:mb-4 border-4 border-green-100">
            <Check className="w-8 sm:w-10 h-8 sm:h-10 text-green-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            Booking Confirmed!
          </h3>
          <p className="text-gray-500 mt-1 sm:mt-2 text-xs sm:text-sm max-w-xs">
            Your perfect day is officially planned. Let the countdown begin!
          </p>
        </div>
      ),
    },
  ];

  const themeColors = {
    Wedding: "#BE185D",
    Anniversary: "#D97706",
    Birthday: "#2563EB",
    Default: "#4B5563",
  };

  const color = themeColors[activeCategory] || themeColors.Default;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(parseInt(entry.target.dataset.step, 10));
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    const refs = stepRefs.current;
    refs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => {
      refs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Your Dream Event, Simplified
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            From vision to reality in three seamless steps. We handle the
            details so you can cherish the moments.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col gap-8">
              {STEPS.map((step, i) => {
                const isActive = activeStep === i;
                return (
                  <div
                    key={step.title}
                    ref={(el) => (stepRefs.current[i] = el)}
                    data-step={i}
                    className="transition-opacity duration-500"
                    style={{ opacity: isActive ? 1 : 0.4 }}
                  >
                    <div className="flex items-start gap-4 sm:gap-6">
                      <motion.div
                        className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4"
                        animate={{
                          borderColor: isActive ? color : "#F3F4F6",
                          backgroundColor: isActive ? color : "#FFFFFF",
                          color: isActive ? "#FFFFFF" : "#6B7280",
                          scale: isActive ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <step.icon className="w-5 h-5" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 leading-tight">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-base text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="lg:hidden mt-6 w-full aspect-square max-h-[400px] rounded-2xl bg-white border border-gray-200/60 shadow-xl overflow-hidden">
                      {step.content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:block w-full lg:w-1/2 lg:sticky top-24 h-[500px]">
            <div className="w-full h-full rounded-2xl bg-white border border-gray-200/60 shadow-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  className="absolute inset-0 w-full h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  }}
                  exit={{
                    opacity: 0,
                    y: -20,
                    transition: { duration: 0.3, ease: "easeIn" },
                  }}
                >
                  {STEPS[activeStep].content}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
