"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavbarVisibilityStore } from "./../../../GlobalState/navbarVisibilityStore";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  Heart,
  Filter,
  Sparkles,
  ArrowLeft,
  Play,
  Crown,
  Music,
  Camera,
  Palette,
  Utensils,
  PartyPopper,
  Gem,
  Flower2,
  Shirt,
  Car,
  Lightbulb,
  Gift,
  Users,
  Building2,
  GraduationCap,
  Baby,
  Cake,
  HeartHandshake,
  Megaphone,
  Trophy,
  Flame,
  Drum,
  HandMetal,
  Bookmark,
  BookmarkCheck,
  BadgeCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  TrendingUp,
  Zap,
  Send,
  ExternalLink,
  Calendar,
  Info,
  Pause,
  Volume2,
  VolumeX,
  Loader2,
  Eye,
  MessageCircle,
  Share2,
  MoreHorizontal,
  RefreshCw,
  Plane,
  Scissors,
  PenTool,
  Mail,
  Palmtree,
  Clapperboard,
  Mic2,
  Diamond,
  Truck,
  ImageIcon,
  Video,
  ScrollText,
  Leaf,
  Globe,
  Mountain,
  Backpack,
  Sun,
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ShareModal } from "./VendorProfilePageWrapper";
import { useUser } from "@clerk/nextjs";
import SmartMedia from "../SmartMediaLoader";
import { useNavigationState } from "../../../hooks/useNavigationState";
import { REEL_SUBTYPES } from "../../desktop/admin/reels/AddReels";

const EVENT_CONFIGS = {
  wedding: {
    type: "wedding",
    quickFilters: [
      { id: "all", label: "All" },
      { id: "roka", label: "Roka" },
      { id: "haldi", label: "Haldi" },
      { id: "mehendi", label: "Mehendi" },
      { id: "sangeet", label: "Sangeet" },
      { id: "baraat", label: "Baraat" },
      { id: "pheras", label: "Pheras" },
      { id: "reception", label: "Reception" },
      { id: "vidaai", label: "Vidaai" },
      { id: "cocktail", label: "Cocktail" },
      { id: "engagement", label: "Engagement" },
      { id: "destination", label: "Destination" },
    ],
    categories: [
      {
        id: "planners",
        label: "Planners",
        icon: <Lightbulb size={18} />,
        gradient: "from-sky-400 to-blue-500",
        subcategories: [
          { id: "full-planning", label: "Full Planning" },
          { id: "partial-planning", label: "Partial Planning" },
          { id: "day-coordination", label: "Day-of Coordination" },
          { id: "destination-planner", label: "Destination" },
          { id: "luxury-planner", label: "Luxury" },
        ],
      },
      {
        id: "venues",
        label: "Venues",
        icon: <Building2 size={18} />,
        gradient: "from-slate-400 to-gray-500",
        subcategories: [
          { id: "banquet-halls", label: "Banquet Halls" },
          { id: "farmhouses", label: "Farmhouses" },
          { id: "hotels-resorts", label: "Hotels & Resorts" },
          { id: "outdoor-lawns", label: "Outdoor Lawns" },
          { id: "beach-weddings", label: "Beach" },
        ],
      },
      {
        id: "decor",
        label: "Decor",
        icon: <Palette size={18} />,
        gradient: "from-teal-400 to-cyan-500",
        subcategories: [
          { id: "floral-decor", label: "Floral" },
          { id: "theme-decor", label: "Theme Decor" },
          { id: "stage-decor", label: "Stage Decor" },
          { id: "haldi-decor", label: "Haldi Decor" },
          { id: "mehendi-decor", label: "Mehendi Decor" },
        ],
      },
      {
        id: "photographers",
        label: "Photo & Video",
        icon: <Camera size={18} />,
        gradient: "from-pink-400 to-rose-500",
        subcategories: [
          { id: "candid-photography", label: "Candid" },
          { id: "traditional-photography", label: "Traditional" },
          { id: "cinematic-films", label: "Cinematic Films" },
          { id: "drone-shoots", label: "Drone Shoots" },
          { id: "pre-wedding-shoots", label: "Pre-Wedding" },
        ],
      },
      {
        id: "makeup",
        label: "Makeup",
        icon: <Gem size={18} />,
        gradient: "from-fuchsia-400 to-pink-500",
        subcategories: [
          { id: "bridal-makeup", label: "Bridal" },
          { id: "hd-makeup", label: "HD Makeup" },
          { id: "airbrush-makeup", label: "Airbrush" },
          { id: "party-makeup", label: "Party" },
        ],
      },
      {
        id: "mehendi",
        label: "Mehendi",
        icon: <Flower2 size={18} />,
        gradient: "from-green-400 to-emerald-500",
        subcategories: [
          { id: "bridal-mehendi", label: "Bridal" },
          { id: "arabic-mehendi", label: "Arabic" },
          { id: "indo-arabic", label: "Indo-Arabic" },
          { id: "minimal-mehendi", label: "Minimal" },
        ],
      },
      {
        id: "catering",
        label: "Catering",
        icon: <Utensils size={18} />,
        gradient: "from-red-400 to-orange-500",
        subcategories: [
          { id: "north-indian", label: "North Indian" },
          { id: "south-indian", label: "South Indian" },
          { id: "multi-cuisine", label: "Multi-Cuisine" },
          { id: "live-counters", label: "Live Counters" },
        ],
      },
      {
        id: "clothes",
        label: "Outfits",
        icon: <Shirt size={18} />,
        gradient: "from-violet-400 to-indigo-500",
        subcategories: [
          { id: "bridal-lehenga", label: "Bridal Lehenga" },
          { id: "designer-wear", label: "Designer Wear" },
          { id: "rental-wear", label: "Rental Wear" },
          { id: "groom-sherwani", label: "Groom Sherwani" },
        ],
      },
      {
        id: "jewellery",
        label: "Jewelry",
        icon: <Diamond size={18} />,
        gradient: "from-amber-400 to-yellow-500",
        subcategories: [
          { id: "bridal-jewelry", label: "Bridal" },
          { id: "artificial-jewelry", label: "Artificial" },
          { id: "gold-jewelry", label: "Gold" },
          { id: "diamond-jewelry", label: "Diamond" },
        ],
      },
      {
        id: "djs",
        label: "Entertainment",
        icon: <Music size={18} />,
        gradient: "from-indigo-400 to-purple-500",
        subcategories: [
          { id: "djs", label: "DJs" },
          { id: "live-bands", label: "Live Bands" },
          { id: "anchors-emcees", label: "Anchors / Emcees" },
          { id: "dancers", label: "Dancers" },
        ],
      },
    ],
  },
  birthday: {
    type: "birthday",
    quickFilters: [
      { id: "all", label: "All" },
      { id: "kids-party", label: "Kids Party" },
      { id: "theme-party", label: "Theme Party" },
      { id: "surprise-party", label: "Surprise" },
      { id: "milestone", label: "Milestone" },
      { id: "sweet-16", label: "Sweet 16" },
    ],
    categories: [
      { id: "venues", label: "Venues", icon: <Building2 size={18} />, gradient: "from-blue-400 to-indigo-500" },
      { id: "decor", label: "Decor", icon: <Palette size={18} />, gradient: "from-teal-400 to-cyan-500" },
      { id: "cakes", label: "Cakes", icon: <Cake size={18} />, gradient: "from-amber-400 to-orange-500" },
      { id: "photographers", label: "Photo", icon: <Camera size={18} />, gradient: "from-rose-400 to-pink-500" },
      { id: "djs", label: "DJ & Music", icon: <Music size={18} />, gradient: "from-purple-400 to-violet-500" },
      { id: "catering", label: "Catering", icon: <Utensils size={18} />, gradient: "from-red-400 to-orange-500" },
      { id: "planners", label: "Planners", icon: <Lightbulb size={18} />, gradient: "from-sky-400 to-blue-500" },
    ],
  },
  anniversary: {
    type: "anniversary",
    quickFilters: [
      { id: "all", label: "All" },
      { id: "silver-jubilee", label: "Silver Jubilee" },
      { id: "golden-jubilee", label: "Golden Jubilee" },
      { id: "surprise", label: "Surprise" },
      { id: "intimate", label: "Intimate" },
      { id: "vow-renewal", label: "Vow Renewal" },
    ],
    categories: [
      { id: "venues", label: "Venues", icon: <Building2 size={18} />, gradient: "from-blue-400 to-indigo-500" },
      { id: "decor", label: "Decor", icon: <Palette size={18} />, gradient: "from-teal-400 to-cyan-500" },
      { id: "photographers", label: "Photo", icon: <Camera size={18} />, gradient: "from-violet-400 to-purple-500" },
      { id: "catering", label: "Dining", icon: <Utensils size={18} />, gradient: "from-red-400 to-rose-500" },
      { id: "cakes", label: "Cakes", icon: <Cake size={18} />, gradient: "from-amber-400 to-yellow-500" },
      { id: "planners", label: "Planners", icon: <Lightbulb size={18} />, gradient: "from-sky-400 to-blue-500" },
    ],
  },
  corporate: {
    type: "corporate",
    quickFilters: [
      { id: "all", label: "All" },
      { id: "conference", label: "Conference" },
      { id: "seminar", label: "Seminar" },
      { id: "offsite", label: "Offsite" },
      { id: "product-launch", label: "Product Launch" },
      { id: "gala", label: "Gala" },
      { id: "holiday-party", label: "Holiday Party" },
    ],
    categories: [
      { id: "venues", label: "Venues", icon: <Building2 size={18} />, gradient: "from-slate-400 to-gray-500" },
      { id: "planners", label: "Planners", icon: <Lightbulb size={18} />, gradient: "from-blue-400 to-indigo-500" },
      { id: "catering", label: "Catering", icon: <Utensils size={18} />, gradient: "from-green-400 to-emerald-500" },
      {
        id: "decor",
        label: "Production & Decor",
        icon: <Palette size={18} />,
        gradient: "from-violet-400 to-purple-500",
      },
      {
        id: "photographers",
        label: "Photo & Video",
        icon: <Camera size={18} />,
        gradient: "from-pink-400 to-rose-500",
      },
    ],
  },
};

