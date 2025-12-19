"use client";

import React, { useState, useEffect, Suspense, useMemo, memo, useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ChevronDown,
  Search,
  MapPin,
  X,
  Navigation,
  SlidersHorizontal,
  Clock,
  TrendingUp,
  Building2,
  Home,
  Briefcase,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import SmartMedia from "./SmartMediaLoader";

// --- 1. STATIC DATA (Moved Outside to prevent Re-allocation) ---
const POPULAR_CITIES = [
  { id: 1, name: "New Delhi", state: "Delhi", icon: "🏛️" },
  { id: 2, name: "Mumbai", state: "Maharashtra", icon: "🌊" },
  { id: 3, name: "Bangalore", state: "Karnataka", icon: "💻" },
  { id: 4, name: "Gurgaon", state: "Haryana", icon: "🏢" },
  { id: 5, name: "Pune", state: "Maharashtra", icon: "🎓" },
  { id: 6, name: "Hyderabad", state: "Telangana", icon: "🍛" },
];

const SAVED_ADDRESSES = [
  {
    id: "home",
    label: "Home",
    address: "B-204, Ashoka Apartments",
    area: "Sector 18, Rohini",
    city: "New Delhi, Delhi 110085",
    icon: Home,
  },
  {
    id: "work",
    label: "Work",
    address: "Tower B, 5th Floor",
    area: "DLF Cyber Hub",
    city: "Gurgaon, Haryana 122002",
    icon: Briefcase,
  },
];

const RECENT_SEARCHES = [
  { id: "r1", name: "Punjabi Bagh Club", area: "West Delhi" },
  { id: "r2", name: "Aerocity Worldmark", area: "Aerocity" },
];

const TABS_CONFIG = [
  {
    id: "Wedding",
    label: "Wedding",
    styles: "bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900",
    image: "/WeddingCat.png",
    src: "/WeddingHeaderCard.png",
    placeholders: ["Wedding Venues", "Bridal Makeup", "Mehndi Artists"],
  },
  {
    id: "Anniversary",
    label: "Anniversary",
    styles: "bg-gradient-to-r from-gray-900 via-pink-700 to-gray-900",
    image: "/AnniversaryCat.png",
    src: "/AnniversaryHeaderCard.png",
    placeholders: ["Romantic Dinner", "Flower Bouquets", "Couple Spa"],
  },
  {
    id: "Birthday",
    label: "Birthday",
    styles: "bg-gradient-to-r from-gray-900 via-yellow-600 to-gray-900",
    image: "/BirthdayCat.png",
    src: "/BirthdayHeaderCard.png",
    placeholders: ["Birthday Cakes", "Party Decor", "Event Planners"],
  },
];

// --- 2. OPTIMIZED SUB-COMPONENTS ---

// A. Ticker Component (Isolates the 3-second re-render)
const SearchPlaceholderTicker = memo(({ placeholders }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders]);

  return (
    <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-[13px] font-semibold text-white/70 w-full truncate"
        >
          Search "{placeholders[index]}"...
        </motion.span>
      </AnimatePresence>
    </div>
  );
});

// B. Category Button (Memoized to prevent flickering)
const CategoryButton = memo(({ category, imageSrc, active, onClick, styles, src }) => (
  <div
    role="button"
    onClick={onClick}
    className={`
        relative flex-1 h-12 mx-0.5 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer transform-gpu
        ${active ? `flex items-center justify-center space-x-1 px-3 ${styles}` : "bg-gray-100"}
    `}
  >
    {active ? (
      <>
        <div className="relative flex items-center justify-center z-10 shrink-0 pb-2">
          {/* Use specific sizing to prevent layout shift */}
          <img
            src={imageSrc}
            alt={category}
            className={`object-contain ${category === "Anniversary" ? "w-7 h-9" : "w-10 h-15"}`}
            loading="lazy"
          />
        </div>
        <span className="whitespace-nowrap text-sm font-bold text-white z-10 truncate">{category}</span>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-white/50 rounded-full w-[70%] z-10" />
      </>
    ) : (
      <div className="absolute inset-0 w-full h-full opacity-80 grayscale-[0.3]">
        <SmartMedia
          src={src}
          type="image"
          alt={category}
          className="w-full h-full object-cover"
          width={100}
          height={50}
        />
      </div>
    )}
  </div>
));

