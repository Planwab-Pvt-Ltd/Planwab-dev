"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
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
  DollarSign,
  Share2,
  Check,
  MapIcon,
  Wifi,
  Car,
  Music,
  Wind,
  Camera,
  User,
  Shield,
  Award,
  Zap,
  Building2,
  Home,
  Utensils,
  Crown,
  MessageCircle,
  Copy,
  Facebook,
  Twitter,
  X,
  ChevronUp,
  ChevronDown,
  Grid,
  List,
  Eye,
  ThumbsUp,
  ArrowLeft,
  ExternalLink,
  Layers,
  BarChart2,
  Gift,
  FileText,
  Paintbrush2,
  UserCircle,
  UtensilsCrossed,
  Shirt,
  Hand,
  CakeSlice,
  Gem,
  Music as MusicIcon,
  Scissors,
  Leaf,
  Users,
  Sparkles,
  IndianRupee,
  BadgeIndianRupee,
  BadgeCheck,
  Percent,
  Clock,
  Palette,
  Info,
  Package,
  Video,
  Globe,
  Timer,
  Flame,
  Mic2,
  Droplets,
  CheckCircle,
  Instagram,
  Youtube,
} from "lucide-react";
import DetailsPageSkeleton from "../ui/skeletons/DetailsPageSkeleton";
import Link from "next/link";


const QuickStatCard = ({ icon: Icon, label, value, color = "blue", subtext }) => (
  <div className={`p-3 bg-${color}-50 dark:bg-${color}-900/20 rounded-xl text-center`}>
    <Icon size={16} className={`text-${color}-500 mx-auto mb-1`} />
    <p className="text-[10px] text-gray-500 uppercase font-bold">{label}</p>
    <p className={`text-lg font-black text-${color}-700 dark:text-${color}-400`}>{value}</p>
    {subtext && <p className="text-[9px] text-gray-500">{subtext}</p>}
  </div>
);


const InfoChip = ({ icon: Icon, label, value, color = "blue" }) => (
  <div className={`p-2.5 bg-${color}-50 dark:bg-${color}-900/20 rounded-xl flex items-center gap-2`}>
    <Icon size={14} className={`text-${color}-500`} />
    <div>
      <p className="text-[10px] text-gray-500 uppercase font-bold">{label}</p>
      <p className={`text-sm font-bold text-${color}-700 dark:text-${color}-400`}>{value}</p>
    </div>
  </div>
);


/**
 * Category configuration mapping for vendor types
 * Defines display labels, icons, and color themes for each vendor category
 * Used throughout the component for consistent styling and navigation
 */
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
  djs: { label: "DJs", icon: MusicIcon, color: "violet" },
  hairstyling: { label: "Hairstyling", icon: Scissors, color: "fuchsia" },
  other: { label: "Services", icon: FileText, color: "gray" },
};

/**
 * Main VendorDetailsPageWrapper component
 * Manages vendor data fetching, state management, and UI rendering
 */