const OTHER_EVENT_TYPES = [
  { id: "engagement", label: "Engagement" },
  { id: "baby-shower", label: "Baby Shower" },
  { id: "housewarming", label: "Housewarming" },
  { id: "retirement", label: "Retirement Party" },
  { id: "graduation", label: "Graduation" },
  { id: "puja", label: "Puja / Religious" },
  { id: "kitty-party", label: "Kitty Party" },
  { id: "farewell", label: "Farewell Party" },
  { id: "reunion", label: "Reunion" },
  { id: "charity-gala", label: "Charity Gala" },
];

const getDefaultConfigForOther = (eventId) => ({
  type: eventId,
  quickFilters: [{ id: "all", label: "All" }],
  categories: [
    { id: "planners", label: "Planner", icon: <Lightbulb size={18} />, gradient: "from-sky-400 to-blue-500" },
    { id: "decor", label: "Decor", icon: <Palette size={18} />, gradient: "from-teal-400 to-cyan-500" },
    { id: "photographers", label: "Photo", icon: <Camera size={18} />, gradient: "from-pink-400 to-rose-500" },
    { id: "catering", label: "Catering", icon: <Utensils size={18} />, gradient: "from-red-400 to-orange-500" },
    { id: "venues", label: "Venues", icon: <Building2 size={18} />, gradient: "from-slate-400 to-gray-500" },
  ],
});

const EVENT_SECTION_HEADINGS = [
  "✨ Trending Vendors Near You",
  "🏆 Most Booked Experts",
  "📸 Trending Inspiration",
  "⭐ Top Rated in Your City",
  "🏛️ Popular Venues Near You",
  "🎪 Stunning Decor Ideas",
  "🍽️ Most Loved Services",
  "🔥 Viral Reels (Must Watch)",
  "❤️ Users' Favorite Picks",
  "🎯 Perfect Matches For You",
];

const buildQuery = (params = {}) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") sp.set(k, String(v));
  });
  return sp.toString();
};

const fetchReels = async (params = {}) => {
  try {
    const res = await fetch(`/api/reels?${buildQuery(params)}`);
    if (!res.ok) return { data: [], pagination: {} };
    return res.json();
  } catch {
    return { data: [], pagination: {} };
  }
};

const fetchTrendingReels = async (params = {}) => {
  try {
    const res = await fetch(`/api/reels/trending?${buildQuery(params)}`);
    if (!res.ok) return { reels: [] };
    return res.json();
  } catch {
    return { reels: [] };
  }
};

const fetchFeaturedReels = async (params = {}) => {
  try {
    const res = await fetch(`/api/reels/featured?${buildQuery(params)}`);
    if (!res.ok) return { reels: [] };
    return res.json();
  } catch {
    return { reels: [] };
  }
};

const fetchCustomReelSections = async (params = {}) => {
  try {
    const res = await fetch(`/api/reels/reel-sections/feed?${buildQuery(params)}`);
    if (!res.ok) return { data: [] };
    return res.json();
  } catch {
    return { data: [] };
  }
};

const searchReelsAPI = async (q, params = {}) => {
  try {
    const res = await fetch(`/api/reels/search?${buildQuery({ q, ...params })}`);
    if (!res.ok) return { reels: [] };
    return res.json();
  } catch {
    return { reels: [] };
  }
};

const fetchRelatedReels = async (reelId, limit = 6) => {
  try {
    const res = await fetch(`/api/reels/related/${reelId}?limit=${limit}`);
    if (!res.ok) return { reels: [], similarVendors: [] };
    return res.json();
  } catch {
    return { reels: [], similarVendors: [] };
  }
};

const fetchVendorProfile = async (id) => {
  try {
    const res = await fetch(`/api/vendor/profile/lists?id=${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json.vendor || json;
  } catch {
    return null;
  }
};

const recordView = async (reelId) => {
  try {
    await fetch(`/api/reels/${reelId}/view`, { method: "POST" });
  } catch {}
};

const toggleLike = async (reelId, action) => {
  try {
    const [res] = await Promise.all([
      fetch(`/api/reels/${reelId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      }),
      fetch(`/api/user/toggle-reel-like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelId }),
      }),
    ]);
    if (!res.ok) throw new Error("Like API failed");
    return await res.json();
  } catch (err) {
    return null;
  }
};

const toggleSave = async (reelId, action) => {
  try {
    const [res] = await Promise.all([
      fetch(`/api/reels/${reelId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      }),
      fetch(`/api/user/toggle-reel-watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelId }),
      }),
    ]);
    if (!res.ok) throw new Error("Save API failed");
    return await res.json();
  } catch (err) {
    return null;
  }
};

const recordShare = async (reelId) => {
  try {
    await fetch(`/api/reels/${reelId}/share`, { method: "POST" });
  } catch {}
};

const fetchReelById = async (reelId) => {
  try {
    const res = await fetch(`/api/reels/${reelId}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json;
  } catch {
    return null;
  }
};

export const normalizeReel = (reel) => ({
  id: reel._id || reel.id,
  _id: reel._id || reel.id,
  title: reel.title || "Untitled",
  thumbnail: reel.thumbnailUrl || "",
  videoUrl: reel.videoUrl || "",
  vendorId: reel.vendorId || "",
  rating: reel.priority ? Math.min(5, +(3.5 + (reel.priority / 100) * 1.5).toFixed(1)) : 4.2,
  reviews: reel.likeCount || 0,
  price: reel.price || "",
  location: reel.city || reel.location || "",
  tags: reel.isFeatured ? ["Top Rated"] : reel.isSponsored ? ["Sponsored"] : reel.priority > 50 ? ["Trending"] : [],
  caption: reel.caption || reel.description || "",
  category: reel.category || "",
  type: reel.type || "",
  subType: reel.subType || reel.subtype || "",
  nestedType: reel.nestedType || "",
  viewCount: reel.viewCount || 0,
  likeCount: reel.likeCount || 0,
  shareCount: reel.shareCount || 0,
  saveCount: reel.saveCount || 0,
  commentCount: reel.commentCount || 0,
  similarVendors: reel.similarVendors || [],
  musicTitle: reel.musicTitle || "",
  musicArtist: reel.musicArtist || "",
  hashtags: reel.hashtags || [],
  ctaText: reel.ctaText || "",
  ctaLink: reel.ctaLink || "",
  isFeatured: reel.isFeatured || false,
  isSponsored: reel.isSponsored || false,
  isPinned: reel.isPinned || false,
  publishedAt: reel.publishedAt || reel.createdAt || "",
});

const RECENTLY_VIEWED_KEY = "ideas_recently_viewed_reels";

const getRecentlyViewed = () => {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const addToRecentlyViewed = (reel) => {
  try {
    const existing = getRecentlyViewed();
    const filtered = existing.filter((r) => r._id !== reel._id);
    const updated = [reel, ...filtered].slice(0, 30);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch {}
};

const replaceURLParams = (pathname, params) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "" && v !== "relevance") sp.set(k, String(v));
  });
  const qs = sp.toString();
  window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
};

