"use client";

import React, { useState, useEffect, memo, useCallback, useRef, useMemo } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Star,
  Heart,
  Bookmark,
  LogOut,
  X,
  MessageSquare,
  CreditCard,
  CheckCircle2,
  Clock,
  Package,
  Coins,
  Crown,
  Edit3,
  Phone,
  Mail,
  Save,
  Loader2,
  Sparkles,
  Shield,
  Check,
  Play,
  Users,
  Film,
  Store,
  ShieldCheck,
  ImageIcon,
  Settings,
  HelpCircle,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  Grid3X3,
  BookOpen,
  Eye,
  Share2,
  Trash2,
  Search,
  SlidersHorizontal,
  Zap,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { useVideoThumbnail } from "../../../lib/video-thumbnail";
import SmartMedia from "../SmartMediaLoader";

const MediaRenderer = ({ src, alt, className, ...props }) => {
  if (src?.startsWith("data:") || src?.startsWith("blob:")) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img src={src} alt={alt} className="w-full h-full object-cover" {...props} />
      </div>
    );
  }
  return <SmartMedia src={src} alt={alt} className={className} {...props} />;
};

const Shimmer = memo(({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200/60 dark:bg-gray-800 rounded-xl ${className}`}>
    <div
      className="absolute inset-0 -translate-x-full"
      style={{
        background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.4) 50%,transparent 100%)",
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
    />
  </div>
));
Shimmer.displayName = "Shimmer";

const StatusBadge = memo(({ status }) => {
  const c = {
    CONFIRMED:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    PENDING:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    COMPLETED: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800",
    CANCELLED: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  };
  const icons = { CONFIRMED: CheckCircle2, PENDING: Clock, COMPLETED: Check, CANCELLED: X };
  const Icon = icons[status] || Clock;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${c[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}
    >
      <Icon size={11} />
      {status}
    </span>
  );
});
StatusBadge.displayName = "StatusBadge";

const PlanBadge = memo(({ plan, size = "default" }) => {
  const m = {
    free: { l: "Free", bg: "bg-gray-100 dark:bg-gray-800", t: "text-gray-600 dark:text-gray-400", I: null },
    pro: {
      l: "Pro",
      bg: "bg-violet-100 dark:bg-violet-900/40",
      t: "text-violet-700 dark:text-violet-400",
      I: Sparkles,
    },
    max: {
      l: "Max",
      bg: "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40",
      t: "text-amber-700 dark:text-amber-400",
      I: Crown,
    },
  };
  const p = m[plan] || m.free;
  const s = size === "large" ? "px-4 py-1.5 text-sm gap-1.5" : "px-2.5 py-1 text-xs gap-1";
  return (
    <span className={`inline-flex items-center font-bold rounded-full ${p.bg} ${p.t} ${s}`}>
      {p.I && <p.I size={size === "large" ? 14 : 12} />}
      {p.l}
    </span>
  );
});
PlanBadge.displayName = "PlanBadge";

const HCarousel = memo(({ label, icon: Icon, count, items, renderItem, itemClass = "w-[220px]", onRemove }) => {
  const ref = useRef(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(false);
  const check = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanL(el.scrollLeft > 5);
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [check, items]);
  const scroll = useCallback((dir) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }, []);
  if (!items || items.length === 0) return null;
  return (
    <div className="relative mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Icon size={14} className="text-gray-500" />
            </div>
          )}
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{label}</span>
          {count !== undefined && (
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full font-semibold">
              {count}
            </span>
          )}
        </div>
      </div>
      <div className="relative group/carousel">
        <AnimatePresence>
          {canL && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-0 bottom-2 w-16 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none"
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {canR && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none"
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {canL && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scroll(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 z-20 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/30 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ChevronLeft size={18} className="text-gray-700 dark:text-gray-300" />
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {canR && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scroll(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 z-20 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/30 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ChevronRight size={18} className="text-gray-700 dark:text-gray-300" />
            </motion.button>
          )}
        </AnimatePresence>
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto pb-3 scroll-smooth [&::-webkit-scrollbar]:hidden px-1"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((item, i) => (
            <div
              key={item?._id?.toString?.() || item?.reelId || item?.postId || i}
              className={`shrink-0 ${itemClass} relative group/card`}
            >
              {onRemove && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove(item);
                  }}
                  className="absolute top-2.5 right-2.5 z-30 w-7 h-7 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-200 hover:bg-red-500 hover:scale-110 border border-white/10"
                  title="Remove from collection"
                >
                  <X size={11} className="text-white" strokeWidth={3} />
                </button>
              )}
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
HCarousel.displayName = "HCarousel";

const VendorCard = memo(({ vendor }) => {
  const img = vendor.defaultImage || vendor.images?.[0] || "/placeholder.jpg";
  const city = vendor.address?.city || "";
  const cat = vendor.category || "";
  const reviewCount = vendor.reviews || vendor.reviewCount || 0;
  const yrs = vendor.yearsExperience || 0;
  return (
    <Link href={`/vendor/${cat}/${vendor._id}`} className="group block w-full h-full">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 h-full flex flex-col">
        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          {/* <img
            src={img}
            alt={vendor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          /> */}
          <SmartMedia
            src={img}
            alt={vendor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
            {vendor.isVerified && (
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-bold">
                <ShieldCheck size={10} /> Verified
              </span>
            )}
            {vendor.isFeatured && !vendor.isVerified && (
              <span className="text-[10px] bg-amber-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-bold">
                Featured
              </span>
            )}
            {vendor.rating > 0 && (
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm ml-auto">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                {vendor.rating}
              </div>
            )}
          </div>
          {cat && (
            <span className="absolute bottom-2.5 left-2.5 text-[10px] bg-black/40 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-medium capitalize">
              {cat}
            </span>
          )}
        </div>
        <div className="p-3.5 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate group-hover:text-violet-600 transition-colors">
            {vendor.name}
          </h3>
          {city && (
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <MapPin size={11} />
              {city}
            </p>
          )}
          <div className="mt-auto pt-2.5 flex items-center justify-between">
            {vendor.perDayPrice?.min ? (
              <p className="text-xs font-bold text-violet-600 dark:text-violet-400">
                From ₹{vendor.perDayPrice.min.toLocaleString("en-IN")}
              </p>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              {reviewCount > 0 && <span>{reviewCount} reviews</span>}
              {yrs > 0 && <span>{yrs}y exp</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});
VendorCard.displayName = "VendorCard";

const ReelCard = memo(({ reel }) => {
  const thumb = reel.thumbnailUrl || reel.thumbnail || "/placeholder.jpg";
  const likes = reel.likesCount ?? reel.likeCount ?? 0;
  const views = reel.viewCount ?? 0;
  const title = reel.title || reel.caption || "";
  const vendor = reel.vendorName || "";
  const duration = reel.duration || "";
  const category = reel.category || "";
  const hashtags = reel.hashtags || [];
  return (
    <Link href={`/ideas?type=${reel.type}&reel=${reel._id}`} className="group block w-full h-full">
      <div className="rounded-2xl overflow-hidden bg-gray-900 relative h-full shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="aspect-[9/16] relative">
          {/* <img
            src={thumb}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          /> */}
          <SmartMedia
            src={thumb}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            {category && (
              <span className="text-[10px] bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-full font-semibold capitalize border border-white/10">
                {category}
              </span>
            )}
            {duration && (
              <span className="text-[10px] bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-full font-medium ml-auto border border-white/10">
                {duration}
              </span>
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
              <Play size={22} className="text-white ml-1" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3.5">
            {title && (
              <p className="text-sm text-white font-semibold line-clamp-2 leading-snug mb-1 drop-shadow-lg">{title}</p>
            )}
            {vendor && <p className="text-[11px] text-white/70 truncate drop-shadow">{vendor}</p>}
            {hashtags.length > 0 && (
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {hashtags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-[9px] text-white/50 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-white/10">
              {views > 0 && (
                <span className="flex items-center gap-1.5 text-[11px] text-white/80 font-medium">
                  <Eye size={11} className="opacity-70" />
                  {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
                </span>
              )}
              {likes > 0 && (
                <span className="flex items-center gap-1.5 text-[11px] text-white/80 font-medium">
                  <Heart size={11} fill="currentColor" className="opacity-70" />
                  {likes}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});
ReelCard.displayName = "ReelCard";

const ReelCardVP = memo(({ reel }) => {
  const thumb = reel.thumbnailUrl || reel.thumbnail || "/placeholder.jpg";
  const likes = reel.likesCount ?? 0;
  const views = reel.views ?? reel.viewCount ?? 0;
  const title = reel.title || reel.caption || "";
  const vendor = reel.vendorName || reel.vendorBusinessName || "";
  const avatar = reel.vendorAvatar || "";
  const url = reel.vendorId
    ? `/vendor/${reel.category}/${reel.vendorId}/profile?tab=reels&reel=${reel.reelIndex}`
    : `/vendor/${reel.category}/profile/${reel.username}?tab=reels&reel=${reel.reelIndex}`;
  return (
    <Link href={url} className="group block w-full h-full">
      <div className="rounded-2xl overflow-hidden bg-gray-900 relative h-full shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="aspect-[9/16] relative">
          {/* <img
            src={thumb}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          /> */}
          <SmartMedia
            src={thumb}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
              <Play size={22} className="text-white ml-1" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3.5">
            {avatar && vendor && (
              <div className="flex items-center gap-2 mb-2">
                <SmartMedia src={avatar} alt="" className="w-5 h-5 rounded-full object-cover border border-white/30" />
                <span className="text-[11px] text-white/80 font-medium truncate">{vendor}</span>
              </div>
            )}
            {!avatar && vendor && <p className="text-[11px] text-white/70 truncate mb-1 drop-shadow">{vendor}</p>}
            {title && (
              <p className="text-sm text-white font-semibold line-clamp-2 leading-snug drop-shadow-lg">{title}</p>
            )}
            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/10">
              {views > 0 && (
                <span className="flex items-center gap-1.5 text-[11px] text-white/80 font-medium">
                  <Eye size={11} className="opacity-70" />
                  {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
                </span>
              )}
              {likes > 0 && (
                <span className="flex items-center gap-1.5 text-[11px] text-white/80 font-medium">
                  <Heart size={11} fill="currentColor" className="opacity-70" />
                  {likes}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});
ReelCardVP.displayName = "ReelCardVP";

const VProfileCard = memo(({ profile }) => {
  const name = profile.vendorBusinessName || profile.username || "Vendor";
  const img = profile.vendorAvatar;
  const cat = profile.category || "";
  const cover = profile.vendorCoverImage;
  const city = profile.location?.city || "";
  const likesCount = profile.likesCount ?? 0;
  const trustCount = profile.trustCount ?? 0;
  const postsCount = profile.postsCount ?? 0;
  const reelsCount = profile.reelsCount ?? 0;
  const url = profile.vendorId
    ? `/vendor/${cat}/${profile.vendorId}/profile`
    : `/vendor/${cat}/profile/${profile.username}`;
  return (
    <Link href={url} className="group block w-full h-full">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all duration-300 h-full flex flex-col">
        <div
          className="h-20 relative"
          style={{
            background: cover ? `url(${cover}) center/cover` : "linear-gradient(135deg,#ede9fe,#fce7f3,#e0e7ff)",
          }}
        >
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="px-4 pb-4 -mt-7 relative flex-1 flex flex-col">
          {/* <img
            src={img}
            alt={name}
            className="w-14 h-14 rounded-xl border-[3px] border-white dark:border-gray-900 object-cover shadow-lg"
            loading="lazy"
          /> */}
          <SmartMedia
            src={img}
            alt={name}
            className="w-14 h-14 rounded-xl border-[3px] border-white dark:border-gray-900 object-cover shadow-lg"
          />
          <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate mt-2.5 group-hover:text-violet-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            {cat && <p className="text-xs text-gray-500 capitalize">{cat}</p>}
            {city && <p className="text-xs text-gray-400">· {city}</p>}
          </div>
          <div className="mt-auto pt-3 grid grid-cols-3 gap-1 border-t border-gray-100 dark:border-gray-800">
            {(profile.trust ?? 0) > 0 && (
              <div className="text-center">
                <p className="text-xs font-bold text-emerald-600">{profile.trust}</p>
                <p className="text-[9px] text-gray-400">Trust</p>
              </div>
            )}
            {postsCount > 0 && (
              <div className="text-center">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{postsCount}</p>
                <p className="text-[9px] text-gray-400">Posts</p>
              </div>
            )}
            {reelsCount > 0 && (
              <div className="text-center">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{reelsCount}</p>
                <p className="text-[9px] text-gray-400">Reels</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});
VProfileCard.displayName = "VProfileCard";

const PostCard = memo(({ post }) => {
  const isVideo = post.mediaType === "video";
  const videoThumb = useVideoThumbnail(isVideo ? post.mediaUrl : null);
  const thumb = isVideo ? videoThumb?.thumbnail : post.mediaUrl;
  const caption = post.content?.caption || post.description || "";
  const likes = post.likesCount ?? post.likes?.length ?? 0;
  const vendor = post.vendorName || "";
  const avatar = post.vendorAvatar || "";
  const location = post.content?.location || post.location || "";
  const url = post.vendorId
    ? `/vendor/${post.category}/${post.vendorId}/profile?tab=posts&post=${post._id}`
    : `/vendor/${post.category}/profile/${post.username}?tab=posts&post=${post._id}`;
  return (
    <Link href={url} className="group block w-full h-full">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all duration-300 h-full flex flex-col">
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          {/* <img
            src={thumb || "/placeholder.jpg"}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          /> */}
          <div className="relative w-full h-full">
            {videoThumb?.loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-300 dark:bg-gray-600">
                <Loader2 className="w-6 h-6 animate-spin text-gray-700 dark:text-gray-200" />
              </div>
            )}

            <MediaRenderer
              src={videoThumb?.thumbnail || "/placeholder.jpg"}
              alt={vendor || videoThumb?.error}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                videoThumb?.loading ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
          {isVideo && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                  <Play size={16} className="text-white ml-0.5" fill="white" />
                </div>
              </div>
            </>
          )}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            {likes > 0 && (
              <span className="flex items-center gap-1 text-xs text-white font-semibold drop-shadow">
                <Heart size={11} fill="white" />
                {likes}
              </span>
            )}
            <span className="text-[10px] bg-black/50 backdrop-blur text-white px-2 py-0.5 rounded-full font-medium ml-auto">
              {isVideo ? "Video" : "Photo"}
            </span>
          </div>
        </div>
        <div className="p-3 flex-1 flex flex-col">
          {(avatar || vendor) && (
            <div className="flex items-center gap-2 mb-1.5">
              {avatar && <SmartMedia src={avatar} alt={vendor} className="w-5 h-5 rounded-full object-cover" />}
              {vendor && <p className="text-[11px] text-gray-500 truncate font-medium">{vendor}</p>}
            </div>
          )}
          {caption && <p className="text-xs text-gray-800 dark:text-gray-200 line-clamp-2 font-medium">{caption}</p>}
          {location && (
            <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
              <MapPin size={9} />
              {location}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
});
PostCard.displayName = "PostCard";

const BlogCard = memo(({ blog }) => {
  const img = blog.coverImage || blog.thumbnail || "/placeholder.jpg";
  const authorName = typeof blog.author === "string" ? blog.author : blog.author?.name || blog.authorName || "";
  const authorPhoto = blog.authorPhoto || (typeof blog.author === "object" ? blog.author?.photo : "");
  const excerpt = blog.excerpt || "";
  const views = blog.viewCount ?? 0;
  const likes = blog.likeCount ?? 0;
  return (
    <Link href={`/blog/${blog.slug || blog._id}`} className="group block w-full h-full">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all duration-300 h-full flex flex-col">
        <div className="h-[140px] bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          {/* <img
            src={img}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          /> */}
          <SmartMedia
            src={img}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {blog.category && (
            <span className="absolute top-2.5 left-2.5 text-[10px] bg-violet-600/90 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full font-bold">
              {blog.category}
            </span>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-violet-600 transition-colors leading-snug">
            {blog.title}
          </h3>
          {excerpt && <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">{excerpt}</p>}
          <div className="mt-auto pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {authorPhoto && <SmartMedia src={authorPhoto} alt="" className="w-5 h-5 rounded-full object-cover" />}
              <div>
                {authorName && <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium">{authorName}</p>}
                {blog.readTime && <p className="text-[10px] text-gray-400">{blog.readTime}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-[10px] text-gray-400">
              {views > 0 && (
                <span className="flex items-center gap-1">
                  <Eye size={10} />
                  {views}
                </span>
              )}
              {likes > 0 && (
                <span className="flex items-center gap-1">
                  <Heart size={10} />
                  {likes}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});
BlogCard.displayName = "BlogCard";

const SidebarItem = memo(({ icon: Icon, label, isActive, onClick, badge, isDestructive }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? "bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30" : isDestructive ? "hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
  >
    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
    <span
      className={`text-sm font-medium flex-1 text-left ${isActive ? "" : "group-hover:text-gray-900 dark:group-hover:text-white"}`}
    >
      {label}
    </span>
    {badge && (
      <span
        className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"}`}
      >
        {badge}
      </span>
    )}
  </button>
));
SidebarItem.displayName = "SidebarItem";

