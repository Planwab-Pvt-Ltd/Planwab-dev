"use client";

import React, { memo, useCallback, useState, useMemo, useRef, useEffect } from "react";
import SmartMedia from "../SmartMediaLoader";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- 1. STATIC DATA ---
const FILTERS = [
  { id: "all", label: "All Services" },
  { id: "salon", label: "Salon for Women" },
  { id: "spa", label: "Spa for Women" },
  { id: "facial", label: "HydraGlo Facials" },
  { id: "laser", label: "Laser Treatments" },
];

const SERVICES = [
  {
    id: 1,
    category: "salon",
    title: "Full Arms + Full Legs + Underarms Korean Waxing",
    description: "",
    price: "₹799",
    duration: "1 hr 15 mins",
    image: "https://cdn.yesmadam.com/images/live/iDescription/fullArmsHoneyWaxing%2027-sep-2025.jpg",
  },
  {
    id: 2,
    category: "spa",
    title: "Korean Body Polishing",
    description: "9 Steps Including Face",
    price: "₹1,599",
    duration: "2 hr",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Korean-Body-Polishing%20(1).webp",
  },
  {
    id: 3,
    category: "salon",
    title: "Korean Luxe Manicure & Pedicure",
    description: "",
    price: "₹999",
    duration: "1 hr 50 mins",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Korean-mani-pedi-7Nov25.webp",
  },
  {
    id: "4",
    category: "facial",
    title: "Korean Clean Up",
    description: "7 Step Clean-Up | Free Silicone Face Brush Included",
    price: "₹749",
    duration: "50 mins",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Korean%20Facial.jpg",
  },
  {
    id: 5,
    category: "facial",
    title: "Korean Glow Facial",
    description: "9 Steps Facial | Free silicone brush",
    price: "₹1,299",
    duration: "1 hr 15 mins",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Korean-Glow-7Nov25.webp",
  },
  {
    id: 6,
    category: "salon",
    title: "Full Arms, Underarms & Full Legs - Rica Tin Wax",
    description: "",
    price: "₹898",
    duration: "1 hr 5 mins",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Parent-SSI-RicaTin-5dec25.webp",
  },
  {
    id: 7,
    category: "facial",
    title: "Golden Glow Facial",
    description: "8 Steps Facial",
    price: "₹1,119",
    duration: "1 hr 10 mins",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Golden-glow-.webp",
  },
  {
    id: 8,
    category: "facial",
    title: "O3+ Shine & Glow Facial",
    description: "7 Steps Facial | Korean Sheet Mask",
    price: "₹1,349",
    duration: "1 hr 10 mins",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Shine-Glow-1-7Nov25.webp",
  },
  {
    id: 9,
    category: "salon",
    title: "Stripless Korean Bikini Wax",
    description: "One-time use peel-off wax",
    price: "₹749",
    duration: "1 hr",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Korean-Bikini-Wax-7Nov25.webp",
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
