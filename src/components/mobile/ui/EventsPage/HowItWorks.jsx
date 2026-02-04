"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MessageCircle,
  Calendar,
  CheckCircle,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Clock,
  Star,
  CircleCheck,
  Zap,
  Heart,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import Banner2 from "./Banner2";

// =============================================================================
// CONSTANTS
// =============================================================================

const SPRING_CONFIG = {
  gentle: { type: "spring", stiffness: 120, damping: 20 },
  snappy: { type: "spring", stiffness: 300, damping: 30 },
};

const STEPS_DATA = {
  wedding: [
    {
      id: 1,
      icon: Search,
      title: "Browse & Discover",
      description: "Explore 500+ verified wedding vendors across all categories",
      color: "#7c3aed",
      features: ["Filter by budget & location", "Read verified reviews", "Compare prices instantly"],
      stat: "500+",
      statLabel: "Vendors",
    },
    {
      id: 2,
      icon: MessageCircle,
      title: "Connect & Discuss",
      description: "Chat directly with vendors to discuss your requirements",
      color: "#db2777",
      features: ["Instant messaging", "Share your vision", "Get custom quotes"],
      stat: "24hr",
      statLabel: "Response",
    },
    {
      id: 3,
      icon: Calendar,
      title: "Book & Schedule",
      description: "Secure your dates and make hassle-free bookings",
      color: "#d97706",
      features: ["Check real-time availability", "Secure payment options", "Instant confirmation"],
      stat: "100%",
      statLabel: "Secure",
    },
    {
      id: 4,
      icon: CheckCircle,
      title: "Celebrate",
      description: "Enjoy your perfect wedding with peace of mind",
      color: "#059669",
      features: ["Dedicated coordinator", "Day-of support", "Memories forever"],
      stat: "10K+",
      statLabel: "Weddings",
    },
  ],
  anniversary: [
    {
      id: 1,
      icon: Search,
      title: "Find Perfect Spots",
      description: "Discover romantic venues and unique experiences",
      color: "#be185d",
      features: ["Curated romantic selection", "Intimate venues", "Special packages"],
      stat: "300+",
      statLabel: "Venues",
    },
    {
      id: 2,
      icon: Heart,
      title: "Customize Your Day",
      description: "Work with vendors to create personalized experiences",
      color: "#e11d48",
      features: ["Personal touches", "Surprise planning", "Custom arrangements"],
      stat: "100%",
      statLabel: "Custom",
    },
    {
      id: 3,
      icon: Calendar,
      title: "Book Seamlessly",
      description: "Quick and easy booking for stress-free planning",
      color: "#7c3aed",
      features: ["Flexible dates", "Easy payments", "Instant booking"],
      stat: "5min",
      statLabel: "Booking",
    },
    {
      id: 4,
      icon: Sparkles,
      title: "Celebrate Love",
      description: "Enjoy your special anniversary celebration",
      color: "#059669",
      features: ["Stress-free experience", "Memorable moments", "Perfect execution"],
      stat: "5K+",
      statLabel: "Celebrations",
    },
  ],
  birthday: [
    {
      id: 1,
      icon: Search,
      title: "Explore Ideas",
      description: "Browse party themes, venues, and entertainment",
      color: "#a16207",
      features: ["Themed party options", "Age-appropriate venues", "Entertainment ideas"],
      stat: "400+",
      statLabel: "Options",
    },
    {
      id: 2,
      icon: MessageCircle,
      title: "Plan Together",
      description: "Coordinate with vendors for the perfect party",
      color: "#7c3aed",
      features: ["Share your vision", "Get expert suggestions", "Custom packages"],
      stat: "24hr",
      statLabel: "Response",
    },
    {
      id: 3,
      icon: Calendar,
      title: "Book Everything",
      description: "One-stop booking for all party needs",
      color: "#db2777",
      features: ["Bundle & save", "Easy checkout", "Instant confirmation"],
      stat: "20%",
      statLabel: "Savings",
    },
    {
      id: 4,
      icon: ThumbsUp,
      title: "Party Time!",
      description: "Throw an unforgettable birthday celebration",
      color: "#059669",
      features: ["On-time delivery", "Coordinator support", "Epic memories"],
      stat: "15K+",
      statLabel: "Parties",
    },
  ],
  default: [
    {
      id: 1,
      icon: Search,
      title: "Discover Options",
      description: "Browse verified vendors and venues",
      color: "#1e40af",
      features: ["Wide selection", "Verified vendors", "Easy filtering"],
      stat: "500+",
      statLabel: "Vendors",
    },
    {
      id: 2,
      icon: MessageCircle,
      title: "Connect",
      description: "Discuss your requirements with professionals",
      color: "#7c3aed",
      features: ["Direct messaging", "Quick responses", "Custom quotes"],
      stat: "24hr",
      statLabel: "Response",
    },
    {
      id: 3,
      icon: Calendar,
      title: "Book",
      description: "Secure your booking with confidence",
      color: "#d97706",
      features: ["Secure payments", "Instant confirmation", "Flexible options"],
      stat: "100%",
      statLabel: "Secure",
    },
    {
      id: 4,
      icon: CheckCircle,
      title: "Celebrate",
      description: "Enjoy your perfectly planned event",
      color: "#059669",
      features: ["Professional service", "Support available", "Great memories"],
      stat: "10K+",
      statLabel: "Events",
    },
  ],
};
STEPS_DATA.Default = STEPS_DATA.default;

