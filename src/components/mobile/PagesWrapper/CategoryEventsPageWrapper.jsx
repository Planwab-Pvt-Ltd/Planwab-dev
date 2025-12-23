"use client";

import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView, LayoutGroup } from "framer-motion";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
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
  PieChart,
  Loader2,
  AlertCircle,
  CalendarDays,
  PartyPopper,
  Cake,
  BadgeCheck,
  ChevronUp,
  Send,
  Search,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Mail,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  Copy,
  Download,
  Eye,
  Settings,
  LogOut,
  Home,
  Info,
  FileText,
  DollarSign,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  Award,
  ShieldCheck,
  Headphones,
  Video,
  Image as ImageIcon,
  Mic,
  PlusCircle,
  MinusCircle,
  RotateCcw,
  Save,
  Undo,
  Redo,
} from "lucide-react";

// Original Components
import HeroSection from "@/components/mobile/ui/EventsPage/HeroSection";
import Banner1 from "@/components/mobile/ui/EventsPage/Banner1";
import HowItWorksSection from "@/components/mobile/ui/EventsPage/HowItWorks";

// =============================================================================
// SPRING CONFIGURATIONS - Ultra Smooth
// =============================================================================

const SPRING_CONFIGS = {
  // For quick, snappy interactions
  snappy: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
  // For gentle, flowing animations
  gentle: { type: "spring", stiffness: 120, damping: 20, mass: 1 },
  // For bouncy feedback
  bouncy: { type: "spring", stiffness: 500, damping: 25, mass: 0.5 },
  // For smooth transitions
  smooth: { type: "spring", stiffness: 200, damping: 25, mass: 1 },
  // For very slow, elegant animations
  elegant: { type: "spring", stiffness: 80, damping: 20, mass: 1.2 },
  // For modal/overlay transitions
  modal: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
  // For page transitions
  page: { type: "spring", stiffness: 100, damping: 20, mass: 1 },
};

const EASE_CONFIGS = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  smoothOut: [0.22, 1, 0.36, 1],
  smoothIn: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
};

// =============================================================================
// CONSTANTS & THEME CONFIG
// =============================================================================

