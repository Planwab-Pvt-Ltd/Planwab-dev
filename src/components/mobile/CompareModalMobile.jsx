// CompareModal.jsx - MOBILE OPTIMIZED VERSION
"use client";

import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Award,
  CheckCircle,
  XCircle,
  Trophy,
  TrendingUp,
  MessageCircle,
  DollarSign,
  Calendar,
  Shield,
  BadgeCheck,
  Zap,
  Heart,
  Share2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  Info,
  Gift,
  Percent,
  Building2,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Sparkles,
  Crown,
  Target,
  ThumbsUp,
  ArrowRight,
  Check,
  Minus,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Navigation,
  Briefcase,
  Camera,
  Palette,
  Music,
  Utensils,
  Scissors,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ClipboardList,
} from "lucide-react";

// ============================================
// UTILITY FUNCTIONS
// ============================================
const formatPrice = (price) => {
  if (price == null || isNaN(price)) return "N/A";
  if (price === 0) return "₹0";
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
  if (price >= 1000) return `₹${(price / 1000).toFixed(0)}K`;
  return `₹${price.toLocaleString("en-IN")}`;
};

const formatFullPrice = (price) => {
  if (price == null || isNaN(price)) return "N/A";
  return `₹${price.toLocaleString("en-IN")}`;
};

const getVendorPrice = (vendor) => {
  return vendor.basePrice || vendor.perDayPrice?.min || vendor.price?.min || vendor.startingPrice || 0;
};

const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text || "";
  return `${text.substring(0, maxLength)}...`;
};

const parsePercentage = (str) => {
  if (!str) return 0;
  const match = String(str).match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

const getVendorImage = (vendor, index = 0) => {
  return vendor?.images?.[index] || vendor?.defaultImage || vendor?.gallery?.[index]?.url || "/placeholder.jpg";
};

const getCategoryIcon = (category) => {
  const icons = {
    photographers: Camera,
    venues: Building2,
    catering: Utensils,
    makeup: Palette,
    mehendi: Scissors,
    djs: Music,
    planners: Calendar,
    clothes: Crown,
  };
  return icons[category] || Briefcase;
};

const getCategoryColor = (category) => {
  const colors = {
    photographers: "#ec4899",
    venues: "#8b5cf6",
    catering: "#f59e0b",
    makeup: "#f43f5e",
    mehendi: "#84cc16",
    djs: "#3b82f6",
    planners: "#06b6d4",
    clothes: "#a855f7",
  };
  return colors[category] || "#6b7280";
};

// ============================================
// COMPARISON METRICS CONFIGURATION
// ============================================
const COMPARISON_METRICS = [
  {
    key: "rating",
    label: "Rating",
    icon: Star,
    weight: 25,
    higherBetter: true,
    format: (v) => (v ? `${Number(v).toFixed(1)}/5` : "N/A"),
    getValue: (v) => v?.rating || v?.averageRating || 0,
    color: "#fbbf24",
    maxValue: 5,
    description: "Customer satisfaction score",
  },
  {
    key: "reviews",
    label: "Reviews",
    icon: MessageCircle,
    weight: 15,
    higherBetter: true,
    format: (v) => (v ? v.toLocaleString() : "0"),
    getValue: (v) => v?.reviews || v?.reviewCount || 0,
    color: "#8b5cf6",
    maxValue: 1000,
    description: "Total customer reviews",
  },
  {
    key: "bookings",
    label: "Bookings",
    icon: TrendingUp,
    weight: 15,
    higherBetter: true,
    format: (v) => (v ? v.toLocaleString() : "0"),
    getValue: (v) => v?.bookings || v?.totalBookings || 0,
    color: "#10b981",
    maxValue: 1500,
    description: "Completed bookings",
  },
  {
    key: "experience",
    label: "Experience",
    icon: Award,
    weight: 15,
    higherBetter: true,
    format: (v) => (v ? `${v} yrs` : "N/A"),
    getValue: (v) => v?.yearsExperience || 0,
    color: "#f59e0b",
    maxValue: 25,
    description: "Years in business",
  },
  {
    key: "responseRate",
    label: "Response Rate",
    icon: Zap,
    weight: 10,
    higherBetter: true,
    format: (v) => (v ? `${v}%` : "N/A"),
    getValue: (v) => parsePercentage(v?.responseRate),
    color: "#06b6d4",
    maxValue: 100,
    description: "Query response rate",
  },
  {
    key: "teamSize",
    label: "Team Size",
    icon: Users,
    weight: 5,
    higherBetter: true,
    format: (v) => (v ? `${v}` : "N/A"),
    getValue: (v) => v?.teamSize || 0,
    color: "#6366f1",
    maxValue: 50,
    description: "Team members",
  },
  {
    key: "repeatCustomers",
    label: "Repeat Rate",
    icon: Heart,
    weight: 10,
    higherBetter: true,
    format: (v) => (v ? `${v}%` : "N/A"),
    getValue: (v) => parsePercentage(v?.repeatCustomerRate),
    color: "#ec4899",
    maxValue: 100,
    description: "Returning customers",
  },
  {
    key: "awards",
    label: "Awards",
    icon: Trophy,
    weight: 5,
    higherBetter: true,
    format: (v) => (v ? v.toString() : "0"),
    getValue: (v) => v?.awards?.length || 0,
    color: "#eab308",
    maxValue: 5,
    description: "Recognition & awards",
  },
];

// ============================================
// CALCULATE VENDOR SCORES - DETAILED LOGIC
// ============================================
const calculateVendorScore = (vendor) => {
  if (!vendor) return 0;

  let totalScore = 0;

  COMPARISON_METRICS.forEach((metric) => {
    const value = metric.getValue(vendor);
    let normalizedScore = 0;

    // Normalize to 0-100 scale based on maxValue
    if (metric.maxValue && metric.maxValue > 0) {
      normalizedScore = Math.min((value / metric.maxValue) * 100, 100);
    }

    // Apply weight (weight is percentage, so divide by 100)
    totalScore += normalizedScore * (metric.weight / 100);
  });

  // Bonus points (max 10 additional points)
  let bonusPoints = 0;
  if (vendor.isVerified) bonusPoints += 3;
  if (vendor.isFeatured) bonusPoints += 2;
  if (vendor.tags?.includes("Popular")) bonusPoints += 2;
  if (vendor.tags?.includes("Top Rated")) bonusPoints += 2;
  if (vendor.specialOffers?.length > 0) bonusPoints += 1;

  totalScore += bonusPoints;

  return Math.min(Math.round(totalScore), 100);
};

// Get detailed score breakdown
const getScoreBreakdown = (vendor) => {
  if (!vendor) return [];

  return COMPARISON_METRICS.map((metric) => {
    const value = metric.getValue(vendor);
    let normalizedScore = 0;

    if (metric.maxValue && metric.maxValue > 0) {
      normalizedScore = Math.min((value / metric.maxValue) * 100, 100);
    }

    const weightedScore = normalizedScore * (metric.weight / 100);

    return {
      ...metric,
      rawValue: value,
      normalizedScore: Math.round(normalizedScore),
      weightedScore: Math.round(weightedScore * 10) / 10,
    };
  });
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Animated Score Circle - MOBILE OPTIMIZED
const ScoreCircle = memo(({ score, size = 100, strokeWidth = 6, delay = 0 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (s) => {
    if (s >= 80) return "#10b981";
    if (s >= 60) return "#3b82f6";
    if (s >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLabel = (s) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Average";
    return "Below Avg";
  };

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size + 20 }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, delay, ease: "easeOut" }}
        />
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.5 }}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ height: size }}
      >
        <span className="text-2xl sm:text-3xl font-black" style={{ color: getScoreColor(score) }}>
          {score}
        </span>
        <span className="text-[10px] font-medium text-gray-500">/ 100</span>
      </motion.div>
      <span
        className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full"
        style={{
          backgroundColor: `${getScoreColor(score)}20`,
          color: getScoreColor(score),
        }}
      >
        {getScoreLabel(score)}
      </span>
    </div>
  );
});
ScoreCircle.displayName = "ScoreCircle";

