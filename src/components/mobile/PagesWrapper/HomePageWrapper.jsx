"use client";

import React, { useState, useEffect, memo, useCallback, useMemo, lazy, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import SmartMedia from "./../SmartMediaLoader";
import { useNavbarVisibilityStore } from "../../../GlobalState/navbarVisibilityStore";

// INSTANT — above the fold
import CategoryGrid from "../homepage/CategoriesGrid";

// LAZY — below the fold, not needed at first paint
const ServicesSteps = lazy(() => import("../homepage/ServicesSteps"));
const SampleProposal = lazy(() => import("../homepage/SampleProposals"));
const WhyWeBetter = lazy(() => import("../homepage/WhyWeBetter"));
const AreYouAVendorSection = lazy(() => import("../homepage/AreYouVendor"));
const QuickServices = lazy(() => import("../homepage/QuickServices"));

// Lazy-load the drawer separately since it's conditionally rendered
const VendorOnboardingDrawer = lazy(() =>
  import("../homepage/AreYouVendor").then((mod) => ({
    default: mod.VendorOnboardingDrawer,
  }))
);

const OFFERS = [
  "Get 10% OFF on all bookings",
  "Free Consultation",
  "Flat ₹500 OFF First Booking",
];

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = {
        light: 10,
        medium: 25,
        heavy: 50,
        success: [10, 50, 10],
      };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

const OfferTicker = memo(() => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
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
          initial={false}
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
  const category = searchParams.get("category") || "Default";
  const videoSrc = useMemo(
    () =>
      category === "Default"
        ? "/CatVideos/EventsHeroMob.mp4"
        : `/CatVideos/${category}HeroMob.mp4`,
    [category]
  );
  const posterSrc = useMemo(
    () =>
      category === "Default"
        ? "/CatVideos/DefaultHeroMobImg.png"
        : `/CatVideos/${category}HeroMobImg.png`,
    [category]
  );

  return (
    <div className="relative h-[55vh] w-full bg-gray-200">
      <SmartMedia
        src={videoSrc}
        poster={posterSrc}
        type="video"
        className="w-full h-full"
        alt={`${category} Hero Video`}
        priority={true}
      />
    </div>
  );
});

// Minimal fallback for lazy sections — invisible but reserves no awkward space
const LazyFallback = () => null;

const MainContent = ({ plannersSlot, trendingSlot, mostBookedSlot }) => {
  const haptic = useHapticFeedback();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "Default";
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { setIsNavbarVisible } = useNavbarVisibilityStore();

  const handleCloseDrawer = () => {
    haptic("light");
    setIsDrawerOpen(false);
    setIsNavbarVisible(true);
  };

  const banner2Url = {
    wedding: "banner10.png",
    birthday: "banner3.png",
    anniversary: "banner7.png",
    default: "banner10.png",
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-50 text-slate-800 font-sans pb-0 mx-auto max-w-md overflow-hidden">
      <HeroSection />

      <div className="w-full bg-black py-2.5 px-4 flex items-center justify-between relative overflow-hidden z-20 shadow-md">
        <div className="flex items-center gap-3 z-10 w-full overflow-hidden">
          <span className="font-serif text-[#E5B80B] text-xl font-bold italic tracking-wide shrink-0">
            Elite
          </span>
          <div className="h-5 w-[1px] bg-gray-700 mx-1 shrink-0" />
          <OfferTicker />
        </div>
        <ChevronRight className="text-gray-400 w-4 h-4 shrink-0" />
      </div>

      <div className="mx-1 mt-2 px-2">
        <Link href={`/events/${currentCategory}`}>
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => haptic("medium")}
            className="w-full h-24 relative rounded-xl overflow-hidden"
          >
            <SmartMedia
              src={`/HeroNAP${currentCategory}.gif`}
              type="image"
              className="w-full h-full object-cover object-center"
              priority={true}
            />
          </motion.div>
        </Link>
      </div>

      <CategoryGrid currentCategory={currentCategory} />

      <div className="min-h-[280px] transition-all">{plannersSlot}</div>

      <div className="mx-1 mt-2 px-2 mb-6 pb-4">
        <Link href={`/events/${currentCategory}`}>
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => haptic("medium")}
            className="w-full aspect-[1/1.1] relative rounded-xl overflow-hidden"
          >
            <SmartMedia
              src="/Banners/banner8.gif"
              type="image"
              className="w-full h-full object-cover object-center"
              priority={false}
            />
          </motion.div>
        </Link>
      </div>

      <div className="min-h-[200px] transition-all">{mostBookedSlot}</div>

      <div className="mx-1 mt-2 px-2 mb-6 pb-4">
        <Link href={`/events/${currentCategory}`}>
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => haptic("medium")}
            className="w-full aspect-[4/2.3] relative rounded-xl overflow-hidden"
          >
            <SmartMedia
              src={`/Banners/${banner2Url[currentCategory?.toLowerCase()] || "banner2.png"}`}
              type="image"
              className="w-full h-full object-cover object-center"
              priority={false}
            />
          </motion.div>
        </Link>
      </div>

      {/* Lazy-loaded below-fold sections */}
      <Suspense fallback={<LazyFallback />}>
        <ServicesSteps />
      </Suspense>

      <div className="mx-1 mt-6 px-2 mb-2">
        <div className="w-full aspect-[4/2.3] bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <SmartMedia
            src="/Banners/banner1.png"
            type="image"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>
      </div>

      <div className="min-h-[280px] transition-all">{trendingSlot}</div>

      <Suspense fallback={<LazyFallback />}>
        <SampleProposal category={currentCategory} />
      </Suspense>

      <div className="rotate-180 bottom-5 z-50 opacity-100 pointer-events-none mb-9">
        <img
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover opacity-50"
          src="https://www.theweddingcompany.com/images/HomePage/new/pink-curve.svg"
        />
      </div>

      <Suspense fallback={<LazyFallback />}>
        <QuickServices category={currentCategory} />
      </Suspense>

      <Suspense fallback={<LazyFallback />}>
        <WhyWeBetter />
      </Suspense>

      <Suspense fallback={<LazyFallback />}>
        <AreYouAVendorSection
          haptic={haptic}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      </Suspense>

      {isDrawerOpen && (
        <Suspense fallback={null}>
          <VendorOnboardingDrawer
            isOpen={isDrawerOpen}
            onClose={handleCloseDrawer}
            haptic={haptic}
          />
        </Suspense>
      )}

      <style jsx global>{`
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

export default memo(MainContent);