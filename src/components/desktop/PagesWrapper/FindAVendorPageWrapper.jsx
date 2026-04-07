"use client";

import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
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
  Search,
  Loader2,
} from "lucide-react";
import { useCartStore } from "../../../GlobalState/CartDataStore";
import Link from "next/link";
import SmartMedia from "../SmartMediaLoader";
import { formatPrice } from "../../../lib/utils";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { ScrollCarousel } from "./IdeasPageWrapper";

const HERO_CATEGORIES = [
  { id: 1, name: "Makeup Artists", key: "makeup", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428617/MakeUpCat_lcp68d.png", count: "456", color: "#ec4899" },
  { id: 2, name: "Planners", key: "planners", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428626/PlannerCat_p16v2m.png", count: "145", color: "#8b5cf6" },
  { id: 3, name: "Decorators", key: "decor", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428613/DholCat_swqr0p.png", count: "267", color: "#f59e0b" },
  { id: 4, name: "Photographers", key: "photographers", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428623/PhotographerCat_ymq0vh.png", count: "198", color: "#3b82f6" },
  { id: 5, name: "Venues", key: "venues", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1775567028/VenuesCat_hgj3l0.png", count: "476", color: "#0ea5e9" },
  { id: 6, name: "Mehendi", key: "mehendi", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428620/MehndiCat_hdsxxo.png", count: "156", color: "#d946ef" },
  { id: 7, name: "Caterers", key: "catering", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428610/CaterorsCat_pch4d5.png", count: "189", color: "#14b8a6" },
  { id: 8, name: "DJ & Music", key: "djs", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428615/DJCat_hay9fu.png", count: "97", color: "#6366f1" },
];

const DesktopHero = memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const formatEventName = (path) => {
    if (!path) return "Wedding";
    const segments = path.split('?')[0].split('/').filter(Boolean);
    const last = segments[segments.length - 1];
    if (!last || ['explore', 'marketplace', 'vendors'].includes(last.toLowerCase())) return "Wedding";
    return last.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const eventName = formatEventName(pathname);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/vendors/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const mosaicImages = [
    { id: 1, src: HERO_CATEGORIES[0].image, name: HERO_CATEGORIES[0].name, key: HERO_CATEGORIES[0].key, size: "w-64 h-80", pos: "top-0 left-6", delay: 0.1, rotate: -6 },
    { id: 2, src: HERO_CATEGORIES[1].image, name: HERO_CATEGORIES[1].name, key: HERO_CATEGORIES[1].key, size: "w-56 h-72", pos: "top-4 right-14", delay: 0.3, rotate: 8 },
    { id: 3, src: HERO_CATEGORIES[2].image, name: HERO_CATEGORIES[2].name, key: HERO_CATEGORIES[2].key, size: "w-72 h-72", pos: "top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2", delay: 0.5, rotate: 2 }, // Center focus
    { id: 4, src: HERO_CATEGORIES[3].image, name: HERO_CATEGORIES[3].name, key: HERO_CATEGORIES[3].key, size: "w-52 h-72", pos: "bottom-0 left-20", delay: 0.2, rotate: -8 },
    { id: 5, src: HERO_CATEGORIES[4].image, name: HERO_CATEGORIES[4].name, key: HERO_CATEGORIES[4].key, size: "w-44 h-56", pos: "bottom-4 right-12", delay: 0.4, rotate: 5 },
    { id: 6, src: HERO_CATEGORIES[5].image, name: HERO_CATEGORIES[5].name, key: HERO_CATEGORIES[5].key, size: "w-36 h-48", pos: "top-1/2 -translate-y-[150%] left-[45%]", delay: 0.6, rotate: -3 },
    { id: 7, src: HERO_CATEGORIES[6].image, name: HERO_CATEGORIES[6].name, key: HERO_CATEGORIES[6].key, size: "w-40 h-52", pos: "top-1/2 translate-x-[20%] right-6", delay: 0.7, rotate: -5 },
    { id: 8, src: HERO_CATEGORIES[7].image, name: HERO_CATEGORIES[7].name, key: HERO_CATEGORIES[7].key, size: "w-48 h-56", pos: "top-1/2 -translate-y-[20%] left-[-2%]", delay: 0.8, rotate: 10 },
  ];

  return (
    <div className="relative w-full bg-white dark:bg-slate-900 rounded-[48px] overflow-hidden mb-16 min-h-[600px] flex items-center shadow-sm border border-slate-100 dark:border-slate-800 p-8 lg:p-16 transition-colors duration-500">
      <div className="relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-24 xl:gap-32 items-center w-full">
        {/* Left Section: Content & Search (Image 3 Style) */}
        <div className="space-y-10 max-w-xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="inline-block px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-semibold uppercase tracking-[0.3em] transition-colors duration-500">
                Premium Vendor Marketplace
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight transition-colors duration-500">
                Your Dream <br />
                {eventName}, <br />
                <span className="text-slate-600 dark:text-slate-300 font-medium transition-colors duration-500">Expertly Curated.</span>
              </h1>
              <div className="w-24 h-1.5 bg-slate-900 dark:bg-white rounded-full transition-colors duration-500" />
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-xl leading-relaxed font-medium transition-colors duration-500">
              Browse through 5000+ verified premium vendors. From majestic venues to artistic photographers, find everything in one place.
            </p>
          </motion.div>

          <div className="space-y-8">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-[0.2em] transition-colors duration-500">Join us to explore</h3>
            <div className="relative group max-w-lg">
              <div className="absolute inset-0 bg-slate-900 dark:bg-indigo-500 rounded-3xl blur-xl opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity" />
              <form onSubmit={handleSearch} className="relative flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 shadow-xl transition-all group-focus-within:border-slate-900 dark:group-focus-within:border-slate-500">
                <Search className="text-slate-400 dark:text-slate-500 ml-4" size={22} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search category, city or vendor name..." 
                  className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-500"
                />
                <button type="submit" className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white px-8 py-3.5 rounded-xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-lg">
                  SEARCH
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Section: Image Mosaic (Image 1 Style) */}
        <div className="relative h-[600px] hidden lg:block overflow-visible">
           {mosaicImages.map((img) => (
             <motion.div
               key={img.id}
               onClick={() => router.push(`/vendors/marketplace/${img.key}`)}
               initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
               animate={{ 
                 opacity: 1, 
                 scale: 1, 
                 rotate: img.rotate,
                 y: [0, -15, 0],
               }}
               transition={{ 
                 opacity: { duration: 0.8, delay: img.delay },
                 scale: { duration: 0.8, delay: img.delay },
                 rotate: { duration: 1, delay: img.delay },
                 y: {
                   duration: 5,
                   repeat: Infinity,
                   ease: "easeInOut",
                   delay: img.delay * 2
                 }
               }}
               className={`absolute ${img.pos} ${img.size} rounded-[32px] overflow-hidden shadow-2xl border-4 border-white cursor-pointer group`}
               whileHover={{ scale: 1.05, zIndex: 50, rotate: 0, transition: { duration: 0.3 } }}
             >
               <SmartMedia 
                 src={img.src} 
                 className="w-full h-full object-cover grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" 
               />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span className="text-white font-black text-xl tracking-wider text-center px-4 drop-shadow-md">
                   {img.name}
                 </span>
               </div>
             </motion.div>
           ))}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-slate-100/50 dark:bg-slate-800/30 rounded-full -z-10 blur-[120px] transition-colors duration-500" />
        </div>
      </div>
    </div>
  );
});

const VendorCard = memo(({ vendor, user }) => {
  const router = useRouter();
  const { addToCart, removeFromCart, cartItems } = useCartStore();
  const vendorId = vendor._id || vendor.id;
  const inCart = useMemo(() => cartItems?.some((item) => (item._id || item.id) === vendorId), [cartItems, vendorId]);

  const [isLiked, setIsLiked] = useState(false);
  const [likingLoading, setLikingLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    if (!user?.id || !vendorId) return;
    let cancelled = false;

    const fetchStatus = async () => {
      setStatusLoading(true);
      try {
        const res = await fetch("/api/user/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId: vendorId, userId: user.id }),
        });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setIsLiked(data.isLiked);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      } finally {
        if (!cancelled) {
          setStatusLoading(false);
        }
      }
    };

    fetchStatus();
    return () => {
      cancelled = true;
    };
  }, [user?.id, vendorId]);

  const handleToggleLike = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!user?.id) {
        toast.error("Please login to like vendors");
        return;
      }
      if (likingLoading) return;

      setLikingLoading(true);
      const prevLiked = isLiked;
      setIsLiked(!prevLiked);

      try {
        const res = await fetch("/api/user/toggle-like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId: vendorId, userId: user.id }),
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        toast.success(data.message);
      } catch (error) {
        setIsLiked(prevLiked);
        toast.error("Something went wrong");
      } finally {
        setLikingLoading(false);
      }
    },
    [user?.id, vendorId, isLiked, likingLoading],
  );

  const handleCart = (e) => {
    e.stopPropagation();
    if (inCart) removeFromCart(vendorId);
    else addToCart({ ...vendor, id: vendorId, quantity: 1 });
  };

  const renderAddress = () => {
    if (!vendor.address) return "Local Service";
    if (typeof vendor.address === 'object') {
      return `${vendor.address.city || ''}${vendor.address.state ? `, ${vendor.address.state}` : ''}`.replace(/^, /, '');
    }
    return vendor.address;
  };

  return (
    <motion.div 
      onClick={() => router.push(`/vendor/${vendor.category?.toLowerCase() || 'service'}/${vendorId}`)}
      className="flex-shrink-0 w-64 bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl dark:hover:shadow-indigo-900/20 transition-all duration-500 group cursor-pointer snap-start"
    >
      <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <SmartMedia src={vendor?.defaultImage || vendor.images?.[0]} type="image" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <motion.button
          whileHover={{ scale: likingLoading || statusLoading ? 1 : 1.1 }}
          whileTap={{ scale: likingLoading || statusLoading ? 1 : 0.9 }}
          onClick={handleToggleLike}
          disabled={likingLoading || statusLoading}
          className={`absolute top-4 right-4 p-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300 ${
            likingLoading || statusLoading ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          {likingLoading || statusLoading ? (
            <Loader2 size={18} className="animate-spin text-slate-400" />
          ) : (
            <Heart
              size={18}
              className={`transition-colors ${
                isLiked ? "fill-rose-500 text-rose-500" : "text-slate-400 hover:text-rose-500"
              }`}
            />
          )}
        </motion.button>
        {vendor.verified && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-indigo-600/90 backdrop-blur-md text-white flex items-center gap-1.5 shadow-lg">
            <Check size={10} strokeWidth={4} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Verified</span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-slate-900 dark:text-white text-base leading-tight truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{vendor.name}</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{vendor.category}</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Star size={12} className="fill-amber-600 dark:fill-amber-400" />
            <span className="text-xs font-black">{vendor.rating || '4.8'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium transition-colors">
          <MapPin size={14} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
          <span className="truncate">{renderAddress()}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800 transition-colors">
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter leading-none">Starting</p>
            <p className="text-lg font-black text-slate-900 dark:text-white transition-colors">₹{formatPrice(vendor.perDayPrice?.min || vendor.price || 0)}</p>
          </div>
          <button
            onClick={handleCart}
            className={`p-3.5 rounded-2xl transition-all duration-300 ${
              inCart ? "bg-green-600 dark:bg-green-500 text-white shadow-lg shadow-green-100 dark:shadow-green-900/20" : "bg-slate-900 dark:bg-slate-800 text-white shadow-lg shadow-slate-200 dark:shadow-slate-900/50 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:-translate-y-1"
            }`}
          >
            {inCart ? <Check size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export const VendorCarousel = memo(({ title, subtitle, vendors, icon: Icon, color, isLoading }) => {
  const router = useRouter();
  const { user } = useUser();

  const viewMoreUrl = useMemo(() => {
    const base = '/vendors/marketplace';
    const params = new URLSearchParams();
    const t = title.toLowerCase();
    if (t.includes('featured') || t.includes('handpicked')) {
      params.set('featured', 'true');
      params.set('sortBy', 'rating');
    } else if (t.includes('venues')) {
      params.set('categories', 'venues');
      params.set('sortBy', 'price-desc');
    } else if (t.includes('planners')) {
      params.set('categories', 'planners');
      params.set('sortBy', 'rating');
    } else if (t.includes('photographers')) {
      params.set('categories', 'photographers');
      params.set('sortBy', 'rating');
      params.set('minRating', '4');
    } else if (t.includes('makeup')) {
      params.set('categories', 'makeup');
      params.set('sortBy', 'price-desc');
    } else if (t.includes('mehendi')) {
      params.set('categories', 'mehendi');
      params.set('sortBy', 'rating');
    } else if (t.includes('catering')) {
      params.set('categories', 'catering');
      params.set('sortBy', 'rating');
    } else if (t.includes('dj') || t.includes('music')) {
      params.set('categories', 'djs');
      params.set('sortBy', 'rating');
    } else if (t.includes('most booked') || t.includes('popular')) {
      params.set('sortBy', 'bookings');
    } else if (t.includes('trending')) {
      params.set('sortBy', 'bookings');
    }
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  }, [title]);

  return (
    <section className="py-6 relative group/section">
      <div className="flex items-end justify-between mb-6 px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${color}15` }}>
            <Icon size={24} style={{ color }} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white transition-colors">{title}</h2>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-[11px] uppercase tracking-[0.2em]">{subtitle}</p>
          </div>
        </div>
        <button onClick={() => router.push(viewMoreUrl)} className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-4 py-2 rounded-xl transition-all uppercase tracking-widest">
          View All
        </button>
      </div>

      <div className="relative">
        <ScrollCarousel>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={`skeleton-${i}`} className="flex-shrink-0 w-64 h-80 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[32px] snap-start" />
            ))
          ) : (
            <>
              {vendors.map((v) => (
                <div key={v._id || v.id} className="snap-start">
                  <VendorCard vendor={v} user={user} />
                </div>
              ))}
              {vendors.length > 0 && (
                <div onClick={() => router.push(viewMoreUrl)} className="flex-shrink-0 w-64 h-auto rounded-[32px] border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center p-8 group cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-colors snap-start">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-300 dark:text-slate-600">
                    <ArrowRight size={28} />
                  </div>
                  <p className="font-black text-slate-800 dark:text-white text-sm transition-colors">View All</p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-tighter">100+ More {title}</p>
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

const TrustStrip = memo(() => (
  <div className="py-4 px-2 hover:z-10 relative">
    <div className="bg-gradient-to-r from-indigo-50 dark:from-indigo-900/40 border border-slate-200 dark:border-indigo-800/50 to-purple-50 dark:to-purple-900/40 rounded-[32px] p-6 lg:py-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl dark:shadow-none hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all hover:-translate-y-1 duration-500">
      
      <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left group cursor-default">
        <div className="w-14 h-14 rounded-full bg-white dark:bg-indigo-950/50 shadow-sm flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
          <Check className="text-indigo-500 dark:text-indigo-400" size={24} strokeWidth={3} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-sm tracking-widest uppercase mb-1 transition-colors">100% Verified</h4>
          <p className="text-slate-500 dark:text-indigo-200/70 text-xs font-semibold max-w-[170px] transition-colors">Every vendor is manually checked</p>
        </div>
      </div>
      
      <div className="hidden md:block w-px h-12 bg-indigo-200 dark:bg-indigo-800/50" />
      
      <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left group cursor-default">
        <div className="w-14 h-14 rounded-full bg-white dark:bg-indigo-950/50 shadow-sm flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
          <Star className="text-amber-500 dark:text-amber-400" size={24} strokeWidth={3} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-sm tracking-widest uppercase mb-1 transition-colors">Top Rated</h4>
          <p className="text-slate-500 dark:text-indigo-200/70 text-xs font-semibold max-w-[170px] transition-colors">Only the best in the industry</p>
        </div>
      </div>

      <div className="hidden md:block w-px h-12 bg-indigo-200 dark:bg-indigo-800/50" />

      <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left group cursor-default">
        <div className="w-14 h-14 rounded-full bg-white dark:bg-indigo-950/50 shadow-sm flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
          <Heart className="text-rose-500 dark:text-rose-400" size={24} strokeWidth={3} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-sm tracking-widest uppercase mb-1 transition-colors">Loved by Couples</h4>
          <p className="text-slate-500 dark:text-indigo-200/70 text-xs font-semibold max-w-[170px] transition-colors">10,000+ happy weddings planned</p>
        </div>
      </div>
      
    </div>
  </div>
));

const ConciergeStrip = memo(() => (
  <div className="py-4 px-2 hover:z-10 relative">
    <div className="bg-gradient-to-r from-indigo-50 dark:from-indigo-900/40 border border-slate-200 dark:border-indigo-800/50 to-purple-50 dark:to-purple-900/40 rounded-[32px] p-6 lg:py-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl dark:shadow-none hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all hover:-translate-y-1 duration-500">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-white dark:bg-indigo-950/50 shadow-sm flex items-center justify-center -rotate-12 hover:rotate-0 transition-transform duration-500">
          <Sparkles className="text-indigo-500 dark:text-indigo-400" size={28} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-xl tracking-tight mb-1 transition-colors">Overwhelmed with choices?</h4>
          <p className="text-slate-500 dark:text-indigo-200/70 text-sm font-semibold transition-colors">Our expert concierge is available 24/7 to help you structure your dream event.</p>
        </div>
      </div>
      <button 
        className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-md dark:shadow-none whitespace-nowrap cursor-pointer"
        onClick={() => { try { toast.success("Our team will contact you soon!"); } catch (e) { alert("Our team will contact you soon!"); } }}
      >
        GET FREE EXPERT HELP
      </button>
    </div>
  </div>
));

const PromoStrip = memo(() => (
  <div className="py-4 px-2 hover:z-10 relative">
    <div className="bg-gradient-to-r from-indigo-50 dark:from-indigo-900/40 border border-slate-200 dark:border-indigo-800/50 to-purple-50 dark:to-purple-900/40 rounded-[32px] p-6 lg:py-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl dark:shadow-none hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all hover:-translate-y-1 duration-500">
      
      <div className="flex items-center gap-6 w-full md:w-auto">
        <div className="w-16 h-16 shrink-0 rounded-full bg-white dark:bg-indigo-950/50 shadow-sm flex items-center justify-center -rotate-12 hover:rotate-0 transition-transform duration-500">
          <Zap className="text-indigo-500 dark:text-indigo-400" size={28} />
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-xl tracking-tight mb-1 flex flex-col md:flex-row md:items-center gap-3 transition-colors">
            Wedding Season Offer 
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] uppercase tracking-widest leading-none w-max">Limited Time</span>
          </h4>
          <p className="text-slate-500 dark:text-indigo-200/70 text-sm font-semibold transition-colors">Save 25% on your first advance booking using the code below.</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center shrink-0">
        <button 
          className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white px-8 py-4 rounded-2xl font-black text-lg tracking-widest transition-all active:scale-95 shadow-md dark:shadow-none whitespace-nowrap cursor-pointer" 
          onClick={() => { navigator.clipboard?.writeText("PLANWAB25"); toast.success("Code copied!"); }}
        >
          PLANWAB25
        </button>
        <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-2 transition-colors">Click to copy</span>
      </div>
      
    </div>
  </div>
));

export default function FindAVendorPageWrapper() {
  const [sections, setSections] = useState({
    featured: { data: [], loading: true },
    planners: { data: [], loading: true },
    photographers: { data: [], loading: true },
    venues: { data: [], loading: true },
    makeup: { data: [], loading: true },
    catering: { data: [], loading: true },
    djs: { data: [], loading: true },
    mehendi: { data: [], loading: true },
  });

  const { cartItems, setOpenCartNavbar } = useCartStore();

  const fetchSection = async (key, query) => {
    try {
      const res = await fetch(`/api/vendor?${query}&limit=12`);
      const json = await res.json();
      setSections(prev => ({ ...prev, [key]: { data: json.data || [], loading: false } }));
    } catch (e) {
      setSections(prev => ({ ...prev, [key]: { data: [], loading: false } }));
    }
  };

  useEffect(() => {
    fetchSection('featured', 'featured=true&sortBy=rating');
    fetchSection('planners', 'categories=planners&sortBy=rating');
    fetchSection('photographers', 'categories=photographers&sortBy=rating');
    fetchSection('makeup', 'categories=makeup&sortBy=rating');
    fetchSection('venues', 'categories=venues&sortBy=rating');
    fetchSection('catering', 'categories=catering&sortBy=rating');
    fetchSection('djs', 'categories=djs&sortBy=rating');
    fetchSection('mehendi', 'categories=mehendi&sortBy=rating');
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors duration-500">
      <main className="max-w-7xl mx-auto px-8 py-12 pt-20">
        <DesktopHero />

        <div className="space-y-4">
          <VendorCarousel title="Handpicked Featured" subtitle="The gold standard of services" vendors={sections.featured.data} icon={Sparkles} color="#f59e0b" isLoading={sections.featured.loading} />
          <VendorCarousel title="Premium Venues" subtitle="Find your perfect stage" vendors={sections.venues.data} icon={Home} color="#0ea5e9" isLoading={sections.venues.loading} />

          <TrustStrip />

          <VendorCarousel title="Wedding Planners" subtitle="Expertly managed celebrations" vendors={sections.planners.data} icon={Calendar} color="#8b5cf6" isLoading={sections.planners.loading} />
          <VendorCarousel title="Top Photographers" subtitle="Freeze your best memories" vendors={sections.photographers.data} icon={Camera} color="#3b82f6" isLoading={sections.photographers.loading} />
          
          <ConciergeStrip />

          <VendorCarousel title="Makeup Artists" subtitle="Look your absolute best" vendors={sections.makeup.data} icon={Palette} color="#ec4899" isLoading={sections.makeup.loading} />
          <VendorCarousel title="Best Catering" subtitle="Delicious food for guests" vendors={sections.catering.data} icon={Utensils} color="#14b8a6" isLoading={sections.catering.loading} />
          
          <PromoStrip />

          <VendorCarousel title="DJ & Music" subtitle="Set the wedding mood" vendors={sections.djs.data} icon={Music} color="#6366f1" isLoading={sections.djs.loading} />
          <VendorCarousel title="Mehendi Artists" subtitle="Exquisite henna designs" vendors={sections.mehendi.data} icon={Zap} color="#d946ef" isLoading={sections.mehendi.loading} />
        </div>
      </main>

      {/* <AnimatePresence>
        {cartItems?.length > 0 && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="fixed bottom-12 right-12 z-50">
            <button 
              onClick={() => setOpenCartNavbar('open')}
              className="flex items-center gap-5 p-6 rounded-[36px] bg-slate-900 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all group"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <ShoppingBag size={28} />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center text-xs font-black border-4 border-slate-900">
                  {cartItems.length}
                </span>
              </div>
              <div className="text-left pr-4">
                <p className="text-base font-black leading-tight">View Selections</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Marketplace Cart</p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence> */}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}