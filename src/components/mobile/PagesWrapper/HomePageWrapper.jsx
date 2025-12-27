"use client";

import React, { useState, useEffect, Suspense, useMemo, memo, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import SmartMedia from "./../SmartMediaLoader";
import Link from "next/link";
import QuickServices from "../homepage/QuickServices";

// 1. Precise Skeletons: Match the EXACT height of your real components
// to prevent "Content Layout Shift" (Jumping UI)
const CategoryGrid = dynamic(() => import("../homepage/CategoriesGrid"), {
  loading: () => <div className="h-[200px] w-full bg-gray-50 rounded-xl my-4 animate-pulse" />,
  ssr: true, // SEO critical
});

const MostBooked = dynamic(() => import("../homepage/MostBooked"), {
  loading: () => <div className="h-[240px] w-full bg-gray-50 rounded-xl my-4 animate-pulse" />,
  ssr: false, // Interaction heavy, can be CSR
});

// Lazy load below-the-fold content
const ServicesSteps = dynamic(() => import("../homepage/ServicesSteps"));
const SampleProposal = dynamic(() => import("../homepage/SampleProposals"));
const WhyWeBetter = dynamic(() => import("../homepage/WhyWeBetter"));
const AreYouAVendorSection = dynamic(() => import("../homepage/AreYouVendor"));

const OFFERS = ["Get 10% OFF on all bookings", "Free Consultation", "Flat ₹500 OFF First Booking"];

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50, success: [10, 50, 10] };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}

const ScrollProgressBar = () => {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: progress > 2 ? 1 : 0 }}
    >
      <motion.div
        className={`h-full bg-gradient-to-r ${"from-blue-600 to-yellow-500"}`}
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
};

// --- Sub-Components (Memoized for Stability) ---

const OfferTicker = memo(() => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // 4s interval is good for performance
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % OFFERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 relative h-5 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-white text-xs font-medium absolute w-full truncate top-0.5"
        >
          {OFFERS[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
});

const HeroSection = memo(() => {
  const searchParams = useSearchParams();
  // Safe default prevents null errors
  const category = searchParams.get("category") || "Default";

  // Memoize the src to prevent string reconstruction on every render
  const videoSrc = useMemo(
    () => (category === "Default" ? "/CatVideos/EventsHeroMob.mp4" : `/CatVideos/${category}HeroMob.mp4`),
    [category]
  );

  return (
    <div className="relative h-[55vh] w-full bg-gray-200">
      {/* 2. Priority Loading: This is the first thing user sees. Load it EAGERLY. */}
      <SmartMedia
        src={videoSrc}
        type="video"
        className="w-full h-full object-cover object-center will-change-transform"
        alt={`${category} Hero Video`}
        loaderImage="/GlowLoadingGif.gif"
        priority={true}
      />
    </div>
  );
});

// --- Main Page Structure ---

const MainContent = () => {
  const MotionLink = motion(Link);
  const haptic = useHapticFeedback();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "Default";

  const banner2Url = {
    wedding: "banner10.png",
    birthday: "banner7.png",
    anniversary: "banner3.png",
    default: "banner2.png",
  };

  // Note: Removed the `useScroll` listener.
  // It was calculating `isNavVisible` but never using it.
  // Removing it saves significant main-thread resources during scrolling.

  return (
    <div className="relative w-full min-h-screen bg-gray-50 text-slate-800 font-sans pb-0 mx-auto max-w-md overflow-hidden">
      <ScrollProgressBar />
      <HeroSection />

      {/* Ticker Strip */}
      <div className="w-full bg-black py-2.5 px-4 flex items-center justify-between relative overflow-hidden z-20 shadow-md">
        <div className="flex items-center gap-3 z-10 w-full overflow-hidden">
          <span className="font-serif text-[#E5B80B] text-xl font-bold italic tracking-wide shrink-0">Elite</span>
          <div className="h-5 w-[1px] bg-gray-700 mx-1 shrink-0" />
          <OfferTicker />
        </div>
        <ChevronRight className="text-gray-400 w-4 h-4 shrink-0" />
      </div>

      {/* Static Banner 1 - High Priority */}
      <div className="mx-1 mt-2 px-2">
        <Link href={`/m/events/${currentCategory}`}>
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => haptic("medium")}
            className="w-full h-24 relative rounded-xl overflow-hidden"
          >
            <SmartMedia
              src={`/HeroNAP${currentCategory}.gif`}
              type="image"
              className="w-full h-full object-cover object-center"
              loaderImage="/GlowLoadingGif.gif"
              priority={true}
            />
          </motion.div>
        </Link>
      </div>

      {/* --- Main Interactive Grid --- */}
      <CategoryGrid currentCategory={currentCategory} />

      {/* --- Lazy Loaded Sections (Below Fold) --- */}
      {/* 'contain-intrinsic-size' prevents scrollbar jumping before content loads */}
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "1000px" }}>
        {/* Static Banner 2 - High Priority */}
        <div className="mx-1 mt-2 px-2 mb-6 pb-4">
          <Link href={`/m/events/${currentCategory}`}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => haptic("medium")}
              className="w-full aspect-[1/1.1] relative rounded-xl overflow-hidden"
            >
              <SmartMedia
                src={`/Banners/banner8.gif`}
                type="image"
                className="w-full h-full object-cover object-center"
                loaderImage="/GlowLoadingGif.gif"
                priority={true}
              />
            </motion.div>
          </Link>
        </div>

        <MostBooked />

        {/* Static Banner 3 - High Priority */}
        <div className="mx-1 mt-2 px-2 mb-6 pb-4">
          <Link href={`/m/events/${currentCategory}`}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => haptic("medium")}
              className="w-full aspect-[4/2.3] relative rounded-xl overflow-hidden"
            >
              <SmartMedia
                src={`/Banners/${banner2Url[currentCategory] || "banner2.png"}`}
                type="image"
                className="w-full h-full object-cover object-center"
                loaderImage="/GlowLoadingGif.gif"
                priority={true}
              />
            </motion.div>
          </Link>
        </div>

        <ServicesSteps />

        <div className="mx-1 mt-6 px-2">
          <div className="w-full aspect-[4/2.3] bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <SmartMedia
              src={`/Banners/banner1.png`}
              type="image"
              className="w-full h-full object-cover object-center"
              loaderImage="/GlowLoadingGif.gif"
              loading="lazy"
            />
          </div>
        </div>

        <SampleProposal />

        {/* Decorative Wave - Optimized SVG */}
        <div className="rotate-180 bottom-5 z-50 opacity-100 pointer-events-none mb-9">
          <img
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover opacity-50"
            src="https://www.theweddingcompany.com/images/HomePage/new/pink-curve.svg"
          />
        </div>

        <QuickServices />

        <WhyWeBetter />

        <AreYouAVendorSection />
      </div>

      <style jsx global>{`
        /* Critical CSS for Mobile Performance */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
};

// 3. Suspense Wrapper
// Required for useSearchParams() in Next.js 13+ App Router
const HomePageWrapper = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-gray-50">
          {/* Simple CSS-only loader is lighter than an image */}
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MainContent />
    </Suspense>
  );
};

export default memo(HomePageWrapper);
