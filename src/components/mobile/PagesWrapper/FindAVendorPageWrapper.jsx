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
} from "lucide-react";
import { useCartStore } from "../../../GlobalState/CartDataStore";
import Link from "next/link";
import SmartMedia from "../SmartMediaLoader";

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
// DATA
// =============================================================================

const HERO_CATEGORIES = [
  {
    id: 1,
    name: "Makeup Artists",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=500&fit=crop",
    count: "25,616",
  },
  {
    id: 2,
    name: "Planners",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop",
    count: "3,598",
  },
  {
    id: 3,
    name: "Decorators",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=500&fit=crop",
    count: "8,234",
  },
  {
    id: 4,
    name: "Photographers",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=500&fit=crop",
    count: "23,443",
  },
  {
    id: 5,
    name: "Venues",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=500&fit=crop",
    count: "50,659",
  },
  {
    id: 6,
    name: "Mehendi",
    image: "https://images.unsplash.com/photo-1595424064782-dce6974d0ad7?w=400&h=500&fit=crop",
    count: "12,456",
  },
  {
    id: 7,
    name: "Caterers",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=500&fit=crop",
    count: "9,876",
  },
  {
    id: 8,
    name: "DJ & Music",
    image: "https://images.unsplash.com/photo-1571266028243-3716f02d9ae3?w=400&h=500&fit=crop",
    count: "5,432",
  },
  {
    id: 9,
    name: "Florists",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=500&fit=crop",
    count: "4,567",
  },
  {
    id: 10,
    name: "Choreographers",
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=500&fit=crop",
    count: "2,345",
  },
];

const FEATURED_VENDORS = [
  {
    id: 101,
    name: "Elite Makeup Studio",
    category: "Makeup Artist",
    rating: 4.9,
    reviews: 234,
    price: "₹15,000",
    originalPrice: "₹20,000",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    badge: "Top Rated",
    badgeColor: "#ef4444",
    verified: true,
    responseTime: "1 hour",
  },
  {
    id: 102,
    name: "Captured Moments",
    category: "Photographer",
    rating: 4.8,
    reviews: 189,
    price: "₹25,000",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=300&fit=crop",
    badge: "Featured",
    badgeColor: "#6366f1",
    verified: true,
    responseTime: "2 hours",
  },
  {
    id: 103,
    name: "Royal Events",
    category: "Planner",
    rating: 4.7,
    reviews: 156,
    price: "₹50,000",
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "30 mins",
  },
  {
    id: 104,
    name: "Dream Decorators",
    category: "Decorator",
    rating: 4.9,
    reviews: 312,
    price: "₹35,000",
    location: "Jaipur",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop",
    badge: "Premium",
    badgeColor: "#f59e0b",
    verified: true,
    responseTime: "1 hour",
  },
  {
    id: 105,
    name: "Shutter Stories",
    category: "Photographer",
    rating: 4.8,
    reviews: 178,
    price: "₹30,000",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop",
    verified: false,
    responseTime: "3 hours",
  },
];

const TOP_PLANNERS = [
  {
    id: 201,
    name: "Eventique India",
    category: "Wedding Planner",
    rating: 4.9,
    reviews: 456,
    price: "₹75,000",
    originalPrice: "₹90,000",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
    badge: "Elite",
    badgeColor: "#8b5cf6",
    verified: true,
    responseTime: "30 mins",
  },
  {
    id: 202,
    name: "Dream Weddings",
    category: "Wedding Planner",
    rating: 4.8,
    reviews: 289,
    price: "₹60,000",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "1 hour",
  },
  {
    id: 203,
    name: "The Big Fat Indian",
    category: "Wedding Planner",
    rating: 4.7,
    reviews: 178,
    price: "₹1,00,000",
    location: "Jaipur",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop",
    badge: "Luxury",
    badgeColor: "#f59e0b",
    verified: true,
    responseTime: "2 hours",
  },
  {
    id: 204,
    name: "Shaadi Squad",
    category: "Wedding Planner",
    rating: 4.6,
    reviews: 234,
    price: "₹45,000",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop",
    verified: false,
    responseTime: "4 hours",
  },
  {
    id: 205,
    name: "Perfect Moments",
    category: "Wedding Planner",
    rating: 4.8,
    reviews: 189,
    price: "₹55,000",
    location: "Chennai",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "1 hour",
  },
];

