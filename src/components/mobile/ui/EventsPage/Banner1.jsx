"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Gift, Percent, Clock, Copy, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const BANNER_DATA = {
  wedding: [
    {
      id: 1,
      title: "Dream Wedding Sale",
      subtitle: "Up to 30% off on premium venues",
      code: "WEDDING30",
      gradient: "from-rose-500 to-pink-600",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      validUntil: "Dec 31, 2024",
      icon: Sparkles,
    },
    {
      id: 2,
      title: "Free Photography",
      subtitle: "With venue bookings above ₹5L",
      code: "FREEPHOTO",
      gradient: "from-purple-500 to-indigo-600",
      image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800",
      validUntil: "Jan 15, 2025",
      icon: Gift,
    },
    {
      id: 3,
      title: "Early Bird Discount",
      subtitle: "Book 6 months ahead, save 20%",
      code: "EARLYBIRD20",
      gradient: "from-amber-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
      validUntil: "Ongoing",
      icon: Percent,
    },
  ],
  anniversary: [
    {
      id: 1,
      title: "Anniversary Special",
      subtitle: "20% off on romantic dinners",
      code: "LOVE20",
      gradient: "from-amber-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800",
      validUntil: "Dec 31, 2024",
      icon: Sparkles,
    },
    {
      id: 2,
      title: "Couple's Retreat",
      subtitle: "Free spa with venue booking",
      code: "RETREAT",
      gradient: "from-pink-500 to-rose-600",
      image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800",
      validUntil: "Jan 31, 2025",
      icon: Gift,
    },
  ],
  birthday: [
    {
      id: 1,
      title: "Birthday Bash Deal",
      subtitle: "25% off on party venues",
      code: "BDAY25",
      gradient: "from-blue-500 to-indigo-600",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
      validUntil: "Dec 31, 2024",
      icon: Sparkles,
    },
    {
      id: 2,
      title: "Kids Party Special",
      subtitle: "Free cake with packages above ₹25K",
      code: "KIDSCAKE",
      gradient: "from-cyan-500 to-blue-600",
      image: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800",
      validUntil: "Ongoing",
      icon: Gift,
    },
    {
      id: 3,
      title: "Milestone Birthday",
      subtitle: "Extra 15% off on 50th/60th celebrations",
      code: "MILESTONE15",
      gradient: "from-violet-500 to-purple-600",
      image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800",
      validUntil: "Jan 31, 2025",
      icon: Percent,
    },
  ],
};

// Optimized Spring Physics for "Buttery" Feel
const smoothSpring = {
  type: "spring",
  stiffness: 250,
  damping: 35,
  mass: 0.8,
};

