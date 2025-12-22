"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  ClipboardList,
  Camera,
  Music,
  Utensils,
  Building,
  Palette,
  Scissors,
  Crown,
  Flower2,
  Gift,
  Star,
  Heart,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Check,
  Plus,
  Trash2,
  Clock,
  Edit2,
  Edit3,
  Bell,
  Share2,
  X,
  Bookmark,
  Quote,
  HelpCircle,
  MessageCircle,
  Phone,
  Sparkles,
  ArrowRight,
  ArrowUp,
  Verified,
  PieChart,
  TrendingUp,
  Loader2,
  Play,
  ExternalLink,
  AlertCircle,
  Info,
  CalendarDays,
  PartyPopper,
  Cake,
  GlassWater,
  Gem,
  BadgeCheck,
  CircleCheck,
  XCircle,
  RefreshCw,
  Image as ImageIcon,
  ZoomIn,
  Download,
  ChevronUp,
} from "lucide-react";

// Original Components
import HeroSection from "@/components/mobile/ui/EventsPage/HeroSection";
import Banner1 from "@/components/mobile/ui/EventsPage/Banner1";
import HowItWorksSection from "@/components/mobile/ui/EventsPage/HowItWorks";

// =============================================================================
// CONSTANTS & THEME CONFIG
// =============================================================================

const CATEGORY_THEMES = {
  wedding: {
    name: "Wedding",
    emoji: "💒",
    primary: "#1e40af", // blue-800
    primaryLight: "#3b82f6", // blue-500
    primaryDark: "#1e3a8a", // blue-900
    secondary: "#dbeafe", // blue-100
    secondaryDark: "#bfdbfe", // blue-200
    gradient: "from-blue-50/60 via-white to-blue-50/60",
    gradientDark: "from-gray-900 via-blue-950/20 to-gray-900",
    glowColor: "rgba(30, 64, 175, 0.15)",
    accentGradient: "from-blue-600 to-blue-800",
    cardBg: "bg-gradient-to-br from-blue-50/80 to-blue-100/50",
    tagline: "Create Your Dream Wedding",
    description: "Plan every magical moment of your special day",
    patterns: ["💐", "💍", "🥂", "💒", "👰", "🤵"],
    textClass: "text-blue-800",
    bgLight: "bg-blue-50",
    bgMedium: "bg-blue-100",
    borderColor: "border-blue-200",
    ringColor: "ring-blue-500",
  },
  anniversary: {
    name: "Anniversary",
    emoji: "💝",
    primary: "#be185d", // pink-700
    primaryLight: "#ec4899", // pink-500
    primaryDark: "#9d174d", // pink-800
    secondary: "#fce7f3", // pink-100
    secondaryDark: "#fbcfe8", // pink-200
    gradient: "from-pink-50/60 via-white to-pink-50/60",
    gradientDark: "from-gray-900 via-pink-950/20 to-gray-900",
    glowColor: "rgba(190, 24, 93, 0.15)",
    accentGradient: "from-pink-600 to-pink-800",
    cardBg: "bg-gradient-to-br from-pink-50/80 to-pink-100/50",
    tagline: "Celebrate Your Love Story",
    description: "Make your milestone moments unforgettable",
    patterns: ["💝", "🥂", "🌹", "💑", "🎁", "✨"],
    textClass: "text-pink-700",
    bgLight: "bg-pink-50",
    bgMedium: "bg-pink-100",
    borderColor: "border-pink-200",
    ringColor: "ring-pink-500",
  },
  birthday: {
    name: "Birthday",
    emoji: "🎂",
    primary: "#a16207", // yellow-700
    primaryLight: "#eab308", // yellow-500
    primaryDark: "#854d0e", // yellow-800
    secondary: "#fef9c3", // yellow-100
    secondaryDark: "#fef08a", // yellow-200
    gradient: "from-yellow-50/60 via-white to-amber-50/60",
    gradientDark: "from-gray-900 via-yellow-950/20 to-gray-900",
    glowColor: "rgba(161, 98, 7, 0.15)",
    accentGradient: "from-yellow-600 to-amber-700",
    cardBg: "bg-gradient-to-br from-yellow-50/80 to-amber-100/50",
    tagline: "Make It Extraordinary",
    description: "Turn your birthday into an epic celebration",
    patterns: ["🎂", "🎈", "🎉", "🎁", "🎊", "⭐"],
    textClass: "text-yellow-700",
    bgLight: "bg-yellow-50",
    bgMedium: "bg-yellow-100",
    borderColor: "border-yellow-200",
    ringColor: "ring-yellow-500",
  },
  default: {
    name: "Event",
    emoji: "🎉",
    primary: "#1e40af",
    primaryLight: "#3b82f6",
    primaryDark: "#1e3a8a",
    secondary: "#dbeafe",
    secondaryDark: "#bfdbfe",
    gradient: "from-blue-50/60 via-white to-blue-50/60",
    gradientDark: "from-gray-900 via-blue-950/20 to-gray-900",
    glowColor: "rgba(30, 64, 175, 0.15)",
    accentGradient: "from-blue-600 to-blue-800",
    cardBg: "bg-gradient-to-br from-blue-50/80 to-blue-100/50",
    tagline: "Plan Your Perfect Event",
    description: "Create unforgettable memories",
    patterns: ["🎉", "✨", "🎊", "🎁", "⭐", "💫"],
    textClass: "text-blue-800",
    bgLight: "bg-blue-50",
    bgMedium: "bg-blue-100",
    borderColor: "border-blue-200",
    ringColor: "ring-blue-500",
  },
};

// Alias for Default
CATEGORY_THEMES.Default = CATEGORY_THEMES.default;

const VENDOR_CATEGORIES_DATA = {
  wedding: [
    { id: "venues", label: "Venues", icon: Building, count: "500+", color: "#7c3aed" },
    { id: "photographers", label: "Photography", icon: Camera, count: "300+", color: "#db2777" },
    { id: "catering", label: "Catering", icon: Utensils, count: "250+", color: "#ea580c" },
    { id: "makeup", label: "Makeup", icon: Palette, count: "200+", color: "#e11d48" },
    { id: "djs", label: "Music & DJ", icon: Music, count: "150+", color: "#2563eb" },
    { id: "mehendi", label: "Mehendi", icon: Scissors, count: "100+", color: "#65a30d" },
    { id: "decor", label: "Decor", icon: Flower2, count: "180+", color: "#0d9488" },
    { id: "clothes", label: "Bridal Wear", icon: Crown, count: "220+", color: "#9333ea" },
  ],
  anniversary: [
    { id: "venues", label: "Venues", icon: Building, count: "300+", color: "#7c3aed" },
    { id: "photographers", label: "Photography", icon: Camera, count: "200+", color: "#db2777" },
    { id: "catering", label: "Catering", icon: Utensils, count: "180+", color: "#ea580c" },
    { id: "decor", label: "Decor", icon: Flower2, count: "120+", color: "#0d9488" },
    { id: "djs", label: "Music", icon: Music, count: "100+", color: "#2563eb" },
    { id: "gifts", label: "Gifts", icon: Gift, count: "80+", color: "#c026d3" },
  ],
  birthday: [
    { id: "venues", label: "Venues", icon: Building, count: "400+", color: "#7c3aed" },
    { id: "catering", label: "Catering", icon: Utensils, count: "220+", color: "#ea580c" },
    { id: "photographers", label: "Photography", icon: Camera, count: "180+", color: "#db2777" },
    { id: "djs", label: "DJ & Music", icon: Music, count: "150+", color: "#2563eb" },
    { id: "decor", label: "Decor", icon: Flower2, count: "130+", color: "#0d9488" },
    { id: "gifts", label: "Gifts", icon: Gift, count: "100+", color: "#c026d3" },
  ],
  default: [
    { id: "venues", label: "Venues", icon: Building, count: "500+", color: "#7c3aed" },
    { id: "photographers", label: "Photography", icon: Camera, count: "300+", color: "#db2777" },
    { id: "catering", label: "Catering", icon: Utensils, count: "250+", color: "#ea580c" },
    { id: "decor", label: "Decor", icon: Flower2, count: "180+", color: "#0d9488" },
    { id: "djs", label: "Music", icon: Music, count: "150+", color: "#2563eb" },
    { id: "gifts", label: "Gifts", icon: Gift, count: "100+", color: "#c026d3" },
  ],
};
VENDOR_CATEGORIES_DATA.Default = VENDOR_CATEGORIES_DATA.default;

