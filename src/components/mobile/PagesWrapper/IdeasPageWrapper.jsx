"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavbarVisibilityStore } from './../../../GlobalState/navbarVisibilityStore';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  Heart,
  Filter,
  Sparkles,
  ArrowLeft,
  Play,
  Crown,
  Music,
  Camera,
  Palette,
  Utensils,
  PartyPopper,
  Gem,
  Flower2,
  Shirt,
  Car,
  Lightbulb,
  Gift,
  Users,
  Building2,
  GraduationCap,
  Baby,
  Cake,
  HeartHandshake,
  Megaphone,
  Trophy,
  Flame,
  Drum,
  HandMetal,
  Bookmark,
  BookmarkCheck,
  BadgeCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  TrendingUp,
  Zap,
  Send,
  ExternalLink,
  Calendar,
  Info,
} from "lucide-react";
import { set } from "mongoose";

// ─── DATA ────────────────────────────────────────────────────────

const WEDDING_THUMBNAILS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
];
const BIRTHDAY_THUMBNAILS = [
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
];
const CORPORATE_THUMBNAILS = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591115765373-5f9cf1da241c?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587825140708-dfaf18c4bfa3?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
];
const ANNIVERSARY_THUMBNAILS = [
  "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
];

const makeCarouselItems = (
  names,
  thumbnails
) =>
  names.map((name, i) => ({
    id: `item-${name.toLowerCase().replace(/\s/g, "-")}-${i}`,
    title: name,
    thumbnail: thumbnails[i % thumbnails.length],
    vendor:
      [
        "Royal Events",
        "Dream Makers",
        "Elite Planners",
        "Grand Celebrations",
        "Majestic Moments",
        "Star Productions",
      ][i % 6],
    rating: +(4.2 + Math.random() * 0.7).toFixed(1),
    reviews: 50 + Math.floor(Math.random() * 400),
    price: `₹${(10 + Math.floor(Math.random() * 90)) * 1000}`,
    location: ["Delhi", "Mumbai", "Jaipur", "Bangalore", "Hyderabad", "Goa"][
      i % 6
    ],
    tags:
      i % 3 === 0
        ? ["Top Rated"]
        : i % 3 === 1
          ? ["Trending"]
          : [],
    caption: `Premium ${name} service for your special occasion. Unforgettable memories guaranteed!`,
  }));

