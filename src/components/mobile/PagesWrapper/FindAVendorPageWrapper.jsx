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
import { formatPrice } from "../../../lib/utils";
import { ScrollCarousel } from "./IdeasPageWrapper";

export const HERO_CATEGORIES = [
  { id: 1, name: "Venues", key: "venues", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567028/VenuesCat_hgj3l0.png", count: "476" },
  { id: 2, name: "Photographers", key: "photographers", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428623/PhotographerCat_ymq0vh.png", count: "198" },
  { id: 3, name: "Makeup", key: "makeup", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428617/MakeUpCat_lcp68d.png", count: "456" },
  { id: 4, name: "Planners", key: "planners", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428626/PlannerCat_p16v2m.png", count: "145" },
  { id: 5, name: "Decorators", key: "decor", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567022/DecoratorsCat_hwpgaf.png", count: "267" },
  { id: 6, name: "Caterers", key: "catering", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428610/CaterorsCat_pch4d5.png", count: "189" },
  { id: 7, name: "Mehendi", key: "mehendi", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428620/MehndiCat_hdsxxo.png", count: "156" },
  // { id: 8, name: "Clothes", key: "clothes", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/HaroCategories/mobile/SareesCat_cyugf6.png", count: "342" },
  // { id: 9, name: "Jewellery", key: "jewellery", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428626/PlannerCat_p16v2m.png", count: "210" },
  { id: 10, name: "Music", key: "djs", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428615/DJCat_hay9fu.png", count: "97" },
  { id: 11, name: "Hairstyling", key: "hairstyling", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567027/HairstylersCat_ggriqx.png", count: "167" },
  { id: 12, name: "Invitations", key: "invitations", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567026/InvitationsCat_twzcbc.png", count: "124" },
  { id: 13, name: "Cakes", key: "cakes", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567022/CakesCat_hlpwqv.png", count: "89" },
  { id: 14, name: "Anchors", key: "anchor", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567022/AnchorsCat_kdv6am.png", count: "88" },
  { id: 15, name: "Dhol", key: "dhol", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428613/DholCat_swqr0p.png", count: "54" },
  { id: 16, name: "Barat", key: "barat", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567023/BaraatCat_dyuqi9.png", count: "67" },
  { id: 17, name: "Fireworks", key: "fireworks", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567023/FireworksCat_pngfbi.png", count: "32" },
  { id: 18, name: "Stage Entry", key: "stageEntry", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428620/MehndiCat_hdsxxo.png", count: "45" }
];

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

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50 };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

const HeroCarousel = memo(({ categoryCounts = {} }) => {
  const scrollRef = useRef(null);
  const haptic = useHapticFeedback();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(HERO_CATEGORIES.length / itemsPerPage);

  const handleCategoryClick = (item) => {
    if (isDragging) return;
    haptic("medium");
    router.push(`/vendors/marketplace/${item?.key}`);
  };

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
      <h2 className="text-lg font-bold text-gray-900 px-4 mb-4">Vendor categories</h2>
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
        {HERO_CATEGORIES.map((item, index) => {
          const dynamicCount = categoryCounts[item.key] || item.count;
          return (
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
              <div className="relative w-full h-32 rounded-xl overflow-hidden bg-transparent mb-2 shadow-sm transition-all duration-300">
                <SmartMedia
                  src={item.image}
                  alt={item.name}
                  type="image"
                  className="w-full h-full object-cover grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110 group-active:grayscale-0 group-active:scale-110"
                  prioirity={true}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="text-white font-black text-sm tracking-wider text-center px-2 drop-shadow-md">
                    {item.name}
                  </span>
                </div>
              </div>
              <h3 className="text-xs font-semibold text-gray-900 leading-tight truncate">{item.name}</h3>
              <div className="flex items-center gap-0.5 mt-0.5">
                <span className="text-[11px] text-rose-500 font-medium">{dynamicCount}</span>
                <ChevronRight size={10} className="text-rose-500" />
              </div>
            </motion.div>
          );
        })}
        <div className="w-4 flex-shrink-0" />
      </motion.div>
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
    [cartItems, vendorId],
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
        image: vendor.defaultImageNew || vendor?.images?.[0] || "",
        quantity: 1,
        address: vendor.address || "",
        rating: vendor.rating || 0,
        reviews: vendor.reviews || 0,
        verified: vendor.verified || false,
      };
      addToCart(cartItem);
    }
  };

  const handleCardClick = () => {
    haptic("light");
    const categorySlug = vendor.category?.toLowerCase().replace(/\s+/g, "-") || "vendor";
    router.push(`/vendor/${categorySlug}/${vendorId}`);
  };

  const displayPrice = useMemo(() => {
    if (vendor.perDayPrice?.min) {
      return `${formatPrice(vendor.perDayPrice.min)}`;
    }
    if (typeof vendor.price === "number") {
      return `${formatPrice(vendor.price)}`;
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
      className="flex-shrink-0 w-44 bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group snap-start"
    >
      <div className="relative h-28 bg-gray-100 overflow-hidden">
        <SmartMedia
          src={vendor?.defaultImageNew || vendor.images[0] || vendor.images?.[1] || ""}
          type="image"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {vendor?.tags?.length > 0 && (
          <span
            className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded text-white"
            style={{ backgroundColor: vendor.badgeColor || THEME.accent }}
          >
            {vendor.tags[0]}
          </span>
        )}
        {vendor?.perDayPrice?.max && vendor?.perDayPrice?.min && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-green-500 rounded">
            <span className="text-[9px] font-bold text-white">
              {Math.round(((vendor.perDayPrice.max - vendor.perDayPrice.min) / vendor.perDayPrice.max) * 100)}% OFF
            </span>
          </div>
        )}
      </div>
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

const ViewMoreCard = memo(({ title, count, icon: Icon, color, viewMoreurl }) => {
  const haptic = useHapticFeedback();
  const router = useRouter();

  return (
    <div
      onClick={() => {
        haptic("medium");
        router.push(viewMoreurl);
      }}
      className="flex-shrink-0 w-44 h-full rounded-xl overflow-hidden border-2 border-dashed border-gray-200 cursor-pointer transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] flex flex-col items-center justify-center min-h-[260px] group snap-start"
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

const SectionHeader = memo(({ title, subtitle, icon: Icon, color, onViewAll }) => {
  const haptic = useHapticFeedback();

  return (
    <div className="flex items-center justify-between px-4 mb-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          {Icon && <Icon className="w-5 h-5" style={{ color: color }} />}
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
          <p className="text-[10px] text-gray-500">{subtitle}</p>
        </div>
      </div>
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

export const VendorCarousel = memo(({ title, subtitle, vendors, icon: Icon, color, isLoading }) => {
  const haptic = useHapticFeedback();
  const router = useRouter();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const ResolvedIcon = useMemo(() => {
    const IconMap = {
      calendar: Calendar,
      zap: Zap,
      heart: Heart,
    };

    if (typeof Icon === "string") {
      return IconMap[Icon.toLowerCase()] || Calendar;
    }

    return Icon || Calendar;
  }, [Icon]);

  const viewMoreUrl = useMemo(() => {
    const baseUrl = "/vendors/marketplace";
    const params = new URLSearchParams();
    const t = title.toLowerCase();

    if (t.includes("featured") || t.includes("handpicked")) {
      params.set("featured", "true");
      params.set("sortBy", "rating");
    } else if (t.includes("venues")) {
      params.set("categories", "venues");
      params.set("sortBy", "price-desc");
    } else if (t.includes("planners")) {
      params.set("categories", "planners");
      params.set("sortBy", "rating");
    } else if (t.includes("photographers")) {
      params.set("categories", "photographers");
      params.set("sortBy", "rating");
      params.set("minRating", "4");
    } else if (t.includes("makeup")) {
      params.set("categories", "makeup");
      params.set("sortBy", "price-desc");
    } else if (t.includes("mehendi")) {
      params.set("categories", "mehendi");
      params.set("sortBy", "rating");
    } else if (t.includes("catering")) {
      params.set("categories", "catering");
      params.set("sortBy", "rating");
    } else if (t.includes("dj") || t.includes("music")) {
      params.set("categories", "djs");
      params.set("sortBy", "rating");
    } else if (t.includes("most booked") || t.includes("popular")) {
      params.set("sortBy", "bookings");
    } else if (t.includes("trending")) {
      params.set("sortBy", "bookings");
    } else if (t.includes("top rated")) {
      params.set("sortBy", "rating");
      params.set("minRating", "4");
    }

    if (vendors?.[0]?.category && !params.has("categories")) {
      params.set("categories", vendors[0].category);
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }, [vendors, title]);

  return (
    <section className="py-4 bg-white mb-1">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        icon={ResolvedIcon}
        color={color}
        onViewAll={() => router.push(viewMoreUrl)}
      />
      <div className="relative">
        <ScrollCarousel>
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <motion.div key={`skeleton-${i}`} initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                <VendorCardSkeleton />
              </motion.div>
            ))
          ) : vendors.length === 0 ? (
            <div className="flex-shrink-0 w-44 h-[260px] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-4 snap-start">
              <ResolvedIcon size={32} className="text-gray-300 mb-2" style={{ color }} />
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
                  className="snap-start"
                >
                  <VendorCard vendor={vendor} />
                </motion.div>
              ))}
              {vendors.length > 0 && (
                <div className="snap-start h-full">
                  <ViewMoreCard
                    title={title.split(" ").pop()}
                    count={vendors.length * 10}
                    icon={ResolvedIcon}
                    color={color}
                    viewMoreurl={viewMoreUrl}
                  />
                </div>
              )}
            </>
          )}
        </ScrollCarousel>
      </div>
    </section>
  );
});

VendorCarousel.displayName = "VendorCarousel";

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
            <p className="text-[10px] text-white/70">Total: ₹{formatPrice(total)}</p>
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

const TrustStrip = memo(() => (
  <div className="bg-white px-4 pb-4 hover:z-10 relative">
    <div className="bg-gradient-to-r from-indigo-50 dark:from-indigo-900/40 border border-slate-200 dark:border-indigo-800/50 to-purple-50 dark:to-purple-900/40 rounded-[28px] p-6 lg:py-8 lg:px-12 flex flex-col items-center gap-6 shadow-xl dark:shadow-none hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all hover:-translate-y-1 duration-500">
      <div className="flex flex-col items-center gap-3 text-center group cursor-default w-full">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-indigo-950/50 shadow-sm flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
          <Check className="text-indigo-500 dark:text-indigo-400" size={20} strokeWidth={3} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-sm tracking-widest uppercase mb-0.5 transition-colors">
            100% Verified
          </h4>
          <p className="text-slate-500 dark:text-indigo-200/70 text-[11px] font-semibold max-w-[170px] mx-auto transition-colors">
            Every vendor is manually checked
          </p>
        </div>
      </div>

      <div className="w-12 h-px bg-indigo-200 dark:bg-indigo-800/50" />

      <div className="flex flex-col items-center gap-3 text-center group cursor-default w-full">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-indigo-950/50 shadow-sm flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
          <Star className="text-amber-500 dark:text-amber-400" size={20} strokeWidth={3} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-sm tracking-widest uppercase mb-0.5 transition-colors">
            Top Rated
          </h4>
          <p className="text-slate-500 dark:text-indigo-200/70 text-[11px] font-semibold max-w-[170px] mx-auto transition-colors">
            Only the best in the industry
          </p>
        </div>
      </div>

      <div className="w-12 h-px bg-indigo-200 dark:bg-indigo-800/50" />

      <div className="flex flex-col items-center gap-3 text-center group cursor-default w-full">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-indigo-950/50 shadow-sm flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
          <Heart className="text-rose-500 dark:text-rose-400" size={20} strokeWidth={3} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-sm tracking-widest uppercase mb-0.5 transition-colors">
            Loved by Couples
          </h4>
          <p className="text-slate-500 dark:text-indigo-200/70 text-[11px] font-semibold max-w-[170px] mx-auto transition-colors">
            10,000+ happy weddings planned
          </p>
        </div>
      </div>
    </div>
  </div>
));

const ConciergeStrip = memo(() => (
  <div className="bg-white px-4 pb-4 hover:z-10 relative">
    <div className="bg-gradient-to-r from-indigo-50 dark:from-indigo-900/40 border border-slate-200 dark:border-indigo-800/50 to-purple-50 dark:to-purple-900/40 rounded-[28px] p-6 lg:py-8 lg:px-12 flex flex-col items-center text-center gap-6 shadow-xl dark:shadow-none hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all hover:-translate-y-1 duration-500">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white dark:bg-indigo-950/50 shadow-sm flex items-center justify-center -rotate-12 hover:rotate-0 transition-transform duration-500">
          <Sparkles className="text-indigo-500 dark:text-indigo-400" size={26} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-lg tracking-tight mb-2 transition-colors">
            Overwhelmed with choices?
          </h4>
          <p className="text-slate-500 dark:text-indigo-200/70 text-xs font-semibold px-2 transition-colors">
            Our expert concierge is available 24/7 to help you structure your dream event.
          </p>
        </div>
      </div>
      <button
        className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white px-6 py-3.5 rounded-2xl font-black text-[11px] tracking-widest transition-all active:scale-95 shadow-md dark:shadow-none whitespace-nowrap w-full cursor-pointer"
        onClick={() => {
          try {
            toast.success("Our team will contact you soon!");
          } catch (e) {
            alert("Our team will contact you soon!");
          }
        }}
      >
        GET FREE EXPERT HELP
      </button>
    </div>
  </div>
));

const PromoStrip = memo(() => (
  <div className="bg-white px-4 pb-4 hover:z-10 relative">
    <div className="bg-gradient-to-r from-indigo-50 dark:from-indigo-900/40 border border-slate-200 dark:border-indigo-800/50 to-purple-50 dark:to-purple-900/40 rounded-[28px] p-6 lg:py-8 lg:px-12 flex flex-col items-center text-center gap-6 shadow-xl dark:shadow-none hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all hover:-translate-y-1 duration-500">
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="w-14 h-14 shrink-0 rounded-full bg-white dark:bg-indigo-950/50 shadow-sm flex items-center justify-center -rotate-12 hover:rotate-0 transition-transform duration-500">
          <Zap className="text-indigo-500 dark:text-indigo-400" size={26} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-lg tracking-tight mb-2 flex flex-col items-center gap-2 transition-colors">
            Wedding Season Offer
            <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] uppercase tracking-widest leading-none w-max mt-1">
              Limited Time
            </span>
          </h4>
          <p className="text-slate-500 dark:text-indigo-200/70 text-xs font-semibold px-2 transition-colors">
            Save 25% on your first booking using the code below.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center shrink-0 w-full mt-2">
        <button
          className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white w-full py-4 rounded-2xl font-black text-base tracking-widest transition-all active:scale-95 shadow-md dark:shadow-none cursor-pointer"
          onClick={() => {
            navigator.clipboard?.writeText("PLANWAB25");
            try {
              toast.success("Code copied!");
            } catch (e) {
              alert("Code copied!");
            }
          }}
        >
          PLANWAB25
        </button>
        <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-2.5 transition-colors">
          Click to copy
        </span>
      </div>
    </div>
  </div>
));

export default function FindAVendorPageWrapper() {
  const router = useRouter();
  const haptic = useHapticFeedback();
  const { cartItems, getCartCount, setOpenCartNavbar } = useCartStore();
  const count = getCartCount?.() || cartItems?.length || 0;

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
  const [categoryCounts, setCategoryCounts] = useState({});

  const filterValidVendors = (vendors) => {
    return vendors.filter((vendor) => vendor && (vendor._id || vendor.id) && vendor.name);
  };

  useEffect(() => {
    const fetchAllData = async () => {
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

      const abortController = new AbortController();
      const { signal } = abortController;

      const handleData = (data, categoryKey, setVendorsCallback) => {
        if (data.success) {
          setVendorsCallback(filterValidVendors(data.data || []));
          if (categoryKey) {
            setCategoryCounts(prev => ({
              ...prev, 
              [categoryKey]: data.pagination?.total || data.total || 0
            }));
          }
        }
      };

     const fetchPromises = [
        fetch(`/api/vendor?${new URLSearchParams({ featured: "true", sortBy: "rating", limit: "10" }).toString()}`, { signal })
          .then(res => res.json())
          .then(data => handleData(data, null, setFeaturedVendors))
          .finally(() => setIsLoadingFeatured(false)),

        fetch(`/api/vendor?${new URLSearchParams({ categories: "planners", sortBy: "rating", limit: "10" }).toString()}`, { signal })
          .then(res => res.json())
          .then(data => handleData(data, "planners", setTopPlanners))
          .finally(() => setIsLoadingPlanners(false)),

        // Most booked (generic, don't tie to a specific hero category)
        fetch(`/api/vendor?${new URLSearchParams({ sortBy: "bookings", limit: "10" }).toString()}`, { signal })
          .then(res => res.json())
          .then(data => handleData(data, null, setMostBooked))
          .finally(() => setIsLoadingBooked(false)),

        fetch(`/api/vendor?${new URLSearchParams({ categories: "photographers", sortBy: "rating", limit: "10" }).toString()}`, { signal })
          .then(res => res.json())
          .then(data => handleData(data, "photographers", setTopPhotographers))
          .finally(() => setIsLoadingPhotographers(false)),

        fetch(`/api/vendor?${new URLSearchParams({ categories: "makeup", sortBy: "rating", limit: "10" }).toString()}`, { signal })
          .then(res => res.json())
          .then(data => handleData(data, "makeup", setTopMakeup))
          .finally(() => setIsLoadingMakeup(false)),

        // Trending (generic)
        fetch(`/api/vendor?${new URLSearchParams({ trending: "true", sortBy: "views", limit: "10" }).toString()}`, { signal })
          .then(res => res.json())
          .then(data => handleData(data, null, setTrending))
          .finally(() => setIsLoadingTrending(false)),

        fetch(`/api/vendor?${new URLSearchParams({ categories: "djs", sortBy: "rating", limit: "10" }).toString()}`, { signal })
          .then(res => res.json())
          .then(data => handleData(data, "djs", setTopDJs))
          .finally(() => setIsLoadingDJs(false)),

        fetch(`/api/vendor?${new URLSearchParams({ categories: "catering", sortBy: "rating", limit: "10" }).toString()}`, { signal })
          .then(res => res.json())
          .then(data => handleData(data, "catering", setTopCatering))
          .finally(() => setIsLoadingCatering(false)),

        fetch(`/api/vendor?${new URLSearchParams({ categories: "mehendi", sortBy: "rating", limit: "10" }).toString()}`, { signal })
          .then(res => res.json())
          .then(data => handleData(data, "mehendi", setTopMehendi))
          .finally(() => setIsLoadingMehendi(false)),

        fetch(`/api/vendor?${new URLSearchParams({ categories: "venues", sortBy: "rating", limit: "10" }).toString()}`, { signal })
          .then(res => res.json())
          .then(data => handleData(data, "venues", setTopVenues))
          .finally(() => setIsLoadingVenues(false)),
      ];

      try {
        await Promise.race([
          Promise.allSettled(fetchPromises),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 30000)),
        ]);
      } catch (error) {
        console.error("Critical error in data fetching:", error);
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

      return () => {
        abortController.abort();
      };
    };

    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
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
            href={`/vendors/marketplace`}
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
      <div className="h-14" />
      <div className="pt-4 pb-4">
        <HeroCarousel categoryCounts={categoryCounts} />
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

        <TrustStrip />

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

        <ConciergeStrip />

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

        <PromoStrip />

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
      <AnimatePresence>
        <FloatingCart setOpenCartNavbar={setOpenCartNavbar} />
      </AnimatePresence>
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
