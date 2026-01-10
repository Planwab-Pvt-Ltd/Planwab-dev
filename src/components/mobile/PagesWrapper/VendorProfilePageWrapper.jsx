"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, PanInfo } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  MoreVertical,
  MapPin,
  Star,
  Heart,
  CheckCircle,
  Phone,
  MessageCircle,
  Calendar,
  Mail,
  ExternalLink,
  Instagram,
  Facebook,
  Globe,
  Play,
  Grid3X3,
  LayoutGrid,
  Briefcase,
  Users,
  Shield,
  Camera,
  Crown,
  X,
  Copy,
  Flag,
  UserMinus,
  Bookmark,
  BookmarkCheck,
  Clock,
  ChevronRight,
  Send,
  Linkedin,
  Twitter,
  Volume2,
  VolumeX,
  Package,
  Sparkles,
  ThumbsUp,
  MessageSquare,
  BadgeCheck,
  ChevronUp,
  ChevronDown,
  Link2,
  QrCode,
  Bell,
  BellOff,
  Info,
  Check,
  AlertCircle,
  Plus,
  Image,
  Video,
  Upload,
  Type,
  Hash,
  AtSign,
  ImageIcon,
  ZoomIn,
} from "lucide-react";
import dynamic from "next/dynamic";

const SmartMedia = dynamic(() => import("@/components/mobile/SmartMediaLoader"), {
  loading: () => <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />,
  ssr: false,
});

const TABS = [
  { id: "posts", label: "Posts", icon: Grid3X3 },
  { id: "reels", label: "Reels", icon: Play },
  { id: "portfolio", label: "Portfolio", icon: LayoutGrid },
  { id: "services", label: "Services", icon: Package },
];

const MOCK_HIGHLIGHTS = [
  {
    id: 1,
    title: "Events",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200&h=200&fit=crop",
    count: 12,
    items: Array.from({ length: 5 }, (_, i) => ({
      id: i,
      image: `https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=800&fit=crop`,
      caption: `Event highlight ${i + 1}`,
    })),
  },
  {
    id: 2,
    title: "Reviews",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&h=200&fit=crop",
    count: 45,
    items: Array.from({ length: 8 }, (_, i) => ({
      id: i,
      image: `https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=800&fit=crop`,
      caption: `Review ${i + 1}`,
    })),
  },
  {
    id: 3,
    title: "Behind",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=200&h=200&fit=crop",
    count: 8,
    items: Array.from({ length: 4 }, (_, i) => ({
      id: i,
      image: `https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=800&fit=crop`,
      caption: `Behind the scenes ${i + 1}`,
    })),
  },
  {
    id: 4,
    title: "Awards",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop",
    count: 6,
    items: Array.from({ length: 3 }, (_, i) => ({
      id: i,
      image: `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=800&fit=crop`,
      caption: `Award ${i + 1}`,
    })),
  },
  {
    id: 5,
    title: "Team",
    image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=200&h=200&fit=crop",
    count: 15,
    items: Array.from({ length: 6 }, (_, i) => ({
      id: i,
      image: `https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&h=800&fit=crop`,
      caption: `Team member ${i + 1}`,
    })),
  },
  {
    id: 6,
    title: "Venues",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=200&h=200&fit=crop",
    count: 20,
    items: Array.from({ length: 7 }, (_, i) => ({
      id: i,
      image: `https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=800&fit=crop`,
      caption: `Venue ${i + 1}`,
    })),
  },
];

const REAL_POST_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&h=600&fit=crop",
];

const REAL_REEL_IMAGES = [
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1542628682-88321d2a4828?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=700&fit=crop",
];

const MOCK_POSTS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  type: "image",
  thumbnail: REAL_POST_IMAGES[i % REAL_POST_IMAGES.length],
  fullImage: REAL_POST_IMAGES[i % REAL_POST_IMAGES.length],
  likes: Math.floor(Math.random() * 500) + 50,
  comments: Math.floor(Math.random() * 100) + 10,
  caption: `Beautiful moment captured at event #${
    i + 1
  }. Working with amazing clients! ✨ #photography #events #wedding #celebration`,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  isLiked: Math.random() > 0.5,
  isSaved: Math.random() > 0.7,
}));

const MOCK_REELS = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  type: "video",
  thumbnail: REAL_REEL_IMAGES[i % REAL_REEL_IMAGES.length],
  videoUrl: REAL_REEL_IMAGES[i % REAL_REEL_IMAGES.length],
  views: `${Math.floor(Math.random() * 50) + 10}K`,
  likes: Math.floor(Math.random() * 1000) + 100,
  comments: Math.floor(Math.random() * 200) + 20,
  duration: `0:${Math.floor(Math.random() * 50) + 10}`,
  caption: `Amazing reel from recent event! 🎬 #trending #viral #eventplanning`,
  isLiked: false,
  isSaved: false,
}));

const PORTFOLIO_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&h=600&fit=crop",
];

const MOCK_PORTFOLIO = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  type: "collection",
  title: [
    "Wedding",
    "Corporate",
    "Birthday",
    "Anniversary",
    "Product",
    "Fashion",
    "Portraits",
    "Travel",
    "Food",
    "Architecture",
    "Sports",
    "Music",
    "Art",
    "Nature",
    "Street",
  ][i],
  thumbnail: PORTFOLIO_IMAGES[i % PORTFOLIO_IMAGES.length],
  count: Math.floor(Math.random() * 20) + 5,
  images: Array.from({ length: 8 }, (_, j) => PORTFOLIO_IMAGES[(i + j) % PORTFOLIO_IMAGES.length]),
}));

const MOCK_SERVICES = [
  {
    id: 1,
    name: "Wedding Photography",
    price: "₹50,000",
    duration: "Full Day",
    description: "Complete wedding coverage with 500+ edited photos",
    popular: true,
    rating: 4.9,
    bookings: 120,
  },
  {
    id: 2,
    name: "Pre-Wedding Shoot",
    price: "₹25,000",
    duration: "4-5 Hours",
    description: "Creative pre-wedding photoshoot at location of choice",
    popular: true,
    rating: 4.8,
    bookings: 85,
  },
  {
    id: 3,
    name: "Corporate Event",
    price: "₹35,000",
    duration: "Half Day",
    description: "Professional coverage for corporate events",
    popular: false,
    rating: 4.7,
    bookings: 45,
  },
  {
    id: 4,
    name: "Birthday Party",
    price: "₹15,000",
    duration: "3-4 Hours",
    description: "Candid and posed photography for birthday celebrations",
    popular: false,
    rating: 4.9,
    bookings: 200,
  },
  {
    id: 5,
    name: "Product Photography",
    price: "₹5,000",
    duration: "Per Product",
    description: "High-quality product shots for e-commerce",
    popular: true,
    rating: 4.8,
    bookings: 150,
  },
  {
    id: 6,
    name: "Portrait Session",
    price: "₹8,000",
    duration: "2 Hours",
    description: "Professional portrait photography session",
    popular: false,
    rating: 4.9,
    bookings: 95,
  },
];

const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    date: "2 weeks ago",
    comment: "Absolutely amazing work! The photos from our wedding are breathtaking.",
    helpful: 24,
    service: "Wedding Photography",
  },
  {
    id: 2,
    name: "Rahul Verma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    date: "1 month ago",
    comment: "Professional, punctual, and incredibly talented.",
    helpful: 18,
    service: "Corporate Event",
  },
  {
    id: 3,
    name: "Anita Desai",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 4,
    date: "2 months ago",
    comment: "Great experience overall. Beautiful candid shots.",
    helpful: 12,
    service: "Birthday Party",
  },
  {
    id: 4,
    name: "Vikram Singh",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 5,
    date: "3 months ago",
    comment: "The pre-wedding shoot was magical!",
    helpful: 31,
    service: "Pre-Wedding Shoot",
  },
];

const AVAILABILITY_SLOTS = [
  { date: "Today", slots: ["10:00 AM", "2:00 PM", "4:00 PM"], fullDate: new Date().toLocaleDateString() },
  {
    date: "Tomorrow",
    slots: ["9:00 AM", "11:00 AM", "3:00 PM", "5:00 PM"],
    fullDate: new Date(Date.now() + 86400000).toLocaleDateString(),
  },
  { date: "Jan 12", slots: ["10:00 AM", "1:00 PM"], fullDate: "01/12/2026" },
  { date: "Jan 13", slots: ["9:00 AM", "12:00 PM", "3:00 PM"], fullDate: "01/13/2026" },
];

const ShimmerEffect = ({ className }) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent" />
  </div>
);

