"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
import {
  MapPin,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  Share2,
  Check,
  Map as MapIcon,
  Wifi,
  Car,
  Music,
  Wind,
  Camera,
  User,
  Shield,
  Utensils,
  Crown,
  Home,
  ArrowLeft,
  X,
  Facebook,
  Twitter,
  Copy,
  Clock,
  Info,
  Users,
  MessageCircle,
  ImageIcon,
  Award,
  Sparkles,
  ThumbsUp,
  Flag,
  Bookmark,
  Navigation,
  ExternalLink,
  Verified,
  TrendingUp,
  Zap,
  Gift,
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
  Instagram,
  Linkedin,
  Send,
  Building,
  Layers,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Tv,
  Coffee,
  Flower2,
  Shirt,
  UtensilsCrossed,
  BadgeCheck,
  CircleDollarSign,
  CalendarCheck,
  CalendarX,
  Percent,
  Timer,
  MapPinned,
  Route,
  Banknote,
  HandCoins,
  ShieldCheck,
  Medal,
  Trophy,
  Gem,
  PartyPopper,
  GlassWater,
  Mic2,
  Video,
  Projector,
  Armchair,
  DoorOpen,
  Accessibility,
  Baby,
  PawPrint,
  Cigarette,
  ThermometerSun,
  Flame,
  Sun,
  Compass,
  Download,
  Bell,
  Wallet,
  BarChart3,
  MessageSquare,
  ChevronDown,
  Headphones,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import DetailsPageSkeleton from "../ui/skeletons/DetailsPageSkeleton";
import Link from "next/link";
import dynamic from "next/dynamic";
import ReviewSection from "../ReviewSection";

const SmartMedia = dynamic(() => import("@/components/mobile/SmartMediaLoader"), {
  loading: () => <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse" />,
  ssr: false,
});

const AUTOPLAY_DELAY = 5000;

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
};

const TAB_CONFIG = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "amenities", label: "Amenities", icon: Star },
  { id: "gallery", label: "Gallery", icon: Camera },
  { id: "packages", label: "Packages", icon: Gift },
  { id: "reviews", label: "Reviews", icon: MessageCircle },
  { id: "faqs", label: "FAQs", icon: MessageSquare },
  { id: "policies", label: "Policies", icon: FileText },
  { id: "location", label: "Location", icon: MapPin },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const collapseVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1 },
};

const modalTransition = {
  type: "spring",
  damping: 30,
  stiffness: 400,
  mass: 0.8,
};

const backdropTransition = {
  duration: 0.2,
  ease: "easeOut",
};

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

