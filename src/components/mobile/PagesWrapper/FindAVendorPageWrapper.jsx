"use client";

import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Star,
  Heart,
  MapPin,
  ShoppingBag,
  Plus,
  Check,
  Sparkles,
  TrendingUp,
  Camera,
  Palette,
  Calendar,
  Zap,
  ArrowRight,
  Clock,
  Music,
  Utensils,
  Home,
} from "lucide-react";
import { useCartStore } from "../../../GlobalState/CartDataStore";
import Link from "next/link";
import SmartMedia from "../SmartMediaLoader";

// =============================================================================
// DATA
// =============================================================================

const HERO_CATEGORIES = [
  {
    id: 1,
    name: "Makeup Artists",
    key: "makeup",
    image: "/quickServicesPhotos/makeupQS.png",
    count: "456",
  },
  {
    id: 2,
    name: "Planners",
    key: "planners",
    image: "/quickServicesPhotos/plannerQS.png",
    count: "145",
  },
  {
    id: 3,
    name: "Decorators",
    key: "decor",
    image: "/quickServicesPhotos/decorQS.png",
    count: "267",
  },
  {
    id: 4,
    name: "Photographers",
    key: "photographers",
    image: "/quickServicesPhotos/photographerQS.png",
    count: "198",
  },
  {
    id: 5,
    name: "Venues",
    key: "venues",
    image: "/quickServicesPhotos/venueQS.png",
    count: "476",
  },
  {
    id: 6,
    name: "Mehendi",
    key: "mehendi",
    image: "/quickServicesPhotos/mehndiQS.png",
    count: "156",
  },
  {
    id: 7,
    name: "Caterers",
    key: "catering",
    image: "/quickServicesPhotos/caterorQS.png",
    count: "189",
  },
  {
    id: 8,
    name: "DJ & Music",
    key: "djs",
    image: "/quickServicesPhotos/djQS.png",
    count: "97",
  },
  {
    id: 9,
    name: "Florists",
    key: "florists",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=500&fit=crop",
    count: "0",
  },
  {
    id: 10,
    name: "Choreographers",
    key: "choreographers",
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=500&fit=crop",
    count: "0",
  },
];

// =============================================================================
// THEME
// =============================================================================

const THEME = {
  primary: "#6366f1",
  primaryDark: "#4f46e5",
  secondary: "#ec4899",
  accent: "#f59e0b",
  success: "#10b981",
  text: "#0f172a",
  textSecondary: "#64748b",
  textMuted: "#94a3b8",
  border: "#e2e8f0",
  background: "#ffffff",
  backgroundAlt: "#f8fafc",
};

// =============================================================================
// HELPER HOOKS
// =============================================================================

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50 };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

// =============================================================================
// HERO CAROUSEL - Matching Image Design with Functional Progress Bar
// =============================================================================

