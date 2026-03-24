"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  Pause,
  Volume2,
  VolumeX,
  Loader2,
  Eye,
  RefreshCw,
  Plane,
  Mail,
  Diamond,
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ShareModal } from "./VendorProfilePageWrapper";

const EVENT_CONFIGS = {
  wedding: {
    type: "wedding",
    subtypes: [
      {
        id: "wedding-planners",
        label: "Planners",
        icon: <Lightbulb size={18} />,
        gradient: "from-sky-400 to-blue-500",
        nestedTypes: [
          { id: "full-planning", label: "Full Planning" },
          { id: "partial-planning", label: "Partial Planning" },
          { id: "day-coordination", label: "Day-of Coordination" },
          { id: "destination-planner", label: "Destination" },
          { id: "luxury-planner", label: "Luxury" },
          { id: "budget-planner", label: "Budget" },
        ],
      },
      {
        id: "venues",
        label: "Venues",
        icon: <Building2 size={18} />,
        gradient: "from-slate-400 to-gray-500",
        nestedTypes: [
          { id: "banquet-halls", label: "Banquet Halls" },
          { id: "farmhouses", label: "Farmhouses" },
          { id: "hotels-resorts", label: "Hotels & Resorts" },
          { id: "destination-venues", label: "Destination" },
          { id: "outdoor-lawns", label: "Outdoor Lawns" },
          { id: "beach-weddings", label: "Beach" },
        ],
      },
      {
        id: "decorators",
        label: "Decor",
        icon: <Palette size={18} />,
        gradient: "from-teal-400 to-cyan-500",
        nestedTypes: [
          { id: "haldi-decor", label: "Haldi Decor" },
          { id: "mehendi-decor", label: "Mehendi Decor" },
          { id: "stage-decor", label: "Stage Decor" },
          { id: "reception-decor", label: "Reception" },
          { id: "floral-decor", label: "Floral" },
          { id: "theme-decor", label: "Theme Decor" },
        ],
      },
      {
        id: "photographers",
        label: "Photo & Video",
        icon: <Camera size={18} />,
        gradient: "from-pink-400 to-rose-500",
        nestedTypes: [
          { id: "candid-photography", label: "Candid" },
          { id: "traditional-photography", label: "Traditional" },
          { id: "cinematic-films", label: "Cinematic Films" },
          { id: "drone-shoots", label: "Drone Shoots" },
          { id: "pre-wedding-shoots", label: "Pre-Wedding" },
          { id: "destination-shoots", label: "Destination" },
        ],
      },
      {
        id: "makeup-artists",
        label: "Makeup",
        icon: <Gem size={18} />,
        gradient: "from-fuchsia-400 to-pink-500",
        nestedTypes: [
          { id: "bridal-makeup", label: "Bridal" },
          { id: "hd-makeup", label: "HD Makeup" },
          { id: "airbrush-makeup", label: "Airbrush" },
          { id: "party-makeup", label: "Party" },
          { id: "celebrity-mua", label: "Celebrity MUA" },
        ],
      },
      {
        id: "mehendi-artists",
        label: "Mehendi",
        icon: <Flower2 size={18} />,
        gradient: "from-green-400 to-emerald-500",
        nestedTypes: [
          { id: "bridal-mehendi", label: "Bridal" },
          { id: "arabic-mehendi", label: "Arabic" },
          { id: "traditional-mehendi", label: "Traditional" },
          { id: "indo-arabic", label: "Indo-Arabic" },
          { id: "minimal-mehendi", label: "Minimal" },
        ],
      },
      {
        id: "caterers",
        label: "Catering",
        icon: <Utensils size={18} />,
        gradient: "from-red-400 to-orange-500",
        nestedTypes: [
          { id: "north-indian", label: "North Indian" },
          { id: "south-indian", label: "South Indian" },
          { id: "multi-cuisine", label: "Multi-Cuisine" },
          { id: "live-counters", label: "Live Counters" },
          { id: "luxury-catering", label: "Luxury" },
          { id: "budget-catering", label: "Budget" },
        ],
      },
      {
        id: "bridal-groom-wear",
        label: "Outfits",
        icon: <Shirt size={18} />,
        gradient: "from-violet-400 to-indigo-500",
        nestedTypes: [
          { id: "bridal-lehenga", label: "Bridal Lehenga" },
          { id: "designer-wear", label: "Designer Wear" },
          { id: "rental-wear", label: "Rental Wear" },
          { id: "groom-sherwani", label: "Groom Sherwani" },
          { id: "custom-designers", label: "Custom Designers" },
        ],
      },
      {
        id: "jewelry",
        label: "Jewelry",
        icon: <Diamond size={18} />,
        gradient: "from-amber-400 to-yellow-500",
        nestedTypes: [
          { id: "bridal-jewelry", label: "Bridal" },
          { id: "artificial-jewelry", label: "Artificial" },
          { id: "gold-jewelry", label: "Gold" },
          { id: "diamond-jewelry", label: "Diamond" },
          { id: "rental-jewelry", label: "Rental" },
        ],
      },
      {
        id: "entertainment",
        label: "Entertainment",
        icon: <Music size={18} />,
        gradient: "from-indigo-400 to-purple-500",
        nestedTypes: [
          { id: "djs", label: "DJs" },
          { id: "live-bands", label: "Live Bands" },
          { id: "anchors-emcees", label: "Anchors / Emcees" },
          { id: "dancers-choreographers", label: "Dancers" },
          { id: "celebrity-performers", label: "Celebrity" },
        ],
      },
      {
        id: "invitations",
        label: "Invites",
        icon: <Mail size={18} />,
        gradient: "from-orange-400 to-rose-500",
        nestedTypes: [
          { id: "printed-cards", label: "Printed Cards" },
          { id: "digital-invitations", label: "Digital" },
          { id: "video-invitations", label: "Video" },
          { id: "luxury-invitations", label: "Luxury" },
          { id: "eco-friendly-cards", label: "Eco-Friendly" },
        ],
      },
      {
        id: "transportation-baraat",
        label: "Transport",
        icon: <Car size={18} />,
        gradient: "from-blue-400 to-sky-500",
        nestedTypes: [
          { id: "luxury-cars", label: "Luxury Cars" },
          { id: "vintage-cars", label: "Vintage Cars" },
          { id: "baraat-ghodi", label: "Baraat Ghodi" },
          { id: "band-baja", label: "Band Baja" },
          { id: "guest-transport", label: "Guest Transport" },
        ],
      },
      {
        id: "pre-wedding",
        label: "Pre-Wedding",
        icon: <HeartHandshake size={18} />,
        gradient: "from-rose-400 to-pink-500",
        nestedTypes: [
          { id: "pre-wedding-shoots-svc", label: "Shoots" },
          { id: "couple-styling", label: "Couple Styling" },
          { id: "proposal-planning", label: "Proposal" },
          { id: "pre-wedding-events", label: "Events Planning" },
          { id: "save-the-date", label: "Save-the-Date" },
        ],
      },
      {
        id: "honeymoon",
        label: "Honeymoon",
        icon: <Plane size={18} />,
        gradient: "from-cyan-400 to-blue-500",
        nestedTypes: [
          { id: "domestic-honeymoon", label: "Domestic" },
          { id: "international-honeymoon", label: "International" },
          { id: "luxury-packages", label: "Luxury" },
          { id: "budget-trips", label: "Budget" },
          { id: "adventure-honeymoon", label: "Adventure" },
        ],
      },
    ],
  },
  birthday: {
    type: "birthday",
    subtypes: [
      { id: "kids", label: "Kids Party", icon: <Baby size={18} />, gradient: "from-pink-400 to-rose-500" },
      {
        id: "theme",
        label: "Theme Party",
        icon: <PartyPopper size={18} />,
        gradient: "from-violet-400 to-purple-500",
        nestedTypes: [
          { id: "bollywood-theme", label: "Bollywood Night" },
          { id: "retro-theme", label: "Retro Theme" },
          { id: "pool-theme", label: "Pool Party" },
          { id: "neon-theme", label: "Neon Party" },
        ],
      },
      { id: "cake", label: "Cakes", icon: <Cake size={18} />, gradient: "from-amber-400 to-orange-500" },
      { id: "b-decor", label: "Decor", icon: <Palette size={18} />, gradient: "from-teal-400 to-cyan-500" },
      { id: "b-venue", label: "Venues", icon: <Building2 size={18} />, gradient: "from-blue-400 to-indigo-500" },
      { id: "b-photo", label: "Photo", icon: <Camera size={18} />, gradient: "from-rose-400 to-pink-500" },
      { id: "b-dj", label: "DJ & Music", icon: <Music size={18} />, gradient: "from-purple-400 to-violet-500" },
      { id: "b-catering", label: "Catering", icon: <Utensils size={18} />, gradient: "from-red-400 to-orange-500" },
      { id: "entertainer", label: "Acts", icon: <Crown size={18} />, gradient: "from-yellow-400 to-amber-500" },
      { id: "b-gift", label: "Gifts", icon: <Gift size={18} />, gradient: "from-green-400 to-emerald-500" },
    ],
  },
  anniversary: {
    type: "anniversary",
    subtypes: [
      { id: "surprise", label: "Surprise", icon: <Gift size={18} />, gradient: "from-pink-400 to-fuchsia-500" },
      { id: "dinner", label: "Dinner", icon: <Utensils size={18} />, gradient: "from-red-400 to-rose-500" },
      { id: "a-decor", label: "Decor", icon: <Palette size={18} />, gradient: "from-teal-400 to-cyan-500" },
      { id: "a-photo", label: "Photo", icon: <Camera size={18} />, gradient: "from-violet-400 to-purple-500" },
      { id: "a-venue", label: "Venues", icon: <Building2 size={18} />, gradient: "from-blue-400 to-indigo-500" },
      { id: "a-music", label: "Music", icon: <Music size={18} />, gradient: "from-orange-400 to-amber-500" },
      { id: "a-cake", label: "Cakes", icon: <Cake size={18} />, gradient: "from-amber-400 to-yellow-500" },
      { id: "a-gift", label: "Gifts", icon: <Gift size={18} />, gradient: "from-green-400 to-emerald-500" },
    ],
  },
  corporate: {
    type: "corporate",
    subtypes: [
      { id: "conference", label: "Conference", icon: <Users size={18} />, gradient: "from-blue-400 to-indigo-500" },
      {
        id: "team-building",
        label: "Team Build",
        icon: <Trophy size={18} />,
        gradient: "from-amber-400 to-orange-500",
      },
      { id: "launch", label: "Launch", icon: <Megaphone size={18} />, gradient: "from-red-400 to-rose-500" },
      { id: "c-venue", label: "Venues", icon: <Building2 size={18} />, gradient: "from-slate-400 to-gray-500" },
      { id: "c-catering", label: "Catering", icon: <Utensils size={18} />, gradient: "from-green-400 to-emerald-500" },
      { id: "c-av", label: "AV & Tech", icon: <Lightbulb size={18} />, gradient: "from-violet-400 to-purple-500" },
      { id: "c-photo", label: "Photo", icon: <Camera size={18} />, gradient: "from-pink-400 to-rose-500" },
      { id: "seminar", label: "Seminars", icon: <GraduationCap size={18} />, gradient: "from-cyan-400 to-teal-500" },
    ],
  },
};

