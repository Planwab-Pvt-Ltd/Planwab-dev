"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  Globe,
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
  Globe2,
  Smartphone,
  CreditCard as CardIcon,
  Shield as ShieldIcon,
  Clock3,
  MapPin as LocationIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  Share as ShareIcon,
  Eye,
  TrendingDown,
  ArrowRight,
  Minus,
  Plus,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Settings,
  LogOut,
  UserPlus,
  UserCheck,
  UserX,
  Users2,
  Building2,
  Home as HomeIcon,
  Briefcase,
  GraduationCap,
  Heart as LoveIcon,
  Music2,
  Palette,
  Camera as CameraIcon,
  Video as VideoIcon,
  Mic,
  Speaker,
  Lightbulb,
  Wrench,
  Hammer,
  Scissors,
  Brush,
  Eraser,
  Pencil,
  PenTool,
  Type,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  Folder,
  FolderOpen,
  Archive,
  Trash2,
  Edit,
  Edit2,
  Edit3,
  Save,
  Upload,
  Link as LinkIcon,
  Unlink,
  ExternalLink as ExtLink,
  QrCode,
  Scan,
  Maximize2,
  Minimize2,
  Move,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Search,
  SearchX,
  SlidersHorizontal,
  LayoutGrid,
  LayoutList,
  Table,
  Table2,
  Columns,
  Rows,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
} from "lucide-react";
import DetailsPageSkeleton from "../ui/skeletons/DetailsPageSkeleton";
import Link from "next/link";
import SmartMedia from "@/components/mobile/SmartMediaLoader";

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

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

// ============================================
// ANIMATION VARIANTS
// ============================================

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

// ============================================
// PROGRESS INDICATOR COMPONENT
// Displays current image indicator with countdown animation
// ============================================

