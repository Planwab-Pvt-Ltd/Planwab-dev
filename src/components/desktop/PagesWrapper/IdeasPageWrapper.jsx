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
  Bookmark,
  BookmarkCheck,
  BadgeCheck,
  ChevronDown,
  Search,
  TrendingUp,
  Zap,
  Send,
  ExternalLink,
  Calendar,
  Volume2,
  VolumeX,
  Loader2,
  Eye,
  RefreshCw,
  Plane,
  Mail,
  Diamond,
  Info,
  Headphones,
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ShareModal } from "./VendorProfilePageWrapper";
import { useUser } from "@clerk/nextjs";
import SmartMedia from "../SmartMediaLoader";
import { useNavigationState } from "../../../hooks/useNavigationState";

const DESKTOP_TOP_OFFSET = 110;

// --- HIERARCHY: category -> subcategory ---
const EVENT_CONFIGS = {
  wedding: {
    type: "wedding",
    // HIERARCHY: subType (Quick Filters / Moments)
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
  "Trending Vendors Near You",
  "Most Booked Experts",
  "Trending Inspiration",
  "Top Rated in Your City",
  "Popular Venues Near You",
  "Stunning Decor Ideas",
  "Most Loved Services",
  "Viral Reels (Must Watch)",
  "Users' Favorite Picks",
  "Perfect Matches For You",
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

const normalizeReel = (reel) => ({
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
  description: reel.description || "",
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
    className={`animate-pulse rounded-xl ${className}`}
    style={{
      background: "linear-gradient(90deg,#f5f0eb 25%,#efe8e1 50%,#f5f0eb 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s ease-in-out infinite",
    }}
  />
);

const FullPageSkeleton = () => (
  <div className="space-y-10">
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
    {Array.from({ length: 4 }).map((_, idx) => (
      <div key={idx} className="space-y-3">
        <ShimmerBlock className="h-5 w-56" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((__, j) => (
            <ShimmerBlock key={j} className="w-[185px] aspect-[9/16] shrink-0 rounded-2xl" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const DesktopSidebar = ({
  config,
  eventLabel,
  activeCategory,
  activeSubcategory,
  onCategoryClick,
  onSubcategoryClick,
  onChangeEvent,
  activeSubType,
  onSubTypeClick,
}) => (
  <aside
    style={{ top: DESKTOP_TOP_OFFSET, height: `calc(100vh - ${DESKTOP_TOP_OFFSET}px)` }}
    className="w-[256px] xl:w-[272px] 2xl:w-[288px] border-r border-rose-100/60 dark:border-stone-800 bg-white dark:bg-stone-950 sticky overflow-y-auto"
  >
    <div className="p-4 xl:p-5 border-b border-rose-100/50 dark:border-stone-800">
      <button onClick={onChangeEvent} className="w-full text-left group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold text-stone-800 dark:text-stone-100 truncate leading-tight">
              {eventLabel} Ideas
            </h2>
            <p className="text-[11px] text-stone-400 group-hover:text-rose-500 transition-colors mt-0.5">
              Change event ›
            </p>
          </div>
        </div>
      </button>
    </div>

    {config.quickFilters && config.quickFilters.length > 0 && (
      <div className="p-4 xl:p-5 border-b border-rose-100/50 dark:border-stone-800">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400 mb-2">Moments & Styles</p>
        <div className="flex flex-wrap gap-1.5">
          {config.quickFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => onSubTypeClick(f.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                activeSubType === f.id
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-rose-50/60 dark:bg-stone-900 text-stone-500 dark:text-stone-400 hover:bg-rose-100 dark:hover:bg-stone-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    )}

    <div className="p-4 xl:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400 mb-2">Categories</p>
      <div className="space-y-0.5">
        <button
          onClick={() => onCategoryClick(null)}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left ${
            !activeCategory
              ? "bg-rose-500 text-white shadow-sm"
              : "text-stone-600 dark:text-stone-400 hover:bg-rose-50/50 dark:hover:bg-stone-900"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              !activeCategory ? "bg-white/20" : "bg-stone-100 dark:bg-stone-800"
            }`}
          >
            <Sparkles size={14} className={!activeCategory ? "text-white" : "text-stone-400"} />
          </div>
          <span className="font-semibold text-[13px]">All</span>
        </button>

        {config.categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <div key={category.id}>
              <button
                onClick={() => onCategoryClick(category.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left ${
                  isActive
                    ? "bg-rose-50 dark:bg-stone-900 text-rose-700 dark:text-rose-300"
                    : "text-stone-600 dark:text-stone-400 hover:bg-rose-50/50 dark:hover:bg-stone-900"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? "bg-rose-100 dark:bg-stone-800" : "bg-stone-100/80 dark:bg-stone-800/60"
                  }`}
                >
                  <span
                    className={isActive ? "text-rose-600 dark:text-rose-300" : "text-stone-400 dark:text-stone-500"}
                  >
                    {category.icon}
                  </span>
                </div>
                <span className={`font-medium text-[13px] flex-1 truncate ${isActive ? "font-semibold" : ""}`}>
                  {category.label}
                </span>
                {category.subcategories && (
                  <ChevronRight
                    size={13}
                    className={`transition-transform shrink-0 ${isActive ? "rotate-90 text-rose-400" : "text-stone-300"}`}
                  />
                )}
              </button>
              <AnimatePresence>
                {isActive && category.subcategories?.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-[52px] pr-2 pt-1 pb-1 space-y-0.5">
                      {category.subcategories.map((subcat) => (
                        <button
                          key={subcat.id}
                          onClick={() => onSubcategoryClick(subcat.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${
                            activeSubcategory === subcat.id
                              ? "bg-rose-500 text-white"
                              : "text-stone-500 dark:text-stone-400 hover:text-rose-600 hover:bg-rose-50/60 dark:hover:bg-stone-800"
                          }`}
                        >
                          {subcat.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  </aside>
);

const DesktopHero = ({ eventLabel, activeCategoryData, activeSubcategory }) => (
  <div className="rounded-2xl px-6 xl:px-7 py-5 xl:py-6 bg-gradient-to-r from-rose-50/80 via-amber-50/40 to-violet-50/50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 border border-rose-100/50 dark:border-stone-800 mt-18">
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/70 dark:bg-stone-800 text-[10px] font-semibold uppercase tracking-[0.1em] text-rose-500 mb-3">
      <Sparkles size={10} /> Curated for you
    </div>
    <h1 className="text-2xl xl:text-[28px] font-bold tracking-tight text-stone-800 dark:text-stone-100">
      {activeCategoryData ? activeCategoryData.label : eventLabel} Ideas
    </h1>
    <p className="mt-1.5 text-stone-500 dark:text-stone-400 text-[13px] max-w-xl leading-relaxed">
      {activeSubcategory
        ? `Exploring ${activeCategoryData?.subcategories?.find((n) => n.id === activeSubcategory)?.label || ""} in ${activeCategoryData?.label || eventLabel}.`
        : `Discover trending vendors, inspiration reels and top picks for your ${eventLabel.toLowerCase()}.`}
    </p>
  </div>
);

const ReelCard = ({ item, idx, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: Math.min(idx * 0.02, 0.16), duration: 0.3 }}
    onClick={onClick}
    className="cursor-pointer group snap-start"
  >
    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 ring-1 ring-stone-200/60 dark:ring-stone-700/40 group-hover:ring-rose-300/60 dark:group-hover:ring-rose-500/30 group-hover:shadow-lg group-hover:shadow-rose-100/40 transition-all duration-300">
      <SmartMedia
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
      {item.tags?.[0] && (
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-md text-[9px] font-semibold uppercase tracking-wide flex items-center gap-1 text-stone-700">
          {item.tags[0] === "Top Rated" && <Star size={8} className="fill-amber-500 text-amber-500" />}
          {item.tags[0] === "Trending" && <TrendingUp size={8} className="text-rose-500" />}
          {item.tags[0] === "Sponsored" && <Zap size={8} className="text-violet-500" />}
          {item.tags[0]}
        </div>
      )}
      <div className="absolute top-2.5 right-2.5 w-7 h-7 bg-black/25 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Play size={10} className="text-white fill-white ml-px" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white font-semibold text-[12px] leading-snug line-clamp-2">{item.title}</p>
        <div className="mt-1 flex items-center gap-2 text-white/70 text-[10px]">
          <span className="flex items-center gap-0.5">
            <Star size={8} className="fill-amber-400 text-amber-400" />
            {item.rating}
          </span>
          {item.location && (
            <span className="flex items-center gap-0.5 truncate">
              <MapPin size={8} />
              {item.location}
            </span>
          )}
        </div>
        {item.price && <p className="text-emerald-300 font-semibold text-[11px] mt-1">{item.price}</p>}
      </div>
    </div>
  </motion.div>
);

const FeaturedReelCard = ({ item, idx, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: Math.min(idx * 0.02, 0.16), duration: 0.3 }}
    onClick={onClick}
    className="cursor-pointer group snap-start"
  >
    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 ring-1 ring-rose-200/40 dark:ring-rose-800/30 group-hover:ring-rose-300 dark:group-hover:ring-rose-500/40 group-hover:shadow-xl group-hover:shadow-rose-100/50 transition-all duration-300">
      <SmartMedia
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-rose-500/5" />
      {item.tags?.[0] && (
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg text-[9px] font-bold uppercase tracking-wide text-white shadow-sm flex items-center gap-1">
          {item.tags[0] === "Top Rated" && <Star size={8} className="fill-white text-white" />}
          {item.tags[0] === "Trending" && <TrendingUp size={8} />}
          {item.tags[0] === "Sponsored" && <Zap size={8} />}
          {item.tags[0]}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        <p className="text-white font-bold text-[13px] leading-snug line-clamp-2">{item.title}</p>
        <div className="mt-1.5 flex items-center gap-2.5 text-white/75 text-[10px]">
          <span className="flex items-center gap-0.5">
            <Star size={8} className="fill-amber-400 text-amber-400" />
            {item.rating}
          </span>
          {item.location && (
            <span className="flex items-center gap-0.5 truncate">
              <MapPin size={8} />
              {item.location}
            </span>
          )}
          {item.viewCount > 0 && (
            <span className="flex items-center gap-0.5">
              <Eye size={8} />
              {fmt(item.viewCount)}
            </span>
          )}
        </div>
        {item.price && <p className="text-emerald-300 font-bold text-[12px] mt-1.5">{item.price}</p>}
      </div>
    </div>
  </motion.div>
);

export const ScrollCarousel = memo(({ children, className = "" }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [xOffset, setXOffset] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const trackWidth = trackRef.current.offsetWidth;
    const maxOffset = -(trackWidth - containerWidth);
    
    // Logic to show/hide gradients and buttons based on exact offset
    setCanLeft(xOffset < -10);
    setCanRight(xOffset > maxOffset + 10);
  }, [xOffset]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, children]);

  useEffect(() => {
    setXOffset(0);
  }, [children]);

  const scroll = useCallback((direction) => {
    if (!containerRef.current || !trackRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const trackWidth = trackRef.current.offsetWidth;
    const maxOffset = -(trackWidth - containerWidth);
    
    // Ultra-smooth slide distance (75% of view width for a professional feel)
    const scrollAmount = containerWidth * 0.75; 

    const newOffset =
      direction === "left"
        ? Math.min(0, xOffset + scrollAmount)
        : Math.max(maxOffset, xOffset - scrollAmount);
        
    setXOffset(newOffset);
  }, [xOffset]);

  return (
    <div className={`relative ${className}`}>
      
      {/* --- Left Button --- */}
      <AnimatePresence>
        {canLeft && (
          <motion.button
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll("left")}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white shadow-2xl shadow-slate-300/50 border border-slate-100 hover:bg-slate-50 transition-all text-slate-800 group"
          >
            <ChevronLeft size={24} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* --- ORIGINAL LEFT WHITISH EFFECT --- */}
      {canLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#faf8f5] dark:from-stone-950 to-transparent z-10 pointer-events-none" />
      )}

      {/* --- Main Animated Carousel Track --- */}
      <div ref={containerRef} className="overflow-hidden relative px-5 pb-2">
        <motion.div
          ref={trackRef}
          animate={{ x: xOffset }}
          transition={{ type: "spring", stiffness: 110, damping: 22, mass: 0.85 }}
          className="flex gap-3.5"
          style={{ width: "max-content" }}
        >
          {children}
        </motion.div>
      </div>

      {/* --- ORIGINAL RIGHT WHITISH EFFECT --- */}
      {canRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#faf8f5] dark:from-stone-950 to-transparent z-10 pointer-events-none" />
      )}

      {/* --- Right Button --- */}
      <AnimatePresence>
        {canRight && (
          <motion.button
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll("right")}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white shadow-2xl shadow-slate-300/50 border border-slate-100 hover:bg-slate-50 transition-all text-slate-800 group"
          >
            <ChevronRight size={24} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
      
    </div>
  );
});

ScrollCarousel.displayName = "ScrollCarousel";

const DesktopCarouselSection = ({ section, onItemClick }) => {
  if (!section.items || section.items.length === 0) return null;
  return (
    <section className="space-y-3">
      <div className="px-5 flex items-center justify-between gap-4">
        <h3 className="text-[16px] font-bold text-stone-800 dark:text-stone-100 tracking-tight truncate">
          {section.title}
        </h3>
      </div>
      <ScrollCarousel>
        {section.items.map((item, idx) => (
          <div
            key={item.id || item._id}
            className="w-[165px] lg:w-[178px] xl:w-[190px] 2xl:w-[205px] shrink-0 snap-start"
          >
            <ReelCard item={item} idx={idx} onClick={() => onItemClick(item, section.items, idx)} />
          </div>
        ))}
      </ScrollCarousel>
    </section>
  );
};

const FeaturedCarouselSection = ({ section, onItemClick }) => {
  if (!section.items || section.items.length === 0) return null;
  return (
    <section className="rounded-2xl bg-gradient-to-r from-rose-50/50 via-pink-50/30 to-amber-50/40 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 border border-rose-100/40 dark:border-stone-800 pt-5 pb-3 space-y-3">
      <div className="px-5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-sm shrink-0">
          {section.id === "trending" ? (
            <TrendingUp size={13} className="text-white" />
          ) : section.id === "sponsored" ? (
            <Zap size={13} className="text-white" />
          ) : (
            <Star size={13} className="text-white" />
          )}
        </div>
        <h3 className="text-[16px] font-bold text-stone-800 dark:text-stone-100 tracking-tight truncate">
          {section.title}
        </h3>
      </div>
      <ScrollCarousel>
        {section.items.map((item, idx) => (
          <div
            key={item.id || item._id}
            className="w-[175px] lg:w-[190px] xl:w-[205px] 2xl:w-[218px] shrink-0 snap-start"
          >
            <FeaturedReelCard item={item} idx={idx} onClick={() => onItemClick(item, section.items, idx)} />
          </div>
        ))}
      </ScrollCarousel>
    </section>
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
    className="fixed inset-0 z-[130] bg-stone-900/20 backdrop-blur-sm flex items-start justify-center pt-[120px] px-6"
    onClick={() => setIsSearchOpen(false)}
  >
    <div
      className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl overflow-hidden border border-rose-100/50 dark:border-stone-800"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-stone-100 dark:border-stone-800">
        <Search size={16} className="text-stone-400 shrink-0" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events, services, vendors, reels…"
          className="flex-1 text-[14px] outline-none text-stone-800 dark:text-stone-100 placeholder:text-stone-400 bg-transparent"
        />
        {isSearching && <Loader2 size={15} className="animate-spin text-rose-400" />}
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X size={15} />
          </button>
        )}
      </div>
      {searchResults.length > 0 ? (
        <ul className="max-h-[55vh] overflow-y-auto py-1">
          {searchResults.map((result, i) => (
            <li key={i}>
              <button
                onClick={() => handleSearchResultClick(result)}
                className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-rose-50/50 dark:hover:bg-stone-800 transition-colors text-left"
              >
                <div className="shrink-0 flex items-center justify-center w-10 h-12 rounded-lg bg-stone-50 dark:bg-stone-800/50 overflow-hidden relative border border-stone-100 dark:border-stone-700/50">
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
                  <p className="text-[13px] font-semibold text-stone-800 dark:text-stone-100 truncate">
                    {result.label}
                  </p>
                  <p className="text-[11px] text-stone-400 truncate mt-0.5">{result.sublabel}</p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium capitalize shrink-0 ${result.type === "reel" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : result.type === "event" ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400"}`}
                >
                  {result.type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : searchQuery.trim() && !isSearching ? (
        <div className="py-14 text-center">
          <p className="text-stone-400 text-[13px]">
            No results for <span className="font-semibold text-stone-600 dark:text-stone-300">"{searchQuery}"</span>
          </p>
        </div>
      ) : !searchQuery.trim() ? (
        <div className="px-5 py-5">
          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.12em] mb-3">Quick Search</p>
          <div className="flex flex-wrap gap-1.5">
            {["Wedding", "Birthday", "Anniversary", "Corporate", "Catering", "Venues", "Decor", "Photographers"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="text-[12px] px-3 py-1.5 bg-rose-50/60 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-stone-700 rounded-lg text-stone-600 dark:text-stone-400 transition-colors font-medium"
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
        className="fixed inset-0 bg-stone-900/25 backdrop-blur-sm z-[140]"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="fixed top-0 right-0 h-full w-full max-w-[380px] bg-white dark:bg-stone-950 z-[141] border-l border-rose-100/50 dark:border-stone-800 shadow-xl flex flex-col"
      >
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-stone-800 dark:text-stone-100">Filters</h2>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-md bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-50 dark:bg-stone-900 flex items-center justify-center text-stone-400"
          >
            <X size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h4 className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.12em] mb-3">Sort By</h4>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSort(opt.id)}
                  className={`px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all ${sort === opt.id ? "bg-rose-500 text-white" : "bg-rose-50/60 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-rose-100"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.12em] mb-3">Rating</h4>
            <div className="flex gap-2 flex-wrap">
              {ratings.map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(minRating === r ? null : r)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all ${minRating === r ? "bg-rose-500 text-white" : "bg-rose-50/60 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-rose-100"}`}
                >
                  <Star
                    size={11}
                    className={minRating === r ? "fill-white text-white" : "fill-amber-400 text-amber-400"}
                  />
                  {r}+
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.12em] mb-3">Location</h4>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocation(location === loc ? null : loc)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all ${location === loc ? "bg-rose-500 text-white" : "bg-rose-50/60 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-rose-100"}`}
                >
                  <MapPin size={11} />
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
          {activeCount > 0 && (
            <button
              onClick={() => {
                setSort("relevance");
                setMinRating(null);
                setPriceRange(null);
                setLocation(null);
              }}
              className="w-full py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-500 font-medium text-[13px]"
            >
              Reset All
            </button>
          )}
          <button
            onClick={() => onApply({ sort, minRating, priceRange, location })}
            className="w-full py-3 rounded-xl bg-rose-500 text-white font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors"
          >
            <Filter size={13} />
            Apply
          </button>
        </div>
      </motion.div>
    </>
  );
};

const EventSelectionModal = ({ onSelect }) => {
  const [showOthers, setShowOthers] = useState(false);
  const [searchOther, setSearchOther] = useState("");
  const mainEvents = [
    {
      id: "wedding",
      label: "Wedding",
      icon: <HeartHandshake size={24} />,
      desc: "Plan your dream day",
      color: "from-rose-400 to-pink-500",
    },
    {
      id: "anniversary",
      label: "Anniversary",
      icon: <Heart size={24} />,
      desc: "Celebrate your love",
      color: "from-red-400 to-rose-500",
    },
    {
      id: "birthday",
      label: "Birthday",
      icon: <Cake size={24} />,
      desc: "Make it memorable",
      color: "from-amber-400 to-orange-500",
    },
    {
      id: "corporate",
      label: "Corporate",
      icon: <Building2 size={24} />,
      desc: "Professional events",
      color: "from-blue-400 to-indigo-500",
    },
  ];
  const filteredOthers = OTHER_EVENT_TYPES.filter((e) => e.label.toLowerCase().includes(searchOther.toLowerCase()));
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[160] bg-gradient-to-br from-rose-50/90 via-white/95 to-amber-50/90 dark:from-stone-950/95 dark:via-stone-950/95 dark:to-stone-950/95 backdrop-blur-xl flex items-center justify-center p-8"
    >
      <motion.div
        initial={{ y: 14, opacity: 0, scale: 0.99 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-3xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-rose-100/50 dark:border-stone-800 overflow-hidden"
      >
        <div className="px-8 xl:px-10 py-8 xl:py-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Sparkles size={20} className="text-white" />
            </div>
            <h2 className="text-3xl xl:text-[34px] font-bold text-stone-800 dark:text-stone-100 tracking-tight">
              What are you planning?
            </h2>
            <p className="text-[13px] text-stone-400 mt-2">Choose your event to explore ideas</p>
          </div>
          {!showOthers ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {mainEvents.map((event, idx) => (
                  <motion.button
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + idx * 0.04 }}
                    onClick={() => onSelect(event.id, event.label)}
                    className="p-5 rounded-xl bg-stone-50/70 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-md hover:shadow-rose-50 transition-all text-left group"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center text-white mb-3 shadow-sm group-hover:scale-105 transition-transform`}
                    >
                      {event.icon}
                    </div>
                    <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">{event.label}</h3>
                    <p className="text-[12px] text-stone-400 mt-0.5">{event.desc}</p>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => setShowOthers(true)}
                className="w-full py-3 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-500 font-medium text-[13px] flex items-center justify-center gap-2 border border-stone-100 dark:border-stone-700 hover:bg-rose-50/50 transition-colors"
              >
                <PartyPopper size={14} />
                Other Event Types
                <ChevronDown size={13} />
              </button>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button
                onClick={() => setShowOthers(false)}
                className="flex items-center gap-1.5 text-[13px] font-medium text-stone-400 hover:text-rose-500 mb-4 transition-colors"
              >
                <ArrowLeft size={13} />
                Back
              </button>
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search event type..."
                  value={searchOther}
                  onChange={(e) => setSearchOther(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl text-[13px] text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-rose-300 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto">
                {filteredOthers.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onSelect(event.id, event.label)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 hover:border-rose-200 dark:hover:border-rose-800 transition-all text-left"
                  >
                    <span className="text-[13px] font-medium text-stone-700 dark:text-stone-200">{event.label}</span>
                    <ChevronRight size={14} className="text-stone-300" />
                  </button>
                ))}
              </div>
              {filteredOthers.length === 0 && (
                <p className="text-center py-10 text-[13px] text-stone-400">No matching event types</p>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const BookingDrawer = ({ item, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const packages = [
    { name: "Basic", price: "₹15,000", features: ["4 hours", "50 photos", "Gallery"] },
    { name: "Standard", price: "₹35,000", features: ["8 hours", "200 photos", "Highlight reel", "Gallery"] },
    { name: "Premium", price: "₹65,000", features: ["Full day", "500+ photos", "Film", "Album"] },
  ];
  const dates = ["Tomorrow", "This Weekend", "Next Week", "Custom"];
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm z-[170]"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="fixed top-0 right-0 h-full w-full max-w-[440px] bg-white dark:bg-stone-950 z-[171] overflow-hidden flex flex-col shadow-xl border-l border-rose-100/50 dark:border-stone-800"
      >
        <div className="px-6 py-4 flex items-center gap-3 border-b border-stone-100 dark:border-stone-800">
          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-stone-100">
            <SmartMedia src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[14px] font-bold text-stone-800 dark:text-stone-100 truncate">
              Book {item.title || "Vendor"}
            </h2>
            <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
              <Star size={9} className="fill-amber-400 text-amber-400" />
              {item.rating?.toFixed?.(1) || "4.2"} · {item.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-50 dark:bg-stone-900 flex items-center justify-center text-stone-400"
          >
            <X size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400 mb-2.5">Date</h4>
            <div className="flex flex-wrap gap-2">
              {dates.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${selectedDate === d ? "bg-rose-500 text-white" : "bg-rose-50/60 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-rose-100"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400 mb-2.5">Package</h4>
            <div className="space-y-2">
              {packages.map((pkg, i) => (
                <button
                  key={pkg.name}
                  onClick={() => setSelectedPackage(i)}
                  className={`w-full p-3.5 rounded-xl text-left transition-all border ${selectedPackage === i ? "bg-rose-500 border-rose-500" : "bg-stone-50 dark:bg-stone-900 border-stone-100 dark:border-stone-800 hover:border-rose-200"}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[13px] font-bold ${selectedPackage === i ? "text-white" : "text-stone-800 dark:text-stone-100"}`}
                    >
                      {pkg.name}
                    </span>
                    <span
                      className={`text-[14px] font-bold ${selectedPackage === i ? "text-white/90" : "text-emerald-600"}`}
                    >
                      {pkg.price}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    {pkg.features.map((f) => (
                      <span
                        key={f}
                        className={`text-[10px] ${selectedPackage === i ? "text-white/60" : "text-stone-400"}`}
                      >
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] text-stone-400">Total</p>
              <p className="text-lg font-bold text-stone-800 dark:text-stone-100">{packages[selectedPackage].price}</p>
            </div>
            {selectedDate && (
              <span className="text-[11px] font-medium text-stone-400 bg-stone-50 dark:bg-stone-900 px-2.5 py-1 rounded-lg">
                {selectedDate}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl flex items-center justify-center gap-1.5 hover:bg-stone-100 transition-colors">
              <MessageSquare size={13} className="text-stone-600" />
              <span className="text-[12px] font-medium text-stone-600">Chat</span>
            </button>
            <button className="flex-1 py-2.5 bg-rose-500 rounded-xl flex items-center justify-center gap-1.5 hover:bg-rose-600 transition-colors">
              <Zap size={13} className="text-white" />
              <span className="text-[12px] font-semibold text-white">Confirm</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const ReelsViewerModal = ({ reels: initialReels, initialIndex, onClose, onBookNow, userInteractions }) => {
  const router = useRouter();
  const { backUrl, canGoBack, getHrefWithState } = useNavigationState();
  const [reels, setReels] = useState(initialReels);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
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
  const [videoProgress, setVideoProgress] = useState(0);

  const videoRef = useRef(null);
  const viewRecordedRef = useRef(new Set());
  const lastTapRef = useRef(0);
  const isClosingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const currentReel = reels[currentIndex];

  useEffect(() => {
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("reel");
    const cleanHref = cleanUrl.pathname + cleanUrl.search;
    window.history.replaceState(null, "", cleanHref);
    window.history.pushState({ reelsModal: true }, "", cleanHref);
    const onPopState = () => {
      if (!isClosingRef.current) {
        isClosingRef.current = true;
        onCloseRef.current();
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      }
    };
  }, []);

  useEffect(() => {
    if (!currentReel?._id) return;
    const url = new URL(window.location.href);
    url.searchParams.set("reel", currentReel._id);
    window.history.replaceState(null, "", url.pathname + url.search);
  }, [currentIndex, currentReel?._id]);

  useEffect(() => {
    if (!currentReel?._id) return;
    const initiallyLiked = userInteractions?.liked?.has(currentReel._id) || false;
    const initiallySaved = userInteractions?.saved?.has(currentReel._id) || false;

    setIsLiked(initiallyLiked);
    setIsSaved(initiallySaved);
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
      if (res.reels) setRelatedReels(res.reels.map(normalizeReel));
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.play().catch(() => {});
    else video.pause();
  }, [isPlaying, currentIndex]);

  const goToReel = useCallback(
    (direction) => {
      if (direction === "up" && currentIndex < reels.length - 1) setCurrentIndex((p) => p + 1);
      else if (direction === "down" && currentIndex > 0) setCurrentIndex((p) => p - 1);
    },
    [currentIndex, reels.length],
  );

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    window.history.back();
    onClose();
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") goToReel("up");
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") goToReel("down");
      else if (e.key === "Escape") handleClose();
      else if (e.key === " ") {
        e.preventDefault();
        if (currentReel?.videoUrl) setIsPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToReel, handleClose, currentReel?.videoUrl]);

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    if (info.offset.y < -50 || info.velocity.y < -300) goToReel("up");
    else if (info.offset.y > 50 || info.velocity.y > 300) goToReel("down");
    if (info.velocity.x > 500 || info.offset.x > 180) handleClose();
  };

  const closeAndNavigate = useCallback(
    (targetUrl) => {
      if (isClosingRef.current) return;
      isClosingRef.current = true;
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("reel");
      window.history.replaceState(null, "", cleanUrl.pathname + cleanUrl.search);
      router.push(targetUrl);
      onClose();
    },
    [router, onClose],
  );

  const navigateToVendorProfile = useCallback(
    async (vendorId) => {
      setIsProfileLoading(true);
      try {
        const profile = await fetchVendorProfile(vendorId);
        if (profile && profile.category) {
          const backTo = encodeURIComponent(window.location.href);
          const path = profile.vendorId
            ? `/vendor/${profile.category}/${profile.vendorId}/profile`
            : `/vendor/${profile.category}/profile/${profile.username}`;
          closeAndNavigate(`${path}?backTo=${backTo}`);
        }
      } catch {
      } finally {
        setIsProfileLoading(false);
      }
    },
    [closeAndNavigate],
  );

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

  const handleLikeToggle = () => {
    if (!currentReel?._id) return;
    const n = !isLiked;
    setIsLiked(n);
    setLocalLikeCount((c) => (n ? c + 1 : Math.max(0, c - 1)));
    if (n) {
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 600);
    }
    toggleLike(currentReel._id, n ? "like" : "unlike");
  };
  const handleSaveToggle = () => {
    if (!currentReel?._id) return;
    const n = !isSaved;
    setIsSaved(n);
    setLocalSaveCount((c) => (n ? c + 1 : Math.max(0, c - 1)));
    toggleSave(currentReel._id, n ? "save" : "unsave");
  };
  const handleShare = () => {
    if (!currentReel?._id) return;
    recordShare(currentReel._id);
    setShowShareModal(true);
  };

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

  const loadRelatedIntoFeed = useCallback(
    (relReel) => {
      const exists = reels.findIndex((r) => r._id === relReel._id);
      if (exists >= 0) setCurrentIndex(exists);
      else {
        const newReels = [...reels, relReel];
        setReels(newReels);
        setCurrentIndex(newReels.length - 1);
      }
    },
    [reels],
  );

  if (!currentReel) return null;
  const hasVideo = !!currentReel.videoUrl;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-stone-950/95"
    >
      <div className="absolute inset-0 flex">
        <div
          className="relative flex items-center justify-center bg-black flex-shrink-0"
          style={{ width: "clamp(340px, 45vw, 680px)" }}
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30">
            <button
              onClick={() => goToReel("down")}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-15 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30">
            <button
              onClick={() => goToReel("up")}
              disabled={currentIndex === reels.length - 1}
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-15 hover:bg-white/20 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>

          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            onClick={handleTap}
            className="relative h-[88vh] aspect-[9/16] rounded-2xl overflow-hidden touch-pan-y"
            style={{ cursor: isDragging ? "grabbing" : "pointer" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReel._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.22 }}
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
                      onTimeUpdate={(e) => {
                        if (e.target.duration) setVideoProgress((e.target.currentTime / e.target.duration) * 100);
                      }}
                    />
                    {videoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <Loader2 size={30} className="text-white animate-spin" />
                      </div>
                    )}
                    {!isPlaying && !videoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                          <Play size={24} className="text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <SmartMedia
                    src={currentReel.thumbnail}
                    alt={currentReel.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence>
              {showLikeAnimation && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                >
                  <Heart size={72} className="text-rose-500 fill-rose-500 drop-shadow-lg" />
                </motion.div>
              )}
            </AnimatePresence>
            {hasVideo && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15 z-30">
                <div
                  className="h-full bg-rose-400 transition-[width] duration-200"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
            )}
          </motion.div>
        </div>

        <div className="flex-1 min-w-0 bg-white dark:bg-stone-950 border-l border-stone-200/40 dark:border-stone-800 overflow-y-auto">
          <div className="sticky top-0 z-10 px-6 py-3.5 bg-white/90 dark:bg-stone-950/90 backdrop-blur-lg border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-[12px] font-medium text-stone-400 bg-stone-100 dark:bg-stone-900 px-2.5 py-1 rounded-md">
                {currentIndex + 1} / {reels.length}
              </span>
              {currentReel.category && (
                <span className="text-[11px] text-rose-500 font-medium capitalize">
                  {currentReel.category.replace(/-/g, " ")}
                </span>
              )}
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleSeeProfile}>
              <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-rose-200/60 bg-stone-200 shrink-0">
                <SmartMedia
                  src={vendorProfile?.vendorAvatar || currentReel.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-stone-800 dark:text-stone-100 truncate">
                    {vendorProfile?.vendorBusinessName || `Deto - ${currentReel.title?.slice(0, 16)}...`}
                  </span>
                  {currentReel.isPinned && <BadgeCheck size={13} className="text-blue-500 shrink-0" />}
                </div>
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  {(vendorProfile?.location?.city || currentReel.location) && (
                    <>
                      <MapPin size={9} />
                      {vendorProfile?.location?.city || currentReel.location}
                    </>
                  )}
                </span>
              </div>
              <button className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 px-3 py-1.5 bg-rose-50 rounded-lg transition-colors shrink-0">
                {isProfileLoading ? "..." : "View"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all ${isLiked ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200" : "bg-stone-50 dark:bg-stone-900 text-stone-500 hover:bg-rose-50 hover:text-rose-500"}`}
              >
                <Heart size={14} className={isLiked ? "fill-rose-500 text-rose-500" : ""} />
                {fmt(localLikeCount)}
              </button>
              <button
                onClick={handleSaveToggle}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all ${isSaved ? "bg-amber-50 text-amber-600 ring-1 ring-amber-200" : "bg-stone-50 dark:bg-stone-900 text-stone-500 hover:bg-amber-50 hover:text-amber-500"}`}
              >
                {isSaved ? (
                  <BookmarkCheck size={14} className="fill-amber-500 text-amber-500" />
                ) : (
                  <Bookmark size={14} />
                )}
                {isSaved ? "Saved" : "Save"}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold bg-stone-50 dark:bg-stone-900 text-stone-500 hover:bg-violet-50 hover:text-violet-500 transition-all"
              >
                <Send size={13} />
                Share
              </button>
              <div className="ml-auto flex items-center gap-1 text-[11px] text-stone-400">
                <Eye size={12} />
                {fmt(localViewCount)} views
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 leading-snug">{currentReel.title}</h2>
              {currentReel.caption && (
                <p className="mt-2 text-[13px] text-stone-500 dark:text-stone-400 leading-relaxed">
                  {currentReel.caption}
                </p>
              )}
              {currentReel.description && currentReel.description !== currentReel.caption && (
                <p className="mt-1.5 text-[12px] text-stone-400 leading-relaxed">{currentReel.description}</p>
              )}
            </div>

            {currentReel.price && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/30">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Starting at</span>
                <span className="text-lg font-bold text-emerald-600">{currentReel.price}</span>
              </div>
            )}

            {currentReel.musicTitle && (
              <div className="flex items-center gap-2 text-[12px] text-stone-400">
                <Headphones size={13} className="text-stone-400" />
                <span>
                  {currentReel.musicTitle}
                  {currentReel.musicArtist ? ` · ${currentReel.musicArtist}` : ""}
                </span>
              </div>
            )}

            {currentReel.hashtags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {currentReel.hashtags.slice(0, 8).map((h) => (
                  <span
                    key={h}
                    className="px-2.5 py-1 rounded-lg bg-violet-50/60 dark:bg-stone-900 border border-violet-100/40 dark:border-stone-800 text-[11px] font-medium text-violet-500"
                  >
                    {h.startsWith("#") ? h : `#${h}`}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSeeProfile}
                disabled={isProfileLoading}
                className="flex-1 py-3 bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 rounded-xl flex items-center justify-center gap-1.5 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors text-[13px] font-semibold"
              >
                <ExternalLink size={14} />
                {isProfileLoading ? "Loading..." : "See Profile"}
              </button>
              <button
                onClick={() => onBookNow(currentReel)}
                className="flex-1 py-3 bg-rose-500 text-white rounded-xl flex items-center justify-center gap-1.5 hover:bg-rose-600 transition-colors text-[13px] font-semibold"
              >
                <Calendar size={14} />
                Book Now
              </button>
            </div>

            {similarVendors.length > 0 && (
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[14px] font-bold text-stone-800 dark:text-stone-100">Similar Vendors</h4>
                  <button
                    onClick={handleSeeProfile}
                    className="text-[11px] font-medium text-rose-500 flex items-center gap-0.5"
                  >
                    All
                    <ChevronRight size={11} />
                  </button>
                </div>
                <div className="space-y-2">
                  {similarVendors.slice(0, 3).map((v) => (
                    <button
                      key={v._id}
                      onClick={() => navigateToVendorProfile(v._id)}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50/70 dark:bg-stone-900 hover:bg-rose-50/50 border border-stone-100/60 dark:border-stone-800 transition-colors text-left"
                    >
                      {v.vendorAvatar ? (
                        <SmartMedia src={v.vendorAvatar} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-stone-200 dark:bg-stone-800 flex items-center justify-center shrink-0">
                          <Building2 size={13} className="text-stone-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold text-stone-700 dark:text-stone-200 truncate">
                          {v.vendorBusinessName || v.vendorName}
                        </p>
                        {v.location?.city && <p className="text-[10px] text-stone-400">{v.location.city}</p>}
                      </div>
                      <ChevronRight size={13} className="text-stone-300 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {relatedReels.length > 0 && (
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3">
                <h4 className="text-[14px] font-bold text-stone-800 dark:text-stone-100">Related Reels</h4>
                <div className="grid grid-cols-3 gap-2">
                  {relatedReels.slice(0, 6).map((rr) => (
                    <button
                      key={rr._id}
                      onClick={() => loadRelatedIntoFeed(rr)}
                      className="relative aspect-[9/16] rounded-xl overflow-hidden ring-1 ring-stone-200/50 dark:ring-stone-700 hover:ring-rose-300 transition-all"
                    >
                      <SmartMedia src={rr.thumbnail} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-1.5 left-1.5 right-1.5">
                        <p className="text-white text-[9px] font-medium line-clamp-2 text-left">{rr.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
              <div className="rounded-xl bg-gradient-to-r from-rose-50/50 to-amber-50/40 dark:from-stone-900 dark:to-stone-900 p-4 flex items-start gap-3 border border-rose-100/30 dark:border-stone-800">
                <Info size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-semibold text-stone-700 dark:text-stone-300">Navigation tips</p>
                  <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                    Arrow keys to navigate · Space to pause · Double-click to like · Esc to close
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showShareModal && (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            vendorName={vendorProfile?.vendorBusinessName || currentReel.title}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSimilarVendorsDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSimilarVendorsDrawer(false)}
              className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm z-[180]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-full max-w-[440px] bg-white dark:bg-stone-950 z-[181] overflow-hidden flex flex-col shadow-xl border-l border-stone-200 dark:border-stone-800"
            >
              <div className="px-6 py-4 flex items-center justify-between border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-stone-600" />
                  <h2 className="text-[14px] font-bold text-stone-800 dark:text-stone-100">Similar Vendors</h2>
                  <span className="text-[11px] text-stone-400">({similarVendorProfiles.length})</span>
                </div>
                <button
                  onClick={() => setShowSimilarVendorsDrawer(false)}
                  className="w-8 h-8 rounded-lg bg-stone-50 dark:bg-stone-900 flex items-center justify-center text-stone-400"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loadingSimilarProfiles ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 size={22} className="animate-spin text-rose-400" />
                    <p className="text-[13px] text-stone-400">Loading...</p>
                  </div>
                ) : similarVendorProfiles.length > 0 ? (
                  <div className="p-4 space-y-2">
                    {similarVendorProfiles.map((profile) => {
                      if (!profile || !profile._id || !profile.category) return null;
                      return (
                        <div
                          key={profile._id}
                          onClick={() => {
                            setShowSimilarVendorsDrawer(false);
                            const backTo = encodeURIComponent(window.location.href);
                            const path = profile.vendorId
                              ? `/vendor/${profile.category}/${profile.vendorId}/profile`
                              : `/vendor/${profile.category}/profile/${profile.username}`;
                            closeAndNavigate(`${path}?backTo=${backTo}`);
                          }}
                          className="flex items-center gap-3 p-3.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800 cursor-pointer hover:border-rose-200 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0">
                            {profile.vendorAvatar ? (
                              <SmartMedia src={profile.vendorAvatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-400">
                                <Building2 size={16} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-stone-800 dark:text-stone-100 truncate">
                              {profile.vendorBusinessName || profile.vendorName || "Vendor"}
                            </p>
                            <p className="text-[11px] text-stone-400 capitalize truncate">
                              {profile.category?.replace(/-/g, " ")}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {(profile.location?.city || profile.city) && (
                                <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                                  <MapPin size={8} />
                                  {profile.location?.city || profile.city}
                                </span>
                              )}
                              {profile.rating && (
                                <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                                  <Star size={8} className="fill-amber-400 text-amber-400" />
                                  {profile.rating}
                                </span>
                              )}
                              {profile.startingPrice && (
                                <span className="text-[10px] text-emerald-500 font-medium">
                                  {profile.startingPrice}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-stone-300 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-20">
                    <p className="text-[13px] text-stone-400">No profiles found</p>
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

export default function IdeasDesktopPage() {
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
    if (filterState.sort && filterState.sort !== "relevance") params.sort = filterState.sort;
    if (filterState.minRating) params.rating = String(filterState.minRating);
    if (filterState.location) params.location = filterState.location;
    return params;
  }, [eventType, activeCategory, activeSubcategory, activeSubType, filterState]);

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
  }, [eventType, activeCategory, activeSubcategory, activeSubType, filterState, showModal, syncURL]);

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

  const getDynamicHeading = useCallback((index) => EVENT_SECTION_HEADINGS[index % EVENT_SECTION_HEADINGS.length], []);

  useEffect(() => {
    if (!eventType || !config) return;
    const version = ++fetchVersionRef.current;
    let cancelled = false;

    const loadReels = async () => {
      setIsLoadingCarousels(true);
      const baseParams = { type: config.type || eventType, isActive: "true", limit: 50 };
      if (activeCategory) baseParams.category = activeCategory;
      if (activeSubcategory) baseParams.subcategory = activeSubcategory;
      if (activeSubType && activeSubType !== "all") baseParams.subType = activeSubType;
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
        const [mainResult, featuredResult, trendingResult] = await Promise.all([
          fetchReels(baseParams),
          fetchFeaturedReels({ limit: 15, type: eventType }),
          fetchTrendingReels({ limit: 15, type: eventType }),
        ]);

        if (cancelled || version !== fetchVersionRef.current) return;

        const allReels = (mainResult.data || []).map(normalizeReel);
        const featuredReels = (featuredResult.reels || []).map(normalizeReel);
        const tReels = (trendingResult.reels || []).map(normalizeReel);

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
              if (allReels.length > half)
                sections.push({
                  id: `${activeSubcategory}-more`,
                  title: `More ${subcategoryLabel}`,
                  items: allReels.slice(half),
                });
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
        if (pinnedReels.length > 0)
          sections.unshift({
            id: "sponsored",
            title: "Premium Services",
            items: pinnedReels,
          });

        if (featuredReels.length > 0)
          sections.push({
            id: "featured",
            title: "Couples' Favorite Picks",
            items: featuredReels,
          });

        if (tReels.length > 0) sections.push({ id: "trending", title: "Trending Now", items: tReels });

        setCarouselSections(sections);
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
          if (eLabel.toLowerCase().includes(searchQuery.toLowerCase()))
            localResults.push({ type: "event", label: eLabel, sublabel: "Event Category", eventId: eventKey });

          cfg.categories?.forEach((cat) => {
            if (cat.label.toLowerCase().includes(searchQuery.toLowerCase()))
              localResults.push({
                type: "category",
                label: cat.label,
                sublabel: `${eLabel} › Service`,
                eventId: eventKey,
                categoryId: cat.id,
              });
          });
        });
        setSearchResults([...reelResults, ...localResults].slice(0, 12));
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, eventType]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 40);
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

  const handleEventSelect = (type, label) => {
    setEventType(type);
    setEventLabel(label);
    setShowModal(false);
    setActiveCategory(null);
    setActiveSubcategory(null);
    setActiveSubType("all");
    setInitialLoadDone(false);
  };

  const handleCategoryClick = (categoryId) => {
    if (!categoryId || activeCategory === categoryId) {
      setActiveCategory(null);
      setActiveSubcategory(null);
      setInitialLoadDone(false);
      return;
    }
    setActiveCategory(categoryId);
    setActiveSubcategory(null);
    setInitialLoadDone(false);
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setActiveSubcategory(activeSubcategory === subcategoryId ? null : subcategoryId);
    setInitialLoadDone(false);
  };

  const handleSubTypeClick = (filterId) => {
    setActiveSubType(filterId);
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
    const clean = () => {
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has("reel")) {
          url.searchParams.delete("reel");
          window.history.replaceState(null, "", url.pathname + url.search);
        }
      } catch {}
    };
    clean();
    setTimeout(clean, 80);
    setRecentlyViewedReels(getRecentlyViewed());
  }, [setIsNavbarVisible]);

  const handleRefresh = () => {
    setInitialLoadDone(false);
    setCarouselSections([]);
    setFilterState((prev) => ({ ...prev }));
  };

  if (showModal || !eventType || !config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50/60 via-white to-amber-50/40 dark:bg-stone-950">
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
    <div className="min-h-screen bg-[#faf8f5] dark:bg-stone-950 text-stone-800 dark:text-stone-100">
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
      <div className="flex">
        <DesktopSidebar
          config={config}
          eventLabel={eventLabel}
          activeCategory={activeCategory}
          activeSubcategory={activeSubcategory}
          onCategoryClick={handleCategoryClick}
          onSubcategoryClick={handleSubcategoryClick}
          onChangeEvent={() => {
            setShowModal(true);
            setEventType(null);
            setActiveCategory(null);
            setActiveSubcategory(null);
            setActiveSubType("all");
            setInitialLoadDone(false);
            window.history.replaceState(null, "", pathname);
          }}
          activeSubType={activeSubType}
          onSubTypeClick={handleSubTypeClick}
          isWeddingType={isWeddingType}
        />
        <main className="flex-1 min-w-0">
          <div
            style={{ top: DESKTOP_TOP_OFFSET }}
            className="sticky !z-20 border-b border-rose-100/50 dark:border-stone-800 bg-white dark:bg-stone-950/85 backdrop-blur-xl"
          >
            <div className="px-5 xl:px-7 2xl:px-8 py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[13px]">
                  <button
                    onClick={() => {
                      setActiveCategory(null);
                      setActiveSubcategory(null);
                      setInitialLoadDone(false);
                    }}
                    className="text-stone-400 font-medium hover:text-rose-500 transition-colors"
                  >
                    {eventLabel}
                  </button>
                  {activeCategoryData && (
                    <>
                      <ChevronRight size={12} className="text-stone-300" />
                      <button
                        onClick={() => {
                          setActiveSubcategory(null);
                          setInitialLoadDone(false);
                        }}
                        className="text-stone-600 dark:text-stone-300 font-medium hover:text-rose-500 transition-colors"
                      >
                        {activeCategoryData.label}
                      </button>
                    </>
                  )}
                  {activeSubcategory && (
                    <>
                      <ChevronRight size={12} className="text-stone-300" />
                      <span className="text-stone-800 dark:text-stone-100 font-semibold">
                        {activeCategoryData?.subcategories?.find((n) => n.id === activeSubcategory)?.label ||
                          activeSubcategory}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className="w-8 h-8 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-400 hover:text-rose-500 hover:border-rose-200 transition-colors"
                >
                  <RefreshCw size={13} className={isLoadingCarousels ? "animate-spin" : ""} />
                </button>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-2 h-8 min-w-[240px] xl:min-w-[280px] px-3 rounded-lg border border-stone-200 dark:border-stone-700 text-left text-[12px] text-stone-400 hover:border-rose-200 transition-colors"
                >
                  <Search size={13} />
                  <span className="flex-1">Search…</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 font-medium">
                    ⌘K
                  </span>
                </button>
                <button
                  onClick={() => setShowFilter(true)}
                  className="relative h-8 px-3 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 text-[12px] font-medium text-stone-500 hover:border-rose-200 hover:text-rose-500 transition-colors"
                >
                  <Filter size={12} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="px-5 xl:px-7 2xl:px-8 py-6">
            <div className="max-w-[1580px] space-y-7">
              <DesktopHero
                eventLabel={eventLabel}
                activeCategoryData={activeCategoryData}
                activeSubcategory={activeSubcategory}
              />

              {activeFilterCount > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {filterState.sort !== "relevance" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-500 text-white rounded-lg text-[11px] font-medium">
                      {filterState.sort === "trending"
                        ? "Trending"
                        : filterState.sort === "rating"
                          ? "Top Rated"
                          : "Newest"}
                      <button onClick={() => setFilterState((p) => ({ ...p, sort: "relevance" }))}>
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  {filterState.location && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-500 text-white rounded-lg text-[11px] font-medium">
                      <MapPin size={9} />
                      {filterState.location}
                      <button onClick={() => setFilterState((p) => ({ ...p, location: null }))}>
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  {filterState.minRating && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-500 text-white rounded-lg text-[11px] font-medium">
                      <Star size={9} />
                      {filterState.minRating}+
                      <button onClick={() => setFilterState((p) => ({ ...p, minRating: null }))}>
                        <X size={10} />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {isDirectReelLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <Loader2 size={32} className="animate-spin text-rose-400 mb-4" />
                  <p className="text-stone-400 text-sm font-medium">Loading Reel...</p>
                </div>
              ) : isLoadingCarousels && !initialLoadDone ? (
                <FullPageSkeleton />
              ) : initialLoadDone ? (
                <div className="space-y-7">
                  {carouselSections.length > 0 ? (
                    carouselSections.map((section) =>
                      HIGHLIGHT_IDS.has(section.id) ? (
                        <FeaturedCarouselSection key={section.id} section={section} onItemClick={handleItemClick} />
                      ) : (
                        <DesktopCarouselSection key={section.id} section={section} onItemClick={handleItemClick} />
                      ),
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800">
                      <div className="w-14 h-14 bg-rose-50 dark:bg-stone-800 rounded-xl flex items-center justify-center mb-4">
                        <Search size={22} className="text-rose-300" />
                      </div>
                      <p className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-1">No reels found</p>
                      <p className="text-[13px] text-stone-400 mb-4">Try a different category or adjust filters</p>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={() =>
                            setFilterState({ sort: "relevance", minRating: null, priceRange: null, location: null })
                          }
                          className="px-4 py-2.5 bg-rose-500 rounded-lg text-white text-[13px] font-semibold hover:bg-rose-600 transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  )}

                  {carouselSections.length > 0 && (
                    <div
                      onClick={() => {
                        setFilterState((p) => ({ ...p, sort: "trending" }));
                        setInitialLoadDone(false);
                      }}
                      className="rounded-xl p-4 bg-gradient-to-r from-rose-50/60 to-amber-50/40 dark:from-stone-900 dark:to-stone-900 border border-rose-100/40 dark:border-stone-800 flex items-center gap-4 cursor-pointer hover:border-rose-200 dark:hover:border-stone-700 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <TrendingUp size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-bold text-stone-800 dark:text-stone-100">
                          Trending in {eventLabel}
                        </h4>
                        <p className="text-[12px] text-stone-400 mt-0.5">
                          {trendingReels.length > 0
                            ? `${trendingReels.length} trending reels this month`
                            : "See what's popular this season"}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-stone-300 shrink-0" />
                    </div>
                  )}

                  {paginationInfo?.hasNextPage && carouselSections.length > 0 && (
                    <button
                      onClick={async () => {
                        const nextPage = (paginationInfo.page || 1) + 1;
                        const params = { type: config.type || eventType, isActive: "true", limit: 50, page: nextPage };
                        if (activeCategory) params.category = activeCategory;
                        if (activeSubcategory) params.subcategory = activeSubcategory;
                        if (filterState.location) params.city = filterState.location;
                        if (activeSubType && activeSubType !== "all") params.subType = activeSubType;

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
                      className="w-full py-3 bg-white dark:bg-stone-900 rounded-xl flex items-center justify-center gap-2 text-stone-500 font-medium text-[13px] border border-stone-200/60 dark:border-stone-800 hover:border-rose-200 hover:text-rose-500 transition-colors"
                    >
                      <ChevronDown size={14} />
                      Load More
                    </button>
                  )}

                  {recentlyViewedReels.length > 0 && (
                    <FeaturedCarouselSection
                      section={{ id: "recently-viewed", title: "Recently Viewed", items: recentlyViewedReels }}
                      onItemClick={handleItemClick}
                    />
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </main>
      </div>

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
      <AnimatePresence>
        {drawerItem && <BookingDrawer item={drawerItem} onClose={() => setDrawerItem(null)} />}
      </AnimatePresence>
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
      <AnimatePresence>{showModal && <EventSelectionModal onSelect={handleEventSelect} />}</AnimatePresence>
    </div>
  );
}
