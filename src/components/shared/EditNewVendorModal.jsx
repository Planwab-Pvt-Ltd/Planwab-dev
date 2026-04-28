"use client";

import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Building,
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
  Calendar,
  Clock,
  Users,
  Camera,
  Gift,
  Trash2,
  Plus,
  X,
  Check,
  Star,
  Award,
  Shield,
  Globe,
  DollarSign,
  Building2,
  Paintbrush2,
  UserCheck,
  UtensilsCrossed,
  Shirt,
  Hand,
  CakeSlice,
  Gem,
  Music,
  Scissors,
  Layers,
  HelpCircle,
  Map as MapIcon,
  Sparkles,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Navigation,
  TrendingUp,
  BarChart3,
  Image as ImageIcon,
  Video,
  AlertCircle,
  CheckCircle,
  Target,
  RefreshCw,
  Save,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Grip,
  Eye,
  Undo2,
  ZoomIn,
  MessageCircle,
  Heart,
  AtSign,
  Quote,
  Info,
  Lightbulb,
  Bell,
  Zap,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  EyeOff,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";

// ============================================================================
// TOAST CONTEXT & PROVIDER
// ============================================================================
const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
              className={`pointer-events-auto p-3 sm:p-4 rounded-xl shadow-2xl border backdrop-blur-sm flex items-start gap-2 sm:gap-3 ${
                toast.type === "success"
                  ? "bg-green-50/95 dark:bg-green-900/95 border-green-300 dark:border-green-600 text-green-800 dark:text-green-100"
                  : toast.type === "error"
                    ? "bg-red-50/95 dark:bg-red-900/95 border-red-300 dark:border-red-600 text-red-800 dark:text-red-100"
                    : toast.type === "warning"
                      ? "bg-yellow-50/95 dark:bg-yellow-900/95 border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-100"
                      : "bg-blue-50/95 dark:bg-blue-900/95 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-100"
              }`}
            >
              <div
                className={`p-1 rounded-full ${
                  toast.type === "success"
                    ? "bg-green-200 dark:bg-green-700"
                    : toast.type === "error"
                      ? "bg-red-200 dark:bg-red-700"
                      : toast.type === "warning"
                        ? "bg-yellow-200 dark:bg-yellow-700"
                        : "bg-blue-200 dark:bg-blue-700"
                }`}
              >
                {toast.type === "success" && <CheckCircle size={16} />}
                {toast.type === "error" && <AlertCircle size={16} />}
                {toast.type === "warning" && <AlertTriangle size={16} />}
                {toast.type === "info" && <Info size={16} />}
              </div>
              <p className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 sm:p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

// ============================================================================
// MAIN EXPORT COMPONENT
// ============================================================================
export default function EditNewVendorModal({ vendor, profile, onClose, onSuccess }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <ToastProvider>
      <EditVendorModalContent vendor={vendor} profile={profile} onClose={onClose} onSuccess={onSuccess} />
    </ToastProvider>,
    document.body,
  );
}

