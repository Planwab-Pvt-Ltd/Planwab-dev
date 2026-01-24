"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Users,
  Camera,
  Brush,
  UserCheck,
  ArrowRight,
  Award,
  Clock,
  CheckCircle,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Music,
  Drum,
  Mic,
  Sparkles as Fireworks,
  Users2,
  MoreHorizontal,
  Palette,
  Utensils,
  Shirt,
  HandHeart,
  Cake,
  Gem,
  MailOpen,
  Disc,
  Scissors,
  Heart,
  ChevronDown,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import MobileStyleVendorCard from "../vendor/VendorCard";

// Map user-friendly filter labels to database category names for API compatibility
const categoryMap = {
  "All": null,
  "Venues": "venues",
  "Photographers": "photographers", 
  "Decorators": "decorators",
  "Planners": "planners",
  "Makeup": "makeup",
  "Catering": "catering",
  "Clothes": "clothes",
  "Mehendi": "mehendi",
  "Cakes": "cakes",
  "Jewellery": "jewellery",
  "Invitations": "invitations",
  "DJs": "djs",
  "Hairstyling": "hairstyling",
  "Dhol": "dhol",
  "Anchor": "anchor",
  "Stage Entry": "stage-entry",
  "Fireworks": "fireworks",
  "Barat": "barat",
  "Other": "other"
};

const filters = [
  {
    label: "All",
    icon: <Sparkles size={18} />,
    gradient: "from-amber-400 to-yellow-500",
  },
  {
    label: "Venues",
    icon: <MapPin size={18} />,
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    label: "Photographers",
    icon: <Camera size={18} />,
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    label: "Decorators",
    icon: <Brush size={18} />,
    gradient: "from-rose-400 to-pink-500",
  },
  {
    label: "Planners",
    icon: <UserCheck size={18} />,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    label: "Makeup",
    icon: <Palette size={18} />,
    gradient: "from-pink-400 to-rose-500",
  },
  {
    label: "Catering",
    icon: <Utensils size={18} />,
    gradient: "from-orange-400 to-amber-500",
  },
  {
    label: "Clothes",
    icon: <Shirt size={18} />,
    gradient: "from-purple-400 to-indigo-500",
  },
  {
    label: "Mehendi",
    icon: <HandHeart size={18} />,
    gradient: "from-red-400 to-pink-500",
  },
  {
    label: "Cakes",
    icon: <Cake size={18} />,
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    label: "Jewellery",
    icon: <Gem size={18} />,
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    label: "Invitations",
    icon: <MailOpen size={18} />,
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    label: "DJs",
    icon: <Disc size={18} />,
    gradient: "from-violet-400 to-purple-500",
  },
  {
    label: "Hairstyling",
    icon: <Scissors size={18} />,
    gradient: "from-teal-400 to-green-500",
  },
  {
    label: "Dhol",
    icon: <Drum size={18} />,
    gradient: "from-purple-400 to-violet-500",
  },
  {
    label: "Anchor",
    icon: <Mic size={18} />,
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    label: "Stage Entry",
    icon: <Music size={18} />,
    gradient: "from-pink-400 to-rose-500",
  },
  {
    label: "Fireworks",
    icon: <Fireworks size={18} />,
    gradient: "from-orange-400 to-red-500",
  },
  {
    label: "Barat",
    icon: <Users2 size={18} />,
    gradient: "from-indigo-400 to-purple-500",
  },
  {
    label: "Other",
    icon: <MoreHorizontal size={18} />,
    gradient: "from-gray-400 to-gray-500",
  },
];

// Collapsible Filters Component
const CollapsibleFilters = ({ activeFilter, setActiveFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleCount = 8; // Show 8 filters initially
  
  const visibleFilters = isExpanded ? filters : filters.slice(0, visibleCount);
  const hasMore = filters.length > visibleCount;

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-6xl mx-auto">
      {/* Filter Container */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 px-6 py-4 w-full">
        <div className="flex items-center justify-center gap-2">
          {/* Filter Pills Container */}
          <div className={`flex items-center gap-2 transition-all duration-300 ${
            isExpanded ? 'flex-wrap max-h-40 overflow-y-auto' : 'overflow-x-auto scrollbar-hide'
          }`}>
            {/* "All" Button - Special Yellow Styling */}
            <motion.button
              onClick={() => setActiveFilter("All")}
              className={`relative px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-50 flex-shrink-0 ${
                activeFilter === "All" 
                  ? "text-white" 
                  : "text-gray-600 hover:text-gray-900 bg-yellow-50 hover:bg-yellow-100"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.02 }}
            >
              {activeFilter === "All" && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.7">
                <Sparkles size={16} />
                All
              </span>
            </motion.button>

            {/* Other Filters */}
            {visibleFilters.slice(1).map((filter, index) => (
              <motion.button
                key={filter.label}
                onClick={() => setActiveFilter(filter.label)}
                className={`relative px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  activeFilter === filter.label
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + 1) * 0.02 }}
              >
                {activeFilter === filter.label && (
                  <motion.div
                    layoutId="activeFilter"
                    className={`absolute inset-0 bg-gradient-to-r ${filter.gradient} rounded-2xl`}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.7">
                  {filter.icon}
                  {filter.label}
                </span>
              </motion.button>
            ))}
            
            {/* Show More/Less Button - After Filters */}
            {hasMore && (
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="relative px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex-shrink-0 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: visibleCount * 0.02 }}
              >
                <span className="flex items-center gap-1.5">
                  {isExpanded ? (
                    <>
                      Show Less
                      <ChevronDown size={14} className="rotate-180" />
                    </>
                  ) : (
                    <>
                      Show More
                      <ChevronDown size={14} />
                    </>
                  )}
                </span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
      
      {/* Status Indicator */}
      {hasMore && !isExpanded && (
        <motion.p
          className="text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filters.length - visibleCount} more categories
        </motion.p>
      )}
    </div>
  );
};