const WEDDING_QUICK_FILTERS = [
  { id: "all", label: "All" },
  { id: "baraat", label: "Baraat" },
  { id: "sangeet", label: "Sangeet" },
  { id: "haldi", label: "Haldi" },
  { id: "mehendi", label: "Mehendi" },
  { id: "reception", label: "Reception" },
  { id: "pheras", label: "Pheras" },
  { id: "engagement", label: "Engagement" },
  { id: "cocktail", label: "Cocktail" },
  { id: "vidaai", label: "Vidaai" },
  { id: "destination", label: "Destination" },
];

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
  subtypes: [
    { id: "o-planner", label: "Planner", icon: <Lightbulb size={18} />, gradient: "from-sky-400 to-blue-500" },
    { id: "o-decor", label: "Decor", icon: <Palette size={18} />, gradient: "from-teal-400 to-cyan-500" },
    { id: "o-photo", label: "Photo", icon: <Camera size={18} />, gradient: "from-pink-400 to-rose-500" },
    { id: "o-catering", label: "Catering", icon: <Utensils size={18} />, gradient: "from-red-400 to-orange-500" },
    { id: "o-venue", label: "Venues", icon: <Building2 size={18} />, gradient: "from-slate-400 to-gray-500" },
    { id: "o-music", label: "Music", icon: <Music size={18} />, gradient: "from-purple-400 to-violet-500" },
  ],
});

const WEDDING_SECTION_HEADINGS = [
  "✨ Trending Wedding Vendors Near You",
  "🏆 Most Booked Wedding Planners",
  "📸 Trending Wedding Photographers",
  "💄 Top Bridal Makeup Artists in Your City",
  "🏛️ Popular Wedding Venues Near You",
  "🎪 Stunning Wedding Decor Ideas & Experts",
  "🍽️ Most Loved Caterers (Top Rated)",
  "🎶 Best DJs & Entertainment for Weddings",
  "👗 Trending Bridal & Groom Wear Designers",
  "💎 Premium & Luxury Wedding Services",
  "💰 Budget-Friendly Wedding Vendors",
  "🔥 Viral Wedding Reels (Must Watch)",
  "❤️ Couples' Favorite Picks",
  "🌍 Destination Wedding Specialists",
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
    const res = await fetch(`/api/reels/${reelId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) return res.json();
  } catch {}
  return null;
};

const toggleSave = async (reelId, action) => {
  try {
    const res = await fetch(`/api/reels/${reelId}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) return res.json();
  } catch {}
  return null;
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
  subtype: reel.subtype || "",
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