const HeroCarousel = memo(() => {
  const scrollRef = useRef(null);
  const haptic = useHapticFeedback();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate items per page based on visible area (approximately 3 items visible)
  const itemsPerPage = 3;
  const totalPages = Math.ceil(HERO_CATEGORIES.length / itemsPerPage);

  const handleCategoryClick = (item) => {
    if (isDragging) return;
    haptic("medium");
    router.push(`/m/vendors/marketplace/${item?.key}`);
  };

  // Track scroll position and update current page
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const scrollProgress = scrollLeft / maxScroll;
    const newPage = Math.round(scrollProgress * (totalPages - 1));

    setCurrentPage(Math.min(Math.max(newPage, 0), totalPages - 1));
  }, [totalPages]);

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll, { passive: true });
      return () => ref.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Scroll to specific page when clicking progress indicator
  const scrollToPage = (pageIndex) => {
    if (!scrollRef.current) return;
    haptic("light");

    const { scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const targetScroll = (pageIndex / (totalPages - 1)) * maxScroll;

    scrollRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-6 bg-blue-100/25 rounded-4xl py-3">
      {/* Section Title */}
      <h2 className="text-lg font-bold text-gray-900 px-4 mb-4">Vendor categories</h2>

      {/* Two Row Grid - Horizontal Scroll */}
      <motion.div
        ref={scrollRef}
        className="grid grid-rows-2 grid-flow-col gap-3 gap-x-8 overflow-x-auto px-4 pb-2 no-scrollbar"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseDown={() => setIsDragging(false)}
        onMouseMove={(e) => {
          if (e.buttons === 1) setIsDragging(true);
        }}
        onMouseUp={() => setTimeout(() => setIsDragging(false), 100)}
      >
        {HERO_CATEGORIES.map((item, index) => (
          <motion.div
            key={item.id}
            onClick={() => handleCategoryClick(item)}
            className="flex flex-col cursor-pointer group"
            style={{ width: "110px" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.05,
              duration: 0.3,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Image Card */}
            <div className="relative w-full h-32 rounded-xl overflow-hidden bg-transparent mb-2 shadow-sm">
              <SmartMedia
                src={item.image}
                alt={item.name}
                type="image"
                className="w-full h-full object-cover"
                prioirity={true}
              />
            </div>

            {/* Category Name */}
            <h3 className="text-xs font-semibold text-gray-900 leading-tight truncate">{item.name}</h3>

            {/* Count with Arrow */}
            <div className="flex items-center gap-0.5 mt-0.5">
              <span className="text-[11px] text-rose-500 font-medium">{item.count}</span>
              <ChevronRight size={10} className="text-rose-500" />
            </div>
          </motion.div>
        ))}

        {/* Right Spacer */}
        <div className="w-4 flex-shrink-0" />
      </motion.div>

      {/* Functional Progress Bar Indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {Array.from({ length: totalPages }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => scrollToPage(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentPage === index ? "bg-gray-400" : "bg-gray-200 hover:bg-gray-300"
            }`}
            animate={{
              width: currentPage === index ? 24 : 6,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
});

HeroCarousel.displayName = "HeroCarousel";

// =============================================================================
// VENDOR CARD - Compact Design
// =============================================================================

const VendorCardSkeleton = memo(() => (
  <div className="flex-shrink-0 w-44 bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
    {/* 1. Image Area - Darker base */}
    <div className="h-28 bg-gray-200 animate-glass-shimmer" />

    <div className="p-3 space-y-3">
      {/* 2. Title and Verified Badge */}
      <div className="flex justify-between items-start">
        <div className="h-3.5 w-3/4 rounded-full bg-gray-200 animate-glass-shimmer" />
        <div className="h-3.5 w-3.5 rounded-full bg-gray-100 animate-glass-shimmer" />
      </div>

      {/* 3. Category & Rating - Lighter base */}
      <div className="space-y-2">
        <div className="h-2 w-1/2 rounded-full bg-gray-100 animate-glass-shimmer" />
        <div className="h-2 w-1/3 rounded-full bg-gray-50 animate-glass-shimmer" />
      </div>

      {/* 4. Price & CTA Section - Soft Border Top */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-50">
        <div className="space-y-1">
          <div className="h-3 w-10 rounded-full bg-gray-200 animate-glass-shimmer" />
          <div className="h-2 w-6 rounded-full bg-gray-50 animate-glass-shimmer" />
        </div>
        <div className="h-7 w-12 rounded-lg bg-gray-200 animate-glass-shimmer" />
      </div>
    </div>
  </div>
));

const VendorCard = memo(({ vendor }) => {
  const { addToCart, removeFromCart, cartItems } = useCartStore();
  const haptic = useHapticFeedback();
  const router = useRouter();

  if (!vendor || !vendor._id) {
    return null;
  }

  const vendorId = vendor._id || vendor.id;

  const inCart = useMemo(
    () => cartItems?.some((item) => (item._id || item.id) === vendorId) || false,
    [cartItems, vendorId]
  );

  const handleCart = (e) => {
    e.stopPropagation();
    haptic("medium");

    if (inCart) {
      removeFromCart(vendorId);
    } else {
      const cartItem = {
        _id: vendorId,
        id: vendorId,
        name: vendor.name || "Unknown Vendor",
        category: vendor.category || "Vendor",
        price: vendor.perDayPrice?.min || (typeof vendor.basePrice === "number" ? vendor.basePrice : 0),
        image: vendor.defaultImage || vendor?.images?.[0] || "",
        quantity: 1,
        address: vendor.address || "",
        rating: vendor.rating || 0,
        reviews: vendor.reviews || 0,
        verified: vendor.verified || false,
      };
      addToCart(cartItem);
    }
  };

  // ✅ ADD: Navigation handler
  const handleCardClick = () => {
    haptic("light");
    const categorySlug = vendor.category?.toLowerCase().replace(/\s+/g, "-") || "vendor";
    router.push(`/m/vendor/${categorySlug}/${vendorId}`);
  };

  const displayPrice = useMemo(() => {
    if (vendor.perDayPrice?.min) {
      return `₹${vendor.perDayPrice.min.toLocaleString()}`;
    }
    if (typeof vendor.price === "number") {
      return `₹${vendor.price.toLocaleString()}`;
    }
    if (typeof vendor.price === "string" && vendor.price.trim()) {
      return vendor.price;
    }
    return "Contact";
  }, [vendor.perDayPrice, vendor.price]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleCardClick}
      className="flex-shrink-0 w-44 bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 snap-center group"
    >
      {/* Image */}
      <div className="relative h-28 bg-gray-100 overflow-hidden">
        <SmartMedia
          src={vendor?.defaultImage || vendor.images[0] || vendor.images?.[1] || ""}
          type="image"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />

        {/* Badge */}
        {vendor?.tags?.length > 0 && (
          <span
            className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded text-white"
            style={{ backgroundColor: vendor.badgeColor || THEME.accent }}
          >
            {vendor.tags[0]}
          </span>
        )}

        {/* Discount Tag */}
        {vendor?.perDayPrice?.max && vendor?.perDayPrice?.min && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-green-500 rounded">
            <span className="text-[9px] font-bold text-white">
              {Math.round(((vendor.perDayPrice.max - vendor.perDayPrice.min) / vendor.perDayPrice.max) * 100)}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5">
        {/* Name & Verified */}
        <div className="flex items-start justify-between gap-1 mb-0.5">
          <h3 className="text-xs font-bold text-gray-900 truncate flex-1 leading-tight">{vendor.name}</h3>
          {vendor.verified && (
            <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Check size={8} className="text-white" strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Category */}
        <p className="text-[10px] text-gray-500 mb-1.5">{vendor?.category}</p>

        {/* Rating & Location */}
        {(vendor.rating || vendor.reviews) && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-bold text-gray-700">{vendor.rating || "0"}</span>
              <span className="text-[9px] text-gray-400">({vendor.reviews || 0})</span>
            </div>
          </div>
        )}

        {/* Response Time */}
        {vendor?.responseTime && (
          <div className="flex items-center gap-1 mb-2 text-gray-400">
            <Clock size={9} />
            <span className="text-[9px]">Responds in {vendor.responseTime}</span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-sm font-bold text-gray-900">{displayPrice}</span>
          </div>
          <button
            onClick={handleCart}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all active:scale-90 ${
              inCart ? "bg-green-500 text-white" : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {inCart ? (
              <>
                <Check size={10} /> Added
              </>
            ) : (
              <>
                <Plus size={10} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

VendorCard.displayName = "VendorCard";

// =============================================================================
// VIEW MORE CARD - Compact
// =============================================================================

const ViewMoreCard = memo(({ title, count, icon: Icon, color, viewMoreurl }) => {
  const haptic = useHapticFeedback();
  const router = useRouter();

  return (
    <div
      onClick={() => {
        haptic("medium");
        router.push(viewMoreurl);
      }}
      className="flex-shrink-0 w-44 h-full rounded-xl overflow-hidden border-2 border-dashed border-gray-200 snap-center cursor-pointer transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] flex flex-col items-center justify-center min-h-[260px] group"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <p className="text-xs font-bold text-gray-700 mb-0.5">View All</p>
      <p className="text-[10px] text-gray-500 mb-3">
        {count}+ {title}
      </p>
      <div
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all group-hover:shadow-md"
        style={{ backgroundColor: color }}
      >
        Explore
        <ArrowRight size={12} />
      </div>
    </div>
  );
});

ViewMoreCard.displayName = "ViewMoreCard";

// =============================================================================
// SECTION HEADER
// =============================================================================

const SectionHeader = memo(({ title, subtitle, icon: Icon, color, onViewAll }) => {
  const haptic = useHapticFeedback();

  return (
    <div className="flex items-center justify-between px-4 mb-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
          <p className="text-[10px] text-gray-500">{subtitle}</p>
        </div>
      </div>
      {/* View All Button */}
      {onViewAll && (
        <button
          onClick={() => {
            haptic("light");
            onViewAll();
          }}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-50 active:scale-95 transition-all"
        >
          <span className="text-xs font-semibold" style={{ color }}>
            View All
          </span>
          <ArrowRight size={14} style={{ color }} />
        </button>
      )}
    </div>
  );
});

SectionHeader.displayName = "SectionHeader";

// =============================================================================
// VENDOR CAROUSEL - Adjusted Spacing
// =============================================================================

export const VendorCarousel = memo(({ title, subtitle, vendors, icon: Icon, color, isLoading }) => {
  const haptic = useHapticFeedback();
  const router = useRouter();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    const newLeft = scrollLeft > 5;
    const newRight = scrollLeft < scrollWidth - clientWidth - 5;

    setCanScrollLeft((prev) => (prev !== newLeft ? newLeft : prev));
    setCanScrollRight((prev) => (prev !== newRight ? newRight : prev));
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);

    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("resize", checkScroll);
      if (ref) {
        ref.removeEventListener("scroll", checkScroll);
      }
    };
  }, [checkScroll]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -188 : 188;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const viewMoreUrl = useMemo(() => {
    const baseUrl = "/m/vendors/marketplace";
    const params = new URLSearchParams();

    // Determine section type and add appropriate filters
    if (title.includes("Featured")) {
      params.set("featured", "true");
      params.set("sortBy", "rating");
    } else if (title.includes("Popular") || title.includes("Most Booked")) {
      params.set("sortBy", "bookings");
      params.set("sortOrder", "desc");
    } else if (title.includes("Trending")) {
      params.set("sortBy", "views");
      params.set("sortOrder", "desc");
    } else if (title.includes("Top Rated")) {
      params.set("sortBy", "rating");
      params.set("minRating", "4");
    } else if (title.includes("New") || title.includes("Recently Added")) {
      params.set("sortBy", "newest");
      params.set("sortOrder", "desc");
    } else if (title.includes("Planners")) {
      // Handle "Top Event Planners" or "Top Wedding Planners"
      params.set("categories", "planners");
      params.set("sortBy", "rating");
      params.set("sortOrder", "desc");
    } else if (title.includes("Photographers")) {
      params.set("categories", "photographers");
      params.set("sortBy", "rating");
    } else if (title.includes("Makeup")) {
      params.set("categories", "makeup");
      params.set("sortBy", "rating");
    }

    // Add category filter if vendors have a consistent category (and not already set)
    if (vendors?.[0]?.category && !params.has("categories")) {
      params.set("categories", vendors[0].category);
    }

    // Build final URL
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }, [vendors, title]);

  return (
    <section className="py-4 bg-white mb-1">
      {/* Header */}
      <SectionHeader
        title={title}
        subtitle={subtitle}
        icon={Icon}
        color={color}
        onViewAll={() => router.push(viewMoreUrl)}
      />

      {/* Scroll Indicators */}
      <div className="relative">
        {/* Left Scroll Button */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10"
            >
              <button
                onClick={() => {
                  scroll("left");
                  haptic("light");
                }}
                className="w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl active:scale-90 transition-all"
              >
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Scroll Button */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10"
            >
              <button
                onClick={() => {
                  scroll("right");
                  haptic("light");
                }}
                className="w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl active:scale-90 transition-all"
              >
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {isLoading ? (
            // Show 4 skeleton cards while loading
            [...Array(4)].map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0 }}
              >
                <VendorCardSkeleton />
              </motion.div>
            ))
          ) : vendors.length === 0 ? (
            // ✅ ADD: Empty state when no vendors
            <div className="flex-shrink-0 w-44 h-[260px] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-4">
              <Icon size={32} className="text-gray-300 mb-2" style={{ color }} />
              <p className="text-xs font-medium text-gray-400">No vendors found</p>
            </div>
          ) : (
            <>
              {vendors.map((vendor, index) => (
                <motion.div
                  key={vendor._id || vendor?.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <VendorCard vendor={vendor} />
                </motion.div>
              ))}

              {/* Only show View More if there are vendors */}
              {vendors.length > 0 && (
                <ViewMoreCard
                  title={title.split(" ").pop()}
                  count={vendors.length * 10}
                  icon={Icon}
                  color={color}
                  viewMoreurl={viewMoreUrl}
                />
              )}
            </>
          )}

          {/* Spacer */}
          <div className="w-1 flex-shrink-0" />
        </div>
      </div>
    </section>
  );
});

VendorCarousel.displayName = "VendorCarousel";

// =============================================================================
// FLOATING CART
// =============================================================================

const FloatingCart = memo(({ setOpenCartNavbar }) => {
  const router = useRouter();
  const haptic = useHapticFeedback();
  const { cartItems, getCartCount } = useCartStore();
  const count = getCartCount?.() || cartItems?.length || 0;

  const total = useMemo(() => {
    return (
      cartItems?.reduce((sum, item) => {
        const price =
          typeof item.price === "number" ? item.price : parseInt(String(item.price || "0").replace(/[^0-9]/g, "")) || 0;
        return sum + price * (item.quantity || 1);
      }, 0) || 0
    );
  }, [cartItems]);

  if (count === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 left-4 right-4 z-50"
    >
      <button
        onClick={() => {
          haptic("medium");
          setOpenCartNavbar("open");
        }}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl shadow-xl active:scale-[0.98] transition-all bg-gradient-to-r from-indigo-600 to-purple-600"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center bg-amber-400 text-gray-900">
              {count}
            </span>
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-white">
              {count} vendor{count > 1 ? "s" : ""} selected
            </p>
            <p className="text-[10px] text-white/70">Total: ₹{total.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white">
          <span className="text-xs font-bold text-indigo-600">View Cart</span>
          <ArrowRight size={14} className="text-indigo-600" />
        </div>
      </button>
    </motion.div>
  );
});

FloatingCart.displayName = "FloatingCart";

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function FindAVendorPageWrapper() {
  const router = useRouter();
  const haptic = useHapticFeedback();
  const { cartItems, getCartCount, setOpenCartNavbar } = useCartStore();
  const count = getCartCount?.() || cartItems?.length || 0;

  // State for all sections
  const [featuredVendors, setFeaturedVendors] = useState([]);
  const [topPlanners, setTopPlanners] = useState([]);
  const [mostBooked, setMostBooked] = useState([]);
  const [topPhotographers, setTopPhotographers] = useState([]);
  const [topMakeup, setTopMakeup] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topDJs, setTopDJs] = useState([]);
  const [topCatering, setTopCatering] = useState([]);
  const [topMehendi, setTopMehendi] = useState([]);
  const [topVenues, setTopVenues] = useState([]);

  // Loading states
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingPlanners, setIsLoadingPlanners] = useState(true);
  const [isLoadingBooked, setIsLoadingBooked] = useState(true);
  const [isLoadingPhotographers, setIsLoadingPhotographers] = useState(true);
  const [isLoadingMakeup, setIsLoadingMakeup] = useState(true);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [isLoadingDJs, setIsLoadingDJs] = useState(true);
  const [isLoadingCatering, setIsLoadingCatering] = useState(true);
  const [isLoadingMehendi, setIsLoadingMehendi] = useState(true);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);

  // Helper to filter valid vendors
  const filterValidVendors = (vendors) => {
    return vendors.filter((vendor) => vendor && (vendor._id || vendor.id) && vendor.name);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      // Set all loading states to true immediately
      setIsLoadingFeatured(true);
      setIsLoadingPlanners(true);
      setIsLoadingBooked(true);
      setIsLoadingPhotographers(true);
      setIsLoadingMakeup(true);
      setIsLoadingTrending(true);
      setIsLoadingDJs(true);
      setIsLoadingCatering(true);
      setIsLoadingMehendi(true);
      setIsLoadingVenues(true);

      // Create abort controller for cleanup
      const abortController = new AbortController();
      const { signal } = abortController;

      // Define all fetch promises with error boundaries
      const fetchPromises = [
        // 1. Featured Vendors
        fetch(
          `/api/vendor?${new URLSearchParams({
            featured: "true",
            sortBy: "rating",
            limit: "10",
          }).toString()}`,
          { signal }
        )
          .then((res) => {
            if (!res.ok) throw new Error(`Featured vendors failed: ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (data.success) {
              setFeaturedVendors(filterValidVendors(data.data || []));
            }
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              console.error("Error fetching featured vendors:", err);
              setFeaturedVendors([]);
            }
          })
          .finally(() => setIsLoadingFeatured(false)),

        // 2. Top Planners
        fetch(
          `/api/vendor?${new URLSearchParams({
            categories: "planners",
            sortBy: "rating",
            limit: "10",
          }).toString()}`,
          { signal }
        )
          .then((res) => {
            if (!res.ok) throw new Error(`Planners failed: ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (data.success) {
              setTopPlanners(filterValidVendors(data.data || []));
            }
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              console.error("Error fetching planners:", err);
              setTopPlanners([]);
            }
          })
          .finally(() => setIsLoadingPlanners(false)),

        // 3. Most Booked
        fetch(
          `/api/vendor?${new URLSearchParams({
            sortBy: "bookings",
            limit: "10",
          }).toString()}`,
          { signal }
        )
          .then((res) => {
            if (!res.ok) throw new Error(`Most booked failed: ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (data.success) {
              setMostBooked(filterValidVendors(data.data || []));
            }
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              console.error("Error fetching most booked:", err);
              setMostBooked([]);
            }
          })
          .finally(() => setIsLoadingBooked(false)),

        // 4. Top Photographers
        fetch(
          `/api/vendor?${new URLSearchParams({
            categories: "photographers",
            sortBy: "rating",
            limit: "10",
          }).toString()}`,
          { signal }
        )
          .then((res) => {
            if (!res.ok) throw new Error(`Photographers failed: ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (data.success) {
              setTopPhotographers(filterValidVendors(data.data || []));
            }
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              console.error("Error fetching photographers:", err);
              setTopPhotographers([]);
            }
          })
          .finally(() => setIsLoadingPhotographers(false)),

        // 5. Top Makeup Artists
        fetch(
          `/api/vendor?${new URLSearchParams({
            categories: "makeup",
            sortBy: "rating",
            limit: "10",
          }).toString()}`,
          { signal }
        )
          .then((res) => {
            if (!res.ok) throw new Error(`Makeup artists failed: ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (data.success) {
              setTopMakeup(filterValidVendors(data.data || []));
            }
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              console.error("Error fetching makeup artists:", err);
              setTopMakeup([]);
            }
          })
          .finally(() => setIsLoadingMakeup(false)),

        // 6. Trending Vendors
        fetch(
          `/api/vendor?${new URLSearchParams({
            trending: "true",
            sortBy: "views",
            limit: "10",
          }).toString()}`,
          { signal }
        )
          .then((res) => {
            if (!res.ok) throw new Error(`Trending vendors failed: ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (data.success) {
              setTrending(filterValidVendors(data.data || []));
            }
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              console.error("Error fetching trending vendors:", err);
              setTrending([]);
            }
          })
          .finally(() => setIsLoadingTrending(false)),

        // 7. Top DJs
        fetch(
          `/api/vendor?${new URLSearchParams({
            categories: "djs",
            sortBy: "rating",
            limit: "10",
          }).toString()}`,
          { signal }
        )
          .then((res) => {
            if (!res.ok) throw new Error(`DJs failed: ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (data.success) {
              setTopDJs(filterValidVendors(data.data || []));
            }
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              console.error("Error fetching DJs:", err);
              setTopDJs([]);
            }
          })
          .finally(() => setIsLoadingDJs(false)),

        // 8. Top Catering
        fetch(
          `/api/vendor?${new URLSearchParams({
            categories: "catering",
            sortBy: "rating",
            limit: "10",
          }).toString()}`,
          { signal }
        )
          .then((res) => {
            if (!res.ok) throw new Error(`Catering failed: ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (data.success) {
              setTopCatering(filterValidVendors(data.data || []));
            }
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              console.error("Error fetching catering:", err);
              setTopCatering([]);
            }
          })
          .finally(() => setIsLoadingCatering(false)),

        // 9. Top Mehendi Artists
        fetch(
          `/api/vendor?${new URLSearchParams({
            categories: "mehendi",
            sortBy: "rating",
            limit: "10",
          }).toString()}`,
          { signal }
        )
          .then((res) => {
            if (!res.ok) throw new Error(`Mehendi failed: ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (data.success) {
              setTopMehendi(filterValidVendors(data.data || []));
            }
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              console.error("Error fetching mehendi:", err);
              setTopMehendi([]);
            }
          })
          .finally(() => setIsLoadingMehendi(false)),

        // 10. Top Venues
        fetch(
          `/api/vendor?${new URLSearchParams({
            categories: "venues",
            sortBy: "rating",
            limit: "10",
          }).toString()}`,
          { signal }
        )
          .then((res) => {
            if (!res.ok) throw new Error(`Venues failed: ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (data.success) {
              setTopVenues(filterValidVendors(data.data || []));
            }
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              console.error("Error fetching venues:", err);
              setTopVenues([]);
            }
          })
          .finally(() => setIsLoadingVenues(false)),
      ];

      // Execute all fetches in parallel with timeout
      try {
        await Promise.race([
          Promise.allSettled(fetchPromises),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 30000)),
        ]);
      } catch (error) {
        console.error("Critical error in data fetching:", error);
        // Ensure all loading states are false even on timeout
        setIsLoadingFeatured(false);
        setIsLoadingPlanners(false);
        setIsLoadingBooked(false);
        setIsLoadingPhotographers(false);
        setIsLoadingMakeup(false);
        setIsLoadingTrending(false);
        setIsLoadingDJs(false);
        setIsLoadingCatering(false);
        setIsLoadingMehendi(false);
        setIsLoadingVenues(false);
      }

      // Cleanup function
      return () => {
        abortController.abort();
      };
    };

    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                haptic("light");
                router.back();
              }}
              className="w-10 h-10 -ml-1 rounded-xl flex items-center justify-center hover:bg-gray-100 active:scale-90 transition-all"
            >
              <ArrowLeft size={22} className="text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Find Vendors</h1>
          </div>

          <Link
            href={`/m/vendors/marketplace`}
            onClick={() => {
              haptic("light");
            }}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 active:scale-90 transition-all"
          >
            <ShoppingBag size={22} className="text-gray-700" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center bg-rose-500 text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-14" />

      {/* Content */}
      <div className="pt-4 pb-4">
        {/* Hero Carousel - Category Grid */}
        <HeroCarousel />

        {/* Vendor Sections */}
        <VendorCarousel
          title="Featured Vendors"
          subtitle="Handpicked by our experts"
          vendors={featuredVendors}
          icon={Sparkles}
          color="#f59e0b"
          isLoading={isLoadingFeatured}
        />

        <VendorCarousel
          title="Top Wedding Planners"
          subtitle="Make your dream wedding happen"
          vendors={topPlanners}
          icon={Calendar}
          color="#8b5cf6"
          isLoading={isLoadingPlanners}
        />

        <VendorCarousel
          title="Most Booked"
          subtitle="Popular this wedding season"
          vendors={mostBooked}
          icon={TrendingUp}
          color="#10b981"
          isLoading={isLoadingBooked}
        />

        <VendorCarousel
          title="Top Photographers"
          subtitle="Capture every beautiful moment"
          vendors={topPhotographers}
          icon={Camera}
          color="#3b82f6"
          isLoading={isLoadingPhotographers}
        />

        <VendorCarousel
          title="Top DJs & Music"
          subtitle="Set the perfect mood"
          vendors={topDJs}
          icon={Music}
          color="#a855f7"
          isLoading={isLoadingDJs}
        />

        <VendorCarousel
          title="Best Catering Services"
          subtitle="Delicious food for every palate"
          vendors={topCatering}
          icon={Utensils}
          color="#14b8a6"
          isLoading={isLoadingCatering}
        />

        <VendorCarousel
          title="Mehendi Artists"
          subtitle="Beautiful traditional designs"
          vendors={topMehendi}
          icon={Sparkles}
          color="#d946ef"
          isLoading={isLoadingMehendi}
        />

        <VendorCarousel
          title="Premium Venues"
          subtitle="Perfect spaces for your celebration"
          vendors={topVenues}
          icon={Home}
          color="#0ea5e9"
          isLoading={isLoadingVenues}
        />

        <VendorCarousel
          title="Makeup Artists"
          subtitle="Look your absolute best"
          vendors={topMakeup}
          icon={Palette}
          color="#ec4899"
          isLoading={isLoadingMakeup}
        />

        <VendorCarousel
          title="Trending Now"
          subtitle="What's hot right now"
          vendors={trending}
          icon={Zap}
          color="#f97316"
          isLoading={isLoadingTrending}
        />
      </div>

      {/* Floating Cart */}
      <AnimatePresence>
        <FloatingCart setOpenCartNavbar={setOpenCartNavbar} />
      </AnimatePresence>

      {/* Global Styles */}
      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        * {
          -webkit-tap-highlight-color: transparent;
        }

        @keyframes glass-shimmer {
          0% {
            background-position: -400px 0;
          }
          100% {
            background-position: 400px 0;
          }
        }

        .animate-glass-shimmer {
          background: linear-gradient(
            90deg,
            rgba(243, 244, 246, 1) 0%,
            rgba(229, 231, 235, 1) 50%,
            rgba(243, 244, 246, 1) 100%
          );
          background-size: 800px 100%;
          animation: glass-shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
