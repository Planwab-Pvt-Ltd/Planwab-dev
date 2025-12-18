import React, { memo, useCallback } from "react";
import SmartMedia from "../SmartMediaLoader";

// 1. Optimization: Move static data OUTSIDE component to prevent recreation
const FILTERS = [
  { label: "Salon for Women", active: true, bg: "bg-[#AC2B571A]", text: "text-[#AC2B57]" },
  { label: "Spa for Women", active: false, bg: "bg-[#F5F5F5]", text: "text-[#646464]" },
  { label: "HydraGlo Facials", active: false, bg: "bg-[#F5F5F5]", text: "text-[#646464]" },
  { label: "Laser Treatments", active: false, bg: "bg-[#F5F5F5]", text: "text-[#646464]" },
];

const SERVICES = [
  {
    id: 1,
    title: "Full Arms + Full Legs + Underarms Korean Waxing",
    description: "",
    price: "₹799",
    duration: "1 hr 15 mins",
    image: "https://cdn.yesmadam.com/images/live/iDescription/fullArmsHoneyWaxing%2027-sep-2025.jpg",
  },
  {
    id: 2,
    title: "Korean Body Polishing",
    description: "9 Steps Including Face",
    price: "₹1,599",
    duration: "2 hr",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Korean-Body-Polishing%20(1).webp",
  },
  {
    id: 3,
    title: "Korean Luxe Manicure & Pedicure",
    description: "",
    price: "₹999",
    duration: "1 hr 50 mins",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Korean-mani-pedi-7Nov25.webp",
  },
  {
    id: "4",
    title: "Korean Clean Up",
    description: "7 Step Clean-Up | Free Silicone Face Brush Included",
    price: "₹749",
    duration: "50 mins",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Korean%20Facial.jpg",
  },
  {
    id: 5,
    title: "Korean Glow Facial",
    description: "9 Steps Facial | Free silicone brush",
    price: "₹1,299",
    duration: "1 hr 15 mins",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Korean-Glow-7Nov25.webp",
  },
  {
    id: 6,
    title: "Full Arms, Underarms & Full Legs - Rica Tin Wax",
    description: "",
    price: "₹898",
    duration: "1 hr 5 mins",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Parent-SSI-RicaTin-5dec25.webp",
  },
  {
    id: 7,
    title: "Golden Glow Facial",
    description: "8 Steps Facial",
    price: "₹1,119",
    duration: "1 hr 10 mins",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Golden-glow-.webp",
  },
  {
    id: 8,
    title: "O3+ Shine & Glow Facial",
    description: "7 Steps Facial | Korean Sheet Mask",
    price: "₹1,349",
    duration: "1 hr 10 mins",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Shine-Glow-1-7Nov25.webp",
  },
  {
    id: 9,
    title: "Stripless Korean Bikini Wax",
    description: "One-time use peel-off wax",
    price: "₹749",
    duration: "1 hr",
    image: "https://cdn.yesmadam.com/images/live/iDescription/Korean-Bikini-Wax-7Nov25.webp",
  },
];

// 2. Optimization: Sub-component for individual card to isolate re-renders
const ServiceCard = memo(({ service, onAdd }) => (
  <div className="flex-shrink-0 flex items-center gap-4 w-[320px] bg-white border border-gray-100 rounded-xl p-3 h-full relative min-h-[120px] shadow-sm transition-shadow hover:shadow-md">
    {/* Image Container with Fixed Dimensions to prevent CLS */}
    <div className="w-[90px] h-[90px] flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden relative">
      <SmartMedia
        src={service.image}
        type="image"
        className="w-full h-full object-cover"
        loaderImage="/GlowLoadingGif.gif"
        width={90}
        height={90}
        alt={service.title}
        loading="lazy" // Native Lazy Loading
      />
    </div>

    {/* Content */}
    <div className="flex flex-col justify-center flex-1 min-w-0 pr-2 pb-8">
      <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">{service.title}</p>
      {service.description ? (
        <p className="text-gray-500 text-[10px] mt-1 line-clamp-1">{service.description}</p>
      ) : (
        <div className="h-4" />
      )}{" "}
      {/* Spacer to keep layout stable */}
      <div className="flex items-center space-x-2 mt-1.5">
        <p className="text-sm font-bold text-gray-900">{service.price}</p>
        <span className="w-1 h-1 bg-gray-300 rounded-full" />
        <p className="text-[10px] text-gray-500">{service.duration}</p>
      </div>
    </div>

    {/* Add Button - Optimized for Touch */}
    <button
      onClick={() => onAdd(service.id)}
      className="absolute bottom-3 right-3 inline-flex items-center justify-center px-4 py-1.5 bg-white border border-gray-200 text-xs font-bold text-[#AC2B57] rounded-lg uppercase shadow-sm hover:bg-gray-50 active:scale-95 active:bg-gray-100 transition-all touch-manipulation"
      aria-label={`Add ${service.title}`}
    >
      Add
    </button>
  </div>
));

const FilterPill = memo(({ filter }) => (
  <button
    className={`p-2 px-3 rounded-lg cursor-pointer text-xs whitespace-nowrap font-medium transition-colors border border-transparent active:scale-95 ${filter.bg} ${filter.text}`}
  >
    {filter.label}
  </button>
));

const MostBooked = () => {
  // Placeholder handler using useCallback to keep function reference stable
  const handleAdd = useCallback((id) => {
    console.log("Added item:", id);
  }, []);

  return (
    <div className="p-4 bg-white mt-2 mb-2 content-visibility-auto contain-intrinsic-size-[300px]">
      <h2 className="text-xl font-semibold my-2 text-gray-900">Most Booked</h2>

      {/* Filters Scrollable Row */}
      <div className="flex gap-2 text-sm mb-4 overflow-x-auto scrollbar-hide pb-2 no-scrollbar touch-pan-x">
        {FILTERS.map((filter, index) => (
          <FilterPill key={index} filter={filter} />
        ))}
      </div>

      {/* Services Horizontal Scroll */}
      <div
        className="flex overflow-x-auto w-full gap-4 scrollbar-hide pb-4 no-scrollbar touch-pan-x will-change-scroll"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {SERVICES.map((service) => (
          <ServiceCard key={service.id} service={service} onAdd={handleAdd} />
        ))}
        {/* Spacer for right padding */}
        <div className="w-1 flex-shrink-0" />
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .will-change-scroll {
          will-change: transform; /* Promotes to GPU layer */
        }
      `}</style>
    </div>
  );
};

export default memo(MostBooked);