const CATEGORY_THEMES = {
  wedding: {
    name: "Wedding",
    emoji: "💒",
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
    primary: "#be185d",
    primaryLight: "#ec4899",
    primaryDark: "#9d174d",
    secondary: "#fce7f3",
    secondaryDark: "#fbcfe8",
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
    primary: "#a16207",
    primaryLight: "#eab308",
    primaryDark: "#854d0e",
    secondary: "#fef9c3",
    secondaryDark: "#fef08a",
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

CATEGORY_THEMES.Default = CATEGORY_THEMES.default;

const VENDOR_CATEGORIES_DATA = {
  wedding: [
    {
      id: "venues",
      label: "Venues",
      icon: Building,
      count: "500+",
      color: "#7c3aed",
      description: "Find the perfect wedding venue",
    },
    {
      id: "photographers",
      label: "Photography",
      icon: Camera,
      count: "300+",
      color: "#db2777",
      description: "Capture every beautiful moment",
    },
    {
      id: "catering",
      label: "Catering",
      icon: Utensils,
      count: "250+",
      color: "#ea580c",
      description: "Delicious cuisine for your guests",
    },
    {
      id: "makeup",
      label: "Makeup",
      icon: Palette,
      count: "200+",
      color: "#e11d48",
      description: "Look stunning on your special day",
    },
    {
      id: "djs",
      label: "Music & DJ",
      icon: Music,
      count: "150+",
      color: "#2563eb",
      description: "Set the perfect mood",
    },
    {
      id: "mehendi",
      label: "Mehendi",
      icon: Scissors,
      count: "100+",
      color: "#65a30d",
      description: "Traditional henna artistry",
    },
    {
      id: "decor",
      label: "Decor",
      icon: Flower2,
      count: "180+",
      color: "#0d9488",
      description: "Transform your venue",
    },
    {
      id: "clothes",
      label: "Bridal Wear",
      icon: Crown,
      count: "220+",
      color: "#9333ea",
      description: "Designer wedding attire",
    },
  ],
  anniversary: [
    {
      id: "venues",
      label: "Venues",
      icon: Building,
      count: "300+",
      color: "#7c3aed",
      description: "Romantic celebration spots",
    },
    {
      id: "photographers",
      label: "Photography",
      icon: Camera,
      count: "200+",
      color: "#db2777",
      description: "Preserve your memories",
    },
    {
      id: "catering",
      label: "Catering",
      icon: Utensils,
      count: "180+",
      color: "#ea580c",
      description: "Fine dining experiences",
    },
    { id: "decor", label: "Decor", icon: Flower2, count: "120+", color: "#0d9488", description: "Elegant decorations" },
    { id: "djs", label: "Music", icon: Music, count: "100+", color: "#2563eb", description: "Romantic music setup" },
    {
      id: "gifts",
      label: "Gifts",
      icon: Gift,
      count: "80+",
      color: "#c026d3",
      description: "Thoughtful anniversary gifts",
    },
  ],
  birthday: [
    {
      id: "venues",
      label: "Venues",
      icon: Building,
      count: "400+",
      color: "#7c3aed",
      description: "Party venues for all ages",
    },
    {
      id: "catering",
      label: "Catering",
      icon: Utensils,
      count: "220+",
      color: "#ea580c",
      description: "Delicious party food",
    },
    {
      id: "photographers",
      label: "Photography",
      icon: Camera,
      count: "180+",
      color: "#db2777",
      description: "Fun party photos",
    },
    {
      id: "djs",
      label: "DJ & Music",
      icon: Music,
      count: "150+",
      color: "#2563eb",
      description: "Get the party started",
    },
    { id: "decor", label: "Decor", icon: Flower2, count: "130+", color: "#0d9488", description: "Themed decorations" },
    { id: "gifts", label: "Gifts", icon: Gift, count: "100+", color: "#c026d3", description: "Perfect birthday gifts" },
  ],
  default: [
    { id: "venues", label: "Venues", icon: Building, count: "500+", color: "#7c3aed", description: "Event venues" },
    {
      id: "photographers",
      label: "Photography",
      icon: Camera,
      count: "300+",
      color: "#db2777",
      description: "Event photography",
    },
    {
      id: "catering",
      label: "Catering",
      icon: Utensils,
      count: "250+",
      color: "#ea580c",
      description: "Catering services",
    },
    { id: "decor", label: "Decor", icon: Flower2, count: "180+", color: "#0d9488", description: "Event decoration" },
    { id: "djs", label: "Music", icon: Music, count: "150+", color: "#2563eb", description: "Music & entertainment" },
    { id: "gifts", label: "Gifts", icon: Gift, count: "100+", color: "#c026d3", description: "Gift services" },
  ],
};
VENDOR_CATEGORIES_DATA.Default = VENDOR_CATEGORIES_DATA.default;

const QUICK_ACTIONS_DATA = {
  wedding: [
    { icon: Calendar, label: "Set Date", color: "#e11d48", action: "date" },
    { icon: Users, label: "Guest List", color: "#7c3aed", action: "guests" },
    { icon: MapPin, label: "Find Venue", color: "#0891b2", action: "venue" },
    { icon: Wallet, label: "Budget", color: "#059669", action: "budget" },
    { icon: ClipboardList, label: "Checklist", color: "#d97706", action: "checklist" },
    { icon: Camera, label: "Photography", color: "#db2777", action: "vendors" },
    { icon: Music, label: "Music & DJ", color: "#2563eb", action: "vendors" },
    { icon: Utensils, label: "Catering", color: "#ea580c", action: "vendors" },
  ],
  anniversary: [
    { icon: Calendar, label: "Set Date", color: "#be185d", action: "date" },
    { icon: MapPin, label: "Find Venue", color: "#0891b2", action: "venue" },
    { icon: Wallet, label: "Budget", color: "#059669", action: "budget" },
    { icon: Camera, label: "Photography", color: "#db2777", action: "vendors" },
    { icon: Utensils, label: "Catering", color: "#ea580c", action: "vendors" },
    { icon: Music, label: "Music", color: "#2563eb", action: "vendors" },
    { icon: Gift, label: "Gifts", color: "#c026d3", action: "gifts" },
    { icon: Flower2, label: "Decor", color: "#0d9488", action: "vendors" },
  ],
  birthday: [
    { icon: Calendar, label: "Set Date", color: "#a16207", action: "date" },
    { icon: Users, label: "Guest List", color: "#7c3aed", action: "guests" },
    { icon: MapPin, label: "Find Venue", color: "#0891b2", action: "venue" },
    { icon: Wallet, label: "Budget", color: "#059669", action: "budget" },
    { icon: Camera, label: "Photography", color: "#db2777", action: "vendors" },
    { icon: Music, label: "DJ & Music", color: "#e11d48", action: "vendors" },
    { icon: Utensils, label: "Catering", color: "#ea580c", action: "vendors" },
    { icon: Cake, label: "Cake", color: "#f472b6", action: "cake" },
  ],
  default: [
    { icon: Calendar, label: "Set Date", color: "#1e40af", action: "date" },
    { icon: Users, label: "Guest List", color: "#7c3aed", action: "guests" },
    { icon: MapPin, label: "Find Venue", color: "#0891b2", action: "venue" },
    { icon: Wallet, label: "Budget", color: "#059669", action: "budget" },
    { icon: ClipboardList, label: "Checklist", color: "#d97706", action: "checklist" },
    { icon: Camera, label: "Photography", color: "#db2777", action: "vendors" },
    { icon: Music, label: "Music", color: "#2563eb", action: "vendors" },
    { icon: Utensils, label: "Catering", color: "#ea580c", action: "vendors" },
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

// Sample vendors data for in-page display
const SAMPLE_VENDORS = [
  {
    _id: "v1",
    name: "Royal Palace Banquets",
    category: "venues",
    rating: 4.9,
    reviews: 234,
    price: 150000,
    city: "Mumbai",
    images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400"],
    isVerified: true,
    tags: ["Popular", "Premium"],
  },
  {
    _id: "v2",
    name: "Snapshot Studios",
    category: "photographers",
    rating: 4.8,
    reviews: 189,
    price: 75000,
    city: "Delhi",
    images: ["https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400"],
    isVerified: true,
    tags: ["Top Rated"],
  },
  {
    _id: "v3",
    name: "Flavors Catering",
    category: "catering",
    rating: 4.7,
    reviews: 156,
    price: 800,
    city: "Bangalore",
    images: ["https://images.unsplash.com/photo-1555244162-803834f70033?w=400"],
    isVerified: true,
    tags: ["Popular"],
  },
  {
    _id: "v4",
    name: "Melody Makers DJ",
    category: "djs",
    rating: 4.9,
    reviews: 98,
    price: 25000,
    city: "Chennai",
    images: ["https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400"],
    isVerified: true,
    tags: ["Premium"],
  },
  {
    _id: "v5",
    name: "Bloom & Blossom Decor",
    category: "decor",
    rating: 4.6,
    reviews: 145,
    price: 50000,
    city: "Hyderabad",
    images: ["https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400"],
    isVerified: true,
    tags: ["Trending"],
  },
  {
    _id: "v6",
    name: "Glam Studio Makeup",
    category: "makeup",
    rating: 4.8,
    reviews: 203,
    price: 15000,
    city: "Pune",
    images: ["https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400"],
    isVerified: true,
    tags: ["Popular", "Top Rated"],
  },
];

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
// MODAL OVERLAY COMPONENT - Reusable
// =============================================================================

const ModalOverlay = memo(({ isOpen, onClose, children, title, subtitle }) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={SPRING_CONFIGS.modal}
            className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle for mobile */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 sm:hidden" />

            {/* Header */}
            {(title || subtitle) && (
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div>
                  {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
                  {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </motion.button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ModalOverlay.displayName = "ModalOverlay";

// =============================================================================
// TOAST NOTIFICATION COMPONENT
// =============================================================================

const Toast = memo(({ message, type = "success", isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <XCircle size={20} className="text-red-500" />,
    info: <Info size={20} className="text-blue-500" />,
    warning: <AlertCircle size={20} className="text-amber-500" />,
  };

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
    warning: "bg-amber-50 border-amber-200",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={SPRING_CONFIGS.snappy}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[300] px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 ${bgColors[type]}`}
        >
          {icons[type]}
          <span className="text-sm font-medium text-gray-800">{message}</span>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="p-1 hover:bg-black/5 rounded-full">
            <X size={16} className="text-gray-500" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Toast.displayName = "Toast";

// Toast Hook
function useToast() {
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ isVisible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return { toast, showToast, hideToast };
}

// =============================================================================
// ANIMATED BACKGROUND COMPONENT
// =============================================================================

const AnimatedBackground = memo(({ theme }) => {
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
});

AnimatedBackground.displayName = "AnimatedBackground";

// =============================================================================
// SCROLL PROGRESS BAR
// =============================================================================

const ScrollProgressBar = () => {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: progress > 2 ? 1 : 0 }}
    >
      <motion.div
        className={`h-full bg-gradient-to-r ${"from-blue-600 to-yellow-500"}`}
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
};

ScrollProgressBar.displayName = "ScrollProgressBar";

// =============================================================================
// ANIMATED SECTION WRAPPER
// =============================================================================

const AnimatedSection = memo(({ children, delay = 0, className = "" }) => {
  const { ref, hasBeenInView } = useInViewOnce();

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: EASE_CONFIGS.smoothOut,
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
});

AnimatedSection.displayName = "AnimatedSection";

// =============================================================================
// SECTION HEADER COMPONENT
// =============================================================================

const SectionHeader = memo(({ title, subtitle, icon: Icon, theme, actionLabel, onAction }) => {
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
      {actionLabel && onAction && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            haptic("light");
            onAction();
          }}
          className="text-sm font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: theme.primary, backgroundColor: `${theme.primary}08` }}
        >
          {actionLabel} <ChevronRight size={16} />
        </motion.button>
      )}
    </div>
  );
});

SectionHeader.displayName = "SectionHeader";

// =============================================================================
// DATE PICKER MODAL - Full Implementation
// =============================================================================

const DatePickerModal = memo(({ isOpen, onClose, onSave, currentDate, theme, eventType }) => {
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

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

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

  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onClose}
      title={`Select ${eventType} Date`}
      subtitle="Choose your special day"
    >
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
            style={{ "--tw-ring-color": theme.primary }}
          />
        </div>

        {/* Selected Date Display */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_CONFIGS.snappy}
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
      <div className="px-5 pb-5 pt-2 flex gap-3 border-t border-gray-100 mt-2">
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
    </ModalOverlay>
  );
});

DatePickerModal.displayName = "DatePickerModal";

// =============================================================================
// GUEST LIST MODAL - Full Implementation
// =============================================================================

const GuestListModal = memo(({ isOpen, onClose, theme, category }) => {
  const [guests, setGuests, isHydrated] = useLocalStorage(`${category}_guests`, []);
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [newGuestEmail, setNewGuestEmail] = useState("");
  const [editingGuest, setEditingGuest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const haptic = useHapticFeedback();
  const { toast, showToast, hideToast } = useToast();
  const inputRef = useRef(null);

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch =
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.phone?.includes(searchQuery) ||
        guest.email?.toLowerCase().includes(searchQuery.toLowerCase());

      if (filterStatus === "all") return matchesSearch;
      return matchesSearch && guest.status === filterStatus;
    });
  }, [guests, searchQuery, filterStatus]);

  const addGuest = useCallback(() => {
    if (!newGuestName.trim()) {
      showToast("Please enter guest name", "error");
      haptic("error");
      return;
    }

    haptic("success");
    const newGuest = {
      id: Date.now(),
      name: newGuestName.trim(),
      phone: newGuestPhone.trim(),
      email: newGuestEmail.trim(),
      status: "pending",
      addedAt: new Date().toISOString(),
    };

    setGuests((prev) => [...prev, newGuest]);
    setNewGuestName("");
    setNewGuestPhone("");
    setNewGuestEmail("");
    showToast("Guest added successfully!", "success");
  }, [newGuestName, newGuestPhone, newGuestEmail, haptic, setGuests, showToast]);

  const updateGuestStatus = useCallback(
    (id, status) => {
      haptic("light");
      setGuests((prev) => prev.map((guest) => (guest.id === id ? { ...guest, status } : guest)));
      showToast(`Guest marked as ${status}`, "success");
    },
    [haptic, setGuests, showToast]
  );

  const deleteGuest = useCallback(
    (id) => {
      haptic("medium");
      setGuests((prev) => prev.filter((guest) => guest.id !== id));
      showToast("Guest removed", "info");
    },
    [haptic, setGuests, showToast]
  );

  const stats = useMemo(() => {
    const confirmed = guests.filter((g) => g.status === "confirmed").length;
    const declined = guests.filter((g) => g.status === "declined").length;
    const pending = guests.filter((g) => g.status === "pending").length;
    return { total: guests.length, confirmed, declined, pending };
  }, [guests]);

  const statusColors = {
    confirmed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
    declined: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
    pending: { bg: "bg-amber-100", text: "text-amber-700", icon: Clock },
  };

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <ModalOverlay isOpen={isOpen} onClose={onClose} title="Guest List" subtitle={`${stats.total} guests total`}>
        <div className="p-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="p-3 bg-green-50 rounded-xl text-center">
              <p className="text-xl font-black text-green-700">{stats.confirmed}</p>
              <p className="text-xs text-green-600">Confirmed</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-center">
              <p className="text-xl font-black text-amber-700">{stats.pending}</p>
              <p className="text-xs text-amber-600">Pending</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl text-center">
              <p className="text-xl font-black text-red-700">{stats.declined}</p>
              <p className="text-xs text-red-600">Declined</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search guests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": theme.primary }}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 bg-gray-100 rounded-xl text-sm outline-none font-medium"
            >
              <option value="all">All</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          {/* Add New Guest */}
          <div className="mb-5 p-4 bg-gray-50 rounded-2xl">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Add New Guest</h4>
            <div className="space-y-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Guest Name *"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                className="w-full px-3 py-2.5 bg-white rounded-xl text-sm outline-none focus:ring-2 border border-gray-200"
                style={{ "--tw-ring-color": theme.primary }}
              />
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-white rounded-xl text-sm outline-none focus:ring-2 border border-gray-200"
                  style={{ "--tw-ring-color": theme.primary }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newGuestEmail}
                  onChange={(e) => setNewGuestEmail(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-white rounded-xl text-sm outline-none focus:ring-2 border border-gray-200"
                  style={{ "--tw-ring-color": theme.primary }}
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={addGuest}
                className="w-full py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
                style={{ backgroundColor: theme.primary }}
              >
                <Plus size={16} />
                Add Guest
              </motion.button>
            </div>
          </div>

          {/* Guest List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {filteredGuests.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <Users size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-500">No guests found</p>
                </motion.div>
              ) : (
                filteredGuests.map((guest, idx) => {
                  const StatusIcon = statusColors[guest.status]?.icon || Clock;
                  return (
                    <motion.div
                      key={guest.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ delay: idx * 0.02, ...SPRING_CONFIGS.snappy }}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-gray-600">{guest.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{guest.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {guest.phone || guest.email || "No contact info"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`px-2 py-1 rounded-lg flex items-center gap-1 ${statusColors[guest.status]?.bg}`}
                        >
                          <StatusIcon size={12} className={statusColors[guest.status]?.text} />
                          <span className={`text-xs font-medium capitalize ${statusColors[guest.status]?.text}`}>
                            {guest.status}
                          </span>
                        </div>
                        <div className="flex">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateGuestStatus(guest.id, "confirmed")}
                            className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                            title="Confirm"
                          >
                            <CheckCircle size={14} className="text-green-500" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateGuestStatus(guest.id, "declined")}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            title="Decline"
                          >
                            <XCircle size={14} className="text-red-500" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteGuest(guest.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} className="text-gray-400" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </ModalOverlay>
    </>
  );
});

GuestListModal.displayName = "GuestListModal";

// =============================================================================
// BUDGET MODAL - Full Implementation
// =============================================================================

const BudgetModal = memo(({ isOpen, onClose, theme, category }) => {
  const [budget, setBudget, isHydrated] = useLocalStorage(
    `${category}_budget`,
    DEFAULT_BUDGET_DATA[category] || DEFAULT_BUDGET_DATA.default
  );
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryAmount, setNewCategoryAmount] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editTotalBudget, setEditTotalBudget] = useState(false);
  const [tempTotal, setTempTotal] = useState("");
  const haptic = useHapticFeedback();
  const { toast, showToast, hideToast } = useToast();

  const totalSpent = useMemo(
    () => budget.categories.reduce((sum, cat) => sum + (cat.spent || 0), 0),
    [budget.categories]
  );

  const totalAllocated = useMemo(
    () => budget.categories.reduce((sum, cat) => sum + (cat.allocated || 0), 0),
    [budget.categories]
  );

  const remaining = budget.total - totalSpent;
  const spentPercentage = budget.total > 0 ? (totalSpent / budget.total) * 100 : 0;

  const updateCategorySpent = useCallback(
    (index, newSpent) => {
      haptic("light");
      const spent = parseFloat(newSpent) || 0;
      setBudget((prev) => ({
        ...prev,
        categories: prev.categories.map((cat, i) => (i === index ? { ...cat, spent } : cat)),
      }));
    },
    [haptic, setBudget]
  );

  const updateCategoryAllocated = useCallback(
    (index, newAllocated) => {
      haptic("light");
      const allocated = parseFloat(newAllocated) || 0;
      setBudget((prev) => ({
        ...prev,
        categories: prev.categories.map((cat, i) => (i === index ? { ...cat, allocated } : cat)),
      }));
    },
    [haptic, setBudget]
  );

  const addCategory = useCallback(() => {
    if (!newCategoryName.trim() || !newCategoryAmount) {
      showToast("Please fill all fields", "error");
      haptic("error");
      return;
    }

    haptic("success");
    const colors = ["#7c3aed", "#db2777", "#ea580c", "#0d9488", "#2563eb", "#059669", "#d97706"];
    const newCat = {
      name: newCategoryName.trim(),
      allocated: parseFloat(newCategoryAmount),
      spent: 0,
      color: colors[budget.categories.length % colors.length],
    };

    setBudget((prev) => ({
      ...prev,
      categories: [...prev.categories, newCat],
    }));

    setNewCategoryName("");
    setNewCategoryAmount("");
    setIsAddingCategory(false);
    showToast("Category added!", "success");
  }, [newCategoryName, newCategoryAmount, haptic, setBudget, budget.categories.length, showToast]);

  const deleteCategory = useCallback(
    (index) => {
      haptic("medium");
      setBudget((prev) => ({
        ...prev,
        categories: prev.categories.filter((_, i) => i !== index),
      }));
      showToast("Category removed", "info");
    },
    [haptic, setBudget, showToast]
  );

  const updateTotalBudget = useCallback(() => {
    const newTotal = parseFloat(tempTotal) || budget.total;
    haptic("success");
    setBudget((prev) => ({ ...prev, total: newTotal }));
    setEditTotalBudget(false);
    showToast("Budget updated!", "success");
  }, [tempTotal, haptic, setBudget, budget.total, showToast]);

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <ModalOverlay isOpen={isOpen} onClose={onClose} title="Budget Planner" subtitle="Track your expenses">
        <div className="p-5">
          {/* Total Budget */}
          <div className="mb-5 p-4 rounded-2xl" style={{ backgroundColor: `${theme.primary}08` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Total Budget</span>
              {editTotalBudget ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tempTotal}
                    onChange={(e) => setTempTotal(e.target.value)}
                    placeholder={budget.total.toString()}
                    className="w-32 px-2 py-1 text-right text-lg font-bold bg-white rounded-lg border outline-none"
                    autoFocus
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={updateTotalBudget}
                    className="p-1.5 bg-green-500 text-white rounded-lg"
                  >
                    <Check size={14} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditTotalBudget(false)}
                    className="p-1.5 bg-gray-200 rounded-lg"
                  >
                    <X size={14} />
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black" style={{ color: theme.primary }}>
                    {formatCurrency(budget.total)}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setTempTotal(budget.total.toString());
                      setEditTotalBudget(true);
                    }}
                    className="p-1.5 bg-white rounded-lg shadow-sm"
                  >
                    <Edit3 size={14} className="text-gray-500" />
                  </motion.button>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-white rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: remaining < 0 ? "#dc2626" : theme.primary }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(spentPercentage, 100)}%` }}
                transition={{ duration: 0.8, ease: EASE_CONFIGS.smoothOut }}
              />
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-gray-500">
                Spent:{" "}
                <span className={`font-semibold ${remaining < 0 ? "text-red-600" : "text-gray-900"}`}>
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
          <div className="space-y-3 mb-5">
            <AnimatePresence mode="popLayout">
              {budget.categories.map((cat, idx) => {
                const catPercent = cat.allocated > 0 ? (cat.spent / cat.allocated) * 100 : 0;
                const isOver = cat.spent > cat.allocated;

                return (
                  <motion.div
                    key={`${cat.name}-${idx}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: idx * 0.03, ...SPRING_CONFIGS.snappy }}
                    className="p-3 bg-white rounded-xl border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="font-semibold text-gray-900 text-sm">{cat.name}</span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteCategory(idx)}
                        className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                      </motion.button>
                    </div>

                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: isOver ? "#dc2626" : cat.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(catPercent, 100)}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Spent:</span>
                        <input
                          type="number"
                          value={cat.spent || ""}
                          onChange={(e) => updateCategorySpent(idx, e.target.value)}
                          placeholder="0"
                          className="w-20 px-2 py-1 text-xs font-medium bg-gray-50 rounded-lg outline-none focus:ring-1"
                          style={{ "--tw-ring-color": cat.color }}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Budget:</span>
                        <input
                          type="number"
                          value={cat.allocated || ""}
                          onChange={(e) => updateCategoryAllocated(idx, e.target.value)}
                          placeholder="0"
                          className="w-20 px-2 py-1 text-xs font-medium bg-gray-50 rounded-lg outline-none focus:ring-1"
                          style={{ "--tw-ring-color": cat.color }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Add Category */}
          {isAddingCategory ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-gray-50 rounded-xl mb-4"
            >
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white rounded-xl text-sm outline-none focus:ring-2 border border-gray-200"
                  style={{ "--tw-ring-color": theme.primary }}
                  autoFocus
                />
                <input
                  type="number"
                  placeholder="Allocated Amount"
                  value={newCategoryAmount}
                  onChange={(e) => setNewCategoryAmount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white rounded-xl text-sm outline-none focus:ring-2 border border-gray-200"
                  style={{ "--tw-ring-color": theme.primary }}
                />
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={addCategory}
                    className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm"
                    style={{ backgroundColor: theme.primary }}
                  >
                    Add Category
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryName("");
                      setNewCategoryAmount("");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gray-200 font-semibold text-sm text-gray-600"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddingCategory(true)}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium text-sm flex items-center justify-center gap-2 hover:border-gray-300 hover:text-gray-500 transition-colors"
            >
              <Plus size={16} /> Add Budget Category
            </motion.button>
          )}
        </div>
      </ModalOverlay>
    </>
  );
});

BudgetModal.displayName = "BudgetModal";

// =============================================================================
// CHECKLIST MODAL - Full Implementation
// =============================================================================

const ChecklistModal = memo(({ isOpen, onClose, theme, category }) => {
  const [checklist, setChecklist, isHydrated] = useLocalStorage(
    `${category}_checklist`,
    DEFAULT_CHECKLIST_DATA[category] || DEFAULT_CHECKLIST_DATA.default
  );
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const inputRef = useRef(null);
  const haptic = useHapticFeedback();
  const { toast, showToast, hideToast } = useToast();

  const filteredChecklist = useMemo(() => {
    return checklist.filter((task) => {
      if (!showCompleted && task.completed) return false;
      if (filterPriority === "all") return true;
      return task.priority === filterPriority;
    });
  }, [checklist, filterPriority, showCompleted]);

  const stats = useMemo(() => {
    const completed = checklist.filter((t) => t.completed).length;
    const total = checklist.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return { completed, total, progress };
  }, [checklist]);

  const toggleTask = useCallback(
    (id) => {
      haptic("light");
      setChecklist((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
    },
    [haptic, setChecklist]
  );

  const addTask = useCallback(() => {
    if (!newTask.trim()) {
      showToast("Please enter a task", "error");
      haptic("error");
      return;
    }

    haptic("success");
    setChecklist((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        priority: newTaskPriority,
        category: "custom",
        addedAt: new Date().toISOString(),
      },
    ]);
    setNewTask("");
    setIsAddingTask(false);
    showToast("Task added!", "success");
  }, [newTask, newTaskPriority, haptic, setChecklist, showToast]);

  const deleteTask = useCallback(
    (id) => {
      haptic("medium");
      setChecklist((prev) => prev.filter((task) => task.id !== id));
      showToast("Task removed", "info");
    },
    [haptic, setChecklist, showToast]
  );

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
    showToast("Task updated!", "success");
  }, [editingText, editingTaskId, haptic, setChecklist, showToast]);

  const clearCompleted = useCallback(() => {
    haptic("medium");
    setChecklist((prev) => prev.filter((task) => !task.completed));
    showToast("Completed tasks cleared", "info");
  }, [haptic, setChecklist, showToast]);

  const priorityColors = {
    high: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
    medium: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
    low: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  };

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <ModalOverlay
        isOpen={isOpen}
        onClose={onClose}
        title="Planning Checklist"
        subtitle={`${stats.completed}/${stats.total} completed`}
      >
        <div className="p-5">
          {/* Progress */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progress</span>
              <span className="text-sm font-bold" style={{ color: theme.primary }}>
                {Math.round(stats.progress)}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: theme.primary }}
                initial={{ width: 0 }}
                animate={{ width: `${stats.progress}%` }}
                transition={{ duration: 0.8, ease: EASE_CONFIGS.smoothOut }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterPriority("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterPriority === "all" ? "text-white" : "bg-gray-100 text-gray-600"
              }`}
              style={filterPriority === "all" ? { backgroundColor: theme.primary } : {}}
            >
              All Tasks
            </motion.button>
            {["high", "medium", "low"].map((priority) => (
              <motion.button
                key={priority}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterPriority(priority)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                  filterPriority === priority
                    ? priorityColors[priority].bg + " " + priorityColors[priority].text
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {priority}
              </motion.button>
            ))}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCompleted(!showCompleted)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                showCompleted ? "bg-gray-100 text-gray-600" : "bg-gray-800 text-white"
              }`}
            >
              {showCompleted ? "Hide Done" : "Show Done"}
            </motion.button>
          </div>

          {/* Task List */}
          <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
            <AnimatePresence mode="popLayout">
              {filteredChecklist.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <ClipboardList size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-500">No tasks found</p>
                </motion.div>
              ) : (
                filteredChecklist.map((task, idx) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50, height: 0 }}
                    transition={{ delay: idx * 0.02, ...SPRING_CONFIGS.snappy }}
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
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={SPRING_CONFIGS.bouncy}
                          >
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
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setEditingTaskId(null);
                              setEditingText("");
                            }}
                            className="p-1.5 text-gray-400"
                          >
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
                        <div
                          className={`w-2 h-2 rounded-full ${priorityColors[task.priority]?.dot || "bg-gray-400"}`}
                          title={`${task.priority} priority`}
                        />
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setEditingTaskId(task.id);
                            setEditingText(task.text);
                          }}
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
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Add Task */}
          {isAddingTask ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-gray-50 rounded-xl"
            >
              <div className="space-y-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Task description..."
                  maxLength={100}
                  className="w-full px-3 py-2.5 bg-white rounded-xl text-sm outline-none focus:ring-2 border border-gray-200"
                  style={{ "--tw-ring-color": theme.primary }}
                  onKeyPress={(e) => e.key === "Enter" && addTask()}
                  autoFocus
                />
                <div className="flex gap-2">
                  {["high", "medium", "low"].map((priority) => (
                    <motion.button
                      key={priority}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNewTaskPriority(priority)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                        newTaskPriority === priority
                          ? priorityColors[priority].bg + " " + priorityColors[priority].text
                          : "bg-white text-gray-500 border border-gray-200"
                      }`}
                    >
                      {priority}
                    </motion.button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={addTask}
                    className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm"
                    style={{ backgroundColor: theme.primary }}
                  >
                    Add Task
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsAddingTask(false);
                      setNewTask("");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gray-200 font-semibold text-sm text-gray-600"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddingTask(true)}
                className="flex-1 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium text-sm flex items-center justify-center gap-2 hover:border-gray-300 hover:text-gray-500 transition-colors"
              >
                <Plus size={16} /> Add Task
              </motion.button>
              {stats.completed > 0 && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={clearCompleted}
                  className="px-4 py-3 bg-red-50 rounded-xl text-red-600 font-medium text-sm flex items-center gap-1"
                >
                  <Trash2 size={14} /> Clear Done
                </motion.button>
              )}
            </div>
          )}
        </div>
      </ModalOverlay>
    </>
  );
});

ChecklistModal.displayName = "ChecklistModal";

// =============================================================================
// VENDOR BROWSER MODAL - Full Implementation
// =============================================================================

const VendorBrowserModal = memo(({ isOpen, onClose, theme, category, initialCategory = null }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useLocalStorage("favorite_vendors", []);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const haptic = useHapticFeedback();
  const { toast, showToast, hideToast } = useToast();

  const vendorCategories = VENDOR_CATEGORIES_DATA[category] || VENDOR_CATEGORIES_DATA.default;

  const filteredVendors = useMemo(() => {
    let vendors = SAMPLE_VENDORS;

    if (selectedCategory) {
      vendors = vendors.filter((v) => v.category === selectedCategory);
    }

    if (searchQuery) {
      vendors = vendors.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === "rating") {
      vendors = [...vendors].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price") {
      vendors = [...vendors].sort((a, b) => a.price - b.price);
    } else if (sortBy === "reviews") {
      vendors = [...vendors].sort((a, b) => b.reviews - a.reviews);
    }

    return vendors;
  }, [selectedCategory, searchQuery, sortBy]);

  const toggleFavorite = useCallback(
    (id, e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      haptic("medium");
      setFavorites((prev) => (prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]));
      showToast(
        favorites.includes(id) ? "Removed from favorites" : "Added to favorites!",
        favorites.includes(id) ? "info" : "success"
      );
    },
    [haptic, setFavorites, favorites, showToast]
  );

  const handleContact = useCallback(
    (vendor) => {
      haptic("medium");
      showToast(`Contacting ${vendor.name}...`, "info");
      // Simulate contact action
      setTimeout(() => {
        showToast("Contact request sent!", "success");
      }, 1500);
    },
    [haptic, showToast]
  );

  const handleBook = useCallback(
    (vendor) => {
      haptic("medium");
      showToast(`Booking request for ${vendor.name}`, "success");
    },
    [haptic, showToast]
  );

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <ModalOverlay
        isOpen={isOpen}
        onClose={() => {
          setSelectedVendor(null);
          setSelectedCategory(null);
          onClose();
        }}
        title={selectedVendor ? selectedVendor.name : "Browse Vendors"}
        subtitle={selectedVendor ? selectedVendor.category : `${filteredVendors.length} vendors available`}
      >
        {selectedVendor ? (
          // Vendor Detail View
          <div className="p-5">
            <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
              <img src={selectedVendor.images[0]} alt={selectedVendor.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {selectedVendor.tags?.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-white/90 text-xs font-semibold rounded-md text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => toggleFavorite(selectedVendor._id, e)}
                    className="p-2 bg-white/90 rounded-full"
                  >
                    <Heart
                      size={18}
                      className={
                        favorites.includes(selectedVendor._id) ? "fill-rose-500 text-rose-500" : "text-gray-600"
                      }
                    />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedVendor.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-gray-800">{selectedVendor.rating}</span>
                      <span className="text-xs text-gray-500">({selectedVendor.reviews} reviews)</span>
                    </div>
                    {selectedVendor.isVerified && (
                      <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                        <BadgeCheck size={12} /> Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black" style={{ color: theme.primary }}>
                    {formatPrice(selectedVendor.price)}
                  </p>
                  <p className="text-xs text-gray-500">starting price</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>{selectedVendor.city}</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedVendor.name} is one of the top-rated {selectedVendor.category} providers in{" "}
                  {selectedVendor.city}. With excellent reviews and professional service, they're perfect for your{" "}
                  {theme.name.toLowerCase()}.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleContact(selectedVendor)}
                  className="flex-1 py-3.5 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2"
                  style={{ borderColor: theme.primary, color: theme.primary }}
                >
                  <Phone size={18} />
                  Contact
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBook(selectedVendor)}
                  className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Calendar size={18} />
                  Book Now
                </motion.button>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedVendor(null)}
                className="w-full py-3 text-gray-500 font-medium text-sm flex items-center justify-center gap-1"
              >
                <ChevronLeft size={16} />
                Back to vendors
              </motion.button>
            </div>
          </div>
        ) : (
          // Vendor List View
          <div className="p-5">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": theme.primary }}
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  !selectedCategory ? "text-white" : "bg-gray-100 text-gray-600"
                }`}
                style={!selectedCategory ? { backgroundColor: theme.primary } : {}}
              >
                All
              </motion.button>
              {vendorCategories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex items-center gap-2 transition-colors ${
                    selectedCategory === cat.id ? "text-white" : "bg-gray-100 text-gray-600"
                  }`}
                  style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
                >
                  <cat.icon size={14} />
                  {cat.label}
                </motion.button>
              ))}
            </div>

            {/* Sort & View Toggle */}
            <div className="flex items-center justify-between mb-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-gray-100 rounded-lg text-sm outline-none font-medium"
              >
                <option value="rating">Top Rated</option>
                <option value="price">Price: Low to High</option>
                <option value="reviews">Most Reviews</option>
              </select>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                >
                  <Grid3X3 size={16} className={viewMode === "grid" ? "text-gray-900" : "text-gray-400"} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                >
                  <List size={16} className={viewMode === "list" ? "text-gray-900" : "text-gray-400"} />
                </motion.button>
              </div>
            </div>

            {/* Vendors Grid/List */}
            <div className={`${viewMode === "grid" ? "grid grid-cols-2 gap-3" : "space-y-3"} max-h-96 overflow-y-auto`}>
              <AnimatePresence mode="popLayout">
                {filteredVendors.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-2 text-center py-12"
                  >
                    <Search size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">No vendors found</p>
                  </motion.div>
                ) : (
                  filteredVendors.map((vendor, idx) => (
                    <motion.div
                      key={vendor._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.03, ...SPRING_CONFIGS.snappy }}
                      onClick={() => {
                        haptic("light");
                        setSelectedVendor(vendor);
                      }}
                      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
                        viewMode === "list" ? "flex" : ""
                      }`}
                    >
                      <div className={`relative ${viewMode === "list" ? "w-24 h-24 shrink-0" : "h-28"}`}>
                        <img
                          src={vendor.images[0]}
                          alt={vendor.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={(e) => toggleFavorite(vendor._id, e)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full"
                        >
                          <Heart
                            size={12}
                            className={favorites.includes(vendor._id) ? "fill-rose-500 text-rose-500" : "text-gray-500"}
                          />
                        </motion.button>
                      </div>
                      <div className={`p-3 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <h4 className="font-bold text-gray-900 text-sm truncate">{vendor.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-gray-700">{vendor.rating}</span>
                          <span className="text-[10px] text-gray-400">({vendor.reviews})</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold" style={{ color: theme.primary }}>
                            {formatPrice(vendor.price)}
                          </span>
                          <span className="text-[10px] text-gray-400">{vendor.city}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </ModalOverlay>
    </>
  );
});

VendorBrowserModal.displayName = "VendorBrowserModal";

// =============================================================================
// CONTACT/SUPPORT MODAL - Full Implementation
// =============================================================================

const ContactModal = memo(({ isOpen, onClose, theme, contactType = "chat" }) => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hello! How can I help you with your event planning today?", time: "Just now" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const haptic = useHapticFeedback();
  const { toast, showToast, hideToast } = useToast();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (!message.trim()) return;

    haptic("light");
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      const botResponses = [
        "That's a great question! Let me help you with that.",
        "I understand. Here's what I recommend for your event...",
        "Perfect! Our team will get back to you shortly.",
        "Thanks for reaching out! We have excellent options for you.",
      ];
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1500);
  }, [message, haptic]);

  const submitContactForm = useCallback(() => {
    if (!name.trim() || !email.trim()) {
      showToast("Please fill in required fields", "error");
      haptic("error");
      return;
    }

    haptic("success");
    showToast("Message sent! We'll contact you soon.", "success");
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");

    setTimeout(() => {
      onClose();
    }, 2000);
  }, [name, email, haptic, showToast, onClose]);

  const scheduleCall = useCallback(() => {
    haptic("success");
    showToast("Call scheduled! You'll receive a confirmation.", "success");
  }, [haptic, showToast]);

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <ModalOverlay
        isOpen={isOpen}
        onClose={onClose}
        title={contactType === "chat" ? "Chat Support" : contactType === "call" ? "Schedule a Call" : "Get a Quote"}
        subtitle={
          contactType === "chat"
            ? "We're here to help"
            : contactType === "call"
            ? "Book a free consultation"
            : "Get personalized pricing"
        }
      >
        {contactType === "chat" ? (
          // Chat Interface
          <div className="flex flex-col h-96">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ ...SPRING_CONFIGS.snappy }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                        msg.sender === "user" ? "rounded-br-sm text-white" : "rounded-bl-sm bg-gray-100 text-gray-800"
                      }`}
                      style={msg.sender === "user" ? { backgroundColor: theme.primary } : {}}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-white/70" : "text-gray-400"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2"
                  style={{ "--tw-ring-color": theme.primary }}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  className="p-3 rounded-xl text-white"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        ) : contactType === "call" ? (
          // Schedule Call Interface
          <div className="p-5 space-y-4">
            <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: `${theme.primary}08` }}>
              <Phone size={40} style={{ color: theme.primary }} className="mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Free Consultation</h3>
              <p className="text-sm text-gray-500">Speak with our event planning experts</p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2"
                style={{ "--tw-ring-color": theme.primary }}
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2"
                style={{ "--tw-ring-color": theme.primary }}
              />
              <select className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none font-medium">
                <option>Select preferred time</option>
                <option>Morning (9 AM - 12 PM)</option>
                <option>Afternoon (12 PM - 5 PM)</option>
                <option>Evening (5 PM - 8 PM)</option>
              </select>
              <textarea
                placeholder="Tell us about your event..."
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 resize-none"
                style={{ "--tw-ring-color": theme.primary }}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={scheduleCall}
              className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg"
              style={{ backgroundColor: theme.primary }}
            >
              <Phone size={18} />
              Schedule Call
            </motion.button>

            <p className="text-center text-xs text-gray-400">We'll call you at your preferred time</p>
          </div>
        ) : (
          // Quote Form Interface
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2"
                style={{ "--tw-ring-color": theme.primary }}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2"
                style={{ "--tw-ring-color": theme.primary }}
              />
            </div>
            <input
              type="email"
              placeholder="Email Address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2"
              style={{ "--tw-ring-color": theme.primary }}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2"
              style={{ "--tw-ring-color": theme.primary }}
            />
            <select className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none font-medium">
              <option>Select event type</option>
              <option>Wedding</option>
              <option>Anniversary</option>
              <option>Birthday</option>
              <option>Corporate Event</option>
              <option>Other</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Guest Count"
                className="px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2"
                style={{ "--tw-ring-color": theme.primary }}
              />
              <input
                type="number"
                placeholder="Budget (₹)"
                className="px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2"
                style={{ "--tw-ring-color": theme.primary }}
              />
            </div>
            <textarea
              placeholder="Additional requirements..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 resize-none"
              style={{ "--tw-ring-color": theme.primary }}
            />

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={submitContactForm}
              className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg"
              style={{ backgroundColor: theme.primary }}
            >
              <Sparkles size={18} />
              Get Free Quote
            </motion.button>
          </div>
        )}
      </ModalOverlay>
    </>
  );
});

ContactModal.displayName = "ContactModal";

// =============================================================================
// QUICK ACTIONS SECTION - Updated
// =============================================================================

const QuickActionsSection = memo(({ theme, category, onAction }) => {
  const haptic = useHapticFeedback();
  const actions = QUICK_ACTIONS_DATA[category] || QUICK_ACTIONS_DATA.default;

  return (
    <div className="px-4 sm:px-5 py-6">
      <SectionHeader title="Quick Actions" subtitle="Get started quickly" icon={Sparkles} theme={theme} />

      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {actions.slice(0, 8).map((action, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.04, ...SPRING_CONFIGS.gentle }}
            onClick={() => {
              haptic("light");
              onAction(action.action, action.label);
            }}
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
          </motion.button>
        ))}
      </div>
    </div>
  );
});

QuickActionsSection.displayName = "QuickActionsSection";

// =============================================================================
// COUNTDOWN TIMER SECTION
// =============================================================================

const CountdownTimerSection = memo(({ theme, category, onOpenDatePicker }) => {
  const [eventDate, setEventDate, isHydrated] = useLocalStorage(`${category}_event_date`, null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const haptic = useHapticFeedback();
  const { toast, showToast, hideToast } = useToast();

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

  const handleClearDate = useCallback(() => {
    haptic("medium");
    setEventDate(null);
    showToast("Date cleared", "info");
  }, [setEventDate, haptic, showToast]);

  const handleShare = useCallback(async () => {
    haptic("light");
    const text = `I'm planning my ${theme.name}! ${getDaysUntil(eventDate)} days to go! 🎉`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        // Share cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!", "success");
    }
  }, [eventDate, theme.name, haptic, showToast]);

  const handleSetReminder = useCallback(() => {
    haptic("light");
    showToast("Reminder set! We'll notify you.", "success");
  }, [haptic, showToast]);

  const TimeBlock = memo(({ value, label, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ...SPRING_CONFIGS.gentle }}
      className="flex flex-col items-center"
    >
      <motion.div
        key={value}
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
  ));

  TimeBlock.displayName = "TimeBlock";

  if (!isHydrated) {
    return (
      <div className="px-4 sm:px-5 py-4">
        <div className="animate-pulse bg-gray-200 rounded-3xl h-48" />
      </div>
    );
  }

  if (!eventDate) {
    return (
      <>
        <Toast {...toast} onClose={hideToast} />
        <div className="px-4 sm:px-5 py-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onOpenDatePicker}
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
        </div>
      </>
    );
  }

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
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
                  onClick={onOpenDatePicker}
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
                    onClick={handleSetReminder}
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
      </div>
    </>
  );
});

