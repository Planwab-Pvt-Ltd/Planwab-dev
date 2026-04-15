"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo, memo, useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ChevronDown,
  Search,
  MapPin,
  X,
  Navigation,
  SlidersHorizontal,
  Home,
  Briefcase,
  Menu,
  Star,
  Heart,
  CakeSlice,
  Building2,
  Camera,
  Images,
  Store,
  FileText,
  User,
  Settings,
  CreditCard,
  LogOut,
  LogIn,
  UserPlus,
  UserCircle,
  Calendar,
  Phone,
  Moon,
  Sun,
  ChevronRight,
  Paintbrush2,
  UserCheck,
  UtensilsCrossed,
  Shirt,
  Hand,
  Gem,
  Mail,
  Music,
  Scissors,
  Lamp,
  Drum,
  MicVocal,
  Sparkles,
  FlameKindling,
  LucideLayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import SmartMedia from "./SmartMediaLoader";
import { toast } from "sonner";
import { useNavbarVisibilityStore } from "../../GlobalState/navbarVisibilityStore";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, useClerk, UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "@/contexts/ThemeContext";
import { set } from "mongoose";

/* ─── Static Data ─── */

const POPULAR_CITIES = [
  { id: 1, name: "New Delhi", state: "Delhi", icon: "🏛️" },
  { id: 2, name: "Mumbai", state: "Maharashtra", icon: "🌊" },
  { id: 3, name: "Bangalore", state: "Karnataka", icon: "💻" },
  { id: 4, name: "Gurgaon", state: "Haryana", icon: "🏢" },
  { id: 5, name: "Pune", state: "Maharashtra", icon: "🎓" },
  { id: 6, name: "Hyderabad", state: "Telangana", icon: "🍛" },
];

const SAVED_ADDRESSES = [
  {
    id: "home",
    label: "Home",
    address: "B-204, Ashoka Apartments",
    area: "Sector 18, Rohini",
    city: "New Delhi, Delhi 110085",
    icon: Home,
  },
  {
    id: "work",
    label: "Work",
    address: "Tower B, 5th Floor",
    area: "DLF Cyber Hub",
    city: "Gurgaon, Haryana 122002",
    icon: Briefcase,
  },
];

const TABS_CONFIG = [
  {
    id: "Wedding",
    label: "Wedding",
    styles: "bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900",
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1776097681/WeddingCat_qz1gdd_lopcu3.png",
    src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429996/WeddingHeaderCard_vslgmt.png",
    placeholders: ["Wedding Venues", "Bridal Makeup", "Mehndi Artists"],
  },
  { 
    id: "Anniversary",
    label: "Anniversary",
    styles: "bg-gradient-to-r from-gray-900 via-pink-700 to-gray-900",
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1776097683/AnniversaryCat_iyr77x_x4ytra.png",
    src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429999/AnniversaryHeaderCard_garm4n.png",
    placeholders: ["Romantic Dinner", "Flower Bouquets", "Couple Spa"],
  },
  {
    id: "Birthday",
    label: "Birthday",
    styles: "bg-gradient-to-r from-gray-900 via-yellow-600 to-gray-900",
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1776097682/BirthdayCat_adjjnh_ocub5e.png",
    src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429994/BirthdayHeaderCard_nat4mj.png",
    placeholders: ["Birthday Cakes", "Party Decor", "Event Planners"],
  },
];

const SORT_OPTIONS = [
  { id: "rating", label: "Top Rated", description: "Highest rated first", icon: "⭐" },
  { id: "price-asc", label: "Budget Friendly", description: "Lowest price first", icon: "💰" },
  { id: "price-desc", label: "Premium", description: "Highest price first", icon: "👑" },
  { id: "bookings", label: "Most Popular", description: "Most booked", icon: "🔥" },
  { id: "newest", label: "Newly Added", description: "Recently listed", icon: "✨" },
];

const VENDOR_CATEGORIES = [
  { key: "venues", label: "Venues", icon: Building2, description: "Banquet halls, hotels, resorts" },
  { key: "photographers", label: "Photographers", icon: Camera, description: "Wedding & event photography" },
  { key: "makeup", label: "Makeup", icon: Paintbrush2, description: "Bridal & party makeup" },
  { key: "planners", label: "Planners", icon: UserCheck, description: "Wedding & event planning" },
  { key: "catering", label: "Catering", icon: UtensilsCrossed, description: "Food & beverage services" },
  { key: "clothes", label: "Clothes", icon: Shirt, description: "Bridal & groom wear" },
  { key: "mehendi", label: "Mehendi", icon: Hand, description: "Mehendi artists" },
  { key: "cakes", label: "Cakes", icon: CakeSlice, description: "Wedding & celebration cakes" },
  { key: "jewellery", label: "Jewellery", icon: Gem, description: "Bridal & fashion jewellery" },
  { key: "invitations", label: "Invitations", icon: Mail, description: "Wedding cards & invites" },
  { key: "djs", label: "DJs", icon: Music, description: "Music & entertainment" },
  { key: "hairstyling", label: "Hairstyling", icon: Scissors, description: "Hair styling services" },
  { key: "decor", label: "Decorators", icon: Lamp, description: "Event decoration services" },
  { key: "dhol", label: "Dhol", icon: Drum, description: "Traditional drum players" },
  { key: "anchor", label: "Anchor", icon: MicVocal, description: "Event anchors and hosts" },
  { key: "stageEntry", label: "Stage Entry", icon: Sparkles, description: "Grand stage entry & concepts" },
  { key: "fireworks", label: "Fireworks", icon: FlameKindling, description: "Fireworks & pyro displays" },
  { key: "barat", label: "Barat", icon: Music, description: "Bands, horses & Barat processions" },
  { key: "other", label: "Other", icon: FileText, description: "Other services" },
];