const QUICK_ACTIONS_DATA = {
  wedding: [
    { icon: Calendar, label: "Set Date", href: "/m/planner/date", color: "#e11d48" },
    { icon: Users, label: "Guest List", href: "/m/planner/guests", color: "#7c3aed" },
    { icon: MapPin, label: "Find Venue", href: "/m/vendors/marketplace/venues", color: "#0891b2" },
    { icon: Wallet, label: "Budget", href: "/m/planner/budget", color: "#059669" },
    { icon: ClipboardList, label: "Checklist", href: "/m/planner/checklist", color: "#d97706" },
    { icon: Camera, label: "Photography", href: "/m/vendors/marketplace/photographers", color: "#db2777" },
    { icon: Music, label: "Music & DJ", href: "/m/vendors/marketplace/djs", color: "#2563eb" },
    { icon: Utensils, label: "Catering", href: "/m/vendors/marketplace/catering", color: "#ea580c" },
  ],
  anniversary: [
    { icon: Calendar, label: "Set Date", href: "/m/planner/date", color: "#be185d" },
    { icon: MapPin, label: "Find Venue", href: "/m/vendors/marketplace/venues", color: "#0891b2" },
    { icon: Wallet, label: "Budget", href: "/m/planner/budget", color: "#059669" },
    { icon: Camera, label: "Photography", href: "/m/vendors/marketplace/photographers", color: "#db2777" },
    { icon: Utensils, label: "Catering", href: "/m/vendors/marketplace/catering", color: "#ea580c" },
    { icon: Music, label: "Music", href: "/m/vendors/marketplace/djs", color: "#2563eb" },
    { icon: Gift, label: "Gifts", href: "/m/vendors/marketplace/gifts", color: "#c026d3" },
    { icon: Flower2, label: "Decor", href: "/m/vendors/marketplace/decor", color: "#0d9488" },
  ],
  birthday: [
    { icon: Calendar, label: "Set Date", href: "/m/planner/date", color: "#a16207" },
    { icon: Users, label: "Guest List", href: "/m/planner/guests", color: "#7c3aed" },
    { icon: MapPin, label: "Find Venue", href: "/m/vendors/marketplace/venues", color: "#0891b2" },
    { icon: Wallet, label: "Budget", href: "/m/planner/budget", color: "#059669" },
    { icon: Camera, label: "Photography", href: "/m/vendors/marketplace/photographers", color: "#db2777" },
    { icon: Music, label: "DJ & Music", href: "/m/vendors/marketplace/djs", color: "#e11d48" },
    { icon: Utensils, label: "Catering", href: "/m/vendors/marketplace/catering", color: "#ea580c" },
    { icon: Cake, label: "Cake", href: "/m/vendors/marketplace/cake", color: "#f472b6" },
  ],
  default: [
    { icon: Calendar, label: "Set Date", href: "/m/planner/date", color: "#1e40af" },
    { icon: Users, label: "Guest List", href: "/m/planner/guests", color: "#7c3aed" },
    { icon: MapPin, label: "Find Venue", href: "/m/vendors/marketplace/venues", color: "#0891b2" },
    { icon: Wallet, label: "Budget", href: "/m/planner/budget", color: "#059669" },
    { icon: ClipboardList, label: "Checklist", href: "/m/planner/checklist", color: "#d97706" },
    { icon: Camera, label: "Photography", href: "/m/vendors/marketplace/photographers", color: "#db2777" },
    { icon: Music, label: "Music", href: "/m/vendors/marketplace/djs", color: "#2563eb" },
    { icon: Utensils, label: "Catering", href: "/m/vendors/marketplace/catering", color: "#ea580c" },
  ],
};
QUICK_ACTIONS_DATA.Default = QUICK_ACTIONS_DATA.default;

const DEFAULT_CHECKLIST_DATA = {
  wedding: [
    { id: 1, text: "Set wedding date", completed: false, priority: "high", dueIn: "12 months", category: "planning" },
    { id: 2, text: "Create budget", completed: false, priority: "high", dueIn: "12 months", category: "finance" },
    { id: 3, text: "Book venue", completed: false, priority: "high", dueIn: "10 months", category: "venue" },
    { id: 4, text: "Hire photographer", completed: false, priority: "medium", dueIn: "8 months", category: "vendor" },
    { id: 5, text: "Choose catering", completed: false, priority: "medium", dueIn: "6 months", category: "vendor" },
    { id: 6, text: "Send invitations", completed: false, priority: "medium", dueIn: "3 months", category: "planning" },
    { id: 7, text: "Final dress fitting", completed: false, priority: "high", dueIn: "1 month", category: "attire" },
    { id: 8, text: "Confirm all vendors", completed: false, priority: "high", dueIn: "1 week", category: "vendor" },
  ],
  anniversary: [
    { id: 1, text: "Plan the date", completed: false, priority: "high", dueIn: "2 months", category: "planning" },
    { id: 2, text: "Book restaurant/venue", completed: false, priority: "high", dueIn: "1 month", category: "venue" },
    {
      id: 3,
      text: "Arrange surprise elements",
      completed: false,
      priority: "medium",
      dueIn: "2 weeks",
      category: "planning",
    },
    { id: 4, text: "Order flowers", completed: false, priority: "medium", dueIn: "1 week", category: "decor" },
    { id: 5, text: "Buy gift", completed: false, priority: "high", dueIn: "1 week", category: "gift" },
    {
      id: 6,
      text: "Make dinner reservations",
      completed: false,
      priority: "high",
      dueIn: "2 weeks",
      category: "venue",
    },
  ],
  birthday: [
    {
      id: 1,
      text: "Set party date & time",
      completed: false,
      priority: "high",
      dueIn: "1 month",
      category: "planning",
    },
    { id: 2, text: "Create guest list", completed: false, priority: "high", dueIn: "3 weeks", category: "planning" },
    { id: 3, text: "Book venue", completed: false, priority: "high", dueIn: "3 weeks", category: "venue" },
    { id: 4, text: "Order cake", completed: false, priority: "medium", dueIn: "1 week", category: "food" },
    { id: 5, text: "Plan decorations", completed: false, priority: "medium", dueIn: "1 week", category: "decor" },
    { id: 6, text: "Send invitations", completed: false, priority: "medium", dueIn: "2 weeks", category: "planning" },
    {
      id: 7,
      text: "Arrange entertainment",
      completed: false,
      priority: "medium",
      dueIn: "2 weeks",
      category: "entertainment",
    },
  ],
  default: [
    { id: 1, text: "Set event date", completed: false, priority: "high", dueIn: "1 month", category: "planning" },
    { id: 2, text: "Create budget", completed: false, priority: "high", dueIn: "1 month", category: "finance" },
    { id: 3, text: "Book venue", completed: false, priority: "high", dueIn: "3 weeks", category: "venue" },
    { id: 4, text: "Send invitations", completed: false, priority: "medium", dueIn: "2 weeks", category: "planning" },
    { id: 5, text: "Arrange catering", completed: false, priority: "medium", dueIn: "2 weeks", category: "food" },
  ],
};
DEFAULT_CHECKLIST_DATA.Default = DEFAULT_CHECKLIST_DATA.default;

