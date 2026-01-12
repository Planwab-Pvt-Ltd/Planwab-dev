"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, PanInfo } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  MoreVertical,
  MapPin,
  Star,
  Home,
  Layers,
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
  Gift,
  FileText,
  BarChart2,
  Award,
  Building2,
  Paintbrush2,
  UserCircle,
  UtensilsCrossed,
  Shirt,
  Hand,
  CakeSlice,
  Gem,
  Scissors,
  Music,
  Wind,
  Car,
  Wifi,
  Utensils,
  Zap,
  Tv,
  Projector,
  Armchair,
  DoorOpen,
  Accessibility,
  Baby,
  PawPrint,
  Cigarette,
  GlassWater,
  Coffee,
  Flower2,
  Mic2,
  ThermometerSun,
  Flame,
  Sun,
  Building,
  Leaf,
  HeartIcon,
  IndianRupee,
  BadgeIndianRupee,
  Percent,
  Palette,
  Youtube,
  DollarSign,
  Trophy,
  HandCoins,
  Timer,
  Medal,
  TrendingUp,
  Route,
  MapIcon,
  Navigation,
} from "lucide-react";
import dynamic from "next/dynamic";
import ReviewSection from "../ReviewSection";

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

const CATEGORY_CONFIG = {
  venues: { label: "Venues", icon: Building2, color: "blue" },
  photographers: { label: "Photography", icon: Camera, color: "purple" },
  makeup: { label: "Makeup", icon: Paintbrush2, color: "pink" },
  planners: { label: "Planning", icon: UserCircle, color: "indigo" },
  catering: { label: "Catering", icon: UtensilsCrossed, color: "orange" },
  clothes: { label: "Fashion", icon: Shirt, color: "rose" },
  mehendi: { label: "Mehendi", icon: Hand, color: "amber" },
  cakes: { label: "Cakes", icon: CakeSlice, color: "pink" },
  jewellery: { label: "Jewellery", icon: Gem, color: "yellow" },
  invitations: { label: "Invitations", icon: Mail, color: "teal" },
  djs: { label: "DJs", icon: Music, color: "violet" },
  hairstyling: { label: "Hairstyling", icon: Scissors, color: "fuchsia" },
  other: { label: "Services", icon: FileText, color: "gray" },
};

const AMENITY_ICONS = {
  "Air Conditioning": Wind,
  Parking: Car,
  "Sound System": Music,
  "Wi-Fi": Wifi,
  "Catering Service": Utensils,
  Security: Shield,
  "Photography Area": Camera,
  "Bridal Room": Crown,
  "Valet Parking": Car,
  "Generator Backup": Zap,
  "Decoration Service": Gift,
  "DJ Services": Music,
  "Stage Setup": Layers,
  "Green Room": Home,
  "LED Screens": Tv,
  "Live Streaming": Video,
  Projector: Projector,
  "Waiting Lounge": Armchair,
  "Multiple Entry Points": DoorOpen,
  "Wheelchair Accessible": Accessibility,
  "Kids Play Area": Baby,
  "Pet Friendly": PawPrint,
  "Smoking Area": Cigarette,
  "Bar Service": GlassWater,
  "Coffee Station": Coffee,
  "Floral Decoration": Flower2,
  "Dressing Room": Shirt,
  "Kitchen Access": UtensilsCrossed,
  Microphone: Mic2,
  "Climate Control": ThermometerSun,
  Heating: Flame,
  "Outdoor Space": Sun,
  "Indoor Venue": Building,
  CCTV: Shield,
  "Changing Room": Shirt,
  "Open Catering": Utensils,
  "Home Service (Doorstep Delivery)": Home,
  "Studio Consultations:": Building2,
  "Organic Henna Preparation": Leaf,
  "After-Care Support": HeartIcon,
  "Home Services / Doorstep Visits": Home,
  "Organic / Herbal Henna": Leaf,
  "Destination Wedding Travel": MapPin,
  "Training & Workshops": Users,
};

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? "100%" : "-100%", opacity: 0 }),
};

