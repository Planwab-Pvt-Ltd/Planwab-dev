// ViewVendorTab.jsx
"use client";

import { useState, createContext, useContext, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
  Calendar,
  Clock,
  Users,
  Gift,
  Star,
  Award,
  Shield,
  Globe,
  DollarSign,
  Building2,
  CheckCircle,
  XCircle,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  ExternalLink,
  Edit,
  Trash2,
  ChevronRight,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Heart,
  Eye,
  Share2,
  Navigation,
  Zap,
  Target,
  BarChart3,
  HelpCircle,
  Tag,
  Percent,
  X,
  Play,
  ImageIcon,
  Copy,
  Download,
  Printer,
  AlertCircle,
  Info,
  ChevronLeft,
  Layers,
  Package,
  Camera,
  Video,
  ArrowLeft,
  Maximize2,
  ZoomIn,
  ChevronDown,
  ChevronUp,
  BookOpen,
  UserCircle,
  Paintbrush2,
  UtensilsCrossed,
  Music,
  Shirt,
  Hand,
  CakeSlice,
  Gem,
  Scissors,
  RefreshCw,
  AlertTriangle,
  Quote,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";

// ============================================================================
// TOAST CONTEXT & PROVIDER
// ============================================================================
const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
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
              className={`pointer-events-auto p-4 rounded-xl shadow-2xl border backdrop-blur-sm flex items-start gap-3 ${
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
                {toast.type === "success" && <CheckCircle size={18} />}
                {toast.type === "error" && <AlertCircle size={18} />}
                {toast.type === "warning" && <AlertTriangle size={18} />}
                {toast.type === "info" && <Info size={18} />}
              </div>
              <p className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
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
export default function ViewVendorTab({ vendor, onBack, onEdit, onDelete }) {
  return (
    <ToastProvider>
      <ViewVendorContent vendor={vendor} onBack={onBack} onEdit={onEdit} onDelete={onDelete} />
    </ToastProvider>
  );
}

// ============================================================================
// MAIN CONTENT COMPONENT
// ============================================================================
function ViewVendorContent({ vendor, onBack, onEdit, onDelete }) {
  const { addToast } = useToast();
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!vendor) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900 rounded-2xl">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No vendor data available</p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  const sections = [
    { id: "overview", label: "Overview", icon: Eye, count: null },
    { id: "media", label: "Media", icon: ImageIcon, count: vendor.images?.length || 0 },
    { id: "location", label: "Location", icon: MapPin, count: null },
    { id: "pricing", label: "Pricing", icon: DollarSign, count: null },
    { id: "category", label: "Category Details", icon: Layers, count: null },
    { id: "features", label: "Features", icon: Star, count: vendor.amenities?.length || 0 },
    { id: "packages", label: "Packages", icon: Gift, count: vendor.packages?.length || 0 },
    { id: "policies", label: "Policies", icon: Shield, count: vendor.policies?.length || 0 },
    { id: "social", label: "Social & SEO", icon: Globe, count: null },
    { id: "profile", label: "Vendor Profile", icon: UserCircle, count: null },
  ];

  const categories = [
    { key: "venues", label: "Venues", icon: Building2 },
    { key: "photographers", label: "Photographers", icon: Camera },
    { key: "makeup", label: "Makeup", icon: Paintbrush2 },
    { key: "planners", label: "Planners", icon: UserCircle },
    { key: "catering", label: "Catering", icon: UtensilsCrossed },
    { key: "clothes", label: "Clothes", icon: Shirt },
    { key: "mehendi", label: "Mehendi", icon: Hand },
    { key: "cakes", label: "Cakes", icon: CakeSlice },
    { key: "jewellery", label: "Jewellery", icon: Gem },
    { key: "invitations", label: "Invitations", icon: Mail },
    { key: "djs", label: "DJs", icon: Music },
    { key: "hairstyling", label: "Hairstyling", icon: Scissors },
    { key: "other", label: "Other", icon: FileText },
  ];

  const categoryInfo = categories.find((c) => c.key === vendor.category);

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    addToast(`${field} copied to clipboard!`, "success");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/vendor/${vendor?.category || "vendor"}/${vendor._id}`;
    if (navigator.share) {
      navigator
        .share({
          title: vendor.name,
          text: vendor.shortDescription || vendor.description?.slice(0, 100),
          url: url,
        })
        .then(() => addToast("Shared successfully!", "success"))
        .catch(() => {});
    } else {
      copyToClipboard(url, "Share URL");
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    addToast("Preparing vendor data for download...", "info");

    try {
      const dataStr = JSON.stringify(vendor, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `vendor-${vendor.username || vendor._id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addToast("Vendor data downloaded successfully!", "success");
    } catch (error) {
      addToast("Failed to download vendor data", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    addToast("Opening print dialog...", "info");
    window.print();
  };

  const calculateCompleteness = () => {
    let filled = 0;
    let total = 20;

    if (vendor.name) filled++;
    if (vendor.email) filled++;
    if (vendor.phoneNo) filled++;
    if (vendor.description) filled++;
    if (vendor.address?.city) filled++;
    if (vendor.images?.length > 0) filled++;
    if (vendor.basePrice) filled++;
    if (vendor.amenities?.length > 0) filled++;
    if (vendor.facilities?.length > 0) filled++;
    if (vendor.packages?.length > 0) filled++;
    if (vendor.operatingHours?.length > 0) filled++;
    if (vendor.eventTypes?.length > 0) filled++;
    if (vendor.tags?.length > 0) filled++;
    if (vendor.paymentMethods?.length > 0) filled++;
    if (vendor.socialLinks?.website || vendor.socialLinks?.instagram) filled++;
    if (vendor.policies?.length > 0) filled++;
    if (vendor.faqs?.length > 0) filled++;
    if (vendor.videoUrl) filled++;
    if (vendor.contactPerson?.firstName) filled++;
    if (vendor.rating) filled++;

    return Math.round((filled / total) * 100);
  };

  const completeness = calculateCompleteness();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-2 sm:px-4 lg:px-6 w-full max-w-full overflow-x-hidden box-border">
      <div className="w-full max-w-7xl mx-auto overflow-hidden space-y-6">
        {/* Back Navigation */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to All Vendors</span>
          </button>
        )}

        {/* Main Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header Section with Cover Photo */}
          <div className="relative h-48 md:h-64 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

            {/* Cover Image */}
            {(vendor.defaultImage || vendor.images?.[0]) && (
              <Image
                src={vendor.images[1] || vendor.defaultImage}
                alt={vendor.name}
                fill
                className="object-cover opacity-30"
                priority
              />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Profile Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                {/* Profile Picture */}
                <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl bg-white flex-shrink-0 group">
                  <Image
                    src={vendor.defaultImage || vendor.images?.[0] || "/placeholder-vendor.jpg"}
                    alt={vendor.name}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {categoryInfo && (
                    <div className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-tl-lg">
                      <categoryInfo.icon size={16} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Vendor Info */}
                <div className="flex-1 text-white min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-xl md:text-3xl font-bold truncate">{vendor.name}</h1>
                    {vendor.isVerified && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-2.5 py-1 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg flex-shrink-0"
                      >
                        <CheckCircle size={12} /> Verified
                      </motion.span>
                    )}
                    {vendor.isFeatured && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg flex-shrink-0"
                      >
                        <Sparkles size={12} /> Featured
                      </motion.span>
                    )}
                    {!vendor.isActive && (
                      <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg flex-shrink-0">
                        <XCircle size={12} /> Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm">
                    <span className="flex items-center gap-1.5 capitalize">
                      {categoryInfo && <categoryInfo.icon size={14} />}
                      {categoryInfo?.label || vendor.category}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {vendor.address?.city || "India"}
                    </span>
                    {vendor.availabilityStatus && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          vendor.availabilityStatus === "Available"
                            ? "bg-green-500/20 text-green-300"
                            : vendor.availabilityStatus === "Busy"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {vendor.availabilityStatus}
                      </span>
                    )}
                  </div>
                  {vendor.vendorProfile?.tagline && (
                    <p className="text-white/80 text-sm mt-2 italic">"{vendor.vendorProfile.tagline}"</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <button
                    onClick={handleShare}
                    className="px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-all backdrop-blur-sm border border-white/20"
                    title="Share"
                  >
                    <Share2 size={14} />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-all backdrop-blur-sm border border-white/20 disabled:opacity-50"
                    title="Download"
                  >
                    {isDownloading ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-all backdrop-blur-sm border border-white/20"
                    title="Print"
                  >
                    <Printer size={14} />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                  {onEdit && (
                    <button
                      onClick={onEdit}
                      className="px-3 md:px-4 py-2 bg-white text-gray-900 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      <Edit size={14} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-3 md:px-4 py-2 bg-red-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Completeness Badge */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      className="text-white/20"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 16}`}
                      strokeDashoffset={`${2 * Math.PI * 16 * (1 - completeness / 100)}`}
                      className={`transition-all duration-1000 ${
                        completeness >= 80
                          ? "text-green-400"
                          : completeness >= 50
                          ? "text-yellow-400"
                          : "text-orange-400"
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold">
                    {completeness}%
                  </span>
                </div>
                <div className="text-white text-left">
                  <p className="text-xs font-medium">Profile</p>
                  <p className="text-[10px] opacity-80">Complete</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
            <div className="flex gap-1.5 overflow-x-auto p-3 no-scrollbar">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    activeSection === section.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <section.icon size={15} />
                  <span className="hidden sm:inline">{section.label}</span>
                  <span className="sm:hidden">{section.label.split(" ")[0]}</span>
                  {section.count !== null && section.count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        activeSection === section.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {section.count}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {activeSection === "overview" && (
                  <OverviewSection
                    vendor={vendor}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                    copyToClipboard={copyToClipboard}
                    copiedField={copiedField}
                  />
                )}
                {activeSection === "media" && <MediaSection vendor={vendor} onImageClick={setSelectedImage} />}
                {activeSection === "location" && (
                  <LocationSection vendor={vendor} copyToClipboard={copyToClipboard} copiedField={copiedField} />
                )}
                {activeSection === "pricing" && <PricingSection vendor={vendor} formatPrice={formatPrice} />}
                {activeSection === "category" && (
                  <CategoryDetailsSection vendor={vendor} categoryInfo={categoryInfo} formatPrice={formatPrice} />
                )}
                {activeSection === "features" && <FeaturesSection vendor={vendor} />}
                {activeSection === "packages" && <PackagesSection vendor={vendor} formatPrice={formatPrice} />}
                {activeSection === "policies" && <PoliciesSection vendor={vendor} />}
                {activeSection === "social" && (
                  <SocialSection vendor={vendor} copyToClipboard={copyToClipboard} copiedField={copiedField} />
                )}
                {activeSection === "profile" && <VendorProfileSection vendor={vendor} formatDate={formatDate} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
        </AnimatePresence>

        <AnimatePresence>
          {showDeleteConfirm && (
            <DeleteConfirmModal
              vendor={vendor}
              onClose={() => setShowDeleteConfirm(false)}
              onConfirm={() => {
                setShowDeleteConfirm(false);
                onDelete?.();
              }}
            />
          )}
        </AnimatePresence>

        {/* Global Styles */}
        <style jsx global>{`
          * {
            min-width: 0;
            box-sizing: border-box;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================
const InfoCard = ({ icon: Icon, label, value, className = "", copyable, onCopy, copied }) => (
  <div
    className={`p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 ${className}`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wide">{label}</span>
      </div>
      {copyable && value && value !== "N/A" && (
        <button
          onClick={() => onCopy(value, label)}
          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          title="Copy"
        >
          {copied === label ? (
            <CheckCircle size={12} className="text-green-500" />
          ) : (
            <Copy size={12} className="text-gray-400 hover:text-indigo-600" />
          )}
        </button>
      )}
    </div>
    <p className="text-sm font-semibold text-gray-900 dark:text-white break-words leading-relaxed">{value || "N/A"}</p>
  </div>
);

const Section = ({ title, icon: Icon, children, description, count }) => (
  <div className="space-y-4 mb-8">
    <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl flex-shrink-0">
          <Icon size={20} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {count !== undefined && (
        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full flex-shrink-0">
          {count} {count === 1 ? "item" : "items"}
        </span>
      )}
    </div>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, label, value, subtext, color, trend }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    className={`p-5 rounded-xl text-center border ${color} transition-all`}
  >
    <Icon className="w-7 h-7 mx-auto mb-3" />
    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{label}</p>
    {subtext && <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">{subtext}</p>}
    {trend !== undefined && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full ${
          trend > 0
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}
      >
        {trend > 0 ? "+" : ""}
        {trend}%
      </motion.span>
    )}
  </motion.div>
);

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
    <Icon size={56} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h4>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    {action}
  </div>
);

// ============================================================================
// SECTION COMPONENTS
// ============================================================================
const OverviewSection = ({ vendor, formatPrice, formatDate, copyToClipboard, copiedField }) => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        icon={Star}
        label="Rating"
        value={vendor.rating?.toFixed(1) || "0.0"}
        subtext={`${vendor.reviews || 0} reviews`}
        color="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800"
      />
      <StatCard
        icon={MessageCircle}
        label="Total Reviews"
        value={vendor.reviews || 0}
        color="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800"
      />
      <StatCard
        icon={Calendar}
        label="Bookings"
        value={vendor.bookings || 0}
        color="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
      />
      <StatCard
        icon={Award}
        label="Years Experience"
        value={vendor.yearsExperience || 0}
        subtext="in business"
        color="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800"
      />
    </div>

    {/* Description */}
    {(vendor.description || vendor.shortDescription) && (
      <Section title="About" icon={FileText}>
        {vendor.description && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {vendor.description}
            </p>
          </div>
        )}
        {vendor.shortDescription && (
          <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-start gap-2">
              <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-indigo-900 dark:text-indigo-200 italic">
                <span className="font-semibold">Short Summary:</span> {vendor.shortDescription}
              </p>
            </div>
          </div>
        )}
      </Section>
    )}

    {/* Contact Information */}
    <Section title="Contact Information" icon={User} description="Get in touch with the vendor">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <InfoCard
          icon={Mail}
          label="Email"
          value={vendor.email}
          copyable
          onCopy={copyToClipboard}
          copied={copiedField}
        />
        <InfoCard
          icon={Phone}
          label="Phone"
          value={vendor.phoneNo}
          copyable
          onCopy={copyToClipboard}
          copied={copiedField}
        />
        <InfoCard
          icon={Phone}
          label="WhatsApp"
          value={vendor.whatsappNo}
          copyable
          onCopy={copyToClipboard}
          copied={copiedField}
        />
        <InfoCard
          icon={User}
          label="Contact Person"
          value={`${vendor.contactPerson?.firstName || ""} ${vendor.contactPerson?.lastName || ""}`.trim() || "N/A"}
        />
        <InfoCard icon={Clock} label="Response Time" value={vendor.responseTime} />
        <InfoCard icon={TrendingUp} label="Response Rate" value={vendor.responseRate} />
      </div>
    </Section>

    {/* Performance Stats */}
    <Section title="Performance Metrics" icon={BarChart3}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <InfoCard icon={Users} label="Repeat Customers" value={vendor.repeatCustomerRate} />
        <InfoCard icon={Eye} label="Profile Views" value={vendor.profileViews || "N/A"} />
        <InfoCard icon={Heart} label="Favorites" value={vendor.favorites || "N/A"} />
        <InfoCard icon={Share2} label="Shares" value={vendor.shares || "N/A"} />
      </div>
    </Section>

    {/* Tags */}
    {vendor.tags && vendor.tags.length > 0 && (
      <Section title="Tags" icon={Tag} count={vendor.tags.length}>
        <div className="flex flex-wrap gap-2">
          {vendor.tags.map((tag, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium border border-indigo-200 dark:border-indigo-800"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </Section>
    )}

    {/* Event Types */}
    {vendor.eventTypes && vendor.eventTypes.length > 0 && (
      <Section title="Event Types Supported" icon={Calendar} count={vendor.eventTypes.length}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {vendor.eventTypes.map((type, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 p-2.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
            >
              <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{type}</span>
            </motion.div>
          ))}
        </div>
      </Section>
    )}

    {/* Operating Hours */}
    {vendor.operatingHours && vendor.operatingHours.length > 0 && (
      <Section title="Operating Hours" icon={Clock} count={vendor.operatingHours.length}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {vendor.operatingHours.map((schedule, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                {schedule.day}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{schedule.hours}</span>
            </div>
          ))}
        </div>
      </Section>
    )}

    {/* Stats Display */}
    {vendor.stats && vendor.stats.length > 0 && (
      <Section title="Quick Stats" icon={TrendingUp} count={vendor.stats.length}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {vendor.stats.map((stat, i) => (
            <div
              key={i}
              className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl text-center border border-gray-200 dark:border-gray-600"
            >
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              {stat.trend && (
                <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">{stat.trend}</span>
              )}
            </div>
          ))}
        </div>
      </Section>
    )}

    {/* Timestamps */}
    <Section title="Account Information" icon={Info}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <InfoCard icon={Calendar} label="Created On" value={formatDate(vendor.createdAt)} />
        <InfoCard icon={Calendar} label="Last Updated" value={formatDate(vendor.updatedAt)} />
        <InfoCard
          icon={User}
          label="Username"
          value={vendor.username}
          copyable
          onCopy={copyToClipboard}
          copied={copiedField}
        />
        <InfoCard icon={Target} label="Status" value={vendor.isActive ? "Active" : "Inactive"} />
        <InfoCard icon={Tag} label="Subcategory" value={vendor.subcategory || "Not specified"} />
      </div>
    </Section>
  </div>
);

const MediaSection = ({ vendor, onImageClick }) => {
  const allImages = [...(vendor.images || [])];
  if (vendor.defaultImage && !allImages.includes(vendor.defaultImage)) {
    allImages.unshift(vendor.defaultImage);
  }

  const { addToast } = useToast();

  return (
    <div className="space-y-6">
      <Section title="Photo Gallery" icon={ImageIcon} count={allImages.length} description="View all uploaded images">
        {allImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {allImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onImageClick(img)}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-gray-100 dark:bg-gray-700 border-2 border-transparent hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-xl"
              >
                <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                  <ZoomIn className="text-white" size={28} />
                  <span className="text-white text-xs font-medium">Click to view</span>
                </div>
                {i === 0 && (
                  <span className="absolute top-2 left-2 px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold rounded-lg shadow-lg">
                    Cover
                  </span>
                )}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded-lg font-medium">
                  {i + 1}/{allImages.length}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ImageIcon}
            title="No Images Available"
            description="This vendor hasn't uploaded any images yet"
          />
        )}
      </Section>

      {/* Video */}
      {vendor.videoUrl && (
        <Section title="Vendor Video" icon={Video} description="Watch the promotional video">
          <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-lg">
            <iframe
              src={vendor.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
              className="w-full h-full"
              allowFullScreen
              title="Vendor Video"
            />
          </div>
        </Section>
      )}

      {/* Gallery Images (if separate from main images) */}
      {vendor.gallery && vendor.gallery.length > 0 && (
        <Section title="Additional Gallery" icon={Camera} count={vendor.gallery.length}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {vendor.gallery.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-indigo-400 transition-all"
                onClick={() => onImageClick(item.url)}
              >
                <Image src={item.url} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                {item.category && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] rounded font-medium">
                    {item.category}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

const LocationSection = ({ vendor, copyToClipboard, copiedField }) => {
  const { addToast } = useToast();

  return (
    <div className="space-y-6">
      <Section title="Address Details" icon={MapPin} description="Complete location information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoCard
            icon={MapPin}
            label="Street Address"
            value={vendor.address?.street}
            className="md:col-span-2"
            copyable
            onCopy={copyToClipboard}
            copied={copiedField}
          />
          <InfoCard icon={Building} label="City" value={vendor.address?.city} />
          <InfoCard icon={Building2} label="State" value={vendor.address?.state} />
          <InfoCard icon={Mail} label="Postal Code" value={vendor.address?.postalCode} />
          <InfoCard icon={Globe} label="Country" value={vendor.address?.country || "India"} />
        </div>

        {vendor.address?.googleMapUrl && (
          <a
            href={vendor.address.googleMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg shadow-blue-500/25 mt-4"
          >
            <Navigation size={18} />
            Open in Google Maps
            <ExternalLink size={14} />
          </a>
        )}
      </Section>

      {/* Coordinates */}
      {vendor.address?.location?.coordinates &&
        vendor.address.location.coordinates[0] !== 0 &&
        vendor.address.location.coordinates[1] !== 0 && (
          <Section title="GPS Coordinates" icon={Target}>
            <div className="grid grid-cols-2 gap-3">
              <InfoCard
                icon={Target}
                label="Latitude"
                value={vendor.address.location.coordinates[1]?.toFixed(6)}
                copyable
                onCopy={copyToClipboard}
                copied={copiedField}
              />
              <InfoCard
                icon={Target}
                label="Longitude"
                value={vendor.address.location.coordinates[0]?.toFixed(6)}
                copyable
                onCopy={copyToClipboard}
                copied={copiedField}
              />
            </div>
          </Section>
        )}

      {/* Nearby Landmarks */}
      {vendor.landmarks && vendor.landmarks.length > 0 && (
        <Section title="Nearby Landmarks" icon={MapPin} count={vendor.landmarks.length}>
          <div className="space-y-2">
            {vendor.landmarks.map((landmark, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <MapPin size={16} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{landmark.name}</p>
                    {landmark.type && <p className="text-xs text-gray-500 dark:text-gray-400">{landmark.type}</p>}
                  </div>
                </div>
                <span className="text-sm text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">
                  {landmark.distance}
                </span>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Directions */}
      {vendor.directions && vendor.directions.length > 0 && (
        <Section title="How to Reach" icon={Navigation} count={vendor.directions.length}>
          <div className="space-y-3">
            {vendor.directions.map((dir, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Navigation size={14} className="text-blue-600 dark:text-blue-400" />
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{dir.type}</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-6">{dir.description}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

const PricingSection = ({ vendor, formatPrice }) => (
  <div className="space-y-6">
    <Section title="Pricing Overview" icon={DollarSign} description="Transparent pricing information">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl text-center border-2 border-green-200 dark:border-green-800 shadow-lg"
        >
          <DollarSign className="w-10 h-10 text-green-600 dark:text-green-400 mx-auto mb-3" />
          <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
            {formatPrice(vendor.basePrice)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Base Price / {vendor.priceUnit || "day"}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl text-center border-2 border-blue-200 dark:border-blue-800 shadow-lg"
        >
          <TrendingUp className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
          <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
            {formatPrice(vendor.perDayPrice?.min)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Minimum Price</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl text-center border-2 border-purple-200 dark:border-purple-800 shadow-lg"
        >
          <Zap className="w-10 h-10 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
          <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
            {formatPrice(vendor.perDayPrice?.max)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Maximum Price</p>
        </motion.div>
      </div>
    </Section>

    {vendor.paymentMethods && vendor.paymentMethods.length > 0 && (
      <Section title="Payment Methods Accepted" icon={DollarSign} count={vendor.paymentMethods.length}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {vendor.paymentMethods.map((method, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
            >
              <CheckCircle size={14} className="text-green-500" />
              {method}
            </motion.div>
          ))}
        </div>
      </Section>
    )}
  </div>
);

const CategoryDetailsSection = ({ vendor, categoryInfo, formatPrice }) => {
  if (!vendor.category) {
    return (
      <EmptyState icon={Layers} title="No Category Selected" description="Category-specific details will appear here" />
    );
  }

  const renderCategoryContent = () => {
    switch (vendor.category) {
      case "venues":
        return (
          <div className="space-y-6">
            <Section title="Capacity Details" icon={Users}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="text-blue-600" size={20} />
                    <h4 className="font-bold text-gray-900 dark:text-white">Seating Capacity</h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {vendor.seating?.min || "N/A"} - {vendor.seating?.max || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Seated guests</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="text-purple-600" size={20} />
                    <h4 className="font-bold text-gray-900 dark:text-white">Floating Capacity</h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {vendor.floating?.min || "N/A"} - {vendor.floating?.max || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Standing guests</p>
                </div>
              </div>
            </Section>

            <Section title="Venue Facilities" icon={Building2}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {vendor.halls && <InfoCard icon={Building2} label="Number of Halls" value={vendor.halls} />}
                {vendor.rooms?.count && <InfoCard icon={Building} label="Rooms Available" value={vendor.rooms.count} />}
                {vendor.parking?.capacity && (
                  <InfoCard icon={MapPin} label="Parking Capacity" value={vendor.parking.capacity} />
                )}
                {vendor.parking?.valet && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Valet Parking</span>
                  </div>
                )}
              </div>
            </Section>

            {vendor.areas && vendor.areas.length > 0 && (
              <Section title="Available Areas" icon={MapPin} count={vendor.areas.length}>
                <div className="flex flex-wrap gap-2">
                  {vendor.areas.map((area, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium border border-indigo-200 dark:border-indigo-800"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {(vendor.foodPolicy || vendor.ceilingHeight || vendor.stageSize || vendor.powerBackup) && (
              <Section title="Additional Details" icon={Info}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vendor.foodPolicy && (
                    <InfoCard icon={UtensilsCrossed} label="Food Policy" value={vendor.foodPolicy} />
                  )}
                  {vendor.ceilingHeight && (
                    <InfoCard icon={Building} label="Ceiling Height" value={vendor.ceilingHeight} />
                  )}
                  {vendor.stageSize && <InfoCard icon={Layers} label="Stage Size" value={vendor.stageSize} />}
                  {vendor.powerBackup && <InfoCard icon={Zap} label="Power Backup" value={vendor.powerBackup} />}
                </div>
              </Section>
            )}
          </div>
        );

      case "photographers":
        return (
          <div className="space-y-6">
            {vendor.services && vendor.services.length > 0 && (
              <Section title="Photography Services" icon={Camera} count={vendor.services.length}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {vendor.services.map((service, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                    >
                      <CheckCircle size={14} className="text-purple-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{service}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {vendor.deliverables && vendor.deliverables.length > 0 && (
              <Section title="Deliverables" icon={Package} count={vendor.deliverables.length}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {vendor.deliverables.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <CheckCircle size={14} className="text-blue-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Service Details" icon={Info}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {vendor.deliveryTime && (
                  <InfoCard icon={Clock} label="Delivery Time" value={`${vendor.deliveryTime} weeks`} />
                )}
                {vendor.teamSize && <InfoCard icon={Users} label="Team Size" value={vendor.teamSize} />}
                {vendor.travelCost && <InfoCard icon={MapPin} label="Travel Cost" value={vendor.travelCost} />}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {vendor.videographyIncluded !== undefined && (
                  <div
                    className={`p-4 rounded-xl border ${
                      vendor.videographyIncluded
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {vendor.videographyIncluded ? (
                      <CheckCircle className="text-green-500 mb-2" size={20} />
                    ) : (
                      <XCircle className="text-gray-400 mb-2" size={20} />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Videography Included</span>
                  </div>
                )}
                {vendor.droneAvailable !== undefined && (
                  <div
                    className={`p-4 rounded-xl border ${
                      vendor.droneAvailable
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {vendor.droneAvailable ? (
                      <CheckCircle className="text-green-500 mb-2" size={20} />
                    ) : (
                      <XCircle className="text-gray-400 mb-2" size={20} />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Drone Available</span>
                  </div>
                )}
              </div>
            </Section>
          </div>
        );

      case "makeup":
        return (
          <div className="space-y-6">
            {vendor.services && vendor.services.length > 0 && (
              <Section title="Makeup Services" icon={Paintbrush2} count={vendor.services.length}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {vendor.services.map((service, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800"
                    >
                      <Sparkles size={14} className="text-pink-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{service}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {vendor.brandsUsed && vendor.brandsUsed.length > 0 && (
              <Section title="Brands Used" icon={Award} count={vendor.brandsUsed.length}>
                <div className="flex flex-wrap gap-2">
                  {vendor.brandsUsed.map((brand, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-800"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {vendor.trialPolicy && (
              <Section title="Trial Policy" icon={Info}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div
                    className={`p-4 rounded-xl border ${
                      vendor.trialPolicy.available
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {vendor.trialPolicy.available ? (
                      <CheckCircle className="text-green-500 mb-2" size={20} />
                    ) : (
                      <XCircle className="text-gray-400 mb-2" size={20} />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Trial Available</span>
                  </div>
                  {vendor.trialPolicy.available && (
                    <>
                      <InfoCard
                        icon={DollarSign}
                        label="Trial Type"
                        value={vendor.trialPolicy.paid ? "Paid" : "Free"}
                      />
                      {vendor.trialPolicy.price && (
                        <InfoCard icon={DollarSign} label="Trial Price" value={formatPrice(vendor.trialPolicy.price)} />
                      )}
                    </>
                  )}
                </div>
              </Section>
            )}

            <div className="grid grid-cols-2 gap-3">
              {vendor.travelToVenue !== undefined && (
                <div
                  className={`p-4 rounded-xl border ${
                    vendor.travelToVenue
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {vendor.travelToVenue ? (
                    <CheckCircle className="text-green-500 mb-2" size={20} />
                  ) : (
                    <XCircle className="text-gray-400 mb-2" size={20} />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Travel to Venue</span>
                </div>
              )}
              {vendor.assistantsAvailable !== undefined && (
                <div
                  className={`p-4 rounded-xl border ${
                    vendor.assistantsAvailable
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {vendor.assistantsAvailable ? (
                    <CheckCircle className="text-green-500 mb-2" size={20} />
                  ) : (
                    <XCircle className="text-gray-400 mb-2" size={20} />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Assistants Available</span>
                </div>
              )}
            </div>
          </div>
        );

      case "catering":
        return (
          <div className="space-y-6">
            {vendor.cuisines && vendor.cuisines.length > 0 && (
              <Section title="Cuisines Offered" icon={UtensilsCrossed} count={vendor.cuisines.length}>
                <div className="flex flex-wrap gap-2">
                  {vendor.cuisines.map((cuisine, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium border border-orange-200 dark:border-orange-800"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {vendor.menuTypes && vendor.menuTypes.length > 0 && (
              <Section title="Menu Types" icon={FileText} count={vendor.menuTypes.length}>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {vendor.menuTypes.map((type, i) => (
                    <div
                      key={i}
                      className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-center"
                    >
                      <CheckCircle size={16} className="text-green-500 mx-auto mb-1" />
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{type}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Capacity & Pricing" icon={Users}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendor.minCapacity && <InfoCard icon={Users} label="Minimum Capacity" value={vendor.minCapacity} />}
                {vendor.maxCapacity && <InfoCard icon={Users} label="Maximum Capacity" value={vendor.maxCapacity} />}
                {vendor.pricePerPlate?.veg && (
                  <InfoCard
                    icon={DollarSign}
                    label="Price per Plate (Veg)"
                    value={formatPrice(vendor.pricePerPlate.veg)}
                  />
                )}
                {vendor.pricePerPlate?.nonVeg && (
                  <InfoCard
                    icon={DollarSign}
                    label="Price per Plate (Non-Veg)"
                    value={formatPrice(vendor.pricePerPlate.nonVeg)}
                  />
                )}
              </div>
              {vendor.liveCounters !== undefined && (
                <div
                  className={`p-4 rounded-xl border mt-3 ${
                    vendor.liveCounters
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {vendor.liveCounters ? (
                    <CheckCircle className="text-green-500 mb-2" size={20} />
                  ) : (
                    <XCircle className="text-gray-400 mb-2" size={20} />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Live Counters Available</span>
                </div>
              )}
            </Section>
          </div>
        );

      case "djs":
        return (
          <div className="space-y-6">
            {vendor.genres && vendor.genres.length > 0 && (
              <Section title="Music Genres" icon={Music} count={vendor.genres.length}>
                <div className="flex flex-wrap gap-2">
                  {vendor.genres.map((genre, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-800"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Performance Details" icon={Info}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {vendor.performanceDuration && (
                  <InfoCard icon={Clock} label="Performance Duration" value={vendor.performanceDuration} />
                )}
                {vendor.soundSystemPower && (
                  <InfoCard icon={Zap} label="Sound System" value={vendor.soundSystemPower} />
                )}
                {vendor.setupTime && <InfoCard icon={Clock} label="Setup Time" value={vendor.setupTime} />}
              </div>
            </Section>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: "equipmentProvided", label: "Equipment Provided" },
                { key: "backupAvailable", label: "Backup Available" },
                { key: "lightingIncluded", label: "Lighting Included" },
                { key: "emceeServices", label: "Emcee Services" },
              ].map(
                ({ key, label }) =>
                  vendor[key] !== undefined && (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border ${
                        vendor[key]
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {vendor[key] ? (
                        <CheckCircle className="text-green-500 mb-2" size={18} />
                      ) : (
                        <XCircle className="text-gray-400 mb-2" size={18} />
                      )}
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{label}</span>
                    </div>
                  )
              )}
            </div>
          </div>
        );

      case "clothes":
        return (
          <div className="space-y-6">
            {vendor.outfitTypes && vendor.outfitTypes.length > 0 && (
              <Section title="Outfit Types" icon={Shirt} count={vendor.outfitTypes.length}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {vendor.outfitTypes.map((type, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800"
                    >
                      <Shirt size={14} className="text-pink-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Service Details" icon={Info}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {vendor.wearType && <InfoCard icon={Tag} label="Wear Category" value={vendor.wearType} />}
                {vendor.leadTime && <InfoCard icon={Clock} label="Lead Time" value={vendor.leadTime} />}
                {vendor.sizeRange && <InfoCard icon={Layers} label="Size Range" value={vendor.sizeRange} />}
                {vendor.fittingSessions && (
                  <InfoCard icon={Users} label="Fitting Sessions" value={vendor.fittingSessions} />
                )}
              </div>
            </Section>

            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "customization", label: "Customization" },
                { key: "rentalAvailable", label: "Rental" },
                { key: "alterationsIncluded", label: "Alterations" },
              ].map(
                ({ key, label }) =>
                  vendor[key] !== undefined && (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border ${
                        vendor[key]
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {vendor[key] ? (
                        <CheckCircle className="text-green-500 mb-2" size={18} />
                      ) : (
                        <XCircle className="text-gray-400 mb-2" size={18} />
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
                    </div>
                  )
              )}
            </div>
          </div>
        );

      case "mehendi":
        return (
          <div className="space-y-6">
            {vendor.designs && vendor.designs.length > 0 && (
              <Section title="Design Styles" icon={Hand} count={vendor.designs.length}>
                <div className="flex flex-wrap gap-2">
                  {vendor.designs.map((design, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium border border-orange-200 dark:border-orange-800"
                    >
                      {design}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Pricing & Team" icon={DollarSign}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {vendor.pricePerHand && (
                  <InfoCard icon={DollarSign} label="Price per Hand" value={formatPrice(vendor.pricePerHand)} />
                )}
                {vendor.bridalPackagePrice && (
                  <InfoCard icon={DollarSign} label="Bridal Package" value={formatPrice(vendor.bridalPackagePrice)} />
                )}
                {vendor.teamSize && <InfoCard icon={Users} label="Team Size" value={vendor.teamSize} />}
              </div>
            </Section>

            <Section title="Service Details" icon={Info}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vendor.dryingTime && <InfoCard icon={Clock} label="Drying Time" value={vendor.dryingTime} />}
                {vendor.colorGuarantee && (
                  <InfoCard icon={CheckCircle} label="Color Guarantee" value={vendor.colorGuarantee} />
                )}
              </div>
            </Section>

            <div className="grid grid-cols-2 gap-3">
              {vendor.organic !== undefined && (
                <div
                  className={`p-4 rounded-xl border ${
                    vendor.organic
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {vendor.organic ? (
                    <CheckCircle className="text-green-500 mb-2" size={20} />
                  ) : (
                    <XCircle className="text-gray-400 mb-2" size={20} />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">100% Organic Henna</span>
                </div>
              )}
              {vendor.travelToVenue !== undefined && (
                <div
                  className={`p-4 rounded-xl border ${
                    vendor.travelToVenue
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {vendor.travelToVenue ? (
                    <CheckCircle className="text-green-500 mb-2" size={20} />
                  ) : (
                    <XCircle className="text-gray-400 mb-2" size={20} />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Travel to Venue</span>
                </div>
              )}
            </div>
          </div>
        );

      case "cakes":
        return (
          <div className="space-y-6">
            {vendor.flavors && vendor.flavors.length > 0 && (
              <Section title="Available Flavors" icon={CakeSlice} count={vendor.flavors.length}>
                <div className="flex flex-wrap gap-2">
                  {vendor.flavors.map((flavor, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium border border-pink-200 dark:border-pink-800"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {vendor.speciality && vendor.speciality.length > 0 && (
              <Section title="Specialities" icon={Star} count={vendor.speciality.length}>
                <div className="flex flex-wrap gap-2">
                  {vendor.speciality.map((spec, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-800"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Pricing & Orders" icon={DollarSign}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {vendor.pricePerKg && (
                  <InfoCard icon={DollarSign} label="Price per Kg" value={formatPrice(vendor.pricePerKg)} />
                )}
                {vendor.minOrderWeight && (
                  <InfoCard icon={Package} label="Min Order Weight" value={`${vendor.minOrderWeight} kg`} />
                )}
                {vendor.advanceBookingDays && (
                  <InfoCard icon={Calendar} label="Advance Booking" value={`${vendor.advanceBookingDays} days`} />
                )}
              </div>
            </Section>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: "deliveryAvailable", label: "Delivery Available" },
                { key: "customDesigns", label: "Custom Designs" },
                { key: "eggless", label: "Eggless Options" },
                { key: "sugarFree", label: "Sugar-Free" },
              ].map(
                ({ key, label }) =>
                  vendor[key] !== undefined && (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border ${
                        vendor[key]
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {vendor[key] ? (
                        <CheckCircle className="text-green-500 mb-2" size={18} />
                      ) : (
                        <XCircle className="text-gray-400 mb-2" size={18} />
                      )}
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{label}</span>
                    </div>
                  )
              )}
            </div>
          </div>
        );

      case "jewellery":
        return (
          <div className="space-y-6">
            {vendor.material && vendor.material.length > 0 && (
              <Section title="Materials" icon={Gem} count={vendor.material.length}>
                <div className="flex flex-wrap gap-2">
                  {vendor.material.map((mat, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium border border-amber-200 dark:border-amber-800"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {vendor.styles && vendor.styles.length > 0 && (
              <Section title="Jewellery Styles" icon={Sparkles} count={vendor.styles.length}>
                <div className="flex flex-wrap gap-2">
                  {vendor.styles.map((style, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-800"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {vendor.returnPolicy && (
              <Section title="Return Policy" icon={Info}>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{vendor.returnPolicy}</p>
                </div>
              </Section>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: "customization", label: "Customization" },
                { key: "rentalAvailable", label: "Rental Available" },
                { key: "certificationProvided", label: "Certification" },
                { key: "homeTrialAvailable", label: "Home Trial" },
              ].map(
                ({ key, label }) =>
                  vendor[key] !== undefined && (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border ${
                        vendor[key]
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {vendor[key] ? (
                        <CheckCircle className="text-green-500 mb-2" size={18} />
                      ) : (
                        <XCircle className="text-gray-400 mb-2" size={18} />
                      )}
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{label}</span>
                    </div>
                  )
              )}
            </div>
          </div>
        );

      case "invitations":
        return (
          <div className="space-y-6">
            {vendor.types && vendor.types.length > 0 && (
              <Section title="Invitation Types" icon={Mail} count={vendor.types.length}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {vendor.types.map((type, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
                    >
                      <Mail size={14} className="text-indigo-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Order Details" icon={Package}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {vendor.minOrderQuantity && (
                  <InfoCard icon={Package} label="Min Order Quantity" value={vendor.minOrderQuantity} />
                )}
                {vendor.digitalDeliveryTime && (
                  <InfoCard icon={Clock} label="Digital Delivery" value={vendor.digitalDeliveryTime} />
                )}
                {vendor.physicalDeliveryTime && (
                  <InfoCard icon={Clock} label="Physical Delivery" value={vendor.physicalDeliveryTime} />
                )}
              </div>
            </Section>

            {vendor.customDesign !== undefined && (
              <div
                className={`p-4 rounded-xl border ${
                  vendor.customDesign
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                {vendor.customDesign ? (
                  <CheckCircle className="text-green-500 mb-2" size={20} />
                ) : (
                  <XCircle className="text-gray-400 mb-2" size={20} />
                )}
                <span className="text-sm font-medium text-gray-900 dark:text-white">Custom Design Available</span>
              </div>
            )}

            {vendor.languages && vendor.languages.length > 0 && (
              <Section title="Languages Supported" icon={Globe} count={vendor.languages.length}>
                <div className="flex flex-wrap gap-2">
                  {vendor.languages.map((lang, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </Section>
            )}
          </div>
        );

      case "hairstyling":
        return (
          <div className="space-y-6">
            {vendor.styles && vendor.styles.length > 0 && (
              <Section title="Hairstyles Offered" icon={Scissors} count={vendor.styles.length}>
                <div className="flex flex-wrap gap-2">
                  {vendor.styles.map((style, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium border border-pink-200 dark:border-pink-800"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {vendor.productsUsed && vendor.productsUsed.length > 0 && (
              <Section title="Products Used" icon={Package} count={vendor.productsUsed.length}>
                <div className="flex flex-wrap gap-2">
                  {vendor.productsUsed.map((product, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-800"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: "extensionsProvided", label: "Extensions" },
                { key: "drapingIncluded", label: "Draping" },
                { key: "travelToVenue", label: "Travel" },
                { key: "trialAvailable", label: "Trial" },
              ].map(
                ({ key, label }) =>
                  vendor[key] !== undefined && (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border ${
                        vendor[key]
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {vendor[key] ? (
                        <CheckCircle className="text-green-500 mb-2" size={18} />
                      ) : (
                        <XCircle className="text-gray-400 mb-2" size={18} />
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
                    </div>
                  )
              )}
            </div>
          </div>
        );

      case "planners":
        return (
          <div className="space-y-6">
            {vendor.specializations && vendor.specializations.length > 0 && (
              <Section title="Specializations" icon={Star} count={vendor.specializations.length}>
                <div className="flex flex-wrap gap-2">
                  {vendor.specializations.map((spec, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium border border-indigo-200 dark:border-indigo-800"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {vendor.eventsManaged && vendor.eventsManaged.length > 0 && (
              <Section title="Events Managed" icon={Calendar} count={vendor.eventsManaged.length}>
                <div className="flex flex-wrap gap-2">
                  {vendor.eventsManaged.map((event, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium border border-green-200 dark:border-green-800"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Team & Network" icon={Users}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {vendor.teamSize && <InfoCard icon={Users} label="Team Size" value={vendor.teamSize} />}
                {vendor.vendorNetwork && <InfoCard icon={Users} label="Vendor Network" value={vendor.vendorNetwork} />}
                {vendor.feeStructure && (
                  <InfoCard icon={DollarSign} label="Fee Structure" value={vendor.feeStructure} />
                )}
              </div>
            </Section>

            {vendor.budgetRange && (
              <Section title="Budget Range Handled" icon={DollarSign}>
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard icon={DollarSign} label="Minimum Budget" value={formatPrice(vendor.budgetRange.min)} />
                  <InfoCard icon={DollarSign} label="Maximum Budget" value={formatPrice(vendor.budgetRange.max)} />
                </div>
              </Section>
            )}

            {vendor.destinationWeddings !== undefined && (
              <div
                className={`p-4 rounded-xl border ${
                  vendor.destinationWeddings
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                {vendor.destinationWeddings ? (
                  <CheckCircle className="text-green-500 mb-2" size={20} />
                ) : (
                  <XCircle className="text-gray-400 mb-2" size={20} />
                )}
                <span className="text-sm font-medium text-gray-900 dark:text-white">Destination Weddings</span>
              </div>
            )}
          </div>
        );

      case "other":
        return (
          <div className="space-y-6">
            {vendor.serviceType && (
              <Section title="Service Type" icon={Info}>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{vendor.serviceType}</p>
                </div>
              </Section>
            )}

            {vendor.customFields && vendor.customFields.length > 0 && (
              <Section title="Additional Details" icon={FileText} count={vendor.customFields.length}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vendor.customFields.map((field, i) => (
                    <InfoCard key={i} icon={Info} label={field.label} value={field.value} />
                  ))}
                </div>
              </Section>
            )}
          </div>
        );

      default:
        return (
          <EmptyState icon={Layers} title="No Category Data" description="No category-specific information available" />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        {categoryInfo && (
          <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl">
            <categoryInfo.icon size={24} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {categoryInfo?.label || vendor.category} Details
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Category-specific information</p>
        </div>
      </div>
      {renderCategoryContent()}
    </div>
  );
};

const FeaturesSection = ({ vendor }) => (
  <div className="space-y-6">
    {vendor.amenities && vendor.amenities.length > 0 && (
      <Section
        title="Amenities"
        icon={CheckCircle}
        count={vendor.amenities.length}
        description="Available facilities and services"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {vendor.amenities.map((amenity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all"
            >
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{amenity}</span>
            </motion.div>
          ))}
        </div>
      </Section>
    )}

    {vendor.facilities && vendor.facilities.length > 0 && (
      <Section title="Premium Facilities" icon={Star} count={vendor.facilities.length}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {vendor.facilities.map((facility, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all"
            >
              <Star size={16} className="text-blue-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{facility}</span>
            </motion.div>
          ))}
        </div>
      </Section>
    )}

    {vendor.highlightPoints && vendor.highlightPoints.length > 0 && (
      <Section title="Why Choose Us" icon={Sparkles} count={vendor.highlightPoints.length}>
        <div className="space-y-3">
          {vendor.highlightPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl border-l-4 border-yellow-500"
            >
              <Sparkles size={18} className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{point}</span>
            </motion.div>
          ))}
        </div>
      </Section>
    )}

    {vendor.awards && vendor.awards.length > 0 && (
      <Section title="Awards & Recognition" icon={Award} count={vendor.awards.length}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {vendor.awards.map((award, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all"
            >
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Award className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{award.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {award.year}
                  {award.organization && ` • ${award.organization}`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    )}

    {vendor.specialOffers && vendor.specialOffers.length > 0 && (
      <Section title="Special Offers" icon={Percent} count={vendor.specialOffers.length}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendor.specialOffers.map((offer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl border-2 border-green-300 dark:border-green-700 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg">
                  {offer.discount}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{offer.title}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{offer.description}</p>
              {offer.validTill && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>Valid till: {offer.validTill}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Section>
    )}

    {!vendor.amenities?.length && !vendor.facilities?.length && !vendor.highlightPoints?.length && (
      <EmptyState icon={Star} title="No Features Available" description="This vendor hasn't added any features yet" />
    )}
  </div>
);

const PackagesSection = ({ vendor, formatPrice }) => (
  <div className="space-y-4">
    <Section
      title="Service Packages"
      icon={Gift}
      count={vendor.packages?.length || 0}
      description="Available service packages"
    >
      {vendor.packages && vendor.packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendor.packages.map((pkg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`relative p-6 rounded-2xl border-2 shadow-lg hover:shadow-2xl transition-all ${
                pkg.isPopular
                  ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
                    <Sparkles size={12} />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-4 mt-2">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{pkg.name}</h4>
                {pkg.duration && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <Clock size={12} />
                    {pkg.duration}
                  </div>
                )}
              </div>

              <div className="mb-5 text-center">
                {pkg.originalPrice && Number(pkg.originalPrice) > Number(pkg.price) && (
                  <div className="text-sm text-gray-400 line-through mb-1">{formatPrice(pkg.originalPrice)}</div>
                )}
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{formatPrice(pkg.price)}</div>
                {pkg.savingsPercentage > 0 && (
                  <div className="mt-2 inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                    Save {pkg.savingsPercentage}%
                  </div>
                )}
              </div>

              {pkg.features && pkg.features.length > 0 && (
                <div className="space-y-2 mb-4">
                  {pkg.features.map((feature, fi) => (
                    <div key={fi} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {pkg.notIncluded && pkg.notIncluded.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {pkg.notIncluded.map((item, ni) => (
                    <div key={ni} className="flex items-start gap-2 text-sm opacity-60">
                      <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-500 line-through">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Gift}
          title="No Packages Available"
          description="This vendor hasn't created any packages yet"
        />
      )}
    </Section>
  </div>
);

const PoliciesSection = ({ vendor }) => (
  <div className="space-y-6">
    {vendor.policies && vendor.policies.length > 0 && (
      <Section title="Business Policies" icon={Shield} count={vendor.policies.length}>
        <div className="space-y-3">
          {vendor.policies.map((policy, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className={policy.iconColor || "text-indigo-500"} />
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{policy.title}</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{policy.content}</p>
              {policy.details && policy.details.length > 0 && (
                <ul className="space-y-2 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                  {policy.details.map((detail, di) => (
                    <li key={di} className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <ChevronRight size={12} className="mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </Section>
    )}

    {vendor.faqs && vendor.faqs.length > 0 && (
      <Section title="Frequently Asked Questions" icon={HelpCircle} count={vendor.faqs.length}>
        <div className="space-y-3">
          {vendor.faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl border border-indigo-200 dark:border-indigo-800"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex-shrink-0">
                  <HelpCircle size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed">{faq.question}</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 pl-11 leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    )}

    {!vendor.policies?.length && !vendor.faqs?.length && (
      <EmptyState
        icon={Shield}
        title="No Policies or FAQs"
        description="This vendor hasn't added any policies or FAQs yet"
      />
    )}
  </div>
);

const SocialSection = ({ vendor, copyToClipboard, copiedField }) => {
  const socialLinks = [
    {
      key: "website",
      icon: Globe,
      label: "Website",
      color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
      hoverColor: "hover:bg-gray-200 dark:hover:bg-gray-600",
    },
    {
      key: "instagram",
      icon: Instagram,
      label: "Instagram",
      color:
        "bg-gradient-to-br from-pink-100 to-purple-100 text-pink-700 dark:from-pink-900/30 dark:to-purple-900/30 dark:text-pink-400",
      hoverColor: "hover:from-pink-200 hover:to-purple-200",
    },
    {
      key: "facebook",
      icon: Facebook,
      label: "Facebook",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      hoverColor: "hover:bg-blue-200",
    },
    {
      key: "youtube",
      icon: Youtube,
      label: "YouTube",
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      hoverColor: "hover:bg-red-200",
    },
    {
      key: "twitter",
      icon: Twitter,
      label: "Twitter",
      color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
      hoverColor: "hover:bg-sky-200",
    },
    {
      key: "linkedin",
      icon: Linkedin,
      label: "LinkedIn",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      hoverColor: "hover:bg-blue-200",
    },
  ];

  const activeSocialLinks = socialLinks.filter((s) => vendor.socialLinks?.[s.key]);

  return (
    <div className="space-y-6">
      <Section
        title="Social Media Profiles"
        icon={Globe}
        count={activeSocialLinks.length}
        description="Connect on social platforms"
      >
        {activeSocialLinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeSocialLinks.map((social) => {
              const url = vendor.socialLinks?.[social.key];
              return (
                <motion.div
                  key={social.key}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all">
                    <div className={`p-3 rounded-lg ${social.color}`}>
                      <social.icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{social.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{url}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(url, social.label)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Copy URL"
                      >
                        {copiedField === social.label ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} className="text-gray-400" />
                        )}
                      </button>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        title="Visit"
                      >
                        <ExternalLink size={16} className="text-indigo-600 dark:text-indigo-400" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Globe}
            title="No Social Links"
            description="This vendor hasn't added social media profiles yet"
          />
        )}
      </Section>

      {(vendor.metaTitle || vendor.metaDescription || vendor.metaKeywords?.length > 0) && (
        <Section title="SEO Settings" icon={Target} description="Search engine optimization details">
          <div className="space-y-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
            {vendor.metaTitle && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target size={14} className="text-blue-600 dark:text-blue-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Meta Title</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{vendor.metaTitle}</p>
                  <p className="text-xs text-gray-400 mt-1">{vendor.metaTitle.length} characters</p>
                </div>
              </div>
            )}

            {vendor.metaDescription && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={14} className="text-blue-600 dark:text-blue-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Meta Description</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{vendor.metaDescription}</p>
                  <p className="text-xs text-gray-400 mt-1">{vendor.metaDescription.length} characters</p>
                </div>
              </div>
            )}

            {vendor.metaKeywords && vendor.metaKeywords.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-blue-600 dark:text-blue-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Meta Keywords</p>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{vendor.metaKeywords.length} keywords</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vendor.metaKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}
    </div>
  );
};

const VendorProfileSection = ({ vendor, formatDate }) => {
  const profile = vendor.vendorProfile || {};

  return (
    <div className="space-y-6">
      {/* Profile Images */}
      {(profile.profilePicture || profile.coverPhoto) && (
        <Section title="Profile Media" icon={Camera} description="Profile and cover photos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.profilePicture && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</p>
                <div className="relative aspect-square rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl bg-gray-100 dark:bg-gray-700 max-w-xs mx-auto">
                  <Image src={profile.profilePicture} alt="Profile" fill className="object-cover" />
                </div>
              </div>
            )}
            {profile.coverPhoto && (
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Cover Photo</p>
                <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-xl bg-gray-100 dark:bg-gray-700">
                  <Image src={profile.coverPhoto} alt="Cover" fill className="object-cover" />
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Bio & About */}
      {(profile.bio || profile.tagline) && (
        <Section title="About the Vendor" icon={UserCircle}>
          {profile.tagline && (
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl border-l-4 border-indigo-500 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Tagline</p>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white italic">"{profile.tagline}"</p>
            </div>
          )}
          {profile.bio && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-gray-600 dark:text-gray-400" />
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Bio</p>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>
          )}
          {profile.pronouns && (
            <div className="mt-3">
              <InfoCard icon={User} label="Pronouns" value={profile.pronouns} />
            </div>
          )}
        </Section>
      )}

      {/* Instagram Stats */}
      {(profile.instagramHandle || profile.instagramFollowers) && (
        <Section title="Instagram Presence" icon={Instagram}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {profile.instagramHandle && (
              <InfoCard icon={Instagram} label="Instagram Handle" value={profile.instagramHandle} />
            )}
            {profile.instagramFollowers && (
              <InfoCard icon={Users} label="Followers" value={profile.instagramFollowers} />
            )}
            {profile.instagramPosts && <InfoCard icon={ImageIcon} label="Posts" value={profile.instagramPosts} />}
            {profile.instagramFollowing && (
              <InfoCard icon={Heart} label="Following" value={profile.instagramFollowing} />
            )}
          </div>
        </Section>
      )}

      {/* Testimonial */}
      {profile.testimonialQuote && (
        <Section title="Featured Testimonial" icon={MessageCircle}>
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl border-2 border-green-300 dark:border-green-700 shadow-lg">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-3 bg-green-500 rounded-full">
                <Quote className="text-white" size={20} />
              </div>
              <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed italic flex-1">
                "{profile.testimonialQuote}"
              </p>
            </div>
            {profile.testimonialAuthor && (
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium text-right">
                — {profile.testimonialAuthor}
              </p>
            )}
          </div>
        </Section>
      )}

      {/* Verification & Stats */}
      <Section title="Profile Statistics" icon={BarChart3}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {profile.verifiedSince && (
            <InfoCard icon={CheckCircle} label="Verified Since" value={formatDate(profile.verifiedSince)} />
          )}
          {profile.profileCompleteness !== undefined && (
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={14} className="text-blue-600 dark:text-blue-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
                  Profile Completeness
                </span>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile.profileCompleteness}%</p>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${profile.profileCompleteness}%` }}
                  />
                </div>
              </div>
            </div>
          )}
          {profile.lastActive && <InfoCard icon={Clock} label="Last Active" value={formatDate(profile.lastActive)} />}
        </div>
      </Section>

      {!profile.bio && !profile.tagline && !profile.testimonialQuote && (
        <EmptyState
          icon={UserCircle}
          title="No Profile Information"
          description="Extended profile details haven't been added yet"
        />
      )}
    </div>
  );
};

// ============================================================================
// MODALS
// ============================================================================
const ImageModal = ({ image, onClose }) => {
  const { addToast } = useToast();

  const handleDownload = async () => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `vendor-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      addToast("Image downloaded successfully!", "success");
    } catch (error) {
      addToast("Failed to download image", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={handleDownload}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors backdrop-blur-sm"
          title="Download"
        >
          <Download size={20} />
        </button>
        <button
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors backdrop-blur-sm"
          title="Close"
        >
          <X size={24} />
        </button>
      </div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-full max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={image} alt="Full view" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" />
      </motion.div>
      <p className="absolute bottom-4 text-white/70 text-sm">Click outside to close</p>
    </motion.div>
  );
};

const DeleteConfirmModal = ({ vendor, onClose, onConfirm }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { addToast } = useToast();
  const { user } = useUser();

  const handleDelete = async () => {
    if (!user && !user?.id) {
      addToast("You must be signed in to submit an event", "error");
      return;
    }
    if (!password) {
      setError("Please enter admin password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/vendor?id=${vendor._id}&password=${encodeURIComponent(password)}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete vendor");
      }

      addToast("Vendor deleted successfully!", "success");
      onConfirm();
    } catch (err) {
      setError(err.message);
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-xl">
            <Trash2 className="text-red-600 dark:text-red-400" size={36} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Delete Vendor?</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Are you sure you want to delete <br />
            <strong className="text-gray-900 dark:text-white text-base">{vendor.name}</strong>?
            <br />
            <span className="text-red-500 font-medium">This action cannot be undone.</span>
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Admin Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-4 outline-none transition-all ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-red-500/20"
              }`}
              placeholder="Enter admin password"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && password) {
                  handleDelete();
                }
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <Eye size={18} /> : <Eye size={18} className="opacity-50" />}
            </button>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-2 flex items-center gap-1.5"
            >
              <AlertCircle size={14} />
              {error}
            </motion.p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
            <Info size={12} />
            Contact administrator if you don't have the password
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-5 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-bold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || !password}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-bold shadow-lg shadow-red-500/25"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Delete Vendor
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
