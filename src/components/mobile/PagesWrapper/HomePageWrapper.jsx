"use client";

import React, { useState, useEffect, useRef } from "react";
import { Home, Heart, Star, ArrowRight, Sparkles, Grid, Calendar, User, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useSearchParams } from "next/navigation";
import CategoryGrid from "../homepage/CategoriesGrid";
import MostBooked from "../homepage/MostBooked";
import ServicesSteps from "../homepage/ServicesSteps";
import SampleProposal from "../homepage/SampleProposals";
import WhyWeBetter from "../homepage/WhyWeBetter";
import AreYouAVendorSection from "../homepage/AreYouVendor";

const QUICK_LINKS = [
  { label: "Venues", icon: "🏰" },
  { label: "Makeup", icon: "💄" },
  { label: "Photo", icon: "📸" },
  { label: "Mehndi", icon: "🎨" },
  { label: "Decor", icon: "🌸" },
];

const OFFERS = ["Get 10% OFF on all bookings", "Free Consultation for Weddings", "Flat ₹500 OFF on First Booking"];

// --- 3. MAIN PAGE COMPONENT ---
const MobileEventPlanner = () => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [offerIndex, setOfferIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState("Default");
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest;
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      setIsNavVisible(false);
    } else {
      setIsNavVisible(true);
    }
    lastScrollY.current = currentScrollY;
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category");
    if (!category) {
      setCurrentCategory("Default");
    }
    setCurrentCategory(category || "Default");
  }, [searchParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOfferIndex((prev) => (prev + 1) % OFFERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gray-50 text-slate-800 font-sans pb-24 mx-auto max-w-md overflow-hidden">
      {/* 2. Hero Video (No Overlay) */}
      <div className="relative h-[55vh] w-full p-0 m-0">
        <video
          src={
            currentCategory === "Default" ? "/CatVideos/EventsHeroMob.mp4" : `/CatVideos/${currentCategory}HeroMob.mp4`
          }
          alt="Hero"
          className="w-full h-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* 3. Black Strip (Attached) */}
      <div className="w-full bg-black py-2.5 px-4 flex items-center justify-between relative overflow-hidden z-20">
        <div className="flex items-center gap-3 z-10 w-full overflow-hidden">
          <span className="font-serif text-[#E5B80B] text-xl font-bold italic tracking-wide shrink-0">Elite</span>
          <div className="h-5 w-[1px] bg-gray-700 mx-1 shrink-0" />
          <div className="flex-1 relative h-5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={offerIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-white text-xs font-medium absolute w-full truncate top-0.5"
              >
                {OFFERS[offerIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <ChevronRight className="text-gray-400 w-4 h-4 shrink-0" />
      </div>

      {/* 4. Compact Planner Banner */}
      <div className="mx-1 mt-2 mb-1">
        <motion.div whileTap={{ scale: 0.98 }} className="w-full h-24">
          <img
            src={`HeroNAP${currentCategory}.png`}
            alt=""
            className="w-full h-full object-cover object-center"
            height={15}
            width={100}
          />
        </motion.div>
      </div>

      {/* 6. Explore Categories */}
      <CategoryGrid currentCategory={currentCategory} />

      {/* 7. Most Booked */}
      <MostBooked />

      <ServicesSteps />

      <SampleProposal />

      {/* 5. Quick Services (Blue/Yellow Theme) */}
      <div className="px-4 mb-9">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-yellow-400 rounded-full" />
          Quick Services
        </h3>
        <div className="flex justify-between overflow-x-auto scrollbar-hide gap-3 pb-2">
          {QUICK_LINKS.map((item, idx) => (
            <motion.div key={idx} className="flex flex-col items-center gap-2 min-w-[68px]" whileTap={{ scale: 0.9 }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-blue-50 bg-blue-50">
                <span className="text-2xl drop-shadow-sm">{item.icon}</span>
              </div>
              <span className="text-[10px] font-bold text-blue-900">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <WhyWeBetter />

      <AreYouAVendorSection />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MobileEventPlanner;
