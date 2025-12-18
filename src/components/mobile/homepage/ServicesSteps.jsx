import React, { memo } from "react";
import { Check, ArrowRight } from "lucide-react";
import SmartMedia from "../SmartMediaLoader";

// 1. Optimization: Move static data OUTSIDE the component.
// This prevents memory reallocation on every render.
const FEATURES = ["Wedding planning", "Budget optimisation", "Event management"];

const ServicesSteps = () => {
  return (
    <div
      className="relative mx-4 bg-rose-200/50"
      // 2. Optimization: Content Visibility
      // Skips rendering layout when off-screen.
      style={{ contentVisibility: "auto", containIntrinsicSize: "400px" }}
    >
      <div className="flex px-4 py-7 lg:px-10 lg:py-16 relative">
        <div className="flex flex-col space-y-7 lg:basis-1/2 lg:space-y-8 lg:px-8 w-full">
          {/* Header Section */}
          <div className="space-y-4 px-4 text-center lg:text-left">
            <h2 className="font-serif text-2xl font-semibold lg:text-5xl text-gray-900 leading-tight">
              End-to-end services
            </h2>
            <p className="text-base text-gray-600 lg:whitespace-pre-wrap lg:text-xl leading-relaxed">
              Your one-stop solution for weddings.
              <span className="hidden lg:inline">{"\n"}</span>
              From planning to execution.
            </p>
          </div>

          {/* List Section */}
          <div className="flex items-center justify-between">
            <div className="flex w-full flex-col justify-center space-y-4">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-2 lg:gap-4">
                  <div className="flex-shrink-0">
                    <Check className="w-5 h-5 text-[#C33765] lg:w-8 lg:h-8" strokeWidth={3} />
                  </div>
                  <p className="text-base font-semibold text-gray-800 lg:text-2xl lg:font-medium">{feature}</p>
                </div>
              ))}
            </div>

            {/* Mobile Image - Optimized */}
            <div className="lg:hidden w-32 shrink-0">
              <SmartMedia
                src="https://www.theweddingcompany.com/_next/static/media/Mandap.d8d5d35e.webp"
                type="image"
                className="w-full h-auto object-contain rounded-lg shadow-sm"
                loaderImage="/GlowLoadingGif.gif"
                width={128} // Explicit width helps browser reserve space
                height={100}
                alt="Mandap decoration"
                loading="lazy"
              />
            </div>
          </div>

          {/* CTA Button */}
          <button
            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#C33765] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-rose-900/10 active:scale-95 transition-all lg:w-fit lg:text-lg hover:bg-[#a82d55]"
            aria-label="Talk to Wedding Planner"
          >
            Talk to Wedding Planner
            <ArrowRight
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={3}
            />
          </button>
        </div>

        {/* Desktop Right Image - Optimized */}
        <div className="hidden basis-1/2 lg:grid place-items-center pl-8">
          {/* 3. Replaced raw <img> with SmartMedia for consistency & lazy loading */}
          <div className="w-full h-80 relative rounded-xl overflow-hidden shadow-md">
            <SmartMedia
              alt="Luxury Wedding Mandap"
              src="https://images.unsplash.com/photo-1519225468359-53432b479ea2?q=80&w=800&auto=format&fit=crop"
              type="image"
              className="w-full h-full object-cover"
              loaderImage="/GlowLoadingGif.gif"
              loading="lazy"
            />
          </div>
        </div>

        {/* Decorative Corners (Simplified for Performance) */}
        <CornerDecoration position="left" />
        <CornerDecoration position="right" />
      </div>
    </div>
  );
};

// Extracted for cleaner JSX
const CornerDecoration = ({ position }) => (
  <div
    className={`absolute top-2 w-6 h-6 lg:w-12 lg:h-12 bg-white rounded-full border border-gray-100 shadow-inner 
    ${position === "left" ? "left-2 -translate-x-1/2 -translate-y-1/2" : "right-2 translate-x-1/2 -translate-y-1/2"}`}
  />
);

// 4. Memoize the component.
// Since this is a static informational section, it never needs to re-render
// unless the parent forces it.
export default memo(ServicesSteps);
