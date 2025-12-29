"use client";

import React, { memo, useCallback, useState, useMemo, useRef, useEffect } from "react";
import SmartMedia from "../SmartMediaLoader";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- 1. STATIC DATA ---
const FILTERS = [
  { id: "all", label: "All Vendors" },
  { id: "planner", label: "Wedding Planners" },
  { id: "photographer", label: "Photographers" },
  { id: "makeup", label: "Makeup Artists" },
  { id: "caterer", label: "Caterers" },
  { id: "venue", label: "Venues" },
  { id: "decor", label: "Decorators" },
];

const SERVICES = [
  // --- Wedding Planners ---
  {
    id: 1,
    category: "planner",
    title: "Royal Knot Wedding Planners",
    description: "End-to-end wedding planning",
    price: "₹3,50,000 onwards",
    duration: "Full Event",
    image: "https://images.unsplash.com/photo-1529634896-269f4d0b9b6b",
  },
  {
    id: 2,
    category: "planner",
    title: "Shaadi Sutra Events",
    description: "Luxury & destination weddings",
    price: "₹4,20,000 onwards",
    duration: "Full Event",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
  },
  {
    id: 3,
    category: "planner",
    title: "The Wedding Files",
    description: "Theme-based weddings",
    price: "₹2,80,000 onwards",
    duration: "Full Event",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552",
  },
  {
    id: 4,
    category: "planner",
    title: "Vivah Creations",
    description: "Traditional & modern weddings",
    price: "₹2,50,000 onwards",
    duration: "Full Event",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2",
  },
  {
    id: 5,
    category: "planner",
    title: "DreamShaadi Planners",
    description: "Budget-friendly planning",
    price: "₹1,90,000 onwards",
    duration: "Full Event",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
  },

  // --- Photographers ---
  {
    id: 6,
    category: "photographer",
    title: "Wedding Saga Studios",
    description: "Candid & cinematic photography",
    price: "₹1,20,000 onwards",
    duration: "Per Event",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  },
  {
    id: 7,
    category: "photographer",
    title: "Lens Queen Photography",
    description: "Luxury wedding shoots",
    price: "₹1,80,000 onwards",
    duration: "Per Event",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
  },
  {
    id: 8,
    category: "photographer",
    title: "Candid Clicks",
    description: "Natural storytelling moments",
    price: "₹95,000 onwards",
    duration: "Per Event",
    image: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8",
  },
  {
    id: 9,
    category: "photographer",
    title: "Frame Story Films",
    description: "Photo + video packages",
    price: "₹1,50,000 onwards",
    duration: "Per Event",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    id: 10,
    category: "photographer",
    title: "Golden Hour Studios",
    description: "Destination weddings",
    price: "₹2,00,000 onwards",
    duration: "Per Event",
    image: "https://images.unsplash.com/photo-1521334884684-d80222895322",
  },

  // --- Makeup Artists ---
  {
    id: 11,
    category: "makeup",
    title: "Glam by Neha",
    description: "HD bridal makeup",
    price: "₹25,000",
    duration: "Per Look",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
  },
  {
    id: 12,
    category: "makeup",
    title: "Makeup Diaries",
    description: "Airbrush bridal looks",
    price: "₹30,000",
    duration: "Per Look",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 13,
    category: "makeup",
    title: "Blush & Glow Studio",
    description: "Natural glam specialist",
    price: "₹18,000",
    duration: "Per Look",
    image: "https://images.unsplash.com/photo-1526045612212-70caf35c14df",
  },
  {
    id: 14,
    category: "makeup",
    title: "Makeover by Riya",
    description: "Bridal & party makeup",
    price: "₹20,000",
    duration: "Per Look",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  },
  {
    id: 15,
    category: "makeup",
    title: "The Glam Room",
    description: "Celebrity-style makeup",
    price: "₹35,000",
    duration: "Per Look",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
  },

  // --- Caterers ---
  {
    id: 16,
    category: "caterer",
    title: "Royal Feast Caterers",
    description: "Multi-cuisine premium catering",
    price: "₹1,200 / plate",
    duration: "Per Event",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
  },
  {
    id: 17,
    category: "caterer",
    title: "Spice Route Catering",
    description: "North & South Indian",
    price: "₹850 / plate",
    duration: "Per Event",
    image: "https://images.unsplash.com/photo-1543353071-873f17a7a088",
  },
  {
    id: 18,
    category: "caterer",
    title: "Taste Buds Events",
    description: "Live counters & fusion",
    price: "₹1,000 / plate",
    duration: "Per Event",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
  },
  {
    id: 19,
    category: "caterer",
    title: "Wedding Thalis",
    description: "Traditional wedding meals",
    price: "₹700 / plate",
    duration: "Per Event",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445",
  },
  {
    id: 20,
    category: "caterer",
    title: "Elite Banquets",
    description: "Luxury buffet setup",
    price: "₹1,500 / plate",
    duration: "Per Event",
    image: "https://images.unsplash.com/photo-1555243896-c709bfa0b564",
  },

  // --- Venues ---
  {
    id: 21,
    category: "venue",
    title: "Grand Palace Lawns",
    description: "Outdoor luxury venue",
    price: "₹2,50,000",
    duration: "Per Day",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
  },
  {
    id: 22,
    category: "venue",
    title: "Royal Orchid Banquet",
    description: "Indoor AC banquet hall",
    price: "₹1,80,000",
    duration: "Per Day",
    image: "https://images.unsplash.com/photo-1503424886307-b090341d25d1",
  },
  {
    id: 23,
    category: "venue",
    title: "Lakeside Resort",
    description: "Destination wedding venue",
    price: "₹4,00,000",
    duration: "Per Day",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
  },
  {
    id: 24,
    category: "venue",
    title: "Urban Grand Ballroom",
    description: "Premium city venue",
    price: "₹3,00,000",
    duration: "Per Day",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5",
  },
  {
    id: 25,
    category: "venue",
    title: "Heritage Haveli",
    description: "Royal heritage weddings",
    price: "₹5,50,000",
    duration: "Per Day",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  },
];