// Mobile Vendor Card - Compact Version
const MobileVendorCard = memo(({ vendor, score, rank, isWinner, isExpanded, onToggle }) => {
  const CategoryIcon = getCategoryIcon(vendor?.category);
  const categoryColor = getCategoryColor(vendor?.category);

  if (!vendor) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-white dark:bg-gray-800 rounded-xl border-2 transition-all ${
        isWinner
          ? "border-amber-400 shadow-lg shadow-amber-100 dark:shadow-amber-900/20"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      {/* Winner Badge */}
      {isWinner && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 z-10">
          <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
            <Trophy size={10} />
            WINNER
          </div>
        </motion.div>
      )}

      {/* Main Content - Always Visible */}
      <div className="p-3 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-3">
          {/* Rank */}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              rank === 1
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            }`}
          >
            #{rank}
          </div>

          {/* Image */}
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-white dark:border-gray-600 shadow shrink-0">
            <Image src={getVendorImage(vendor)} alt={vendor.name || "Vendor"} fill className="object-cover" />
            {vendor.isVerified && (
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-tl-md p-0.5">
                <BadgeCheck size={8} className="text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{vendor.name}</h3>
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
              <span
                className="px-1.5 py-0.5 rounded font-medium"
                style={{
                  backgroundColor: `${categoryColor}15`,
                  color: categoryColor,
                }}
              >
                {vendor.category?.charAt(0).toUpperCase() + vendor.category?.slice(1)}
              </span>
              {vendor.address?.city && (
                <span className="flex items-center gap-0.5 truncate">
                  <MapPin size={8} />
                  {vendor.address.city}
                </span>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="text-center shrink-0">
            <div
              className="text-lg font-black"
              style={{
                color: score >= 80 ? "#10b981" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444",
              }}
            >
              {score}
            </div>
            <div className="text-[8px] text-gray-400 uppercase font-semibold">Score</div>
          </div>

          {/* Expand Icon */}
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="shrink-0">
            <ChevronDown size={16} className="text-gray-400" />
          </motion.div>
        </div>

        {/* Quick Stats Row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold">{vendor.rating?.toFixed(1) || "N/A"}</span>
          </div>
          <div className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{vendor.reviews || 0}</span> reviews
          </div>
          <div className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{vendor.bookings || 0}</span> bookings
          </div>
          <div className="text-xs font-bold text-green-600">{formatPrice(getVendorPrice(vendor))}</div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3">
              {/* Tags */}
              {vendor.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {vendor.tags.slice(0, 4).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                  <div className="text-[10px] text-gray-500 uppercase">Experience</div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">
                    {vendor.yearsExperience ? `${vendor.yearsExperience} years` : "N/A"}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                  <div className="text-[10px] text-gray-500 uppercase">Team Size</div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">
                    {vendor.teamSize ? `${vendor.teamSize} members` : "N/A"}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                  <div className="text-[10px] text-gray-500 uppercase">Response</div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">{vendor.responseRate || "N/A"}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                  <div className="text-[10px] text-gray-500 uppercase">Repeat</div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">
                    {vendor.repeatCustomerRate || "N/A"}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/vendor/${vendor.category}/${vendor._id?.$oid || vendor._id}`}
                className="block w-full py-2 text-center bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Full Profile
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
MobileVendorCard.displayName = "MobileVendorCard";