CountdownTimerSection.displayName = "CountdownTimerSection";

// =============================================================================
// VENDOR CATEGORIES SECTION - Updated
// =============================================================================

const VendorCategoriesSection = memo(({ theme, category, onViewVendors }) => {
  const haptic = useHapticFeedback();
  const categories = VENDOR_CATEGORIES_DATA[category] || VENDOR_CATEGORIES_DATA.default;

  return (
    <div className="px-4 sm:px-5 py-6">
      <SectionHeader
        title="Browse Vendors"
        subtitle={`${categories.length} categories available`}
        icon={Building}
        theme={theme}
        actionLabel="See All"
        onAction={() => onViewVendors(null)}
      />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {categories.map((cat, idx) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: idx * 0.05, ...SPRING_CONFIGS.gentle }}
            onClick={() => {
              haptic("light");
              onViewVendors(cat.id);
            }}
            className="flex items-center gap-3 p-3.5 sm:p-4 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-all duration-200 hover:shadow-md text-left"
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
          </motion.button>
        ))}
      </div>
    </div>
  );
});

VendorCategoriesSection.displayName = "VendorCategoriesSection";

// =============================================================================
// FEATURED VENDORS SECTION - Updated
// =============================================================================

const FeaturedVendorsSection = memo(({ theme, category, onViewVendor, onViewAll }) => {
  const [favorites, setFavorites] = useLocalStorage("favorite_vendors", []);
  const scrollRef = useRef(null);
  const haptic = useHapticFeedback();
  const { toast, showToast, hideToast } = useToast();

  const toggleFavorite = useCallback(
    (id, e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      haptic("medium");
      const isFav = favorites.includes(id);
      setFavorites((prev) => (isFav ? prev.filter((fid) => fid !== id) : [...prev, id]));
      showToast(isFav ? "Removed from favorites" : "Added to favorites!", isFav ? "info" : "success");
    },
    [haptic, setFavorites, favorites, showToast]
  );

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <div className="py-6">
        <div className="px-4 sm:px-5">
          <SectionHeader
            title="Featured Vendors"
            subtitle="Top-rated professionals"
            icon={Sparkles}
            theme={theme}
            actionLabel="View All"
            onAction={onViewAll}
          />
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-5 pb-2 scrollbar-hide snap-x snap-mandatory"
        >
          {SAMPLE_VENDORS.map((vendor, idx) => (
            <motion.div
              key={vendor._id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, ...SPRING_CONFIGS.gentle }}
              className="w-56 sm:w-64 shrink-0 snap-start"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  haptic("light");
                  onViewVendor(vendor);
                }}
                className="block w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow text-left"
              >
                <div className="relative h-36 sm:h-40">
                  <img src={vendor.images[0]} alt={vendor.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    {vendor.tags?.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 text-[9px] font-bold rounded-md shadow-sm ${
                          tag === "Popular"
                            ? "bg-amber-400 text-amber-900"
                            : tag === "Premium"
                            ? "bg-purple-500 text-white"
                            : tag === "Top Rated"
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => toggleFavorite(vendor._id, e)}
                    className="absolute top-2.5 right-2.5 p-2 bg-white/95 rounded-full shadow-sm"
                  >
                    <Heart
                      size={16}
                      className={favorites.includes(vendor._id) ? "fill-rose-500 text-rose-500" : "text-gray-600"}
                    />
                  </motion.div>

                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/95 px-2 py-1 rounded-lg shadow-sm">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-gray-800">{vendor.rating?.toFixed(1)}</span>
                    <span className="text-[10px] text-gray-500">({vendor.reviews})</span>
                  </div>
                </div>

                <div className="p-3 sm:p-3.5">
                  <h3 className="font-bold text-gray-900 text-sm truncate mb-1">{vendor.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-2.5">
                    <MapPin size={12} />
                    <span className="truncate">{vendor.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold" style={{ color: theme.primary }}>
                      {formatPrice(vendor.price)}
                    </span>
                    <span className="text-[10px] text-gray-400 capitalize px-2 py-1 bg-gray-100 rounded-md">
                      {vendor.category}
                    </span>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
});

FeaturedVendorsSection.displayName = "FeaturedVendorsSection";

// =============================================================================
// CHECKLIST PREVIEW SECTION
// =============================================================================

const ChecklistPreviewSection = memo(({ theme, category, onOpenFullChecklist }) => {
  const [checklist, setChecklist, isHydrated] = useLocalStorage(
    `${category}_checklist`,
    DEFAULT_CHECKLIST_DATA[category] || DEFAULT_CHECKLIST_DATA.default
  );
  const haptic = useHapticFeedback();

  const toggleTask = useCallback(
    (id) => {
      haptic("light");
      setChecklist((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
    },
    [haptic, setChecklist]
  );

  if (!isHydrated) {
    return (
      <div className="px-4 sm:px-5 py-6">
        <div className="animate-pulse bg-gray-200 rounded-3xl h-64" />
      </div>
    );
  }

  const completedCount = checklist.filter((t) => t.completed).length;
  const progress = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;
  const displayedTasks = checklist.slice(0, 4);

  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-green-500",
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
            <span className="text-sm font-bold" style={{ color: theme.primary }}>
              {completedCount}/{checklist.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: theme.primary }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: EASE_CONFIGS.smoothOut }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 text-right">{Math.round(progress)}% complete</p>
        </div>

        {/* Preview Tasks */}
        <div className="p-4 sm:p-5 space-y-2.5">
          {displayedTasks.map((task, idx) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, ...SPRING_CONFIGS.snappy }}
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
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={SPRING_CONFIGS.bouncy}
                    >
                      <Check size={14} className="text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium transition-colors ${
                    task.completed ? "text-gray-400 line-through" : "text-gray-900"
                  }`}
                >
                  {task.text}
                </p>
              </div>

              <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority] || "bg-gray-400"}`} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            haptic("light");
            onOpenFullChecklist();
          }}
          className="w-full py-3.5 border-t border-gray-100 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors"
          style={{ color: theme.primary }}
        >
          View All Tasks <ChevronRight size={16} />
        </motion.button>
      </motion.div>
    </div>
  );
});