const ShimmerBlock = ({ className }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:200%_100%] rounded-xl ${className}`}
    style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
  />
);

const FullPageSkeleton = () => (
  <div className="space-y-8">
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
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ShimmerBlock key={i} className="h-24 rounded-2xl" />
      ))}
    </div>
    {Array.from({ length: 4 }).map((_, idx) => (
      <div key={idx} className="space-y-4">
        <div className="flex items-center justify-between">
          <ShimmerBlock className="h-6 w-64" />
          <div className="flex gap-2">
            <ShimmerBlock className="h-10 w-10 !rounded-full" />
            <ShimmerBlock className="h-10 w-10 !rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-5 2xl:grid-cols-6 gap-5">
          {Array.from({ length: 6 }).map((__, j) => (
            <ShimmerBlock key={j} className="aspect-[10/16] rounded-3xl" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const DesktopSidebar = ({
  config,
  eventLabel,
  activeSubtype,
  activeNested,
  onSubtypeClick,
  onNestedClick,
  onChangeEvent,
  weddingQuickFilter,
  onWeddingQuickFilterClick,
  isWeddingType,
}) => (
  <aside className="w-[300px] 2xl:w-[330px] border-r border-gray-200/70 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl h-screen sticky top-0 overflow-y-auto mt-17">
    <div className="p-6 border-b border-gray-200/70 dark:border-gray-800">
      <button onClick={onChangeEvent} className="w-full text-left group">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg">
            <Sparkles size={24} />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-black text-gray-900 dark:text-white truncate">{eventLabel} Ideas</h2>
            <p className="text-xs font-semibold text-gray-400 group-hover:text-violet-500 transition-colors">
              Change event
            </p>
          </div>
        </div>
      </button>
    </div>

    {isWeddingType && (
      <div className="p-6 border-b border-gray-200/70 dark:border-gray-800">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400 mb-3">Wedding Moments</p>
        <div className="flex flex-wrap gap-2">
          {WEDDING_QUICK_FILTERS.map((f) => {
            const isActive = weddingQuickFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onWeddingQuickFilterClick(f.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  isActive
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    )}

    <div className="p-6">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400 mb-4">Categories</p>
      <div className="space-y-2">
        <button
          onClick={() => onSubtypeClick(null)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left ${
            !activeSubtype
              ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-200/60 dark:border-violet-800"
              : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200/60 dark:border-gray-800 hover:border-violet-200"
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${!activeSubtype ? "bg-violet-600 text-white" : "bg-gray-200 dark:bg-gray-800"}`}>
            <Sparkles size={18} />
          </div>
          <span className="font-bold text-sm">All Categories</span>
        </button>

        {config.subtypes.map((subtype) => {
          const isActive = activeSubtype === subtype.id;
          return (
            <div key={subtype.id}>
              <button
                onClick={() => onSubtypeClick(subtype.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left border ${
                  isActive
                    ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200/60 dark:border-violet-800"
                    : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200/60 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-900"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${subtype.gradient} shadow-sm`}
                >
                  {subtype.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{subtype.label}</p>
                  {subtype.nestedTypes?.length > 0 && (
                    <p className="text-[10px] text-gray-400">{subtype.nestedTypes.length} specializations</p>
                  )}
                </div>
                {subtype.nestedTypes && (
                  <ChevronRight
                    size={15}
                    className={`transition-transform ${isActive ? "rotate-90" : ""}`}
                  />
                )}
              </button>

              <AnimatePresence>
                {isActive && subtype.nestedTypes?.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-5 pr-2 pt-2"
                  >
                    <div className="space-y-1.5">
                      {subtype.nestedTypes.map((nested) => {
                        const isNestedActive = activeNested === nested.id;
                        return (
                          <button
                            key={nested.id}
                            onClick={() => onNestedClick(nested.id)}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                              isNestedActive
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                : "bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-violet-200"
                            }`}
                          >
                            {nested.label}
                          </button>
                        );
                      })}
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

const DesktopHero = ({ eventLabel, activeSubtypeData, activeNested, paginationInfo, activeSubtype }) => (
  <div className="rounded-[32px] p-8 2xl:p-10 bg-gradient-to-br from-gray-900 via-violet-950 to-gray-950 text-white overflow-hidden relative">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.22),transparent_35%)]" />
    <div className="relative z-10 flex items-end justify-between gap-6">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-bold uppercase tracking-[0.22em] mb-4">
          <Sparkles size={13} />
          Curated ideas
        </div>
        <h1 className="text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
          {activeSubtypeData ? activeSubtypeData.label : eventLabel} ideas for every vibe
        </h1>
        <p className="mt-3 text-white/70 text-sm 2xl:text-base max-w-2xl">
          {activeNested
            ? `Exploring ${activeSubtypeData?.nestedTypes?.find((n) => n.id === activeNested)?.label || ""} in ${activeSubtypeData?.label || eventLabel}.`
            : activeSubtype
              ? `Explore premium, trending and budget-friendly ${activeSubtypeData?.label || ""} reels for your ${eventLabel.toLowerCase()}.`
              : `Discover trending vendors, inspiration reels and top categories for your ${eventLabel.toLowerCase()}.`}
        </p>
      </div>

      <div className="hidden xl:grid grid-cols-3 gap-3 shrink-0">
        <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-4 min-w-[120px]">
          <p className="text-xs text-white/50 font-semibold">Total reels</p>
          <p className="text-2xl font-black mt-1">{paginationInfo?.total || 0}</p>
        </div>
        <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-4 min-w-[120px]">
          <p className="text-xs text-white/50 font-semibold">Discovery</p>
          <p className="text-2xl font-black mt-1">Smart</p>
        </div>
        <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-4 min-w-[120px]">
          <p className="text-xs text-white/50 font-semibold">Layout</p>
          <p className="text-2xl font-black mt-1">Desktop</p>
        </div>
      </div>
    </div>
  </div>
);

const CategoryGrid = ({ config, activeSubtype, onSubtypeClick }) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Browse by category</h3>
        <p className="text-sm text-gray-400 mt-1">Jump into a service category instantly</p>
      </div>
    </div>
    <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {config.subtypes.map((subtype) => {
        const isActive = activeSubtype === subtype.id;
        return (
          <motion.button
            key={subtype.id}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSubtypeClick(subtype.id)}
            className={`p-5 rounded-3xl text-left border transition-all ${
              isActive
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-xl"
                : "bg-white dark:bg-gray-950 border-gray-200/70 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-900 hover:shadow-lg"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${subtype.gradient} shadow-md`}
            >
              {subtype.icon}
            </div>
            <p className={`mt-4 font-black text-sm ${isActive ? "text-white dark:text-gray-900" : "text-gray-900 dark:text-white"}`}>
              {subtype.label}
            </p>
            <p className={`mt-1 text-xs ${isActive ? "text-white/60 dark:text-gray-900/50" : "text-gray-400"}`}>
              {subtype.nestedTypes?.length ? `${subtype.nestedTypes.length} specializations` : "Explore reels"}
            </p>
          </motion.button>
        );
      })}
    </div>
  </section>
);

const NestedDesktopChips = ({ nestedTypes, activeNested, onNestedClick }) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Specializations</h3>
        <p className="text-sm text-gray-400 mt-1">Refine this category with a nested type</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-3">
      {nestedTypes.map((nested) => {
        const isActive = activeNested === nested.id;
        return (
          <button
            key={nested.id}
            onClick={() => onNestedClick(nested.id)}
            className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
              isActive
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg"
                : "bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 border border-gray-200/70 dark:border-gray-800 hover:border-violet-200"
            }`}
          >
            {nested.label}
          </button>
        );
      })}
    </div>
  </section>
);

const ReelCard = ({ item, idx, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.03, type: "spring", stiffness: 260, damping: 24 }}
    whileHover={{ y: -6 }}
    onClick={onClick}
    className="cursor-pointer group"
  >
    <div className="relative aspect-[10/16] rounded-[28px] overflow-hidden bg-gray-200 dark:bg-gray-800 ring-1 ring-black/[0.05] dark:ring-white/[0.06] shadow-sm group-hover:shadow-2xl transition-all duration-500">
      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/5" />
      {item.tags?.[0] && (
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-black/70 backdrop-blur rounded-full text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
          {item.tags[0] === "Top Rated" && <Star size={10} className="fill-amber-500 text-amber-500" />}
          {item.tags[0] === "Trending" && <TrendingUp size={10} />}
          {item.tags[0] === "Sponsored" && <Zap size={10} />}
          {item.tags[0]}
        </div>
      )}
      <div className="absolute top-3 right-3 w-9 h-9 bg-black/30 backdrop-blur rounded-full flex items-center justify-center">
        <Play size={12} className="text-white fill-white ml-[1px]" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white font-black text-sm leading-tight line-clamp-2">{item.title}</p>
        <div className="mt-2 flex items-center gap-3 text-white/70 text-xs">
          <span className="flex items-center gap-1">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            {item.rating}
          </span>
          {item.location && (
            <span className="flex items-center gap-1 truncate">
              <MapPin size={10} />
              {item.location}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-emerald-400 font-bold text-sm">{item.price || ""}</span>
          {item.viewCount > 0 && (
            <span className="text-white/60 text-[11px] flex items-center gap-1">
              <Eye size={10} />
              {item.viewCount > 999 ? `${(item.viewCount / 1000).toFixed(1)}k` : item.viewCount}
            </span>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

const DesktopCarouselSection = ({ section, onItemClick }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [xOffset, setXOffset] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const syncButtons = useCallback(
    (nextX = xOffset) => {
      if (!containerRef.current || !trackRef.current) return;
      const max = Math.min(0, containerRef.current.offsetWidth - trackRef.current.scrollWidth);
      setShowLeft(nextX < -4);
      setShowRight(nextX > max + 4);
    },
    [xOffset],
  );

  useEffect(() => {
    const handler = () => syncButtons();
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [syncButtons]);

  useEffect(() => {
    setXOffset(0);
    setTimeout(() => syncButtons(0), 50);
  }, [section.id, syncButtons]);

  const scroll = (dir) => {
    if (!containerRef.current || !trackRef.current) return;
    const max = Math.min(0, containerRef.current.offsetWidth - trackRef.current.scrollWidth);
    const amount = Math.round(containerRef.current.offsetWidth * 0.72);
    const next = dir === "left" ? Math.min(0, xOffset + amount) : Math.max(max, xOffset - amount);
    setXOffset(next);
    syncButtons(next);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{section.title}</h3>
          <p className="text-sm text-gray-400 mt-1">Handpicked reels curated from live vendor content</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            disabled={!showLeft}
            onClick={() => scroll("left")}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            disabled={!showRight}
            onClick={() => scroll("right")}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          ref={trackRef}
          animate={{ x: xOffset }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
          className="flex gap-5"
          style={{ width: "max-content" }}
        >
          {section.items.length > 0 ? (
            section.items.map((item, idx) => (
              <div key={item.id} className="w-[220px] 2xl:w-[240px] shrink-0">
                <ReelCard item={item} idx={idx} onClick={() => onItemClick(item, section.items, idx)} />
              </div>
            ))
          ) : (
            <div className="py-12 text-gray-400 text-sm">No reels found</div>
          )}
        </motion.div>
      </div>
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
  <div className="fixed inset-0 z-[130] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-6" onClick={() => setIsSearchOpen(false)}>
    <div
      className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200/70 dark:border-gray-800"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events, services, vendors, reels…"
          className="flex-1 text-base outline-none text-gray-800 dark:text-white placeholder:text-gray-400 bg-transparent"
        />
        {isSearching && <Loader2 size={18} className="animate-spin text-gray-400" />}
        {searchQuery ? (
          <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        ) : null}
      </div>

      {searchResults.length > 0 ? (
        <ul className="max-h-[70vh] overflow-y-auto py-2 divide-y divide-gray-50 dark:divide-gray-800">
          {searchResults.map((result, i) => (
            <li key={i}>
              <button
                onClick={() => handleSearchResultClick(result)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <span className="text-2xl shrink-0">
                  {result.type === "reel"
                    ? "🎬"
                    : result.type === "event"
                      ? "🎉"
                      : result.type === "subtype"
                        ? "📌"
                        : "🏢"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{result.label}</p>
                  <p className="text-xs text-gray-400 truncate">{result.sublabel}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold shrink-0 ${
                    result.type === "reel"
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : result.type === "event"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : result.type === "subtype"
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
        <div className="py-16 text-center">
          <p className="text-gray-400 text-sm">
            No results for <span className="font-semibold text-gray-700 dark:text-gray-300">"{searchQuery}"</span>
          </p>
        </div>
      ) : !searchQuery.trim() ? (
        <div className="px-5 py-6">
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Quick Search</p>
          <div className="flex flex-wrap gap-2">
            {["Wedding", "Birthday", "Anniversary", "DJ", "Catering", "Venues", "Decor", "Photographers"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="text-xs px-3.5 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400 transition-colors font-semibold"
              >
                {tag}
              </button>
            ))}
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[140]" />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white dark:bg-gray-950 z-[141] border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col"
      >
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-gray-900 dark:text-white">Filter & Sort</h2>
            {activeCount > 0 && (
              <span className="w-6 h-6 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-[10px] font-black">
                {activeCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.22em] mb-4">Sort By</h4>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSort(opt.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    sort === opt.id
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.22em] mb-4">Minimum Rating</h4>
            <div className="flex gap-2 flex-wrap">
              {ratings.map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(minRating === r ? null : r)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    minRating === r
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <Star size={12} className={minRating === r ? "fill-amber-400 text-amber-400" : "fill-gray-400 text-gray-400"} />
                  {r}+
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.22em] mb-4">Location</h4>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocation(location === loc ? null : loc)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    location === loc
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <MapPin size={12} />
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-800 space-y-3">
          {activeCount > 0 && (
            <button
              onClick={() => {
                setSort("relevance");
                setMinRating(null);
                setPriceRange(null);
                setLocation(null);
              }}
              className="w-full py-3 rounded-2xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold text-sm"
            >
              Reset All
            </button>
          )}
          <button
            onClick={() => onApply({ sort, minRating, priceRange, location })}
            className="w-full py-3.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-sm flex items-center justify-center gap-2"
          >
            <Filter size={14} />
            Apply Filters
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
      icon: <HeartHandshake size={30} />,
      gradient: "from-rose-500 to-pink-600",
      desc: "Plan your dream day",
    },
    {
      id: "anniversary",
      label: "Anniversary",
      icon: <Heart size={30} />,
      gradient: "from-red-500 to-rose-600",
      desc: "Celebrate your love",
    },
    {
      id: "birthday",
      label: "Birthday",
      icon: <Cake size={30} />,
      gradient: "from-amber-500 to-orange-600",
      desc: "Make it memorable",
    },
    {
      id: "corporate",
      label: "Corporate",
      icon: <Building2 size={30} />,
      gradient: "from-blue-500 to-indigo-600",
      desc: "Professional events",
    },
  ];
  const filteredOthers = OTHER_EVENT_TYPES.filter((e) => e.label.toLowerCase().includes(searchOther.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[160] bg-black/55 backdrop-blur-md flex items-center justify-center p-8">
      <motion.div
        initial={{ y: 28, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="w-full max-w-4xl bg-white dark:bg-gray-950 rounded-[36px] shadow-2xl border border-gray-200/60 dark:border-gray-800 overflow-hidden"
      >
        <div className="px-10 py-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl">
              <Sparkles size={28} className="text-white dark:text-gray-900" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">What are you planning?</h2>
            <p className="text-sm text-gray-400 mt-3">Choose your event to explore ideas, reels and vendors</p>
          </div>

          {!showOthers ? (
            <>
              <div className="grid grid-cols-2 gap-5 mb-6">
                {mainEvents.map((event, idx) => (
                  <motion.button
                    key={event.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.06 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(event.id, event.label)}
                    className="p-7 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 hover:shadow-xl hover:border-violet-200 transition-all text-left"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${event.gradient} flex items-center justify-center text-white shadow-lg mb-5`}>
                      {event.icon}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">{event.label}</h3>
                    <p className="text-sm text-gray-400 mt-1">{event.desc}</p>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => setShowOthers(true)}
                className="w-full py-4 rounded-2xl bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-bold text-sm flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-800"
              >
                <PartyPopper size={16} />
                Other Event Types
                <ChevronDown size={14} />
              </button>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button onClick={() => setShowOthers(false)} className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-5">
                <ArrowLeft size={14} />
                Back
              </button>
              <div className="relative mb-4">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search event type..."
                  value={searchOther}
                  onChange={(e) => setSearchOther(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {filteredOthers.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onSelect(event.id, event.label)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 hover:border-violet-200 transition-all text-left"
                  >
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{event.label}</span>
                    <ChevronRight size={15} className="text-gray-300" />
                  </button>
                ))}
              </div>
              {filteredOthers.length === 0 && (
                <p className="text-center py-10 text-sm text-gray-400">No matching event types</p>
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[170]" />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed top-0 right-0 h-full w-full max-w-[540px] bg-white dark:bg-gray-950 z-[171] overflow-hidden flex flex-col shadow-2xl border-l border-gray-200 dark:border-gray-800"
      >
        <div className="px-6 py-5 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-gray-200">
            <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black text-gray-900 dark:text-white truncate">Book {item.title || "Vendor"}</h2>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <Star size={10} className="fill-amber-400 text-amber-400" /> {item.rating?.toFixed?.(1) || "4.2"} · {item.location}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400 mb-4">Preferred Date</h4>
            <div className="flex flex-wrap gap-2">
              {dates.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    selectedDate === d
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400 mb-4">Choose Package</h4>
            <div className="space-y-3">
              {packages.map((pkg, i) => (
                <button
                  key={pkg.name}
                  onClick={() => setSelectedPackage(i)}
                  className={`w-full p-4 rounded-2xl text-left transition-all ${
                    selectedPackage === i
                      ? "bg-gray-900 dark:bg-white ring-2 ring-gray-900 dark:ring-white"
                      : "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-black ${selectedPackage === i ? "text-white dark:text-gray-900" : "text-gray-900 dark:text-white"}`}>
                      {pkg.name}
                    </span>
                    <span className={`text-lg font-black ${selectedPackage === i ? "text-emerald-400 dark:text-emerald-600" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {pkg.price}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {pkg.features.map((f) => (
                      <span key={f} className={`text-xs ${selectedPackage === i ? "text-white/60 dark:text-gray-900/50" : "text-gray-400"}`}>
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400 mb-4">Add-ons</h4>
            <div className="flex flex-wrap gap-2">
              {["Extra Hours", "Drone Shots", "Photo Album", "Same-day Edit"].map((addon) => (
                <button
                  key={addon}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
                >
                  + {addon}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 font-semibold">Total</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{packages[selectedPackage].price}</p>
            </div>
            {selectedDate && (
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-xl">
                {selectedDate}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-900 rounded-2xl flex items-center justify-center gap-2">
              <MessageSquare size={16} className="text-gray-700 dark:text-gray-300" />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Chat First</span>
            </button>
            <button className="flex-1 py-3.5 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center gap-2">
              <Zap size={16} className="text-white dark:text-gray-900" />
              <span className="text-sm font-black text-white dark:text-gray-900">Confirm Booking</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const ReelsViewerModal = ({ reels: initialReels, initialIndex, onClose, onBookNow }) => {
  const router = useRouter();

  const [reels, setReels] = useState(initialReels);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [expanded, setExpanded] = useState(true);
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
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
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
    setIsLiked(false);
    setIsSaved(false);
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
  });

  const goToReel = useCallback(
    (direction) => {
      if (direction === "up" && currentIndex < reels.length - 1) setCurrentIndex((p) => p + 1);
      else if (direction === "down" && currentIndex > 0) setCurrentIndex((p) => p - 1);
    },
    [currentIndex, reels.length],
  );

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    if (info.offset.y < -50 || info.velocity.y < -300) goToReel("up");
    else if (info.offset.y > 50 || info.velocity.y > 300) goToReel("down");
    if (info.velocity.x > 500 || info.offset.x > 180) handleClose();
  };

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    window.history.back();
    onClose();
  }, [onClose]);

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
      } catch (err) {
        console.error("Failed to fetch vendor profile:", err);
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
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLocalLikeCount((c) => (newLiked ? c + 1 : Math.max(0, c - 1)));
    if (newLiked) {
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 600);
    }
    toggleLike(currentReel._id, newLiked ? "like" : "unlike");
  };

  const handleSaveToggle = () => {
    if (!currentReel?._id) return;
    const newSaved = !isSaved;
    setIsSaved(newSaved);
    setLocalSaveCount((c) => (newSaved ? c + 1 : Math.max(0, c - 1)));
    toggleSave(currentReel._id, newSaved ? "save" : "unsave");
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-sm"
    >
      <div className="absolute inset-0 grid grid-cols-[minmax(360px,780px)_1fr]">
        <div className="relative flex items-center justify-center bg-black">
          <div className="absolute top-6 left-6 z-30 flex items-center gap-3">
            <button onClick={handleClose} className="w-11 h-11 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white">
              <ArrowLeft size={18} />
            </button>
            <div className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm font-bold">
              {currentIndex + 1} / {reels.length}
            </div>
          </div>

          <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
            <button onClick={() => setIsMuted(!isMuted)} className="w-11 h-11 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button
              onClick={() => setExpanded((p) => !p)}
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white"
            >
              {expanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 hidden xl:block">
            <button
              onClick={() => goToReel("down")}
              disabled={currentIndex === 0}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white disabled:opacity-20"
            >
              <ChevronLeft size={22} />
            </button>
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 hidden xl:block">
            <button
              onClick={() => goToReel("up")}
              disabled={currentIndex === reels.length - 1}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white disabled:opacity-20"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            onClick={handleTap}
            className="relative h-[88vh] aspect-[9/16] rounded-[34px] overflow-hidden touch-pan-y"
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
                        <Loader2 size={38} className="text-white animate-spin" />
                      </div>
                    )}
                    {!isPlaying && !videoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="w-20 h-20 rounded-full bg-black/35 backdrop-blur flex items-center justify-center">
                          <Play size={30} className="text-white fill-white ml-1" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <img src={currentReel.thumbnail} alt={currentReel.title} className="w-full h-full object-cover" />
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
                  <Heart size={100} className="text-white fill-white drop-shadow-2xl" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute right-4 bottom-36 flex flex-col items-center gap-5 z-30">
              <button onClick={handleLikeToggle} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                  <Heart size={22} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />
                </div>
                <span className="text-white text-[11px] font-bold">{formatCount(localLikeCount)}</span>
              </button>

              <button onClick={handleSaveToggle} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                  {isSaved ? <BookmarkCheck size={22} className="text-white fill-white" /> : <Bookmark size={22} className="text-white" />}
                </div>
                <span className="text-white text-[11px] font-bold">
                  {localSaveCount > 0 ? formatCount(localSaveCount) : "Save"}
                </span>
              </button>

              <button onClick={handleShare} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                  <Send size={20} className="text-white" />
                </div>
                <span className="text-white text-[11px] font-bold">
                  {currentReel.shareCount > 0 ? formatCount(currentReel.shareCount) : "Share"}
                </span>
              </button>
            </div>

            <div className="absolute left-0 right-0 bottom-0 z-30 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/30 bg-gray-600 shrink-0 cursor-pointer" onClick={handleSeeProfile}>
                  <img src={vendorProfile?.vendorAvatar || currentReel.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={handleSeeProfile}>
                  <span className="text-white font-black text-sm truncate block">{`Deto - ${currentReel?.title?.slice(0, 18)}...`}</span>
                  <span className="text-white/40 text-xs flex items-center gap-1">
                    {(vendorProfile?.location?.city || currentReel.location) && (
                      <>
                        <MapPin size={10} /> {vendorProfile?.location?.city || currentReel.location}
                      </>
                    )}
                    {currentReel.isPinned && <BadgeCheck size={10} className="text-blue-400 ml-1" />}
                  </span>
                </div>
                <div className="px-3 py-1.5 bg-white/10 backdrop-blur rounded-full text-white text-xs font-bold">
                  {formatCount(localViewCount)} views
                </div>
              </div>

              <p className="text-white font-bold text-sm leading-snug line-clamp-2">{currentReel.caption}</p>
              {currentReel.price && <p className="text-emerald-400 font-black text-lg mt-2">{currentReel.price}</p>}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSeeProfile}
                  disabled={isProfileLoading}
                  className="flex-1 py-3.5 bg-white/15 text-white backdrop-blur rounded-2xl flex items-center justify-center gap-2 border border-white/10"
                >
                  <ExternalLink size={15} />
                  {isProfileLoading ? "Loading..." : "See Profile"}
                </button>
                <button
                  onClick={() => onBookNow(currentReel)}
                  className="flex-1 py-3.5 bg-white rounded-2xl flex items-center justify-center gap-2 shadow-lg"
                >
                  <Calendar size={15} className="text-gray-900" />
                  <span className="text-sm font-black text-gray-900">Book Now</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              className="h-full bg-white dark:bg-gray-950 border-l border-gray-200/60 dark:border-gray-800 overflow-y-auto"
            >
              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{currentReel.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    {currentReel.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {currentReel.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      {currentReel.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {formatCount(localViewCount)}
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 p-6 space-y-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400 mb-2">Caption</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{currentReel.caption || "No caption available."}</p>
                  </div>

                  {currentReel.description && (
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400 mb-2">Description</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{currentReel.description}</p>
                    </div>
                  )}

                  {currentReel.musicTitle && (
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400 mb-2">Music</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Music size={14} />
                        {currentReel.musicTitle}
                        {currentReel.musicArtist ? ` · ${currentReel.musicArtist}` : ""}
                      </p>
                    </div>
                  )}

                  {currentReel.hashtags?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400 mb-2">Hashtags</p>
                      <div className="flex flex-wrap gap-2">
                        {currentReel.hashtags.slice(0, 10).map((h) => (
                          <span key={h} className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-xs font-semibold text-blue-500">
                            {h.startsWith("#") ? h : `#${h}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentReel.price && (
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400 mb-2">Price</p>
                      <p className="text-2xl font-black text-emerald-500">{currentReel.price}</p>
                    </div>
                  )}
                </div>

                {similarVendors.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white">Similar Vendors</h4>
                        <p className="text-sm text-gray-400 mt-1">Explore profiles related to this reel</p>
                      </div>
                      <button
                        onClick={handleSeeProfile}
                        className="text-sm font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1"
                      >
                        View all
                        <ChevronRight size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {similarVendors.slice(0, 4).map((v) => (
                        <button
                          key={v._id}
                          onClick={() => navigateToVendorProfile(v._id)}
                          className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200/60 dark:border-gray-800 hover:border-violet-200 transition-all text-left"
                        >
                          {v.vendorAvatar ? (
                            <img src={v.vendorAvatar} alt="" className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center shrink-0">
                              <Building2 size={18} className="text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-black text-gray-900 dark:text-white truncate">
                              {v.vendorBusinessName || v.vendorName}
                            </p>
                            {v.location?.city && <p className="text-xs text-gray-400">{v.location.city}</p>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {relatedReels.length > 0 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-black text-gray-900 dark:text-white">Related Reels</h4>
                      <p className="text-sm text-gray-400 mt-1">Jump into nearby inspiration without closing the viewer</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {relatedReels.slice(0, 6).map((rr) => (
                        <button
                          key={rr._id}
                          onClick={() => loadRelatedIntoFeed(rr)}
                          className="relative aspect-[10/16] rounded-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800 hover:ring-violet-300 transition-all"
                        >
                          <img src={rr.thumbnail} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white text-xs font-bold line-clamp-2 text-left">{rr.title}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-violet-950 to-gray-950 text-white p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      <TrendingUp size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-black">Keep exploring</h4>
                      <p className="text-sm text-white/70 mt-1">
                        Use arrow keys to move between reels, space to pause, and open vendor profiles for deeper discovery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSimilarVendorsDrawer(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[180]" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-[540px] bg-white dark:bg-gray-950 z-[181] overflow-hidden flex flex-col shadow-2xl border-l border-gray-200 dark:border-gray-800"
            >
              <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-gray-700 dark:text-gray-300" />
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">Similar Vendors</h2>
                  <span className="text-xs text-gray-400 font-semibold">({similarVendorProfiles.length})</span>
                </div>
                <button onClick={() => setShowSimilarVendorsDrawer(false)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-400">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingSimilarProfiles ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 size={30} className="animate-spin text-gray-400" />
                    <p className="text-sm text-gray-400 font-medium">Loading vendor profiles...</p>
                  </div>
                ) : similarVendorProfiles.length > 0 ? (
                  <div className="p-5 space-y-3">
                    {similarVendorProfiles.map((profile) => {
                      if (!profile || !profile._id || !profile.category) return null;
                      return (
                        <motion.div
                          key={profile._id}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            setShowSimilarVendorsDrawer(false);
                            const backTo = encodeURIComponent(window.location.href);
                            const path = profile.vendorId
                              ? `/vendor/${profile.category}/${profile.vendorId}/profile`
                              : `/vendor/${profile.category}/profile/${profile.username}`;
                            closeAndNavigate(`${path}?backTo=${backTo}`);
                          }}
                          className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 cursor-pointer"
                        >
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0">
                            {profile.vendorAvatar ? (
                              <img src={profile.vendorAvatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Building2 size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-900 dark:text-white truncate">
                              {profile.vendorBusinessName || profile.vendorName || "Vendor"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                              {profile.category?.replace(/-/g, " ")}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              {(profile.location?.city || profile.city) && (
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <MapPin size={10} /> {profile.location?.city || profile.city}
                                </span>
                              )}
                              {profile.rating && (
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <Star size={10} className="fill-amber-400 text-amber-400" /> {profile.rating}
                                </span>
                              )}
                              {profile.startingPrice && (
                                <span className="text-xs text-emerald-500 font-bold">{profile.startingPrice}</span>
                              )}
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 shrink-0" />
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-sm text-gray-400 font-medium">No vendor profiles found</p>
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
  const urlSubtype = searchParams.get("subtype") || null;
  const urlNested = searchParams.get("nested") || null;
  const urlSort = searchParams.get("sort") || "relevance";
  const urlRating = searchParams.get("rating") ? parseFloat(searchParams.get("rating")) : null;
  const urlLocation = searchParams.get("location") || null;
  const urlReel = searchParams.get("reel") || null;
  const urlSearch = searchParams.get("q") || "";
  const urlQuickFilter = searchParams.get("wf") || "all";

  const [eventType, setEventType] = useState(urlType);
  const [eventLabel, setEventLabel] = useState(() => {
    if (!urlType) return "";
    const main = ["wedding", "birthday", "anniversary", "corporate"];
    if (main.includes(urlType)) return urlType.charAt(0).toUpperCase() + urlType.slice(1);
    const other = OTHER_EVENT_TYPES.find((e) => e.id === urlType);
    return other ? other.label : urlType.charAt(0).toUpperCase() + urlType.slice(1);
  });
  const [showModal, setShowModal] = useState(!urlType);
  const [activeSubtype, setActiveSubtype] = useState(urlSubtype);
  const [activeNested, setActiveNested] = useState(urlNested);
  const [reelsViewerData, setReelsViewerData] = useState(null);
  const [drawerItem, setDrawerItem] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterState, setFilterState] = useState({
    sort: urlSort,
    minRating: urlRating,
    priceRange: null,
    location: urlLocation,
  });
  const [weddingQuickFilter, setWeddingQuickFilter] = useState(urlQuickFilter);
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
    if (activeSubtype) params.subtype = activeSubtype;
    if (activeNested) params.nested = activeNested;
    if (filterState.sort && filterState.sort !== "relevance") params.sort = filterState.sort;
    if (filterState.minRating) params.rating = String(filterState.minRating);
    if (filterState.location) params.location = filterState.location;
    if (eventType === "wedding" && weddingQuickFilter && weddingQuickFilter !== "all") params.wf = weddingQuickFilter;
    return params;
  }, [eventType, activeSubtype, activeNested, filterState, weddingQuickFilter]);

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
  }, [eventType, activeSubtype, activeNested, filterState, weddingQuickFilter, showModal, syncURL]);

  useEffect(() => {
    setRecentlyViewedReels(getRecentlyViewed());
  }, [reelsViewerData]);

  useEffect(() => {
    if (pendingReelIdRef.current && initialLoadDone && !reelsViewerData) {
      const reelId = pendingReelIdRef.current;
      pendingReelIdRef.current = null;

      let foundReel = null;
      for (const section of carouselSections) {
        const match = section.items.find((r) => r._id === reelId);
        if (match) {
          foundReel = match;
          break;
        }
      }

      if (foundReel) {
        const allReels = carouselSections.flatMap((s) => s.items);
        const uniqueMap = new Map();
        allReels.forEach((r) => {
          if (!uniqueMap.has(r._id)) uniqueMap.set(r._id, r);
        });
        const uniqueReels = Array.from(uniqueMap.values());
        const idx = uniqueReels.findIndex((r) => r._id === reelId);
        setReelsViewerData({ reels: uniqueReels, initialIndex: Math.max(0, idx) });
      } else {
        fetchReelById(reelId).then((raw) => {
          if (raw) {
            const reel = normalizeReel(raw);
            setReelsViewerData({ reels: [reel], initialIndex: 0 });
          }
        });
      }
    }
  }, [initialLoadDone, reelsViewerData, carouselSections]);

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

  const activeSubtypeData = useMemo(() => {
    if (!config || !activeSubtype) return null;
    return config.subtypes.find((s) => s.id === activeSubtype) || null;
  }, [config, activeSubtype]);

  const getWeddingHeading = useCallback((index) => WEDDING_SECTION_HEADINGS[index % WEDDING_SECTION_HEADINGS.length], []);

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

      if (activeSubtype) baseParams.subtype = activeSubtype;
      if (activeNested) baseParams.nestedType = activeNested;
      if (filterState.location) baseParams.city = filterState.location;
      if (eventType === "wedding" && weddingQuickFilter && weddingQuickFilter !== "all") baseParams.tag = weddingQuickFilter;

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
          fetchFeaturedReels({ limit: 15 }),
          fetchTrendingReels({ limit: 15 }),
        ]);

        if (cancelled || version !== fetchVersionRef.current) return;

        const allReels = (mainResult.data || []).map(normalizeReel);
        const featuredReels = (featuredResult.reels || []).map(normalizeReel);
        const tReels = (trendingResult.reels || []).map(normalizeReel);
        setTrendingReels(tReels);
        setPaginationInfo(mainResult.pagination || null);

        const sections = [];
        let headingIdx = 0;
        const isWedding = eventType === "wedding";

        if (activeSubtype) {
          const subtypeLabel = activeSubtypeData?.label || activeSubtype;
          if (activeNested) {
            const nestedLabel = activeSubtypeData?.nestedTypes?.find((n) => n.id === activeNested)?.label || activeNested;
            const half = Math.ceil(allReels.length / 2);
            if (allReels.length > 0) {
              sections.push({
                id: `${activeNested}-top`,
                title: isWedding ? getWeddingHeading(headingIdx++) : `${nestedLabel} — Top Picks`,
                items: allReels.slice(0, half),
              });
              if (allReels.length > half) {
                sections.push({
                  id: `${activeNested}-more`,
                  title: isWedding ? getWeddingHeading(headingIdx++) : `More ${nestedLabel}`,
                  items: allReels.slice(half),
                });
              }
            }
          } else if (allReels.length > 0) {
            if (allReels.length > 15) {
              sections.push({
                id: `${activeSubtype}-top`,
                title: isWedding ? getWeddingHeading(headingIdx++) : `Top ${subtypeLabel}`,
                items: allReels.slice(0, 15),
              });
              sections.push({
                id: `${activeSubtype}-more`,
                title: isWedding ? getWeddingHeading(headingIdx++) : `More ${subtypeLabel}`,
                items: allReels.slice(15),
              });
            } else {
              sections.push({
                id: `${activeSubtype}-main`,
                title: isWedding ? getWeddingHeading(headingIdx++) : `${subtypeLabel} Reels`,
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
              sections.push({ id: `cat-${cat}`, title: isWedding ? getWeddingHeading(headingIdx++) : label, items });
            });
          } else if (allReels.length > 0) {
            if (allReels.length > 20) {
              sections.push({
                id: "all-top",
                title: isWedding ? getWeddingHeading(headingIdx++) : `Top ${eventLabel}`,
                items: allReels.slice(0, 15),
              });
              sections.push({
                id: "all-more",
                title: isWedding ? getWeddingHeading(headingIdx++) : `Explore More`,
                items: allReels.slice(15),
              });
            } else {
              sections.push({
                id: "all-reels",
                title: isWedding ? getWeddingHeading(headingIdx++) : `${eventLabel} Reels`,
                items: allReels,
              });
            }
          }
        }

        const pinnedReels = allReels.filter((r) => r.isPinned || r.isSponsored);
        if (pinnedReels.length > 0) {
          sections.unshift({
            id: "sponsored",
            title: isWedding ? "💎 Premium & Luxury Wedding Services" : "⚡ Sponsored",
            items: pinnedReels,
          });
        }

        if (featuredReels.length > 0) {
          sections.push({
            id: "featured",
            title: isWedding ? "❤️ Couples' Favorite Picks" : "⭐ Featured",
            items: featuredReels,
          });
        }

        if (tReels.length > 0) {
          sections.push({
            id: "trending",
            title: isWedding ? "🔥 Viral Wedding Reels (Must Watch)" : "🔥 Trending Now",
            items: tReels,
          });
        }

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
  }, [eventType, activeSubtype, activeNested, filterState, weddingQuickFilter, config, activeSubtypeData, eventLabel, getWeddingHeading]);

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
          subtypeId: r.subtype,
        }));

        const localResults = [];
        Object.entries(EVENT_CONFIGS).forEach(([eventKey, cfg]) => {
          const eLabel = eventKey.charAt(0).toUpperCase() + eventKey.slice(1);
          if (eLabel.toLowerCase().includes(searchQuery.toLowerCase())) {
            localResults.push({ type: "event", label: eLabel, sublabel: "Event Category", eventId: eventKey });
          }
          cfg.subtypes?.forEach((sub) => {
            if (sub.label.toLowerCase().includes(searchQuery.toLowerCase())) {
              localResults.push({
                type: "subtype",
                label: sub.label,
                sublabel: `${eLabel} › Service`,
                eventId: eventKey,
                subtypeId: sub.id,
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
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
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
      setActiveSubtype(null);
      setActiveNested(null);
      setWeddingQuickFilter("all");
      setInitialLoadDone(false);
    }
    if (result.subtypeId) setActiveSubtype(result.subtypeId);
  };

  const handleEventSelect = (type, label) => {
    setEventType(type);
    setEventLabel(label);
    setShowModal(false);
    setActiveSubtype(null);
    setActiveNested(null);
    setWeddingQuickFilter("all");
    setInitialLoadDone(false);
  };

  const handleSubtypeClick = (subtypeId) => {
    if (activeSubtype === subtypeId || subtypeId === null) {
      setActiveSubtype(subtypeId);
      if (subtypeId === null || activeSubtype === subtypeId) {
        if (subtypeId === null || activeSubtype === subtypeId) setActiveNested(null);
      }
      if (activeSubtype === subtypeId && subtypeId !== null) {
        setActiveSubtype(null);
      }
    } else {
      setActiveSubtype(subtypeId);
      setActiveNested(null);
    }
    setInitialLoadDone(false);
  };

  const handleNestedClick = (nestedId) => {
    setActiveNested(activeNested === nestedId ? null : nestedId);
    setInitialLoadDone(false);
  };

  const handleWeddingQuickFilterClick = (filterId) => {
    setWeddingQuickFilter(filterId);
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
      } catch {}
    };

    cleanReelFromUrl();
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
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
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

      <div className="flex">
        <DesktopSidebar
          config={config}
          eventLabel={eventLabel}
          activeSubtype={activeSubtype}
          activeNested={activeNested}
          onSubtypeClick={handleSubtypeClick}
          onNestedClick={handleNestedClick}
          onChangeEvent={() => {
            setShowModal(true);
            setEventType(null);
            setActiveSubtype(null);
            setActiveNested(null);
            setWeddingQuickFilter("all");
            setInitialLoadDone(false);
            window.history.replaceState(null, "", pathname);
          }}
          weddingQuickFilter={weddingQuickFilter}
          onWeddingQuickFilterClick={handleWeddingQuickFilterClick}
          isWeddingType={isWeddingType}
        />

        <main className="flex-1 min-w-0">
          <div className="sticky top-0 z-40 border-b border-gray-200/70 dark:border-gray-800 bg-white/85 dark:bg-black/80 backdrop-blur-xl">
            <div className="px-8 2xl:px-10 py-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400 font-semibold">{eventLabel}</span>
                  {activeSubtypeData && (
                    <>
                      <ChevronRight size={14} className="text-gray-300" />
                      <span className="text-gray-700 dark:text-gray-300 font-bold">{activeSubtypeData.label}</span>
                    </>
                  )}
                  {activeNested && (
                    <>
                      <ChevronRight size={14} className="text-gray-300" />
                      <span className="text-gray-900 dark:text-white font-black">
                        {activeSubtypeData?.nestedTypes?.find((n) => n.id === activeNested)?.label || activeNested}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400"
                >
                  <RefreshCw size={16} className={isLoadingCarousels ? "animate-spin" : ""} />
                </button>

                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-3 h-11 min-w-[300px] px-4 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-left text-sm text-gray-400"
                >
                  <Search size={16} />
                  <span className="flex-1">Search events, reels, vendors…</span>
                  <span className="text-[11px] px-2 py-1 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800 font-semibold">
                    Ctrl K
                  </span>
                </button>

                <button
                  onClick={() => setShowFilter(true)}
                  className="relative h-11 px-4 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300"
                >
                  <Filter size={15} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-[10px] font-black">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="px-8 2xl:px-10 py-8 space-y-10">
            <DesktopHero
              eventLabel={eventLabel}
              activeSubtypeData={activeSubtypeData}
              activeNested={activeNested}
              paginationInfo={paginationInfo}
              activeSubtype={activeSubtype}
            />

            {!activeSubtype && <CategoryGrid config={config} activeSubtype={activeSubtype} onSubtypeClick={handleSubtypeClick} />}

            {activeSubtypeData?.nestedTypes?.length > 0 && (
              <NestedDesktopChips nestedTypes={activeSubtypeData.nestedTypes} activeNested={activeNested} onNestedClick={handleNestedClick} />
            )}

            {activeFilterCount > 0 && (
              <div className="flex gap-2 flex-wrap">
                {filterState.sort !== "relevance" && (
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-xs font-black">
                    {filterState.sort === "trending" ? "Trending" : filterState.sort === "rating" ? "Top Rated" : "Newest"}
                    <button onClick={() => setFilterState((p) => ({ ...p, sort: "relevance" }))}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {filterState.location && (
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-xs font-black">
                    <MapPin size={10} />
                    {filterState.location}
                    <button onClick={() => setFilterState((p) => ({ ...p, location: null }))}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {filterState.minRating && (
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-xs font-black">
                    <Star size={10} />
                    {filterState.minRating}+
                    <button onClick={() => setFilterState((p) => ({ ...p, minRating: null }))}>
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {isLoadingCarousels && !initialLoadDone && <FullPageSkeleton />}

            {initialLoadDone && (
              <div className="space-y-10">
                {carouselSections.length > 0 ? (
                  carouselSections.map((section) => (
                    <DesktopCarouselSection key={section.id} section={section} onItemClick={handleItemClick} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 px-6 text-center rounded-[32px] bg-white dark:bg-gray-950 border border-gray-200/70 dark:border-gray-800">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-5">
                      <Search size={28} className="text-gray-300" />
                    </div>
                    <p className="text-xl font-black text-gray-900 dark:text-white mb-2">No reels found</p>
                    <p className="text-sm text-gray-400 mb-5">Try selecting a different category or adjusting filters</p>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => setFilterState({ sort: "relevance", minRating: null, priceRange: null, location: null })}
                        className="px-5 py-3 bg-gray-900 dark:bg-white rounded-2xl text-white dark:text-gray-900 text-sm font-black"
                      >
                        Clear All Filters
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
                    className="rounded-[32px] p-7 bg-gradient-to-r from-gray-900 via-violet-900 to-fuchsia-900 text-white flex items-center gap-5 cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                      <TrendingUp size={24} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-black">Trending in {eventLabel}</h4>
                      <p className="text-sm text-white/70 mt-1">
                        {trendingReels.length > 0
                          ? `${trendingReels.length} trending reels this month`
                          : "See what others are booking this season"}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-white/50 shrink-0" />
                  </div>
                )}

                {paginationInfo?.hasNextPage && carouselSections.length > 0 && (
                  <div>
                    <button
                      onClick={async () => {
                        const nextPage = (paginationInfo.page || 1) + 1;
                        const params = {
                          type: config.type || eventType,
                          isActive: "true",
                          limit: 50,
                          page: nextPage,
                        };
                        if (activeSubtype) params.subtype = activeSubtype;
                        if (activeNested) params.nestedType = activeNested;
                        if (filterState.location) params.city = filterState.location;
                        if (eventType === "wedding" && weddingQuickFilter && weddingQuickFilter !== "all") params.tag = weddingQuickFilter;

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
                          setCarouselSections((prev) => [...prev, { id: `page-${nextPage}`, title: `More ${eventLabel} Reels`, items: moreReels }]);
                          setPaginationInfo(result.pagination || null);
                        }
                      }}
                      className="w-full py-4 bg-white dark:bg-gray-950 rounded-3xl flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 font-bold text-sm border border-gray-200/70 dark:border-gray-800"
                    >
                      <ChevronDown size={16} />
                      Load More Reels
                    </button>
                  </div>
                )}

                {recentlyViewedReels.length > 0 && (
                  <DesktopCarouselSection
                    section={{ id: "recently-viewed", title: "🕐 Recently Viewed", items: recentlyViewedReels }}
                    onItemClick={handleItemClick}
                  />
                )}
              </div>
            )}
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

      <AnimatePresence>
        {showModal && <EventSelectionModal onSelect={handleEventSelect} />}
      </AnimatePresence>
    </div>
  );
}