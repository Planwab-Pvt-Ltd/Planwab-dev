"use client";

import React, { useState, useEffect, memo, useCallback, useRef, useMemo } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Video,
  MapPin,
  SlidersHorizontal,
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
  Eye,
  RefreshCw,
  Search,
  BookOpen,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { useNavbarVisibilityStore } from "../../../GlobalState/navbarVisibilityStore";
import { useVideoThumbnail } from "../../../lib/video-thumbnail";
import SmartMedia from "../SmartMediaLoader";

const SHIMMER_CSS = `@keyframes profileShimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`;

const Shimmer = memo(({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200/50 dark:bg-gray-800 ${className}`}>
    <div
      className="absolute inset-0 -translate-x-full"
      style={{
        background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.5) 50%,transparent 100%)",
        animation: "profileShimmer 1.4s ease-in-out infinite",
      }}
    />
  </div>
));
Shimmer.displayName = "Shimmer";

const StatusBadge = memo(({ status }) => {
  const m = {
    CONFIRMED: { cls: "bg-emerald-50 text-emerald-600 border-emerald-200", I: CheckCircle2 },
    PENDING: { cls: "bg-amber-50 text-amber-600 border-amber-200", I: Clock },
    COMPLETED: { cls: "bg-sky-50 text-sky-600 border-sky-200", I: Check },
    CANCELLED: { cls: "bg-red-50 text-red-500 border-red-200", I: X },
  };
  const cfg = m[status] || { cls: "bg-gray-50 text-gray-500 border-gray-200", I: Clock };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide rounded-full border shrink-0 ${cfg.cls}`}
    >
      <cfg.I size={8} />
      {status}
    </span>
  );
});
StatusBadge.displayName = "StatusBadge";

