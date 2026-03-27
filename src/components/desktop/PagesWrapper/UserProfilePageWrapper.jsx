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
  Check, Play, Users, Film, Store, ShieldCheck, ImageIcon, Settings,
  Bell, HelpCircle, Copy, Gift, TrendingUp, Zap, Plus, ExternalLink,
  ArrowUpRight, MoreHorizontal, Search, Filter, Download, Eye, Trash2,
  RefreshCw, AlertCircle, Info, ChevronDown, Grid3X3, List,
} from "lucide-react";
import { useNavbarVisibilityStore } from "../../../GlobalState/navbarVisibilityStore";
import { useVideoThumbnail } from "../../../lib/video-thumbnail";

const Shimmer = memo(({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200/60 dark:bg-gray-800 rounded-xl ${className}`}>
    <div
      className="absolute inset-0 -translate-x-full"
      style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
    />
  </div>
));
Shimmer.displayName = "Shimmer";

const StatusBadge = memo(({ status }) => {
  const config = {
    CONFIRMED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    PENDING: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
    COMPLETED: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-500" },
    CANCELLED: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", dot: "bg-red-500" },
  };
  const s = config[status] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
});
StatusBadge.displayName = "StatusBadge";

const PlanBadge = memo(({ plan, size = "default" }) => {
  const config = {
    free: { label: "Free", bg: "bg-gray-100", text: "text-gray-600", Icon: null },
    pro: { label: "Pro", bg: "bg-violet-100", text: "text-violet-700", Icon: Sparkles },
    max: { label: "Max", bg: "bg-gradient-to-r from-amber-100 to-orange-100", text: "text-amber-700", Icon: Crown },
  };
  const p = config[plan] || config.free;
  const sizeClasses = size === "large" ? "px-4 py-1.5 text-sm gap-1.5" : "px-2.5 py-1 text-xs gap-1";
  return (
    <span className={`inline-flex items-center font-bold rounded-full ${p.bg} ${p.text} ${sizeClasses}`}>
      {p.Icon && <p.Icon size={size === "large" ? 14 : 12} />}
      {p.label}
    </span>
  );
});
PlanBadge.displayName = "PlanBadge";

const VendorCard = memo(({ vendor }) => (
  <Link href={`/vendor/${vendor.category}/${vendor._id}`} className="group">
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        <img
          src={vendor.defaultImage || "/placeholder.jpg"}
          alt={vendor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {vendor.rating > 0 && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            {vendor.rating}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-violet-600 transition-colors">{vendor.name}</h3>
        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
          <MapPin size={12} /> {vendor.address?.city || "—"}
        </p>
        {vendor.perDayPrice?.min && (
          <p className="text-sm font-bold text-violet-600 mt-2">
            From ₹{vendor.perDayPrice.min.toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </div>
  </Link>
));
VendorCard.displayName = "VendorCard";

const ReelCard = memo(({ reel }) => {
  const thumb = reel.thumbnailUrl || reel.thumbnail || reel.coverImage || "/placeholder.jpg";
  const likes = reel.likesCount ?? reel.likes?.length ?? 0;
  const title = reel.title || reel.caption || "";
  const vendor = reel.vendorName || "";

  return (
    <Link href={`/ideas?type=${reel.type}&reel=${reel._id}`} className="group">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
        <div className="aspect-[9/16] max-h-[240px] bg-gray-100 relative overflow-hidden">
          <img src={thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
              <Play size={20} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
          {likes > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white font-semibold">
              <Heart size={12} fill="white" /> {likes}
            </div>
          )}
        </div>
        <div className="p-3">
          {title && <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-1 font-medium">{title}</p>}
          {vendor && <p className="text-xs text-gray-500 truncate mt-0.5">{vendor}</p>}
        </div>
      </div>
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
    <Link href={url} className="group">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
        <div className="aspect-[9/16] max-h-[240px] bg-gray-100 relative overflow-hidden">
          <img src={thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
              <Play size={20} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
          {likes > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white font-semibold">
              <Heart size={12} fill="white" /> {likes}
            </div>
          )}
        </div>
        <div className="p-3">
          {title && <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-1 font-medium">{title}</p>}
          {vendor && <p className="text-xs text-gray-500 truncate mt-0.5">{vendor}</p>}
        </div>
      </div>
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
    <Link href={url} className="group">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
        <div
          className="h-20 relative"
          style={{ background: coverImg ? `url(${coverImg}) center/cover` : "linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%)" }}
        />
        <div className="px-4 pb-4 -mt-8 relative">
          <img src={img} alt={name} className="w-16 h-16 rounded-2xl border-4 border-white dark:border-gray-900 object-cover shadow-lg" />
          <h3 className="font-semibold text-gray-900 dark:text-white truncate mt-3 group-hover:text-violet-600 transition-colors">{name}</h3>
          <p className="text-xs text-gray-500 truncate">{cat}</p>
          <div className="flex items-center gap-2 mt-2">
            {profile.rating > 0 && (
              <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                <Star size={10} className="fill-amber-400" /> {profile.rating}
              </span>
            )}
            {profile.verified && <ShieldCheck size={14} className="text-blue-500" />}
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
  const desc = post.description || "";
  const likes = post.likesCount ?? 0;
  const vendor = post.vendorName || "";
  const url = post.vendorId
    ? `/vendor/${post.category}/${post.vendorId}/profile?tab=posts&post=${post._id}`
    : `/vendor/${post.category}/profile/${post.username}?tab=posts&post=${post._id}`;

  return (
    <Link href={url} className="group">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <img src={thumb || "/placeholder.jpg"} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {isVideo && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Play size={16} className="text-white ml-0.5" fill="white" />
                </div>
              </div>
            </>
          )}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            {likes > 0 && (
              <span className="flex items-center gap-1 text-xs text-white font-semibold">
                <Heart size={10} fill="white" /> {likes}
              </span>
            )}
            <span className="text-[10px] bg-black/50 backdrop-blur text-white px-2 py-0.5 rounded-md font-medium ml-auto">
              {isVideo ? "Video" : "Photo"}
            </span>
          </div>
        </div>
        <div className="p-3">
          {desc && <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-1 font-medium">{desc}</p>}
          {vendor && <p className="text-xs text-gray-500 truncate mt-0.5">{vendor}</p>}
        </div>
      </div>
    </Link>
  );
});
PostCard.displayName = "PostCard";

const SidebarItem = memo(({ icon: Icon, label, isActive, onClick, badge, isDestructive }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive
        ? "bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
        : isDestructive
        ? "hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
    }`}
  >
    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
    <span className={`text-sm font-medium flex-1 text-left ${isActive ? "" : "group-hover:text-gray-900 dark:group-hover:text-white"}`}>
      {label}
    </span>
    {badge && (
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-violet-100 text-violet-600"}`}>
        {badge}
      </span>
    )}
  </button>
));
SidebarItem.displayName = "SidebarItem";

