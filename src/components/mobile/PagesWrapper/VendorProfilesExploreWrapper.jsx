"use client";

import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  Camera,
  Image as ImageIcon,
  Video,
  LayoutGrid,
  Sparkles,
  ArrowRight,
  Users,
  Trophy,
  Zap,
  Search,
  Check,
  Clock,
  Calendar,
  Palette,
  Utensils,
  Music,
  Home,
  Lamp,
  MapPin,
  Eye,
  X,
  Building2,
  ChevronDown,
  Paintbrush2,
  UserCheck,
  UtensilsCrossed,
  Shirt,
  Hand,
  CakeSlice,
  Gem,
  Mail,
  Scissors,
  Drum,
  MicVocal,
  FlameKindling,
  ShoppingBag,
} from "lucide-react";
import SmartMedia from "../SmartMediaLoader";
import { ScrollCarousel } from "./IdeasPageWrapper";
import { HERO_CATEGORIES } from "./FindAVendorPageWrapper";

const CAROUSEL_SECTIONS = [
  { key: "venues", label: "Premium Venues", subtitle: "Grand stages for your event", icon: Building2, color: "#0ea5e9", apiCategory: "venues" },
  { key: "photographers", label: "Photographers", subtitle: "Freeze your best memories", icon: Camera, color: "#3b82f6", apiCategory: "photographers" },
  { key: "makeup", label: "Makeup Artists", subtitle: "Bridal glow experts", icon: Paintbrush2, color: "#ec4899", apiCategory: "makeup" },
  { key: "planners", label: "Wedding Planners", subtitle: "Expertly managed celebrations", icon: UserCheck, color: "#8b5cf6", apiCategory: "planners" },
  { key: "catering", label: "Best Catering", subtitle: "Delicious food for your guests", icon: UtensilsCrossed, color: "#14b8a6", apiCategory: "catering" },
  { key: "clothes", label: "Bridal & Groom Wear", subtitle: "Trendsetting wedding fashion", icon: Shirt, color: "#f43f5e", apiCategory: "clothes" },
  { key: "mehendi", label: "Mehendi Artists", subtitle: "Exquisite henna designs", icon: Hand, color: "#d946ef", apiCategory: "mehendi" },
  { key: "cakes", label: "Celebration Cakes", subtitle: "Sweet masterpieces", icon: CakeSlice, color: "#84cc16", apiCategory: "cakes" },
  { key: "jewellery", label: "Fine Jewellery", subtitle: "Exquisite bridal accessories", icon: Gem, color: "#f59e0b", apiCategory: "jewellery" },
  { key: "invitations", label: "Invitations", subtitle: "Beautiful wedding cards", icon: Mail, color: "#64748b", apiCategory: "invitations" },
  { key: "djs", label: "DJ & Music", subtitle: "Set the perfect wedding mood", icon: Music, color: "#6366f1", apiCategory: "djs" },
  { key: "hairstyling", label: "Hairstyling", subtitle: "Flawless hair transformations", icon: Scissors, color: "#db2777", apiCategory: "hairstyling" },
  { key: "decor", label: "Decorators", subtitle: "Transform every space", icon: Lamp, color: "#d946ef", apiCategory: "decor" },
  { key: "dhol", label: "Dhol Players", subtitle: "Traditional beats and rhythm", icon: Drum, color: "#fb923c", apiCategory: "dhol" },
  { key: "anchor", label: "Anchors & Hosts", subtitle: "Engage your audience", icon: MicVocal, color: "#22c55e", apiCategory: "anchor" },
  { key: "stageEntry", label: "Grand Stage Entry", subtitle: "Unforgettable entrances", icon: Sparkles, color: "#a855f7", apiCategory: "stageEntry" },
  { key: "fireworks", label: "Fireworks", subtitle: "Spectacular pyro displays", icon: FlameKindling, color: "#ef4444", apiCategory: "fireworks" },
  { key: "barat", label: "Barat Processions", subtitle: "Bands, horses and more", icon: Music, color: "#eab308", apiCategory: "barat" },
];

const FALLBACK_IMAGES = [
  "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428617/MakeUpCat_lcp68d.png",
  "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428623/PhotographerCat_ymq0vh.png",
  "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428626/PlannerCat_p16v2m.png",
  "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428620/MehndiCat_hdsxxo.png",
  "https://res.cloudinary.com/dkbbz4ev9/image/upload/v1757836294/0EFTkdsFRtcOsPL6eOczS1WeImaQFUUPNK96jUd6IIWmiFdBYYAqWXnNG4O6l1Lm9ygs653-k-no_vl3ofw.jpg",
];

const getFallbackProfiles = (category) => {
  return Array.from({ length: 1 }).map((_, i) => ({
    _id: `fallback-${category}-${i}`,
    vendorBusinessName: `Premium ${category}`,
    vendorName: "PlanWAB Vendor",
    vendorType: category,
    location: { city: "India" },
    trust: Math.floor(Math.random() * 50) + 15,
    likesCount: Math.floor(Math.random() * 1000) + 100,
    postsCount: Math.floor(Math.random() * 50) + 5,
    reelsCount: Math.floor(Math.random() * 20) + 1,
    highlightsCount: 0,
    createdAt: new Date().toISOString()
  }));
};

const isValidImageUrl = (url) => {
  return url && typeof url === 'string' && url !== "null" && url !== "undefined" && url.trim() !== "";
};

