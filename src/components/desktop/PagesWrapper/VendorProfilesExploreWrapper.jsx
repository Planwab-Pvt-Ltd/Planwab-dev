"use client";

import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
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
} from "lucide-react";
import SmartMedia from "../SmartMediaLoader";
import { ScrollCarousel } from "./IdeasPageWrapper";

const CAROUSEL_SECTIONS = [
  { key: "venues", label: "Premium Venues", subtitle: "Grand stages for your event", icon: Building2, color: "#0ea5e9", apiCategory: "venues" },
  { key: "hairstyling", label: "Hairstylists", subtitle: "Flawless hair transformations", icon: Scissors, color: "#db2777", apiCategory: "hairstyling" },
  { key: "invitations", label: "Invitations", subtitle: "Beautiful wedding cards", icon: Mail, color: "#64748b", apiCategory: "invitations" },
  { key: "sarees", label: "Bridal Sarees", subtitle: "Elegant traditional wear", icon: Shirt, color: "#f43f5e", apiCategory: "sarees" },
  { key: "fireworks", label: "Fireworks", subtitle: "Spectacular pyro displays", icon: FlameKindling, color: "#ef4444", apiCategory: "fireworks" },
  { key: "decor", label: "Decorators", subtitle: "Transform every space", icon: Lamp, color: "#d946ef", apiCategory: "decor" },
  { key: "dhol", label: "Dhol Players", subtitle: "Traditional beats and rhythm", icon: Drum, color: "#fb923c", apiCategory: "dhol" },
  { key: "cakes", label: "Celebration Cakes", subtitle: "Sweet masterpieces", icon: CakeSlice, color: "#84cc16", apiCategory: "cakes" },
  { key: "anchor", label: "Anchors & Hosts", subtitle: "Engage your audience", icon: MicVocal, color: "#22c55e", apiCategory: "anchor" },
  { key: "planners", label: "Wedding Planners", subtitle: "Expertly managed celebrations", icon: UserCheck, color: "#8b5cf6", apiCategory: "planners" },
  { key: "photographers", label: "Photographers", subtitle: "Freeze your best memories", icon: Camera, color: "#3b82f6", apiCategory: "photographers" },
  { key: "mehendi", label: "Mehendi Artists", subtitle: "Exquisite henna designs", icon: Hand, color: "#d946ef", apiCategory: "mehendi" },
  { key: "makeup", label: "Makeup Artists", subtitle: "Bridal glow experts", icon: Paintbrush2, color: "#ec4899", apiCategory: "makeup" },
  { key: "djs", label: "DJ & Music", subtitle: "Set the perfect wedding mood", icon: Music, color: "#6366f1", apiCategory: "djs" },
  { key: "catering", label: "Catering", subtitle: "Delicious food for your guests", icon: UtensilsCrossed, color: "#14b8a6", apiCategory: "catering" },
];

const FALLBACK_IMAGES = [
  "https://res.cloudinary.com/dhkkvo36x/image/upload/HaroCategories/mobile/MakeupCat_lcp68d.png",
  "https://res.cloudinary.com/dhkkvo36x/image/upload/HaroCategories/mobile/PhotographerCat_ymq0vh.png",
  "https://res.cloudinary.com/dhkkvo36x/image/upload/HaroCategories/mobile/PlannerCat_p16v2m.png",
  "https://res.cloudinary.com/dhkkvo36x/image/upload/HaroCategories/mobile/MehndiCat_hdsxxo.png",
  "https://res.cloudinary.com/dhkkvo36x/image/upload/HaroCategories/mobile/VenuesCat_hgjb10.png",
];