const StatCard = memo(({ icon: Icon, label, value, color = "violet", onClick, trend }) => {
  const colors = {
    violet: "bg-violet-500 shadow-violet-200 dark:shadow-violet-900/30",
    amber: "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-200 dark:shadow-amber-900/30",
    emerald: "bg-emerald-500 shadow-emerald-200 dark:shadow-emerald-900/30",
    sky: "bg-sky-500 shadow-sky-200 dark:shadow-sky-900/30",
  };
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all duration-300 ${onClick ? "cursor-pointer hover:border-gray-200 dark:hover:border-gray-700" : ""}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${colors[color]}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
            <TrendingUp size={12} />
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
});
StatCard.displayName = "StatCard";

const EmptyState = memo(({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6">
      <Icon size={32} className="text-gray-300 dark:text-gray-600" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
    {action && (
      <Link
        href={action.href}
        className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
      >
        {action.label} <ChevronRight size={14} />
      </Link>
    )}
  </div>
));
EmptyState.displayName = "EmptyState";

const TabPill = memo(({ tabs, active, onChange }) => (
  <div className="flex bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-2xl gap-1">
    {tabs.map((t) => {
      const isA = active === t.id;
      return (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`relative flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isA ? "text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
        >
          {isA && (
            <motion.div
              layoutId="coll-pill-bg"
              className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl shadow-lg shadow-violet-200/50 dark:shadow-violet-900/40"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {t.icon && <t.icon size={15} />}
            {t.label}
            {t.count > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${isA ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}
              >
                {t.count}
              </span>
            )}
          </span>
        </button>
      );
    })}
  </div>
));
TabPill.displayName = "TabPill";

const SubTabBar = memo(({ tabs, active, onChange }) => (
  <div className="flex gap-2 mb-6">
    {tabs.map((t) => {
      const isA = active === t.id;
      return (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${isA ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
        >
          <span className="flex items-center gap-2">
            {t.label}
            {t.count > 0 && (
              <span className={`text-xs font-bold ${isA ? "text-white/60 dark:text-gray-500" : "text-gray-400"}`}>
                {t.count}
              </span>
            )}
          </span>
        </button>
      );
    })}
  </div>
));
SubTabBar.displayName = "SubTabBar";

const CollectionInsights = memo(({ lists }) => {
  const totalLiked =
    lists.vendors.liked.length +
    lists.reels.liked.length +
    lists.reels.likedVendorProfileReels.length +
    lists.vendorProfiles.liked.length +
    lists.vendorProfiles.posts.liked.length +
    lists.blogs.liked.length;
  const totalSaved =
    lists.vendors.watchlist.length +
    lists.reels.watchlist.length +
    lists.reels.watchlistVendorProfileReels.length +
    lists.vendorProfiles.posts.watchlist.length +
    lists.blogs.watchlist.length;
  const totalTrusted = lists.vendorProfiles.trusted.length;
  const totalReels =
    lists.reels.liked.length +
    lists.reels.watchlist.length +
    lists.reels.likedVendorProfileReels.length +
    lists.reels.watchlistVendorProfileReels.length;

  if (totalLiked + totalSaved + totalTrusted === 0) return null;

  const stats = [
    {
      icon: Heart,
      label: "Liked",
      value: totalLiked,
      gradient: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
      border: "border-pink-100 dark:border-pink-900/30",
      iconColor: "text-pink-500",
      valueColor: "text-pink-700 dark:text-pink-400",
    },
    {
      icon: Bookmark,
      label: "Saved",
      value: totalSaved,
      gradient: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      border: "border-blue-100 dark:border-blue-900/30",
      iconColor: "text-blue-500",
      valueColor: "text-blue-700 dark:text-blue-400",
    },
    {
      icon: ShieldCheck,
      label: "Trusted",
      value: totalTrusted,
      gradient: "from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20",
      border: "border-emerald-100 dark:border-emerald-900/30",
      iconColor: "text-emerald-500",
      valueColor: "text-emerald-700 dark:text-emerald-400",
    },
    {
      icon: Film,
      label: "All Reels",
      value: totalReels,
      gradient: "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20",
      border: "border-violet-100 dark:border-violet-900/30",
      iconColor: "text-violet-500",
      valueColor: "text-violet-700 dark:text-violet-400",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {stats.map((s) => (
        <div key={s.label} className={`bg-gradient-to-br ${s.gradient} rounded-xl p-4 border ${s.border}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <s.icon size={14} className={s.iconColor} />
            <span className={`text-xs font-semibold ${s.iconColor}`}>{s.label}</span>
          </div>
          <p className={`text-2xl font-bold ${s.valueColor}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
});
CollectionInsights.displayName = "CollectionInsights";

const FullPageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
    <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    <div className="flex">
      <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 h-[calc(100vh-80px)] sticky top-20 p-6">
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Shimmer key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      </aside>
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center gap-6">
            <Shimmer className="w-24 h-24 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Shimmer className="h-8 w-48 rounded-lg" />
              <Shimmer className="h-4 w-64 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Shimmer key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
          <Shimmer className="h-64 rounded-2xl" />
        </div>
      </main>
    </div>
  </div>
);

const SIDEBAR_TABS = [
  { id: "overview", label: "Overview", icon: Grid3X3 },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "collection", label: "My Collection", icon: Heart },
  { id: "wallet", label: "Wallet & Credits", icon: Coins },
  { id: "settings", label: "Account Settings", icon: Settings },
];

const COLLECTION_TABS_DEF = [
  { id: "vendors", label: "Vendors", icon: Store },
  { id: "profiles", label: "Profiles", icon: Users },
  { id: "reels", label: "Reels", icon: Film },
  { id: "blogs", label: "Blogs", icon: BookOpen },
];

const VP_SUB_TABS_DEF = [
  { id: "profiles", label: "Profiles" },
  { id: "posts", label: "Posts" },
  { id: "reels", label: "Reels" },
];

const EMPTY_LISTS = {
  vendors: { liked: [], watchlist: [] },
  reels: { liked: [], watchlist: [], likedVendorProfileReels: [], watchlistVendorProfileReels: [] },
  vendorProfiles: { liked: [], trusted: [], posts: { liked: [], watchlist: [] } },
  blogs: { liked: [], watchlist: [] },
};

export default function UserProfilePageWrapper() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [dbUser, setDbUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [orders, setOrders] = useState([]);
  const [lists, setLists] = useState(EMPTY_LISTS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const [createdProfilesData, setCreatedProfilesData] = useState([]);
  const [fetchingProfiles, setFetchingProfiles] = useState(true);

  const [activeSection, setActiveSection] = useState(() => {
    const s = searchParams.get("section");
    return s && SIDEBAR_TABS.some((t) => t.id === s) ? s : "overview";
  });
  const [activeCollTab, setActiveCollTab] = useState(() => {
    const t = searchParams.get("tab");
    return t && COLLECTION_TABS_DEF.some((x) => x.id === t) ? t : "vendors";
  });
  const [vpSubTab, setVpSubTab] = useState("profiles");
  const [collectionSearch, setCollectionSearch] = useState("");

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
  });

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

  const fetchLinkedProfiles = useCallback(async (userId) => {
    setFetchingProfiles(true);
    try {
      const res = await fetch(`/api/vendor/profile/created-by?userId=${userId}`);
      if (!res.ok) return;
      const json = await res.json();

      if (json.success && json.data?.profiles?.length > 0) {
        const profilePromises = json.data.profiles.map((id) => fetchVendorProfile(id));
        const profiles = (await Promise.all(profilePromises)).filter(Boolean);
        setCreatedProfilesData(profiles);
      }
    } catch (e) {
      console.error("Failed to fetch linked profiles", e);
    } finally {
      setFetchingProfiles(false);
    }
  }, []);

  useEffect(() => {
    const s = searchParams.get("section");
    const t = searchParams.get("tab");
    if (s && SIDEBAR_TABS.some((x) => x.id === s) && s !== activeSection) setActiveSection(s);
    if (t && COLLECTION_TABS_DEF.some((x) => x.id === t) && t !== activeCollTab) setActiveCollTab(t);
  }, [searchParams]);

  const updateURL = useCallback(
    (section, tab) => {
      const p = new URLSearchParams();
      if (section) p.set("section", section);
      if (tab && section === "collection") p.set("tab", tab);
      router.replace(`${pathname}?${p.toString()}`, { scroll: false });
    },
    [router, pathname],
  );

  const handleSection = useCallback(
    (id) => {
      setActiveSection(id);
      updateURL(id, id === "collection" ? activeCollTab : null);
    },
    [updateURL, activeCollTab],
  );
  const handleCollTab = useCallback(
    (id) => {
      setActiveCollTab(id);
      setVpSubTab("profiles");
      setCollectionSearch("");
      updateURL("collection", id);
    },
    [updateURL],
  );

  const showToast = useCallback((msg, type = "success") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  const fetchAllData = useCallback(async (userId) => {
    try {
      const [uR, oR, sR, lR] = await Promise.all([
        fetch(`/api/user?userId=${userId}`),
        fetch(`/api/orders?userId=${userId}`),
        fetch(`/api/user/subscription?userId=${userId}`),
        fetch(`/api/user/interactionsLists?userId=${userId}`),
      ]);
      if (uR.ok) {
        const u = await uR.json();
        setDbUser(u);
        setEditForm({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          phone: u.personalInfo?.phone || "",
          address: u.personalInfo?.address?.address || "",
          city: u.personalInfo?.address?.city || "",
          pincode: u.personalInfo?.address?.pincode || "",
          state: u.personalInfo?.address?.state || "",
        });
      }
      if (oR.ok) {
        const d = await oR.json();
        if (d.success) setOrders(d.data || []);
      }
      if (sR.ok) setSubscription(await sR.json());
      if (lR.ok) {
        const l = await lR.json();
        if (l.success)
          setLists({
            vendors: l.vendors || EMPTY_LISTS.vendors,
            reels: {
              liked: l.reels?.liked || [],
              watchlist: l.reels?.watchlist || [],
              likedVendorProfileReels: l.reels?.likedVendorProfileReels || [],
              watchlistVendorProfileReels: l.reels?.watchlistVendorProfileReels || [],
            },
            vendorProfiles: {
              liked: l.vendorProfiles?.liked || [],
              trusted: l.vendorProfiles?.trusted || [],
              posts: {
                liked: l.vendorProfiles?.posts?.liked || [],
                watchlist: l.vendorProfiles?.posts?.watchlist || [],
              },
            },
            blogs: l.blogs || EMPTY_LISTS.blogs,
          });
      }
    } catch (e) {
      console.error("Profile fetch:", e);
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      await Promise.all([fetchAllData(user.id), fetchLinkedProfiles(user.id)]);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, fetchAllData]);

  const handleSimilarprofileClick = (profile) => {
    const backTo = encodeURIComponent(window.location.href);
    if (profile?.vendorId) {
      router.push(`/vendor/${profile.category}/${profile.vendorId}/profile?backTo=${backTo}`);
    } else {
      router.push(`/vendor/${profile.category}/profile/${profile.username}?backTo=${backTo}`);
    }
  };

  const refreshLists = useCallback(async () => {
    if (!user?.id || refreshing) return;
    setRefreshing(true);
    try {
      const res = await fetch(`/api/user/interactionsLists?userId=${user.id}`);
      if (res.ok) {
        const l = await res.json();
        if (l.success)
          setLists({
            vendors: l.vendors || EMPTY_LISTS.vendors,
            reels: {
              liked: l.reels?.liked || [],
              watchlist: l.reels?.watchlist || [],
              likedVendorProfileReels: l.reels?.likedVendorProfileReels || [],
              watchlistVendorProfileReels: l.reels?.watchlistVendorProfileReels || [],
            },
            vendorProfiles: {
              liked: l.vendorProfiles?.liked || [],
              trusted: l.vendorProfiles?.trusted || [],
              posts: {
                liked: l.vendorProfiles?.posts?.liked || [],
                watchlist: l.vendorProfiles?.posts?.watchlist || [],
              },
            },
            blogs: l.blogs || EMPTY_LISTS.blogs,
          });
      }
      showToast("Collection refreshed");
    } catch {
      showToast("Failed to refresh", "error");
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, refreshing, showToast]);

  const removeFromList = useCallback(
    async (listPath, item) => {
      const itemId = String(item._id || item.reelId || item.postId);
      const vpId = item.vendorProfileId ? String(item.vendorProfileId) : undefined;

      setLists((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        const parts = listPath.split(".");
        let target = next;
        for (let i = 0; i < parts.length - 1; i++) target = target[parts[i]];
        const key = parts[parts.length - 1];
        target[key] = target[key].filter((i) => {
          const id = String(i._id || i.reelId || i.postId);
          return id !== itemId;
        });
        return next;
      });

      try {
        const res = await fetch("/api/user/removeFromList", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            listType: listPath,
            itemId,
            vendorProfileId: vpId,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message || "Removed");
        } else {
          refreshLists();
          showToast(data.error || "Failed to remove", "error");
        }
      } catch {
        refreshLists();
        showToast("Something went wrong", "error");
      }
    },
    [user?.id, showToast, refreshLists],
  );

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          personalInfo: {
            phone: editForm.phone,
            address: {
              address: editForm.address,
              city: editForm.city,
              pincode: editForm.pincode,
              state: editForm.state,
            },
          },
        }),
      });
      const d = await res.json();
      if (d.success) {
        setDbUser(d.user);
        setEditOpen(false);
        showToast("Profile updated successfully");
      } else showToast(d.error || "Update failed", "error");
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const tc = useMemo(
    () => ({
      vendors: lists.vendors.liked.length + lists.vendors.watchlist.length,
      profiles:
        lists.vendorProfiles.liked.length +
        lists.vendorProfiles.trusted.length +
        lists.vendorProfiles.posts.liked.length +
        lists.vendorProfiles.posts.watchlist.length +
        lists.reels.likedVendorProfileReels.length +
        lists.reels.watchlistVendorProfileReels.length,
      reels: lists.reels.liked.length + lists.reels.watchlist.length,
      blogs: lists.blogs.liked.length + lists.blogs.watchlist.length,
    }),
    [lists],
  );

  const dynamicSidebarTabs = useMemo(() => {
    const tabs = [...SIDEBAR_TABS];
    if (createdProfilesData.length > 0) {
      tabs.splice(1, 0, { id: "linked-profiles", label: "Linked Profiles", icon: Store });
    }
    return tabs;
  }, [createdProfilesData.length]);

  const vpSubCounts = useMemo(
    () => ({
      profiles: lists.vendorProfiles.liked.length + lists.vendorProfiles.trusted.length,
      posts: lists.vendorProfiles.posts.liked.length + lists.vendorProfiles.posts.watchlist.length,
      reels: lists.reels.likedVendorProfileReels.length + lists.reels.watchlistVendorProfileReels.length,
    }),
    [lists],
  );

  const filterBySearch = useCallback(
    (items, searchFields) => {
      if (!collectionSearch.trim()) return items;
      const q = collectionSearch.toLowerCase();
      return items.filter((item) =>
        searchFields.some((field) => {
          const val = field.split(".").reduce((o, k) => o?.[k], item);
          return typeof val === "string" && val.toLowerCase().includes(q);
        }),
      );
    },
    [collectionSearch],
  );

  if (!isLoaded || (isSignedIn && loading)) return <FullPageSkeleton />;

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-violet-100 border border-gray-100">
            <Image src="/planwablogo.png" alt="PlanWAB" width={48} height={48} className="object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h1>
          <p className="text-gray-500 text-lg mb-10">Sign in to access your profile and manage bookings.</p>
          <div className="space-y-4">
            <Link
              href={`/sign-in?redirect_url=${encodeURIComponent(pathname)}`}
              className="block w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold text-lg hover:bg-violet-600 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="block w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-medium text-lg hover:bg-gray-50 transition-all"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const displayName = dbUser
    ? `${dbUser.firstName || ""} ${dbUser.lastName || ""}`.trim() || user.fullName
    : user.fullName;
  const currentPlan = subscription?.plan || dbUser?.plan || "free";
  const planActive = subscription?.isActive || false;
  const planExpiry = subscription?.planExpiresAt;
  const phone = dbUser?.personalInfo?.phone;
  const city = dbUser?.personalInfo?.address?.city;
  const totalSpent = orders.reduce((s, o) => s + (o.pricing?.total || 0), 0);
  const pendingCount = orders.filter((o) => o.orderStatus === "PENDING").length;
  const confirmedCount = orders.filter((o) => o.orderStatus === "CONFIRMED").length;
  const totalSaved = tc.vendors + tc.profiles + tc.reels + tc.blogs;
  const memberSince = dbUser?.createdAt
    ? new Date(dbUser.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : null;

  const collTabs = COLLECTION_TABS_DEF.map((t) => ({ ...t, count: tc[t.id] }));
  const vpSubs = VP_SUB_TABS_DEF.map((t) => ({ ...t, count: vpSubCounts[t.id] }));

  const InputField = ({ label, value, onChange, ...props }) => (
    <div>
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all"
        {...props}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>

      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ y: -60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0, scale: 0.95 }}
            className={`fixed top-24 right-8 z-[200] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-white text-sm font-medium border ${toast.type === "error" ? "bg-red-500 border-red-400" : "bg-emerald-500 border-emerald-400"}`}
          >
            {toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 h-[calc(100vh-80px)] sticky top-20 flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              {/* <img
                src={user.imageUrl}
                alt={displayName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-100 dark:ring-gray-800"
              /> */}
              <SmartMedia
                src={user.imageUrl}
                alt={displayName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-100 dark:ring-gray-800"
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 dark:text-white truncate">{displayName}</h2>
                <PlanBadge plan={currentPlan} />
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {dynamicSidebarTabs.map((t) => (
              <SidebarItem
                key={t.id}
                icon={t.icon}
                label={t.label}
                isActive={activeSection === t.id}
                onClick={() => handleSection(t.id)}
                badge={
                  t.id === "bookings" && pendingCount > 0
                    ? pendingCount
                    : t.id === "collection" && totalSaved > 0
                      ? totalSaved
                      : t.id === "linked-profiles" && createdProfilesData.length > 0
                        ? createdProfilesData.length
                        : null
                }
              />
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
            <SidebarItem
              icon={HelpCircle}
              label="Help & Support"
              onClick={() => window.open("/about/contact", "_blank")}
            />
            <SidebarItem icon={LogOut} label="Sign Out" isDestructive onClick={() => signOut({ redirectUrl: "/" })} />
            <p className="text-[10px] text-gray-300 dark:text-gray-700 text-center mt-4">v2.9.0</p>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeSection === "overview" && (
                <motion.div
                  key="ov"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {dbUser?.firstName || user.firstName}
                      </h1>
                      <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your account</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* NEW BUTTON FOR EXISTING PROFILES */}
                      {createdProfilesData.length > 0 && (
                        <button
                          onClick={() => {
                            if (createdProfilesData.length === 1) {
                              handleSimilarprofileClick(createdProfilesData[0]);
                            } else {
                              handleSection("linked-profiles");
                            }
                          }}
                          className="px-5 py-2.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-xl font-medium hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors flex items-center gap-2"
                        >
                          <Store size={16} /> Open Profile
                        </button>
                      )}

                      <Link
        href="/vendor/onboarding"
        className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
      >
        <Store size={16} /> Create Profile
      </Link>

                      {/* Existing Edit Button */}
                      <button
                        onClick={() => setEditOpen(true)}
                        className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-violet-600 dark:hover:bg-violet-600 dark:hover:text-white transition-colors flex items-center gap-2"
                      >
                        <Edit3 size={16} /> Edit Profile
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-5">
                    <StatCard
                      icon={Coins}
                      label="Credits"
                      value={dbUser?.creditBalance ?? 0}
                      color="amber"
                      onClick={() => handleSection("wallet")}
                    />
                    <StatCard
                      icon={Package}
                      label="Bookings"
                      value={orders.length}
                      color="violet"
                      onClick={() => handleSection("bookings")}
                      trend={confirmedCount > 0 ? `${confirmedCount} active` : undefined}
                    />
                    <StatCard
                      icon={Bookmark}
                      label="Saved"
                      value={totalSaved}
                      color="sky"
                      onClick={() => handleSection("collection")}
                    />
                    <StatCard
                      icon={CreditCard}
                      label="Total Spent"
                      value={`₹${totalSpent.toLocaleString()}`}
                      color="emerald"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-5">
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Bookings</h2>
                          {orders.length > 0 && (
                            <button
                              onClick={() => handleSection("bookings")}
                              className="text-sm text-violet-600 font-semibold hover:underline flex items-center gap-1"
                            >
                              View All
                              <ChevronRight size={14} />
                            </button>
                          )}
                        </div>
                        {orders.length === 0 ? (
                          <EmptyState
                            icon={Package}
                            title="No bookings yet"
                            description="Start exploring vendors to make your first booking"
                            action={{ label: "Browse Vendors", href: "/vendors/marketplace" }}
                          />
                        ) : (
                          <div className="space-y-3">
                            {orders.slice(0, 3).map((o) => (
                              <div
                                key={o._id}
                                onClick={() => setSelectedOrder(o)}
                                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 group"
                              >
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                                  {/* <img
                                    src={o.items?.[0]?.image || "/placeholder.jpg"}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  /> */}
                                  <SmartMedia
                                    src={o.items?.[0]?.image || "/placeholder.jpg"}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-violet-600 transition-colors">
                                    {o.items?.[0]?.name || "Service"}
                                  </h3>
                                  <p className="text-sm text-gray-500">{o.event?.type}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <StatusBadge status={o.orderStatus} />
                                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                                    ₹{o.pricing?.total?.toLocaleString()}
                                  </p>
                                </div>
                                <ChevronRight
                                  size={16}
                                  className="text-gray-300 shrink-0 group-hover:text-violet-500 transition-colors"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-5">
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            {
                              label: "Browse Vendors",
                              icon: Store,
                              href: "/vendors/marketplace",
                              color: "bg-violet-50 dark:bg-violet-900/20 text-violet-600",
                            },
                            {
                              label: "Watch Reels",
                              icon: Film,
                              href: "/ideas",
                              color: "bg-pink-50 dark:bg-pink-900/20 text-pink-600",
                            },
                            {
                              label: "Read Blogs",
                              icon: BookOpen,
                              href: "/about/blogs",
                              color: "bg-sky-50 dark:bg-sky-900/20 text-sky-600",
                            },
                          ].map((a) => (
                            <Link
                              key={a.label}
                              href={a.href}
                              className={`flex items-center gap-3 p-4 rounded-xl ${a.color} hover:opacity-80 transition-opacity`}
                            >
                              <a.icon size={18} />
                              <span className="text-sm font-semibold">{a.label}</span>
                              <ExternalLink size={12} className="ml-auto opacity-50" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Account Details</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Mail size={15} className="text-gray-400 shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400 truncate">
                              {user.primaryEmailAddress?.emailAddress}
                            </span>
                          </div>
                          {phone && (
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <Phone size={15} className="text-gray-400 shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400">{phone}</span>
                            </div>
                          )}
                          {city && (
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <MapPin size={15} className="text-gray-400 shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400">{city}</span>
                            </div>
                          )}
                          {memberSince && (
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <Calendar size={15} className="text-gray-400 shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400">Since {memberSince}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Link href="/pricing" className="block">
                        <div
                          className={`rounded-2xl p-5 text-white hover:scale-[1.02] transition-transform ${currentPlan === "max" ? "bg-gradient-to-br from-amber-400 to-orange-500" : currentPlan === "pro" ? "bg-gradient-to-br from-violet-500 to-purple-600" : "bg-gradient-to-br from-gray-700 to-gray-900"}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {currentPlan === "max" ? (
                              <Crown size={20} />
                            ) : currentPlan === "pro" ? (
                              <Sparkles size={20} />
                            ) : (
                              <Shield size={20} />
                            )}
                            <span className="font-bold">
                              {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
                            </span>
                          </div>
                          <p className="text-sm opacity-90">
                            {planActive && planExpiry
                              ? `Renews ${new Date(planExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                              : currentPlan === "free"
                                ? "Upgrade to unlock more features"
                                : "Manage your subscription"}
                          </p>
                        </div>
                      </Link>

                      {totalSaved > 0 && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Collection Summary</h3>
                          <div className="space-y-2">
                            {[
                              { l: "Vendors", v: tc.vendors, c: "bg-violet-500" },
                              { l: "Profiles", v: vpSubCounts.profiles, c: "bg-pink-500" },
                              { l: "Reels", v: tc.reels + vpSubCounts.reels, c: "bg-sky-500" },
                              { l: "Blogs", v: tc.blogs, c: "bg-amber-500" },
                            ]
                              .filter((x) => x.v > 0)
                              .map((x) => (
                                <div key={x.l} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${x.c}`} />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{x.l}</span>
                                  </div>
                                  <span className="text-sm font-bold text-gray-900 dark:text-white">{x.v}</span>
                                </div>
                              ))}
                          </div>
                          <button
                            onClick={() => handleSection("collection")}
                            className="w-full mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-violet-600 font-semibold hover:underline"
                          >
                            View Full Collection →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === "linked-profiles" && createdProfilesData.length > 0 && (
                <motion.div
                  key="lp"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Linked Profiles</h1>
                      <p className="text-gray-500 mt-1">Vendor profiles created and managed by you.</p>
                    </div>
                    <Link
                      href="/vendor/onboarding"
                      className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
                    >
                      <Store size={16} /> Create New Profile
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {createdProfilesData.map((profile) => (
                      <div
                        key={profile._id}
                        className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300"
                      >
                        {/* Embedded VProfileCard UI equivalent for direct integration */}
                        <div
                          className="h-24 rounded-xl relative mb-12"
                          style={{
                            background: profile.vendorCoverImage
                              ? `url(${profile.vendorCoverImage}) center/cover`
                              : "linear-gradient(135deg,#ede9fe,#fce7f3,#e0e7ff)",
                          }}
                        >
                          <div className="absolute inset-0 bg-black/10 rounded-xl" />
                          <div className="absolute -bottom-8 left-4 p-1 bg-white dark:bg-gray-900 rounded-2xl">
                            <SmartMedia
                              src={profile.vendorAvatar || "/placeholder.jpg"}
                              alt={profile.vendorBusinessName || profile.username}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                          </div>
                        </div>

                        <div className="px-2 flex-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                            {profile.vendorBusinessName || profile.username || "Vendor"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 mb-4">
                            {profile.category && (
                              <p className="text-xs font-semibold text-violet-600 capitalize bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded">
                                {profile.category}
                              </p>
                            )}
                            {profile.location?.city && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin size={10} /> {profile.location.city}
                              </p>
                            )}
                          </div>

                          {/* Stats Row */}
                          <div className="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl mb-6">
                            <div className="text-center">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {profile.postsCount ?? 0}
                              </p>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Posts</p>
                            </div>
                            <div className="text-center border-l border-r border-gray-200 dark:border-gray-700">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {profile.reelsCount ?? 0}
                              </p>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Reels</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                {profile.trust ?? 0}
                              </p>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Trust</p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 mt-auto px-2">
                          <button
                            onClick={() => handleSimilarprofileClick(profile)}
                            className="flex-1 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold hover:bg-violet-600 dark:hover:bg-violet-600 dark:hover:text-white transition-colors flex justify-center items-center gap-2"
                          >
                            <Eye size={16} /> View
                          </button>
                          <Link
                            href="/admin/vendors"
                            className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex justify-center items-center gap-2"
                          >
                            <SlidersHorizontal size={16} /> Dashboard
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeSection === "bookings" && (
                <motion.div
                  key="bk"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
                      <p className="text-gray-500 mt-1">
                        {orders.length} total{pendingCount > 0 ? `, ${pendingCount} pending` : ""}
                      </p>
                    </div>
                    {orders.length > 0 && (
                      <div className="flex items-center gap-3">
                        {pendingCount > 0 && (
                          <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold">
                            {pendingCount} Pending
                          </span>
                        )}
                        {confirmedCount > 0 && (
                          <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold">
                            {confirmedCount} Confirmed
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {orders.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <EmptyState
                        icon={Package}
                        title="No bookings yet"
                        description="Start exploring vendors to make your first booking"
                        action={{ label: "Browse Vendors", href: "/vendors/marketplace" }}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {orders.map((o) => (
                          <div
                            key={o._id}
                            onClick={() => setSelectedOrder(o)}
                            className="flex items-center gap-5 p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group"
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                              {/* <img
                                src={o.items?.[0]?.image || "/placeholder.jpg"}
                                alt=""
                                className="w-full h-full object-cover"
                              /> */}
                              <SmartMedia
                                src={o.items?.[0]?.image || "/placeholder.jpg"}
                                alt={"order item"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 transition-colors">
                                    {o.items?.[0]?.name || "Service"}
                                  </h3>
                                  <p className="text-sm text-gray-500 mt-0.5">{o.event?.type}</p>
                                </div>
                                <StatusBadge status={o.orderStatus} />
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5">
                                  <Calendar size={13} />
                                  {o.event?.date
                                    ? new Date(o.event.date).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : "—"}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-lg font-bold text-gray-900 dark:text-white">
                                ₹{o.pricing?.total?.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-400 mt-1 font-mono">#{o._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <ChevronRight
                              size={18}
                              className="text-gray-300 shrink-0 group-hover:text-violet-500 transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                      {totalSpent > 0 && (
                        <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Total Spent</p>
                            <p className="text-3xl font-bold text-white mt-1">₹{totalSpent.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Avg per Booking</p>
                              <p className="text-lg font-bold text-white">
                                ₹{orders.length > 0 ? Math.round(totalSpent / orders.length).toLocaleString() : 0}
                              </p>
                            </div>
                            <CreditCard size={28} className="text-gray-600" />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {activeSection === "collection" && (
                <motion.div
                  key="cl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Collection</h1>
                      <p className="text-gray-500 mt-1">{totalSaved} saved items across all categories</p>
                    </div>
                    <button
                      onClick={refreshLists}
                      disabled={refreshing}
                      className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                      {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                  </div>

                  <CollectionInsights lists={lists} />

                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                      <TabPill tabs={collTabs} active={activeCollTab} onChange={handleCollTab} />
                    </div>

                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="relative">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder={`Search in ${activeCollTab}...`}
                          value={collectionSearch}
                          onChange={(e) => setCollectionSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-white border border-transparent focus:border-violet-300 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all placeholder:text-gray-400"
                        />
                        {collectionSearch && (
                          <button
                            onClick={() => setCollectionSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      <AnimatePresence mode="wait">
                        {activeCollTab === "vendors" && (
                          <motion.div
                            key="cv"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                          >
                            {tc.vendors === 0 ? (
                              <EmptyState
                                icon={Store}
                                title="No saved vendors"
                                description="Explore and save vendors you love"
                                action={{ label: "Browse Vendors", href: "/vendors/marketplace" }}
                              />
                            ) : (
                              <>
                                <HCarousel
                                  label="Liked Vendors"
                                  icon={Heart}
                                  count={lists.vendors.liked.length}
                                  items={filterBySearch(lists.vendors.liked, ["name", "address.city", "category"])}
                                  itemClass="w-[230px]"
                                  renderItem={(v) => <VendorCard vendor={v} />}
                                  onRemove={(v) => removeFromList("vendors.liked", v)}
                                />
                                <HCarousel
                                  label="Watchlist"
                                  icon={Bookmark}
                                  count={lists.vendors.watchlist.length}
                                  items={filterBySearch(lists.vendors.watchlist, ["name", "address.city", "category"])}
                                  itemClass="w-[230px]"
                                  renderItem={(v) => <VendorCard vendor={v} />}
                                  onRemove={(v) => removeFromList("vendors.watchlist", v)}
                                />
                              </>
                            )}
                          </motion.div>
                        )}

                        {activeCollTab === "profiles" && (
                          <motion.div
                            key="cp"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                          >
                            {tc.profiles === 0 ? (
                              <EmptyState
                                icon={Users}
                                title="No saved profiles"
                                description="Discover and follow vendor profiles"
                                action={{ label: "Explore", href: "/vendors/marketplace" }}
                              />
                            ) : (
                              <>
                                <SubTabBar tabs={vpSubs} active={vpSubTab} onChange={setVpSubTab} />
                                <AnimatePresence mode="wait">
                                  {vpSubTab === "profiles" && (
                                    <motion.div
                                      key="pp"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.15 }}
                                    >
                                      <HCarousel
                                        label="Liked Profiles"
                                        icon={Heart}
                                        count={lists.vendorProfiles.liked.length}
                                        items={filterBySearch(lists.vendorProfiles.liked, [
                                          "vendorBusinessName",
                                          "username",
                                          "category",
                                        ])}
                                        itemClass="w-[210px]"
                                        renderItem={(p) => <VProfileCard profile={p} />}
                                        onRemove={(p) => removeFromList("vendorProfiles.liked", p)}
                                      />
                                      <HCarousel
                                        label="Trusted Profiles"
                                        icon={ShieldCheck}
                                        count={lists.vendorProfiles.trusted.length}
                                        items={filterBySearch(lists.vendorProfiles.trusted, [
                                          "vendorBusinessName",
                                          "username",
                                          "category",
                                        ])}
                                        itemClass="w-[210px]"
                                        renderItem={(p) => <VProfileCard profile={p} />}
                                        onRemove={(p) => removeFromList("vendorProfiles.trusted", p)}
                                      />
                                    </motion.div>
                                  )}
                                  {vpSubTab === "posts" && (
                                    <motion.div
                                      key="po"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.15 }}
                                    >
                                      <HCarousel
                                        label="Liked Posts"
                                        icon={Heart}
                                        count={lists.vendorProfiles.posts.liked.length}
                                        items={filterBySearch(lists.vendorProfiles.posts.liked, [
                                          "vendorName",
                                          "content.caption",
                                          "description",
                                        ])}
                                        itemClass="w-[200px]"
                                        renderItem={(p) => <PostCard post={p} />}
                                        onRemove={(p) => removeFromList("vendorProfiles.posts.liked", p)}
                                      />
                                      <HCarousel
                                        label="Saved Posts"
                                        icon={Bookmark}
                                        count={lists.vendorProfiles.posts.watchlist.length}
                                        items={filterBySearch(lists.vendorProfiles.posts.watchlist, [
                                          "vendorName",
                                          "content.caption",
                                          "description",
                                        ])}
                                        itemClass="w-[200px]"
                                        renderItem={(p) => <PostCard post={p} />}
                                        onRemove={(p) => removeFromList("vendorProfiles.posts.watchlist", p)}
                                      />
                                    </motion.div>
                                  )}
                                  {vpSubTab === "reels" && (
                                    <motion.div
                                      key="pr"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.15 }}
                                    >
                                      <HCarousel
                                        label="Liked Vendor Reels"
                                        icon={Heart}
                                        count={lists.reels.likedVendorProfileReels.length}
                                        items={filterBySearch(lists.reels.likedVendorProfileReels, [
                                          "title",
                                          "caption",
                                          "vendorName",
                                          "vendorBusinessName",
                                        ])}
                                        itemClass="w-[170px]"
                                        renderItem={(r) => <ReelCardVP reel={r} />}
                                        onRemove={(r) => removeFromList("reels.likedVendorProfileReels", r)}
                                      />
                                      <HCarousel
                                        label="Saved Vendor Reels"
                                        icon={Bookmark}
                                        count={lists.reels.watchlistVendorProfileReels.length}
                                        items={filterBySearch(lists.reels.watchlistVendorProfileReels, [
                                          "title",
                                          "caption",
                                          "vendorName",
                                          "vendorBusinessName",
                                        ])}
                                        itemClass="w-[170px]"
                                        renderItem={(r) => <ReelCardVP reel={r} />}
                                        onRemove={(r) => removeFromList("reels.watchlistVendorProfileReels", r)}
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </>
                            )}
                          </motion.div>
                        )}

                        {activeCollTab === "reels" && (
                          <motion.div
                            key="cr"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                          >
                            {tc.reels === 0 ? (
                              <EmptyState
                                icon={Film}
                                title="No saved reels"
                                description="Watch and save reels you enjoy"
                                action={{ label: "Explore Reels", href: "/ideas" }}
                              />
                            ) : (
                              <>
                                <HCarousel
                                  label="Liked Reels"
                                  icon={Heart}
                                  count={lists.reels.liked.length}
                                  items={filterBySearch(lists.reels.liked, [
                                    "title",
                                    "caption",
                                    "vendorName",
                                    "category",
                                  ])}
                                  itemClass="w-[170px]"
                                  renderItem={(r) => <ReelCard reel={r} />}
                                  onRemove={(r) => removeFromList("reels.liked", r)}
                                />
                                <HCarousel
                                  label="Watchlist"
                                  icon={Bookmark}
                                  count={lists.reels.watchlist.length}
                                  items={filterBySearch(lists.reels.watchlist, [
                                    "title",
                                    "caption",
                                    "vendorName",
                                    "category",
                                  ])}
                                  itemClass="w-[170px]"
                                  renderItem={(r) => <ReelCard reel={r} />}
                                  onRemove={(r) => removeFromList("reels.watchlist", r)}
                                />
                              </>
                            )}
                          </motion.div>
                        )}

                        {activeCollTab === "blogs" && (
                          <motion.div
                            key="cb"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                          >
                            {tc.blogs === 0 ? (
                              <EmptyState
                                icon={BookOpen}
                                title="No saved blogs"
                                description="Read and save blogs for later"
                                action={{ label: "Read Blogs", href: "/about/blogs" }}
                              />
                            ) : (
                              <>
                                <HCarousel
                                  label="Liked Blogs"
                                  icon={Heart}
                                  count={lists.blogs.liked.length}
                                  items={filterBySearch(lists.blogs.liked, ["title", "category", "authorName"])}
                                  itemClass="w-[260px]"
                                  renderItem={(b) => <BlogCard blog={b} />}
                                  onRemove={(b) => removeFromList("blogs.liked", b)}
                                />
                                <HCarousel
                                  label="Saved Blogs"
                                  icon={Bookmark}
                                  count={lists.blogs.watchlist.length}
                                  items={filterBySearch(lists.blogs.watchlist, ["title", "category", "authorName"])}
                                  itemClass="w-[260px]"
                                  renderItem={(b) => <BlogCard blog={b} />}
                                  onRemove={(b) => removeFromList("blogs.watchlist", b)}
                                />
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === "wallet" && (
                <motion.div
                  key="wl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wallet & Credits</h1>
                    <p className="text-gray-500 mt-1">Manage your credits and view transactions</p>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-[60px]" />
                      <div className="relative z-10">
                        <p className="text-sm opacity-80 mb-2 font-medium">Available Balance</p>
                        <p className="text-5xl font-bold">{dbUser?.creditBalance ?? 0}</p>
                        <p className="text-sm opacity-80 mt-1">PlanWAB Credits</p>
                        <div className="flex gap-3 mt-6">
                          <Link
                            href="/pricing"
                            className="px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors border border-white/10"
                          >
                            Get More Credits
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Account Stats</h3>
                      <div className="space-y-3">
                        {[
                          ["Plan", currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)],
                          ["Bookings", orders.length],
                          ["Saved Items", totalSaved],
                          ["Total Spent", `₹${totalSpent.toLocaleString()}`],
                        ].map(([l, v]) => (
                          <div key={l} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{l}</span>
                            <span className="font-bold text-gray-900 dark:text-white">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Transaction History</h3>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Coins size={24} className="text-gray-300 dark:text-gray-600" />
                      </div>
                      <p className="text-gray-500 text-sm">No transactions yet</p>
                      <p className="text-gray-400 text-xs mt-1">Credits earned and spent will appear here</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === "settings" && (
                <motion.div
                  key="st"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your personal information and preferences</p>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <InputField
                            label="First Name"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          />
                          <InputField
                            label="Last Name"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          />
                          <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                              Email
                            </label>
                            <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl text-gray-500 flex items-center gap-2 text-sm">
                              <Mail size={16} />
                              {user.primaryEmailAddress?.emailAddress}
                            </div>
                          </div>
                          <InputField
                            label="Phone"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            placeholder="+91 00000 00000"
                          />
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Address</h3>
                        <div className="space-y-4">
                          <InputField
                            label="Street Address"
                            value={editForm.address}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            placeholder="Enter your address"
                          />
                          <div className="grid grid-cols-3 gap-4">
                            <InputField
                              label="City"
                              value={editForm.city}
                              onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                            />
                            <InputField
                              label="State"
                              value={editForm.state}
                              onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                            />
                            <InputField
                              label="Pincode"
                              value={editForm.pincode}
                              onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-violet-600 dark:hover:bg-violet-600 dark:hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg"
                      >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col items-center">
                        {/* <img
                            src={user.imageUrl}
                            alt={displayName}
                            className="w-24 h-24 rounded-2xl object-cover mb-4 ring-4 ring-gray-100 dark:ring-gray-800"
                          /> */}
                        <SmartMedia
                          src={user.imageUrl}
                          alt={displayName}
                          className="w-24 h-24 rounded-2xl object-cover mb-4 ring-4 ring-gray-100 dark:ring-gray-800"
                        />
                        <p className="font-semibold text-gray-900 dark:text-white">{displayName}</p>
                        <p className="text-sm text-gray-500 text-center mt-1">Manage your photo in Clerk settings</p>
                      </div>
                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Verification Status</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                            <CheckCircle2 size={18} className="text-emerald-500" />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Phone</span>
                            {phone ? (
                              <CheckCircle2 size={18} className="text-emerald-500" />
                            ) : (
                              <AlertCircle size={18} className="text-amber-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30 p-6">
                        <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                        <p className="text-sm text-red-500/80 dark:text-red-400/60 mb-4">
                          Account deletion is permanent and cannot be undone.
                        </p>
                        <button className="w-full py-2.5 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {editOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl z-50 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                <button
                  onClick={() => setEditOpen(false)}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  />
                  <InputField
                    label="Last Name"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  />
                </div>
                <InputField
                  label="Phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+91 00000 00000"
                />
                <InputField
                  label="Address"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                />
                <div className="grid grid-cols-3 gap-4">
                  <InputField
                    label="City"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  />
                  <InputField
                    label="State"
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                  />
                  <InputField
                    label="Pincode"
                    value={editForm.pincode}
                    onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white dark:bg-gray-900 z-50 overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Details</h2>
                  <p className="text-sm text-gray-500 font-mono mt-0.5">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Status</p>
                    <div className="mt-1">
                      <StatusBadge status={selectedOrder.orderStatus} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Payment</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                      {selectedOrder.paymentMethod || "—"}
                    </p>
                  </div>
                </div>

                {selectedOrder.event && (
                  <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      Event Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        ["Name", selectedOrder.event.name],
                        ["Type", selectedOrder.event.type],
                        [
                          "Date",
                          selectedOrder.event.date
                            ? new Date(selectedOrder.event.date).toLocaleDateString("en-IN", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "—",
                        ],
                        ["Guests", selectedOrder.event.guests?.toLocaleString() || "—"],
                      ].map(([l, v]) => (
                        <div key={l}>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">{l}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{v || "—"}</p>
                        </div>
                      ))}
                      {selectedOrder.event.specialRequests && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Special Requests</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                            {selectedOrder.event.specialRequests}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedOrder.items?.length > 0 && (
                  <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Services</h3>
                    {selectedOrder.items.map((it, i) => (
                      <div key={i} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-2 last:mb-0">
                        {it.image && (
                          <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                            <SmartMedia src={it.image} alt={it.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white">{it.name}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                            ₹{it.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedOrder.pricing && (
                  <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-5 text-white">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <CreditCard size={16} />
                      Payment Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      {[
                        ["Subtotal", selectedOrder.pricing.subtotal],
                        ["Tax", selectedOrder.pricing.tax],
                        ["Platform Fee", selectedOrder.pricing.platformFee],
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between">
                          <span className="text-gray-400">{l}</span>
                          <span>₹{(v || 0).toLocaleString()}</span>
                        </div>
                      ))}
                      {selectedOrder.pricing.discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Discount</span>
                          <span className="text-emerald-400">-₹{selectedOrder.pricing.discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-700 pt-3 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{(selectedOrder.pricing.total || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    Timeline
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.createdAt && (
                      <div className="flex items-center gap-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Order Created</p>
                          <p className="text-xs text-gray-500">
                            {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.updatedAt && selectedOrder.updatedAt !== selectedOrder.createdAt && (
                      <div className="flex items-center gap-4 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl">
                        <RefreshCw size={18} className="text-sky-500 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                          <p className="text-xs text-gray-500">
                            {new Date(selectedOrder.updatedAt).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-violet-600 dark:hover:bg-violet-600 dark:hover:text-white transition-colors">
                  <MessageSquare size={18} /> Contact Support
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