// Desktop Vendor Header Card
const VendorHeader = memo(({ vendor, score, rank, isWinner }) => {
  const CategoryIcon = getCategoryIcon(vendor?.category);
  const categoryColor = getCategoryColor(vendor?.category);

  if (!vendor) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 lg:p-5 border-2 transition-all ${
        isWinner
          ? "border-amber-400 shadow-lg shadow-amber-100 dark:shadow-amber-900/20"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      {/* Winner Badge */}
      {isWinner && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="absolute -top-3 -right-3 z-10"
        >
          <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Trophy size={12} />
            WINNER
          </div>
        </motion.div>
      )}

      {/* Rank Badge */}
      <div className="absolute top-3 left-3">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            rank === 1 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
          }`}
        >
          #{rank}
        </div>
      </div>

      {/* Vendor Image & Score */}
      <div className="flex flex-col items-center mb-3">
        <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg mb-3">
          <Image src={getVendorImage(vendor)} alt={vendor.name || "Vendor"} fill className="object-cover" />
          {vendor.isVerified && (
            <div className="absolute bottom-0.5 right-0.5 bg-blue-500 rounded-full p-0.5">
              <BadgeCheck size={10} className="text-white" />
            </div>
          )}
        </div>

        <ScoreCircle score={score} size={80} strokeWidth={5} />
      </div>

      {/* Vendor Info */}
      <div className="text-center">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm lg:text-base mb-1 line-clamp-1">
          {vendor.name}
        </h3>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span
            className="px-2 py-0.5 rounded-md text-[10px] lg:text-xs font-semibold flex items-center gap-1"
            style={{
              backgroundColor: `${categoryColor}15`,
              color: categoryColor,
            }}
          >
            <CategoryIcon size={10} />
            {vendor.category?.charAt(0).toUpperCase() + vendor.category?.slice(1)}
          </span>
        </div>

        {vendor.address?.city && (
          <div className="flex items-center justify-center gap-1 text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">
            <MapPin size={10} />
            {vendor.address.city}
          </div>
        )}

        {/* Tags */}
        <div className="flex items-center justify-center gap-1 mt-2 flex-wrap">
          {vendor.tags?.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-[8px] lg:text-[10px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center gap-0.5 text-amber-500 mb-0.5">
            <Star size={10} className="fill-amber-500" />
            <span className="font-bold text-xs">{vendor.rating?.toFixed(1) || "N/A"}</span>
          </div>
          <span className="text-[8px] text-gray-500">Rating</span>
        </div>
        <div className="text-center">
          <span className="font-bold text-xs text-gray-900 dark:text-white">{vendor.reviews || 0}</span>
          <span className="text-[8px] text-gray-500 block">Reviews</span>
        </div>
        <div className="text-center">
          <span className="font-bold text-xs text-green-600">{formatPrice(getVendorPrice(vendor))}</span>
          <span className="text-[8px] text-gray-500 block">From</span>
        </div>
      </div>
    </motion.div>
  );
});
VendorHeader.displayName = "VendorHeader";

// Metric Comparison Bar - Mobile Optimized
const MetricBar = memo(({ metric, vendors, index }) => {
  const values = vendors.map((v) => metric.getValue(v));
  const maxValue = Math.max(...values, 1);
  const winner = metric.higherBetter
    ? values.indexOf(Math.max(...values))
    : values.indexOf(Math.min(...values.filter((v) => v > 0)));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-3 lg:p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 mb-2 lg:mb-3">
        <div className="p-1.5 lg:p-2 rounded-lg" style={{ backgroundColor: `${metric.color}20` }}>
          <metric.icon size={14} style={{ color: metric.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs lg:text-sm block truncate">
            {metric.label}
          </span>
          <span className="text-[10px] text-gray-400 hidden sm:block">{metric.description}</span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium shrink-0">{metric.weight}%</span>
      </div>

      <div className="space-y-2 lg:space-y-3">
        {vendors.map((vendor, vIdx) => {
          const value = metric.getValue(vendor);
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const isWinner = vIdx === winner && values[winner] > 0;

          return (
            <div key={vendor?._id?.$oid || vendor?._id || vIdx} className="space-y-1">
              <div className="flex items-center justify-between text-[10px] lg:text-xs">
                <span className="text-gray-600 dark:text-gray-400 truncate max-w-[100px] lg:max-w-[150px]">
                  {truncateText(vendor?.name || "Unknown", 15)}
                </span>
                <div className="flex items-center gap-1 lg:gap-2">
                  <span className="font-bold text-gray-900 dark:text-white">{metric.format(value)}</span>
                  {isWinner && <Trophy size={10} className="text-amber-500" />}
                </div>
              </div>
              <div className="h-1.5 lg:h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + vIdx * 0.1 }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: isWinner ? metric.color : `${metric.color}60`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
});
MetricBar.displayName = "MetricBar";

// Feature Check Item - Mobile Optimized
const FeatureCheck = memo(({ label, vendors, getValue }) => {
  const values = vendors.map((v) => getValue(v));

  return (
    <div className="flex items-center py-2 lg:py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <span className="flex-1 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 pr-2">{label}</span>
      {vendors.map((v, i) => {
        const value = values[i];
        const hasFeature = Boolean(value);
        const displayValue = typeof value === "boolean" ? null : value;

        return (
          <div key={v?._id?.$oid || v?._id || i} className="w-20 lg:w-32 text-center shrink-0">
            {hasFeature ? (
              <div className="flex items-center justify-center gap-0.5 lg:gap-1">
                <CheckCircle size={14} className="text-green-500 shrink-0" />
                {displayValue && (
                  <span className="text-[10px] lg:text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                    {truncateText(String(displayValue), 10)}
                  </span>
                )}
              </div>
            ) : (
              <XCircle size={14} className="text-gray-300 dark:text-gray-600 mx-auto" />
            )}
          </div>
        );
      })}
    </div>
  );
});
FeatureCheck.displayName = "FeatureCheck";

// Winner Reveal Animation - Mobile Optimized
const WinnerReveal = memo(({ winner, loser, onClose, onViewProfile }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const winnerScore = calculateVendorScore(winner);
  const loserScore = loser ? calculateVendorScore(loser) : 0;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!winner) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: "50%", y: "40%", scale: 0 }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: Math.random() * 0.3,
                ease: "easeOut",
              }}
              className="absolute w-2 h-2 lg:w-3 lg:h-3 rounded-full"
              style={{
                backgroundColor: ["#fbbf24", "#f59e0b", "#10b981", "#3b82f6", "#ec4899"][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl lg:rounded-3xl p-5 lg:p-8 max-w-md w-full text-center relative overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-yellow-100/50 dark:from-amber-900/20 dark:to-yellow-900/20" />

        <div className="relative z-10">
          {/* Trophy */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-4 lg:mb-6"
          >
            <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-200 dark:shadow-amber-900/30">
              <Trophy size={32} className="text-white lg:w-12 lg:h-12" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <h2 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white mb-1 lg:mb-2">
              🎉 We Have a Winner!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 lg:mb-6">
              Based on {COMPARISON_METRICS.length} key metrics
            </p>
          </motion.div>

          {/* Winner Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 border-2 border-amber-300 dark:border-amber-700 mb-4 lg:mb-6"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="relative w-14 h-14 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-4 border-white shadow-lg shrink-0">
                <Image src={getVendorImage(winner)} alt={winner.name || "Winner"} fill className="object-cover" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <h3 className="font-bold text-base lg:text-xl text-gray-900 dark:text-white mb-1 truncate">
                  {winner.name}
                </h3>
                <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                  <MapPin size={12} />
                  <span className="truncate">{winner.address?.city || "India"}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="font-bold text-xs lg:text-sm">{winner.rating?.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] lg:text-xs text-gray-500">{winner.reviews} reviews</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Score Comparison */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-4 lg:mb-6"
          >
            <div className="flex items-center justify-center gap-4 lg:gap-8">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-black text-green-600">{winnerScore}</div>
                <div className="text-[10px] lg:text-xs text-gray-500 mt-1">Winner Score</div>
              </div>
              {loser && (
                <>
                  <div className="text-xl lg:text-2xl font-bold text-gray-300">vs</div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-400">{loserScore}</div>
                    <div className="text-[10px] lg:text-xs text-gray-500 mt-1">{truncateText(loser.name, 12)}</div>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex gap-2 lg:gap-3"
          >
            <button
              onClick={onClose}
              className="flex-1 py-2.5 lg:py-3 px-3 lg:px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onViewProfile(winner)}
              className="flex-1 py-2.5 lg:py-3 px-3 lg:px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-1 lg:gap-2"
            >
              View Profile
              <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
});
WinnerReveal.displayName = "WinnerReveal";

// ============================================
// TAB COMPONENTS - MOBILE OPTIMIZED
// ============================================

// Overview Tab
const OverviewTab = memo(({ vendors, scores }) => {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Score Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-blue-600" />
          Overall Score Comparison
        </h3>

        {/* Mobile: Horizontal bars */}
        <div className="space-y-4 lg:hidden">
          {vendors.map((vendor, idx) => {
            const score = scores[idx];
            const isHighest = score === Math.max(...scores);

            return (
              <div key={vendor?._id?.$oid || vendor?._id || idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden">
                      <Image
                        src={getVendorImage(vendor)}
                        alt={vendor?.name || "Vendor"}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                      {vendor?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black" style={{ color: isHighest ? "#10b981" : "#6b7280" }}>
                      {score}
                    </span>
                    {isHighest && <Trophy size={14} className="text-amber-500" />}
                  </div>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, delay: idx * 0.2 }}
                    className={`h-full rounded-full ${
                      isHighest
                        ? "bg-gradient-to-r from-green-500 to-emerald-400"
                        : "bg-gradient-to-r from-gray-400 to-gray-300"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: Vertical bars */}
        <div className="hidden lg:flex items-end justify-center gap-8">
          {vendors.map((vendor, idx) => {
            const score = scores[idx];
            const isHighest = score === Math.max(...scores);
            const barHeight = (score / 100) * 200;

            return (
              <motion.div
                key={vendor?._id?.$oid || vendor?._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="text-2xl font-black mb-2" style={{ color: isHighest ? "#10b981" : "#6b7280" }}>
                  {score}
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: barHeight }}
                  transition={{ duration: 1, delay: 0.5 + idx * 0.2 }}
                  className={`w-20 rounded-t-xl ${
                    isHighest
                      ? "bg-gradient-to-t from-green-500 to-emerald-400"
                      : "bg-gradient-to-t from-gray-400 to-gray-300"
                  }`}
                />
                <div className="mt-3 text-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md mx-auto mb-2">
                    <Image
                      src={getVendorImage(vendor)}
                      alt={vendor?.name || "Vendor"}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 max-w-[100px] truncate">
                    {vendor?.name}
                  </p>
                  {isHighest && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-[10px] font-bold">
                      <Trophy size={10} /> Leading
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Metrics Grid */}
      <div>
        <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-3 lg:mb-4 flex items-center gap-2">
          <Target size={18} className="text-purple-600" />
          Detailed Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
          {COMPARISON_METRICS.map((metric, idx) => (
            <MetricBar key={metric.key} metric={metric} vendors={vendors} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
});
OverviewTab.displayName = "OverviewTab";

// Details Tab
const DetailsTab = memo(({ vendors }) => {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* About Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 lg:px-5 lg:py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm lg:text-base flex items-center gap-2">
            <Info size={16} className="text-blue-600" />
            About
          </h3>
        </div>
        <div className="p-4 lg:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {vendors.map((vendor) => (
              <div key={vendor?._id?.$oid || vendor?._id}>
                <div className="flex items-center gap-2 lg:gap-3 mb-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={getVendorImage(vendor)}
                      alt={vendor?.name || "Vendor"}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{vendor?.name}</h4>
                </div>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-4 lg:line-clamp-6">
                  {vendor?.shortDescription || vendor?.description?.substring(0, 250) || "No description available."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 lg:px-5 lg:py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm lg:text-base flex items-center gap-2">
            <Briefcase size={16} className="text-purple-600" />
            Key Details
          </h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700 px-3 lg:px-4">
          <FeatureCheck label="Verified" vendors={vendors} getValue={(v) => v?.isVerified} />
          <FeatureCheck label="Featured" vendors={vendors} getValue={(v) => v?.isFeatured} />
          <FeatureCheck label="Response Time" vendors={vendors} getValue={(v) => v?.responseTime} />
          <FeatureCheck label="Response Rate" vendors={vendors} getValue={(v) => v?.responseRate} />
          <FeatureCheck
            label="Experience"
            vendors={vendors}
            getValue={(v) => (v?.yearsExperience ? `${v.yearsExperience}y` : null)}
          />
          <FeatureCheck label="Team Size" vendors={vendors} getValue={(v) => v?.teamSize || null} />
          <FeatureCheck label="Repeat Rate" vendors={vendors} getValue={(v) => v?.repeatCustomerRate} />
        </div>
      </div>

      {/* Awards */}
      <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 lg:px-5 lg:py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm lg:text-base flex items-center gap-2">
            <Trophy size={16} className="text-amber-600" />
            Awards & Recognition
          </h3>
        </div>
        <div className="p-4 lg:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {vendors.map((vendor) => (
              <div key={vendor?._id?.$oid || vendor?._id}>
                <h4 className="font-semibold text-gray-900 dark:text-white text-xs lg:text-sm mb-2 truncate">
                  {vendor?.name}
                </h4>
                {vendor?.awards?.length > 0 ? (
                  <div className="space-y-2">
                    {vendor.awards.slice(0, 3).map((award, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <Award size={12} className="text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-[10px] lg:text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                          {award?.title || award}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] lg:text-xs text-gray-400 italic">No awards listed</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
DetailsTab.displayName = "DetailsTab";

// Pricing Tab
const PricingTab = memo(({ vendors }) => {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Price Comparison */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign size={18} className="text-green-600" />
          Price Comparison
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-6">
          {vendors.map((vendor, idx) => {
            const basePrice = getVendorPrice(vendor);
            const minPrice = vendor?.perDayPrice?.min || basePrice;
            const maxPrice = vendor?.perDayPrice?.max || basePrice;
            const prices = vendors.map((v) => getVendorPrice(v)).filter((p) => p > 0);
            const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
            const isCheapest = basePrice === lowestPrice && basePrice > 0;

            return (
              <motion.div
                key={vendor?._id?.$oid || vendor?._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-5 border-2 ${
                  isCheapest ? "border-green-400 shadow-lg" : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {isCheapest && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-[10px] font-bold mb-2">
                    <ThumbsUp size={10} /> Best Value
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={getVendorImage(vendor)}
                      alt={vendor?.name || "Vendor"}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{vendor?.name}</h4>
                </div>

                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Starting From</p>
                  <p className="text-2xl lg:text-3xl font-black text-green-600">{formatPrice(basePrice)}</p>
                </div>

                {minPrice !== maxPrice && maxPrice > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] text-gray-500 mb-1">Price Range</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {formatPrice(minPrice)}
                      </span>
                      <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full w-full" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {formatPrice(maxPrice)}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Packages */}
      <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 lg:px-5 lg:py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm lg:text-base flex items-center gap-2">
            <Gift size={16} className="text-purple-600" />
            Packages
          </h3>
        </div>
        <div className="p-4 lg:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {vendors.map((vendor) => (
              <div key={vendor?._id?.$oid || vendor?._id}>
                <h4 className="font-semibold text-gray-900 dark:text-white text-xs lg:text-sm mb-2 truncate">
                  {vendor?.name}
                </h4>
                {vendor?.packages?.length > 0 ? (
                  <div className="space-y-2">
                    {vendor.packages.slice(0, 3).map((pkg, i) => (
                      <div
                        key={i}
                        className={`p-2 lg:p-3 rounded-lg border ${
                          pkg?.isPopular
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                            : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h5 className="font-medium text-xs text-gray-900 dark:text-white line-clamp-1">
                            {pkg?.name}
                          </h5>
                          {pkg?.isPopular && (
                            <span className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 text-[8px] font-bold rounded shrink-0">
                              POPULAR
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-base lg:text-lg font-bold text-green-600">
                            {formatPrice(pkg?.price)}
                          </span>
                          {pkg?.originalPrice && pkg.originalPrice > pkg.price && (
                            <>
                              <span className="text-[10px] text-gray-400 line-through">
                                {formatPrice(pkg.originalPrice)}
                              </span>
                              <span className="px-1 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 text-[8px] font-bold rounded">
                                {pkg?.savingsPercentage || Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] lg:text-xs text-gray-400 italic">No packages listed</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Special Offers */}
      <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 lg:px-5 lg:py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm lg:text-base flex items-center gap-2">
            <Percent size={16} className="text-red-600" />
            Special Offers
          </h3>
        </div>
        <div className="p-4 lg:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {vendors.map((vendor) => (
              <div key={vendor?._id?.$oid || vendor?._id}>
                <h4 className="font-semibold text-gray-900 dark:text-white text-xs lg:text-sm mb-2 truncate">
                  {vendor?.name}
                </h4>
                {vendor?.specialOffers?.length > 0 ? (
                  <div className="space-y-2">
                    {vendor.specialOffers.slice(0, 2).map((offer, i) => (
                      <div
                        key={i}
                        className="p-2 lg:p-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-200 dark:border-red-800"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <Sparkles size={12} className="text-red-500" />
                          <span className="font-semibold text-xs text-gray-900 dark:text-white truncate">
                            {offer?.title}
                          </span>
                        </div>
                        <p className="text-[10px] lg:text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {offer?.description}
                        </p>
                        {offer?.discount && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-600 text-[10px] font-bold rounded">
                            {offer.discount}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] lg:text-xs text-gray-400 italic">No special offers</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
PricingTab.displayName = "PricingTab";

// Features Tab
const FeaturesTab = memo(({ vendors }) => {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Amenities */}
      <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 lg:px-5 lg:py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm lg:text-base flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            Amenities & Services
          </h3>
        </div>
        <div className="p-4 lg:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {vendors.map((vendor) => (
              <div key={vendor?._id?.$oid || vendor?._id}>
                <h4 className="font-semibold text-gray-900 dark:text-white text-xs lg:text-sm mb-2 truncate">
                  {vendor?.name}
                </h4>
                {vendor?.amenities?.length > 0 || vendor?.facilities?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {[...(vendor?.amenities || []), ...(vendor?.facilities || [])].slice(0, 6).map((item, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] lg:text-xs font-medium rounded-lg flex items-center gap-1"
                      >
                        <Check size={10} />
                        {truncateText(item, 20)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] lg:text-xs text-gray-400 italic">No amenities listed</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 lg:px-5 lg:py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm lg:text-base flex items-center gap-2">
            <Sparkles size={16} className="text-amber-600" />
            Highlights
          </h3>
        </div>
        <div className="p-4 lg:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {vendors.map((vendor) => (
              <div key={vendor?._id?.$oid || vendor?._id}>
                <h4 className="font-semibold text-gray-900 dark:text-white text-xs lg:text-sm mb-2 truncate">
                  {vendor?.name}
                </h4>
                {vendor?.highlightPoints?.length > 0 ? (
                  <div className="space-y-1.5">
                    {vendor.highlightPoints.slice(0, 4).map((point, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-1.5 lg:p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg"
                      >
                        <Star size={12} className="text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-[10px] lg:text-xs text-gray-700 dark:text-gray-300">{point}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] lg:text-xs text-gray-400 italic">No highlights listed</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Types */}
      <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 lg:px-5 lg:py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm lg:text-base flex items-center gap-2">
            <Calendar size={16} className="text-blue-600" />
            Event Types
          </h3>
        </div>
        <div className="p-4 lg:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {vendors.map((vendor) => (
              <div key={vendor?._id?.$oid || vendor?._id}>
                <h4 className="font-semibold text-gray-900 dark:text-white text-xs lg:text-sm mb-2 truncate">
                  {vendor?.name}
                </h4>
                {vendor?.eventTypes?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.eventTypes.slice(0, 8).map((event, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] lg:text-xs font-medium rounded-lg"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] lg:text-xs text-gray-400 italic">Not specified</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 lg:px-5 lg:py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm lg:text-base flex items-center gap-2">
            <DollarSign size={16} className="text-green-600" />
            Payment Methods
          </h3>
        </div>
        <div className="p-4 lg:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {vendors.map((vendor) => (
              <div key={vendor?._id?.$oid || vendor?._id}>
                <h4 className="font-semibold text-gray-900 dark:text-white text-xs lg:text-sm mb-2 truncate">
                  {vendor?.name}
                </h4>
                {vendor?.paymentMethods?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.paymentMethods.map((method, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] lg:text-xs font-medium rounded-lg"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] lg:text-xs text-gray-400 italic">Not specified</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
FeaturesTab.displayName = "FeaturesTab";

// Contact Tab
const ContactTab = memo(({ vendors }) => {
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {vendors.map((vendor) => (
        <motion.div
          key={vendor?._id?.$oid || vendor?._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 lg:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl overflow-hidden border-2 border-white shadow-lg shrink-0">
                <Image
                  src={getVendorImage(vendor)}
                  alt={vendor?.name || "Vendor"}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm lg:text-lg truncate">{vendor?.name}</h3>
                {vendor?.address?.city && (
                  <div className="flex items-center gap-1 text-xs lg:text-sm text-gray-500">
                    <MapPin size={12} />
                    <span className="truncate">{vendor.address.city}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-4 lg:p-5 space-y-3">
            {/* Phone */}
            {vendor?.phoneNo && (
              <div className="flex items-center justify-between p-2.5 lg:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                  <div className="p-1.5 lg:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg shrink-0">
                    <Phone size={14} className="text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500">Phone</p>
                    <p className="font-medium text-xs lg:text-sm text-gray-900 dark:text-white truncate">
                      {vendor.phoneNo}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(vendor.phoneNo, `phone-${vendor._id}`)}
                    className="p-1.5 lg:p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {copiedField === `phone-${vendor._id}` ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} className="text-gray-400" />
                    )}
                  </button>
                  <a
                    href={`tel:${vendor.phoneNo}`}
                    className="p-1.5 lg:p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Phone size={14} />
                  </a>
                </div>
              </div>
            )}

            {/* Email */}
            {vendor?.email && (
              <div className="flex items-center justify-between p-2.5 lg:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                  <div className="p-1.5 lg:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                    <Mail size={14} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500">Email</p>
                    <p className="font-medium text-xs lg:text-sm text-gray-900 dark:text-white truncate max-w-[150px] lg:max-w-[180px]">
                      {vendor.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(vendor.email, `email-${vendor._id}`)}
                    className="p-1.5 lg:p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {copiedField === `email-${vendor._id}` ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} className="text-gray-400" />
                    )}
                  </button>
                  <a
                    href={`mailto:${vendor.email}`}
                    className="p-1.5 lg:p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Mail size={14} />
                  </a>
                </div>
              </div>
            )}

            {/* Address */}
            {vendor?.address?.street && (
              <div className="p-2.5 lg:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-start gap-2 lg:gap-3">
                  <div className="p-1.5 lg:p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg shrink-0">
                    <MapPin size={14} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-500 mb-1">Address</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                      {vendor.address.street}
                    </p>
                    {vendor.address.googleMapUrl && (
                      <a
                        href={vendor.address.googleMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-[10px] lg:text-xs text-blue-600 hover:underline"
                      >
                        <Navigation size={10} />
                        Open in Maps
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Social Links */}
            {vendor?.socialLinks && Object.values(vendor.socialLinks).some(Boolean) && (
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-[10px] text-gray-500 mb-2">Social Links</p>
                <div className="flex gap-2 flex-wrap">
                  {vendor.socialLinks.website && (
                    <a
                      href={vendor.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Globe size={14} className="text-gray-600 dark:text-gray-400" />
                    </a>
                  )}
                  {vendor.socialLinks.instagram && (
                    <a
                      href={vendor.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Instagram size={14} className="text-white" />
                    </a>
                  )}
                  {vendor.socialLinks.facebook && (
                    <a
                      href={vendor.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Facebook size={14} className="text-white" />
                    </a>
                  )}
                  {vendor.socialLinks.youtube && (
                    <a
                      href={vendor.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Youtube size={14} className="text-white" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
});
ContactTab.displayName = "ContactTab";

// Gallery Tab
const GalleryTab = memo(({ vendors }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage}
              alt="Gallery"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {vendors.map((vendor) => (
          <div
            key={vendor?._id?.$oid || vendor?._id}
            className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="px-4 py-3 lg:px-5 lg:py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={getVendorImage(vendor)}
                    alt={vendor?.name || "Vendor"}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{vendor?.name}</h4>
                  <p className="text-[10px] text-gray-500">{vendor?.images?.length || 0} photos</p>
                </div>
              </div>
            </div>
            <div className="p-3 lg:p-4">
              {vendor?.images?.length > 0 ? (
                <div className="grid grid-cols-3 gap-1.5 lg:gap-2">
                  {vendor.images.slice(0, 9).map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(img)}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer relative group"
                    >
                      <Image src={img} alt={`${vendor?.name} ${i + 1}`} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-gray-400 py-6 lg:py-8">No gallery images</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
GalleryTab.displayName = "GalleryTab";

const AllTab = memo(({ vendors, scores, winnerIndex }) => {
  return (
    <div
      className="shrink-0 px-4 py-3 lg:px-6 lg:py-4 bg-white/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 max-h-[100%] overflow-y-auto"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#cbd5e1 transparent",
      }}
    >
      <div
        className={`grid gap-4 ${
          vendors.length === 2 ? "grid-cols-2" : vendors.length === 3 ? "grid-cols-3" : "grid-cols-4"
        }`}
      >
        {vendors.map((vendor, idx) => (
          <VendorHeader
            key={vendor._id}
            vendor={vendor}
            score={scores[idx]}
            rank={[...scores].sort((a, b) => b - a).indexOf(scores[idx]) + 1}
            isWinner={idx === winnerIndex && vendors.length > 1}
          />
        ))}
      </div>
    </div>
  );
});
AllTab.displayName = "AllTab";

// ============================================
// MAIN COMPARE MODAL COMPONENT
// ============================================
const CompareModal = ({ isOpen, onClose, vendors = [], onCategoryMismatch }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [categoryError, setCategoryError] = useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [expandedVendor, setExpandedVendor] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const contentRef = useRef(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isOpen || !vendors || vendors.length < 2) {
      setCategoryError(null);
      return;
    }

    // Extract categories from all vendors
    const categories = vendors.filter((v) => v && v.category).map((v) => v.category.toLowerCase().trim());

    // Get unique categories
    const uniqueCategories = [...new Set(categories)];

    // If more than one unique category exists, show error
    if (uniqueCategories.length > 1) {
      const errorMessage = `Cannot compare vendors from different categories: ${uniqueCategories.join(", ")}`;
      setCategoryError(errorMessage);

      // Notify parent component if callback provided
      if (onCategoryMismatch) {
        onCategoryMismatch(errorMessage, uniqueCategories);
      }
    } else {
      setCategoryError(null);
    }
  }, [isOpen, vendors, onCategoryMismatch]);

  // Filter valid vendors
  const validVendors = useMemo(() => {
    return vendors.filter((v) => v && (v._id || v._id?.$oid));
  }, [vendors]);

  // Calculate scores
  const scores = useMemo(() => {
    return validVendors.map((v) => calculateVendorScore(v));
  }, [validVendors]);

  // Determine winner
  const winnerIndex = useMemo(() => {
    if (scores.length === 0) return 0;
    const maxScore = Math.max(...scores);
    return scores.indexOf(maxScore);
  }, [scores]);

  const winner = validVendors[winnerIndex];
  const loser = validVendors.length > 1 ? validVendors.find((_, i) => i !== winnerIndex) : null;

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset state
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("overview");
      setShowWinner(false);
      setIsCalculating(false);
      setExpandedVendor(null);
    }
  }, [isOpen]);

  const handleRevealWinner = useCallback(() => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setShowWinner(true);
    }, 1500);
  }, []);

  const handleViewProfile = useCallback((vendor) => {
    const vendorId = vendor?._id?.$oid || vendor?._id;
    if (vendorId && vendor?.category) {
      window.open(`/vendor/${vendor.category}/${vendorId}`, "_blank");
    }
    setShowWinner(false);
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "details", label: "Details", icon: Info },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "features", label: "Features", icon: CheckCircle },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "gallery", label: "Gallery", icon: Camera },
    { id: "summary", label: "Summary", icon: ClipboardList },
  ];

  if (!isOpen || validVendors.length === 0) return null;

  if (categoryError) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full text-center shadow-2xl"
          >
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <AlertCircle size={40} className="text-red-500" />
              </motion.div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Category Mismatch</h3>

            {/* Subtitle */}
            <p className="text-gray-600 dark:text-gray-400 mb-5 text-sm leading-relaxed">
              You can only compare vendors from the{" "}
              <span className="font-semibold text-gray-900 dark:text-white">same category</span>. Please select vendors
              that belong to a single category.
            </p>

            {/* Show Selected Categories */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-5">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium uppercase tracking-wider">
                Selected vendors are from:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[...new Set(vendors.filter((v) => v?.category).map((v) => v.category))].map((cat, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-semibold border border-red-200 dark:border-red-800"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Tip Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-100 dark:border-blue-800">
              <div className="flex items-start gap-3 text-left">
                <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">How to fix this?</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                    Go back and remove vendors from different categories, or select only vendors from the same category
                    to make a fair comparison.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full py-4 px-6 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 font-bold rounded-xl hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-100 dark:hover:to-gray-200 transition-all shadow-lg"
            >
              Got it, Close
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 sm:inset-2 md:inset-4 lg:inset-6 bg-gray-50 dark:bg-gray-900 sm:rounded-2xl lg:rounded-3xl z-[201] flex flex-col shadow-2xl"
            style={{
              maxHeight: "100vh",
              maxHeight: "100dvh", // For mobile browsers
            }}
          >
            {/* Header */}
            <div className="shrink-0 px-4 py-3 lg:px-6 lg:py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between gap-3">
                {/* Title */}
                <div className="flex items-center gap-2 lg:gap-4 min-w-0">
                  <div className="p-2 lg:p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg lg:rounded-xl shadow-lg shrink-0">
                    <BarChart3 size={18} className="text-white lg:w-6 lg:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base lg:text-xl font-black text-gray-900 dark:text-white truncate">
                      Compare Vendors
                    </h2>
                    <p className="text-[10px] lg:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                      {validVendors.length} vendors • Side-by-side comparison
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:gap-3 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRevealWinner}
                    disabled={isCalculating || validVendors.length < 2}
                    className={`px-3 py-2 lg:px-5 lg:py-2.5 rounded-lg lg:rounded-xl font-bold text-xs lg:text-sm flex items-center gap-1.5 lg:gap-2 transition-all ${
                      validVendors.length >= 2
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isCalculating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <RotateCcw size={14} />
                        </motion.div>
                        <span className="hidden sm:inline">Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Trophy size={14} />
                        <span className="hidden sm:inline">Find Winner</span>
                      </>
                    )}
                  </motion.button>

                  <button
                    onClick={onClose}
                    className="p-2 lg:p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg lg:rounded-xl transition-colors"
                  >
                    <X size={18} className="text-gray-500 lg:w-5 lg:h-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 mt-3 lg:mt-4 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <Icon size={14} />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content - Scrollable Area */}
            <div
              ref={contentRef}
              className="flex-1 min-h-0 overflow-y-auto p-4 lg:p-6"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#cbd5e1 transparent",
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
              }}
            >
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <OverviewTab vendors={validVendors} scores={scores} />
                  </motion.div>
                )}
                {activeTab === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <DetailsTab vendors={validVendors} />
                  </motion.div>
                )}
                {activeTab === "pricing" && (
                  <motion.div
                    key="pricing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <PricingTab vendors={validVendors} />
                  </motion.div>
                )}
                {activeTab === "features" && (
                  <motion.div
                    key="features"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <FeaturesTab vendors={validVendors} />
                  </motion.div>
                )}
                {activeTab === "contact" && (
                  <motion.div
                    key="contact"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <ContactTab vendors={validVendors} />
                  </motion.div>
                )}
                {activeTab === "gallery" && (
                  <motion.div
                    key="gallery"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <GalleryTab vendors={validVendors} />
                  </motion.div>
                )}
                {activeTab === "summary" && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AllTab vendors={vendors} scores={scores} winnerIndex={winnerIndex} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="shrink-0 px-4 py-3 lg:px-6 lg:py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-[10px] lg:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  Based on {COMPARISON_METRICS.length} key metrics
                </p>
                <div className="flex gap-2 lg:gap-3 w-full sm:w-auto">
                  <button
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg lg:rounded-xl border-2 border-gray-200 dark:border-gray-600 font-semibold text-xs lg:text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  {winner && (
                    <Link
                      href={`/vendor/${winner.category}/${winner._id?.$oid || winner._id}`}
                      className="flex-1 sm:flex-none px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg lg:rounded-xl bg-blue-600 text-white font-bold text-xs lg:text-sm shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 lg:gap-2"
                    >
                      <Trophy size={14} />
                      View Top Pick
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Winner Overlay */}
          <AnimatePresence>
            {showWinner && winner && (
              <WinnerReveal
                winner={winner}
                loser={loser}
                onClose={() => setShowWinner(false)}
                onViewProfile={handleViewProfile}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default CompareModal;