// ============================================================================
// MAIN MODAL CONTENT
// ============================================================================
function EditVendorModalContent({ vendor, profile, onClose, onSuccess }) {
  const { addToast } = useToast();
  const formContainerRef = useRef(null);
  const { user } = useUser();

  const categories = [
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
    { key: "other", label: "Other", icon: FileText, description: "Other services" },
  ];

  const initializeFormData = useCallback((vendorData) => {
    let categoryData = vendorData.categoryData || {};

    if (Object.keys(categoryData).length === 0 && vendorData.category) {
      const categoryFields = {
        venues: [
          "seating",
          "floating",
          "halls",
          "rooms",
          "parking",
          "areas",
          "foodPolicy",
          "ceilingHeight",
          "stageSize",
          "powerBackup",
        ],
        photographers: [
          "services",
          "deliverables",
          "deliveryTime",
          "teamSize",
          "travelCost",
          "videographyIncluded",
          "droneAvailable",
        ],
        makeup: ["services", "brandsUsed", "trialPolicy", "travelToVenue", "assistantsAvailable"],
        catering: ["cuisines", "menuTypes", "minCapacity", "maxCapacity", "pricePerPlate", "liveCounters"],
        djs: [
          "genres",
          "performanceDuration",
          "soundSystemPower",
          "setupTime",
          "equipmentProvided",
          "backupAvailable",
          "lightingIncluded",
          "emceeServices",
        ],
        clothes: [
          "outfitTypes",
          "wearType",
          "leadTime",
          "sizeRange",
          "fittingSessions",
          "customization",
          "rentalAvailable",
          "alterationsIncluded",
        ],
        mehendi: [
          "designs",
          "pricePerHand",
          "bridalPackagePrice",
          "teamSize",
          "dryingTime",
          "colorGuarantee",
          "organic",
          "travelToVenue",
        ],
        cakes: [
          "flavors",
          "speciality",
          "pricePerKg",
          "minOrderWeight",
          "advanceBookingDays",
          "deliveryAvailable",
          "customDesigns",
          "eggless",
          "sugarFree",
        ],
        jewellery: [
          "material",
          "styles",
          "returnPolicy",
          "customization",
          "rentalAvailable",
          "certificationProvided",
          "homeTrialAvailable",
        ],
        invitations: [
          "types",
          "minOrderQuantity",
          "digitalDeliveryTime",
          "physicalDeliveryTime",
          "customDesign",
          "languages",
        ],
        hairstyling: [
          "styles",
          "productsUsed",
          "extensionsProvided",
          "drapingIncluded",
          "travelToVenue",
          "trialAvailable",
        ],
        planners: [
          "specializations",
          "eventsManaged",
          "teamSize",
          "vendorNetwork",
          "feeStructure",
          "budgetRange",
          "destinationWeddings",
        ],
        other: ["serviceType", "customFields"],
      };

      const fieldsToExtract = categoryFields[vendorData.category] || [];
      categoryData = {};
      fieldsToExtract.forEach((field) => {
        if (vendorData[field] !== undefined) {
          categoryData[field] = vendorData[field];
        }
      });
    }

    return {
      ...vendorData,
      name: vendorData.name || "",
      username: vendorData.username || "",
      email: vendorData.email || "",
      phoneNo: vendorData.phoneNo || "",
      whatsappNo: vendorData.whatsappNo || "",
      contactPerson: vendorData.contactPerson || { firstName: "", lastName: "" },
      address: vendorData.address || {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        googleMapUrl: "",
        location: { type: "Point", coordinates: [0, 0] },
      },
      landmarks: vendorData.landmarks || [],
      directions: vendorData.directions || [],
      isVerified: vendorData.isVerified || false,
      isActive: vendorData.isActive !== false,
      isFeatured: vendorData.isFeatured || false,
      tags: vendorData.tags || [],
      availabilityStatus: vendorData.availabilityStatus || "Available",
      description: vendorData.description || "",
      shortDescription: vendorData.shortDescription || "",
      videoUrl: vendorData.videoUrl || "",
      rating: vendorData.rating || 4.5,
      reviewCount: vendorData.reviewCount || 0,
      reviews: vendorData.reviews || 0,
      bookings: vendorData.bookings || 0,
      yearsExperience: vendorData.yearsExperience || 0,
      responseTime: vendorData.responseTime || "Within 2 hours",
      repeatCustomerRate: vendorData.repeatCustomerRate || "45%",
      responseRate: vendorData.responseRate || "98%",
      stats: vendorData.stats || [],
      highlights: vendorData.highlights || [],
      operatingHours: vendorData.operatingHours || [],
      amenities: vendorData.amenities || [],
      facilities: vendorData.facilities || [],
      highlightPoints: vendorData.highlightPoints || [],
      awards: vendorData.awards || [],
      specialOffers: vendorData.specialOffers || [],
      eventTypes: vendorData.eventTypes || [
        "Weddings",
        "Corporate",
        "Birthday",
        "Conference",
        "Reception",
        "Engagement",
        "Anniversary",
      ],
      basePrice: vendorData.basePrice || "",
      priceUnit: vendorData.priceUnit || "day",
      perDayPrice: vendorData.perDayPrice || { min: "", max: "" },
      packages: vendorData.packages || [],
      paymentMethods: vendorData.paymentMethods || ["Cash", "UPI", "Bank Transfer"],
      policies: vendorData.policies || [],
      faqs: vendorData.faqs || [],
      socialLinks: vendorData.socialLinks || {
        website: "",
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
        linkedin: "",
      },
      metaTitle: vendorData.metaTitle || "",
      metaDescription: vendorData.metaDescription || "",
      metaKeywords: vendorData.metaKeywords || [],
      categoryData: categoryData,
      category: vendorData.category || "venues",
    };
  }, []);

  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("packages");
  const [hasChanges, setHasChanges] = useState(false);
  const [sectionProgress, setSectionProgress] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  const fieldOptions = {
    cities: [
      "Mumbai",
      "Delhi NCR",
      "Bangalore",
      "Chennai",
      "Kolkata",
      "Hyderabad",
      "Pune",
      "Jaipur",
      "Ahmedabad",
      "Goa",
      "Udaipur",
      "Lucknow",
      "Chandigarh",
      "Kochi",
      "Indore",
      "Nagpur",
      "Surat",
      "Vadodara",
      "Coimbatore",
      "Mysore",
    ],
    amenities: [
      "Air Conditioning",
      "Parking",
      "Valet Parking",
      "Bridal Room",
      "Sound System",
      "Wi-Fi",
      "Generator Backup",
      "CCTV",
      "Wheelchair Accessible",
      "Open Catering",
      "Changing Room",
      "Green Room",
      "Stage Setup",
      "LED Screens",
      "Live Streaming",
      "Projector",
      "Waiting Lounge",
      "Multiple Entry Points",
      "Kids Play Area",
      "Pet Friendly",
      "Smoking Area",
      "Bar Service",
      "Coffee Station",
      "Floral Decoration",
      "Dressing Room",
      "Kitchen Access",
      "Microphone",
      "Climate Control",
      "Heating",
      "Outdoor Space",
      "Indoor Venue",
      "Security",
      "Photography Area",
      "DJ Services",
      "Decoration Service",
    ],
    facilities: [
      "Complimentary Setup",
      "Event Coordinator",
      "High-Speed WiFi",
      "Backup Generator",
      "CCTV Security",
      "Luxury Lounge",
      "VIP Entry",
      "24/7 Support",
      "Free Parking",
      "Valet Service",
      "In-house Catering",
      "Bar License",
      "Outdoor Lighting",
      "Emergency Services",
      "First Aid",
      "Fire Safety",
    ],
    paymentMethods: [
      "Cash",
      "Credit Card",
      "Debit Card",
      "UPI",
      "Bank Transfer",
      "Cheque",
      "EMI",
      "PayTM",
      "PhonePe",
      "GPay",
    ],
    priceUnits: ["day", "plate", "hour", "event", "package", "item", "session", "person"],
    availability: ["Available", "Busy", "Unavailable", "Closed"],
    days: [
      "All Days",
      "Mon - Sat",
      "Mon - Fri",
      "Mon - Thu",
      "Fri - Sat",
      "Sunday",
      "Weekends",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    eventTypes: [
      "Weddings",
      "Corporate",
      "Birthday",
      "Conference",
      "Reception",
      "Engagement",
      "Anniversary",
      "Party",
      "Seminar",
      "Exhibition",
      "Concert",
      "Other",
    ],
    venueAreas: [
      "Indoor",
      "Outdoor",
      "Poolside",
      "Terrace",
      "Banquet Hall",
      "Lawn",
      "Rooftop",
      "Garden",
      "Beach",
      "Farmhouse",
    ],
    foodPolicies: ["Veg Only", "Non-Veg Allowed", "Outside Food Allowed"],
    photographerServices: [
      "Candid Photography",
      "Traditional Photography",
      "Pre-Wedding Shoot",
      "Post-Wedding Shoot",
      "Cinematography",
      "Drone Photography",
      "Photo Booth",
      "Album Design",
      "Photo Editing",
      "Same Day Edit",
    ],
    deliverables: [
      "Digital Photos",
      "Printed Album",
      "Raw Files",
      "Edited Video",
      "Highlight Reel",
      "Drone Footage",
      "Photo Book",
      "Canvas Prints",
      "USB Drive",
    ],
    makeupServices: [
      "Bridal Makeup",
      "Party Makeup",
      "HD Makeup",
      "Airbrush Makeup",
      "Engagement Makeup",
      "Reception Makeup",
      "Hair Styling",
      "Draping",
      "Nail Art",
      "Eye Makeup",
    ],
    makeupBrands: [
      "MAC",
      "Huda Beauty",
      "Bobbi Brown",
      "Charlotte Tilbury",
      "Urban Decay",
      "NARS",
      "Lakme",
      "Maybelline",
      "L'Oreal",
      "Kryolan",
    ],
    cuisines: [
      "North Indian",
      "South Indian",
      "Chinese",
      "Italian",
      "Continental",
      "Mexican",
      "Thai",
      "Japanese",
      "Mediterranean",
      "Mughlai",
      "Punjabi",
      "Bengali",
      "Gujarati",
      "Rajasthani",
    ],
    menuTypes: ["Veg", "Non-Veg", "Vegan", "Jain", "Halal", "Kosher"],
    genres: ["Bollywood", "Punjabi", "EDM", "Hip Hop", "Pop", "Rock", "Classical", "Sufi", "Retro", "International"],
    outfitTypes: [
      "Lehenga",
      "Sherwani",
      "Saree",
      "Gown",
      "Suit",
      "Indo-Western",
      "Anarkali",
      "Kurta",
      "Sharara",
      "Gharara",
    ],
    wearTypes: ["Bridal", "Groom", "Party", "Casual", "Formal", "Traditional"],
    mehendiDesigns: [
      "Arabic",
      "Indian Traditional",
      "Portrait",
      "Minimalist",
      "Rajasthani",
      "Moroccan",
      "Indo-Arabic",
      "Floral",
      "Geometric",
    ],
    cakeFlavors: [
      "Chocolate",
      "Vanilla",
      "Red Velvet",
      "Black Forest",
      "Butterscotch",
      "Strawberry",
      "Pineapple",
      "Mango",
      "Coffee",
      "Fruit",
    ],
    cakeSpeciality: [
      "Fondant",
      "3D Cakes",
      "Photo Cakes",
      "Tiered Cakes",
      "Eggless",
      "Sugar-Free",
      "Themed Cakes",
      "Wedding Cakes",
    ],
    jewelleryMaterial: [
      "Gold",
      "Diamond",
      "Platinum",
      "Silver",
      "Artificial",
      "Kundan",
      "Polki",
      "Meenakari",
      "Pearl",
      "Gemstones",
    ],
    jewelleryStyles: ["Traditional", "Contemporary", "Fusion", "Antique", "Temple", "Bridal Sets", "Minimalist"],
    invitationTypes: ["Digital", "Physical", "Boxed", "Scroll", "Video", "E-Invite", "Laser Cut", "Acrylic"],
    travelCost: ["Included", "Extra"],
    highlightIcons: ["Trophy", "Users", "Timer", "Medal", "Star", "Award", "Zap", "Heart", "ThumbsUp", "TrendingUp"],
    highlightColors: [
      "text-yellow-500",
      "text-blue-500",
      "text-green-500",
      "text-purple-500",
      "text-orange-500",
      "text-pink-500",
    ],
    directionTypes: ["By Metro", "By Car", "By Bus", "By Auto", "By Train", "From Airport", "From Railway Station"],
  };

  const sections = [
//   {
//     id: "basic",
//     label: "Basic Info",
//     icon: Building,
//     required: [],
//     description: "Business identity & contact details",
//   },
//   {
//     id: "location",
//     label: "Location",
//     icon: MapPin,
//     required: [],
//     description: "Physical address & map integration",
//   },
//   {
//     id: "media",
//     label: "Media",
//     icon: ImageIcon,
//     required: [],
//     description: "Photos, videos & descriptions",
//   },
//   {
//     id: "stats",
//     label: "Stats & Hours",
//     icon: BarChart3,
//     required: [],
//     description: "Performance metrics & operating hours",
//   },
//   {
//     id: "pricing",
//     label: "Pricing",
//     icon: DollarSign,
//     required: [],
//     description: "Pricing information & payment methods",
//   },
//     {
//       id: "category",
//       label: "Category Details",
//       icon: Layers,
//       required: [],
//       description: "Category-specific information",
//     },
//     { id: "features", label: "Features", icon: Star, required: [], description: "Amenities, facilities & highlights" },
    { id: "packages", label: "Packages", icon: Gift, required: [], description: "Service packages & offerings" },
    // {
    //   id: "policies",
    //   label: "Policies & FAQs",
    //   icon: FileText,
    //   required: [],
    //   description: "Business policies & common questions",
    // },
    // {
    //   id: "social",
    //   label: "Social & SEO",
    //   icon: Globe,
    //   required: [],
    //   description: "Social media links & SEO settings",
    // },
  ];

  useEffect(() => {
    if (profile) {
      const initialData = initializeFormData(profile);
      setFormData(initialData);
      setOriginalData(JSON.parse(JSON.stringify(initialData)));
      setExistingImages(vendor.images || []);
    }
  }, [profile, initializeFormData]);

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => {
        if (file instanceof File) {
          const url = URL.createObjectURL(file);
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [uploadedFiles]);

  useEffect(() => {
    if (originalData && formData) {
      const currentJson = JSON.stringify({ ...formData, images: existingImages });
      const originalJson = JSON.stringify({ ...originalData, images: vendor?.images || [] });
      setHasChanges(currentJson !== originalJson || uploadedFiles.length > 0);
    }
  }, [formData, existingImages, uploadedFiles, originalData, vendor]);

  useEffect(() => {
    const progress = {};
    sections.forEach((section) => {
      let filled = 0;
      let total = 0;

      if (section.id === "basic") {
        total = 6;
        if (formData.name) filled++;
        if (formData.username) filled++;
        if (formData.email) filled++;
        if (formData.phoneNo) filled++;
        if (formData.contactPerson?.firstName) filled++;
        if (formData.availabilityStatus) filled++;
      } else if (section.id === "location") {
        total = 4;
        if (formData.address?.street) filled++;
        if (formData.address?.city) filled++;
        if (formData.address?.state) filled++;
        if (formData.address?.googleMapUrl) filled++;
      } else if (section.id === "media") {
        total = 3;
        if (existingImages.length > 0 || uploadedFiles.length > 0) filled++;
        if (formData.description) filled++;
        if (formData.shortDescription) filled++;
      } else if (section.id === "pricing") {
        total = 3;
        if (formData.basePrice) filled++;
        if (formData.priceUnit) filled++;
        if (formData.paymentMethods?.length > 0) filled++;
      } else if (section.id === "features") {
        total = 3;
        if (formData.amenities?.length > 0) filled++;
        if (formData.facilities?.length > 0) filled++;
        if (formData.highlightPoints?.length > 0) filled++;
      } else if (section.id === "packages") {
        total = 1;
        if (formData.packages?.length > 0) filled++;
      } else if (section.id === "policies") {
        total = 2;
        if (formData.policies?.length > 0) filled++;
        if (formData.faqs?.length > 0) filled++;
      } else if (section.id === "social") {
        total = 2;
        if (Object.values(formData.socialLinks || {}).some((v) => v)) filled++;
        if (formData.metaTitle || formData.metaDescription) filled++;
      } else if (section.id === "stats") {
        total = 3;
        if (formData.rating) filled++;
        if (formData.operatingHours?.length > 0) filled++;
        if (formData.eventTypes?.length > 0) filled++;
      } else if (section.id === "category") {
        total = 1;
        if (Object.keys(formData.categoryData || {}).length > 0) filled++;
      }

      progress[section.id] = total > 0 ? Math.round((filled / total) * 100) : 0;
    });
    setSectionProgress(progress);
  }, [formData, existingImages, uploadedFiles]);

  const scrollToFormTop = useCallback(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const markFieldTouched = useCallback((field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  }, []);

  const resetSection = useCallback(
    (sectionId) => {
      if (!originalData) return;

      const sectionFields = {
        basic: [
          "name",
          "username",
          "email",
          "phoneNo",
          "whatsappNo",
          "contactPerson",
          "availabilityStatus",
          "isVerified",
          "isFeatured",
          "isActive",
          "tags",
        ],
        location: ["address", "landmarks", "directions"],
        media: ["description", "shortDescription", "videoUrl"],
        stats: [
          "yearsExperience",
          "bookings",
          "rating",
          "reviews",
          "responseTime",
          "repeatCustomerRate",
          "responseRate",
          "stats",
          "highlights",
          "operatingHours",
          "eventTypes",
        ],
        pricing: ["basePrice", "priceUnit", "perDayPrice", "paymentMethods"],
        category: ["categoryData"],
        features: ["amenities", "facilities", "highlightPoints", "awards", "specialOffers"],
        packages: ["packages"],
        policies: ["policies", "faqs"],
        social: ["socialLinks", "metaTitle", "metaDescription", "metaKeywords"],
      };

      const fieldsToReset = sectionFields[sectionId] || [];
      setFormData((prev) => {
        const updated = { ...prev };
        fieldsToReset.forEach((field) => {
          updated[field] = JSON.parse(
            JSON.stringify(originalData[field] || (Array.isArray(originalData[field]) ? [] : {})),
          );
        });
        return updated;
      });

      if (sectionId === "media") {
        setExistingImages(vendor?.images || []);
        setUploadedFiles([]);
      }

      const sectionName = sections.find((s) => s.id === sectionId)?.label || "Section";
      addToast(`${sectionName} has been reset`, "info");
    },
    [originalData, vendor, addToast],
  );

  const handleInputChange = useCallback(
    (field, value, isNested = false, nestedField = "") => {
      setFormData((prev) => {
        if (isNested) {
          return { ...prev, [field]: { ...(prev[field] || {}), [nestedField]: value } };
        }
        return { ...prev, [field]: value };
      });
      const errorKey = isNested ? `${field}.${nestedField}` : field;
      if (errors[errorKey]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    },
    [errors],
  );

  const handleCategoryDataChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      categoryData: { ...prev.categoryData, [field]: value },
    }));
  }, []);

  const handleNestedCategoryDataChange = useCallback((field, nestedField, value) => {
    setFormData((prev) => ({
      ...prev,
      categoryData: {
        ...prev.categoryData,
        [field]: { ...(prev.categoryData[field] || {}), [nestedField]: value },
      },
    }));
  }, []);

  const handleListChange = useCallback((field, updatedList) => {
    setFormData((prev) => ({ ...prev, [field]: updatedList }));
  }, []);

  const handleFileUpload = useCallback(
    (files) => {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter((file) => {
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
      });

      const skipped = fileArray.length - validFiles.length;
      if (skipped > 0) {
        addToast(`${skipped} file(s) skipped (invalid type or exceeds 5MB)`, "warning");
      }

      if (validFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...validFiles]);
        addToast(`${validFiles.length} image(s) added successfully`, "success");
        if (errors.images) setErrors((prev) => ({ ...prev, images: null }));
      }
    },
    [errors.images, addToast],
  );

  const removeFile = useCallback(
    (index) => {
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
      addToast("Image removed from gallery", "info");
    },
    [addToast],
  );

  const removeExistingImage = useCallback(
    (index) => {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      addToast("Image removed from gallery", "info");
    },
    [addToast],
  );

  const setAsCover = useCallback(
    (index, isExisting = true) => {
      if (isExisting) {
        if (index === 0) {
          addToast("This image is already the cover", "info");
          return;
        }
        setExistingImages((prev) => {
          const newImages = [...prev];
          const [selected] = newImages.splice(index, 1);
          return [selected, ...newImages];
        });
      } else {
        if (existingImages.length === 0 && index === 0) {
          addToast("This image is already the cover", "info");
          return;
        }
        setUploadedFiles((prev) => {
          const newFiles = [...prev];
          const [selected] = newFiles.splice(index, 1);
          return [selected, ...newFiles];
        });
      }
      addToast("Cover image updated successfully", "success");
    },
    [existingImages.length, addToast],
  );

  const moveImage = useCallback((index, direction, isExisting = true) => {
    const setter = isExisting ? setExistingImages : setUploadedFiles;
    setter((prev) => {
      const newArr = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= newArr.length) return prev;
      [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
      return newArr;
    });
  }, []);

  const getErrorsForSection = useCallback(
    (sectionId) => {
      const sectionErrorMap = {
        basic: ["name", "email", "phoneNo"],
        location: ["address.city"],
        media: ["images"],
        pricing: ["basePrice"],
      };
      const fields = sectionErrorMap[sectionId] || [];
      return fields.filter((f) => errors[f]);
    },
    [errors],
  );

  const uploadImagesToImageKit = async (files) => {
    const authRes = await fetch("/api/imagekit/auth");
    const authData = await authRes.json();
    const folderPath = `/vendor/${formData.username || formData.name || formData.phoneNo || "unknown--edit-vendor"}`;
    const uploadPromises = files.map((file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
      data.append("signature", authData.signature);
      data.append("expire", authData.expire);
      data.append("token", authData.token);
      data.append(
        "fileName",
        `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${file.name.split(".").pop()}`,
      );
      data.append("folder", folderPath);
      return fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: data,
      }).then((res) => res.json());
    });

    const results = await Promise.all(uploadPromises);
    return results.filter((r) => r.url).map((data) => data.url);
  };

 const handleSubmit = useCallback(async () => {

  if (!user?.id) {
    addToast("You must be signed in to submit", "error");
    return;
  }

  setIsSubmitting(true);

  try {
    let newImageUrls = [];
    if (uploadedFiles.length > 0) {
      addToast(`Uploading ${uploadedFiles.length} image(s) to cloud...`, "info");
      newImageUrls = await uploadImagesToImageKit(uploadedFiles);
    }

    const allImages = [...existingImages, ...newImageUrls];

    // Create profileData object from vendorProfile
    const profileData = formData.vendorProfile ? {
      category: formData.category,
      vendorBusinessName: formData.name,
      username: formData.username,
      email: formData.email,
      phoneNo: formData.phoneNo,
      location: {
        address: formData.address?.street,
        city: formData.address?.city,
        state: formData.address?.state,
        zipCode: formData.address?.postalCode,
        country: formData.address?.country || "India",
        coordinates: {
          lat: formData.address?.location?.coordinates?.[1] || 0,
          lng: formData.address?.location?.coordinates?.[0] || 0,
        },
      },
    } : null;

    const payload = {
      vendorProfileId: profile._id,
      username: profile.username,
      packages: formData.packages || [],
    };

    const response = await fetch("/api/vendor/upsert", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update vendor");
    }

    addToast("🎉 Vendor updated successfully!", "success", 5000);
    setHasChanges(false);

    setTimeout(() => {
      onSuccess?.();
      onClose?.();
    }, 1500);
  } catch (error) {
    console.error("Submit error:", error);
    addToast(error.message || "Something went wrong. Please try again.", "error");
  } finally {
    setIsSubmitting(false);
  }
}, [getErrorsForSection, addToast, scrollToFormTop, user, uploadedFiles, existingImages, formData, vendor._id, onSuccess, onClose]);

  const navigateSection = useCallback(
    (direction) => {
      const currentIndex = sections.findIndex((s) => s.id === activeSection);
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < sections.length) {
        setActiveSection(sections[newIndex].id);
        scrollToFormTop();
      }
    },
    [activeSection, scrollToFormTop],
  );

  const handleClose = useCallback(() => {
    if (hasChanges) {
      setShowUnsavedWarning(true);
    } else {
      onClose?.();
    }
  }, [hasChanges, onClose]);

  const currentSectionIndex = sections.findIndex((s) => s.id === activeSection);
  const overallProgress = Math.round(Object.values(sectionProgress).reduce((a, b) => a + b, 0) / sections.length);
  const requiredFieldsComplete = true; // Always allow saving

  if (!profile || !formData.username) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center"
      >
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl">
          <RefreshCw className="animate-spin text-indigo-500 mx-auto mb-3" size={32} />
          <p className="text-gray-500">Loading vendor data...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm overflow-hidden"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-2 sm:inset-4 md:inset-8 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-3 sm:p-4 md:p-6 flex-shrink-0">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl overflow-hidden border-2 border-white/30 bg-white/20 flex-shrink-0">
                <img
                  src={profile.vendorAvatar || existingImages[0] || "/placeholder-vendor.jpg"}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-white min-w-0 flex-1">
                <h1 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2 flex-wrap truncate">
                  {formData.name}
                  {hasChanges && (
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-amber-400 text-amber-900 text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap">
                      Unsaved
                    </span>
                  )}
                </h1>
                <p className="text-white/70 text-xs sm:text-sm mt-0.5 capitalize truncate">
                  {formData.category} • {formData.address?.city || "No city"}
                </p>
                {/* <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden max-w-[150px] sm:max-w-[200px]">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-white/90 whitespace-nowrap">{overallProgress}%</span>
                </div> */}
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 sm:p-2.5 hover:bg-white/20 rounded-lg sm:rounded-xl transition-colors text-white flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex p-2 gap-1 min-w-max">
            {sections.map((section, index) => {
              const progress = sectionProgress[section.id] || 0;
              const sectionErrors = getErrorsForSection(section.id);
              const hasError = sectionErrors.length > 0;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(section.id);
                    scrollToFormTop();
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg"
                      : hasError
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <section.icon size={14} />
                  <span className="hidden sm:inline">{section.label}</span>
                  <span className="sm:hidden">{index + 1}</span>
                  {!isActive && (
                    <>
                      {progress === 100 && !hasError && <CheckCircle size={10} className="text-green-500" />}
                      {hasError && <AlertCircle size={10} className="text-red-500" />}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigateSection(-1)}
              disabled={currentSectionIndex === 0}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-xs sm:text-sm">
              <span className="text-gray-500 font-medium">
                {currentSectionIndex + 1}/{sections.length}
              </span>
              <span className="text-gray-700 dark:text-gray-300 font-semibold ml-1 sm:ml-2 hidden sm:inline">
                {sections[currentSectionIndex]?.label}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigateSection(1)}
              disabled={currentSectionIndex === sections.length - 1}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => resetSection(activeSection)}
            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all font-medium"
          >
            <Undo2 size={10} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        <div ref={formContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* {activeSection === "basic" && (
                <BasicInfoSection
                  data={formData}
                  onChange={handleInputChange}
                  onListChange={handleListChange}
                  errors={errors}
                  options={fieldOptions}
                  onBlur={markFieldTouched}
                  touchedFields={touchedFields}
                  addToast={addToast}
                />
              )}
              {activeSection === "location" && (
                <LocationSection
                  data={formData}
                  onChange={handleInputChange}
                  onListChange={handleListChange}
                  errors={errors}
                  options={fieldOptions}
                  addToast={addToast}
                />
              )}
              {activeSection === "media" && (
                <MediaSection
                  data={formData}
                  onChange={handleInputChange}
                  existingImages={existingImages}
                  uploadedFiles={uploadedFiles}
                  onFileUpload={handleFileUpload}
                  onRemoveFile={removeFile}
                  onRemoveExisting={removeExistingImage}
                  onSetCover={setAsCover}
                  onMoveImage={moveImage}
                  onPreview={setPreviewImage}
                  dragActive={dragActive}
                  setDragActive={setDragActive}
                  errors={errors}
                  addToast={addToast}
                />
              )}
              {activeSection === "stats" && (
                <StatsSection
                  data={formData}
                  onChange={handleInputChange}
                  onListChange={handleListChange}
                  options={fieldOptions}
                  addToast={addToast}
                />
              )}
              {activeSection === "pricing" && (
                <PricingSection
                  data={formData}
                  onChange={handleInputChange}
                  onListChange={handleListChange}
                  errors={errors}
                  options={fieldOptions}
                  addToast={addToast}
                />
              )}
              {activeSection === "category" && (
                <CategorySpecificFields
                  category={formData.category}
                  data={formData.categoryData || {}}
                  onChange={handleCategoryDataChange}
                  onNestedChange={handleNestedCategoryDataChange}
                  options={fieldOptions}
                  errors={errors}
                  categories={categories}
                  addToast={addToast}
                />
              )}
              {activeSection === "features" && (
                <FeaturesSection
                  data={formData}
                  onListChange={handleListChange}
                  options={fieldOptions}
                  addToast={addToast}
                />
              )} */}
              {activeSection === "packages" && (
                <PackagesSection
                  packages={formData.packages || []}
                  onChange={(v) => handleListChange("packages", v)}
                  addToast={addToast}
                />
              )}
              {/* {activeSection === "policies" && (
                <PoliciesSection data={formData} onListChange={handleListChange} addToast={addToast} />
              )}
              {activeSection === "social" && (
                <SocialSection
                  data={formData}
                  onChange={handleInputChange}
                  onListChange={handleListChange}
                  addToast={addToast}
                />
              )} */}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={() => navigateSection(-1)}
            disabled={currentSectionIndex === 0}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {sections.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setActiveSection(sections[index].id);
                  scrollToFormTop();
                }}
                className={`rounded-full transition-all ${index === currentSectionIndex ? "bg-indigo-600 w-5 sm:w-6 h-2" : "bg-gray-300 dark:bg-gray-600 w-2 h-2"}`}
              />
            ))}
          </div>

          {currentSectionIndex === sections.length - 1 ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !hasChanges}
              className="flex items-center gap-1.5 px-3 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg disabled:opacity-50 transition-all shadow-lg"
            >
              {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span className="hidden sm:inline">{isSubmitting ? "Saving..." : "Save"}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigateSection(1)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-lg"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {hasChanges && !isSubmitting && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-3 sm:px-6 py-2 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-2 sm:gap-4 max-w-[90%] sm:max-w-lg"
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                  <Bell size={14} className="text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  Unsaved changes
                </p>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-3 sm:px-5 py-1.5 sm:py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs sm:text-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5 shadow-lg transition-all whitespace-nowrap"
              >
                <Save size={14} />
                Save
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {previewImage && <ImagePreviewModal image={previewImage} onClose={() => setPreviewImage(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showUnsavedWarning && (
          <UnsavedChangesModal
            onDiscard={() => {
              setShowUnsavedWarning(false);
              onClose?.();
            }}
            onCancel={() => setShowUnsavedWarning(false)}
            onSave={() => {
              setShowUnsavedWarning(false);
              handleSubmit();
            }}
          />
        )}
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
    </motion.div>
  );
}

const Section = ({ title, icon: Icon, children, description, badge, tip }) => (
  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
    <div className="flex items-start justify-between gap-2 sm:gap-3 pb-2 sm:pb-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="p-1.5 sm:p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg sm:rounded-xl flex-shrink-0">
          <Icon size={16} className="text-indigo-600 dark:text-indigo-400 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">{title}</h3>
          {description && <p className="text-xs sm:text-sm text-gray-500 mt-0.5 line-clamp-1">{description}</p>}
        </div>
      </div>
      {badge && (
        <span className="px-2 sm:px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] sm:text-xs font-semibold rounded-full flex-shrink-0 whitespace-nowrap">
          {badge}
        </span>
      )}
    </div>
    {tip && (
      <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg sm:rounded-xl border border-amber-200 dark:border-amber-800">
        <Lightbulb size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200">{tip}</p>
      </div>
    )}
    {children}
  </div>
);

const InputField = ({
  label,
  error,
  className = "",
  helperText,
  prefix,
  suffix,
  icon: Icon,
  copyable,
  required,
  onBlur,
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCopy = () => {
    if (props.value) {
      navigator.clipboard.writeText(props.value);
      setCopied(true);
      addToast("Copied!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`w-full min-w-0 ${className}`}>
      {label && (
        <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={14}
            className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        )}
        {prefix && (
          <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-xs sm:text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          className={`w-full px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm ${Icon ? "pl-8 sm:pl-10" : prefix ? "pl-6 sm:pl-8" : ""} ${suffix || copyable ? "pr-8 sm:pr-10" : ""} ${error ? "border-red-400 bg-red-50 dark:bg-red-900/10" : "border-gray-200 dark:border-gray-600"}`}
          onBlur={onBlur}
          {...props}
        />
        {suffix && (
          <span className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm pointer-events-none">
            {suffix}
          </span>
        )}
        {copyable && props.value && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        )}
      </div>
      {helperText && !error && <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-1.5">{helperText}</p>}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-[10px] sm:text-xs mt-1 sm:mt-1.5 flex items-center gap-1"
        >
          <AlertCircle size={10} />
          {error}
        </motion.p>
      )}
    </div>
  );
};

const TextArea = ({ label, error, className = "", helperText, maxLength, required, ...props }) => (
  <div className={`w-full min-w-0 ${className}`}>
    {label && (
      <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      className={`w-full px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm resize-none ${error ? "border-red-400 bg-red-50 dark:bg-red-900/10" : "border-gray-200 dark:border-gray-600"}`}
      maxLength={maxLength}
      {...props}
    />
    <div className="flex justify-between mt-1 sm:mt-1.5">
      {helperText && !error && <p className="text-[10px] sm:text-xs text-gray-500">{helperText}</p>}
      {maxLength && (
        <p
          className={`text-[10px] sm:text-xs ml-auto ${(props.value?.length || 0) > maxLength * 0.9 ? "text-orange-500 font-medium" : "text-gray-400"}`}
        >
          {props.value?.length || 0}/{maxLength}
        </p>
      )}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1"
      >
        <AlertCircle size={10} />
        {error}
      </motion.p>
    )}
  </div>
);

const CheckboxField = ({ label, checked, onChange, description }) => (
  <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
    <div
      className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 rounded-md sm:rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${checked ? "bg-indigo-600 border-indigo-600" : "border-gray-300 dark:border-gray-600 group-hover:border-indigo-400"}`}
    >
      {checked && <Check size={10} className="text-white sm:w-3 sm:h-3" />}
    </div>
    <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
    <div className="min-w-0">
      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {description && <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
  </label>
);

const CustomSelect = ({ label, options, value, onChange, error, required, placeholder = "Select...", allowCustom }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const { addToast } = useToast();

  const isCurrentValueCustom = value && !options.includes(value) && typeof value === "string";

  return (
    <div className="w-full min-w-0">
      {label && (
        <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {isCustom || isCurrentValueCustom ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={isCurrentValueCustom ? value : customValue}
            onChange={(e) => {
              setCustomValue(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Enter custom value..."
            className={`flex-1 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm ${error ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}
          />
          <button
            type="button"
            onClick={() => {
              setIsCustom(false);
              setCustomValue("");
              onChange("");
              addToast("Switched to predefined options", "info");
            }}
            className="px-2.5 sm:px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`flex-1 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm ${error ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}
          >
            <option value="">{placeholder}</option>
            {options.map((o) => (
              <option key={typeof o === "object" ? o.key : o} value={typeof o === "object" ? o.key : o}>
                {typeof o === "object" ? o.label : o}
              </option>
            ))}
          </select>
          {allowCustom && (
            <button
              type="button"
              onClick={() => {
                setIsCustom(true);
                addToast("You can now enter a custom value", "info");
              }}
              className="px-2.5 sm:px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm flex items-center gap-1"
            >
              <Plus size={12} />
            </button>
          )}
        </div>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-[10px] sm:text-xs mt-1 sm:mt-1.5 flex items-center gap-1"
        >
          <AlertCircle size={10} />
          {error}
        </motion.p>
      )}
    </div>
  );
};

const MultiSelectWithCustom = ({ label, options, value = [], onChange, maxSelections }) => {
  const [customInput, setCustomInput] = useState("");
  const { addToast } = useToast();
  const selectedCount = value.length;

  const addCustom = () => {
    if (customInput.trim() && !value.includes(customInput.trim())) {
      if (!maxSelections || value.length < maxSelections) {
        onChange([...value, customInput.trim()]);
        setCustomInput("");
        addToast(`"${customInput.trim()}" added`, "success");
      } else {
        addToast(`Maximum ${maxSelections} selections allowed`, "warning");
      }
    }
  };

  return (
    <div className="w-full min-w-0">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
          {selectedCount} {maxSelections && `/ ${maxSelections}`}
        </span>
      </div>

      <div className="flex gap-2 mb-2 sm:mb-3">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="Type & press Enter..."
          className="flex-1 px-2.5 sm:px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-800 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!customInput.trim() || (maxSelections && value.length >= maxSelections)}
          className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg sm:rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[250px] sm:max-h-[300px] overflow-y-auto p-1">
        {[...new Set([...options, ...value.filter((v) => !options.includes(v))])].map((opt) => {
          const isSelected = value.includes(opt);
          const isCustom = !options.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onChange(value.filter((v) => v !== opt));
                } else if (!maxSelections || value.length < maxSelections) {
                  onChange([...value, opt]);
                }
              }}
              disabled={!isSelected && maxSelections && value.length >= maxSelections}
              className={`px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium border-2 transition-all text-left flex items-center gap-1.5 sm:gap-2 disabled:opacity-50 ${isSelected ? "bg-indigo-600 text-white border-indigo-600 shadow-lg" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"}`}
            >
              <div
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-white border-white" : "border-gray-300 dark:border-gray-600"}`}
              >
                {isSelected && <Check size={8} className="text-indigo-600" />}
              </div>
              <span className="truncate flex-1">{opt}</span>
              {isCustom && <span className="text-[8px] opacity-70 bg-white/20 px-1 rounded">custom</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const TagInput = ({ label, tags = [], onChange, suggestions = [], placeholder, allowCustom = true }) => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { addToast } = useToast();

  const add = (val) => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      addToast(`"${trimmed}" added`, "success");
    }
    setInput("");
  };

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s),
  );

  return (
    <div className="w-full min-w-0">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-[10px] sm:text-xs text-gray-500 font-medium">{tags.length} items</span>
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2 p-2 sm:p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 min-h-[48px]">
        <AnimatePresence>
          {tags.map((t, i) => (
            <motion.span
              key={`${t}-${i}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium flex items-center gap-1.5 group max-w-[140px] sm:max-w-[180px] ${suggestions.includes(t) ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"}`}
            >
              <span className="truncate">{t}</span>
              {!suggestions.includes(t) && (
                <span className="text-[8px] opacity-60 bg-white/30 px-1 rounded">custom</span>
              )}
              <button
                type="button"
                onClick={() => {
                  onChange(tags.filter((x) => x !== t));
                  addToast(`"${t}" removed`, "info");
                }}
                className="hover:text-red-500 transition-colors flex-shrink-0"
              >
                <X size={10} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <div className="relative flex-1 min-w-[120px]">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (allowCustom || filteredSuggestions.includes(input)) {
                  add(input);
                }
              } else if (e.key === "Backspace" && !input && tags.length > 0) {
                const removed = tags[tags.length - 1];
                onChange(tags.slice(0, -1));
                addToast(`"${removed}" removed`, "info");
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={tags.length === 0 ? placeholder : "Type..."}
            className="w-full outline-none bg-transparent text-xs sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
          <AnimatePresence>
            {showSuggestions && input && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl shadow-xl max-h-32 sm:max-h-40 overflow-auto z-20"
              >
                {filteredSuggestions.slice(0, 8).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      add(s);
                      setShowSuggestions(false);
                    }}
                    className="w-full px-2.5 sm:px-3 py-2 text-left text-xs sm:text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors"
                  >
                    <Plus size={10} className="text-gray-400" />
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {allowCustom && (
        <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-1.5 flex items-center gap-1">
          <Lightbulb size={9} />
          Type and press Enter
        </p>
      )}
    </div>
  );
};

const ListInput = ({ label, items = [], onChange, placeholder }) => {
  const [input, setInput] = useState("");
  const { addToast } = useToast();

  const add = () => {
    if (input.trim()) {
      onChange([...items, input.trim()]);
      setInput("");
      addToast("Item added", "success");
    }
  };

  return (
    <div className="w-full min-w-0">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-[10px] sm:text-xs text-gray-500 font-medium">{items.length} items</span>
      </div>
      {items.length > 0 && (
        <ul className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Grip size={12} className="text-gray-400 cursor-move flex-shrink-0" />
                <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                <span className="flex-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">{item}</span>
                <button
                  type="button"
                  onClick={() => {
                    onChange(items.filter((_, idx) => idx !== i));
                    addToast("Item removed", "info");
                  }}
                  className="p-1 sm:p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 flex-shrink-0"
                >
                  <Trash2 size={12} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-0 px-2.5 sm:px-3 py-2 sm:py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          className="px-3 sm:px-4 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg sm:rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 sm:gap-2 font-medium flex-shrink-0"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>
    </div>
  );
};

const DynamicList = ({ title, items = [], fields, onChange, emptyMessage, maxItems }) => {
  const { addToast } = useToast();

  const add = () => {
    if (maxItems && items.length >= maxItems) {
      addToast(`Maximum ${maxItems} items allowed`, "warning");
      return;
    }
    const newItem = fields.reduce((acc, f) => ({ ...acc, [f.key]: f.default || "" }), {});
    onChange([...items, newItem]);
    addToast("New item added", "success");
  };

  const update = (idx, key, val) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [key]: val };
    onChange(updated);
  };

  const remove = (idx) => {
    onChange(items.filter((_, i) => i !== idx));
    addToast("Item removed", "info");
  };

  const move = (idx, direction) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= items.length) return;
    const updated = [...items];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    onChange(updated);
  };

  return (
    <div className="w-full min-w-0">
      {title && (
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{title}</h4>
          <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
            {items.length} {maxItems ? `/ ${maxItems}` : ""} items
          </span>
        </div>
      )}
      {items.length === 0 && emptyMessage && (
        <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 italic text-center py-4 sm:py-6 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          {emptyMessage}
        </p>
      )}
      <div className="space-y-2">
        <AnimatePresence>
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-2 items-start p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl group border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all"
            >
              <div className="flex flex-col gap-1 pt-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="p-0.5 sm:p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <ArrowUp size={10} />
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  disabled={idx === items.length - 1}
                  className="p-0.5 sm:p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <ArrowDown size={10} />
                </button>
              </div>
              <div className="flex-1 grid grid-cols-1 gap-2 min-w-0">
                {fields.map((f) =>
                  f.options ? (
                    <select
                      key={f.key}
                      value={item[f.key] || ""}
                      onChange={(e) => update(idx, f.key, e.target.value)}
                      className="px-2.5 sm:px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-full transition-all"
                    >
                      <option value="">{f.placeholder}</option>
                      {f.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea
                      key={f.key}
                      placeholder={f.placeholder}
                      value={item[f.key] || ""}
                      onChange={(e) => update(idx, f.key, e.target.value)}
                      rows={2}
                      className="px-2.5 sm:px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-full transition-all"
                    />
                  ) : (
                    <input
                      key={f.key}
                      type={f.type || "text"}
                      placeholder={f.placeholder}
                      value={item[f.key] || ""}
                      onChange={(e) => update(idx, f.key, e.target.value)}
                      className="px-2.5 sm:px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-full transition-all"
                    />
                  ),
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg sm:rounded-xl transition-colors flex-shrink-0"
              >
                <Trash2 size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={add}
        disabled={maxItems && items.length >= maxItems}
        className="mt-2 sm:mt-3 w-full py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg sm:rounded-xl transition-colors flex items-center gap-1.5 sm:gap-2 justify-center border-2 border-dashed border-indigo-300 dark:border-indigo-700 disabled:opacity-50"
      >
        <Plus size={14} />
        Add Item
      </button>
    </div>
  );
};

const RangeField = ({ label, value = {}, onChange }) => (
  <div className="w-full min-w-0">
    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <div className="flex items-center gap-2 sm:gap-3">
      <input
        type="number"
        placeholder="Min"
        value={value.min || ""}
        onChange={(e) => onChange({ ...value, min: e.target.value })}
        className="flex-1 min-w-0 px-2.5 sm:px-3 py-2 sm:py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 text-xs sm:text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
      />
      <span className="text-gray-400 font-medium flex-shrink-0 text-xs sm:text-sm">to</span>
      <input
        type="number"
        placeholder="Max"
        value={value.max || ""}
        onChange={(e) => onChange({ ...value, max: e.target.value })}
        className="flex-1 min-w-0 px-2.5 sm:px-3 py-2 sm:py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 text-xs sm:text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
      />
    </div>
  </div>
);

const BasicInfoSection = ({ data, onChange, onListChange, errors, options, onBlur, touchedFields, addToast }) => (
  <div className="space-y-6 sm:space-y-8">
    <Section
      title="Business Identity"
      icon={Building}
      description="Core business information"
      tip="These details will be displayed publicly on your vendor profile. Make sure they're accurate and professional."
    >
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <InputField
          label="Business Name"
          value={data.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
          onBlur={() => onBlur?.("name")}
          error={errors.name}
          placeholder="e.g., Royal Palace Banquets"
        />
        <InputField
          label="Username (URL Slug)"
          value={data.username || ""}
          onChange={(e) => {
            const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
            const formatted = cleaned.replace(/-+/g, "-").replace(/^-|-$/g, "");
            onChange("username", formatted || "");
          }}
          placeholder="royal-palace-banquets"
          helperText="Used in URL"
          copyable
        />
        <InputField
          label="Email"
          type="email"
          value={data.email || ""}
          onChange={(e) => onChange("email", e.target.value)}
          error={errors.email}
          placeholder="contact@business.com"
          icon={Mail}
          copyable
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <InputField
            label="Phone"
            value={data.phoneNo || ""}
            onChange={(e) => onChange("phoneNo", e.target.value)}
            error={errors.phoneNo}
            placeholder="+91 9876543210"
            icon={Phone}
          />
          <InputField
            label="WhatsApp"
            value={data.whatsappNo || ""}
            onChange={(e) => onChange("whatsappNo", e.target.value)}
            placeholder="+91 9876543210"
            icon={Phone}
          />
        </div>
      </div>
    </Section>

    <Section title="Contact Person" icon={User} description="Person responsible">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <InputField
          label="First Name"
          value={data.contactPerson?.firstName || ""}
          onChange={(e) => onChange("contactPerson", e.target.value, true, "firstName")}
          placeholder="John"
        />
        <InputField
          label="Last Name"
          value={data.contactPerson?.lastName || ""}
          onChange={(e) => onChange("contactPerson", e.target.value, true, "lastName")}
          placeholder="Doe"
        />
      </div>
    </Section>

    <Section title="Status & Visibility" icon={Eye}>
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <CustomSelect
          label="Availability Status"
          options={options.availability}
          value={data.availabilityStatus || ""}
          onChange={(val) => onChange("availabilityStatus", val)}
          placeholder="Select status..."
          allowCustom
        />
        <InputField
          label="Subcategory"
          value={data.subcategory || ""}
          onChange={(e) => onChange("subcategory", e.target.value)}
          placeholder="e.g., Luxury Venues"
          helperText="Optional subcategory"
        />
        <div className="space-y-3 sm:space-y-4">
          <CheckboxField
            label="Verified Vendor"
            checked={data.isVerified || false}
            onChange={(e) => onChange("isVerified", e.target.checked)}
            description="Display verified badge"
          />
          <CheckboxField
            label="Featured Listing"
            checked={data.isFeatured || false}
            onChange={(e) => onChange("isFeatured", e.target.checked)}
            description="Show in featured"
          />
          <CheckboxField
            label="Active Listing"
            checked={data.isActive !== false}
            onChange={(e) => onChange("isActive", e.target.checked)}
            description="Make visible"
          />
        </div>
      </div>
    </Section>

    <TagInput
      label="Tags"
      tags={data.tags || []}
      onChange={(v) => onListChange("tags", v)}
      suggestions={[
        "Popular",
        "Featured",
        "Luxury",
        "Budget-Friendly",
        "New",
        "Top Rated",
        "Premium",
        "Trending",
        "Eco-Friendly",
      ]}
      placeholder="Add tags..."
    />
  </div>
);

const LocationSection = ({ data, onChange, onListChange, errors, options, addToast }) => (
  <div className="space-y-6 sm:space-y-8">
    <Section
      title="Address Details"
      icon={MapPin}
      tip="Accurate location helps customers find you easily."
    >
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <InputField
          label="Street Address"
          value={data.address?.street || ""}
          onChange={(e) => onChange("address", e.target.value, true, "street")}
          placeholder="123 Wedding Lane"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <CustomSelect
            label="City"
            options={options.cities}
            value={data.address?.city || ""}
            onChange={(val) => onChange("address", val, true, "city")}
            error={errors["address.city"]}
            allowCustom
          />
          <InputField
            label="State"
            value={data.address?.state || ""}
            onChange={(e) => onChange("address", e.target.value, true, "state")}
            placeholder="Maharashtra"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <InputField
            label="Postal Code"
            value={data.address?.postalCode || ""}
            onChange={(e) => onChange("address", e.target.value, true, "postalCode")}
            placeholder="400001"
          />
          <InputField
            label="Country"
            value={data.address?.country || "India"}
            onChange={(e) => onChange("address", e.target.value, true, "country")}
            placeholder="India"
          />
        </div>
      </div>
    </Section>

    <Section title="Map Integration" icon={MapIcon}>
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <InputField
          label="Google Maps URL"
          value={data.address?.googleMapUrl || ""}
          onChange={(e) => onChange("address", e.target.value, true, "googleMapUrl")}
          placeholder="https://maps.google.com/..."
          icon={Navigation}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <InputField
            label="Latitude"
            type="number"
            step="any"
            value={data.address?.location?.coordinates?.[1] || ""}
            placeholder="19.0760"
            onChange={(e) => {
              const coords = [...(data.address?.location?.coordinates || [0, 0])];
              coords[1] = parseFloat(e.target.value) || 0;
              onChange("address", { type: "Point", coordinates: coords }, true, "location");
            }}
          />
          <InputField
            label="Longitude"
            type="number"
            step="any"
            value={data.address?.location?.coordinates?.[0] || ""}
            placeholder="72.8777"
            onChange={(e) => {
              const coords = [...(data.address?.location?.coordinates || [0, 0])];
              coords[0] = parseFloat(e.target.value) || 0;
              onChange("address", { type: "Point", coordinates: coords }, true, "location");
            }}
          />
        </div>
      </div>
    </Section>

    <DynamicList
      title="Nearby Landmarks"
      items={data.landmarks || []}
      fields={[
        { key: "name", placeholder: "Landmark Name" },
        { key: "distance", placeholder: "Distance" },
        { key: "type", placeholder: "Type" },
      ]}
      onChange={(list) => onListChange("landmarks", list)}
      emptyMessage="Add landmarks"
      maxItems={10}
    />

    <DynamicList
      title="How to Reach"
      items={data.directions || []}
      fields={[
        { key: "type", placeholder: "Transport", options: options.directionTypes },
        { key: "description", placeholder: "Directions", type: "textarea" },
      ]}
      onChange={(list) => onListChange("directions", list)}
      emptyMessage="Add directions"
      maxItems={8}
    />
  </div>
);

const MediaSection = ({
  data,
  onChange,
  existingImages,
  uploadedFiles,
  onFileUpload,
  onRemoveFile,
  onRemoveExisting,
  onSetCover,
  onMoveImage,
  onPreview,
  dragActive,
  setDragActive,
  errors,
  addToast,
}) => {
  const totalImages = existingImages.length + uploadedFiles.length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <Section
        title="Descriptions"
        icon={FileText}
        tip="Compelling description helps customers understand your services."
      >
        <InputField
          label="Short Description"
          value={data.shortDescription || ""}
          onChange={(e) => onChange("shortDescription", e.target.value)}
          maxLength={200}
          placeholder="A brief tagline..."
          helperText={`${(data.shortDescription || "").length}/200`}
        />
        <TextArea
          label="Full Description"
          value={data.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Detailed description..."
          rows={6}
          className="mt-3 sm:mt-4"
          maxLength={5000}
        />
      </Section>

      <Section
        title="Gallery Images"
        icon={ImageIcon}
        description="First image is cover"
        badge={`${totalImages} images`}
        tip="High-quality images improve engagement. Upload at least 3-5 images."
      >
        {existingImages.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              Current Images ({existingImages.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {existingImages.map((img, i) => (
                <ImageThumbnail
                  key={`existing-${i}`}
                  src={img}
                  index={i}
                  isCover={i === 0}
                  isNew={false}
                  onPreview={() => onPreview(img)}
                  onRemove={() => onRemoveExisting(i)}
                  onSetCover={() => onSetCover(i, true)}
                  onMoveLeft={() => onMoveImage(i, -1, true)}
                  onMoveRight={() => onMoveImage(i, 1, true)}
                  canMoveLeft={i > 0}
                  canMoveRight={i < existingImages.length - 1}
                  totalImages={existingImages.length}
                />
              ))}
            </div>
          </div>
        )}

        <div
          className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center transition-all ${dragActive ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500" : errors.images ? "border-red-400 bg-red-50 dark:bg-red-900/10" : "border-gray-300 dark:border-gray-600"}`}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files) onFileUpload(e.dataTransfer.files);
          }}
        >
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl flex items-center justify-center ${errors.images ? "bg-red-100 dark:bg-red-900/30" : "bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30"}`}
          >
            <UploadCloud
              className={`w-8 h-8 sm:w-10 sm:h-10 ${errors.images ? "text-red-600" : "text-indigo-600 dark:text-indigo-400"}`}
            />
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1 text-sm sm:text-base">Drag & Drop images</p>
          <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">or click to browse</p>
          <label
            htmlFor="newImages"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg text-xs sm:text-sm"
          >
            <Camera size={16} />
            Browse Files
          </label>
          <input
            id="newImages"
            type="file"
            multiple
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => onFileUpload(e.target.files)}
          />
          <p className="text-[10px] sm:text-xs text-gray-400 mt-3 sm:mt-4">JPG, PNG, WEBP • Max 5MB</p>
        </div>

        {errors.images && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-xs sm:text-sm mt-2 flex items-center gap-1.5"
          >
            <AlertCircle size={12} />
            {errors.images}
          </motion.p>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-4 sm:mt-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                New Images ({uploadedFiles.length})
              </h4>
              <button
                type="button"
                onClick={() => {
                  uploadedFiles.forEach((_, i) => onRemoveFile(i));
                  addToast("All new images cleared", "info");
                }}
                className="text-[10px] sm:text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <Trash2 size={10} />
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {uploadedFiles.map((file, i) => (
                <ImageThumbnail
                  key={`new-${i}-${file.name}`}
                  src={URL.createObjectURL(file)}
                  index={i}
                  isCover={existingImages.length === 0 && i === 0}
                  isNew={true}
                  fileSize={file.size}
                  onPreview={() => onPreview(URL.createObjectURL(file))}
                  onRemove={() => onRemoveFile(i)}
                  onSetCover={() => onSetCover(i, false)}
                  onMoveLeft={() => onMoveImage(i, -1, false)}
                  onMoveRight={() => onMoveImage(i, 1, false)}
                  canMoveLeft={i > 0}
                  canMoveRight={i < uploadedFiles.length - 1}
                  totalImages={uploadedFiles.length}
                />
              ))}
            </div>
          </div>
        )}
      </Section>

      <Section title="Video" icon={Video}>
        <InputField
          label="Video URL (YouTube/Vimeo)"
          value={data.videoUrl || ""}
          onChange={(e) => onChange("videoUrl", e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          icon={Video}
          helperText="Paste YouTube or Vimeo link"
        />
        {data.videoUrl && (
          <div className="mt-3 sm:mt-4 aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl sm:rounded-2xl overflow-hidden">
            <iframe
              src={data.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
              className="w-full h-full"
              allowFullScreen
              title="Vendor Video"
            />
          </div>
        )}
      </Section>
    </div>
  );
};

const ImageThumbnail = ({
  src,
  index,
  isCover,
  isNew,
  fileSize,
  onPreview,
  onRemove,
  onSetCover,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight,
  totalImages,
}) => {
  const { addToast } = useToast();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg sm:rounded-xl overflow-hidden group border-2 border-transparent hover:border-indigo-400 transition-all shadow-sm hover:shadow-lg"
    >
      <div className="w-full h-full cursor-zoom-in" onClick={onPreview}>
        <img src={src} className="w-full h-full object-cover" alt={`Image ${index + 1}`} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 flex gap-1 sm:gap-1.5 z-10">
        <button
          type="button"
          onClick={onPreview}
          className="p-1 sm:p-1.5 bg-white/90 rounded-md sm:rounded-lg hover:bg-white transition-colors shadow-lg opacity-0 group-hover:opacity-100"
        >
          <ZoomIn size={12} className="text-gray-700" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 sm:p-1.5 bg-red-500 text-white rounded-md sm:rounded-lg hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
        >
          <X size={12} />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 flex items-center justify-between z-10">
        <div className="flex gap-0.5 sm:gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={onMoveLeft}
            disabled={!canMoveLeft}
            className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-all shadow-lg ${canMoveLeft ? "bg-white/90 hover:bg-white text-gray-700" : "bg-white/50 text-gray-400"}`}
          >
            <ChevronLeft size={10} />
          </button>
          <button
            type="button"
            onClick={onMoveRight}
            disabled={!canMoveRight}
            className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-all shadow-lg ${canMoveRight ? "bg-white/90 hover:bg-white text-gray-700" : "bg-white/50 text-gray-400"}`}
          >
            <ChevronRight size={10} />
          </button>
        </div>
        {!isCover && (
          <button
            type="button"
            onClick={onSetCover}
            className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/90 text-gray-700 text-[9px] sm:text-[10px] font-bold rounded-md sm:rounded-lg hover:bg-white shadow-lg opacity-0 group-hover:opacity-100"
          >
            Set Cover
          </button>
        )}
      </div>

      {isCover && (
        <span className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[9px] sm:text-[10px] font-bold rounded-md sm:rounded-lg shadow-lg z-10">
          Cover
        </span>
      )}

      {isNew && !isCover && (
        <span className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-500 text-white text-[9px] sm:text-[10px] font-bold rounded-md sm:rounded-lg group-hover:opacity-0 transition-opacity shadow-lg">
          New
        </span>
      )}

      {fileSize && (
        <span className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 px-1.5 sm:px-2 py-0.5 bg-black/60 text-white text-[8px] sm:text-[9px] rounded-md sm:rounded-lg group-hover:opacity-0 transition-opacity">
          {(fileSize / 1024 / 1024).toFixed(1)}MB
        </span>
      )}

      <span className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 px-1.5 sm:px-2 py-0.5 bg-black/60 text-white text-[8px] sm:text-[9px] rounded-md sm:rounded-lg group-hover:opacity-0 transition-opacity font-medium">
        {index + 1}/{totalImages}
      </span>
    </motion.div>
  );
};

const StatsSection = ({ data, onChange, onListChange, options, addToast }) => (
  <div className="space-y-6 sm:space-y-8">
    <Section title="Performance Metrics" icon={BarChart3}>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <InputField
          label="Years Experience"
          type="number"
          min="0"
          value={data.yearsExperience || ""}
          onChange={(e) => onChange("yearsExperience", parseInt(e.target.value) || 0)}
          placeholder="15"
          icon={Calendar}
        />
        <InputField
          label="Total Bookings"
          type="number"
          min="0"
          value={data.bookings || ""}
          onChange={(e) => onChange("bookings", parseInt(e.target.value) || 0)}
          placeholder="2500"
          icon={Users}
        />
        <InputField
          label="Rating (0-5)"
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={data.rating || ""}
          onChange={(e) => onChange("rating", Math.min(5, Math.max(0, parseFloat(e.target.value) || 0)))}
          placeholder="4.8"
          icon={Star}
        />
        <InputField
          label="Review Count"
          type="number"
          min="0"
          value={data.reviews || ""}
          onChange={(e) => onChange("reviews", parseInt(e.target.value) || 0)}
          placeholder="350"
          icon={MessageCircle}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
        <InputField
          label="Response Time"
          value={data.responseTime || ""}
          onChange={(e) => onChange("responseTime", e.target.value)}
          placeholder="Within 2 hours"
          icon={Clock}
        />
        <InputField
          label="Repeat Rate"
          value={data.repeatCustomerRate || ""}
          onChange={(e) => onChange("repeatCustomerRate", e.target.value)}
          placeholder="45%"
          icon={Heart}
        />
        <InputField
          label="Response Rate"
          value={data.responseRate || ""}
          onChange={(e) => onChange("responseRate", e.target.value)}
          placeholder="98%"
          icon={TrendingUp}
        />
      </div>
    </Section>

    <DynamicList
      title="Stats Cards"
      items={data.stats || []}
      fields={[
        { key: "label", placeholder: "Label" },
        { key: "value", placeholder: "Value" },
        { key: "trend", placeholder: "Trend" },
      ]}
      onChange={(list) => onListChange("stats", list)}
      emptyMessage="Add stat cards"
      maxItems={6}
    />

    <DynamicList
      title="Highlights"
      items={data.highlights || []}
      fields={[
        { key: "icon", placeholder: "Icon", options: options.highlightIcons },
        { key: "label", placeholder: "Label" },
        { key: "value", placeholder: "Value" },
        { key: "color", placeholder: "Color", options: options.highlightColors },
      ]}
      onChange={(list) => onListChange("highlights", list)}
      emptyMessage="Add highlights"
      maxItems={4}
    />

    <Section title="Operating Hours" icon={Clock}>
      <DynamicList
        items={data.operatingHours || []}
        fields={[
          { key: "day", placeholder: "Day(s)", options: options.days },
          { key: "hours", placeholder: "Hours" },
        ]}
        onChange={(list) => onListChange("operatingHours", list)}
        emptyMessage="Add operating hours"
        maxItems={10}
      />
    </Section>

    <MultiSelectWithCustom
      label="Event Types Supported"
      options={options.eventTypes}
      value={data.eventTypes || []}
      onChange={(val) => onListChange("eventTypes", val)}
    />
  </div>
);

const PricingSection = ({ data, onChange, onListChange, errors, options, addToast }) => (
  <div className="space-y-6 sm:space-y-8">
    <Section
      title="Pricing Details"
      icon={DollarSign}
      tip="Clear pricing helps customers make informed decisions."
    >
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <InputField
          label="Base Price"
          type="number"
          min="0"
          value={data.basePrice || ""}
          onChange={(e) => onChange("basePrice", e.target.value)}
          error={errors.basePrice}
          placeholder="50000"
          prefix="₹"
        />
        <CustomSelect
          label="Price Unit"
          options={options.priceUnits}
          value={data.priceUnit || "day"}
          onChange={(val) => onChange("priceUnit", val)}
          allowCustom
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <InputField
            label="Min Price"
            type="number"
            min="0"
            value={data.perDayPrice?.min || ""}
            onChange={(e) => onChange("perDayPrice", e.target.value, true, "min")}
            placeholder="50000"
            prefix="₹"
          />
          <InputField
            label="Max Price"
            type="number"
            min="0"
            value={data.perDayPrice?.max || ""}
            onChange={(e) => onChange("perDayPrice", e.target.value, true, "max")}
            placeholder="200000"
            prefix="₹"
          />
        </div>
      </div>
    </Section>

    <MultiSelectWithCustom
      label="Payment Methods Accepted"
      options={options.paymentMethods}
      value={data.paymentMethods || []}
      onChange={(val) => onListChange("paymentMethods", val)}
    />
  </div>
);

const FeaturesSection = ({ data, onListChange, options, addToast }) => (
  <div className="space-y-6 sm:space-y-8">
    <Section title="Amenities" icon={Star} tip="Select from list or add custom amenities.">
      <MultiSelectWithCustom
        label="Available Amenities"
        options={options.amenities}
        value={data.amenities || []}
        onChange={(v) => onListChange("amenities", v)}
      />
    </Section>

    <Section title="Premium Facilities" icon={Award}>
      <MultiSelectWithCustom
        label="Special Facilities"
        options={options.facilities}
        value={data.facilities || []}
        onChange={(v) => onListChange("facilities", v)}
      />
    </Section>

    <ListInput
      label="Why Choose Us"
      items={data.highlightPoints || []}
      onChange={(v) => onListChange("highlightPoints", v)}
      placeholder="Add a highlight..."
    />

    <DynamicList
      title="Awards & Recognition"
      items={data.awards || []}
      fields={[
        { key: "title", placeholder: "Award Title" },
        { key: "year", placeholder: "Year" },
      ]}
      onChange={(list) => onListChange("awards", list)}
      emptyMessage="Add awards"
      maxItems={10}
    />

    <DynamicList
      title="Special Offers"
      items={data.specialOffers || []}
      fields={[
        { key: "title", placeholder: "Offer Title" },
        { key: "discount", placeholder: "Discount" },
        { key: "description", placeholder: "Description", type: "textarea" },
      ]}
      onChange={(list) => onListChange("specialOffers", list)}
      emptyMessage="Add offers"
      maxItems={5}
    />
  </div>
);

const PackagesSection = ({ packages = [], onChange, addToast }) => {
  const add = () => {
    onChange([
      ...packages,
      {
        name: "",
        price: "",
        originalPrice: "",
        duration: "",
        features: [],
        notIncluded: [],
        isPopular: false,
        savingsPercentage: 0,
      },
    ]);
    addToast("New package added", "success");
  };

  const update = (i, field, value) => {
    const updated = [...packages];
    updated[i] = { ...updated[i], [field]: value };

    if (field === "price" || field === "originalPrice") {
      const price = parseFloat(updated[i].price) || 0;
      const originalPrice = parseFloat(updated[i].originalPrice) || 0;
      if (price && originalPrice && originalPrice > price) {
        updated[i].savingsPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
      } else {
        updated[i].savingsPercentage = 0;
      }
    }
    onChange(updated);
  };

  const remove = (i) => {
    onChange(packages.filter((_, idx) => idx !== i));
    addToast("Package removed", "info");
  };

  const addFeature = (pkgIndex, feature) => {
    if (feature.trim()) {
      const updated = [...packages];
      updated[pkgIndex].features = [...(updated[pkgIndex].features || []), feature.trim()];
      onChange(updated);
    }
  };

  const removeFeature = (pkgIndex, featureIndex) => {
    const updated = [...packages];
    updated[pkgIndex].features = updated[pkgIndex].features.filter((_, i) => i !== featureIndex);
    onChange(updated);
  };

  const addNotIncluded = (pkgIndex, item) => {
    if (item.trim()) {
      const updated = [...packages];
      updated[pkgIndex].notIncluded = [...(updated[pkgIndex].notIncluded || []), item.trim()];
      onChange(updated);
    }
  };

  const removeNotIncluded = (pkgIndex, itemIndex) => {
    const updated = [...packages];
    updated[pkgIndex].notIncluded = updated[pkgIndex].notIncluded.filter((_, i) => i !== itemIndex);
    onChange(updated);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Section
        title="Service Packages"
        icon={Gift}
        badge={`${packages.length} packages`}
        tip="Well-structured packages help customers compare options."
      >
        {packages.length === 0 && (
          <div className="text-center py-8 sm:py-12 bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Gift size={36} className="mx-auto text-gray-300 mb-3 sm:mb-4" />
            <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">No packages yet</p>
            <button
              type="button"
              onClick={add}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg sm:rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg text-xs sm:text-sm"
            >
              Create Package
            </button>
          </div>
        )}

        <AnimatePresence>
          {packages.map((pkg, i) => (
            <PackageCard
              key={i}
              pkg={pkg}
              index={i}
              onUpdate={update}
              onRemove={() => remove(i)}
              onAddFeature={addFeature}
              onRemoveFeature={removeFeature}
              onAddNotIncluded={addNotIncluded}
              onRemoveNotIncluded={removeNotIncluded}
            />
          ))}
        </AnimatePresence>

        {packages.length > 0 && (
          <button
            type="button"
            onClick={add}
            className="w-full py-3 sm:py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-2xl text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 font-medium text-xs sm:text-sm"
          >
            <Plus size={16} />
            Add Package
          </button>
        )}
      </Section>
    </div>
  );
};

const PackageCard = ({
  pkg,
  index,
  onUpdate,
  onRemove,
  onAddFeature,
  onRemoveFeature,
  onAddNotIncluded,
  onRemoveNotIncluded,
}) => {
  const [featureInput, setFeatureInput] = useState("");
  const [notIncludedInput, setNotIncludedInput] = useState("");
  const { addToast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`border-2 p-3 sm:p-5 rounded-xl sm:rounded-2xl relative mb-3 sm:mb-4 ${pkg.isPopular ? "border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 shadow-lg" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"}`}
    >
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg sm:rounded-xl transition-colors"
      >
        <Trash2 size={14} />
      </button>

      {pkg.isPopular && (
        <span className="absolute -top-2 sm:-top-3 left-3 sm:left-4 px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg">
          ⭐ Popular
        </span>
      )}

      <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-3 sm:mb-4 mt-2">
        <InputField
          label="Package Name"
          value={pkg.name || ""}
          onChange={(e) => onUpdate(index, "name", e.target.value)}
          placeholder="Gold Package"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <InputField
            label="Price"
            type="number"
            value={pkg.price || ""}
            onChange={(e) => onUpdate(index, "price", e.target.value)}
            placeholder="75000"
            prefix="₹"
          />
          <InputField
            label="Original Price"
            type="number"
            value={pkg.originalPrice || ""}
            onChange={(e) => onUpdate(index, "originalPrice", e.target.value)}
            placeholder="100000"
            prefix="₹"
            helperText={pkg.savingsPercentage > 0 ? `${pkg.savingsPercentage}% off` : ""}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <InputField
            label="Duration"
            value={pkg.duration || ""}
            onChange={(e) => onUpdate(index, "duration", e.target.value)}
            placeholder="12 hours"
            icon={Clock}
          />
          <div className="flex items-end pb-2">
            <CheckboxField
              label="Mark as Popular"
              checked={pkg.isPopular || false}
              onChange={(e) => onUpdate(index, "isPopular", e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Features</label>
            <span className="text-[10px] sm:text-xs text-gray-500">{pkg.features?.length || 0}</span>
          </div>
          {pkg.features && pkg.features.length > 0 && (
            <ul className="space-y-1 mb-2 max-h-28 sm:max-h-32 overflow-y-auto">
              {pkg.features.map((f, fi) => (
                <li
                  key={fi}
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm p-1.5 sm:p-2 bg-green-50 dark:bg-green-900/20 rounded-md sm:rounded-lg group"
                >
                  <CheckCircle size={10} className="text-green-500 flex-shrink-0" />
                  <span className="flex-1 text-gray-700 dark:text-gray-300 truncate">{f}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveFeature(index, fi)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <X size={10} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Add feature..."
              className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-800 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddFeature(index, featureInput);
                  setFeatureInput("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                onAddFeature(index, featureInput);
                setFeatureInput("");
              }}
              disabled={!featureInput.trim()}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg sm:rounded-xl hover:bg-green-700 disabled:opacity-50 flex-shrink-0"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Not Included</label>
            <span className="text-[10px] sm:text-xs text-gray-500">{pkg.notIncluded?.length || 0}</span>
          </div>
          {pkg.notIncluded && pkg.notIncluded.length > 0 && (
            <ul className="space-y-1 mb-2 max-h-28 sm:max-h-32 overflow-y-auto">
              {pkg.notIncluded.map((item, ni) => (
                <li
                  key={ni}
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm p-1.5 sm:p-2 bg-red-50 dark:bg-red-900/20 rounded-md sm:rounded-lg group"
                >
                  <X size={10} className="text-red-500 flex-shrink-0" />
                  <span className="flex-1 text-gray-500 line-through truncate">{item}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveNotIncluded(index, ni)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <X size={10} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <input
              value={notIncludedInput}
              onChange={(e) => setNotIncludedInput(e.target.value)}
              placeholder="Add exclusion..."
              className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-800 focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddNotIncluded(index, notIncludedInput);
                  setNotIncludedInput("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                onAddNotIncluded(index, notIncludedInput);
                setNotIncludedInput("");
              }}
              disabled={!notIncludedInput.trim()}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-600 text-white rounded-lg sm:rounded-xl hover:bg-gray-700 disabled:opacity-50 flex-shrink-0"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PoliciesSection = ({ data, onListChange, addToast }) => {
  const addPolicy = () => {
    onListChange("policies", [...(data.policies || []), { title: "", content: "", details: [] }]);
    addToast("New policy added", "success");
  };

  const updatePolicy = (i, field, value) => {
    const updated = [...(data.policies || [])];
    updated[i] = { ...updated[i], [field]: value };
    onListChange("policies", updated);
  };

  const removePolicy = (i) => {
    onListChange(
      "policies",
      (data.policies || []).filter((_, idx) => idx !== i),
    );
    addToast("Policy removed", "info");
  };

  const addPolicyDetail = (policyIndex, detail) => {
    if (detail.trim()) {
      const updated = [...(data.policies || [])];
      updated[policyIndex].details = [...(updated[policyIndex].details || []), detail.trim()];
      onListChange("policies", updated);
    }
  };

  const removePolicyDetail = (policyIndex, detailIndex) => {
    const updated = [...(data.policies || [])];
    updated[policyIndex].details = updated[policyIndex].details.filter((_, i) => i !== detailIndex);
    onListChange("policies", updated);
  };

  const addFaq = () => {
    onListChange("faqs", [...(data.faqs || []), { question: "", answer: "" }]);
    addToast("New FAQ added", "success");
  };

  const updateFaq = (i, field, value) => {
    const updated = [...(data.faqs || [])];
    updated[i] = { ...updated[i], [field]: value };
    onListChange("faqs", updated);
  };

  const removeFaq = (i) => {
    onListChange(
      "faqs",
      (data.faqs || []).filter((_, idx) => idx !== i),
    );
    addToast("FAQ removed", "info");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <Section
        title="Policies"
        icon={Shield}
        badge={`${data.policies?.length || 0} policies`}
        tip="Clear policies build trust."
      >
        <AnimatePresence>
          {(data.policies || []).map((p, i) => (
            <PolicyCard
              key={i}
              policy={p}
              index={i}
              onUpdate={updatePolicy}
              onRemove={() => removePolicy(i)}
              onAddDetail={addPolicyDetail}
              onRemoveDetail={removePolicyDetail}
            />
          ))}
        </AnimatePresence>
        <button
          type="button"
          onClick={addPolicy}
          className="w-full py-2.5 sm:py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 font-medium text-xs sm:text-sm"
        >
          <Plus size={14} />
          Add Policy
        </button>
      </Section>

      <Section
        title="FAQs"
        icon={HelpCircle}
        badge={`${data.faqs?.length || 0} FAQs`}
        tip="Anticipate customer questions."
      >
        <AnimatePresence>
          {(data.faqs || []).map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="border-2 border-gray-200 dark:border-gray-700 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800/50 mb-2 sm:mb-3 group"
            >
              <InputField
                label={`Question ${i + 1}`}
                placeholder="What is the capacity?"
                value={f.question || ""}
                onChange={(e) => updateFaq(i, "question", e.target.value)}
                className="mb-2 sm:mb-3"
              />
              <TextArea
                label="Answer"
                placeholder="Detailed answer..."
                value={f.answer || ""}
                onChange={(e) => updateFaq(i, "answer", e.target.value)}
                rows={3}
              />
              <button
                type="button"
                onClick={() => removeFaq(i)}
                className="mt-2 sm:mt-3 text-red-500 text-[10px] sm:text-xs font-medium hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 size={10} />
                Remove FAQ
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          type="button"
          onClick={addFaq}
          className="w-full py-2.5 sm:py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 font-medium text-xs sm:text-sm"
        >
          <Plus size={14} />
          Add FAQ
        </button>
      </Section>
    </div>
  );
};

const PolicyCard = ({ policy, index, onUpdate, onRemove, onAddDetail, onRemoveDetail }) => {
  const [detailInput, setDetailInput] = useState("");
  const { addToast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="border-2 border-gray-200 dark:border-gray-700 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 mb-2 sm:mb-3"
    >
      <InputField
        label="Policy Title"
        placeholder="Cancellation Policy"
        value={policy.title || ""}
        onChange={(e) => onUpdate(index, "title", e.target.value)}
        className="mb-2 sm:mb-3"
      />
      <TextArea
        label="Summary"
        placeholder="Brief summary..."
        value={policy.content || ""}
        onChange={(e) => onUpdate(index, "content", e.target.value)}
        rows={2}
      />
      <div className="mt-2 sm:mt-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Details</label>
          <span className="text-[10px] sm:text-xs text-gray-500">{policy.details?.length || 0}</span>
        </div>
        {policy.details && policy.details.length > 0 && (
          <ul className="space-y-1 mb-2">
            {policy.details.map((d, di) => (
              <li
                key={di}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-700 rounded-md sm:rounded-lg group"
              >
                <Check size={10} className="text-green-500 flex-shrink-0" />
                <span className="flex-1 truncate">{d}</span>
                <button
                  type="button"
                  onClick={() => onRemoveDetail(index, di)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 flex-shrink-0"
                >
                  <X size={10} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <input
            value={detailInput}
            onChange={(e) => setDetailInput(e.target.value)}
            placeholder="Add detail..."
            className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-800 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddDetail(index, detailInput);
                setDetailInput("");
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              onAddDetail(index, detailInput);
              setDetailInput("");
            }}
            disabled={!detailInput.trim()}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-indigo-600 text-white rounded-lg sm:rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex-shrink-0"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="mt-2 sm:mt-3 text-red-500 text-[10px] sm:text-xs font-medium hover:text-red-700 flex items-center gap-1"
      >
        <Trash2 size={10} />
        Remove Policy
      </button>
    </motion.div>
  );
};

const SocialSection = ({ data, onChange, onListChange, addToast }) => (
  <div className="space-y-6 sm:space-y-8">
    <Section title="Social Links" icon={Globe}>
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <InputField
          label="Website"
          value={data.socialLinks?.website || ""}
          onChange={(e) => onChange("socialLinks", e.target.value, true, "website")}
          placeholder="https://yourwebsite.com"
          icon={Globe}
        />
        <InputField
          label="Instagram"
          value={data.socialLinks?.instagram || ""}
          onChange={(e) => onChange("socialLinks", e.target.value, true, "instagram")}
          placeholder="https://instagram.com/yourpage"
          icon={Instagram}
        />
        <InputField
          label="Facebook"
          value={data.socialLinks?.facebook || ""}
          onChange={(e) => onChange("socialLinks", e.target.value, true, "facebook")}
          placeholder="https://facebook.com/yourpage"
          icon={Facebook}
        />
        <InputField
          label="YouTube"
          value={data.socialLinks?.youtube || ""}
          onChange={(e) => onChange("socialLinks", e.target.value, true, "youtube")}
          placeholder="https://youtube.com/@channel"
          icon={Youtube}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <InputField
            label="Twitter/X"
            value={data.socialLinks?.twitter || ""}
            onChange={(e) => onChange("socialLinks", e.target.value, true, "twitter")}
            placeholder="https://twitter.com/..."
            icon={Twitter}
          />
          <InputField
            label="LinkedIn"
            value={data.socialLinks?.linkedin || ""}
            onChange={(e) => onChange("socialLinks", e.target.value, true, "linkedin")}
            placeholder="https://linkedin.com/..."
            icon={Linkedin}
          />
        </div>
      </div>
    </Section>

    <Section title="SEO Settings" icon={Target} tip="Good SEO helps customers find you.">
      <InputField
        label="Meta Title"
        value={data.metaTitle || ""}
        onChange={(e) => onChange("metaTitle", e.target.value)}
        placeholder="SEO title..."
        maxLength={60}
        helperText={`${(data.metaTitle || "").length}/60`}
      />
      <TextArea
        label="Meta Description"
        value={data.metaDescription || ""}
        onChange={(e) => onChange("metaDescription", e.target.value)}
        placeholder="SEO description..."
        rows={3}
        className="mt-3 sm:mt-4"
        maxLength={160}
      />
      <div className="mt-3 sm:mt-4">
        <TagInput
          label="Meta Keywords"
          tags={data.metaKeywords || []}
          onChange={(v) => onListChange("metaKeywords", v)}
          placeholder="Add keyword..."
          suggestions={["wedding", "venue", "photography", "catering", "events"]}
        />
      </div>
    </Section>
  </div>
);

const CategorySpecificFields = ({
  category,
  data,
  onChange,
  onNestedChange,
  options,
  errors,
  categories,
  addToast,
}) => {
  const categoryInfo = categories.find((c) => c.key === category);

  const renderCategoryContent = () => {
    switch (category) {
      case "venues":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <RangeField
                label="Seating Capacity"
                value={data.seating || {}}
                onChange={(val) => onChange("seating", val)}
              />
              <RangeField
                label="Floating Capacity"
                value={data.floating || {}}
                onChange={(val) => onChange("floating", val)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <InputField
                label="Halls"
                type="number"
                value={data.halls || ""}
                onChange={(e) => onChange("halls", parseInt(e.target.value) || 0)}
                placeholder="3"
              />
              <InputField
                label="Rooms"
                type="number"
                value={data.rooms?.count || ""}
                onChange={(e) => onNestedChange("rooms", "count", parseInt(e.target.value) || 0)}
                placeholder="10"
              />
              <InputField
                label="Parking"
                type="number"
                value={data.parking?.capacity || ""}
                onChange={(e) => onNestedChange("parking", "capacity", parseInt(e.target.value) || 0)}
                placeholder="200"
              />
              <div className="flex items-end pb-2">
                <CheckboxField
                  label="Valet"
                  checked={data.parking?.valet || false}
                  onChange={(e) => onNestedChange("parking", "valet", e.target.checked)}
                />
              </div>
            </div>
            <MultiSelectWithCustom
              label="Areas"
              options={options.venueAreas}
              value={data.areas || []}
              onChange={(v) => onChange("areas", v)}
            />
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <CustomSelect
                label="Food Policy"
                options={options.foodPolicies}
                value={data.foodPolicy || ""}
                onChange={(v) => onChange("foodPolicy", v)}
                allowCustom
              />
              <InputField
                label="Ceiling Height"
                value={data.ceilingHeight || ""}
                onChange={(e) => onChange("ceilingHeight", e.target.value)}
                placeholder="25 feet"
              />
              <InputField
                label="Stage Size"
                value={data.stageSize || ""}
                onChange={(e) => onChange("stageSize", e.target.value)}
                placeholder="40 x 20 ft"
              />
              <InputField
                label="Power Backup"
                value={data.powerBackup || ""}
                onChange={(e) => onChange("powerBackup", e.target.value)}
                placeholder="500 KVA"
              />
            </div>
          </div>
        );

      case "photographers":
        return (
          <div className="space-y-4 sm:space-y-6">
            <TagInput
              label="Services"
              tags={data.services || []}
              onChange={(v) => onChange("services", v)}
              suggestions={options.photographerServices}
              placeholder="Add service..."
            />
            <TagInput
              label="Deliverables"
              tags={data.deliverables || []}
              onChange={(v) => onChange("deliverables", v)}
              suggestions={options.deliverables}
              placeholder="Add deliverable..."
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <InputField
                label="Delivery (Weeks)"
                type="number"
                value={data.deliveryTime || ""}
                onChange={(e) => onChange("deliveryTime", parseInt(e.target.value) || 0)}
                placeholder="4"
              />
              <InputField
                label="Team Size"
                type="number"
                value={data.teamSize || ""}
                onChange={(e) => onChange("teamSize", parseInt(e.target.value) || 0)}
                placeholder="5"
              />
              <CustomSelect
                label="Travel Cost"
                options={options.travelCost}
                value={data.travelCost || ""}
                onChange={(v) => onChange("travelCost", v)}
                allowCustom
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <CheckboxField
                label="Videography"
                checked={data.videographyIncluded || false}
                onChange={(e) => onChange("videographyIncluded", e.target.checked)}
              />
              <CheckboxField
                label="Drone"
                checked={data.droneAvailable || false}
                onChange={(e) => onChange("droneAvailable", e.target.checked)}
              />
            </div>
          </div>
        );

      case "makeup":
        return (
          <div className="space-y-4 sm:space-y-6">
            <TagInput
              label="Services"
              tags={data.services || []}
              onChange={(v) => onChange("services", v)}
              suggestions={options.makeupServices}
              placeholder="Add service..."
            />
            <TagInput
              label="Brands Used"
              tags={data.brandsUsed || []}
              onChange={(v) => onChange("brandsUsed", v)}
              suggestions={options.makeupBrands}
              placeholder="Add brand..."
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <CheckboxField
                label="Trial"
                checked={data.trialPolicy?.available || false}
                onChange={(e) => onNestedChange("trialPolicy", "available", e.target.checked)}
              />
              <CheckboxField
                label="Trial Paid"
                checked={data.trialPolicy?.paid || false}
                onChange={(e) => onNestedChange("trialPolicy", "paid", e.target.checked)}
              />
              <InputField
                label="Trial Price"
                type="number"
                value={data.trialPolicy?.price || ""}
                onChange={(e) => onNestedChange("trialPolicy", "price", parseInt(e.target.value) || 0)}
                placeholder="2000"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <CheckboxField
                label="Travel to Venue"
                checked={data.travelToVenue !== false}
                onChange={(e) => onChange("travelToVenue", e.target.checked)}
              />
              <CheckboxField
                label="Assistants"
                checked={data.assistantsAvailable || false}
                onChange={(e) => onChange("assistantsAvailable", e.target.checked)}
              />
            </div>
          </div>
        );

      case "catering":
        return (
          <div className="space-y-4 sm:space-y-6">
            <TagInput
              label="Cuisines"
              tags={data.cuisines || []}
              onChange={(v) => onChange("cuisines", v)}
              suggestions={options.cuisines}
              placeholder="Add cuisine..."
            />
            <MultiSelectWithCustom
              label="Menu Types"
              options={options.menuTypes}
              value={data.menuTypes || []}
              onChange={(v) => onChange("menuTypes", v)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <InputField
                label="Min Capacity"
                type="number"
                value={data.minCapacity || ""}
                onChange={(e) => onChange("minCapacity", parseInt(e.target.value) || 0)}
                placeholder="50"
              />
              <InputField
                label="Max Capacity"
                type="number"
                value={data.maxCapacity || ""}
                onChange={(e) => onChange("maxCapacity", parseInt(e.target.value) || 0)}
                placeholder="1000"
              />
              <CheckboxField
                label="Live Counters"
                checked={data.liveCounters || false}
                onChange={(e) => onChange("liveCounters", e.target.checked)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <InputField
                label="Veg ₹/plate"
                type="number"
                value={data.pricePerPlate?.veg || ""}
                onChange={(e) => onNestedChange("pricePerPlate", "veg", parseInt(e.target.value) || 0)}
                placeholder="500"
              />
              <InputField
                label="Non-Veg ₹/plate"
                type="number"
                value={data.pricePerPlate?.nonVeg || ""}
                onChange={(e) => onNestedChange("pricePerPlate", "nonVeg", parseInt(e.target.value) || 0)}
                placeholder="700"
              />
            </div>
          </div>
        );

      case "djs":
        return (
          <div className="space-y-4 sm:space-y-6">
            <TagInput
              label="Genres"
              tags={data.genres || []}
              onChange={(v) => onChange("genres", v)}
              suggestions={options.genres}
              placeholder="Add genre..."
            />
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <InputField
                label="Duration"
                value={data.performanceDuration || ""}
                onChange={(e) => onChange("performanceDuration", e.target.value)}
                placeholder="4 Hours"
              />
              <InputField
                label="Sound Power"
                value={data.soundSystemPower || ""}
                onChange={(e) => onChange("soundSystemPower", e.target.value)}
                placeholder="10,000 Watts"
              />
              <InputField
                label="Setup Time"
                value={data.setupTime || ""}
                onChange={(e) => onChange("setupTime", e.target.value)}
                placeholder="2 Hours"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <CheckboxField
                label="Equipment"
                checked={data.equipmentProvided !== false}
                onChange={(e) => onChange("equipmentProvided", e.target.checked)}
              />
              <CheckboxField
                label="Backup"
                checked={data.backupAvailable !== false}
                onChange={(e) => onChange("backupAvailable", e.target.checked)}
              />
              <CheckboxField
                label="Lighting"
                checked={data.lightingIncluded || false}
                onChange={(e) => onChange("lightingIncluded", e.target.checked)}
              />
              <CheckboxField
                label="Emcee"
                checked={data.emceeServices || false}
                onChange={(e) => onChange("emceeServices", e.target.checked)}
              />
            </div>
          </div>
        );

      case "clothes":
        return (
          <div className="space-y-4 sm:space-y-6">
            <TagInput
              label="Outfit Types"
              tags={data.outfitTypes || []}
              onChange={(v) => onChange("outfitTypes", v)}
              suggestions={options.outfitTypes}
              placeholder="Add type..."
            />
            <CustomSelect
              label="Wear Category"
              options={options.wearTypes}
              value={data.wearType || ""}
              onChange={(v) => onChange("wearType", v)}
              allowCustom
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <InputField
                label="Lead Time"
                value={data.leadTime || ""}
                onChange={(e) => onChange("leadTime", e.target.value)}
                placeholder="2 Weeks"
              />
              <InputField
                label="Size Range"
                value={data.sizeRange || ""}
                onChange={(e) => onChange("sizeRange", e.target.value)}
                placeholder="XS - 4XL"
              />
              <InputField
                label="Fittings"
                type="number"
                value={data.fittingSessions || ""}
                onChange={(e) => onChange("fittingSessions", parseInt(e.target.value) || 0)}
                placeholder="3"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <CheckboxField
                label="Customization"
                checked={data.customization || false}
                onChange={(e) => onChange("customization", e.target.checked)}
              />
              <CheckboxField
                label="Rental"
                checked={data.rentalAvailable || false}
                onChange={(e) => onChange("rentalAvailable", e.target.checked)}
              />
              <CheckboxField
                label="Alterations"
                checked={data.alterationsIncluded || false}
                onChange={(e) => onChange("alterationsIncluded", e.target.checked)}
              />
            </div>
          </div>
        );

      case "mehendi":
        return (
          <div className="space-y-4 sm:space-y-6">
            <TagInput
              label="Designs"
              tags={data.designs || []}
              onChange={(v) => onChange("designs", v)}
              suggestions={options.mehendiDesigns}
              placeholder="Add design..."
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <InputField
                label="Price/Hand ₹"
                type="number"
                value={data.pricePerHand || ""}
                onChange={(e) => onChange("pricePerHand", parseInt(e.target.value) || 0)}
                placeholder="500"
              />
              <InputField
                label="Bridal ₹"
                type="number"
                value={data.bridalPackagePrice || ""}
                onChange={(e) => onChange("bridalPackagePrice", parseInt(e.target.value) || 0)}
                placeholder="15000"
              />
              <InputField
                label="Team Size"
                type="number"
                value={data.teamSize || ""}
                onChange={(e) => onChange("teamSize", parseInt(e.target.value) || 0)}
                placeholder="5"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InputField
                label="Drying Time"
                value={data.dryingTime || ""}
                onChange={(e) => onChange("dryingTime", e.target.value)}
                placeholder="2-3 hours"
              />
              <InputField
                label="Color Guarantee"
                value={data.colorGuarantee || ""}
                onChange={(e) => onChange("colorGuarantee", e.target.value)}
                placeholder="Deep maroon"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <CheckboxField
                label="Organic"
                checked={data.organic !== false}
                onChange={(e) => onChange("organic", e.target.checked)}
              />
              <CheckboxField
                label="Travel"
                checked={data.travelToVenue !== false}
                onChange={(e) => onChange("travelToVenue", e.target.checked)}
              />
            </div>
          </div>
        );

      case "cakes":
        return (
          <div className="space-y-4 sm:space-y-6">
            <TagInput
              label="Flavors"
              tags={data.flavors || []}
              onChange={(v) => onChange("flavors", v)}
              suggestions={options.cakeFlavors}
              placeholder="Add flavor..."
            />
            <TagInput
              label="Speciality"
              tags={data.speciality || []}
              onChange={(v) => onChange("speciality", v)}
              suggestions={options.cakeSpeciality}
              placeholder="Add speciality..."
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <InputField
                label="Price/Kg ₹"
                type="number"
                value={data.pricePerKg || ""}
                onChange={(e) => onChange("pricePerKg", parseInt(e.target.value) || 0)}
                placeholder="1500"
              />
              <InputField
                label="Min Kg"
                type="number"
                step="0.5"
                value={data.minOrderWeight || ""}
                onChange={(e) => onChange("minOrderWeight", parseFloat(e.target.value) || 0)}
                placeholder="1"
              />
              <InputField
                label="Advance Days"
                type="number"
                value={data.advanceBookingDays || ""}
                onChange={(e) => onChange("advanceBookingDays", parseInt(e.target.value) || 0)}
                placeholder="3"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <CheckboxField
                label="Delivery"
                checked={data.deliveryAvailable !== false}
                onChange={(e) => onChange("deliveryAvailable", e.target.checked)}
              />
              <CheckboxField
                label="Custom"
                checked={data.customDesigns !== false}
                onChange={(e) => onChange("customDesigns", e.target.checked)}
              />
              <CheckboxField
                label="Eggless"
                checked={data.eggless || false}
                onChange={(e) => onChange("eggless", e.target.checked)}
              />
              <CheckboxField
                label="Sugar-Free"
                checked={data.sugarFree || false}
                onChange={(e) => onChange("sugarFree", e.target.checked)}
              />
            </div>
          </div>
        );

      case "jewellery":
        return (
          <div className="space-y-4 sm:space-y-6">
            <TagInput
              label="Materials"
              tags={data.material || []}
              onChange={(v) => onChange("material", v)}
              suggestions={options.jewelleryMaterial}
              placeholder="Add material..."
            />
            <TagInput
              label="Styles"
              tags={data.styles || []}
              onChange={(v) => onChange("styles", v)}
              suggestions={options.jewelleryStyles}
              placeholder="Add style..."
            />
            <InputField
              label="Return Policy"
              value={data.returnPolicy || ""}
              onChange={(e) => onChange("returnPolicy", e.target.value)}
              placeholder="7 days full refund"
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <CheckboxField
                label="Customization"
                checked={data.customization || false}
                onChange={(e) => onChange("customization", e.target.checked)}
              />
              <CheckboxField
                label="Rental"
                checked={data.rentalAvailable || false}
                onChange={(e) => onChange("rentalAvailable", e.target.checked)}
              />
              <CheckboxField
                label="Certification"
                checked={data.certificationProvided || false}
                onChange={(e) => onChange("certificationProvided", e.target.checked)}
              />
              <CheckboxField
                label="Home Trial"
                checked={data.homeTrialAvailable || false}
                onChange={(e) => onChange("homeTrialAvailable", e.target.checked)}
              />
            </div>
          </div>
        );

      case "invitations":
        return (
          <div className="space-y-4 sm:space-y-6">
            <TagInput
              label="Types"
              tags={data.types || []}
              onChange={(v) => onChange("types", v)}
              suggestions={options.invitationTypes}
              placeholder="Add type..."
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <InputField
                label="Min Qty"
                type="number"
                value={data.minOrderQuantity || ""}
                onChange={(e) => onChange("minOrderQuantity", parseInt(e.target.value) || 0)}
                placeholder="50"
              />
              <InputField
                label="Digital Time"
                value={data.digitalDeliveryTime || ""}
                onChange={(e) => onChange("digitalDeliveryTime", e.target.value)}
                placeholder="2 Days"
              />
              <InputField
                label="Physical Time"
                value={data.physicalDeliveryTime || ""}
                onChange={(e) => onChange("physicalDeliveryTime", e.target.value)}
                placeholder="7 Days"
              />
            </div>
            <CheckboxField
              label="Custom Design"
              checked={data.customDesign !== false}
              onChange={(e) => onChange("customDesign", e.target.checked)}
            />
            <TagInput
              label="Languages"
              tags={data.languages || []}
              onChange={(v) => onChange("languages", v)}
              placeholder="Add language..."
            />
          </div>
        );

      case "hairstyling":
        return (
          <div className="space-y-4 sm:space-y-6">
            <TagInput
              label="Hairstyles"
              tags={data.styles || []}
              onChange={(v) => onChange("styles", v)}
              placeholder="Add style..."
            />
            <TagInput
              label="Products"
              tags={data.productsUsed || []}
              onChange={(v) => onChange("productsUsed", v)}
              placeholder="Add product..."
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <CheckboxField
                label="Extensions"
                checked={data.extensionsProvided || false}
                onChange={(e) => onChange("extensionsProvided", e.target.checked)}
              />
              <CheckboxField
                label="Draping"
                checked={data.drapingIncluded || false}
                onChange={(e) => onChange("drapingIncluded", e.target.checked)}
              />
              <CheckboxField
                label="Travel"
                checked={data.travelToVenue !== false}
                onChange={(e) => onChange("travelToVenue", e.target.checked)}
              />
              <CheckboxField
                label="Trial"
                checked={data.trialAvailable !== false}
                onChange={(e) => onChange("trialAvailable", e.target.checked)}
              />
            </div>
          </div>
        );

      case "planners":
        return (
          <div className="space-y-4 sm:space-y-6">
            <TagInput
              label="Specializations"
              tags={data.specializations || []}
              onChange={(v) => onChange("specializations", v)}
              placeholder="Add..."
            />
            <TagInput
              label="Events Managed"
              tags={data.eventsManaged || []}
              onChange={(v) => onChange("eventsManaged", v)}
              placeholder="Add event..."
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <InputField
                label="Team Size"
                type="number"
                value={data.teamSize || ""}
                onChange={(e) => onChange("teamSize", parseInt(e.target.value) || 0)}
                placeholder="10"
              />
              <InputField
                label="Vendor Network"
                type="number"
                value={data.vendorNetwork || ""}
                onChange={(e) => onChange("vendorNetwork", parseInt(e.target.value) || 0)}
                placeholder="100"
              />
              <CustomSelect
                label="Fee Structure"
                options={["Fixed Fee", "Percentage", "Hourly"]}
                value={data.feeStructure || ""}
                onChange={(v) => onChange("feeStructure", v)}
                allowCustom
              />
            </div>
            <RangeField
              label="Budget Range ₹"
              value={data.budgetRange || {}}
              onChange={(val) => onChange("budgetRange", val)}
            />
            <CheckboxField
              label="Destination Weddings"
              checked={data.destinationWeddings || false}
              onChange={(e) => onChange("destinationWeddings", e.target.checked)}
            />
          </div>
        );

      case "other":
        return (
          <div className="space-y-4 sm:space-y-6">
            <InputField
              label="Service Type"
              value={data.serviceType || ""}
              onChange={(e) => onChange("serviceType", e.target.value)}
              placeholder="e.g., Event Decoration"
            />
            <DynamicList
              title="Custom Fields"
              items={data.customFields || []}
              fields={[
                { key: "label", placeholder: "Field Name" },
                { key: "value", placeholder: "Value" },
              ]}
              onChange={(list) => onChange("customFields", list)}
              emptyMessage="Add custom fields"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Section
      title={`${categoryInfo?.label || "Category"} Details`}
      icon={categoryInfo?.icon || Layers}
      description={categoryInfo?.description}
      badge={categoryInfo?.label}
      tip="Category-specific fields for detailed information."
    >
      {renderCategoryContent() || (
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
            {categoryInfo?.icon && <categoryInfo.icon size={28} className="text-gray-400 sm:w-9 sm:h-9" />}
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
            {categoryInfo?.label || "Category"} Selected
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm">Category fields will appear here</p>
        </div>
      )}
    </Section>
  );
};

const ImagePreviewModal = ({ image, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 p-4"
    onClick={onClose}
  >
    <button
      type="button"
      onClick={onClose}
      className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl text-white transition-colors"
    >
      <X size={20} />
    </button>
    <motion.img
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      src={image}
      alt="Preview"
      className="max-w-full max-h-[90vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    />
  </motion.div>
);

const UnsavedChangesModal = ({ onDiscard, onCancel, onSave }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-center mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <AlertTriangle className="text-amber-600" size={24} />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Unsaved Changes</h3>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          You have unsaved changes. What would you like to do?
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={onSave}
          className="w-full px-4 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg sm:rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
        >
          <Save size={14} /> Save Changes
        </button>
        <button
          onClick={onDiscard}
          className="w-full px-4 py-2 sm:py-2.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg sm:rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium text-xs sm:text-sm"
        >
          Discard Changes
        </button>
        <button
          onClick={onCancel}
          className="w-full px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-xs sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  </motion.div>
);