// --- 2. THEME CONFIGURATION ---
const themeConfig = {
  Wedding: {
    text: "text-blue-800",
    pillActive: "bg-blue-100 text-blue-900 border-blue-200",
    pillInactive: "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-100",
  },
  Anniversary: {
    text: "text-pink-700",
    pillActive: "bg-pink-100 text-pink-900 border-pink-200",
    pillInactive: "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-100",
  },
  Birthday: {
    text: "text-yellow-700",
    pillActive: "bg-yellow-100 text-yellow-900 border-yellow-200",
    pillInactive: "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-100",
  },
  Default: {
    text: "text-blue-800",
    pillActive: "bg-blue-100 text-blue-900 border-blue-200",
    pillInactive: "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-100",
  },
  default: {
    text: "text-blue-800",
    pillActive: "bg-blue-100 text-blue-900 border-blue-200",
    pillInactive: "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-100",
  },
};

// --- 3. HELPER HOOKS ---
function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50 };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

// --- 4. SUB-COMPONENTS ---

const ServiceCard = memo(({ service, onAdd, themeTextClass }) => {
  const haptic = useHapticFeedback();
  return (
    <div className="flex-shrink-0 flex items-center gap-4 w-[320px] bg-white border border-gray-100 rounded-xl p-3 h-full relative min-h-[150px] max-h-[150px] shadow-sm transition-transform active:scale-98 animate-fade-in snap-center">
      <div className="w-[90px] h-[90px] flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden relative">
        <SmartMedia
          src={service.image}
          type="image"
          className="w-full h-full object-cover"
          loaderImage="/GlowLoadingGif.gif"
          width={90}
          height={90}
          alt={service.title}
          loading="lazy"
        />
      </div>

      <div className="flex flex-col justify-center flex-1 min-w-0 pr-2 pb-8">
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">{service.title}</p>
        {service.description ? (
          <p className="text-gray-500 text-[10px] mt-1 line-clamp-1">{service.description}</p>
        ) : (
          <div className="h-4" />
        )}
        <div className="flex items-center space-x-2 mt-1.5">
          <p className="text-sm font-bold text-gray-900">{service.price}</p>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <p className="text-[10px] text-gray-500">{service.duration}</p>
        </div>
      </div>

      <button
        onClick={() => {
          haptic("medium");
          onAdd(service.id);
        }}
        className={`absolute bottom-3 right-3 inline-flex items-center justify-center px-4 py-1.5 bg-white border border-gray-200 text-xs font-bold rounded-lg uppercase shadow-sm hover:bg-gray-50 active:scale-90 transition-all touch-manipulation ${themeTextClass}`}
        aria-label={`Add ${service.title}`}
      >
        Add
      </button>
    </div>
  );
});

