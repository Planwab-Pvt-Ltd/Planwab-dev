"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Users,
  Heart,
  X,
  Search,
  Sparkles,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  SlidersHorizontal,
  LayoutList,
  LayoutGrid,
  ShoppingBag,
  CheckCircle,
  Map as MapIcon,
  ArrowRightLeft,
  Tag,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useParams, useRouter } from "next/navigation";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const PromoCarousel = ({ colorPrimary, colorSecondary }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Tag size={16} style={{ color: colorPrimary }} />
          Exclusive Deals
        </h3>
        <span className="text-xs font-medium text-gray-500">View All</span>
      </div>
      <div
        className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="min-w-[280px] h-36 rounded-2xl relative overflow-hidden snap-start shadow-md border border-gray-100 dark:border-gray-800"
          >
            <div
              className="absolute inset-0 opacity-90"
              style={{ background: `linear-gradient(to right, ${colorPrimary}, ${colorSecondary})` }}
            />
            <div className="absolute inset-0 p-5 flex flex-col justify-center text-white">
              <span className="px-2 py-1 bg-white/20 rounded-lg text-[10px] font-bold w-fit mb-2 backdrop-blur-md">
                LIMITED TIME
              </span>
              <h4 className="font-bold text-lg leading-tight">20% Off on Venue Booking</h4>
              <p className="text-xs opacity-90 mt-1">Use Code: PLANWAB20</p>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

const CardSkeleton = ({ viewMode }) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 mb-4 ${
      viewMode === "grid" ? "h-72" : "h-96"
    }`}
  >
    <div className="relative h-2/3 bg-gray-200 dark:bg-gray-800 animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      <div className="flex justify-between pt-2">
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
    </div>
  </div>
);

const PaginationControls = ({ currentPage, totalPages, totalVendors, onPageChange }) => {
  if (totalPages === undefined || totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-4 py-8 pb-20">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 disabled:opacity-50 active:scale-95 transition-all text-gray-700 dark:text-gray-200"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="flex items-center gap-1 px-5 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <span className="text-sm font-bold" style={{ color: "var(--primary-color)" }}>
          {currentPage}
        </span>
        <span className="text-sm font-medium text-gray-400">/</span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{totalPages}</span>
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 disabled:opacity-50 active:scale-95 transition-all text-gray-700 dark:text-gray-200"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

const UnifiedCard = ({
  vendor,
  onFavorite,
  isFavorite,
  viewMode,
  onCompare,
  isComparing,
  isSelectedForCompare,
  colorPrimary = "#2563eb",
}) => {
  const router = useRouter();
  // 1. TUPLE STATE: Tracks [currentIndex, direction] together
  // This is critical for Framer Motion to know which way to animate
  const [[page, direction], setPage] = useState([0, 0]);

  const [addedToCart, setAddedToCart] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Data Logic
  const images = useMemo(() => (vendor.images || []).filter((img) => img), [vendor.images]);
  const displayImages = useMemo(() => {
    if (images.length > 0) return images;
    if (vendor.defaultImage) return [vendor.defaultImage];
    return ["/placeholder.jpg"];
  }, [images, vendor.defaultImage]);

  // Derived Index (handles infinite loop wrapping safely)
  const imageIndex = ((page % displayImages.length) + displayImages.length) % displayImages.length;

  const hasMultipleImages = displayImages.length > 1;
  const isGrid = viewMode === "grid";
  const price = vendor.perDayPrice?.min || vendor.basePrice || vendor.price?.min || 0;
  const displayPrice = Number.isNaN(price) ? "N/A" : price.toLocaleString("en-IN");

  // Navigation Handler
  const paginate = (newDirection) => {
    if (!hasMultipleImages) return;
    setPage([page + newDirection, newDirection]);
  };

  // Drag End Logic
  const onDragEnd = (e, { offset, velocity }) => {
    setIsDragging(false);
    const swipe = Math.abs(offset.x) * velocity.x;
    const swipeConfidenceThreshold = 10000;

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1); // Swipe Left -> Next
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1); // Swipe Right -> Prev
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // 2. SMOOTH VARIANTS
  // Logic:
  // If direction > 0 (Next): Enter from Right (100%), Exit to Left (-100%)
  // If direction < 0 (Prev): Enter from Left (-100%), Exit to Right (100%)
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
      zIndex: 0, // Prepare to be visible
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%", // Exit opposite to enter
      opacity: 1, // Keep opacity to avoid fading while sliding
    }),
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      className={`relative group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 ${
        isSelectedForCompare ? `ring-2 ring-offset-2` : ""
      } ${isGrid ? "mb-0" : "mb-6"}`}
      style={isSelectedForCompare ? { borderColor: colorPrimary, ringColor: colorPrimary } : {}}
    >
      {/* Compare Overlay */}
      {isComparing && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onCompare(vendor);
          }}
          className="absolute inset-0 z-40 bg-black/10 backdrop-blur-[1px] flex items-center justify-center cursor-pointer group-hover:bg-black/20 transition-colors"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: isSelectedForCompare ? 1.1 : 1 }}
            className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-lg ${
              isSelectedForCompare ? "" : "bg-gray-400/50"
            }`}
            style={isSelectedForCompare ? { backgroundColor: colorPrimary } : {}}
          >
            {isSelectedForCompare && <CheckCircle size={20} className="text-white" />}
          </motion.div>
        </div>
      )}

      {/* Image Carousel Area */}
      <div className={`relative bg-gray-100 dark:bg-gray-800 overflow-hidden ${isGrid ? "h-40" : "h-64"}`}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page} // Using 'page' ensures key uniqueness on every slide
            src={displayImages[imageIndex]}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={onDragEnd}
            className="absolute inset-0 w-full h-full object-cover touch-pan-y"
            alt={vendor.name}
            loading="lazy"
          />
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/5 pointer-events-none" />

        {/* Top Badges & Actions */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20 pointer-events-none">
          {vendor.tags?.includes("Popular") ? (
            <div className="px-2.5 py-1 bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-wide rounded-md shadow-lg flex items-center gap-1 backdrop-blur-md">
              <Sparkles size={10} fill="black" /> Popular
            </div>
          ) : (
            <div />
          )}

          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(vendor._id);
            }}
            className="pointer-events-auto p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors"
          >
            <Heart size={18} className={isFavorite ? "fill-rose-500 text-rose-500" : "text-white"} strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Image Indicators (Dots) */}
        {!isGrid && hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 pointer-events-none">
            {displayImages.map((_, idx) => (
              <motion.div
                key={idx}
                animate={{
                  width: idx === imageIndex ? 16 : 6,
                  opacity: idx === imageIndex ? 1 : 0.5,
                  backgroundColor: idx === imageIndex ? "#ffffff" : "#ffffff",
                }}
                className="h-1.5 rounded-full shadow-sm"
              />
            ))}
          </div>
        )}

        {/* Manual Navigation Arrows */}
        {!isGrid && hasMultipleImages && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md z-20 opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                paginate(1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md z-20 opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Content Body */}
      <div
        className={`${isGrid ? "p-3" : "p-5"}`}
        onClick={() => router.push(`/vendor/${vendor?.category}/${vendor?._id}`)}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <h3
              className={`font-bold text-gray-900 dark:text-white leading-tight truncate ${
                isGrid ? "text-sm mb-0.5" : "text-lg mb-1"
              }`}
            >
              {vendor.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin size={10} />
              <span className="truncate">{vendor.address?.city || "City"}</span>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 px-1.5 py-0.5 rounded-md">
              <Star size={10} className="text-green-600 fill-green-600" />
              <span className="text-xs font-bold text-green-700 dark:text-green-400">{vendor.rating || 4.5}</span>
            </div>
            {!isGrid && <span className="text-[10px] text-gray-400 mt-1">{vendor.reviews || 0} reviews</span>}
          </div>
        </div>

        {/* Stats Row */}
        {!isGrid && (
          <div className="flex items-center gap-2 my-3 overflow-x-auto no-scrollbar">
            {vendor.seating?.max && (
              <div className="px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-md text-[10px] font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
                <Users size={12} /> {vendor.seating.max} Capacity
              </div>
            )}
            <div className="px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-md text-[10px] font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
              <TrendingUp size={12} /> {vendor.bookings || 0} Booked
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div
          className={`flex items-center justify-between ${
            isGrid ? "mt-2" : "mt-4 pt-3 border-t border-gray-100 dark:border-gray-800"
          }`}
        >
          <div>
            {!isGrid && (
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Starting at</p>
            )}
            <p className={`${isGrid ? "text-sm" : "text-lg"} font-bold`} style={{ color: colorPrimary }}>
              ₹{displayPrice}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className={`
              relative overflow-hidden flex items-center justify-center gap-2 
              ${isGrid ? "p-2 rounded-lg" : "px-4 py-2 rounded-xl"} 
              ${addedToCart ? "bg-green-600 text-white" : "bg-black dark:bg-white text-white dark:text-black"}
              font-bold text-xs shadow-md transition-colors
            `}
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <CheckCircle size={isGrid ? 14 : 16} />
                  {!isGrid && "Saved"}
                </motion.div>
              ) : (
                <motion.div
                  key="bag"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <ShoppingBag size={isGrid ? 14 : 16} />
                  {!isGrid && "Book"}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const FilterContent = ({
  showFeaturedOnly,
  setShowFeaturedOnly,
  vendorCategories,
  selectedCategories,
  handleCategoryChange,
  priceRange,
  setPriceRange,
  availableCities,
  selectedLocations,
  handleLocationChange,
  colorPrimary,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Featured Only</p>
            <p className="text-xs text-gray-500">Show only top rated vendors</p>
          </div>
        </div>
        <div
          onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
          className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${
            showFeaturedOnly ? "" : "bg-gray-200 dark:bg-gray-700"
          }`}
          style={showFeaturedOnly ? { backgroundColor: colorPrimary } : {}}
        >
          <motion.div animate={{ x: showFeaturedOnly ? 24 : 0 }} className="w-6 h-6 bg-white rounded-full shadow-md" />
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Vendor Types</h3>
        <div className="flex flex-wrap gap-2">
          {vendorCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                selectedCategories.includes(cat)
                  ? `text-white shadow-md`
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
              }`}
              style={
                selectedCategories.includes(cat) ? { backgroundColor: colorPrimary, borderColor: colorPrimary } : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Budget Range</h3>
        <div className="px-2">
          <Slider
            range
            min={0}
            max={1000000}
            step={10000}
            value={priceRange}
            onChange={setPriceRange}
            trackStyle={{ backgroundColor: colorPrimary, height: 6 }}
            handleStyle={{
              borderColor: colorPrimary,
              backgroundColor: "white",
              opacity: 1,
              height: 24,
              width: 24,
              marginTop: -9,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
          />
        </div>
        <div className="flex justify-between mt-6">
          <div className="px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Min Price</p>
            <p className="font-bold text-gray-900 dark:text-white">₹{priceRange[0].toLocaleString()}</p>
          </div>
          <div className="px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-right shadow-sm">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Max Price</p>
            <p className="font-bold text-gray-900 dark:text-white">₹{priceRange[1].toLocaleString()}</p>
          </div>
        </div>
      </div>
      {availableCities.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Cities</h3>
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
            {availableCities.map((city) => (
              <label
                key={city}
                className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
              >
                <span className="text-gray-900 dark:text-white font-medium text-sm">{city}</span>
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(city)}
                    onChange={() => handleLocationChange(city)}
                    className="peer appearance-none w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg checked:bg-black dark:checked:bg-white transition-colors"
                  />
                  <CheckCircle
                    size={14}
                    className="absolute left-1 top-1 text-white dark:text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                  />
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FilterDrawer = ({ isOpen, onClose, children, onClear, colorPrimary }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 h-[85vh] bg-gray-50 dark:bg-black rounded-t-[2rem] z-[101] flex flex-col shadow-2xl ring-1 ring-white/10"
        >
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-950 rounded-t-[2rem]">
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Filters</h2>
              <p className="text-xs text-gray-500 font-medium">Refine your search results</p>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-300" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-8 bg-gray-50/50 dark:bg-black/20">{children}</div>
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex gap-4 backdrop-blur-xl">
            <button
              onClick={onClear}
              className="flex-1 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-800 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl text-white font-bold shadow-xl active:scale-95 transition-transform text-sm"
              style={{ backgroundColor: colorPrimary }}
            >
              Show Results
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const CompareBar = ({ count, onClear, onView, colorPrimary }) => (
  <AnimatePresence>
    {count > 0 && (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-24 left-4 right-4 z-[90] bg-gray-900 dark:bg-white text-white dark:text-black p-4 rounded-2xl shadow-2xl flex items-center justify-between ring-1 ring-white/10"
      >
        <div className="flex items-center gap-3">
          <div
            className="bg-gray-800 dark:bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center font-bold"
            style={{ color: colorPrimary }}
          >
            {count}
          </div>
          <div>
            <p className="font-bold text-sm">Compare Vendors</p>
            <p className="text-xs opacity-70">Add up to 3 to compare</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClear} className="px-3 py-2 text-xs font-bold opacity-70">
            Clear
          </button>
          <button
            onClick={onView}
            className="px-5 py-2 text-white rounded-xl text-xs font-bold shadow-lg"
            style={{ backgroundColor: colorPrimary }}
          >
            Compare Now
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const CompareModal = ({ isOpen, onClose, vendors, colorPrimary }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-[201] p-4"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compare Vendors</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              {vendors.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No vendors selected for comparison.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                          Feature
                        </th>
                        {vendors.map((v, i) => (
                          <th key={i} className="text-center py-4 px-2 font-bold text-gray-900 dark:text-white">
                            {v.name.length > 15 ? `${v.name.substring(0, 15)}...` : v.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          label: "Rating",
                          get: (v) => `${v.rating || 0}/5`,
                          render: (val) => (
                            <Star size={14} className="inline mx-auto fill-yellow-500 text-yellow-500" />
                          ),
                        },
                        {
                          label: "Price (Starting)",
                          get: (v) => `₹${(v.perDayPrice?.min || 0).toLocaleString("en-IN")}`,
                        },
                        { label: "Capacity", get: (v) => (v.seating?.max ? `${v.seating.max} seats` : "N/A") },
                        { label: "Reviews", get: (v) => v.reviews || 0 },
                        { label: "Bookings", get: (v) => v.bookings || 0 },
                        { label: "Location", get: (v) => v.address?.city || "N/A" },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                            {row.label}
                          </td>
                          {vendors.map((v) => (
                            <td key={v._id} className="py-3 px-2 text-center text-sm text-gray-700 dark:text-gray-300">
                              {row.render ? row.render(row.get(v)) : row.get(v)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const MapView = ({ vendors, onVendorSelect, center }) => {
  if (!vendors.length) {
    return (
      <div className="h-[80vh] bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500">No vendors to display on map</p>
      </div>
    );
  }

  return (
    <div className="h-[80vh] rounded-2xl overflow-hidden">
      <MapContainer center={[center.lat, center.lng]} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {vendors.map((vendor) => (
          <Marker key={vendor._id} position={[vendor.position.lat, vendor.position.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{vendor.name}</h3>
                <p className="text-sm text-gray-600">{vendor.address?.city}</p>
                <button
                  onClick={() => onVendorSelect?.(vendor)}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default function MarketplacePageWrapper() {
  const [activeCategory] = useState("Wedding"); // Replace with useCategoryStore if available
  const params = useParams();
  const pageCategory = params?.category || activeCategory;
  const [vendors, setVendors] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({ totalPages: 1, totalVendors: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");
  const [isMapView, setIsMapView] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const colorPrimary = "#2563eb";
  const colorSecondary = "#eab308";

  const vendorCategories = useMemo(
    () => ["venues", "photographers", "makeup", "planners", "catering", "clothes", "mehendi", "djs"],
    []
  );

  const cityCoords = useMemo(
    () => ({
      Mumbai: { lat: 19.076, lng: 72.8777 },
      Delhi: { lat: 28.6139, lng: 77.209 },
      Bangalore: { lat: 12.9716, lng: 77.5946 },
      Chennai: { lat: 13.0827, lng: 80.2707 },
    }),
    []
  );

  const defaultCenter = useMemo(() => cityCoords.Mumbai, [cityCoords]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", colorPrimary);
    root.style.setProperty("--secondary-color", colorSecondary);
  }, [colorPrimary, colorSecondary]);

  useEffect(() => {
    if (pageCategory && typeof pageCategory === "string") {
      setSelectedCategories([pageCategory]);
    } else {
      setSelectedCategories([]);
    }
  }, [pageCategory]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedPriceRange = useDebounce(priceRange, 500);

  useEffect(() => {
    const cities = [...new Set(vendors.map((v) => v.address?.city).filter(Boolean))].sort();
    setAvailableCities(cities);
  }, [vendors]);

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      const paramsObj = {
        page: currentPage.toString(),
        limit: "12",
        sortBy,
      };

      if (debouncedSearchQuery) paramsObj.search = debouncedSearchQuery;
      if (selectedCategories.length > 0) paramsObj.categories = selectedCategories.join(",");
      if (showFeaturedOnly) paramsObj.featured = "true";
      if (selectedLocations.length > 0) paramsObj.cities = selectedLocations.join(",");
      if (debouncedPriceRange[0] > 0 || debouncedPriceRange[1] < 1000000) {
        paramsObj.minPrice = debouncedPriceRange[0].toString();
        paramsObj.maxPrice = debouncedPriceRange[1].toString();
      }

      const params = new URLSearchParams(paramsObj);
      const apiUrl = `/api/vendor?${params.toString()}`;

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("API Response:", result); // Debug log: Check structure here

        // Check for data presence instead of 'success' (assuming API always returns data on success)
        if (result.data && Array.isArray(result.data)) {
          const processedVendors = result.data.map((v) => ({
            ...v,
            position: cityCoords[v.address?.city] || defaultCenter,
          }));
          setVendors(processedVendors);
          console.log("Fetched Vendors:", processedVendors);
          setPaginationInfo(result.pagination || { totalPages: 1, totalVendors: 0 });
        } else {
          // Handle non-success cases (e.g., empty data or error message)
          const errorMsg = result.message || result.error || "No vendors found";
          console.warn("API Warning:", errorMsg);
          setVendors([]);
          setPaginationInfo({ totalPages: 1, totalVendors: 0 });
        }
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
        setVendors([]);
        setPaginationInfo({ totalPages: 1, totalVendors: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [
    currentPage,
    sortBy,
    debouncedSearchQuery,
    debouncedPriceRange,
    selectedCategories,
    showFeaturedOnly,
    selectedLocations,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, debouncedPriceRange, selectedCategories, showFeaturedOnly, selectedLocations, sortBy]);

  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileFiltersOpen]);

  const toggleCompare = (vendor) => {
    if (compareList.find((v) => v._id === vendor._id)) {
      setCompareList((prev) => prev.filter((v) => v._id !== vendor._id));
    } else if (compareList.length < 3) {
      setCompareList((prev) => [...prev, vendor]);
    }
  };

  const handleFavorite = (vendorId) => {
    setFavorites((prev) => (prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]));
  };

  const handleCategoryChange = useCallback((cat) => {
    setSelectedCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  }, []);

  const handleLocationChange = useCallback((city) => {
    setSelectedLocations((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedCategories(pageCategory ? [pageCategory] : []);
    setPriceRange([0, 1000000]);
    setShowFeaturedOnly(false);
    setSelectedLocations([]);
    setSearchQuery("");
    setSortBy("rating");
    setCurrentPage(1);
  }, [pageCategory]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filterProps = {
    showFeaturedOnly,
    setShowFeaturedOnly,
    vendorCategories,
    selectedCategories,
    handleCategoryChange,
    priceRange,
    setPriceRange,
    availableCities,
    selectedLocations,
    handleLocationChange,
    colorPrimary,
  };

  const handleCompareClear = () => {
    setCompareList([]);
    if (showCompare) setShowCompare(false);
  };

  const handleVendorSelectFromMap = (vendor) => {
    setIsMapView(false);
    setCompareMode(false);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    showFeaturedOnly ||
    selectedLocations.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000000 ||
    searchQuery;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-black pb-0">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-65 dark:opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px), radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px), radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)`,
          backgroundSize: "40px 40px, 40px 40px, 40px 40px, 40px 40px",
        }}
      />
      <div className="sticky top-0 z-[50] bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white leading-none tracking-tight">
                {"Marketplace"}
              </h1>
              <p className="text-[11px] text-gray-500 mt-1 font-bold uppercase tracking-wide">
                {paginationInfo.totalVendors || 0} results found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`p-2.5 rounded-xl transition-colors ${
                  compareMode ? "text-white" : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                }`}
                style={compareMode ? { backgroundColor: colorPrimary } : {}}
              >
                <ArrowRightLeft size={20} />
              </button>
              <button
                onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                className="p-2.5 bg-gray-100 dark:bg-gray-900 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                {viewMode === "list" ? (
                  <LayoutGrid size={20} className="text-gray-700 dark:text-gray-300" />
                ) : (
                  <LayoutList size={20} className="text-gray-700 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={() => setIsMapView(!isMapView)}
                className={`p-2.5 rounded-xl transition-colors ${
                  isMapView ? "text-white" : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                }`}
                style={isMapView ? { backgroundColor: colorPrimary } : {}}
              >
                {isMapView ? (
                  <LayoutList size={20} className="text-white" />
                ) : (
                  <MapIcon size={20} className="text-gray-700 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className={`relative p-2.5 rounded-xl transition-colors ${
                  hasActiveFilters ? "text-white" : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                }`}
                style={hasActiveFilters ? { backgroundColor: colorPrimary } : {}}
              >
                <SlidersHorizontal size={20} />
                {hasActiveFilters && (
                  <span
                    className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900"
                    style={{ backgroundColor: colorPrimary }}
                  />
                )}
              </button>
            </div>
          </div>
          <div className="relative mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, location..."
              className="w-full pl-11 pr-4 py-3.5 bg-gray-100 dark:bg-gray-900/50 rounded-2xl text-sm font-bold text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={2.5} />
          </div>
        </div>
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "rating", label: "Top Rated", icon: Star },
            { id: "price-asc", label: "Cheapest", icon: DollarSign },
            { id: "bookings", label: "Popular", icon: TrendingUp },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                sortBy === opt.id
                  ? "text-white shadow-md"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800"
              }`}
              style={sortBy === opt.id ? { backgroundColor: colorPrimary, borderColor: colorPrimary } : {}}
            >
              <opt.icon size={12} className={sortBy === opt.id ? "fill-white" : ""} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 pt-4 relative z-10">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-65 dark:opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px), radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px), radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)`,
            backgroundSize: "40px 40px, 40px 40px, 40px 40px, 40px 40px",
          }}
        />
        <PromoCarousel colorPrimary={colorPrimary} colorSecondary={colorSecondary} />
        <AnimatePresence mode="wait">
          {!isMapView ? (
            isLoading ? (
              <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"}`}>
                {[1, 2, 3, 4].map((i) => (
                  <CardSkeleton key={i} viewMode={viewMode} />
                ))}
              </div>
            ) : vendors.length > 0 ? (
              <div className="space-y-6">
                <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"}`}>
                  {vendors.map((vendor) => (
                    <UnifiedCard
                      key={vendor._id}
                      vendor={vendor}
                      viewMode={viewMode}
                      onFavorite={handleFavorite}
                      isFavorite={favorites.includes(vendor._id)}
                      isComparing={compareMode}
                      onCompare={toggleCompare}
                      isSelectedForCompare={!!compareList.find((v) => v._id === vendor._id)}
                      colorPrimary={colorPrimary}
                    />
                  ))}
                </div>
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={paginationInfo.totalPages}
                  totalVendors={paginationInfo.totalVendors}
                  onPageChange={handlePageChange}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <Search size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Results Found</h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-6 text-sm">
                  We couldn't find any vendors matching your specific filters. Try broadening your search.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-3 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform"
                  style={{ backgroundColor: colorPrimary }}
                >
                  Clear All Filters
                </button>
              </div>
            )
          ) : (
            <MapView vendors={vendors} onVendorSelect={handleVendorSelectFromMap} center={defaultCenter} />
          )}
        </AnimatePresence>
      </div>
      <CompareBar
        count={compareList.length}
        onClear={handleCompareClear}
        onView={() => setShowCompare(true)}
        colorPrimary={colorPrimary}
      />
      <FilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        onClear={clearAllFilters}
        colorPrimary={colorPrimary}
      >
        <FilterContent {...filterProps} />
      </FilterDrawer>
      <CompareModal
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        vendors={compareList}
        colorPrimary={colorPrimary}
      />
    </div>
  );
}
