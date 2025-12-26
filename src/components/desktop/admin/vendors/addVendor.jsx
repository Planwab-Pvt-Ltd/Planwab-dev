// components/admin/AddVendor.jsx

"use client";

import { useState, useRef, useEffect } from "react";
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
  Palette,
  Home,
  Plus,
  X,
  Check,
  ChevronDown,
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
  Trophy,
  Zap,
  List,
  Percent,
  Timer,
  Car,
  Wifi,
  Wind,
  Settings,
  Link as LinkIcon,
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
  Info,
  Tag,
  Target,
  Bookmark,
  Heart,
  Share2,
  Eye,
  Edit,
  Save,
  RefreshCw,
} from "lucide-react";

export default function AddVendor() {
  // =============================================================================
  // CONFIGURATION
  // =============================================================================

  const categories = [
    { key: "venues", label: "Venues", icon: Building2 },
    { key: "photographers", label: "Photographers", icon: Camera },
    { key: "makeup", label: "Makeup", icon: Paintbrush2 },
    { key: "planners", label: "Planners", icon: UserCheck },
    { key: "catering", label: "Catering", icon: UtensilsCrossed },
    { key: "clothes", label: "Clothes Wear", icon: Shirt },
    { key: "mehendi", label: "Mehendi", icon: Hand },
    { key: "cakes", label: "Cakes", icon: CakeSlice },
    { key: "jewellery", label: "Jewellery", icon: Gem },
    { key: "invitations", label: "Invitations", icon: Mail },
    { key: "djs", label: "DJs", icon: Music },
    { key: "hairstyling", label: "Hairstyling", icon: Scissors },
    { key: "other", label: "Other", icon: FileText },
  ];

  const initialFormData = {
    // Identity & Contact
    name: "",
    username: "",
    email: "",
    phoneNo: "",
    whatsappNo: "",
    contactPerson: { firstName: "", lastName: "" },

    // Location
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      googleMapUrl: "",
      location: { type: "Point", coordinates: [0, 0] },
    },
    landmarks: [],
    directions: [],

    // Status & Meta
    isVerified: false,
    isActive: true,
    isFeatured: false,
    tags: [],
    availabilityStatus: "Available",

    // Content & Media
    description: "",
    shortDescription: "",
    images: [],
    defaultImage: "",
    videoUrl: "",
    gallery: [],

    // Stats & Ratings
    rating: 4.5,
    reviewCount: 0,
    reviews: 0,
    bookings: 0,
    yearsExperience: 0,
    responseTime: "Within 2 hours",
    repeatCustomerRate: "45%",
    responseRate: "98%",

    // Stats Display
    stats: [],
    highlights: [],

    // Operating Hours
    operatingHours: [],

    // Features
    amenities: [],
    facilities: [],
    highlightPoints: [],
    awards: [],
    specialOffers: [],
    eventTypes: ["Weddings", "Corporate", "Birthday", "Conference", "Reception", "Engagement", "Anniversary"],

    // Pricing & Packages
    basePrice: "",
    priceUnit: "day",
    perDayPrice: { min: "", max: "" },
    packages: [],
    paymentMethods: ["Cash", "UPI", "Bank Transfer"],

    // Information
    policies: [],
    faqs: [],

    // Social Links
    socialLinks: {
      website: "",
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: "",
    },

    // SEO
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],

    // Category Specific Data
    categoryData: {},
  };

  // =============================================================================
  // STATE
  // =============================================================================

  const [activeCategory, setActiveCategory] = useState("venues");
  const [formData, setFormData] = useState(initialFormData);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState({ type: null, message: "" });
  const [activeSection, setActiveSection] = useState("basic");

  // =============================================================================
  // OPTIONS
  // =============================================================================

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
      "Mon - Thu",
      "Fri - Sat",
      "Sunday",
      "All Days",
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

    // Venue specific
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

    // Photographer specific
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

    // Makeup specific
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

    // Catering specific
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

    // DJ specific
    genres: ["Bollywood", "Punjabi", "EDM", "Hip Hop", "Pop", "Rock", "Classical", "Sufi", "Retro", "International"],

    // Clothes specific
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

    // Mehendi specific
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

    // Cake specific
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

    // Jewellery specific
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

    // Invitation specific
    invitationTypes: ["Digital", "Physical", "Boxed", "Scroll", "Video", "E-Invite", "Laser Cut", "Acrylic"],

    // Travel cost options
    travelCost: ["Included", "Extra"],

    // Policy icons
    policyIcons: ["CalendarX", "CreditCard", "FileText", "Clock", "Shield", "AlertCircle", "CheckCircle", "Info"],
    policyIconColors: [
      "text-red-500",
      "text-blue-500",
      "text-gray-500",
      "text-orange-500",
      "text-green-500",
      "text-yellow-500",
      "text-purple-500",
    ],

    // Highlight icons
    highlightIcons: ["Trophy", "Users", "Timer", "Medal", "Star", "Award", "Zap", "Heart", "ThumbsUp", "TrendingUp"],
    highlightColors: [
      "text-yellow-500",
      "text-blue-500",
      "text-green-500",
      "text-purple-500",
      "text-orange-500",
      "text-pink-500",
    ],
    highlightBgs: [
      "bg-yellow-50 dark:bg-yellow-900/20",
      "bg-blue-50 dark:bg-blue-900/20",
      "bg-green-50 dark:bg-green-900/20",
      "bg-purple-50 dark:bg-purple-900/20",
    ],

    // Direction types
    directionTypes: ["By Metro", "By Car", "By Bus", "By Auto", "By Train", "From Airport", "From Railway Station"],
  };

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const resetForm = () => {
    setFormData(initialFormData);
    setUploadedFiles([]);
    setGalleryFiles([]);
    setErrors({});
    setSubmitFeedback({ type: null, message: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (field, value, isNested = false, nestedField = "") => {
    setFormData((prev) => {
      if (isNested) {
        return { ...prev, [field]: { ...prev[field], [nestedField]: value } };
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
  };

  const handleCategoryDataChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      categoryData: { ...prev.categoryData, [field]: value },
    }));
  };

  const handleNestedCategoryDataChange = (field, nestedField, value) => {
    setFormData((prev) => ({
      ...prev,
      categoryData: {
        ...prev.categoryData,
        [field]: { ...prev.categoryData[field], [nestedField]: value },
      },
    }));
  };

  const handleListChange = (field, updatedList) => {
    setFormData((prev) => ({ ...prev, [field]: updatedList }));
  };

  const handleFileUpload = (files, isGallery = false) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
    });

    if (isGallery) {
      setGalleryFiles((prev) => [...prev, ...validFiles]);
    } else {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
      if (errors.images) setErrors((prev) => ({ ...prev, images: null }));
    }
  };

  const removeFile = (index, isGallery = false) => {
    if (isGallery) {
      setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Business name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phoneNo.trim()) newErrors.phoneNo = "Phone is required";
    if (!formData.address.city.trim()) newErrors["address.city"] = "City is required";
    if (!formData.basePrice) newErrors.basePrice = "Base price is required";
    if (uploadedFiles.length === 0) newErrors.images = "Upload at least one image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImagesToCloudinary = async (files) => {
    const uploadPromises = files.map((file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "planWab_vendors");
      return fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      }).then((res) => res.json());
    });

    const results = await Promise.all(uploadPromises);
    return results.map((data) => data.secure_url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setSubmitFeedback({ type: null, message: "" });

    try {
      // Upload main images
      const imageUrls = await uploadImagesToCloudinary(uploadedFiles);

      // Upload gallery images if any
      let galleryUrls = [];
      if (galleryFiles.length > 0) {
        galleryUrls = await uploadImagesToCloudinary(galleryFiles);
      }

      // Prepare gallery with categories
      const gallery = galleryUrls.map((url, idx) => ({
        url,
        category: "General",
        aspectRatio: "landscape",
      }));

      // Build the payload
      const payload = {
        ...formData,
        category: activeCategory,
        images: imageUrls,
        defaultImage: imageUrls[0],
        gallery: gallery,
        // Merge category specific data
        ...formData.categoryData,
      };

      // Remove categoryData as it's been merged
      delete payload.categoryData;

      // Clean up empty values
      if (!payload.perDayPrice.min) delete payload.perDayPrice.min;
      if (!payload.perDayPrice.max) delete payload.perDayPrice.max;

      const response = await fetch("/api/vendor/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to register vendor");
      }

      setSubmitFeedback({ type: "success", message: "Vendor published successfully!" });
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitFeedback({ type: "error", message: error.message || "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // =============================================================================
  // SECTION NAVIGATION
  // =============================================================================

  const sections = [
    { id: "basic", label: "Basic Info", icon: Building },
    { id: "location", label: "Location", icon: MapPin },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "stats", label: "Stats & Hours", icon: BarChart3 },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "category", label: "Category Details", icon: Layers },
    { id: "features", label: "Features", icon: Star },
    { id: "packages", label: "Packages", icon: Gift },
    { id: "policies", label: "Policies & FAQs", icon: FileText },
    { id: "social", label: "Social & SEO", icon: Globe },
  ];

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 overflow-hidden w-[93%]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Add New Vendor</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Complete all details to create a comprehensive vendor listing
          </p>
        </div>

        {/* Category Selector */}
        <div className="mb-6 overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-full">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.key);
                  setFormData((prev) => ({ ...prev, categoryData: {} }));
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all w-20 h-20 ${
                  activeCategory === cat.key
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300"
                }`}
              >
                <cat.icon className="h-5 w-5 mb-1" />
                <span className="text-[10px] font-medium text-center leading-tight">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Navigation */}
        <div className="mb-6 overflow-x-hidden">
          <div className="flex gap-2 flex-wrap bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <section.icon size={16} />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Message */}
        {submitFeedback.message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              submitFeedback.type === "success"
                ? "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
            }`}
          >
            {submitFeedback.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{submitFeedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* === BASIC INFO SECTION === */}
          {activeSection === "basic" && (
            <Section title="Business Identity" icon={Building}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Business Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  error={errors.name}
                  placeholder="e.g., Royal Palace Banquets"
                />
                <InputField
                  label="Username (URL Slug)"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  required
                  error={errors.username}
                  placeholder="e.g., royal-palace-banquets"
                  helperText="This will be used in the URL"
                />
                <InputField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  error={errors.email}
                  placeholder="contact@business.com"
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Phone"
                    value={formData.phoneNo}
                    onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                    required
                    error={errors.phoneNo}
                    placeholder="+91 98765 43210"
                  />
                  <InputField
                    label="WhatsApp"
                    value={formData.whatsappNo}
                    onChange={(e) => handleInputChange("whatsappNo", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <InputField
                  label="Contact First Name"
                  value={formData.contactPerson.firstName}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value, true, "firstName")}
                  placeholder="John"
                />
                <InputField
                  label="Contact Last Name"
                  value={formData.contactPerson.lastName}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value, true, "lastName")}
                  placeholder="Doe"
                />
                <CustomSelect
                  label="Availability Status"
                  options={fieldOptions.availability}
                  value={formData.availabilityStatus}
                  onChange={(val) => handleInputChange("availabilityStatus", val)}
                />
                <div className="flex flex-col gap-4">
                  <CheckboxField
                    label="Verified Vendor"
                    checked={formData.isVerified}
                    onChange={(e) => handleInputChange("isVerified", e.target.checked)}
                  />
                  <CheckboxField
                    label="Featured Listing"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
                  />
                  <CheckboxField
                    label="Active Listing"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange("isActive", e.target.checked)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <TagInput
                  label="Tags"
                  tags={formData.tags}
                  onChange={(v) => handleInputChange("tags", v)}
                  suggestions={[
                    "Popular",
                    "Featured",
                    "Luxury",
                    "Budget-Friendly",
                    "New",
                    "Top Rated",
                    "Premium",
                    "Trending",
                  ]}
                  placeholder="Add tags..."
                />
              </div>
            </Section>
          )}

          {/* === LOCATION SECTION === */}
          {activeSection === "location" && (
            <Section title="Location & Map" icon={MapPin}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <InputField
                      label="Street Address"
                      value={formData.address.street}
                      onChange={(e) => handleInputChange("address", e.target.value, true, "street")}
                      placeholder="123 Wedding Lane, Near City Mall"
                    />
                  </div>
                  <CustomSelect
                    label="City"
                    options={fieldOptions.cities}
                    value={formData.address.city}
                    onChange={(val) => handleInputChange("address", val, true, "city")}
                    required
                    error={errors["address.city"]}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="State"
                      value={formData.address.state}
                      onChange={(e) => handleInputChange("address", e.target.value, true, "state")}
                      placeholder="Maharashtra"
                    />
                    <InputField
                      label="Zip Code"
                      value={formData.address.postalCode}
                      onChange={(e) => handleInputChange("address", e.target.value, true, "postalCode")}
                      placeholder="400001"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <MapIcon size={18} className="text-blue-600" />
                    Map Integration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Google Maps URL"
                      value={formData.address.googleMapUrl}
                      onChange={(e) => handleInputChange("address", e.target.value, true, "googleMapUrl")}
                      placeholder="https://maps.google.com/..."
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Latitude"
                        type="number"
                        step="any"
                        placeholder="19.0760"
                        onChange={(e) => {
                          const coords = [...(formData.address.location?.coordinates || [0, 0])];
                          coords[1] = parseFloat(e.target.value) || 0;
                          handleInputChange(
                            "address",
                            { ...formData.address.location, coordinates: coords },
                            true,
                            "location"
                          );
                        }}
                      />
                      <InputField
                        label="Longitude"
                        type="number"
                        step="any"
                        placeholder="72.8777"
                        onChange={(e) => {
                          const coords = [...(formData.address.location?.coordinates || [0, 0])];
                          coords[0] = parseFloat(e.target.value) || 0;
                          handleInputChange(
                            "address",
                            { ...formData.address.location, coordinates: coords },
                            true,
                            "location"
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <DynamicList
                    title="Nearby Landmarks"
                    items={formData.landmarks}
                    fields={[
                      { key: "name", placeholder: "Landmark Name (e.g., City Center Mall)" },
                      { key: "distance", placeholder: "Distance (e.g., 0.5 km)" },
                      { key: "type", placeholder: "Type (e.g., Metro, Airport)" },
                    ]}
                    onChange={(list) => handleListChange("landmarks", list)}
                  />
                </div>

                <div className="border-t pt-6">
                  <DynamicList
                    title="How to Reach (Directions)"
                    items={formData.directions}
                    fields={[
                      {
                        key: "type",
                        placeholder: "Transport Type (e.g., By Metro)",
                        options: fieldOptions.directionTypes,
                      },
                      { key: "description", placeholder: "Directions (e.g., Blue Line to Central - 5 min auto)" },
                    ]}
                    onChange={(list) => handleListChange("directions", list)}
                  />
                </div>
              </div>
            </Section>
          )}

          {/* === MEDIA SECTION === */}
          {activeSection === "media" && (
            <Section title="Content & Gallery" icon={ImageIcon}>
              <div className="space-y-6">
                <InputField
                  label="Short Description (Card View)"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                  maxLength={200}
                  placeholder="A brief tagline for search results..."
                  helperText={`${formData.shortDescription.length}/200 characters`}
                />

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Full Description
                  </label>
                  <textarea
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl h-40 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Detailed description of the vendor, services, history, etc..."
                    maxLength={5000}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.description.length}/5000 characters</p>
                </div>

                {/* Main Images Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Main Images <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      dragActive
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                    }`}
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
                      if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
                    }}
                  >
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Drag & Drop or{" "}
                      <label htmlFor="mainImages" className="text-blue-600 cursor-pointer hover:underline">
                        Browse Files
                      </label>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG, WEBP up to 5MB each</p>
                    <input
                      id="mainImages"
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </div>
                  {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}

                  {uploadedFiles.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                      {uploadedFiles.map((file, i) => (
                        <div
                          key={i}
                          className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group"
                        >
                          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                          {i === 0 && (
                            <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded font-bold">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video URL */}
                <InputField
                  label="Video URL (YouTube/Vimeo)"
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  icon={Video}
                />
              </div>
            </Section>
          )}

          {/* === STATS & HOURS SECTION === */}
          {activeSection === "stats" && (
            <Section title="Stats & Operations" icon={BarChart3}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InputField
                    label="Years of Experience"
                    type="number"
                    value={formData.yearsExperience}
                    onChange={(e) => handleInputChange("yearsExperience", parseInt(e.target.value) || 0)}
                    placeholder="15"
                  />
                  <InputField
                    label="Total Bookings"
                    type="number"
                    value={formData.bookings}
                    onChange={(e) => handleInputChange("bookings", parseInt(e.target.value) || 0)}
                    placeholder="2500"
                  />
                  <InputField
                    label="Rating (0-5)"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => handleInputChange("rating", parseFloat(e.target.value) || 0)}
                    placeholder="4.8"
                  />
                  <InputField
                    label="Review Count"
                    type="number"
                    value={formData.reviews}
                    onChange={(e) => handleInputChange("reviews", parseInt(e.target.value) || 0)}
                    placeholder="350"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Response Time"
                    value={formData.responseTime}
                    onChange={(e) => handleInputChange("responseTime", e.target.value)}
                    placeholder="Within 2 hours"
                  />
                  <InputField
                    label="Repeat Customer Rate"
                    value={formData.repeatCustomerRate}
                    onChange={(e) => handleInputChange("repeatCustomerRate", e.target.value)}
                    placeholder="45%"
                  />
                  <InputField
                    label="Response Rate"
                    value={formData.responseRate}
                    onChange={(e) => handleInputChange("responseRate", e.target.value)}
                    placeholder="98%"
                  />
                </div>

                {/* Stats Display Cards */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-600" />
                    Stats Display Cards (Overview Section)
                  </h4>
                  <DynamicList
                    title=""
                    items={formData.stats}
                    fields={[
                      { key: "label", placeholder: "Label (e.g., Total Bookings)" },
                      { key: "value", placeholder: "Value (e.g., 2,500+)" },
                      { key: "trend", placeholder: "Trend (e.g., +12%)" },
                    ]}
                    onChange={(list) => handleListChange("stats", list)}
                  />
                </div>

                {/* Highlights Cards */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-yellow-500" />
                    Highlights Cards (Header Section)
                  </h4>
                  <DynamicList
                    title=""
                    items={formData.highlights}
                    fields={[
                      {
                        key: "icon",
                        placeholder: "Icon (Trophy, Users, Timer, Medal)",
                        options: fieldOptions.highlightIcons,
                      },
                      { key: "label", placeholder: "Label (e.g., Top Rated)" },
                      { key: "value", placeholder: "Value (e.g., 4.8+)" },
                      {
                        key: "color",
                        placeholder: "Color (e.g., text-yellow-500)",
                        options: fieldOptions.highlightColors,
                      },
                    ]}
                    onChange={(list) => handleListChange("highlights", list)}
                  />
                </div>

                {/* Operating Hours */}
                <div className="border-t pt-6">
                  <DynamicList
                    title="Operating Hours"
                    items={formData.operatingHours}
                    fields={[
                      { key: "day", placeholder: "Day(s)", options: fieldOptions.days },
                      { key: "hours", placeholder: "Hours (e.g., 9 AM - 11 PM)" },
                    ]}
                    onChange={(list) => handleListChange("operatingHours", list)}
                  />
                </div>

                {/* Event Types */}
                <div className="border-t pt-6">
                  <MultiSelect
                    label="Event Types Supported"
                    options={fieldOptions.eventTypes}
                    value={formData.eventTypes}
                    onChange={(val) => handleInputChange("eventTypes", val)}
                  />
                </div>
              </div>
            </Section>
          )}

          {/* === PRICING SECTION === */}
          {activeSection === "pricing" && (
            <Section title="Pricing" icon={DollarSign}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField
                    label="Base Price (Starting)"
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => handleInputChange("basePrice", e.target.value)}
                    required
                    error={errors.basePrice}
                    placeholder="50000"
                    prefix="₹"
                  />
                  <CustomSelect
                    label="Price Unit"
                    options={fieldOptions.priceUnits}
                    value={formData.priceUnit}
                    onChange={(val) => handleInputChange("priceUnit", val)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label="Min Price"
                      type="number"
                      value={formData.perDayPrice.min}
                      onChange={(e) => handleInputChange("perDayPrice", e.target.value, true, "min")}
                      placeholder="50000"
                      prefix="₹"
                    />
                    <InputField
                      label="Max Price"
                      type="number"
                      value={formData.perDayPrice.max}
                      onChange={(e) => handleInputChange("perDayPrice", e.target.value, true, "max")}
                      placeholder="200000"
                      prefix="₹"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <MultiSelect
                    label="Payment Methods Accepted"
                    options={fieldOptions.paymentMethods}
                    value={formData.paymentMethods}
                    onChange={(val) => handleInputChange("paymentMethods", val)}
                  />
                </div>
              </div>
            </Section>
          )}

          {/* === CATEGORY SPECIFIC SECTION === */}
          {activeSection === "category" && (
            <Section
              title={`${categories.find((c) => c.key === activeCategory)?.label || "Category"} Details`}
              icon={Layers}
            >
              <CategorySpecificFields
                category={activeCategory}
                data={formData.categoryData}
                onChange={handleCategoryDataChange}
                onNestedChange={handleNestedCategoryDataChange}
                options={fieldOptions}
                errors={errors}
              />
            </Section>
          )}

          {/* === FEATURES SECTION === */}
          {activeSection === "features" && (
            <Section title="Features & Highlights" icon={Star}>
              <div className="space-y-6">
                <TagInput
                  label="Amenities"
                  tags={formData.amenities}
                  onChange={(v) => handleInputChange("amenities", v)}
                  suggestions={fieldOptions.amenities}
                  placeholder="Add amenity..."
                />

                <TagInput
                  label="Premium Facilities"
                  tags={formData.facilities}
                  onChange={(v) => handleInputChange("facilities", v)}
                  suggestions={fieldOptions.facilities}
                  placeholder="Add facility..."
                />

                <ListInput
                  label="Why Choose Us (Highlights)"
                  items={formData.highlightPoints}
                  onChange={(v) => handleInputChange("highlightPoints", v)}
                  placeholder="Add a highlight point..."
                />

                <div className="border-t pt-6">
                  <DynamicList
                    title="Awards & Recognition"
                    items={formData.awards}
                    fields={[
                      { key: "title", placeholder: "Award Title (e.g., Best Venue 2024)" },
                      { key: "year", placeholder: "Year (e.g., 2024)" },
                    ]}
                    onChange={(list) => handleListChange("awards", list)}
                  />
                </div>

                <div className="border-t pt-6">
                  <DynamicList
                    title="Special Offers"
                    items={formData.specialOffers}
                    fields={[
                      { key: "title", placeholder: "Offer Title (e.g., Early Bird Discount)" },
                      { key: "discount", placeholder: "Discount (e.g., 20% OFF)" },
                      { key: "description", placeholder: "Description" },
                    ]}
                    onChange={(list) => handleListChange("specialOffers", list)}
                  />
                </div>
              </div>
            </Section>
          )}

          {/* === PACKAGES SECTION === */}
          {activeSection === "packages" && (
            <Section title="Packages" icon={Gift}>
              <PackagesInput packages={formData.packages} onChange={(v) => handleInputChange("packages", v)} />
            </Section>
          )}

          {/* === POLICIES & FAQs SECTION === */}
          {activeSection === "policies" && (
            <Section title="Policies & FAQs" icon={FileText}>
              <div className="space-y-8">
                <PoliciesInput
                  policies={formData.policies}
                  onChange={(v) => handleInputChange("policies", v)}
                  iconOptions={fieldOptions.policyIcons}
                  colorOptions={fieldOptions.policyIconColors}
                />

                <div className="border-t pt-8">
                  <FAQsInput faqs={formData.faqs} onChange={(v) => handleInputChange("faqs", v)} />
                </div>
              </div>
            </Section>
          )}

          {/* === SOCIAL & SEO SECTION === */}
          {activeSection === "social" && (
            <Section title="Social Links & SEO" icon={Globe}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Website"
                    value={formData.socialLinks.website}
                    onChange={(e) => handleInputChange("socialLinks", e.target.value, true, "website")}
                    placeholder="https://www.yourwebsite.com"
                    icon={Globe}
                  />
                  <InputField
                    label="Instagram"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => handleInputChange("socialLinks", e.target.value, true, "instagram")}
                    placeholder="https://instagram.com/yourpage"
                    icon={Instagram}
                  />
                  <InputField
                    label="Facebook"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => handleInputChange("socialLinks", e.target.value, true, "facebook")}
                    placeholder="https://facebook.com/yourpage"
                    icon={Facebook}
                  />
                  <InputField
                    label="YouTube"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => handleInputChange("socialLinks", e.target.value, true, "youtube")}
                    placeholder="https://youtube.com/@yourchannel"
                    icon={Youtube}
                  />
                  <InputField
                    label="Twitter/X"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleInputChange("socialLinks", e.target.value, true, "twitter")}
                    placeholder="https://twitter.com/yourhandle"
                    icon={Twitter}
                  />
                  <InputField
                    label="LinkedIn"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleInputChange("socialLinks", e.target.value, true, "linkedin")}
                    placeholder="https://linkedin.com/company/yourcompany"
                    icon={Linkedin}
                  />
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Target size={18} className="text-green-600" />
                    SEO Settings
                  </h4>
                  <div className="space-y-4">
                    <InputField
                      label="Meta Title"
                      value={formData.metaTitle}
                      onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                      placeholder="SEO optimized title..."
                      maxLength={60}
                      helperText={`${formData.metaTitle?.length || 0}/60 characters`}
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Meta Description
                      </label>
                      <textarea
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl h-24 resize-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                        value={formData.metaDescription}
                        onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                        placeholder="SEO meta description..."
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.metaDescription?.length || 0}/160 characters
                      </p>
                    </div>
                    <TagInput
                      label="Meta Keywords"
                      tags={formData.metaKeywords}
                      onChange={(v) => handleInputChange("metaKeywords", v)}
                      placeholder="Add keyword..."
                    />
                  </div>
                </div>
              </div>
            </Section>
          )}

          {/* === FORM ACTIONS === */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t sticky bottom-0 bg-white dark:bg-gray-900 p-4 border rounded-2xl shadow-lg z-20">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-medium flex items-center justify-center gap-2 transition-colors"
              disabled={isSubmitting}
            >
              <RefreshCw size={18} />
              Reset Form
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Publish Vendor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex items-center gap-3">
      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InputField = ({ label, error, className = "", helperText, prefix, icon: Icon, ...props }) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <div className="relative">
      {Icon && <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{prefix}</span>}
      <input
        className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
          Icon ? "pl-10" : prefix ? "pl-8" : ""
        } ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
        {...props}
      />
    </div>
    {helperText && !error && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const CheckboxField = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div
      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
        checked ? "bg-blue-600 border-blue-600" : "border-gray-300 dark:border-gray-600 group-hover:border-blue-400"
      }`}
    >
      {checked && <Check size={14} className="text-white" />}
    </div>
    <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
  </label>
);

const CustomSelect = ({ label, options, value, onChange, error, required }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      }`}
    >
      <option value="">Select...</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const MultiSelect = ({ label, options, value = [], onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          onClick={() => onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt])}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            value.includes(opt)
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-blue-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const TagInput = ({ label, tags = [], onChange, suggestions = [], placeholder }) => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const add = (val) => {
    if (val.trim() && !tags.includes(val.trim())) {
      onChange([...tags, val.trim()]);
      setInput("");
    }
  };

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  );

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 min-h-[48px]">
        {tags.map((t) => (
          <span
            key={t}
            className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium flex items-center gap-1.5"
          >
            {t}
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-red-500">
              <X size={14} />
            </button>
          </span>
        ))}
        <div className="relative flex-1 min-w-[150px]">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add(input);
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="w-full outline-none bg-transparent text-sm text-gray-900 dark:text-gray-100"
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-40 overflow-auto z-10">
              {filteredSuggestions.slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => add(s)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ListInput = ({ label, items = [], onChange, placeholder }) => {
  const [input, setInput] = useState("");

  const add = () => {
    if (input.trim()) {
      onChange([...items, input.trim()]);
      setInput("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{label}</label>
      {items.length > 0 && (
        <ul className="space-y-2 mb-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Check size={14} className="text-green-500 flex-shrink-0" />
              <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{item}</span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

const DynamicList = ({ title, items = [], fields, onChange }) => {
  const add = () => {
    const newItem = fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});
    onChange([...items, newItem]);
  };

  const update = (idx, key, val) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [key]: val };
    onChange(updated);
  };

  return (
    <div>
      {title && <h4 className="text-sm font-bold mb-3 text-gray-900 dark:text-white">{title}</h4>}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {fields.map((f) =>
                f.options ? (
                  <select
                    key={f.key}
                    value={item[f.key] || ""}
                    onChange={(e) => update(idx, f.key, e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                  >
                    <option value="">{f.placeholder}</option>
                    {f.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    key={f.key}
                    placeholder={f.placeholder}
                    value={item[f.key] || ""}
                    onChange={(e) => update(idx, f.key, e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                  />
                )
              )}
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-2"
      >
        <Plus size={16} />
        Add Item
      </button>
    </div>
  );
};

const RangeField = ({ label, value = {}, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="number"
        placeholder="Min"
        value={value.min || ""}
        onChange={(e) => onChange({ ...value, min: e.target.value })}
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
      />
      <span className="text-gray-400">-</span>
      <input
        type="number"
        placeholder="Max"
        value={value.max || ""}
        onChange={(e) => onChange({ ...value, max: e.target.value })}
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
      />
    </div>
  </div>
);

// =============================================================================
// PACKAGES INPUT COMPONENT
// =============================================================================

const PackagesInput = ({ packages = [], onChange }) => {
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
  };

  const update = (i, field, value) => {
    const updated = [...packages];
    updated[i] = { ...updated[i], [field]: value };

    // Auto-calculate savings percentage
    if (field === "price" || field === "originalPrice") {
      const price = field === "price" ? value : updated[i].price;
      const originalPrice = field === "originalPrice" ? value : updated[i].originalPrice;
      if (price && originalPrice && originalPrice > price) {
        updated[i].savingsPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
      }
    }

    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {packages.map((pkg, i) => (
        <div
          key={i}
          className="border border-gray-200 dark:border-gray-700 p-5 rounded-xl relative bg-gray-50 dark:bg-gray-800/50"
        >
          <button
            type="button"
            onClick={() => onChange(packages.filter((_, idx) => idx !== i))}
            className="absolute top-3 right-3 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
          >
            <X size={16} />
          </button>

          {pkg.isPopular && (
            <div className="absolute -top-3 left-4">
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Sparkles size={12} />
                Most Popular
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 mt-2">
            <InputField
              label="Package Name"
              value={pkg.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder="e.g., Gold Package"
            />
            <InputField
              label="Price (₹)"
              type="number"
              value={pkg.price}
              onChange={(e) => update(i, "price", e.target.value)}
              placeholder="75000"
            />
            <InputField
              label="Original Price (₹)"
              type="number"
              value={pkg.originalPrice}
              onChange={(e) => update(i, "originalPrice", e.target.value)}
              placeholder="100000"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InputField
              label="Duration"
              value={pkg.duration}
              onChange={(e) => update(i, "duration", e.target.value)}
              placeholder="e.g., 12 hours"
            />
            <div className="flex items-end">
              <CheckboxField
                label="Mark as Popular"
                checked={pkg.isPopular}
                onChange={(e) => update(i, "isPopular", e.target.checked)}
              />
            </div>
            {pkg.savingsPercentage > 0 && (
              <div className="flex items-end">
                <span className="text-green-600 font-bold text-sm">Save {pkg.savingsPercentage}%</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TagInput
              label="Included Features"
              tags={pkg.features}
              onChange={(v) => update(i, "features", v)}
              placeholder="Add feature..."
            />
            <TagInput
              label="Not Included"
              tags={pkg.notIncluded}
              onChange={(v) => update(i, "notIncluded", v)}
              placeholder="Add exclusion..."
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Add Package
      </button>
    </div>
  );
};

// =============================================================================
// POLICIES INPUT COMPONENT
// =============================================================================

const PoliciesInput = ({ policies = [], onChange, iconOptions = [], colorOptions = [] }) => {
  const add = () => {
    onChange([...policies, { title: "", content: "", details: [], icon: "FileText", iconColor: "text-gray-500" }]);
  };

  const update = (i, field, value) => {
    const updated = [...policies];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  return (
    <div>
      <h4 className="font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <Shield size={18} className="text-blue-600" />
        Policies
      </h4>
      <div className="space-y-4">
        {policies.map((p, i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <InputField
                label="Policy Title"
                placeholder="e.g., Cancellation Policy"
                value={p.title}
                onChange={(e) => update(i, "title", e.target.value)}
              />
              <CustomSelect label="Icon" options={iconOptions} value={p.icon} onChange={(v) => update(i, "icon", v)} />
              <CustomSelect
                label="Icon Color"
                options={colorOptions}
                value={p.iconColor}
                onChange={(v) => update(i, "iconColor", v)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Summary</label>
              <textarea
                placeholder="Brief policy summary..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 h-20 resize-none"
                value={p.content}
                onChange={(e) => update(i, "content", e.target.value)}
              />
            </div>
            <ListInput
              label="Policy Details (Bullet Points)"
              items={p.details}
              onChange={(list) => update(i, "details", list)}
              placeholder="Add policy detail..."
            />
            <button
              type="button"
              onClick={() => onChange(policies.filter((_, idx) => idx !== i))}
              className="mt-3 text-red-500 text-sm font-medium hover:text-red-700"
            >
              Remove Policy
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg flex items-center gap-2"
      >
        <Plus size={16} />
        Add Policy
      </button>
    </div>
  );
};

// =============================================================================
// FAQS INPUT COMPONENT
// =============================================================================

const FAQsInput = ({ faqs = [], onChange }) => {
  const add = () => {
    onChange([...faqs, { question: "", answer: "" }]);
  };

  const update = (i, field, value) => {
    const updated = [...faqs];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  return (
    <div>
      <h4 className="font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <HelpCircle size={18} className="text-purple-600" />
        FAQs
      </h4>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
          >
            <InputField
              label="Question"
              placeholder="e.g., What is the maximum guest capacity?"
              value={f.question}
              onChange={(e) => update(i, "question", e.target.value)}
              className="mb-3"
            />
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Answer</label>
              <textarea
                placeholder="Detailed answer..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 h-24 resize-none"
                value={f.answer}
                onChange={(e) => update(i, "answer", e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => onChange(faqs.filter((_, idx) => idx !== i))}
              className="mt-3 text-red-500 text-sm font-medium hover:text-red-700"
            >
              Remove FAQ
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg flex items-center gap-2"
      >
        <Plus size={16} />
        Add FAQ
      </button>
    </div>
  );
};

// =============================================================================
// CATEGORY SPECIFIC FIELDS COMPONENT
// =============================================================================

const CategorySpecificFields = ({ category, data, onChange, onNestedChange, options, errors }) => {
  switch (category) {
    case "venues":
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RangeField
              label="Seating Capacity"
              value={data.seating || {}}
              onChange={(val) => onChange("seating", val)}
            />
            <RangeField
              label="Floating/Standing Capacity"
              value={data.floating || {}}
              onChange={(val) => onChange("floating", val)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputField
              label="Number of Halls"
              type="number"
              value={data.halls || ""}
              onChange={(e) => onChange("halls", parseInt(e.target.value) || 0)}
              placeholder="3"
            />
            <InputField
              label="Rooms Count"
              type="number"
              value={data.rooms?.count || ""}
              onChange={(e) => onNestedChange("rooms", "count", parseInt(e.target.value) || 0)}
              placeholder="10"
            />
            <InputField
              label="Parking Capacity"
              type="number"
              value={data.parking?.capacity || ""}
              onChange={(e) => onNestedChange("parking", "capacity", parseInt(e.target.value) || 0)}
              placeholder="200"
            />
            <CheckboxField
              label="Valet Parking Available"
              checked={data.parking?.valet || false}
              onChange={(e) => onNestedChange("parking", "valet", e.target.checked)}
            />
          </div>

          <MultiSelect
            label="Areas Available"
            options={options.venueAreas}
            value={data.areas || []}
            onChange={(v) => onChange("areas", v)}
          />

          <CustomSelect
            label="Food Policy"
            options={options.foodPolicies}
            value={data.foodPolicy || ""}
            onChange={(v) => onChange("foodPolicy", v)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <InputField
              label="Venue Type"
              value={data.venueType || ""}
              onChange={(e) => onChange("venueType", e.target.value)}
              placeholder="Banquet Hall"
            />
          </div>

          <DynamicList
            title="Technical Specifications"
            items={data.technicalSpecs || []}
            fields={[
              { key: "label", placeholder: "Specification (e.g., Hall Area)" },
              { key: "value", placeholder: "Value (e.g., 15,000 sq ft)" },
            ]}
            onChange={(list) => onChange("technicalSpecs", list)}
          />
        </div>
      );

    case "photographers":
      return (
        <div className="space-y-6">
          <TagInput
            label="Services Offered"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Delivery Time (Weeks)"
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
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CheckboxField
              label="Videography Included"
              checked={data.videographyIncluded || false}
              onChange={(e) => onChange("videographyIncluded", e.target.checked)}
            />
            <CheckboxField
              label="Drone Available"
              checked={data.droneAvailable || false}
              onChange={(e) => onChange("droneAvailable", e.target.checked)}
            />
          </div>

          <TagInput
            label="Equipment"
            tags={data.equipment || []}
            onChange={(v) => onChange("equipment", v)}
            placeholder="Add equipment..."
          />

          <TagInput
            label="Album Types"
            tags={data.albumTypes || []}
            onChange={(v) => onChange("albumTypes", v)}
            placeholder="Add album type..."
          />
        </div>
      );

    case "makeup":
      return (
        <div className="space-y-6">
          <TagInput
            label="Services Offered"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CheckboxField
              label="Trial Available"
              checked={data.trialPolicy?.available || false}
              onChange={(e) => onNestedChange("trialPolicy", "available", e.target.checked)}
            />
            <CheckboxField
              label="Trial is Paid"
              checked={data.trialPolicy?.paid || false}
              onChange={(e) => onNestedChange("trialPolicy", "paid", e.target.checked)}
            />
            <InputField
              label="Trial Price (₹)"
              type="number"
              value={data.trialPolicy?.price || ""}
              onChange={(e) => onNestedChange("trialPolicy", "price", parseInt(e.target.value) || 0)}
              placeholder="2000"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <CheckboxField
              label="Travel to Venue"
              checked={data.travelToVenue !== false}
              onChange={(e) => onChange("travelToVenue", e.target.checked)}
            />
            <CheckboxField
              label="Assistants Available"
              checked={data.assistantsAvailable || false}
              onChange={(e) => onChange("assistantsAvailable", e.target.checked)}
            />
          </div>

          <TagInput
            label="Makeup Styles"
            tags={data.makeupStyles || []}
            onChange={(v) => onChange("makeupStyles", v)}
            placeholder="Add style..."
          />
        </div>
      );

    case "catering":
      return (
        <div className="space-y-6">
          <TagInput
            label="Cuisines"
            tags={data.cuisines || []}
            onChange={(v) => onChange("cuisines", v)}
            suggestions={options.cuisines}
            placeholder="Add cuisine..."
          />

          <MultiSelect
            label="Menu Types"
            options={options.menuTypes}
            value={data.menuTypes || []}
            onChange={(v) => onChange("menuTypes", v)}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              label="Live Counters Available"
              checked={data.liveCounters || false}
              onChange={(e) => onChange("liveCounters", e.target.checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Price per Plate (Veg) ₹"
              type="number"
              value={data.pricePerPlate?.veg || ""}
              onChange={(e) => onNestedChange("pricePerPlate", "veg", parseInt(e.target.value) || 0)}
              placeholder="500"
            />
            <InputField
              label="Price per Plate (Non-Veg) ₹"
              type="number"
              value={data.pricePerPlate?.nonVeg || ""}
              onChange={(e) => onNestedChange("pricePerPlate", "nonVeg", parseInt(e.target.value) || 0)}
              placeholder="700"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CheckboxField
              label="Serving Staff Provided"
              checked={data.servingStaff !== false}
              onChange={(e) => onChange("servingStaff", e.target.checked)}
            />
            <CheckboxField
              label="Crockery Provided"
              checked={data.crockeryProvided !== false}
              onChange={(e) => onChange("crockeryProvided", e.target.checked)}
            />
            <CheckboxField
              label="Tasting Session"
              checked={data.tastingSession || false}
              onChange={(e) => onChange("tastingSession", e.target.checked)}
            />
          </div>

          <TagInput
            label="Special Diets Supported"
            tags={data.specialDiets || []}
            onChange={(v) => onChange("specialDiets", v)}
            placeholder="Add diet type..."
          />
        </div>
      );

    case "djs":
      return (
        <div className="space-y-6">
          <TagInput
            label="Genres"
            tags={data.genres || []}
            onChange={(v) => onChange("genres", v)}
            suggestions={options.genres}
            placeholder="Add genre..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Performance Duration"
              value={data.performanceDuration || ""}
              onChange={(e) => onChange("performanceDuration", e.target.value)}
              placeholder="4 Hours"
            />
            <InputField
              label="Sound System Power"
              value={data.soundSystemPower || ""}
              onChange={(e) => onChange("soundSystemPower", e.target.value)}
              placeholder="10,000 Watts"
            />
            <InputField
              label="Setup Time Required"
              value={data.setupTime || ""}
              onChange={(e) => onChange("setupTime", e.target.value)}
              placeholder="2 Hours"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CheckboxField
              label="Equipment Provided"
              checked={data.equipmentProvided !== false}
              onChange={(e) => onChange("equipmentProvided", e.target.checked)}
            />
            <CheckboxField
              label="Backup Available"
              checked={data.backupAvailable !== false}
              onChange={(e) => onChange("backupAvailable", e.target.checked)}
            />
            <CheckboxField
              label="Lighting Included"
              checked={data.lightingIncluded || false}
              onChange={(e) => onChange("lightingIncluded", e.target.checked)}
            />
            <CheckboxField
              label="Emcee Services"
              checked={data.emceeServices || false}
              onChange={(e) => onChange("emceeServices", e.target.checked)}
            />
          </div>
        </div>
      );

    case "clothes":
      return (
        <div className="space-y-6">
          <TagInput
            label="Outfit Types"
            tags={data.outfitTypes || []}
            onChange={(v) => onChange("outfitTypes", v)}
            suggestions={options.outfitTypes}
            placeholder="Add outfit type..."
          />

          <CustomSelect
            label="Wear Category"
            options={options.wearTypes}
            value={data.wearType || ""}
            onChange={(v) => onChange("wearType", v)}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              label="Fitting Sessions"
              type="number"
              value={data.fittingSessions || ""}
              onChange={(e) => onChange("fittingSessions", parseInt(e.target.value) || 0)}
              placeholder="3"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CheckboxField
              label="Customization Available"
              checked={data.customization || false}
              onChange={(e) => onChange("customization", e.target.checked)}
            />
            <CheckboxField
              label="Rental Available"
              checked={data.rentalAvailable || false}
              onChange={(e) => onChange("rentalAvailable", e.target.checked)}
            />
            <CheckboxField
              label="Alterations Included"
              checked={data.alterationsIncluded || false}
              onChange={(e) => onChange("alterationsIncluded", e.target.checked)}
            />
          </div>

          <TagInput
            label="Designers"
            tags={data.designers || []}
            onChange={(v) => onChange("designers", v)}
            placeholder="Add designer..."
          />
        </div>
      );

    case "mehendi":
      return (
        <div className="space-y-6">
          <TagInput
            label="Design Styles"
            tags={data.designs || []}
            onChange={(v) => onChange("designs", v)}
            suggestions={options.mehendiDesigns}
            placeholder="Add design style..."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Price per Hand (₹)"
              type="number"
              value={data.pricePerHand || ""}
              onChange={(e) => onChange("pricePerHand", parseInt(e.target.value) || 0)}
              placeholder="500"
            />
            <InputField
              label="Bridal Package Price (₹)"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Drying Time"
              value={data.dryingTime || ""}
              onChange={(e) => onChange("dryingTime", e.target.value)}
              placeholder="30 minutes"
            />
            <InputField
              label="Color Guarantee"
              value={data.colorGuarantee || ""}
              onChange={(e) => onChange("colorGuarantee", e.target.value)}
              placeholder="Dark maroon guaranteed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CheckboxField
              label="100% Organic"
              checked={data.organic !== false}
              onChange={(e) => onChange("organic", e.target.checked)}
            />
            <CheckboxField
              label="Travel to Venue"
              checked={data.travelToVenue !== false}
              onChange={(e) => onChange("travelToVenue", e.target.checked)}
            />
          </div>
        </div>
      );

    case "cakes":
      return (
        <div className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Price per Kg (₹)"
              type="number"
              value={data.pricePerKg || ""}
              onChange={(e) => onChange("pricePerKg", parseInt(e.target.value) || 0)}
              placeholder="1500"
            />
            <InputField
              label="Min Order Weight (Kg)"
              type="number"
              step="0.5"
              value={data.minOrderWeight || ""}
              onChange={(e) => onChange("minOrderWeight", parseFloat(e.target.value) || 0)}
              placeholder="1"
            />
            <InputField
              label="Advance Booking (Days)"
              type="number"
              value={data.advanceBookingDays || ""}
              onChange={(e) => onChange("advanceBookingDays", parseInt(e.target.value) || 0)}
              placeholder="3"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CheckboxField
              label="Delivery Available"
              checked={data.deliveryAvailable !== false}
              onChange={(e) => onChange("deliveryAvailable", e.target.checked)}
            />
            <CheckboxField
              label="Custom Designs"
              checked={data.customDesigns !== false}
              onChange={(e) => onChange("customDesigns", e.target.checked)}
            />
            <CheckboxField
              label="Eggless Options"
              checked={data.eggless || false}
              onChange={(e) => onChange("eggless", e.target.checked)}
            />
            <CheckboxField
              label="Sugar-Free Options"
              checked={data.sugarFree || false}
              onChange={(e) => onChange("sugarFree", e.target.checked)}
            />
          </div>
        </div>
      );

    case "jewellery":
      return (
        <div className="space-y-6">
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
            placeholder="7 days return with full refund"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CheckboxField
              label="Customization"
              checked={data.customization || false}
              onChange={(e) => onChange("customization", e.target.checked)}
            />
            <CheckboxField
              label="Rental Available"
              checked={data.rentalAvailable || false}
              onChange={(e) => onChange("rentalAvailable", e.target.checked)}
            />
            <CheckboxField
              label="Certification Provided"
              checked={data.certificationProvided || false}
              onChange={(e) => onChange("certificationProvided", e.target.checked)}
            />
            <CheckboxField
              label="Insurance Available"
              checked={data.insuranceAvailable || false}
              onChange={(e) => onChange("insuranceAvailable", e.target.checked)}
            />
            <CheckboxField
              label="Home Trial Available"
              checked={data.homeTrialAvailable || false}
              onChange={(e) => onChange("homeTrialAvailable", e.target.checked)}
            />
          </div>
        </div>
      );

    case "invitations":
      return (
        <div className="space-y-6">
          <TagInput
            label="Invitation Types"
            tags={data.types || []}
            onChange={(v) => onChange("types", v)}
            suggestions={options.invitationTypes}
            placeholder="Add type..."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Min Order Quantity"
              type="number"
              value={data.minOrderQuantity || ""}
              onChange={(e) => onChange("minOrderQuantity", parseInt(e.target.value) || 0)}
              placeholder="50"
            />
            <InputField
              label="Digital Delivery Time"
              value={data.digitalDeliveryTime || ""}
              onChange={(e) => onChange("digitalDeliveryTime", e.target.value)}
              placeholder="2 Days"
            />
            <InputField
              label="Physical Delivery Time"
              value={data.physicalDeliveryTime || ""}
              onChange={(e) => onChange("physicalDeliveryTime", e.target.value)}
              placeholder="7 Days"
            />
          </div>

          <CheckboxField
            label="Custom Design Available"
            checked={data.customDesign !== false}
            onChange={(e) => onChange("customDesign", e.target.checked)}
          />

          <TagInput
            label="Printing Methods"
            tags={data.printingMethods || []}
            onChange={(v) => onChange("printingMethods", v)}
            placeholder="Add printing method..."
          />

          <TagInput
            label="Paper Types"
            tags={data.paperTypes || []}
            onChange={(v) => onChange("paperTypes", v)}
            placeholder="Add paper type..."
          />

          <TagInput
            label="Languages Supported"
            tags={data.languages || []}
            onChange={(v) => onChange("languages", v)}
            placeholder="Add language..."
          />
        </div>
      );

    case "hairstyling":
      return (
        <div className="space-y-6">
          <TagInput
            label="Hairstyles"
            tags={data.styles || []}
            onChange={(v) => onChange("styles", v)}
            placeholder="Add hairstyle..."
          />

          <TagInput
            label="Products Used"
            tags={data.productsUsed || []}
            onChange={(v) => onChange("productsUsed", v)}
            placeholder="Add product/brand..."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CheckboxField
              label="Extensions Provided"
              checked={data.extensionsProvided || false}
              onChange={(e) => onChange("extensionsProvided", e.target.checked)}
            />
            <CheckboxField
              label="Draping Included"
              checked={data.drapingIncluded || false}
              onChange={(e) => onChange("drapingIncluded", e.target.checked)}
            />
            <CheckboxField
              label="Travel to Venue"
              checked={data.travelToVenue !== false}
              onChange={(e) => onChange("travelToVenue", e.target.checked)}
            />
            <CheckboxField
              label="Trial Available"
              checked={data.trialAvailable !== false}
              onChange={(e) => onChange("trialAvailable", e.target.checked)}
            />
            <CheckboxField
              label="Accessories Provided"
              checked={data.accessoriesProvided || false}
              onChange={(e) => onChange("accessoriesProvided", e.target.checked)}
            />
          </div>
        </div>
      );

    case "planners":
      return (
        <div className="space-y-6">
          <TagInput
            label="Specializations"
            tags={data.specializations || []}
            onChange={(v) => onChange("specializations", v)}
            placeholder="Add specialization..."
          />

          <TagInput
            label="Events Managed"
            tags={data.eventsManaged || []}
            onChange={(v) => onChange("eventsManaged", v)}
            placeholder="Add event type..."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Team Size"
              type="number"
              value={data.teamSize || ""}
              onChange={(e) => onChange("teamSize", parseInt(e.target.value) || 0)}
              placeholder="10"
            />
            <InputField
              label="Vendor Network Size"
              type="number"
              value={data.vendorNetwork || ""}
              onChange={(e) => onChange("vendorNetwork", parseInt(e.target.value) || 0)}
              placeholder="100"
            />
            <CustomSelect
              label="Fee Structure"
              options={["Fixed Fee", "Percentage of Budget", "Hourly"]}
              value={data.feeStructure || ""}
              onChange={(v) => onChange("feeStructure", v)}
            />
          </div>

          <RangeField
            label="Budget Range Handled (₹)"
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
        <div className="space-y-6">
          <InputField
            label="Service Type"
            value={data.serviceType || ""}
            onChange={(e) => onChange("serviceType", e.target.value)}
            placeholder="e.g., Event Decoration, Tent House"
            required
          />

          <DynamicList
            title="Custom Fields"
            items={data.customFields || []}
            fields={[
              { key: "label", placeholder: "Field Name" },
              { key: "value", placeholder: "Field Value" },
            ]}
            onChange={(list) => onChange("customFields", list)}
          />
        </div>
      );

    default:
      return (
        <div className="text-center py-8 text-gray-500">
          <p>Select a category to see specific fields</p>
        </div>
      );
  }
};