const collapseVariants = {
  collapsed: { height: 0, opacity: 0, marginTop: 0 },
  expanded: { height: "auto", opacity: 1, marginTop: 8 },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const CATEGORY_GRADIENTS = {
  planners: { from: "#3b82f6", to: "#06b6d4" },
  decor: { from: "#a855f7", to: "#ec4899" },
  djs: { from: "#f59e0b", to: "#ef4444" },
  photographers: { from: "#6366f1", to: "#8b5cf6" },
  venues: { from: "#f59e0b", to: "#eab308" },
  catering: { from: "#fb923c", to: "#f43f5e" },
  cake: { from: "#ec4899", to: "#d946ef" },
  makeup: { from: "#f43f5e", to: "#ec4899" },
  mehendi: { from: "#10b981", to: "#059669" },
};

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

const formatPrice = (price) => {
  if (!price) return "N/A";
  return `₹${Number(price).toLocaleString("en-IN")}`;
};

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
            {[1, 2, 3, 4, 5].map((i) => (
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
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
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

const PostDetailModal = ({ post, onClose, vendorName, vendorImage, onDelete, onEdit, onArchive }) => {
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
    if (!isSaved) {
      setIsSaved(true);
      onArchieve?.(post.id);
    } else {
      setIsSaved(false);
      onArchive?.(post.id);
    }
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

  const handleEdit = (newCaption) => {
    onEdit?.(post.id, newCaption);
  };

  const handleArchive = () => {
    onArchive?.(post.id);
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
            onEdit={handleEdit}
            onArchive={handleArchive}
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

const InfoChip = memo(({ icon: Icon, label, value, color = "blue", size = "normal" }) => (
  <div
    className={`flex items-center gap-2 p-2.5 bg-${color}-50 dark:bg-${color}-900/20 rounded-xl ${
      size === "small" ? "p-2" : ""
    }`}
  >
    <div
      className={`w-8 h-8 rounded-lg bg-${color}-100 dark:bg-${color}-800/30 flex items-center justify-center ${
        size === "small" ? "w-7 h-7" : ""
      }`}
    >
      <Icon size={size === "small" ? 14 : 16} className={`text-${color}-600 dark:text-${color}-400`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wide">{label}</p>
      <p className={`font-bold text-gray-900 dark:text-white truncate ${size === "small" ? "text-[11px]" : "text-xs"}`}>
        {value}
      </p>
    </div>
  </div>
));
InfoChip.displayName = "InfoChip";

const QuickStatCard = memo(({ icon: Icon, label, value, subtext, color = "blue", gradient }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className={`relative overflow-hidden p-3 rounded-2xl ${
      gradient ||
      `bg-gradient-to-br from-${color}-50 to-${color}-100/50 dark:from-${color}-900/30 dark:to-${color}-800/20`
    } border border-${color}-100 dark:border-${color}-800/30`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide mb-0.5">{label}</p>
        <p className="text-lg font-black text-gray-900 dark:text-white">{value}</p>
        {subtext && <p className="text-[9px] text-gray-500 mt-0.5">{subtext}</p>}
      </div>
      <div
        className={`w-10 h-10 rounded-xl bg-${color}-500/10 dark:bg-${color}-400/10 flex items-center justify-center`}
      >
        <Icon size={20} className={`text-${color}-600 dark:text-${color}-400`} />
      </div>
    </div>
  </motion.div>
));
QuickStatCard.displayName = "QuickStatCard";

const PackageCard = memo(({ pkg, isSelected, onSelect }) => (
  <motion.div
    layout
    whileTap={{ scale: 0.98 }}
    onClick={() => onSelect(pkg.id || pkg._id)}
    className={`bg-white dark:bg-gray-900 p-4 rounded-2xl border-2 transition-all shadow-sm ${
      isSelected ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-gray-100 dark:border-gray-800"
    } ${pkg.isPopular ? "ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-black" : ""}`}
  >
    {pkg.isPopular && (
      <div className="flex justify-center -mt-7 mb-3">
        <span className="px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black rounded-full flex items-center gap-1.5 shadow-lg">
          <Sparkles size={12} />
          Most Popular
        </span>
      </div>
    )}
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1 pr-3">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{pkg.name}</h4>
        {pkg.duration && (
          <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
            <Clock size={10} />
            {pkg.duration}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        {pkg.originalPrice && (
          <p className="text-[10px] text-gray-400 line-through">₹{Number(pkg.originalPrice).toLocaleString("en-IN")}</p>
        )}
        <p className="text-xl font-black text-blue-600 dark:text-blue-400">
          ₹{Number(pkg.price).toLocaleString("en-IN")}
        </p>
        {pkg.savingsPercentage > 0 && (
          <span className="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-[9px] font-bold rounded-full mt-1">
            Save {pkg.savingsPercentage}%
          </span>
        )}
      </div>
    </div>
    {pkg.features?.length > 0 && (
      <div className="space-y-1.5 mb-3 py-3 border-t border-gray-100 dark:border-gray-800">
        {pkg.features.slice(0, 4).map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <CheckCircle size={12} className="text-green-500 shrink-0 mt-0.5" />
            <span className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">{feature}</span>
          </div>
        ))}
        {pkg.features.length > 4 && (
          <p className="text-[10px] text-blue-500 font-semibold pl-5">+{pkg.features.length - 4} more included</p>
        )}
      </div>
    )}
    {pkg.notIncluded?.length > 0 && (
      <div className="mb-3">
        {pkg.notIncluded.slice(0, 2).map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2 opacity-60">
            <X size={11} className="text-gray-400 shrink-0" />
            <span className="text-[10px] text-gray-400 line-through">{feature}</span>
          </div>
        ))}
      </div>
    )}
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
        isSelected
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {isSelected ? "✓ Selected" : "Select Package"}
    </motion.button>
  </motion.div>
));
PackageCard.displayName = "PackageCard";

const CategorySpecificSection = memo(({ vendor, formatPrice }) => {
  const category = vendor.category;
  if (!category) return null;

  const renderContent = () => {
    switch (category) {
      case "venues":
        return (
          <div className="space-y-4">
            {(vendor.seating?.min || vendor.seating?.max || vendor.floating?.min || vendor.floating?.max) && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Users size={16} className="text-blue-500" />
                  Capacity Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {(vendor.seating?.min || vendor.seating?.max) && (
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Seating Capacity</p>
                      <p className="text-lg font-black text-blue-700 dark:text-blue-400">
                        {vendor.seating?.min || 0} - {vendor.seating?.max || 0}
                      </p>
                      <p className="text-[9px] text-gray-500">guests</p>
                    </div>
                  )}
                  {(vendor.floating?.min || vendor.floating?.max) && (
                    <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Floating Capacity</p>
                      <p className="text-lg font-black text-purple-700 dark:text-purple-400">
                        {vendor.floating?.min || 0} - {vendor.floating?.max || 0}
                      </p>
                      <p className="text-[9px] text-gray-500">guests</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {(vendor.halls || vendor.rooms?.count || vendor.parking?.capacity) && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Building2 size={16} className="text-green-500" />
                  Venue Facilities
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {vendor.halls && <QuickStatCard icon={Building2} label="Halls" value={vendor.halls} color="green" />}
                  {vendor.rooms?.count && (
                    <QuickStatCard icon={Building} label="Rooms" value={vendor.rooms.count} color="blue" />
                  )}
                  {vendor.parking?.capacity && (
                    <QuickStatCard
                      icon={Car}
                      label="Parking"
                      value={vendor.parking.capacity}
                      subtext={vendor.parking.valet ? "Valet Available" : ""}
                      color="orange"
                    />
                  )}
                </div>
              </div>
            )}
            {vendor.areas?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-orange-500" />
                  Available Areas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.areas.map((area, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-[11px] font-semibold"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.foodPolicy && (
              <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <UtensilsCrossed size={18} className="text-amber-600" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Food Policy</p>
                  <p className="text-sm font-bold text-amber-700 dark:text-amber-400">{vendor.foodPolicy}</p>
                </div>
              </div>
            )}
          </div>
        );

      case "mehendi":
        return (
          <div className="space-y-4">
            {vendor.designs?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Palette size={16} className="text-amber-500" />
                  Design Styles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.designs
                    .filter((d) => !d.includes(",") && !d.includes("₹"))
                    .map((design, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-300 rounded-full text-[11px] font-semibold border border-amber-200 dark:border-amber-800"
                      >
                        {design}
                      </span>
                    ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <DollarSign size={16} className="text-green-500" />
                Pricing Details
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {vendor.pricePerHand && (
                  <QuickStatCard icon={Hand} label="Per Hand" value={formatPrice(vendor.pricePerHand)} color="green" />
                )}
                {vendor.bridalPackagePrice && (
                  <QuickStatCard
                    icon={Crown}
                    label="Bridal Package"
                    value={formatPrice(vendor.bridalPackagePrice)}
                    color="pink"
                  />
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Info size={16} className="text-blue-500" />
                Service Details
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {vendor.teamSize && (
                  <InfoChip icon={Users} label="Team Size" value={`${vendor.teamSize}+ Artists`} color="blue" />
                )}
                {vendor.dryingTime && (
                  <InfoChip icon={Clock} label="Drying Time" value={vendor.dryingTime} color="purple" />
                )}
              </div>
              <div className="mt-3 space-y-2">
                {vendor.organic && (
                  <div className="flex items-center gap-2 p-2.5 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <Leaf size={14} className="text-green-500" />
                    <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">100% Organic Henna</span>
                    <CheckCircle size={12} className="text-green-500 ml-auto" />
                  </div>
                )}
                {vendor.travelToVenue && (
                  <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <MapPin size={14} className="text-blue-500" />
                    <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                      Travel to Venue Available
                    </span>
                    <CheckCircle size={12} className="text-green-500 ml-auto" />
                  </div>
                )}
                {vendor.colorGuarantee && (
                  <div className="flex items-center gap-2 p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <Droplets size={14} className="text-amber-500" />
                    <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                      {vendor.colorGuarantee}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "photographers":
        return (
          <div className="space-y-4">
            {vendor.services?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Camera size={16} className="text-purple-500" />
                  Photography Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.services.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-[11px] font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.deliverables?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Package size={16} className="text-blue-500" />
                  Deliverables
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.deliverables.map((d, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-[11px] font-semibold"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Info size={16} className="text-gray-500" />
                Service Info
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {vendor.deliveryTime && (
                  <QuickStatCard icon={Clock} label="Delivery" value={`${vendor.deliveryTime} weeks`} color="blue" />
                )}
                {vendor.teamSize && <QuickStatCard icon={Users} label="Team" value={vendor.teamSize} color="purple" />}
                {vendor.travelCost && (
                  <QuickStatCard icon={MapPin} label="Travel" value={vendor.travelCost} color="green" />
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {vendor.videographyIncluded && (
                  <div className="flex items-center gap-2 p-2.5 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                    <Video size={14} className="text-pink-500" />
                    <span className="text-[11px] font-medium">Videography</span>
                    <CheckCircle size={12} className="text-green-500 ml-auto" />
                  </div>
                )}
                {vendor.droneAvailable && (
                  <div className="flex items-center gap-2 p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <Camera size={14} className="text-indigo-500" />
                    <span className="text-[11px] font-medium">Drone</span>
                    <CheckCircle size={12} className="text-green-500 ml-auto" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "planners":
        return (
          <div className="space-y-4">
            {vendor.specializations?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Star size={16} className="text-indigo-500" />
                  Specializations
                </h4>
                <div className="space-y-2">
                  {vendor.specializations.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl"
                    >
                      <CheckCircle size={14} className="text-indigo-500" />
                      <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {vendor.eventsManaged?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-green-500" />
                  Events Managed
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.eventsManaged.map((e, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-[11px] font-semibold"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users size={16} className="text-blue-500" />
                Team & Network
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {vendor.teamSize && <QuickStatCard icon={Users} label="Team" value={vendor.teamSize} color="blue" />}
                {vendor.vendorNetwork && (
                  <QuickStatCard icon={Globe} label="Network" value={`${vendor.vendorNetwork}+`} color="purple" />
                )}
                {vendor.feeStructure && (
                  <QuickStatCard icon={DollarSign} label="Fee" value={vendor.feeStructure} color="green" />
                )}
              </div>
            </div>
            {vendor.budgetRange && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <DollarSign size={16} className="text-green-500" />
                  Budget Range
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">From</p>
                    <p className="text-lg font-black text-green-700 dark:text-green-400">
                      {formatPrice(vendor.budgetRange.min)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Up To</p>
                    <p className="text-lg font-black text-blue-700 dark:text-blue-400">
                      {formatPrice(vendor.budgetRange.max)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {vendor.destinationWeddings !== undefined && (
              <div
                className={`p-3 rounded-xl flex items-center gap-3 ${
                  vendor.destinationWeddings
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                {vendor.destinationWeddings ? (
                  <CheckCircle size={18} className="text-green-500" />
                ) : (
                  <X size={18} className="text-gray-400" />
                )}
                <div>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-white">Destination Weddings</p>
                  <p className="text-[9px] text-gray-500">
                    {vendor.destinationWeddings ? "Available" : "Not Available"}
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case "makeup":
        return (
          <div className="space-y-4">
            {vendor.services?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Paintbrush2 size={16} className="text-pink-500" />
                  Makeup Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.services.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-full text-[11px] font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.brandsUsed?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Award size={16} className="text-purple-500" />
                  Premium Brands
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.brandsUsed.map((b, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-[11px] font-semibold"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.trialPolicy && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" />
                  Trial Policy
                </h4>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      size={16}
                      className={vendor.trialPolicy.available ? "text-green-500" : "text-gray-400"}
                    />
                    <span className="text-[11px] font-medium">
                      {vendor.trialPolicy.available ? "Trial Available" : "No Trial"}
                    </span>
                  </div>
                  {vendor.trialPolicy.available && vendor.trialPolicy.paid && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold">
                      ₹{vendor.trialPolicy.price}
                    </span>
                  )}
                  {vendor.trialPolicy.available && !vendor.trialPolicy.paid && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold">Free</span>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case "catering":
        return (
          <div className="space-y-4">
            {vendor.cuisines?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <UtensilsCrossed size={16} className="text-orange-500" />
                  Cuisines
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.cuisines.map((c, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-[11px] font-semibold"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.menuTypes?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-green-500" />
                  Menu Types
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.menuTypes.map((m, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-[11px] font-semibold"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users size={16} className="text-blue-500" />
                Capacity & Pricing
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {(vendor.minCapacity || vendor.maxCapacity) && (
                  <QuickStatCard
                    icon={Users}
                    label="Capacity"
                    value={`${vendor.minCapacity || 50}-${vendor.maxCapacity || 1000}`}
                    color="blue"
                  />
                )}
                {vendor.liveCounters && (
                  <QuickStatCard icon={Flame} label="Live Counters" value="Available" color="red" />
                )}
              </div>
              {vendor.pricePerPlate && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {vendor.pricePerPlate.veg && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                      <p className="text-[9px] text-gray-500 uppercase font-bold">Veg Plate</p>
                      <p className="text-lg font-black text-green-700">₹{vendor.pricePerPlate.veg}</p>
                    </div>
                  )}
                  {vendor.pricePerPlate.nonVeg && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
                      <p className="text-[9px] text-gray-500 uppercase font-bold">Non-Veg Plate</p>
                      <p className="text-lg font-black text-red-700">₹{vendor.pricePerPlate.nonVeg}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case "djs":
        return (
          <div className="space-y-4">
            {vendor.genres?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Music size={16} className="text-purple-500" />
                  Music Genres
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.genres.map((g, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-[11px] font-semibold"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Info size={16} className="text-blue-500" />
                Performance Details
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {vendor.performanceDuration && (
                  <QuickStatCard icon={Clock} label="Duration" value={vendor.performanceDuration} color="blue" />
                )}
                {vendor.soundSystemPower && (
                  <QuickStatCard icon={Zap} label="Sound" value={vendor.soundSystemPower} color="orange" />
                )}
                {vendor.setupTime && (
                  <QuickStatCard icon={Timer} label="Setup" value={vendor.setupTime} color="green" />
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {vendor.equipmentProvided && (
                  <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Mic2 size={14} className="text-blue-500" />
                    <span className="text-[11px] font-medium">Equipment Provided</span>
                  </div>
                )}
                {vendor.lightingIncluded && (
                  <div className="flex items-center gap-2 p-2.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                    <Zap size={14} className="text-yellow-500" />
                    <span className="text-[11px] font-medium">Lighting Included</span>
                  </div>
                )}
                {vendor.backupAvailable && (
                  <div className="flex items-center gap-2 p-2.5 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <Shield size={14} className="text-green-500" />
                    <span className="text-[11px] font-medium">Backup Available</span>
                  </div>
                )}
                {vendor.emceeServices && (
                  <div className="flex items-center gap-2 p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <Mic2 size={14} className="text-purple-500" />
                    <span className="text-[11px] font-medium">Emcee Services</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const content = renderContent();
  if (!content) return null;

  const categoryConfig = CATEGORY_CONFIG[category] || { label: category, icon: FileText, color: "gray" };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-9 h-9 rounded-xl bg-${categoryConfig.color}-100 dark:bg-${categoryConfig.color}-900/30 flex items-center justify-center`}
        >
          <categoryConfig.icon
            size={18}
            className={`text-${categoryConfig.color}-600 dark:text-${categoryConfig.color}-400`}
          />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{categoryConfig.label} Details</h3>
          <p className="text-[10px] text-gray-500">Category-specific information</p>
        </div>
      </div>
      {content}
    </div>
  );
});
CategorySpecificSection.displayName = "CategorySpecificSection";

const CollapsibleSection = memo(
  ({ title, icon: Icon, iconColor, iconBg, children, defaultOpen = true, badge, badgeColor = "blue" }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
      <motion.div
        layout
        className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full p-4 flex items-center justify-between text-left active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors"
          whileTap={{ scale: 0.995 }}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  iconBg || "bg-blue-50 dark:bg-blue-900/20"
                }`}
              >
                <Icon className={iconColor || "text-blue-500"} size={18} />
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
              {badge && (
                <span className={`text-[9px] font-semibold text-${badgeColor}-600 dark:text-${badgeColor}-400`}>
                  {badge}
                </span>
              )}
            </div>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25, ease: "easeInOut" }}>
            <ChevronDown size={18} className="text-gray-400" />
          </motion.div>
        </motion.button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={collapseVariants}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <div className="px-4 pb-4">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);
CollapsibleSection.displayName = "CollapsibleSection";

const CategoryHighlights = memo(({ vendor }) => {
  const category = vendor.category;
  if (!category) return null;

  const renderHighlights = () => {
    switch (category) {
      case "mehendi":
        return (
          <div className="grid grid-cols-2 gap-2">
            {vendor.designs?.length > 0 && (
              <InfoChip
                icon={Palette}
                label="Styles"
                value={`${vendor.designs.filter((d) => !d.includes(",") && !d.includes("₹")).length}+ Designs`}
                color="amber"
              />
            )}
            {vendor.teamSize && (
              <InfoChip icon={Users} label="Team Size" value={`${vendor.teamSize}+ Artists`} color="blue" />
            )}
            {vendor.pricePerHand && (
              <InfoChip icon={Hand} label="Price/Hand" value={formatPrice(vendor.pricePerHand)} color="green" />
            )}
            {vendor.bridalPackagePrice && (
              <InfoChip
                icon={Crown}
                label="Bridal Package"
                value={formatPrice(vendor.bridalPackagePrice)}
                color="pink"
              />
            )}
            {vendor.organic && (
              <div className="col-span-2 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-800/30 flex items-center justify-center">
                  <Leaf size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-green-700 dark:text-green-400">100% Organic Henna</p>
                  <p className="text-[9px] text-green-600/70">Natural, chemical-free & skin-safe</p>
                </div>
                <CheckCircle size={16} className="text-green-500 ml-auto" />
              </div>
            )}
            {/* {vendor.travelToVenue && (
              <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <MapPin size={14} className="text-blue-500" />
                <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">Travel to Venue</span>
                <CheckCircle size={12} className="text-green-500 ml-auto" />
              </div>
            )} */}
          </div>
        );
      case "venues":
        return (
          <div className="grid grid-cols-2 gap-2">
            {vendor.seating && (
              <InfoChip
                icon={Users}
                label="Seating"
                value={`${vendor.seating.min || 0}-${vendor.seating.max || 0}`}
                color="blue"
              />
            )}
            {vendor.floating && (
              <InfoChip
                icon={Users}
                label="Floating"
                value={`${vendor.floating.min || 0}-${vendor.floating.max || 0}`}
                color="purple"
              />
            )}
            {vendor.halls && <InfoChip icon={Building2} label="Halls" value={vendor.halls} color="green" />}
            {vendor.parking?.capacity && (
              <InfoChip icon={Car} label="Parking" value={`${vendor.parking.capacity} spots`} color="orange" />
            )}
          </div>
        );
      case "photographers":
        return (
          <div className="grid grid-cols-2 gap-2">
            {vendor.teamSize && (
              <InfoChip icon={Users} label="Team" value={`${vendor.teamSize} members`} color="purple" />
            )}
            {vendor.deliveryTime && (
              <InfoChip icon={Clock} label="Delivery" value={`${vendor.deliveryTime} weeks`} color="blue" />
            )}
            {vendor.videographyIncluded && <InfoChip icon={Video} label="Video" value="Included" color="pink" />}
            {vendor.droneAvailable && <InfoChip icon={Camera} label="Drone" value="Available" color="green" />}
          </div>
        );
      case "catering":
        return (
          <div className="grid grid-cols-2 gap-2">
            {vendor.cuisines?.length > 0 && (
              <InfoChip
                icon={UtensilsCrossed}
                label="Cuisines"
                value={`${vendor.cuisines.length}+ types`}
                color="orange"
              />
            )}
            {(vendor.minCapacity || vendor.maxCapacity) && (
              <InfoChip
                icon={Users}
                label="Capacity"
                value={`${vendor.minCapacity || 50}-${vendor.maxCapacity || 1000}`}
                color="blue"
              />
            )}
            {vendor.pricePerPlate?.veg && (
              <InfoChip icon={Utensils} label="Veg Plate" value={formatPrice(vendor.pricePerPlate.veg)} color="green" />
            )}
            {vendor.liveCounters && <InfoChip icon={Flame} label="Live Counters" value="Available" color="red" />}
          </div>
        );
      case "djs":
        return (
          <div className="grid grid-cols-2 gap-2">
            {vendor.genres?.length > 0 && (
              <InfoChip icon={Music} label="Genres" value={`${vendor.genres.length}+ styles`} color="purple" />
            )}
            {vendor.performanceDuration && (
              <InfoChip icon={Clock} label="Duration" value={vendor.performanceDuration} color="blue" />
            )}
            {vendor.soundSystemPower && (
              <InfoChip icon={Mic2} label="Sound" value={vendor.soundSystemPower} color="orange" />
            )}
            {vendor.lightingIncluded && <InfoChip icon={Zap} label="Lighting" value="Included" color="yellow" />}
          </div>
        );
      case "makeup":
        return (
          <div className="grid grid-cols-2 gap-2">
            {vendor.services?.length > 0 && (
              <InfoChip icon={Paintbrush2} label="Services" value={`${vendor.services.length}+ types`} color="pink" />
            )}
            {vendor.brandsUsed?.length > 0 && (
              <InfoChip icon={Award} label="Brands" value={`${vendor.brandsUsed.length}+ premium`} color="purple" />
            )}
            {vendor.travelToVenue && <InfoChip icon={MapPin} label="Travel" value="Available" color="blue" />}
            {vendor.trialPolicy?.available && (
              <InfoChip
                icon={Calendar}
                label="Trial"
                value={vendor.trialPolicy.paid ? `₹${vendor.trialPolicy.price}` : "Free"}
                color="green"
              />
            )}
          </div>
        );
      case "planners":
        return (
          <div className="grid grid-cols-2 gap-2">
            {vendor.teamSize && (
              <InfoChip icon={Users} label="Team" value={`${vendor.teamSize} members`} color="indigo" />
            )}
            {vendor.vendorNetwork && (
              <InfoChip icon={Globe} label="Network" value={`${vendor.vendorNetwork}+ vendors`} color="purple" />
            )}
            {vendor.feeStructure && (
              <InfoChip icon={DollarSign} label="Fee Type" value={vendor.feeStructure} color="green" />
            )}
            {vendor.destinationWeddings && (
              <InfoChip icon={MapPin} label="Destination" value="Available" color="blue" />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const content = renderHighlights();
  if (!content) return null;

  const categoryConfig = CATEGORY_CONFIG[category] || { label: category, icon: FileText, color: "gray" };

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-8 h-8 rounded-lg bg-${categoryConfig.color}-100 dark:bg-${categoryConfig.color}-900/30 flex items-center justify-center`}
        >
          <categoryConfig.icon
            size={16}
            className={`text-${categoryConfig.color}-600 dark:text-${categoryConfig.color}-400`}
          />
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{categoryConfig.label} Highlights</h3>
      </div>
      {content}
    </motion.div>
  );
});
CategoryHighlights.displayName = "CategoryHighlights";

const SocialLinksSection = memo(({ socialLinks }) => {
  if (!socialLinks || !Object.values(socialLinks).some(Boolean)) return null;

  const links = [
    { key: "website", icon: Globe, label: "Website", color: "gray", bg: "bg-gray-100 dark:bg-gray-800" },
    {
      key: "instagram",
      icon: Instagram,
      label: "Instagram",
      color: "pink",
      bg: "bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30",
    },
    { key: "facebook", icon: Facebook, label: "Facebook", color: "blue", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { key: "youtube", icon: Youtube, label: "YouTube", color: "red", bg: "bg-red-100 dark:bg-red-900/30" },
    { key: "twitter", icon: Twitter, label: "Twitter", color: "sky", bg: "bg-sky-100 dark:bg-sky-900/30" },
    { key: "linkedin", icon: Linkedin, label: "LinkedIn", color: "blue", bg: "bg-blue-100 dark:bg-blue-900/30" },
  ].filter((l) => socialLinks[l.key]);

  if (links.length === 0) return null;

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Globe size={16} className="text-indigo-600" />
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Connect With Us</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <motion.a
            key={link.key}
            href={socialLinks[link.key]}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 ${link.bg} rounded-xl flex items-center gap-2 transition-shadow hover:shadow-md`}
          >
            <link.icon size={18} className={`text-${link.color}-600`} />
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{link.label}</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
});
SocialLinksSection.displayName = "SocialLinksSection";

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

const ReviewsDrawer = ({ isOpen, onClose, reviewsData }) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  // Extract data from the new structure
  const reviews = reviewsData?.data?.reviews || [];
  const stats = reviewsData?.data?.stats || {
    averageRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  // Calculate percentage for rating bars
  const getPercentage = (rating) => {
    if (stats.totalReviews === 0) return 0;
    return ((stats.distribution[rating] || 0) / stats.totalReviews) * 100;
  };

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
        {/* Header with Stats */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-5 pt-3 pb-4 border-b border-gray-100 dark:border-gray-800 z-10">
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

          {/* Rating Summary */}
          <div className="flex items-center gap-4 mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl">
            <div className="text-center">
              <span className="text-4xl font-black text-gray-900 dark:text-white">
                {stats.averageRating.toFixed(1)}
              </span>
              <div className="flex mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= Math.round(stats.averageRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3">{rating}</span>
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                      style={{ width: `${getPercentage(rating)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{stats.distribution[rating] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="overflow-y-auto max-h-[calc(88vh-220px)] p-5 space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
            </div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 space-y-3"
              >
                {/* User Info and Rating */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 flex-shrink-0">
                      <SmartMedia
                        src={review.userAvatar}
                        type="image"
                        className="w-full h-full object-cover"
                        loaderImage="/GlowLoadingGif.gif"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">
                        {review.userName || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        className={
                          star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-600"
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Review Title */}
                {review.title && (
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{review.title}</h4>
                )}

                {/* Review Text */}
                {review.text && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{review.text}</p>
                )}
              </motion.div>
            ))
          )}
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
  console.log("ShareModal rendered with isOpen:", isOpen);

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
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end"
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

const PostOptionsDrawer = ({ isOpen, onClose, post, onDelete, onShare, onEdit, onArchive }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post?.caption || "");
  useBodyScrollLock(isOpen);

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
    onClose();
  };

  const handleEdit = () => {
    onEdit?.(editedCaption);
    setShowEditModal(false);
    onClose();
  };

  const handleArchive = () => {
    onArchive?.();
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
    { id: "edit", label: "Edit Caption", icon: Type, action: () => setShowEditModal(true) },
    { id: "archive", label: "Archive", icon: Bookmark, action: handleArchive },
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
          {showEditModal ? (
            <motion.div
              key="edit-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Caption</h3>
              </div>
              <textarea
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white resize-none outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Write a caption..."
              />
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowEditModal(false);
                    setEditedCaption(post?.caption || "");
                  }}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="flex-1 py-3 bg-blue-500 rounded-xl font-semibold text-white"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          ) : showDeleteConfirm ? (
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
  const { id, category } = useParams();
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
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

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
  const [activeDetailsTab, setActiveDetailsTab] = useState("overview");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [archivedPosts, setArchivedPosts] = useState([]);
  const longPressTimerRef = useRef(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

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

  useEffect(() => {
    const handleFetchReviews = async () => {
      try {
        const res = await fetch(`/api/vendor/${id}/reviews`);
        const data = await res.json();

        if (data.success) {
          setReviews(data.data.reviews);
        }
      } catch (error) {
        console.error("Error logging profile visit:", error);
      }
    };
    handleFetchReviews();
  }, []);

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

  const handleEditPost = useCallback(
    (postId, newCaption) => {
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, caption: newCaption } : p)));
      showUIConfirmation("Caption updated", "success", Check);
    },
    [showUIConfirmation]
  );

  const handleArchivePost = useCallback(
    (postId) => {
      const postToArchive = posts.find((p) => p.id === postId);
      if (postToArchive) {
        setArchivedPosts((prev) => [...prev, postToArchive]);
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setSelectedPost(null);
        showUIConfirmation("Post archived", "success", Bookmark);
      }
    },
    [posts, showUIConfirmation]
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

  const TAB_CONFIG = useMemo(() => {
    const tabs = [
      { id: "overview", label: "Overview", icon: Home },
      {
        id: "category",
        label: CATEGORY_CONFIG[vendor?.category]?.label || "Details",
        icon: CATEGORY_CONFIG[vendor?.category]?.icon || Layers,
        show: !!vendor?.category,
      },
      {
        id: "services",
        label: "Services & Awards",
        icon: Award,
        show: vendor?.amenities?.length > 0 || vendor?.facilities?.length > 0 || vendor?.awards?.length > 0,
      },
      { id: "packages", label: "Packages", icon: Gift, show: vendor?.packages?.length > 0 },
      {
        id: "insights",
        label: "Insights",
        icon: BarChart2,
        show: vendor?.highlights?.length > 0 || vendor?.stats?.length > 0,
      },
      { id: "faqs", label: "FAQs", icon: FileText, show: vendor?.faqs?.length > 0 },
      { id: "policies", label: "Policies", icon: Shield, show: vendor?.policies?.length > 0 },
      { id: "location", label: "Location", icon: MapPin },
    ];
    return tabs.filter((tab) => tab.show !== false);
  }, [vendor]);

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
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-3 gap-[3px] gap-y-[6px] mx-[15px]">
              {reels?.slice(0, 3)?.map((reel, index) => (
                <motion.div
                  key={reel.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedReelIndex(index)}
                  className="aspect-[9/10] bg-gray-100 dark:bg-gray-800 overflow-hidden relative cursor-pointer rounded-[10px]"
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
            <div>
              <ReviewSection vendorId={vendor?._id} vendorName={vendor?.name} />
            </div>
          </div>
        );

      case "services":
        return (
          <div className="p-4 space-y-4 pt-1">
            {/* TAB NAVIGATION */}
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-y border-gray-200 dark:border-gray-800 mb-0"
              >
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-3 py-2">
                  {TAB_CONFIG.map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveDetailsTab(tab.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${
                        activeDetailsTab === tab.id
                          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <tab.icon size={12} />
                      {tab.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* TAB CONTENT */}
            <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 px-4 py-6 pt-[10px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDetailsTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="space-y-5"
                >
                  {/* OVERVIEW TAB */}
                  {activeDetailsTab === "overview" && (
                    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
                      {/* 1. Short Description */}
                      {vendor.shortDescription && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 dark:from-indigo-950/30 dark:via-blue-950/20 dark:to-slate-900/50 px-4 py-3 rounded-3xl shadow-sm border border-indigo-100/50 dark:border-indigo-900/30"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center shrink-0 ring-1 ring-indigo-200/50 dark:ring-indigo-800/50">
                              <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1 pt-1.5">
                              <p className="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic">
                                "{vendor.shortDescription}"
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 2. Pricing Details */}
                      {(vendor.basePrice || vendor.perDayPrice?.min) && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 flex items-center justify-center shadow-inner">
                              <IndianRupee size={20} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Pricing
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                Transparent pricing options
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            {/* Base Price */}
                            {vendor.basePrice && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-between p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/10 rounded-xl border border-emerald-200/60 dark:border-emerald-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white dark:bg-slate-700/50 rounded-xl shadow-sm border border-emerald-200 dark:border-emerald-600">
                                    <BadgeIndianRupee size={18} className="text-emerald-600 dark:text-emerald-400" />
                                  </div>
                                  <div>
                                    <span className="font-semibold text-[12px] text-slate-600 dark:text-slate-400 block">
                                      Base Price
                                    </span>
                                    <span className="font-medium text-[11px] text-slate-500 dark:text-slate-500">
                                      per {" " + vendor.priceUnit || "day"}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-[18px] text-emerald-600 dark:text-emerald-400">
                                    ₹{vendor.basePrice.toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </motion.div>
                            )}

                            {/* Per Day Price Range */}
                            {vendor.perDayPrice?.min && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.02 }}
                                className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-xl border border-blue-200/60 dark:border-blue-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white dark:bg-slate-700/50 rounded-xl shadow-sm border border-blue-200 dark:border-blue-600">
                                    <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <span className="font-semibold text-[12px] text-slate-600 dark:text-slate-400 block">
                                      Per {vendor.priceUnit} Rate
                                    </span>
                                    <span className="font-medium text-[11px] text-slate-500 dark:text-slate-500">
                                      {vendor.perDayPrice.max ? "Price range" : "Starting from"}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {vendor.perDayPrice.max ? (
                                    <div className="flex items-center gap-1">
                                      <span className="font-black text-[16px] text-blue-600 dark:text-blue-400">
                                        ₹{vendor.perDayPrice.min.toLocaleString("en-IN")}
                                      </span>
                                      <span className="font-bold text-[13px] text-slate-400 dark:text-slate-500">
                                        -
                                      </span>
                                      <span className="font-black text-[16px] text-blue-600 dark:text-blue-400">
                                        ₹{vendor.perDayPrice.max.toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="font-black text-[18px] text-blue-600 dark:text-blue-400">
                                      ₹{vendor.perDayPrice.min.toLocaleString("en-IN")}
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* 3. Category Specific Highlights */}
                      <CategoryHighlights vendor={vendor} />

                      {/* 4. Event Types Supported */}
                      {vendor.eventTypes?.length > 0 && (
                        <CollapsibleSection
                          title="Event Types We Serve"
                          icon={Calendar}
                          iconColor="text-emerald-600 dark:text-emerald-400"
                          iconBg="bg-gradient-to-br from-emerald-100 to-teal-100"
                          defaultOpen={true}
                          badge={`${vendor.eventTypes?.length} specialized categories`}
                          badgeColor="gray"
                        >
                          <div className="flex flex-wrap gap-2.5">
                            {vendor.eventTypes.map((type, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className="px-4 py-2.5 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 rounded-xl text-[12px] font-semibold flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                                {type}
                              </motion.span>
                            ))}
                          </div>
                        </CollapsibleSection>
                      )}

                      {/* 5. Operating Hours - Collapsed */}
                      {vendor.operatingHours && (
                        <CollapsibleSection
                          title="Operating Hours"
                          icon={Clock}
                          iconColor="text-blue-600 dark:text-blue-400"
                          iconBg="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40"
                          defaultOpen={false}
                          badge={`${vendor.operatingHours.length} schedules`}
                          badgeColor="blue"
                        >
                          <div className="space-y-2.5 mt-2">
                            {vendor?.operatingHours?.length > 0 ? (
                              vendor.operatingHours.length === 1 ? (
                                <div className="flex justify-between items-center py-3.5 px-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                                  <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                                    {vendor.operatingHours[0].day}
                                  </span>
                                  <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700/50 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
                                    {vendor.operatingHours[0].hours}
                                  </span>
                                </div>
                              ) : (
                                vendor.operatingHours.map((schedule, i) => (
                                  <div
                                    key={i}
                                    className="flex justify-between items-center py-3.5 px-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                                  >
                                    <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                                      {schedule.day}
                                    </span>
                                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700/50 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
                                      {schedule.hours}
                                    </span>
                                  </div>
                                ))
                              )
                            ) : (
                              <div className="py-3.5 px-4 text-[12px] text-slate-500 dark:text-slate-400 italic">
                                Operating hours not available
                              </div>
                            )}
                          </div>
                        </CollapsibleSection>
                      )}

                      {/* 6. Amenities */}
                      {vendor.amenities?.length > 0 && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 flex items-center justify-center shadow-inner">
                              <Check size={20} className="text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Amenities & Services
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                {vendor.amenities.length} premium facilities
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {vendor.amenities.map((item, idx) => {
                              const Icon = AMENITY_ICONS[item] || Check;
                              return (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.02 }}
                                  className="flex items-center gap-3 p-3.5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                                >
                                  <div className="p-2 bg-white dark:bg-slate-700/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600">
                                    <Icon size={16} className="text-slate-600 dark:text-slate-400" />
                                  </div>
                                  <span className="font-medium text-[11.5px] text-slate-700 dark:text-slate-300 leading-tight">
                                    {item}
                                  </span>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* 7. Why Choose Us */}
                      {vendor.highlightPoints?.length > 0 && (
                        <CollapsibleSection
                          title="Why Choose Us"
                          icon={BadgeCheck}
                          iconColor="text-amber-600 dark:text-amber-400"
                          iconBg="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40"
                          defaultOpen={true}
                          badge={`${vendor.highlightPoints?.length} unique advantages`}
                          badgeColor="gray"
                        >
                          <div className="space-y-3">
                            {vendor.highlightPoints.map((point, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-3.5 p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border-l-2 border-amber-400 dark:border-amber-500/50 shadow-sm"
                              >
                                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center shrink-0 shadow-sm">
                                  <Sparkles size={14} className="text-amber-600 dark:text-amber-400" />
                                </div>
                                <span className="text-[12.5px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                                  {point}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </CollapsibleSection>
                      )}

                      {/* 8. Special Offers - Collapsed */}
                      {vendor.specialOffers?.length > 0 && (
                        <CollapsibleSection
                          title="Special Offers"
                          icon={Percent}
                          iconColor="text-rose-600 dark:text-rose-400"
                          iconBg="bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40"
                          defaultOpen={false}
                          badge={`${vendor.specialOffers.length} active deals`}
                          badgeColor="rose"
                        >
                          <div className="space-y-3.5 mt-2">
                            {vendor.specialOffers.map((offer, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/10 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm relative overflow-hidden"
                              >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-2xl" />
                                <div className="relative">
                                  <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-2.5">
                                      <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-black rounded-xl shadow-md">
                                        {offer.discount}
                                      </span>
                                      <span className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                                        {offer.title}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                                    {offer.description}
                                  </p>
                                  {offer.validTill && (
                                    <div className="flex items-center gap-2 text-[10.5px] text-slate-500 dark:text-slate-500 bg-white/70 dark:bg-slate-800/50 px-3 py-2 rounded-xl w-fit shadow-sm border border-slate-200 dark:border-slate-700">
                                      <Clock size={12} />
                                      <span className="font-semibold">Valid till: {offer.validTill}</span>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CollapsibleSection>
                      )}

                      {/* 9. About Vendor - Full Description */}
                      {vendor.description && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center shadow-inner">
                              <Info size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                About {vendor.name}
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                Our story and mission
                              </p>
                            </div>
                          </div>
                          <div
                            className={`relative overflow-hidden transition-all duration-500 ease-out ${
                              showFullDescription ? "max-h-[2000px]" : "max-h-[150px]"
                            }`}
                          >
                            <p className="text-[12.5px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {vendor.description}
                            </p>
                            {!showFullDescription && (
                              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent " />
                            )}
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="mt-5 text-slate-700 dark:text-slate-300 font-semibold text-[12px] flex items-center gap-2 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 px-5 py-3 rounded-xl hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700/50 transition-all duration-200 shadow-sm border border-slate-200 dark:border-slate-700"
                          >
                            {showFullDescription ? "Show Less" : "Read Full Story"}
                            <motion.div
                              animate={{ rotate: showFullDescription ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={15} />
                            </motion.div>
                          </motion.button>
                        </motion.div>
                      )}

                      {/* 11. Social Links */}
                      <SocialLinksSection socialLinks={vendor.socialLinks} />
                    </motion.div>
                  )}

                  {/* CATEGORY-SPECIFIC TAB */}
                  {activeDetailsTab === "category" && (
                    <CategorySpecificSection vendor={vendor} formatPrice={formatPrice} />
                  )}

                  {/* SERVICES & AWARDS TAB */}
                  {activeDetailsTab === "services" && (
                    <div className="space-y-5">
                      {vendor.facilities?.length > 0 && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 flex items-center justify-center shadow-inner">
                              <Star size={20} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Premium Facilities
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                {vendor.facilities.length} exclusive features
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {vendor.facilities.map((facility, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3.5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                              >
                                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 flex items-center justify-center shrink-0 shadow-sm">
                                  <Star size={14} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300">
                                  {facility}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {vendor.awards?.length > 0 && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 flex items-center justify-center shadow-inner">
                              <Trophy size={20} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Awards & Recognition
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                {vendor.awards.length} prestigious honors
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3.5">
                            {vendor?.awards.map((award, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-4 p-4.5 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/20 dark:via-yellow-950/10 dark:to-orange-950/5 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 shadow-sm"
                              >
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 flex items-center justify-center shrink-0 shadow-md">
                                  <Trophy size={22} className="text-white" />
                                </div>
                                <div className="flex-1 pt-1">
                                  <p className="text-[12.5px] font-bold text-slate-800 dark:text-slate-100 leading-relaxed mb-1">
                                    {award.title}
                                  </p>
                                  {award.year && (
                                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                                      {award.year}
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {vendor.amenities?.length > 0 && (
                        <CollapsibleSection
                          title="Complete Amenities List"
                          icon={Check}
                          iconColor="text-blue-600 dark:text-blue-400"
                          iconBg="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40"
                        >
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            {vendor.amenities.map((item, idx) => {
                              const Icon = AMENITY_ICONS[item] || Check;
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2.5 p-3 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                                >
                                  <Icon size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                                  <span className="font-medium text-[11px] text-slate-700 dark:text-slate-300">
                                    {item}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </CollapsibleSection>
                      )}
                    </div>
                  )}

                  {/* PACKAGES TAB */}
                  {activeDetailsTab === "packages" && (
                    <div className="space-y-5">
                      {vendor.packages?.length > 0 ? (
                        <>
                          {vendor.packages.map((pkg, i) => (
                            <motion.div
                              key={pkg._id || i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <PackageCard
                                pkg={pkg}
                                isSelected={selectedPackage === (pkg.id || pkg._id)}
                                onSelect={setSelectedPackage}
                              />
                            </motion.div>
                          ))}
                        </>
                      ) : (
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                            <Gift size={36} className="text-slate-400 dark:text-slate-500" />
                          </div>
                          <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-2">
                            No packages listed yet
                          </p>
                          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                            Contact the vendor directly for customized pricing and package options
                          </p>
                        </div>
                      )}

                      {vendor.paymentMethods?.length > 0 && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center shadow-inner">
                              <HandCoins size={20} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Payment Options
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                {vendor.paymentMethods.length} secure methods
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2.5">
                            {vendor.paymentMethods.map((method, i) => (
                              <span
                                key={i}
                                className="px-4 py-2.5 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/60 rounded-xl text-[12px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-sm"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                                {method}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Insights TAB */}
                  {activeDetailsTab === "insights" && (
                    <div className="space-y-3.5">
                      {/* 3. Highlights & Pros */}
                      {vendor.highlights?.length > 0 && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center shadow-inner">
                              <Sparkles size={20} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Key Highlights
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                {vendor.highlights.length} standout features
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            {vendor.highlights.map((highlight, idx) => {
                              const ICON_MAP = {
                                trophy: Trophy,
                                users: Users,
                                timer: Timer,
                                medal: Medal,
                                star: Star,
                                award: Award,
                                zap: Zap,
                                heart: Heart,
                                thumbsup: ThumbsUp,
                                trendingup: TrendingUp,
                              };
                              const key = highlight?.icon?.toLowerCase()?.replace(/\s+/g, "").replace(/_/g, "-");
                              const IconComponent = ICON_MAP[key] || Star;

                              const colorClass = highlight.color || "text-slate-600 dark:text-slate-400";

                              return (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.02 }}
                                  className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2 bg-white dark:bg-slate-700/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600">
                                      <IconComponent size={18} className={colorClass} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className="font-semibold text-[12px] text-slate-700 dark:text-slate-300 block truncate">
                                        {highlight.label}
                                      </span>
                                      {highlight.value && (
                                        <span className="font-medium text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                                          {highlight.value}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* 4. Performance Stats */}
                      {vendor.stats?.length > 0 && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center shadow-inner">
                              <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Performance Stats
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                Real-time metrics & growth
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            {vendor.stats.map((stat, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                className="p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-semibold text-[12px] text-slate-600 dark:text-slate-400">
                                    {stat.label}
                                  </span>
                                  {stat.trend && (
                                    <div
                                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        stat.positive
                                          ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                          : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                                      }`}
                                    >
                                      {stat.positive ? (
                                        <TrendingUp size={11} className="shrink-0" />
                                      ) : (
                                        <TrendingDown size={11} className="shrink-0" />
                                      )}
                                      <span>{stat.trend}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-baseline gap-2">
                                  <span className="font-black text-[24px] text-slate-800 dark:text-slate-100">
                                    {stat.value}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* FAQS TAB */}
                  {activeDetailsTab === "faqs" && (
                    <div className="space-y-3.5">
                      {vendor.faqs?.length > 0 ? (
                        vendor.faqs.map((faq, idx) => (
                          <motion.div
                            key={`faq-${idx}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 relative"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                console.log("Clicked FAQ:", idx, "Current expanded:", expandedFaq);
                                setExpandedFaq((prev) => {
                                  console.log("Setting from", prev, "to", prev === idx ? null : idx);
                                  return prev === idx ? null : idx;
                                });
                              }}
                              className="w-full p-5 flex items-start justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-200 cursor-pointer relative z-10"
                            >
                              <div className="flex items-start gap-4 flex-1 pr-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center shrink-0 shadow-sm">
                                  <span className="text-blue-600 dark:text-blue-400 font-bold text-[13px]">Q</span>
                                </div>
                                <span className="font-bold text-[13px] text-slate-800 dark:text-slate-100 leading-relaxed pt-1.5">
                                  {faq.question}
                                </span>
                              </div>
                              <div className="shrink-0">
                                <ChevronDown
                                  size={20}
                                  className={`text-slate-400 dark:text-slate-500 mt-1.5 transition-transform duration-200 ${
                                    expandedFaq === idx ? "rotate-180" : "rotate-0"
                                  }`}
                                />
                              </div>
                            </button>
                            <AnimatePresence initial={false}>
                              {expandedFaq === idx && (
                                <motion.div
                                  key={`answer-${idx}`}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                >
                                  <div className="px-5 pb-5 pt-0">
                                    <div className="flex items-start gap-4 p-4.5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center shrink-0 shadow-sm">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[13px]">
                                          A
                                        </span>
                                      </div>
                                      <p className="text-[12.5px] text-slate-700 dark:text-slate-300 leading-relaxed pt-1.5">
                                        {faq.answer}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))
                      ) : (
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                            <FileText size={36} className="text-slate-400 dark:text-slate-500" />
                          </div>
                          <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-2">
                            No FAQs available yet
                          </p>
                          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                            Have questions? Feel free to contact the vendor directly for any inquiries
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* POLICIES TAB */}
                  {activeDetailsTab === "policies" && (
                    <div className="space-y-5">
                      {vendor.policies?.length > 0 ? (
                        vendor.policies.map((policy, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                          >
                            <div className="flex items-start gap-4 mb-5">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 flex items-center justify-center shrink-0 shadow-sm">
                                <Shield size={22} className="text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div className="flex-1 pt-1">
                                <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 mb-2 tracking-tight">
                                  {policy.title}
                                </h4>
                                <p className="text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                  {policy.content}
                                </p>
                              </div>
                            </div>
                            {policy.details?.length > 0 && (
                              <div className="space-y-2.5 ml-16">
                                {policy.details.map((detail, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                                  >
                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center shrink-0 shadow-sm">
                                      <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="text-[11.5px] text-slate-700 dark:text-slate-300 font-medium">
                                      {detail}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        ))
                      ) : (
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                            <Shield size={36} className="text-slate-400 dark:text-slate-500" />
                          </div>
                          <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-2">
                            No policies listed yet
                          </p>
                          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                            Contact the vendor directly for detailed terms, conditions, and policies
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* LOCATION TAB */}
                  {activeDetailsTab === "location" && (
                    <div className="space-y-5">
                      <motion.div
                        variants={fadeInUp}
                        className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                      >
                        <div className="flex gap-4 mb-6">
                          <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 shadow-sm">
                            <MapPin size={26} />
                          </div>
                          <div className="flex-1 pt-1">
                            <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-2.5 tracking-tight">
                              Complete Address
                            </h4>
                            <p className="text-[12.5px] text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                              {vendor.address?.street}
                            </p>
                            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
                              {vendor.address?.city}, {vendor.address?.state} {vendor.address?.postalCode}
                            </p>
                            {vendor.address?.country && (
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                                {vendor.address.country}
                              </p>
                            )}
                          </div>
                        </div>
                        {vendor.address?.googleMapUrl && (
                          <motion.a
                            href={vendor.address.googleMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 text-white rounded-2xl font-bold text-[13px] flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Navigation size={19} />
                            Open in Google Maps
                            <ExternalLink size={16} />
                          </motion.a>
                        )}
                      </motion.div>

                      {vendor.landmarks?.length > 0 && (
                        <CollapsibleSection
                          title="Nearby Landmarks"
                          icon={Compass}
                          iconColor="text-blue-600 dark:text-blue-400"
                          iconBg="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40"
                        >
                          <div className="space-y-3 mt-2">
                            {vendor.landmarks.map((landmark, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 flex items-center justify-center shadow-sm">
                                    <MapPin size={15} className="text-indigo-600 dark:text-indigo-400" />
                                  </div>
                                  <span className="text-[12px] text-slate-700 dark:text-slate-300 font-semibold">
                                    {landmark.name}
                                  </span>
                                </div>
                                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-3.5 py-2 rounded-xl shadow-sm">
                                  {landmark.distance}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CollapsibleSection>
                      )}

                      {vendor.directions?.length > 0 && (
                        <CollapsibleSection
                          title="How to Reach"
                          icon={Route}
                          iconColor="text-emerald-600 dark:text-emerald-400"
                          iconBg="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40"
                        >
                          <div className="space-y-3.5 mt-2">
                            {vendor.directions.map((dir, i) => (
                              <div
                                key={i}
                                className="p-5 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 dark:from-slate-800/30 dark:via-slate-800/20 dark:to-slate-800/10 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                              >
                                <div className="flex items-center gap-3.5 mb-3">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center shadow-sm">
                                    {dir.type?.includes("Metro") ? (
                                      <MapIcon size={18} className="text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                      <Car size={18} className="text-emerald-600 dark:text-emerald-400" />
                                    )}
                                  </div>
                                  <p className="text-[12px] font-bold text-slate-800 dark:text-slate-100">{dir.type}</p>
                                </div>
                                <p className="text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed ml-13">
                                  {dir.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CollapsibleSection>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
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
            background: `radial-gradient(125% 125% at 50% 90%, #fff 40%, ${
              CATEGORY_GRADIENTS[category]?.to || "#7c3aed"
            } 100%)`,
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
              <motion.div
                initial={false}
                animate={{ height: isBioExpanded ? "auto" : "4.5rem" }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="relative overflow-hidden"
              >
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-6 whitespace-pre-line">
                  {profile.bio ? formatBio(profile.bio) : formatBio(defaultBio)}
                </p>
                {/* {!isBioExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none" />
                )} */}
              </motion.div>
              {(profile.bio || defaultBio)?.length > 120 && (
                <button
                  onClick={() => setIsBioExpanded(!isBioExpanded)}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mt-1 font-medium"
                >
                  {isBioExpanded ? "See less" : "See more"}
                </button>
              )}
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
      <div className="sticky top-14 z-30 bg-white dark:bg-gray-900 border-b border-gray-200/80 dark:border-gray-800/80 mb-1 rounded-[5px]">
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
            onEdit={handleEditPost}
            onArchive={handleArchivePost}
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
          <ReviewsDrawer isOpen={showReviewsDrawer} onClose={() => setShowReviewsDrawer(false)} reviews={reviews} />
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
