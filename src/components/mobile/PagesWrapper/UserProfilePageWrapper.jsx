"use client";

import React, { useState, useEffect, memo, useCallback, useRef, useMemo } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar, MapPin, ChevronRight, ChevronLeft, Star, Heart, Bookmark,
  LogOut, X, MessageSquare, CreditCard, CheckCircle2, Clock, Package,
  Coins, Crown, Edit3, Phone, Mail, Save, Loader2, Sparkles, Shield,
  Check, Play, Users, Film, Store, ShieldCheck, ImageIcon,
} from "lucide-react";
import { useNavbarVisibilityStore } from "../../../GlobalState/navbarVisibilityStore";
import { useVideoThumbnail } from "../../../lib/video-thumbnail";

const SHIMMER_CSS = `
@keyframes profileShimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

const Shimmer = memo(({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200/50 dark:bg-gray-800 ${className}`}>
    <div
      className="absolute inset-0 -translate-x-full"
      style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
        animation: "profileShimmer 1.4s ease-in-out infinite",
      }}
    />
  </div>
));
Shimmer.displayName = "Shimmer";

const StatusBadge = memo(({ status }) => {
  const m = {
    CONFIRMED: "bg-emerald-50 text-emerald-600 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    COMPLETED: "bg-sky-50 text-sky-600 border-sky-200",
    CANCELLED: "bg-red-50 text-red-500 border-red-200",
  };
  return (
    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border shrink-0 ${m[status] || "bg-gray-50 text-gray-500 border-gray-200"}`}>
      {status}
    </span>
  );
});
StatusBadge.displayName = "StatusBadge";

const PlanBadge = memo(({ plan }) => {
  const m = {
    free: { l: "Free", c: "bg-gray-100 text-gray-500", I: null },
    pro: { l: "Pro", c: "bg-violet-100 text-violet-700", I: Sparkles },
    max: { l: "Max", c: "bg-amber-100 text-amber-700", I: Crown },
  };
  const p = m[plan] || m.free;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${p.c}`}>
      {p.I && <p.I size={10} />}
      {p.l}
    </span>
  );
});
PlanBadge.displayName = "PlanBadge";