const GALLERY_LINKS = [
  { label: "Vendor Media", href: "/vendors/explore/events", icon: Images },
  { label: "Profile Media", href: "/vendors/profiles/explore", icon: Camera },
  { label: "Marketplace", href: "/vendors/marketplace", icon: Store },
];

const BLOG_LINKS = [
  { label: "Wedding Blogs", href: "/about/blogs?category=wedding", icon: Heart },
  { label: "Anniversary Blogs", href: "/about/blogs?category=anniversary", icon: Star },
  { label: "Birthday Blogs", href: "/about/blogs?category=birthday", icon: CakeSlice },
  { label: "Corporate Blogs", href: "/about/blogs?category=corporate", icon: Building2 },
  { label: "Planning Tips", href: "/about/blogs?category=planning-tips", icon: FileText },
  { label: "All Blogs", href: "/about/blogs", icon: Images },
];

const PLANNING_LINKS = [
  { label: "Wedding Planning", href: "/events/wedding", icon: Heart },
  { label: "Anniversary Planning", href: "/events/anniversary", icon: Star },
  { label: "Birthday Planning", href: "/events/birthday", icon: CakeSlice },
];

const NAV_LINKS = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "My Events", href: "/my-events" },
  { icon: Phone, label: "Contact", href: "/contact" },
];

const EVENT_CATEGORIES = [
  { name: "Wedding", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1776097681/WeddingCat_qz1gdd_lopcu3.png" },
  {
    name: "Anniversary",
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1776097683/AnniversaryCat_iyr77x_x4ytra.png",
  },
  { name: "Birthday", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1776097682/BirthdayCat_adjjnh_ocub5e.png" },
];

const SCROLL_DELTA = 8;
const SCROLL_TRIGGER = 200;

/* ─── Hooks ─── */

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50, success: [10, 50, 10] };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

/* ─── SearchPlaceholderTicker ─── */

const SearchPlaceholderTicker = memo(({ placeholders }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders]);

  return (
    <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-[13px] font-semibold text-white/70 w-full truncate will-change-transform"
        >
          Search &ldquo;{placeholders[index]}&rdquo;...
        </motion.span>
      </AnimatePresence>
    </div>
  );
});
SearchPlaceholderTicker.displayName = "SearchPlaceholderTicker";

/* ─── CategoryButton ─── */

const CategoryButton = memo(({ category, imageSrc, active, onClick, styles, src }) => (
  <div
    role="button"
    onClick={onClick}
    className={`
      relative flex-1 h-12 mx-0.5 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer transform-gpu
      ${active ? `flex items-center justify-center space-x-1 px-3 ${styles}` : "bg-gray-100"}
    `}
  >
    {active ? (
      <>
        <div className="relative flex items-center justify-center z-10 shrink-0 pb-2">
          {/* <SmartMedia
            src={imageSrc}
            alt={category}
            className={`object-contain ${category === "Anniversary" ? "w-7 h-9" : "w-10 h-15"}`}
          /> */}
        </div>
        <span className="whitespace-nowrap text-sm font-bold text-white z-10 truncate">{category}</span>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-white/50 rounded-full w-[70%] z-10" />
      </>
    ) : (
      <div className="absolute inset-0 w-full h-full opacity-80 grayscale-[0.3]">
        <SmartMedia
          src={src}
          type="image"
          alt={category}
          className="w-full h-full object-cover"
          width={100}
          height={50}
        />
      </div>
    )}
  </div>
));
CategoryButton.displayName = "CategoryButton";

/* ─── AddressDrawer ─── */

const AddressDrawer = memo(({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[80] h-[75vh] flex flex-col shadow-2xl overflow-hidden will-change-transform"
          >
            <div className="px-5 pt-4 pb-2 bg-white sticky top-0 z-10">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Select Location</h3>
                <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="relative mb-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for area, street name..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-8 overscroll-contain">
              <button className="w-full flex items-center gap-4 p-4 mt-2 rounded-2xl bg-blue-50 border border-blue-100 active:scale-[0.98] transition-transform">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Navigation size={20} className="fill-current" />
                </div>
                <div className="text-left">
                  <p className="text-blue-900 font-bold text-sm">Use Current Location</p>
                  <p className="text-xs text-blue-600/80 font-medium">Using GPS</p>
                </div>
              </button>

              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Saved Addresses</p>
                <div className="space-y-3">
                  {SAVED_ADDRESSES.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => {
                        onSelect(addr);
                        onClose();
                      }}
                      className="w-full flex items-start gap-3 p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 text-left transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <addr.icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{addr.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">{addr.area}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Popular Cities</p>
                <div className="grid grid-cols-3 gap-3">
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        onSelect({ label: city.name, area: "City Center", city: city.name, id: city.id });
                        onClose();
                      }}
                      className="flex flex-col items-center gap-2 py-3 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 active:scale-95 transition-all"
                    >
                      <span className="text-2xl filter drop-shadow-sm">{city.icon}</span>
                      <span className="text-[11px] font-bold text-gray-700">{city.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
AddressDrawer.displayName = "AddressDrawer";

/* ─── FilterModal ─── */

const FilterModal = memo(({ isOpen, onClose, selectedSort, onSortChange, onApply }) => {
  const haptic = useHapticFeedback();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[80] max-h-[70vh] flex flex-col shadow-2xl will-change-transform"
          >
            <div className="px-5 pt-4 pb-3 border-b border-gray-100">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Sort & Filter</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Choose your preference</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedSort !== "rating" && (
                    <button
                      onClick={() => {
                        haptic("light");
                        onSortChange("rating");
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 active:scale-95 transition-all"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 overscroll-contain">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sort By</p>
              <div className="space-y-2">
                {SORT_OPTIONS.map((option) => (
                  <motion.button
                    key={option.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      haptic("light");
                      onSortChange(option.id);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      selectedSort === option.id
                        ? "bg-blue-50 border-blue-500 shadow-sm"
                        : "bg-white border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                        selectedSort === option.id ? "bg-blue-100 scale-110" : "bg-gray-50"
                      }`}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p
                        className={`font-bold text-sm ${selectedSort === option.id ? "text-blue-900" : "text-gray-900"}`}
                      >
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{option.description}</p>
                    </div>
                    {selectedSort === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  haptic("success");
                  onApply();
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 active:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
              >
                <span>Apply Filter</span>
                {selectedSort !== "rating" && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {SORT_OPTIONS.find((opt) => opt.id === selectedSort)?.label}
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
FilterModal.displayName = "FilterModal";

/* ─── DrawerAccordionItem ─── */

const DrawerAccordionItem = memo(({ icon: Icon, label, isOpen, onToggle, children, accentColor = "blue" }) => {
  const colorMap = {
    blue: {
      active: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30",
      inactive: "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
    },
    amber: {
      active: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30",
      inactive: "text-gray-700 hover:bg-amber-50 hover:text-amber-700",
    },
    purple: {
      active: "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30",
      inactive: "text-gray-700 hover:bg-purple-50 hover:text-purple-700",
    },
  };

  const colors = colorMap[accentColor] || colorMap.blue;

  return (
    <div className="overflow-hidden">
      <motion.button
        onClick={onToggle}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
          isOpen ? colors.active : colors.inactive
        }`}
      >
        <span className="flex items-center gap-3">
          <Icon size={18} />
          <span>{label}</span>
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25, ease: "easeInOut" }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-1 mb-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
DrawerAccordionItem.displayName = "DrawerAccordionItem";

/* ─── MobileNavDrawer ─── */

const MobileNavDrawer = memo(({ isOpen, onClose, pathname: currentPathname }) => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const [openSubAccordion, setOpenSubAccordion] = useState(null);
  const { user } = useUser();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const fullAuthRedirectUrl = `${pathname}?${searchParams.toString()}`;
  const isAdmin = user?.primaryEmailAddress?.emailAddress?.includes("@planwab.com") || false;
  const haptic = useHapticFeedback();

  const profileMenuItems = [
    { icon: User, label: "Profile", href: "/user/profile" },
    { icon: CreditCard, label: "Billing", href: "/pricing" },
    { icon: Settings, label: "Settings", href: "/user/profile?section=settings" },
    ...(isAdmin ? [{ icon: LucideLayoutDashboard, label: "Admin Dashboard", href: "/admin/dashboard" }] : []),
  ];

  const toggleAccordion = useCallback(
    (name) => {
      setOpenAccordion((prev) => (prev === name ? null : name));
      haptic("light");
    },
    [haptic],
  );

  const handleClose = useCallback(() => {
    haptic("light");
    onClose();
  }, [onClose, haptic]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setOpenAccordion(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/55 backdrop-blur-[3px] z-[85]"
          />

          {/* Drawer Panel — drag-to-close via framer-motion drag */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280, mass: 0.9 }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.35 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 70 || info.velocity.x > 500) {
                onClose();
              }
            }}
            className="fixed top-0 right-0 h-full z-[90] bg-white shadow-2xl flex flex-col will-change-transform cursor-grab active:cursor-grabbing select-none"
            style={{ width: "70%" }}
          >
            {/* Drag handle indicator */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-16 bg-gray-200 rounded-r-full opacity-60" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100/60 shrink-0">
              <Link href="/" onClick={()=> onClose()} className="text-xl font-black tracking-tight text-amber-500">
                planWAB
              </Link>
              <motion.button
                whileTap={{ scale: 0.88, rotate: 90 }}
                onClick={handleClose}
                className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100"
              >
                <X size={18} className="text-gray-600" />
              </motion.button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* User Profile Banner */}
              <SignedIn>
                <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                  <img
                    src={user?.imageUrl}
                    alt={user?.fullName || "User"}
                    className="w-10 h-10 rounded-xl border-2 border-white shadow-sm object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user?.username || user?.fullName || "User"}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>
              </SignedIn>

              <SignedOut>
                <div className="mx-4 mt-4 flex gap-2">
                  <SignInButton forceRedirectUrl={fullAuthRedirectUrl}>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-100 rounded-xl text-amber-700 font-bold text-sm"
                    >
                      <LogIn size={15} /> Login
                    </motion.button>
                  </SignInButton>
                  <SignUpButton forceRedirectUrl={fullAuthRedirectUrl}>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-100 rounded-xl text-green-700 font-bold text-sm"
                    >
                      <UserPlus size={15} /> Sign Up
                    </motion.button>
                  </SignUpButton>
                </div>
              </SignedOut>

              {/* Navigation Links */}
              {/* <div className="px-4 pt-4 space-y-1">
                {NAV_LINKS.map((item) => (
                  <Link key={item.label} href={item.href} onClick={handleClose}>
                    <motion.div
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        pathname === item.href
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon size={17} />
                      <span>{item.label}</span>
                      {pathname === item.href && (
                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      )}
                    </motion.div>
                  </Link>
                ))}
              </div> */}

              <div className="mx-4 my-3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {/* Event Categories */}
              <div className="px-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Event Categories
                </p>
                <div className="space-y-1">
                  {EVENT_CATEGORIES.map((cat) => {
                    const href = `/events/${cat.name.toLowerCase()}`;
                    const isActive = pathname === href;
                    return (
                      <Link key={cat.name} href={href} onClick={handleClose}>
                        <motion.div
                          whileTap={{ scale: 0.97 }}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <img src={cat.image} alt={cat.name} className="w-8 h-8 object-contain" />
                          <span>{cat.name}</span>
                          {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mx-4 my-3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {/* Expandable Sections */}
              <div className="px-4 space-y-2">
                {/* Vendors */}
                <DrawerAccordionItem
                  icon={Store}
                  label="Vendors"
                  isOpen={openAccordion === "vendors"}
                  onToggle={() => toggleAccordion("vendors")}
                  accentColor="blue"
                >
                  <div className="bg-gray-50 rounded-2xl p-3 grid grid-cols-2 gap-1.5">
                    {VENDOR_CATEGORIES.map((cat) => (
                      <Link key={cat.key} href={`/vendors/marketplace/${cat.key}`} onClick={handleClose}>
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 p-2 rounded-xl hover:bg-white transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-white group-hover:bg-blue-50 flex items-center justify-center shadow-sm transition-colors">
                            <cat.icon size={13} className="text-gray-500 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <span className="text-[11px] font-semibold text-gray-700 group-hover:text-blue-700 truncate transition-colors">
                            {cat.label}
                          </span>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </DrawerAccordionItem>

                {/* Gallery */}
                <DrawerAccordionItem
                  icon={Images}
                  label="Explore"
                  isOpen={openAccordion === "gallery"}
                  onToggle={() => toggleAccordion("gallery")}
                  accentColor="blue"
                >
                  <div className="bg-gray-50 rounded-2xl overflow-hidden">
                    {GALLERY_LINKS.map((item, i) => (
                      <Link key={item.label} href={item.href} onClick={handleClose}>
                        <motion.div
                          whileTap={{ scale: 0.97 }}
                          className={`flex items-center gap-3 px-4 py-3 hover:bg-white transition-colors group ${
                            i < GALLERY_LINKS.length - 1 ? "border-b border-gray-100" : ""
                          }`}
                        >
                          <item.icon size={15} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                            {item.label}
                          </span>
                          <ChevronRight
                            size={13}
                            className="ml-auto text-gray-300 group-hover:text-blue-400 transition-colors"
                          />
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </DrawerAccordionItem>

                {/* Blogs */}
                <DrawerAccordionItem
                  icon={FileText}
                  label="Blogs"
                  isOpen={openAccordion === "blogs"}
                  onToggle={() => toggleAccordion("blogs")}
                  accentColor="blue"
                >
                  <div className="bg-gray-50 rounded-2xl overflow-hidden">
                    {BLOG_LINKS.map((item, i) => (
                      <Link key={item.label} href={item.href} onClick={handleClose}>
                        <motion.div
                          whileTap={{ scale: 0.97 }}
                          className={`flex items-center gap-3 px-4 py-3 hover:bg-white transition-colors group ${
                            i < BLOG_LINKS.length - 1 ? "border-b border-gray-100" : ""
                          }`}
                        >
                          <item.icon size={15} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                            {item.label}
                          </span>
                          <ChevronRight
                            size={13}
                            className="ml-auto text-gray-300 group-hover:text-blue-400 transition-colors"
                          />
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </DrawerAccordionItem>

                {/* Planning */}
                <DrawerAccordionItem
                  icon={Calendar}
                  label="Planning"
                  isOpen={openAccordion === "planning"}
                  onToggle={() => toggleAccordion("planning")}
                  accentColor="purple"
                >
                  <div className="bg-gray-50 rounded-2xl overflow-hidden">
                    {PLANNING_LINKS.map((item, i) => (
                      <Link key={item.label} href={item.href} onClick={handleClose}>
                        <motion.div
                          whileTap={{ scale: 0.97 }}
                          className={`flex items-center gap-3 px-4 py-3 hover:bg-white transition-colors group ${
                            i < PLANNING_LINKS.length - 1 ? "border-b border-gray-100" : ""
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:bg-purple-50 transition-colors">
                            <item.icon
                              size={13}
                              className="text-gray-400 group-hover:text-purple-500 transition-colors"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                            {item.label}
                          </span>
                          <ChevronRight
                            size={13}
                            className="ml-auto text-gray-300 group-hover:text-purple-400 transition-colors"
                          />
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </DrawerAccordionItem>

                {/* Become a Planner */}
                <DrawerAccordionItem
                  icon={Star}
                  label="Become a Planner"
                  isOpen={openAccordion === "planner"}
                  onToggle={() => toggleAccordion("planner")}
                  accentColor="amber"
                >
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg shadow-amber-400/30">
                      <Star size={22} className="text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Start Planning Events</h4>
                    <p className="text-xs text-gray-500 mb-3">Turn your passion into a profession.</p>
                    <div className="space-y-2">
                      <Link href="/vendor/onboarding" onClick={handleClose}>
                        <motion.div
                          whileTap={{ scale: 0.97 }}
                          className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-2.5 rounded-xl font-bold text-sm shadow-md shadow-amber-400/30 text-center"
                        >
                          Start Application
                        </motion.div>
                      </Link>
                      <Link href="/vendor/register" onClick={handleClose}>
                        <motion.div
                          whileTap={{ scale: 0.97 }}
                          className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold text-sm text-center hover:bg-white transition-colors mt-2"
                        >
                          Learn More
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </DrawerAccordionItem>

                {/* Account — signed in only */}
                <SignedIn>
                  <DrawerAccordionItem
                    icon={UserCircle}
                    label="Account"
                    isOpen={openAccordion === "account"}
                    onToggle={() => toggleAccordion("account")}
                    accentColor="blue"
                  >
                    <div className="bg-gray-50 rounded-2xl overflow-hidden">
                      {profileMenuItems.map((item, i) => (
                        <Link key={item.label} href={item.href} onClick={handleClose}>
                          <motion.div
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white transition-colors group border-b border-gray-100"
                          >
                            <item.icon
                              size={15}
                              className="text-blue-400 group-hover:text-blue-600 transition-colors"
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                              {item.label}
                            </span>
                            <ChevronRight
                              size={13}
                              className="ml-auto text-gray-300 group-hover:text-blue-400 transition-colors"
                            />
                          </motion.div>
                        </Link>
                      ))}

                      {/* My Collection — nested collapsible */}
                      <div>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setOpenSubAccordion((p) => (p === "collection" ? null : "collection"))}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white transition-colors group border-b border-gray-100"
                        >
                          <Heart size={15} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors flex-1 text-left">
                            My Collection
                          </span>
                          <motion.div
                            animate={{ rotate: openSubAccordion === "collection" ? 180 : 0 }}
                            transition={{ duration: 0.22, ease: "easeInOut" }}
                          >
                            <ChevronDown
                              size={13}
                              className="text-gray-300 group-hover:text-blue-400 transition-colors"
                            />
                          </motion.div>
                        </motion.button>

                        <AnimatePresence initial={false}>
                          {openSubAccordion === "collection" && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                              className="overflow-hidden bg-blue-50/60"
                            >
                              {[
                                { label: "Vendors", href: "/user/profile?tab=vendors" },
                                { label: "Vendor Profiles", href: "/user/profile?tab=profiles" },
                                { label: "Reels", href: "/user/profile?tab=reels" },
                                { label: "Blogs", href: "/user/profile?tab=blogs" },
                              ].map((sub, i, arr) => (
                                <Link key={sub.label} href={sub.href} onClick={handleClose}>
                                  <motion.div
                                    whileTap={{ scale: 0.97 }}
                                    className={`flex items-center gap-3 pl-10 pr-4 py-2.5 hover:bg-blue-100/60 transition-colors group ${
                                      i < arr.length - 1 ? "border-b border-blue-100/80" : ""
                                    }`}
                                  >
                                    <div className="w-1 h-1 rounded-full bg-blue-300 group-hover:bg-blue-500 transition-colors shrink-0" />
                                    <span className="text-xs font-semibold text-blue-700 group-hover:text-blue-900 transition-colors">
                                      {sub.label}
                                    </span>
                                    <ChevronRight
                                      size={11}
                                      className="ml-auto text-blue-300 group-hover:text-blue-500 transition-colors"
                                    />
                                  </motion.div>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          signOut();
                          handleClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors group"
                      >
                        <LogOut size={15} className="text-red-400 group-hover:text-red-600 transition-colors" />
                        <span className="text-sm font-medium text-red-500 group-hover:text-red-700 transition-colors">
                          Sign Out
                        </span>
                      </motion.button>
                    </div>
                  </DrawerAccordionItem>
                </SignedIn>
              </div>

              {/* Spacer */}
              <div className="h-6" />
            </div>

            {/* Footer — Theme Toggle */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white shrink-0">
              {/* <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <span>🎨</span> Theme
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`relative w-14 h-7 flex items-center rounded-full px-1 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600"
                      : "bg-gradient-to-r from-yellow-400 to-orange-400"
                  }`}
                >
                  <motion.div
                    animate={{ x: theme === "dark" ? 27 : 0 }}
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
                  >
                    {theme === "dark" ? (
                      <Moon size={11} className="text-blue-600" />
                    ) : (
                      <Sun size={11} className="text-orange-500" />
                    )}
                  </motion.div>
                </motion.button>
              </div> */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
MobileNavDrawer.displayName = "MobileNavDrawer";

/* ─── HeaderLogic ─── */

const HeaderLogic = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const haptic = useHapticFeedback();
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const stickyRef = useRef(false);

  const { setIsNavbarVisible } = useNavbarVisibilityStore();

  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(SAVED_ADDRESSES[0]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("rating");
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  const activeTabId = searchParams.get("category");
  const currentTab = useMemo(() => TABS_CONFIG.find((t) => t.id === activeTabId) || TABS_CONFIG[0], [activeTabId]);
  const isHomePage = pathname === "/m" || pathname === "/";

 useEffect(() => {
  let startX = 0;
  let startY = 0;
  let startTarget = null;

  const isInsideScrollable = (el) => {
    while (el && el !== document.body) {
      const style = window.getComputedStyle(el);
      const overflowX = style.overflowX;
      const isScrollable = (overflowX === "auto" || overflowX === "scroll") && el.scrollWidth > el.clientWidth;
      if (isScrollable) return true;
      el = el.parentElement;
    }
    return false;
  };

  const onTouchStart = (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTarget = e.target;
  };

  const onTouchEnd = (e) => {
    if (isNavDrawerOpen) return;

    const deltaX = e.changedTouches[0].clientX - startX;
    const deltaY = e.changedTouches[0].clientY - startY;

    // Must start from right-edge 28px strip only
    const screenWidth = window.innerWidth;
    const startedFromRightEdge = startX >= screenWidth - 75;

    if (
      startedFromRightEdge &&
      deltaX < -55 &&
      Math.abs(deltaX) > Math.abs(deltaY) * 1.8 &&
      !isInsideScrollable(startTarget)
    ) {
      setIsNavDrawerOpen(true);
      setIsNavbarVisible(false);
      haptic("medium");
    }
  };

  document.addEventListener("touchstart", onTouchStart, { passive: true });
  document.addEventListener("touchend", onTouchEnd, { passive: true });

  return () => {
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("touchend", onTouchEnd);
  };
}, [isNavDrawerOpen, haptic]);

  const buildMarketplaceUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", encodeURIComponent(searchQuery.trim()));
    }
    if (selectedSort && selectedSort !== "rating") {
      params.set("sortBy", selectedSort);
    }
    const queryString = params.toString();
    return queryString ? `/vendors/marketplace?${queryString}` : "/vendors/marketplace";
  }, [searchQuery, selectedSort]);

  const handleSearchSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      if (!searchQuery.trim()) {
        toast.error("Search is empty", { description: "Please enter something to search" });
        return;
      }
      haptic("medium");
      const redirectUrl = buildMarketplaceUrl();
      toast.loading("Searching...", { id: "search-loading" });
      startTransition(() => {
        router.push(redirectUrl);
      });
    },
    [searchQuery, router, haptic, buildMarketplaceUrl, startTransition],
  );

  useEffect(() => {
    if (!isPending) toast.dismiss("search-loading");
  }, [isPending]);

  const handleApplyFilters = useCallback(() => {
    haptic("success");
    setIsFilterModalOpen(false);
    setIsNavbarVisible(true);
    const selectedOption = SORT_OPTIONS.find((opt) => opt.id === selectedSort);
    toast.success("Filter Applied", {
      description: `Sorted by: ${selectedOption?.label || "Default"}`,
      duration: 2000,
    });
  }, [haptic, selectedSort, setIsNavbarVisible]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    const delta = latest - previous;
    lastScrollY.current = latest;

    if (latest > SCROLL_TRIGGER && delta > SCROLL_DELTA) {
      if (!stickyRef.current) {
        stickyRef.current = true;
        setIsStickyVisible(true);
      }
    } else if (delta < -SCROLL_DELTA || latest <= SCROLL_TRIGGER) {
      if (stickyRef.current) {
        stickyRef.current = false;
        setIsStickyVisible(false);
      }
    }
  });

  const handleCategoryClick = useCallback(
    (id) => {
      const targetCategory = id === activeTabId ? "Default" : id;
      haptic("medium");
      startTransition(() => {
        router.push(`?category=${targetCategory}`, { scroll: false });
      });
    },
    [activeTabId, router, haptic, startTransition],
  );

  const openAddressDrawer = useCallback(() => {
    setIsAddressDrawerOpen(true);
    haptic("medium");
  }, [haptic]);
  const closeAddressDrawer = useCallback(() => setIsAddressDrawerOpen(false), []);

  const openFilterModal = useCallback(() => {
    setIsFilterModalOpen(true);
    setIsNavbarVisible(false);
    haptic("medium");
  }, [haptic, setIsNavbarVisible]);

  const closeFilterModal = useCallback(() => {
    setIsFilterModalOpen(false);
    setIsNavbarVisible(true);
  }, [setIsNavbarVisible]);

  const openNavDrawer = useCallback(() => {
    setIsNavDrawerOpen(true);
    haptic("medium");
    setIsNavbarVisible(false);
  }, [haptic, setIsNavbarVisible]);
  const closeNavDrawer = useCallback(() => {
    setIsNavDrawerOpen(false);
    setIsNavbarVisible(true);
  }, [setIsNavbarVisible]);

  const handleAddressSelect = useCallback((addr) => setSelectedAddress(addr), []);
  const clearSearch = useCallback(() => setSearchQuery(""), []);
  const onSearchChange = useCallback((e) => setSearchQuery(e.target.value), []);

  return (
    <>
      {/* ── Loading overlay ── */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-gradient-to-br from-amber-50 via-white to-white flex flex-col items-center justify-center z-[9999]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex items-center justify-center w-full h-full max-w-md max-h-md"
            >
              <video
                src="/Loading/loading1.mp4"
                alt="PlanWAB Loader"
                width={200}
                height={200}
                autoPlay
                muted
                loop
                playsInline
              />
            </motion.div>
            {searchQuery && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-32 text-sm font-bold text-gray-600"
              >
                Searching for &ldquo;{searchQuery.slice(0, 30)}
                {searchQuery.length > 30 ? "..." : ""}&rdquo;
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isHomePage && (
        <>
          {/* ── Floating header (non-sticky) ── */}
          <motion.div
            className="absolute top-0 left-0 w-full z-50 pointer-events-none"
            animate={{ opacity: isStickyVisible ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="pt-1 pb-2 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-auto">
              {/* Row 1 — Category tabs */}
              <div className="px-1 mb-2">
                <div className="flex items-center justify-between bg-white/10 rounded-2xl p-1.5 backdrop-blur-sm border border-white/10">
                  {TABS_CONFIG.map((tab) => (
                    <CategoryButton
                      key={tab.id}
                      category={tab.label}
                      styles={tab.styles}
                      imageSrc={tab.image}
                      src={tab.src}
                      active={activeTabId === tab.id}
                      onClick={() => handleCategoryClick(tab.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Row 2 — Address + Menu button */}
              <div className="px-3 mb-3 flex items-center gap-2">
                <button
                  onClick={openAddressDrawer}
                  className="flex-1 flex items-center gap-3 bg-white/10 rounded-2xl p-2 pr-4 backdrop-blur-md border border-white/10 active:scale-[0.98] transition-transform"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                    <MapPin size={20} fill="white" fillOpacity={0.3} />
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[15px] font-bold text-white truncate max-w-[160px]">
                        {selectedAddress.label}
                      </span>
                      <ChevronDown size={14} className="text-white/80" />
                    </div>
                    <p className="text-[11px] text-white/90 truncate font-medium">
                      {selectedAddress.area}, {selectedAddress.city.split(",")[0]}
                    </p>
                  </div>
                </button>

                {/* Menu button — opens nav drawer */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.88 }}
                  onClick={openNavDrawer}
                  className="h-14 w-12 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 bg-white/15 text-white active:scale-95 transition-transform relative shrink-0"
                >
                  <Menu size={20} strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Row 3 — Search bar with embedded filter button */}
              <div className="px-3">
                <form
                  onSubmit={handleSearchSubmit}
                  className="w-full h-12 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center px-4 relative active:scale-[0.99] transition-transform"
                >
                  <Search className="text-white/70 w-5 h-5 mr-3 shrink-0" strokeWidth={2.5} />

                  <div className="relative flex-1 h-full">
                    {!searchQuery && <SearchPlaceholderTicker placeholders={currentTab.placeholders} />}
                    <input
                      value={searchQuery}
                      onChange={onSearchChange}
                      onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                      className="w-full h-full bg-transparent border-none outline-none text-sm text-white font-semibold relative z-10 placeholder-transparent"
                    />
                  </div>

                  {searchQuery && (
                    <button type="button" onClick={clearSearch} className="p-1 bg-white/20 rounded-full z-10 mr-2">
                      <X size={12} className="text-white" />
                    </button>
                  )}

                  {/* Filter button embedded inside search bar */}
                  <div className="w-px h-5 bg-white/20 mx-1 shrink-0" />
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.88 }}
                    onClick={openFilterModal}
                    className={`relative h-8 w-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      selectedSort !== "rating"
                        ? "bg-blue-500 text-white shadow-md shadow-blue-500/40"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    <SlidersHorizontal size={15} strokeWidth={2.5} />
                    {selectedSort !== "rating" && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold shadow-lg"
                      >
                        1
                      </motion.span>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>

          {/* ── Sticky header ── */}
          <motion.div
            className="fixed top-0 left-0 w-full z-[60] bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100 will-change-transform"
            initial={{ y: "-100%" }}
            animate={{ y: isStickyVisible ? "0%" : "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="px-2 py-2">
              <div className="mb-2 overflow-x-auto scrollbar-hide no-scrollbar">
                <div className="flex items-center gap-1 min-w-max">
                  {TABS_CONFIG.map((tab) => (
                    <CategoryButton
                      key={tab.id}
                      category={tab.label}
                      styles={tab.styles}
                      imageSrc={tab.image}
                      src={tab.src}
                      active={activeTabId === tab.id}
                      onClick={() => handleCategoryClick(tab.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Sticky row — address + search-with-filter + menu */}
              <div className="flex items-center gap-2 px-1">
                <button
                  onClick={openAddressDrawer}
                  className="h-10 px-3 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl flex items-center gap-1.5 active:scale-95 transition-transform shrink-0"
                >
                  <MapPin size={16} className="fill-blue-200" />
                  <span className="text-[10px] font-bold max-w-[70px] truncate">{selectedAddress.label}</span>
                </button>

                {/* Search with embedded filter */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex-1 h-10 bg-gray-100 rounded-xl flex items-center px-3 relative min-w-0"
                >
                  <Search className="text-gray-400 w-4 h-4 mr-2 shrink-0" />
                  <input
                    value={searchQuery}
                    onChange={onSearchChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                    placeholder={`Search ${currentTab.label}...`}
                    className="flex-1 h-full bg-transparent border-none outline-none text-xs text-gray-800 font-medium placeholder-gray-400 min-w-0"
                  />
                  <div className="w-px h-4 bg-gray-300 mx-1.5 shrink-0" />
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.88 }}
                    onClick={openFilterModal}
                    className={`relative h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      selectedSort !== "rating"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500 border border-blue-100"
                    }`}
                  >
                    <SlidersHorizontal size={13} />
                    {selectedSort !== "rating" && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[7px] font-bold text-white"
                      >
                        1
                      </motion.span>
                    )}
                  </motion.button>
                </form>

                {/* Menu button — sticky */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.88 }}
                  onClick={openNavDrawer}
                  className="h-10 w-10 rounded-xl flex items-center justify-center bg-gray-100 text-gray-600 border border-gray-200 active:scale-95 transition-transform shrink-0 relative"
                >
                  <Menu size={17} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* ── Drawers & Modals ── */}
      <AddressDrawer isOpen={isAddressDrawerOpen} onClose={closeAddressDrawer} onSelect={handleAddressSelect} />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        onApply={handleApplyFilters}
      />

      <MobileNavDrawer isOpen={isNavDrawerOpen} onClose={closeNavDrawer} pathname={pathname} />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

/* ─── Export ─── */

const MobileHeader = () => (
  <Suspense fallback={<div className="h-20 w-full bg-transparent" />}>
    <HeaderLogic />
  </Suspense>
);

export default MobileHeader;