ChecklistPreviewSection.displayName = "ChecklistPreviewSection";

// =============================================================================
// BUDGET PREVIEW SECTION
// =============================================================================

const BudgetPreviewSection = memo(({ theme, category, onOpenFullBudget }) => {
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
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                haptic("light");
                onOpenFullBudget();
              }}
              className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Edit2 size={16} className="text-gray-600" />
            </motion.button>
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
                transition={{ duration: 0.6, ease: EASE_CONFIGS.smoothOut }}
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

          {/* Category Breakdown Preview */}
          <div className="space-y-3">
            {budget.categories.slice(0, 4).map((cat, idx) => {
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
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              haptic("light");
              onOpenFullBudget();
            }}
            className="mt-5 w-full py-3 rounded-xl border border-gray-200 flex items-center justify-center gap-2 font-semibold text-sm hover:bg-gray-50 transition-colors"
            style={{ color: theme.primary }}
          >
            <PieChart size={16} />
            View Full Budget <ChevronRight size={16} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
});

BudgetPreviewSection.displayName = "BudgetPreviewSection";

// =============================================================================
// INSPIRATION GALLERY SECTION
// =============================================================================

const InspirationGallerySection = memo(({ theme, category }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [savedImages, setSavedImages] = useLocalStorage(`${category}_saved_images`, []);
  const [imageLoadStates, setImageLoadStates] = useState({});
  const scrollRef = useRef(null);
  const images = GALLERY_IMAGES_DATA[category] || GALLERY_IMAGES_DATA.default;
  const haptic = useHapticFeedback();
  const { toast, showToast, hideToast } = useToast();

  const toggleSave = useCallback(
    (id, e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      haptic("medium");
      const isSaved = savedImages.includes(id);
      setSavedImages((prev) => (isSaved ? prev.filter((i) => i !== id) : [...prev, id]));
      showToast(isSaved ? "Removed from saved" : "Image saved!", isSaved ? "info" : "success");
    },
    [haptic, setSavedImages, savedImages, showToast]
  );

  const handleImageLoad = useCallback((id) => {
    setImageLoadStates((prev) => ({ ...prev, [id]: true }));
  }, []);

  const handleShare = useCallback(async () => {
    haptic("light");
    if (navigator.share) {
      try {
        await navigator.share({ text: "Check out this inspiration!", url: selectedImage?.url });
      } catch (err) {
        // Share cancelled
      }
    } else {
      await navigator.clipboard.writeText(selectedImage?.url || "");
      showToast("Link copied!", "success");
    }
  }, [selectedImage, haptic, showToast]);

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
    <>
      <Toast {...toast} onClose={hideToast} />
      <div className="py-6">
        <div className="px-4 sm:px-5">
          <SectionHeader title="Get Inspired" subtitle={`${savedImages.length} saved`} icon={ImageIcon} theme={theme} />
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
                transition={{ delay: idx * 0.08, ...SPRING_CONFIGS.gentle }}
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
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
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
                transition={SPRING_CONFIGS.snappy}
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
                    onClick={handleShare}
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
    </>
  );
});