const STATS_DATA = {
  wedding: [
    { icon: Users, value: "10,000+", label: "Happy Couples" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Shield, value: "100%", label: "Verified Vendors" },
    { icon: Zap, value: "24/7", label: "Support" },
  ],
  anniversary: [
    { icon: Heart, value: "5,000+", label: "Celebrations" },
    { icon: Star, value: "4.8", label: "Average Rating" },
    { icon: Shield, value: "100%", label: "Verified" },
    { icon: Zap, value: "24/7", label: "Support" },
  ],
  birthday: [
    { icon: Users, value: "15,000+", label: "Parties" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Shield, value: "100%", label: "Verified" },
    { icon: Zap, value: "24/7", label: "Support" },
  ],
  default: [
    { icon: Users, value: "10,000+", label: "Events" },
    { icon: Star, value: "4.8", label: "Rating" },
    { icon: Shield, value: "100%", label: "Verified" },
    { icon: Zap, value: "24/7", label: "Support" },
  ],
};
STATS_DATA.Default = STATS_DATA.default;

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 20, heavy: 40, success: [10, 30, 10] };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function HowItWorksSection({ theme, category }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);
  const haptic = useHapticFeedback();

  const steps = useMemo(() => STEPS_DATA[category] || STEPS_DATA.default, [category]);
  const stats = useMemo(() => STATS_DATA[category] || STATS_DATA.default, [category]);

  // Auto-play steps
  useEffect(() => {
    if (!isAutoPlaying || isPaused) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, isPaused, steps.length]);

  const handleStepClick = useCallback(
    (idx) => {
      haptic("light");
      setActiveStep(idx);
      setIsAutoPlaying(false);
    },
    [haptic]
  );

  const toggleAutoPlay = useCallback(() => {
    haptic("light");
    setIsAutoPlaying((prev) => !prev);
  }, [haptic]);

  const activeStepData = steps[activeStep];
  const StepIcon = activeStepData.icon;

  return (
    <section className="py-8 sm:py-10 px-4 sm:px-5">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3"
          style={{ backgroundColor: `${theme.primary}12` }}
        >
          <Sparkles size={16} style={{ color: theme.primary }} />
          <span className="text-sm font-semibold" style={{ color: theme.primary }}>
            Simple Process
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-3xl font-black text-gray-900 mb-2"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-gray-500 max-w-md mx-auto"
        >
          Plan your perfect {theme?.name?.toLowerCase()} in 4 easy steps
        </motion.p>
      </div>

      {/* Progress & Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-gray-500">
            Step {activeStep + 1} of {steps.length}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleAutoPlay}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
            style={{
              backgroundColor: isAutoPlaying ? `${theme.primary}12` : "#f3f4f6",
              color: isAutoPlaying ? theme.primary : "#6b7280",
            }}
          >
            {isAutoPlaying ? <Pause size={12} /> : <Play size={12} />}
            {isAutoPlaying ? "Auto" : "Paused"}
          </motion.button>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: theme.primary }}
            initial={{ width: 0 }}
            animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Steps Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="relative mb-6 sm:mb-8"
      >
        {/* Connection Line */}
        <div className="absolute top-6 left-8 right-8 h-0.5 bg-gray-200 z-0" />
        <motion.div
          className="absolute top-6 left-8 h-0.5 z-10"
          style={{ backgroundColor: theme.primary }}
          initial={{ width: 0 }}
          animate={{
            width: steps.length > 1 ? `${(activeStep / (steps.length - 1)) * (100 - 16)}%` : "0%",
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Step Indicators */}
        <div className="relative flex justify-between px-2">
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
            const isPast = idx < activeStep;
            const CurrentStepIcon = step.icon;

            return (
              <motion.button
                key={step.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStepClick(idx)}
                className="flex flex-col items-center z-20 group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    backgroundColor: isActive || isPast ? step.color : "#e5e7eb",
                  }}
                  transition={SPRING_CONFIG.snappy}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-md mb-2"
                  style={{
                    boxShadow: isActive ? `0 4px 20px ${step.color}40` : "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {isPast ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CircleCheck size={22} className="text-white" />
                    </motion.div>
                  ) : (
                    <CurrentStepIcon size={20} className={isActive || isPast ? "text-white" : "text-gray-400"} />
                  )}
                </motion.div>
                <motion.span
                  animate={{
                    color: isActive ? "#111827" : "#9ca3af",
                    fontWeight: isActive ? 700 : 500,
                  }}
                  className="text-[10px] sm:text-xs text-center max-w-[60px] sm:max-w-[70px] leading-tight"
                >
                  {step.title.split(" ")[0]}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Active Step Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={SPRING_CONFIG.snappy}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 relative"
              style={{ backgroundColor: `${activeStepData.color}15` }}
            >
              <StepIcon size={28} style={{ color: activeStepData.color }} />
              {/* Stat Badge */}
              <div
                className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                style={{ backgroundColor: activeStepData.color }}
              >
                {activeStepData.stat}
              </div>
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">{activeStepData.title}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{activeStepData.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {activeStepData.features.map((feature, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, ...SPRING_CONFIG.gentle }}
                    className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600"
                  >
                    {feature}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Banner 2 */}
      <Banner2 theme={theme} />

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <Link
          href="/vendors/marketplace"
          onClick={() => haptic("medium")}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
          style={{ backgroundColor: theme.primary }}
        >
          Start Planning Now
          <ArrowRight size={18} />
        </Link>
      </motion.div>

      {/* Trust Badge */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-2"
      >
        <Shield size={14} />
        Trusted by thousands of happy customers
      </motion.p>
    </section>
  );
}