const fmt = (n) => {
  if (!n) return "0";
  if (n > 999999) return `${(n / 1000000).toFixed(1)}M`;
  if (n > 999) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

const HIGHLIGHT_IDS = new Set(["sponsored", "featured", "trending", "recently-viewed"]);

const ShimmerBlock = ({ className }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:200%_100%] rounded-xl ${className}`}
    style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
  />
);

export const CarouselSkeleton = ({ isDouble = false }) => (
  <div
    className={
      isDouble
        ? "relative mx-3 rounded-3xl overflow-hidden bg-white/[0.04] backdrop-blur-2xl border border-white/[0.05] shadow-[0_8px_24px_rgba(0,0,0,0.20),0_2px_6px_rgba(0,0,0,0.10)] pt-[14px] pb-3 pr-3 mb-5"
        : "mb-5"
    }
  >
    <div className="flex items-center justify-between px-4 mb-2">
      <ShimmerBlock className="h-4 w-32" />
      <div className="flex gap-1.5">
        <ShimmerBlock className="h-7 w-7 !rounded-full" />
      </div>
    </div>
    <div className="overflow-hidden px-4">
      <div className="flex gap-2 pb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-[104px] shrink-0">
            <ShimmerBlock className="h-[140px] w-[104px] !rounded-xl" />
          </div>
        ))}
      </div>
      {isDouble && (
        <div className="flex gap-2 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[104px] shrink-0">
              <ShimmerBlock className="h-[140px] w-[104px] !rounded-xl" />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const FullPageSkeleton = () => (
  <div className="pt-4 space-y-1">
    <style jsx>{`
      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `}</style>
    <CarouselSkeleton />
    <CarouselSkeleton />
    <CarouselSkeleton isDouble />
    <CarouselSkeleton />
    <CarouselSkeleton isDouble />
  </div>
);

const CategoryGridCarousel = ({ categories, activeCategory, onCategoryClick }) => {
  const constraintRef = useRef(null);
  return (
    <div ref={constraintRef} className="overflow-hidden">
      <motion.div
        drag="x"
        dragConstraints={constraintRef}
        dragElastic={0.12}
        dragTransition={{ bounceStiffness: 120, bounceDamping: 20 }}
        className="grid grid-rows-2 grid-flow-col auto-cols-max gap-0 px-2 py-1 gap-y-0 cursor-grab active:cursor-grabbing"
      >
        {categories.map((category, idx) => {
          const isActive = activeCategory === category.id;
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02, type: "spring", stiffness: 300, damping: 24 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onCategoryClick(category.id)}
              className={`relative flex flex-col items-center justify-center gap-1 pl-0 w-[80px] h-[70px] rounded-2xl transition-all select-none ${
                isActive
                  ? "bg-gray-900 dark:bg-white shadow-lg shadow-gray-900/20 dark:shadow-white/10"
                  : "bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-white/20 text-white dark:text-gray-900 dark:bg-gray-900/20"
                    : `bg-gradient-to-br ${category.gradient} text-white shadow-sm`
                }`}
              >
                {category.icon}
              </div>
              <span
                className={`text-[9px] font-semibold leading-tight text-center transition-colors ${
                  isActive ? "text-white dark:text-gray-900" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {category.label}
              </span>
              {category.subcategories && (
                <div
                  className={`absolute top-1.5 right-1.5 w-1 h-1 rounded-full ${
                    isActive ? "bg-white/60 dark:bg-gray-900/40" : "bg-violet-400"
                  }`}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

const SubcategoryChips = ({ subcategories, activeSubcategory, onSubcategoryClick }) => {
  const constraintRef = useRef(null);
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="overflow-hidden"
    >
      <div ref={constraintRef} className="overflow-hidden bg-gray-50/60 dark:bg-gray-900/60">
        <motion.div
          drag="x"
          dragConstraints={constraintRef}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 150, bounceDamping: 20 }}
          className="flex gap-2 px-3 py-2.5 cursor-grab active:cursor-grabbing"
          style={{ width: "max-content" }}
        >
          {subcategories.map((subcat, idx) => {
            const isActive = activeSubcategory === subcat.id;
            return (
              <motion.button
                key={subcat.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => onSubcategoryClick(subcat.id)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-150 dark:border-gray-700"
                }`}
              >
                {subcat.label}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

const QuickFiltersCarousel = ({ filters, activeFilter, onFilterClick }) => {
  const constraintRef = useRef(null);
  if (!filters || filters.length === 0) return null;
  return (
    <div
      ref={constraintRef}
      className="overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100/60 dark:border-gray-800/60"
    >
      <motion.div
        drag="x"
        dragConstraints={constraintRef}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 150, bounceDamping: 20 }}
        className="flex gap-2 px-3 py-2 cursor-grab active:cursor-grabbing"
        style={{ width: "max-content" }}
      >
        {filters.map((f, idx) => {
          const isActive = activeFilter === f.id;
          return (
            <motion.button
              key={f.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.025 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => onFilterClick(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all select-none ${
                isActive
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-150 dark:border-gray-700"
              }`}
            >
              {f.label}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

const MiniCard = ({ item, idx, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.025, type: "spring", stiffness: 300, damping: 26 }}
    onClick={onClick}
    className="w-[104px] shrink-0 cursor-pointer group snap-start"
  >
    <div className="relative h-[140px] w-[104px] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
      <SmartMedia
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-active:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {item.tags?.[0] && (
        <div className="absolute top-1.5 left-1.5 px-1.5 py-[1px] bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded text-[7px] font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-0.5">
          {item.tags[0] === "Top Rated" && <Star size={6} className="fill-amber-500 text-amber-500" />}
          {item.tags[0] === "Trending" && <TrendingUp size={6} />}
          {item.tags[0] === "Sponsored" && <Zap size={6} />}
          {item.tags[0]}
        </div>
      )}
      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/25 backdrop-blur rounded-full flex items-center justify-center">
        <Play size={7} className="text-white fill-white ml-[1px]" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="text-white font-semibold text-[10px] leading-tight line-clamp-1 opacity-90">{item.title}</p>
        {item.viewCount > 0 && (
          <p className="text-white/50 text-[7px] flex items-center gap-0.5 mt-0.5">
            <Eye size={6} /> {item.viewCount > 999 ? `${(item.viewCount / 1000).toFixed(1)}k` : item.viewCount}
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

export const ScrollCarousel = memo(({ children, className = "" }) => {
  const ref = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const check = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);
  useEffect(() => {
    check();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [check, children]);
  const scroll = useCallback((dir) => {
    ref.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  }, []);
  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {canLeft && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={() => scroll("left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg shadow-black/10 flex items-center justify-center border border-gray-100 dark:border-gray-700 active:scale-90 transition-transform"
          >
            <ChevronLeft size={15} className="text-gray-600 dark:text-gray-300" />
          </motion.button>
        )}
      </AnimatePresence>
      {canLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#f8f8fa] dark:from-black to-transparent z-10 pointer-events-none" />
      )}
      <div
        ref={ref}
        className="flex gap-2.5 overflow-x-auto px-5 pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>
      {canRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#f8f8fa] dark:from-black to-transparent z-10 pointer-events-none" />
      )}
      <AnimatePresence>
        {canRight && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={() => scroll("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg shadow-black/10 flex items-center justify-center border border-gray-100 dark:border-gray-700 active:scale-90 transition-transform"
          >
            <ChevronRight size={15} className="text-gray-600 dark:text-gray-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});
ScrollCarousel.displayName = "ScrollCarousel";

export const SingleRowCarousel = ({ section, onItemClick }) => (
  <div className="mb-5">
    <div className="flex flex-col gap-0.5 px-4 mb-2">
      <h3 className="text-[13px] font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
        {section?.title}
        {section?.isCustomSection && <Crown size={12} className="text-amber-500 shrink-0" />}
      </h3>
      {section?.subtitle && (
        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
          {section?.subtitle}
        </p>
      )}
    </div>
    <ScrollCarousel>
      {section?.items?.length > 0 ? (
        section?.items?.map((item, idx) => (
          <MiniCard key={item.id} item={item} idx={idx} onClick={() => onItemClick(item, section?.items, idx)} />
        ))
      ) : (
        <div className="flex items-center justify-center w-full py-6 text-gray-400 text-xs px-4">No reels found</div>
      )}
    </ScrollCarousel>
  </div>
);

const TwoRowGridCarousel = ({ section, onItemClick }) => {
  const topItems = section.items.filter((_, i) => i % 2 === 0);
  const bottomItems = section.items.filter((_, i) => i % 2 === 1);
  return (
    <div className="relative mx-3 rounded-3xl overflow-hidden bg-white/[0.04] backdrop-blur-2xl border border-white/[0.05] shadow-[0_8px_24px_rgba(0,0,0,0.20),0_2px_6px_rgba(0,0,0,0.10)] pt-[14px] pb-3 mb-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      <div className="flex flex-col px-4 mb-3 gap-0.5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500 shrink-0" />
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
            {section.title}
            {section.isCustomSection && <Crown size={12} className="text-amber-500 shrink-0" />}
          </h3>
        </div>
        {section.subtitle && (
          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate ml-3">
            {section.subtitle}
          </p>
        )}
      </div>
      <ScrollCarousel>
        {topItems.map((item, idx) => (
          <MiniCard key={item.id} item={item} idx={idx} onClick={() => onItemClick(item, section.items, idx * 2)} />
        ))}
      </ScrollCarousel>
      <ScrollCarousel className="mt-2">
        {bottomItems.map((item, idx) => (
          <MiniCard key={item.id} item={item} idx={idx} onClick={() => onItemClick(item, section.items, idx * 2 + 1)} />
        ))}
      </ScrollCarousel>
    </div>
  );
};

export const ReelsViewerModal = ({ reels: initialReels, initialIndex, onClose, onBookNow, userInteractions }) => {
  const router = useRouter();

  // ── All original states (unchanged) ──
  const [reels, setReels] = useState(initialReels);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [localLikeCount, setLocalLikeCount] = useState(0);
  const [localSaveCount, setLocalSaveCount] = useState(0);
  const [localViewCount, setLocalViewCount] = useState(0);
  const [relatedReels, setRelatedReels] = useState([]);
  const [similarVendors, setSimilarVendors] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [showSimilarVendorsDrawer, setShowSimilarVendorsDrawer] = useState(false);
  const [similarVendorProfiles, setSimilarVendorProfiles] = useState([]);
  const [loadingSimilarProfiles, setLoadingSimilarProfiles] = useState(false);

  // ── Refs ──
  const videoRef = useRef(null);
  const viewRecordedRef = useRef(new Set());
  const lastTapRef = useRef(0);
  const isClosingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const currentReel = reels[currentIndex];

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ★ NEW: History pushState + popstate listener (back button support)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  useEffect(() => {
    // Step 1: Clean current URL entry — removes ?reel= from deep links
    // so that history.back() on close returns to a clean URL
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("reel");
    const cleanHref = cleanUrl.pathname + cleanUrl.search;
    window.history.replaceState(null, "", cleanHref);

    // Step 2: Push a new entry so browser back button closes modal
    window.history.pushState({ reelsModal: true }, "", cleanHref);

    // Step 3: Back button handler
    const onPopState = () => {
      if (!isClosingRef.current) {
        isClosingRef.current = true;
        onCloseRef.current();
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Body overflow lock (original)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ★ NEW: Force stop video on unmount (cleanup)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      }
    };
  }, []);

  // ── URL sync when index changes (original) ──
  useEffect(() => {
    if (!currentReel?._id) return;
    const url = new URL(window.location.href);
    url.searchParams.set("reel", currentReel._id);
    window.history.replaceState(null, "", url.pathname + url.search);
  }, [currentIndex, currentReel?._id]);

  // ── Reset state + fetch data on reel change (original) ──
  useEffect(() => {
    if (!currentReel?._id) return;
    const initiallyLiked = userInteractions?.liked?.has(currentReel._id) || false;
    const initiallySaved = userInteractions?.saved?.has(currentReel._id) || false;
    setIsLiked(initiallyLiked);
    setIsSaved(initiallySaved);
    setExpanded(false);
    setIsPlaying(true);
    setVideoLoading(true);
    setLocalLikeCount(currentReel.likeCount || 0);
    setLocalSaveCount(currentReel.saveCount || 0);
    setLocalViewCount(currentReel.viewCount || 0);
    setVendorProfile(null);

    if (!viewRecordedRef.current.has(currentReel._id)) {
      viewRecordedRef.current.add(currentReel._id);
      recordView(currentReel._id);
      setLocalViewCount((c) => c + 1);
      addToRecentlyViewed(currentReel);
    }

    fetchRelatedReels(currentReel._id, 8).then((res) => {
      if (res.reels) {
        const normalized = res.reels.map(normalizeReel);
        setRelatedReels(normalized);
      }
      if (res.similarVendors) setSimilarVendors(res.similarVendors);
    });

    if (currentReel.vendorId) {
      setLoadingProfile(true);
      fetchVendorProfile(currentReel.vendorId).then((profile) => {
        if (profile) setVendorProfile(profile);
        setLoadingProfile(false);
      });
    }
  }, [currentIndex, currentReel?._id]);

  // ── Play/pause sync (original) ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.play().catch(() => {});
    else video.pause();
  }, [isPlaying, currentIndex]);

  // ── Navigation (original) ──
  const goToReel = useCallback(
    (direction) => {
      if (direction === "up" && currentIndex < reels.length - 1) setCurrentIndex((p) => p + 1);
      else if (direction === "down" && currentIndex > 0) setCurrentIndex((p) => p - 1);
    },
    [currentIndex, reels.length],
  );

  // ── Drag handler (original) ──
  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    if (info.offset.y < -50 || info.velocity.y < -300) goToReel("up");
    else if (info.offset.y > 50 || info.velocity.y > 300) goToReel("down");
    if (info.velocity.x > 500 || info.offset.x > 150) handleClose();
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ★ UPDATED: handleClose — uses isClosingRef + history.back()
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    // back() returns to the clean entry we set up on mount
    window.history.back();
    onClose();
  }, [onClose]);

  const closeAndNavigate = useCallback(
    (targetUrl) => {
      if (isClosingRef.current) return;
      isClosingRef.current = true;

      // Clean the modal's history entry (don't call history.back —
      // it's async and would cancel router.push)
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("reel");
      window.history.replaceState(null, "", cleanUrl.pathname + cleanUrl.search);

      // Navigate first, then unmount
      router.push(targetUrl);
      onClose();
    },
    [router, onClose],
  );

  const navigateToVendorProfile = useCallback(
    async (vendorId) => {
      setIsProfileLoading(true);
      try {
        console.log("Fetching vendor profile for ID:", vendorId);
        const profile = await fetchVendorProfile(vendorId);
        console.log("Fetched vendor profile for navigation:", profile);
        if (profile && profile.category) {
          const backTo = encodeURIComponent(window.location.href);
          const path = profile.vendorId
            ? `/vendor/${profile.category}/${profile.vendorId}/profile`
            : `/vendor/${profile.category}/profile/${profile.username}`;
          console.log("Navigating to:", `${path}?backTo=${backTo}`);
          closeAndNavigate(`${path}?backTo=${backTo}`);
        }
      } catch (err) {
        console.error("Failed to fetch vendor profile:", err);
      } finally {
        setIsProfileLoading(false);
      }
    },
    [closeAndNavigate],
  );

  // ── Tap handler (original) ──
  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!isLiked && currentReel?._id) {
        setIsLiked(true);
        setLocalLikeCount((c) => c + 1);
        setShowLikeAnimation(true);
        setTimeout(() => setShowLikeAnimation(false), 600);
        toggleLike(currentReel._id, "like");
      }
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current === now) {
          if (currentReel?.videoUrl) setIsPlaying((p) => !p);
        }
      }, 300);
    }
  };

  // ── Like toggle (original) ──
  const handleLikeToggle = () => {
    if (!currentReel?._id) return;
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLocalLikeCount((c) => (newLiked ? c + 1 : Math.max(0, c - 1)));
    if (newLiked) {
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 600);
    }
    toggleLike(currentReel._id, newLiked ? "like" : "unlike");
  };

  // ── Save toggle (original) ──
  const handleSaveToggle = () => {
    if (!currentReel?._id) return;
    const newSaved = !isSaved;
    setIsSaved(newSaved);
    setLocalSaveCount((c) => (newSaved ? c + 1 : Math.max(0, c - 1)));
    toggleSave(currentReel._id, newSaved ? "save" : "unsave");
  };

  // ── Share (original) ──
  const handleShare = () => {
    if (!currentReel?._id) return;
    recordShare(currentReel._id);
    setShowShareModal(true);
  };

  // ── See profile (original) ──
  const handleSeeProfile = async () => {
    const allVendorIds = similarVendors || [];
    if (allVendorIds.length === 0) return;
    if (allVendorIds.length === 1) {
      await navigateToVendorProfile(allVendorIds[0]._id);
      return;
    }
    setShowSimilarVendorsDrawer(true);
    setLoadingSimilarProfiles(true);
    try {
      const profiles = await Promise.all(allVendorIds.map((id) => fetchVendorProfile(id._id)));
      setSimilarVendorProfiles(profiles.filter(Boolean));
    } catch {
      setSimilarVendorProfiles([]);
    } finally {
      setLoadingSimilarProfiles(false);
    }
  };

  // ── Load related into feed (original) ──
  const loadRelatedIntoFeed = useCallback(
    (relReel) => {
      const exists = reels.findIndex((r) => r._id === relReel._id);
      if (exists >= 0) {
        setCurrentIndex(exists);
      } else {
        const newReels = [...reels, relReel];
        setReels(newReels);
        setCurrentIndex(newReels.length - 1);
      }
    },
    [reels],
  );

  if (!currentReel) return null;

  const hasVideo = !!currentReel.videoUrl;
  const formatCount = (n) => (n > 999 ? `${(n / 1000).toFixed(1)}k` : n);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ORIGINAL JSX — completely unchanged
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-black overflow-hidden"
    >
      {/* ── HEADER ── */}
      <div className="absolute top-0 left-0 right-0 z-30 px-3 pt-3 pb-6 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleClose}
          className="p-2 bg-white/10 backdrop-blur-xl rounded-full"
        >
          <ArrowLeft size={18} className="text-white" />
        </motion.button>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full">
          <span className="text-white/80 text-[11px] font-medium">{currentIndex + 1}</span>
          <span className="text-white/30 text-[11px]">/</span>
          <span className="text-white/50 text-[11px] font-medium">{reels.length}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 bg-white/10 backdrop-blur-xl rounded-full"
        >
          {isMuted ? <VolumeX size={16} className="text-white" /> : <Volume2 size={16} className="text-white" />}
        </motion.button>
      </div>

      {/* ── SWIPEABLE VIDEO/IMAGE AREA ── */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onClick={handleTap}
        className="absolute inset-0 touch-pan-y"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReel._id || currentReel.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="absolute inset-0 z-10"
          >
            {hasVideo ? (
              <>
                <video
                  ref={videoRef}
                  src={currentReel.videoUrl}
                  poster={currentReel.thumbnail}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  muted={isMuted}
                  autoPlay
                  onLoadedData={() => setVideoLoading(false)}
                  onWaiting={() => setVideoLoading(true)}
                  onPlaying={() => setVideoLoading(false)}
                />
                {videoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Loader2 size={36} className="text-white animate-spin" />
                  </div>
                )}
                {!isPlaying && !videoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-black/30 backdrop-blur flex items-center justify-center">
                      <Play size={28} className="text-white fill-white ml-1" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <SmartMedia src={currentReel.thumbnail} alt={currentReel.title} className="w-full h-full object-cover" />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none" />
        <AnimatePresence>
          {showLikeAnimation && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <Heart size={80} className="text-white fill-white drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── RIGHT SIDE INTERACTION BUTTONS ── */}
      <div
        className="absolute right-2 flex flex-col items-center gap-4 z-30 transition-all ease-in-out"
        style={{ bottom: expanded ? "450px" : "128px" }}
      >
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleLikeToggle}
          className="flex flex-col items-center gap-0.5"
        >
          <motion.div
            animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center"
          >
            <Heart size={20} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />
          </motion.div>
          <span className="text-white text-[9px] font-semibold">{formatCount(localLikeCount)}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleSaveToggle}
          className="flex flex-col items-center gap-0.5"
        >
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
            {isSaved ? (
              <BookmarkCheck size={20} className="text-white fill-white" />
            ) : (
              <Bookmark size={20} className="text-white" />
            )}
          </div>
          <span className="text-white text-[9px] font-semibold">
            {localSaveCount > 0 ? formatCount(localSaveCount) : "Save"}
          </span>
        </motion.button>

        <motion.button whileTap={{ scale: 0.8 }} onClick={handleShare} className="flex flex-col items-center gap-0.5">
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
            <Send size={18} className="text-white" />
          </div>
          <span className="text-white text-[9px] font-semibold">
            {currentReel.shareCount > 0 ? formatCount(currentReel.shareCount) : "Share"}
          </span>
        </motion.button>
      </div>

      {/* ── BOTTOM CONTENT SECTION ── */}
      <div className="absolute left-0 right-0 bottom-0 z-30 px-4 pb-6 pt-3">
        {/* Vendor info row */}
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/30 bg-gray-600 shrink-0"
            onClick={handleSeeProfile}
          >
            <SmartMedia
              src={vendorProfile?.vendorAvatarNew || currentReel.thumbnail}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0" onClick={handleSeeProfile}>
            <span className="text-white font-bold text-[13px] truncate block">{`Deto - ${currentReel?.title?.slice(0, 10)}...`}</span>
            <span className="text-white/40 text-[10px] flex items-center gap-1">
              {(vendorProfile?.location?.city || currentReel.location) && (
                <>
                  <MapPin size={8} /> {vendorProfile?.location?.city || currentReel.location}
                  <span className="mx-0.5">·</span>
                </>
              )}
              {currentReel.isPinned && (
                <>
                  <span className="mx-0.5">·</span>
                  <BadgeCheck size={8} className="text-blue-400" />
                </>
              )}
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 bg-white/10 backdrop-blur-sm rounded-full"
          >
            {isProfileLoading ? (
              <span className="btn-loader">
                <i className="fa fa-spinner fa-spin" />
              </span>
            ) : expanded ? (
              <ChevronDown size={14} className="text-white/70" />
            ) : (
              <ChevronUp size={14} className="text-white/70" />
            )}
          </motion.button>
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="overflow-hidden mb-3"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 space-y-1.5">
                <p className="text-white font-semibold text-xs leading-snug">
                  {currentReel.caption} | {formatCount(localViewCount)} views
                </p>
                {currentReel.description && (
                  <p className="text-white/50 text-[11px] leading-relaxed">{currentReel.description}</p>
                )}
                {currentReel.musicTitle && (
                  <p className="text-white/40 text-[10px] flex items-center gap-1">
                    <Music size={9} /> {currentReel.musicTitle}
                    {currentReel.musicArtist ? ` · ${currentReel.musicArtist}` : ""}
                  </p>
                )}
                {currentReel.hashtags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentReel.hashtags.slice(0, 6).map((h) => (
                      <span key={h} className="text-[9px] text-blue-300 font-medium">
                        {h.startsWith("#") ? h : `#${h}`}
                      </span>
                    ))}
                  </div>
                )}
                {currentReel.price && <p className="text-emerald-400 font-bold text-sm">{currentReel.price}</p>}

                {/* Similar Vendors inside expanded */}
                {similarVendors.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-white/50 text-[9px] font-semibold uppercase tracking-wider mb-1.5">
                      Similar Vendors
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {similarVendors.slice(0, 4).map((v) => (
                        <div
                          key={v._id}
                          onClick={() => {
                            navigateToVendorProfile(v._id);
                          }}
                          className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1.5 shrink-0 cursor-pointer active:bg-white/10 transition-colors"
                        >
                          {v.vendorAvatarNew && (
                            <SmartMedia src={v.vendorAvatarNew} alt="" className="w-5 h-5 rounded-full object-cover" />
                          )}
                          <div>
                            <p className="text-white text-[9px] font-semibold truncate max-w-[80px]">
                              {v.vendorBusinessName || v.vendorName}
                            </p>
                            {v.location?.city && <p className="text-white/30 text-[7px]">{v.location.city}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Reels inside expanded */}
                {relatedReels.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-white/50 text-[9px] font-semibold uppercase tracking-wider mb-1.5">
                      Related Reels
                    </p>
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {relatedReels.slice(0, 6).map((rr) => (
                        <div
                          key={rr._id}
                          onClick={() => loadRelatedIntoFeed(rr)}
                          className="w-[52px] h-[72px] rounded-lg overflow-hidden shrink-0 cursor-pointer ring-1 ring-white/10 active:ring-white/30 transition-all"
                        >
                          <SmartMedia src={rr.thumbnail} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Two bottom buttons */}
        <div className="flex gap-2.5">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSeeProfile}
            disabled={isProfileLoading}
            className="flex-1 py-3 bg-white/15 text-white backdrop-blur-xl rounded-xl flex items-center justify-center gap-2 border border-white/10"
          >
            <ExternalLink size={14} className="text-white" />
            {isProfileLoading ? (
              <span className="btn-loader">
                <i className="fa fa-spinner fa-spin" /> Loading...
              </span>
            ) : (
              "See Profile"
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onBookNow(currentReel)}
            className="flex-1 py-3 bg-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-white/10"
          >
            <Calendar size={14} className="text-gray-900" />
            <span className="text-[12px] font-bold text-gray-900">{"Book Now"}</span>
          </motion.button>
        </div>
      </div>

      {/* ── Bottom hint text ── */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30">
        <p className="text-white/15 text-[8px]">Swipe up/down · Double tap to like</p>
      </div>

      {/* ── SHARE MODAL ── */}
      <AnimatePresence>
        {showShareModal && (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            vendorName={vendorProfile?.vendorBusinessName || currentReel.title}
          />
        )}
      </AnimatePresence>

      {/* ── SIMILAR VENDORS DRAWER ── */}
      <AnimatePresence>
        {showSimilarVendorsDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSimilarVendorsDrawer(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white dark:bg-gray-900 rounded-t-[1.75rem] z-[110] overflow-hidden flex flex-col shadow-2xl"
            >
              <div
                className="w-full flex justify-center pt-3 pb-1 cursor-pointer"
                onClick={() => setShowSimilarVendorsDrawer(false)}
              >
                <div className="w-10 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
              <div className="px-5 pt-1 pb-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-700 dark:text-gray-300" />
                  <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Similar Vendors</h2>
                  <span className="text-[11px] text-gray-400 font-medium">({similarVendorProfiles.length})</span>
                </div>
                <button
                  onClick={() => setShowSimilarVendorsDrawer(false)}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loadingSimilarProfiles ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 size={28} className="animate-spin text-gray-400" />
                    <p className="text-[12px] text-gray-400 font-medium">Loading vendor profiles...</p>
                  </div>
                ) : similarVendorProfiles.length > 0 ? (
                  <div className="p-4 space-y-3">
                    {similarVendorProfiles.map((profile) => {
                      if (!profile || !profile._id || !profile.category) return null;
                      return (
                        <motion.div
                          key={profile._id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setShowSimilarVendorsDrawer(false);
                            const backTo = encodeURIComponent(window.location.href);
                            const path = profile.vendorId
                              ? `/vendor/${profile.category}/${profile.vendorId}/profile`
                              : `/vendor/${profile.category}/profile/${profile.username}`;
                            closeAndNavigate(`${path}?backTo=${backTo}`);
                          }}
                          className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 cursor-pointer active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                            {profile.vendorAvatarNew ? (
                              <SmartMedia src={profile.vendorAvatarNew} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Building2 size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate">
                              {profile.vendorBusinessName || profile.vendorName || "Vendor"}
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate capitalize">
                              {profile.category?.replace(/-/g, " ")}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {(profile.location?.city || profile.city) && (
                                <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                  <MapPin size={8} /> {profile.location?.city || profile.city}
                                </span>
                              )}
                              {profile.rating && (
                                <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                  <Star size={8} className="fill-amber-400 text-amber-400" /> {profile.rating}
                                </span>
                              )}
                              {profile.startingPrice && (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                  {profile.startingPrice}
                                </span>
                              )}
                            </div>
                            {/* {profile.bio && (
                              <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{profile.bio}</p>
                            )} */}
                          </div>
                          <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 shrink-0" />
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-[13px] text-gray-400 font-medium">No vendor profiles found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EventSelectionModal = ({ onSelect }) => {
  const [showOthers, setShowOthers] = useState(false);
  const [searchOther, setSearchOther] = useState("");
  const mainEvents = [
    {
      id: "wedding",
      label: "Wedding",
      icon: <HeartHandshake size={26} />,
      gradient: "from-rose-500 to-pink-600",
      desc: "Plan your dream day",
    },
    {
      id: "anniversary",
      label: "Anniversary",
      icon: <Heart size={26} />,
      gradient: "from-red-500 to-rose-600",
      desc: "Celebrate your love",
    },
    {
      id: "birthday",
      label: "Birthday",
      icon: <Cake size={26} />,
      gradient: "from-amber-500 to-orange-600",
      desc: "Make it memorable",
    },
    {
      id: "corporate",
      label: "Corporate",
      icon: <Building2 size={26} />,
      gradient: "from-blue-500 to-indigo-600",
      desc: "Professional events",
    },
  ];
  const filteredOthers = OTHER_EVENT_TYPES.filter((e) => e.label.toLowerCase().includes(searchOther.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-end justify-center"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 28, stiffness: 250, delay: 0.1 }}
        className="w-full max-w-lg"
      >
        <div className="px-6 pb-10 pt-6">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
              className="w-14 h-14 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-gray-900/20"
            >
              <Sparkles size={24} className="text-white dark:text-gray-900" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight"
            >
              What are you planning?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[13px] text-gray-400 mt-1.5"
            >
              Choose your event to explore ideas & vendors
            </motion.p>
          </div>
          {!showOthers ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {mainEvents.map((event, idx) => (
                  <motion.button
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + idx * 0.07, type: "spring", stiffness: 250 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(event.id, event.label)}
                    className="flex flex-col items-center gap-2.5 p-5 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 active:border-gray-300 dark:active:border-gray-600 transition-all shadow-sm hover:shadow-md"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${event.gradient} flex items-center justify-center text-white shadow-lg`}
                    >
                      {event.icon}
                    </div>
                    <div className="text-center">
                      <span className="text-[13px] font-bold text-gray-900 dark:text-white block">{event.label}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">{event.desc}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowOthers(true)}
                className="w-full py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 font-semibold text-[12px] flex items-center justify-center gap-2 border border-gray-100 dark:border-gray-700/50"
              >
                <PartyPopper size={14} /> Other Event Types <ChevronDown size={12} />
              </motion.button>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button
                onClick={() => setShowOthers(false)}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500 mb-4"
              >
                <ArrowLeft size={13} />
                Back
              </button>
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search event type..."
                  value={searchOther}
                  onChange={(e) => setSearchOther(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[12px] font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {filteredOthers.map((event, idx) => (
                  <motion.button
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelect(event.id, event.label)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 active:border-gray-300"
                  >
                    <span className="text-[12px] font-semibold text-gray-900 dark:text-white">{event.label}</span>
                    <ChevronRight size={13} className="text-gray-300" />
                  </motion.button>
                ))}
                {filteredOthers.length === 0 && (
                  <p className="text-center py-6 text-[12px] text-gray-400">No matching event types</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const buildCarouselLayout = (carousels) => {
  const pattern = ["single", "single", "double", "single", "double"];
  return carousels.map((section, i) => ({ section, type: pattern[i % pattern.length] }));
};

const FilterDrawer = ({ initialFilter, onApply, onClose }) => {
  const [sort, setSort] = useState(initialFilter.sort);
  const [minRating, setMinRating] = useState(initialFilter.minRating);
  const [priceRange, setPriceRange] = useState(initialFilter.priceRange);
  const [location, setLocation] = useState(initialFilter.location);

  const sortOptions = [
    { id: "relevance", label: "Relevance" },
    { id: "rating", label: "Top Rated" },
    { id: "trending", label: "Trending" },
    { id: "newest", label: "Newest" },
  ];
  const ratings = [4.5, 4.0, 3.5];
  const locations = ["Delhi", "Mumbai", "Jaipur", "Bangalore", "Hyderabad", "Goa"];
  const activeCount = [sort !== "relevance", minRating, priceRange, location].filter(Boolean).length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120]"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed bottom-0 left-0 right-0 max-h-[88vh] bg-white dark:bg-gray-900 rounded-t-[1.75rem] z-[120] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
          <div className="w-10 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="px-5 pt-1 pb-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Filter & Sort</h2>
            {activeCount > 0 && (
              <span className="w-5 h-5 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                <span className="text-white dark:text-gray-900 text-[9px] font-bold">{activeCount}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSort("relevance");
                  setMinRating(null);
                  setPriceRange(null);
                  setLocation(null);
                }}
                className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                Reset all
              </motion.button>
            )}
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-6">
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-widest">
                Sort By
              </h4>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSort(opt.id)}
                    className={`px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all ${sort === opt.id ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm" : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700"}`}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-widest">
                Minimum Rating
              </h4>
              <div className="flex gap-2">
                {ratings.map((r) => (
                  <motion.button
                    key={r}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMinRating(minRating === r ? null : r)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all ${minRating === r ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm" : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700"}`}
                  >
                    <Star
                      size={9}
                      className={minRating === r ? "fill-amber-400 text-amber-400" : "fill-gray-400 text-gray-400"}
                    />
                    {r}+
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-widest">
                Location
              </h4>
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <motion.button
                    key={loc}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLocation(location === loc ? null : loc)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all ${location === loc ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm" : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700"}`}
                  >
                    <MapPin size={9} />
                    {loc}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onApply({ sort, minRating, priceRange, location })}
            className="w-full py-3.5 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Filter size={14} className="text-white dark:text-gray-900" />
            <span className="text-[13px] font-bold text-white dark:text-gray-900">Apply Filters</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export const BookingDrawer = ({ item, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(0);

  const packages = [
    { name: "Basic", price: "₹15,000", features: ["4 hours coverage", "50 edited photos", "Online gallery"] },
    {
      name: "Standard",
      price: "₹35,000",
      features: ["8 hours coverage", "200 edited photos", "Highlight reel", "Online gallery"],
    },
    {
      name: "Premium",
      price: "₹65,000",
      features: ["Full day coverage", "500+ edited photos", "Cinematic film", "Album", "Online gallery"],
    },
  ];
  const dates = ["Tomorrow", "This Weekend", "Next Week", "Custom Date"];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120]"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-white dark:bg-gray-900 rounded-t-[1.75rem] z-[120] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
          <div className="w-10 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="px-5 pt-1 pb-3 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-gray-200">
            <SmartMedia src={item.thumbnail} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white truncate">
              Book {item.title || "Vendor"}
            </h2>
            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              <Star size={9} className="fill-amber-400 text-amber-400" /> {item.rating?.toFixed?.(1) || "4.2"} ·{" "}
              {item.location}
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">
            <div>
              <h4 className="text-[12px] font-bold text-gray-900 dark:text-white mb-2.5 uppercase tracking-wider">
                Preferred Date
              </h4>
              <div className="flex flex-wrap gap-2">
                {dates.map((d) => (
                  <motion.button
                    key={d}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(d)}
                    className={`px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all ${
                      selectedDate === d
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
                    }`}
                  >
                    {d}
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-gray-900 dark:text-white mb-2.5 uppercase tracking-wider">
                Choose Package
              </h4>
              <div className="space-y-2.5">
                {packages.map((pkg, i) => (
                  <motion.button
                    key={pkg.name}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPackage(i)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all ${
                      selectedPackage === i
                        ? "bg-gray-900 dark:bg-white ring-2 ring-gray-900 dark:ring-white"
                        : "bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[13px] font-bold ${selectedPackage === i ? "text-white dark:text-gray-900" : "text-gray-900 dark:text-white"}`}
                      >
                        {pkg.name}
                      </span>
                      <span
                        className={`text-[14px] font-bold ${selectedPackage === i ? "text-emerald-400 dark:text-emerald-600" : "text-emerald-600 dark:text-emerald-400"}`}
                      >
                        {pkg.price}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                      {pkg.features.map((f) => (
                        <span
                          key={f}
                          className={`text-[10px] ${selectedPackage === i ? "text-white/60 dark:text-gray-900/50" : "text-gray-400"}`}
                        >
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-gray-900 dark:text-white mb-2.5 uppercase tracking-wider">
                Add-ons
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Extra Hours", "Drone Shots", "Photo Album", "Same-day Edit"].map((addon) => (
                  <button
                    key={addon}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
                  >
                    + {addon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] text-gray-400 font-medium">Total</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{packages[selectedPackage].price}</p>
            </div>
            {selectedDate && (
              <span className="text-[10px] font-medium text-gray-400 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                {selectedDate}
              </span>
            )}
          </div>
          <div className="flex gap-2.5">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center gap-2"
            >
              <MessageSquare size={14} className="text-gray-700 dark:text-gray-300" />
              <span className="text-[12px] font-semibold text-gray-700 dark:text-gray-300">Chat First</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap size={14} className="text-white dark:text-gray-900" />
              <span className="text-[12px] font-bold text-white dark:text-gray-900">Confirm Booking</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const SearchModalComponent = ({
  searchInputRef,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  searchResults,
  handleSearchResultClick,
  isSearching,
}) => (
  <div
    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-16 px-4"
    onClick={() => setIsSearchOpen(false)}
  >
    <div
      className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events, services, vendors…"
          className="flex-1 text-sm outline-none text-gray-800 dark:text-white placeholder:text-gray-400 bg-transparent"
        />
        {isSearching && <Loader2 size={16} className="animate-spin text-gray-400" />}
        {searchQuery ? (
          <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        ) : (
          <kbd className="text-xs text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 font-mono shrink-0">
            ESC
          </kbd>
        )}
      </div>
      {searchResults.length > 0 ? (
        <ul className="max-h-72 overflow-y-auto py-2 divide-y divide-gray-50 dark:divide-gray-800">
          {searchResults.map((result, i) => (
            <li key={i}>
              <button
                onClick={() => handleSearchResultClick(result)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <div className="shrink-0 flex items-center justify-center w-10 h-12 rounded-lg bg-gray-50 dark:bg-gray-800/50 overflow-hidden relative border border-gray-100 dark:border-gray-700/50">
                  {result.type === "reel" && result.reel?.thumbnail ? (
                    <>
                      <SmartMedia
                        src={result.reel.thumbnail}
                        alt={result.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <Play size={12} className="text-white fill-white opacity-80" />
                      </div>
                    </>
                  ) : (
                    <span className="text-lg">
                      {result.type === "event" ? "🎉" : result.type === "category" ? "📌" : "🏢"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{result.label}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{result.sublabel}</p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize shrink-0 ${
                    result.type === "reel"
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : result.type === "event"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : result.type === "category"
                          ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  }`}
                >
                  {result.type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : searchQuery.trim() && !isSearching ? (
        <div className="py-12 text-center">
          <p className="text-gray-400 text-sm">
            No results for{" "}
            <span className="font-medium text-gray-600 dark:text-gray-300">&quot;{searchQuery}&quot;</span>
          </p>
        </div>
      ) : !searchQuery.trim() ? (
        <div className="px-4 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick Search</p>
          <div className="flex flex-wrap gap-2">
            {["Wedding", "Birthday", "Anniversary", "Corporate", "Catering", "Venues", "Decor", "Photographers"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400 transition-colors"
                >
                  {tag}
                </button>
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  </div>
);

export default function IdeasPageWrapper() {
  const { setIsNavbarVisible } = useNavbarVisibilityStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const urlType = searchParams.get("type") || null;
  const urlCategory = searchParams.get("category") || null;
  const urlSubcategory = searchParams.get("subcategory") || null;
  const urlSort = searchParams.get("sort") || "relevance";
  const urlRating = searchParams.get("rating") ? parseFloat(searchParams.get("rating")) : null;
  const urlLocation = searchParams.get("location") || null;
  const urlReel = searchParams.get("reel") || null;
  const urlSearch = searchParams.get("q") || "";
  const urlSubType = searchParams.get("subType") || searchParams.get("wf") || "all";
  const urlNestedType = searchParams.get("nestedType") || "all";

  const [isDirectReelLoading, setIsDirectReelLoading] = useState(!!urlReel);

  const { user, isLoaded } = useUser();
  const [userInteractions, setUserInteractions] = useState({ liked: new Set(), saved: new Set() });

  useEffect(() => {
    if (urlReel) {
      setIsNavbarVisible(false);
      fetchReelById(urlReel).then((raw) => {
        if (raw) {
          const reel = normalizeReel(raw);
          setReelsViewerData({ reels: [reel], initialIndex: 0 });
        } else {
          // Fallback if reel not found
          setIsNavbarVisible(true);
        }
        setIsDirectReelLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchInteractions = async () => {
      try {
        const res = await fetch(`/api/user/interactionsLists?userId=${user.id}`);
        const data = await res.json();
        if (data.success) {
          const likedIds = new Set(data.reels?.liked?.map((r) => r._id) || []);
          const savedIds = new Set(data.reels?.watchlist?.map((r) => r._id) || []);
          setUserInteractions({ liked: likedIds, saved: savedIds });
        }
      } catch (err) {
        console.error("Failed to fetch user interactions:", err);
      }
    };

    fetchInteractions();
  }, [isLoaded, user]);

  const [eventType, setEventType] = useState(urlType);
  const [eventLabel, setEventLabel] = useState(() => {
    if (!urlType) return "";
    const main = ["wedding", "birthday", "anniversary", "corporate"];
    if (main.includes(urlType)) return urlType.charAt(0).toUpperCase() + urlType.slice(1);
    const other = OTHER_EVENT_TYPES.find((e) => e.id === urlType);
    return other ? other.label : urlType.charAt(0).toUpperCase() + urlType.slice(1);
  });

  const [showModal, setShowModal] = useState(!urlType);
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [activeSubcategory, setActiveSubcategory] = useState(urlSubcategory);
  const [activeSubType, setActiveSubType] = useState(urlSubType);
  const [activeNestedType, setActiveNestedType] = useState(urlNestedType);

  const [reelsViewerData, setReelsViewerData] = useState(null);
  const [drawerItem, setDrawerItem] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterState, setFilterState] = useState({
    sort: urlSort,
    minRating: urlRating,
    priceRange: null,
    location: urlLocation,
  });

  const [isSearchOpen, setIsSearchOpen] = useState(!!urlSearch);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  const [carouselSections, setCarouselSections] = useState([]);
  const [isLoadingCarousels, setIsLoadingCarousels] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [trendingReels, setTrendingReels] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [recentlyViewedReels, setRecentlyViewedReels] = useState([]);

  const pendingReelIdRef = useRef(urlReel);
  const fetchVersionRef = useRef(0);

  const getURLParams = useCallback(() => {
    const params = {};
    if (eventType) params.type = eventType;
    if (activeCategory) params.category = activeCategory;
    if (activeSubcategory) params.subcategory = activeSubcategory;
    if (activeSubType && activeSubType !== "all") params.subType = activeSubType;
    if (activeNestedType && activeNestedType !== "all") params.nestedType = activeNestedType;
    if (filterState.sort && filterState.sort !== "relevance") params.sort = filterState.sort;
    if (filterState.minRating) params.rating = String(filterState.minRating);
    if (filterState.location) params.location = filterState.location;
    return params;
  }, [eventType, activeCategory, activeSubcategory, activeSubType, activeNestedType, filterState]);

  const syncURL = useCallback(
    (extra = {}) => {
      const params = { ...getURLParams(), ...extra };
      Object.keys(params).forEach((k) => {
        if (params[k] === null || params[k] === undefined || params[k] === "") delete params[k];
      });
      replaceURLParams(pathname, params);
    },
    [getURLParams, pathname],
  );

  useEffect(() => {
    if (showModal) return;
    syncURL();
  }, [eventType, activeCategory, activeSubcategory, activeSubType, activeNestedType, filterState, showModal, syncURL]);

  useEffect(() => {
    setRecentlyViewedReels(getRecentlyViewed());
  }, [reelsViewerData]);

  useEffect(() => {
    if (showModal || !eventType) {
      setIsNavbarVisible(false);
      return;
    }
    const shouldHide = !!reelsViewerData || !!drawerItem || showFilter || isSearchOpen;
    setIsNavbarVisible(!shouldHide);
  }, [showModal, eventType, reelsViewerData, drawerItem, showFilter, isSearchOpen, setIsNavbarVisible]);

  const config = useMemo(() => {
    if (!eventType) return null;
    return EVENT_CONFIGS[eventType] || getDefaultConfigForOther(eventType);
  }, [eventType]);

  const activeCategoryData = useMemo(() => {
    if (!config || !activeCategory) return null;
    return config.categories.find((s) => s.id === activeCategory) || null;
  }, [config, activeCategory]);

  const getDynamicHeading = useCallback((index) => {
    return EVENT_SECTION_HEADINGS[index % EVENT_SECTION_HEADINGS.length];
  }, []);

  const dynamicQuickFilters = useMemo(() => {
    if (!eventType) return [];
    const types = REEL_SUBTYPES[eventType] || [];
    if (types.length === 0) return [];
    return [{ id: "all", label: "All" }, ...types.map(t => ({ id: t.value, label: t.label }))];
  }, [eventType]);

  const dynamicNestedFilters = useMemo(() => {
    if (!eventType || activeSubType === "all") return [];
    const subtypeObj = (REEL_SUBTYPES[eventType] || []).find(t => t.value === activeSubType);
    if (!subtypeObj || !subtypeObj.nestedTypes || subtypeObj.nestedTypes.length === 0) return [];
    
    return [{ id: "all", label: "All" }, ...subtypeObj.nestedTypes.map(nt => ({ id: nt.value, label: nt.label }))];
  }, [eventType, activeSubType]);

  useEffect(() => {
    if (!eventType || !config) return;

    const version = ++fetchVersionRef.current;
    let cancelled = false;

    const loadReels = async () => {
      setIsLoadingCarousels(true);

      const baseParams = {
        type: config.type || eventType,
        isActive: "true",
        limit: 50,
      };

      if (activeCategory) baseParams.category = activeCategory;
      if (activeSubcategory) baseParams.subcategory = activeSubcategory;
      if (activeSubType && activeSubType !== "all") baseParams.subType = activeSubType;
      if (activeNestedType && activeNestedType !== "all") baseParams.nestedType = activeNestedType;
      if (filterState.location) baseParams.city = filterState.location;

      if (filterState.sort === "trending") {
        baseParams.sortBy = "viewCount";
        baseParams.sortOrder = "desc";
      } else if (filterState.sort === "rating") {
        baseParams.sortBy = "priority";
        baseParams.sortOrder = "desc";
      } else if (filterState.sort === "newest") {
        baseParams.sortBy = "createdAt";
        baseParams.sortOrder = "desc";
      } else {
        baseParams.sortBy = "priority";
        baseParams.sortOrder = "desc";
      }

      if (filterState.minRating) baseParams.minPriority = Math.round(((filterState.minRating - 3.5) / 1.5) * 100);

      try {
        const [mainResult, featuredResult, trendingResult, customSectionsResult] = await Promise.all([
          fetchReels(baseParams),
          fetchFeaturedReels({ limit: 15, type: eventType }),
          fetchTrendingReels({ limit: 15, type: eventType }),
          fetchCustomReelSections(baseParams)
        ]);

        if (cancelled || version !== fetchVersionRef.current) return;

        const allReels = (mainResult.data || []).map(normalizeReel);
        const featuredReels = (featuredResult.reels || []).map(normalizeReel);
        const tReels = (trendingResult.reels || []).map(normalizeReel);

        const customSecs = (customSectionsResult.data || []).map(sec => ({
          ...sec,
          items: sec.items.map(normalizeReel)
        }));

        setTrendingReels(tReels);
        setPaginationInfo(mainResult.pagination || null);

        const sections = [];
        let headingIdx = 0;

        if (activeCategory) {
          const categoryLabel = activeCategoryData?.label || activeCategory;
          if (activeSubcategory) {
            const subcategoryLabel =
              activeCategoryData?.subcategories?.find((n) => n.id === activeSubcategory)?.label || activeSubcategory;
            const half = Math.ceil(allReels.length / 2);
            if (allReels.length > 0) {
              sections.push({
                id: `${activeSubcategory}-top`,
                title: `${subcategoryLabel} — Top Picks`,
                items: allReels.slice(0, half),
              });
              if (allReels.length > half) {
                sections.push({
                  id: `${activeSubcategory}-more`,
                  title: `More ${subcategoryLabel}`,
                  items: allReels.slice(half),
                });
              }
            }
          } else if (allReels.length > 0) {
            if (allReels.length > 15) {
              sections.push({
                id: `${activeCategory}-top`,
                title: `Top ${categoryLabel}`,
                items: allReels.slice(0, 15),
              });
              sections.push({
                id: `${activeCategory}-more`,
                title: `More ${categoryLabel}`,
                items: allReels.slice(15),
              });
            } else {
              sections.push({
                id: `${activeCategory}-main`,
                title: `${categoryLabel} Reels`,
                items: allReels,
              });
            }
          }
        } else {
          const categoryGroups = {};
          allReels.forEach((reel) => {
            const cat = reel.category || "general";
            if (!categoryGroups[cat]) categoryGroups[cat] = [];
            categoryGroups[cat].push(reel);
          });

          const entries = Object.entries(categoryGroups);
          if (entries.length > 1) {
            entries.forEach(([cat, items]) => {
              const label = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ");
              sections.push({ id: `cat-${cat}`, title: getDynamicHeading(headingIdx++), items });
            });
          } else if (allReels.length > 0) {
            if (allReels.length > 20) {
              sections.push({
                id: "all-top",
                title: `Top ${eventLabel}`,
                items: allReels.slice(0, 15),
              });
              sections.push({
                id: "all-more",
                title: `Explore More`,
                items: allReels.slice(15),
              });
            } else {
              sections.push({
                id: "all-reels",
                title: `${eventLabel} Reels`,
                items: allReels,
              });
            }
          }
        }

        const pinnedReels = allReels.filter((r) => r.isPinned || r.isSponsored);
        if (pinnedReels.length > 0) {
          sections.unshift({
            id: "sponsored",
            title: "💎 Premium Services",
            items: pinnedReels,
          });
        }

        if (featuredReels.length > 0) {
          sections.push({
            id: "featured",
            title: "❤️ Couples' Favorite Picks",
            items: featuredReels,
          });
        }

        if (tReels.length > 0) {
          sections.push({
            id: "trending",
            title: "🔥 Trending Now",
            items: tReels,
          });
        }

        // 🔥 ADDED: Dynamic Interleaving Logic
        const finalSections = [];
        let customIdx = 0;
        let regularIdx = 0;
        const REGULAR_INTERVAL = 2; // Inject 1 custom section every 2 regular sections

        // Guarantee highest priority custom section is always absolutely top
        if (customSecs.length > 0) {
          finalSections.push(customSecs[customIdx]);
          customIdx++;
        }

        // Interleave the rest
        while (regularIdx < sections.length || customIdx < customSecs.length) {
          for (let i = 0; i < REGULAR_INTERVAL && regularIdx < sections.length; i++) {
            finalSections.push(sections[regularIdx]);
            regularIdx++;
          }
          if (customIdx < customSecs.length) {
            finalSections.push(customSecs[customIdx]);
            customIdx++;
          }
        }

        setCarouselSections(finalSections);
        setInitialLoadDone(true);

      } catch {
        if (!cancelled && version === fetchVersionRef.current) {
          setCarouselSections([]);
          setInitialLoadDone(true);
        }
      } finally {
        if (!cancelled && version === fetchVersionRef.current) setIsLoadingCarousels(false);
      }
    };

    loadReels();
    return () => {
      cancelled = true;
    };
  }, [
    eventType,
    activeCategory,
    activeSubcategory,
    filterState,
    activeSubType,
    activeNestedType,
    config,
    activeCategoryData,
    eventLabel,
    getDynamicHeading,
  ]);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const sp = { limit: 8 };
        if (eventType) sp.type = eventType;

        const apiResults = await searchReelsAPI(searchQuery.trim(), sp);
        const reelResults = (apiResults.reels || []).map((r) => ({
          type: "reel",
          label: r.title,
          sublabel: [r.vendorName, r.category, r.city].filter(Boolean).join(" · "),
          reel: normalizeReel(r),
          eventId: r.type,
          categoryId: r.category,
        }));

        const localResults = [];
        Object.entries(EVENT_CONFIGS).forEach(([eventKey, cfg]) => {
          const eLabel = eventKey.charAt(0).toUpperCase() + eventKey.slice(1);
          if (eLabel.toLowerCase().includes(searchQuery.toLowerCase())) {
            localResults.push({ type: "event", label: eLabel, sublabel: "Event Category", eventId: eventKey });
          }
          cfg.categories?.forEach((cat) => {
            if (cat.label.toLowerCase().includes(searchQuery.toLowerCase())) {
              localResults.push({
                type: "category",
                label: cat.label,
                sublabel: `${eLabel} › Service`,
                eventId: eventKey,
                categoryId: cat.id,
              });
            }
          });
        });

        setSearchResults([...reelResults, ...localResults].slice(0, 12));
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, eventType]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
    else {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  const handleSearchResultClick = (result) => {
    setIsSearchOpen(false);
    if (result.type === "reel" && result.reel) {
      setReelsViewerData({ reels: [result.reel], initialIndex: 0 });
      syncURL({ reel: result.reel._id, q: null });
      return;
    }
    if (result.eventId && result.eventId !== eventType) {
      setEventType(result.eventId);
      setEventLabel(result.eventId.charAt(0).toUpperCase() + result.eventId.slice(1));
      setShowModal(false);
      setActiveCategory(null);
      setActiveSubcategory(null);
      setActiveSubType("all");
      setInitialLoadDone(false);
    }
    if (result.categoryId) setActiveCategory(result.categoryId);
  };

  const carouselLayout = useMemo(() => buildCarouselLayout(carouselSections), [carouselSections]);

  const handleEventSelect = (type, label) => {
    setEventType(type);
    setEventLabel(label);
    setShowModal(false);
    setActiveCategory(null);
    setActiveSubcategory(null);
    setActiveSubType("all");
    setActiveNestedType("all");
    setInitialLoadDone(false);
  };

  const handleCategoryClick = (categoryId) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
      setActiveSubcategory(null);
    } else {
      setActiveCategory(categoryId);
      setActiveSubcategory(null);
    }
    setInitialLoadDone(false);
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setActiveSubcategory(activeSubcategory === subcategoryId ? null : subcategoryId);
    setInitialLoadDone(false);
  };

  const handleSubTypeClick = (filterId) => {
    setActiveSubType(filterId);
    setActiveNestedType("all");
    setInitialLoadDone(false);
  };

  const handleNestedTypeClick = (filterId) => { // 👈 NEW HANDLER
    setActiveNestedType(filterId);
    setInitialLoadDone(false);
  };

  const handleItemClick = useCallback(
    (item, allItems, index) => {
      setReelsViewerData({ reels: allItems, initialIndex: index });
      setIsNavbarVisible(false);
    },
    [setIsNavbarVisible],
  );

  const handleBookNow = (item) => {
    setDrawerItem(item);
    setIsNavbarVisible(false);
  };

  const handleCloseReels = useCallback(() => {
    setReelsViewerData(null);
    setIsNavbarVisible(true);

    const cleanReelFromUrl = () => {
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has("reel")) {
          url.searchParams.delete("reel");
          window.history.replaceState(null, "", url.pathname + url.search);
        }
      } catch (_) {}
    };

    // Immediate attempt
    cleanReelFromUrl();
    // Delayed: history.back() in modal is async,
    // URL may not reflect the back-navigation yet
    setTimeout(cleanReelFromUrl, 100);

    setRecentlyViewedReels(getRecentlyViewed());
  }, [setIsNavbarVisible]);

  const handleCloseDrawer = () => {
    setDrawerItem(null);
  };

  const handleRefresh = () => {
    setInitialLoadDone(false);
    setCarouselSections([]);
    setFilterState((prev) => ({ ...prev }));
  };

  if (showModal || !eventType || !config) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <AnimatePresence>
          <EventSelectionModal onSelect={handleEventSelect} />
        </AnimatePresence>
      </div>
    );
  }

  const activeFilterCount = [
    filterState.sort !== "relevance",
    filterState.minRating,
    filterState.priceRange,
    filterState.location,
  ].filter(Boolean).length;

  const isWeddingType = eventType === "wedding";

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pb-10">
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>

      <div className="sticky top-0 z-50 px-3 py-2.5 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-xl rounded-b-2xl flex items-center gap-2.5">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowModal(true);
            setEventType(null);
            setActiveCategory(null);
            setActiveSubcategory(null);
            setActiveSubType("all");
            setInitialLoadDone(false);
            window.history.replaceState(null, "", pathname);
          }}
          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
        >
          <ArrowLeft size={16} />
        </motion.button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[15px] font-bold text-gray-900 dark:text-white truncate tracking-tight">
            {eventLabel} Ideas
          </h1>
          <p className="text-[10px] text-gray-400 font-medium">
            {activeCategory
              ? `${activeCategoryData?.label || ""} ${activeSubcategory ? `› ${activeCategoryData?.subcategories?.find((n) => n.id === activeSubcategory)?.label || ""}` : ""}`
              : "Explore all categories"}
            {paginationInfo?.total > 0 && ` · ${paginationInfo.total} reels`}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleRefresh}
          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400"
        >
          <RefreshCw size={14} className={isLoadingCarousels ? "animate-spin" : ""} />
        </motion.button>
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400"
          aria-label="Open search"
        >
          <Search size={16} />
        </button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowFilter(true)}
          className="relative w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400"
        >
          <Filter size={14} />
          {activeFilterCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
              <span className="text-white dark:text-gray-900 text-[7px] font-bold">{activeFilterCount}</span>
            </span>
          )}
        </motion.button>
      </div>

      {dynamicQuickFilters.length > 0 && (
        <QuickFiltersCarousel
          activeFilter={activeSubType}
          onFilterClick={handleSubTypeClick}
          filters={dynamicQuickFilters}
        />
      )}

      <AnimatePresence>
        {dynamicNestedFilters.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Using the SubcategoryChips component so it looks visually distinct from the main filters */}
            <SubcategoryChips
              subcategories={dynamicNestedFilters}
              activeSubcategory={activeNestedType}
              onSubcategoryClick={handleNestedTypeClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-100/80 dark:border-gray-800/80">
        <CategoryGridCarousel
          categories={config.categories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
        <AnimatePresence>
          {activeCategoryData?.subcategories && activeCategoryData.subcategories.length > 0 && (
            <SubcategoryChips
              key={activeCategory}
              subcategories={activeCategoryData.subcategories}
              activeSubcategory={activeSubcategory}
              onSubcategoryClick={handleSubcategoryClick}
            />
          )}
        </AnimatePresence>
      </div>

      {activeFilterCount > 0 && (
        <div className="px-4 pt-3 pb-1 flex gap-2 flex-wrap">
          {filterState.sort !== "relevance" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-[10px] font-semibold">
              {filterState.sort === "trending" ? "Trending" : filterState.sort === "rating" ? "Top Rated" : "Newest"}
              <button onClick={() => setFilterState((p) => ({ ...p, sort: "relevance" }))}>
                <X size={10} />
              </button>
            </span>
          )}
          {filterState.location && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-[10px] font-semibold">
              <MapPin size={8} />
              {filterState.location}
              <button onClick={() => setFilterState((p) => ({ ...p, location: null }))}>
                <X size={10} />
              </button>
            </span>
          )}
          {filterState.minRating && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-[10px] font-semibold">
              <Star size={8} />
              {filterState.minRating}+
              <button onClick={() => setFilterState((p) => ({ ...p, minRating: null }))}>
                <X size={10} />
              </button>
            </span>
          )}
        </div>
      )}

      {isDirectReelLoading ? (
        <div className="flex flex-col items-center justify-center py-32 h-[50vh]">
          <Loader2 size={32} className="animate-spin text-gray-400 mb-4" />
          <p className="text-gray-400 text-xs font-medium">Loading Reel...</p>
        </div>
      ) : isLoadingCarousels && !initialLoadDone ? (
        <FullPageSkeleton />
      ) : initialLoadDone ? (
        <div className="pt-4 space-y-1">
          <div className="pt-4 space-y-1">
            {carouselLayout.length > 0 ? (
              carouselLayout.map(({ section, type }) =>
                type === "single" ? (
                  <SingleRowCarousel key={section.id} section={section} onItemClick={handleItemClick} />
                ) : (
                  <TwoRowGridCarousel key={section.id} section={section} onItemClick={handleItemClick} />
                ),
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                  <Search size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">No reels found</p>
                <p className="text-[12px] text-gray-400 mb-4">
                  Try selecting a different category or adjusting filters
                </p>
                {activeFilterCount > 0 && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setFilterState({ sort: "relevance", minRating: null, priceRange: null, location: null })
                    }
                    className="px-4 py-2 bg-gray-900 dark:bg-white rounded-xl text-white dark:text-gray-900 text-xs font-semibold"
                  >
                    Clear All Filters
                  </motion.button>
                )}
              </div>
            )}

            {carouselLayout.length > 0 && (
              <div className="px-4 pt-3 pb-4">
                <div
                  onClick={() => {
                    setFilterState((p) => ({ ...p, sort: "trending" }));
                    setInitialLoadDone(false);
                  }}
                  className="bg-gray-900 dark:bg-white rounded-2xl p-4 flex items-center gap-3 cursor-pointer active:opacity-90 transition-opacity"
                >
                  <div className="w-10 h-10 bg-white/10 dark:bg-gray-900/10 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp size={18} className="text-white dark:text-gray-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12px] font-bold text-white dark:text-gray-900">Trending in {eventLabel}</h4>
                    <p className="text-[10px] text-white/50 dark:text-gray-900/50 mt-0.5">
                      {trendingReels.length > 0
                        ? `${trendingReels.length} trending reels this month`
                        : "See what others are booking this season"}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-white/40 dark:text-gray-900/30 shrink-0" />
                </div>
              </div>
            )}

            {paginationInfo?.hasNextPage && carouselLayout.length > 0 && (
              <div className="px-4 pb-4">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={async () => {
                    const nextPage = (paginationInfo.page || 1) + 1;
                    const params = {
                      type: config.type || eventType,
                      isActive: "true",
                      limit: 50,
                      page: nextPage,
                    };
                    if (activeCategory) params.category = activeCategory;
                    if (activeSubcategory) params.subcategory = activeSubcategory;
                    if (filterState.location) params.city = filterState.location;
                    if (activeSubType && activeSubType !== "all") {
                      params.subType = activeSubType;
                    }

                    if (filterState.sort === "trending") {
                      params.sortBy = "viewCount";
                      params.sortOrder = "desc";
                    } else if (filterState.sort === "rating") {
                      params.sortBy = "priority";
                      params.sortOrder = "desc";
                    } else if (filterState.sort === "newest") {
                      params.sortBy = "createdAt";
                      params.sortOrder = "desc";
                    } else {
                      params.sortBy = "priority";
                      params.sortOrder = "desc";
                    }

                    const result = await fetchReels(params);
                    const moreReels = (result.data || []).map(normalizeReel);
                    if (moreReels.length > 0) {
                      setCarouselSections((prev) => [
                        ...prev,
                        { id: `page-${nextPage}`, title: `More ${eventLabel} Reels`, items: moreReels },
                      ]);
                      setPaginationInfo(result.pagination || null);
                    }
                  }}
                  className="w-full py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 font-semibold text-[12px]"
                >
                  <ChevronDown size={14} />
                  Load More Reels
                </motion.button>
              </div>
            )}

            {recentlyViewedReels.length > 0 && (
              <SingleRowCarousel
                section={{ id: "recently-viewed", title: "🕐 Recently Viewed", items: recentlyViewedReels }}
                onItemClick={handleItemClick}
              />
            )}
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        {reelsViewerData && (
          <ReelsViewerModal
            reels={reelsViewerData.reels}
            initialIndex={reelsViewerData.initialIndex}
            onClose={handleCloseReels}
            onBookNow={handleBookNow}
            userInteractions={userInteractions}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{drawerItem && <BookingDrawer item={drawerItem} onClose={handleCloseDrawer} />}</AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchModalComponent
            searchInputRef={searchInputRef}
            handleSearchResultClick={handleSearchResultClick}
            searchResults={searchResults}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            setIsSearchOpen={setIsSearchOpen}
            isSearching={isSearching}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFilter && (
          <FilterDrawer
            initialFilter={filterState}
            onApply={(f) => {
              setFilterState(f);
              setShowFilter(false);
              setInitialLoadDone(false);
            }}
            onClose={() => setShowFilter(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