const EVENT_CONFIGS = {
  wedding: {
    subtypes: [
      { id: "baraat", label: "Baraat", icon: <Drum size={18} />, gradient: "from-orange-400 to-rose-500",
        nestedTypes: [
          { id: "dj-baraat", label: "DJ Baraat" },
          { id: "royal-baraat", label: "Royal Baraat" },
          { id: "horse-baraat", label: "Horse Baraat" },
          { id: "vintage-baraat", label: "Vintage Car" },
        ],
      },
      { id: "mehendi", label: "Mehendi", icon: <Flower2 size={18} />, gradient: "from-green-400 to-emerald-500" },
      { id: "sangeet", label: "Sangeet", icon: <Music size={18} />, gradient: "from-purple-400 to-violet-500" },
      { id: "haldi", label: "Haldi", icon: <Flame size={18} />, gradient: "from-yellow-400 to-amber-500" },
      { id: "planner", label: "Planner", icon: <Lightbulb size={18} />, gradient: "from-sky-400 to-blue-500",
        nestedTypes: [
          { id: "full-planner", label: "Full Service" },
          { id: "day-planner", label: "Day Coordinator" },
          { id: "budget-planner", label: "Budget" },
        ],
      },
      { id: "photographer", label: "Photo", icon: <Camera size={18} />, gradient: "from-pink-400 to-rose-500" },
      { id: "dj", label: "DJ & Music", icon: <HandMetal size={18} />, gradient: "from-indigo-400 to-purple-500" },
      { id: "decor", label: "Decor", icon: <Palette size={18} />, gradient: "from-teal-400 to-cyan-500" },
      { id: "catering", label: "Catering", icon: <Utensils size={18} />, gradient: "from-red-400 to-orange-500" },
      { id: "venue", label: "Venue", icon: <Building2 size={18} />, gradient: "from-slate-400 to-gray-500" },
      { id: "makeup", label: "Makeup", icon: <Gem size={18} />, gradient: "from-fuchsia-400 to-pink-500" },
      { id: "outfit", label: "Outfits", icon: <Shirt size={18} />, gradient: "from-violet-400 to-indigo-500" },
      { id: "invitation", label: "Invites", icon: <Gift size={18} />, gradient: "from-amber-400 to-yellow-500" },
      { id: "transport", label: "Transport", icon: <Car size={18} />, gradient: "from-blue-400 to-sky-500" },
    ],
    carousels: [
      // index 0 → single (15 items)
      {
        id: "w-planners",
        title: "Wedding Planners",
        items: makeCarouselItems([
          "Grand Heritage Planners", "Royal Wedding Co", "Dream Day Planners",
          "Eternal Celebrations", "Shaadi Squad", "Wedding Wire Pros",
          "Bliss Events", "Knot Tied", "The Wedding Studio",
          "Perfect Day Planners", "Forever Events Co", "Wedding Bells Co",
          "Auspicious Weddings", "The Planner's Den", "Elite Wedding Co",
        ], WEDDING_THUMBNAILS),
      },
      // index 1 → single (15 items)
      {
        id: "w-photographers",
        title: "Wedding Photographers",
        items: makeCarouselItems([
          "Lens Magic Studio", "Candid Clicks", "The Wedding Filmer",
          "Picture Perfect", "Shutterbugs Pro", "Memories Forever",
          "Golden Frame", "Reel Stories", "Studio Euphoria",
          "The Click Factory", "Timeless Frames", "Love in Focus",
          "Moment Masters", "Epic Visuals Studio", "Frames & Feels",
        ], WEDDING_THUMBNAILS),
      },
      // index 2 → double (22 items)
      {
        id: "w-mehendi",
        title: "Mehendi Artists",
        items: makeCarouselItems([
          "Henna Queens", "Bridal Mehendi Co", "Artistic Henna",
          "Rajasthani Mehendi", "Modern Mehendi Art", "Traditional Touch",
          "Arabic Henna Studio", "Floral Mehendi Art", "Mughal Henna Co",
          "Dulhan Mehendi Wali", "Heritage Henna Co", "Intricate Art Studio",
          "The Henna Lounge", "Golden Henna Co", "Bollywood Mehendi",
          "Luxury Bridal Henna", "Mehendi Magic", "Bespoke Henna Studio",
          "Floral Ink Art", "The Mehndi House", "Elegant Henna Co",
          "Shilpa's Mehendi Art",
        ], WEDDING_THUMBNAILS),
      },
      // index 3 → single (15 items)
      {
        id: "w-decor",
        title: "Wedding Decorators",
        items: makeCarouselItems([
          "Floral Fantasy", "Royal Decor House", "Elegant Events Decor",
          "Mandap Kings", "Dreamy Setups", "Stage Craft Pro",
          "Bloom & Vine", "Luxe Decor", "The Decor Studio",
          "Grand Flower Art", "The Mandap Co", "Petal & Drape",
          "Fairy Light Studio", "Opulent Events Decor", "Grandeur Decor",
        ], WEDDING_THUMBNAILS),
      },
      // index 4 → double (22 items)
      {
        id: "w-catering",
        title: "Wedding Caterers",
        items: makeCarouselItems([
          "Royal Feast Caterers", "Shahi Dawat", "Flavours Kitchen",
          "Grand Buffet Co", "Taste Masters", "Annapurna Caterers",
          "Dawat-e-Khas", "Fusion Bites Co", "Rajasthani Thali Co",
          "The Langar Service", "Zaika Caterers", "Spice Route Catering",
          "Five-Star Kitchen", "Heritage Bhoj", "Chef's Table Catering",
          "Gourmet Gatherings", "Grand Feast Events", "Sattvik Catering",
          "The Banquet Kitchen", "Regal Food Co", "Dum Pukht Caterers",
          "Swad Caterers",
        ], WEDDING_THUMBNAILS),
      },
      // index 5 → wraps to single (15 items)
      {
        id: "w-venues",
        title: "Wedding Venues",
        items: makeCarouselItems([
          "The Grand Palace", "Heritage Haveli", "Lakeside Resort",
          "Royal Banquet Hall", "Garden of Dreams", "Sky Lounge Venue",
          "Fort Wedding Venue", "Beach Resort", "Palace on Wheels Venue",
          "The Vineyard Venue", "Riverside Retreat", "Hilltop Venue",
          "The Lawn & Manor", "Crystal Ballroom", "The Heritage Estate",
        ], WEDDING_THUMBNAILS),
      },
    ],
    getCarouselsForSubtype: (subtypeId, nestedId) => {
      const s = {
        baraat: [
          // index 0 → single (15)
          {
            id: "b-dj",
            title: "Baraat DJs",
            items: makeCarouselItems([
              "DJ Baraat King", "Dhol & DJ Combo", "Baraat Blast",
              "Party on Wheels", "Royal Baraat DJ", "Street Beat DJ",
              "Bass Drop Baraat", "Electric Baraat Co", "Bollywood Baraat DJ",
              "Club Baraat", "Open Air DJ", "DJ Groove Baraat",
              "Neon Baraat Co", "Beat Street DJ", "DJ Fire Baraat",
            ], WEDDING_THUMBNAILS),
          },
          // index 1 → single (15)
          {
            id: "b-dhol",
            title: "Dhol Players",
            items: makeCarouselItems([
              "Punjabi Dhol Group", "Royal Dhol Walas", "Beats of Punjab",
              "Nagada Masters", "Dhol Tasha Band", "Classic Dhol",
              "Bhangra Dhol Co", "Tasha Nagada Group", "Heritage Dhol Players",
              "The Dhol Studio", "Rhythm of Punjab", "Dhadkan Dhol Co",
              "Power Beat Dhol", "Dhol Kings", "Folk Beats Co",
            ], WEDDING_THUMBNAILS),
          },
        ],
        mehendi: [
          // index 0 → single (15)
          {
            id: "m-artists",
            title: "Top Mehendi Artists",
            items: makeCarouselItems([
              "Henna Queens", "Bridal Mehendi Co", "Rajasthani Henna",
              "Arabic Style Mehendi", "Marwari Mehendi Art", "Modern Henna Studio",
              "The Henna Parlour", "Bollywood Mehendi", "Floral Ink Co",
              "Dulhan Henna Art", "Luxury Henna Studio", "Golden Henna Co",
              "Traditional Mehendi Wali", "Mughal Mehendi Art", "Bespoke Henna",
            ], WEDDING_THUMBNAILS),
          },
        ],
        sangeet: [
          // index 0 → single (15)
          {
            id: "s-choreo",
            title: "Choreographers",
            items: makeCarouselItems([
              "Dance Dhamaka", "Bollywood Steps", "Sangeet Choreography Co",
              "Star Moves", "Rhythm Dance Academy", "Groove Factory",
              "The Dance Studio", "Wedding Dance Co", "Bollywood Beats Dance",
              "Step Up Choreography", "Thumka Co", "Flash Mob Experts",
              "Jhatka Dance Co", "Nritya Studio", "The Sangeet Studio",
            ], WEDDING_THUMBNAILS),
          },
        ],
        photographer: [
          // index 0 → single (15)
          {
            id: "p-candid",
            title: "Candid Photographers",
            items: makeCarouselItems([
              "Candid Clicks", "Story Tellers", "Moment Catchers",
              "Raw Emotions Studio", "Unposed Photography", "Natural Light Studio",
              "The Click House", "Real Moments Co", "Frame by Frame Studio",
              "Genuine Expressions", "Life as Art Photography", "True Colours Studio",
              "Authentic Frames", "The Candid Company", "Soul Stories Photography",
            ], WEDDING_THUMBNAILS),
          },
        ],
      };
      const n = {
        "dj-baraat": [
          // index 0 → single (15)
          {
            id: "djb-top",
            title: "Top DJ Baraat Artists",
            items: makeCarouselItems([
              "DJ Storm Baraat", "Bass Drop Baraat", "Electric Baraat Co",
              "Bollywood Baraat DJ", "Club Baraat", "Open Air DJ",
              "DJ Groove Baraat", "Neon Baraat Co", "Beat Street DJ",
              "DJ Fire Baraat", "Power Baraat DJ", "The DJ Baraat Studio",
              "Royal DJ Baraat", "DJ Blast Co", "DJ Fiesta Baraat",
            ], WEDDING_THUMBNAILS),
          },
        ],
        "royal-baraat": [
          // index 0 → single (15)
          {
            id: "rb-top",
            title: "Royal Baraat Packages",
            items: makeCarouselItems([
              "Royal Horse & Chariot", "Elephant Baraat", "Palace Entry Package",
              "Maharaja Baraat Co", "Crown Baraat", "Heritage Royal Walk",
              "Vintage Carriage Co", "Rajputana Baraat", "White Horse Baraat",
              "Golden Chariot Co", "The Royal Procession", "Heritage Baraat House",
              "Shahi Sawari", "Grand Royal Baraat", "Regal Entry Co",
            ], WEDDING_THUMBNAILS),
          },
        ],
      };
      if (nestedId && n[nestedId]) return n[nestedId];
      if (s[subtypeId]) return s[subtypeId];
      return [];
    },
  },

  birthday: {
    subtypes: [
      { id: "kids", label: "Kids Party", icon: <Baby size={18} />, gradient: "from-pink-400 to-rose-500" },
      { id: "theme", label: "Theme Party", icon: <PartyPopper size={18} />, gradient: "from-violet-400 to-purple-500",
        nestedTypes: [
          { id: "bollywood-theme", label: "Bollywood Night" },
          { id: "retro-theme", label: "Retro Theme" },
          { id: "pool-theme", label: "Pool Party" },
          { id: "neon-theme", label: "Neon Party" },
        ],
      },
      { id: "cake", label: "Cakes", icon: <Cake size={18} />, gradient: "from-amber-400 to-orange-500" },
      { id: "b-decor", label: "Decor", icon: <Palette size={18} />, gradient: "from-teal-400 to-cyan-500" },
      { id: "b-venue", label: "Venues", icon: <Building2 size={18} />, gradient: "from-blue-400 to-indigo-500" },
      { id: "b-photo", label: "Photo", icon: <Camera size={18} />, gradient: "from-rose-400 to-pink-500" },
      { id: "b-dj", label: "DJ & Music", icon: <Music size={18} />, gradient: "from-purple-400 to-violet-500" },
      { id: "b-catering", label: "Catering", icon: <Utensils size={18} />, gradient: "from-red-400 to-orange-500" },
      { id: "entertainer", label: "Acts", icon: <Crown size={18} />, gradient: "from-yellow-400 to-amber-500" },
      { id: "b-gift", label: "Gifts", icon: <Gift size={18} />, gradient: "from-green-400 to-emerald-500" },
    ],
    carousels: [
      // index 0 → single (15)
      {
        id: "bd-decor",
        title: "Birthday Decorators",
        items: makeCarouselItems([
          "Balloon Fiesta", "Party Poppers Decor", "Theme Kings",
          "Colorful Celebrations", "Surprise Setups", "Balloon Art Co",
          "Festive Frames", "Pop & Party Decor", "Birthday Blast Decor",
          "The Party Room", "Whimsy Decor Co", "Balloon Galaxy",
          "Confetti Events", "Party Palette", "Decoration Nation",
        ], BIRTHDAY_THUMBNAILS),
      },
      // index 1 → single (15)
      {
        id: "bd-cakes",
        title: "Custom Cakes",
        items: makeCarouselItems([
          "Cake Studio", "Sweet Layers", "Fondant Fantasy",
          "The Cake Bar", "Sugar Rush Co", "Bake My Day",
          "Artisan Cake Co", "The Frosting Factory", "Designer Cake House",
          "Custom Cakes by Priya", "Cake Canvas", "Sprinkle Studio",
          "The Buttercream Co", "Tier & Taste", "Edible Art Studio",
        ], BIRTHDAY_THUMBNAILS),
      },
      // index 2 → double (22)
      {
        id: "bd-venues",
        title: "Party Venues",
        items: makeCarouselItems([
          "Fun City Arena", "Rooftop Bash", "Garden Party House",
          "The Play Zone", "Club Lounge Party", "Farm House Venue",
          "Lakeside Banquet", "Sky Terrace Venue", "The Loft Events",
          "Urban Party Hub", "Forest Retreat", "Pool Party Palace",
          "Neon Club Venue", "Retro Lounge", "The Penthouse Events",
          "Riverside Garden", "The Studio Space", "Warehouse Parties",
          "The Terrace Club", "Skyline Party Hub", "Club Metro Venue",
          "The Event Garden",
        ], BIRTHDAY_THUMBNAILS),
      },
    ],
    getCarouselsForSubtype: (subtypeId) => {
      const m = {
        kids: [
          // index 0 → single (15)
          {
            id: "k-themes",
            title: "Kids Party Themes",
            items: makeCarouselItems([
              "Superhero Party", "Princess Party", "Dinosaur Theme",
              "Space Theme", "Cartoon Theme", "Fairy Tale Party",
              "Jungle Theme Party", "Unicorn Party", "Pirate Theme",
              "Circus Theme Co", "Under the Sea Party", "Farm Animal Theme",
              "Candyland Party", "Safari Theme Co", "Harry Potter Theme",
            ], BIRTHDAY_THUMBNAILS),
          },
        ],
        theme: [
          // index 0 → single (15)
          {
            id: "t-popular",
            title: "Popular Themes",
            items: makeCarouselItems([
              "Bollywood Night", "Retro Theme", "Neon Glow Party",
              "Black & White", "Hawaiian Luau", "Masquerade Ball",
              "Hollywood Red Carpet", "1920s Gatsby Theme", "Disco Fever Party",
              "Wild West Theme", "Tropical Paradise", "Carnival Theme",
              "Alice in Wonderland", "Game Night Theme", "Under the Stars",
            ], BIRTHDAY_THUMBNAILS),
          },
        ],
        cake: [
          // index 0 → single (15)
          {
            id: "c-custom",
            title: "Custom Designer Cakes",
            items: makeCarouselItems([
              "Fondant Art Cake", "Photo Cake Pro", "Tier Cake Studio",
              "Vegan Cakes", "Eggless Delights", "Theme Cake Co",
              "Pull-Me-Up Cake Co", "Pinata Cake Studio", "Galaxy Cake Art",
              "Mirror Glaze Studio", "Drip Cake Co", "Naked Cake Co",
              "Geode Cake Art", "Sculpted Cake Studio", "The Macaron Tower Co",
            ], BIRTHDAY_THUMBNAILS),
          },
        ],
      };
      return m[subtypeId] || [];
    },
  },

  anniversary: {
    subtypes: [
      { id: "surprise", label: "Surprise", icon: <Gift size={18} />, gradient: "from-pink-400 to-fuchsia-500" },
      { id: "dinner", label: "Dinner", icon: <Utensils size={18} />, gradient: "from-red-400 to-rose-500" },
      { id: "a-decor", label: "Decor", icon: <Palette size={18} />, gradient: "from-teal-400 to-cyan-500" },
      { id: "a-photo", label: "Photo", icon: <Camera size={18} />, gradient: "from-violet-400 to-purple-500" },
      { id: "a-venue", label: "Venues", icon: <Building2 size={18} />, gradient: "from-blue-400 to-indigo-500" },
      { id: "a-music", label: "Music", icon: <Music size={18} />, gradient: "from-orange-400 to-amber-500" },
      { id: "a-cake", label: "Cakes", icon: <Cake size={18} />, gradient: "from-amber-400 to-yellow-500" },
      { id: "a-gift", label: "Gifts", icon: <Gift size={18} />, gradient: "from-green-400 to-emerald-500" },
    ],
    carousels: [
      // index 0 → single (15)
      {
        id: "an-surprise",
        title: "Surprise Planners",
        items: makeCarouselItems([
          "Surprise Squad", "Midnight Surprise Co", "Wow Factor Events",
          "Secret Celebration", "Surprise Box Co", "Plan My Surprise",
          "The Surprise Studio", "Pop-Up Events Co", "Wonder Moments",
          "Aha Surprise Co", "Unforgettable Events", "The Secret Planner",
          "Surprise & Delight", "Hidden Gems Events", "Joyful Surprises Co",
        ], ANNIVERSARY_THUMBNAILS),
      },
      // index 1 → single (15)
      {
        id: "an-dinner",
        title: "Romantic Dinner Setups",
        items: makeCarouselItems([
          "Candlelight Co", "Rooftop Dinner Setup", "Private Chef Experience",
          "Yacht Dinner", "Garden Dinner Setup", "Poolside Romance",
          "Forest Dining Co", "Starlit Dinner Studio", "Private Dining Co",
          "Lantern Lit Dinner", "Lakeside Dining", "The Dinner Experience",
          "Moonlight Feast Co", "Al Fresco Dining", "The Romance Table",
        ], ANNIVERSARY_THUMBNAILS),
      },
      // index 2 → double (22)
      {
        id: "an-decor",
        title: "Anniversary Decorators",
        items: makeCarouselItems([
          "Rose Petal Decor", "Balloon Bouquet Co", "Golden Theme Setup",
          "Silver Jubilee Decor", "Elegant Floral Setup", "Memory Lane Decor",
          "Candlelight Creations", "Petal & String Co", "Luxe Romance Decor",
          "Fairy Light Studio", "The Bloom Room", "Vintage Decor Co",
          "Midnight Florals", "Velvet Touch Decor", "Enchanted Setups",
          "Love Story Decor", "Blossom Events", "Starlit Celebrations",
          "Crimson Rose Decor", "Shimmer & Shine Events", "The Floral Frame Co",
          "Pearl Decor Studio",
        ], ANNIVERSARY_THUMBNAILS),
      },
    ],
    getCarouselsForSubtype: (subtypeId) => {
      const m = {
        surprise: [
          // index 0 → single (15)
          {
            id: "sp-midnight",
            title: "Midnight Surprises",
            items: makeCarouselItems([
              "12AM Surprise Co", "Night Owl Events", "Midnight Magic",
              "Dark Surprise Studio", "Secret Agent Events", "Stealth Celebrations",
              "After Hours Events", "Midnight Star Co", "Night Surprise Pro",
              "The Witching Hour Events", "Surprise & Shine", "Lunar Events Co",
              "Nocturnal Surprises", "The Midnight Crew", "Glow Surprise Co",
            ], ANNIVERSARY_THUMBNAILS),
          },
        ],
        dinner: [
          // index 0 → single (15)
          {
            id: "dn-private",
            title: "Private Dining",
            items: makeCarouselItems([
              "Chef's Table Co", "Home Chef Experience", "Luxury Dining Setup",
              "5-Star Private Dinner", "Outdoor Feast Co", "Gourmet Night In",
              "The Private Chef Studio", "Intimate Feast Co", "Table for Two",
              "Exclusive Dining Co", "The Plated Experience", "Culinary Romance",
              "Saveur Private Dining", "Tasting Menu Events", "The Supper Club",
            ], ANNIVERSARY_THUMBNAILS),
          },
        ],
      };
      return m[subtypeId] || [];
    },
  },

  corporate: {
    subtypes: [
      { id: "conference", label: "Conference", icon: <Users size={18} />, gradient: "from-blue-400 to-indigo-500" },
      { id: "team-building", label: "Team Build", icon: <Trophy size={18} />, gradient: "from-amber-400 to-orange-500" },
      { id: "launch", label: "Launch", icon: <Megaphone size={18} />, gradient: "from-red-400 to-rose-500" },
      { id: "c-venue", label: "Venues", icon: <Building2 size={18} />, gradient: "from-slate-400 to-gray-500" },
      { id: "c-catering", label: "Catering", icon: <Utensils size={18} />, gradient: "from-green-400 to-emerald-500" },
      { id: "c-av", label: "AV & Tech", icon: <Lightbulb size={18} />, gradient: "from-violet-400 to-purple-500" },
      { id: "c-photo", label: "Photo", icon: <Camera size={18} />, gradient: "from-pink-400 to-rose-500" },
      { id: "seminar", label: "Seminars", icon: <GraduationCap size={18} />, gradient: "from-cyan-400 to-teal-500" },
    ],
    carousels: [
      // index 0 → single (15)
      {
        id: "co-venues",
        title: "Corporate Venues",
        items: makeCarouselItems([
          "Tech Park Convention", "5-Star Ballroom", "Co-Working Events Space",
          "Rooftop Corporate Lounge", "Heritage Conference Hall", "Modern Meeting Hub",
          "The Business Centre", "Executive Suites Venue", "Glass Tower Events",
          "Corporate Garden Venue", "The Boardroom Venue", "Innovation Hub Events",
          "The Convention Centre", "Skyline Conference Hall", "Metro Business Events",
        ], CORPORATE_THUMBNAILS),
      },
      // index 1 → single (15)
      {
        id: "co-catering",
        title: "Corporate Caterers",
        items: makeCarouselItems([
          "Business Lunch Co", "Executive Catering", "Working Lunch Pro",
          "Premium Buffet Co", "Tea & Snacks Service", "Gala Dinner Caterers",
          "Corporate Meal Co", "Office Party Caterers", "The Boardroom Kitchen",
          "Snack Bar Pro", "Refreshment Services Co", "Summit Caterers",
          "The Delegate Kitchen", "Fine Dining Corporate", "CXO Caterers",
        ], CORPORATE_THUMBNAILS),
      },
      // index 2 → double (22)
      {
        id: "co-av",
        title: "AV & Production",
        items: makeCarouselItems([
          "Sound System Pro", "LED Screen Rentals", "Live Stream Co",
          "Stage & Lighting Co", "Projection Mapping", "Event Tech Solutions",
          "4K Broadcast Studio", "Wireless AV Pro", "Hologram Events",
          "Pixel Wall Co", "Podium Pro Rentals", "Mic & Mix Studio",
          "Corporate Visuals Co", "Hybrid Event Tech", "360° LED Stage",
          "Virtual Stage Co", "Truss & Rigging Pro", "Smart Screen Events",
          "Presentation Pro", "Video Wall Experts", "AV Masters",
          "Tech Stage Co",
        ], CORPORATE_THUMBNAILS),
      },
    ],
    getCarouselsForSubtype: (subtypeId) => {
      const m = {
        conference: [
          // index 0 → single (15)
          {
            id: "conf-plan",
            title: "Conference Planners",
            items: makeCarouselItems([
              "EventBrite Partners", "Summit Organizers", "Conference Pro Co",
              "Global Events Management", "Peak Conferences", "Conclave Experts",
              "The Summit Studio", "Keynote Events Co", "Panel Discussion Pro",
              "Conference Connect", "Boardroom Events", "The Delegate Co",
              "Symposium Planners", "Corporate Conclave", "The Agenda Studio",
            ], CORPORATE_THUMBNAILS),
          },
        ],
        "team-building": [
          // index 0 → single (15)
          {
            id: "tb-outdoor",
            title: "Outdoor Activities",
            items: makeCarouselItems([
              "Adventure Team Co", "Camp Corporate", "Sports Day Organizers",
              "Nature Retreat Co", "Paintball Events", "Rafting Adventures",
              "The Team Studio", "Outdoor Challenge Co", "Corporate Olympics",
              "Escape Room Events", "The Bonding Co", "Treasure Hunt Experts",
              "High Ropes Events", "Trekking Team Co", "The Activity Hub",
            ], CORPORATE_THUMBNAILS),
          },
        ],
        launch: [
          // index 0 → single (15)
          {
            id: "la-stage",
            title: "Launch Stage Designers",
            items: makeCarouselItems([
              "Grand Reveal Co", "Tech Launch Pro", "Product Showcase Design",
              "Immersive Launch Studio", "Brand Experience Co", "Launch Day Events",
              "The Launch Studio", "Grand Unveil Co", "Stage Zero Events",
              "Product Launch Pro", "The Reveal Room", "Showtime Launch Co",
              "Brand Stage Studio", "Launch Pad Events", "First Look Co",
            ], CORPORATE_THUMBNAILS),
          },
        ],
      };
      return m[subtypeId] || [];
    },
  },
};