const PlanBadge = memo(({ plan }) => {
  const m = {
    free: { l: "Free", c: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400", I: null },
    pro: { l: "Pro", c: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400", I: Sparkles },
    max: { l: "Max", c: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", I: Crown },
  };
  const p = m[plan] || m.free;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${p.c}`}
    >
      {p.I && <p.I size={10} />}
      {p.l}
    </span>
  );
});
PlanBadge.displayName = "PlanBadge";

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

const VendorCard = memo(({ vendor }) => {
  const img = vendor.defaultImage || vendor.images?.[0] || "/placeholder.jpg";
  const city = vendor.address?.city || "";
  const cat = vendor.category || "";
  const reviewCount = vendor.reviews || vendor.reviewCount || 0;
  const yrs = vendor.yearsExperience || 0;
  return (
    <Link
      href={`/vendor/${cat || "general"}/${vendor._id}`}
      className="min-w-[160px] w-[160px] shrink-0 snap-start block"
    >
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden h-full shadow-sm shadow-black/[0.03]"
      >
        <div className="h-[100px] bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
          {/* <img src={img} alt={vendor.name} className="w-full h-full object-cover" loading="lazy" /> */}
          <SmartMedia src={img} alt={vendor.name} width={160} height={100} className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            {vendor.isVerified && (
              <span className="flex items-center gap-0.5 text-[8px] bg-emerald-500/90 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-full font-bold">
                <ShieldCheck size={7} /> Verified
              </span>
            )}
            {vendor.isFeatured && !vendor.isVerified && (
              <span className="text-[8px] bg-amber-500/90 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-full font-bold">
                Featured
              </span>
            )}
            {vendor.rating > 0 && (
              <div className="bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-0.5 shadow-sm ml-auto">
                <Star size={8} className="fill-amber-400 text-amber-400" />
                {vendor.rating}
              </div>
            )}
          </div>
          {cat && (
            <span className="absolute bottom-2 left-2 text-[8px] bg-black/40 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-full font-medium capitalize">
              {cat}
            </span>
          )}
        </div>
        <div className="p-2.5">
          <p className="font-semibold text-[11px] text-gray-900 dark:text-white truncate">{vendor.name}</p>
          {city && (
            <p className="text-[9px] text-gray-400 truncate flex items-center gap-0.5 mt-0.5">
              <MapPin size={8} />
              {city}
            </p>
          )}
          <div className="flex items-center justify-between mt-1.5">
            {vendor.perDayPrice?.min ? (
              <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400">
                ₹{vendor.perDayPrice.min.toLocaleString("en-IN")}
              </p>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-1.5 text-[8px] text-gray-300">
              {reviewCount > 0 && <span>{reviewCount}r</span>}
              {yrs > 0 && <span>{yrs}y</span>}
            </div>
          </div>
        </div>
      </motion.div>
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
    <Link
      href={`/ideas?type=${reel.type}&reel=${reel._id}`}
      className="min-w-[130px] w-[130px] shrink-0 snap-start block"
    >
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="rounded-2xl overflow-hidden bg-gray-900 relative h-full shadow-md"
      >
        <div className="aspect-[9/16] relative">
          {/* <img src={thumb} alt={title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" /> */}
          <SmartMedia
            src={thumb}
            alt={title}
            width={130}
            height={220}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/25" />
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            {category && (
              <span className="text-[7px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-semibold capitalize border border-white/10">
                {category}
              </span>
            )}
            {duration && (
              <span className="text-[7px] bg-black/40 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-medium ml-auto border border-white/10">
                {duration}
              </span>
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
              <Play size={14} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            {title && (
              <p className="text-[10px] text-white font-semibold line-clamp-2 leading-tight mb-0.5 drop-shadow-lg">
                {title}
              </p>
            )}
            {vendor && <p className="text-[8px] text-white/60 truncate">{vendor}</p>}
            {hashtags.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {hashtags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="text-[7px] text-white/40 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2.5 mt-1.5 pt-1.5 border-t border-white/10">
              {views > 0 && (
                <span className="flex items-center gap-1 text-[8px] text-white/70 font-medium">
                  <Eye size={8} />
                  {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
                </span>
              )}
              {likes > 0 && (
                <span className="flex items-center gap-1 text-[8px] text-white/70 font-medium">
                  <Heart size={8} fill="currentColor" />
                  {likes}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
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
    <Link href={url} className="min-w-[130px] w-[130px] shrink-0 snap-start block">
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="rounded-2xl overflow-hidden bg-gray-900 relative h-full shadow-md"
      >
        <div className="aspect-[9/16] relative">
          {/* <img src={thumb} alt={title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" /> */}
          <SmartMedia
            src={thumb}
            alt={title}
            width={130}
            height={220}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/25" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
              <Play size={14} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            {avatar && vendor && (
              <div className="flex items-center gap-1.5 mb-1">
                {/* <img src={avatar} alt="" className="w-4 h-4 rounded-full object-cover border border-white/30" /> */}
                <SmartMedia
                  src={avatar}
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4 rounded-full object-cover border border-white/30"
                />
                <span className="text-[8px] text-white/70 font-medium truncate">{vendor}</span>
              </div>
            )}
            {!avatar && vendor && <p className="text-[8px] text-white/60 truncate mb-0.5">{vendor}</p>}
            {title && (
              <p className="text-[10px] text-white font-semibold line-clamp-2 leading-tight drop-shadow-lg">{title}</p>
            )}
            <div className="flex items-center gap-2.5 mt-1.5 pt-1.5 border-t border-white/10">
              {views > 0 && (
                <span className="flex items-center gap-1 text-[8px] text-white/70 font-medium">
                  <Eye size={8} />
                  {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
                </span>
              )}
              {likes > 0 && (
                <span className="flex items-center gap-1 text-[8px] text-white/70 font-medium">
                  <Heart size={8} fill="currentColor" />
                  {likes}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
});
ReelCardVP.displayName = "ReelCardVP";

const VProfileCard = memo(({ profile }) => {
  const name = profile.vendorBusinessName || profile.username || "Vendor";
  const img = profile.vendorAvatar;
  const cat = profile.category || "";
  const coverImg = profile.vendorCoverImage;
  const city = profile.location?.city || "";
  const postsCount = profile.postsCount ?? 0;
  const reelsCount = profile.reelsCount ?? 0;
  const url = profile.vendorId
    ? `/vendor/${cat}/${profile.vendorId}/profile`
    : `/vendor/${cat}/profile/${profile.username}`;
  return (
    <Link href={url} className="min-w-[152px] w-[152px] shrink-0 snap-start block">
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden h-full shadow-sm shadow-black/[0.03]"
      >
        <div
          className="h-14 relative"
          style={{
            background: coverImg ? `url(${coverImg}) center/cover` : "linear-gradient(135deg,#ede9fe,#fce7f3,#e0e7ff)",
          }}
        >
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="px-3 pb-3 -mt-5 relative">
          {/* <img
              src={img}
              alt={name}
              className="w-11 h-11 rounded-xl border-[2.5px] border-white dark:border-gray-900 object-cover shadow-md"
              loading="lazy"
            /> */}
          <SmartMedia
            src={img}
            alt={name}
            width={44}
            height={44}
            className="w-11 h-11 rounded-xl border-[2.5px] border-white dark:border-gray-900 object-cover shadow-md"
          />
          <p className="font-bold text-[11px] text-gray-900 dark:text-white truncate mt-1.5">{name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            {cat && <p className="text-[9px] text-gray-400 capitalize">{cat}</p>}
            {city && <p className="text-[9px] text-gray-300">· {city}</p>}
          </div>
          {((profile.trust ?? 0) > 0 || postsCount > 0 || reelsCount > 0) && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              {(profile.trust ?? 0) > 0 && (
                <div className="text-center">
                  <p className="text-[9px] font-bold text-emerald-600">{profile.trust}</p>
                  <p className="text-[7px] text-gray-300">Trust</p>
                </div>
              )}
              {postsCount > 0 && (
                <div className="text-center">
                  <p className="text-[9px] font-bold text-gray-600 dark:text-gray-400">{postsCount}</p>
                  <p className="text-[7px] text-gray-300">Posts</p>
                </div>
              )}
              {reelsCount > 0 && (
                <div className="text-center">
                  <p className="text-[9px] font-bold text-gray-600 dark:text-gray-400">{reelsCount}</p>
                  <p className="text-[7px] text-gray-300">Reels</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
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
    <Link href={url} className="min-w-[145px] w-[145px] shrink-0 snap-start block">
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden h-full shadow-sm shadow-black/[0.03]"
      >
        <div className="aspect-square bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
          {/* <img src={thumb || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" loading="lazy" /> */}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                  <Play size={10} className="text-white ml-0.5" fill="white" />
                </div>
              </div>
            </>
          )}
          <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
            {likes > 0 && (
              <span className="flex items-center gap-0.5 text-[8px] text-white font-semibold drop-shadow">
                <Heart size={7} fill="white" />
                {likes}
              </span>
            )}
            <span className="text-[7px] bg-black/40 backdrop-blur text-white px-1.5 py-0.5 rounded-md font-semibold ml-auto">
              {isVideo ? "Video" : "Photo"}
            </span>
          </div>
        </div>
        <div className="p-2.5">
          {(avatar || vendor) && (
            <div className="flex items-center gap-1.5 mb-1">
              {avatar && <SmartMedia src={avatar} alt={vendor} className="w-4 h-4 rounded-full object-cover" />}
              {vendor && <p className="text-[8px] text-gray-400 truncate font-medium">{vendor}</p>}
            </div>
          )}
          {caption && (
            <p className="text-[10px] text-gray-700 dark:text-gray-200 line-clamp-1 font-medium">{caption}</p>
          )}
          {location && (
            <p className="text-[8px] text-gray-300 flex items-center gap-0.5 mt-0.5">
              <MapPin size={7} />
              {location}
            </p>
          )}
        </div>
      </motion.div>
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
    <Link href={`/blog/${blog.slug || blog._id}`} className="min-w-[200px] w-[200px] shrink-0 snap-start block">
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden h-full shadow-sm shadow-black/[0.03]"
      >
        <div className="h-[100px] bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
          {/* <img src={img} alt={blog.title} className="w-full h-full object-cover" loading="lazy" /> */}
          <SmartMedia src={img} alt={blog.title} className="w-full h-full object-cover" loading="lazy" />
          {blog.category && (
            <span className="absolute top-2 left-2 text-[7px] bg-violet-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-bold">
              {blog.category}
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-bold text-[11px] text-gray-900 dark:text-white line-clamp-2 leading-snug">
            {blog.title}
          </h3>
          {excerpt && <p className="text-[9px] text-gray-400 line-clamp-1 mt-1">{excerpt}</p>}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              {authorPhoto && (
                <SmartMedia src={authorPhoto} alt={authorName} className="w-4 h-4 rounded-full object-cover" />
              )}
              <div>
                {authorName && <p className="text-[8px] text-gray-500 font-medium">{authorName}</p>}
                {blog.readTime && <p className="text-[7px] text-gray-300">{blog.readTime}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[8px] text-gray-300">
              {views > 0 && (
                <span className="flex items-center gap-0.5">
                  <Eye size={7} />
                  {views}
                </span>
              )}
              {likes > 0 && (
                <span className="flex items-center gap-0.5">
                  <Heart size={7} />
                  {likes}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
});
BlogCard.displayName = "BlogCard";

const ScrollCarousel = memo(({ children, className = "" }) => {
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
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-white dark:bg-gray-800 rounded-full shadow-lg shadow-black/10 flex items-center justify-center border border-gray-100 dark:border-gray-700 active:scale-90 transition-transform"
          >
            <ChevronLeft size={13} className="text-gray-600 dark:text-gray-300" />
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
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-white dark:bg-gray-800 rounded-full shadow-lg shadow-black/10 flex items-center justify-center border border-gray-100 dark:border-gray-700 active:scale-90 transition-transform"
          >
            <ChevronRight size={13} className="text-gray-600 dark:text-gray-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});
ScrollCarousel.displayName = "ScrollCarousel";

const HList = memo(({ label, icon: Icon, items, renderItem, onRemove }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 px-5 mb-2.5">
        <div className="w-5 h-5 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Icon size={11} className="text-gray-400" />
        </div>
        <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400">{label}</span>
        <span className="ml-auto text-[9px] font-bold text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      <ScrollCarousel>
        {items.map((item, i) => {
          const id = item?._id || item?.reelId || item?.postId || `${label}-${i}`;
          return (
            <div key={id} className="relative">
              {onRemove && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove(item);
                  }}
                  className="absolute top-1.5 right-1.5 z-30 w-5 h-5 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-red-500 transition-colors"
                >
                  <X size={8} className="text-white" strokeWidth={3} />
                </button>
              )}
              {renderItem(item, i)}
            </div>
          );
        })}
      </ScrollCarousel>
    </div>
  );
});
HList.displayName = "HList";

const TabEmpty = memo(({ icon: Icon, text, href = "/m" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    className="mx-5 py-12 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center"
  >
    <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
      <Icon size={22} className="text-gray-200 dark:text-gray-600" />
    </div>
    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium text-center max-w-[220px] leading-relaxed">
      {text}
    </p>
    <Link href={href} className="mt-4 text-[11px] text-violet-600 font-semibold flex items-center gap-1">
      Explore <ChevronRight size={12} />
    </Link>
  </motion.div>
));
TabEmpty.displayName = "TabEmpty";

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
      value: totalLiked,
      label: "Liked",
      bg: "bg-pink-50 dark:bg-pink-900/20",
      border: "border-pink-100 dark:border-pink-900/30",
      ic: "text-pink-500",
      vc: "text-pink-700 dark:text-pink-400",
    },
    {
      icon: Bookmark,
      value: totalSaved,
      label: "Saved",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-100 dark:border-blue-900/30",
      ic: "text-blue-500",
      vc: "text-blue-700 dark:text-blue-400",
    },
    {
      icon: ShieldCheck,
      value: totalTrusted,
      label: "Trusted",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-100 dark:border-emerald-900/30",
      ic: "text-emerald-500",
      vc: "text-emerald-700 dark:text-emerald-400",
    },
    {
      icon: Film,
      value: totalReels,
      label: "Reels",
      bg: "bg-violet-50 dark:bg-violet-900/20",
      border: "border-violet-100 dark:border-violet-900/30",
      ic: "text-violet-500",
      vc: "text-violet-700 dark:text-violet-400",
    },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 px-5 mb-4">
      {stats.map((s) => (
        <div key={s.label} className={`${s.bg} rounded-xl p-2.5 border ${s.border}`}>
          <s.icon size={11} className={s.ic} />
          <p className={`text-[14px] font-bold mt-1 ${s.vc}`}>{s.value}</p>
          <p className="text-[7px] text-gray-400 font-semibold uppercase tracking-wider">{s.label}</p>
        </div>
      ))}
    </div>
  );
});
CollectionInsights.displayName = "CollectionInsights";

const SubTabBar = memo(({ tabs, active, onChange }) => (
  <div className="flex gap-1.5 px-5 mb-4">
    {tabs.map((t) => {
      const isA = active === t.id;
      return (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-3.5 py-2 rounded-full text-[10px] font-bold transition-all duration-200 ${isA ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}
        >
          {t.label}
          {t.count > 0 && (
            <span className={`ml-1 ${isA ? "text-white/50 dark:text-gray-500" : "text-gray-300"}`}>{t.count}</span>
          )}
        </button>
      );
    })}
  </div>
));
SubTabBar.displayName = "SubTabBar";

const FullPageSkeleton = () => (
  <div className="min-h-screen bg-[#f8f8fa] dark:bg-black">
    <style dangerouslySetInnerHTML={{ __html: SHIMMER_CSS }} />
    <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-6">
      <div className="flex items-center justify-between mb-5">
        <Shimmer className="h-3 w-12 rounded-md" />
        <Shimmer className="h-8 w-8 rounded-lg" />
      </div>
      <div className="flex items-center gap-3.5">
        <Shimmer className="w-14 h-14 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Shimmer className="h-4 w-28 rounded-md" />
            <Shimmer className="h-4 w-10 rounded-full" />
          </div>
          <Shimmer className="h-3 w-44 rounded-md" />
          <Shimmer className="h-2.5 w-24 rounded-md" />
        </div>
      </div>
    </div>
    <div className="px-5 -mt-3 relative z-10 space-y-2.5">
      <Shimmer className="h-[60px] rounded-2xl" />
      <Shimmer className="h-[68px] rounded-2xl" />
    </div>
    <div className="px-5 mt-6 space-y-2.5">
      <Shimmer className="h-4 w-20 rounded-md" />
      {[1, 2].map((i) => (
        <Shimmer key={i} className="h-[88px] rounded-2xl" />
      ))}
    </div>
    <div className="px-5 mt-6 space-y-3">
      <Shimmer className="h-4 w-28 rounded-md" />
      <Shimmer className="h-10 rounded-xl" />
      <div className="flex gap-2.5 overflow-hidden pt-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[156px] shrink-0">
            <Shimmer className="h-24 rounded-t-2xl" />
            <div className="bg-white dark:bg-gray-900 rounded-b-2xl border border-t-0 border-gray-100 dark:border-gray-800 p-3 space-y-2">
              <Shimmer className="h-3 w-24 rounded-md" />
              <Shimmer className="h-2.5 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const COLLECTION_TABS = [
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

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function UserProfilePageWrapper() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { setIsNavbarVisible } = useNavbarVisibilityStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const fullAuthRedirectUrl = `${pathname}?${searchParams.toString()}`;

  const [dbUser, setDbUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [orders, setOrders] = useState([]);
  const [lists, setLists] = useState(EMPTY_LISTS);

  const [createdProfilesData, setCreatedProfilesData] = useState([]);
  const [fetchingProfiles, setFetchingProfiles] = useState(true);

  const [scheduledMeets, setScheduledMeets] = useState([]);
  const [fetchingMeets, setFetchingMeets] = useState(true);
  const [cancellingMeetId, setCancellingMeetId] = useState(null);

  const [vpSubTab, setVpSubTab] = useState(() => searchParams.get("sub") || "profiles");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const [isLinkedProfilesExpanded, setIsLinkedProfilesExpanded] = useState(false);
  const [isScheduledMeetsExpanded, setIsScheduledMeetsExpanded] = useState(false);

  const [activeTab, setActiveTab] = useState(() => {
    const t = searchParams.get("tab");
    return t && COLLECTION_TABS.some((x) => x.id === t) ? t : "vendors";
  });
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

  const fetchScheduledMeets = useCallback(async (userId) => {
    setFetchingMeets(true);
    try {
      const res = await fetch(`/api/user/schedule-meet?userId=${userId}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success) {
        setScheduledMeets(json.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch meets", e);
    } finally {
      setFetchingMeets(false);
    }
  }, []);

  const handleCancelMeet = async (meetId, e) => {
    e.stopPropagation();
    setCancellingMeetId(meetId);
    try {
      const res = await fetch("/api/user/schedule-meet?userId=" + user.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetId, status: "cancelled" }),
      });
      const data = await res.json();
      if (data.success) {
        setScheduledMeets((prev) => prev.filter((m) => m._id !== meetId));
        showToast("Meeting cancelled successfully");
      } else {
        showToast(data.error || "Failed to cancel", "error");
      }
    } catch (err) {
      showToast("Network error", "error");
    } finally {
      setCancellingMeetId(null);
    }
  };

  const handleSimilarprofileClick = (profile) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const backTo = encodeURIComponent(
      `${baseUrl}?section=linked-profiles&tab=profiles`
    );
    if (profile?.vendorId) {
      router.push(`/vendor/${profile.category}/${profile.vendorId}/profile?backTo=${backTo}`);
    } else {
      router.push(`/vendor/${profile.category}/profile/${profile.username}?backTo=${backTo}`);
    }
  };

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t && COLLECTION_TABS.some((x) => x.id === t) && t !== activeTab) setActiveTab(t);
  }, [searchParams]);

  const handleTabChange = useCallback(
    (tabId) => {
      setActiveTab(tabId);
      setVpSubTab("profiles");
      setCollectionSearch("");
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tabId);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const handleSubTabChange = useCallback(
    (subId) => {
      setVpSubTab(subId);
      const params = new URLSearchParams(searchParams.toString());
      params.set("sub", subId);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const showToast = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
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
      await Promise.all([fetchAllData(user.id), fetchLinkedProfiles(user.id), fetchScheduledMeets(user.id)]);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, fetchAllData]);

  // --- SCROLL, AUTO-EXPAND, AND TAB SYNC ---
  useEffect(() => {
    if (loading || fetchingProfiles || fetchingMeets) return;

    const section = searchParams.get("section");
    const tab = searchParams.get("tab");
    const sub = searchParams.get("sub");

    // 1. Handle Tab & SubTab Syncing
    if (tab && COLLECTION_TABS.some((x) => x.id === tab)) {
      setActiveTab(tab);
      if (sub) setVpSubTab(sub);

      // If no specific section is targeted, but a tab is, scroll to collections
      if (!section) {
        setTimeout(() => {
          const el = document.getElementById("collections-section");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 400);
      }
    }

    // 2. Handle Section Scrolling and Auto-Expanding
    if (section) {
      if (section === "linked-profiles") setIsLinkedProfilesExpanded(true);
      if (section === "scheduled-meets") setIsScheduledMeetsExpanded(true);

      setTimeout(() => {
        const el = document.getElementById(`${section}-section`);
        if (el) {
          // Adjust scroll position slightly to account for fixed headers if necessary
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 500); // 500ms delay ensures DOM paints and animations finish before scrolling
    }
  }, [searchParams, loading, fetchingProfiles, fetchingMeets]);

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
        closeEdit();
        showToast("Profile updated");
      } else showToast(d.error || "Update failed", "error");
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const openOrder = useCallback(
    (o) => {
      setSelectedOrder(o);
      setIsNavbarVisible(false);
    },
    [setIsNavbarVisible],
  );
  const closeOrder = useCallback(() => {
    setSelectedOrder(null);
    setIsNavbarVisible(true);
  }, [setIsNavbarVisible]);
  const openEdit = useCallback(() => {
    setEditOpen(true);
    setIsNavbarVisible(false);
  }, [setIsNavbarVisible]);
  const closeEdit = useCallback(() => {
    setEditOpen(false);
    setIsNavbarVisible(true);
  }, [setIsNavbarVisible]);

  const tabCounts = useMemo(
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
      <main className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-8 text-center">
        <style dangerouslySetInnerHTML={{ __html: SHIMMER_CSS }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-6 shadow-sm mx-auto">
            <Image src="/planwablogo.png" alt="PlanWAB" width={36} height={36} className="object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to PlanWAB</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-[280px] leading-relaxed mx-auto">
            Sign in to manage bookings, save vendors, and plan your events.
          </p>
          <div className="w-full max-w-xs space-y-3 mx-auto">
            <Link
              href={`/sign-in?redirect_url=${encodeURIComponent(fullAuthRedirectUrl)}`}
              className="block w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-semibold text-center text-[15px] active:scale-[0.98] transition-transform"
            >
              Sign In
            </Link>
            <Link
              href={`/sign-up?redirect_url=${encodeURIComponent(fullAuthRedirectUrl)}`}
              className="block w-full py-3.5 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl font-medium text-center text-[15px] active:scale-[0.98] transition-transform"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </main>
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
  const totalSaved = tabCounts.vendors + tabCounts.profiles + tabCounts.reels + tabCounts.blogs;
  const memberSince = dbUser?.createdAt
    ? new Date(dbUser.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : null;
  const collTabs = COLLECTION_TABS.map((t) => ({ ...t, count: tabCounts[t.id] }));
  const vpSubs = VP_SUB_TABS_DEF.map((t) => ({ ...t, count: vpSubCounts[t.id] }));

  return (
    <div className="min-h-screen bg-[#f8f8fa] dark:bg-black pb-20">
      <style dangerouslySetInnerHTML={{ __html: SHIMMER_CSS }} />

      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ y: -60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed top-4 left-4 right-4 z-[200] px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-white text-[13px] font-medium backdrop-blur-sm ${toast.type === "error" ? "bg-red-500/95" : "bg-emerald-500/95"}`}
          >
            {toast.type === "error" ? <AlertCircle size={14} /> : <Check size={14} />}
            <span className="flex-1">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-white dark:bg-gray-900 px-5 pt-5 pb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-[15px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-[0.15em]">Profile</p>
          <button
            onClick={openEdit}
            className="p-2 -mr-2 rounded-xl active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
          >
            <Edit3 size={15} className="text-gray-400" />
          </button>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            {/* <img
              src={user.imageUrl}
              alt={displayName}
              className="w-[58px] h-[58px] rounded-full object-cover ring-[3px] ring-gray-100 dark:ring-gray-800"
            /> */}
            <SmartMedia
              src={user.imageUrl}
              alt={displayName}
              className="w-[58px] h-[58px] rounded-full object-cover ring-[3px] ring-gray-100 dark:ring-gray-800"
            />
            {currentPlan !== "free" && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                {currentPlan === "max" ? (
                  <Crown size={9} className="text-amber-300" />
                ) : (
                  <Sparkles size={9} className="text-white" />
                )}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-[16px] font-bold text-gray-900 dark:text-white truncate">{displayName}</h1>
              <PlanBadge plan={currentPlan} />
            </div>
            <p className="text-[12px] text-gray-400 truncate">{user.primaryEmailAddress?.emailAddress}</p>
            <div className="flex items-center gap-2.5 mt-1 flex-wrap">
              {phone && (
                <span className="text-[10px] text-gray-300 dark:text-gray-600 flex items-center gap-1">
                  <Phone size={9} />
                  {phone}
                </span>
              )}
              {city && (
                <span className="text-[10px] text-gray-300 dark:text-gray-600 flex items-center gap-1">
                  <MapPin size={9} />
                  {city}
                </span>
              )}
              {memberSince && (
                <span className="text-[10px] text-gray-300 dark:text-gray-600 flex items-center gap-1">
                  <Calendar size={9} />
                  Since {memberSince}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
          {createdProfilesData.length > 0 && (
            <button
              onClick={() => {
                if (createdProfilesData.length === 1) {
                  handleSimilarprofileClick(createdProfilesData[0]);
                } else {
                  const el = document.getElementById("linked-profiles-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                  setIsScheduledMeetsExpanded(true);
                }
              }}
              className="flex-1 py-2.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
            >
              <Store size={14} /> Open Profile
            </button>
          )}
          <Link
            href="/vendor/onboarding"
            className="flex-1 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform shadow-sm"
          >
            <Store size={14} /> Create Profile
          </Link>
        </div>
      </motion.div>

      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="px-5 -mt-3 relative z-10 space-y-2.5"
      >
        <Link href="/pricing">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-3.5 flex items-center gap-3 shadow-sm shadow-gray-100/50 dark:shadow-none"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${currentPlan === "max" ? "bg-amber-50 dark:bg-amber-900/20" : currentPlan === "pro" ? "bg-violet-50 dark:bg-violet-900/20" : "bg-gray-50 dark:bg-gray-800"}`}
            >
              {currentPlan === "max" ? (
                <Crown size={18} className="text-amber-500" />
              ) : currentPlan === "pro" ? (
                <Sparkles size={18} className="text-violet-600" />
              ) : (
                <Shield size={18} className="text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-gray-900 dark:text-white">
                {currentPlan === "free"
                  ? "Free Plan"
                  : `${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan`}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {planActive && planExpiry
                  ? `Renews ${new Date(planExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                  : "Upgrade for more features"}
              </p>
            </div>
            <ChevronRight size={14} className="text-gray-200 shrink-0" />
          </motion.div>
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-3.5 grid grid-cols-4 divide-x divide-gray-100 dark:divide-gray-800 shadow-sm shadow-gray-100/50 dark:shadow-none">
          {[
            { v: dbUser?.creditBalance ?? 0, l: "Credits", icon: Coins, color: "text-amber-500" },
            { v: orders.length, l: "Bookings", icon: Package, color: "text-violet-500" },
            { v: totalSaved, l: "Saved", icon: Bookmark, color: "text-rose-500" },
            {
              v: `₹${totalSpent >= 1000 ? `${(totalSpent / 1000).toFixed(1)}k` : totalSpent}`,
              l: "Spent",
              icon: CreditCard,
              color: "text-emerald-500",
            },
          ].map((s) => (
            <div key={s.l} className="text-center px-1.5">
              <s.icon size={13} className={`mx-auto mb-1 ${s.color}`} />
              <p className="text-[15px] font-bold text-gray-900 dark:text-white">{s.v}</p>
              <p className="text-[8px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-6 space-y-6">
        <motion.div custom={2} initial="hidden" animate="visible" variants={sectionVariants} className="px-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: "Vendors",
                icon: Store,
                href: "/vendors/marketplace",
                bg: "bg-violet-50 dark:bg-violet-900/20",
                ic: "text-violet-600",
              },
              { label: "Reels", icon: Film, href: "/ideas", bg: "bg-pink-50 dark:bg-pink-900/20", ic: "text-pink-600" },
              {
                label: "Blogs",
                icon: BookOpen,
                href: "/about/blogs",
                bg: "bg-sky-50 dark:bg-sky-900/20",
                ic: "text-sky-600",
              },
            ].map((a) => (
              <Link key={a.label} href={a.href}>
                <motion.div whileTap={{ scale: 0.95 }} className={`flex items-center gap-2 p-3 rounded-xl ${a.bg}`}>
                  <a.icon size={14} className={a.ic} />
                  <span className={`text-[11px] font-semibold ${a.ic}`}>{a.label}</span>
                  <ExternalLink size={9} className={`ml-auto opacity-40 ${a.ic}`} />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* --- Linked Profiles Section --- */}
        <motion.section
          id="linked-profiles-section"
          custom={2.5}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="mt-6"
        >
          {/* Clickable Header */}
          <div
            className="px-5 mb-3 flex items-center justify-between cursor-pointer group"
            onClick={() => setIsLinkedProfilesExpanded(!isLinkedProfilesExpanded)}
          >
            <div>
              <h2 className="text-[14px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Linked Profiles
                <motion.div animate={{ rotate: isLinkedProfilesExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight
                    size={14}
                    className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  />
                </motion.div>
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">Manage your vendor accounts</p>
            </div>

            <Link
              href="/vendor/onboarding"
              onClick={(e) => e.stopPropagation()} // Prevent collapsing when clicking the create button
              className="text-[10px] text-violet-600 font-bold bg-violet-50 dark:bg-violet-900/20 px-3 py-1.5 rounded-full flex items-center gap-1 active:scale-95 transition-transform"
            >
              <Store size={12} /> Create
            </Link>
          </div>

          <AnimatePresence initial={false}>
            {isLinkedProfilesExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                {fetchingProfiles ? (
                  <ScrollCarousel>
                    {[1, 2].map((i) => (
                      <Shimmer key={i} className="min-w-[260px] w-[260px] h-[160px] rounded-2xl shrink-0" />
                    ))}
                  </ScrollCarousel>
                ) : createdProfilesData.length > 0 ? (
                  <ScrollCarousel>
                    {createdProfilesData.map((profile) => (
                      <div
                        key={profile._id}
                        className="min-w-[260px] w-[260px] shrink-0 snap-start block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-3.5 shadow-sm shadow-black/[0.03]"
                      >
                        <div
                          className="h-20 rounded-xl relative mb-10"
                          style={{
                            background: profile.vendorCoverImage
                              ? `url(${profile.vendorCoverImage}) center/cover`
                              : "linear-gradient(135deg,#ede9fe,#fce7f3,#e0e7ff)",
                          }}
                        >
                          <div className="absolute inset-0 bg-black/10 rounded-xl" />
                          <div className="absolute -bottom-6 left-3 p-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
                            <SmartMedia
                              src={profile.vendorAvatar || "/placeholder.jpg"}
                              alt={profile.vendorBusinessName || profile.username}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          </div>
                        </div>

                        <div className="px-1">
                          <h3 className="font-bold text-[14px] text-gray-900 dark:text-white truncate">
                            {profile.vendorBusinessName || profile.username || "Vendor"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5 mb-4">
                            {profile.category && (
                              <p className="text-[9px] font-semibold text-violet-600 capitalize bg-violet-50 dark:bg-violet-900/30 px-1.5 py-0.5 rounded">
                                {profile.category}
                              </p>
                            )}
                            {profile.location?.city && (
                              <p className="text-[9px] text-gray-500 flex items-center gap-1">
                                <MapPin size={8} /> {profile.location.city}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-1 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl mb-4">
                            <div className="text-center">
                              <p className="text-[12px] font-bold text-gray-900 dark:text-white">
                                {profile.postsCount ?? 0}
                              </p>
                              <p className="text-[8px] text-gray-500 uppercase tracking-wider font-semibold mt-0.5">
                                Posts
                              </p>
                            </div>
                            <div className="text-center border-l border-r border-gray-200 dark:border-gray-700">
                              <p className="text-[12px] font-bold text-gray-900 dark:text-white">
                                {profile.reelsCount ?? 0}
                              </p>
                              <p className="text-[8px] text-gray-500 uppercase tracking-wider font-semibold mt-0.5">
                                Reels
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400">
                                {profile.trust ?? 0}
                              </p>
                              <p className="text-[8px] text-gray-500 uppercase tracking-wider font-semibold mt-0.5">
                                Trust
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => handleSimilarprofileClick(profile)}
                              className="flex-1 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[11px] font-bold active:scale-[0.98] transition-transform flex justify-center items-center gap-1.5"
                            >
                              <Eye size={13} /> View
                            </button>
                            {/* <Link
                              href="/admin/vendors"
                              className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-[11px] font-bold active:scale-[0.98] transition-transform flex justify-center items-center gap-1.5"
                            >
                              <SlidersHorizontal size={13} /> Dashboard
                            </Link> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollCarousel>
                ) : (
                  <div className="mx-5 py-8 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
                      <Store size={18} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-[12px] text-gray-400 font-medium max-w-[200px] leading-relaxed">
                      You haven't created any vendor profiles yet.
                    </p>
                    <Link
                      href="/vendor/onboarding"
                      className="mt-3 text-[11px] font-bold text-violet-600 hover:text-violet-700 transition-colors"
                    >
                      Get Started →
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* --- Scheduled Meets Section --- */}
        <motion.section
          id="scheduled-meets-section"
          custom={2.8}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="mt-6"
        >
          {/* Clickable Header */}
          <div
            className="px-5 mb-3 flex items-center justify-between cursor-pointer group"
            onClick={() => setIsScheduledMeetsExpanded(!isScheduledMeetsExpanded)}
          >
            <div>
              <h2 className="text-[14px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Scheduled Meets
                <motion.div animate={{ rotate: isScheduledMeetsExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight
                    size={14}
                    className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  />
                </motion.div>
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">Your active vendor meetings</p>
            </div>
            {scheduledMeets.length > 0 && (
              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                {scheduledMeets.length} Active
              </span>
            )}
          </div>

          <AnimatePresence initial={false}>
            {isScheduledMeetsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                {fetchingMeets ? (
                  <ScrollCarousel>
                    {[1, 2].map((i) => (
                      <Shimmer key={i} className="min-w-[260px] w-[260px] h-[130px] rounded-2xl shrink-0" />
                    ))}
                  </ScrollCarousel>
                ) : scheduledMeets.length > 0 ? (
                  <ScrollCarousel>
                    {scheduledMeets.map((meet) => {
                      const profile = meet.profileId;
                      const vendorName = profile?.vendorBusinessName || profile?.username || "Vendor";

                      return (
                        <div
                          key={meet._id}
                          onClick={() => {
                            if (!profile) return;
                            const baseUrl = window.location.origin + window.location.pathname;
                            const backTo = encodeURIComponent(
                             `${baseUrl}?section=linked-profiles&tab=profiles`
                           );
                            if (profile.vendorId) {
                              router.push(`/vendor/${profile.category}/${profile.vendorId}/profile?backTo=${backTo}`);
                            } else {
                              router.push(`/vendor/${profile.category}/profile/${profile.username}?backTo=${backTo}`);
                            }
                          }}
                          className="min-w-[280px] w-[280px] shrink-0 snap-start block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm shadow-black/[0.03] cursor-pointer hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <SmartMedia
                                src={profile?.vendorAvatar || "/placeholder.jpg"}
                                alt={vendorName}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-800"
                              />
                              <div>
                                <h3 className="font-bold text-[13px] text-gray-900 dark:text-white truncate max-w-[120px]">
                                  {vendorName}
                                </h3>
                                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 capitalize">
                                  {meet.eventType === "Others" ? meet.otherEventType : meet.eventType}
                                </p>
                              </div>
                            </div>
                            <StatusBadge status={meet.status.toUpperCase()} />
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                              <Clock size={12} className="text-gray-400" />
                              {new Date(meet.scheduledDate).toLocaleDateString("en-IN", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </div>
                            <button
                              disabled={cancellingMeetId === meet._id}
                              onClick={(e) => handleCancelMeet(meet._id, e)}
                              className="text-[10px] text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg active:scale-95 transition-transform flex items-center gap-1 disabled:opacity-50 hover:bg-red-100 dark:hover:bg-red-900/40"
                            >
                              {cancellingMeetId === meet._id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                "Cancel"
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </ScrollCarousel>
                ) : (
                  <div className="mx-5 py-8 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
                      <Video size={18} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-[12px] text-gray-400 font-medium max-w-[200px] leading-relaxed">
                      You have no active scheduled meetings.
                    </p>
                    <Link
                      href="/vendors/marketplace"
                      className="mt-3 text-[11px] font-bold text-violet-600 hover:text-violet-700 transition-colors"
                    >
                      Browse Vendors →
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <motion.section custom={3} initial="hidden" animate="visible" variants={sectionVariants} className="px-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold text-gray-900 dark:text-white">Bookings</h2>
            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <span className="text-[9px] text-amber-600 font-bold bg-amber-50 dark:bg-amber-900/20 px-2.5 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/30">
                  {pendingCount} pending
                </span>
              )}
              {confirmedCount > 0 && (
                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                  {confirmedCount} active
                </span>
              )}
            </div>
          </div>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center"
            >
              <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Package size={20} className="text-gray-200 dark:text-gray-600" />
              </div>
              <p className="text-[12px] text-gray-400 font-medium">No bookings yet</p>
              <Link
                href="/vendors/marketplace"
                className="text-[12px] text-violet-600 font-semibold mt-2 inline-flex items-center gap-1"
              >
                Browse Vendors <ChevronRight size={12} />
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-2.5">
              {orders.slice(0, 4).map((order, idx) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  onClick={() => openOrder(order)}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-3 border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-transform cursor-pointer shadow-sm shadow-gray-100/50 dark:shadow-none"
                >
                  <div className="flex gap-3">
                    <div className="w-[74px] h-[74px] rounded-xl overflow-hidden shrink-0 bg-gray-50 dark:bg-gray-800">
                      {/* <img
                        src={order.items?.[0]?.image || "/placeholder.jpg"}
                        alt=""
                        className="w-full h-full object-cover"
                      /> */}
                      <SmartMedia
                        src={order?.items?.[0]?.image || user.imageUrl}
                        alt={order?.items?.[0]?.name || displayName}
                        width={74}
                        height={74}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-0.5">
                          <h3 className="font-semibold text-[12px] text-gray-900 dark:text-white truncate">
                            {order.items?.[0]?.name || "Service"}
                          </h3>
                          <StatusBadge status={order.orderStatus} />
                        </div>
                        <p className="text-[10px] text-gray-400">{order.event?.type}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[10px] text-gray-300">
                          <Calendar size={9} />
                          {order.event?.date
                            ? new Date(order.event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                            : "—"}
                        </span>
                        <span className="text-[13px] font-bold text-gray-900 dark:text-white">
                          ₹{order.pricing?.total?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {totalSpent > 0 && (
                <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Total Spent</p>
                    <p className="text-xl font-bold text-white mt-0.5">₹{totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="text-right mr-2">
                    <p className="text-[10px] text-gray-500 font-medium">Avg / Booking</p>
                    <p className="text-[14px] font-bold text-white">
                      ₹{orders.length > 0 ? Math.round(totalSpent / orders.length).toLocaleString() : 0}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.section>

        <motion.section
          id="collections-section"
          custom={4}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <div className="px-5 mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-[14px] font-bold text-gray-900 dark:text-white">My Collection</h2>
              <p className="text-[10px] text-gray-400 mt-0.5">{totalSaved} saved items</p>
            </div>
            <button
              onClick={refreshLists}
              disabled={refreshing}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 active:scale-90 transition-transform disabled:opacity-50"
            >
              <RefreshCw size={13} className={`text-gray-400 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          <CollectionInsights lists={lists} />

          <LayoutGroup>
            <div className="flex bg-gray-100/80 dark:bg-gray-800 p-1 rounded-2xl mx-5 mb-3">
              {collTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const count = tab.count;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex-1 relative py-2.5 text-[10px] font-semibold rounded-xl transition-colors ${isActive ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="coll-pill-m"
                        className="absolute inset-0 bg-white dark:bg-gray-900 rounded-xl shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-1">
                      <tab.icon size={11} />
                      {tab.label}
                      {count > 0 && (
                        <span
                          className={`text-[8px] min-w-[14px] h-3.5 flex items-center justify-center rounded-full font-bold ${isActive ? "bg-gray-100 dark:bg-gray-800 text-gray-500" : "text-gray-300"}`}
                        >
                          {count}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>

          <div className="mx-5 mb-4">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={collectionSearch}
                onChange={(e) => setCollectionSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-white dark:bg-gray-900 rounded-xl text-[12px] text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800 outline-none focus:border-violet-300 dark:focus:border-violet-700 transition-colors placeholder:text-gray-300"
              />
              {collectionSearch && (
                <button
                  onClick={() => setCollectionSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 active:text-gray-500"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {activeTab === "vendors" &&
                (tabCounts.vendors === 0 ? (
                  <TabEmpty
                    icon={Store}
                    text="No saved vendors yet. Explore and save the ones you love."
                    href="/vendors/marketplace"
                  />
                ) : (
                  <div className="space-y-2">
                    <HList
                      label="Liked Vendors"
                      icon={Heart}
                      items={filterBySearch(lists.vendors.liked, ["name", "address.city", "category"])}
                      renderItem={(v) => <VendorCard vendor={v} />}
                      onRemove={(v) => removeFromList("vendors.liked", v)}
                    />
                    <HList
                      label="Watchlist"
                      icon={Bookmark}
                      items={filterBySearch(lists.vendors.watchlist, ["name", "address.city", "category"])}
                      renderItem={(v) => <VendorCard vendor={v} />}
                      onRemove={(v) => removeFromList("vendors.watchlist", v)}
                    />
                  </div>
                ))}

              {activeTab === "profiles" &&
                (tabCounts.profiles === 0 ? (
                  <TabEmpty
                    icon={Users}
                    text="No saved profiles yet. Discover and follow vendor profiles."
                    href="/vendors/marketplace"
                  />
                ) : (
                  <>
                    <SubTabBar tabs={vpSubs} active={vpSubTab} onChange={handleSubTabChange} />
                    <AnimatePresence mode="wait">
                      {vpSubTab === "profiles" && (
                        <motion.div
                          key="vpp"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <HList
                            label="Liked Profiles"
                            icon={Heart}
                            items={filterBySearch(lists.vendorProfiles.liked, [
                              "vendorBusinessName",
                              "username",
                              "category",
                            ])}
                            renderItem={(p) => <VProfileCard profile={p} />}
                            onRemove={(p) => removeFromList("vendorProfiles.liked", p)}
                          />
                          <HList
                            label="Trusted"
                            icon={ShieldCheck}
                            items={filterBySearch(lists.vendorProfiles.trusted, [
                              "vendorBusinessName",
                              "username",
                              "category",
                            ])}
                            renderItem={(p) => <VProfileCard profile={p} />}
                            onRemove={(p) => removeFromList("vendorProfiles.trusted", p)}
                          />
                        </motion.div>
                      )}
                      {vpSubTab === "posts" && (
                        <motion.div
                          key="vpo"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <HList
                            label="Liked Posts"
                            icon={Heart}
                            items={filterBySearch(lists.vendorProfiles.posts.liked, [
                              "vendorName",
                              "content.caption",
                              "description",
                            ])}
                            renderItem={(p) => <PostCard post={p} />}
                            onRemove={(p) => removeFromList("vendorProfiles.posts.liked", p)}
                          />
                          <HList
                            label="Saved Posts"
                            icon={Bookmark}
                            items={filterBySearch(lists.vendorProfiles.posts.watchlist, [
                              "vendorName",
                              "content.caption",
                              "description",
                            ])}
                            renderItem={(p) => <PostCard post={p} />}
                            onRemove={(p) => removeFromList("vendorProfiles.posts.watchlist", p)}
                          />
                        </motion.div>
                      )}
                      {vpSubTab === "reels" && (
                        <motion.div
                          key="vpr"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <HList
                            label="Liked Vendor Reels"
                            icon={Heart}
                            items={filterBySearch(lists.reels.likedVendorProfileReels, [
                              "title",
                              "caption",
                              "vendorName",
                              "vendorBusinessName",
                            ])}
                            renderItem={(r) => <ReelCardVP reel={r} />}
                            onRemove={(r) => removeFromList("reels.likedVendorProfileReels", r)}
                          />
                          <HList
                            label="Saved Vendor Reels"
                            icon={Bookmark}
                            items={filterBySearch(lists.reels.watchlistVendorProfileReels, [
                              "title",
                              "caption",
                              "vendorName",
                              "vendorBusinessName",
                            ])}
                            renderItem={(r) => <ReelCardVP reel={r} />}
                            onRemove={(r) => removeFromList("reels.watchlistVendorProfileReels", r)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ))}

              {activeTab === "reels" &&
                (tabCounts.reels === 0 ? (
                  <TabEmpty icon={Film} text="No saved reels yet. Watch and save reels you enjoy." href="/ideas" />
                ) : (
                  <div className="space-y-2">
                    <HList
                      label="Liked Reels"
                      icon={Heart}
                      items={filterBySearch(lists.reels.liked, ["title", "caption", "vendorName", "category"])}
                      renderItem={(r) => <ReelCard reel={r} />}
                      onRemove={(r) => removeFromList("reels.liked", r)}
                    />
                    <HList
                      label="Watchlist"
                      icon={Bookmark}
                      items={filterBySearch(lists.reels.watchlist, ["title", "caption", "vendorName", "category"])}
                      renderItem={(r) => <ReelCard reel={r} />}
                      onRemove={(r) => removeFromList("reels.watchlist", r)}
                    />
                  </div>
                ))}

              {activeTab === "blogs" &&
                (tabCounts.blogs === 0 ? (
                  <TabEmpty icon={BookOpen} text="No saved blogs yet. Read and save blogs for later." href="/blog" />
                ) : (
                  <div className="space-y-2">
                    <HList
                      label="Liked Blogs"
                      icon={Heart}
                      items={filterBySearch(lists.blogs.liked, ["title", "category", "authorName"])}
                      renderItem={(b) => <BlogCard blog={b} />}
                      onRemove={(b) => removeFromList("blogs.liked", b)}
                    />
                    <HList
                      label="Saved Blogs"
                      icon={Bookmark}
                      items={filterBySearch(lists.blogs.watchlist, ["title", "category", "authorName"])}
                      renderItem={(b) => <BlogCard blog={b} />}
                      onRemove={(b) => removeFromList("blogs.watchlist", b)}
                    />
                  </div>
                ))}
            </motion.div>
          </AnimatePresence>
        </motion.section>

        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="px-5 space-y-2.5"
        >
          {(dbUser?.creditBalance ?? 0) > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3 shadow-sm shadow-gray-100/50 dark:shadow-none">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
                <Coins size={18} className="text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-semibold text-gray-900 dark:text-white">Credits</p>
                <p className="text-[10px] text-gray-400">{dbUser.creditBalance} available</p>
              </div>
              <Link href="/pricing" className="text-[10px] text-violet-600 font-bold">
                Get More
              </Link>
            </div>
          )}

          <button
            onClick={() => signOut({ redirectUrl: "/m" })}
            className="w-full py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 text-red-500 font-semibold text-[12px] flex items-center justify-center gap-2 bg-white dark:bg-gray-900 active:bg-red-50 dark:active:bg-red-900/10 transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
          <p className="text-center text-[9px] text-gray-200 dark:text-gray-700 pt-1 select-none">v2.9.0</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {editOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeEdit}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 max-h-[88vh] bg-white dark:bg-gray-900 rounded-t-[1.75rem] z-50 flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="flex justify-center pt-3 pb-1" onClick={closeEdit}>
                <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                <button
                  onClick={closeEdit}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full active:scale-90 transition-transform"
                >
                  <X size={14} className="text-gray-400" />
                </button>
              </div>
              <div
                className="flex-1 overflow-y-auto px-5 py-5 space-y-4"
                style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
              >
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { k: "firstName", l: "First Name", ph: "First name" },
                    { k: "lastName", l: "Last Name", ph: "Last name" },
                  ].map(({ k, l, ph }) => (
                    <div key={k}>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">
                        {l}
                      </label>
                      <input
                        value={editForm[k]}
                        onChange={(e) => setEditForm({ ...editForm, [k]: e.target.value })}
                        placeholder={ph}
                        className="w-full px-3.5 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-[13px] font-medium text-gray-900 dark:text-white outline-none border border-transparent focus:border-violet-400 focus:bg-white dark:focus:bg-gray-900 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">
                    Email
                  </label>
                  <div className="flex items-center px-3.5 py-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
                    <Mail size={13} className="text-gray-300 mr-2.5" />
                    <span className="text-[13px] text-gray-400">{user.primaryEmailAddress?.emailAddress}</span>
                  </div>
                </div>
                {[
                  { k: "phone", l: "Phone", ph: "+91 00000 00000", icon: Phone, type: "tel" },
                  { k: "address", l: "Address", ph: "Street address", icon: MapPin },
                ].map(({ k, l, ph, icon: Ic, type }) => (
                  <div key={k}>
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">
                      {l}
                    </label>
                    <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus-within:border-violet-400 focus-within:bg-white dark:focus-within:bg-gray-900 transition-all">
                      <Ic size={13} className="text-gray-300 ml-3.5 mr-2.5" />
                      <input
                        value={editForm[k]}
                        onChange={(e) => setEditForm({ ...editForm, [k]: e.target.value })}
                        placeholder={ph}
                        type={type || "text"}
                        className="flex-1 py-3 pr-3.5 bg-transparent text-[13px] font-medium text-gray-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { k: "city", l: "City", ph: "City" },
                    { k: "pincode", l: "Pincode", ph: "000000" },
                    { k: "state", l: "State", ph: "State" },
                  ].map(({ k, l, ph }) => (
                    <div key={k}>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">
                        {l}
                      </label>
                      <input
                        value={editForm[k]}
                        onChange={(e) => setEditForm({ ...editForm, [k]: e.target.value })}
                        placeholder={ph}
                        className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-[13px] font-medium text-gray-900 dark:text-white outline-none border border-transparent focus:border-violet-400 focus:bg-white dark:focus:bg-gray-900 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 pb-8">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {saving ? "Saving…" : "Save Changes"}
                </motion.button>
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
              transition={{ duration: 0.2 }}
              onClick={closeOrder}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 h-[92vh] bg-white dark:bg-gray-900 rounded-t-[1.75rem] z-50 flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="flex justify-center pt-3 pb-1" onClick={closeOrder}>
                <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
              <div
                className="flex-1 overflow-y-auto"
                style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
              >
                <div className="px-5 pb-8 space-y-4">
                  <div className="flex justify-between items-start pt-1">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Order Details</h2>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-[200px]">
                        #{selectedOrder._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <button
                      onClick={closeOrder}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full active:scale-90 transition-transform"
                    >
                      <X size={14} className="text-gray-400" />
                    </button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 flex justify-between">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Status</p>
                      <div className="mt-1.5">
                        <StatusBadge status={selectedOrder.orderStatus} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Payment</p>
                      <p className="text-[12px] font-semibold text-gray-900 dark:text-white mt-1.5">
                        {selectedOrder.paymentMethod || "—"}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.event && (
                    <div className="bg-white dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                      <h3 className="text-[12px] font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Calendar size={13} className="text-gray-400" />
                        Event
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
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
                            <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">{l}</p>
                            <p className="text-[12px] font-medium text-gray-900 dark:text-white mt-0.5">{v || "—"}</p>
                          </div>
                        ))}
                        {selectedOrder.event.specialRequests && (
                          <div className="col-span-2">
                            <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Requests</p>
                            <p className="text-[12px] font-medium text-gray-900 dark:text-white mt-0.5">
                              {selectedOrder.event.specialRequests}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedOrder.user && (
                    <div className="bg-white dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                      <h3 className="text-[12px] font-bold text-gray-900 dark:text-white mb-3">Contact</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          [
                            "Name",
                            [selectedOrder.user.firstName, selectedOrder.user.lastName].filter(Boolean).join(" ") ||
                              "—",
                          ],
                          ["Phone", selectedOrder.user.phone || "—"],
                          ["City", selectedOrder.user.city || "—"],
                          ["Pincode", selectedOrder.user.pincode || "—"],
                        ].map(([l, v]) => (
                          <div key={l}>
                            <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">{l}</p>
                            <p className="text-[12px] font-medium text-gray-900 dark:text-white mt-0.5">{v}</p>
                          </div>
                        ))}
                        {selectedOrder.user.address && (
                          <div className="col-span-2">
                            <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Address</p>
                            <p className="text-[12px] font-medium text-gray-900 dark:text-white mt-0.5">
                              {selectedOrder.user.address}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedOrder.items?.length > 0 && (
                    <div className="bg-white dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                      <h3 className="text-[12px] font-bold text-gray-900 dark:text-white mb-3">Services</h3>
                      {selectedOrder.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex gap-3 p-2.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl mb-2 last:mb-0"
                        >
                          {item.image && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-700">
                              {/* <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> */}
                              <SmartMedia
                                src={item.image}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[12px] text-gray-900 dark:text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-[12px] font-bold text-gray-900 dark:text-white mt-0.5">
                              ₹{item.price?.toLocaleString()}
                            </p>
                            {item.addons?.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {item.addons.map((a, j) => (
                                  <span
                                    key={j}
                                    className="text-[8px] bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-md font-semibold"
                                  >
                                    {typeof a === "string" ? a : a.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedOrder.pricing && (
                    <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-4 text-white">
                      <h3 className="text-[12px] font-semibold mb-3 flex items-center gap-2">
                        <CreditCard size={13} />
                        Pricing
                      </h3>
                      <div className="space-y-2 text-[12px]">
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
                            <span className="text-emerald-400">
                              -₹{selectedOrder.pricing.discount.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="border-t border-gray-700 pt-2 flex justify-between font-bold text-[14px]">
                          <span>Total</span>
                          <span>₹{(selectedOrder.pricing.total || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedOrder.razorpay?.paymentId && selectedOrder.razorpay.paymentId !== "pending" && (
                    <div className="bg-white dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                      <h3 className="text-[12px] font-bold text-gray-900 dark:text-white mb-2">Payment Ref</h3>
                      {[
                        ["Payment ID", selectedOrder.razorpay.paymentId],
                        ["Order ID", selectedOrder.razorpay.orderId],
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between text-[11px] mb-1">
                          <span className="text-gray-400">{l}</span>
                          <span className="font-mono text-gray-500 truncate max-w-[160px]">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-white dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-[12px] font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Clock size={13} className="text-gray-400" />
                      Timeline
                    </h3>
                    <div className="space-y-2">
                      {selectedOrder.createdAt && (
                        <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                          <div>
                            <p className="text-[11px] font-medium text-gray-900 dark:text-white">Created</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">
                              {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <CheckCircle2 size={15} className="text-emerald-500" />
                        </div>
                      )}
                      {selectedOrder.updatedAt && selectedOrder.updatedAt !== selectedOrder.createdAt && (
                        <div className="flex justify-between items-center p-3 bg-sky-50 dark:bg-sky-900/10 rounded-xl">
                          <div>
                            <p className="text-[11px] font-medium text-gray-900 dark:text-white">Updated</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">
                              {new Date(selectedOrder.updatedAt).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <CheckCircle2 size={15} className="text-sky-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 pb-8">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.open("/about/contact", "_blank")}
                  className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2"
                >
                  <MessageSquare size={14} /> Contact Support
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