const DEFAULT_BUDGET_DATA = {
  wedding: {
    total: 1500000,
    categories: [
      { name: "Venue", allocated: 400000, spent: 0, color: "#7c3aed" },
      { name: "Catering", allocated: 300000, spent: 0, color: "#ea580c" },
      { name: "Photography", allocated: 150000, spent: 0, color: "#db2777" },
      { name: "Decor", allocated: 200000, spent: 0, color: "#0d9488" },
      { name: "Clothing", allocated: 250000, spent: 0, color: "#9333ea" },
      { name: "Others", allocated: 200000, spent: 0, color: "#64748b" },
    ],
  },
  anniversary: {
    total: 100000,
    categories: [
      { name: "Venue", allocated: 30000, spent: 0, color: "#7c3aed" },
      { name: "Dinner", allocated: 25000, spent: 0, color: "#ea580c" },
      { name: "Gift", allocated: 20000, spent: 0, color: "#db2777" },
      { name: "Decor", allocated: 15000, spent: 0, color: "#0d9488" },
      { name: "Others", allocated: 10000, spent: 0, color: "#64748b" },
    ],
  },
  birthday: {
    total: 50000,
    categories: [
      { name: "Venue", allocated: 15000, spent: 0, color: "#7c3aed" },
      { name: "Catering", allocated: 12000, spent: 0, color: "#ea580c" },
      { name: "Cake", allocated: 5000, spent: 0, color: "#f472b6" },
      { name: "Decor", allocated: 8000, spent: 0, color: "#0d9488" },
      { name: "Entertainment", allocated: 5000, spent: 0, color: "#2563eb" },
      { name: "Others", allocated: 5000, spent: 0, color: "#64748b" },
    ],
  },
  default: {
    total: 100000,
    categories: [
      { name: "Venue", allocated: 30000, spent: 0, color: "#7c3aed" },
      { name: "Catering", allocated: 25000, spent: 0, color: "#ea580c" },
      { name: "Decor", allocated: 20000, spent: 0, color: "#0d9488" },
      { name: "Entertainment", allocated: 15000, spent: 0, color: "#2563eb" },
      { name: "Others", allocated: 10000, spent: 0, color: "#64748b" },
    ],
  },
};
DEFAULT_BUDGET_DATA.Default = DEFAULT_BUDGET_DATA.default;

const GALLERY_IMAGES_DATA = {
  wedding: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
      category: "Venue",
      aspect: "portrait",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
      category: "Decor",
      aspect: "landscape",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600",
      category: "Couple",
      aspect: "portrait",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600",
      category: "Reception",
      aspect: "landscape",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600",
      category: "Details",
      aspect: "square",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=600",
      category: "Ceremony",
      aspect: "portrait",
    },
  ],
  anniversary: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=600",
      category: "Dinner",
      aspect: "landscape",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600",
      category: "Romance",
      aspect: "portrait",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600",
      category: "Celebration",
      aspect: "landscape",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600",
      category: "Gifts",
      aspect: "square",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600",
      category: "Decor",
      aspect: "portrait",
    },
  ],
  birthday: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600",
      category: "Party",
      aspect: "landscape",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600",
      category: "Decor",
      aspect: "portrait",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=600",
      category: "Cake",
      aspect: "square",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600",
      category: "Fun",
      aspect: "landscape",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600",
      category: "Celebration",
      aspect: "portrait",
    },
  ],
  default: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600",
      category: "Event",
      aspect: "landscape",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600",
      category: "Venue",
      aspect: "portrait",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
      category: "Party",
      aspect: "landscape",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1496843916299-590492c751f4?w=600",
      category: "Decor",
      aspect: "square",
    },
  ],
};
GALLERY_IMAGES_DATA.Default = GALLERY_IMAGES_DATA.default;

const TESTIMONIALS_DATA = {
  wedding: [
    {
      id: 1,
      name: "Priya & Rahul",
      location: "Mumbai",
      avatar: "https://i.pravatar.cc/100?img=1",
      rating: 5,
      text: "PlanWab made our wedding planning journey so smooth! Found amazing vendors within our budget. The checklist feature was incredibly helpful.",
      date: "Dec 2024",
      eventType: "Wedding",
    },
    {
      id: 2,
      name: "Ananya & Vikram",
      location: "Delhi",
      avatar: "https://i.pravatar.cc/100?img=2",
      rating: 5,
      text: "The checklist feature was a lifesaver. We couldn't have done it without this platform! Every vendor was professional and verified.",
      date: "Nov 2024",
      eventType: "Wedding",
    },
    {
      id: 3,
      name: "Sneha & Arjun",
      location: "Bangalore",
      avatar: "https://i.pravatar.cc/100?img=3",
      rating: 5,
      text: "Best decision we made was using PlanWab. Every vendor was verified and professional. Our dream wedding came true!",
      date: "Oct 2024",
      eventType: "Wedding",
    },
  ],
  anniversary: [
    {
      id: 1,
      name: "Meera & Karan",
      location: "Chennai",
      avatar: "https://i.pravatar.cc/100?img=4",
      rating: 5,
      text: "Planned a surprise anniversary dinner perfectly. Everything was exactly as we wanted. Highly recommend!",
      date: "Dec 2024",
      eventType: "Anniversary",
    },
    {
      id: 2,
      name: "Ritu & Amit",
      location: "Pune",
      avatar: "https://i.pravatar.cc/100?img=5",
      rating: 5,
      text: "Our 25th anniversary was made special thanks to the amazing vendors. The coordination was seamless.",
      date: "Nov 2024",
      eventType: "Anniversary",
    },
  ],
  birthday: [
    {
      id: 1,
      name: "Aisha's Mom",
      location: "Hyderabad",
      avatar: "https://i.pravatar.cc/100?img=6",
      rating: 5,
      text: "Threw the best 5th birthday party for my daughter. The kids loved every moment! Will definitely use again.",
      date: "Dec 2024",
      eventType: "Birthday",
    },
    {
      id: 2,
      name: "Rohan",
      location: "Kolkata",
      avatar: "https://i.pravatar.cc/100?img=7",
      rating: 5,
      text: "My surprise 30th birthday party was epic! Great vendors, seamless planning, and unforgettable memories.",
      date: "Nov 2024",
      eventType: "Birthday",
    },
  ],
  default: [
    {
      id: 1,
      name: "Happy Customer",
      location: "India",
      avatar: "https://i.pravatar.cc/100?img=8",
      rating: 5,
      text: "Excellent platform for event planning. Everything was smooth and professional.",
      date: "Dec 2024",
      eventType: "Event",
    },
  ],
};
TESTIMONIALS_DATA.Default = TESTIMONIALS_DATA.default;

const FAQ_DATA = {
  wedding: [
    {
      q: "How do I start planning my wedding?",
      a: "Start by setting your date and budget using our planning tools. Then browse verified vendors, create your checklist, and use our budget tracker to stay on track. Our platform guides you through every step.",
    },
    {
      q: "Are all vendors verified?",
      a: "Yes! All vendors on PlanWab go through a thorough verification process including document verification, portfolio review, and quality checks. Look for the verified badge on vendor profiles.",
    },
    {
      q: "Can I negotiate prices with vendors?",
      a: "Absolutely! You can directly communicate with vendors through our platform and negotiate packages. Many vendors offer customizable packages to fit your budget.",
    },
    {
      q: "What if I need to cancel a booking?",
      a: "Cancellation policies vary by vendor and are clearly stated before booking. Review the terms carefully, and contact our support team for any issues. We're here to help!",
    },
    {
      q: "How does the budget tracker work?",
      a: "Our budget tracker lets you set your total budget, allocate amounts to different categories, and track spending in real-time. You'll get alerts when approaching limits.",
    },
  ],
  anniversary: [
    {
      q: "How far in advance should I book?",
      a: "We recommend booking at least 2-4 weeks in advance for restaurants and venues, especially for special dates. For elaborate celebrations, 1-2 months notice is ideal.",
    },
    {
      q: "Can you help with surprise planning?",
      a: "Yes! Many of our vendors specialize in surprise celebrations and can coordinate discreetly. Just mention it's a surprise when contacting vendors.",
    },
    {
      q: "What's included in anniversary packages?",
      a: "Packages vary but typically include venue decoration, dinner arrangements, and special touches like cakes, flowers, or music. Each vendor lists their inclusions clearly.",
    },
    {
      q: "Can I customize packages?",
      a: "Most vendors offer customization options. Discuss your specific needs directly with vendors through our messaging feature.",
    },
  ],
  birthday: [
    {
      q: "Do you have party packages for kids?",
      a: "Yes! We have specialized vendors offering themed parties, entertainment, games, and kid-friendly catering. Filter by 'Kids Party' to find suitable options.",
    },
    {
      q: "Can I customize the party theme?",
      a: "Absolutely! Our vendors can customize decorations, cakes, activities, and more based on your chosen theme. Popular themes include superheroes, princesses, sports, and more.",
    },
    {
      q: "What's the minimum guest count?",
      a: "It varies by vendor. Some offer packages for intimate gatherings of 10-15 guests, while others cater to larger parties of 100+. Filter by capacity to find the right fit.",
    },
    {
      q: "How do I arrange entertainment?",
      a: "Browse our entertainment category for DJs, magicians, game coordinators, and more. You can book multiple services and coordinate timings through our platform.",
    },
  ],
  default: [
    {
      q: "How do I get started?",
      a: "Simply browse our vendor categories, set your event date, and start exploring options. Our planning tools help you stay organized throughout the process.",
    },
    {
      q: "Are vendors verified?",
      a: "Yes, all vendors undergo verification. Look for the verified badge on profiles for added assurance.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We support various payment methods including cards, UPI, net banking, and EMI options for larger bookings.",
    },
  ],
};
FAQ_DATA.Default = FAQ_DATA.default;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) return "₹0";
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatPrice = (price) => {
  if (!price || price === 0) return "Contact";
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
  if (price >= 1000) return `₹${(price / 1000).toFixed(0)}K`;
  return `₹${price.toLocaleString("en-IN")}`;
};

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatShortDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getVendorImage = (vendor) => {
  return vendor.normalizedImages?.[0] || vendor.images?.[0] || vendor.defaultImage || "/placeholder.jpg";
};