const OTHER_EVENT_TYPES = [
  { id: "engagement", label: "Engagement" },
  { id: "baby-shower", label: "Baby Shower" },
  { id: "housewarming", label: "Housewarming" },
  { id: "retirement", label: "Retirement Party" },
  { id: "graduation", label: "Graduation" },
  { id: "puja", label: "Puja / Religious" },
  { id: "kitty-party", label: "Kitty Party" },
  { id: "farewell", label: "Farewell Party" },
  { id: "reunion", label: "Reunion" },
  { id: "charity-gala", label: "Charity Gala" },
];

const getDefaultConfigForOther = (eventId) => {
  const label = eventId.charAt(0).toUpperCase() + eventId.slice(1).replace(/-/g, " ");
  return {
    subtypes: [
      { id: "o-planner", label: "Planner", icon: <Lightbulb size={18} />, gradient: "from-sky-400 to-blue-500" },
      { id: "o-decor", label: "Decor", icon: <Palette size={18} />, gradient: "from-teal-400 to-cyan-500" },
      { id: "o-photo", label: "Photo", icon: <Camera size={18} />, gradient: "from-pink-400 to-rose-500" },
      { id: "o-catering", label: "Catering", icon: <Utensils size={18} />, gradient: "from-red-400 to-orange-500" },
      { id: "o-venue", label: "Venues", icon: <Building2 size={18} />, gradient: "from-slate-400 to-gray-500" },
      { id: "o-music", label: "Music", icon: <Music size={18} />, gradient: "from-purple-400 to-violet-500" },
    ],
    carousels: [
      // index 0 → single (15)
      {
        id: "ot-plan",
        title: `${label} Planners`,
        items: makeCarouselItems([
          "All Events Co", "Celebration Station", "Party People",
          "Event Masters", "Joy Makers", "Happy Times Co",
          "The Event Studio", "Occasion Creators", "Memorable Moments Co",
          "Festivities Pro", "The Planner Hub", "Event Craft Co",
          "Golden Events", "The Occasion Co", "Star Events Studio",
        ], ANNIVERSARY_THUMBNAILS),
      },
      // index 1 → single (15)
      {
        id: "ot-decor",
        title: `${label} Decorators`,
        items: makeCarouselItems([
          "Decor Delight", "Theme World", "Color Pop Events",
          "Balloon Galaxy", "Floral Touch", "Setup Studio",
          "The Decor House", "Festive Frames", "Artful Events",
          "Bloom & Drape", "Event Aesthetics Co", "The Setup Crew",
          "Vibrant Decor", "Centerpiece Studio", "The Decor Collective",
        ], BIRTHDAY_THUMBNAILS),
      },
    ],
    getCarouselsForSubtype: () => [],
  };
};