const StatCard = memo(({ icon: Icon, label, value, trend, color = "violet", action }) => {
  const colors = {
    violet: "bg-violet-500 shadow-violet-200",
    amber: "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-200",
    emerald: "bg-emerald-500 shadow-emerald-200",
    sky: "bg-sky-500 shadow-sky-200",
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${colors[color]}`}>
          <Icon size={22} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
            trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
          }`}>
            <TrendingUp size={12} className={trend < 0 ? "rotate-180" : ""} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
      {action && (
        <button onClick={action.onClick} className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1">
          {action.label} <ArrowUpRight size={14} />
        </button>
      )}
    </div>
  );
});
StatCard.displayName = "StatCard";

const EmptyState = memo(({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
      <Icon size={32} className="text-gray-300 dark:text-gray-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
    {action && (
      <Link href={action.href} className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors">
        {action.label} <ChevronRight size={16} />
      </Link>
    )}
  </div>
));
EmptyState.displayName = "EmptyState";

const CollectionGrid = memo(({ items, renderItem, columns = 4 }) => {
  const gridCols = { 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6" };
  return (
    <div className={`grid ${gridCols[columns]} gap-5`}>
      {items.map((item, i) => (
        <React.Fragment key={item?._id || item?.id || i}>
          {renderItem(item)}
        </React.Fragment>
      ))}
    </div>
  );
});
CollectionGrid.displayName = "CollectionGrid";

const FullPageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
    <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
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
              <Shimmer key={i} className="h-40 rounded-2xl" />
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

const COLLECTION_TABS = [
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

export default function UserProfilePageWrapper() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
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
  const [copiedCode, setCopiedCode] = useState(false);

  const [activeSection, setActiveSection] = useState(() => {
    const s = searchParams.get("section");
    return s && SIDEBAR_TABS.some((t) => t.id === s) ? s : "overview";
  });

  const [activeCollectionTab, setActiveCollectionTab] = useState(() => {
    const t = searchParams.get("tab");
    return t && COLLECTION_TABS.some((x) => x.id === t) ? t : "vendors";
  });

  const [editForm, setEditForm] = useState({
    firstName: "", lastName: "", phone: "", address: "", city: "", pincode: "", state: "",
  });

  useEffect(() => {
    const s = searchParams.get("section");
    const t = searchParams.get("tab");
    if (s && SIDEBAR_TABS.some((x) => x.id === s) && s !== activeSection) setActiveSection(s);
    if (t && COLLECTION_TABS.some((x) => x.id === t) && t !== activeCollectionTab) setActiveCollectionTab(t);
  }, [searchParams]);

  const updateURL = useCallback((section, tab) => {
    const params = new URLSearchParams();
    if (section) params.set("section", section);
    if (tab && section === "collection") params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname]);

  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
    updateURL(sectionId, sectionId === "collection" ? activeCollectionTab : null);
  }, [updateURL, activeCollectionTab]);

  const handleCollectionTabChange = useCallback((tabId) => {
    setActiveCollectionTab(tabId);
    updateURL("collection", tabId);
  }, [updateURL]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  const copyReferralCode = useCallback(() => {
    navigator.clipboard.writeText("PLANWAB2025");
    setCopiedCode(true);
    showToast("Referral code copied!");
    setTimeout(() => setCopiedCode(false), 2000);
  }, [showToast]);

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
                posts: { liked: l.vendorProfiles?.posts?.liked || [], watchlist: l.vendorProfiles?.posts?.watchlist || [] },
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
        setEditOpen(false);
        showToast("Profile updated successfully");
      } else {
        showToast(data.error || "Update failed", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const tabCounts = useMemo(() => ({
    vendors: (lists.vendors.liked.length || 0) + (lists.vendors.watchlist.length || 0),
    reels: (lists.reels.liked.length || 0) + (lists.reels.watchlist.length || 0) + (lists.reels.likedVendorProfileReels.length || 0) + (lists.reels.watchlistVendorProfileReels.length || 0),
    profiles: (lists.vendorProfiles.liked.length || 0) + (lists.vendorProfiles.trusted.length || 0),
    posts: (lists.vendorProfiles.posts.liked.length || 0) + (lists.vendorProfiles.posts.watchlist.length || 0),
  }), [lists]);

  if (!isLoaded || (isSignedIn && loading)) return <FullPageSkeleton />;

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-violet-100 dark:shadow-none border border-gray-100 dark:border-gray-700">
            <Image src="/planwablogo.png" alt="PlanWAB" width={48} height={48} className="object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Welcome Back</h1>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed">Sign in to access your profile, manage bookings, and explore your saved vendors.</p>
          <div className="space-y-4">
            <Link href={`/sign-in?redirect_url=${encodeURIComponent(fullAuthRedirectUrl)}`} className="block w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-semibold text-lg hover:bg-violet-600 dark:hover:bg-violet-100 transition-all">
              Sign In
            </Link>
            <Link href={`/sign-up?redirect_url=${encodeURIComponent(fullAuthRedirectUrl)}`} className="block w-full py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl font-medium text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
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
  const memberSince = dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>

      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className={`fixed top-24 right-8 z-[200] px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 text-white text-sm font-medium ${
              toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
            }`}
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
              <img src={user.imageUrl} alt={displayName} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-100 dark:ring-gray-800" />
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 dark:text-white truncate">{displayName}</h2>
                <PlanBadge plan={currentPlan} />
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {SIDEBAR_TABS.map((tab) => (
              <SidebarItem
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                isActive={activeSection === tab.id}
                onClick={() => handleSectionChange(tab.id)}
                badge={tab.id === "bookings" && pendingCount > 0 ? pendingCount : null}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <SidebarItem icon={HelpCircle} label="Help & Support" onClick={() => {}} />
            <SidebarItem icon={LogOut} label="Sign Out" isDestructive onClick={() => signOut({ redirectUrl: "/" })} />
            <p className="text-[10px] text-gray-300 dark:text-gray-700 text-center mt-4">v2.6.0</p>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeSection === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {dbUser?.firstName || user.firstName}</h1>
                      <p className="text-gray-500 mt-1">Here's what's happening with your account</p>
                    </div>
                    <button onClick={() => setEditOpen(true)} className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-violet-600 dark:hover:bg-violet-100 transition-colors flex items-center gap-2">
                      <Edit3 size={16} /> Edit Profile
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-6">
                    <StatCard icon={Coins} label="Available Credits" value={dbUser?.creditBalance ?? 0} color="amber" action={{ label: "Add Credits", onClick: () => handleSectionChange("wallet") }} />
                    <StatCard icon={Package} label="Total Bookings" value={orders.length} trend={12} color="violet" action={{ label: "View All", onClick: () => handleSectionChange("bookings") }} />
                    <StatCard icon={Bookmark} label="Saved Items" value={totalSaved} color="sky" action={{ label: "View Collection", onClick: () => handleSectionChange("collection") }} />
                    <StatCard icon={CreditCard} label="Total Spent" value={`₹${totalSpent.toLocaleString()}`} color="emerald" />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
                        <button onClick={() => handleSectionChange("bookings")} className="text-sm text-violet-600 font-medium hover:underline flex items-center gap-1">
                          View All <ChevronRight size={14} />
                        </button>
                      </div>
                      {orders.length === 0 ? (
                        <EmptyState icon={Package} title="No bookings yet" description="Start exploring vendors to make your first booking" action={{ label: "Browse Vendors", href: "/vendors/marketplace" }} />
                      ) : (
                        <div className="space-y-4">
                          {orders.slice(0, 3).map((order) => (
                            <div key={order._id} onClick={() => setSelectedOrder(order)} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                                <img src={order.items?.[0]?.image || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 dark:text-white truncate">{order.items?.[0]?.name || "Service"}</h3>
                                <p className="text-sm text-gray-500">{order.event?.type}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <StatusBadge status={order.orderStatus} />
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">₹{order.pricing?.total?.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Details</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Mail size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.primaryEmailAddress?.emailAddress}</span>
                          </div>
                          {phone && (
                            <div className="flex items-center gap-3">
                              <Phone size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{phone}</span>
                            </div>
                          )}
                          {city && (
                            <div className="flex items-center gap-3">
                              <MapPin size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{city}</span>
                            </div>
                          )}
                          {memberSince && (
                            <div className="flex items-center gap-3">
                              <Calendar size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">Member since {memberSince}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Link href="/pricing" className="block">
                        <div className={`rounded-2xl p-6 ${currentPlan === "max" ? "bg-gradient-to-br from-amber-400 to-orange-500" : currentPlan === "pro" ? "bg-gradient-to-br from-violet-500 to-purple-600" : "bg-gradient-to-br from-gray-700 to-gray-900"} text-white hover:scale-[1.02] transition-transform`}>
                          <div className="flex items-center gap-3 mb-3">
                            {currentPlan === "max" ? <Crown size={24} /> : currentPlan === "pro" ? <Sparkles size={24} /> : <Shield size={24} />}
                            <span className="font-semibold">{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan</span>
                          </div>
                          <p className="text-sm opacity-90">
                            {planActive && planExpiry
                              ? `Renews ${new Date(planExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                              : currentPlan === "free" ? "Upgrade to unlock premium features" : "Manage your subscription"}
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 flex items-center justify-between overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 blur-[100px]" />
                    <div className="relative z-10 max-w-xl">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white mb-4">
                        <Gift size={14} /> Referral Program
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-2">Invite friends & earn ₹500</h3>
                      <p className="text-gray-400 mb-6">Share your referral code and get rewarded when your friends make their first booking</p>
                      <div className="flex items-center gap-3">
                        <div className="px-5 py-3 bg-white/10 border border-white/20 rounded-xl font-mono text-white font-semibold tracking-wider">
                          PLANWAB2025
                        </div>
                        <button onClick={copyReferralCode} className={`px-5 py-3 rounded-xl font-medium transition-all ${copiedCode ? "bg-emerald-500 text-white" : "bg-white text-gray-900 hover:bg-violet-100"}`}>
                          {copiedCode ? <><Check size={16} className="inline mr-1" /> Copied</> : <><Copy size={16} className="inline mr-1" /> Copy Code</>}
                        </button>
                      </div>
                    </div>
                    <div className="relative hidden lg:block">
                      <div className="w-48 h-48 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl">
                        <Gift size={64} className="text-white -rotate-12" />
                      </div>
                    </div>
                  </div> */}
                </motion.div>
              )}

              {activeSection === "bookings" && (
                <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
                      <p className="text-gray-500 mt-1">{orders.length} total bookings{pendingCount > 0 ? `, ${pendingCount} pending` : ""}</p>
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <EmptyState icon={Package} title="No bookings yet" description="Start exploring vendors to make your first booking" action={{ label: "Browse Vendors", href: "/vendors/marketplace" }} />
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                      <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {orders.map((order) => (
                          <div key={order._id} onClick={() => setSelectedOrder(order)} className="flex items-center gap-5 p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                              <img src={order.items?.[0]?.image || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white">{order.items?.[0]?.name || "Service"}</h3>
                                  <p className="text-sm text-gray-500 mt-0.5">{order.event?.type}</p>
                                </div>
                                <StatusBadge status={order.orderStatus} />
                              </div>
                              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5">
                                  <Calendar size={14} />
                                  {order.event?.date ? new Date(order.event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Users size={14} />
                                  {order.event?.guests || "—"} guests
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-lg font-bold text-gray-900 dark:text-white">₹{order.pricing?.total?.toLocaleString()}</p>
                              <p className="text-xs text-gray-400 mt-1">Order #{order._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <ChevronRight size={20} className="text-gray-300 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {totalSpent > 0 && (
                    <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 font-medium">Total Spent on Bookings</p>
                        <p className="text-3xl font-bold text-white mt-1">₹{totalSpent.toLocaleString()}</p>
                      </div>
                      <CreditCard size={32} className="text-gray-600" />
                    </div>
                  )}
                </motion.div>
              )}

              {activeSection === "collection" && (
                <motion.div key="collection" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Collection</h1>
                    <p className="text-gray-500 mt-1">{totalSaved} saved items across all categories</p>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="p-1 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex gap-1">
                        {COLLECTION_TABS.map((tab) => {
                          const isActive = activeCollectionTab === tab.id;
                          const count = tabCounts[tab.id];
                          return (
                            <button
                              key={tab.id}
                              onClick={() => handleCollectionTabChange(tab.id)}
                              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                isActive ? "bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                            >
                              <tab.icon size={16} />
                              {tab.label}
                              {count > 0 && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"}`}>
                                  {count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-6">
                      <AnimatePresence mode="wait">
                        <motion.div key={activeCollectionTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                          {activeCollectionTab === "vendors" && (
                            tabCounts.vendors === 0 ? (
                              <EmptyState icon={Store} title="No saved vendors" description="Explore and save vendors you love to access them quickly" action={{ label: "Browse Vendors", href: "/vendors/marketplace" }} />
                            ) : (
                              <div className="space-y-8">
                                {lists.vendors.liked.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-4">
                                      <Heart size={16} className="text-rose-500" />
                                      <h3 className="font-semibold text-gray-900 dark:text-white">Liked ({lists.vendors.liked.length})</h3>
                                    </div>
                                    <CollectionGrid items={lists.vendors.liked} renderItem={(v) => <VendorCard vendor={v} />} />
                                  </div>
                                )}
                                {lists.vendors.watchlist.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-4">
                                      <Bookmark size={16} className="text-violet-500" />
                                      <h3 className="font-semibold text-gray-900 dark:text-white">Watchlist ({lists.vendors.watchlist.length})</h3>
                                    </div>
                                    <CollectionGrid items={lists.vendors.watchlist} renderItem={(v) => <VendorCard vendor={v} />} />
                                  </div>
                                )}
                              </div>
                            )
                          )}

                          {activeCollectionTab === "reels" && (
                            tabCounts.reels === 0 ? (
                              <EmptyState icon={Film} title="No saved reels" description="Watch reels and save the ones you enjoy" action={{ label: "Explore Reels", href: "/ideas" }} />
                            ) : (
                              <div className="space-y-8">
                                {lists.reels.liked.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-4">
                                      <Heart size={16} className="text-rose-500" />
                                      <h3 className="font-semibold text-gray-900 dark:text-white">Liked Reels ({lists.reels.liked.length})</h3>
                                    </div>
                                    <CollectionGrid items={lists.reels.liked} renderItem={(r) => <ReelCard reel={r} />} columns={5} />
                                  </div>
                                )}
                                {lists.reels.watchlist.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-4">
                                      <Bookmark size={16} className="text-violet-500" />
                                      <h3 className="font-semibold text-gray-900 dark:text-white">Watchlist ({lists.reels.watchlist.length})</h3>
                                    </div>
                                    <CollectionGrid items={lists.reels.watchlist} renderItem={(r) => <ReelCard reel={r} />} columns={5} />
                                  </div>
                                )}
                                {lists.reels.likedVendorProfileReels.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-4">
                                      <Heart size={16} className="text-rose-500" />
                                      <h3 className="font-semibold text-gray-900 dark:text-white">Liked Vendor Reels ({lists.reels.likedVendorProfileReels.length})</h3>
                                    </div>
                                    <CollectionGrid items={lists.reels.likedVendorProfileReels} renderItem={(r) => <ReelCardVP reel={r} />} columns={5} />
                                  </div>
                                )}
                                {lists.reels.watchlistVendorProfileReels.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-4">
                                      <Bookmark size={16} className="text-violet-500" />
                                      <h3 className="font-semibold text-gray-900 dark:text-white">Saved Vendor Reels ({lists.reels.watchlistVendorProfileReels.length})</h3>
                                    </div>
                                    <CollectionGrid items={lists.reels.watchlistVendorProfileReels} renderItem={(r) => <ReelCardVP reel={r} />} columns={5} />
                                  </div>
                                )}
                              </div>
                            )
                          )}

                          {activeCollectionTab === "profiles" && (
                            tabCounts.profiles === 0 ? (
                              <EmptyState icon={Users} title="No saved profiles" description="Discover and follow vendor profiles you trust" action={{ label: "Explore Vendors", href: "/vendors/marketplace" }} />
                            ) : (
                              <div className="space-y-8">
                                {lists.vendorProfiles.liked.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-4">
                                      <Heart size={16} className="text-rose-500" />
                                      <h3 className="font-semibold text-gray-900 dark:text-white">Liked ({lists.vendorProfiles.liked.length})</h3>
                                    </div>
                                    <CollectionGrid items={lists.vendorProfiles.liked} renderItem={(p) => <VProfileCard profile={p} />} columns={5} />
                                  </div>
                                )}
                                {lists.vendorProfiles.trusted.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-4">
                                      <ShieldCheck size={16} className="text-blue-500" />
                                      <h3 className="font-semibold text-gray-900 dark:text-white">Trusted ({lists.vendorProfiles.trusted.length})</h3>
                                    </div>
                                    <CollectionGrid items={lists.vendorProfiles.trusted} renderItem={(p) => <VProfileCard profile={p} />} columns={5} />
                                  </div>
                                )}
                              </div>
                            )
                          )}

                          {activeCollectionTab === "posts" && (
                            tabCounts.posts === 0 ? (
                              <EmptyState icon={ImageIcon} title="No saved posts" description="Like or save posts from vendors to view them here" action={{ label: "Explore Vendors", href: "/vendors/marketplace" }} />
                            ) : (
                              <div className="space-y-8">
                                {lists.vendorProfiles.posts.liked.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-4">
                                      <Heart size={16} className="text-rose-500" />
                                      <h3 className="font-semibold text-gray-900 dark:text-white">Liked Posts ({lists.vendorProfiles.posts.liked.length})</h3>
                                    </div>
                                    <CollectionGrid items={lists.vendorProfiles.posts.liked} renderItem={(p) => <PostCard post={p} />} columns={5} />
                                  </div>
                                )}
                                {lists.vendorProfiles.posts.watchlist.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-4">
                                      <Bookmark size={16} className="text-violet-500" />
                                      <h3 className="font-semibold text-gray-900 dark:text-white">Saved Posts ({lists.vendorProfiles.posts.watchlist.length})</h3>
                                    </div>
                                    <CollectionGrid items={lists.vendorProfiles.posts.watchlist} renderItem={(p) => <PostCard post={p} />} columns={5} />
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === "wallet" && (
                <motion.div key="wallet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wallet & Credits</h1>
                    <p className="text-gray-500 mt-1">Manage your credits and view transaction history</p>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px]" />
                      <div className="relative z-10">
                        <p className="text-sm font-medium opacity-80 mb-2">Available Balance</p>
                        <p className="text-5xl font-bold">{dbUser?.creditBalance ?? 0}</p>
                        <p className="text-sm opacity-80 mt-1">PlanWAB Credits</p>
                        <div className="flex gap-3 mt-8">
                          <button className="px-6 py-3 bg-white text-violet-700 rounded-xl font-semibold hover:bg-violet-100 transition-colors">
                            Add Credits
                          </button>
                          <button className="px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-colors">
                            Transaction History
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Credits Used</span>
                          <span className="font-semibold text-gray-900 dark:text-white">125</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Credits Earned</span>
                          <span className="font-semibold text-emerald-600">+50</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Referral Bonus</span>
                          <span className="font-semibold text-amber-600">+100</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
                      <button className="text-sm text-violet-600 font-medium hover:underline">View All</button>
                    </div>
                    <div className="p-6 text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Coins size={24} className="text-gray-300" />
                      </div>
                      <p className="text-gray-500">No transactions yet</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === "settings" && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your profile and preferences</p>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">First Name</label>
                            <input
                              value={editForm.firstName}
                              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Last Name</label>
                            <input
                              value={editForm.lastName}
                              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Email</label>
                            <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl text-gray-500 flex items-center gap-2">
                              <Mail size={16} />
                              {user.primaryEmailAddress?.emailAddress}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Phone</label>
                            <input
                              value={editForm.phone}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                              placeholder="+91 00000 00000"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Address</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Street Address</label>
                            <input
                              value={editForm.address}
                              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                              placeholder="Enter your address"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">City</label>
                              <input
                                value={editForm.city}
                                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">State</label>
                              <input
                                value={editForm.state}
                                onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Pincode</label>
                              <input
                                value={editForm.pincode}
                                onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-violet-600 dark:hover:bg-violet-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Profile Photo</h3>
                        <div className="flex flex-col items-center">
                          <img src={user.imageUrl} alt={displayName} className="w-24 h-24 rounded-2xl object-cover mb-4" />
                          <p className="text-sm text-gray-500 text-center">Manage your profile photo through Clerk account settings</p>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Status</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Email Verified</span>
                            <CheckCircle2 size={18} className="text-emerald-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Phone Verified</span>
                            {phone ? <CheckCircle2 size={18} className="text-emerald-500" /> : <AlertCircle size={18} className="text-amber-500" />}
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30 p-6">
                        <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                        <p className="text-sm text-red-500/80 mb-4">Once you delete your account, there is no going back.</p>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl z-50 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                <button onClick={() => setEditOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">First Name</label>
                    <input
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Last Name</label>
                    <input
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Phone</label>
                  <input
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+91 00000 00000"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Address</label>
                  <input
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">City</label>
                    <input
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">State</label>
                    <input
                      value={editForm.state}
                      onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Pincode</label>
                    <input
                      value={editForm.pincode}
                      onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:border-violet-400 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                <button onClick={() => setEditOpen(false)} className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveProfile} disabled={saving} className="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white dark:bg-gray-900 z-50 overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Details</h2>
                  <p className="text-sm text-gray-500 font-mono">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Status</p>
                    <div className="mt-1"><StatusBadge status={selectedOrder.orderStatus} /></div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Payment</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{selectedOrder.paymentMethod || "—"}</p>
                  </div>
                </div>

                {selectedOrder.event && (
                  <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" /> Event Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        ["Event Name", selectedOrder.event.name],
                        ["Event Type", selectedOrder.event.type],
                        ["Date", selectedOrder.event.date ? new Date(selectedOrder.event.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "—"],
                        ["Guests", selectedOrder.event.guests?.toLocaleString() || "—"],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{value || "—"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOrder.items?.length > 0 && (
                  <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Services</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          {item.image && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">₹{item.price?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOrder.pricing && (
                  <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-5 text-white">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <CreditCard size={16} /> Payment Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      {[
                        ["Subtotal", selectedOrder.pricing.subtotal],
                        ["Tax", selectedOrder.pricing.tax],
                        ["Platform Fee", selectedOrder.pricing.platformFee],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-gray-400">{label}</span>
                          <span>₹{(value || 0).toLocaleString()}</span>
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
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" /> Timeline
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.createdAt && (
                      <div className="flex items-center gap-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Order Created</p>
                          <p className="text-xs text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.updatedAt && selectedOrder.updatedAt !== selectedOrder.createdAt && (
                      <div className="flex items-center gap-4 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl">
                        <RefreshCw size={18} className="text-sky-500 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                          <p className="text-xs text-gray-500">{new Date(selectedOrder.updatedAt).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-violet-600 dark:hover:bg-violet-100 transition-colors">
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