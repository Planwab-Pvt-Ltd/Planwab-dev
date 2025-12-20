"use client";

import React, { memo, useCallback, useState, useMemo } from "react";
import SmartMedia from "../SmartMediaLoader";
import { useSearchParams } from "next/navigation";

// --- 1. STATIC DATA ---
const FILTERS = [
  { id: "all", label: "All Services" },
  { id: "salon", label: "Salon for Women" },
  { id: "spa", label: "Spa for Women" },
  { id: "facial", label: "HydraGlo Facials" },
  { id: "laser", label: "Laser Treatments" },
];

// Added 'category' field for filtering logic
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

// --- 3. SUB-COMPONENTS ---

const ServiceCard = memo(({ service, onAdd, themeTextClass }) => {
  return (
    <div className="flex-shrink-0 flex items-center gap-4 w-[320px] bg-white border border-gray-100 rounded-xl p-3 h-full relative min-h-[150px] max-h-[150px] shadow-sm transition-shadow hover:shadow-md animate-fade-in">
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
        onClick={() => onAdd(service.id)}
        className={`absolute bottom-3 right-3 inline-flex items-center justify-center px-4 py-1.5 bg-white border border-gray-200 text-xs font-bold rounded-lg uppercase shadow-sm hover:bg-gray-50 active:scale-95 transition-all touch-manipulation ${themeTextClass}`}
        aria-label={`Add ${service.title}`}
      >
        Add
      </button>
    </div>
  );
});

const FilterPill = memo(({ filter, isActive, onClick, theme }) => {
  return (
    <button
      onClick={() => onClick(filter.id)}
      className={`
        p-2 px-3 rounded-lg cursor-pointer text-xs whitespace-nowrap font-medium transition-all duration-200 border active:scale-95
        ${isActive ? theme.pillActive : theme.pillInactive}
      `}
    >
      {filter.label}
    </button>
  );
});

// --- 4. MAIN COMPONENT ---

const MostBooked = () => {
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category");
  // Normalize category to lowercase for theme lookup
  let categoryKey = rawCategory ? rawCategory : "default";
  if (categoryKey === "event") categoryKey = "wedding"; // Fallback mapping if needed

  const theme = themeConfig[categoryKey] || themeConfig.default;
  console.log("MostBooked Theme Category:", categoryKey, theme);

  // State for active filter
  const [activeFilterId, setActiveFilterId] = useState("all");

  const handleFilterClick = useCallback((id) => {
    setActiveFilterId(id);
  }, []);

  const handleAdd = useCallback((id) => {
    console.log("Added item:", id);
  }, []);

  // Filter Logic (Memoized for performance)
  const filteredServices = useMemo(() => {
    if (activeFilterId === "all") return SERVICES;
    return SERVICES.filter((service) => service.category === activeFilterId);
  }, [activeFilterId]);

  return (
    <div className="p-4 pt-0 mt-1 bg-white mb-2 content-visibility-auto contain-intrinsic-size-[300px]">
      <h2 className="text-xl font-semibold my-2 text-gray-900">Most Booked</h2>

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

      {/* Services List */}
      <div
        className="flex overflow-x-auto w-full gap-4 scrollbar-hide pb-4 no-scrollbar touch-pan-x will-change-scroll min-h-[170px]"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} onAdd={handleAdd} themeTextClass={theme.text} />
          ))
        ) : (
          <div className="w-full flex items-center justify-center text-gray-400 text-sm italic">
            No services found for this category.
          </div>
        )}

        {/* Spacer */}
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