const getProfileImage = (profile, fallbackIndex = 0) => {
  if (isValidImageUrl(profile.vendorCoverImageNew)) return profile.vendorCoverImageNew;
  if (isValidImageUrl(profile.vendorAvatarNew)) return profile.vendorAvatarNew;
  if (isValidImageUrl(profile.highlights?.[0]?.coverImage)) return profile.highlights[0].coverImage;
  if (isValidImageUrl(profile.posts?.[0]?.mediaUrl)) return profile.posts[0].mediaUrl;
  if (isValidImageUrl(profile.reels?.[0]?.thumbnail)) return profile.reels[0].thumbnail;
  return FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
};

const getAvatarImage = (profile, fallbackIndex = 0) => {
  if (isValidImageUrl(profile.vendorAvatarNew)) return profile.vendorAvatarNew;
  return getProfileImage(profile, fallbackIndex);
};

const HERO_MOSAIC = [
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428617/MakeUpCat_lcp68d.png", label: "MUA", span: "row-span-2", pos: "0", delay: 0.1, catKey: "makeup" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428623/PhotographerCat_ymq0vh.png", label: "PHOTO", span: "row-span-3", pos: "1", delay: 0.3, catKey: "photographers" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428613/DholCat_swqr0p.png", label: "MUSIC", span: "row-span-1", pos: "2", delay: 0.5, catKey: "djs" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428626/PlannerCat_p16v2m.png", label: "PLAN", span: "row-span-4", pos: "3", delay: 0.2, catKey: "planners" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428620/MehndiCat_hdsxxo.png", label: "ART", span: "row-span-2", pos: "4", delay: 0.4, catKey: "mehendi" },
  { src: "https://res.cloudinary.com/dkbbz4ev9/image/upload/v1757836294/0EFTkdsFRtcOsPL6eOczS1WeImaQFUUPNK96jUd6IIWmiFdBYYAqWXnNG4O6l1Lm9ygs653-k-no_vl3ofw.jpg", label: "VENUE", span: "row-span-3", pos: "5", delay: 0.6, catKey: "venues" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428610/CaterorsCat_pch4d5.png", label: "CATERER", span: "row-span-3", pos: "6", delay: 0.7, catKey: "catering" },
];

const ProfileMediaHero = memo(({ featuredProfiles = {}, isLoading = false }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (key) => {
    setIsDropdownOpen(false);
    const element = document.getElementById(`carousel-${key}`);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const slots = useMemo(() => {
    const MOSAIC_LAYOUT = [
      { span: "row-span-2", col: 0, delay: 0.1, fallbackIdx: 0 },
      { span: "row-span-3", col: 0, delay: 0.3, fallbackIdx: 1 },
      { span: "row-span-4", col: 1, delay: 0.2, fallbackIdx: 3 },
      { span: "row-span-2", col: 1, delay: 0.4, fallbackIdx: 4 },
      { span: "row-span-3", col: 2, delay: 0.6, fallbackIdx: 5 },
      { span: "row-span-3", col: 2, delay: 0.7, fallbackIdx: 6 },
    ];

    const liveCategories = CAROUSEL_SECTIONS
      .filter(s => {
        const p = featuredProfiles[s.key];
        return p && isValidImageUrl(getProfileImage(p, 0));
      })
      .map(s => {
        const p = featuredProfiles[s.key];
        return {
          catKey: s.key,
          apiCategory: s.apiCategory,
          label: s.label,
          src: getProfileImage(p, 0),
          vendorName: p.vendorBusinessName || p.vendorName || s.label,
          vendorId: p.vendorId || p.vendor || null,
          username: p.username || null,
        };
      });

    return MOSAIC_LAYOUT.map((layout, i) => {
      const live = liveCategories[i];
      if (live) return {
        ...layout,
        src: live.src,
        label: live.vendorName,
        catLabel: live.label,
        vendorId: live.vendorId,
        username: live.username,
        apiCategory: live.apiCategory,
        isLive: true,
      };
      const fb = HERO_MOSAIC[layout.fallbackIdx] || HERO_MOSAIC[0];
      return { ...layout, src: fb.src, label: fb.label, catLabel: fb.label, isLive: false };
    });
  }, [featuredProfiles]);

  const col0 = slots.filter(s => s.col === 0);
  const col1 = slots.filter(s => s.col === 1);
  const col2 = slots.filter(s => s.col === 2);

  const handleSlotClick = (slot) => {
    if (!slot.isLive) return;
    const cat = slot.apiCategory;
    if (slot.vendorId) {
      router.push(`/vendor/${cat}/${slot.vendorId}/profile`);
    } else if (slot.username) {
      router.push(`/vendor/${cat}/profile/${slot.username}`);
    }
  };

  const MosaicCell = ({ slot, sliver = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: slot.delay }}
      onClick={() => handleSlotClick(slot)}
      className={`${slot.span} group relative overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 ${slot.isLive ? "cursor-pointer" : "cursor-default"}`}
    >
      {isLoading ? (
        <div className="w-full h-full animate-pulse bg-slate-200 dark:bg-slate-800" />
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div key={slot.src} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
              <SmartMedia useSkeleton={false} src={slot.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </motion.div>
          </AnimatePresence>
          {!sliver && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          )}
          {slot.isLive && !sliver && (
            <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-1.5 hidden md:block">
                <p className="text-white text-[10px] font-black uppercase tracking-widest">View Profile</p>
              </div>
            </div>
          )}
          {!sliver && (
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em] mb-0.5">{slot.catLabel}</p>
              <p className="text-[10px] font-black text-white uppercase tracking-wider drop-shadow-md truncate">{slot.label}</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );

  return (
    <div className="relative w-full bg-[#fcfcfc] dark:bg-slate-950 md:rounded-[48px] overflow-hidden mb-8 md:mb-16 min-h-[400px] md:min-h-[550px] flex items-center shadow-lg border-y md:border border-slate-100 dark:border-slate-900 transition-colors duration-500">
      <div className="relative z-10 grid lg:grid-cols-2 gap-0 w-full h-full min-h-[400px] md:min-h-[550px]">
        <div className="hidden lg:grid relative h-full grid-cols-3 gap-2 p-2 bg-slate-50 dark:bg-slate-900/40">
          <div className="grid grid-rows-6 gap-2">
            {col0.map((slot, i) => <MosaicCell key={i} slot={slot} />)}
            <div className="row-span-1 rounded-2xl bg-slate-100 dark:bg-slate-800 opacity-30" />
          </div>

          <div className="grid grid-rows-6 gap-2">
            {col1.map((slot, i) => <MosaicCell key={i} slot={slot} />)}
          </div>

          <div className="grid grid-rows-6 gap-2">
            {col2.map((slot, i) => <MosaicCell key={i} slot={slot} sliver />)}
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center p-6 py-10 md:py-14 lg:p-16 bg-white dark:bg-slate-950 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center max-w-2xl w-full space-y-8 md:space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">PlanWAB Presents</span>
            </div>

            <h1 className="text-4xl sm:text-[44px] md:text-6xl xl:text-[84px] font-black leading-[0.95] tracking-tighter uppercase text-slate-900 dark:text-white">
              <span className="italic opacity-90">The Best</span> <br />
              <span className="italic opacity-90">Vendors</span> <br />
              <span className="text-blue-500 dark:text-blue-400">For You.</span>
            </h1>

            <div className="space-y-8 w-full flex flex-col items-center">
              <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed font-semibold max-w-md mx-auto">
                Discover 10,000+ top-rated wedding curators, photographers, and venues across India.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <button
                  onClick={() => router.push('/vendors/marketplace')}
                  className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] md:hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
                >
                  Find Your Vendor
                </button>
                <div className="relative w-full sm:w-auto flex justify-center" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] active:bg-slate-50 dark:active:bg-slate-800 transition-all"
                  >
                    <span>Explore Categories</span>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-[100] bottom-[100%] left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-[280px] mb-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
                      >
                        <div className="max-h-[260px] overflow-y-auto w-full flex flex-col no-scrollbar p-2">
                          {CAROUSEL_SECTIONS.map((cat) => {
                            const Icon = cat.icon;
                            return (
                              <button
                                key={cat.key}
                                onClick={() => handleCategorySelect(cat.key)}
                                className="w-full flex items-center gap-3 px-4 py-3 active:bg-slate-50 dark:active:bg-slate-800 rounded-xl transition-colors text-left group/btn"
                              >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform md:group-hover/btn:scale-110" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                                  <Icon size={16} />
                                </div>
                                <div className="truncate">
                                  <span className="block text-[13px] font-bold text-slate-900 dark:text-white truncate">{cat.label}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
});
ProfileMediaHero.displayName = "ProfileMediaHero";

const ProfileCard = memo(({ profile, fallbackIndex, apiCategory }) => {
  const router = useRouter();

  const coverSrc = getProfileImage(profile, fallbackIndex);
  const avatarSrc = getAvatarImage(profile, fallbackIndex);
  const displayName = profile.vendorBusinessName || profile.vendorName || "Vendor";
  const locationText = [profile.location?.city, profile.location?.state].filter(Boolean).join(", ");

  const cat = apiCategory || profile.vendorType || "vendor";
  const vendorIdStr = profile.vendorId || profile.vendor || null;
  const username = profile.username || null;
  const encodedBackTo = typeof window !== 'undefined' ? btoa(window.location.pathname) : "L3ZlbmRvcnMvUHJvZmlsZS9leHBsb3Jl";

  const profilePath = vendorIdStr
    ? `/vendor/${cat}/${vendorIdStr}/profile?backTo=${encodeURIComponent(encodedBackTo)}&tab=posts`
    : username
      ? `/vendor/${cat}/profile/${username}?backTo=${encodeURIComponent(encodedBackTo)}&tab=posts`
      : null;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => profilePath && router.push(profilePath)}
      className={`flex-shrink-0 w-40 sm:w-44 h-[236px] flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm md:hover:shadow-2xl dark:md:hover:shadow-indigo-900/20 transition-all duration-300 group relative snap-start ${profilePath ? 'cursor-pointer' : 'cursor-default'} snap-start`}
    >
      <div className="h-[100px] w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
        <SmartMedia useSkeleton={false} src={coverSrc} className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-105" />
      </div>

      <div className="absolute top-[76px] left-3 p-1 bg-white dark:bg-slate-900 rounded-[14px] shadow-sm z-10 transition-transform duration-500 md:group-hover:scale-105">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
          <SmartMedia useSkeleton={false} src={avatarSrc} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
        {profile.trust > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
            <Star size={8} className="fill-amber-400 text-amber-400" />
            <span className="text-white/90 text-[9px] font-black">{profile.trust}</span>
          </div>
        )}
        {profile.likesCount > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
            <Heart size={8} className="fill-rose-400 text-rose-400" />
            <span className="text-white/90 text-[9px] font-black">{profile.likesCount}</span>
          </div>
        )}
      </div>

      <div className="px-3 pt-[44px] pb-3 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight leading-tight truncate transition-colors md:group-hover:text-indigo-600 dark:md:group-hover:text-indigo-400">
          {displayName}
        </h3>

        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-medium mt-0.5 truncate capitalize">
          {cat} <span className="text-slate-300 dark:text-slate-600 font-bold mx-1 inline-block">•</span> {locationText || "India"}
        </p>

        <div className="flex-1 min-h-[8px]"></div>

        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-auto justify-between">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 md:group-hover:text-indigo-500 transition-colors">
            <ImageIcon size={14} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs font-bold">{profile.postsCount || 0}</span>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:inline">Posts</span>
            </div>
          </div>

          <div className="w-px h-4 bg-slate-100 dark:bg-slate-800 shrink-0"></div>

          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 md:group-hover:text-rose-500 transition-colors">
            <Video size={14} className="text-rose-500 dark:text-rose-400 shrink-0" />
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs font-bold">{profile.reelsCount || 0}</span>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:inline">Reels</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
ProfileCard.displayName = "ProfileCard";

const ProfileCarousel = memo(({ id, label, subtitle, icon: Icon, color, profiles, isLoading, apiCategory }) => {
  const router = useRouter();

  return (
    <section id={`carousel-${id}`} className="py-4 relative group/section">
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
            <Icon size={20} style={{ color }} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">{label}</h2>
            <p className="text-slate-400 dark:text-slate-500 font-medium text-[10px] uppercase mt-1 line-clamp-1">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/vendors/marketplace?categories=${apiCategory}&sortBy=rating`)}
          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 active:bg-indigo-50 dark:active:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0"
        >
          View All
        </button>
      </div>

      <div className="relative">
        <ScrollCarousel>
          {isLoading
            ? [...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[160px] sm:w-[176px] h-[236px] rounded-2xl bg-white border border-slate-100 dark:border-slate-800 dark:bg-slate-800 snap-start overflow-hidden shadow-sm">
                <div className="h-[100px] bg-slate-100 dark:bg-slate-700 animate-pulse" />
                <div className="relative pt-[44px] px-3 pb-3 space-y-2">
                  <div className="absolute top-[-24px] left-3 w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-xl animate-pulse" />
                  <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-700 animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-700 animate-pulse rounded" />
                </div>
              </div>
            ))
            : profiles.length > 0
              ? (
                <>
                  {profiles.map((p, i) => (
                    <ProfileCard key={p._id || p.id || i} profile={p} fallbackIndex={i} apiCategory={apiCategory} />
                  ))}
                  <div
                    onClick={() => router.push(`/vendors/marketplace?categories=${apiCategory}&sortBy=rating`)}
                    className="flex-shrink-0 w-[160px] sm:w-[176px] h-[236px] rounded-2xl border-[3px] border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center p-4 group cursor-pointer active:bg-slate-50 dark:active:bg-slate-800/30 transition-all snap-start"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 text-slate-400 dark:text-slate-500 shadow-sm">
                      <ArrowRight size={20} />
                    </div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">View All</p>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">100+ More</p>
                  </div>
                </>
              )
              : (
                <>
                 <div className="flex-shrink-0 w-[280px] h-[340px] rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center p-8 snap-start">
  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5 text-slate-400 dark:text-slate-500">
    <Icon size={32} strokeWidth={1.5} />
  </div>
  <p className="font-black text-slate-800 dark:text-white text-base mb-2">Coming Soon</p>
  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
    We are currently onboarding top-tier {label.toLowerCase()} in your area.
  </p>
</div>
                </>
              )
          }
        </ScrollCarousel>
      </div>
    </section>
  );
});
ProfileCarousel.displayName = "ProfileCarousel";

const TrustStrip = memo(() => (
  <div className="py-2 px-4 mb-4">
    <div className="bg-gradient-to-r from-indigo-50 dark:from-indigo-900/40 to-purple-50 dark:to-purple-900/40 border border-indigo-200 dark:border-indigo-800/50 rounded-3xl p-5 flex flex-col gap-5 shadow-sm">
      {[
        { icon: Check, label: "100% Verified", desc: "Every vendor is manually verified" },
        { icon: Star, label: "Top Rated", desc: "Only the best in the industry" },
        { icon: Heart, label: "Loved by Couples", desc: "10,000+ happy weddings planned" },
      ].map((item, i) => (
        <React.Fragment key={item.label}>
          {i > 0 && <div className="h-px w-full bg-indigo-200/50 dark:bg-indigo-800/30" />}
          <div className="flex items-center gap-4 text-left group cursor-default">
            <div className="w-12 h-12 shrink-0 rounded-full bg-white dark:bg-indigo-950/50 shadow-sm flex items-center justify-center">
              <item.icon className="text-indigo-500 dark:text-indigo-400" size={20} strokeWidth={3} />
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-black text-sm tracking-widest uppercase mb-0.5">{item.label}</h4>
              <p className="text-slate-500 dark:text-indigo-200/70 text-xs font-semibold">{item.desc}</p>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
));
TrustStrip.displayName = "TrustStrip";

const UploadStrip = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => { setIsOpen(false); setIsSubmitted(false); }, 3000);
  };

  return (
    <div className="py-2 px-4 mb-4 relative">
      <div className="bg-gradient-to-r from-violet-50 dark:from-violet-900/30 to-pink-50 dark:to-pink-900/30 border border-violet-200 dark:border-violet-800/50 rounded-3xl p-5 flex flex-col items-center gap-5 shadow-sm text-center">
        <div className="w-14 h-14 shrink-0 rounded-full bg-white dark:bg-violet-950/50 shadow-sm flex items-center justify-center -rotate-12">
          <Camera className="text-violet-500 dark:text-violet-400" size={24} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-lg tracking-tight mb-1">Share Your Story</h4>
          <p className="text-slate-500 dark:text-violet-200/70 text-xs font-semibold">Upload your photos to be featured.</p>
        </div>
        <button onClick={() => setIsOpen(true)} className="w-full bg-gradient-to-r from-violet-600 to-pink-600 active:from-violet-500 active:to-pink-500 text-white px-6 py-4 rounded-2xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-md">
          UPLOAD MEDIA
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative border border-slate-100 dark:border-slate-800 max-h-[90dvh] overflow-y-auto no-scrollbar"
            >
              <button
                onClick={() => { setIsOpen(false); setIsSubmitted(false); }}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 transition"
              >
                <X size={18} className="text-slate-500" />
              </button>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-6 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Check className="text-green-600 dark:text-green-400" size={28} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Media Uploaded!</h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Thank you for sharing your story.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white pr-8">Upload Media</h3>
                    <p className="text-xs border-b pb-3 mb-1 font-semibold text-slate-500 dark:text-slate-400">Share your best moments.</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800/50 active:border-violet-500 transition-colors">
                      <Camera className="text-slate-400" size={28} />
                      <p className="text-[11px] font-bold text-slate-500 text-center">Tap to browse files</p>
                    </div>
                    <input type="text" placeholder="Caption or Link" className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-semibold border-none outline-none focus:ring-2 focus:ring-violet-500 transition" required />
                  </div>

                  <button type="submit" className="w-full bg-violet-600 active:bg-violet-500 text-white rounded-xl py-4 font-black text-xs tracking-widest mt-1 active:scale-95 transition-all shadow-md">
                    SUBMIT
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});
UploadStrip.displayName = "UploadStrip";

const PromoStrip = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => { setIsOpen(false); setIsSubmitted(false); }, 3000);
  };

  return (
    <div className="py-2 px-4 mb-4 relative">
      <div className="bg-gradient-to-r from-amber-50 dark:from-amber-900/30 to-orange-50 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800/50 rounded-3xl p-5 flex flex-col items-center gap-5 shadow-sm text-center">
        <div className="w-14 h-14 shrink-0 rounded-full bg-white dark:bg-amber-950/50 shadow-sm flex items-center justify-center -rotate-12">
          <Trophy className="text-amber-500 dark:text-amber-400" size={24} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-lg tracking-tight mb-1 flex flex-col items-center gap-1.5">
            Vendor Award
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] uppercase tracking-widest">Monthly</span>
          </h4>
          <p className="text-slate-500 dark:text-amber-200/70 text-xs font-semibold mt-1">Vote for the top-rated vendor.</p>
        </div>
        <div className="flex flex-col w-full gap-2 mt-1">
          <button onClick={() => setIsOpen(true)} className="w-full bg-amber-500 active:bg-amber-400 text-white py-4 rounded-2xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-md">
            NOMINATE NOW
          </button>
          <span className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">Vote closes Apr 30th</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative border border-slate-100 dark:border-slate-800 max-h-[90dvh] overflow-y-auto no-scrollbar"
            >
              <button
                onClick={() => { setIsOpen(false); setIsSubmitted(false); }}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 transition"
              >
                <X size={18} className="text-slate-500" />
              </button>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-6 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Trophy className="text-amber-600 dark:text-amber-400" size={28} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Nomination Sent!</h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Thanks for recognizing an amazing vendor!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white pr-8">Nominate Vendor</h3>
                    <p className="text-xs border-b pb-3 mb-1 font-semibold text-slate-500 dark:text-slate-400">Cast your vote for this month.</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <input type="text" placeholder="Vendor Business Name" className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-semibold border-none outline-none focus:ring-2 focus:ring-amber-500 transition" required />
                    <textarea placeholder="Why do they deserve this award?" rows={3} className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-semibold border-none outline-none focus:ring-2 focus:ring-amber-500 transition resize-none" required />
                  </div>

                  <button type="submit" className="w-full bg-amber-500 active:bg-amber-400 text-white rounded-xl py-4 font-black text-xs tracking-widest mt-1 active:scale-95 transition-all shadow-md">
                    SUBMIT
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});
PromoStrip.displayName = "PromoStrip";

const DealsStrip = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const COUPONS = [
    {
      code: "PLANWAB20",
      title: "20% Off Photos",
      desc: "Valid on premium photographers",
      bg: "bg-emerald-50 dark:bg-emerald-900/10",
      border: "border-emerald-200 dark:border-emerald-800/50",
      titleColor: "text-emerald-700 dark:text-emerald-400",
      btnBorder: "border-emerald-200 dark:border-emerald-700"
    },
    {
      code: "VENUE50K",
      title: "Flat ₹50K Off",
      desc: "For bookings above ₹5 Lakhs",
      bg: "bg-blue-50 dark:bg-blue-900/10",
      border: "border-blue-200 dark:border-blue-800/50",
      titleColor: "text-blue-700 dark:text-blue-400",
      btnBorder: "border-blue-200 dark:border-blue-700"
    },
    {
      code: "BEAUTY10",
      title: "10% Off Makeup",
      desc: "Exclusive bridal makeup discount",
      bg: "bg-rose-50 dark:bg-rose-900/10",
      border: "border-rose-200 dark:border-rose-800/50",
      titleColor: "text-rose-700 dark:text-rose-400",
      btnBorder: "border-rose-200 dark:border-rose-700"
    }
  ];

  return (
    <div className="py-2 px-4 mb-4 relative">
      <div className="bg-gradient-to-r from-emerald-50 dark:from-emerald-900/30 to-teal-50 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-800/50 rounded-3xl p-5 flex flex-col items-center gap-5 shadow-sm text-center">
        <div className="w-14 h-14 shrink-0 rounded-full bg-white dark:bg-emerald-950/50 shadow-sm flex items-center justify-center -rotate-12">
          <Zap className="text-emerald-500 dark:text-emerald-400" size={24} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-lg tracking-tight mb-1 flex flex-col items-center gap-1.5">
            Vendor Deals
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] uppercase tracking-widest font-black animate-pulse">Live</span>
          </h4>
          <p className="text-slate-500 dark:text-emerald-200/70 text-xs font-semibold mt-1">Save up to 30% for a limited time.</p>
        </div>
        <div className="flex flex-col w-full gap-2 mt-1">
          <button onClick={() => setIsOpen(true)} className="w-full bg-emerald-500 active:bg-emerald-400 text-white py-4 rounded-2xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-md">
            VIEW OFFERS
          </button>
          <span className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">150+ active offers</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative border border-slate-100 dark:border-slate-800 max-h-[90dvh] overflow-y-auto no-scrollbar"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 transition"
              >
                <X size={18} className="text-slate-500" />
              </button>

              <div className="flex flex-col items-center mb-6 pt-2 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                  <Zap className="text-emerald-500 dark:text-emerald-400" size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Active Offers</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Tap a code to copy it.</p>
              </div>

              <div className="space-y-3">
                {COUPONS.map((coupon, i) => (
                  <div key={i} className={`border ${coupon.border} ${coupon.bg} rounded-2xl p-4 flex flex-col gap-3 transition-all`}>
                    <div>
                      <h4 className={`text-sm font-bold ${coupon.titleColor} mb-0.5`}>{coupon.title}</h4>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{coupon.desc}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black tracking-wider transition-all ${copiedCode === coupon.code
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : `bg-white dark:bg-slate-800 text-slate-900 dark:text-white border ${coupon.btnBorder} shadow-sm active:scale-95`
                        }`}
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <Check size={14} /> COPIED!
                        </>
                      ) : (
                        coupon.code
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});
DealsStrip.displayName = "DealsStrip";

const CommunityStrip = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => { setIsOpen(false); setIsSubmitted(false); }, 4000);
  };

  return (
    <div className="py-2 px-4 mb-4 relative">
      <div className="bg-gradient-to-r from-rose-50 dark:from-rose-900/30 to-pink-50 dark:to-pink-900/30 border border-rose-200 dark:border-rose-800/50 rounded-3xl p-5 flex flex-col items-center gap-5 shadow-sm text-center">
        <div className="w-14 h-14 shrink-0 rounded-full bg-white dark:bg-rose-950/50 shadow-sm flex items-center justify-center -rotate-12">
          <Users className="text-rose-500 dark:text-rose-400" size={24} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-lg tracking-tight mb-1">
            Join the Community
          </h4>
          <p className="text-slate-500 dark:text-rose-200/70 text-xs font-semibold">Connect, share, and get expert tips.</p>
        </div>
        <div className="flex flex-col w-full gap-2 mt-1">
          <button onClick={() => setIsOpen(true)} className="w-full bg-gradient-to-r from-rose-500 to-pink-500 active:from-rose-400 active:to-pink-400 text-white py-4 rounded-2xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-md">
            JOIN FORUM
          </button>
          <span className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">10k+ Couples Online</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative border border-slate-100 dark:border-slate-800 max-h-[90dvh] overflow-y-auto no-scrollbar"
            >
              <button
                onClick={() => { setIsOpen(false); setIsSubmitted(false); }}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 transition"
              >
                <X size={18} className="text-slate-500" />
              </button>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center animate-bounce">
                    <Users className="text-rose-600 dark:text-rose-400" size={32} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Request Sent!</h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Our admin will add you shortly!
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white pr-8">Forum Access</h3>
                    <p className="text-xs border-b pb-3 mb-1 font-semibold text-slate-500 dark:text-slate-400">Request entry to the community.</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <input type="text" placeholder="Your Full Name" className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3.5 text-sm font-semibold border-none outline-none focus:ring-2 focus:ring-rose-500 transition" required />
                    <input type="email" placeholder="Email Address" className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3.5 text-sm font-semibold border-none outline-none focus:ring-2 focus:ring-rose-500 transition" required />
                    <input type="text" placeholder="Wedding Date (Optional)" className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3.5 text-sm font-semibold border-none outline-none focus:ring-2 focus:ring-rose-500 transition" />
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-r from-rose-600 to-pink-600 active:from-rose-500 active:to-pink-500 text-white rounded-2xl py-4 font-black text-xs tracking-[0.2em] mt-1 active:scale-95 transition-all shadow-md">
                    REQUEST ACCESS
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});
CommunityStrip.displayName = "CommunityStrip";

const MagazineStrip = memo(() => {
  const [downloadState, setDownloadState] = useState("idle");

  const handleDownload = () => {
    setDownloadState("downloading");
    setTimeout(() => {
      setDownloadState("completed");
      setTimeout(() => setDownloadState("idle"), 4000);
    }, 1500);
  };

  return (
    <div className="py-2 px-4 mb-4 relative">
      <div className="bg-gradient-to-r from-cyan-50 dark:from-cyan-900/30 to-blue-50 dark:to-blue-900/30 border border-cyan-200 dark:border-cyan-800/50 rounded-3xl p-5 flex flex-col items-center gap-5 shadow-sm text-center">
        <div className="w-14 h-14 shrink-0 rounded-full bg-white dark:bg-cyan-950/50 shadow-sm flex items-center justify-center -rotate-12">
          <LayoutGrid className="text-cyan-500 dark:text-cyan-400" size={24} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-lg tracking-tight mb-1">
            {downloadState === "completed" ? "Downloaded!" : "Digital Magazine"}
          </h4>
          <p className="text-slate-500 dark:text-cyan-200/70 text-xs font-semibold px-2">
            {downloadState === "completed"
              ? "The edition has been saved to your device."
              : "Discover the latest wedding trends and stories."}
          </p>
        </div>
        <div className="flex flex-col w-full gap-2 mt-1">
          <button
            onClick={handleDownload}
            disabled={downloadState !== "idle"}
            className={`w-full py-4 rounded-2xl font-black text-[11px] tracking-widest transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 ${downloadState === "completed"
                ? "bg-green-500 text-white"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
              }`}
          >
            {downloadState === "idle" && "DOWNLOAD NOW"}
            {downloadState === "downloading" && (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                DOWNLOADING...
              </>
            )}
            {downloadState === "completed" && (
              <>
                <Check size={14} strokeWidth={3} />
                COMPLETED
              </>
            )}
          </button>
          <span className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">Weekly · 12MB</span>
        </div>
      </div>
    </div>
  );
});
MagazineStrip.displayName = "MagazineStrip";

const VendorStorefrontStrip = memo(() => {
  const router = useRouter();

  return (
    <div className="py-2 px-4 mb-4 relative">
      <div className="bg-white dark:bg-slate-900 border-[1.5px] border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-3xl p-1 shadow-sm">
        <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-[26px] p-5 py-8 flex flex-col items-center gap-5 relative overflow-hidden text-center">
          <div className="absolute right-[-20%] top-[-10%] opacity-[0.03] dark:opacity-5 pointer-events-none">
            <Building2 size={180} className="text-indigo-600" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[9px] font-black uppercase tracking-widest mb-3">
              <Building2 size={10} />
              For Professionals
            </div>
            <h4 className="text-slate-900 dark:text-white font-black text-xl tracking-tight mb-2">
              Are you a Vendor?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-xs font-medium px-2">
              Grow your business and connect with premium clients planning their big day.
            </p>
          </div>

          <button onClick={() => router.push('/vendor/register')} className="relative z-10 w-full bg-indigo-600 active:bg-indigo-500 text-white py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-md active:scale-95 mt-1">
            Claim Profile
          </button>
        </div>
      </div>
    </div>
  );
});
VendorStorefrontStrip.displayName = "VendorStorefrontStrip";

const ConciergeSmallStrip = memo(() => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRequest = () => {
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="py-2 px-4 pb-8">
      <div className="bg-indigo-50/60 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-3xl p-5 flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white dark:bg-indigo-900/30 flex items-center justify-center shadow-sm shrink-0">
            {isSubmitted ? (
              <Check className="text-green-600 dark:text-green-400" size={20} strokeWidth={3} />
            ) : (
              <Sparkles className="text-indigo-600 dark:text-indigo-400" size={20} />
            )}
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-black text-base tracking-tight mb-1">
              {isSubmitted ? "Received!" : "Overwhelmed?"}
            </h4>
            <p className="text-slate-500 dark:text-indigo-200/70 text-[11px] font-semibold">
              {isSubmitted
                ? "Our team will contact you shortly."
                : "Our concierge is available to help."}
            </p>
          </div>
        </div>
        <button
          onClick={handleRequest}
          disabled={isSubmitted}
          className={`w-full py-3.5 rounded-2xl font-black text-[10px] tracking-widest transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 ${isSubmitted
              ? "bg-green-500 text-white shadow-none"
              : "bg-indigo-600 active:bg-indigo-500 text-white"
            }`}
        >
          {isSubmitted ? (
            <>
              <Check size={14} strokeWidth={3} />
              REQUESTED
            </>
          ) : (
            "GET FREE HELP"
          )}
        </button>
      </div>
    </div>
  );
});
ConciergeSmallStrip.displayName = "ConciergeSmallStrip";

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50 };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

const HeroCarousel = memo(({ featuredProfiles = {}, sections = {} }) => {
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
    const element = document.getElementById(`carousel-${item.key}`);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      router.push(`/vendors/marketplace?categories=${item.key}`);
    }
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
    scrollRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  return (
    <div className="mb-4 py-3">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white px-4 mb-3">Categories</h2>
      <motion.div
        ref={scrollRef}
        className="grid grid-rows-2 grid-flow-col gap-3 gap-x-5 overflow-x-auto px-4 pb-2 no-scrollbar snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        onMouseDown={() => setIsDragging(false)}
        onMouseMove={(e) => { if (e.buttons === 1) setIsDragging(true); }}
        onMouseUp={() => setTimeout(() => setIsDragging(false), 100)}
        onTouchStart={() => setIsDragging(false)}
        onTouchMove={() => setIsDragging(true)}
        onTouchEnd={() => setTimeout(() => setIsDragging(false), 100)}
      >
        {HERO_CATEGORIES.map((item, index) => {
          let displayImage = item.image;
          const dynamicCount = sections[item.key]?.total || item.count;

          return (
            <motion.div
              key={item.id}
              onClick={() => handleCategoryClick(item)}
              className="flex flex-col cursor-pointer group snap-start"
              style={{ width: "100px" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03, duration: 0.3, ease: "easeOut" }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-full h-28 rounded-xl overflow-hidden bg-transparent mb-1.5 shadow-sm transition-all duration-300">
                <SmartMedia
                  src={displayImage}
                  type="image"
                  className="w-full h-full object-cover grayscale-[0.2] transition-all duration-700 active:grayscale-0 active:scale-110"
                  prioirity={true}
                />
                <div className="absolute inset-0 bg-black/30 opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="text-white font-black text-[11px] tracking-wider text-center px-1 drop-shadow-md">{item.name}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <h3 className="text-[11px] font-semibold text-gray-900 dark:text-gray-100 leading-tight truncate">{item.name}</h3>
                <div className="flex items-center gap-0.5">
                  <span className="text-[9px] text-rose-500 font-bold">{dynamicCount}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
        <div className="w-1 flex-shrink-0" />
      </motion.div>
      <div className="flex justify-center gap-1.5 mt-3">
        {Array.from({ length: totalPages }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => scrollToPage(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${currentPage === index ? "bg-gray-400 dark:bg-gray-500" : "bg-gray-200 dark:bg-gray-800"}`}
            animate={{ width: currentPage === index ? 20 : 6 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
});
HeroCarousel.displayName = "HeroCarousel";

export default function VendorProfilesExploreWrapper() {
  const haptic = useHapticFeedback();
  const router = useRouter();

  const [sections, setSections] = useState(() =>
    Object.fromEntries(CAROUSEL_SECTIONS.map((s) => [s.key, { data: [], loading: true }]))
  );

  const fetchSection = useCallback(async (key, apiCategory) => {
    try {
      const res = await fetch(
        `/api/vendor/profile/lists?categories=${apiCategory}&sortBy=trust&sortOrder=desc&page=1&limit=20`
      );
      const json = await res.json();
      setSections((prev) => ({
        ...prev,
        [key]: { 
        data: Array.isArray(json.data) ? json.data : [], 
        loading: false,
        total: json.pagination?.total || json.total || 0 // Capture the dynamic count
      },
      }));
    } catch {
      setSections((prev) => ({ ...prev, [key]: { data: [], loading: false } }));
    }
  }, []);

  useEffect(() => {
    CAROUSEL_SECTIONS.forEach(({ key, apiCategory }) => fetchSection(key, apiCategory));
  }, [fetchSection]);

  const featuredProfiles = useMemo(() => {
    const map = {};
    CAROUSEL_SECTIONS.forEach(({ key }) => {
      if (sections[key]?.data?.length > 0) {
        map[key] = sections[key].data[0];
      }
    });
    return map;
  }, [sections]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] transition-colors duration-500 w-full overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between px-3 h-14">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                haptic("light");
                router.back();
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-gray-100 dark:active:bg-slate-800 active:scale-95 transition-all text-gray-700 dark:text-gray-200"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-base font-bold text-gray-900 dark:text-white">Vendors Profiles</h1>
          </div>
          <button
            onClick={() => {
              haptic("light");
              router.push('/vendors/marketplace');
            }}
            className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-gray-100 dark:active:bg-slate-800 active:scale-95 transition-all text-gray-700 dark:text-gray-200"
          >
            <ShoppingBag size={20} />
          </button>
        </div>
      </header>

      <div className="h-14" />

      <main className="w-full mx-auto pt-2 pb-16">
        <HeroCarousel featuredProfiles={featuredProfiles} sections={sections} />

        <div className="space-y-1 px-0">
          {CAROUSEL_SECTIONS.map((section, index) => {
            const { key, ...props } = section;
            return (
              <React.Fragment key={key}>
                <ProfileCarousel
                  id={key}
                  {...props}
                  profiles={sections[key].data}
                  isLoading={sections[key].loading}
                />
                {index === 1 && <TrustStrip />}
                {index === 3 && <UploadStrip />}
                {index === 5 && <PromoStrip />}
                {index === 7 && <DealsStrip />}
                {index === 9 && <CommunityStrip />}
                {index === 11 && <MagazineStrip />}
                {index === 13 && <VendorStorefrontStrip />}
                {index === 15 && <ConciergeSmallStrip />}
              </React.Fragment>
            );
          })}
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; width: 100%; position: relative; }
      `}</style>
    </div>
  );
}