const VendorProfileSkeleton = () => {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black pb-24">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <ShimmerEffect className="w-9 h-9 rounded-full" />
            <ShimmerEffect className="w-28 h-4 rounded-full" />
          </div>
          <div className="flex gap-1.5">
            <ShimmerEffect className="w-9 h-9 rounded-full" />
            <ShimmerEffect className="w-9 h-9 rounded-full" />
          </div>
        </div>
      </header>

      <div className="pt-14" />

      <div className="bg-white dark:bg-gray-900">
        <div className="px-4 pt-5 pb-5">
          {/* Profile Info Section Skeleton */}
          <div className="flex items-start gap-5 mb-6">
            {/* Profile Picture */}
            <div className="relative flex-shrink-0">
              <ShimmerEffect className="w-24 h-24 rounded-full" />
              <ShimmerEffect className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-[3px] border-white dark:border-gray-900" />
            </div>

            {/* Profile Details */}
            <div className="flex-1 min-w-0 pt-2 space-y-3">
              <div className="flex items-center gap-2">
                <ShimmerEffect className="w-36 h-6 rounded-lg" />
                <ShimmerEffect className="w-12 h-5 rounded-full" />
              </div>
              <ShimmerEffect className="w-28 h-5 rounded-lg" />
              <div className="flex items-center gap-1.5">
                <ShimmerEffect className="w-4 h-4 rounded-full" />
                <ShimmerEffect className="w-32 h-4 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Stats Section Skeleton */}
          <div className="flex justify-around mb-5 py-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 px-4">
                <ShimmerEffect className="w-12 h-6 rounded-lg" />
                <ShimmerEffect className="w-14 h-3 rounded-full" />
              </div>
            ))}
          </div>

          {/* Bio Section Skeleton */}
          <div className="mb-5 space-y-2">
            <ShimmerEffect className="w-full h-4 rounded-lg" />
            <ShimmerEffect className="w-11/12 h-4 rounded-lg" />
            <ShimmerEffect className="w-4/5 h-4 rounded-lg" />
            <ShimmerEffect className="w-3/4 h-4 rounded-lg" />
            <ShimmerEffect className="w-2/3 h-4 rounded-lg" />
          </div>

          {/* Social Links Skeleton */}
          <div className="flex items-center gap-2 mb-5">
            <ShimmerEffect className="w-24 h-9 rounded-full" />
            <ShimmerEffect className="w-28 h-9 rounded-full" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-2 mb-5">
            <ShimmerEffect className="flex-[2] h-12 rounded-xl" />
            <ShimmerEffect className="flex-1 h-12 rounded-xl" />
            <ShimmerEffect className="flex-1 h-12 rounded-xl" />
          </div>

          {/* Highlights Section Skeleton */}
          <div className="flex gap-4 py-1 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-[72px]">
                <ShimmerEffect className="w-16 h-16 rounded-2xl" />
                <ShimmerEffect className="w-12 h-3 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section Skeleton */}
      <div className="sticky top-14 z-30 bg-white dark:bg-gray-900 border-b border-gray-200/80 dark:border-gray-800/80">
        <div className="flex">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 py-3.5 flex items-center justify-center gap-2">
              <ShimmerEffect className="w-5 h-5 rounded" />
              <ShimmerEffect className="w-12 h-3 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="bg-white dark:bg-gray-900 min-h-[50vh]">
        <div className="grid grid-cols-3 gap-0.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="aspect-square"
            >
              <ShimmerEffect className="w-full h-full" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Button Skeleton */}
      <div className="fixed bottom-6 right-6 z-50">
        <ShimmerEffect className="w-14 h-14 rounded-full" />
      </div>

      {/* Shimmer Animation Styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </main>
  );
};

const useBodyScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isLocked]);
};

const FloatingConfirmation = ({ show, icon: Icon, message, type = "success" }) => {
  const bgColors = {
    success: "from-green-500 to-emerald-600",
    error: "from-red-500 to-rose-600",
    info: "from-blue-500 to-indigo-600",
    warning: "from-amber-500 to-orange-600",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200]"
        >
          <div
            className={`flex items-center gap-2 px-5 py-3 bg-gradient-to-r ${bgColors[type]} rounded-full shadow-2xl`}
          >
            <Icon size={20} className="text-white" />
            <span className="text-white font-semibold text-sm">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ThumbsUpAnimation = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0, y: -100 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.5, 1.2],
              rotate: [0, -15, 15, 0],
            }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/50">
              <ThumbsUp size={64} className="text-white fill-white" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 0] }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute inset-0 rounded-full border-4 border-green-400"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 2, 0] }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute inset-0 rounded-full border-2 border-green-300"
            />
          </motion.div>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI * 2) / 8) * 150,
                y: Math.sin((i * Math.PI * 2) / 8) * 150,
              }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
              className="absolute w-4 h-4 rounded-full bg-green-400"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProfilePictureModal = ({ isOpen, onClose, image, name }) => {
  useBodyScrollLock(isOpen);

  const handleDragEnd = (_, info) => {
    if (Math.abs(info.velocity.y) > 500 || Math.abs(info.offset.y) > 100) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 bg-white/10 backdrop-blur-xl rounded-full"
      >
        <X size={24} className="text-white" />
      </motion.button>
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-72 h-72 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl cursor-grab active:cursor-grabbing"
      >
        <SmartMedia src={image} type="image" className="w-full h-full object-cover" loaderImage="/GlowLoadingGif.gif" />
      </motion.div>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-24 text-white font-bold text-xl"
      >
        {name}
      </motion.p>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-16 text-white/60 text-sm"
      >
        Swipe down to close
      </motion.p>
    </motion.div>
  );
};

const StoryViewer = ({ highlight, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [message, setMessage] = useState("");
  const [showShareDrawer, setShowShareDrawer] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const progressIntervalRef = useRef(null);
  useBodyScrollLock(true);

  useEffect(() => {
    if (isPaused || showShareDrawer) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < highlight.items.length - 1) {
            setCurrentIndex((i) => i + 1);
            return 0;
          } else {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }
            setTimeout(() => onClose(), 100);
            return 100;
          }
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentIndex, isPaused, showShareDrawer, highlight.items.length, onClose]);

  const goNext = useCallback(() => {
    if (currentIndex < highlight.items.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, highlight.items.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  const handleDragEnd = useCallback(
    (_, info) => {
      if (info.velocity.x < -500 || info.offset.x < -100) goNext();
      else if (info.velocity.x > 500 || info.offset.x > 100) goPrev();
      if (Math.abs(info.velocity.y) > 500 || info.offset.y > 150) onClose();
    },
    [goNext, goPrev, onClose]
  );

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      setMessageSent(true);
      setMessage("");
      setTimeout(() => setMessageSent(false), 2000);
    }
  }, [message]);

  const handleShareClick = useCallback(() => {
    setShowShareDrawer(true);
  }, []);

  // Generate unique image for each story item based on index
  const getStoryImage = useCallback(
    (itemIndex) => {
      const baseImages = [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=1200&fit=crop",
      ];
      return baseImages[(highlight.id + itemIndex) % baseImages.length];
    },
    [highlight.id]
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black"
      >
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-20 p-3 pt-4 flex gap-1 bg-gradient-to-b from-black/60 to-transparent">
          {highlight.items.map((_, idx) => (
            <div key={idx} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={false}
                animate={{
                  width: idx < currentIndex ? "100%" : idx === currentIndex ? `${progress}%` : "0%",
                }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-12 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/50">
              <SmartMedia
                src={highlight.image}
                type="image"
                className="w-full h-full object-cover"
                loaderImage="/GlowLoadingGif.gif"
              />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{highlight.title}</p>
              <p className="text-white/60 text-xs">
                {currentIndex + 1} of {highlight.items.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShareClick}
              className="p-2 bg-white/10 backdrop-blur-xl rounded-full"
            >
              <Share2 size={20} className="text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 bg-white/10 backdrop-blur-xl rounded-full"
            >
              <X size={24} className="text-white" />
            </motion.button>
          </div>
        </div>

        {/* Story content with smooth animation */}
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.3}
          onDragEnd={handleDragEnd}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 flex">
            <div className="w-1/3 h-full z-10 cursor-pointer" onClick={goPrev} />
            <div className="w-1/3 h-full z-10" />
            <div className="w-1/3 h-full z-10 cursor-pointer" onClick={goNext} />
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.8,
              }}
              className="absolute inset-0"
            >
              <SmartMedia
                src={getStoryImage(currentIndex)}
                type="image"
                className="w-full h-full object-cover"
                loaderImage="/GlowLoadingGif.gif"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Bottom section */}
        <div className="absolute bottom-8 left-4 right-4 z-20">
          <p className="text-white text-sm mb-4 px-2">{highlight.items[currentIndex]?.caption}</p>

          {messageSent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-3 text-center"
            >
              <span className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full">Message sent!</span>
            </motion.div>
          )}

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-4 py-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 bg-transparent text-white placeholder-white/50 text-sm outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSendMessage}
              className={message.trim() ? "text-white" : "text-white/50"}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showShareDrawer && (
          <StoryShareDrawer isOpen={showShareDrawer} onClose={() => setShowShareDrawer(false)} highlight={highlight} />
        )}
      </AnimatePresence>
    </>
  );
};

