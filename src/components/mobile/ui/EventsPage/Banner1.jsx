"use client";

import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
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
  AlertCircle,
  CalendarDays,
  PartyPopper,
  Cake,
  BadgeCheck,
  Search,
  Filter,
  Grid3X3,
  List,
  Send,
  Info,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";

// Imports
import HeroSection from "@/components/mobile/ui/EventsPage/HeroSection";
import Banner1 from "@/components/mobile/ui/EventsPage/Banner1";
import HowItWorksSection from "@/components/mobile/ui/EventsPage/HowItWorks";
import { useNavbarVisibilityStore } from "../../../GlobalState/navbarVisibilityStore";

// =============================================================================
// OPTIMIZED CONFIGURATION
// =============================================================================

const ANIMATION_CONFIG = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" }, // Fixes "bad restart logic"
    transition: { duration: 0.5, ease: "easeOut" },
  },
  stagger: {
    visible: { transition: { staggerChildren: 0.05 } },
  },
  tap: { scale: 0.95 },
};

const CATEGORY_THEMES = {
  wedding: { name: "Wedding", emoji: "💒", primary: "#1e40af", bgSoft: "bg-blue-50/50", accent: "text-blue-600" },
  anniversary: {
    name: "Anniversary",
    emoji: "💝",
    primary: "#be185d",
    bgSoft: "bg-pink-50/50",
    accent: "text-pink-600",
  },
  birthday: { name: "Birthday", emoji: "🎂", primary: "#a16207", bgSoft: "bg-yellow-50/50", accent: "text-yellow-600" },
  default: { name: "Event", emoji: "🎉", primary: "#1e40af", bgSoft: "bg-gray-50/50", accent: "text-blue-600" },
};

// =============================================================================
// ROBUST HOOKS
// =============================================================================

// Fixes Hydration Mismatch Errors
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch (error) {
      console.warn(`LocalStorage Error: ${key}`, error);
    }
    setIsHydrated(true);
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
        console.warn(`LocalStorage Set Error: ${key}`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, isHydrated];
}

function useHaptic() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(type === "medium" ? 20 : 10);
    }
  }, []);
}

// =============================================================================
// REUSABLE UI COMPONENTS
// =============================================================================

const SectionHeader = memo(({ title, subtitle, icon: Icon, theme, actionLabel, onAction }) => (
  <div className="flex items-end justify-between mb-5 px-1">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.bgSoft}`}>
          <Icon size={20} style={{ color: theme.primary }} />
        </div>
      )}
      <div>
        <h2 className="text-lg font-bold text-gray-900 leading-none">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-1.5 font-medium">{subtitle}</p>}
      </div>
    </div>
    {actionLabel && (
      <motion.button
        whileTap={ANIMATION_CONFIG.tap}
        onClick={onAction}
        className="text-xs font-bold flex items-center gap-1 py-1.5 px-3 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
      >
        {actionLabel} <ChevronRight size={14} />
      </motion.button>
    )}
  </div>
));

const ModalOverlay = memo(({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-[2rem] max-h-[85vh] flex flex-col shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-6 pb-safe">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

// =============================================================================
// SUB-COMPONENTS (Refined Spacing & Animation)
// =============================================================================

const QuickActions = memo(({ theme, onAction }) => {
  const actions = [
    { icon: Calendar, label: "Set Date", action: "date", color: "#e11d48" },
    { icon: Users, label: "Guests", action: "guests", color: "#7c3aed" },
    { icon: Wallet, label: "Budget", action: "budget", color: "#059669" },
    { icon: ClipboardList, label: "Checklist", action: "checklist", color: "#d97706" },
    { icon: Camera, label: "Photos", action: "vendors", color: "#db2777" },
    { icon: Music, label: "Music", action: "vendors", color: "#2563eb" },
    { icon: Utensils, label: "Food", action: "vendors", color: "#ea580c" },
    { icon: Gift, label: "Gifts", action: "gifts", color: "#c026d3" },
  ];

  return (
    <div className="px-5 py-6">
      <SectionHeader title="Quick Actions" subtitle="Start planning here" icon={Sparkles} theme={theme} />
      <div className="grid grid-cols-4 gap-4">
        {actions.map((item, idx) => (
          <motion.button
            key={idx}
            {...ANIMATION_CONFIG.fadeIn}
            transition={{ delay: idx * 0.05 }}
            whileTap={ANIMATION_CONFIG.tap}
            onClick={() => onAction(item.action)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-gray-100 group-active:scale-95 transition-transform">
              <item.icon size={24} style={{ color: item.color }} />
            </div>
            <span className="text-[11px] font-semibold text-gray-600 text-center leading-tight">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
});

const CountdownTimer = memo(({ theme, onOpenDatePicker, eventDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });

  useEffect(() => {
    if (!eventDate) return;
    const calc = () => {
      const diff = new Date(eventDate) - new Date();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0 });
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      });
    };
    calc();
    const timer = setInterval(calc, 60000);
    return () => clearInterval(timer);
  }, [eventDate]);

  if (!eventDate) {
    return (
      <div className="px-5 pb-6">
        <motion.button
          whileTap={ANIMATION_CONFIG.tap}
          onClick={onOpenDatePicker}
          className="w-full p-6 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <CalendarDays size={32} className="text-gray-400 mb-1" />
          <p className="font-bold text-gray-900">Set Event Date</p>
          <p className="text-xs text-gray-500">Enable countdown & reminders</p>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="px-5 pb-6">
      <div className="relative overflow-hidden rounded-3xl p-6 shadow-sm border border-gray-100 bg-white">
        <div
          className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme.bgSoft} rounded-bl-full opacity-50 pointer-events-none`}
        />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time Remaining</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-gray-900 tracking-tighter">{timeLeft.days}</span>
              <span className="text-sm font-bold text-gray-500 mr-2">days</span>
              <span className="text-2xl font-bold text-gray-400">{timeLeft.hours}</span>
              <span className="text-xs font-semibold text-gray-400">hrs</span>
            </div>
          </div>
          <motion.button
            whileTap={ANIMATION_CONFIG.tap}
            onClick={onOpenDatePicker}
            className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 border border-gray-100"
          >
            <Edit2 size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
});