export default function Banner1({ theme, category }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);

  const banners = BANNER_DATA[category] || BANNER_DATA.wedding;
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === banners.length - 1;

  // Auto-scroll Logic (Loops back to start)
  useEffect(() => {
    if (isPaused) return;

    autoScrollRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [banners.length, isPaused]);

  // Sync Scroll Position with Active Index
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const card = container.children[0]; // Get first card to measure width including margins
      if (card) {
        // Calculate dynamic width based on the actual rendered element
        const scrollPos = activeIndex * (card.clientWidth + 16); // 16px is the gap-4

        container.scrollTo({
          left: scrollPos,
          behavior: "smooth",
        });
      }
    }
  }, [activeIndex, banners.length]);

  // Manual Scroll Handler (Updates Index on Swipe)
  const handleScroll = useCallback(
    (e) => {
      const container = e.target;
      const scrollLeft = container.scrollLeft;
      const cardWidth = (container.children[0]?.clientWidth || 0) + 16; // Width + Gap

      if (cardWidth > 16) {
        const newIndex = Math.round(scrollLeft / cardWidth);
        // Only update if index changed and is valid
        if (newIndex !== activeIndex && newIndex >= 0 && newIndex < banners.length) {
          setActiveIndex(newIndex);
        }
      }
    },
    [activeIndex, banners.length]
  );

  const copyCode = useCallback(async (code, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([10, 50, 10]);
      }
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const goToPrev = useCallback(() => {
    if (isFirst) return;
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
    setActiveIndex((prev) => Math.max(0, prev - 1));
  }, [isFirst]);

  const goToNext = useCallback(() => {
    if (isLast) return;
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
    setActiveIndex((prev) => Math.min(banners.length - 1, prev + 1));
  }, [isLast, banners.length]);

  return (
    <section className="py-6 w-full max-w-md mx-auto flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm border border-white/50"
            style={{ backgroundColor: `${theme.primary}10` }}
          >
            <Gift size={18} style={{ color: theme.primary }} strokeWidth={2.5} />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-none">Special Offers</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Exclusive deals for you</p>
          </div>
        </div>

        {/* Navigation Buttons (Disabled Logic Applied) */}
        {banners.length > 1 && (
          <div className="flex gap-2">
            <button
              onClick={goToPrev}
              disabled={isFirst}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
                isFirst
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-white border-gray-200 text-gray-600 shadow-sm active:scale-95 active:bg-gray-50"
              }`}
              aria-label="Previous Offer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goToNext}
              disabled={isLast}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
                isLast
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-white border-gray-200 text-gray-600 shadow-sm active:scale-95 active:bg-gray-50"
              }`}
              aria-label="Next Offer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative w-full">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide snap-x snap-mandatory touch-pan-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {banners.map((banner, idx) => {
            const IconComponent = banner.icon;
            const isActive = activeIndex === idx;

            return (
              <motion.div
                key={banner.id}
                layout
                animate={{
                  opacity: isActive ? 1 : 0.7,
                  scale: isActive ? 1 : 0.96,
                }}
                transition={smoothSpring}
                className="relative min-w-[85%] aspect-[1.9/1] rounded-[2rem] overflow-hidden snap-center shadow-lg transform-gpu border border-white/20"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover transform scale-105"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} opacity-90 mix-blend-multiply`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>

                {/* Animated Background Shapes */}
                <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
                  <motion.div
                    className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -left-12 -bottom-12 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.1, 0.15] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-between text-white">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md shadow-sm border border-white/10">
                        <IconComponent size={14} className="text-white" strokeWidth={3} />
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1.5 tracking-wide">
                        <Clock size={10} /> {banner.validUntil}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black leading-tight mb-1.5 tracking-tight drop-shadow-md">
                      {banner.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90 font-medium line-clamp-2 max-w-[90%]">
                      {banner.subtitle}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3 mt-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => copyCode(banner.code, e)}
                      className="flex-1 flex items-center justify-between gap-3 bg-white/10 backdrop-blur-xs border border-white/20 px-3.5 py-2.5 rounded-xl group hover:bg-white/20 transition-colors"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-white/70 font-bold">
                          Code
                        </span>
                        <span className="font-mono text-sm sm:text-base font-bold tracking-widest">{banner.code}</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-active:scale-90 transition-transform">
                        <AnimatePresence mode="wait">
                          {copiedCode === banner.code ? (
                            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <Check size={16} className="text-green-300" strokeWidth={3} />
                            </motion.div>
                          ) : (
                            <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <Copy size={16} className="text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.button>

                    <Link
                      href="/m/vendors/marketplace"
                      className="flex items-center justify-center w-12 h-12 bg-white text-gray-900 rounded-xl shadow-lg active:scale-90 transition-transform"
                      aria-label="Shop Now"
                    >
                      <ArrowRight size={20} strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Spacer to allow last item to be fully visible/centered if needed */}
          <div className="w-1 shrink-0" />
        </div>
      </div>

      {/* Pagination Indicators */}
      {banners.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {banners.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                if (typeof window !== "undefined" && "vibrate" in navigator) {
                  navigator.vibrate(10);
                }
                setActiveIndex(idx);
              }}
              className="h-1.5 rounded-full transition-colors duration-300"
              animate={{
                width: idx === activeIndex ? 24 : 6,
                backgroundColor: idx === activeIndex ? theme.primary : "#e5e7eb",
                opacity: idx === activeIndex ? 1 : 0.5,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