const PostDetailModal = ({ post, onClose, vendorName, vendorImage, onDelete }) => {
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [isSaved, setIsSaved] = useState(post?.isSaved || false);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [comment, setComment] = useState("");
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [comments, setComments] = useState([]);
  const [showOptionsDrawer, setShowOptionsDrawer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  useBodyScrollLock(true);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    if (!isLiked) {
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 600);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleComment = () => {
    if (comment.trim()) {
      setComments([...comments, { id: Date.now(), text: comment, name: "You" }]);
      setComment("");
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLike();
    }
  };

  const handleDelete = () => {
    onDelete?.();
    onClose();
  };

  if (!post) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col"
      >
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.3}
          onDragEnd={(_, info) => {
            if (info.velocity.y > 500 || info.offset.y > 150) onClose();
          }}
          className="flex-1 flex flex-col"
        >
          <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-white/10">
            <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="p-1">
              <ArrowLeft size={24} className="text-white" />
            </motion.button>
            <span className="text-white font-bold">Post</span>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowOptionsDrawer(true)}>
              <MoreVertical size={24} className="text-white" />
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20">
                <SmartMedia
                  src={vendorImage}
                  type="image"
                  className="w-full h-full object-cover"
                  loaderImage="/GlowLoadingGif.gif"
                />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{vendorName}</p>
                <p className="text-white/50 text-xs">{post.date}</p>
              </div>
            </div>

            <div className="aspect-square bg-gray-900 relative" onDoubleClick={handleDoubleTap}>
              <SmartMedia
                src={post.fullImage || post.thumbnail}
                type="image"
                className="w-full h-full object-cover"
                loaderImage="/GlowLoadingGif.gif"
              />
              <AnimatePresence>
                {showLikeAnimation && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <Heart size={100} className="text-white fill-white drop-shadow-2xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <motion.button whileTap={{ scale: 0.8 }} onClick={handleLike}>
                    <Heart
                      size={28}
                      className={`transition-colors ${isLiked ? "text-red-500 fill-red-500" : "text-white"}`}
                    />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => document.getElementById("comment-input")?.focus()}
                  >
                    <MessageCircle size={28} className="text-white" />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.8 }} onClick={() => setShowShareModal(true)}>
                    <Send size={28} className="text-white" />
                  </motion.button>
                </div>
                <motion.button whileTap={{ scale: 0.8 }} onClick={handleSave}>
                  {isSaved ? (
                    <BookmarkCheck size={28} className="text-white fill-white" />
                  ) : (
                    <Bookmark size={28} className="text-white" />
                  )}
                </motion.button>
              </div>

              <motion.p animate={{ scale: isLiked ? [1, 1.1, 1] : 1 }} className="text-white font-bold text-sm">
                {likes.toLocaleString()} likes
              </motion.p>

              <div className="space-y-2">
                <p className="text-white text-sm leading-relaxed">
                  <span className="font-bold">{vendorName}</span> {post.caption}
                </p>
                <p className="text-gray-400 text-sm">{post.comments + comments.length} comments</p>
              </div>

              {comments.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {comments.map((c) => (
                    <p key={c.id} className="text-white text-sm">
                      <span className="font-bold">{c.name}</span> {c.text}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                  <SmartMedia
                    src={vendorImage}
                    type="image"
                    className="w-full h-full object-cover"
                    loaderImage="/GlowLoadingGif.gif"
                  />
                </div>
                <input
                  id="comment-input"
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm outline-none"
                  onKeyDown={(e) => e.key === "Enter" && handleComment()}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleComment}
                  className={`text-sm font-bold transition-colors ${
                    comment.trim() ? "text-blue-500" : "text-blue-500/50"
                  }`}
                >
                  Post
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showOptionsDrawer && (
          <PostOptionsDrawer
            isOpen={showOptionsDrawer}
            onClose={() => setShowOptionsDrawer(false)}
            post={post}
            onDelete={handleDelete}
            onShare={() => setShowShareModal(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShareModal && (
          <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} vendorName={vendorName} />
        )}
      </AnimatePresence>
    </>
  );
};

const ReelsViewer = ({ reels, initialIndex, onClose, vendorName, vendorImage, onDeleteReel }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [likedReels, setLikedReels] = useState(new Set());
  const [savedReels, setSavedReels] = useState(new Set());
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState(null);
  const [showOptionsDrawer, setShowOptionsDrawer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  useBodyScrollLock(true);

  const currentReel = reels[currentIndex];

  const handleLike = () => {
    const newLiked = new Set(likedReels);
    if (newLiked.has(currentReel.id)) {
      newLiked.delete(currentReel.id);
    } else {
      newLiked.add(currentReel.id);
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 600);
    }
    setLikedReels(newLiked);
  };

  const handleSave = () => {
    const newSaved = new Set(savedReels);
    if (newSaved.has(currentReel.id)) {
      newSaved.delete(currentReel.id);
    } else {
      newSaved.add(currentReel.id);
    }
    setSavedReels(newSaved);
  };

  const goToReel = useCallback(
    (direction) => {
      if (direction === "up" && currentIndex < reels.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setDragDirection("up");
      } else if (direction === "down" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setDragDirection("down");
      }
      setTimeout(() => setDragDirection(null), 300);
    },
    [currentIndex, reels.length]
  );

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    const threshold = 50;
    const velocity = 300;

    if (info.offset.y < -threshold || info.velocity.y < -velocity) {
      goToReel("up");
    } else if (info.offset.y > threshold || info.velocity.y > velocity) {
      goToReel("down");
    }

    if (info.velocity.x > 500 || info.offset.x > 150) {
      onClose();
    }
  };

  const handleDoubleTap = () => {
    if (!likedReels.has(currentReel?.id)) {
      handleLike();
    }
  };

  const handleDeleteReel = () => {
    onDeleteReel?.(currentReel.id);
    if (reels.length <= 1) {
      onClose();
    } else if (currentIndex >= reels.length - 1) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isLiked = likedReels.has(currentReel?.id);
  const isSaved = savedReels.has(currentReel?.id);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[100] bg-black overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 z-20 px-4 py-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 bg-white/10 backdrop-blur-xl rounded-full"
          >
            <ArrowLeft size={24} className="text-white" />
          </motion.button>
          <span className="text-white font-bold">Reels</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowOptionsDrawer(true)}
            className="p-2 bg-white/10 backdrop-blur-xl rounded-full"
          >
            <MoreVertical size={24} className="text-white" />
          </motion.button>
        </div>

        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          onDoubleClick={handleDoubleTap}
          className="absolute inset-0 touch-pan-y"
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currentReel?.id}
              initial={{
                opacity: 0,
                y: dragDirection === "up" ? 100 : dragDirection === "down" ? -100 : 0,
                scale: 0.95,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: dragDirection === "up" ? -100 : dragDirection === "down" ? 100 : 0,
                scale: 0.95,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
              className="absolute inset-0"
            >
              <SmartMedia
                src={currentReel?.thumbnail}
                type="image"
                className="w-full h-full object-cover"
                loaderImage="/GlowLoadingGif.gif"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {showLikeAnimation && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Heart size={120} className="text-white fill-white drop-shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-20">
          <motion.button whileTap={{ scale: 0.8 }} onClick={handleLike} className="flex flex-col items-center gap-1">
            <motion.div
              animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center"
            >
              <Heart size={26} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />
            </motion.div>
            <span className="text-white text-xs font-bold">
              {(currentReel?.likes + (isLiked ? 1 : 0)).toLocaleString()}
            </span>
          </motion.button>

          <motion.button whileTap={{ scale: 0.8 }} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
              <MessageCircle size={26} className="text-white" />
            </div>
            <span className="text-white text-xs font-bold">{currentReel?.comments}</span>
          </motion.button>

          <motion.button whileTap={{ scale: 0.8 }} onClick={handleSave} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
              {isSaved ? (
                <BookmarkCheck size={26} className="text-white fill-white" />
              ) : (
                <Bookmark size={26} className="text-white" />
              )}
            </div>
            <span className="text-white text-xs font-bold">Save</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => setShowShareModal(true)}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
              <Send size={26} className="text-white" />
            </div>
            <span className="text-white text-xs font-bold">Share</span>
          </motion.button>

          <motion.button whileTap={{ scale: 0.8 }} onClick={() => setIsMuted(!isMuted)}>
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
              {isMuted ? <VolumeX size={26} className="text-white" /> : <Volume2 size={26} className="text-white" />}
            </div>
          </motion.button>
        </div>

        <div className="absolute left-4 right-20 bottom-10 space-y-3 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/50">
              <SmartMedia
                src={vendorImage}
                type="image"
                className="w-full h-full object-cover"
                loaderImage="/GlowLoadingGif.gif"
              />
            </div>
            <span className="text-white font-bold text-sm">{vendorName}</span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-lg border border-white/30"
            >
              <span className="text-white text-xs font-bold">Follow</span>
            </motion.button>
          </div>
          <p className="text-white text-sm line-clamp-2">{currentReel?.caption}</p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white/20 animate-pulse" />
            <p className="text-white/80 text-xs">Original Audio • {currentReel?.views} views</p>
          </div>
        </div>

        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
          <p className="text-white/60 text-xs" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            {currentIndex + 1} / {reels.length}
          </p>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <p className="text-white/40 text-xs">Swipe up/down to navigate</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showOptionsDrawer && (
          <ReelOptionsDrawer
            isOpen={showOptionsDrawer}
            onClose={() => setShowOptionsDrawer(false)}
            reel={currentReel}
            onDelete={handleDeleteReel}
            onShare={() => setShowShareModal(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShareModal && (
          <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} vendorName={vendorName} />
        )}
      </AnimatePresence>
    </>
  );
};

const PortfolioViewer = ({ portfolio, onClose, onBookService }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  useBodyScrollLock(true);

  const handleDragEnd = (_, info) => {
    if (info.velocity.x < -500 || info.offset.x < -100) {
      if (currentIndex < portfolio.images.length - 1) setCurrentIndex(currentIndex + 1);
    } else if (info.velocity.x > 500 || info.offset.x > 100) {
      if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    }
    if (info.velocity.y > 500 || info.offset.y > 150) onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-white/10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="p-1">
          <X size={24} className="text-white" />
        </motion.button>
        <div className="text-center">
          <span className="text-white font-bold text-sm block">{portfolio.title}</span>
          <span className="text-white/60 text-xs">
            {currentIndex + 1} of {portfolio.images.length}
          </span>
        </div>
        <motion.button whileTap={{ scale: 0.9 }}>
          <Share2 size={24} className="text-white" />
        </motion.button>
      </div>

      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="flex-1 flex items-center justify-center p-4"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full h-full flex items-center justify-center"
          >
            <SmartMedia
              src={portfolio.images[currentIndex]}
              type="image"
              className="max-w-full max-h-[70vh] object-contain rounded-2xl"
              loaderImage="/GlowLoadingGif.gif"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="px-4 pb-8 space-y-4">
        <div className="flex gap-2 justify-center">
          {portfolio.images.map((_, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-white w-6" : "bg-white/30"}`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onClose();
              onBookService?.();
            }}
            className="flex-1 py-3.5 bg-white rounded-2xl font-bold text-sm text-black flex items-center justify-center gap-2"
          >
            <Calendar size={18} />
            Book This Style
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSaved(!isSaved)}
            className={`py-3.5 px-5 rounded-2xl border transition-all ${
              isSaved ? "bg-red-500/20 border-red-500/50" : "bg-white/10 backdrop-blur-xl border-white/20"
            }`}
          >
            <Heart size={20} className={isSaved ? "text-red-500 fill-red-500" : "text-white"} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const UploadModal = ({ isOpen, onClose, onUploadPost, onUploadReel, postsCount, reelsCount }) => {
  const [uploadType, setUploadType] = useState(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [location, setLocation] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [locationMode, setLocationMode] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const fileInputRef = useRef(null);
  useBodyScrollLock(isOpen);

  const MAX_POSTS = 6;
  const MAX_REELS = 12;

  const isPostsFull = postsCount >= MAX_POSTS;
  const isReelsFull = reelsCount >= MAX_REELS;

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const detectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationError("");

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsDetectingLocation(false);
      return;
    }

    try {
      // Step 1: Get user's coordinates with more lenient settings
      const position = await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Location request timed out after 15 seconds"));
        }, 15000); // Increased timeout to 15 seconds

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            clearTimeout(timeoutId);
            resolve(pos);
          },
          (error) => {
            clearTimeout(timeoutId);
            reject(error);
          },
          {
            enableHighAccuracy: false, // Changed to false for faster response
            timeout: 15000, // Increased from 10s to 15s
            maximumAge: 60000, // Allow cached position up to 1 minute old
          }
        );
      });

      const { latitude, longitude } = position.coords;

      // Step 2: Try multiple reverse geocoding APIs for reliability
      let locationData = null;

      // Try OpenStreetMap first (with retry logic)
      try {
        const osmResponse = await Promise.race([
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`,
            {
              headers: {
                "User-Agent": "VendorProfileApp/1.0", // Required by Nominatim
              },
            }
          ),
          new Promise((_, reject) => setTimeout(() => reject(new Error("API timeout")), 8000)),
        ]);

        if (osmResponse.ok) {
          locationData = await osmResponse.json();
        }
      } catch (osmError) {
        console.warn("OpenStreetMap API failed, trying fallback...", osmError);
      }

      // Fallback to bigdatacloud if OpenStreetMap fails
      if (!locationData) {
        try {
          const bigDataResponse = await Promise.race([
            fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            ),
            new Promise((_, reject) => setTimeout(() => reject(new Error("API timeout")), 8000)),
          ]);

          if (bigDataResponse.ok) {
            const bigData = await bigDataResponse.json();
            locationData = {
              address: {
                neighbourhood: bigData.locality,
                city: bigData.city,
                state: bigData.principalSubdivision,
                country: bigData.countryName,
              },
            };
          }
        } catch (fallbackError) {
          console.warn("Fallback API also failed", fallbackError);
        }
      }

      // Step 3: Format the location string
      if (locationData && locationData.address) {
        const address = locationData.address;
        const locationParts = [];

        // Area/Locality
        if (address.neighbourhood || address.suburb || address.residential || address.locality) {
          locationParts.push(address.neighbourhood || address.suburb || address.residential || address.locality);
        }

        // City/Town
        if (address.city || address.town || address.village || address.municipality) {
          locationParts.push(address.city || address.town || address.village || address.municipality);
        }

        // State
        if (address.state || address.state_district) {
          locationParts.push(address.state || address.state_district);
        }

        // Country
        if (address.country) {
          locationParts.push(address.country);
        }

        // Use up to 3 parts for a clean address
        const formattedLocation = locationParts.filter(Boolean).slice(0, 3).join(", ");

        if (formattedLocation) {
          setLocation(formattedLocation);
          setLocationMode("detect");
          return;
        }
      }

      // Fallback: If geocoding completely fails, show coordinates
      const coordsLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      setLocation(coordsLocation);
      setLocationMode("detect");
      setLocationError("Location detected (coordinates only). You may edit for better accuracy.");
    } catch (error) {
      console.error("Location detection error:", error);

      // Provide user-friendly error messages
      if (error.code === 1 || error.message?.includes("denied")) {
        setLocationError("Location access denied. Please enable location permissions in your browser settings.");
      } else if (error.code === 2 || error.message?.includes("unavailable")) {
        setLocationError("Location currently unavailable. Please check your device's location settings.");
      } else if (error.code === 3 || error.message?.includes("timeout") || error.message?.includes("Timeout")) {
        setLocationError("Location request timed out. Please ensure location services are enabled and try again.");
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        setLocationError("Network error. Please check your internet connection and try again.");
      } else {
        setLocationError("Unable to detect location. Please enter your location manually.");
      }
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newItem = {
      id: Date.now(),
      type: uploadType === "post" ? "image" : "video",
      thumbnail: selectedFile,
      fullImage: selectedFile,
      videoUrl: selectedFile,
      likes: 0,
      comments: 0,
      views: "0",
      duration: "0:30",
      caption: `${caption} ${hashtags}`.trim(),
      date: new Date().toLocaleDateString(),
      location: location,
      isLiked: false,
      isSaved: false,
    };

    if (uploadType === "post") {
      onUploadPost?.(newItem);
    } else {
      onUploadReel?.(newItem);
    }

    setIsUploading(false);
    setUploadSuccess(true);
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setUploadType(null);
      setCaption("");
      setHashtags("");
      setLocation("");
      setSelectedFile(null);
      setUploadSuccess(false);
      setLocationMode(null);
      setLocationError("");
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={resetAndClose}
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) resetAndClose();
        }}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-[32px] max-h-[92vh] overflow-hidden shadow-2xl"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-5 pt-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {uploadSuccess
                ? "Upload Complete!"
                : uploadType
                ? `New ${uploadType === "post" ? "Post" : "Reel"}`
                : "Create"}
            </h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={resetAndClose}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
            >
              <X size={20} className="text-gray-500" />
            </motion.button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(92vh-80px)] p-5">
          <AnimatePresence mode="wait">
            {uploadSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30"
                >
                  <Check size={48} className="text-white" />
                </motion.div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Successfully Uploaded!</h4>
                <p className="text-gray-500 mb-8">Your {uploadType} is now live on your profile</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={resetAndClose}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl font-bold text-white shadow-lg"
                >
                  Done
                </motion.button>
              </motion.div>
            ) : !uploadType ? (
              <motion.div
                key="select-type"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <p className="text-gray-500 text-sm text-center mb-6">What would you like to create?</p>

                <motion.button
                  whileTap={{ scale: isPostsFull ? 1 : 0.98 }}
                  onClick={() => !isPostsFull && setUploadType("post")}
                  disabled={isPostsFull}
                  className={`w-full p-6 rounded-2xl border flex items-center gap-4 ${
                    isPostsFull
                      ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60"
                      : "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-100 dark:border-blue-800"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                      isPostsFull ? "bg-gray-400" : "bg-gradient-to-br from-blue-500 to-purple-600"
                    }`}
                  >
                    <Image size={28} className="text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">New Post</h4>
                    <p className="text-sm text-gray-500">
                      {isPostsFull ? `Maximum ${MAX_POSTS} posts reached` : "Share a photo with your followers"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {postsCount}/{MAX_POSTS} posts
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: isReelsFull ? 1 : 0.98 }}
                  onClick={() => !isReelsFull && setUploadType("reel")}
                  disabled={isReelsFull}
                  className={`w-full p-6 rounded-2xl border flex items-center gap-4 ${
                    isReelsFull
                      ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60"
                      : "bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 border-pink-100 dark:border-pink-800"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                      isReelsFull ? "bg-gray-400" : "bg-gradient-to-br from-pink-500 to-orange-500"
                    }`}
                  >
                    <Video size={28} className="text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">New Reel</h4>
                    <p className="text-sm text-gray-500">
                      {isReelsFull ? `Maximum ${MAX_REELS} reels reached` : "Create a short video clip"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {reelsCount}/{MAX_REELS} reels
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="upload-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={uploadType === "post" ? "image/*" : "video/*"}
                  className="hidden"
                />

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFileSelect}
                  className={`w-full aspect-square rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 overflow-hidden ${
                    selectedFile
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                  }`}
                >
                  {selectedFile ? (
                    uploadType === "post" ? (
                      <img src={selectedFile} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <video src={selectedFile} className="w-full h-full object-cover" />
                    )
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Upload size={32} className="text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          Tap to upload {uploadType === "post" ? "photo" : "video"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {uploadType === "post" ? "JPG, PNG up to 10MB" : "MP4, MOV up to 100MB"}
                        </p>
                      </div>
                    </>
                  )}
                </motion.button>

                <div className="space-y-4">
                  <div className="relative">
                    <Type size={18} className="absolute left-4 top-4 text-gray-400" />
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a caption..."
                      className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 text-sm outline-none resize-none min-h-[100px]"
                    />
                  </div>

                  <div className="relative">
                    <Hash size={18} className="absolute left-4 top-4 text-gray-400" />
                    <input
                      type="text"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      placeholder="Add hashtags (e.g., #wedding #photography)"
                      className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 text-sm outline-none"
                    />
                  </div>

                  {/* Enhanced Location Section */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</p>

                    {!locationMode ? (
                      <div className="flex gap-3">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setLocationMode("manual")}
                          className="flex-1 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center gap-2"
                        >
                          <Type size={20} className="text-gray-600 dark:text-gray-400" />
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Enter Manually</span>
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={detectLocation}
                          disabled={isDetectingLocation}
                          className="flex-1 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 flex flex-col items-center gap-2"
                        >
                          {isDetectingLocation ? (
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <MapPin size={20} className="text-blue-600" />
                          )}
                          <span className="text-xs font-medium text-blue-600">
                            {isDetectingLocation ? "Detecting..." : "Detect Location"}
                          </span>
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="relative">
                          <MapPin size={18} className="absolute left-4 top-4 text-gray-400" />
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter location"
                            className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 text-sm outline-none"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setLocationMode(null);
                              setLocation("");
                              setLocationError("");
                            }}
                            className="text-xs text-blue-600 font-medium"
                          >
                            Change method
                          </motion.button>
                          {locationMode === "manual" && (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={detectLocation}
                              disabled={isDetectingLocation}
                              className="text-xs text-blue-600 font-medium flex items-center gap-1"
                            >
                              {isDetectingLocation ? (
                                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <MapPin size={12} />
                              )}
                              Auto-detect
                            </motion.button>
                          )}
                        </div>
                      </div>
                    )}

                    {locationError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl"
                      >
                        <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                        <p className="text-xs text-red-600 dark:text-red-400">{locationError}</p>
                      </motion.div>
                    )}

                    {location && locationMode === "detect" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl"
                      >
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        <p className="text-xs text-green-600 dark:text-green-400">Location detected successfully</p>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUploadType(null)}
                    className="px-6 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-700 dark:text-gray-300"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-white disabled:opacity-50 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Upload {uploadType === "post" ? "Post" : "Reel"}
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const BookingDrawer = ({ isOpen, onClose, services, vendorName, onBookingConfirmed }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [step, setStep] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  useBodyScrollLock(isOpen);

  const handleBook = async () => {
    if (selectedService && selectedDate && selectedSlot) {
      setIsBooking(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsBooking(false);
      setBookingSuccess(true);
      onBookingConfirmed?.({
        service: selectedService,
        date: selectedDate,
        slot: selectedSlot,
      });
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setSelectedService(null);
      setSelectedDate("");
      setSelectedSlot("");
      setBookingSuccess(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={resetAndClose}
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) resetAndClose();
        }}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-[32px] max-h-[92vh] overflow-hidden shadow-2xl"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-5 pt-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
          {bookingSuccess ? (
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Booking Confirmed!</h3>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Book {vendorName}</h3>
                  <p className="text-sm text-gray-500 mt-1">Step {step} of 3</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={resetAndClose}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
                >
                  <X size={20} className="text-gray-500" />
                </motion.button>
              </div>
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((s) => (
                  <motion.div
                    key={s}
                    animate={{ scaleX: s <= step ? 1 : 0.5 }}
                    className={`flex-1 h-1.5 rounded-full transition-colors ${
                      s <= step ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="overflow-y-auto max-h-[calc(92vh-200px)] p-5">
          <AnimatePresence mode="wait">
            {bookingSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30"
                >
                  <Check size={48} className="text-white" />
                </motion.div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're All Set!</h4>
                <p className="text-gray-500 mb-6">Your booking has been confirmed</p>
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-left space-y-3 mb-6">
                  {[
                    { label: "Service", value: selectedService?.name },
                    { label: "Date", value: selectedDate },
                    { label: "Time", value: selectedSlot },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={resetAndClose}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl font-bold text-white"
                >
                  Done
                </motion.button>
              </motion.div>
            ) : step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Select a Service</h4>
                {services.map((service) => (
                  <motion.button
                    key={service.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedService(service)}
                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                      selectedService?.id === service.id
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white">{service.name}</span>
                        {service.popular && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[9px] font-bold rounded-full flex items-center gap-1">
                            <Sparkles size={8} />
                            POPULAR
                          </span>
                        )}
                      </div>
                      <span className="font-black text-blue-600 text-lg">{service.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{service.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {service.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        {service.rating}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : step === 2 ? (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Select Date & Time</h4>
                {AVAILABILITY_SLOTS.map((day) => (
                  <div key={day.date} className="space-y-3">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{day.date}</p>
                    <div className="flex flex-wrap gap-2">
                      {day.slots.map((slot) => (
                        <motion.button
                          key={`${day.date}-${slot}`}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedDate(day.date);
                            setSelectedSlot(slot);
                          }}
                          className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                            selectedDate === day.date && selectedSlot === slot
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {slot}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Confirm Booking</h4>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800 space-y-4">
                  {[
                    { label: "Service", value: selectedService?.name },
                    { label: "Date", value: selectedDate },
                    { label: "Time", value: selectedSlot },
                    { label: "Duration", value: selectedService?.duration },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-blue-200 dark:border-blue-700 flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="font-black text-2xl text-blue-600">{selectedService?.price}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Free cancellation up to 24 hours before the appointment
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!bookingSuccess && (
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
            {step > 1 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(step - 1)}
                className="px-6 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-700 dark:text-gray-300"
              >
                Back
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (step < 3) setStep(step + 1);
                else handleBook();
              }}
              disabled={(step === 1 && !selectedService) || (step === 2 && !selectedSlot) || isBooking}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-white disabled:opacity-50 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              {isBooking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : step === 3 ? (
                "Confirm Booking"
              ) : (
                "Continue"
              )}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const ReviewsDrawer = ({ isOpen, onClose, reviews }) => {
  const [helpfulReviews, setHelpfulReviews] = useState(new Set());
  const [showHelpfulFeedback, setShowHelpfulFeedback] = useState(null);
  useBodyScrollLock(isOpen);

  const markHelpful = (id) => {
    const newSet = new Set(helpfulReviews);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
      setShowHelpfulFeedback(id);
      setTimeout(() => setShowHelpfulFeedback(null), 1500);
    }
    setHelpfulReviews(newSet);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-[32px] max-h-[88vh] overflow-hidden"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-5 pt-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reviews</h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
            >
              <X size={20} className="text-gray-500" />
            </motion.button>
          </div>
          <div className="flex items-center gap-4 mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl">
            <div className="text-center">
              <span className="text-4xl font-black text-gray-900 dark:text-white">4.8</span>
              <div className="flex mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">{reviews.length} reviews</p>
            </div>
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3">{rating}</span>
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : 3}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(88vh-220px)] p-5 space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
                    <SmartMedia
                      src={review.avatar}
                      type="image"
                      className="w-full h-full object-cover"
                      loaderImage="/GlowLoadingGif.gif"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={12}
                      className={star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>
              {review.service && (
                <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                  {review.service}
                </span>
              )}
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => markHelpful(review.id)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors relative ${
                  helpfulReviews.has(review.id)
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                    : "text-gray-500 bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <ThumbsUp size={12} />
                <span>Helpful ({review.helpful + (helpfulReviews.has(review.id) ? 1 : 0)})</span>
                <AnimatePresence>
                  {showHelpfulFeedback === review.id && (
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap"
                    >
                      Thanks for feedback!
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-5 py-4 border-t border-gray-100 dark:border-gray-800">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-white shadow-lg shadow-blue-500/25"
          >
            Write a Review
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MoreOptionsDrawer = ({
  isOpen,
  onClose,
  onReport,
  onBlock,
  isSaved,
  onSave,
  isNotifying,
  onNotify,
  onShare,
  onShowQR,
  onShowAbout,
  onCopyLink,
}) => {
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  useBodyScrollLock(isOpen);

  const handleReport = () => {
    setShowReportConfirm(false);
    onReport();
    onClose();
  };

  const handleBlock = () => {
    setShowBlockConfirm(false);
    onBlock();
    onClose();
  };

  if (!isOpen) return null;

  const options = [
    {
      id: "save",
      label: isSaved ? "Remove from Saved" : "Save Profile",
      icon: isSaved ? BookmarkCheck : Bookmark,
      action: () => {
        onSave();
      },
    },
    {
      id: "notify",
      label: isNotifying ? "Turn Off Notifications" : "Turn On Notifications",
      icon: isNotifying ? BellOff : Bell,
      action: () => {
        onNotify();
      },
    },
    {
      id: "share",
      label: "Share Profile",
      icon: Share2,
      action: () => {
        onShare?.();
        onClose();
      },
    },
    {
      id: "copy",
      label: "Copy Profile Link",
      icon: Link2,
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        onCopyLink?.();
        onClose();
      },
    },
    {
      id: "qr",
      label: "Show QR Code",
      icon: QrCode,
      action: () => {
        onShowQR?.();
        onClose();
      },
    },
    {
      id: "about",
      label: "About This Account",
      icon: Info,
      action: () => {
        onShowAbout?.();
        onClose();
      },
    },
    { id: "report", label: "Report Profile", icon: Flag, action: () => setShowReportConfirm(true), danger: true },
    { id: "block", label: "Block Profile", icon: UserMinus, action: () => setShowBlockConfirm(true), danger: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className="w-full bg-white dark:bg-gray-900 rounded-t-[32px] p-5 pb-8"
      >
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />

        <AnimatePresence mode="wait">
          {showReportConfirm ? (
            <motion.div
              key="report-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Report Profile?</h3>
                <p className="text-sm text-gray-500">This will submit the profile for review by our team.</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReportConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReport}
                  className="flex-1 py-3 bg-red-500 rounded-xl font-semibold text-white"
                >
                  Report
                </motion.button>
              </div>
            </motion.div>
          ) : showBlockConfirm ? (
            <motion.div
              key="block-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <UserMinus size={32} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Block Profile?</h3>
                <p className="text-sm text-gray-500">You won't see this profile anymore.</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBlockConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBlock}
                  className="flex-1 py-3 bg-red-500 rounded-xl font-semibold text-white"
                >
                  Block
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {options.map((option, idx) => (
                <React.Fragment key={option.id}>
                  {idx === 6 && <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={option.action}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                      option.danger
                        ? "text-red-500 active:bg-red-50 dark:active:bg-red-900/20"
                        : "text-gray-900 dark:text-white active:bg-gray-50 dark:active:bg-gray-800"
                    }`}
                  >
                    <option.icon size={22} />
                    <span className="font-medium">{option.label}</span>
                  </motion.button>
                </React.Fragment>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const ShareModal = ({ isOpen, onClose, vendorName }) => {
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const shareOptions = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500",
      action: () => {
        window.open(`https://wa.me/?text=Check out ${vendorName}! ${window.location.href}`);
        onClose();
      },
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: Facebook,
      color: "bg-blue-600",
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`);
        onClose();
      },
    },
    {
      id: "twitter",
      label: "Twitter",
      icon: Twitter,
      color: "bg-sky-500",
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=Check out ${vendorName}!&url=${window.location.href}`);
        onClose();
      },
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700",
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`);
        onClose();
      },
    },
    {
      id: "instagram",
      label: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
      action: () => {
        onClose();
      },
    },
    {
      id: "email",
      label: "Email",
      icon: Mail,
      color: "bg-gray-600",
      action: () => {
        window.open(`mailto:?subject=Check out ${vendorName}&body=${window.location.href}`);
        onClose();
      },
    },
    {
      id: "sms",
      label: "Message",
      icon: MessageSquare,
      color: "bg-green-600",
      action: () => {
        window.open(`sms:?body=Check out ${vendorName}! ${window.location.href}`);
        onClose();
      },
    },
    {
      id: "copy",
      label: "Copy Link",
      icon: Copy,
      color: "bg-gray-500",
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedFeedback(true);
        setTimeout(() => {
          setCopiedFeedback(false);
          onClose();
        }, 1500);
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className="w-full bg-white dark:bg-gray-900 rounded-t-[32px] p-5 pb-8"
      >
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />
        <h3 className="text-lg font-bold text-center mb-6 text-gray-900 dark:text-white">Share Profile</h3>
        <div className="grid grid-cols-4 gap-5">
          {shareOptions.map((option) => (
            <motion.button
              key={option.id}
              whileTap={{ scale: 0.9 }}
              onClick={option.action}
              className="flex flex-col items-center gap-2 relative"
            >
              <div className={`w-14 h-14 rounded-2xl ${option.color} flex items-center justify-center shadow-lg`}>
                {option.id === "copy" && copiedFeedback ? (
                  <Check size={24} className="text-white" />
                ) : (
                  <option.icon size={24} className="text-white" />
                )}
              </div>
              <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">
                {option.id === "copy" && copiedFeedback ? "Copied!" : option.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const QRCodeModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  useBodyScrollLock(isOpen);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Scan QR Code</h3>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
          >
            <X size={18} className="text-gray-500" />
          </motion.button>
        </div>

        <div className="bg-white p-4 rounded-2xl mb-4 flex items-center justify-center">
          <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">
            {/* QR Code SVG Pattern */}
            <svg viewBox="0 0 200 200" className="w-full h-full p-2">
              <rect fill="#000" x="10" y="10" width="60" height="60" rx="4" />
              <rect fill="#fff" x="20" y="20" width="40" height="40" rx="2" />
              <rect fill="#000" x="28" y="28" width="24" height="24" rx="2" />

              <rect fill="#000" x="130" y="10" width="60" height="60" rx="4" />
              <rect fill="#fff" x="140" y="20" width="40" height="40" rx="2" />
              <rect fill="#000" x="148" y="28" width="24" height="24" rx="2" />

              <rect fill="#000" x="10" y="130" width="60" height="60" rx="4" />
              <rect fill="#fff" x="20" y="140" width="40" height="40" rx="2" />
              <rect fill="#000" x="28" y="148" width="24" height="24" rx="2" />

              <rect fill="#000" x="80" y="10" width="12" height="12" />
              <rect fill="#000" x="100" y="10" width="12" height="12" />
              <rect fill="#000" x="80" y="30" width="12" height="12" />
              <rect fill="#000" x="100" y="50" width="12" height="12" />
              <rect fill="#000" x="80" y="50" width="12" height="12" />

              <rect fill="#000" x="10" y="80" width="12" height="12" />
              <rect fill="#000" x="30" y="80" width="12" height="12" />
              <rect fill="#000" x="50" y="100" width="12" height="12" />
              <rect fill="#000" x="10" y="100" width="12" height="12" />

              <rect fill="#000" x="80" y="80" width="40" height="40" rx="4" />
              <rect fill="#fff" x="88" y="88" width="24" height="24" rx="2" />
              <rect fill="#000" x="94" y="94" width="12" height="12" rx="1" />

              <rect fill="#000" x="130" y="80" width="12" height="12" />
              <rect fill="#000" x="150" y="80" width="12" height="12" />
              <rect fill="#000" x="170" y="100" width="12" height="12" />
              <rect fill="#000" x="130" y="100" width="12" height="12" />

              <rect fill="#000" x="80" y="130" width="12" height="12" />
              <rect fill="#000" x="100" y="150" width="12" height="12" />
              <rect fill="#000" x="80" y="170" width="12" height="12" />

              <rect fill="#000" x="130" y="130" width="60" height="12" />
              <rect fill="#000" x="130" y="150" width="12" height="12" />
              <rect fill="#000" x="160" y="150" width="12" height="12" />
              <rect fill="#000" x="130" y="170" width="40" height="12" />
              <rect fill="#000" x="178" y="170" width="12" height="12" />
            </svg>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mb-4 break-all px-2">{currentUrl}</p>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy Link"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (navigator.share) {
                navigator.share({ url: currentUrl });
              }
            }}
            className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Share
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AboutAccountModal = ({ isOpen, onClose, vendor }) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const accountDetails = [
    { label: "Account Type", value: vendor?.isPremium ? "Professional" : "Business" },
    { label: "Category", value: vendor?.category || "Photography" },
    { label: "Joined", value: "March 2022" },
    { label: "Location", value: vendor?.address?.city || "Mumbai, India" },
    { label: "Posts", value: "6" },
    { label: "Reels", value: "12" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white dark:bg-gray-900 rounded-t-[32px] p-5 pb-8"
      >
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />
        <h3 className="text-lg font-bold text-center mb-6 text-gray-900 dark:text-white">About This Account</h3>

        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-gray-200 dark:ring-gray-700">
            <SmartMedia
              src={
                vendor?.vendorProfile?.profilePicture ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
              }
              type="image"
              className="w-full h-full object-cover"
              loaderImage="/GlowLoadingGif.gif"
            />
          </div>
          <h4 className="font-bold text-gray-900 dark:text-white">{vendor?.name}</h4>
          <p className="text-sm text-gray-500">
            @{vendor?.username || vendor?.name?.toLowerCase().replace(/\s+/g, "_")}
          </p>
        </div>

        <div className="space-y-3">
          {accountDetails.map((detail, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800"
            >
              <span className="text-gray-500 text-sm">{detail.label}</span>
              <span className="font-semibold text-gray-900 dark:text-white text-sm">{detail.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              This account is verified and managed by a registered event vendor on our platform.
            </p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full mt-6 py-3.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-300"
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const PostPreviewModal = ({ post, onClose }) => {
  useBodyScrollLock(!!post);

  if (!post) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
      onTouchEnd={onClose}
      onMouseUp={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-2xl"
      >
        <SmartMedia
          src={post.fullImage || post.thumbnail}
          type="image"
          className="w-full h-full object-cover"
          loaderImage="/GlowLoadingGif.gif"
        />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute bottom-10 flex items-center gap-4 text-white text-sm"
      >
        <span className="flex items-center gap-1">
          <Heart size={16} className="fill-white" />
          {post.likes}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={16} />
          {post.comments}
        </span>
      </motion.div>
    </motion.div>
  );
};

const PostOptionsDrawer = ({ isOpen, onClose, post, onDelete, onShare }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  useBodyScrollLock(isOpen);

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
    onClose();
  };

  if (!isOpen) return null;

  const options = [
    {
      id: "share",
      label: "Share",
      icon: Share2,
      action: () => {
        onShare();
        onClose();
      },
    },
    {
      id: "copy",
      label: "Copy Link",
      icon: Link2,
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        onClose();
      },
    },
    { id: "edit", label: "Edit Caption", icon: Type, action: onClose },
    { id: "archive", label: "Archive", icon: Bookmark, action: onClose },
    { id: "delete", label: "Delete", icon: X, action: () => setShowDeleteConfirm(true), danger: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white dark:bg-gray-900 rounded-t-[32px] p-5 pb-8"
      >
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />

        <AnimatePresence mode="wait">
          {showDeleteConfirm ? (
            <motion.div
              key="delete-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Post?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-red-500 rounded-xl font-semibold text-white"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {options.map((option, idx) => (
                <React.Fragment key={option.id}>
                  {idx === 4 && <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={option.action}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                      option.danger
                        ? "text-red-500 active:bg-red-50 dark:active:bg-red-900/20"
                        : "text-gray-900 dark:text-white active:bg-gray-50 dark:active:bg-gray-800"
                    }`}
                  >
                    <option.icon size={22} />
                    <span className="font-medium">{option.label}</span>
                  </motion.button>
                </React.Fragment>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const ReelOptionsDrawer = ({ isOpen, onClose, reel, onDelete, onShare }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  useBodyScrollLock(isOpen);

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
    onClose();
  };

  if (!isOpen) return null;

  const options = [
    {
      id: "share",
      label: "Share Reel",
      icon: Share2,
      action: () => {
        onShare();
        onClose();
      },
    },
    {
      id: "copy",
      label: "Copy Link",
      icon: Link2,
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        onClose();
      },
    },
    { id: "download", label: "Download", icon: Upload, action: onClose },
    { id: "edit", label: "Edit Caption", icon: Type, action: onClose },
    { id: "delete", label: "Delete Reel", icon: X, action: () => setShowDeleteConfirm(true), danger: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white dark:bg-gray-900 rounded-t-[32px] p-5 pb-8"
      >
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />

        <AnimatePresence mode="wait">
          {showDeleteConfirm ? (
            <motion.div
              key="delete-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Reel?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-red-500 rounded-xl font-semibold text-white"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {options.map((option, idx) => (
                <React.Fragment key={option.id}>
                  {idx === 4 && <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={option.action}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                      option.danger
                        ? "text-red-500 active:bg-red-50 dark:active:bg-red-900/20"
                        : "text-gray-900 dark:text-white active:bg-gray-50 dark:active:bg-gray-800"
                    }`}
                  >
                    <option.icon size={22} />
                    <span className="font-medium">{option.label}</span>
                  </motion.button>
                </React.Fragment>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const StoryShareDrawer = ({ isOpen, onClose, highlight }) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const shareOptions = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500",
      action: () => {
        window.open(`https://wa.me/?text=Check out this story!`);
        onClose();
      },
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: Facebook,
      color: "bg-blue-600",
      action: () => {
        onClose();
      },
    },
    {
      id: "twitter",
      label: "Twitter",
      icon: Twitter,
      color: "bg-sky-500",
      action: () => {
        onClose();
      },
    },
    {
      id: "copy",
      label: "Copy Link",
      icon: Copy,
      color: "bg-gray-500",
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        onClose();
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-gray-900 rounded-t-[32px] p-5 pb-8"
      >
        <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-5" />
        <h3 className="text-lg font-bold text-center mb-6 text-white">Share Story</h3>
        <div className="grid grid-cols-4 gap-5">
          {shareOptions.map((option) => (
            <motion.button
              key={option.id}
              whileTap={{ scale: 0.9 }}
              onClick={option.action}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 rounded-2xl ${option.color} flex items-center justify-center shadow-lg`}>
                <option.icon size={24} className="text-white" />
              </div>
              <span className="text-[10px] font-semibold text-gray-400">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ContactDrawer = ({ isOpen, onClose, vendor }) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className="w-full bg-white dark:bg-gray-900 rounded-t-[32px] p-5 pb-8"
      >
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />
        <h3 className="text-lg font-bold text-center mb-6 text-gray-900 dark:text-white">Contact Options</h3>
        <div className="space-y-3">
          <motion.a
            href={`tel:${vendor?.phoneNo || "+919876543210"}`}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Phone size={24} />
            </div>
            <div>
              <p className="font-bold">Call Now</p>
              <p className="text-sm opacity-80">{vendor?.phoneNo || "+91 98765 43210"}</p>
            </div>
            <ChevronRight size={20} className="ml-auto opacity-60" />
          </motion.a>
          <motion.a
            href={`https://wa.me/${vendor?.whatsappNo || vendor?.phoneNo || "919876543210"}`}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/25"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageCircle size={24} />
            </div>
            <div>
              <p className="font-bold">WhatsApp</p>
              <p className="text-sm opacity-80">Chat on WhatsApp</p>
            </div>
            <ChevronRight size={20} className="ml-auto opacity-60" />
          </motion.a>
          <motion.a
            href={`mailto:${vendor?.email || "contact@vendor.com"}`}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Mail size={24} />
            </div>
            <div>
              <p className="font-bold">Email</p>
              <p className="text-sm opacity-80">{vendor?.email || "contact@vendor.com"}</p>
            </div>
            <ChevronRight size={20} className="ml-auto opacity-60" />
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
};

const formatBio = (bio) => {
  if (!bio) return null;

  const lines = bio.split(/[.!?]\s+|[\n]/);
  return lines.map((line, idx) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return null;
    return (
      <React.Fragment key={idx}>
        {trimmedLine}
        {idx < lines.length - 1 && trimmedLine && <br />}
      </React.Fragment>
    );
  });
};

const VendorProfilePageWrapper = () => {
  const { id } = useParams();
  const router = useRouter();

  const [vendor, setVendor] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  const [showShareModal, setShowShareModal] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showBookingDrawer, setShowBookingDrawer] = useState(false);
  const [showReviewsDrawer, setShowReviewsDrawer] = useState(false);
  const [showContactDrawer, setShowContactDrawer] = useState(false);
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedReelIndex, setSelectedReelIndex] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  const [trustCount, setTrustCount] = useState(248);
  const [hasTrusted, setHasTrusted] = useState(false);
  const [likesCount, setLikesCount] = useState(2534);
  const [hasLiked, setHasLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  const [showThumbsUpAnimation, setShowThumbsUpAnimation] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState({ show: false, message: "", type: "success", icon: Check });

  const [showQRModal, setShowQRModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [previewPost, setPreviewPost] = useState(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(true);
  const longPressTimerRef = useRef(null);

  // Replace MOCK_POSTS and MOCK_REELS with state
  const [posts, setPosts] = useState(MOCK_POSTS.slice(0, 6));
  const [reels, setReels] = useState(MOCK_REELS.slice(0, 12));

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 60], [0, 1]);

  const highlightsContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/vendor/${id}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setVendor(data);
        setProfile(data.vendorProfile || (Array.isArray(data.vendorProfile) ? data.vendorProfile[0] : {}));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const showUIConfirmation = useCallback((message, type = "success", icon = Check) => {
    setShowConfirmation({ show: true, message, type, icon });
    setTimeout(() => setShowConfirmation({ show: false, message: "", type: "success", icon: Check }), 2000);
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({ title: vendor?.name, text: `Check out ${vendor?.name}!`, url: window.location.href })
        .catch(() => setShowShareModal(true));
    } else {
      setShowShareModal(true);
    }
  }, [vendor]);

  const handleTrust = useCallback(() => {
    if (!hasTrusted) {
      setShowThumbsUpAnimation(true);
      setTimeout(() => setShowThumbsUpAnimation(false), 1200);
      setTrustCount((prev) => prev + 5);
      setHasTrusted(true);
    } else {
      setTrustCount((prev) => prev - 5);
      setHasTrusted(false);
      showUIConfirmation("Trust removed", "info", Shield);
    }
  }, [hasTrusted, showUIConfirmation]);

  const handleLike = useCallback(() => {
    if (!hasLiked) {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
      showUIConfirmation("Vendor liked!", "success", Heart);
    } else {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
      showUIConfirmation("Like removed", "info", Heart);
    }
  }, [hasLiked, showUIConfirmation]);

  const handleSaveProfile = useCallback(() => {
    setIsSaved((prev) => !prev);
    showUIConfirmation(isSaved ? "Removed from saved" : "Profile saved!", "success", Bookmark);
  }, [isSaved, showUIConfirmation]);

  const handleNotify = useCallback(() => {
    setIsNotifying((prev) => !prev);
    showUIConfirmation(isNotifying ? "Notifications off" : "Notifications on", "success", Bell);
  }, [isNotifying, showUIConfirmation]);

  const handleReport = useCallback(() => {
    showUIConfirmation("Report submitted", "success", Flag);
    setShowMoreOptions(false);
  }, [showUIConfirmation]);

  const handleBlock = useCallback(() => {
    showUIConfirmation("Profile blocked", "success", UserMinus);
    setShowMoreOptions(false);
    setTimeout(() => router.back(), 1500);
  }, [router, showUIConfirmation]);

  const handleBookingConfirmed = useCallback(() => {
    showUIConfirmation("Booking confirmed!", "success", Calendar);
  }, [showUIConfirmation]);

  const handleDeletePost = useCallback(
    (postId) => {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setSelectedPost(null);
      showUIConfirmation("Post deleted", "success", Check);
    },
    [showUIConfirmation]
  );

  const handleDeleteReel = useCallback(
    (reelId) => {
      setReels((prev) => prev.filter((r) => r.id !== reelId));
      showUIConfirmation("Reel deleted", "success", Check);
    },
    [showUIConfirmation]
  );

  const handleUploadPost = useCallback((newPost) => {
    setPosts((prev) => [newPost, ...prev].slice(0, 6));
  }, []);

  const handleUploadReel = useCallback((newReel) => {
    setReels((prev) => [newReel, ...prev].slice(0, 12));
  }, []);

  const handleCopyLink = useCallback(() => {
    showUIConfirmation("Link copied!", "success", Copy);
  }, [showUIConfirmation]);

  const stats = useMemo(
    () => [
      { label: "Reviews", value: "124", action: () => setShowReviewsDrawer(true) },
      { label: "Trust", value: trustCount.toString(), action: handleTrust, active: hasTrusted },
      {
        label: "Likes",
        value: likesCount >= 1000 ? `${(likesCount / 1000).toFixed(1)}K` : likesCount.toString(),
        action: handleLike,
        active: hasLiked,
      },
    ],
    [trustCount, hasTrusted, likesCount, hasLiked, handleTrust, handleLike]
  );

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-[3px] mx-[15px]">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedPost(post)}
                  onTouchStart={() => {
                    longPressTimerRef.current = setTimeout(() => {
                      setPreviewPost(post);
                      setIsLongPressing(true);
                    }, 500);
                  }}
                  onTouchEnd={() => {
                    if (longPressTimerRef.current) {
                      clearTimeout(longPressTimerRef.current);
                    }
                    if (isLongPressing) {
                      setPreviewPost(null);
                      setIsLongPressing(false);
                    }
                  }}
                  onTouchMove={() => {
                    if (longPressTimerRef.current) {
                      clearTimeout(longPressTimerRef.current);
                    }
                  }}
                  onMouseDown={() => {
                    longPressTimerRef.current = setTimeout(() => {
                      setPreviewPost(post);
                      setIsLongPressing(true);
                    }, 500);
                  }}
                  onMouseUp={() => {
                    if (longPressTimerRef.current) {
                      clearTimeout(longPressTimerRef.current);
                    }
                    if (isLongPressing) {
                      setPreviewPost(null);
                      setIsLongPressing(false);
                    }
                  }}
                  onMouseLeave={() => {
                    if (longPressTimerRef.current) {
                      clearTimeout(longPressTimerRef.current);
                    }
                    if (isLongPressing) {
                      setPreviewPost(null);
                      setIsLongPressing(false);
                    }
                  }}
                  className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden relative cursor-pointer select-none rounded-[10px]"
                >
                  <SmartMedia
                    src={post.thumbnail}
                    type="image"
                    className="w-full h-full object-cover"
                    loaderImage="/GlowLoadingGif.gif"
                  />
                  <div className="absolute inset-0 bg-black/0 active:bg-black/40 transition-colors flex items-center justify-center gap-3 text-white text-xs font-bold opacity-0 active:opacity-100">
                    <span className="flex items-center gap-1">
                      <Heart size={14} className="fill-white" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} className="fill-white" />
                      {post.comments}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="space-y-5 mx-4">
              {vendor?.images?.length > 0 ? (
                <>
                  {/* Image Count Header */}
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center">
                          <ImageIcon size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Photo Gallery</h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {vendor?.images.length} photos available
                          </p>
                        </div>
                      </div>

                      {/* Collapsible Toggle Button */}
                      <motion.button
                        onClick={() => setIsGalleryExpanded(!isGalleryExpanded)}
                        whileTap={{ scale: 0.95 }}
                        className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <motion.div
                          animate={{ rotate: isGalleryExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <ChevronDown size={18} className="text-slate-600 dark:text-slate-400" />
                        </motion.div>
                      </motion.button>
                    </div>
                  </div>

                  {/* Image Grid with Collapse Animation */}
                  <AnimatePresence initial={false}>
                    {isGalleryExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          height: {
                            duration: 0.5,
                            ease: [0.32, 0.72, 0, 1], // Custom easing for ultra-smooth motion
                          },
                          opacity: {
                            duration: 0.4,
                            ease: "easeInOut",
                            delay: isGalleryExpanded ? 0.1 : 0, // Slight delay on expand
                          },
                        }}
                        className="overflow-hidden origin-top"
                      >
                        <motion.div
                          initial={{ y: -20 }}
                          animate={{ y: 0 }}
                          exit={{ y: -20 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.32, 0.72, 0, 1],
                          }}
                          className="grid grid-cols-2 gap-3"
                        >
                          {vendor?.images.map((img, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.03, duration: 0.3 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => openImageModal(idx)}
                              className="relative aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300"
                            >
                              <SmartMedia
                                src={img}
                                type="image"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                style={{ objectPosition: "center center" }}
                                loaderImage="/GlowLoadingGif.gif"
                              />

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                  <span className="text-white text-[10px] font-bold bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                                    Photo {idx + 1}
                                  </span>
                                  <div className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                    <ZoomIn size={16} className="text-slate-800" />
                                  </div>
                                </div>
                              </div>

                              {/* Top Badge for first image */}
                              {idx === 0 && (
                                <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                                  <Star size={10} className="fill-white" />
                                  Featured
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <ImageIcon size={36} className="text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-2">No images available</p>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                    The vendor hasn't uploaded any gallery images yet
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case "reels":
        return (
          <div className="grid grid-cols-3 gap-[3px] mx-[15px]">
            {reels.map((reel, index) => (
              <motion.div
                key={reel.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedReelIndex(index)}
                className="aspect-[9/16] bg-gray-100 dark:bg-gray-800 overflow-hidden relative cursor-pointer rounded-[10px]"
              >
                <SmartMedia
                  src={reel.thumbnail}
                  type="image"
                  className="w-full h-full object-cover"
                  loaderImage="/GlowLoadingGif.gif"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-bold">
                  <Play size={12} className="fill-white" />
                  {reel.views}
                </div>
                <div className="absolute top-2 right-2 text-white text-[9px] font-bold bg-black/60 px-1.5 py-0.5 rounded">
                  {reel.duration}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "portfolio":
        return (
          <div className="grid grid-cols-2 gap-3 p-4">
            {MOCK_PORTFOLIO.map((item) => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedPortfolio(item)}
                className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden relative cursor-pointer shadow-sm"
              >
                <SmartMedia
                  src={item.thumbnail}
                  type="image"
                  className="w-full h-full object-cover"
                  loaderImage="/GlowLoadingGif.gif"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-sm mb-0.5 truncate">{item.title}</p>
                  <p className="text-white/70 text-xs">{item.count} photos</p>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center">
                  <LayoutGrid size={14} className="text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "services":
        return (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Services & Packages</h3>
              <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full font-medium">
                {vendor?.packages?.length} services
              </span>
            </div>
            {vendor?.packages?.map((packageItem, index) => (
              <motion.div
                key={packageItem._id?.$oid || index}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowBookingDrawer(true)}
                className="p-5 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm space-y-3 cursor-pointer active:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-bold text-[13px] text-gray-900 dark:text-white line-clamp-2">
                        {packageItem.name}
                      </span>
                      {packageItem.isPopular && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[9px] font-bold rounded-full flex items-center gap-1 shrink-0">
                          <Sparkles size={8} />
                          POPULAR
                        </span>
                      )}
                    </div>

                    {/* Only show features if they exist */}
                    {packageItem.features?.length > 0 && (
                      <ul className="text-[11px] text-gray-600 dark:text-gray-400 space-y-1.5 mt-2">
                        {packageItem.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check size={12} className="text-green-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                        {packageItem.features.length > 3 && (
                          <li className="text-blue-600 font-semibold text-[10px] ml-5">
                            +{packageItem.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-black text-blue-600">
                        ₹{packageItem.price.toLocaleString("en-IN")}
                      </span>
                      {packageItem.originalPrice && packageItem.originalPrice > packageItem.price && (
                        <span className="text-[11px] text-gray-400 line-through mt-0.5">
                          ₹{packageItem.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                      {packageItem.savingsPercentage > 0 && (
                        <span className="text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded mt-1">
                          Save {packageItem.savingsPercentage}%
                        </span>
                      )}
                    </div>
                    {packageItem.duration && (
                      <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1 justify-end">
                        <Clock size={10} />
                        {packageItem.duration}
                      </p>
                    )}
                  </div>
                </div>

                {/* Only show bottom section if there's content to display */}
                {(packageItem.notIncluded?.length > 0 || packageItem.duration) && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-xs">
                      {packageItem.notIncluded?.length > 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-orange-600 dark:text-orange-400">
                          <Info size={11} />
                          Exclusions apply
                        </span>
                      )}
                      {packageItem.duration && !packageItem.features?.length && (
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Clock size={11} />
                          {packageItem.duration}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold">
                      Book Now <ChevronRight size={14} />
                    </div>
                  </div>
                )}

                {/* If no bottom section content, show simplified book button */}
                {!packageItem.notIncluded?.length && !packageItem.duration && (
                  <div className="flex justify-end pt-2">
                    <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold">
                      Book Now <ChevronRight size={14} />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <VendorProfileSkeleton />;
  }

  if (!vendor || !profile) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
          <Camera size={40} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          The profile you're looking for doesn't exist or has been removed.
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-sm shadow-lg shadow-blue-500/25"
        >
          Go Back
        </motion.button>
      </div>
    );
  }

  const vendorImage =
    profile.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop";

  const defaultBio = `📸 Professional Event Photographer
🎬 Capturing moments that last forever
🏆 Award-winning coverage
📍 Available for bookings worldwide
💼 5+ years of experience`;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black pb-24">
      <ThumbsUpAnimation show={showThumbsUpAnimation} />
      <FloatingConfirmation
        show={showConfirmation.show}
        icon={showConfirmation.icon}
        message={showConfirmation.message}
        type={showConfirmation.type}
      />

      {/* Enhanced Header */}
      <motion.header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-b-2xl">
        <motion.div
          style={{ opacity: headerOpacity }}
          className="absolute inset-0 bg-white dark:bg-gray-900 border-b border-gray-200/50 dark:border-gray-800/50"
        />
        <div className="relative flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="w-9 h-9 rounded-full bg-gray-100/80 dark:bg-gray-800/80 flex items-center justify-center"
            >
              <ArrowLeft size={18} className="text-gray-900 dark:text-white" />
            </motion.button>
            <span className="font-semibold text-gray-900 dark:text-white text-sm truncate max-w-[200px]">
              @{vendor.username || vendor.name?.toLowerCase().replace(/\s+/g, "_")}
            </span>
            {vendor.isVerified && <BadgeCheck size={16} className="text-blue-500 flex-shrink-0" />}
          </div>
          <div className="flex gap-1.5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-gray-100/80 dark:bg-gray-800/80 flex items-center justify-center"
            >
              <Share2 size={16} className="text-gray-900 dark:text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMoreOptions(true)}
              className="w-9 h-9 rounded-full bg-gray-100/80 dark:bg-gray-800/80 flex items-center justify-center"
            >
              <MoreVertical size={16} className="text-gray-900 dark:text-white" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="pt-14" />

      <div className="flex flex-col">
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #7c3aed 100%)",
          }}
        />
        <div className="bg-transparent dark:bg-gray-900 z-30">
          <div className="px-4 pt-5 pb-1">
            {/* Profile Info Section - Increased Size */}
            <div className="flex items-start gap-5 mb-2">
              <motion.div
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfilePicture(true)}
                className="relative cursor-pointer flex-shrink-0"
              >
                <div className="w-27 h-27 rounded-full overflow-hidden p-[3px] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 shadow-xl shadow-gray-500/25">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
                    <SmartMedia
                      src={vendorImage}
                      type="image"
                      className="w-full h-full object-cover"
                      loaderImage="/GlowLoadingGif.gif"
                    />
                  </div>
                </div>
                {vendor.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-[3px] border-white dark:border-gray-900 shadow-lg">
                    <BadgeCheck size={16} className="text-white" />
                  </div>
                )}
              </motion.div>

              <div className="flex-1 min-w-0 pt-[14px]">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">{vendor.name}</h1>
                  {vendor.isPremium && (
                    <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold rounded-full flex items-center gap-1 flex-shrink-0">
                      <Crown size={10} />
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-base text-blue-600 dark:text-blue-400 font-semibold mb-1">
                  {vendor.category || "Photography"}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin size={14} />
                  <span className="truncate">{vendor.address?.city || "Mumbai, India"}</span>
                </div>
              </div>
            </div>

            {/* Stats Section - Removed Bookings and Item BG */}
            <div className="flex justify-around mb-1 py-3 mx-10">
              {stats.map((stat, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.95 }}
                  onClick={stat.action}
                  className="flex flex-col items-center gap-0.3 px-4"
                >
                  <span
                    className={`text-xl font-black ${stat.active ? "text-blue-600" : "text-gray-900 dark:text-white"}`}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">{stat.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Enhanced Bio Section - Instagram Style */}
            <div className="mb-4">
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-6 whitespace-pre-line">
                {profile.bio ? formatBio(profile.bio) : formatBio(defaultBio)}
              </p>
            </div>

            {/* Social Links */}
            {(profile.website || profile.socialLinks?.instagram) && (
              <div className="flex items-center gap-2 mb-5 overflow-x-auto no-scrollbar">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 text-xs font-medium flex-shrink-0"
                  >
                    <Globe size={12} />
                    Website
                    <ExternalLink size={10} />
                  </a>
                )}
                {profile.socialLinks?.instagram && (
                  <a
                    href={profile.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full text-pink-600 dark:text-pink-400 text-xs font-medium flex-shrink-0"
                  >
                    <Instagram size={12} />
                    Instagram
                  </a>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleTrust}
                className={`flex-[2] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  hasTrusted
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                }`}
              >
                <motion.div
                  animate={hasTrusted ? { rotate: [0, -20, 20, 0], scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <ThumbsUp size={20} className={hasTrusted ? "fill-white" : ""} />
                </motion.div>
                {hasTrusted ? "Trusted" : "Trust"}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBookingDrawer(true)}
                className="flex-1 py-3.5 bg-gray-200 dark:bg-gray-800 rounded-xl font-semibold text-sm text-gray-700 dark:text-gray-300"
              >
                Book
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowContactDrawer(true)}
                className="flex-1 py-3.5 bg-gray-200 dark:bg-gray-800 rounded-xl font-semibold text-sm text-gray-700 dark:text-gray-300"
              >
                Contact
              </motion.button>
            </div>

            {/* Highlights Section - Horizontal Scrollable with 4 visible */}
            <div ref={highlightsContainerRef} className="overflow-x-auto no-scrollbar -mx-4 px-4">
              <div className="flex gap-3 py-1" style={{ minWidth: "max-content" }}>
                {MOCK_HIGHLIGHTS.map((highlight) => (
                  <motion.button
                    key={highlight.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedHighlight(highlight)}
                    className="flex flex-col items-center gap-3"
                    style={{ width: "calc((100vw - 64px) / 4)" }}
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden p-[2px] bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-md">
                      <div className="w-full h-full rounded-[14px] overflow-hidden bg-white dark:bg-gray-900">
                        <SmartMedia
                          src={highlight.image}
                          type="image"
                          className="w-full h-full object-cover"
                          loaderImage="/GlowLoadingGif.gif"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 truncate w-full text-center">
                      {highlight.title}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section - Enhanced with subtle border */}
      <div className="sticky top-14 z-30 bg-transparent dark:bg-gray-900 border-b border-gray-200/80 dark:border-gray-800/80 mb-1">
        <div className="flex">
          {TABS.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3.5 flex items-center justify-center gap-2 relative"
            >
              <tab.icon
                size={20}
                className={activeTab === tab.id ? "text-gray-900 dark:text-white" : "text-gray-400"}
              />
              {/* <span
                className={`text-xs font-semibold ${
                  activeTab === tab.id ? "text-gray-900 dark:text-white" : "text-gray-400"
                }`}
              >
                {tab.label}
              </span> */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-gray-900 dark:bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 min-h-[50vh]"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Floating Plus Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-blue-500/40 flex items-center justify-center z-50"
      >
        <Plus size={28} className="text-white" />
      </motion.button>

      {/* All Modals */}
      <AnimatePresence>
        {showProfilePicture && (
          <ProfilePictureModal
            isOpen={showProfilePicture}
            onClose={() => setShowProfilePicture(false)}
            image={vendorImage}
            name={vendor.name}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedHighlight && <StoryViewer highlight={selectedHighlight} onClose={() => setSelectedHighlight(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            vendorName={vendor.name}
            vendorImage={vendorImage}
            onDelete={() => handleDeletePost(selectedPost.id)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedReelIndex !== null && (
          <ReelsViewer
            reels={reels}
            initialIndex={selectedReelIndex}
            onClose={() => setSelectedReelIndex(null)}
            vendorName={vendor.name}
            vendorImage={vendorImage}
            onDeleteReel={handleDeleteReel}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedPortfolio && (
          <PortfolioViewer
            portfolio={selectedPortfolio}
            onClose={() => setSelectedPortfolio(null)}
            onBookService={() => setShowBookingDrawer(true)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showUploadModal && (
          <UploadModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onUploadPost={handleUploadPost}
            onUploadReel={handleUploadReel}
            postsCount={posts.length}
            reelsCount={reels.length}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showBookingDrawer && (
          <BookingDrawer
            isOpen={showBookingDrawer}
            onClose={() => setShowBookingDrawer(false)}
            services={MOCK_SERVICES}
            vendorName={vendor.name}
            onBookingConfirmed={handleBookingConfirmed}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showReviewsDrawer && (
          <ReviewsDrawer
            isOpen={showReviewsDrawer}
            onClose={() => setShowReviewsDrawer(false)}
            reviews={MOCK_REVIEWS}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showContactDrawer && (
          <ContactDrawer isOpen={showContactDrawer} onClose={() => setShowContactDrawer(false)} vendor={vendor} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showMoreOptions && (
          <MoreOptionsDrawer
            isOpen={showMoreOptions}
            onClose={() => setShowMoreOptions(false)}
            onReport={handleReport}
            onBlock={handleBlock}
            isSaved={isSaved}
            onSave={handleSaveProfile}
            isNotifying={isNotifying}
            onNotify={handleNotify}
            onShare={handleShare}
            onShowQR={() => setShowQRModal(true)}
            onShowAbout={() => setShowAboutModal(true)}
            onCopyLink={handleCopyLink}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showShareModal && (
          <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} vendorName={vendor.name} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showQRModal && <QRCodeModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showAboutModal && (
          <AboutAccountModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} vendor={vendor} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {previewPost && <PostPreviewModal post={previewPost} onClose={() => setPreviewPost(null)} />}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
};

export default VendorProfilePageWrapper;

// opus 4.5 thinking version2