InspirationGallerySection.displayName = "InspirationGallerySection";

// =============================================================================
// TESTIMONIALS SECTION
// =============================================================================

const TestimonialsSection = memo(({ theme, category }) => {
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
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-4 sm:px-5 pb-2 scrollbar-hide snap-x snap-mandatory"
      >
        {testimonials.map((testimonial, idx) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, ...SPRING_CONFIGS.gentle }}
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
});

TestimonialsSection.displayName = "TestimonialsSection";

// =============================================================================
// FAQ SECTION
// =============================================================================

const FAQSectionComponent = memo(({ theme, category, onContactSupport }) => {
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
            transition={{ delay: idx * 0.05, ...SPRING_CONFIGS.gentle }}
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
                  transition={{ duration: 0.25, ease: EASE_CONFIGS.smooth }}
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

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onContactSupport}
        className="mt-4 w-full py-3.5 rounded-xl bg-gray-100 flex items-center justify-center gap-2 font-semibold text-sm text-gray-700 hover:bg-gray-200 transition-colors"
      >
        <MessageCircle size={18} />
        Still have questions? Contact Us
      </motion.button>
    </div>
  );
});

FAQSectionComponent.displayName = "FAQSectionComponent";

// =============================================================================
// CTA SECTION
// =============================================================================