const CollapsibleSection = memo(({ title, icon: Icon, iconColor, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleSection = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
      <button
        onClick={toggleSection}
        className="w-full p-4 flex items-center justify-between text-left active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className={iconColor || "text-blue-500"} size={16} />}
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={collapseVariants}
            transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-4 pb-4 pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

CollapsibleSection.displayName = "CollapsibleSection";

const ProgressIndicator = memo(({ total, currentIndex, duration, isPaused, onSelect }) => {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(null);
  const pausedProgressRef = useRef(0);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    startTimeRef.current = null;
    pausedProgressRef.current = 0;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      pausedProgressRef.current = progress;
      return;
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp - (pausedProgressRef.current / 100) * duration;
      }

      const elapsed = timestamp - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(newProgress);

      if (newProgress < 100) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, duration, currentIndex, progress]);

  const remainingSeconds = Math.ceil(((100 - progress) / 100) * (duration / 1000));

  const handleIndicatorClick = useCallback(
    (idx) => {
      onSelect(idx);
    },
    [onSelect]
  );

  return (
    <div className="absolute bottom-18 left-0 right-0 z-30 pointer-events-none">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="relative pt-16 pb-6 px-3">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2 border border-white/10 shadow-xl pointer-events-auto">
              <span className="text-white font-bold text-xs">{currentIndex + 1}</span>
              <div className="w-px h-3 bg-white/30" />
              <span className="text-white/60 text-xs">{total}</span>
              {isPaused && (
                <>
                  <div className="w-px h-3 bg-white/30" />
                  <Pause size={10} className="text-white/60" />
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-1.5 px-2 max-w-sm mx-auto pointer-events-auto">
            {Array.from({ length: total }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleIndicatorClick(idx)}
                className="relative h-1 flex-1 max-w-[40px] rounded-full overflow-hidden group transition-all duration-200"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div className="absolute inset-0 bg-white/25 group-hover:bg-white/35 transition-colors rounded-full" />

                {idx < currentIndex && <div className="absolute inset-0 bg-white rounded-full" />}

                {idx === currentIndex && (
                  <div
                    className="absolute inset-0 bg-white rounded-full origin-left"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-center mt-2 pointer-events-auto">
            <div className="flex items-center gap-1 text-white/50 text-[10px] bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Timer size={9} />
              <span className="font-medium">{remainingSeconds}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProgressIndicator.displayName = "ProgressIndicator";

const VendorCard = memo(({ item, type = "horizontal" }) => {
  if (type === "horizontal") {
    return (
      <Link href={`/vendor/${item.category}/${item._id}`} className="min-w-[200px] snap-start">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="h-28 relative">
            <SmartMedia
              src={item.images[0]}
              type="image"
              className="w-full h-full object-cover"
              loaderImage="/GlowLoadingGif.gif"
            />
            <div className="absolute top-1.5 right-1.5 bg-white/90 dark:bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 shadow">
              <Star size={8} className="fill-yellow-500 text-yellow-500" /> {item.rating}
            </div>
            <div className="absolute top-1.5 left-1.5 bg-green-500/90 px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow">
              {Math.floor(Math.random() * 20 + 10)}% OFF
            </div>
          </div>
          <div className="p-2">
            <h3 className="font-bold text-xs text-gray-900 dark:text-white truncate">{item.name}</h3>
            <p className="text-[10px] text-gray-500 mt-0.5 truncate flex items-center gap-0.5">
              <MapPin size={8} /> {item.address?.city}
            </p>
            <div className="mt-1.5 flex items-center justify-between">
              <p className="text-blue-600 dark:text-blue-400 font-bold text-xs">
                ₹{item.perDayPrice?.min?.toLocaleString("en-IN") || "N/A"}
              </p>
              <span className="text-[8px] text-gray-400 font-bold uppercase">/ Day</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/vendor/${item.category}/${item._id}`}>
      <div className="flex gap-2 bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm">
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
          <SmartMedia
            src={item.images[0]}
            type="image"
            className="w-full h-full object-cover"
            loaderImage="/GlowLoadingGif.gif"
          />
          <div className="absolute bottom-0.5 left-0.5 bg-black/70 px-1 py-0.5 rounded text-[8px] text-white font-bold">
            {item.images?.length || 5} pics
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{item.name}</h4>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={8}
                  className={i < Math.floor(item.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({item.reviews})</span>
          </div>
          <div className="flex items-center gap-0.5 mt-0.5">
            <MapPin size={8} className="text-gray-400" />
            <span className="text-[10px] text-gray-500 truncate">{item.address?.city}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-blue-600 font-bold text-xs">₹{item.perDayPrice?.min?.toLocaleString()}</span>
            <span className="text-[9px] text-green-600 font-bold">Free Cancellation</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

VendorCard.displayName = "VendorCard";

const ReviewCard = memo(({ review }) => (
  <div className="bg-white dark:bg-gray-900 p-3 rounded-xl">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-[10px]">
        {review.avatar}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <p className="font-bold text-xs text-gray-900 dark:text-white">{review.name}</p>
          {review.verified && (
            <span className="px-1 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-[8px] font-bold rounded flex items-center gap-0.5">
              <Verified size={8} />
              Verified
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={9} className={i < review.rating ? "fill-current" : ""} />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">• {review.date}</span>
          <span className="text-[10px] text-blue-500 font-medium">• {review.eventType}</span>
        </div>
      </div>
      <button className="p-1 text-gray-400">
        <Flag size={12} />
      </button>
    </div>
    <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed mb-2">{review.text}</p>
    <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
      <button className="flex items-center gap-1 text-[10px] text-gray-500">
        <ThumbsUp size={11} />
        Helpful ({review.helpful})
      </button>
      <button className="flex items-center gap-1 text-[10px] text-gray-500">
        <MessageCircle size={11} />
        Reply
      </button>
      <button className="flex items-center gap-1 text-[10px] text-gray-500">
        <Share2 size={11} />
        Share
      </button>
    </div>
  </div>
));

ReviewCard.displayName = "ReviewCard";

const PackageCard = memo(({ pkg, isSelected, onSelect }) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    onClick={() => onSelect(pkg.id)}
    className={`bg-white dark:bg-gray-900 p-4 rounded-xl border-2 transition-all ${
      isSelected ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-transparent"
    } ${pkg.popular ? "ring-2 ring-yellow-400 ring-offset-2 dark:ring-offset-black" : ""}`}
  >
    {pkg.popular && (
      <div className="flex justify-center -mt-7 mb-2">
        <span className="px-3 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
          <Sparkles size={10} />
          Most Popular
        </span>
      </div>
    )}
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{pkg.name}</h4>
        <p className="text-[10px] text-gray-500">{pkg.duration} access</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString("en-IN")}</p>
        <p className="text-lg font-black text-blue-600 dark:text-blue-400">₹{pkg.price.toLocaleString("en-IN")}</p>
        <span className="text-[10px] font-bold text-green-500">Save {pkg.savings}%</span>
      </div>
    </div>
    <div className="space-y-1.5 mb-3">
      {pkg.features.slice(0, 5).map((feature, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <CheckCircle size={11} className="text-green-500 shrink-0" />
          <span className="text-[11px] text-gray-600 dark:text-gray-300">{feature}</span>
        </div>
      ))}
      {pkg.features.length > 5 && (
        <p className="text-[10px] text-blue-500 font-medium">+{pkg.features.length - 5} more features</p>
      )}
      {pkg.notIncluded.slice(0, 2).map((feature, idx) => (
        <div key={idx} className="flex items-center gap-1.5 opacity-50">
          <X size={11} className="text-gray-400 shrink-0" />
          <span className="text-[11px] text-gray-400 line-through">{feature}</span>
        </div>
      ))}
    </div>
    <button
      className={`w-full py-2 rounded-lg font-bold text-xs transition-all ${
        isSelected ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      }`}
    >
      {isSelected ? "✓ Selected" : "Select Package"}
    </button>
  </motion.div>
));

PackageCard.displayName = "PackageCard";

const VendorDetailsPageWrapper = () => {
  const { id } = useParams();
  const router = useRouter();
  const { activeCategory } = useCategoryStore();

  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const contentRef = useRef(null);
  const similarRef = useRef(null);
  const recommendedRef = useRef(null);
  const tabsRef = useRef(null);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const autoplayTimerRef = useRef(null);

  const { scrollY } = useScroll();
  const carouselY = useTransform(scrollY, [0, 500], [0, 150]);
  const carouselScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const carouselOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarVendors, setSimilarVendors] = useState([]);
  const [recommendedVendors, setRecommendedVendors] = useState([]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [showContactSheet, setShowContactSheet] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [imageZoom, setImageZoom] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState("all");

  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    guests: "",
    eventType: "",
    budget: "",
    timeSlot: "",
    notes: "",
  });

  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const fetchVendor = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/vendor/${id}`);
      if (!response.ok) throw new Error("Failed to fetch vendor data.");
      const data = await response.json();
      setVendor(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  useEffect(() => {
    if (!vendor?._id) return;
    const fetchLists = async () => {
      try {
        const response = await fetch(`/api/vendor/lists/${vendor._id}`);
        if (response.ok) {
          const data = await response.json();
          setSimilarVendors(data.similarVendors || []);
          setRecommendedVendors(data.recommendedVendors || []);
        }
      } catch (e) {
        console.error("Failed to load recommendations", e);
      }
    };
    fetchLists();
  }, [vendor]);

  const images = useMemo(() => vendor?.images || [], [vendor]);

  const packages = useMemo(
    () => [
      {
        id: 1,
        name: "Silver Package",
        price: vendor?.perDayPrice?.min || 50000,
        originalPrice: (vendor?.perDayPrice?.min || 50000) * 1.2,
        duration: "8 hours",
        features: [
          "Basic Decoration",
          "Standard Catering (Veg)",
          "8 Hours Venue Access",
          "Up to 100 Guests",
          "Basic Sound System",
          "Standard Lighting",
        ],
        notIncluded: ["DJ Services", "Photography", "Valet Parking"],
        popular: false,
        savings: 20,
      },
      {
        id: 2,
        name: "Gold Package",
        price: (vendor?.perDayPrice?.min || 50000) * 1.5,
        originalPrice: (vendor?.perDayPrice?.min || 50000) * 1.8,
        duration: "12 hours",
        features: [
          "Premium Decoration",
          "Premium Catering (Veg & Non-Veg)",
          "12 Hours Venue Access",
          "Up to 250 Guests",
          "Professional DJ Services",
          "Premium Lighting Setup",
          "Basic Photography Package",
          "Welcome Drinks",
        ],
        notIncluded: ["Valet Parking", "Video Coverage"],
        popular: true,
        savings: 25,
      },
      {
        id: 3,
        name: "Platinum Package",
        price: (vendor?.perDayPrice?.min || 50000) * 2.5,
        originalPrice: (vendor?.perDayPrice?.min || 50000) * 3,
        duration: "24 hours",
        features: [
          "Luxury Decoration",
          "Gourmet Catering (Multi-cuisine)",
          "24 Hours Venue Access",
          "Up to 500 Guests",
          "Celebrity DJ",
          "Premium Photography & Videography",
          "Valet Parking",
          "Bridal Suite Access",
          "Live Entertainment",
          "Custom Theme Setup",
          "Complimentary Accommodation (2 Rooms)",
        ],
        notIncluded: [],
        popular: false,
        savings: 30,
      },
    ],
    [vendor]
  );

  const policies = useMemo(
    () => [
      {
        title: "Cancellation Policy",
        icon: CalendarX,
        iconColor: "text-red-500",
        content:
          "Free cancellation up to 30 days before the event. 50% refund for cancellations made 15-30 days prior.",
        details: [
          "Full refund if cancelled 30+ days before",
          "50% refund for 15-30 days notice",
          "No refund under 14 days notice",
        ],
      },
      {
        title: "Payment Terms",
        icon: CreditCard,
        iconColor: "text-blue-500",
        content: "30% advance payment required to confirm booking. Remaining 70% to be paid 7 days before the event.",
        details: ["30% booking advance", "40% due 15 days before", "30% balance 7 days before"],
      },
      {
        title: "Terms & Conditions",
        icon: FileText,
        iconColor: "text-gray-500",
        content: "Outside food not allowed. Decorations must be approved. Noise restrictions after 10 PM.",
        details: ["No outside catering", "Decoration approval required", "Noise curfew after 10 PM"],
      },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        question: "What is the maximum guest capacity?",
        answer: "Our venue can accommodate up to 500 guests for seated dinner and 800 for cocktail events.",
      },
      {
        question: "Is outside catering allowed?",
        answer: "We have exclusive catering partners. Outside catering is not permitted to maintain quality standards.",
      },
      {
        question: "What are the decoration guidelines?",
        answer: "Decorations that don't damage the venue are allowed. Plans must be approved 7 days before.",
      },
      {
        question: "Is there parking available?",
        answer: "Yes, ample parking for 200+ vehicles. Valet parking available as add-on.",
      },
      {
        question: "What is the booking process?",
        answer: "Check availability, pay 30% advance, submit details 15 days prior, complete payment 7 days before.",
      },
    ],
    []
  );

  const mockReviews = useMemo(
    () => [
      {
        id: 1,
        name: "Priya S.",
        rating: 5,
        date: "2 days ago",
        text: "Absolutely stunning venue! Perfect for our wedding.",
        avatar: "PS",
        helpful: 24,
        verified: true,
        eventType: "Wedding",
      },
      {
        id: 2,
        name: "Rahul V.",
        rating: 4,
        date: "1 week ago",
        text: "Great location and beautiful interiors. Food was excellent.",
        avatar: "RV",
        helpful: 18,
        verified: true,
        eventType: "Corporate",
      },
      {
        id: 3,
        name: "Anita D.",
        rating: 5,
        date: "2 weeks ago",
        text: "Perfect venue for our corporate event. Professional staff.",
        avatar: "AD",
        helpful: 32,
        verified: true,
        eventType: "Conference",
      },
    ],
    []
  );

  const filteredReviews = useMemo(() => {
    if (reviewFilter === "all") return mockReviews;
    if (reviewFilter === "photos") return mockReviews.filter((r) => r.images?.length > 0);
    return mockReviews.filter((r) => r.rating >= parseInt(reviewFilter));
  }, [mockReviews, reviewFilter]);

  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date,
        available: Math.random() > 0.3,
        price: Math.floor((vendor?.perDayPrice?.min || 50000) * (0.9 + Math.random() * 0.3)),
      });
    }
    return dates;
  }, [vendor]);

  const highlights = useMemo(
    () => [
      {
        icon: Trophy,
        label: "Top Rated",
        value: "4.8+",
        color: "text-yellow-500",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
      },
      { icon: Users, label: "Events", value: "500+", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
      {
        icon: Timer,
        label: "Response",
        value: "<2hrs",
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-900/20",
      },
      { icon: Medal, label: "Years", value: "15+", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    ],
    []
  );

  const stats = useMemo(
    () => [
      { label: "Total Bookings", value: "2,500+", trend: "+12%", positive: true },
      { label: "Repeat Customers", value: "45%", trend: "+5%", positive: true },
      { label: "Avg. Rating", value: "4.8", trend: "+0.2", positive: true },
      { label: "Response Rate", value: "98%", trend: "+3%", positive: true },
    ],
    []
  );

  const goToImage = useCallback(
    (index, direction = null) => {
      if (images.length <= 1) return;
      const newDirection = direction !== null ? direction : index > currentImageIndex ? 1 : -1;
      setSlideDirection(newDirection);
      setCurrentImageIndex(index);
    },
    [images.length, currentImageIndex]
  );

  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    const nextIndex = (currentImageIndex + 1) % images.length;
    goToImage(nextIndex, 1);
  }, [currentImageIndex, images.length, goToImage]);

  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    goToImage(prevIndex, -1);
  }, [currentImageIndex, images.length, goToImage]);

  useEffect(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }

    if (isPaused || images.length <= 1) {
      return;
    }

    autoplayTimerRef.current = setTimeout(() => {
      nextImage();
    }, AUTOPLAY_DELAY);

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [currentImageIndex, isPaused, images.length, nextImage]);

  const togglePlayPause = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPaused((prev) => !prev);
  }, []);

  const handleIndicatorSelect = useCallback(
    (index) => {
      goToImage(index);
    },
    [goToImage]
  );

  const handleTouchStart = useCallback((e) => {
    dragStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (!isDragging.current) return;
      const dragEndX = e.changedTouches[0].clientX;
      const diff = dragStartX.current - dragEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextImage();
        } else {
          prevImage();
        }
      }

      isDragging.current = false;
    },
    [nextImage, prevImage]
  );

  const scrollContainer = useCallback((ref, direction) => {
    if (ref.current) {
      const scrollAmount = window.innerWidth * 0.7;
      ref.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  }, []);

  const handleShare = useCallback(
    (platform) => {
      const url = window.location.href;
      const text = `Check out ${vendor?.name} on PlanWAB!`;

      const shareUrls = {
        copy: () => navigator.clipboard.writeText(url),
        facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`),
        twitter: () =>
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
          ),
        instagram: () => navigator.clipboard.writeText(url),
        linkedin: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`),
        whatsapp: () => window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`),
        telegram: () =>
          window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`),
        email: () => window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`),
      };

      shareUrls[platform]?.();
      setShowShareModal(false);
    },
    [vendor?.name]
  );

  const handleBookingSubmit = useCallback(() => {
    setShowBookingSheet(false);
    setBookingForm({
      name: "",
      phone: "",
      email: "",
      date: "",
      guests: "",
      eventType: "",
      budget: "",
      timeSlot: "",
      notes: "",
    });
  }, []);

  const handleInquirySubmit = useCallback(() => {
    setShowInquiryModal(false);
    setInquiryForm({ name: "", phone: "", email: "", subject: "", message: "" });
  }, []);

  const handleReviewSubmit = useCallback(() => {
    setShowReviewModal(false);
    setReviewRating(0);
    setReviewText("");
  }, []);

  const handlePackageSelect = useCallback((pkgId) => {
    setSelectedPackage(pkgId);
  }, []);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  if (loading) return <DetailsPageSkeleton />;
  if (error || !vendor)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500 gap-3 px-4">
        <Info size={40} className="text-gray-300" />
        <p className="text-center text-sm">Vendor not found or error loading data.</p>
        <button
          onClick={() => router.back()}
          className="px-5 py-2 bg-blue-600 text-white rounded-full font-bold text-sm"
        >
          Go Back
        </button>
      </div>
    );

  const displayPrice = vendor.perDayPrice?.min?.toLocaleString("en-IN") || "N/A";

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-white dark:bg-black font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden border-none shadow-none"
    >
      <ScrollProgressBar />
      {/* STICKY HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 rounded-b-2xl">
        <div className="flex items-center justify-between px-3 py-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-1.5 -ml-1 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
          >
            <ArrowLeft size={22} className="text-gray-700 dark:text-gray-200" />
          </motion.button>

          <div className="flex gap-1">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-1.5 rounded-full transition-all ${
                isBookmarked
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500"
                  : "active:bg-gray-100 dark:active:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <Bookmark size={20} className={isBookmarked ? "fill-current" : ""} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`p-1.5 rounded-full transition-all ${
                isLiked
                  ? "bg-rose-50 dark:bg-rose-900/30 text-rose-500"
                  : "active:bg-gray-100 dark:active:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <Heart size={20} className={isLiked ? "fill-current" : ""} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setShowShareModal(true)}
              className="p-1.5 rounded-full active:bg-gray-100 dark:active:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              <Share2 size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* PARALLAX IMAGE CAROUSEL */}
      <motion.div
        ref={carouselRef}
        className="fixed top-0 left-0 right-0 w-full h-[60vh] bg-white z-0"
        style={{
          y: carouselY,
          scale: carouselScale,
          opacity: carouselOpacity,
        }}
      >
        <div className="relative w-full h-full" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <AnimatePresence initial={false} custom={slideDirection} mode="wait">
            <motion.div
              key={currentImageIndex}
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 35 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              <SmartMedia
                src={images[currentImageIndex]}
                type="image"
                priority={true}
                className="w-full h-full object-cover"
                loaderImage="/GlowLoadingGif.gif"
              />
            </motion.div>
          </AnimatePresence>

          {/* Top Tags */}
          <div className="absolute top-14 left-3 flex flex-wrap gap-1.5 z-10">
            {vendor.isVerified && (
              <span className="px-2 py-1 bg-green-500/90 backdrop-blur-xl rounded-full text-white text-[10px] font-bold flex items-center gap-0.5 shadow-lg">
                <Verified size={10} />
                Verified
              </span>
            )}
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-xl rounded-full text-white text-[10px] font-bold flex items-center gap-0.5 shadow-lg">
              <Sparkles size={10} />
              Featured
            </span>
          </div>

          {/* Play/Pause Button */}
          <div className="absolute top-14 right-3 z-10">
            <motion.button
              whileTap={{ scale: 0.85 }}
              animate={{
                backgroundColor: isPaused ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)",
                borderColor: isPaused ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)",
              }}
              transition={{ duration: 0.15 }}
              onClick={togglePlayPause}
              className="p-2.5 rounded-full text-white shadow-lg backdrop-blur-md border"
            >
              <motion.div
                key={isPaused ? "play" : "pause"}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
              </motion.div>
            </motion.button>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full text-white z-20 bg-black/30 backdrop-blur-md active:bg-black/50 border border-white/10 shadow-xl"
              >
                <ChevronLeft size={22} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full text-white z-20 bg-black/30 backdrop-blur-md active:bg-black/50 border border-white/10 shadow-xl"
              >
                <ChevronRight size={22} />
              </motion.button>
            </>
          )}

          {/* Progress Indicator */}
          {images.length > 1 && (
            <ProgressIndicator
              total={images.length}
              currentIndex={currentImageIndex}
              duration={AUTOPLAY_DELAY}
              isPaused={isPaused}
              onSelect={handleIndicatorSelect}
            />
          )}

          {/* View All Photos Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setModalImageIndex(0);
              setShowImageModal(true);
            }}
            className="absolute bottom-45 right-3 px-3 py-1.5 bg-black/50 backdrop-blur-xl rounded-full text-white text-[10px] font-bold flex items-center gap-1.5 border border-white/20 z-20 shadow-xl"
          >
            <ImageIcon size={12} />
            {images.length} Photos
          </motion.button>
        </div>
      </motion.div>

      {/* SPACER */}
      <div className="h-[50vh]" />

      {/* MAIN CONTENT */}
      <div
        ref={contentRef}
        className="relative z-10 bg-white dark:bg-black min-h-screen rounded-t-4xl border-none shadow-none"
      >
        {/* VENDOR INFO CARD */}
        <div className="bg-white dark:bg-gray-900 rounded-t-[2rem] px-4 pt-5 pb-4 shadow-2xl -mt-6 relative">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />

          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h1 className="text-lg font-black text-gray-900 dark:text-white leading-tight truncate">
                  {vendor.name}
                </h1>
                {vendor.isVerified && <Verified size={16} className="text-blue-500 fill-blue-500 shrink-0" />}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="flex items-center gap-0.5 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-full">
                  <Star size={11} className="fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-yellow-700 dark:text-yellow-400 text-[11px]">{vendor.rating}</span>
                  <span className="text-yellow-600/70 text-[10px]">({vendor.reviews})</span>
                </div>
                <div className="flex items-center gap-0.5 text-gray-500 text-[11px]">
                  <MapPin size={11} />
                  <span className="font-medium">{vendor.address.city}</span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg font-black text-blue-600 dark:text-blue-400">₹{displayPrice}</span>
              <p className="text-[10px] text-gray-400">starting price</p>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-4 gap-1.5 py-3 border-t border-b border-gray-100 dark:border-gray-800">
            {highlights.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-9 h-9 mx-auto mb-0.5 ${item.bg} rounded-lg flex items-center justify-center`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <p className="font-bold text-[11px] text-gray-900 dark:text-white">{item.value}</p>
                <p className="text-[8px] text-gray-500 uppercase font-bold">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Capacity Info */}
          <div className="grid grid-cols-4 gap-1.5 py-3 border-b border-gray-100 dark:border-gray-800">
            {[
              {
                icon: Users,
                value: vendor.seating?.max || "500+",
                label: "Capacity",
                color: "text-blue-600",
                bg: "bg-blue-50 dark:bg-blue-900/20",
              },
              {
                icon: Car,
                value: vendor.parking || "200+",
                label: "Parking",
                color: "text-green-600",
                bg: "bg-green-50 dark:bg-green-900/20",
              },
              {
                icon: Home,
                value: vendor.rooms?.max || "10+",
                label: "Rooms",
                color: "text-purple-600",
                bg: "bg-purple-50 dark:bg-purple-900/20",
              },
              {
                icon: Building,
                value: vendor.halls || "3",
                label: "Halls",
                color: "text-orange-600",
                bg: "bg-orange-50 dark:bg-orange-900/20",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-9 h-9 mx-auto mb-0.5 ${item.bg} rounded-lg flex items-center justify-center`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <p className="font-bold text-[11px] text-gray-900 dark:text-white">{item.value}</p>
                <p className="text-[8px] text-gray-500 uppercase font-bold">{item.label}</p>
              </div>
            ))}
          </div>

          {/* CTA BUTTONS - Moved here from bottom */}
          <div className="grid grid-cols-4 gap-1.5 mt-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = `tel:${vendor.phoneNo}`)}
              className="py-2.5 bg-green-500 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 text-white"
            >
              <Phone size={16} />
              <span className="text-[9px]">Call</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(`https://wa.me/${vendor.phoneNo}`)}
              className="py-2.5 bg-emerald-500 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 text-white"
            >
              <MessageCircle size={16} />
              <span className="text-[9px]">WhatsApp</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAvailabilityModal(true)}
              className="py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5"
            >
              <CalendarCheck size={16} />
              <span className="text-[9px]">Dates</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBookingSheet(true)}
              className="py-2.5 bg-blue-600 text-white rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-blue-500/30"
            >
              <Calendar size={16} />
              <span className="text-[9px]">Book</span>
            </motion.button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="sticky top-[49px] z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-y border-gray-200 dark:border-gray-800">
          <div ref={tabsRef} className="flex gap-1.5 overflow-x-auto no-scrollbar px-3 py-2">
            {TAB_CONFIG.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                <tab.icon size={12} />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="bg-gray-50 dark:bg-black px-3 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-xl">
                    <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5">
                      <Sparkles className="text-blue-500" size={14} />
                      About Venue
                    </h3>
                    <div
                      className={`relative overflow-hidden transition-all duration-300 ${
                        showFullDescription ? "max-h-[2000px]" : "max-h-[60px]"
                      }`}
                    >
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[11px]">
                        {vendor.description}
                      </p>
                      {!showFullDescription && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
                      )}
                    </div>
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-2 text-blue-600 dark:text-blue-400 font-bold text-[10px] flex items-center gap-0.5"
                    >
                      {showFullDescription ? "Show Less" : "Read More"}
                      <ChevronRight
                        size={10}
                        className={`transform transition-transform ${showFullDescription ? "-rotate-90" : "rotate-90"}`}
                      />
                    </button>
                  </div>

                  <CollapsibleSection title="Venue Statistics" icon={BarChart3} iconColor="text-blue-500">
                    <div className="grid grid-cols-2 gap-2">
                      {stats.map((stat, idx) => (
                        <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                          <p className="text-[9px] font-bold text-blue-400 uppercase">{stat.label}</p>
                          <div className="flex items-center gap-1">
                            <p className="font-bold text-sm text-gray-900 dark:text-white">{stat.value}</p>
                            <span
                              className={`text-[10px] font-bold ${stat.positive ? "text-green-500" : "text-red-500"}`}
                            >
                              {stat.trend}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Event Types" icon={Award} iconColor="text-purple-500">
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Weddings",
                        "Corporate",
                        "Birthday",
                        "Conference",
                        "Reception",
                        "Engagement",
                        "Anniversary",
                      ].map((type, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-[10px] font-bold"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Operating Hours" icon={Clock} iconColor="text-orange-500">
                    <div className="space-y-1.5">
                      {[
                        { day: "Mon - Thu", hours: "9 AM - 11 PM" },
                        { day: "Fri - Sat", hours: "8 AM - 12 AM" },
                        { day: "Sunday", hours: "10 AM - 10 PM" },
                      ].map((schedule, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0"
                        >
                          <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                            {schedule.day}
                          </span>
                          <span className="text-[11px] font-bold text-gray-900 dark:text-white">{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Why Choose Us" icon={BadgeCheck} iconColor="text-green-500">
                    <div className="space-y-2">
                      {[
                        { icon: Trophy, text: "Award-winning venue with 15+ years" },
                        { icon: Users, text: "Dedicated team of 50+ professionals" },
                        { icon: Star, text: "4.8+ rating from 2500+ events" },
                        { icon: ShieldCheck, text: "100% satisfaction guarantee" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                            <item.icon size={12} className="text-green-600" />
                          </div>
                          <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Special Offers" icon={Gem} iconColor="text-pink-500">
                    <div className="space-y-2">
                      <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-3 rounded-lg border border-pink-100 dark:border-pink-800/30">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Percent size={12} className="text-pink-500" />
                          <span className="font-bold text-pink-700 dark:text-pink-300 text-[11px]">
                            Early Bird Discount
                          </span>
                        </div>
                        <p className="text-[10px] text-pink-600 dark:text-pink-400">
                          Book 6 months in advance - 20% off!
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Gift size={12} className="text-blue-500" />
                          <span className="font-bold text-blue-700 dark:text-blue-300 text-[11px]">
                            Weekday Special
                          </span>
                        </div>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400">15% off on Mon - Thu bookings</p>
                      </div>
                    </div>
                  </CollapsibleSection>
                </div>
              )}

              {/* AMENITIES TAB */}
              {activeTab === "amenities" && (
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-xl">
                    <h3 className="text-sm font-bold mb-3">Available Amenities</h3>
                    <div className="grid grid-cols-2 gap-1.5">
                      {vendor.amenities.map((item, idx) => {
                        const Icon = AMENITY_ICONS[item] || Check;
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                          >
                            <div className="p-1.5 bg-white dark:bg-gray-700 rounded text-blue-600 dark:text-blue-400">
                              <Icon size={12} />
                            </div>
                            <span className="font-bold text-[10px] text-gray-700 dark:text-gray-200">{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <CollapsibleSection title="Premium Features" icon={CheckCircle} iconColor="text-green-500">
                    <div className="space-y-1.5">
                      {[
                        "Complimentary Setup",
                        "Event Coordinator",
                        "High-Speed WiFi",
                        "Backup Generator",
                        "CCTV Security",
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                            <Check size={10} className="text-white" />
                          </div>
                          <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Technical Specs" icon={Zap} iconColor="text-yellow-500">
                    <div className="space-y-1.5">
                      {[
                        { label: "Hall Area", value: "15,000 sq ft" },
                        { label: "Ceiling", value: "25 feet" },
                        { label: "Power", value: "500 KVA" },
                        { label: "Stage", value: "40 x 20 ft" },
                      ].map((spec, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0"
                        >
                          <span className="text-[11px] text-gray-600 dark:text-gray-400">{spec.label}</span>
                          <span className="text-[11px] font-bold text-gray-900 dark:text-white">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                </div>
              )}

              {/* GALLERY TAB */}
              {activeTab === "gallery" && (
                <div className="space-y-3">
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    {["all", "venue", "events", "food"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveGalleryFilter(filter)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                          activeGalleryFilter === filter
                            ? "bg-black dark:bg-white text-white dark:text-black"
                            : "bg-white dark:bg-gray-800"
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {vendor.images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setModalImageIndex(idx);
                          setShowImageModal(true);
                        }}
                        className={`rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 ${
                          idx === 0 ? "col-span-2 aspect-video" : "aspect-square"
                        }`}
                      >
                        <SmartMedia
                          src={img}
                          type="image"
                          className="w-full h-full object-cover"
                          loaderImage="/GlowLoadingGif.gif"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* PACKAGES TAB */}
              {activeTab === "packages" && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-xl text-white">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Percent size={16} />
                      <span className="font-bold text-sm">Limited Time Offer</span>
                    </div>
                    <p className="text-[11px] opacity-90">Book this month - Free decoration worth ₹25,000!</p>
                  </div>

                  {packages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      pkg={pkg}
                      isSelected={selectedPackage === pkg.id}
                      onSelect={handlePackageSelect}
                    />
                  ))}

                  <CollapsibleSection title="Payment Options" icon={HandCoins} iconColor="text-green-500">
                    <div className="space-y-2">
                      {[
                        { icon: CreditCard, name: "Credit/Debit Card", desc: "0% EMI available" },
                        { icon: Banknote, name: "Bank Transfer", desc: "NEFT/RTGS/IMPS" },
                        { icon: Wallet, name: "UPI Payment", desc: "GPay, PhonePe, Paytm" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <item.icon size={16} className="text-blue-500" />
                          <div>
                            <p className="font-bold text-[11px]">{item.name}</p>
                            <p className="text-[9px] text-gray-500">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === "reviews" && (
                <div className="space-y-3">
                  <ReviewSection vendorId={id} vendorName={vendor?.businessName || vendor?.name || "this vendor"} />
                </div>
              )}

              {/* FAQS TAB */}
              {activeTab === "faqs" && (
                <div className="space-y-2">
                  {faqs.map((faq, idx) => (
                    <motion.div key={idx} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full p-3 flex items-center justify-between text-left"
                      >
                        <span className="font-bold text-[11px] text-gray-900 dark:text-white pr-3">{faq.question}</span>
                        <motion.div animate={{ rotate: expandedFaq === idx ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={16} className="text-gray-400 shrink-0" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {expandedFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3">
                              <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}

                  <div className="bg-white dark:bg-gray-900 p-4 rounded-xl">
                    <h3 className="text-sm font-bold mb-3">Still have questions?</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowContactSheet(true)}
                        className="py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5"
                      >
                        <Phone size={14} />
                        Call Us
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowInquiryModal(true)}
                        className="py-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare size={14} />
                        Chat
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {/* POLICIES TAB */}
              {activeTab === "policies" && (
                <div className="space-y-3">
                  {policies.map((policy, idx) => (
                    <CollapsibleSection key={idx} title={policy.title} icon={policy.icon} iconColor={policy.iconColor}>
                      <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                        {policy.content}
                      </p>
                      <div className="space-y-1.5">
                        {policy.details.map((detail, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-1.5">
                            <Check size={11} className="text-green-500 shrink-0" />
                            <span className="text-[10px] text-gray-500">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CollapsibleSection>
                  ))}

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="text-orange-500" size={18} />
                      <h4 className="text-[11px] font-bold text-orange-900 dark:text-orange-100">Important Notice</h4>
                    </div>
                    <p className="text-[10px] text-orange-700 dark:text-orange-300 leading-relaxed">
                      All bookings subject to availability. Prices vary during peak seasons.
                    </p>
                  </div>
                </div>
              )}

              {/* LOCATION TAB */}
              {activeTab === "location" && (
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-xl">
                    <div className="flex gap-2 mb-3">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-gray-900 dark:text-white mb-0.5">Address</h4>
                        <p className="text-[10px] text-gray-600 dark:text-gray-300">{vendor.address.street}</p>
                        <p className="text-[9px] text-gray-500">
                          {vendor.address.city}, {vendor.address.state}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        window.open(`https://maps.google.com/?q=${vendor.address.street}, ${vendor.address.city}`)
                      }
                      className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 gap-1.5 border-2 border-dashed border-gray-300 dark:border-gray-600"
                    >
                      <MapIcon size={28} />
                      <span className="text-[11px] font-bold">Open in Maps</span>
                    </button>
                  </div>

                  <CollapsibleSection title="Nearby Landmarks" icon={Compass} iconColor="text-blue-500">
                    <div className="space-y-2">
                      {[
                        { name: "City Center Mall", distance: "0.5 km" },
                        { name: "Metro Station", distance: "1.2 km" },
                        { name: "Airport", distance: "15 km" },
                      ].map((landmark, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0"
                        >
                          <span className="text-[11px] text-gray-700 dark:text-gray-300">{landmark.name}</span>
                          <span className="text-[11px] font-bold text-gray-900 dark:text-white">
                            {landmark.distance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="How to Reach" icon={Route} iconColor="text-green-500">
                    <div className="space-y-2">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="font-bold text-[10px] text-blue-700 dark:text-blue-300">By Metro</p>
                        <p className="text-[9px] text-blue-600 dark:text-blue-400">Blue Line to Central - 5 min auto</p>
                      </div>
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="font-bold text-[10px] text-green-700 dark:text-green-300">By Car</p>
                        <p className="text-[9px] text-green-600 dark:text-green-400">
                          Ring Road Exit 12 towards City Center
                        </p>
                      </div>
                    </div>
                  </CollapsibleSection>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SIMILAR VENDORS */}
        {similarVendors.length > 0 && (
          <div className="bg-white dark:bg-gray-900 px-3 py-4 mt-2">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Similar Venues</h2>
              <div className="flex gap-1">
                <button
                  onClick={() => scrollContainer(similarRef, "left")}
                  className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => scrollContainer(similarRef, "right")}
                  className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div ref={similarRef} className="flex gap-2 overflow-x-auto no-scrollbar snap-x">
              {similarVendors.map((item) => (
                <VendorCard key={item._id} item={item} type="horizontal" />
              ))}
            </div>
          </div>
        )}

        {/* RECOMMENDED VENDORS */}
        {recommendedVendors.length > 0 && (
          <div className="bg-gray-50 dark:bg-black px-3 py-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Recommended</h2>
              <button className="text-blue-600 text-[10px] font-bold flex items-center gap-0.5">
                View All <ArrowRight size={10} />
              </button>
            </div>
            <div className="space-y-2">
              {recommendedVendors.slice(0, 3).map((item) => (
                <VendorCard key={item._id} item={item} type="vertical" />
              ))}
            </div>
          </div>
        )}

        {/* PRICE ALERT BANNER */}
        <div className="px-3 py-3">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 rounded-xl text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                <Bell size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">Get Price Alerts</h3>
                <p className="text-[10px] opacity-90">Be notified when prices drop</p>
              </div>
              <button className="px-3 py-1.5 bg-white text-blue-600 rounded-lg font-bold text-[10px]">Set Alert</button>
            </div>
          </div>
        </div>

        {/* QUICK CONTACT */}
        <div className="bg-white dark:bg-gray-900 px-3 py-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Quick Contact</h2>
          <div className="grid grid-cols-3 gap-2">
            <a href={`tel:${vendor.phoneNo}`} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl text-center">
              <Phone size={20} className="text-green-600 mx-auto mb-1" />
              <p className="text-[9px] font-bold text-green-700 dark:text-green-300">Call</p>
            </a>
            <a
              href={`https://wa.me/${vendor.phoneNo}`}
              className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl text-center"
            >
              <MessageCircle size={20} className="text-emerald-600 mx-auto mb-1" />
              <p className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300">WhatsApp</p>
            </a>
            <a href={`mailto:${vendor.email}`} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-center">
              <Mail size={20} className="text-blue-600 mx-auto mb-1" />
              <p className="text-[9px] font-bold text-blue-700 dark:text-blue-300">Email</p>
            </a>
          </div>
        </div>

        {/* AWARDS */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 px-3 py-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 text-center">Awards & Recognition</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Trophy, title: "Best Venue 2024", color: "text-yellow-500" },
              { icon: Medal, title: "Excellence Award", color: "text-orange-500" },
            ].map((award, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 p-3 rounded-xl text-center">
                <award.icon size={24} className={`${award.color} mx-auto mb-1`} />
                <p className="font-bold text-[10px] text-gray-900 dark:text-white">{award.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HELP FOOTER */}
        <div className="bg-transparent dark:bg-gray-800 px-3 py-6 text-center">
          <Headphones size={24} className="text-gray-400 mx-auto mb-2" />
          <p className="text-[10px] text-gray-500 mb-1">Need help?</p>
          <p className="font-bold text-lg text-gray-900 dark:text-white">1800-123-4567</p>
          <p className="text-[9px] text-gray-400">24/7 Toll Free</p>
        </div>
      </div>

      {/* IMAGE GALLERY MODAL */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="flex justify-between items-center p-3 z-20">
              <span className="text-white font-mono text-[11px] bg-white/10 px-2 py-1 rounded-full">
                {modalImageIndex + 1} / {images.length}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setImageZoom((z) => Math.min(z + 0.5, 3))}
                  className="p-1.5 text-white/70 bg-white/10 rounded-full"
                >
                  <ZoomIn size={18} />
                </button>
                <button onClick={() => setImageZoom(1)} className="p-1.5 text-white/70 bg-white/10 rounded-full">
                  <RotateCcw size={18} />
                </button>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="p-1.5 text-white/70 bg-white/10 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                <motion.div
                  key={modalImageIndex}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                  className="absolute w-full h-full flex items-center justify-center p-2"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={(e) => {
                    if (!isDragging.current) return;
                    const dragEndX = e.changedTouches[0].clientX;
                    const diff = dragStartX.current - dragEndX;
                    if (Math.abs(diff) > 50) {
                      if (diff > 0) {
                        setModalImageIndex((i) => (i + 1) % images.length);
                        setSlideDirection(1);
                      } else {
                        setModalImageIndex((i) => (i - 1 + images.length) % images.length);
                        setSlideDirection(-1);
                      }
                    }
                    isDragging.current = false;
                  }}
                >
                  <img
                    src={images[modalImageIndex]}
                    alt="Full view"
                    className="max-w-full max-h-full object-contain transition-transform duration-200"
                    style={{ transform: `scale(${imageZoom})` }}
                    loading="lazy"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="h-20 flex items-center justify-center gap-1.5 overflow-x-auto px-3 pb-4 no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setModalImageIndex(i);
                    setSlideDirection(i > modalImageIndex ? 1 : -1);
                  }}
                  className={`relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === modalImageIndex ? "border-white scale-110" : "border-transparent opacity-50"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumbnail" loading="lazy" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHARE MODAL */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 z-[60] bg-black/60 flex items-end"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={modalTransition}
              className="w-full bg-white dark:bg-gray-900 rounded-t-2xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
              <h3 className="text-sm font-bold text-center mb-4 dark:text-white">Share Venue</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  {
                    id: "whatsapp",
                    label: "WhatsApp",
                    icon: Send,
                    color: "text-green-500",
                    bg: "bg-green-50 dark:bg-green-900/20",
                  },
                  {
                    id: "facebook",
                    label: "Facebook",
                    icon: Facebook,
                    color: "text-blue-600",
                    bg: "bg-blue-50 dark:bg-blue-900/20",
                  },
                  {
                    id: "twitter",
                    label: "Twitter",
                    icon: Twitter,
                    color: "text-sky-500",
                    bg: "bg-sky-50 dark:bg-sky-900/20",
                  },
                  { id: "copy", label: "Copy", icon: Copy, color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-800" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleShare(item.id)}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color} active:scale-90 transition-transform`}
                    >
                      <item.icon size={20} />
                    </div>
                    <span className="text-[9px] font-bold text-gray-600 dark:text-gray-400">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTACT SHEET */}
      <AnimatePresence>
        {showContactSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 z-[60] bg-black/60 flex items-end"
            onClick={() => setShowContactSheet(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={modalTransition}
              className="w-full bg-white dark:bg-gray-900 rounded-t-2xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
              <h3 className="text-sm font-bold mb-4 dark:text-white">Contact Information</h3>

              <div className="space-y-3">
                <a
                  href={`tel:${vendor.phoneNo}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] text-gray-500 uppercase font-bold">Phone</p>
                    <p className="font-bold text-[11px] text-gray-900 dark:text-white">{vendor.phoneNo}</p>
                  </div>
                  <ChevronRight className="text-gray-400" size={18} />
                </a>

                <a
                  href={`https://wa.me/${vendor.phoneNo}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600">
                    <MessageCircle size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] text-gray-500 uppercase font-bold">WhatsApp</p>
                    <p className="font-bold text-[11px] text-gray-900 dark:text-white">Chat with us</p>
                  </div>
                  <ChevronRight className="text-gray-400" size={18} />
                </a>

                <a
                  href={`mailto:${vendor.email}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-gray-500 uppercase font-bold">Email</p>
                    <p className="font-bold text-[11px] text-gray-900 dark:text-white truncate">{vendor.email}</p>
                  </div>
                  <ChevronRight className="text-gray-400" size={18} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOOKING SHEET */}
      <AnimatePresence>
        {showBookingSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 z-[60] bg-black/60 flex items-end"
            onClick={() => setShowBookingSheet(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={modalTransition}
              className="w-full bg-white dark:bg-gray-900 rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
              <h3 className="text-base font-bold mb-1 dark:text-white">Request Booking</h3>
              <p className="text-[10px] text-gray-500 mb-4">Fill in details - we'll respond within 2 hours</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      placeholder="Phone"
                      className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      placeholder="Email"
                      className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Guests *
                    </label>
                    <input
                      type="number"
                      value={bookingForm.guests}
                      onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                      placeholder="Number"
                      className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Event Type
                  </label>
                  <select
                    value={bookingForm.eventType}
                    onChange={(e) => setBookingForm({ ...bookingForm, eventType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select type</option>
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate</option>
                    <option value="birthday">Birthday</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="Any requirements..."
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBookingSubmit}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-[11px] shadow-lg shadow-blue-500/30"
                >
                  Send Booking Request
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INQUIRY MODAL */}
      <AnimatePresence>
        {showInquiryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 z-[60] bg-black/60 flex items-end"
            onClick={() => setShowInquiryModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={modalTransition}
              className="w-full bg-white dark:bg-gray-900 rounded-t-2xl p-4 max-h-[75vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
              <h3 className="text-sm font-bold mb-1 dark:text-white">Send Inquiry</h3>
              <p className="text-[10px] text-gray-500 mb-4">We're here to help!</p>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                    <input
                      type="text"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      placeholder="Name"
                      className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                    <input
                      type="email"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      placeholder="Email"
                      className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                  <textarea
                    rows={3}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    placeholder="Your message..."
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInquirySubmit}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-[11px] shadow-lg shadow-green-500/30"
                >
                  Send Inquiry
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVIEW MODAL */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 z-[60] bg-black/60 flex items-end"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={modalTransition}
              className="w-full bg-white dark:bg-gray-900 rounded-t-2xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
              <h3 className="text-sm font-bold mb-3 dark:text-white">Write a Review</h3>

              <div className="mb-4">
                <p className="text-[10px] text-gray-500 mb-2 text-center">How was your experience?</p>
                <div className="flex gap-1.5 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setReviewRating(star)} className="p-0.5">
                      <Star
                        size={32}
                        className={`transition-all ${
                          star <= reviewRating
                            ? "fill-yellow-500 text-yellow-500 scale-110"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleReviewSubmit}
                disabled={reviewRating === 0}
                className={`w-full py-3 rounded-xl font-bold text-[11px] ${
                  reviewRating > 0
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                }`}
              >
                Submit Review
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AVAILABILITY MODAL */}
      <AnimatePresence>
        {showAvailabilityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 z-[60] bg-black/60 flex items-end"
            onClick={() => setShowAvailabilityModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={modalTransition}
              className="w-full bg-white dark:bg-gray-900 rounded-t-2xl p-4 max-h-[75vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
              <h3 className="text-sm font-bold mb-1 dark:text-white">Check Availability</h3>
              <p className="text-[10px] text-gray-500 mb-4">Select a date</p>

              <div className="grid grid-cols-5 gap-1.5 mb-4">
                {availableDates.slice(0, 15).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(item.date)}
                    disabled={!item.available}
                    className={`p-2 rounded-lg text-center transition-all ${
                      selectedDate === item.date
                        ? "bg-blue-600 text-white"
                        : item.available
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <p className="text-[8px] font-medium">
                      {item.date.toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    <p className="font-bold text-[11px]">{item.date.getDate()}</p>
                  </button>
                ))}
              </div>

              {selectedDate && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle size={14} className="text-green-600" />
                    <span className="font-bold text-green-700 dark:text-green-300 text-[11px]">Available</span>
                  </div>
                  <p className="text-[10px] text-green-600 dark:text-green-400">
                    {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </p>
                  <p className="text-sm font-bold text-green-700 dark:text-green-300 mt-1">
                    ₹{(vendor.perDayPrice?.min || 50000).toLocaleString("en-IN")}
                  </p>
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowAvailabilityModal(false);
                  setShowBookingSheet(true);
                }}
                disabled={!selectedDate}
                className={`w-full py-3 rounded-xl font-bold text-[11px] ${
                  selectedDate
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                }`}
              >
                Proceed to Book
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL STYLES */}
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

export default VendorDetailsPageWrapper;