const getVendorPrice = (vendor) => {
  return vendor.normalizedPrice || vendor.perDayPrice?.min || vendor.basePrice || vendor.price?.min || 0;
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && date > new Date();
};

const getDaysUntil = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 20, heavy: 40, success: [10, 30, 10], error: [30, 20, 30] };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, isHydrated];
}

function useInViewOnce(options = {}) {
  const ref = useRef(null);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenInView) {
          setHasBeenInView(true);
        }
      },
      { threshold: 0.1, rootMargin: "50px", ...options }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasBeenInView, options]);

  return { ref, hasBeenInView };
}

// =============================================================================
// SPRING CONFIGS
// =============================================================================

const SPRING_CONFIG = {
  gentle: { type: "spring", stiffness: 120, damping: 20 },
  snappy: { type: "spring", stiffness: 300, damping: 30 },
  bouncy: { type: "spring", stiffness: 400, damping: 25 },
  smooth: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

// =============================================================================
// ANIMATED BACKGROUND COMPONENT
// =============================================================================

const AnimatedBackground = ({ theme }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -80]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0.3]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient}`} />

      <motion.div
        style={{ y: y1, opacity }}
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl will-change-transform"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.5, 0.35],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ backgroundColor: theme.glowColor }}
      />

      <motion.div
        style={{ y: y2, opacity }}
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl will-change-transform"
        animate={{
          scale: [1.15, 1, 1.15],
          opacity: [0.4, 0.25, 0.4],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ backgroundColor: theme.glowColor }}
      />

      <div className="absolute inset-0 overflow-hidden opacity-[0.04]">
        {theme.patterns.slice(0, 5).map((pattern, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl select-none"
            style={{
              left: `${(i * 20 + 5) % 100}%`,
              top: `${(i * 18 + 10) % 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            {pattern}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// SCROLL PROGRESS BAR
// =============================================================================

const ScrollProgressBar = ({ theme }) => {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: progress > 2 ? 1 : 0 }}
    >
      <motion.div
        className={`h-full bg-gradient-to-r ${theme.accentGradient}`}
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
};

// =============================================================================
// ANIMATED SECTION WRAPPER
// =============================================================================