const HERO_MOSAIC = [
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428617/MakeUpCat_lcp68d.png", label: "MUA", span: "row-span-2", pos: "0", delay: 0.1, catKey: "makeup" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428623/PhotographerCat_ymq0vh.png", label: "PHOTO", span: "row-span-3", pos: "1", delay: 0.3, catKey: "photographers" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428615/DJCat_hay9fu.png", label: "MUSIC", span: "row-span-1", pos: "2", delay: 0.5, catKey: "djs" },
  { src: "hhttps://res.cloudinary.com/dhkkvo36x/image/upload/v1771428626/PlannerCat_p16v2m.png", label: "PLAN", span: "row-span-4", pos: "3", delay: 0.2, catKey: "planners" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428620/MehndiCat_hdsxxo.png", label: "ART", span: "row-span-2", pos: "4", delay: 0.4, catKey: "mehendi" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567028/VenuesCat_hgj3l0.png", label: "VENUE", span: "row-span-3", pos: "5", delay: 0.6, catKey: "venues" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428610/CaterorsCat_pch4d5.png", label: "CATERER", span: "row-span-3", pos: "6", delay: 0.7, catKey: "catering" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/HaroCategories/mobile/DecoratorsCat_hvpgaf.png", label: "DECOR", span: "row-span-2", pos: "7", delay: 0.8, catKey: "decor" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/HaroCategories/mobile/SareesCat_cyugf6.png", label: "SAREES", span: "row-span-3", pos: "8", delay: 0.9, catKey: "sarees" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567022/AnchorsCat_kdv6am.png", label: "ANCHOR", span: "row-span-3", pos: "9", delay: 1.0, catKey: "anchor" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567026/InvitationsCat_twzcbc.png", label: "INVITATIONS", span: "row-span-3", pos: "10", delay: 1.1, catKey: "invitations" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567023/FireworksCat_pngfbi.png", label: "FIREWORKS", span: "row-span-3", pos: "11", delay: 1.2, catKey: "fireworks" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567022/CakesCat_hlpwqv.png", label: "CAKES", span: "row-span-2", pos: "12", delay: 1.3, catKey: "cakes" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567027/HairstylersCat_ggriqx.png", label: "HAIR", span: "row-span-3", pos: "13", delay: 1.4, catKey: "hairstyling" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428613/DholCat_swqr0p.png", label: "DHOL", span: "row-span-3", pos: "14", delay: 1.5, catKey: "dhol" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428615/DJCat_hay9fu.png", label: "MUSIC", span: "row-span-2", pos: "15", delay: 1.6, catKey: "djs" },
  { src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567023/BaraatCat_dyuqi9.png", label: "Baraat", span: "row-span-4", pos: "16", delay: 1.7, catKey: "planners" },
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
  if (isValidImageUrl(profile.vendorCoverImage)) return profile.vendorCoverImage;
  if (isValidImageUrl(profile.vendorAvatar)) return profile.vendorAvatar;
  if (isValidImageUrl(profile.highlights?.[0]?.coverImage)) return profile.highlights[0].coverImage;
  if (isValidImageUrl(profile.posts?.[0]?.mediaUrl)) return profile.posts[0].mediaUrl;
  if (isValidImageUrl(profile.reels?.[0]?.thumbnail)) return profile.reels[0].thumbnail;
  return FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
};

const getAvatarImage = (profile, fallbackIndex = 0) => {
  if (isValidImageUrl(profile.vendorAvatar)) return profile.vendorAvatar;
  return getProfileImage(profile, fallbackIndex);
};

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
      window.scrollTo({top: y, behavior: 'smooth'});
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
      className={`${slot.span} group relative overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 ${slot.isLive && !isLoading ? "cursor-pointer" : "cursor-default"}`}
    >
      {isLoading ? (
        <div className="w-full h-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
        </div>
      ) : (
        <>
          <div className="w-full h-full">
            <SmartMedia useSkeleton={false} src={slot.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          {!sliver && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          )}
          {slot.isLive && !sliver && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-1.5">
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
    <div className="relative w-full bg-[#fcfcfc] dark:bg-slate-950 rounded-[48px] overflow-hidden mb-16 min-h-[550px] flex items-center shadow-lg border border-slate-100 dark:border-slate-900 transition-colors duration-500">


      <div className="relative z-10 grid lg:grid-cols-2 gap-0 w-full h-full min-h-[550px]">

        <div className="relative h-full grid grid-cols-3 gap-2 p-2 bg-slate-50 dark:bg-slate-900/40">
          <div className="grid grid-rows-6 gap-2">
            {col0.map((slot, i) => <MosaicCell key={i} slot={slot} />)}
            <div className="row-span-1 rounded-2xl bg-slate-100 dark:bg-slate-800 opacity-30" />
          </div>

          <div className="grid grid-rows-6 gap-2">
            {col1.map((slot, i) => <MosaicCell key={i} slot={slot} />)}
          </div>

          <div className="grid grid-rows-6 gap-2">
            {col2.map((slot, i) => <MosaicCell key={i} slot={slot} sliver />) }
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center p-12 lg:p-16 bg-white dark:bg-slate-950 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="flex flex-col items-center max-w-2xl w-full space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">PlanWAB Presents</span>
            </div>

            <h1 className="text-6xl xl:text-[84px] font-black leading-[0.95] tracking-tighter uppercase text-slate-900 dark:text-white">
              <span className="italic opacity-90">The Best</span> <br />
              <span className="italic opacity-90">Vendors</span> <br />
              <span className="text-blue-500 dark:text-blue-400">For You.</span>
            </h1>

            <div className="space-y-10 w-full flex flex-col items-center">
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-semibold max-w-md mx-auto">
                Discover 10,000+ top-rated wedding curators, photographers, and venues across India.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <button 
                  onClick={() => router.push('/vendors/marketplace')}
                  className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
                >
                  Find Your Vendor
                </button>
                <div className="relative w-full sm:w-auto flex justify-center" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
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
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left group/btn"
                              >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover/btn:scale-110" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
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

const ProfileCardSkeleton = memo(() => (
  <div className="flex-shrink-0 w-[280px] h-[340px] flex flex-col bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm snap-start relative">
    <div className="h-[140px] w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
       <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
    </div>
    <div className="absolute top-[108px] left-6 p-1.5 bg-white dark:bg-slate-900 rounded-[22px] z-10">
      <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
         <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
      </div>
    </div>
    <div className="px-6 pt-[52px] pb-6 flex flex-col flex-grow">
      <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md mb-2 relative overflow-hidden">
         <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
      </div>
      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md relative overflow-hidden">
         <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center gap-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
         <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-md relative overflow-hidden">
           <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
         </div>
         <div className="w-px h-6 bg-slate-100 dark:bg-slate-800"></div>
         <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-md relative overflow-hidden">
           <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
         </div>
      </div>
    </div>
  </div>
));
ProfileCardSkeleton.displayName = "ProfileCardSkeleton";

const ProfileCard = memo(({ profile, fallbackIndex, apiCategory }) => {
  const router = useRouter();

  const coverSrc = profile.vendorCoverImage || getProfileImage(profile, fallbackIndex);
  const avatarSrc = profile.vendorAvatarImage || profile.vendorAvatar || getAvatarImage(profile, fallbackIndex);
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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => profilePath && router.push(profilePath)}
      className={`flex-shrink-0 w-[280px] h-[340px] flex flex-col bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl dark:hover:shadow-indigo-900/20 transition-all duration-500 group relative snap-start ${profilePath ? 'cursor-pointer' : 'cursor-default'} snap-start`}
    >
      <div className="h-[140px] w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
        <SmartMedia src={coverSrc} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>

      <div className="absolute top-[108px] left-6 p-1.5 bg-white dark:bg-slate-900 rounded-[22px] shadow-sm z-10 transition-transform duration-500 group-hover:scale-105">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800">
             <SmartMedia src={avatarSrc} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
        {profile.trust > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-white/90 text-xs font-black">{profile.trust}</span>
          </div>
        )}
        {profile.likesCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
            <Heart size={12} className="fill-rose-400 text-rose-400" />
            <span className="text-white/90 text-xs font-black">{profile.likesCount}</span>
          </div>
        )}
      </div>

      <div className="px-6 pt-[52px] pb-6 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight leading-tight truncate transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
          {displayName}
        </h3>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 truncate capitalize">
          {cat} <span className="text-slate-300 dark:text-slate-600 font-bold mx-2">•</span> {locationText || "India"}
        </p>

        <div className="flex-1 min-h-[16px]"></div>

        <div className="flex items-center gap-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
           <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 group-hover:text-indigo-500 transition-colors">
              <ImageIcon size={18} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
              <div className="flex items-baseline gap-1.5">
                 <span className="text-base font-bold">{profile.postsCount || 0}</span>
                 <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:inline">Posts</span>
              </div>
           </div>
           
           <div className="w-px h-6 bg-slate-100 dark:bg-slate-800 shrink-0"></div>
           
           <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 group-hover:text-rose-500 transition-colors">
              <Video size={18} className="text-rose-500 dark:text-rose-400 shrink-0" />
              <div className="flex items-baseline gap-1.5">
                 <span className="text-base font-bold">{profile.reelsCount || 0}</span>
                 <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:inline">Reels</span>
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
    <section id={`carousel-${id}`} className="py-6 relative group/section">
      <div className="flex items-end justify-between mb-6 px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
            <Icon size={24} style={{ color }} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{label}</h2>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-[11px] uppercase tracking-[0.2em]">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/vendors/marketplace?categories=${apiCategory}&sortBy=rating`)}
          className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-4 py-2 rounded-xl transition-all uppercase tracking-widest"
        >
          View All
        </button>
      </div>

      <div className="relative">
        <ScrollCarousel className="pt-4 pb-5">
          {isLoading
            ? [...Array(5)].map((_, i) => (
              <ProfileCardSkeleton key={i} />
            ))
            : profiles.length > 0
              ? (
                <>
                  {profiles.map((p, i) => <ProfileCard key={p._id || p.id || i} profile={p} fallbackIndex={i} apiCategory={apiCategory} />)}
                  <div
                    onClick={() => router.push(`/vendors/marketplace?categories=${apiCategory}&sortBy=rating`)}
                    className="flex-shrink-0 w-[280px] h-[340px] rounded-[32px] border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center p-8 group cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-colors snap-start"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-300 dark:text-slate-600">
                      <ArrowRight size={32} />
                    </div>
                    <p className="font-black text-slate-800 dark:text-white text-base">View All</p>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-tighter">100+ More {label}</p>
                  </div>
                </>
              )
              : (
                <div className="flex-shrink-0 w-[280px] h-[340px] rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center p-8 snap-start">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5 text-slate-400 dark:text-slate-500">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <p className="font-black text-slate-800 dark:text-white text-base mb-2">Coming Soon</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
                    We are currently onboarding top-tier {label.toLowerCase()} in your area.
                  </p>
                </div>
              )
          }
        </ScrollCarousel>
      </div>
    </section>
  );
});
ProfileCarousel.displayName = "ProfileCarousel";