const VendorCategories = memo(({ theme, onViewVendors }) => {
  const categories = [
    { id: "venues", label: "Venues", icon: Building, color: "#7c3aed" },
    { id: "photographers", label: "Photos", icon: Camera, color: "#db2777" },
    { id: "catering", label: "Food", icon: Utensils, color: "#ea580c" },
    { id: "makeup", label: "Makeup", icon: Palette, color: "#e11d48" },
    { id: "decor", label: "Decor", icon: Flower2, color: "#0d9488" },
  ];

  return (
    <div className="py-6 border-t border-gray-100">
      <div className="px-5">
        <SectionHeader
          title="Find Vendors"
          subtitle="Explore categories"
          icon={Building}
          theme={theme}
          actionLabel="See All"
          onAction={() => onViewVendors(null)}
        />
      </div>
      <div className="flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide snap-x snap-mandatory">
        {categories.map((cat, idx) => (
          <motion.button
            key={cat.id}
            {...ANIMATION_CONFIG.fadeIn}
            transition={{ delay: idx * 0.05 }}
            whileTap={ANIMATION_CONFIG.tap}
            onClick={() => onViewVendors(cat.id)}
            className="flex-shrink-0 snap-start flex flex-col items-center gap-3 w-20"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 bg-white">
              <cat.icon size={24} style={{ color: cat.color }} />
            </div>
            <span className="text-xs font-medium text-gray-700">{cat.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
});

const FeaturedVendors = memo(({ theme, onViewVendor }) => {
  // Sample Data (kept minimal for display)
  const vendors = [
    {
      id: 1,
      name: "Royal Palace",
      role: "Venue",
      rating: 4.9,
      img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400",
    },
    {
      id: 2,
      name: "Lens Magic",
      role: "Photo",
      rating: 4.8,
      img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400",
    },
    {
      id: 3,
      name: "Tasty Bites",
      role: "Food",
      rating: 4.7,
      img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400",
    },
  ];

  return (
    <div className="py-6 bg-gray-50/50">
      <div className="px-5">
        <SectionHeader title="Top Picks" subtitle="Trending near you" icon={Star} theme={theme} />
      </div>
      <div className="flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide snap-x snap-mandatory">
        {vendors.map((v, idx) => (
          <motion.div
            key={v.id}
            {...ANIMATION_CONFIG.fadeIn}
            transition={{ delay: idx * 0.1 }}
            className="w-60 flex-shrink-0 snap-start bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            onClick={() => onViewVendor(v)}
          >
            <div className="h-32 bg-gray-200 relative">
              <img src={v.img} alt={v.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                <Star size={10} className="fill-amber-400 text-amber-400" /> {v.rating}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900">{v.name}</h3>
              <p className="text-xs text-gray-500">{v.role} • Mumbai</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

const ChecklistPreview = memo(({ theme, onClick }) => (
  <div className="px-5 py-6 border-t border-gray-100">
    <div
      onClick={onClick}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 active:scale-[0.99] transition-transform"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${theme.bgSoft}`}>
            <ClipboardList size={22} style={{ color: theme.primary }} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">Checklist</h3>
            <p className="text-xs text-gray-500">Keep track of tasks</p>
          </div>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 rounded-full text-gray-600">0/8 Done</span>
      </div>
      <div className="space-y-3">
        {["Set Date", "Book Venue", "Send Invites"].map((task, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
            <span className="text-sm text-gray-600">{task}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
));

const BudgetPreview = memo(({ theme, onClick }) => (
  <div className="px-5 py-6">
    <div
      onClick={onClick}
      className="bg-gray-900 rounded-3xl shadow-lg p-6 text-white active:scale-[0.99] transition-transform relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none" />

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
            <Wallet size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white leading-tight">Budget</h3>
            <p className="text-xs text-white/60">Track expenses</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-white/40" />
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-white/60 mb-1">Total Budget</p>
            <p className="text-2xl font-bold">₹1,50,000</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60 mb-1">Spent</p>
            <p className="text-xl font-semibold text-white/90">₹0</p>
          </div>
        </div>
        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
          <div className="h-full bg-white w-[5%]" />
        </div>
      </div>
    </div>
  </div>
));

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function CategoryEventsPageWrapper() {
  const params = useParams();
  const { setIsNavbarVisible } = useNavbarVisibilityStore();
  const setActiveCategory = useCategoryStore((state) => state.setActiveCategory);

  // State
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastState, setToastState] = useState({ isVisible: false, message: "", type: "success" });

  // Modals State
  const [activeModal, setActiveModal] = useState(null); // 'date', 'guests', 'budget', 'checklist', 'vendors', 'contact'

  // Extract Category
  const categoryParam = (params?.category || "wedding").toLowerCase();
  const category = ["wedding", "anniversary", "birthday", "default"].includes(categoryParam)
    ? categoryParam
    : "default";

  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.default;
  const [eventDate, setEventDate, isHydrated] = useLocalStorage(`${category}_event_date`, null);

  // Initialize
  useEffect(() => {
    setActiveCategory(theme.name);
    // Smooth loading transition
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [category, setActiveCategory, theme.name]);

  // Modal Handlers
  const openModal = (modalName) => {
    setActiveModal(modalName);
    setIsNavbarVisible(false);
  };

  const closeModal = () => {
    setActiveModal(null);
    setIsNavbarVisible(true);
  };

  const handleQuickAction = (action) => {
    const map = {
      date: "date",
      guests: "guests",
      budget: "budget",
      checklist: "checklist",
      vendors: "vendors",
    };
    if (map[action]) openModal(map[action]);
  };

  // Loading Skeleton
  if (!isLoaded || !isHydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative w-full min-h-screen bg-white pb-safe">
      <Toast {...toastState} onClose={() => setToastState((p) => ({ ...p, isVisible: false }))} />

      {/* Static Components (Assuming these are optimized internally) */}
      <HeroSection theme={theme} category={category} />
      <Banner1 theme={theme} category={category} />
      <HowItWorksSection theme={theme} category={category} />

      {/* Main Interactive Flow */}
      <div className="flex flex-col">
        {/* Quick Actions */}
        <QuickActions theme={theme} onAction={handleQuickAction} />

        {/* Countdown */}
        <CountdownTimer theme={theme} eventDate={eventDate} onOpenDatePicker={() => openModal("date")} />

        {/* Categories - Horizontal Scroll */}
        <VendorCategories theme={theme} onViewVendors={() => openModal("vendors")} />

        {/* Featured - Horizontal Scroll */}
        <FeaturedVendors theme={theme} onViewVendor={() => openModal("vendors")} />

        {/* Planning Tools */}
        <ChecklistPreview theme={theme} onClick={() => openModal("checklist")} />
        <BudgetPreview theme={theme} onClick={() => openModal("budget")} />

        {/* Inspiration */}
        <div className="px-5 py-6">
          <SectionHeader title="Inspiration" subtitle="Ideas for you" icon={ImageIcon} theme={theme} />
          <div className="grid grid-cols-2 gap-3 h-48">
            <div className="bg-gray-100 rounded-2xl h-full w-full animate-pulse" />
            <div className="bg-gray-100 rounded-2xl h-full w-full animate-pulse" />
          </div>
        </div>

        {/* FAQ */}
        <div className="px-5 py-6 mb-24">
          <SectionHeader title="FAQ" subtitle="Common questions" icon={HelpCircle} theme={theme} />
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-2xl text-sm font-medium text-gray-700 flex justify-between">
              How do I book? <ChevronDown size={16} />
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-sm font-medium text-gray-700 flex justify-between">
              Is payment secure? <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => openModal("contact")}
        className="fixed bottom-6 right-5 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white"
        style={{ backgroundColor: theme.primary }}
      >
        <MessageCircle size={26} fill="currentColor" />
      </motion.button>

      {/* ----------- MODALS ----------- */}

      <ModalOverlay isOpen={activeModal === "date"} onClose={closeModal} title="Event Date">
        <div className="space-y-6">
          <p className="text-gray-500 text-sm">When is the big day?</p>
          <input
            type="date"
            className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-lg outline-none focus:ring-2 ring-blue-500"
            onChange={(e) => setEventDate(e.target.value)}
            value={eventDate || ""}
          />
          <button onClick={closeModal} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold">
            Save Date
          </button>
        </div>
      </ModalOverlay>

      <ModalOverlay isOpen={activeModal === "checklist"} onClose={closeModal} title="Checklist">
        <div className="text-center py-12 text-gray-400">Full Checklist Component Here</div>
      </ModalOverlay>

      <ModalOverlay isOpen={activeModal === "budget"} onClose={closeModal} title="Budget">
        <div className="text-center py-12 text-gray-400">Full Budget Component Here</div>
      </ModalOverlay>

      {/* Add other modals similarly */}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }
      `}</style>
    </main>
  );
}