const VendorDetailsPageWrapper = () => {

  const { id } = useParams();

  const { activeCategory } = useCategoryStore();


  const [vendor, setVendor] = useState(null);           // Vendor data
  const [loading, setLoading] = useState(true);        // Loading state
  const [error, setError] = useState(null);            // Error state


  const [similarVendors, setSimilarVendors] = useState([]);     // Similar vendors list
  const [recommendedVendors, setRecommendedVendors] = useState([]); // Recommended vendors list
  const [listsLoading, setListsLoading] = useState(true);       // Lists loading state
  const [listsError, setListsError] = useState(null);           // Lists error state


  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Current carousel image
  const [isPaused, setIsPaused] = useState(false);              // Carousel pause state
  const [isLiked, setIsLiked] = useState(false);                // Favorite status
  const [showAllImages, setShowAllImages] = useState(false);     // Show all images modal
  const [activeTab, setActiveTab] = useState("overview");       // Active tab
  const [showFullDescription, setShowFullDescription] = useState(false); // Description expansion
  const [viewMode, setViewMode] = useState("grid");             // Gallery view mode
  const [showShareModal, setShowShareModal] = useState(false);   // Share modal state
  const [showImageModal, setShowImageModal] = useState(false);   // Image modal state
  const [modalImageIndex, setModalImageIndex] = useState(0);     // Modal image index
  const [showFullStory, setShowFullStory] = useState(false);     // Full story collapsible effect

  // === COLLAPSIBLE SECTIONS STATE ===

  const [expandedSections, setExpandedSections] = useState({
    eventTypes: true,
    operatingHours: true,
    whyChooseUs: true,
    specialOffers: true
  });


  // Toggle expanded/collapsed state for content sections

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Animation controller for carousel progress bar
  const timerControls = useAnimation();

  /**
   * Fetch vendor data from API
   * Handles loading states, error handling, and data updates
   */
  const fetchVendor = useCallback(async () => {
    if (!id) {
      setLoading(false);
      setError("Vendor ID is missing.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vendor/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch vendor data. Please try again later.");
      }
      const data = await response.json();
      setVendor(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch similar and recommended vendors for the current vendor

  const fetchLists = async () => {
    if (!id) return;
    setListsLoading(true);
    setListsError(null);
    try {
      const response = await fetch(`/api/vendor/lists/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations.");
      }
      const data = await response.json();
      setSimilarVendors(data.similarVendors);
      setRecommendedVendors(data.recommendedVendors);
    } catch (err) {
      setListsError(err.message);
    } finally {
      setListsLoading(false);
    }
  };

  // === EFFECTS ===

  // Fetch vendor data on component mount and when ID changes
  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  // Fetch vendor lists when vendor data is available
  useEffect(() => {
    if (vendor) {
      fetchLists();
    }
  }, [id, vendor]);

  // === CAROUSEL AUTO-PLAY LOGIC ===

  useEffect(() => {
    const timer = !isPaused
      ? setInterval(() => setCurrentImageIndex((prev) => (prev + 1) % (vendor?.images.length || 1)), 4000)
      : null;
    return () => clearInterval(timer);
  }, [isPaused, vendor?.images.length]);

  // Controls progress bar animation for carousel
  useEffect(() => {
    if (isPaused) {
      timerControls.stop();
    } else {
      timerControls.set({ width: "0%" });
      timerControls.start({
        width: "100%",
        transition: { duration: 4, ease: "linear" },
      });
    }
  }, [currentImageIndex, isPaused, timerControls]);

  const handleNext = () => setCurrentImageIndex((prev) => (prev + 1) % (vendor?.images.length || 1));


  const handlePrev = () =>
    setCurrentImageIndex((prev) => (prev - 1 + (vendor?.images.length || 1)) % (vendor?.images.length || 1));


  const handleImageClick = (index) => {
    setModalImageIndex(index);
    setShowImageModal(true);
  };


  const handleModalClose = () => setShowImageModal(false);

  const handleModalNext = () => setModalImageIndex((prev) => (prev + 1) % vendor.images.length);

  const handleModalPrev = () => setModalImageIndex((prev) => (prev - 1 + vendor.images.length) % vendor.images.length);


  const handleShare = (platform) => {
    if (!vendor) return;
    const url = window.location.href;
    const text = `Check out ${vendor.name} - ${vendor.description.substring(0, 100)}...`;

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        break;
      default:
        break;
    }
    setShowShareModal(false);
  };



  // Format pricing for display
  const displayPrice = vendor?.perDayPrice?.min?.toLocaleString("en-IN") || "N/A";
  const displayMaxPrice = vendor?.perDayPrice?.max?.toLocaleString("en-IN") || "N/A";

  // Get vendor images array
  const images = vendor?.images || [];

  /**
   * Dynamic tab configuration based on vendor data
   * Filters tabs based on available content and vendor properties
   * Provides responsive navigation for different vendor information sections
   */
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
      { id: "gallery", label: "Gallery", icon: Camera, show: images.length > 0 },
      { id: "packages", label: "Packages", icon: Gift, show: vendor?.packages?.length > 0 },
      { id: "reviews", label: "Reviews", icon: MessageCircle },
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
  }, [vendor, images]);

  // === LOADING AND ERROR STATES ===

  if (loading) {
    return <DetailsPageSkeleton />;
  }

  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  if (!vendor) return <div className="flex items-center justify-center h-screen">Vendor not found.</div>;


  const amenityIcons = {
    "Air Conditioning": Wind,
    Parking: Car,
    "Sound System": Music,
    "Wi-Fi": Wifi,
    "Catering Service": Utensils,
    Security: Shield,
    "Photography Area": Camera,
    "Bridal Room": Crown,
  };


  // CategorySpecificSection - Dynamic content renderer for vendor categories

  /* 
  * Supported Categories:
  * - venues: Capacity details, facilities, areas, food policy
  * - mehendi: Design styles, pricing, service details, organic options
  * - photographers: Services, deliverables, equipment info
  * - planners: Specializations, events managed, team info, budget range
  * - makeup: Services, brands, trial policy
  * - catering: Cuisines, menu types, capacity, pricing
  * - djs: Music genres, performance details, equipment
  * */

  const CategorySpecificSection = memo(({ vendor, formatPrice }) => {
    const category = vendor.category;
    if (!category) return null;


    // Render category-specific content based on vendor type

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
                  className={`p-3 rounded-xl flex items-center gap-3 ${vendor.destinationWeddings
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

    return renderContent();
  });


  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-18`}
    >
      {/* === STICKY NAVIGATION BAR === */}
      {/* Provides navigation back to search and quick access to favorites/share */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/vendors/marketplace/${vendor?.category?.toLowerCase()}`}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Search</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-all duration-300 ${isLiked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } dark:bg-gray-700 dark:text-gray-300`}
              >
                <Heart size={20} className={isLiked ? "fill-current" : ""} />
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-colors"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === MAIN CONTENT AREA === */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 !pt-[12px]">

        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <a href="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                Home
              </a>
            </li>
            <li>
              <ChevronRight size={16} />
            </li>
            <li>
              <a
                href={`/vendors/marketplace/${vendor?.category?.toLowerCase()}`}
                className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {vendor.category}
              </a>
            </li>
            <li>
              <ChevronRight size={16} />
            </li>
            <li className="font-medium text-gray-700 dark:text-gray-200 truncate" aria-current="page">
              {vendor.name}
            </li>
          </ol>
        </nav>

        {/* === MAIN LAYOUT GRID === */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          <div className="xl:col-span-2 space-y-6">

            <div
              className="relative group"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={vendor.images[currentImageIndex]}
                    alt={vendor.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* === CAROUSEL NAVIGATION CONTROLS === */}

                {vendor.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft size={24} className="text-white" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={24} className="text-white" />
                    </button>
                  </>
                )}

                {/* === CAROUSEL PROGRESS INDICATORS === */}

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                  {vendor.images?.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative h-2 rounded-full overflow-hidden transition-all duration-500 ${idx === currentImageIndex ? "w-8 bg-white/40" : "w-2 bg-white/40"
                        }`}
                    >
                      {idx === currentImageIndex && (
                        <motion.div className="absolute top-0 left-0 h-full bg-white" animate={timerControls} />
                      )}
                    </button>
                  ))}
                </div>

                {/* === VENDOR TAGS === */}
                {/* Displays vendor category tags and special features */}
                <div className="absolute top-6 left-6 flex gap-2">
                  {vendor.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setShowAllImages(true)}
                  className="absolute bottom-8 right-8 bg-black/30 backdrop-blur-md px-6 py-3 rounded-2xl text-white font-medium hover:bg-black/40 transition-all duration-300 flex items-center gap-3 shadow-xl"
                >
                  <Grid size={18} />
                  <span>View All</span>
                  <span className="bg-white/20 px-2 py-1 rounded-lg text-sm">{vendor.images.length}</span>
                </button>
              </div>
              {showAllImages && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">All Photos</h3>
                    <button
                      onClick={() => setShowAllImages(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ChevronUp size={16} />
                      Hide Gallery
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {vendor.images?.map((image, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative group cursor-pointer"
                        onClick={() => handleImageClick(idx)}
                      >
                        <div className="relative overflow-hidden rounded-2xl shadow-lg">
                          <img
                            src={image}
                            alt={`${vendor.name} ${idx + 1}`}
                            className="w-full h-32 md:h-40 object-cover transition-all duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                              <Eye size={20} className="text-white" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            {/* === TABBED CONTENT SECTION === */}
            {/* Dynamic content area with smooth tab transitions */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              {/* === TAB NAVIGATION === */}

              <div className="overflow-x-auto mb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-4 min-w-max px-1">
                  {TAB_CONFIG.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-all duration-300 relative whitespace-nowrap ${activeTab === tab.id
                          ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        }`}
                    >
                      <tab.icon size={18} />
                      {tab.label}
                      {/* === ACTIVE TAB INDICATOR === */}

                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* === TAB CONTENT AREA === */}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  {/* === CATEGORY-SPECIFIC TAB CONTENT === */}

                  {activeTab === "overview" && (
                    <div className="space-y-8">


                      {/* Vendor's short description */}

                      {vendor.shortDescription && (
                        <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 dark:from-indigo-950/30 dark:via-blue-950/20 dark:to-slate-900/50 px-6 py-4 rounded-3xl shadow-sm border border-indigo-100/50 dark:border-indigo-900/30">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center shrink-0 ring-1 ring-indigo-200/50 dark:ring-indigo-800/50">
                              <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1 pt-2">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic text-lg">
                                "{vendor.shortDescription}"
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. Pricing Details */}
                      {(vendor.basePrice || vendor.perDayPrice?.min) && (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 flex items-center justify-center shadow-inner">
                              <IndianRupee size={24} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Pricing
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                Transparent pricing options
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Base Price */}
                            {vendor.basePrice && (
                              <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/10 rounded-xl border border-emerald-200/60 dark:border-emerald-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 overflow-hidden">
                                {/* Icon Header */}
                                <div className="flex items-center gap-3 p-4 border-b border-emerald-200/30 dark:border-emerald-700/30">
                                  <div className="p-2 bg-white dark:bg-slate-700/50 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-600">
                                    <BadgeIndianRupee size={18} className="text-emerald-600 dark:text-emerald-400" />
                                  </div>
                                  <div className="flex-1">
                                    <span className="font-semibold text-sm text-slate-600 dark:text-slate-400 block">
                                      Base Price
                                    </span>
                                    <span className="font-medium text-xs text-slate-500 dark:text-slate-500">
                                      per {" " + vendor.priceUnit || "day"}
                                    </span>
                                  </div>
                                </div>
                                {/* Price Display */}
                                <div className="p-4 text-center bg-white/50 dark:bg-slate-700/30">
                                  <span className="font-black text-2xl text-emerald-600 dark:text-emerald-400">
                                    ₹{vendor.basePrice.toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Per Day Price Range */}
                            {vendor.perDayPrice?.min && (
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-xl border border-blue-200/60 dark:border-blue-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 overflow-hidden">
                                {/* Icon Header */}
                                <div className="flex items-center gap-3 p-4 border-b border-blue-200/30 dark:border-blue-700/30">
                                  <div className="p-2 bg-white dark:bg-slate-700/50 rounded-lg shadow-sm border border-blue-200 dark:border-blue-600">
                                    <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div className="flex-1">
                                    <span className="font-semibold text-sm text-slate-600 dark:text-slate-400 block">
                                      Per {vendor.priceUnit} Rate
                                    </span>
                                    <span className="font-medium text-xs text-slate-500 dark:text-slate-500">
                                      {vendor.perDayPrice.max ? "Price range" : "Starting from"}
                                    </span>
                                  </div>
                                </div>
                                {/* Price Display */}
                                <div className="p-4 text-center bg-white/50 dark:bg-slate-700/30">
                                  {vendor.perDayPrice.max ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <span className="font-black text-xl text-blue-600 dark:text-blue-400">
                                        ₹{vendor.perDayPrice.min.toLocaleString("en-IN")}
                                      </span>
                                      <span className="font-bold text-sm text-slate-400 dark:text-slate-500">-</span>
                                      <span className="font-black text-xl text-blue-600 dark:text-blue-400">
                                        ₹{vendor.perDayPrice.max.toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="font-black text-2xl text-blue-600 dark:text-blue-400">
                                      ₹{vendor.perDayPrice.min.toLocaleString("en-IN")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 3. Category Highlights */}
                      {(() => {
                        const category = vendor.category;
                        if (!category) return null;

                        const getHighlights = () => {
                          switch (category) {
                            case "mehendi":
                              return [
                                vendor.designs?.length > 0 && { icon: Palette, label: "STYLES", value: `${vendor.designs.filter((d) => !d.includes(",") && !d.includes("₹")).length}+ Designs`, color: "amber" },
                                vendor.teamSize && { icon: Users, label: "TEAM SIZE", value: `${vendor.teamSize}+ Artists`, color: "blue" },
                                vendor.pricePerHand && { icon: Hand, label: "PRICE/HAND", value: `₹${vendor.pricePerHand.toLocaleString("en-IN")}`, color: "emerald" },
                                vendor.bridalPackagePrice && { icon: Crown, label: "BRIDAL PACKAGE", value: `₹${vendor.bridalPackagePrice.toLocaleString("en-IN")}`, color: "rose" },
                                vendor.organic && { icon: Leaf, label: "100% ORGANIC HENNA", value: "Natural, chemical-free & skin-safe", color: "green", fullWidth: true, hasCheck: true }
                              ].filter(Boolean);

                            case "venues":
                              return [
                                vendor.seating && { icon: Users, label: "CAPACITY", value: `${vendor.seating.min || 0}-${vendor.seating.max || 0} Guests`, color: "purple" },
                                vendor.halls && { icon: Building2, label: "HALLS", value: `${vendor.halls}+ Spaces`, color: "blue" },
                                vendor.parking?.capacity && { icon: Car, label: "PARKING", value: `${vendor.parking.capacity}+ Cars`, color: "emerald" },
                                vendor.wifi && { icon: Wifi, label: "WIFI", value: "High Speed", color: "amber" },
                                vendor.security && { icon: Shield, label: "SECURITY", value: "24/7 Available", color: "rose", fullWidth: true, hasCheck: true }
                              ].filter(Boolean);

                            case "photographers":
                              return [
                                vendor.teamSize && { icon: Users, label: "TEAM SIZE", value: `${vendor.teamSize}+ Photographers`, color: "blue" },
                                vendor.deliveryTime && { icon: Clock, label: "DELIVERY", value: `${vendor.deliveryTime} Days`, color: "emerald" },
                                vendor.packages?.[0]?.price && { icon: Gift, label: "PACKAGES", value: `Starting ₹${vendor.packages[0].price.toLocaleString("en-IN")}`, color: "amber" },
                                vendor.experience && { icon: Award, label: "EXPERIENCE", value: `${vendor.experience}+ Years`, color: "rose", fullWidth: true, hasCheck: true }
                              ].filter(Boolean);

                            case "makeup":
                              return [
                                vendor.services?.length > 0 && { icon: Paintbrush2, label: "STYLES", value: `${vendor.services.length}+ Looks`, color: "purple" },
                                vendor.teamSize && { icon: Users, label: "ARTISTS", value: `${vendor.teamSize}+ Professionals`, color: "blue" },
                                vendor.duration && { icon: Clock, label: "DURATION", value: vendor.duration, color: "emerald" },
                                vendor.bridalPackagePrice && { icon: Crown, label: "BRIDAL", value: `Starting ₹${vendor.bridalPackagePrice.toLocaleString("en-IN")}`, color: "rose" },
                                vendor.brandsUsed?.length > 0 && { icon: Shield, label: "PRODUCTS", value: "Premium Brands Only", color: "amber", fullWidth: true, hasCheck: true }
                              ].filter(Boolean);

                            case "catering":
                              return [
                                vendor.cuisines?.length > 0 && { icon: UtensilsCrossed, label: "CUISINES", value: `${vendor.cuisines.length}+ Types`, color: "purple" },
                                vendor.maxCapacity && { icon: Users, label: "GUESTS", value: `Up to ${vendor.maxCapacity}`, color: "blue" },
                                vendor.experience && { icon: Calendar, label: "EXPERIENCE", value: `${vendor.experience}+ Years`, color: "emerald" },
                                vendor.pricePerPlate?.veg && { icon: Gift, label: "PLATES", value: `Starting ₹${vendor.pricePerPlate.veg.toLocaleString("en-IN")}`, color: "amber" },
                                vendor.certifications?.includes("FSSAI") && { icon: Shield, label: "QUALITY", value: "FSSAI Certified", color: "rose", fullWidth: true, hasCheck: true }
                              ].filter(Boolean);

                            case "djs":
                              return [
                                vendor.genres?.length > 0 && { icon: MusicIcon, label: "GENRES", value: `${vendor.genres.length}+ Types`, color: "purple" },
                                vendor.teamSize && { icon: Users, label: "DJS", value: `${vendor.teamSize}+ Artists`, color: "blue" },
                                vendor.performanceDuration && { icon: Clock, label: "HOURS", value: vendor.performanceDuration, color: "emerald" },
                                vendor.packages?.[0]?.price && { icon: Gift, label: "PACKAGES", value: `Starting ₹${vendor.packages[0].price.toLocaleString("en-IN")}`, color: "amber" },
                                vendor.equipment && { icon: Award, label: "EQUIPMENT", value: "Professional Sound System", color: "rose", fullWidth: true, hasCheck: true }
                              ].filter(Boolean);

                            default:
                              return [];
                          }
                        };

                        const highlights = getHighlights();
                        if (highlights.length === 0) return null;

                        const colorConfig = {
                          amber: { bgColor: "from-amber-50 to-orange-50", darkBgColor: "dark:from-amber-900/20 dark:to-orange-900/10", borderColor: "border-amber-200/60 dark:border-amber-700/60", labelColor: "text-amber-700 dark:text-amber-300", valueColor: "text-amber-600 dark:text-amber-400" },
                          blue: { bgColor: "from-blue-50 to-indigo-50", darkBgColor: "dark:from-blue-900/20 dark:to-indigo-900/10", borderColor: "border-blue-200/60 dark:border-blue-700/60", labelColor: "text-blue-700 dark:text-blue-300", valueColor: "text-blue-600 dark:text-blue-400" },
                          emerald: { bgColor: "from-emerald-50 to-teal-50", darkBgColor: "dark:from-emerald-900/20 dark:to-teal-900/10", borderColor: "border-emerald-200/60 dark:border-emerald-700/60", labelColor: "text-emerald-700 dark:text-emerald-300", valueColor: "text-emerald-600 dark:text-emerald-400" },
                          rose: { bgColor: "from-rose-50 to-pink-50", darkBgColor: "dark:from-rose-900/20 dark:to-pink-900/10", borderColor: "border-rose-200/60 dark:border-rose-700/60", labelColor: "text-rose-700 dark:text-rose-300", valueColor: "text-rose-600 dark:text-rose-400" },
                          purple: { bgColor: "from-purple-50 to-violet-50", darkBgColor: "dark:from-purple-900/20 dark:to-violet-900/10", borderColor: "border-purple-200/60 dark:border-purple-700/60", labelColor: "text-purple-700 dark:text-purple-300", valueColor: "text-purple-600 dark:text-purple-400" },
                          green: { bgColor: "from-green-50 to-emerald-50", darkBgColor: "dark:from-green-900/20 dark:to-emerald-900/10", borderColor: "border-green-200/60 dark:border-green-700/60", labelColor: "text-green-700 dark:text-green-300", valueColor: "text-green-600 dark:text-green-400" }
                        };

                        return (
                          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800/80">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center shadow-inner">
                                <Sparkles size={24} className="text-amber-600 dark:text-amber-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                  {CATEGORY_CONFIG[vendor.category]?.label || "Service"} Highlights
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                  Premium {CATEGORY_CONFIG[vendor.category]?.label?.toLowerCase() || "service"} features & specifications
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {highlights.map((highlight, index) => {
                                const config = colorConfig[highlight.color] || colorConfig.amber;
                                const Icon = highlight.icon;

                                if (highlight.fullWidth) {
                                  return (
                                    <div key={index} className={`md:col-span-2 bg-gradient-to-br ${config.bgColor} ${config.darkBgColor} rounded-xl border ${config.borderColor} shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 p-2`}>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <div className="p-2 bg-white dark:bg-slate-700/50 rounded-lg shadow-sm border border-current border-opacity-20">
                                            <Icon size={18} className={config.valueColor} />
                                          </div>
                                          <div>
                                            <span className={`font-bold ${config.labelColor} text-xs block`}>{highlight.label}</span>
                                            <div className={`text-sm font-semibold ${config.valueColor} mt-0.5`}>{highlight.value}</div>
                                          </div>
                                        </div>
                                        {highlight.hasCheck && <div className="p-2 bg-white/50 dark:bg-slate-700/50 rounded-full"><Check size={20} className={config.valueColor} /></div>}
                                      </div>
                                    </div>
                                  );
                                }

                                return (
                                  <div key={index} className={`bg-gradient-to-br ${config.bgColor} ${config.darkBgColor} rounded-xl border ${config.borderColor} shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 p-2`}>
                                    <div className="flex items-center gap-1 mb-1">
                                      <div className="p-2 bg-white dark:bg-slate-700/50 rounded-lg shadow-sm border border-current border-opacity-20">
                                        <Icon size={18} className={config.valueColor} />
                                      </div>
                                      <span className={`font-bold ${config.labelColor} text-xs`}>{highlight.label}</span>
                                    </div>
                                    <div className={`text-lg font-black ${config.valueColor}`}>{highlight.value}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* 4. Event Types Supported */}
                      {vendor.eventTypes?.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <button
                            onClick={() => toggleSection('eventTypes')}
                            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-t-3xl"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center shadow-inner">
                                <Calendar size={24} className="text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                  Event Types We Serve
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                  {vendor.eventTypes?.length} specialized categories
                                </p>
                              </div>
                            </div>
                            <ChevronUp
                              size={20}
                              className={`text-slate-400 transition-transform duration-300 ${expandedSections.eventTypes ? '' : 'rotate-180'
                                }`}
                            />
                          </button>
                          <AnimatePresence>
                            {expandedSections.eventTypes && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6">
                                  <div className="flex flex-wrap gap-3">
                                    {vendor.eventTypes.map((type, i) => (
                                      <div
                                        key={i}
                                        className="px-5 py-3 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                                      >
                                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                                        {type}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* 4. Operating Hours */}
                      {vendor.operatingHours && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <button
                            onClick={() => toggleSection('operatingHours')}
                            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-t-3xl"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center shadow-inner">
                                <Clock size={24} className="text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                  Operating Hours
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                  {vendor.operatingHours.length} schedules
                                </p>
                              </div>
                            </div>
                            <ChevronUp
                              size={20}
                              className={`text-slate-400 transition-transform duration-300 ${expandedSections.operatingHours ? '' : 'rotate-180'
                                }`}
                            />
                          </button>
                          <AnimatePresence>
                            {expandedSections.operatingHours && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6">
                                  <div className="space-y-3">
                                    {vendor?.operatingHours?.length > 0 ? (
                                      vendor.operatingHours.map((schedule, i) => (
                                        <div
                                          key={i}
                                          className="flex justify-between items-center py-4 px-5 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                                        >
                                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {schedule.day}
                                          </span>
                                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700/50 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
                                            {schedule.hours}
                                          </span>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="py-4 px-5 text-sm text-slate-500 dark:text-slate-400 italic">
                                        Operating hours not available
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* 5. Amenities */}
                      {vendor.amenities?.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 flex items-center justify-center shadow-inner">
                              <Check size={24} className="text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Amenities & Services
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                {vendor.amenities.length} premium facilities
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {vendor.amenities.map((item, idx) => {
                              const Icon = amenityIcons[item] || Check;
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                                >
                                  <div className="p-2 bg-white dark:bg-slate-700/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600">
                                    <Icon size={18} className="text-slate-600 dark:text-slate-400" />
                                  </div>
                                  <span className="font-medium text-sm text-slate-700 dark:text-slate-300 leading-tight">
                                    {item}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 6. Why Choose Us */}
                      {vendor.highlightPoints?.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <button
                            onClick={() => toggleSection('whyChooseUs')}
                            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-t-3xl"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center shadow-inner">
                                <BadgeCheck size={24} className="text-amber-600 dark:text-amber-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                  Why Choose Us
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                  {vendor.highlightPoints?.length} unique advantages
                                </p>
                              </div>
                            </div>
                            <ChevronUp
                              size={20}
                              className={`text-slate-400 transition-transform duration-300 ${expandedSections.whyChooseUs ? '' : 'rotate-180'
                                }`}
                            />
                          </button>
                          <AnimatePresence>
                            {expandedSections.whyChooseUs && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6">
                                  <div className="space-y-4">
                                    {vendor.highlightPoints.map((point, i) => (
                                      <div
                                        key={i}
                                        className="flex items-start gap-4 p-5 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border-l-4 border-amber-400 dark:border-amber-500/50 shadow-sm"
                                      >
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center shrink-0 shadow-sm">
                                          <Sparkles size={16} className="text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-1">
                                          {point}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* 8. Special Offers */}
                      {vendor.specialOffers?.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <button
                            onClick={() => toggleSection('specialOffers')}
                            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-t-3xl"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 flex items-center justify-center shadow-inner">
                                <Percent size={24} className="text-rose-600 dark:text-rose-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                  Special Offers
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                  {vendor.specialOffers.length} active deals
                                </p>
                              </div>
                            </div>
                            <ChevronUp
                              size={20}
                              className={`text-slate-400 transition-transform duration-300 ${expandedSections.specialOffers ? '' : 'rotate-180'
                                }`}
                            />
                          </button>
                          <AnimatePresence>
                            {expandedSections.specialOffers && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6">
                                  <div className="space-y-4">
                                    {vendor.specialOffers.map((offer, i) => (
                                      <div
                                        key={i}
                                        className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/10 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm relative overflow-hidden"
                                      >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-2xl" />
                                        <div className="relative">
                                          <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                              <span className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-black rounded-xl shadow-md">
                                                {offer.discount}
                                              </span>
                                              <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                                                  {offer.title}
                                                </h4>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                                  {offer.description}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                              Valid until: {offer.validUntil}
                                            </span>
                                            <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all duration-200">
                                              Claim Offer
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* 9. About Vendor */}
                      {(vendor.about || vendor.description || vendor.story) && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 flex items-center justify-center shadow-lg">
                                <Info size={24} className="text-white" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                  About {vendor.name || 'Vendor'}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                  Our story and mission
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {/* Main Description with Read More functionality */}
                              <div>
                                <div className={`text-slate-600 dark:text-slate-300 leading-relaxed ${!showFullStory ? 'max-h-20 overflow-hidden' : ''
                                  }`}>
                                  <p>
                                    {vendor.about || vendor.description || vendor.story ||
                                      `${vendor.name} is a professional ${vendor.category} service provider with years of experience in the industry. We are committed to delivering exceptional quality and service to make your special occasions memorable.`
                                    }
                                  </p>
                                </div>

                                {/* Read More/Less button for main description */}
                                {!(vendor.fullStory || vendor.detailedDescription) && (
                                  <button
                                    onClick={() => setShowFullStory(!showFullStory)}
                                    className="mt-3 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                                  >
                                    <span>{showFullStory ? 'Show Less' : 'Read More'}</span>
                                    <ChevronDown
                                      size={14}
                                      className={`transition-transform duration-200 ${showFullStory ? 'rotate-180' : ''
                                        }`}
                                    />
                                  </button>
                                )}
                              </div>

                              {/* Collapsible Full Story Section */}
                              <AnimatePresence>
                                {showFullStory && (vendor.fullStory || vendor.detailedDescription) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {vendor.fullStory || vendor.detailedDescription}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Additional vendor details if available */}
                              {vendor.experience && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                  <Clock size={16} />
                                  <span>{vendor.experience} years of experience</span>
                                </div>
                              )}

                              {vendor.founded && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                  <Calendar size={16} />
                                  <span>Established in {vendor.founded}</span>
                                </div>
                              )}

                              {vendor.teamSize && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                  <Users size={16} />
                                  <span>Team of {vendor.teamSize}+ professionals</span>
                                </div>
                              )}

                              {(vendor.fullStory || vendor.detailedDescription) && (
                                <button
                                  onClick={() => setShowFullStory(!showFullStory)}
                                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-950/40 dark:hover:to-purple-950/30 border border-indigo-200/60 dark:border-indigo-800/40 rounded-xl transition-all duration-200 group"
                                >
                                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                    {showFullStory ? 'Show Less' : 'Read Full Story'}
                                  </span>
                                  <ChevronDown
                                    size={16}
                                    className={`text-indigo-600 dark:text-indigo-400 transition-transform duration-200 ${showFullStory ? 'rotate-180' : 'group-hover:translate-y-0.5'
                                      }`}
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 10. Connect With Us */}
                      {(vendor.website || vendor.socialLinks?.instagram || vendor.socialLinks?.facebook || vendor.socialLinks?.youtube ||
                        vendor.instagram || vendor.facebook || vendor.youtube) && (
                          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                            <div className="p-6">
                              <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 flex items-center justify-center shadow-lg">
                                  <Globe size={24} className="text-white" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                    Connect With Us
                                  </h3>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                    Follow us on social media
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Website Link */}
                                {(vendor.website || vendor.websiteUrl) && (
                                  <a
                                    href={vendor.website || vendor.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-row items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-full border border-blue-200/60 dark:border-blue-800/40 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-950/40 dark:hover:to-blue-900/30 transition-all duration-200 group"
                                  >
                                    <Globe size={16} className="text-blue-600 dark:text-blue-400" />
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Website</p>
                                  </a>
                                )}

                                {/* Instagram Link */}
                                {(vendor.socialLinks?.instagram || vendor.instagram) && (
                                  <a
                                    href={vendor.socialLinks?.instagram || vendor.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-row items-center gap-2 px-4 py-2 bg-gradient-to-br from-pink-50 to-purple-100 dark:from-pink-950/30 dark:to-purple-900/20 rounded-full border border-pink-200/60 dark:border-pink-800/40 hover:from-pink-100 hover:to-purple-200 dark:hover:from-pink-950/40 dark:hover:to-purple-900/30 transition-all duration-200 group"
                                  >
                                    <Instagram size={16} className="text-pink-600 dark:text-pink-400" />
                                    <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Instagram</p>
                                  </a>
                                )}

                                {/* Facebook Link */}
                                {(vendor.socialLinks?.facebook || vendor.facebook) && (
                                  <a
                                    href={vendor.socialLinks?.facebook || vendor.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-row items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-900/20 rounded-full border border-blue-200/60 dark:border-blue-800/40 hover:from-blue-100 hover:to-indigo-200 dark:hover:from-blue-950/40 dark:hover:to-indigo-900/30 transition-all duration-200 group"
                                  >
                                    <Facebook size={16} className="text-blue-600 dark:text-blue-400" />
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Facebook</p>
                                  </a>
                                )}

                                {/* YouTube Link */}
                                {(vendor.socialLinks?.youtube || vendor.youtube) && (
                                  <a
                                    href={vendor.socialLinks?.youtube || vendor.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-row items-center gap-2 px-4 py-2 bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-950/30 dark:to-orange-900/20 rounded-full border border-red-200/60 dark:border-red-800/40 hover:from-red-100 hover:to-orange-200 dark:hover:from-red-950/40 dark:hover:to-orange-900/30 transition-all duration-200 group"
                                  >
                                    <Youtube size={16} className="text-red-600 dark:text-red-400" />
                                    <p className="text-sm font-medium text-red-600 dark:text-red-400">YouTube</p>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                  {activeTab === "amenities" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                          Available Amenities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {vendor.amenities?.map((amenity, index) => {
                            const IconComponent = amenityIcons[amenity] || Check;
                            return (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-100 dark:border-purple-800/50"
                              >
                                <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                                  <IconComponent size={20} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{amenity}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                          Special Facilities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {vendor.facilities?.map((facility, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800/50"
                            >
                              <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg">
                                <Building2 size={20} className="text-green-600 dark:text-green-400" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">{facility}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "gallery" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Photo Gallery</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                          >
                            <Grid size={18} />
                          </button>
                          <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                          >
                            <List size={18} />
                          </button>
                        </div>
                      </div>
                      <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-6" : "space-y-4"}>
                        {vendor.images?.map((image, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative group cursor-pointer ${viewMode === "list" ? "flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl" : ""
                              }`}
                            onClick={() => handleImageClick(idx)}
                          >
                            <div className="relative overflow-hidden rounded-2xl shadow-lg">
                              <img
                                src={image}
                                alt={`${vendor.name} ${idx + 1}`}
                                className={`object-cover transition-all duration-500 group-hover:scale-110 ${viewMode === "list" ? "w-24 h-24" : "w-full h-48"
                                  }`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                                  <Eye size={20} className="text-white" />
                                </div>
                              </div>
                            </div>
                            {viewMode === "list" && (
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Photo {idx + 1}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  High resolution venue photograph
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800/50 text-purple-600 dark:text-purple-300 text-xs rounded-full">
                                    HD Quality
                                  </span>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "location" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Venue Location</h3>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl space-y-4">
                          <div className="flex items-start gap-3">
                            <MapPin size={20} className="text-purple-600 mt-1" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">{vendor.address.street}</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                {vendor.address.city}, {vendor.address.state} {vendor.address.postalCode}
                              </p>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Available Areas:</p>
                            <div className="flex flex-wrap gap-2">
                              {vendor.availableAreas?.map((area, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-purple-100 dark:bg-purple-800/50 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                                >
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Customer Reviews</h3>
                        <div className="flex items-center gap-2">
                          <Star size={20} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{vendor.rating}</span>
                          <span className="text-gray-600 dark:text-gray-400">({vendor.reviews} reviews)</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-4">{rating}</span>
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                                style={{
                                  width: `${rating === 5 ? 65 : rating === 4 ? 25 : rating === 3 ? 8 : rating === 2 ? 2 : 0
                                    }%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                              {rating === 5
                                ? "65%"
                                : rating === 4
                                  ? "25%"
                                  : rating === 3
                                    ? "8%"
                                    : rating === 2
                                      ? "2%"
                                      : "0%"}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-6 mt-8">
                        {[
                          {
                            name: "Priya Sharma",
                            rating: 5,
                            date: "2 weeks ago",
                            comment:
                              "Absolutely stunning venue! The Heritage Grand exceeded all our expectations. Perfect for our wedding celebration.",
                            helpful: 12,
                          },
                          {
                            name: "Rajesh Kumar",
                            rating: 4,
                            date: "1 month ago",
                            comment:
                              "Great facilities and professional staff. The sound system was excellent and parking was convenient.",
                            helpful: 8,
                          },
                        ].map((review, idx) => (
                          <div
                            key={idx}
                            className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800/50 rounded-full flex items-center justify-center">
                                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                                    {review.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{review.name}</h4>
                                  <div className="flex items-center gap-2">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          size={14}
                                          className={`${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                            }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">
                                <ThumbsUp size={14} />
                                Helpful ({review.helpful})
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* === CATEGORY-SPECIFIC TAB === */}

                  {activeTab === "category" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                          {CATEGORY_CONFIG[vendor?.category]?.label || "Details"}
                        </h3>
                        <CategorySpecificSection
                          vendor={vendor}
                          formatPrice={(price) => `₹${price?.toLocaleString("en-IN") || "0"}`}
                        />
                      </div>
                    </div>
                  )}

                  {/* SERVICES & AWARDS TAB */}
                  {activeTab === "services" && (
                    <div className="space-y-8">
                      {vendor.facilities?.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Premium Facilities</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {vendor.facilities?.map((facility, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                              >
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800/50 rounded-lg flex items-center justify-center">
                                  <Star size={20} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{facility}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {vendor.amenities?.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Amenities</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {vendor.amenities?.map((amenity, index) => {
                              const IconComponent = amenityIcons[amenity] || Check;
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                                >
                                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
                                    <IconComponent size={20} className="text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">{amenity}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {vendor.awards?.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Awards & Recognition</h3>
                          <div className="space-y-4">
                            {vendor.awards?.map((award, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
                              >
                                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-800/50 rounded-lg flex items-center justify-center">
                                  <Award size={24} className="text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{award.name}</h4>
                                  <p className="text-gray-600 dark:text-gray-400">{award.year}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PACKAGES TAB */}
                  {activeTab === "packages" && (
                    <div className="space-y-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Service Packages</h3>
                      {vendor.packages?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {vendor.packages?.map((pkg, index) => (
                            <div
                              key={index}
                              className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{pkg.name}</h4>
                                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                  ₹{pkg.price?.toLocaleString("en-IN")}
                                </span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 mb-4">{pkg.description}</p>
                              <ul className="space-y-2">
                                {pkg.features?.map((feature, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <Check size={16} className="text-green-500" />
                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Gift size={48} className="text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">No packages available</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* INSIGHTS TAB */}
                  {activeTab === "insights" && (
                    <div className="space-y-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Vendor Insights</h3>
                      {vendor.highlights?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Key Highlights</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {vendor.highlights.map((highlight, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
                              >
                                <Zap size={20} className="text-purple-600 dark:text-purple-400" />
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {typeof highlight === 'string' ? highlight : highlight.label || highlight.value || 'Highlight'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {vendor.stats?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Statistics</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {vendor.stats.map((stat, index) => (
                              <div
                                key={index}
                                className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                              >
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                  {typeof stat === 'string' ? stat : stat.value || 'N/A'}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                  {typeof stat === 'string' ? 'Stat' : stat.label || 'Statistic'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* FAQs TAB */}
                  {activeTab === "faqs" && (
                    <div className="space-y-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Frequently Asked Questions</h3>
                      {vendor.faqs?.length > 0 ? (
                        <div className="space-y-4">
                          {vendor.faqs.map((faq, index) => (
                            <div
                              key={index}
                              className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600"
                            >
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{faq.question}</h4>
                              <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">No FAQs available</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* POLICIES TAB */}
                  {activeTab === "policies" && (
                    <div className="space-y-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Policies & Terms</h3>
                      {vendor.policies?.length > 0 ? (
                        <div className="space-y-6">
                          {vendor.policies.map((policy, index) => (
                            <div
                              key={index}
                              className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-800/50 rounded-lg flex items-center justify-center">
                                  <Shield size={20} className="text-green-600 dark:text-green-400" />
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{policy.title}</h4>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400">{policy.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Shield size={48} className="text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">No policies available</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-6">
            <div className="xl:sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{vendor.name}</h1>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={`${i < Math.floor(vendor.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{vendor.rating}</span>
                        <span className="text-gray-600 dark:text-gray-400">({vendor.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                      <MapPin size={18} />
                      <span>
                        {vendor.address.city}, {vendor.address.state}
                      </span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-800/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                      {vendor.category}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starting from</div>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        ₹{displayPrice}
                        {displayPrice !== displayMaxPrice && <span className="text-lg"> - ₹{displayMaxPrice}</span>}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">per day</div>
                    </div>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        <Calendar size={20} />
                        <span className="font-semibold">Book Now</span>
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        <DollarSign size={20} />
                        <span className="font-semibold">Get Quote</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-300">
                        <Phone size={18} />
                        <span className="font-medium">Call</span>
                      </button>
                      <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-all duration-300">
                        <Mail size={18} />
                        <span className="font-medium">Email</span>
                      </button>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Capacity</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {vendor?.seating?.min}-{vendor?.seating?.max} guests
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Parking</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {typeof vendor?.parking === 'object' ? vendor?.parking?.capacity || 'N/A' : vendor?.parking || 'N/A'} slots
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Rooms</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {vendor?.rooms?.max} available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Safety & Trust</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-green-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Verified Vendor</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award size={18} className="text-blue-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Premium Member</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap size={18} className="text-yellow-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Instant Booking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Similar Venues</h2>
              {listsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
                      >
                        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="p-4">
                          <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
                          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : listsError ? (
                <div className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <p className="text-red-500">{listsError}</p>
                </div>
              ) : similarVendors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {similarVendors.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group cursor-pointer"
                    >
                      <Link href={`/vendor/${item?.category}/${item._id}`}>
                        <div className="relative">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3">
                            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                              <Heart size={16} className="text-white" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">{item.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={`${i < Math.floor(item.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                    }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{item.rating}</span>
                          </div>
                          <p className="text-purple-600 dark:text-purple-400 font-semibold">
                            ₹{item.perDayPrice?.min?.toLocaleString("en-IN") || "N/A"}
                            /day
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <p className="text-gray-600 dark:text-gray-400">No similar venues found.</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Recommended for You</h2>
              {listsLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="flex gap-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
                      >
                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                        <div className="flex-1 space-y-3 py-1">
                          <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : listsError ? (
                <div className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <p className="text-red-500">{listsError}</p>
                </div>
              ) : recommendedVendors.length > 0 ? (
                <div className="space-y-4">
                  {recommendedVendors.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group cursor-pointer"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={`${i < Math.floor(item.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{item.rating}</span>
                        </div>
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                          ₹{item.perDayPrice?.min?.toLocaleString("en-IN") || "N/A"}
                          /day
                        </p>
                      </div>
                      <Link href={`/vendor/${item?.category}/${item._id}`} className="flex items-center">
                        <ExternalLink size={16} className="text-gray-400" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <p className="text-gray-600 dark:text-gray-400">No recommendations available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4"
            onClick={handleModalClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleModalClose}
                className="absolute -top-2 -right-2 sm:top-0 sm:right-0 bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-colors z-10"
              >
                <X size={24} />
              </button>
              <button
                onClick={handleModalPrev}
                className="absolute left-0 -translate-x-10 bg-white/20 p-2 sm:p-3 rounded-full text-white hover:bg-white/30 transition-colors hidden md:block"
              >
                <ChevronLeft size={32} />
              </button>
              <AnimatePresence mode="wait">
                <motion.img
                  key={modalImageIndex}
                  src={vendor.images[modalImageIndex]}
                  alt={`Venue image ${modalImageIndex + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
                />
              </AnimatePresence>
              <button
                onClick={handleModalNext}
                className="absolute right-0 translate-x-10 bg-white/20 p-2 sm:p-3 rounded-full text-white hover:bg-white/30 transition-colors hidden md:block"
              >
                <ChevronRight size={32} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">Share This Venue</h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex flex-col items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <Facebook size={24} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Facebook</span>
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex flex-col items-center gap-2 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-2xl hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors"
                >
                  <Twitter size={24} className="text-sky-600" />
                  <span className="text-sm font-medium text-sky-600">Twitter</span>
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Copy size={24} className="text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Copy Link</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorDetailsPageWrapper;