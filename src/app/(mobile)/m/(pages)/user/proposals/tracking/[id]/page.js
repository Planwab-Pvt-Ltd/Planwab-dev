// app/m/user/proposals/tracking/[id]/page.jsx

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  FileText,
  Download,
  Share2,
  Bell,
  Settings,
  ChevronRight,
  Sparkles,
  Gift,
  Building2,
  CreditCard,
  Navigation,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  HelpCircle,
  Headphones,
  Star,
  Heart,
  Zap,
  Shield,
  Award,
  Target,
  Users,
  Briefcase,
  CalendarDays,
  Timer,
  Activity,
} from "lucide-react";

// =============================================================================
// CONSTANTS & CONFIGURATIONS
// =============================================================================

const SPRING_CONFIGS = {
  snappy: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
  gentle: { type: "spring", stiffness: 120, damping: 20, mass: 1 },
  bounce: { type: "spring", stiffness: 300, damping: 20, mass: 0.8 },
};

const STATUS_CONFIG = {
  pending: {
    label: "Request Received",
    color: "amber",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    textColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-amber-300 dark:border-amber-700",
    icon: Clock,
    description: "Your request has been received and is being reviewed.",
    progress: 20,
  },
  "in-progress": {
    label: "In Progress",
    color: "blue",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-700",
    icon: Activity,
    description: "Our team is actively working on your personalized proposal.",
    progress: 50,
  },
  "proposal-sent": {
    label: "Proposal Sent",
    color: "purple",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    textColor: "text-purple-700 dark:text-purple-300",
    borderColor: "border-purple-300 dark:border-purple-700",
    icon: FileText,
    description: "Your proposal has been sent! Please check your email.",
    progress: 75,
  },
  confirmed: {
    label: "Confirmed",
    color: "green",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-700 dark:text-green-300",
    borderColor: "border-green-300 dark:border-green-700",
    icon: CheckCircle,
    description: "Congratulations! Your event is confirmed.",
    progress: 100,
  },
  cancelled: {
    label: "Cancelled",
    color: "red",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-700",
    icon: AlertCircle,
    description: "This request has been cancelled.",
    progress: 0,
  },
};