const TrustStrip = memo(() => (
  <div className="py-4 px-2">
    <div className="bg-gradient-to-r from-indigo-50 dark:from-indigo-900/40 to-purple-50 dark:to-purple-900/40 border border-indigo-200 dark:border-indigo-800/50 rounded-[32px] p-6 lg:py-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] hover:-translate-y-1 transition-all duration-500">
      {[
        { icon: Check, label: "100% Verified", desc: "Every vendor is manually verified" },
        { icon: Star, label: "Top Rated", desc: "Only the best in the industry" },
        { icon: Heart, label: "Loved by Couples", desc: "10,000+ happy weddings planned" },
      ].map((item, i) => (
        <React.Fragment key={item.label}>
          {i > 0 && <div className="hidden md:block w-px h-12 bg-indigo-200 dark:bg-indigo-800/50" />}
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left group cursor-default">
            <div className="w-14 h-14 rounded-full bg-white dark:bg-indigo-950/50 shadow-sm flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
              <item.icon className="text-indigo-500 dark:text-indigo-400" size={24} strokeWidth={3} />
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-black text-sm tracking-widest uppercase mb-1">{item.label}</h4>
              <p className="text-slate-500 dark:text-indigo-200/70 text-xs font-semibold max-w-[170px]">{item.desc}</p>
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
    <div className="py-4 px-2 relative">
      <div className="bg-gradient-to-r from-violet-50 dark:from-violet-900/30 to-pink-50 dark:to-pink-900/30 border border-violet-200 dark:border-violet-800/50 rounded-[32px] p-6 lg:py-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)] hover:-translate-y-1 transition-all duration-500">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 shrink-0 rounded-full bg-white dark:bg-violet-950/50 shadow-sm flex items-center justify-center -rotate-12 hover:rotate-0 transition-transform duration-500">
            <Camera className="text-violet-500 dark:text-violet-400" size={28} />
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-black text-xl tracking-tight mb-1">Share Your Wedding Story</h4>
            <p className="text-slate-500 dark:text-violet-200/70 text-sm font-semibold">Upload your photos and reels to be featured in our premium gallery.</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(true)} className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-md whitespace-nowrap overflow-hidden">
          UPLOAD MEDIA
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] p-8 max-w-md w-full shadow-2xl relative border border-slate-100 dark:border-slate-800"
            >
              <button
                onClick={() => { setIsOpen(false); setIsSubmitted(false); }}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <X size={20} className="text-slate-500" />
              </button>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Check className="text-green-600 dark:text-green-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Media Uploaded!</h3>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Thank you for sharing your story. It is under review.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Upload Media</h3>
                    <p className="text-sm border-b pb-4 mb-2 font-semibold text-slate-500 dark:text-slate-400">Share your best moments with us.</p>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:border-violet-500 transition-colors">
                      <Camera className="text-slate-400" size={32} />
                      <p className="text-xs font-bold text-slate-500">Click to browse or drag & drop files here</p>
                    </div>
                    <input type="text" placeholder="Caption or Link" className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-semibold border-none outline-none focus:ring-2 focus:ring-violet-500 transition" required />
                  </div>

                  <button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-4 font-black text-xs tracking-widest mt-2 active:scale-95 transition-all shadow-md">
                    SUBMIT MEDIA
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
    <div className="py-4 px-2 relative">
      <div className="bg-gradient-to-r from-amber-50 dark:from-amber-900/30 to-orange-50 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800/50 rounded-[32px] p-6 lg:py-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)] hover:-translate-y-1 transition-all duration-500">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 shrink-0 rounded-full bg-white dark:bg-amber-950/50 shadow-sm flex items-center justify-center -rotate-12 hover:rotate-0 transition-transform duration-500">
            <Trophy className="text-amber-500 dark:text-amber-400" size={28} />
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-black text-xl tracking-tight mb-1 flex flex-wrap items-center gap-3">
              Featured Vendor Award
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] uppercase tracking-widest">Monthly</span>
            </h4>
            <p className="text-slate-500 dark:text-amber-200/70 text-sm font-semibold">Top-rated vendor profiles get featured prominently across the platform.</p>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0 gap-2">
          <button onClick={() => setIsOpen(true)} className="bg-amber-500 hover:bg-amber-400 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-md whitespace-nowrap">
            NOMINATE NOW
          </button>
          <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Vote closes Apr 30th</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] p-8 max-w-md w-full shadow-2xl relative border border-slate-100 dark:border-slate-800"
            >
              <button
                onClick={() => { setIsOpen(false); setIsSubmitted(false); }}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <X size={20} className="text-slate-500" />
              </button>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Trophy className="text-amber-600 dark:text-amber-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Nomination Submitted</h3>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Thank you for recognizing an amazing vendor!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Nominate Vendor</h3>
                    <p className="text-sm border-b pb-4 mb-2 font-semibold text-slate-500 dark:text-slate-400">Cast your vote for the Vendor of the Month.</p>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <input type="text" placeholder="Vendor Business Name" className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-semibold border-none outline-none focus:ring-2 focus:ring-amber-500 transition" required />
                    <textarea placeholder="Why do they deserve this award?" rows={3} className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-semibold border-none outline-none focus:ring-2 focus:ring-amber-500 transition resize-none" required />
                  </div>

                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-white rounded-xl py-4 font-black text-xs tracking-widest mt-2 active:scale-95 transition-all shadow-md">
                    SUBMIT NOMINATION
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
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const COUPONS = [
    { 
      code: "PLANWAB20", 
      title: "20% Off Photography", 
      desc: "Valid on all premium photographers", 
      bg: "bg-emerald-50 dark:bg-emerald-900/10",
      border: "border-emerald-200 dark:border-emerald-800/50",
      hoverBg: "hover:bg-emerald-100 dark:hover:bg-emerald-900/20",
      titleColor: "text-emerald-700 dark:text-emerald-400",
      btnBorder: "border-emerald-200 dark:border-emerald-700"
    },
    { 
      code: "VENUE50K", 
      title: "Flat ₹50K Off Venues", 
      desc: "For bookings above ₹5 Lakhs", 
      bg: "bg-blue-50 dark:bg-blue-900/10",
      border: "border-blue-200 dark:border-blue-800/50",
      hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-900/20",
      titleColor: "text-blue-700 dark:text-blue-400",
      btnBorder: "border-blue-200 dark:border-blue-700"
    },
    { 
      code: "BEAUTY10", 
      title: "10% Off Makeup", 
      desc: "Exclusive bridal makeup discount", 
      bg: "bg-rose-50 dark:bg-rose-900/10",
      border: "border-rose-200 dark:border-rose-800/50",
      hoverBg: "hover:bg-rose-100 dark:hover:bg-rose-900/20",
      titleColor: "text-rose-700 dark:text-rose-400",
      btnBorder: "border-rose-200 dark:border-rose-700"
    }
  ];

  return (
    <div className="py-4 px-2 relative">
      <div className="bg-gradient-to-r from-emerald-50 dark:from-emerald-900/30 to-teal-50 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-800/50 rounded-[32px] p-6 lg:py-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-500">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 shrink-0 rounded-full bg-white dark:bg-emerald-950/50 shadow-sm flex items-center justify-center -rotate-12 hover:rotate-0 transition-transform duration-500">
            <Zap className="text-emerald-500 dark:text-emerald-400" size={28} />
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-black text-xl tracking-tight mb-1 flex flex-wrap items-center gap-3">
              Exclusive Vendor Deals
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-widest font-black animate-pulse">Live</span>
            </h4>
            <p className="text-slate-500 dark:text-emerald-200/70 text-sm font-semibold">Save up to 30% on premium vendors for a limited time when booking through PlanWAB.</p>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0 gap-2">
          <button onClick={() => setIsOpen(true)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-md whitespace-nowrap">
            VIEW OFFERS
          </button>
          <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">150+ active offers</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] p-8 max-w-lg w-full shadow-2xl relative border border-slate-100 dark:border-slate-800"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <X size={20} className="text-slate-500" />
              </button>

              <div className="flex flex-col items-center mb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                  <Zap className="text-emerald-500 dark:text-emerald-400" size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Active Offers</h3>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">Tap a code to copy and apply it during vendor booking.</p>
              </div>

              <div className="space-y-4">
                {COUPONS.map((coupon, i) => (
                  <div key={i} className={`border ${coupon.border} ${coupon.bg} rounded-2xl p-4 flex items-center justify-between gap-4 transition-all ${coupon.hoverBg}`}>
                    <div>
                      <h4 className={`text-sm font-bold ${coupon.titleColor} mb-1`}>{coupon.title}</h4>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{coupon.desc}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${
                        copiedCode === coupon.code 
                          ? 'bg-emerald-500 text-white border-emerald-500' 
                          : `bg-white dark:bg-slate-800 text-slate-900 dark:text-white border ${coupon.btnBorder} shadow-sm hover:scale-105 active:scale-95`
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
    <div className="py-4 px-2 relative">
      <div className="bg-gradient-to-r from-rose-50 dark:from-rose-900/30 to-pink-50 dark:to-pink-900/30 border border-rose-200 dark:border-rose-800/50 rounded-[32px] p-6 lg:py-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl hover:shadow-[0_20px_50px_rgba(244,63,94,0.15)] hover:-translate-y-1 transition-all duration-500">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 shrink-0 rounded-full bg-white dark:bg-rose-950/50 shadow-sm flex items-center justify-center -rotate-12 hover:rotate-0 transition-transform duration-500">
            <Users className="text-rose-500 dark:text-rose-400" size={28} />
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-black text-xl tracking-tight mb-1">
              Join the PlanWAB Community
            </h4>
            <p className="text-slate-500 dark:text-rose-200/70 text-sm font-semibold">Connect with couples, share advice, and get expert tips for your big day.</p>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0 gap-2">
          <button onClick={() => setIsOpen(true)} className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-md whitespace-nowrap">
            JOIN FORUM
          </button>
          <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">10k+ Couples Online</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] p-8 max-w-md w-full shadow-2xl relative border border-slate-100 dark:border-slate-800"
            >
              <button
                onClick={() => { setIsOpen(false); setIsSubmitted(false); }}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <X size={20} className="text-slate-500" />
              </button>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center animate-bounce">
                    <Users className="text-rose-600 dark:text-rose-400" size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Request Sent!</h3>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 px-4">
                      Your request to join the community has been received. Our admin will add you shortly!
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Community Access</h3>
                    <p className="text-sm border-b pb-4 mb-2 font-semibold text-slate-500 dark:text-slate-400">Enter your details to request forum access.</p>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <input type="text" placeholder="Your Full Name" className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-4 text-sm font-bold border-none outline-none focus:ring-2 focus:ring-rose-500 transition" required />
                    <input type="email" placeholder="Email Address" className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-4 text-sm font-bold border-none outline-none focus:ring-2 focus:ring-rose-500 transition" required />
                    <input type="text" placeholder="Wedding Date (Optional)" className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-4 text-sm font-bold border-none outline-none focus:ring-2 focus:ring-rose-500 transition" />
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl py-5 font-black text-xs tracking-[0.2em] mt-2 active:scale-95 transition-all shadow-lg">
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
    <div className="py-4 px-2 relative">
      <div className="bg-gradient-to-r from-cyan-50 dark:from-cyan-900/30 to-blue-50 dark:to-blue-900/30 border border-cyan-200 dark:border-cyan-800/50 rounded-[32px] p-6 lg:py-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] hover:-translate-y-1 transition-all duration-500">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 shrink-0 rounded-full bg-white dark:bg-cyan-950/50 shadow-sm flex items-center justify-center -rotate-12 hover:rotate-0 transition-transform duration-500">
            <LayoutGrid className="text-cyan-500 dark:text-cyan-400" size={28} />
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-black text-xl tracking-tight mb-1">
              {downloadState === "completed" ? "Successfully Downloaded!" : "Read Our Digital Magazine"}
            </h4>
            <p className="text-slate-500 dark:text-cyan-200/70 text-sm font-semibold">
              {downloadState === "completed" 
                ? "The latest edition has been saved to your device. Enjoy reading!" 
                : "Discover the latest wedding trends, real wedding stories, and expert guides."}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0 gap-2">
          <button 
            onClick={handleDownload} 
            disabled={downloadState !== "idle"}
            className={`px-8 py-4 rounded-2xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-md whitespace-nowrap overflow-hidden flex items-center gap-3 ${
              downloadState === "completed"
                ? "bg-green-500 text-white"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white"
            }`}
          >
            {downloadState === "idle" && "DOWNLOAD MAGAZINE"}
            {downloadState === "downloading" && (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                DOWNLOADING...
              </>
            )}
            {downloadState === "completed" && (
              <>
                <Check size={16} strokeWidth={3} />
                MAGAZINE DOWNLOADED
              </>
            )}
          </button>
          <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Updated Weekly · 12MB</span>
        </div>
      </div>
    </div>
  );
});
MagazineStrip.displayName = "MagazineStrip";

const VendorStorefrontStrip = memo(() => {
  const router = useRouter();

  return (
    <div className="py-4 px-2 relative">
      <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-[32px] p-1 overflow-hidden group hover:border-solid transition-all duration-500 shadow-sm hover:shadow-xl">
        <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-[28px] p-6 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8 py-10 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
            <Building2 size={240} className="text-indigo-600" />
          </div>

          <div className="relative z-10 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-4">
              <Building2 size={12} />
              For Professionals
            </div>
            <h4 className="text-slate-900 dark:text-white font-black text-2xl lg:text-3xl tracking-tight mb-2">
              Are you a Wedding Vendor?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 font-medium max-w-md">
              Grow your business, showcase your portfolio, and connect with premium clients planning their big day.
            </p>
          </div>
          
          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <button onClick={() => router.push('/vendor/register')} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all shadow-[0_10px_20px_rgba(79,70,229,0.2)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.3)] active:scale-95">
              Claim Your Profile
            </button>
          </div>
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
    <div className="py-4 px-2">
      <div className="bg-indigo-50/40 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-[32px] p-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-white dark:bg-indigo-900/30 flex items-center justify-center shadow-sm shrink-0">
            {isSubmitted ? (
              <Check className="text-green-600 dark:text-green-400" size={24} strokeWidth={3} />
            ) : (
              <Sparkles className="text-indigo-600 dark:text-indigo-400" size={24} />
            )}
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-slate-900 dark:text-white font-black text-lg tracking-tight mb-1">
              {isSubmitted ? "Request Received!" : "Overwhelmed with choices?"}
            </h4>
            <p className="text-slate-500 dark:text-indigo-200/70 text-sm font-semibold">
              {isSubmitted 
                ? "Our expert team has been notified and will contact you shortly to help." 
                : "Our expert concierge is available 24/7 to help you structure your dream event."}
            </p>
          </div>
        </div>
        <button 
          onClick={handleRequest}
          disabled={isSubmitted}
          className={`px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all active:scale-95 shadow-lg whitespace-nowrap flex items-center gap-2 ${
            isSubmitted 
              ? "bg-green-500 text-white shadow-none" 
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-200 dark:shadow-none"
          }`}
        >
          {isSubmitted ? (
            <>
              <Check size={14} strokeWidth={3} />
              CONTACT REQUESTED
            </>
          ) : (
            "GET FREE EXPERT HELP"
          )}
        </button>
      </div>
    </div>
  );
});
ConciergeSmallStrip.displayName = "ConciergeSmallStrip";

export default function VendorProfilesExploreWrapper() {
  const [allProfiles, setAllProfiles] = useState({ data: [], loading: true });
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
        [key]: { data: Array.isArray(json.data) ? json.data : [], loading: false },
      }));
    } catch {
      setSections((prev) => ({ ...prev, [key]: { data: [], loading: false } }));
    }
  }, []);

  useEffect(() => {
    const fetchAllProfiles = async () => {
      try {
        const res = await fetch(`/api/vendor/profile/lists?sortBy=trust&sortOrder=desc&page=1&limit=20`);
        const json = await res.json();
        setAllProfiles({ data: Array.isArray(json.data) ? json.data : [], loading: false });
      } catch {
        setAllProfiles({ data: [], loading: false });
      }
    };
    
    fetchAllProfiles();
    CAROUSEL_SECTIONS.forEach(({ key, apiCategory }) => fetchSection(key, apiCategory));
  }, [fetchSection]);

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

  const isGlobalLoading = allProfiles.loading || Object.values(sections).some((s) => s.loading);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors duration-500">
      <main className="max-w-[1400px] mx-auto px-8 pt-32 pb-16">
        <ProfileMediaHero featuredProfiles={featuredProfiles} isLoading={Object.values(sections).some((s) => s.loading)} />

        <div className="space-y-4">
          <ProfileCarousel
            id="all-profiles"
            label="All Profiles"
            subtitle="Top rated across all categories"
            icon={Star}
            color="#f59e0b"
            profiles={allProfiles.data}
            isLoading={allProfiles.loading}
            apiCategory=""
          />

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
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
