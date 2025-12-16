"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
import {
  MapPin,
  Star,
  Users,
  Palette,
  UserCheck,
  Heart,
  Camera,
  Brush,
  ChevronDown,
  LayoutGrid,
  Square,
  SlidersHorizontal,
  X,
  Check,
  Filter,
  Search,
  Sparkles,
  TrendingUp,
  Clock,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight,
  Eye,
  Share2,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Zap,
} from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Link from "next/link";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700/50 h-full flex flex-col">
    <div className="relative h-64 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex-1">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
        <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    let startPage, endPage;
    if (currentPage <= 3) {
      startPage = 1;
      endPage = maxPagesToShow - 1;
      pageNumbers.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    } else if (currentPage + 2 >= totalPages) {
      startPage = totalPages - (maxPagesToShow - 2);
      pageNumbers.push(1);
      pageNumbers.push("...");
      pageNumbers.push(...Array.from({ length: totalPages - startPage + 1 }, (_, i) => startPage + i));
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
      pageNumbers.push(1);
      pageNumbers.push("...");
      pageNumbers.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-12">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>
      <div className="flex items-center gap-2">
        {pageNumbers.map((num, index) => (
          <React.Fragment key={index}>
            {num === "..." ? (
              <span className="px-4 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(num)}
                className={`w-10 h-10 rounded-lg transition-colors ${
                  currentPage === num
                    ? "bg-amber-500 text-white font-bold"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {num}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const UnifiedCard = ({ vendor, color, onFavorite, isFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const images = useMemo(() => (vendor.images || []).filter((img) => img), []);
  const displayImages = images.length > 0 ? images : vendor.defaultImage ? [vendor.defaultImage] : [];
  const timerRef = useRef(null);

  useEffect(() => {
    if (displayImages.length <= 1 || !autoSlideEnabled) return;

    timerRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
      }
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [displayImages.length, autoSlideEnabled, isPaused]);

  const handleNext = () => {
    setAutoSlideEnabled(true);
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setAutoSlideEnabled(true);
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const price = vendor.perDayPrice?.min || vendor.basePrice || vendor.price?.min || 0;
  const displayPrice = Number.isNaN(price) ? "N/A" : price.toLocaleString("en-IN");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-2xl border border-gray-100 dark:border-gray-700/50 h-full flex flex-col relative">
        {vendor.tags?.includes("Popular") && (
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <Sparkles size={12} />
              Featured
            </div>
          </div>
        )}
        <div
          className="relative h-64 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.img
            key={displayImages[currentImageIndex]}
            src={displayImages[currentImageIndex] || ""}
            alt={vendor?.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {displayImages.length > 1 && (
            <>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 bg-black/50 px-3 py-1.5 rounded-full">
                {displayImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </>
          )}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={() => onFavorite(vendor._id)}
              className="bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all"
            >
              <Heart
                size={18}
                className={isFavorite ? `text-${color}-500 fill-${color}-500` : "text-gray-600 dark:text-gray-300"}
              />
            </button>
            <button className="bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all">
              <Share2 size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 dark:bg-gray-900/70 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star size={16} className={`text-${color}-500 fill-${color}-500`} />
                    <span className="font-bold text-gray-900 dark:text-gray-100">{vendor?.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Link href={`/vendor/${vendor?.category}/${vendor?._id}`} className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{vendor?.name}</h3>
                <span
                  className={`inline-block mt-1 text-xs font-medium px-2 py-1 rounded-full ${
                    vendor.availability === "Available"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                  }`}
                >
                  {vendor.availability || "Available"}
                </span>
              </div>
              <span
                className={`bg-${color}-50 dark:bg-${color}-900/50 text-${color}-600 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-semibold capitalize`}
              >
                {vendor?.category}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {vendor?.address?.city && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400 dark:text-gray-500" />
                  <span>{vendor?.address?.city}</span>
                </div>
              )}
              {vendor?.seating?.max && (
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400 dark:text-gray-500" />
                  <span>Up to {vendor?.seating?.max} guests</span>
                </div>
              )}
              <div className="flex items-center gap-2 pt-2">
                <TrendingUp size={16} className="text-gray-400 dark:text-gray-500" />
                <span className="text-xs">{vendor?.bookings || 0} bookings in last 3 months</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className={`text-${color}-500 fill-${color}-500`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">({vendor?.reviews || 0} reviews)</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Starting from</p>
                <p className={`font-bold text-2xl text-${color}-600 dark:text-amber-400`}>₹{displayPrice}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2.5 rounded-lg transition-colors`}
                >
                  <Phone size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2.5 rounded-lg transition-colors`}
                >
                  <Mail size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
            <button
              className={`w-full bg-amber-600 text-white hover:bg-amber-700 px-5 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2`}
            >
              <Calendar size={18} />
              Check Availability
            </button>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

const FilterPanel = ({
  color,
  showFeaturedOnly,
  setShowFeaturedOnly,
  vendorCategories,
  selectedCategories,
  handleCategoryChange,
  priceRange,
  setPriceRange,
  guestCapacity,
  setGuestCapacity,
  availableCities,
  selectedLocations,
  handleLocationChange,
  onClear,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(matcher.matches);
    const listener = (e) => setIsDarkMode(e.matches);
    matcher.addEventListener("change", listener);
    return () => matcher.removeEventListener("change", listener);
  }, []);

  const hasVenues = selectedCategories.includes("venues");

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-3 flex items-center">
          <div className={`w-1 h-6 bg-${color}-500 rounded-full mr-3`}></div>
          Quick Filters
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-amber-500" />
              <span className="font-medium text-gray-800 dark:text-gray-200">Featured Only</span>
            </div>
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              className={`w-5 h-5 rounded text-${color}-600 focus:ring-${color}-500 border-gray-300 dark:border-gray-500 dark:bg-gray-600 transition-colors`}
            />
          </label>
        </div>
      </div>
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-3 flex items-center">
          <div className={`w-1 h-6 bg-${color}-500 rounded-full mr-3`}></div>
          Vendor Category
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {vendorCategories.map((cat) => (
            <label
              key={cat}
              className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className={`w-5 h-5 rounded text-${color}-600 focus:ring-${color}-500 border-gray-300 dark:border-gray-500 dark:bg-gray-600 mr-3 transition-colors ${
                  selectedCategories.includes(cat) ? "bg-blue-600 border-blue-600" : ""
                }`}
              />
              <span
                className={`capitalize ${
                  selectedCategories.includes(cat)
                    ? "text-gray-900 dark:text-gray-100 font-medium"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>
      {availableCities.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-3 flex items-center">
            <div className={`w-1 h-6 bg-${color}-500 rounded-full mr-3`}></div>
            Location
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {availableCities.map((city) => (
              <label
                key={city}
                className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(city)}
                  onChange={() => handleLocationChange(city)}
                  className={`w-5 h-5 rounded text-${color}-600 focus:ring-${color}-500 border-gray-300 dark:border-gray-500 dark:bg-gray-600 mr-3 transition-colors ${
                    selectedLocations.includes(city) ? "bg-blue-600 border-blue-600" : ""
                  }`}
                />
                <span
                  className={`${
                    selectedLocations.includes(city)
                      ? "text-gray-900 dark:text-gray-100 font-medium"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {city}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-3 flex items-center">
          <div className={`w-1 h-6 bg-${color}-500 rounded-full mr-3`}></div>
          Price Range
        </h3>
        <div className="px-3">
          <Slider
            range
            min={0}
            max={1000000}
            step={10000}
            value={priceRange}
            onChange={setPriceRange}
            styles={{
              track: { height: 6 },
              rail: {
                backgroundColor: isDarkMode ? "#4b5563" : "#e5e7eb",
                height: 6,
              },
              handle: {
                backgroundColor: `var(--color-${color}-500, #ef4444)`,
                borderColor: `var(--color-${color}-500, #ef4444)`,
                width: 20,
                height: 20,
                marginTop: -7,
                opacity: 1,
              },
            }}
            trackStyle={{
              backgroundColor: `var(--color-${color}-500, #ef4444)`,
            }}
          />
          <div className="flex justify-between mt-4">
            <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Min</p>
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                ₹{priceRange[0].toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Max</p>
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                ₹{priceRange[1].toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>
      {hasVenues && (
        <div className="pb-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-3 flex items-center">
            <div className={`w-1 h-6 bg-${color}-500 rounded-full mr-3`}></div>
            Guest Capacity
          </h3>
          <div className="px-3">
            <Slider
              min={0}
              max={2000}
              step={50}
              value={guestCapacity}
              onChange={setGuestCapacity}
              styles={{
                track: { height: 6 },
                rail: {
                  backgroundColor: isDarkMode ? "#4b5563" : "#e5e7eb",
                  height: 6,
                },
                handle: {
                  backgroundColor: `var(--color-${color}-500, #ef4444)`,
                  borderColor: `var(--color-${color}-500, #ef4444)`,
                  width: 20,
                  height: 20,
                  marginTop: -7,
                  opacity: 1,
                },
              }}
              trackStyle={{
                backgroundColor: `var(--color-${color}-500, #ef4444)`,
              }}
            />
            <div className="flex justify-between mt-4 text-sm">
              <span>Up to {guestCapacity.toLocaleString()} guests</span>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={onClear}
        className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-medium transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

const themeColors = {
  Wedding: "rose",
  Anniversary: "amber",
  Birthday: "blue",
  Default: "slate",
};

const Sidebar = React.memo(({ isCollapsed, onToggle, children }) => {
  const sidebarVariants = {
    open: {
      width: 320,
      transition: { type: "spring", stiffness: 400, damping: 35 },
    },
    collapsed: {
      width: 80,
      transition: { type: "spring", stiffness: 400, damping: 35 },
    },
  };

  const contentVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] },
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const iconVariants = {
    collapsed: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, delay: 0.15 },
    },
    open: { opacity: 0, scale: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false}
      animate={isCollapsed ? "collapsed" : "open"}
      className="relative"
    >
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 sticky top-24">
        <button
          onClick={onToggle}
          className="absolute -right-3 top-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all z-10 text-gray-800 dark:text-gray-200 cursor-pointer"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <ChevronLeft size={16} />
          </motion.div>
        </button>
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div key="filters" variants={contentVariants} initial="collapsed" animate="open" exit="collapsed">
                {children}
              </motion.div>
            ) : (
              <motion.div
                key="icons"
                variants={iconVariants}
                initial="open"
                animate="collapsed"
                exit="open"
                className="flex flex-col items-center gap-6"
              >
                <button
                  className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Filters"
                >
                  <Filter size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Search"
                >
                  <Search size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Price"
                >
                  <DollarSign size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
});
Sidebar.displayName = "Sidebar";

export default function MarketplacePageWrapper() {
  const { activeCategory } = useCategoryStore();
  const [vendors, setVendors] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [viewMode, setViewMode] = useState("grid-cols-1 md:grid-cols-2");
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [guestCapacity, setGuestCapacity] = useState(0);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  const color = themeColors[activeCategory] || themeColors.Default;
  const vendorCategories = useMemo(
    () => [
      "venues",
      "photographers",
      "makeup",
      "planners",
      "catering",
      "clothes",
      "mehendi",
      "cakes",
      "jewellery",
      "invitations",
      "djs",
      "hairstyling",
      "other",
    ],
    []
  );

  const params = useParams();
  const pageCategory = params.category;

  useEffect(() => {
    if (pageCategory && typeof pageCategory === "string") {
      setSelectedCategories([pageCategory]);
    } else {
      setSelectedCategories([]);
    }
  }, [pageCategory]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedPriceRange = useDebounce(priceRange, 500);
  const debouncedGuestCapacity = useDebounce(guestCapacity, 500);

  useEffect(() => {
    const cities = [...new Set(vendors.map((v) => v.address?.city).filter(Boolean))].sort();
    setAvailableCities(cities);
  }, [vendors]);

  const fetchVendors = useMemo(() => {
    return async () => {
      setIsLoading(true);
      const paramsObj = {
        page: currentPage.toString(),
        limit: "10",
        sortBy,
      };

      if (debouncedSearchQuery) {
        paramsObj.search = debouncedSearchQuery;
      }
      if (selectedCategories.length > 0) {
        paramsObj.categories = selectedCategories.join(",");
      }
      if (showFeaturedOnly) {
        paramsObj.featured = "true";
      }
      if (selectedLocations.length > 0) {
        paramsObj.cities = selectedLocations.join(",");
      }
      if (debouncedPriceRange[0] > 0 || debouncedPriceRange[1] < 1000000) {
        paramsObj.minPrice = debouncedPriceRange[0].toString();
        paramsObj.maxPrice = debouncedPriceRange[1].toString();
      }
      if (debouncedGuestCapacity > 0) {
        paramsObj.guestCapacity = debouncedGuestCapacity.toString();
      }

      const params = new URLSearchParams(paramsObj);

      try {
        const response = await fetch(`/api/vendor?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setVendors(result.data);
        setPaginationInfo(result.pagination);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setIsLoading(false);
      }
    };
  }, [
    currentPage,
    sortBy,
    debouncedPriceRange,
    debouncedSearchQuery,
    selectedCategories,
    showFeaturedOnly,
    selectedLocations,
    debouncedGuestCapacity,
  ]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    sortBy,
    debouncedPriceRange,
    debouncedSearchQuery,
    selectedCategories,
    showFeaturedOnly,
    selectedLocations,
    debouncedGuestCapacity,
  ]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }, []);

  const handleLocationChange = useCallback((city) => {
    setSelectedLocations((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]));
  }, []);

  const handleFavorite = (vendorId) => {
    setFavorites((prev) => (prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]));
  };

  const clearAllFilters = () => {
    setSelectedCategories(pageCategory ? [pageCategory] : []);
    setPriceRange([0, 1000000]);
    setShowFeaturedOnly(false);
    setGuestCapacity(0);
    setSelectedLocations([]);
    setSearchQuery("");
    setSortBy("rating");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterPanelProps = {
    color,
    showFeaturedOnly,
    setShowFeaturedOnly,
    vendorCategories,
    selectedCategories,
    handleCategoryChange,
    priceRange,
    setPriceRange,
    guestCapacity,
    setGuestCapacity,
    availableCities,
    selectedLocations,
    handleLocationChange,
    onClear: clearAllFilters,
  };

  const ComparisonBar = () => (
    <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-lg z-40"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-x-auto">
              <span className="font-semibold text-nowrap text-gray-800 dark:text-gray-200">
                {compareList.length} vendors selected
              </span>
              <div className="flex gap-2">
                {compareList.map((vendor) => (
                  <div
                    key={vendor._id}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg text-nowrap"
                  >
                    <img src={vendor.defaultImage} alt={vendor.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{vendor.name}</span>
                    <button
                      onClick={() => setCompareList((prev) => prev.filter((v) => v._id !== vendor._id))}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => setCompareList([])}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 font-medium"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowComparison(true)}
                className={`bg-${color}-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-${color}-700 transition-colors text-nowrap`}
              >
                Compare
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 theme-${color}`}>
      <style jsx global>{`
        .theme-rose {
          --color-rose-500: #f43f5e;
          --color-rose-600: #e11d48;
        }
        .theme-amber {
          --color-amber-500: #f59e0b;
          --color-amber-600: #d97706;
        }
        .theme-blue {
          --color-blue-500: #3b82f6;
          --color-blue-600: #2563eb;
        }
        .theme-slate {
          --color-slate-500: #64748b;
          --color-slate-600: #475569;
        }
      `}</style>
      <div className="relative pt-6 sm:pt-8 pb-5 sm:pb-4">
        <div
          className="absolute inset-0 -z-0 dark:hidden"
          style={{
            background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #f59e0b 100%)",
          }}
        />
        <div
          className="absolute inset-0 -z-0 hidden dark:block"
          style={{
            background: "radial-gradient(125% 125% at 50% 90%, #111827 40%, #451a03 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 !z-40">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Find Your Perfect Vendor
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Discover top-rated professionals for your special event
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vendors by name or location..."
                  className="w-full px-6 py-4 pl-14 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-2xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 dark:focus:ring-rose-900/50 transition-all"
                />
                <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              {
                icon: Award,
                label: "500+ Verified Vendors",
                color: "text-green-600 dark:text-green-400",
              },
              {
                icon: Star,
                label: "4.8+ Average Rating",
                color: "text-amber-600 dark:text-amber-400",
              },
              {
                icon: Zap,
                label: "Instant Booking",
                color: "text-blue-600 dark:text-blue-400",
              },
              {
                icon: Shield,
                label: "100% Secure",
                color: "text-rose-600 dark:text-rose-400",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 text-center"
              >
                <stat.icon size={24} className={`mx-auto mb-2 ${stat.color}`} />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-65 dark:opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px), radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px), radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)`,
            backgroundSize: "40px 40px, 40px 40px, 40px 40px, 40px 40px",
          }}
        />
        <div className="relative !z-50">
          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="w-80 h-full bg-white dark:bg-gray-800 shadow-xl flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between flex-shrink-0">
                    <h2 className="text-lg font-semibold dark:text-gray-100">Filters</h2>
                    <button onClick={() => setMobileFiltersOpen(false)} className="dark:text-gray-200">
                      <X size={24} />
                    </button>
                  </div>
                  <div className="p-6 pt-6 overflow-y-auto">
                    <FilterPanel {...filterPanelProps} />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-start gap-8">
          <div className="hidden lg:block">
            <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}>
              <FilterPanel {...filterPanelProps} />
            </Sidebar>
          </div>
          <main className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl z-40 relative shadow-sm border border-gray-100 dark:border-gray-700/50 p-4 lg:p-6 mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {paginationInfo.totalVendors || 0} Vendors Found
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 capitalize">
                    Showing results for "{selectedCategories.join(", ") || "All Events"}"
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <SlidersHorizontal size={18} />
                    <span>Filters</span>
                  </button>
                  <div className="hidden lg:flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    {[
                      {
                        mode: "grid-cols-1",
                        title: "1 Column",
                        icon: Square,
                        rotation: "rotate-90",
                      },
                      {
                        mode: "grid-cols-1 md:grid-cols-2",
                        title: "2 Columns",
                        icon: LayoutGrid,
                        rotation: "",
                      },
                    ].map((v) => (
                      <button
                        key={v.mode}
                        onClick={() => setViewMode(v.mode)}
                        className={`p-2 rounded-md transition-all text-gray-700 dark:text-gray-300 ${
                          viewMode === v.mode
                            ? "bg-white dark:bg-gray-600 shadow-sm"
                            : "hover:bg-gray-200 dark:hover:bg-gray-600/50"
                        }`}
                        title={v.title}
                      >
                        <v.icon size={18} className={v.rotation} />
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 w-full justify-between sm:w-auto px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {sortBy === "rating" && "Top Rated"}
                        {sortBy === "price-asc" && "Price: Low to High"}
                        {sortBy === "price-desc" && "Price: High to Low"}
                        {sortBy === "bookings" && "Most Popular"}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform text-gray-800 dark:text-gray-200 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
                        >
                          {[
                            { value: "rating", label: "Top Rated" },
                            { value: "bookings", label: "Most Popular" },
                            { value: "price-asc", label: "Price: Low to High" },
                            {
                              value: "price-desc",
                              label: "Price: High to Low",
                            },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSortBy(option.value);
                                setDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                sortBy === option.value
                                  ? `text-${color}-600 dark:text-${color}-400 bg-${color}-50 dark:bg-${color}-900/50`
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
            <motion.div layout className={`grid gap-6 ${viewMode} ${compareList.length > 0 ? "pb-24 sm:pb-20" : ""}`}>
              <AnimatePresence>
                {isLoading
                  ? Array.from({ length: 10 }).map((_, index) => <CardSkeleton key={index} />)
                  : vendors.map((vendor) => (
                      <UnifiedCard
                        key={vendor._id}
                        vendor={vendor}
                        color={color}
                        onFavorite={handleFavorite}
                        isFavorite={favorites.includes(vendor._id)}
                      />
                    ))}
              </AnimatePresence>
            </motion.div>
            {!isLoading && vendors.length === 0 && (
              <div className="text-center py-16">
                <Search size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No vendors found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search query</p>
              </div>
            )}
            {!isLoading && paginationInfo.totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={paginationInfo.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </main>
        </div>
      </div>
      <ComparisonBar />
    </div>
  );
}
