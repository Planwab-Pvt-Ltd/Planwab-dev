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
import SmartMedia from "@/components/mobile/SmartMediaLoader";

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
  const [activeTab, setActiveTab] = useState("overview");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const timerControls = useAnimation();

  const similarRef = useRef(null);
  const recommendedRef = useRef(null);
  const tabsRef = useRef(null);

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

  const handleViewAllPhotos = () => {
    setModalImageIndex(0);
    setShowImageModal(true);
  };

  const handleImageClick = (index) => {
    setModalImageIndex(index);
    setShowImageModal(true);
  };
  const handleModalClose = () => setShowImageModal(false);
  const handleModalNext = () => setModalImageIndex((prev) => (prev + 1) % vendor.images.length);
  const handleModalPrev = () => setModalImageIndex((prev) => (prev - 1 + vendor.images.length) % vendor.images.length);

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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

  // Removed Reviews from tabs
  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "amenities", label: "Amenities", icon: Star },
    { id: "gallery", label: "Gallery", icon: Camera },
    { id: "location", label: "Location", icon: MapPin },
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 overflow-x-hidden">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link
            href={`/vendors/marketplace/${vendor.category.toLowerCase()}`}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
          >
            <ArrowLeft size={22} />
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked ? "text-red-500 bg-red-50 dark:bg-red-900/20" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <Heart size={22} className={isLiked ? "fill-current" : ""} />
            </button>
            <button onClick={() => setShowShareModal(true)} className="p-2 text-gray-600 dark:text-gray-300">
              <Share2 size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-500 dark:text-gray-400">
          <ol className="flex items-center space-x-1 overflow-hidden whitespace-nowrap">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <ChevronRight size={12} />
            </li>
            <li>
              <a href={`/vendors/marketplace/${vendor.category.toLowerCase()}`}>{vendor.category}</a>
            </li>
            <li>
              <ChevronRight size={12} />
            </li>
            <li className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px]">{vendor.name}</li>
          </ol>
        </nav>

        {/* Carousel Section (Restored Original Effects & Timer) */}
        <div className="space-y-4">
          <div
            className="relative rounded-3xl overflow-hidden shadow-lg h-[280px] w-full bg-gray-200 dark:bg-gray-800"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={vendor.images[currentImageIndex]}
                alt={vendor.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                onClick={() => handleImageClick(currentImageIndex)}
              />
            </AnimatePresence>

            {/* Tags Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none z-10">
              {vendor.tags?.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Progress Bar Timer (Restored) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none z-10">
              {vendor.images.slice(0, 5).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full overflow-hidden transition-all duration-300 ${
                    idx === currentImageIndex ? "w-8 bg-white/30" : "w-2 bg-white/30"
                  }`}
                >
                  {idx === currentImageIndex && <motion.div className="h-full bg-white" animate={timerControls} />}
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls & View All (Outside Image) */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200 active:scale-95 transition-transform"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200 active:scale-95 transition-transform"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <button
              onClick={handleViewAllPhotos}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-semibold text-gray-900 dark:text-gray-100 active:bg-gray-200 transition-colors"
            >
              <Grid size={16} />
              View All Photos
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">{vendor.name}</h1>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                  <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-bold text-sm text-yellow-700 dark:text-yellow-400">{vendor.rating}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">({vendor.reviews} reviews)</span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 truncate">
                  <MapPin size={14} />
                  <span className="truncate">{vendor.address.city}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex flex-col gap-1 mb-4">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Starting from</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{displayPrice}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">per day</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button className="flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl font-semibold shadow-md active:scale-95 transition-transform">
                  <Calendar size={18} />
                  Book Now
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-md active:scale-95 transition-transform">
                  <Phone size={18} />
                  Contact
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 dark:text-gray-400">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 mb-0.5">{vendor?.seating?.max}</div>
                  Capacity
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 mb-0.5">{vendor?.parking}</div>
                  Parking
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 mb-0.5">{vendor?.rooms?.max}</div>
                  Rooms
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section (Mobile Optimized & Scrollbar Hidden) */}
        <div className="sticky top-[60px] z-30 bg-gray-50 dark:bg-gray-900 pt-2 pb-2 -mx-4 px-4 overflow-hidden ">
          <div ref={tabsRef} className="flex gap-3 overflow-x-auto w-full !no-scrollbar ![&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white border-purple-600 shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">About</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {showFullDescription ? vendor.description : `${vendor.description.substring(0, 150)}...`}
                    </p>
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-purple-600 dark:text-purple-400 text-sm font-semibold mt-2"
                    >
                      {showFullDescription ? "Show Less" : "Read More"}
                    </button>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Contact Info</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Contact Person</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {vendor.contactPerson.firstName} {vendor.contactPerson.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                          <Phone size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{vendor.phoneNo}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                          <Mail size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{vendor.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "amenities" && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Amenities</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {vendor.amenities.map((amenity, index) => {
                      const IconComponent = amenityIcons[amenity] || Check;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl"
                        >
                          <IconComponent size={18} className="text-purple-600 dark:text-purple-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-6 mb-4">Facilities</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {vendor.facilities.map((facility, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/30"
                      >
                        <Building2 size={18} className="text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "gallery" && (
                <div className="grid grid-cols-2 gap-3">
                  {vendor.images.map((image, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleImageClick(idx)}
                      className="aspect-square rounded-2xl overflow-hidden shadow-sm"
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "location" && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={24} className="text-purple-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{vendor.address.street}</p>
                      <p className="text-xs text-gray-500">
                        {vendor.address.city}, {vendor.address.state} {vendor.address.postalCode}
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <MapIcon size={32} className="mx-auto mb-1" />
                      <span className="text-xs">Map View</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Similar Venues Section (One Row Scrollable & Hidden Scrollbar) */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Similar Venues</h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollContainer(similarRef, "left")}
                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center active:scale-95"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => scrollContainer(similarRef, "right")}
                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center active:scale-95"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div
            ref={similarRef}
            className="flex gap-4 overflow-x-auto snap-x scroll-smooth pb-4 no-scrollbar [&::-webkit-scrollbar]:hidden"
          >
            {similarVendors.length > 0 ? (
              similarVendors.map((item) => (
                <Link
                  href={`/vendor/${item?.category}/${item._id}`}
                  key={item._id}
                  className="min-w-[260px] snap-start"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 h-full">
                    <div className="h-36 relative">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-xs text-white flex items-center gap-1">
                        <Star size={10} className="fill-white" /> {item.rating}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2 truncate">{item.address?.city || "City"}</p>
                      <p className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                        ₹{item.perDayPrice?.min?.toLocaleString("en-IN") || "N/A"}
                        <span className="text-xs font-normal text-gray-400">/day</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="w-full py-8 text-center text-gray-500 text-sm">No similar venues found.</div>
            )}
          </div>
        </div>

        {/* Static Banner 2 - High Priority */}
        <div className="mx-1 mt-2 px-2 mb-6 pb-4">
          <Link href={`/m/events/wedding`}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="w-full aspect-[4/2.3] relative rounded-xl overflow-hidden"
            >
              <SmartMedia
                src={`/Banners/banner4.png`}
                type="image"
                className="w-full h-full object-cover object-center"
                loaderImage="/GlowLoadingGif.gif"
                priority={true}
              />
            </motion.div>
          </Link>
        </div>

        {/* Recommended Section (Two Rows Scrollable & Hidden Scrollbar) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recommended</h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollContainer(recommendedRef, "left")}
                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center active:scale-95"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => scrollContainer(recommendedRef, "right")}
                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center active:scale-95"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div
            ref={recommendedRef}
            className="grid grid-rows-2 grid-flow-col auto-cols-[85%] sm:auto-cols-[300px] gap-3 overflow-x-auto snap-x scroll-smooth pb-4 no-scrollbar [&::-webkit-scrollbar]:hidden"
          >
            {recommendedVendors.length > 0 ? (
              recommendedVendors.map((item) => (
                <Link href={`/vendor/${item?.category}/${item._id}`} key={item._id} className="snap-start h-full">
                  <div className="flex gap-3 bg-white dark:bg-gray-800 rounded-xl p-2.5 shadow-sm border border-gray-100 dark:border-gray-700 h-full items-center">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-1">
                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.rating}</span>
                      </div>
                      <p className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                        ₹{item.perDayPrice?.min?.toLocaleString("en-IN") || "N/A"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="w-full py-8 text-center text-gray-500 text-sm col-span-full">
                No recommendations available.
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section (Moved to Bottom) */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Reviews</h2>
            <div className="flex items-center gap-2">
              <Star size={18} className="text-yellow-500 fill-yellow-500" />
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{vendor.rating}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">({vendor.reviews})</span>
            </div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                      R
                    </div>
                    <span className="text-sm font-semibold dark:text-gray-200">Reviewer Name</span>
                  </div>
                  <span className="text-xs text-gray-400">2w ago</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Great experience overall. The service was impeccable and the venue was exactly as described.
                </p>
              </div>
            ))}
            <button className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium rounded-xl text-sm mt-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              View All Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-[70]"
            onClick={handleModalClose}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <button onClick={handleModalClose} className="absolute top-4 right-4 text-white p-2 z-20">
                <X size={28} />
              </button>
              <motion.img
                key={modalImageIndex}
                src={vendor.images[modalImageIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalPrev();
                }}
                className="absolute left-4 p-3 bg-white/10 rounded-full text-white backdrop-blur-sm"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalNext();
                }}
                className="absolute right-4 p-3 bg-white/10 rounded-full text-white backdrop-blur-sm"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        )}
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[60]"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6 sm:hidden" />
              <h3 className="text-xl font-bold text-center mb-6 dark:text-white">Share Venue</h3>
              <div className="grid grid-cols-3 gap-4">
                <button onClick={() => handleShare("facebook")} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Facebook size={24} />
                  </div>
                  <span className="text-xs font-medium dark:text-gray-300">Facebook</span>
                </button>
                <button onClick={() => handleShare("twitter")} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-500">
                    <Twitter size={24} />
                  </div>
                  <span className="text-xs font-medium dark:text-gray-300">Twitter</span>
                </button>
                <button onClick={() => handleShare("copy")} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300">
                    <Copy size={24} />
                  </div>
                  <span className="text-xs font-medium dark:text-gray-300">Copy Link</span>
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