const VendorCard = memo(({ vendor }) => (
  <Link href={`/vendor/${vendor.category}/${vendor._id}`} className="min-w-[156px] w-[156px] shrink-0 snap-start">
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden h-full shadow-sm shadow-black/[0.03]"
    >
      <div className="h-24 bg-gray-50 relative">
        <img src={vendor.defaultImage || "/placeholder.jpg"} alt={vendor.name} className="w-full h-full object-cover" />
        {vendor.rating > 0 && (
          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-0.5 shadow-sm">
            <Star size={9} className="fill-amber-400 text-amber-400" />
            {vendor.rating}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-[12px] text-gray-900 dark:text-white truncate">{vendor.name}</p>
        <p className="text-[10px] text-gray-400 truncate flex items-center gap-1 mt-0.5">
          <MapPin size={9} /> {vendor.address?.city || "—"}
        </p>
        {vendor.perDayPrice?.min && (
          <p className="text-[11px] font-bold text-violet-600 mt-1.5">
            ₹{vendor.perDayPrice.min.toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </motion.div>
  </Link>
));
VendorCard.displayName = "VendorCard";

const ReelCard = memo(({ reel }) => {
  const thumb = reel.thumbnailUrl || reel.thumbnail || reel.coverImage || "/placeholder.jpg";
  const likes = reel.likesCount ?? reel.likes?.length ?? 0;
  const title = reel.title || reel.caption || "";
  const vendor = reel.vendorName || "";

  return (
    <Link href={`/ideas?type=${reel.type}&reel=${reel._id}`} className="min-w-[120px] w-[120px] shrink-0 snap-start">
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden h-full shadow-sm shadow-black/[0.03]"
      >
        <div className="h-[160px] bg-gray-50 relative">
          <img src={thumb} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
              <Play size={12} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
          {likes > 0 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[9px] text-white font-semibold">
              <Heart size={9} fill="white" /> {likes}
            </div>
          )}
        </div>
        <div className="p-2.5">
          {title && <p className="text-[10px] text-gray-700 dark:text-gray-200 line-clamp-1 font-medium">{title}</p>}
          {vendor && <p className="text-[9px] text-gray-400 truncate mt-0.5">{vendor}</p>}
        </div>
      </motion.div>
    </Link>
  );
});
ReelCard.displayName = "ReelCard";

const ReelCardVP = memo(({ reel }) => {
  const thumb = reel.thumbnailUrl || reel.thumbnail || reel.coverImage || "/placeholder.jpg";
  const likes = reel.likesCount ?? reel.likes?.length ?? 0;
  const title = reel.title || reel.caption || "";
  const vendor = reel.vendorName || "";

  const url = reel.vendorId
    ? `/vendor/${reel.category}/${reel.vendorId}/profile?tab=reels&reel=${reel.reelIndex}`
    : `/vendor/${reel.category}/profile/${reel.username}?tab=reels&reel=${reel.reelIndex}`;

  return (
    <Link href={url} className="min-w-[120px] w-[120px] shrink-0 snap-start">
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden h-full shadow-sm shadow-black/[0.03]"
      >
        <div className="h-[160px] bg-gray-50 relative">
          <img src={thumb} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
              <Play size={12} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
          {likes > 0 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[9px] text-white font-semibold">
              <Heart size={9} fill="white" /> {likes}
            </div>
          )}
        </div>
        <div className="p-2.5">
          {title && <p className="text-[10px] text-gray-700 dark:text-gray-200 line-clamp-1 font-medium">{title}</p>}
          {vendor && <p className="text-[9px] text-gray-400 truncate mt-0.5">{vendor}</p>}
        </div>
      </motion.div>
    </Link>
  );
});
ReelCardVP.displayName = "ReelCardVP";

const VProfileCard = memo(({ profile }) => {
  const name = profile.vendorBusinessName || profile.username || "Vendor";
  const img = profile.vendorAvatar;
  const cat = profile.category || "Vendor";
  const coverImg = profile.vendorCoverImage;
  const url = profile.vendorId
    ? `/vendor/${profile.category}/${profile.vendorId}/profile`
    : `/vendor/${profile.category}/profile/${profile.username}`;

  return (
    <Link href={url} className="min-w-[148px] w-[148px] shrink-0 snap-start">
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden h-full shadow-sm shadow-black/[0.03]"
      >
        <div
          className="h-12 relative"
          style={{ background: coverImg ? `url(${coverImg}) center/cover` : "linear-gradient(135deg, #ede9fe, #fce7f3)" }}
        />
        <div className="px-3 pb-3 -mt-5 relative">
          <img src={img} alt={name} className="w-10 h-10 rounded-full border-[2.5px] border-white dark:border-gray-900 object-cover shadow-sm" />
          <p className="font-semibold text-[11px] text-gray-900 dark:text-white truncate mt-1.5">{name}</p>
          {cat && <p className="text-[9px] text-gray-400 truncate">{cat}</p>}
          <div className="flex items-center gap-1.5 mt-1">
            {profile.rating > 0 && (
              <span className="text-[9px] text-amber-500 font-bold flex items-center gap-0.5">
                <Star size={8} className="fill-amber-400" /> {profile.rating}
              </span>
            )}
            {profile.verified && <ShieldCheck size={11} className="text-blue-500" />}
          </div>
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
  const desc = post.description || "";
  const likes = post.likesCount ?? 0;
  const vendor = post.vendorName || "";
  const url = post.vendorId
    ? `/vendor/${post.category}/${post.vendorId}/profile?tab=posts&post=${post._id}`
    : `/vendor/${post.category}/profile/${post.username}?tab=posts&post=${post._id}`;

  return (
    <Link href={url} className="min-w-[140px] w-[140px] shrink-0 snap-start">
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden h-full shadow-sm shadow-black/[0.03]"
      >
        <div className="h-[140px] bg-gray-50 relative">
          <img src={thumb || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
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
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            {likes > 0 && (
              <span className="flex items-center gap-1 text-[9px] text-white font-semibold">
                <Heart size={8} fill="white" /> {likes}
              </span>
            )}
            <span className="text-[8px] bg-black/40 backdrop-blur text-white px-2 py-0.5 rounded-md font-semibold ml-auto">
              {isVideo ? "Video" : "Photo"}
            </span>
          </div>
        </div>
        <div className="p-2.5">
          {desc && <p className="text-[10px] text-gray-700 dark:text-gray-200 line-clamp-1 font-medium">{desc}</p>}
          {vendor && <p className="text-[9px] text-gray-400 truncate mt-0.5">{vendor}</p>}
        </div>
      </motion.div>
    </Link>
  );
});
PostCard.displayName = "PostCard";

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
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-lg shadow-black/10 flex items-center justify-center border border-gray-100 dark:border-gray-700 active:scale-90 transition-transform"
          >
            <ChevronLeft size={12} className="text-gray-600 dark:text-gray-300" />
          </motion.button>
        )}
      </AnimatePresence>
      {canLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#f8f8fa] dark:from-black to-transparent z-10 pointer-events-none" />
      )}
      <div
        ref={ref}
        className="flex gap-2.5 overflow-x-auto px-5 pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>
      {canRight && (
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#f8f8fa] dark:from-black to-transparent z-10 pointer-events-none" />
      )}
      <AnimatePresence>
        {canRight && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={() => scroll("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-lg shadow-black/10 flex items-center justify-center border border-gray-100 dark:border-gray-700 active:scale-90 transition-transform"
          >
            <ChevronRight size={12} className="text-gray-600 dark:text-gray-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});
ScrollCarousel.displayName = "ScrollCarousel";

const HList = memo(({ label, icon: Icon, items, renderItem }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-1">
      <div className="flex items-center gap-2 px-5 mb-2.5">
        <Icon size={13} className="text-gray-300" />
        <span className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">{label}</span>
        <span className="ml-auto text-[10px] font-semibold text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      <ScrollCarousel>
        {items.map((item, i) => (
          <React.Fragment key={item?._id || item?.id || `${label}-${i}`}>
            {renderItem(item, i)}
          </React.Fragment>
        ))}
      </ScrollCarousel>
    </div>
  );
});
HList.displayName = "HList";

const TabEmpty = memo(({ icon: Icon, text }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    className="mx-5 py-12 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center"
  >
    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
      <Icon size={20} className="text-gray-200 dark:text-gray-600" />
    </div>
    <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium text-center max-w-[220px] leading-relaxed">{text}</p>
    <Link href="/m" className="mt-4 text-[11px] text-violet-600 font-semibold flex items-center gap-1">
      Explore Vendors <ChevronRight size={12} />
    </Link>
  </motion.div>
));
TabEmpty.displayName = "TabEmpty";

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
      <div className="flex items-center justify-between mb-1">
        <Shimmer className="h-4 w-20 rounded-md" />
        <Shimmer className="h-4 w-16 rounded-full" />
      </div>
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
              <Shimmer className="h-3 w-12 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TABS = [
  { id: "vendors", label: "Vendors", icon: Store },
  { id: "reels", label: "Reels", icon: Film },
  { id: "profiles", label: "Profiles", icon: Users },
  { id: "posts", label: "Posts", icon: ImageIcon },
];

const EMPTY_LISTS = {
  vendors: { liked: [], watchlist: [] },
  reels: { liked: [], watchlist: [], likedVendorProfileReels: [], watchlistVendorProfileReels: [] },
  vendorProfiles: { liked: [], trusted: [], posts: { liked: [], watchlist: [] } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } }),
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const [activeTab, setActiveTab] = useState(() => {
    const t = searchParams.get("tab");
    return t && TABS.some((x) => x.id === t) ? t : "vendors";
  });

  const [editForm, setEditForm] = useState({
    firstName: "", lastName: "", phone: "", address: "", city: "", pincode: "", state: "",
  });

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t && TABS.some((x) => x.id === t) && t !== activeTab) setActiveTab(t);
  }, [searchParams]);

  const handleTabChange = useCallback(
    (tabId) => {
      setActiveTab(tabId);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tabId);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const showToast = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    (async () => {
      try {
        const [userRes, ordersRes, subRes, listsRes] = await Promise.all([
          fetch(`/api/user?userId=${user.id}`),
          fetch(`/api/orders?userId=${user.id}`),
          fetch(`/api/user/subscription?userId=${user.id}`),
          fetch(`/api/user/interactionsLists?userId=${user.id}`),
        ]);
        if (cancelled) return;

        if (userRes.ok) {
          const u = await userRes.json();
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
        if (ordersRes.ok) {
          const d = await ordersRes.json();
          if (d.success) setOrders(d.data || []);
        }
        if (subRes.ok) setSubscription(await subRes.json());
        if (listsRes.ok) {
          const l = await listsRes.json();
          if (l.success) {
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
            });
          }
        }
      } catch (e) {
        console.error("Profile fetch error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user?.id]);

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
            address: { address: editForm.address, city: editForm.city, pincode: editForm.pincode, state: editForm.state },
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDbUser(data.user);
        closeEdit();
        showToast("Profile updated");
      } else {
        showToast(data.error || "Update failed", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const openOrder = useCallback((o) => { setSelectedOrder(o); setIsNavbarVisible(false); }, [setIsNavbarVisible]);
  const closeOrder = useCallback(() => { setSelectedOrder(null); setIsNavbarVisible(true); }, [setIsNavbarVisible]);
  const openEdit = useCallback(() => { setEditOpen(true); setIsNavbarVisible(false); }, [setIsNavbarVisible]);
  const closeEdit = useCallback(() => { setEditOpen(false); setIsNavbarVisible(true); }, [setIsNavbarVisible]);

  const tabCounts = useMemo(() => ({
    vendors: (lists.vendors.liked.length || 0) + (lists.vendors.watchlist.length || 0),
    reels: (lists.reels.liked.length || 0) + (lists.reels.watchlist.length || 0) + (lists.reels.likedVendorProfileReels.length || 0) + (lists.reels.watchlistVendorProfileReels.length || 0),
    profiles: (lists.vendorProfiles.liked.length || 0) + (lists.vendorProfiles.trusted.length || 0),
    posts: (lists.vendorProfiles.posts.liked.length || 0) + (lists.vendorProfiles.posts.watchlist.length || 0),
  }), [lists]);

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
            <Link href={`/sign-in?redirect_url=${encodeURIComponent(fullAuthRedirectUrl)}`}  className="block w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-semibold text-center text-[15px] active:scale-[0.98] transition-transform">
              Sign In
            </Link>
            <Link href={`/sign-up?redirect_url=${encodeURIComponent(fullAuthRedirectUrl)}`}  className="block w-full py-3.5 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl font-medium text-center text-[15px] active:scale-[0.98] transition-transform">
              Create Account
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  const displayName = dbUser ? `${dbUser.firstName || ""} ${dbUser.lastName || ""}`.trim() || user.fullName : user.fullName;
  const currentPlan = subscription?.plan || dbUser?.plan || "free";
  const planActive = subscription?.isActive || false;
  const planExpiry = subscription?.planExpiresAt;
  const phone = dbUser?.personalInfo?.phone;
  const city = dbUser?.personalInfo?.address?.city;
  const totalSpent = orders.reduce((s, o) => s + (o.pricing?.total || 0), 0);
  const pendingCount = orders.filter((o) => o.orderStatus === "PENDING").length;
  const totalSaved = tabCounts.vendors + tabCounts.reels + tabCounts.profiles + tabCounts.posts;
  const memberSince = dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : null;

  return (
    <div className="min-h-screen bg-[#f8f8fa] dark:bg-black pb-15">
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
            {toast.type === "error" ? <X size={14} /> : <Check size={14} />}
            <span className="flex-1">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-white dark:bg-gray-900 px-5 pt-5 pb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-[15px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-[0.15em]">Profile</p>
          <button onClick={openEdit} className="p-2 -mr-2 rounded-xl active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
            <Edit3 size={15} className="text-gray-400" />
          </button>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src={user.imageUrl}
              alt={displayName}
              className="w-[58px] h-[58px] rounded-full object-cover ring-[3px] ring-gray-100 dark:ring-gray-800"
            />
            {currentPlan !== "free" && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                {currentPlan === "max" ? <Crown size={9} className="text-amber-300" /> : <Sparkles size={9} className="text-white" />}
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
                  <Phone size={9} /> {phone}
                </span>
              )}
              {city && (
                <span className="text-[10px] text-gray-300 dark:text-gray-600 flex items-center gap-1">
                  <MapPin size={9} /> {city}
                </span>
              )}
              {memberSince && (
                <span className="text-[10px] text-gray-300 dark:text-gray-600 flex items-center gap-1">
                  <Calendar size={9} /> Since {memberSince}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Plan + Stats */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={sectionVariants} className="px-5 -mt-3 relative z-10 space-y-2.5">
        <Link href="/pricing">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-3.5 flex items-center gap-3 shadow-sm shadow-gray-100/50 dark:shadow-none"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${currentPlan === "max" ? "bg-amber-50" : currentPlan === "pro" ? "bg-violet-50" : "bg-gray-50"}`}>
              {currentPlan === "max" ? <Crown size={18} className="text-amber-500" /> : currentPlan === "pro" ? <Sparkles size={18} className="text-violet-600" /> : <Shield size={18} className="text-gray-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-gray-900 dark:text-white">
                {currentPlan === "free" ? "Free Plan" : `${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan`}
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

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-3.5 grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 shadow-sm shadow-gray-100/50 dark:shadow-none">
          {[
            { v: dbUser?.creditBalance ?? 0, l: "Credits", icon: Coins, color: "text-amber-500" },
            { v: orders.length, l: "Bookings", icon: Package, color: "text-violet-500" },
            { v: totalSaved, l: "Saved", icon: Bookmark, color: "text-rose-500" },
          ].map((s) => (
            <div key={s.l} className="text-center px-2">
              <s.icon size={14} className={`mx-auto mb-1 ${s.color}`} />
              <p className="text-[17px] font-bold text-gray-900 dark:text-white">{s.v}</p>
              <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-6 space-y-6">
        {/* Bookings */}
        <motion.section custom={2} initial="hidden" animate="visible" variants={sectionVariants} className="px-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold text-gray-900 dark:text-white">Bookings</h2>
            {pendingCount > 0 && (
              <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                {pendingCount} pending
              </span>
            )}
          </div>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center"
            >
              <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Package size={20} className="text-gray-200" />
              </div>
              <p className="text-[12px] text-gray-400 font-medium">No bookings yet</p>
              <Link href="/vendors/marketplace" className="text-[12px] text-violet-600 font-semibold mt-2 inline-flex items-center gap-1">
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
                    <div className="w-[74px] h-[74px] rounded-xl overflow-hidden shrink-0 bg-gray-50">
                      <img src={order.items?.[0]?.image || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
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
                  <CreditCard size={18} className="text-gray-600" />
                </div>
              )}
            </div>
          )}
        </motion.section>

        {/* Collection */}
        <motion.section custom={3} initial="hidden" animate="visible" variants={sectionVariants}>
          <div className="px-5 mb-3">
            <h2 className="text-[14px] font-bold text-gray-900 dark:text-white">My Collection</h2>
          </div>

          <LayoutGroup>
            <div className="flex bg-gray-100/80 dark:bg-gray-800 p-1 rounded-2xl mx-5 mb-4">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const count = tabCounts[tab.id];
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex-1 relative py-2.5 text-[11px] font-semibold rounded-xl transition-colors ${isActive ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="collection-pill"
                        className="absolute inset-0 bg-white dark:bg-gray-900 rounded-xl shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-1">
                      <tab.icon size={12} />
                      {tab.label}
                      {count > 0 && (
                        <span className={`text-[9px] min-w-[16px] h-4 flex items-center justify-center rounded-full font-bold ${isActive ? "bg-gray-100 dark:bg-gray-800 text-gray-500" : "text-gray-300"}`}>
                          {count}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="px-2"
            >
              {activeTab === "vendors" &&
                (tabCounts.vendors === 0 ? (
                  <TabEmpty icon={Store} text="No saved vendors yet. Explore and save the ones you love." />
                ) : (
                  <div className="space-y-5">
                    <HList label="Liked" icon={Heart} items={lists.vendors.liked} renderItem={(v) => <VendorCard vendor={v} />} />
                    <HList label="Watchlist" icon={Bookmark} items={lists.vendors.watchlist} renderItem={(v) => <VendorCard vendor={v} />} />
                  </div>
                ))}

              {activeTab === "reels" &&
                (tabCounts.reels === 0 ? (
                  <TabEmpty icon={Film} text="No saved reels yet. Watch and save reels you enjoy." />
                ) : (
                  <div className="space-y-5">
                    <HList label="Liked Reels" icon={Heart} items={lists.reels.liked} renderItem={(r) => <ReelCard reel={r} />} />
                    <HList label="Watchlist Reels" icon={Bookmark} items={lists.reels.watchlist} renderItem={(r) => <ReelCard reel={r} />} />
                    <HList label="Liked Vendor Reels" icon={Heart} items={lists.reels.likedVendorProfileReels} renderItem={(r) => <ReelCardVP reel={r} />} />
                    <HList label="Saved Vendor Reels" icon={Bookmark} items={lists.reels.watchlistVendorProfileReels} renderItem={(r) => <ReelCardVP reel={r} />} />
                  </div>
                ))}

              {activeTab === "profiles" &&
                (tabCounts.profiles === 0 ? (
                  <TabEmpty icon={Users} text="No liked profiles yet. Discover and connect with vendors." />
                ) : (
                  <div className="space-y-5">
                    <HList label="Liked" icon={Heart} items={lists.vendorProfiles.liked} renderItem={(p) => <VProfileCard profile={p} />} />
                    <HList label="Trusted" icon={ShieldCheck} items={lists.vendorProfiles.trusted} renderItem={(p) => <VProfileCard profile={p} />} />
                  </div>
                ))}

              {activeTab === "posts" &&
                (tabCounts.posts === 0 ? (
                  <TabEmpty icon={ImageIcon} text="No saved posts yet. Like or save vendor posts." />
                ) : (
                  <div className="space-y-5">
                    <HList label="Liked Posts" icon={Heart} items={lists.vendorProfiles.posts.liked} renderItem={(p) => <PostCard post={p} />} />
                    <HList label="Saved Posts" icon={Bookmark} items={lists.vendorProfiles.posts.watchlist} renderItem={(p) => <PostCard post={p} />} />
                  </div>
                ))}
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* Account */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={sectionVariants} className="px-5 space-y-2.5">
          {(dbUser?.creditBalance ?? 0) > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3 shadow-sm shadow-gray-100/50 dark:shadow-none">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
                <Coins size={18} className="text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-semibold text-gray-900 dark:text-white">Credits</p>
                <p className="text-[10px] text-gray-400">{dbUser.creditBalance} available</p>
              </div>
              <p className="text-[15px] font-bold text-gray-900 dark:text-white">{dbUser.creditBalance}</p>
            </div>
          )}

          <button
            onClick={() => signOut({ redirectUrl: "/m" })}
            className="w-full py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 text-red-500 font-semibold text-[12px] flex items-center justify-center gap-2 bg-white dark:bg-gray-900 active:bg-red-50 dark:active:bg-red-900/10 transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
          <p className="text-center text-[9px] text-gray-200 dark:text-gray-700 pt-1 select-none">v2.6.0</p>
        </motion.div>
      </div>

      {/* Edit Drawer */}
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
                <button onClick={closeEdit} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full active:scale-90 transition-transform">
                  <X size={14} className="text-gray-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { k: "firstName", l: "First Name", ph: "First name" },
                    { k: "lastName", l: "Last Name", ph: "Last name" },
                  ].map(({ k, l, ph }) => (
                    <div key={k}>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">{l}</label>
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
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">Email</label>
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
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">{l}</label>
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
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">{l}</label>
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

      {/* Order Drawer */}
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
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
                <div className="px-5 pb-8 space-y-4">
                  <div className="flex justify-between items-start pt-1">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Order Details</h2>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-[200px]">{selectedOrder._id}</p>
                    </div>
                    <button onClick={closeOrder} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full active:scale-90 transition-transform">
                      <X size={14} className="text-gray-400" />
                    </button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 flex justify-between">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Status</p>
                      <div className="mt-1.5"><StatusBadge status={selectedOrder.orderStatus} /></div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Payment</p>
                      <p className="text-[12px] font-semibold text-gray-900 dark:text-white mt-1.5">{selectedOrder.paymentMethod || "—"}</p>
                    </div>
                  </div>

                  {selectedOrder.event && (
                    <div className="bg-white dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                      <h3 className="text-[12px] font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Calendar size={13} className="text-gray-400" /> Event
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          ["Name", selectedOrder.event.name],
                          ["Type", selectedOrder.event.type],
                          ["Date", selectedOrder.event.date ? new Date(selectedOrder.event.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "—"],
                          ["Guests", selectedOrder.event.guests?.toLocaleString() || "—"],
                        ].map(([l, v]) => (
                          <div key={l}>
                            <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">{l}</p>
                            <p className="text-[12px] font-medium text-gray-900 dark:text-white mt-0.5">{v || "—"}</p>
                          </div>
                        ))}
                        {selectedOrder.event.specialRequests && (
                          <div className="col-span-2">
                            <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Special Requests</p>
                            <p className="text-[12px] font-medium text-gray-900 dark:text-white mt-0.5">{selectedOrder.event.specialRequests}</p>
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
                          ["Name", [selectedOrder.user.firstName, selectedOrder.user.lastName].filter(Boolean).join(" ") || "—"],
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
                            <p className="text-[12px] font-medium text-gray-900 dark:text-white mt-0.5">{selectedOrder.user.address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedOrder.items?.length > 0 && (
                    <div className="bg-white dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                      <h3 className="text-[12px] font-bold text-gray-900 dark:text-white mb-3">Services</h3>
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex gap-3 p-2.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl mb-2 last:mb-0">
                          {item.image && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[12px] text-gray-900 dark:text-white truncate">{item.name}</p>
                            <p className="text-[12px] font-bold text-gray-900 dark:text-white mt-0.5">₹{item.price?.toLocaleString()}</p>
                            {item.addons?.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {item.addons.map((a, j) => (
                                  <span key={j} className="text-[8px] bg-violet-50 text-violet-600 px-2 py-0.5 rounded-md font-semibold">
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
                        <CreditCard size={13} /> Pricing
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
                            <span className="text-emerald-400">-₹{selectedOrder.pricing.discount.toLocaleString()}</span>
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
                      <Clock size={13} className="text-gray-400" /> Timeline
                    </h3>
                    <div className="space-y-2">
                      {selectedOrder.createdAt && (
                        <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                          <div>
                            <p className="text-[11px] font-medium text-gray-900 dark:text-white">Created</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">{new Date(selectedOrder.createdAt).toLocaleString("en-IN")}</p>
                          </div>
                          <CheckCircle2 size={15} className="text-emerald-500" />
                        </div>
                      )}
                      {selectedOrder.updatedAt && selectedOrder.updatedAt !== selectedOrder.createdAt && (
                        <div className="flex justify-between items-center p-3 bg-sky-50 dark:bg-sky-900/10 rounded-xl">
                          <div>
                            <p className="text-[11px] font-medium text-gray-900 dark:text-white">Updated</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">{new Date(selectedOrder.updatedAt).toLocaleString("en-IN")}</p>
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