// --- 3. MAIN COMPONENT LOGIC ---

const HeaderLogic = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Optimized State
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(SAVED_ADDRESSES[0]);

  // Derived State
  const activeTabId = searchParams.get("category");
  const currentTab = useMemo(() => TABS_CONFIG.find((t) => t.id === activeTabId) || TABS_CONFIG[0], [activeTabId]);
  const isHomePage = pathname === "/m" || pathname === "/"; // Adjust based on your route

  // --- SCROLL LOGIC (Optimized) ---
  // "Disappear when scrolled up, appear only when scroll downwards, after 200px"
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

    // Logic:
    // 1. Must be past 200px from top
    // 2. Must be scrolling DOWN (latest > previous)
    // 3. If scrolling UP, hide it.

    if (latest > 200 && latest > previous) {
      if (!isStickyVisible) setIsStickyVisible(true);
    } else {
      if (isStickyVisible) setIsStickyVisible(false);
    }
  });

  const handleCategoryClick = useCallback(
    (id) => {
      const targetCategory = id === activeTabId ? "Default" : id;

      startTransition(() => {
        router.push(`?category=${targetCategory}`, { scroll: false });
      });
    },
    [activeTabId, router]
  );

  return (
    <>
      {/* --- Loading Overlay --- */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-gradient-to-br from-amber-50 via-white to-white flex items-center justify-center z-[9999]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex items-center justify-center w-full h-full max-w-md max-h-md"
            >
              <video src="/Loading/loading1.mp4" alt="PlanWAB Loader" width={280} height={280} autoPlay muted loop />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO HEADER (Absolute) --- */}
      {isHomePage && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-full z-50 pointer-events-none" // pointer-events-none allows clicks to pass through when hidden
            animate={{ opacity: isStickyVisible ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="pt-1 pb-2 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-auto">
              {/* Categories */}
              <div className="px-1 mb-2">
                <div className="flex items-center justify-between bg-white/10 rounded-2xl p-1.5 backdrop-blur-sm border border-white/10">
                  {TABS_CONFIG.map((tab) => (
                    <CategoryButton
                      key={tab.id}
                      category={tab.label}
                      styles={tab.styles}
                      imageSrc={tab.image}
                      src={tab.src}
                      active={activeTabId === tab.id}
                      onClick={() => handleCategoryClick(tab.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Address Pill */}
              <div className="px-3 mb-3">
                <button
                  onClick={() => setIsAddressDrawerOpen(true)}
                  className="w-full flex items-center gap-3 bg-white/10 rounded-2xl p-2 pr-4 backdrop-blur-md border border-white/10 active:scale-[0.98] transition-transform"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                    <MapPin size={20} fill="white" fillOpacity={0.3} />
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[15px] font-bold text-white truncate max-w-[200px]">
                        {selectedAddress.label}
                      </span>
                      <ChevronDown size={14} className="text-white/80" />
                    </div>
                    <p className="text-[11px] text-white/90 truncate font-medium">
                      {selectedAddress.area}, {selectedAddress.city.split(",")[0]}
                    </p>
                  </div>
                </button>
              </div>

              {/* Search Bar */}
              <div className="px-3 flex items-center gap-3">
                <div className="flex-1 h-12 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center px-4 relative active:scale-[0.99] transition-transform">
                  <Search className="text-white/70 w-5 h-5 mr-3 shrink-0" strokeWidth={2.5} />
                  <div className="relative flex-1 h-full">
                    {!searchQuery && <SearchPlaceholderTicker placeholders={currentTab.placeholders} />}
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-full bg-transparent border-none outline-none text-sm text-white font-semibold relative z-10 placeholder-transparent"
                    />
                  </div>
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="p-1 bg-white/20 rounded-full z-10">
                      <X size={12} className="text-white" />
                    </button>
                  )}
                </div>
                <button className="h-12 w-12 bg-white/15 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 text-white active:scale-95 transition-transform">
                  <SlidersHorizontal size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* --- STICKY HEADER (Fixed, Scroll Aware) --- */}
          <motion.div
            className="fixed top-0 left-0 w-full z-[60] bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100 will-change-transform"
            initial={{ y: -100 }}
            animate={{ y: isStickyVisible ? 0 : -150 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }} // Snappy spring
          >
            <div className="px-2 py-2">
              {/* Compact Categories */}
              <div className="mb-2 overflow-x-auto scrollbar-hide no-scrollbar">
                <div className="flex items-center gap-1 min-w-max">
                  {TABS_CONFIG.map((tab) => (
                    <CategoryButton
                      key={tab.id}
                      category={tab.label}
                      styles={tab.styles}
                      imageSrc={tab.image}
                      src={tab.src}
                      active={activeTabId === tab.id}
                      onClick={() => handleCategoryClick(tab.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Compact Search & Location */}
              <div className="flex items-center gap-2 px-1">
                <div className="flex-1 h-10 bg-gray-100 rounded-xl flex items-center px-3 relative">
                  <Search className="text-gray-400 w-4 h-4 mr-2" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${currentTab.label}...`}
                    className="w-full h-full bg-transparent border-none outline-none text-xs text-gray-800 font-medium placeholder-gray-400"
                  />
                </div>
                <button
                  onClick={() => setIsAddressDrawerOpen(true)}
                  className="h-10 px-3 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <MapPin size={16} className="fill-blue-200" />
                  <span className="text-[10px] font-bold max-w-[80px] truncate">{selectedAddress.label}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* --- ADDRESS DRAWER (Isolated Component) --- */}
      <AddressDrawer
        isOpen={isAddressDrawerOpen}
        onClose={() => setIsAddressDrawerOpen(false)}
        onSelect={(addr) => setSelectedAddress(addr)}
      />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

// --- 4. ISOLATED HEAVY COMPONENTS ---

// Move AddressDrawer out so its heavy rendering logic doesn't impact scroll
const AddressDrawer = memo(({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState("");

  // Use CSS visibility for performance instead of unmounting if used frequently,
  // but AnimatePresence is fine for this use case.
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[80] h-[75vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 pt-4 pb-2 bg-white sticky top-0 z-10">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Select Location</h3>
                <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="relative mb-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for area, street name..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto px-5 pb-8">
              {/* Current Location Button */}
              <button className="w-full flex items-center gap-4 p-4 mt-2 rounded-2xl bg-blue-50 border border-blue-100 active:scale-[0.98] transition-transform">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Navigation size={20} className="fill-current" />
                </div>
                <div className="text-left">
                  <p className="text-blue-900 font-bold text-sm">Use Current Location</p>
                  <p className="text-xs text-blue-600/80 font-medium">Using GPS</p>
                </div>
              </button>

              {/* Saved Addresses */}
              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Saved Addresses</p>
                <div className="space-y-3">
                  {SAVED_ADDRESSES.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => {
                        onSelect(addr);
                        onClose();
                      }}
                      className="w-full flex items-start gap-3 p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 text-left transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <addr.icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{addr.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">{addr.area}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Cities Grid */}
              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Popular Cities</p>
                <div className="grid grid-cols-3 gap-3">
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        onSelect({ label: city.name, area: "City Center", city: city.name, id: city.id });
                        onClose();
                      }}
                      className="flex flex-col items-center gap-2 py-3 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 active:scale-95 transition-all"
                    >
                      <span className="text-2xl filter drop-shadow-sm">{city.icon}</span>
                      <span className="text-[11px] font-bold text-gray-700">{city.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

// --- 5. WRAPPER FOR NEXT.JS ROUTER SUSPENSE ---
const MobileHeader = () => {
  return (
    <Suspense fallback={<div className="h-20 w-full bg-transparent" />}>
      <HeaderLogic />
    </Suspense>
  );
};

export default MobileHeader;
