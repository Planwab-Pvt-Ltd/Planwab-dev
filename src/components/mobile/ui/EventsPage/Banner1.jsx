"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Gift, Percent, Clock, Copy, Check } from "lucide-react";
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

export default function Banner1({ theme, category }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);

  const banners = BANNER_DATA[category] || BANNER_DATA.wedding;

  // Auto-scroll
  useEffect(() => {
    if (isPaused) return;

    autoScrollRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [banners.length, isPaused]);

  // Scroll to active index
  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const scrollPerItem = banners.length > 1 ? (scrollWidth - clientWidth) / (banners.length - 1) : 0;
      scrollRef.current.scrollTo({
        left: activeIndex * scrollPerItem,
        behavior: "smooth",
      });
    }
  }, [activeIndex, banners.length]);

  const handleScroll = useCallback(
    (e) => {
      const scrollLeft = e.target.scrollLeft;
      const scrollWidth = e.target.scrollWidth;
      const clientWidth = e.target.clientWidth;
      const scrollPerItem = banners.length > 1 ? (scrollWidth - clientWidth) / (banners.length - 1) : 1;
      const newIndex = Math.round(scrollLeft / scrollPerItem);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < banners.length) {
        setActiveIndex(newIndex);
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
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
    setActiveIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const goToNext = useCallback(() => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
    setActiveIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  return (
    <section className="py-6 px-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-5 mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${theme.primary}15` }}
          >
            <Gift size={18} style={{ color: theme.primary }} />
          </motion.div>
          <h2 className="text-lg font-bold text-gray-900">Special Offers</h2>
        </div>
        <Link
          href="/m/offers"
          className="text-sm font-semibold flex items-center gap-1"
          style={{ color: theme.primary }}
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      {/* Banner Carousel */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {banners.map((banner, idx) => {
            const IconComponent = banner.icon;
            return (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="relative min-w-[85%] sm:min-w-[80%] aspect-[2/1] rounded-3xl overflow-hidden snap-start shadow-lg"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} opacity-85`} />
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.1, 0.15] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                </div>

                {/* Content */}
                <div className="relative h-full p-5 flex flex-col justify-between text-white">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <IconComponent size={16} />
                      </div>
                      <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                        <Clock size={10} /> {banner.validUntil}
                      </span>
                    </div>
                    <h3 className="text-xl font-black leading-tight mb-1">{banner.title}</h3>
                    <p className="text-sm text-white/90">{banner.subtitle}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => copyCode(banner.code, e)}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold"
                    >
                      <span className="font-mono tracking-wider">{banner.code}</span>
                      <AnimatePresence mode="wait">
                        {copiedCode === banner.code ? (
                          <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Check size={14} className="text-green-300" />
                          </motion.div>
                        ) : (
                          <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Copy size={14} className="opacity-70" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <Link
                      href="/m/vendors/marketplace"
                      className="flex items-center gap-1 bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-transform"
                    >
                      Shop Now <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center z-10"
            >
              <ChevronLeft size={18} className="text-gray-700" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center z-10"
            >
              <ChevronRight size={18} className="text-gray-700" />
            </motion.button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {banners.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (typeof window !== "undefined" && "vibrate" in navigator) {
                  navigator.vibrate(10);
                }
                setActiveIndex(idx);
              }}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: idx === activeIndex ? 20 : 8,
                backgroundColor: idx === activeIndex ? theme.primary : "#d1d5db",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