const AnimatedSection = ({ children, delay = 0, className = "" }) => {
  const { ref, hasBeenInView } = useInViewOnce();

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// =============================================================================
// SECTION HEADER COMPONENT
// =============================================================================

const SectionHeader = ({ title, subtitle, icon: Icon, theme, actionLabel, actionHref, onAction }) => {
  const haptic = useHapticFeedback();

  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        {Icon && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${theme.primary}12` }}
          >
            <Icon size={20} style={{ color: theme.primary }} />
          </motion.div>
        )}
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {(actionLabel || actionHref) && (
        <motion.div whileTap={{ scale: 0.95 }}>
          {actionHref ? (
            <Link
              href={actionHref}
              onClick={() => haptic("light")}
              className="text-sm font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: theme.primary, backgroundColor: `${theme.primary}08` }}
            >
              {actionLabel || "View All"} <ChevronRight size={16} />
            </Link>
          ) : (
            <button
              onClick={() => {
                haptic("light");
                onAction?.();
              }}
              className="text-sm font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: theme.primary, backgroundColor: `${theme.primary}08` }}
            >
              {actionLabel} <ChevronRight size={16} />
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};

// =============================================================================
// QUICK ACTIONS SECTION
// =============================================================================

const QuickActionsSection = ({ theme, category }) => {
  const haptic = useHapticFeedback();
  const actions = QUICK_ACTIONS_DATA[category] || QUICK_ACTIONS_DATA.default;

  return (
    <div className="px-4 sm:px-5 py-6">
      <SectionHeader
        title="Quick Actions"
        subtitle="Get started quickly"
        icon={Sparkles}
        theme={theme}
        actionLabel="All Tools"
        actionHref="/m/planner"
      />

      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {actions.slice(0, 8).map((action, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.04, ...SPRING_CONFIG.gentle }}
          >
            <Link
              href={action.href}
              onClick={() => haptic("light")}
              className="flex flex-col items-center gap-2 p-3 sm:p-3.5 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-all duration-200 hover:shadow-md"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${action.color}12` }}
              >
                <action.icon size={22} style={{ color: action.color }} />
              </motion.div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-700 text-center leading-tight line-clamp-2">
                {action.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// DATE PICKER MODAL
// =============================================================================

const DatePickerModal = ({ isOpen, onClose, onSave, currentDate, theme, eventType }) => {
  const [selectedDate, setSelectedDate] = useState(currentDate || "");
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const haptic = useHapticFeedback();

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(currentDate || "");
      setError("");
      if (currentDate) {
        setCurrentMonth(new Date(currentDate));
      } else {
        setCurrentMonth(new Date());
      }
    }
  }, [isOpen, currentDate]);

  const handleSave = useCallback(() => {
    if (!selectedDate) {
      setError("Please select a date");
      haptic("error");
      return;
    }

    const dateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateObj < today) {
      setError("Please select a future date");
      haptic("error");
      return;
    }

    haptic("success");
    onSave(selectedDate, selectedTime);
    onClose();
  }, [selectedDate, selectedTime, onSave, onClose, haptic]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty slots for days before the first day
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const goToPrevMonth = () => {
    haptic("light");
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    haptic("light");
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const selectDate = (date) => {
    if (date && date >= today) {
      haptic("light");
      setSelectedDate(date.toISOString().split("T")[0]);
      setError("");
    }
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toISOString().split("T")[0] === selectedDate;
  };

  const isPast = (date) => {
    if (!date) return false;
    return date < today;
  };

  const isToday = (date) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={SPRING_CONFIG.gentle}
          className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 sm:hidden" />

          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Select {eventType} Date</h3>
              <p className="text-xs text-gray-500 mt-0.5">Choose your special day</p>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="p-2 bg-gray-100 rounded-full">
              <X size={20} className="text-gray-500" />
            </motion.button>
          </div>

          {/* Calendar */}
          <div className="p-5">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={goToPrevMonth}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </motion.button>
              <h4 className="text-base font-bold text-gray-900">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h4>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={goToNextMonth}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </motion.button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, idx) => (
                <motion.button
                  key={idx}
                  whileTap={date && !isPast(date) ? { scale: 0.9 } : {}}
                  onClick={() => selectDate(date)}
                  disabled={!date || isPast(date)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                    !date
                      ? "invisible"
                      : isPast(date)
                      ? "text-gray-300 cursor-not-allowed"
                      : isSelected(date)
                      ? "text-white shadow-lg"
                      : isToday(date)
                      ? "bg-gray-100 text-gray-900 font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  style={isSelected(date) ? { backgroundColor: theme.primary } : {}}
                >
                  {date?.getDate()}
                </motion.button>
              ))}
            </div>

            {/* Time Selector */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Event Time (Optional)</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 bg-gray-100 rounded-xl text-gray-900 font-medium outline-none focus:ring-2 transition-all"
                style={{ focusRing: theme.primary }}
              />
            </div>

            {/* Selected Date Display */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-xl flex items-center gap-3"
                style={{ backgroundColor: `${theme.primary}10` }}
              >
                <CalendarDays size={20} style={{ color: theme.primary }} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(selectedDate)}</p>
                  <p className="text-xs text-gray-500">{getDaysUntil(selectedDate)} days from now</p>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 p-3 bg-red-50 rounded-xl flex items-center gap-2"
                >
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-5 pb-5 pt-2 flex gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 font-bold text-gray-600 text-sm"
            >
              Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              style={{ backgroundColor: theme.primary }}
            >
              <Check size={18} />
              Set Date
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// =============================================================================
// COUNTDOWN TIMER SECTION
// =============================================================================

const CountdownTimerSection = ({ theme, category }) => {
  const [eventDate, setEventDate, isHydrated] = useLocalStorage(`${category}_event_date`, null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const haptic = useHapticFeedback();

  useEffect(() => {
    if (!eventDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(eventDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setIsExpired(false);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  const handleSaveDate = useCallback(
    (date) => {
      setEventDate(date);
    },
    [setEventDate]
  );

  const handleClearDate = useCallback(() => {
    haptic("medium");
    setEventDate(null);
  }, [setEventDate, haptic]);

  const handleShare = useCallback(async () => {
    haptic("light");
    const text = `I'm planning my ${theme.name}! ${getDaysUntil(eventDate)} days to go! 🎉`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  }, [eventDate, theme.name, haptic]);

  const TimeBlock = ({ value, label, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ...SPRING_CONFIG.gentle }}
      className="flex flex-col items-center"
    >
      <motion.div
        key={value}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-lg relative overflow-hidden"
        style={{ backgroundColor: theme.primary }}
      >
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {String(value).padStart(2, "0")}
        </motion.span>
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      </motion.div>
      <span className="text-[10px] sm:text-xs font-semibold text-gray-500 mt-2 uppercase tracking-wider">{label}</span>
    </motion.div>
  );

  if (!isHydrated) {
    return (
      <div className="px-4 sm:px-5 py-4">
        <div className="animate-pulse bg-gray-200 rounded-3xl h-48" />
      </div>
    );
  }

  if (!eventDate) {
    return (
      <div className="px-4 sm:px-5 py-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            haptic("light");
            setIsDatePickerOpen(true);
          }}
          className="w-full p-5 sm:p-6 rounded-3xl border-2 border-dashed flex flex-col items-center gap-3 transition-colors hover:bg-gray-50"
          style={{ borderColor: `${theme.primary}40` }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${theme.primary}12` }}
          >
            <CalendarDays size={28} style={{ color: theme.primary }} />
          </motion.div>
          <div className="text-center">
            <p className="font-bold text-gray-900 text-base">Set Your {theme.name} Date</p>
            <p className="text-sm text-gray-500 mt-1">Start the countdown to your special day</p>
          </div>
          <div
            className="px-4 py-2 rounded-xl text-sm font-semibold mt-1"
            style={{ backgroundColor: `${theme.primary}12`, color: theme.primary }}
          >
            Select Date
          </div>
        </motion.button>

        <DatePickerModal
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          onSave={handleSaveDate}
          currentDate={eventDate}
          theme={theme}
          eventType={theme.name}
        />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-5 py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-5 sm:p-6 rounded-3xl overflow-hidden shadow-sm"
        style={{ backgroundColor: `${theme.primary}08` }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(${theme.primary} 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl sm:text-3xl"
              >
                {theme.emoji}
              </motion.span>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Countdown</h3>
                <p className="text-xs text-gray-500">{formatShortDate(eventDate)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  haptic("light");
                  setIsDatePickerOpen(true);
                }}
                className="p-2.5 bg-white rounded-xl shadow-sm"
              >
                <Edit3 size={16} style={{ color: theme.primary }} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2.5 bg-white rounded-xl shadow-sm"
              >
                <Share2 size={16} className="text-gray-500" />
              </motion.button>
            </div>
          </div>

          {/* Timer or Expired Message */}
          {isExpired ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <PartyPopper size={48} style={{ color: theme.primary }} className="mx-auto mb-3" />
              <h3 className="text-xl font-black text-gray-900 mb-1">It's {theme.name} Day!</h3>
              <p className="text-sm text-gray-500">Congratulations! 🎉</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleClearDate}
                className="mt-4 px-4 py-2 bg-gray-100 rounded-xl text-sm font-semibold text-gray-600"
              >
                Set New Date
              </motion.button>
            </motion.div>
          ) : (
            <>
              <div className="flex justify-between px-1 sm:px-4">
                <TimeBlock value={timeLeft.days} label="Days" index={0} />
                <TimeBlock value={timeLeft.hours} label="Hours" index={1} />
                <TimeBlock value={timeLeft.minutes} label="Mins" index={2} />
                <TimeBlock value={timeLeft.seconds} label="Secs" index={3} />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-5">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl bg-white flex items-center justify-center gap-2 font-semibold text-sm shadow-sm"
                  style={{ color: theme.primary }}
                >
                  <Bell size={16} />
                  Set Reminder
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClearDate}
                  className="py-3 px-4 rounded-xl bg-white/60 text-gray-500 font-semibold text-sm"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </>
          )}
        </div>
      </motion.div>

      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSave={handleSaveDate}
        currentDate={eventDate}
        theme={theme}
        eventType={theme.name}
      />
    </div>
  );
};

// =============================================================================
// VENDOR CATEGORIES SECTION
// =============================================================================

const VendorCategoriesSection = ({ theme, category }) => {
  const haptic = useHapticFeedback();
  const categories = VENDOR_CATEGORIES_DATA[category] || VENDOR_CATEGORIES_DATA.default;
  const scrollRef = useRef(null);

  return (
    <div className="px-4 sm:px-5 py-6">
      <SectionHeader
        title="Browse Vendors"
        subtitle={`${categories.length} categories available`}
        icon={Building}
        theme={theme}
        actionLabel="See All"
        actionHref="/m/vendors/marketplace"
      />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: idx * 0.05, ...SPRING_CONFIG.gentle }}
          >
            <Link
              href={`/m/vendors/marketplace/${cat.id}`}
              onClick={() => haptic("light")}
              className="flex items-center gap-3 p-3.5 sm:p-4 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-all duration-200 hover:shadow-md"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${cat.color}12` }}
              >
                <cat.icon size={22} style={{ color: cat.color }} />
              </motion.div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 text-sm truncate">{cat.label}</p>
                <p className="text-xs text-gray-500">{cat.count} vendors</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// FEATURED VENDORS SECTION
// =============================================================================

const FeaturedVendorsSection = ({ theme, category }) => {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useLocalStorage("favorite_vendors", []);
  const scrollRef = useRef(null);
  const haptic = useHapticFeedback();

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/vendor?limit=8&featured=true&sortBy=rating`);
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        if (result.success !== false && result.data) {
          setVendors(result.data);
        } else {
          setVendors([]);
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setError("Failed to load vendors");
        setVendors([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, [category]);

  const toggleFavorite = useCallback(
    (id) => {
      haptic("medium");
      setFavorites((prev) => (prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]));
    },
    [haptic, setFavorites]
  );

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="px-4 sm:px-5 mb-4">
          <div className="h-6 w-40 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-3 sm:gap-4 overflow-hidden px-4 sm:px-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-56 sm:w-64 shrink-0 bg-gray-200 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || vendors.length === 0) {
    return null;
  }

  return (
    <div className="py-6">
      <div className="px-4 sm:px-5">
        <SectionHeader
          title="Featured Vendors"
          subtitle="Top-rated professionals"
          icon={Sparkles}
          theme={theme}
          actionLabel="View All"
          actionHref="/m/vendors/marketplace"
        />
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-5 pb-2 scrollbar-hide snap-x snap-mandatory"
      >
        {vendors.map((vendor, idx) => (
          <motion.div
            key={vendor._id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08, ...SPRING_CONFIG.gentle }}
            className="w-56 sm:w-64 shrink-0 snap-start"
          >
            <Link
              href={`/m/vendor/${vendor.category}/${vendor._id}`}
              className="block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-36 sm:h-40">
                <img
                  src={getVendorImage(vendor)}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  {vendor.tags?.includes("Popular") && (
                    <span className="px-2 py-1 bg-amber-400 text-amber-900 text-[9px] font-bold rounded-md shadow-sm">
                      Popular
                    </span>
                  )}
                  {(vendor.isVerified || vendor.tags?.includes("Verified")) && (
                    <span className="px-2 py-1 bg-blue-500 text-white text-[9px] font-bold rounded-md flex items-center gap-0.5 shadow-sm">
                      <BadgeCheck size={10} /> Verified
                    </span>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(vendor._id);
                  }}
                  className="absolute top-2.5 right-2.5 p-2 bg-white/95 rounded-full shadow-sm"
                >
                  <Heart
                    size={16}
                    className={favorites.includes(vendor._id) ? "fill-rose-500 text-rose-500" : "text-gray-600"}
                  />
                </motion.button>

                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/95 px-2 py-1 rounded-lg shadow-sm">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-gray-800">{vendor.rating?.toFixed(1) || "4.5"}</span>
                  <span className="text-[10px] text-gray-500">({vendor.reviews || 0})</span>
                </div>
              </div>

              <div className="p-3 sm:p-3.5">
                <h3 className="font-bold text-gray-900 text-sm truncate mb-1">{vendor.name}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-2.5">
                  <MapPin size={12} />
                  <span className="truncate">{vendor.address?.city || "Location"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold" style={{ color: theme.primary }}>
                    {formatPrice(getVendorPrice(vendor))}
                  </span>
                  <span className="text-[10px] text-gray-400 capitalize px-2 py-1 bg-gray-100 rounded-md">
                    {vendor.category}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// EVENT CHECKLIST SECTION
// =============================================================================

const EventChecklistSection = ({ theme, category }) => {
  const [checklist, setChecklist, isHydrated] = useLocalStorage(
    `${category}_checklist`,
    DEFAULT_CHECKLIST_DATA[category] || DEFAULT_CHECKLIST_DATA.default
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const inputRef = useRef(null);
  const haptic = useHapticFeedback();

  useEffect(() => {
    if (isAddingTask && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingTask]);

  const toggleTask = useCallback(
    (id) => {
      haptic("light");
      setChecklist((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
    },
    [haptic, setChecklist]
  );

  const addTask = useCallback(() => {
    const trimmedTask = newTask.trim();
    if (!trimmedTask) {
      haptic("error");
      return;
    }
    if (trimmedTask.length < 3) {
      haptic("error");
      return;
    }
    haptic("success");
    setChecklist((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: trimmedTask,
        completed: false,
        priority: "medium",
        category: "custom",
      },
    ]);
    setNewTask("");
    setIsAddingTask(false);
  }, [newTask, haptic, setChecklist]);

  const deleteTask = useCallback(
    (id) => {
      haptic("medium");
      setChecklist((prev) => prev.filter((task) => task.id !== id));
    },
    [haptic, setChecklist]
  );

  const startEditing = useCallback((task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingText.trim()) {
      haptic("error");
      return;
    }
    haptic("success");
    setChecklist((prev) =>
      prev.map((task) => (task.id === editingTaskId ? { ...task, text: editingText.trim() } : task))
    );
    setEditingTaskId(null);
    setEditingText("");
  }, [editingText, editingTaskId, haptic, setChecklist]);

  const cancelEdit = useCallback(() => {
    setEditingTaskId(null);
    setEditingText("");
  }, []);

  const clearCompleted = useCallback(() => {
    haptic("medium");
    setChecklist((prev) => prev.filter((task) => !task.completed));
  }, [haptic, setChecklist]);

  if (!isHydrated) {
    return (
      <div className="px-4 sm:px-5 py-6">
        <div className="animate-pulse bg-gray-200 rounded-3xl h-64" />
      </div>
    );
  }

  const completedCount = checklist.filter((t) => t.completed).length;
  const progress = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;
  const displayedTasks = isExpanded ? checklist : checklist.slice(0, 5);
  const hasCompletedTasks = completedCount > 0;

  const priorityColors = {
    high: "#dc2626",
    medium: "#f59e0b",
    low: "#22c55e",
  };

  return (
    <div className="px-4 sm:px-5 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${theme.primary}12` }}
              >
                <ClipboardList size={20} style={{ color: theme.primary }} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Planning Checklist</h2>
                <p className="text-xs text-gray-500">{checklist.length} tasks total</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: theme.primary }}>
                {completedCount}/{checklist.length}
              </span>
              {hasCompletedTasks && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={clearCompleted}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Clear completed"
                >
                  <Trash2 size={16} />
                </motion.button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: theme.primary }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 text-right">{Math.round(progress)}% complete</p>
        </div>

        {/* Tasks */}
        <div className="p-4 sm:p-5 space-y-2.5">
          <AnimatePresence mode="popLayout">
            {displayedTasks.map((task, idx) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: idx * 0.03, ...SPRING_CONFIG.snappy }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  task.completed ? "bg-gray-50" : "bg-white border border-gray-100"
                }`}
              >
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                    task.completed ? "border-transparent" : "border-gray-300"
                  }`}
                  style={task.completed ? { backgroundColor: theme.primary } : {}}
                >
                  <AnimatePresence>
                    {task.completed && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check size={14} className="text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <div className="flex-1 min-w-0">
                  {editingTaskId === task.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                        className="flex-1 px-2 py-1 text-sm bg-gray-100 rounded-lg outline-none focus:ring-2"
                        style={{ "--tw-ring-color": theme.primary }}
                        autoFocus
                      />
                      <motion.button whileTap={{ scale: 0.9 }} onClick={saveEdit} className="p-1.5 text-green-600">
                        <Check size={16} />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={cancelEdit} className="p-1.5 text-gray-400">
                        <X size={16} />
                      </motion.button>
                    </div>
                  ) : (
                    <>
                      <p
                        className={`text-sm font-medium transition-colors ${
                          task.completed ? "text-gray-400 line-through" : "text-gray-900"
                        }`}
                      >
                        {task.text}
                      </p>
                      {task.dueIn && !task.completed && (
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> Due in {task.dueIn}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {!editingTaskId && (
                  <div className="flex items-center gap-1.5">
                    {task.priority && (
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: priorityColors[task.priority] }}
                        title={`${task.priority} priority`}
                      />
                    )}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => startEditing(task)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit3 size={14} />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Task */}
          <AnimatePresence mode="wait">
            {isAddingTask ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 mt-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add new task..."
                  maxLength={100}
                  className="flex-1 px-3 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 transition-all"
                  style={{ "--tw-ring-color": theme.primary }}
                  onKeyPress={(e) => e.key === "Enter" && addTask()}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addTask}
                  className="px-4 py-2.5 rounded-xl text-white font-semibold text-sm shadow-sm"
                  style={{ backgroundColor: theme.primary }}
                >
                  Add
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTask("");
                  }}
                  className="px-3 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm"
                >
                  <X size={18} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                key="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  haptic("light");
                  setIsAddingTask(true);
                }}
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium text-sm flex items-center justify-center gap-2 hover:border-gray-300 hover:text-gray-500 transition-colors"
              >
                <Plus size={16} /> Add Task
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Show More/Less */}
        {checklist.length > 5 && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              haptic("light");
              setIsExpanded(!isExpanded);
            }}
            className="w-full py-3.5 border-t border-gray-100 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors"
            style={{ color: theme.primary }}
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show {checklist.length - 5} More <ChevronDown size={16} />
              </>
            )}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