const CTASectionComponent = memo(({ theme, category, onStartPlanning, onTalkToExpert }) => {
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
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                haptic("medium");
                onStartPlanning();
              }}
              className="w-full py-4 bg-white rounded-2xl font-bold text-center flex items-center justify-center gap-2 shadow-lg"
              style={{ color: theme.primary }}
            >
              Start Planning Now
              <ArrowRight size={18} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                haptic("light");
                onTalkToExpert();
              }}
              className="w-full py-4 bg-white/20 backdrop-blur-sm rounded-2xl font-bold text-white text-center flex items-center justify-center gap-2"
            >
              <Phone size={18} />
              Talk to Expert
            </motion.button>
          </div>

          <p className="text-center text-white/60 text-xs mt-4">No credit card required • Free consultation</p>
        </div>
      </motion.div>
    </div>
  );
});

CTASectionComponent.displayName = "CTASectionComponent";

// =============================================================================
// FLOATING ACTION BUTTON
// =============================================================================

const FloatingActionButtonComponent = memo(({ theme, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const haptic = useHapticFeedback();

  const actions = [
    { icon: MessageCircle, label: "Chat with Expert", action: "chat", color: "#2563eb" },
    { icon: Phone, label: "Call Us", action: "call", color: "#059669" },
    { icon: Calendar, label: "Schedule Call", action: "schedule", color: "#d97706" },
    { icon: Sparkles, label: "Get Quote", action: "quote", color: "#db2777" },
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
                transition={{ delay: idx * 0.05, ...SPRING_CONFIGS.snappy }}
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
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    haptic("medium");
                    setIsOpen(false);
                    onAction(action.action);
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: action.color }}
                >
                  <action.icon size={20} className="text-white" />
                </motion.button>
              </motion.div>
            ))}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleOpen}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
          style={{ backgroundColor: theme.primary }}
        >
          {isOpen ? <X size={24} className="text-white" /> : <Plus size={24} className="text-white" />}
        </motion.button>
      </div>
    </>
  );
});