const CATEGORY_CONFIG = {
  wedding: {
    title: "Wedding",
    icon: "💍",
    emoji: "💑",
    color: "#d97706",
    gradient: "from-amber-500 to-amber-700",
  },
  anniversary: {
    title: "Anniversary",
    icon: "🥂",
    emoji: "💕",
    color: "#be185d",
    gradient: "from-pink-500 to-pink-700",
  },
  birthday: {
    title: "Birthday",
    icon: "🎂",
    emoji: "🎈",
    color: "#a16207",
    gradient: "from-yellow-500 to-orange-600",
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const formatDate = (date) => {
  if (!date) return "Not specified";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatShortDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDaysUntil = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const getTimeAgo = (date) => {
  if (!date) return "";
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return formatShortDate(date);
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 40,
        success: [10, 30, 10],
        error: [30, 20, 30],
      };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

// =============================================================================
// HEADER COMPONENT
// =============================================================================

const TrackingHeader = ({ event, onRefresh, isRefreshing }) => {
  const router = useRouter();
  const category = CATEGORY_CONFIG[event?.category] || CATEGORY_CONFIG.wedding;
  const status = STATUS_CONFIG[event?.status] || STATUS_CONFIG.pending;
  const haptic = useHapticFeedback();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              haptic("light");
              router.back();
            }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptic("light");
                onRefresh();
              }}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={`text-gray-600 dark:text-gray-300 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Bell size={18} className="text-gray-600 dark:text-gray-300" />
            </motion.button>
          </div>
        </div>

        {/* Event Title & Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-2xl shadow-lg`}
            >
              {category.icon}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{category.title} Proposal</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {event?._id?.slice(-8).toUpperCase() || "---"}
              </p>
            </div>
          </div>

          <div
            className={`px-4 py-2 rounded-full ${status.bgColor} ${status.borderColor} border flex items-center gap-2`}
          >
            <status.icon size={16} className={status.textColor} />
            <span className={`text-sm font-semibold ${status.textColor}`}>{status.label}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// =============================================================================
// PROGRESS TRACKER COMPONENT
// =============================================================================

const ProgressTracker = ({ event }) => {
  const currentStatus = event?.status || "pending";
  const statusConfig = STATUS_CONFIG[currentStatus];

  const steps = [
    {
      id: "pending",
      label: "Request Received",
      description: "Your request is being reviewed",
      icon: CheckCircle,
      date: event?.createdAt,
    },
    {
      id: "in-progress",
      label: "Team Assigned",
      description: "Planning team is working",
      icon: Users,
      date: event?.assignedAt,
    },
    {
      id: "proposal-sent",
      label: "Proposal Ready",
      description: "Review your custom proposal",
      icon: FileText,
      date: null,
    },
    {
      id: "confirmed",
      label: "Confirmed",
      description: "Event planning begins",
      icon: Award,
      date: null,
    },
  ];

  const getStepStatus = (stepId) => {
    const statusOrder = ["pending", "in-progress", "proposal-sent", "confirmed"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepId);

    if (currentStatus === "cancelled") return "cancelled";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Progress Tracker</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your proposal status</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{statusConfig?.progress || 0}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${statusConfig?.progress || 0}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
        />
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-6">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.id);
            const isCompleted = stepStatus === "completed";
            const isCurrent = stepStatus === "current";
            const isUpcoming = stepStatus === "upcoming";

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Step Icon */}
                <div
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                      : isCurrent
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 animate-pulse"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {isCompleted ? <Check size={20} /> : <step.icon size={20} />}
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-semibold ${
                        isCompleted || isCurrent ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {step.label}
                    </h3>
                    {step.date && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(step.date)}</span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-0.5 ${
                      isCompleted || isCurrent ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {step.description}
                  </p>

                  {/* Current Step Indicator */}
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 px-3 py-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800"
                    >
                      <p className="text-sm text-amber-700 dark:text-amber-300">{statusConfig?.description}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// =============================================================================
// EVENT DETAILS CARD
// =============================================================================

const EventDetailsCard = ({ event }) => {
  const category = CATEGORY_CONFIG[event?.category] || CATEGORY_CONFIG.wedding;
  const eventDate = event?.eventDetails?.selectedDate;
  const daysUntil = getDaysUntil(eventDate);

  const details = [
    {
      icon: MapPin,
      label: "Event City",
      value: event?.city,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      icon: Calendar,
      label: "Event Date",
      value: eventDate ? formatDate(eventDate) : "Not specified",
      subValue: daysUntil ? `${daysUntil} days away` : null,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/30",
    },
    {
      icon: Clock,
      label: "Preferred Time",
      value: event?.eventDetails?.timeSlot || "Flexible",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/30",
    },
    {
      icon: DollarSign,
      label: "Budget",
      value: event?.budgetDetails?.valueFormatted ? `₹${event.budgetDetails.valueFormatted}` : "Not specified",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/30",
    },
    {
      icon: CreditCard,
      label: "Payment Preference",
      value: event?.budgetDetails?.paymentPreference || "Not specified",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/30",
    },
    {
      icon: Navigation,
      label: "Your Location",
      value: event?.currentLocation || "Not specified",
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-900/30",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
          <FileText size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Event Details</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your {category.title.toLowerCase()} requirements</p>
        </div>
      </div>

      {/* Event Type Badge */}
      <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{category.emoji}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category.title} Celebration</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">in {event?.city || "---"}</p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {details.map((detail, index) => (
          <motion.div
            key={detail.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className={`p-4 rounded-xl ${detail.bg} border border-gray-100 dark:border-gray-700`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${detail.color}`}>
                <detail.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{detail.label}</p>
                <p className="font-semibold text-gray-900 dark:text-white truncate">{detail.value}</p>
                {detail.subValue && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{detail.subValue}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// =============================================================================
// CONTACT INFO CARD
// =============================================================================

const ContactInfoCard = ({ event }) => {
  const [copiedField, setCopiedField] = useState(null);
  const haptic = useHapticFeedback();

  const handleCopy = async (text, field) => {
    haptic("light");
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const contacts = [
    {
      icon: User,
      label: "Name",
      value: event?.contactName,
      copyable: false,
    },
    {
      icon: Mail,
      label: "Email",
      value: event?.contactEmail,
      copyable: true,
    },
    {
      icon: Phone,
      label: "Phone",
      value: event?.fullPhone || event?.contactPhone,
      copyable: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Contact Information</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your registered details</p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact.label}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <contact.icon size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{contact.label}</p>
                <p className="font-semibold text-gray-900 dark:text-white">{contact.value || "Not provided"}</p>
              </div>
            </div>
            {contact.copyable && contact.value && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCopy(contact.value, contact.label)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {copiedField === contact.label ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} className="text-gray-400" />
                )}
              </motion.button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// =============================================================================
// COUNTDOWN CARD
// =============================================================================

const CountdownCard = ({ event }) => {
  const eventDate = event?.eventDetails?.selectedDate;
  const daysUntil = getDaysUntil(eventDate);

  if (!eventDate || daysUntil === null || daysUntil < 0) return null;

  const getCountdownColor = () => {
    if (daysUntil <= 7) return "from-red-500 to-red-600";
    if (daysUntil <= 30) return "from-orange-500 to-orange-600";
    if (daysUntil <= 90) return "from-amber-500 to-amber-600";
    return "from-green-500 to-green-600";
  };

  const getUrgencyMessage = () => {
    if (daysUntil <= 7) return "Event is very soon!";
    if (daysUntil <= 30) return "Less than a month away";
    if (daysUntil <= 90) return "Planning in progress";
    return "Plenty of time to plan";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className={`bg-gradient-to-br ${getCountdownColor()} rounded-2xl shadow-lg p-6 text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm mb-1">Days Until Event</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">{daysUntil}</span>
            <span className="text-xl">days</span>
          </div>
          <p className="text-white/80 text-sm mt-2">{getUrgencyMessage()}</p>
        </div>
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
          <CalendarDays size={40} className="text-white" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-sm text-white/80">{formatDate(eventDate)}</p>
      </div>
    </motion.div>
  );
};

// =============================================================================
// QUICK ACTIONS CARD
// =============================================================================

const QuickActionsCard = ({ event }) => {
  const haptic = useHapticFeedback();
  const [showShare, setShowShare] = useState(false);

  const handleShare = async () => {
    haptic("light");
    const shareData = {
      title: "My Event Proposal",
      text: `Check out my ${event?.category} proposal on PlanWab!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await copyToClipboard(window.location.href);
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    }
  };

  const actions = [
    {
      icon: MessageSquare,
      label: "Contact Support",
      description: "Get help with your proposal",
      color: "bg-blue-500",
      onClick: () => {
        haptic("light");
        window.location.href = "mailto:support@planwab.com";
      },
    },
    {
      icon: Share2,
      label: showShare ? "Link Copied!" : "Share",
      description: "Share this proposal",
      color: "bg-purple-500",
      onClick: handleShare,
    },
    {
      icon: Download,
      label: "Download",
      description: "Save proposal details",
      color: "bg-green-500",
      onClick: () => {
        haptic("light");
        // Implement download functionality
      },
    },
    {
      icon: HelpCircle,
      label: "FAQ",
      description: "Common questions",
      color: "bg-orange-500",
      onClick: () => {
        haptic("light");
        // Navigate to FAQ
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
          <Zap size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Helpful shortcuts</p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left group"
          >
            <div
              className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
            >
              <action.icon size={20} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{action.label}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{action.description}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// =============================================================================
// TIMELINE CARD
// =============================================================================

const TimelineCard = ({ event }) => {
  const timelineEvents = useMemo(() => {
    const events = [
      {
        id: 1,
        title: "Request Submitted",
        description: "Your proposal request was submitted successfully",
        date: event?.createdAt,
        icon: CheckCircle,
        color: "green",
      },
    ];

    if (event?.assignedAt) {
      events.push({
        id: 2,
        title: "Team Assigned",
        description: "A planning team has been assigned to your event",
        date: event.assignedAt,
        icon: Users,
        color: "blue",
      });
    }

    if (event?.status === "proposal-sent") {
      events.push({
        id: 3,
        title: "Proposal Sent",
        description: "Your personalized proposal has been sent",
        date: new Date().toISOString(),
        icon: FileText,
        color: "purple",
      });
    }

    if (event?.status === "confirmed") {
      events.push({
        id: 4,
        title: "Event Confirmed",
        description: "Your event has been confirmed",
        date: new Date().toISOString(),
        icon: Award,
        color: "amber",
      });
    }

    return events.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [event]);

  const getColorClasses = (color) => {
    const colors = {
      green: "bg-green-500 text-green-500 bg-green-50 dark:bg-green-900/30",
      blue: "bg-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-900/30",
      purple: "bg-purple-500 text-purple-500 bg-purple-50 dark:bg-purple-900/30",
      amber: "bg-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-900/30",
    };
    return colors[color] || colors.green;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
          <Activity size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Activity Timeline</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Recent updates</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {timelineEvents.map((item, index) => {
          const colorClasses = getColorClasses(item.color);
          const bgColor = colorClasses.split(" ").slice(2).join(" ");
          const iconBg = colorClasses.split(" ")[0];
          const textColor = colorClasses.split(" ")[1];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`p-4 rounded-xl ${bgColor} border border-gray-100 dark:border-gray-700`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${iconBg} text-white flex-shrink-0`}>
                  <item.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {getTimeAgo(item.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{item.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// =============================================================================
// SUPPORT CARD
// =============================================================================

const SupportCard = () => {
  const haptic = useHapticFeedback();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 text-white"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <Headphones size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">Need Help?</h3>
          <p className="text-gray-300 text-sm mb-4">
            Our support team is available 24/7 to assist you with any questions.
          </p>
          <div className="flex flex-wrap gap-3">
            <motion.a
              href="tel:+911234567890"
              whileTap={{ scale: 0.98 }}
              onClick={() => haptic("light")}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
            >
              <Phone size={16} />
              Call Us
            </motion.a>
            <motion.a
              href="mailto:support@planwab.com"
              whileTap={{ scale: 0.98 }}
              onClick={() => haptic("light")}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors text-sm font-medium"
            >
              <Mail size={16} />
              Email Support
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// =============================================================================
// ERROR STATE COMPONENT
// =============================================================================

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message || "We couldn't load your proposal. Please try again."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors"
          >
            Try Again
          </motion.button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold transition-colors text-center"
          >
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ProposalTrackingPage() {
  const params = useParams();
  const { user } = useUser();
  const proposalId = params?.id;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch event data
  const fetchEventData = useCallback(
    async (showRefresh = false) => {
      if (!proposalId) {
        setError("No proposal ID provided");
        setLoading(false);
        return;
      }

      try {
        if (showRefresh) {
          setIsRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const response = await fetch(`/api/plannedevent/add?id=${proposalId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch proposal");
        }

        if (!data.success || !data.event) {
          throw new Error("Proposal not found");
        }

        setEvent(data.event);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [proposalId]
  );

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  const handleRefresh = () => {
    fetchEventData(true);
  };

  // Loading state
  if (loading) {
    return null; // loading.jsx will handle this
  }

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={() => fetchEventData()} />;
  }

  // No event found
  if (!event) {
    return (
      <ErrorState message="Proposal not found. Please check the URL and try again." onRetry={() => fetchEventData()} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <TrackingHeader event={event} onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Tracker */}
            <ProgressTracker event={event} />

            {/* Event Details */}
            <EventDetailsCard event={event} />

            {/* Timeline */}
            <TimelineCard event={event} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Countdown */}
            <CountdownCard event={event} />

            {/* Contact Info */}
            <ContactInfoCard event={event} />

            {/* Quick Actions */}
            <QuickActionsCard event={event} />

            {/* Support */}
            <SupportCard />
          </div>
        </div>

        {/* Request Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Request submitted on {formatDate(event?.createdAt)} • Last updated {getTimeAgo(event?.updatedAt)}
          </p>
        </motion.div>
      </main>
    </div>
  );
}
