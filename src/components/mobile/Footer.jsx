"use client";

import React, { useState, memo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// 1. Optimization: Move static text OUTSIDE to save memory on re-renders
const SECTIONS = [
  {
    title: "Venue Booking",
    content:
      "Finding the perfect spot is step one. Explore our curated list of banquet halls, lawns, and hotels. Filter by capacity, budget, and location to book your ideal venue in minutes, not days.",
  },
  {
    title: "Verified Vendor Network",
    content:
      "Quality you can trust. We host India's top creative talent—from expert makeup artists to cinematic photographers. Browse portfolios, read genuine reviews, and book directly through PlanWAB.",
  },
  {
    title: "Transparent Pricing",
    content:
      "No hidden costs. We believe in complete transparency. Compare quotes, customize packages, and get the best deals in the industry, tailored specifically to your event needs.",
  },
  {
    title: "Why Choose PlanWAB?",
    content:
      "We combine technology with human expertise. Our smart tools help you budget and shortlist, while our support team ensures your event day runs smoothly. Stress-free planning starts here.",
  },
];

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      className="mb-0 w-full relative z-10 bg-white"
      id="more_about_planwab"
      // 2. Optimization: Skip rendering layout until scrolled into view
      // This is huge for footers!
      style={{ contentVisibility: "auto", containIntrinsicSize: "600px" }}
    >
      {/* Top Curve Decoration */}
      <div className="w-full -mt-0 md:-mt-0 relative z-10 pointer-events-none leading-none">
        <img
          alt=""
          loading="lazy"
          className="w-full max-h-16 object-cover object-top"
          src="https://www.theweddingcompany.com/images/HomePage/new/pink-curve.svg"
          aria-hidden="true"
        />
      </div>

      <div className="pb-12 pt-6 px-4 md:px-0 bg-[#FFEFF4]">
        <div className="mx-auto flex max-w-screen-lg flex-col justify-center items-center">
          <h2 className="mb-6 font-serif text-3xl font-semibold md:mb-10 md:text-4xl text-center text-gray-900">
            About PlanWAB
          </h2>

          <div className="flex flex-col gap-y-6 text-sm md:text-base leading-relaxed text-gray-700 max-w-4xl">
            {/* Intro Block (Always Visible) */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold md:text-2xl text-gray-900">India's Premier Event Marketplace</h3>
              <p>
                PlanWAB is your all-in-one platform to plan, book, and manage events effortlessly. From intimate
                birthdays to grand weddings, we turn your vision into reality.
              </p>
              <p>
                As a leading event tech startup, we simplify the chaos of planning. Our marketplace connects you with
                verified vendors—venues, caterers, photographers, and decorators—ensuring transparent pricing and
                trusted service for over 5,000+ successful events.
              </p>
            </div>

            {/* Hidden / Expandable Content */}
            <div
              className={`space-y-6 transition-all duration-500 ease-in-out overflow-hidden will-change-[max-height,opacity] ${
                isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {SECTIONS.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="text-lg font-bold text-gray-900">{section.title}</h4>
                  <p>{section.content}</p>
                </div>
              ))}
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="self-start md:self-center flex items-center gap-1 border-b-[1.5px] border-[#C33765] pt-2 text-[#C33765] font-semibold hover:opacity-80 transition-opacity active:scale-95"
              aria-expanded={isExpanded}
              aria-controls="footer-expanded-content"
            >
              {isExpanded ? "Read Less" : "Read More"}
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// 3. Optimization: Memoize since it's a static footer mostly
export default memo(Footer);