const MOST_BOOKED = [
  {
    id: 301,
    name: "Divine Clicks",
    category: "Photographer",
    rating: 4.8,
    reviews: 567,
    price: "₹30,000",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=300&fit=crop",
    badge: "Popular",
    badgeColor: "#10b981",
    verified: true,
    responseTime: "1 hour",
  },
  {
    id: 302,
    name: "Glow Goddess",
    category: "Makeup Artist",
    rating: 4.9,
    reviews: 445,
    price: "₹20,000",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "2 hours",
  },
  {
    id: 303,
    name: "Grand Caterers",
    category: "Catering",
    rating: 4.7,
    reviews: 389,
    price: "₹900/plate",
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop",
    badge: "Best Seller",
    badgeColor: "#f97316",
    verified: true,
    responseTime: "30 mins",
  },
  {
    id: 304,
    name: "Royal Decor",
    category: "Decorator",
    rating: 4.8,
    reviews: 278,
    price: "₹50,000",
    location: "Chennai",
    image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400&h=300&fit=crop",
    verified: false,
    responseTime: "3 hours",
  },
  {
    id: 305,
    name: "Candid Crew",
    category: "Photographer",
    rating: 4.9,
    reviews: 356,
    price: "₹35,000",
    location: "Hyderabad",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "1 hour",
  },
];

const TOP_PHOTOGRAPHERS = [
  {
    id: 401,
    name: "Lens Masters",
    category: "Photographer",
    rating: 4.9,
    reviews: 678,
    price: "₹40,000",
    originalPrice: "₹50,000",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=300&fit=crop",
    badge: "Award Winner",
    badgeColor: "#f59e0b",
    verified: true,
    responseTime: "30 mins",
  },
  {
    id: 402,
    name: "Shutter Stories",
    category: "Photographer",
    rating: 4.8,
    reviews: 534,
    price: "₹35,000",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "1 hour",
  },
  {
    id: 403,
    name: "Picture Perfect",
    category: "Photographer",
    rating: 4.7,
    reviews: 412,
    price: "₹28,000",
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=300&fit=crop",
    badge: "Top Choice",
    badgeColor: "#3b82f6",
    verified: true,
    responseTime: "2 hours",
  },
  {
    id: 404,
    name: "Memory Makers",
    category: "Photographer",
    rating: 4.8,
    reviews: 298,
    price: "₹32,000",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "1 hour",
  },
];

const TOP_MAKEUP = [
  {
    id: 601,
    name: "Glamour Studio",
    category: "Bridal Makeup",
    rating: 4.9,
    reviews: 567,
    price: "₹25,000",
    originalPrice: "₹32,000",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    badge: "Celebrity MUA",
    badgeColor: "#ec4899",
    verified: true,
    responseTime: "1 hour",
  },
  {
    id: 602,
    name: "Beauty Bliss",
    category: "Bridal Makeup",
    rating: 4.8,
    reviews: 445,
    price: "₹18,000",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "2 hours",
  },
  {
    id: 603,
    name: "Radiant Looks",
    category: "Bridal Makeup",
    rating: 4.7,
    reviews: 378,
    price: "₹22,000",
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
    badge: "Top Rated",
    badgeColor: "#10b981",
    verified: true,
    responseTime: "1 hour",
  },
  {
    id: 604,
    name: "Bridal Glow",
    category: "Bridal Makeup",
    rating: 4.9,
    reviews: 312,
    price: "₹30,000",
    location: "Hyderabad",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    verified: false,
    responseTime: "3 hours",
  },
];

