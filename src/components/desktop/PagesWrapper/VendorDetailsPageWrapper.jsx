"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Grid,
  List,
  Eye,
  ThumbsUp,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import DetailsPageSkeleton from "../ui/skeletons/DetailsPageSkeleton";
import Link from "next/link";

const VendorDetailsPageWrapper = () => {
  const { id } = useParams();
  const { activeCategory } = useCategoryStore();

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [similarVendors, setSimilarVendors] = useState([]);
  const [recommendedVendors, setRecommendedVendors] = useState([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [listsError, setListsError] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const timerControls = useAnimation();

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

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  useEffect(() => {
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

    if (vendor) {
      fetchLists();
    }
  }, [id, vendor]);

  useEffect(() => {
    const timer = !isPaused
      ? setInterval(() => setCurrentImageIndex((prev) => (prev + 1) % (vendor?.images.length || 1)), 4000)
      : null;
    return () => clearInterval(timer);
  }, [isPaused, vendor?.images.length]);

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

  if (loading) {
    return <DetailsPageSkeleton />;
  }

  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  if (!vendor) return <div className="flex items-center justify-center h-screen">Vendor not found.</div>;

  const displayPrice = vendor.perDayPrice?.min?.toLocaleString("en-IN") || "N/A";
  const displayMaxPrice = vendor.perDayPrice?.max?.toLocaleString("en-IN") || "N/A";

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "amenities", label: "Amenities", icon: Star },
    { id: "gallery", label: "Gallery", icon: Camera },
    { id: "location", label: "Location", icon: MapPin },
    { id: "reviews", label: "Reviews", icon: MessageCircle },
  ];

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

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-18`}
    >
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
                className={`p-2 rounded-full transition-all duration-300 ${
                  isLiked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                  {vendor.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative h-2 rounded-full overflow-hidden transition-all duration-500 ${
                        idx === currentImageIndex ? "w-8 bg-white/40" : "w-2 bg-white/40"
                      }`}
                    >
                      {idx === currentImageIndex && (
                        <motion.div className="absolute top-0 left-0 h-full bg-white" animate={timerControls} />
                      )}
                    </button>
                  ))}
                </div>
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
                    {vendor.images.map((image, idx) => (
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
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-all duration-300 relative ${
                      activeTab === tab.id
                        ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                      />
                    )}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          About This Venue
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {showFullDescription ? vendor.description : `${vendor.description.substring(0, 200)}...`}
                        </p>
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-purple-600 dark:text-purple-400 font-medium mt-2 hover:underline"
                        >
                          {showFullDescription ? "Show Less" : "Read More"}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Capacity Details</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <span className="text-gray-600 dark:text-gray-400">Seating Capacity</span>
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {vendor?.seating?.min} - {vendor?.seating?.max} guests
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <span className="text-gray-600 dark:text-gray-400">Rooms Available</span>
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {vendor?.rooms?.min} - {vendor?.rooms?.max}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <span className="text-gray-600 dark:text-gray-400">Parking Slots</span>
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {typeof vendor?.parking === 'object' ? vendor?.parking?.capacity || 'N/A' : vendor?.parking || 'N/A'} vehicles
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Contact Information</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <User size={18} className="text-gray-500" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {vendor.contactPerson.firstName} {vendor.contactPerson.lastName}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <Phone size={18} className="text-gray-500" />
                              <span className="text-gray-700 dark:text-gray-300">{vendor.phoneNo}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <Mail size={18} className="text-gray-500" />
                              <span className="text-gray-700 dark:text-gray-300">{vendor.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "amenities" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                          Available Amenities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {vendor.amenities.map((amenity, index) => {
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
                          {vendor.facilities.map((facility, index) => (
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
                            className={`p-2 rounded-lg transition-colors ${
                              viewMode === "grid"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <Grid size={18} />
                          </button>
                          <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-colors ${
                              viewMode === "list"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <List size={18} />
                          </button>
                        </div>
                      </div>
                      <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-6" : "space-y-4"}>
                        {vendor.images.map((image, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative group cursor-pointer ${
                              viewMode === "list" ? "flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl" : ""
                            }`}
                            onClick={() => handleImageClick(idx)}
                          >
                            <div className="relative overflow-hidden rounded-2xl shadow-lg">
                              <img
                                src={image}
                                alt={`${vendor.name} ${idx + 1}`}
                                className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                                  viewMode === "list" ? "w-24 h-24" : "w-full h-48"
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
                              {vendor.availableAreas.map((area, idx) => (
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
                      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <MapIcon size={48} className="text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Interactive Map Coming Soon</p>
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
                                  width: `${
                                    rating === 5 ? 65 : rating === 4 ? 25 : rating === 3 ? 8 : rating === 2 ? 2 : 0
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
                                          className={`${
                                            i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
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
                              className={`${
                                i < Math.floor(vendor.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
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
                                  className={`${
                                    i < Math.floor(item.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
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
                                className={`${
                                  i < Math.floor(item.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
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