// =============================================================================
// BUDGET PLANNER SECTION
// =============================================================================

const BudgetPlannerSection = ({ theme, category }) => {
  const [budget, setBudget, isHydrated] = useLocalStorage(
    `${category}_budget`,
    DEFAULT_BUDGET_DATA[category] || DEFAULT_BUDGET_DATA.default
  );
  const haptic = useHapticFeedback();

  if (!isHydrated) {
    return (
      <div className="px-4 sm:px-5 py-6">
        <div className="animate-pulse bg-gray-200 rounded-3xl h-72" />
      </div>
    );
  }

  const totalSpent = budget.categories.reduce((sum, cat) => sum + (cat.spent || 0), 0);
  const totalAllocated = budget.categories.reduce((sum, cat) => sum + (cat.allocated || 0), 0);
  const remaining = budget.total - totalSpent;
  const spentPercentage = budget.total > 0 ? (totalSpent / budget.total) * 100 : 0;
  const isOverBudget = totalSpent > budget.total;

  return (
    <div className="px-4 sm:px-5 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${theme.primary}12` }}
              >
                <Wallet size={20} style={{ color: theme.primary }} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Budget Tracker</h2>
                <p className="text-xs text-gray-500">Manage your expenses</p>
              </div>
            </div>
            <Link
              href="/m/planner/budget"
              onClick={() => haptic("light")}
              className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Edit2 size={16} className="text-gray-600" />
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {/* Total Budget */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-sm text-gray-500">Total Budget</span>
              <span className="text-2xl font-black" style={{ color: theme.primary }}>
                {formatCurrency(budget.total)}
              </span>
            </div>

            {/* Progress */}
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: isOverBudget ? "#dc2626" : theme.primary,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(spentPercentage, 100)}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            <div className="flex justify-between mt-2.5 text-xs">
              <span className="text-gray-500">
                Spent:{" "}
                <span className={`font-semibold ${isOverBudget ? "text-red-600" : "text-gray-900"}`}>
                  {formatCurrency(totalSpent)}
                </span>
              </span>
              <span className="text-gray-500">
                Remaining:{" "}
                <span className={`font-semibold ${remaining < 0 ? "text-red-600" : "text-green-600"}`}>
                  {formatCurrency(Math.abs(remaining))}
                  {remaining < 0 && " over"}
                </span>
              </span>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-3">
            {budget.categories.slice(0, 5).map((cat, idx) => {
              const catSpentPercent = cat.allocated > 0 ? (cat.spent / cat.allocated) * 100 : 0;
              const isOverAllocated = cat.spent > cat.allocated;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    </div>
                    <span className={`text-xs ${isOverAllocated ? "text-red-600" : "text-gray-500"}`}>
                      {formatCurrency(cat.spent)} / {formatCurrency(cat.allocated)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(catSpentPercent, 100)}%`,
                        backgroundColor: isOverAllocated ? "#dc2626" : cat.color,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(catSpentPercent, 100)}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* View Full Budget */}
          <Link
            href="/m/planner/budget"
            onClick={() => haptic("light")}
            className="mt-5 w-full py-3 rounded-xl border border-gray-200 flex items-center justify-center gap-2 font-semibold text-sm hover:bg-gray-50 transition-colors"
            style={{ color: theme.primary }}
          >
            <PieChart size={16} />
            View Full Budget <ChevronRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

// =============================================================================
// INSPIRATION GALLERY SECTION
// =============================================================================

const InspirationGallerySection = ({ theme, category }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [savedImages, setSavedImages] = useLocalStorage(`${category}_saved_images`, []);
  const [imageLoadStates, setImageLoadStates] = useState({});
  const scrollRef = useRef(null);
  const images = GALLERY_IMAGES_DATA[category] || GALLERY_IMAGES_DATA.default;
  const haptic = useHapticFeedback();

  const toggleSave = useCallback(
    (id, e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      haptic("medium");
      setSavedImages((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    },
    [haptic, setSavedImages]
  );

  const handleImageLoad = useCallback((id) => {
    setImageLoadStates((prev) => ({ ...prev, [id]: true }));
  }, []);

  const getImageDimensions = (aspect, index) => {
    const baseWidth = 140;
    const heights = {
      portrait: 190,
      landscape: 130,
      square: 150,
    };
    return {
      width: index % 3 === 0 ? 160 : baseWidth,
      height: heights[aspect] || 160,
    };
  };

  return (
    <div className="py-6">
      <div className="px-4 sm:px-5">
        <SectionHeader
          title="Get Inspired"
          subtitle={`${savedImages.length} saved`}
          icon={ImageIcon}
          theme={theme}
          actionLabel="See All"
          actionHref="/m/inspiration"
        />
      </div>

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto px-4 sm:px-5 pb-3 scrollbar-hide snap-x">
        {images.map((image, idx) => {
          const dimensions = getImageDimensions(image.aspect, idx);
          const isLoaded = imageLoadStates[image.id];

          return (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.08, ...SPRING_CONFIG.gentle }}
              className="relative shrink-0 rounded-2xl overflow-hidden cursor-pointer group snap-start"
              style={{ width: dimensions.width, height: dimensions.height }}
              onClick={() => {
                haptic("light");
                setSelectedImage(image);
              }}
            >
              {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
              <motion.img
                src={image.url}
                alt={image.category}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                onLoad={() => handleImageLoad(image.id)}
                whileHover={{ scale: 1.05 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-active:opacity-100 transition-opacity" />

              <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/95 rounded-lg shadow-sm">
                <span className="text-[10px] font-semibold text-gray-700">{image.category}</span>
              </div>

              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={(e) => toggleSave(image.id, e)}
                className="absolute top-2 right-2 p-1.5 bg-white/95 rounded-full shadow-sm"
              >
                <Bookmark
                  size={14}
                  className={savedImages.includes(image.id) ? "fill-amber-500 text-amber-500" : "text-gray-600"}
                />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} className="text-white" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.category}
                className="max-w-full max-h-[80vh] rounded-xl object-contain"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => toggleSave(selectedImage.id, e)}
                  className="px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-xl text-white font-semibold text-sm flex items-center gap-2"
                >
                  <Bookmark size={16} className={savedImages.includes(selectedImage.id) ? "fill-white" : ""} />
                  {savedImages.includes(selectedImage.id) ? "Saved" : "Save"}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-xl text-white font-semibold text-sm flex items-center gap-2"
                >
                  <Share2 size={16} />
                  Share
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =============================================================================
// TESTIMONIALS SECTION
// =============================================================================

const TestimonialsSection = ({ theme, category }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = TESTIMONIALS_DATA[category] || TESTIMONIALS_DATA.default;
  const scrollRef = useRef(null);
  const haptic = useHapticFeedback();
  const autoPlayRef = useRef(null);

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [testimonials.length]);

  useEffect(() => {
    if (scrollRef.current && testimonials.length > 1) {
      const container = scrollRef.current;
      const itemWidth = container.offsetWidth - 40;
      container.scrollTo({
        left: activeIndex * (itemWidth + 16),
        behavior: "smooth",
      });
    }
  }, [activeIndex, testimonials.length]);

  const handleScroll = useCallback(
    (e) => {
      const container = e.target;
      const itemWidth = container.offsetWidth - 40;
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / (itemWidth + 16));
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < testimonials.length) {
        setActiveIndex(newIndex);
      }
    },
    [activeIndex, testimonials.length]
  );

  if (testimonials.length === 0) return null;

  return (
    <div className="py-6">
      <div className="px-4 sm:px-5">
        <SectionHeader title="Happy Customers" subtitle={`${testimonials.length} reviews`} icon={Star} theme={theme} />
      </div>

      <div className="px-4 sm:px-5 mb-3">
        <div className="flex gap-1.5">
          {testimonials.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                haptic("light");
                setActiveIndex(idx);
              }}
              className="h-1.5 rounded-full transition-all"
              animate={{
                width: idx === activeIndex ? 20 : 8,
                backgroundColor: idx === activeIndex ? theme.primary : "#e5e7eb",
              }}
            />
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto px-4 sm:px-5 pb-2 scrollbar-hide snap-x snap-mandatory"
      >
        {testimonials.map((testimonial, idx) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, ...SPRING_CONFIG.gentle }}
            className="w-[calc(100%-32px)] sm:w-[calc(100%-40px)] shrink-0 snap-start"
          >
            <div
              className="p-5 sm:p-6 rounded-3xl relative overflow-hidden"
              style={{ backgroundColor: `${theme.primary}06` }}
            >
              <Quote size={40} className="absolute top-4 right-4 opacity-10" style={{ color: theme.primary }} />

              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                  loading="lazy"
                />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">
                    {testimonial.location} • {testimonial.date}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// FAQ SECTION
// =============================================================================

const FAQSectionComponent = ({ theme, category }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = FAQ_DATA[category] || FAQ_DATA.default;
  const haptic = useHapticFeedback();

  const toggleFAQ = useCallback(
    (idx) => {
      haptic("light");
      setOpenIndex((prev) => (prev === idx ? null : idx));
    },
    [haptic]
  );

  return (
    <div className="px-4 sm:px-5 py-6">
      <SectionHeader
        title="Frequently Asked Questions"
        subtitle={`${faqs.length} questions`}
        icon={HelpCircle}
        theme={theme}
      />

      <div className="space-y-2.5">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, ...SPRING_CONFIG.gentle }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
          >
            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={() => toggleFAQ(idx)}
              className="w-full p-4 sm:p-5 flex items-start justify-between text-left gap-4"
            >
              <span className="font-semibold text-gray-900 text-sm leading-relaxed">{faq.q}</span>
              <motion.div
                animate={{ rotate: openIndex === idx ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 mt-0.5"
              >
                <ChevronDown size={18} className="text-gray-400" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <Link
        href="/m/support"
        onClick={() => haptic("light")}
        className="mt-4 w-full py-3.5 rounded-xl bg-gray-100 flex items-center justify-center gap-2 font-semibold text-sm text-gray-700 hover:bg-gray-200 transition-colors"
      >
        <MessageCircle size={18} />
        Still have questions? Contact Us
      </Link>
    </div>
  );
};

// =============================================================================
// CTA SECTION
// =============================================================================

const CTASectionComponent = ({ theme, category }) => {
  const haptic = useHapticFeedback();

  return (
    <div className="px-4 sm:px-5 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative p-6 sm:p-8 rounded-3xl overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              style={{
                left: `${(i * 15 + 5) % 100}%`,
                top: `${(i * 20 + 10) % 100}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 4 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {theme.emoji}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-4">
              <Sparkles size={16} />
              Limited Time Offer
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Ready to Start Planning?</h2>
            <p className="text-white/85 text-sm sm:text-base">Get 20% off on your first vendor booking</p>
          </motion.div>

          <div className="flex flex-col gap-3">
            <Link
              href="/m/vendors/marketplace"
              onClick={() => haptic("medium")}
              className="w-full py-4 bg-white rounded-2xl font-bold text-center flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg"
              style={{ color: theme.primary }}
            >
              Start Planning Now
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/m/support/call"
              onClick={() => haptic("light")}
              className="w-full py-4 bg-white/20 backdrop-blur-sm rounded-2xl font-bold text-white text-center flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Phone size={18} />
              Talk to Expert
            </Link>
          </div>

          <p className="text-center text-white/60 text-xs mt-4">No credit card required • Free consultation</p>
        </div>
      </motion.div>
    </div>
  );
};

// =============================================================================
// FLOATING ACTION BUTTON
// =============================================================================

const FloatingActionButtonComponent = ({ theme, category }) => {
  const [isOpen, setIsOpen] = useState(false);
  const haptic = useHapticFeedback();

  const actions = [
    { icon: MessageCircle, label: "Chat with Expert", href: "/m/support/chat", color: "#2563eb" },
    { icon: Phone, label: "Call Us", href: "tel:+919999999999", color: "#059669" },
    { icon: Calendar, label: "Schedule Call", href: "/m/support/schedule", color: "#d97706" },
    { icon: Sparkles, label: "Get Quote", href: "/m/quote", color: "#db2777" },
  ];

  const toggleOpen = useCallback(() => {
    haptic("light");
    setIsOpen((prev) => !prev);
  }, [haptic]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-[80] backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-28 right-4 z-[90] flex flex-col-reverse items-end gap-3">
        <AnimatePresence>
          {isOpen &&
            actions.map((action, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={{ delay: idx * 0.05, ...SPRING_CONFIG.snappy }}
                className="flex items-center gap-3"
              >
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: idx * 0.05 + 0.1 }}
                  className="px-3 py-2 bg-white rounded-xl shadow-lg text-sm font-semibold text-gray-700 whitespace-nowrap"
                >
                  {action.label}
                </motion.span>
                <Link
                  href={action.href}
                  onClick={() => {
                    haptic("medium");
                    setIsOpen(false);
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                  style={{ backgroundColor: action.color }}
                >
                  <action.icon size={20} className="text-white" />
                </Link>
              </motion.div>
            ))}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleOpen}
          animate={{ rotate: isOpen ? 45 : 0 }}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
          style={{ backgroundColor: theme.primary }}
        >
          {isOpen ? <X size={24} className="text-white" /> : <Plus size={24} className="text-white" />}
        </motion.button>
      </div>
    </>
  );
};

// =============================================================================
// SCROLL TO TOP BUTTON
// =============================================================================

const ScrollToTopButton = ({ theme }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const haptic = useHapticFeedback();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    haptic("light");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [haptic]);

  return (
    <AnimatePresence>
      {showScrollTop && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-28 left-4 z-50 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200"
          style={{ boxShadow: `0 4px 20px ${theme.glowColor}` }}
        >
          <ArrowUp size={20} style={{ color: theme.primary }} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function CategoryEventsPageWrapper() {
  const params = useParams();
  const setActiveCategory = useCategoryStore((state) => state.setActiveCategory);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get category from URL and normalize (handle Default/default cases)
  const categoryParam = (params?.category || "wedding").toLowerCase();
  const normalizedCategory = categoryParam === "default" ? "default" : categoryParam;
  const category = ["wedding", "anniversary", "birthday", "default"].includes(normalizedCategory)
    ? normalizedCategory
    : "default";

  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.default;

  // Update global state
  useEffect(() => {
    setActiveCategory(theme.name);
    setIsLoaded(true);
  }, [category, setActiveCategory, theme.name]);

  // Page transition loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-200 rounded-full"
          style={{ borderTopColor: theme.primary }}
        />
      </div>
    );
  }

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      {/* Scroll Progress */}
      <ScrollProgressBar theme={theme} />

      {/* Animated Background */}
      <AnimatedBackground theme={theme} />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Original Components */}
        <HeroSection theme={theme} category={category} />
        <Banner1 theme={theme} category={category} />
        <HowItWorksSection theme={theme} category={category} />

        {/* Quick Actions */}
        <AnimatedSection delay={0.05}>
          <QuickActionsSection theme={theme} category={category} />
        </AnimatedSection>

        {/* Countdown Timer */}
        <AnimatedSection delay={0.08}>
          <CountdownTimerSection theme={theme} category={category} />
        </AnimatedSection>

        {/* Vendor Categories */}
        <AnimatedSection delay={0.1}>
          <VendorCategoriesSection theme={theme} category={category} />
        </AnimatedSection>

        {/* Featured Vendors */}
        <AnimatedSection delay={0.12}>
          <FeaturedVendorsSection theme={theme} category={category} />
        </AnimatedSection>

        {/* Event Checklist */}
        <AnimatedSection delay={0.14}>
          <EventChecklistSection theme={theme} category={category} />
        </AnimatedSection>

        {/* Budget Planner */}
        <AnimatedSection delay={0.16}>
          <BudgetPlannerSection theme={theme} category={category} />
        </AnimatedSection>

        {/* Inspiration Gallery */}
        <AnimatedSection delay={0.18}>
          <InspirationGallerySection theme={theme} category={category} />
        </AnimatedSection>

        {/* Testimonials */}
        <AnimatedSection delay={0.2}>
          <TestimonialsSection theme={theme} category={category} />
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection delay={0.22}>
          <FAQSectionComponent theme={theme} category={category} />
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection delay={0.24}>
          <CTASectionComponent theme={theme} category={category} />
        </AnimatedSection>

        {/* Bottom Spacing for FAB and Navigation */}
        <div className="h-36" />
      </div>

      {/* Floating Action Button */}
      <FloatingActionButtonComponent theme={theme} category={category} />

      {/* Scroll to Top Button */}
      <ScrollToTopButton theme={theme} />

      {/* Global Styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @supports (padding: max(0px)) {
          .safe-bottom {
            padding-bottom: max(1rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </main>
  );
}