const ProgressIndicator = ({ total, currentIndex, duration, isPaused, onSelect }) => {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(null);
  const pausedProgressRef = useRef(0);
  const animationFrameRef = useRef(null);

  // Reset progress when image changes
  useEffect(() => {
    setProgress(0);
    startTimeRef.current = null;
    pausedProgressRef.current = 0;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [currentIndex]);

  // Handle animation based on pause state
  useEffect(() => {
    if (isPaused) {
      // Store current progress when pausing
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      pausedProgressRef.current = progress;
      return;
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        // Calculate start time based on paused progress
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

  return (
    <div className="absolute bottom-18 left-0 right-0 z-30 pointer-events-none">
      {/* Gradient overlay for smooth blending with content below */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="relative pt-20 pb-8 px-4">
          {/* Current Image Counter */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-black/50 backdrop-blur-md rounded-full px-5 py-2.5 flex items-center gap-3 border border-white/10 shadow-xl pointer-events-auto">
              <span className="text-white font-bold text-base">{currentIndex + 1}</span>
              <div className="w-px h-5 bg-white/30" />
              <span className="text-white/60 text-base">{total}</span>
              {isPaused && (
                <>
                  <div className="w-px h-5 bg-white/30" />
                  <Pause size={14} className="text-white/60" />
                </>
              )}
            </div>
          </div>

          {/* Progress Bar Indicators */}
          <div className="flex justify-center gap-2 px-4 max-w-lg mx-auto pointer-events-auto">
            {Array.from({ length: total }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className="relative h-1.5 flex-1 max-w-[60px] rounded-full overflow-hidden group transition-all duration-200"
                aria-label={`Go to slide ${idx + 1}`}
              >
                {/* Background */}
                <div className="absolute inset-0 bg-white/25 group-hover:bg-white/35 transition-colors rounded-full" />

                {/* Completed slides */}
                {idx < currentIndex && <div className="absolute inset-0 bg-white rounded-full" />}

                {/* Current slide with animated progress */}
                {idx === currentIndex && (
                  <div
                    className="absolute inset-0 bg-white rounded-full origin-left"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Remaining Time Indicator */}
          <div className="flex justify-center mt-3 pointer-events-auto">
            <div className="flex items-center gap-1.5 text-white/50 text-xs bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
              <Timer size={11} />
              <span className="font-medium">{remainingSeconds}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const VendorDetailsPageWrapper = () => {
  const { id } = useParams();
  const router = useRouter();
  const { activeCategory } = useCategoryStore();

  // ============================================
  // REFS
  // ============================================

  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const contentRef = useRef(null);
  const similarRef = useRef(null);
  const recommendedRef = useRef(null);
  const tabsRef = useRef(null);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const autoplayTimerRef = useRef(null);

  // ============================================
  // SCROLL PARALLAX SETUP
  // ============================================

  const { scrollY } = useScroll();
  const carouselY = useTransform(scrollY, [0, 500], [0, 150]);
  const carouselScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const carouselOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  // ============================================
  // STATE - Data & Loading
  // ============================================

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarVendors, setSimilarVendors] = useState([]);
  const [recommendedVendors, setRecommendedVendors] = useState([]);

  // ============================================
  // STATE - Carousel
  // ============================================

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);

  // ============================================
  // STATE - User Interactions
  // ============================================

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // ============================================
  // STATE - Tabs & Content
  // ============================================

  const [activeTab, setActiveTab] = useState("overview");
  const [showFullDescription, setShowFullDescription] = useState(false);

  // ============================================
  // STATE - Modals & Sheets
  // ============================================

  const [showShareModal, setShowShareModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [showContactSheet, setShowContactSheet] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  // ============================================
  // STATE - Package & Review Selection
  // ============================================

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [imageZoom, setImageZoom] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState("all");

  // ============================================
  // STATE - Forms
  // ============================================

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

  // ============================================
  // DATA FETCHING
  // ============================================

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

  // ============================================
  // MEMOIZED VALUES
  // ============================================

  const images = useMemo(() => vendor?.images || [], [vendor]);

  // ============================================
  // CAROUSEL NAVIGATION FUNCTIONS
  // ============================================

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

  // ============================================
  // AUTOPLAY LOGIC
  // ============================================

  useEffect(() => {
    // Clear existing timer
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }

    // Don't start autoplay if paused or only one image
    if (isPaused || !isAutoplayEnabled || images.length <= 1) {
      return;
    }

    // Set up new autoplay timer
    autoplayTimerRef.current = setTimeout(() => {
      nextImage();
    }, AUTOPLAY_DELAY);

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [currentImageIndex, isPaused, isAutoplayEnabled, images.length, nextImage]);

  // ============================================
  // PLAY/PAUSE TOGGLE HANDLER
  // ============================================

  const togglePlayPause = useCallback(() => {
    setIsPaused((prev) => !prev);
    setIsAutoplayEnabled((prev) => !prev);
  }, []);

  // ============================================
  // INDICATOR CLICK HANDLER
  // ============================================

  const handleIndicatorSelect = useCallback(
    (index) => {
      goToImage(index);
    },
    [goToImage]
  );

  // ============================================
  // TOUCH HANDLERS FOR SWIPE
  // ============================================

  const handleTouchStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
    isDragging.current = true;
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
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
    // Resume autoplay after touch if it was enabled
    if (isAutoplayEnabled) {
      setTimeout(() => setIsPaused(false), 100);
    }
  };

  // ============================================
  // SCROLL CONTAINER HELPER
  // ============================================

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = window.innerWidth * 0.75;
      ref.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  // ============================================
  // SHARE HANDLER
  // ============================================

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${vendor?.name} on PlanWAB!`;

    const shareUrls = {
      copy: () => navigator.clipboard.writeText(url),
      facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`),
      twitter: () =>
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`),
      instagram: () => navigator.clipboard.writeText(url),
      linkedin: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`),
      whatsapp: () => window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`),
      telegram: () =>
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`),
      email: () => window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`),
    };

    shareUrls[platform]?.();
    setShowShareModal(false);
  };

  // ============================================
  // FORM SUBMISSION HANDLERS
  // ============================================

  const handleBookingSubmit = () => {
    console.log("Booking submitted:", bookingForm);
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
  };

  const handleInquirySubmit = () => {
    console.log("Inquiry submitted:", inquiryForm);
    setShowInquiryModal(false);
    setInquiryForm({
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleReviewSubmit = () => {
    console.log("Review submitted:", { rating: reviewRating, text: reviewText });
    setShowReviewModal(false);
    setReviewRating(0);
    setReviewText("");
  };

  // ============================================
  // MEMOIZED DATA - Packages
  // ============================================

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
      {
        id: 4,
        name: "Diamond Package",
        price: (vendor?.perDayPrice?.min || 50000) * 4,
        originalPrice: (vendor?.perDayPrice?.min || 50000) * 5,
        duration: "2 days",
        features: [
          "Ultra Luxury Decoration",
          "International Cuisine",
          "2 Days Full Access",
          "Unlimited Guests",
          "International DJ/Band",
          "Cinematic Photography & 4K Video",
          "Full Valet Service",
          "Luxury Suite (4 Rooms)",
          "Fireworks Display",
          "Celebrity Appearances",
          "Personal Event Coordinator",
          "Red Carpet Entry",
        ],
        notIncluded: [],
        popular: false,
        savings: 35,
      },
    ],
    [vendor]
  );

  // ============================================
  // MEMOIZED DATA - Policies
  // ============================================

  const policies = useMemo(
    () => [
      {
        title: "Cancellation Policy",
        icon: CalendarX,
        content:
          "Free cancellation up to 30 days before the event. 50% refund for cancellations made 15-30 days prior. No refund for cancellations within 14 days.",
        details: [
          "Full refund if cancelled 30+ days before",
          "50% refund for 15-30 days notice",
          "No refund under 14 days notice",
          "Rescheduling available with 7 days notice",
        ],
      },
      {
        title: "Payment Terms",
        icon: CreditCard,
        content: "30% advance payment required to confirm booking. Remaining 70% to be paid 7 days before the event.",
        details: [
          "30% booking advance (non-refundable)",
          "40% due 15 days before event",
          "30% balance 7 days before event",
          "Multiple payment methods accepted",
        ],
      },
      {
        title: "Terms & Conditions",
        icon: FileText,
        content:
          "Outside food and beverages not allowed. Decorations must be approved in advance. Noise restrictions apply after 10 PM.",
        details: [
          "No outside catering allowed",
          "Decoration approval required",
          "Noise curfew after 10 PM",
          "Security deposit required",
          "Insurance recommended",
        ],
      },
      {
        title: "Damage Policy",
        icon: ShieldCheck,
        content: "A security deposit of ₹25,000 is required. Any damages will be deducted from the deposit.",
        details: [
          "₹25,000 security deposit",
          "Full inspection post-event",
          "Deductions for damages",
          "Refund within 7 working days",
        ],
      },
    ],
    []
  );

  // ============================================
  // MEMOIZED DATA - FAQs
  // ============================================

  const faqs = useMemo(
    () => [
      {
        question: "What is the maximum guest capacity?",
        answer:
          "Our venue can accommodate up to 500 guests for a seated dinner and up to 800 guests for a cocktail-style event. We have multiple halls that can be combined for larger events.",
      },
      {
        question: "Is outside catering allowed?",
        answer:
          "We have exclusive catering partners who provide exceptional service. Outside catering is not permitted to maintain quality and safety standards. However, we offer diverse menu options including multi-cuisine, dietary-specific, and custom menus.",
      },
      {
        question: "What are the decoration guidelines?",
        answer:
          "We allow decorations that do not damage the venue. All decoration plans must be approved 7 days before the event. We have in-house decoration services and approved vendor partnerships.",
      },
      {
        question: "Is there parking available?",
        answer:
          "Yes, we have ample parking space for over 200 vehicles. Valet parking services are available as an add-on. Complimentary parking is included in Gold and above packages.",
      },
      {
        question: "What is the booking process?",
        answer:
          "To book, you need to: 1) Check availability for your date, 2) Pay 30% advance to confirm, 3) Submit event details 15 days prior, 4) Complete remaining payment 7 days before the event.",
      },
      {
        question: "Can we visit the venue before booking?",
        answer:
          "Absolutely! We encourage site visits. You can schedule a tour through our website or by calling us. Virtual tours are also available for outstation clients.",
      },
      {
        question: "Are there any noise restrictions?",
        answer:
          "Yes, as per local regulations, loud music must stop by 10 PM. However, indoor events with soundproofing can continue until midnight. We provide DJ services that comply with these regulations.",
      },
      {
        question: "Do you provide accommodation?",
        answer:
          "We have partnered with nearby hotels for discounted rates. Our Platinum and Diamond packages include complimentary rooms. We can arrange transportation between the venue and hotels.",
      },
    ],
    []
  );

  // ============================================
  // MEMOIZED DATA - Mock Reviews
  // ============================================

  const mockReviews = useMemo(
    () => [
      {
        id: 1,
        name: "Priya Sharma",
        rating: 5,
        date: "2 days ago",
        text: "Absolutely stunning venue! The staff was incredibly helpful and the ambiance was perfect for our wedding. The decoration exceeded our expectations and the food was amazing. Highly recommended!",
        avatar: "PS",
        helpful: 24,
        images: [],
        verified: true,
        eventType: "Wedding",
      },
      {
        id: 2,
        name: "Rahul Verma",
        rating: 4,
        date: "1 week ago",
        text: "Great location and beautiful interiors. Food quality was excellent. Minor issue with parking but overall satisfied. The event coordinator was very professional.",
        avatar: "RV",
        helpful: 18,
        images: [],
        verified: true,
        eventType: "Corporate Event",
      },
      {
        id: 3,
        name: "Anita Desai",
        rating: 5,
        date: "2 weeks ago",
        text: "Perfect venue for our corporate event. Professional staff, excellent facilities, and the catering was top-notch. The AV equipment was modern and worked flawlessly.",
        avatar: "AD",
        helpful: 32,
        images: [],
        verified: true,
        eventType: "Conference",
      },
      {
        id: 4,
        name: "Vikram Singh",
        rating: 3,
        date: "3 weeks ago",
        text: "Decent venue but a bit overpriced. The decoration options could be better. However, the location is convenient and parking was adequate.",
        avatar: "VS",
        helpful: 8,
        images: [],
        verified: false,
        eventType: "Birthday Party",
      },
      {
        id: 5,
        name: "Meera Patel",
        rating: 5,
        date: "1 month ago",
        text: "We hosted our engagement here and it was magical! The team went above and beyond to make our day special. The lighting setup was beautiful.",
        avatar: "MP",
        helpful: 45,
        images: [],
        verified: true,
        eventType: "Engagement",
      },
      {
        id: 6,
        name: "Arjun Reddy",
        rating: 4,
        date: "1 month ago",
        text: "Good venue with excellent facilities. The staff was responsive and accommodating. Would recommend for medium-sized events.",
        avatar: "AR",
        helpful: 12,
        images: [],
        verified: true,
        eventType: "Reception",
      },
    ],
    []
  );

  const filteredReviews = useMemo(() => {
    if (reviewFilter === "all") return mockReviews;
    if (reviewFilter === "photos") return mockReviews.filter((r) => r.images.length > 0);
    return mockReviews.filter((r) => r.rating >= parseInt(reviewFilter));
  }, [mockReviews, reviewFilter]);

  // ============================================
  // MEMOIZED DATA - Available Dates
  // ============================================

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

  // ============================================
  // MEMOIZED DATA - Highlights
  // ============================================

  const highlights = useMemo(
    () => [
      {
        icon: Trophy,
        label: "Top Rated",
        value: "4.8+",
        color: "text-yellow-500",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
      },
      {
        icon: Users,
        label: "Events Hosted",
        value: "500+",
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/20",
      },
      {
        icon: Timer,
        label: "Response Time",
        value: "< 2hrs",
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-900/20",
      },
      {
        icon: Medal,
        label: "Experience",
        value: "15 Years",
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-900/20",
      },
    ],
    []
  );

  // ============================================
  // MEMOIZED DATA - Stats
  // ============================================

  const stats = useMemo(
    () => [
      { label: "Total Bookings", value: "2,500+", trend: "+12%", positive: true },
      { label: "Repeat Customers", value: "45%", trend: "+5%", positive: true },
      { label: "Avg. Rating", value: "4.8", trend: "+0.2", positive: true },
      { label: "Response Rate", value: "98%", trend: "+3%", positive: true },
    ],
    []
  );

  // ============================================
  // LOADING & ERROR STATES
  // ============================================

  if (loading) return <DetailsPageSkeleton />;
  if (error || !vendor)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500 gap-4 px-4">
        <Info size={48} className="text-gray-300" />
        <p className="text-center">Vendor not found or error loading data.</p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold">
          Go Back
        </button>
      </div>
    );

  const displayPrice = vendor.perDayPrice?.min?.toLocaleString("en-IN") || "N/A";

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden"
    >
      {/* ============================================ */}
      {/* STICKY HEADER - Navigation Bar */}
      {/* ============================================ */}

      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center justify-between px-4 py-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
          >
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-200" />
          </motion.button>

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-full transition-all ${
                isBookmarked
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500"
                  : "active:bg-gray-100 dark:active:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <Bookmark size={22} className={isBookmarked ? "fill-current" : ""} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-all ${
                isLiked
                  ? "bg-rose-50 dark:bg-rose-900/30 text-rose-500"
                  : "active:bg-gray-100 dark:active:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <Heart size={22} className={isLiked ? "fill-current" : ""} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-full active:bg-gray-100 dark:active:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              <Share2 size={22} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* PARALLAX IMAGE CAROUSEL - Fixed Background */}
      {/* ============================================ */}

      <motion.div
        ref={carouselRef}
        className="fixed top-0 left-0 right-0 w-full h-[65vh] bg-gray-900 z-0"
        style={{
          y: carouselY,
          scale: carouselScale,
          opacity: carouselOpacity,
        }}
      >
        <div className="relative w-full h-full" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {/* Image Slides */}
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

          {/* Top Tags/Badges */}
          <div className="absolute top-16 left-4 flex flex-wrap gap-2 z-10">
            {vendor.isVerified && (
              <span className="px-3 py-1.5 bg-green-500/90 backdrop-blur-xl rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                <Verified size={12} />
                Verified
              </span>
            )}
            <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-xl rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg">
              <Sparkles size={12} />
              Featured
            </span>
            {vendor.tags?.slice(0, 1).map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-xl rounded-full text-white text-xs font-bold border border-white/20 shadow-lg"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Play/Pause Button */}
          <div className="absolute top-16 right-4 z-10">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlayPause}
              className={`p-3 rounded-full text-white shadow-lg transition-all ${
                isPaused
                  ? "bg-white/30 backdrop-blur-md border border-white/20"
                  : "bg-black/40 backdrop-blur-md border border-white/10"
              }`}
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </motion.button>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-3.5 rounded-full text-white z-20 bg-black/30 backdrop-blur-md active:bg-black/50 border border-white/10 shadow-xl"
              >
                <ChevronLeft size={26} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 rounded-full text-white z-20 bg-black/30 backdrop-blur-md active:bg-black/50 border border-white/10 shadow-xl"
              >
                <ChevronRight size={26} />
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
            onClick={(e) => {
              e.stopPropagation();
              setModalImageIndex(0);
              setShowImageModal(true);
            }}
            className="absolute bottom-54 right-4 px-4 py-2.5 bg-black/50 backdrop-blur-xl rounded-full text-white text-xs font-bold flex items-center gap-2 border border-white/20 z-20 shadow-xl"
          >
            <ImageIcon size={14} />
            View All {images.length} Photos
          </motion.button>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* SPACER - Creates room for parallax carousel */}
      {/* ============================================ */}

      <div className="h-[55vh]" />

      {/* ============================================ */}
      {/* MAIN CONTENT SECTION - Scrollable Content */}
      {/* ============================================ */}

      <div
        ref={contentRef}
        className="relative z-10 bg-white dark:bg-black min-h-screen border-none shadow-none rounded-t-2xl"
      >
        {/* ============================================ */}
        {/* VENDOR INFO CARD - Main Details */}
        {/* ============================================ */}

        <div className="bg-white dark:bg-gray-900 rounded-t-[2.5rem] px-5 pt-4 pb-5 shadow-2xl -mt-8 relative">
          {/* Drag Handle Indicator */}
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />

          {/* Vendor Name & Basic Info */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{vendor.name}</h1>
                {vendor.isVerified && <Verified size={20} className="text-blue-500 fill-blue-500" />}
              </div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1 rounded-full">
                  <Star size={14} className="fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-yellow-700 dark:text-yellow-400 text-sm">{vendor.rating}</span>
                  <span className="text-yellow-600/70 dark:text-yellow-500/70 text-xs">({vendor.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <MapPin size={14} />
                  <span className="font-medium">{vendor.address.city}</span>
                </div>
                <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                  <TrendingUp size={12} />
                  <span>Top 10%</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">₹{displayPrice}</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">starting price</span>
              <div className="mt-1 text-xs text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full inline-block">
                EMI ₹{Math.round((vendor.perDayPrice?.min || 50000) / 12).toLocaleString()}/mo
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* HIGHLIGHTS GRID - Key Features */}
          {/* ============================================ */}

          <div className="grid grid-cols-4 gap-2 py-4 border-t border-b border-gray-100 dark:border-gray-800">
            {highlights.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-12 h-12 mx-auto mb-1 ${item.bg} rounded-xl flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">{item.value}</p>
                <p className="text-[9px] text-gray-500 uppercase font-bold">{item.label}</p>
              </div>
            ))}
          </div>

          {/* ============================================ */}
          {/* CAPACITY INFO GRID */}
          {/* ============================================ */}

          <div className="grid grid-cols-4 gap-2 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-1 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">{vendor.seating?.max || "500+"}</p>
              <p className="text-[9px] text-gray-500 uppercase font-bold">Capacity</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-1 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">{vendor.parking || "200+"}</p>
              <p className="text-[9px] text-gray-500 uppercase font-bold">Parking</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-1 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">{vendor.rooms?.max || "10+"}</p>
              <p className="text-[9px] text-gray-500 uppercase font-bold">Rooms</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-1 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                <Building className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">{vendor.halls || "3"}</p>
              <p className="text-[9px] text-gray-500 uppercase font-bold">Halls</p>
            </div>
          </div>

          {/* ============================================ */}
          {/* QUICK ACTION BUTTONS */}
          {/* ============================================ */}

          <div className="grid grid-cols-2 gap-2 mt-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowContactSheet(true)}
              className="py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              Contact
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(`https://maps.google.com/?q=${vendor.address.street}, ${vendor.address.city}`)}
              className="py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <Navigation size={16} />
              Directions
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAvailabilityModal(true)}
              className="py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <CalendarCheck size={16} />
              Check Dates
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInquiryModal(true)}
              className="py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} />
              Inquiry
            </motion.button>
          </div>
        </div>

        {/* ============================================ */}
        {/* TAB NAVIGATION - Sticky Tabs */}
        {/* ============================================ */}

        <div className="sticky top-[57px] z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-y border-gray-200 dark:border-gray-800">
          <div ref={tabsRef} className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-3">
            {TAB_CONFIG.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* TAB CONTENT SECTION */}
        {/* ============================================ */}

        <div className="bg-gray-50 dark:bg-black px-5 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* ============================================ */}
              {/* OVERVIEW TAB */}
              {/* ============================================ */}

              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* About Section */}
                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <Sparkles className="text-blue-500" size={18} />
                      About Venue
                    </h3>
                    <div
                      className={`relative overflow-hidden transition-all duration-300 ${
                        showFullDescription ? "max-h-[2000px]" : "max-h-[100px]"
                      }`}
                    >
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{vendor.description}</p>
                      {!showFullDescription && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
                      )}
                    </div>
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-3 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1"
                    >
                      {showFullDescription ? "Show Less" : "Read More"}
                      <ChevronRight
                        size={12}
                        className={`transform transition-transform ${showFullDescription ? "-rotate-90" : "rotate-90"}`}
                      />
                    </button>
                  </div>

                  {/* Statistics Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <h3 className="text-lg font-bold mb-4 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <BarChart3 size={18} />
                      Venue Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-xl">
                          <p className="text-[10px] font-bold text-blue-400 uppercase">{stat.label}</p>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-lg text-gray-900 dark:text-white">{stat.value}</p>
                            <span className={`text-xs font-bold ${stat.positive ? "text-green-500" : "text-red-500"}`}>
                              {stat.trend}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Event Types */}
                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Award className="text-purple-500" size={18} />
                      Event Types
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Weddings",
                        "Corporate Events",
                        "Birthday Parties",
                        "Conferences",
                        "Receptions",
                        "Engagement",
                        "Anniversary",
                        "Product Launch",
                        "Exhibitions",
                        "Concerts",
                        "Award Ceremonies",
                        "Gala Dinners",
                      ].map((type, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Clock className="text-orange-500" size={18} />
                      Operating Hours
                    </h3>
                    <div className="space-y-2">
                      {[
                        { day: "Monday - Thursday", hours: "9:00 AM - 11:00 PM" },
                        { day: "Friday", hours: "9:00 AM - 12:00 AM" },
                        { day: "Saturday", hours: "8:00 AM - 12:00 AM" },
                        { day: "Sunday", hours: "10:00 AM - 10:00 PM" },
                      ].map((schedule, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                        >
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{schedule.day}</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why Choose Us */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-5 rounded-2xl border border-green-100 dark:border-green-900/30">
                    <h3 className="text-lg font-bold mb-4 text-green-900 dark:text-green-100 flex items-center gap-2">
                      <BadgeCheck size={18} />
                      Why Choose Us
                    </h3>
                    <div className="space-y-3">
                      {[
                        { icon: Trophy, text: "Award-winning venue with 15+ years experience" },
                        { icon: Users, text: "Dedicated team of 50+ professionals" },
                        { icon: Star, text: "4.8+ rating from 2500+ events" },
                        { icon: ShieldCheck, text: "100% satisfaction guarantee" },
                        { icon: CircleDollarSign, text: "Best price guarantee in the region" },
                        { icon: Clock, text: "24/7 customer support" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                            <item.icon size={16} className="text-green-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Offers */}
                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Gem className="text-pink-500" size={18} />
                      Special Offers
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-4 rounded-xl border border-pink-100 dark:border-pink-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Percent size={16} className="text-pink-500" />
                          <span className="font-bold text-pink-700 dark:text-pink-300">Early Bird Discount</span>
                        </div>
                        <p className="text-sm text-pink-600 dark:text-pink-400">
                          Book 6 months in advance and get 20% off!
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift size={16} className="text-blue-500" />
                          <span className="font-bold text-blue-700 dark:text-blue-300">Weekday Special</span>
                        </div>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          15% off on Monday - Thursday bookings
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <PartyPopper size={16} className="text-purple-500" />
                          <span className="font-bold text-purple-700 dark:text-purple-300">Package Upgrade</span>
                        </div>
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                          Free upgrade to next package tier for bookings over ₹2 Lakhs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* AMENITIES TAB */}
              {/* ============================================ */}

              {activeTab === "amenities" && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4">Available Amenities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {vendor.amenities.map((item, idx) => {
                        const Icon = AMENITY_ICONS[item] || Check;
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                          >
                            <div className="p-2 bg-white dark:bg-gray-700 rounded-lg text-blue-600 dark:text-blue-400">
                              <Icon size={16} />
                            </div>
                            <span className="font-bold text-xs text-gray-700 dark:text-gray-200">{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-5 rounded-2xl border border-green-100 dark:border-green-900/30">
                    <h3 className="text-lg font-bold mb-4 text-green-900 dark:text-green-100 flex items-center gap-2">
                      <CheckCircle size={18} />
                      Premium Features Included
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Complimentary Setup & Cleanup",
                        "Dedicated Event Coordinator",
                        "Customizable Lighting System",
                        "High-Speed Internet (1 Gbps)",
                        "Backup Power Generator",
                        "CCTV Security Surveillance",
                        "First Aid & Emergency Services",
                        "Accessible Facilities",
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                            <Check size={14} className="text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Zap className="text-yellow-500" size={18} />
                      Technical Specifications
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: "Main Hall Area", value: "15,000 sq ft" },
                        { label: "Ceiling Height", value: "25 feet" },
                        { label: "Power Supply", value: "500 KVA" },
                        { label: "Sound System", value: "JBL Professional" },
                        { label: "Stage Size", value: "40 x 20 feet" },
                        { label: "LED Screen", value: "20 x 12 feet" },
                      ].map((spec, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-400">{spec.label}</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 p-5 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                    <h3 className="text-lg font-bold mb-4 text-orange-900 dark:text-orange-100 flex items-center gap-2">
                      <AlertCircle size={18} />
                      Add-on Services
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: "Valet Parking", price: "₹15,000" },
                        { name: "Extra Decoration", price: "₹25,000+" },
                        { name: "Live Band", price: "₹50,000+" },
                        { name: "Fireworks Display", price: "₹75,000+" },
                        { name: "Drone Photography", price: "₹20,000" },
                        { name: "Photo Booth", price: "₹15,000" },
                      ].map((addon, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-2 border-b border-orange-100 dark:border-orange-800/30 last:border-0"
                        >
                          <span className="text-sm text-orange-700 dark:text-orange-300">{addon.name}</span>
                          <span className="text-sm font-bold text-orange-900 dark:text-orange-100">{addon.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* GALLERY TAB */}
              {/* ============================================ */}

              {activeTab === "gallery" && (
                <div className="space-y-4">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {["all", "venue", "events", "food", "decoration", "outdoor"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveGalleryFilter(filter)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                          activeGalleryFilter === filter
                            ? "bg-black dark:bg-white text-white dark:text-black"
                            : "bg-white dark:bg-gray-800"
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {vendor.images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setModalImageIndex(idx);
                          setShowImageModal(true);
                        }}
                        className={`rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 ${
                          idx === 0
                            ? "col-span-2 aspect-video"
                            : idx % 5 === 0
                            ? "col-span-2 aspect-video"
                            : "aspect-square"
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

                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Video className="text-red-500" size={18} />
                      Virtual Tour
                    </h3>
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Play size={28} className="text-white ml-1" />
                        </div>
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Watch 360° Virtual Tour</p>
                        <p className="text-xs text-gray-500">3:45 mins</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* PACKAGES TAB */}
              {/* ============================================ */}

              {activeTab === "packages" && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Percent size={20} />
                      <span className="font-bold">Limited Time Offer</span>
                    </div>
                    <p className="text-sm opacity-90">
                      Book any package this month and get complimentary decoration worth ₹25,000!
                    </p>
                  </div>

                  {packages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`bg-white dark:bg-gray-900 p-5 rounded-2xl border-2 transition-all ${
                        selectedPackage === pkg.id
                          ? "border-blue-500 shadow-lg shadow-blue-500/20"
                          : "border-transparent"
                      } ${pkg.popular ? "ring-2 ring-yellow-400 ring-offset-2 dark:ring-offset-black" : ""}`}
                    >
                      {pkg.popular && (
                        <div className="flex justify-center -mt-8 mb-3">
                          <span className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <Sparkles size={12} />
                            Most Popular
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{pkg.name}</h4>
                          <p className="text-xs text-gray-500">{pkg.duration} access</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400 line-through">
                            ₹{pkg.originalPrice.toLocaleString("en-IN")}
                          </p>
                          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                            ₹{pkg.price.toLocaleString("en-IN")}
                          </p>
                          <span className="text-xs font-bold text-green-500">Save {pkg.savings}%</span>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        {pkg.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-500 shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                        {pkg.notIncluded.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 opacity-50">
                            <X size={14} className="text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-400 line-through">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                          selectedPackage === pkg.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {selectedPackage === pkg.id ? "✓ Selected" : "Select Package"}
                      </button>
                    </motion.div>
                  ))}

                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <HandCoins className="text-green-500" size={18} />
                      Payment Options
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <CreditCard size={20} className="text-blue-500" />
                        <div className="flex-1">
                          <p className="font-bold text-sm">Credit/Debit Card</p>
                          <p className="text-xs text-gray-500">0% EMI available on select cards</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Banknote size={20} className="text-green-500" />
                        <div className="flex-1">
                          <p className="font-bold text-sm">Bank Transfer</p>
                          <p className="text-xs text-gray-500">NEFT/RTGS/IMPS</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Wallet size={20} className="text-purple-500" />
                        <div className="flex-1">
                          <p className="font-bold text-sm">UPI Payment</p>
                          <p className="text-xs text-gray-500">GPay, PhonePe, Paytm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* REVIEWS TAB */}
              {/* ============================================ */}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-5xl font-black text-gray-900 dark:text-white">{vendor.rating}</div>
                        <div className="flex gap-0.5 justify-center text-yellow-500 my-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className={i < Math.floor(vendor.rating) ? "fill-current" : ""} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{vendor.reviews} reviews</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const percentage =
                            rating === 5 ? 65 : rating === 4 ? 22 : rating === 3 ? 8 : rating === 2 ? 3 : 2;
                          return (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 w-3">{rating}</span>
                              <Star size={10} className="fill-yellow-500 text-yellow-500" />
                              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-500 rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 w-8">{percentage}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {[
                      { label: "All Reviews", value: "all" },
                      { label: "5 Star", value: "5" },
                      { label: "4 Star", value: "4" },
                      { label: "3 Star", value: "3" },
                      { label: "With Photos", value: "photos" },
                    ].map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => setReviewFilter(filter.value)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                          reviewFilter === filter.value
                            ? "bg-black dark:bg-white text-white dark:text-black"
                            : "bg-white dark:bg-gray-800"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReviewModal(true)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                  >
                    <Star size={16} />
                    Write a Review
                  </motion.button>

                  {filteredReviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {review.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-gray-900 dark:text-white">{review.name}</p>
                            {review.verified && (
                              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-[10px] font-bold rounded-full flex items-center gap-1">
                                <Verified size={10} />
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={i < review.rating ? "fill-current" : ""} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">• {review.date}</span>
                            <span className="text-xs text-blue-500 font-medium">• {review.eventType}</span>
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Flag size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{review.text}</p>
                      <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-500 transition-colors">
                          <ThumbsUp size={14} />
                          Helpful ({review.helpful})
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-500 transition-colors">
                          <MessageCircle size={14} />
                          Reply
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-500 transition-colors">
                          <Share2 size={14} />
                          Share
                        </button>
                      </div>
                    </div>
                  ))}

                  <button className="w-full py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-sm">
                    Load More Reviews
                  </button>
                </div>
              )}

              {/* ============================================ */}
              {/* FAQS TAB */}
              {/* ============================================ */}

              {activeTab === "faqs" && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      <span className="font-bold">Can't find your answer?</span> Contact our support team 24/7
                    </p>
                  </div>

                  {faqs.map((faq, idx) => (
                    <motion.div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full p-4 flex items-center justify-between text-left"
                      >
                        <span className="font-bold text-sm text-gray-900 dark:text-white pr-4">{faq.question}</span>
                        <ChevronDown
                          size={20}
                          className={`text-gray-400 transform transition-transform shrink-0 ${
                            expandedFaq === idx ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {expandedFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0">
                              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}

                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4">Still have questions?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowContactSheet(true)}
                        className="py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <Phone size={16} />
                        Call Us
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowInquiryModal(true)}
                        className="py-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <MessageSquare size={16} />
                        Chat
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* POLICIES TAB */}
              {/* ============================================ */}

              {activeTab === "policies" && (
                <div className="space-y-4">
                  {policies.map((policy, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                          <policy.icon size={24} />
                        </div>
                        <h4 className="text-base font-bold text-gray-900 dark:text-white">{policy.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{policy.content}</p>
                      <div className="space-y-2">
                        {policy.details.map((detail, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2">
                            <Check size={14} className="text-green-500 shrink-0" />
                            <span className="text-xs text-gray-500">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-5 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertCircle className="text-orange-500" size={24} />
                      <h4 className="text-base font-bold text-orange-900 dark:text-orange-100">Important Notice</h4>
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed mb-3">
                      All bookings are subject to availability. Prices may vary during peak seasons and special
                      occasions. Additional charges may apply for extended hours.
                    </p>
                    <ul className="space-y-1">
                      <li className="text-xs text-orange-600 dark:text-orange-400">
                        • Peak season: Oct - Feb (+20% surcharge)
                      </li>
                      <li className="text-xs text-orange-600 dark:text-orange-400">
                        • Auspicious dates may have premium pricing
                      </li>
                      <li className="text-xs text-orange-600 dark:text-orange-400">
                        • All prices are exclusive of applicable taxes
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FileText className="text-gray-500" size={18} />
                      Download Documents
                    </h3>
                    <div className="space-y-2">
                      {["Terms & Conditions", "Cancellation Policy", "Food Menu", "Venue Layout"].map((doc, idx) => (
                        <button
                          key={idx}
                          className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Download size={18} className="text-blue-500" />
                          <span className="text-sm font-medium flex-1 text-left">{doc}</span>
                          <span className="text-xs text-gray-400">PDF</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* LOCATION TAB */}
              {/* ============================================ */}

              {activeTab === "location" && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                    <div className="flex gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">Address</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{vendor.address.street}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {vendor.address.city}, {vendor.address.state} - {vendor.address.postalCode}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        window.open(`https://maps.google.com/?q=${vendor.address.street}, ${vendor.address.city}`)
                      }
                      className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex flex-col items-center justify-center text-gray-500 gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors"
                    >
                      <MapIcon size={40} />
                      <span className="text-sm font-bold">Open in Google Maps</span>
                      <span className="text-xs flex items-center gap-1">
                        <ExternalLink size={12} />
                        Tap to navigate
                      </span>
                    </button>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Compass size={18} className="text-blue-500" />
                      Nearby Landmarks
                    </h4>
                    <div className="space-y-3">
                      {[
                        { name: "City Center Mall", distance: "0.5 km", time: "2 min" },
                        { name: "Metro Station - Line 2", distance: "1.2 km", time: "5 min" },
                        { name: "International Airport", distance: "15 km", time: "25 min" },
                        { name: "Central Railway Station", distance: "5 km", time: "12 min" },
                        { name: "5-Star Hotels", distance: "0.8 km", time: "3 min" },
                        { name: "Hospital", distance: "2 km", time: "7 min" },
                      ].map((landmark, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                        >
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <MapPinned size={14} className="text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{landmark.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{landmark.distance}</p>
                            <p className="text-xs text-gray-500">{landmark.time} drive</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Route size={18} className="text-green-500" />
                      How to Reach
                    </h4>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <p className="font-bold text-sm text-blue-700 dark:text-blue-300 mb-1">By Metro</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          Take Blue Line to Central Station, then 5 min auto ride
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <p className="font-bold text-sm text-green-700 dark:text-green-300 mb-1">By Car</p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Via Ring Road, take Exit 12 towards City Center
                        </p>
                      </div>
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                        <p className="font-bold text-sm text-orange-700 dark:text-orange-300 mb-1">From Airport</p>
                        <p className="text-xs text-orange-600 dark:text-orange-400">
                          25-30 min via Airport Expressway, pre-paid taxi available
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-5 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                    <h4 className="text-base font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                      <Building size={18} />
                      Nearby Accommodations
                    </h4>
                    <div className="space-y-3">
                      {[
                        { name: "Taj Hotel", rating: "5★", distance: "0.5 km", price: "₹8,000/night" },
                        { name: "Marriott", rating: "5★", distance: "0.8 km", price: "₹7,500/night" },
                        { name: "Holiday Inn", rating: "4★", distance: "1.2 km", price: "₹4,500/night" },
                        { name: "OYO Rooms", rating: "3★", distance: "0.3 km", price: "₹1,500/night" },
                      ].map((hotel, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-bold text-sm text-gray-900 dark:text-white">{hotel.name}</p>
                            <p className="text-xs text-gray-500">
                              {hotel.rating} • {hotel.distance}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{hotel.price}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-3">
                      * Special rates available for venue bookings
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ============================================ */}
        {/* SIMILAR VENDORS SECTION */}
        {/* ============================================ */}

        {similarVendors.length > 0 && (
          <div className="bg-white dark:bg-gray-900 px-5 py-6 mt-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Similar Venues</h2>
                <p className="text-xs text-gray-500 mt-1">Based on your preferences</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => scrollContainer(similarRef, "left")}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollContainer(similarRef, "right")}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div ref={similarRef} className="flex gap-3 overflow-x-auto no-scrollbar snap-x">
              {similarVendors.map((item) => (
                <Link href={`/vendor/${item.category}/${item._id}`} key={item._id} className="min-w-[260px] snap-start">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="h-36 relative">
                      <SmartMedia
                        src={item.images[0]}
                        type="image"
                        className="w-full h-full object-cover"
                        loaderImage="/GlowLoadingGif.gif"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow">
                        <Star size={10} className="fill-yellow-500 text-yellow-500" /> {item.rating}
                      </div>
                      <div className="absolute top-2 left-2 bg-green-500/90 px-2 py-1 rounded-lg text-xs font-bold text-white shadow">
                        {Math.floor(Math.random() * 20 + 10)}% OFF
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 truncate flex items-center gap-1">
                        <MapPin size={10} /> {item.address?.city}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                          ₹{item.perDayPrice?.min?.toLocaleString("en-IN") || "N/A"}
                        </p>
                        <span className="text-[9px] text-gray-400 font-bold uppercase">/ Day</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* RECOMMENDED VENDORS SECTION */}
        {/* ============================================ */}

        {recommendedVendors.length > 0 && (
          <div className="bg-gray-50 dark:bg-black px-5 py-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recommended For You</h2>
                <p className="text-xs text-gray-500 mt-1">Handpicked selections</p>
              </div>
              <button className="text-blue-600 text-xs font-bold flex items-center gap-1">
                View All <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {recommendedVendors.slice(0, 5).map((item) => (
                <Link href={`/vendor/${item.category}/${item._id}`} key={item._id}>
                  <div className="flex gap-3 bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-sm">
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
                      <SmartMedia
                        src={item.images[0]}
                        type="image"
                        className="w-full h-full object-cover"
                        loaderImage="/GlowLoadingGif.gif"
                      />
                      <div className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white font-bold">
                        {item.images?.length || 5} pics
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={
                                i < Math.floor(item.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">({item.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={10} className="text-gray-400" />
                        <span className="text-xs text-gray-500 truncate">{item.address?.city}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-blue-600 font-bold text-sm">
                          ₹{item.perDayPrice?.min?.toLocaleString()}
                        </span>
                        <span className="text-xs text-green-600 font-bold">Free Cancellation</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* RECENTLY VIEWED SECTION */}
        {/* ============================================ */}

        <div className="bg-white dark:bg-gray-900 px-5 py-6 mt-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recently Viewed</h2>
            <button className="text-blue-600 text-xs font-bold">Clear All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {[1, 2, 3, 4, 5].map((_, idx) => (
              <div key={idx} className="min-w-[130px] bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                <div className="h-20 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800" />
                <div className="p-2">
                  <p className="text-xs font-bold truncate text-gray-900 dark:text-white">Grand Venue {idx + 1}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={8} className="fill-yellow-500 text-yellow-500" />
                    <span className="text-[10px] text-gray-500">4.{5 + idx}</span>
                  </div>
                  <p className="text-[10px] text-blue-600 font-bold mt-1">₹{(40 + idx * 10).toLocaleString()}K/day</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* PRICE ALERT BANNER */}
        {/* ============================================ */}

        <div className="px-5 py-4">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 rounded-2xl text-white shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Bell size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Get Price Alerts</h3>
                <p className="text-sm opacity-90 mt-1">Be notified when prices drop for this venue</p>
              </div>
            </div>
            <button className="w-full mt-4 py-3 bg-white text-blue-600 rounded-xl font-bold text-sm shadow-lg">
              Set Price Alert
            </button>
          </div>
        </div>

        {/* ============================================ */}
        {/* TRUSTED BY SECTION */}
        {/* ============================================ */}

        <div className="bg-white dark:bg-gray-900 px-5 py-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">
            Trusted By Leading Brands
          </h2>
          <p className="text-xs text-gray-500 text-center mb-4">Over 500+ corporate events hosted</p>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 justify-center flex-wrap">
            {["Google", "Microsoft", "Amazon", "Infosys", "TCS", "Wipro", "Accenture", "IBM"].map((company, idx) => (
              <div
                key={idx}
                className="w-20 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center px-3 shadow-sm"
              >
                <span className="text-[10px] font-bold text-gray-500 text-center">{company}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* AWARDS & RECOGNITION SECTION */}
        {/* ============================================ */}

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 px-5 py-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">Awards & Recognition</h2>
          <p className="text-xs text-gray-500 text-center mb-4">Excellence in hospitality since 2010</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Trophy, title: "Best Venue 2024", org: "Wedding Sutra Awards", color: "text-yellow-500" },
              { icon: Medal, title: "Excellence Award", org: "Event India Magazine", color: "text-orange-500" },
              { icon: Award, title: "Top 10 Venues", org: "WedMeGood Ranking", color: "text-blue-500" },
              { icon: Star, title: "5-Star Rating", org: "Google Reviews", color: "text-green-500" },
            ].map((award, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 p-4 rounded-xl text-center shadow-sm">
                <award.icon size={32} className={`${award.color} mx-auto mb-2`} />
                <p className="font-bold text-sm text-gray-900 dark:text-white">{award.title}</p>
                <p className="text-xs text-gray-500 mt-1">{award.org}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* QUICK CONTACT SECTION */}
        {/* ============================================ */}

        <div className="bg-white dark:bg-gray-900 px-5 py-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Contact</h2>
          <div className="grid grid-cols-3 gap-3">
            <a
              href={`tel:${vendor.phoneNo}`}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl text-center shadow-sm border border-green-100 dark:border-green-800/30"
            >
              <Phone size={28} className="text-green-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-green-700 dark:text-green-300">Call Now</p>
            </a>
            <a
              href={`https://wa.me/${vendor.phoneNo}`}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl text-center shadow-sm border border-emerald-100 dark:border-emerald-800/30"
            >
              <MessageCircle size={28} className="text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">WhatsApp</p>
            </a>
            <a
              href={`mailto:${vendor.email}`}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl text-center shadow-sm border border-blue-100 dark:border-blue-800/30"
            >
              <Mail size={28} className="text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-blue-700 dark:text-blue-300">Email</p>
            </a>
          </div>
        </div>

        {/* ============================================ */}
        {/* APP DOWNLOAD SECTION */}
        {/* ============================================ */}

        <div className="px-5 py-4">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 p-5 rounded-2xl text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <Smartphone size={32} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Download Our App</h3>
                <p className="text-sm opacity-80 mt-1">Book faster, get exclusive deals</p>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-bold">App Store</button>
                  <button className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-bold">Play Store</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* NEWSLETTER SECTION */}
        {/* ============================================ */}

        <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 px-5 py-6 mx-5 rounded-2xl mb-4">
          <div className="text-center">
            <Mail size={32} className="text-purple-600 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Stay Updated</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">
              Get the latest offers and venue updates
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 text-sm"
              />
              <button className="px-5 py-3 bg-purple-600 text-white rounded-xl font-bold text-sm">Subscribe</button>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* HELP & SUPPORT FOOTER */}
        {/* ============================================ */}

        <div className="bg-white px-5 py-8 text-center">
          <Headphones size={32} className="text-gray-400 mx-auto mb-3" />
          <p className="text-xs text-gray-500 mb-2">Need help with your booking?</p>
          <p className="font-bold text-xl text-gray-900 dark:text-white mb-1">1800-123-4567</p>
          <p className="text-xs text-gray-400 mb-4">Available 24/7 • Toll Free</p>
          <div className="flex justify-center gap-4">
            <button className="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm">
              Live Chat
            </button>
            <button className="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm">
              Help Center
            </button>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* FIXED BOTTOM CTA BAR */}
      {/* ============================================ */}

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 px-5 py-4 safe-area-pb">
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = `tel:${vendor.phoneNo}`)}
            className="px-5 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold flex items-center justify-center gap-2 text-gray-900 dark:text-white"
          >
            <Phone size={20} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open(`https://wa.me/${vendor.phoneNo}`)}
            className="px-5 py-4 bg-green-500 rounded-2xl font-bold flex items-center justify-center gap-2 text-white"
          >
            <MessageCircle size={20} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBookingSheet(true)}
            className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            <Calendar size={20} />
            Book Now
          </motion.button>
        </div>
      </div>

      {/* ============================================ */}
      {/* IMAGE GALLERY MODAL */}
      {/* ============================================ */}

      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 z-20">
              <span className="text-white font-mono text-sm bg-white/10 px-3 py-1 rounded-full">
                {modalImageIndex + 1} / {images.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setImageZoom((z) => Math.min(z + 0.5, 3))}
                  className="p-2 text-white/70 bg-white/10 rounded-full"
                >
                  <ZoomIn size={20} />
                </button>
                <button
                  onClick={() => setImageZoom((z) => Math.max(z - 0.5, 1))}
                  className="p-2 text-white/70 bg-white/10 rounded-full"
                >
                  <ZoomOut size={20} />
                </button>
                <button onClick={() => setImageZoom(1)} className="p-2 text-white/70 bg-white/10 rounded-full">
                  <RotateCcw size={20} />
                </button>
                <button onClick={() => setShowImageModal(false)} className="p-2 text-white/70 bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Image */}
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
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Modal Thumbnails */}
            <div className="h-24 flex items-center justify-center gap-2 overflow-x-auto px-4 pb-6 no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setModalImageIndex(i);
                    setSlideDirection(i > modalImageIndex ? 1 : -1);
                  }}
                  className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    i === modalImageIndex
                      ? "border-white scale-110 ring-2 ring-white/50"
                      : "border-transparent opacity-50"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* SHARE MODAL */}
      {/* ============================================ */}

      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 flex items-end"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6 safe-area-pb"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold text-center mb-6 dark:text-white">Share Venue</h3>
              <div className="grid grid-cols-4 gap-4">
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
                  {
                    id: "linkedin",
                    label: "LinkedIn",
                    icon: Linkedin,
                    color: "text-blue-700",
                    bg: "bg-blue-50 dark:bg-blue-900/20",
                  },
                  {
                    id: "instagram",
                    label: "Instagram",
                    icon: Instagram,
                    color: "text-pink-500",
                    bg: "bg-pink-50 dark:bg-pink-900/20",
                  },
                  {
                    id: "telegram",
                    label: "Telegram",
                    icon: Send,
                    color: "text-blue-400",
                    bg: "bg-blue-50 dark:bg-blue-900/20",
                  },
                  {
                    id: "email",
                    label: "Email",
                    icon: Mail,
                    color: "text-gray-600",
                    bg: "bg-gray-100 dark:bg-gray-800",
                  },
                  {
                    id: "copy",
                    label: "Copy Link",
                    icon: Copy,
                    color: "text-gray-600 dark:text-gray-300",
                    bg: "bg-gray-100 dark:bg-gray-800",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleShare(item.id)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg} ${item.color} active:scale-90 transition-transform`}
                    >
                      <item.icon size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* CONTACT SHEET MODAL */}
      {/* ============================================ */}

      <AnimatePresence>
        {showContactSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 flex items-end"
            onClick={() => setShowContactSheet(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6 safe-area-pb"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-6 dark:text-white">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Contact Person</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {vendor.contactPerson.firstName} {vendor.contactPerson.lastName}
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${vendor.phoneNo}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
                    <Phone size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase font-bold">Phone</p>
                    <p className="font-bold text-gray-900 dark:text-white">{vendor.phoneNo}</p>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </a>

                <a
                  href={`https://wa.me/${vendor.phoneNo}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                    <MessageCircle size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase font-bold">WhatsApp</p>
                    <p className="font-bold text-gray-900 dark:text-white">Chat with us</p>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </a>

                <a
                  href={`mailto:${vendor.email}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                    <Mail size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                    <p className="font-bold text-gray-900 dark:text-white truncate">{vendor.email}</p>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </a>

                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600">
                    <Clock size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase font-bold">Working Hours</p>
                    <p className="font-bold text-gray-900 dark:text-white">9 AM - 9 PM (Mon-Sun)</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* BOOKING SHEET MODAL */}
      {/* ============================================ */}

      <AnimatePresence>
        {showBookingSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 flex items-end"
            onClick={() => setShowBookingSheet(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6 safe-area-pb max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2 dark:text-white">Request Booking</h3>
              <p className="text-sm text-gray-500 mb-6">
                Fill in your details and we'll get back to you within 2 hours
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      placeholder="Phone number"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      placeholder="Email address"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Guests *</label>
                    <input
                      type="number"
                      value={bookingForm.guests}
                      onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                      placeholder="Number"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Event Type</label>
                  <select
                    value={bookingForm.eventType}
                    onChange={(e) => setBookingForm({ ...bookingForm, eventType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select event type</option>
                    <option value="wedding">Wedding</option>
                    <option value="reception">Reception</option>
                    <option value="engagement">Engagement</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="birthday">Birthday Party</option>
                    <option value="conference">Conference</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="Any specific requirements or questions..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Info size={16} className="text-blue-600" />
                    <span className="text-sm font-bold text-blue-900 dark:text-blue-100">Quick Response</span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Our team typically responds within 2 hours during business hours.
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBookingSubmit}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 mt-4"
                >
                  Send Booking Request
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* INQUIRY MODAL */}
      {/* ============================================ */}

      <AnimatePresence>
        {showInquiryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 flex items-end"
            onClick={() => setShowInquiryModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6 safe-area-pb max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-2 dark:text-white">Send Inquiry</h3>
              <p className="text-sm text-gray-500 mb-6">Have a question? We're here to help!</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      placeholder="Phone"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      placeholder="Email"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message *</label>
                  <textarea
                    rows={4}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    placeholder="Type your message here..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInquirySubmit}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-500/30"
                >
                  Send Inquiry
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* REVIEW MODAL */}
      {/* ============================================ */}

      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 flex items-end"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6 safe-area-pb"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4 dark:text-white">Write a Review</h3>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-3 text-center">How was your experience?</p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setReviewRating(star)} className="p-1">
                      <Star
                        size={40}
                        className={`transition-all ${
                          star <= reviewRating
                            ? "fill-yellow-500 text-yellow-500 scale-110"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">
                  {reviewRating === 0 && "Tap to rate"}
                  {reviewRating === 1 && "Poor"}
                  {reviewRating === 2 && "Fair"}
                  {reviewRating === 3 && "Good"}
                  {reviewRating === 4 && "Very Good"}
                  {reviewRating === 5 && "Excellent"}
                </p>
              </div>

              <div className="mb-4">
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this venue..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleReviewSubmit}
                disabled={reviewRating === 0}
                className={`w-full py-4 rounded-2xl font-bold text-lg ${
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

      {/* ============================================ */}
      {/* AVAILABILITY MODAL */}
      {/* ============================================ */}

      <AnimatePresence>
        {showAvailabilityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 flex items-end"
            onClick={() => setShowAvailabilityModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6 safe-area-pb max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-2 dark:text-white">Check Availability</h3>
              <p className="text-sm text-gray-500 mb-6">Select a date to check pricing and availability</p>

              <div className="grid grid-cols-5 gap-2 mb-6">
                {availableDates.slice(0, 15).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(item.date)}
                    disabled={!item.available}
                    className={`p-2 rounded-xl text-center transition-all ${
                      selectedDate === item.date
                        ? "bg-blue-600 text-white"
                        : item.available
                        ? "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                        : "bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <p className="text-[10px] font-medium">
                      {item.date.toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    <p className="font-bold text-sm">{item.date.getDate()}</p>
                  </button>
                ))}
              </div>

              {selectedDate && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={18} className="text-green-600" />
                    <span className="font-bold text-green-700 dark:text-green-300">Available</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-300 mt-2">
                    ₹{(vendor.perDayPrice?.min || 50000).toLocaleString("en-IN")}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded" />
                  <span className="text-gray-500">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-50 dark:bg-gray-800/50 rounded" />
                  <span className="text-gray-500">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded" />
                  <span className="text-gray-500">Selected</span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowAvailabilityModal(false);
                  setShowBookingSheet(true);
                }}
                disabled={!selectedDate}
                className={`w-full py-4 rounded-2xl font-bold text-lg ${
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

      {/* ============================================ */}
      {/* GLOBAL STYLES */}
      {/* ============================================ */}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </main>
  );
};

export default VendorDetailsPageWrapper;