const TRENDING = [
  {
    id: 501,
    name: "Mehendi Magic",
    category: "Mehendi Artist",
    rating: 4.8,
    reviews: 234,
    price: "₹5,000",
    location: "Ahmedabad",
    image: "https://images.unsplash.com/photo-1595424064782-dce6974d0ad7?w=400&h=300&fit=crop",
    badge: "Trending",
    badgeColor: "#ef4444",
    verified: true,
    responseTime: "1 hour",
  },
  {
    id: 502,
    name: "DJ Beats Pro",
    category: "DJ & Music",
    rating: 4.7,
    reviews: 189,
    price: "₹25,000",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1571266028243-3716f02d9ae3?w=400&h=300&fit=crop",
    verified: true,
    responseTime: "2 hours",
  },
  {
    id: 503,
    name: "Floral Fantasy",
    category: "Florist",
    rating: 4.9,
    reviews: 156,
    price: "₹15,000",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=300&fit=crop",
    badge: "Hot",
    badgeColor: "#f97316",
    verified: true,
    responseTime: "30 mins",
  },
  {
    id: 504,
    name: "Dance Diva",
    category: "Choreographer",
    rating: 4.6,
    reviews: 123,
    price: "₹18,000",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=300&fit=crop",
    verified: false,
    responseTime: "4 hours",
  },
];

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
    router.push(`/vendors/${item.name.toLowerCase().replace(/\s+/g, "-")}`);
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
    <div className="mb-6 bg-blue-100 rounded-2xl py-3">
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
            <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100 mb-2 shadow-sm">
              <motion.img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
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
  const [liked, setLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const haptic = useHapticFeedback();

  const inCart = useMemo(() => cartItems?.some((item) => item.id === vendor.id) || false, [cartItems, vendor.id]);

  const handleCart = (e) => {
    e.stopPropagation();
    haptic("medium");
    inCart ? removeFromCart(vendor.id) : addToCart(vendor);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 w-44 bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 snap-center group"
    >
      {/* Image */}
      <div className="relative h-28 bg-gray-100 overflow-hidden">
        <SmartMedia
          src={vendor?.defaultImage || vendor.images[1]}
          type="image"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />

        {/* Badge */}
        {vendor.tags && (
          <span
            className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded text-white"
            style={{ backgroundColor: vendor.badgeColor || THEME.accent }}
          >
            {vendor.tags[0]}
          </span>
        )}

        {/* Discount Tag */}
        {vendor?.perDayPrice?.max && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-green-500 rounded">
            <span className="text-[9px] font-bold text-white">
              {Math.round(
                ((parseInt(vendor?.budgetRange?.max) - parseInt(vendor?.budgetRange?.min)) /
                  parseInt(vendor?.budgetRange?.max)) *
                  100
              )}
              % OFF
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
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold text-gray-700">{vendor.rating}</span>
            <span className="text-[9px] text-gray-400">({vendor.reviews})</span>
          </div>
        </div>

        {/* Response Time */}
        {vendor.responseTime && (
          <div className="flex items-center gap-1 mb-2 text-gray-400">
            <Clock size={9} />
            <span className="text-[9px]">Responds in {vendor?.responseTime}</span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-sm font-bold text-gray-900">{vendor.price}</span>
            {vendor.originalPrice && (
              <span className="text-[9px] text-gray-400 line-through ml-1">{vendor.originalPrice}</span>
            )}
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

const ViewMoreCard = memo(({ title, count, icon: Icon, color }) => {
  const haptic = useHapticFeedback();
  const router = useRouter();

  return (
    <div
      onClick={() => {
        haptic("medium");
        router.push("/vendors");
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

  return (
    <section className="py-4 bg-white mb-1">
      {/* Header */}
      <SectionHeader
        title={title}
        subtitle={subtitle}
        icon={Icon}
        color={color}
        onViewAll={() => router.push("/vendors")}
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
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <VendorCardSkeleton />
              </motion.div>
            ))
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
                <ViewMoreCard title={title.split(" ").pop()} count={vendors.length * 10} icon={Icon} color={color} />
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
        const price = parseInt(item.price?.replace(/[^0-9]/g, "")) || 0;
        return sum + price;
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
          vendors={FEATURED_VENDORS}
          icon={Sparkles}
          color="#f59e0b"
        />

        <VendorCarousel
          title="Top Wedding Planners"
          subtitle="Make your dream wedding happen"
          vendors={TOP_PLANNERS}
          icon={Calendar}
          color="#8b5cf6"
        />

        <VendorCarousel
          title="Most Booked"
          subtitle="Popular this wedding season"
          vendors={MOST_BOOKED}
          icon={TrendingUp}
          color="#10b981"
        />

        <VendorCarousel
          title="Top Photographers"
          subtitle="Capture every beautiful moment"
          vendors={TOP_PHOTOGRAPHERS}
          icon={Camera}
          color="#3b82f6"
        />

        <VendorCarousel
          title="Makeup Artists"
          subtitle="Look your absolute best"
          vendors={TOP_MAKEUP}
          icon={Palette}
          color="#ec4899"
        />

        <VendorCarousel
          title="Trending Now"
          subtitle="What's hot right now"
          vendors={TRENDING}
          icon={Zap}
          color="#f97316"
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
      `}</style>
    </div>
  );
}
