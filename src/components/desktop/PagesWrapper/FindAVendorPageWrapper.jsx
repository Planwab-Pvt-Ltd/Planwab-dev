"use client";

import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { useCartStore } from "../../../GlobalState/CartDataStore";
import Link from "next/link";
import SmartMedia from "../SmartMediaLoader";
import { formatPrice } from "../../../lib/utils";

// =============================================================================
// DATA
// =============================================================================

const HERO_CATEGORIES = [
  { id: 1, name: "Makeup Artists", key: "makeup", image: "/quickServicesPhotos/makeupQS.png", count: "456", color: "#ec4899" },
  { id: 2, name: "Planners", key: "planners", image: "/quickServicesPhotos/plannerQS.png", count: "145", color: "#8b5cf6" },
  { id: 3, name: "Decorators", key: "decor", image: "/quickServicesPhotos/decorQS.png", count: "267", color: "#f59e0b" },
  { id: 4, name: "Photographers", key: "photographers", image: "/quickServicesPhotos/photographerQS.png", count: "198", color: "#3b82f6" },
  { id: 5, name: "Venues", key: "venues", image: "/quickServicesPhotos/venueQS.png", count: "476", color: "#0ea5e9" },
  { id: 6, name: "Mehendi", key: "mehendi", image: "/quickServicesPhotos/mehndiQS.png", count: "156", color: "#d946ef" },
  { id: 7, name: "Caterers", key: "catering", image: "/quickServicesPhotos/caterorQS.png", count: "189", color: "#14b8a6" },
  { id: 8, name: "DJ & Music", key: "djs", image: "/quickServicesPhotos/djQS.png", count: "97", color: "#6366f1" },
];

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const DesktopHero = memo(() => {
  const router = useRouter();
  
  return (
    <div className="relative w-full bg-slate-900 rounded-[48px] overflow-hidden mb-10 min-h-[500px] flex items-center shadow-2xl p-1 py-4">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-600/20 to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10 grid lg:grid-cols-2 gap-12 px-12 items-center w-full">
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-6">
              Premium Vendor Marketplace
            </span>
            <h1 className="text-6xl font-black text-white leading-tight tracking-tighter">
              Your Dream Wedding, <br />
              <span className="bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                Expertly Curated.
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg mt-6 font-medium">
              Browse through 5000+ verified premium vendors. From majestic venues to artistic photographers, find everything in one place.
            </p>
          </motion.div>

          <div className="relative max-w-md group">
            <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative flex items-center bg-white rounded-2xl p-2">
              <Search className="text-slate-400 ml-4" size={20} />
              <input 
                type="text" 
                placeholder="Search category, city or vendor name..." 
                className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm font-bold text-slate-900"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-black text-sm transition-all">
                SEARCH
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-4 gap-4 p-4">
          {HERO_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.05 }}
              onClick={() => router.push(`/vendors/marketplace/${cat.key}`)}
              className="relative aspect-square rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-white/10 group"
            >
              <SmartMedia src={cat.image} alt={cat.name} type="image" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <p className="text-[10px] font-black text-white truncate leading-none uppercase tracking-tighter">{cat.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
});

const VendorCard = memo(({ vendor }) => {
  const router = useRouter();
  const { addToCart, removeFromCart, cartItems } = useCartStore();
  const vendorId = vendor._id || vendor.id;
  const inCart = useMemo(() => cartItems?.some((item) => (item._id || item.id) === vendorId), [cartItems, vendorId]);

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
      className="flex-shrink-0 w-64 bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer"
    >
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <SmartMedia src={vendor?.defaultImage || vendor.images?.[0]} type="image" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-4 right-4">
          <button className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500 transition-colors shadow-sm">
            <Heart size={18} />
          </button>
        </div>
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
            <h3 className="font-black text-slate-900 text-base leading-tight truncate group-hover:text-indigo-600 transition-colors">{vendor.name}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{vendor.category}</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-600">
            <Star size={12} className="fill-amber-600" />
            <span className="text-xs font-black">{vendor.rating || '4.8'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
          <MapPin size={14} className="text-slate-300 flex-shrink-0" />
          <span className="truncate">{renderAddress()}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">Starting</p>
            <p className="text-lg font-black text-slate-900">₹{formatPrice(vendor.perDayPrice?.min || vendor.price || 0)}</p>
          </div>
          <button
            onClick={handleCart}
            className={`p-3.5 rounded-2xl transition-all duration-300 ${
              inCart ? "bg-green-600 text-white shadow-lg shadow-green-100" : "bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:-translate-y-1"
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
  const scrollRef = useRef(null);
  const router = useRouter();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  const scroll = (dir) => {
    if (scrollRef.current) {
      // Increased scroll amount to move roughly 3 full cards (256px card + 24px gap = 280px per unit)
      const scrollAmount = dir === 'left' ? -840 : 840;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6 relative group/section">
      <div className="flex items-end justify-between mb-6 px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${color}15` }}>
            <Icon size={24} style={{ color }} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
            <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em]">{subtitle}</p>
          </div>
        </div>
        <button onClick={() => router.push('/vendors/marketplace')} className="text-xs font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all uppercase tracking-widest">
          View All
        </button>
      </div>

      <div className="relative">
        <AnimatePresence>
          {showLeft && (
            <motion.button 
              key="prev-btn"
              initial={{ opacity: 0, x: 20, scale: 0.8 }} 
              animate={{ opacity: 1, x: 0, scale: 1 }} 
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => scroll('left')}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white shadow-2xl border border-slate-100 hover:scale-110 active:scale-90 transition-all text-slate-900 group"
            >
              <ChevronLeft size={24} strokeWidth={3} className="group-hover:-translate-x-0.5 transition-transform" />
            </motion.button>
          )}
          {showRight && (
            <motion.button 
              key="next-btn"
              initial={{ opacity: 0, x: -20, scale: 0.8 }} 
              animate={{ opacity: 1, x: 0, scale: 1 }} 
              exit={{ opacity: 0, x: -20, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => scroll('right')}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white shadow-2xl border border-slate-100 hover:scale-110 active:scale-90 transition-all text-slate-900 group"
            >
              <ChevronRight size={24} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-8 px-2 snap-x"
        >
          {isLoading ? (
            [...Array(5)].map((_, i) => <div key={i} className="flex-shrink-0 w-64 h-80 bg-slate-100 animate-pulse rounded-[32px]" />)
          ) : (
            <>
              {vendors.map((v) => <VendorCard key={v._id || v.id} vendor={v} />)}
              <div className="flex-shrink-0 w-64 h-auto rounded-[32px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-8 group cursor-pointer hover:border-indigo-200 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-300">
                  <Plus size={28} />
                </div>
                <p className="font-black text-slate-800 text-sm">Explore More</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">100+ More {title}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
});

// =============================================================================
// MAIN PAGE
// =============================================================================

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
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-7xl mx-auto px-8 py-12 pt-20">
        <DesktopHero />

        <div className="space-y-4">
          <VendorCarousel title="Handpicked Featured" subtitle="The gold standard of services" vendors={sections.featured.data} icon={Sparkles} color="#f59e0b" isLoading={sections.featured.loading} />
          <div className="h-px bg-slate-100" />
          <VendorCarousel title="Premium Venues" subtitle="Find your perfect stage" vendors={sections.venues.data} icon={Home} color="#0ea5e9" isLoading={sections.venues.loading} />
          <VendorCarousel title="Wedding Planners" subtitle="Expertly managed celebrations" vendors={sections.planners.data} icon={Calendar} color="#8b5cf6" isLoading={sections.planners.loading} />
          <VendorCarousel title="Top Photographers" subtitle="Freeze your best memories" vendors={sections.photographers.data} icon={Camera} color="#3b82f6" isLoading={sections.photographers.loading} />
          <VendorCarousel title="Makeup Artists" subtitle="Look your absolute best" vendors={sections.makeup.data} icon={Palette} color="#ec4899" isLoading={sections.makeup.loading} />
          <VendorCarousel title="Best Catering" subtitle="Delicious food for guests" vendors={sections.catering.data} icon={Utensils} color="#14b8a6" isLoading={sections.catering.loading} />
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