FloatingActionButtonComponent.displayName = "FloatingActionButtonComponent";

// =============================================================================
// SCROLL TO TOP BUTTON
// =============================================================================

const ScrollToTopButton = memo(({ theme }) => {
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
});

ScrollToTopButton.displayName = "ScrollToTopButton";

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function CategoryEventsPageWrapper() {
  const params = useParams();
  const setActiveCategory = useCategoryStore((state) => state.setActiveCategory);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modal states
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestListOpen, setIsGuestListOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isVendorBrowserOpen, setIsVendorBrowserOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactType, setContactType] = useState("chat");
  const [initialVendorCategory, setInitialVendorCategory] = useState(null);
  const [selectedVendorForModal, setSelectedVendorForModal] = useState(null);

  // Get category from URL
  const categoryParam = (params?.category || "wedding").toLowerCase();
  const normalizedCategory = categoryParam === "default" ? "default" : categoryParam;
  const category = ["wedding", "anniversary", "birthday", "default"].includes(normalizedCategory)
    ? normalizedCategory
    : "default";

  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.default;

  // Date storage
  const [eventDate, setEventDate] = useLocalStorage(`${category}_event_date`, null);

  // Update global state
  useEffect(() => {
    setActiveCategory(theme.name);
    setIsLoaded(true);
  }, [category, setActiveCategory, theme.name]);

  // Handlers for quick actions
  const handleQuickAction = useCallback((action, label) => {
    switch (action) {
      case "date":
        setIsDatePickerOpen(true);
        break;
      case "guests":
        setIsGuestListOpen(true);
        break;
      case "venue":
        setInitialVendorCategory("venues");
        setIsVendorBrowserOpen(true);
        break;
      case "budget":
        setIsBudgetOpen(true);
        break;
      case "checklist":
        setIsChecklistOpen(true);
        break;
      case "vendors":
        setInitialVendorCategory(null);
        setIsVendorBrowserOpen(true);
        break;
      case "gifts":
        setInitialVendorCategory("gifts");
        setIsVendorBrowserOpen(true);
        break;
      case "cake":
        setInitialVendorCategory("catering");
        setIsVendorBrowserOpen(true);
        break;
      default:
        setIsVendorBrowserOpen(true);
    }
  }, []);

  // Handler for FAB actions
  const handleFABAction = useCallback((action) => {
    switch (action) {
      case "chat":
        setContactType("chat");
        setIsContactOpen(true);
        break;
      case "call":
        setContactType("call");
        setIsContactOpen(true);
        break;
      case "schedule":
        setContactType("call");
        setIsContactOpen(true);
        break;
      case "quote":
        setContactType("quote");
        setIsContactOpen(true);
        break;
    }
  }, []);

  // Handler for viewing vendors
  const handleViewVendors = useCallback((categoryId) => {
    setInitialVendorCategory(categoryId);
    setIsVendorBrowserOpen(true);
  }, []);

  // Handler for viewing a specific vendor
  const handleViewVendor = useCallback((vendor) => {
    setSelectedVendorForModal(vendor);
    setInitialVendorCategory(null);
    setIsVendorBrowserOpen(true);
  }, []);

  // Handler for saving date
  const handleSaveDate = useCallback(
    (date, time) => {
      setEventDate(date);
    },
    [setEventDate]
  );

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
          <QuickActionsSection theme={theme} category={category} onAction={handleQuickAction} />
        </AnimatedSection>

        {/* Countdown Timer */}
        <AnimatedSection delay={0.08}>
          <CountdownTimerSection theme={theme} category={category} onOpenDatePicker={() => setIsDatePickerOpen(true)} />
        </AnimatedSection>

        {/* Vendor Categories */}
        <AnimatedSection delay={0.1}>
          <VendorCategoriesSection theme={theme} category={category} onViewVendors={handleViewVendors} />
        </AnimatedSection>

        {/* Featured Vendors */}
        <AnimatedSection delay={0.12}>
          <FeaturedVendorsSection
            theme={theme}
            category={category}
            onViewVendor={handleViewVendor}
            onViewAll={() => handleViewVendors(null)}
          />
        </AnimatedSection>

        {/* Checklist Preview */}
        <AnimatedSection delay={0.14}>
          <ChecklistPreviewSection
            theme={theme}
            category={category}
            onOpenFullChecklist={() => setIsChecklistOpen(true)}
          />
        </AnimatedSection>

        {/* Budget Preview */}
        <AnimatedSection delay={0.16}>
          <BudgetPreviewSection theme={theme} category={category} onOpenFullBudget={() => setIsBudgetOpen(true)} />
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
          <FAQSectionComponent
            theme={theme}
            category={category}
            onContactSupport={() => {
              setContactType("chat");
              setIsContactOpen(true);
            }}
          />
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection delay={0.24}>
          <CTASectionComponent
            theme={theme}
            category={category}
            onStartPlanning={() => handleViewVendors(null)}
            onTalkToExpert={() => {
              setContactType("call");
              setIsContactOpen(true);
            }}
          />
        </AnimatedSection>

        {/* Bottom Spacing */}
        <div className="h-36" />
      </div>

      {/* Floating Action Button */}
      <FloatingActionButtonComponent theme={theme} onAction={handleFABAction} />

      {/* Scroll to Top Button */}
      <ScrollToTopButton theme={theme} />

      {/* MODALS */}

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSave={handleSaveDate}
        currentDate={eventDate}
        theme={theme}
        eventType={theme.name}
      />

      {/* Guest List Modal */}
      <GuestListModal
        isOpen={isGuestListOpen}
        onClose={() => setIsGuestListOpen(false)}
        theme={theme}
        category={category}
      />

      {/* Budget Modal */}
      <BudgetModal isOpen={isBudgetOpen} onClose={() => setIsBudgetOpen(false)} theme={theme} category={category} />

      {/* Checklist Modal */}
      <ChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        theme={theme}
        category={category}
      />

      {/* Vendor Browser Modal */}
      <VendorBrowserModal
        isOpen={isVendorBrowserOpen}
        onClose={() => {
          setIsVendorBrowserOpen(false);
          setInitialVendorCategory(null);
          setSelectedVendorForModal(null);
        }}
        theme={theme}
        category={category}
        initialCategory={initialVendorCategory}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        theme={theme}
        contactType={contactType}
      />

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

        * {
          -webkit-tap-highlight-color: transparent;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </main>
  );
}