// Mobile-style vendor card component


export default function VendorsSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [vendorsData, setVendorsData] = useState([]);
  const [verifiedVendorsCount, setVerifiedVendorsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const MotionLink = motion(Link);
  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Convert user-friendly filter label to database category name
        const category = categoryMap[activeFilter];
        
        // Build query parameters for API request to main vendor endpoint
        const queryParams = new URLSearchParams();
        queryParams.set("landing", "true");        // Indicate this is a landing page request
        queryParams.set("limit", "12");            // Limit to 12 vendors for display
        
        // Add category filter if a specific category is selected (not "All")
        if (category) queryParams.set("category", category);
        
        // Fetch vendor data from consolidated API endpoint
        const response = await fetch(`/api/vendor?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch vendors');
        }
        
        const result = await response.json();
        
        if (result.success) {
          setVendorsData(result.data);
          setVerifiedVendorsCount(result.meta?.verifiedVendorsCount || 0);
        } else {
          throw new Error(result.message || 'Failed to fetch vendors');
        }
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setError(err.message);
        // Fallback to empty array on error
        setVendorsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [activeFilter]);

  const filteredVendors = vendorsData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-amber-900/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.12),transparent_50%)] pointer-events-none" />
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100/80 to-yellow-100/80 dark:from-amber-900/50 dark:to-yellow-900/50 backdrop-blur-sm text-amber-700 dark:text-amber-300 px-6 py-3 rounded-full text-sm font-bold mb-6 border border-amber-200/50 dark:border-amber-800/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Sparkles size={16} />
            Premium Event Partners
          </motion.div>
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-amber-800 to-gray-900 dark:from-gray-100 dark:via-amber-300 dark:to-gray-100 bg-clip-text text-transparent tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover Elite{" "}
            <span className="block bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-500 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent">
              Event Professionals
            </span>
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-gray-700 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Connect with our carefully curated network of top-tier vendors who will bring your dream event to life with
            unmatched expertise and creativity.
          </motion.p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex justify-center mb-12 sm:mb-16">
          <CollapsibleFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        </motion.div>
        <motion.div
          className="grid grid-cols-4 gap-6 auto-rows-fr max-w-6xl mx-auto"
          layout
          variants={containerVariants}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              // Loading skeleton cards matching mobile style - 8 cards total (7 vendors + 1 view all)
              Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                  key={`loading-${index}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                  className="flex-shrink-0 w-full bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                >
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded mb-3 animate-pulse w-3/4" />
                    <div className="flex justify-between pt-3 border-t border-gray-100">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : error ? (
              // Error state
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="text-red-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Vendors</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            ) : filteredVendors.length === 0 ? (
              // Empty state
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Vendors Found</h3>
                <p className="text-gray-600">Try adjusting your filters or check back later for new vendors.</p>
              </motion.div>
            ) : (
              <>
                {/* Vendor cards using mobile-style design - first 7 vendors */}
                {filteredVendors.slice(0, 7).map((vendor) => (
                  <motion.div
                    key={vendor._id || vendor.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MobileStyleVendorCard vendor={vendor} />
                  </motion.div>
                ))}

                {/* View All Card - 8th card (Row 2, Col 4) */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  className="flex-shrink-0 w-full bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-2 border-dashed border-purple-200 rounded-xl flex flex-col items-center justify-center p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  {/* Icon */}
                  <Link href="/vendors/marketplace">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </Link>
                  
                  {/* Text */}
                  <h3 className="text-xl font-bold text-gray-800 mb-1">View All</h3>
                  <p className="text-sm text-gray-600">Explore more vendors</p>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div variants={itemVariants} className="text-center mt-16">
          <MotionLink
            href="/vendors/marketplace"
            className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white px-8 sm:px-10 py-4 rounded-3xl font-bold text-base sm:text-lg flex items-center gap-3 mx-auto hover:shadow-2xl transition-all duration-400 border-2 border-amber-300/50"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles size={20} />
            Explore All Premium Vendors
            <ArrowRight size={20} />
          </MotionLink>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
            Join 10,000+ satisfied customers who found their perfect vendors
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