const FilterPill = memo(({ filter, isActive, onClick, theme }) => {
  const haptic = useHapticFeedback();
  return (
    <button
      onClick={() => {
        haptic("light");
        onClick(filter.id);
      }}
      className={`
        p-2 px-3 rounded-lg cursor-pointer text-xs whitespace-nowrap font-medium transition-all duration-200 border active:scale-95
        ${isActive ? theme.pillActive : theme.pillInactive}
      `}
    >
      {filter.label}
    </button>
  );
});

// Memoize scroll buttons
const ScrollButton = React.memo(({ onClick, disabled, direction }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-1.5 rounded-full transition-all duration-200 ${
      disabled
        ? "bg-gray-50 text-gray-300 cursor-not-allowed"
        : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600 active:scale-90"
    }`}
    aria-label={`Scroll ${direction}`}
  >
    {direction === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
  </button>
));

// --- 5. MAIN COMPONENT ---

const MostBooked = () => {
  const searchParams = useSearchParams();
  const haptic = useHapticFeedback();
  const rawCategory = searchParams.get("category");

  // Theme Logic
  let categoryKey = rawCategory ? rawCategory : "default";
  if (categoryKey === "event") categoryKey = "wedding";
  const theme = themeConfig[categoryKey] || themeConfig.default;

  // State
  const [activeFilterId, setActiveFilterId] = useState("all");
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Handlers
  const handleFilterClick = useCallback((id) => {
    setActiveFilterId(id);
    // Reset scroll when filter changes
    if (scrollRef.current) scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
  }, []);

  const handleAdd = useCallback((id) => {
    console.log("Added item:", id);
  }, []);

  // Filter Logic
  const filteredServices = useMemo(() => {
    if (activeFilterId === "all") return SERVICES;
    return SERVICES.filter((service) => service.category === activeFilterId);
  }, [activeFilterId]);

  // Scroll Logic (Copied from CategoryGrid)
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    // Only update if changed to prevent re-renders
    const newLeft = scrollLeft > 5;
    const newRight = scrollLeft < scrollWidth - clientWidth - 5;

    if (newLeft !== canScrollLeft) setCanScrollLeft(newLeft);
    if (newRight !== canScrollRight) setCanScrollRight(newRight);
  }, [canScrollLeft, canScrollRight]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    const ref = scrollRef.current;
    if (ref) ref.addEventListener("scroll", checkScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkScroll);
      if (ref) ref.removeEventListener("scroll", checkScroll);
    };
  }, [checkScroll, filteredServices]); // Re-check when services change

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="p-4 pt-4 mt-1 bg-white mb-2 content-visibility-auto contain-intrinsic-size-[300px] rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Most Booked</h2>

        {/* Scroll Controls (Only show if scrollable) */}
        {filteredServices.length > 0 && (
          <div className="flex gap-2">
            <ScrollButton
              onClick={() => {
                scroll("left");
                haptic("light");
              }}
              disabled={!canScrollLeft}
              direction="left"
            />
            <ScrollButton
              onClick={() => {
                scroll("right");
                haptic("light");
              }}
              disabled={!canScrollRight}
              direction="right"
            />
          </div>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex gap-2 text-sm mb-4 overflow-x-auto scrollbar-hide pb-2 no-scrollbar touch-pan-x">
        {FILTERS.map((filter) => (
          <FilterPill
            key={filter.id}
            filter={filter}
            isActive={activeFilterId === filter.id}
            onClick={handleFilterClick}
            theme={theme}
          />
        ))}
      </div>

      {/* Services List - Optimized Scroll Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto w-full gap-4 scrollbar-hide pb-4 no-scrollbar touch-pan-x touch-pan-y will-change-scroll min-h-[170px] snap-x snap-mandatory"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} onAdd={handleAdd} themeTextClass={theme.text} />
          ))
        ) : (
          <div className="w-full flex items-center justify-center text-gray-400 text-sm italic py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No services found for this category.
          </div>
        )}

        {/* Spacer for right padding */}
        <div className="w-1 flex-shrink-0" />
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .will-change-scroll {
          will-change: transform;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default memo(MostBooked);