const generateVendors = (item) =>
  Array.from({ length: 8 }, (_, i) => ({
    id: `vendor-${item.id}-${i}`,
    name: `${item.vendor} ${["Studio", "Pro", "Co", "Group", "Agency", "House"][i % 6]}`,
    image: item.thumbnail,
    rating: +(4 + Math.random() * 0.9).toFixed(1),
    reviews: 20 + Math.floor(Math.random() * 300),
    price: `₹${(10 + Math.floor(Math.random() * 90)) * 1000}`,
    location: [
      "Delhi NCR",
      "Mumbai",
      "Jaipur",
      "Bangalore",
      "Hyderabad",
      "Kolkata",
      "Goa",
      "Chennai",
    ][i % 8],
    phone: `+91 ${90000 + Math.floor(Math.random() * 9999)} ${10000 + Math.floor(Math.random() * 89999)}`,
    badges:
      i % 2 === 0
        ? ["Verified", "Top Rated"]
        : i % 3 === 0
          ? ["Premium"]
          : ["Trusted"],
    availability:
      i % 3 === 0
        ? "Available this week"
        : i % 2 === 0
          ? "Book 2 weeks ahead"
          : "Limited slots",
  }));

// ─── TWO-ROW SUBTYPE GRID CAROUSEL ──────────────────────────────

