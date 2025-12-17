"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <section className="mb-0 w-full" id="more_about_planwab">
        {/* Top Curve Decoration */}
        <div className="w-full -mt-10 md:-mt-16 relative z-10 pointer-events-none">
          <img
            alt=""
            loading="lazy"
            className="max-h-16 w-full object-cover object-top"
            src="https://www.theweddingcompany.com/images/HomePage/new/pink-curve.svg"
          />
        </div>

        <div className="pb-12 pt-6 px-4 md:px-0 shadow-none !bg-[#FFEFF4] !z-[999999999]">
          <div className="mx-auto flex max-w-screen-lg flex-col justify-center items-center shadow-none">
            <h2 className="mb-6 font-serif text-3xl font-semibold md:mb-10 md:text-4xl text-center">About PlanWAB</h2>

            <div className="flex flex-col gap-y-6 text-sm md:text-base leading-relaxed text-gray-700 max-w-4xl">
              {/* Intro Block */}
              <div className="space-y-3">
                <h1 className="text-xl font-bold md:text-2xl text-gray-900">India's Premier Event Marketplace</h1>
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
                className={`space-y-6 transition-all duration-500 ease-in-out overflow-hidden ${
                  isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {/* Service 1 */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">Venue Booking</h3>
                  <p>
                    Finding the perfect spot is step one. Explore our curated list of banquet halls, lawns, and hotels.
                    Filter by capacity, budget, and location to book your ideal venue in minutes, not days.
                  </p>
                </div>

                {/* Service 2 */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">Verified Vendor Network</h3>
                  <p>
                    Quality you can trust. We host India's top creative talent—from expert makeup artists to cinematic
                    photographers. Browse portfolios, read genuine reviews, and book directly through PlanWAB.
                  </p>
                </div>

                {/* Service 3 */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">Transparent Pricing</h3>
                  <p>
                    No hidden costs. We believe in complete transparency. Compare quotes, customize packages, and get
                    the best deals in the industry, tailored specifically to your event needs.
                  </p>
                </div>

                {/* Why Choose Us */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">Why Choose PlanWAB?</h3>
                  <p>
                    We combine technology with human expertise. Our smart tools help you budget and shortlist, while our
                    support team ensures your event day runs smoothly. Stress-free planning starts here.
                  </p>
                </div>
              </div>

              {/* Toggle Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="self-start md:self-center flex items-center gap-1 border-b-[1.5px] border-[#C33765] pt-2 text-[#C33765] font-semibold hover:opacity-80 transition-opacity"
              >
                {isExpanded ? "Read Less" : "Read More"}
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;