const SubtypeGridCarousel = ({
  subtypes,
  activeSubtype,
  onSubtypeClick,
}) => {
  const constraintRef = useRef(null);

  return (
    <div ref={constraintRef} className="overflow-hidden">
      <motion.div
        drag="x"
        dragConstraints={constraintRef}
        dragElastic={0.12}
        dragTransition={{ bounceStiffness: 120, bounceDamping: 20 }}
        className="grid grid-rows-2 grid-flow-col auto-cols-max gap-0 px-2 py-1 gap-y-0 cursor-grab active:cursor-grabbing"
      >
        {subtypes.map((subtype, idx) => {
          const isActive = activeSubtype === subtype.id;
          return (
            <motion.button
              key={subtype.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: idx * 0.02,
                type: "spring",
                stiffness: 300,
                damping: 24,
              }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onSubtypeClick(subtype.id)}
              className={`relative flex flex-col items-center justify-center gap-1 pl-0 w-[80px] h-[70px] rounded-2xl transition-all select-none ${
                isActive
                  ? "bg-gray-900 dark:bg-white shadow-lg shadow-gray-900/20 dark:shadow-white/10"
                  : "bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-white/20 text-white dark:text-gray-900 dark:bg-gray-900/20"
                    : `bg-gradient-to-br ${subtype.gradient} text-white shadow-sm`
                }`}
              >
                {subtype.icon}
              </div>
              <span
                className={`text-[9px] font-semibold leading-tight text-center transition-colors ${
                  isActive
                    ? "text-white dark:text-gray-900"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {subtype.label}
              </span>
              {subtype.nestedTypes && (
                <div
                  className={`absolute top-1.5 right-1.5 w-1 h-1 rounded-full ${isActive ? "bg-white/60 dark:bg-gray-900/40" : "bg-violet-400"}`}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

// ─── NESTED CHIPS ────────────────────────────────────────────────

const NestedChips = ({
  nestedTypes,
  activeNested,
  onNestedClick,
}) => {
  const constraintRef = useRef(null);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="overflow-hidden"
    >
      <div
        ref={constraintRef}
        className="overflow-hidden bg-gray-50/60 dark:bg-gray-900/60"
      >
        <motion.div
          drag="x"
          dragConstraints={constraintRef}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 150, bounceDamping: 20 }}
          className="flex gap-2 px-3 py-2.5 cursor-grab active:cursor-grabbing"
          style={{ width: "max-content" }}
        >
          {nestedTypes.map((nested, idx) => {
            const isActive = activeNested === nested.id;
            return (
              <motion.button
                key={nested.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => onNestedClick(nested.id)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-150 dark:border-gray-700"
                }`}
              >
                {nested.label}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

// ─── MINI CARD (compact card used across carousels) ──────────────

const MiniCard = ({
  item,
  idx,
  onClick,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      delay: idx * 0.025,
      type: "spring",
      stiffness: 300,
      damping: 26,
    }}
    onClick={onClick}
    className="w-[104px] shrink-0 cursor-pointer group"
  >
    <div className="relative h-[140px] w-[104px] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-active:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {item.tags[0] && (
        <div className="absolute top-1.5 left-1.5 px-1.5 py-[1px] bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded text-[7px] font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-0.5">
          {item.tags[0] === "Top Rated" && (
            <Star
              size={6}
              className="fill-amber-500 text-amber-500"
            />
          )}
          {item.tags[0] === "Trending" && (
            <TrendingUp size={6} />
          )}
          {item.tags[0]}
        </div>
      )}
      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/25 backdrop-blur rounded-full flex items-center justify-center">
        <Play size={7} className="text-white fill-white ml-[1px]" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="text-white font-semibold text-[10px] leading-tight line-clamp-1 opacity-90">
          {item.vendor}
        </p>
      </div>
    </div>
  </motion.div>
);

// ─── SINGLE ROW CAROUSEL ─────────────────────────────────────────

const SingleRowCarousel = ({ section, onItemClick }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [xOffset, setXOffset] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return;
    const cW = containerRef.current.offsetWidth;
    const tW = trackRef.current.scrollWidth;
    const max = -(tW - cW);
    setShowLeft(xOffset < -10);
    setShowRight(xOffset > max + 10);
  }, [xOffset]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  useEffect(() => { setXOffset(0); }, [section.id]);

  const scroll = useCallback((dir) => {
    if (!containerRef.current || !trackRef.current) return;
    const cW = containerRef.current.offsetWidth;
    const tW = trackRef.current.scrollWidth;
    const max = -(tW - cW);
    const amount = 112 * 2; // ~2 cards
    setXOffset(dir === "left" ? Math.min(0, xOffset + amount) : Math.max(max, xOffset - amount));
  }, [xOffset]);

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between px-4 mb-2">
        <h3 className="text-[13px] font-bold text-gray-900 dark:text-white tracking-tight">
          {section.title}
        </h3>
        <div className="flex gap-1.5">
          <AnimatePresence>
            {showLeft && (
              <motion.button
                key="left"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => scroll("left")}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-300"
              >
                <ChevronLeft size={13} />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showRight && (
              <motion.button
                key="right"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => scroll("right")}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-300"
              >
                <ChevronRight size={13} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div ref={containerRef} className="overflow-hidden px-4">
        <motion.div
          ref={trackRef}
          animate={{ x: xOffset }}
          transition={{ type: "spring", stiffness: 110, damping: 22, mass: 0.85 }}
          className="flex gap-2 pb-1"
          style={{ width: "max-content" }}
        >
          {section.items.map((item, idx) => (
            <MiniCard
              key={item.id}
              item={item}
              idx={idx}
              onClick={() => onItemClick(item, section.items, idx)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// ─── TWO ROW GRID CAROUSEL ──────────────────────────────────────

const TwoRowGridCarousel = ({ section, onItemClick }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [xOffset, setXOffset] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // Split into top/bottom rows (interleaved)
  const topItems = section.items.filter((_, i) => i % 2 === 0);
  const bottomItems = section.items.filter((_, i) => i % 2 === 1);

  const checkScroll = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return;
    const cW = containerRef.current.offsetWidth;
    const tW = trackRef.current.scrollWidth;
    const max = -(tW - cW);
    setShowLeft(xOffset < -10);
    setShowRight(xOffset > max + 10);
  }, [xOffset]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  useEffect(() => { setXOffset(0); }, [section.id]);

  const scroll = useCallback((dir) => {
    if (!containerRef.current || !trackRef.current) return;
    const cW = containerRef.current.offsetWidth;
    const tW = trackRef.current.scrollWidth;
    const max = -(tW - cW);
    const amount = 112 * 2;
    setXOffset(
      dir === "left"
        ? Math.min(0, xOffset + amount)
        : Math.max(max, xOffset - amount)
    );
  }, [xOffset]);

  return (
    <div className="relative mx-3 rounded-3xl overflow-hidden bg-white/[0.04] backdrop-blur-2xl border border-white/[0.05] shadow-[0_8px_24px_rgba(0,0,0,0.20),0_2px_6px_rgba(0,0,0,0.10)] pt-[14px] pb-3 pr-3 mb-5">
      {/* Top shimmer edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-white tracking-tight">
            {section.title}
          </h3>
        </div>
        <div className="flex gap-1.5">
          <AnimatePresence>
            {showLeft && (
              <motion.button
                key="left"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => scroll("left")}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-300"
              >
                <ChevronLeft size={13} />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showRight && (
              <motion.button
                key="right"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => scroll("right")}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-300"
              >
                <ChevronRight size={13} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Track — two plain flex rows, both move together */}
      <div ref={containerRef} className="overflow-hidden px-4">
        <motion.div
          ref={trackRef}
          animate={{ x: xOffset }}
          transition={{ type: "spring", stiffness: 110, damping: 22, mass: 0.85 }}
          style={{ width: "max-content" }} // ← key: lets scrollWidth reflect true content width
        >
          {/* Row 1 — even indices */}
          <div className="flex gap-2">
            {topItems.map((item, idx) => (
              <MiniCard
                key={item.id}
                item={item}
                idx={idx}
                onClick={() => onItemClick(item, section.items, idx * 2)}
              />
            ))}
          </div>
          {/* Row 2 — odd indices */}
          <div className="flex gap-2 mt-2">
            {bottomItems.map((item, idx) => (
              <MiniCard
                key={item.id}
                item={item}
                idx={idx}
                onClick={() => onItemClick(item, section.items, idx * 2 + 1)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ─── REELS VIEWER ────────────────────────────────────────────────

const ReelsViewerModal = ({
  reels,
  initialIndex,
  onClose,
  onBookNow,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const currentReel = reels[currentIndex];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setIsLiked(false);
    setIsSaved(false);
    setExpanded(false);
  }, [currentIndex]);

  const goToReel = useCallback(
    (direction) => {
      if (direction === "up" && currentIndex < reels.length - 1)
        setCurrentIndex((p) => p + 1);
      else if (direction === "down" && currentIndex > 0)
        setCurrentIndex((p) => p - 1);
    },
    [currentIndex, reels.length]
  );

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    if (info.offset.y < -50 || info.velocity.y < -300) goToReel("up");
    else if (info.offset.y > 50 || info.velocity.y > 300) goToReel("down");
    if (info.velocity.x > 500 || info.offset.x > 150) onClose();
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 600);
    }
  };

  if (!currentReel) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-black overflow-hidden"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 px-3 pt-3 pb-6 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-2 bg-white/10 backdrop-blur-xl rounded-full"
        >
          <ArrowLeft size={18} className="text-white" />
        </motion.button>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full">
          <span className="text-white/80 text-[11px] font-medium">
            {currentIndex + 1}
          </span>
          <span className="text-white/30 text-[11px]">/</span>
          <span className="text-white/50 text-[11px] font-medium">
            {reels.length}
          </span>
        </div>
        <div className="w-9" />
      </div>

      {/* Draggable area */}
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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReel.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 26,
            }}
            className="absolute inset-0 z-10"
          >
            <img
              src={currentReel.thumbnail}
              alt={currentReel.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none" />
        <AnimatePresence>
          {showLikeAnimation && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <Heart
                size={80}
                className="text-white fill-white drop-shadow-2xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Right actions */}
      <div className="absolute right-2 flex flex-col items-center gap-4 z-30 transition-all ease-in-out" style={{bottom: expanded ? "250px" : "128px"}}>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => {
            setIsLiked(!isLiked);
            if (!isLiked) {
              setShowLikeAnimation(true);
              setTimeout(() => setShowLikeAnimation(false), 600);
            }
          }}
          className="flex flex-col items-center gap-0.5"
        >
          <motion.div
            animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center"
          >
            <Heart
              size={20}
              className={
                isLiked
                  ? "text-red-500 fill-red-500"
                  : "text-white"
              }
            />
          </motion.div>
          <span className="text-white text-[9px] font-semibold">
            {currentReel.reviews}
          </span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => setIsSaved(!isSaved)}
          className="flex flex-col items-center gap-0.5"
        >
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
            {isSaved ? (
              <BookmarkCheck
                size={20}
                className="text-white fill-white"
              />
            ) : (
              <Bookmark size={20} className="text-white" />
            )}
          </div>
          <span className="text-white text-[9px] font-semibold">
            Save
          </span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.8 }}
          className="flex flex-col items-center gap-0.5"
        >
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
            <Send size={18} className="text-white" />
          </div>
          <span className="text-white text-[9px] font-semibold">
            Share
          </span>
        </motion.button>
      </div>

      {/* Bottom info + CTAs */}
      <div className="absolute left-0 right-0 bottom-0 z-30 px-4 pb-6 pt-3">
        {/* Vendor row — always visible */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/30 bg-gray-600 shrink-0">
            <img
              src={currentReel.thumbnail}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-white font-bold text-[13px] truncate block">
              {currentReel.vendor}
            </span>
            <span className="text-white/40 text-[10px] flex items-center gap-1">
              <MapPin size={8} /> {currentReel.location}
              <span className="mx-0.5">·</span>
              <Star
                size={8}
                className="fill-yellow-400 text-yellow-400"
              />
              {currentReel.rating}
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 bg-white/10 backdrop-blur-sm rounded-full"
          >
            {expanded ? (
              <ChevronDown size={14} className="text-white/70" />
            ) : (
              <ChevronUp size={14} className="text-white/70" />
            )}
          </motion.button>
        </div>

        {/* Expandable detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="overflow-hidden mb-3"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 space-y-1.5">
                <p className="text-white font-semibold text-xs leading-snug">
                  {currentReel.title}
                </p>
                <p className="text-white/50 text-[11px] leading-relaxed">
                  {currentReel.caption}
                </p>
                <p className="text-emerald-400 font-bold text-sm">
                  {currentReel.price}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA buttons */}
        <div className="flex gap-2.5">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              /* Navigate to vendor profile */
            }}
            className="flex-1 py-3 bg-white/15 backdrop-blur-xl rounded-xl flex items-center justify-center gap-2 border border-white/10"
          >
            <ExternalLink size={14} className="text-white" />
            <span className="text-[12px] font-semibold text-white">
              See Profile
            </span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onBookNow(currentReel)}
            className="flex-1 py-3 bg-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-white/10"
          >
            <Calendar size={14} className="text-gray-900" />
            <span className="text-[12px] font-bold text-gray-900">
              Book Now
            </span>
          </motion.button>
        </div>
      </div>

      {/* Hint */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30">
        <p className="text-white/15 text-[8px]">
          Swipe up/down · Double tap to like
        </p>
      </div>
    </motion.div>
  );
};

// ─── BOOKING DRAWER ──────────────────────────────────────────────

const BookingDrawer = ({
  item,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(0);

  const packages = [
    {
      name: "Basic",
      price: "₹15,000",
      features: ["4 hours coverage", "50 edited photos", "Online gallery"],
    },
    {
      name: "Standard",
      price: "₹35,000",
      features: [
        "8 hours coverage",
        "200 edited photos",
        "Highlight reel",
        "Online gallery",
      ],
    },
    {
      name: "Premium",
      price: "₹65,000",
      features: [
        "Full day coverage",
        "500+ edited photos",
        "Cinematic film",
        "Album",
        "Online gallery",
      ],
    },
  ];

  const dates = [
    "Tomorrow",
    "This Weekend",
    "Next Week",
    "Custom Date",
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120]"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-white dark:bg-gray-900 rounded-t-[1.75rem] z-[120] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Drag handle */}
        <div
          className="w-full flex justify-center pt-3 pb-1 cursor-pointer"
          onClick={onClose}
        >
          <div className="w-10 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pt-1 pb-3 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-gray-200">
            <img
              src={item.thumbnail}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white truncate">
              Book {item.vendor}
            </h2>
            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              <Star
                size={9}
                className="fill-amber-400 text-amber-400"
              />{" "}
              {item.rating} · {item.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">
            {/* Date selection */}
            <div>
              <h4 className="text-[12px] font-bold text-gray-900 dark:text-white mb-2.5 uppercase tracking-wider">
                Preferred Date
              </h4>
              <div className="flex flex-wrap gap-2">
                {dates.map((d, i) => (
                  <motion.button
                    key={d}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(d)}
                    className={`px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all ${
                      selectedDate === d
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
                    }`}
                  >
                    {d}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Packages */}
            <div>
              <h4 className="text-[12px] font-bold text-gray-900 dark:text-white mb-2.5 uppercase tracking-wider">
                Choose Package
              </h4>
              <div className="space-y-2.5">
                {packages.map((pkg, i) => (
                  <motion.button
                    key={pkg.name}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPackage(i)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all ${
                      selectedPackage === i
                        ? "bg-gray-900 dark:bg-white ring-2 ring-gray-900 dark:ring-white"
                        : "bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[13px] font-bold ${
                          selectedPackage === i
                            ? "text-white dark:text-gray-900"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {pkg.name}
                      </span>
                      <span
                        className={`text-[14px] font-bold ${
                          selectedPackage === i
                            ? "text-emerald-400 dark:text-emerald-600"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {pkg.price}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                      {pkg.features.map((f) => (
                        <span
                          key={f}
                          className={`text-[10px] ${
                            selectedPackage === i
                              ? "text-white/60 dark:text-gray-900/50"
                              : "text-gray-400"
                          }`}
                        >
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <h4 className="text-[12px] font-bold text-gray-900 dark:text-white mb-2.5 uppercase tracking-wider">
                Add-ons
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Extra Hours",
                  "Drone Shots",
                  "Photo Album",
                  "Same-day Edit",
                ].map((addon) => (
                  <button
                    key={addon}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
                  >
                    + {addon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky bottom */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] text-gray-400 font-medium">
                Total
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {packages[selectedPackage].price}
              </p>
            </div>
            {selectedDate && (
              <span className="text-[10px] font-medium text-gray-400 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                {selectedDate}
              </span>
            )}
          </div>
          <div className="flex gap-2.5">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center gap-2"
            >
              <MessageSquare size={14} className="text-gray-700 dark:text-gray-300" />
              <span className="text-[12px] font-semibold text-gray-700 dark:text-gray-300">
                Chat First
              </span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap size={14} className="text-white dark:text-gray-900" />
              <span className="text-[12px] font-bold text-white dark:text-gray-900">
                Confirm Booking
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// ─── EVENT SELECTION MODAL ───────────────────────────────────────

const EventSelectionModal = ({
  onSelect,
}) => {
  const [showOthers, setShowOthers] = useState(false);
  const [searchOther, setSearchOther] = useState("");
  const mainEvents = [
    {
      id: "wedding",
      label: "Wedding",
      icon: <HeartHandshake size={26} />,
      gradient: "from-rose-500 to-pink-600",
      desc: "Plan your dream day",
    },
    {
      id: "anniversary",
      label: "Anniversary",
      icon: <Heart size={26} />,
      gradient: "from-red-500 to-rose-600",
      desc: "Celebrate your love",
    },
    {
      id: "birthday",
      label: "Birthday",
      icon: <Cake size={26} />,
      gradient: "from-amber-500 to-orange-600",
      desc: "Make it memorable",
    },
    {
      id: "corporate",
      label: "Corporate",
      icon: <Building2 size={26} />,
      gradient: "from-blue-500 to-indigo-600",
      desc: "Professional events",
    },
  ];
  const filteredOthers = OTHER_EVENT_TYPES.filter((e) =>
    e.label.toLowerCase().includes(searchOther.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-end justify-center"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          damping: 28,
          stiffness: 250,
          delay: 0.1,
        }}
        className="w-full max-w-lg"
      >
        <div className="px-6 pb-10 pt-6">
          {/* Logo / Branding */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                delay: 0.2,
                stiffness: 200,
              }}
              className="w-14 h-14 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-gray-900/20"
            >
              <Sparkles
                size={24}
                className="text-white dark:text-gray-900"
              />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight"
            >
              What are you planning?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[13px] text-gray-400 mt-1.5"
            >
              Choose your event to explore ideas & vendors
            </motion.p>
          </div>

          {!showOthers ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {mainEvents.map((event, idx) => (
                  <motion.button
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.35 + idx * 0.07,
                      type: "spring",
                      stiffness: 250,
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(event.id, event.label)}
                    className="flex flex-col items-center gap-2.5 p-5 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 active:border-gray-300 dark:active:border-gray-600 transition-all shadow-sm hover:shadow-md"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${event.gradient} flex items-center justify-center text-white shadow-lg`}
                    >
                      {event.icon}
                    </div>
                    <div className="text-center">
                      <span className="text-[13px] font-bold text-gray-900 dark:text-white block">
                        {event.label}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">
                        {event.desc}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowOthers(true)}
                className="w-full py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 font-semibold text-[12px] flex items-center justify-center gap-2 border border-gray-100 dark:border-gray-700/50"
              >
                <PartyPopper size={14} />
                Other Event Types
                <ChevronDown size={12} />
              </motion.button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button
                onClick={() => setShowOthers(false)}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500 mb-4"
              >
                <ArrowLeft size={13} />
                Back
              </button>
              <div className="relative mb-3">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search event type..."
                  value={searchOther}
                  onChange={(e) => setSearchOther(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[12px] font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {filteredOthers.map((event, idx) => (
                  <motion.button
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelect(event.id, event.label)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 active:border-gray-300"
                  >
                    <span className="text-[12px] font-semibold text-gray-900 dark:text-white">
                      {event.label}
                    </span>
                    <ChevronRight
                      size={13}
                      className="text-gray-300"
                    />
                  </motion.button>
                ))}
                {filteredOthers.length === 0 && (
                  <p className="text-center py-6 text-[12px] text-gray-400">
                    No matching event types
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── CAROUSEL LAYOUT BUILDER ─────────────────────────────────────
// Pattern: single, single, double, double, double, single, single, double...

const buildCarouselLayout = (
  carousels
) => {
  const pattern = [
    "single",
    "single",
    "double",
    "single",
    "double",
  ];
  return carousels.map((section, i) => ({
    section,
    type: pattern[i % pattern.length],
  }));
};

// ─── FILTER DRAWER ───────────────────────────────────────────────

const FilterDrawer = ({ initialFilter, onApply, onClose }) => {
  const [sort, setSort] = useState(initialFilter.sort);
  const [minRating, setMinRating] = useState(initialFilter.minRating);
  const [priceRange, setPriceRange] = useState(initialFilter.priceRange);
  const [location, setLocation] = useState(initialFilter.location);

  const sortOptions = [
    { id: "relevance", label: "Relevance" },
    { id: "rating", label: "Top Rated" },
    { id: "trending", label: "Trending" },
    { id: "price-low", label: "Price ↑" },
    { id: "price-high", label: "Price ↓" },
  ];
  const ratings = [4.5, 4.0, 3.5];
  const priceRanges = ["Under ₹20K", "₹20K–₹50K", "₹50K–₹1L", "Above ₹1L"];
  const locations = ["Delhi", "Mumbai", "Jaipur", "Bangalore", "Hyderabad", "Goa"];

  const activeCount = [sort !== "relevance", minRating, priceRange, location].filter(Boolean).length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120]"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed bottom-0 left-0 right-0 max-h-[88vh] bg-white dark:bg-gray-900 rounded-t-[1.75rem] z-[120] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Handle */}
        <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
          <div className="w-10 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pt-1 pb-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Filter & Sort</h2>
            {activeCount > 0 && (
              <span className="w-5 h-5 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                <span className="text-white dark:text-gray-900 text-[9px] font-bold">{activeCount}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSort("relevance"); setMinRating(null); setPriceRange(null); setLocation(null); }}
                className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                Reset all
              </motion.button>
            )}
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-6">

            {/* Sort */}
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-widest">Sort By</h4>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSort(opt.id)}
                    className={`px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all ${
                      sort === opt.id
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
                    }`}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-widest">Minimum Rating</h4>
              <div className="flex gap-2">
                {ratings.map((r) => (
                  <motion.button
                    key={r}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMinRating(minRating === r ? null : r)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all ${
                      minRating === r
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
                    }`}
                  >
                    <Star size={9} className={minRating === r ? "fill-amber-400 text-amber-400" : "fill-gray-400 text-gray-400"} />
                    {r}+
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-widest">Price Range</h4>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((p) => (
                  <motion.button
                    key={p}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPriceRange(priceRange === p ? null : p)}
                    className={`px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all ${
                      priceRange === p
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
                    }`}
                  >
                    {p}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-widest">Location</h4>
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <motion.button
                    key={loc}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLocation(location === loc ? null : loc)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all ${
                      location === loc
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
                    }`}
                  >
                    <MapPin size={9} />
                    {loc}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Apply */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onApply({ sort, minRating, priceRange, location })}
            className="w-full py-3.5 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Filter size={14} className="text-white dark:text-gray-900" />
            <span className="text-[13px] font-bold text-white dark:text-gray-900">
              Apply Filters
            </span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

const SearchModal = ({searchInputRef, setIsSearchOpen, searchQuery, setSearchQuery, searchResults, handleSearchResultClick}) => (
  <div
    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-16 px-4"
    onClick={() => setIsSearchOpen(false)}
  >
    <div
      className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── Input Row ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events, services, vendors…"
          className="flex-1 text-sm outline-none text-gray-800 placeholder:text-gray-400 bg-transparent"
        />
        {searchQuery ? (
          <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        ) : (
          <kbd className="text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 font-mono shrink-0">
            ESC
          </kbd>
        )}
      </div>

      {/* ── Results ───────────────────────────────────────────── */}
      {searchResults.length > 0 ? (
        <ul className="max-h-72 overflow-y-auto py-2 divide-y divide-gray-50">
          {searchResults.map((result, i) => (
            <li key={i}>
              <button
                onClick={() => handleSearchResultClick(result)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
              >
                {/* icon by type */}
                <span className={`text-lg shrink-0 ${
                  result.type === "event"   ? "🎉" :
                  result.type === "subtype" ? "📌" : "🏢"
                }`}>
                  {result.type === "event" ? "🎉" : result.type === "subtype" ? "📌" : "🏢"}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{result.label}</p>
                  <p className="text-xs text-gray-400 truncate">{result.sublabel}</p>
                </div>

                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                  result.type === "event"   ? "bg-blue-100 text-blue-600"   :
                  result.type === "subtype" ? "bg-purple-100 text-purple-600" :
                                              "bg-green-100 text-green-600"
                }`}>
                  {result.type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : searchQuery.trim() ? (
        <div className="py-12 text-center">
          <p className="text-gray-400 text-sm">No results for <span className="font-medium text-gray-600">"{searchQuery}"</span></p>
        </div>
      ) : (
        /* ── Quick-search chips when input is empty ───────────── */
        <div className="px-4 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick Search</p>
          <div className="flex flex-wrap gap-2">
            {["Wedding", "Birthday", "Anniversary", "DJ", "Catering", "Venues", "Decor", "Photographers"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// ─── MAIN PAGE ───────────────────────────────────────────────────

export default function IdeasPageWrapper() {
  const { setIsNavbarVisible } = useNavbarVisibilityStore();
  const [eventType, setEventType] = useState(null);
  const [eventLabel, setEventLabel] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [activeSubtype, setActiveSubtype] = useState(
    null
  );
  const [activeNested, setActiveNested] = useState(
    null
  );
  const [reelsData, setReelsData] = useState(null);
  const [drawerItem, setDrawerItem] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
const [filterState, setFilterState] = useState({
  sort: "relevance",
  minRating: null,
  priceRange: null,
  location: null,
});

const [isSearchOpen, setIsSearchOpen]   = useState(false);
const [searchQuery,  setSearchQuery]    = useState("");
const [searchResults, setSearchResults] = useState([]);
const searchInputRef = useRef(null);

  useEffect(() => {
  const shouldHide = showModal || !eventType || !!reelsData || !!drawerItem || showFilter;
  setIsNavbarVisible(!shouldHide);
}, [showModal, eventType, reelsData, drawerItem, showFilter, setIsNavbarVisible]);

useEffect(() => {
  if (!searchQuery.trim()) { setSearchResults([]); return; }
  const q = results => results.slice(0, 10);
  const query = searchQuery.toLowerCase();
  const found = [];

  Object.entries(EVENT_CONFIGS).forEach(([eventKey, config]) => {
    const eventLabel = eventKey.charAt(0).toUpperCase() + eventKey.slice(1);

    // Match event category name
    if (eventLabel.toLowerCase().includes(query)) {
      found.push({ type: "event", label: eventLabel, sublabel: "Event Category", eventId: eventKey });
    }

    // Match subtypes
    config.subtypes?.forEach((sub) => {
      if (sub.label.toLowerCase().includes(query)) {
        found.push({ type: "subtype", label: sub.label, sublabel: `${eventLabel} › Service`, eventId: eventKey, subtypeId: sub.id });
      }
    });

    // Match vendor names inside carousel items
    config.carousels?.forEach((carousel) => {
      carousel.items?.forEach((item) => {
        if (item.name?.toLowerCase().includes(query)) {
          found.push({ type: "vendor", label: item.name, sublabel: `${eventLabel} › ${carousel.title}`, eventId: eventKey });
        }
      });
    });
  });

  setSearchResults(q(found));
}, [searchQuery]);

useEffect(() => {
  const onKey = (e) => { if (e.key === "Escape") setIsSearchOpen(false); };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, []);

// ── auto-focus & reset on open/close ──────────────────────────────
useEffect(() => {
  if (isSearchOpen) { setTimeout(() => searchInputRef.current?.focus(), 50); }
  else { setSearchQuery(""); setSearchResults([]); }
}, [isSearchOpen]);

// ── result click handler ───────────────────────────────────────────
const handleSearchResultClick = (result) => {
  setIsSearchOpen(false);
  if (result.eventId) setEventType(result.eventId);       // your existing setter
  if (result.subtypeId) setActiveSubtype(result.subtypeId);   // your existing setter
};

  const config = useMemo(() => {
    if (!eventType) return null;
    return (
      EVENT_CONFIGS[eventType] || getDefaultConfigForOther(eventType)
    );
  }, [eventType]);

  const activeSubtypeData = useMemo(() => {
    if (!config || !activeSubtype) return null;
    return (
      config.subtypes.find((s) => s.id === activeSubtype) || null
    );
  }, [config, activeSubtype]);

  const displayCarousels = useMemo(() => {
  if (!config) return [];
  let carousels;
  if (activeSubtype) {
    const sc = config.getCarouselsForSubtype(activeSubtype, activeNested || undefined);
    carousels = sc.length > 0 ? sc : config.carousels;
  } else {
    carousels = config.carousels;
  }

  const hasFilters =
    filterState.sort !== "relevance" ||
    filterState.minRating ||
    filterState.priceRange ||
    filterState.location;
  if (!hasFilters) return carousels;

  const PRICE_RANGES = {
    "Under ₹20K":  [0, 20000],
    "₹20K–₹50K":  [20000, 50000],
    "₹50K–₹1L":   [50000, 100000],
    "Above ₹1L":  [100000, Infinity],
  };

  return carousels.map((section) => {
    let items = [...section.items];
    if (filterState.minRating)
      items = items.filter((i) => i.rating >= filterState.minRating);
    if (filterState.location)
      items = items.filter((i) => i.location === filterState.location);
    if (filterState.priceRange) {
      const [min, max] = PRICE_RANGES[filterState.priceRange] || [0, Infinity];
      items = items.filter((i) => {
        const p = parseInt(i.price.replace(/[^\d]/g, ""), 10);
        return p >= min && p <= max;
      });
    }
    if (filterState.sort === "rating") items.sort((a, b) => b.rating - a.rating);
    else if (filterState.sort === "price-low")
      items.sort((a, b) => parseInt(a.price.replace(/[^\d]/g, ""), 10) - parseInt(b.price.replace(/[^\d]/g, ""), 10));
    else if (filterState.sort === "price-high")
      items.sort((a, b) => parseInt(b.price.replace(/[^\d]/g, ""), 10) - parseInt(a.price.replace(/[^\d]/g, ""), 10));
    else if (filterState.sort === "trending")
      items.sort((a, b) => b.reviews - a.reviews);
    return { ...section, items };
  });
}, [config, activeSubtype, activeNested, filterState]);

  const carouselLayout = useMemo(
    () => buildCarouselLayout(displayCarousels),
    [displayCarousels]
  );

  const handleEventSelect = (type, label) => {
    setEventType(type);
    setEventLabel(label);
    setShowModal(false);
    setActiveSubtype(null);
    setActiveNested(null);
    setIsNavbarVisible(true);
  };

  const handleSubtypeClick = (subtypeId) => {
    if (activeSubtype === subtypeId) {
      setActiveSubtype(null);
      setActiveNested(null);
    } else {
      setActiveSubtype(subtypeId);
      setActiveNested(null);
    }
  };

  const handleNestedClick = (nestedId) => {
    setActiveNested(activeNested === nestedId ? null : nestedId);
  };

  const handleItemClick = (
    item,
    allItems,
    index
  ) => {
    setReelsData({ reels: allItems, initialIndex: index });
    setIsNavbarVisible(false);
  };

  const handleBookNow = (item) => {
    setDrawerItem(item);
    setIsNavbarVisible(false);
  };

  const handleCloseReels = () => {
    setReelsData(null);
    setIsNavbarVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerItem(null);
  };

  if (showModal || !eventType || !config) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <AnimatePresence>
          <EventSelectionModal onSelect={handleEventSelect} />
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pb-10">
      {/* Sticky header */}
       {/* Title bar */}
        <div className="sticky top-0 z-50 px-3 py-2.5 bg-gray-50/90 rounded-b-2xl flex items-center gap-2.5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowModal(true);
              setEventType(null);
              setActiveSubtype(null);
              setActiveNested(null);
            }}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
          >
            <ArrowLeft size={16} />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-bold text-gray-900 dark:text-white truncate tracking-tight">
              {eventLabel} Ideas
            </h1>
            <p className="text-[10px] text-gray-400 font-medium">
              {activeSubtype
                ? `${activeSubtypeData?.label || ""} ${activeNested ? `› ${activeSubtypeData?.nestedTypes?.find((n) => n.id === activeNested)?.label || ""}` : ""}`
                : "Explore all categories"}
            </p>
          </div>
          <button
  onClick={() => setIsSearchOpen(true)}
  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400"
  aria-label="Open search"
>
  <Search size={16} className="text-black" />
</button>
          <motion.button
  whileTap={{ scale: 0.9 }}
  onClick={() => setShowFilter(true)}
  className="relative w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400"
>
  <Filter size={14} />
  {(filterState.sort !== "relevance" || filterState.minRating || filterState.priceRange || filterState.location) && (
    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
      <span className="text-white dark:text-gray-900 text-[7px] font-bold">
        {[filterState.sort !== "relevance", filterState.minRating, filterState.priceRange, filterState.location].filter(Boolean).length}
      </span>
    </span>
  )}
</motion.button>
        </div>

      <div className="z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-100/80 dark:border-gray-800/80">

        {/* Two-row subtype grid */}
        <SubtypeGridCarousel
          subtypes={config.subtypes}
          activeSubtype={activeSubtype}
          onSubtypeClick={handleSubtypeClick}
        />

        {/* Nested chips */}
        <AnimatePresence>
          {activeSubtypeData?.nestedTypes &&
            activeSubtypeData.nestedTypes.length > 0 && (
              <NestedChips
                key={activeSubtype}
                nestedTypes={activeSubtypeData.nestedTypes}
                activeNested={activeNested}
                onNestedClick={handleNestedClick}
              />
            )}
        </AnimatePresence>
      </div>

      {/* Carousels */}
      <div className="pt-4 space-y-1">
        {carouselLayout.length > 0 ? (
          carouselLayout.map(({ section, type }) =>
            type === "single" ? (
              <SingleRowCarousel
                key={section.id}
                section={section}
                onItemClick={handleItemClick}
              />
            ) : (
              <TwoRowGridCarousel
                key={section.id}
                section={section}
                onItemClick={handleItemClick}
              />
            )
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              No ideas yet
            </p>
            <p className="text-[12px] text-gray-400">
              Try selecting a different category above
            </p>
          </div>
        )}

        {carouselLayout.length > 0 && (
          <div className="px-4 pt-3 pb-4">
            <div className="bg-gray-900 dark:bg-white rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 dark:bg-gray-900/10 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp
                  size={18}
                  className="text-white dark:text-gray-900"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[12px] font-bold text-white dark:text-gray-900">
                  Trending in {eventLabel}
                </h4>
                <p className="text-[10px] text-white/50 dark:text-gray-900/50 mt-0.5">
                  See what others are booking this season
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-white/40 dark:text-gray-900/30 shrink-0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Reels viewer */}
      <AnimatePresence>
        {reelsData && (
          <ReelsViewerModal
            reels={reelsData.reels}
            initialIndex={reelsData.initialIndex}
            onClose={handleCloseReels}
            onBookNow={handleBookNow}
          />
        )}
      </AnimatePresence>

      {/* Booking drawer */}
      <AnimatePresence>
        {drawerItem && (
          <BookingDrawer
            item={drawerItem}
            onClose={handleCloseDrawer}
          />
        )}
      </AnimatePresence>

      {isSearchOpen && <SearchModal searchInputRef={searchInputRef} handleSearchResultClick={handleSearchResultClick} searchResults={searchResults} setSearchQuery={setSearchQuery} searchQuery={searchQuery} setIsSearchOpen={setIsSearchOpen}  />}

      {/* Filter drawer */}
<AnimatePresence>
  {showFilter && (
    <FilterDrawer
      initialFilter={filterState}
      onApply={(f) => { setFilterState(f); setShowFilter(false); }}
      onClose={() => setShowFilter(false)}
    />
  )}
</AnimatePresence>
    </div>
  );
}