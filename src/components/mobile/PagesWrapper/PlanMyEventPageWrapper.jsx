"use client";

import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import {
  ChevronRight,
  ChevronLeft,
  X,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  User,
  Check,
  Clock,
  Star,
  Gift,
  CalendarDays,
  AlertCircle,
  TrendingUp,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useNavbarVisibilityStore } from "../../../GlobalState/navbarVisibilityStore";

// =============================================================================
// SPRING CONFIGURATIONS
// =============================================================================

const SPRING_CONFIGS = {
  snappy: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
  gentle: { type: "spring", stiffness: 120, damping: 20, mass: 1 },
  modal: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
};

// =============================================================================
// COUNTRY CODES DATA
// =============================================================================

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const formatDate = (date) => {
  if (!date) return "";
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
  const date = new Date(dateString);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 20, heavy: 40, success: [10, 30, 10], error: [30, 20, 30] };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

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

// =============================================================================
// CATEGORY CONFIG
// =============================================================================

const categoryConfig = {
  wedding: {
    title: "Wedding",
    icon: "💑",
    primaryIcon: "💍",
    primary: "#d97706",
    cities: [
      { name: "Delhi NCR", icon: "🏛️" },
      { name: "Bengaluru", icon: "🏢" },
      { name: "Goa", icon: "🏖️" },
      { name: "Udaipur", icon: "🕌" },
      { name: "Jaipur", icon: "🏰" },
      { name: "Jim Corbett", icon: "🐅" },
    ],
    features: ["Venues", "Decor", "Catering"],
    featureIcons: ["🏛️", "🎨", "🍽️"],
    questions: {
      city: "Where do you want to host your wedding?",
      date: "When do you plan to have your wedding?",
      budget: "What is your estimated overall budget?",
      name: "What shall we call you?",
      location: "Where are you currently located?",
    },
    tagline: "Your Wedding Requirements",
    description:
      "Let's start with these details to help us create your personalized proposal, with venue suggestions, decor ideas and more.",
    successMessage: "Your personalized wedding proposal is being crafted with love and attention to detail.",
    infoMessages: {
      city: "has amazing venues for memorable weddings.",
      date: "gives us great time to plan your special day.",
      budget: "We'll customize our recommendations to fit perfectly within your budget range.",
      name: "Your name helps us create a personalized proposal tailored just for you.",
      location: "Your location helps us assign the nearest planning team for better coordination.",
    },
  },
  anniversary: {
    title: "Anniversary",
    icon: "💕",
    primaryIcon: "🥂",
    primary: "#be185d",
    cities: [
      { name: "Mumbai", icon: "🌊" },
      { name: "Delhi NCR", icon: "🏛️" },
      { name: "Bangalore", icon: "🏢" },
      { name: "Kerala", icon: "🌴" },
      { name: "Shimla", icon: "🏔️" },
      { name: "Agra", icon: "🕌" },
    ],
    features: ["Venues", "Entertainment", "Dining"],
    featureIcons: ["🏛️", "🎵", "🍷"],
    questions: {
      city: "Where would you like to celebrate your anniversary?",
      date: "When is your anniversary celebration?",
      budget: "What is your celebration budget?",
      name: "How should we address you?",
      location: "Where are you currently located?",
    },
    tagline: "Your Anniversary Celebration",
    description:
      "Plan a memorable anniversary celebration with personalized venue options, entertainment ideas, and special touches.",
    successMessage: "Your anniversary celebration proposal is being prepared with special care.",
    infoMessages: {
      city: "is perfect for creating anniversary memories.",
      date: "is ideal for your anniversary celebration.",
      budget: "We'll create something special within your budget.",
      name: "Your name helps us personalize your anniversary celebration.",
      location: "Your location helps us provide better local recommendations and coordination.",
    },
  },
  birthday: {
    title: "Birthday",
    icon: "🎂",
    primaryIcon: "🎈",
    primary: "#a16207",
    cities: [
      { name: "Mumbai", icon: "🌃" },
      { name: "Delhi NCR", icon: "🏛️" },
      { name: "Pune", icon: "🏰" },
      { name: "Hyderabad", icon: "💎" },
      { name: "Chennai", icon: "🏖️" },
      { name: "Kolkata", icon: "🌉" },
    ],
    features: ["Themes", "Entertainment", "Cakes"],
    featureIcons: ["🎨", "🎪", "🎂"],
    questions: {
      city: "Where do you want to host the birthday party?",
      date: "When is the birthday celebration?",
      budget: "What's your party budget?",
      name: "Whose birthday are we celebrating?",
      location: "Where are you currently located?",
    },
    tagline: "Birthday Party Planning",
    description:
      "Create an unforgettable birthday celebration with customized themes, entertainment options, and party ideas.",
    successMessage: "Your birthday party proposal is being prepared with excitement and creativity.",
    infoMessages: {
      city: "offers great venues for birthday celebrations.",
      date: "will be a perfect day for celebration.",
      budget: "We'll make your birthday special within your budget.",
      name: "This helps us create a personalized birthday experience.",
      location: "Your location helps us find the best local vendors and services.",
    },
  },
};

const timeSlots = [
  "Morning (8 AM - 12 PM)",
  "Afternoon (12 PM - 4 PM)",
  "Evening (4 PM - 8 PM)",
  "Night (8 PM - 12 AM)",
];

// =============================================================================
// SCROLL PROGRESS BAR
// =============================================================================

const ScrollProgressBar = () => {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: progress > 2 ? 1 : 0 }}
    >
      <motion.div
        className={`h-full bg-gradient-to-r from-amber-600 to-amber-800`}
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
};

// =============================================================================
// MODAL OVERLAY
// =============================================================================

const ModalOverlay = memo(({ isOpen, onClose, children, title, subtitle }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={SPRING_CONFIGS.modal}
            className="w-full sm:max-w-lg bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle for mobile */}
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 sm:hidden" />

            {/* Header */}
            {(title || subtitle) && (
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
                <div>
                  {title && <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>}
                  {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </motion.button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ModalOverlay.displayName = "ModalOverlay";

// =============================================================================
// ENHANCED DATE PICKER MODAL
// =============================================================================

const DatePickerModal = memo(({ isOpen, onClose, onSave, currentDate, currentTime, theme, eventType }) => {
  const [selectedDate, setSelectedDate] = useState(currentDate || "");
  const [selectedTime, setSelectedTime] = useState(currentTime || "");
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const haptic = useHapticFeedback();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(currentDate || "");
      setSelectedTime(currentTime || "");
      setError("");
      setShowYearSelector(false);
      setShowMonthSelector(false);
      if (currentDate) {
        setCurrentMonth(new Date(currentDate));
      } else {
        setCurrentMonth(new Date());
      }
    }
  }, [isOpen, currentDate, currentTime]);

  const handleSave = useCallback(() => {
    if (!selectedDate) {
      setError("Please select a date");
      haptic("error");
      return;
    }

    const dateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateObj < today) {
      setError("Please select a future date");
      haptic("error");
      return;
    }

    haptic("success");
    onSave(selectedDate, selectedTime);
    onClose();
  }, [selectedDate, selectedTime, onSave, onClose, haptic]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const goToPrevMonth = () => {
    haptic("light");
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    haptic("light");
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const selectYear = (year) => {
    haptic("light");
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearSelector(false);
  };

  const selectMonth = (monthIndex) => {
    haptic("light");
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setShowMonthSelector(false);
  };

  const selectDate = (date) => {
    if (date && date >= today) {
      haptic("light");
      setSelectedDate(date.toISOString().split("T")[0]);
      setError("");
    }
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toISOString().split("T")[0] === selectedDate;
  };

  const isPast = (date) => {
    if (!date) return false;
    return date < today;
  };

  const isToday = (date) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  const themeColor = theme?.primary || "#d97706";

  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onClose}
      title={`Select ${eventType} Date`}
      subtitle="Choose your special day"
    >
      <div className="p-5">
        {/* Year & Month Selector Header */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goToPrevMonth}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </motion.button>

          <div className="flex items-center gap-2">
            {/* Month Selector */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowMonthSelector(!showMonthSelector);
                  setShowYearSelector(false);
                }}
                className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
              >
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {months[currentMonth.getMonth()]}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-gray-500 transition-transform ${showMonthSelector ? "rotate-180" : ""}`}
                />
              </motion.button>

              <AnimatePresence>
                {showMonthSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden w-40"
                  >
                    <div className="max-h-48 overflow-y-auto">
                      {months.map((month, idx) => (
                        <button
                          key={month}
                          onClick={() => selectMonth(idx)}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors ${
                            idx === currentMonth.getMonth()
                              ? "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-semibold"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Year Selector */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowYearSelector(!showYearSelector);
                  setShowMonthSelector(false);
                }}
                className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
              >
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{currentMonth.getFullYear()}</span>
                <ChevronDown
                  size={14}
                  className={`text-gray-500 transition-transform ${showYearSelector ? "rotate-180" : ""}`}
                />
              </motion.button>

              <AnimatePresence>
                {showYearSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden w-28"
                  >
                    <div className="max-h-48 overflow-y-auto">
                      {years.map((year) => (
                        <button
                          key={year}
                          onClick={() => selectYear(year)}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors ${
                            year === currentMonth.getFullYear()
                              ? "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-semibold"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goToNextMonth}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
          </motion.button>
        </div>

        {/* Quick Navigation */}
        <div className="flex gap-2 mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const today = new Date();
              setCurrentMonth(today);
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Today
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const nextMonth = new Date();
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              setCurrentMonth(nextMonth);
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Next Month
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const threeMonths = new Date();
              threeMonths.setMonth(threeMonths.getMonth() + 3);
              setCurrentMonth(threeMonths);
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            +3 Months
          </motion.button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, idx) => (
            <motion.button
              key={idx}
              whileTap={date && !isPast(date) ? { scale: 0.9 } : {}}
              onClick={() => selectDate(date)}
              disabled={!date || isPast(date)}
              className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                !date
                  ? "invisible"
                  : isPast(date)
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : isSelected(date)
                  ? "text-white shadow-lg"
                  : isToday(date)
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              style={isSelected(date) ? { backgroundColor: themeColor } : {}}
            >
              {date?.getDate()}
            </motion.button>
          ))}
        </div>

        {/* Preferred Time Selector */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
            Preferred Time (Optional)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <motion.button
                key={slot}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  haptic("light");
                  setSelectedTime(selectedTime === slot ? "" : slot);
                }}
                className={`p-3 rounded-xl text-xs font-medium transition-all border-2 ${
                  selectedTime === slot
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-amber-300"
                }`}
              >
                {slot}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Selected Date Display */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_CONFIGS.snappy}
            className="mt-4 p-4 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: `${themeColor}15` }}
          >
            <CalendarDays size={24} style={{ color: themeColor }} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatDate(selectedDate)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getDaysUntil(selectedDate)} days from now
                {selectedTime && ` • ${selectedTime}`}
              </p>
            </div>
            {selectedDate && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                <Check size={16} className="text-white" />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center gap-2"
            >
              <AlertCircle size={16} className="text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 pt-2 flex gap-3 border-t border-gray-100 dark:border-gray-700 mt-2">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 font-bold text-gray-600 dark:text-gray-300 text-sm"
        >
          Cancel
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
          style={{ backgroundColor: themeColor }}
        >
          <Check size={18} />
          Confirm Date
        </motion.button>
      </div>
    </ModalOverlay>
  );
});

DatePickerModal.displayName = "DatePickerModal";

// =============================================================================
// COUNTRY CODE PICKER MODAL
// =============================================================================

const CountryCodePickerModal = memo(({ isOpen, onClose, onSelect, selectedCode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const haptic = useHapticFeedback();

  const filteredCountries = useMemo(() => {
    return COUNTRY_CODES.filter(
      (country) => country.country.toLowerCase().includes(searchTerm.toLowerCase()) || country.code.includes(searchTerm)
    );
  }, [searchTerm]);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} title="Select Country Code" subtitle="Choose your country">
      <div className="p-4">
        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search country or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-amber-500"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Country List */}
        <div className="max-h-80 overflow-y-auto space-y-1">
          {filteredCountries.map((country, idx) => (
            <motion.button
              key={`${country.code}-${country.country}-${idx}`}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                haptic("light");
                onSelect(country);
                onClose();
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                selectedCode?.code === country.code && selectedCode?.country === country.country
                  ? "bg-amber-100 dark:bg-amber-900/50 border-2 border-amber-400"
                  : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50 border-2 border-transparent"
              }`}
            >
              <span className="text-2xl">{country.flag}</span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{country.country}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{country.code}</p>
              </div>
              {selectedCode?.code === country.code && selectedCode?.country === country.country && (
                <Check className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              )}
            </motion.button>
          ))}
          {filteredCountries.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">No countries found</div>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
});

CountryCodePickerModal.displayName = "CountryCodePickerModal";

// =============================================================================
// LOCATION PICKER MODAL
// =============================================================================

const LocationPickerModal = memo(({ isOpen, onClose, onSave, currentLocation }) => {
  const [locationMethod, setLocationMethod] = useState("manual");
  const [manualLocation, setManualLocation] = useState(currentLocation || "");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [detectedLocation, setDetectedLocation] = useState("");
  const [permissionStatus, setPermissionStatus] = useState("unknown"); // "unknown", "granted", "denied", "prompt", "unsupported"
  const [debugInfo, setDebugInfo] = useState("");
  const haptic = useHapticFeedback();

  // Check permission status on mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      setManualLocation(currentLocation || "");
      setLocationError("");
      setDetectedLocation("");
      setLocationMethod("manual");
      setDebugInfo("");
      checkPermissionStatus();
    }
  }, [isOpen, currentLocation]);

  const checkPermissionStatus = async () => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setPermissionStatus("unsupported");
      return;
    }

    // Check if permissions API is available
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: "geolocation" });
        setPermissionStatus(result.state);

        // Listen for permission changes
        result.onchange = () => {
          setPermissionStatus(result.state);
        };
      } catch (error) {
        // Permissions API not fully supported, but geolocation might still work
        setPermissionStatus("prompt");
      }
    } else {
      // Permissions API not available, assume we can try
      setPermissionStatus("prompt");
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    const apis = [
      // Primary: Nominatim (OpenStreetMap)
      async () => {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "PlanWab Event Planning App",
            },
          }
        );
        if (!response.ok) throw new Error("Nominatim failed");
        const data = await response.json();

        if (data && data.address) {
          const address = data.address;
          const parts = [];

          // Build address from most specific to least specific
          if (address.road || address.street) parts.push(address.road || address.street);
          if (address.suburb || address.neighbourhood || address.locality) {
            parts.push(address.suburb || address.neighbourhood || address.locality);
          }
          if (address.city || address.town || address.village || address.municipality) {
            parts.push(address.city || address.town || address.village || address.municipality);
          }
          if (address.state || address.region) parts.push(address.state || address.region);
          if (address.country) parts.push(address.country);

          if (parts.length > 0) {
            return parts.join(", ");
          }
        }

        if (data && data.display_name) {
          return data.display_name;
        }

        throw new Error("No address found");
      },

      // Backup: BigDataCloud (free, no API key required for basic usage)
      async () => {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        if (!response.ok) throw new Error("BigDataCloud failed");
        const data = await response.json();

        if (data) {
          const parts = [];
          if (data.locality) parts.push(data.locality);
          if (data.city) parts.push(data.city);
          if (data.principalSubdivision) parts.push(data.principalSubdivision);
          if (data.countryName) parts.push(data.countryName);

          if (parts.length > 0) {
            return parts.join(", ");
          }
        }

        throw new Error("No address found from BigDataCloud");
      },

      // Final fallback: Return coordinates as location
      async () => {
        return `Location: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
      },
    ];

    // Try each API in order
    for (const api of apis) {
      try {
        const result = await api();
        if (result) return result;
      } catch (error) {
        console.log("API attempt failed, trying next...", error.message);
        continue;
      }
    }

    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  };

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError("");
    setDebugInfo("");
    haptic("light");

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser. Please enter your location manually.");
      setIsLoadingLocation(false);
      haptic("error");
      return;
    }

    // Check if we're on HTTPS (required for geolocation on most browsers)
    if (
      typeof window !== "undefined" &&
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      setDebugInfo("Note: Geolocation works best on HTTPS connections.");
    }

    const geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    // Wrap geolocation in a promise for better control
    const getPosition = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, geolocationOptions);
      });
    };

    try {
      setDebugInfo("Requesting location access...");

      const position = await getPosition();
      const { latitude, longitude, accuracy } = position.coords;

      setDebugInfo(`Location found (accuracy: ${Math.round(accuracy)}m). Getting address...`);

      // Get readable address
      const locationString = await reverseGeocode(latitude, longitude);

      setDetectedLocation(locationString);
      setManualLocation(locationString);
      setDebugInfo("");
      haptic("success");
    } catch (error) {
      console.error("Geolocation error:", error);

      let errorMessage = "Unable to detect your location.";
      let suggestions = [];

      switch (error.code) {
        case 1: // PERMISSION_DENIED
          errorMessage = "Location access was denied.";
          suggestions = [
            "Click the location icon in your browser's address bar",
            "Go to browser settings and allow location access for this site",
            "On mobile: Check Settings → Privacy → Location Services",
          ];
          setPermissionStatus("denied");
          break;

        case 2: // POSITION_UNAVAILABLE
          errorMessage = "Your location could not be determined.";
          suggestions = [
            "Make sure your device's location/GPS is turned on",
            "Try moving to an area with better signal",
            "On desktop: Your IP-based location may not be accurate",
          ];
          break;

        case 3: // TIMEOUT
          errorMessage = "Location request timed out.";
          suggestions = [
            "Check your internet connection",
            "Try again in a moment",
            "Make sure GPS/Location is enabled on your device",
          ];
          break;

        default:
          errorMessage = error.message || "An unknown error occurred.";
          suggestions = ["Please try again or enter your location manually"];
      }

      setLocationError(errorMessage);
      setDebugInfo(suggestions.join(" • "));
      haptic("error");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Alternative: Try IP-based geolocation as fallback
  const handleIPBasedLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError("");
    setDebugInfo("Trying IP-based location detection...");
    haptic("light");

    try {
      // Use ipapi.co for IP-based geolocation (free tier available)
      const response = await fetch("https://ipapi.co/json/");

      if (!response.ok) {
        throw new Error("IP geolocation service unavailable");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.reason || "IP geolocation failed");
      }

      const parts = [];
      if (data.city) parts.push(data.city);
      if (data.region) parts.push(data.region);
      if (data.country_name) parts.push(data.country_name);

      if (parts.length > 0) {
        const locationString = parts.join(", ");
        setDetectedLocation(locationString);
        setManualLocation(locationString);
        setDebugInfo("Location detected via IP address (approximate)");
        haptic("success");
      } else {
        throw new Error("Could not determine location from IP");
      }
    } catch (error) {
      console.error("IP geolocation error:", error);
      setLocationError("Could not detect location. Please enter manually.");
      setDebugInfo("");
      haptic("error");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSave = () => {
    if (!manualLocation.trim()) {
      setLocationError("Please enter or detect your location");
      haptic("error");
      return;
    }
    haptic("success");
    onSave(manualLocation.trim());
    onClose();
  };

  const openLocationSettings = () => {
    // Provide instructions based on the platform
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = "";

    if (/iphone|ipad|ipod/.test(userAgent)) {
      instructions = "On iOS: Go to Settings → Privacy & Security → Location Services → Safari → Allow";
    } else if (/android/.test(userAgent)) {
      instructions = "On Android: Go to Settings → Location → App permissions → Browser → Allow";
    } else if (/chrome/.test(userAgent)) {
      instructions = "In Chrome: Click the lock/info icon in the address bar → Site settings → Location → Allow";
    } else if (/firefox/.test(userAgent)) {
      instructions = "In Firefox: Click the lock icon in the address bar → Clear permission and try again";
    } else if (/safari/.test(userAgent)) {
      instructions = "In Safari: Go to Preferences → Websites → Location → Allow for this site";
    } else {
      instructions = "Please check your browser settings to allow location access for this site";
    }

    setDebugInfo(instructions);
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} title="Your Current Location" subtitle="Help us serve you better">
      <div className="p-5 space-y-6">
        {/* Location Method Selection */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              haptic("light");
              setLocationMethod("manual");
              setLocationError("");
              setDebugInfo("");
            }}
            className={`p-4 rounded-xl border-2 transition-all ${
              locationMethod === "manual"
                ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30"
                : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50"
            }`}
          >
            <div className="text-2xl mb-2">✏️</div>
            <p
              className={`text-sm font-semibold ${
                locationMethod === "manual" ? "text-amber-800 dark:text-amber-200" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Enter Manually
            </p>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              haptic("light");
              setLocationMethod("automatic");
              setLocationError("");
              setDebugInfo("");
            }}
            className={`p-4 rounded-xl border-2 transition-all ${
              locationMethod === "automatic"
                ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30"
                : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50"
            }`}
          >
            <div className="text-2xl mb-2">📍</div>
            <p
              className={`text-sm font-semibold ${
                locationMethod === "automatic"
                  ? "text-amber-800 dark:text-amber-200"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Detect Location
            </p>
          </motion.button>
        </div>

        {/* Manual Entry */}
        {locationMethod === "manual" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Enter your location</label>
            <div className="relative">
              <input
                type="text"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                placeholder="e.g., Koramangala, Bangalore, Karnataka"
                className="w-full p-4 pl-11 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-amber-500"
              />
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter your area, city, and state for better recommendations
            </p>
          </motion.div>
        )}

        {/* Automatic Detection */}
        {locationMethod === "automatic" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Permission Status Warning */}
            {permissionStatus === "denied" && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                      Location Access Blocked
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mb-2">
                      You've previously denied location access. Please enable it in your browser settings.
                    </p>
                    <button
                      onClick={openLocationSettings}
                      className="text-xs font-semibold text-amber-600 dark:text-amber-400 underline"
                    >
                      How to enable location?
                    </button>
                  </div>
                </div>
              </div>
            )}

            {permissionStatus === "unsupported" && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                      Geolocation Not Supported
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      Your browser doesn't support geolocation. Please enter your location manually or try IP-based
                      detection.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Detection Buttons */}
            {!detectedLocation && !isLoadingLocation && (
              <div className="space-y-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGetCurrentLocation}
                  disabled={permissionStatus === "unsupported"}
                  className="w-full p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-white font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MapPin className="w-5 h-5" />
                  Detect My Location (GPS)
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleIPBasedLocation}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium flex items-center justify-center gap-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  Use Approximate Location (IP-based)
                </motion.button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  GPS is more accurate • IP-based works without permissions
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoadingLocation && (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full mx-auto mb-4"
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detecting your location...</p>
                {debugInfo && <p className="text-xs text-gray-500 dark:text-gray-400">{debugInfo}</p>}
              </div>
            )}

            {/* Success State */}
            {detectedLocation && !isLoadingLocation && (
              <>
                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
                        Location Detected!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">{detectedLocation}</p>
                    </div>
                  </div>
                </div>

                {debugInfo && <p className="text-xs text-center text-gray-500 dark:text-gray-400">{debugInfo}</p>}

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Edit if needed</label>
                  <input
                    type="text"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    className="w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGetCurrentLocation}
                    disabled={isLoadingLocation}
                    className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    <MapPin className="w-4 h-4" />
                    Retry GPS
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleIPBasedLocation}
                    disabled={isLoadingLocation}
                    className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    Retry IP
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {locationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800"
            >
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">{locationError}</p>
                  {debugInfo && <p className="text-xs text-red-500 dark:text-red-300 mt-2">{debugInfo}</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Text for Automatic */}
        {locationMethod === "automatic" && !detectedLocation && !isLoadingLocation && !locationError && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">Tips for best results</p>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Allow location access when prompted by your browser</li>
                  <li>• On mobile, ensure Location/GPS is turned on in device settings</li>
                  <li>• If GPS doesn't work, try the IP-based option (less accurate but reliable)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 pt-2 flex gap-3 border-t border-gray-100 dark:border-gray-700">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 font-bold text-gray-600 dark:text-gray-300 text-sm"
        >
          Cancel
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!manualLocation.trim()}
          className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          <Check size={18} />
          Confirm Location
        </motion.button>
      </div>
    </ModalOverlay>
  );
});

LocationPickerModal.displayName = "LocationPickerModal";

// =============================================================================
// LEFT PANEL
// =============================================================================

const LeftPanel = ({ category }) => {
  const config = categoryConfig[category] || categoryConfig.wedding;
  return (
    <div className="hidden lg:flex fixed top-0 left-0 w-[40%] h-screen flex-col items-center justify-between py-8 px-8 bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm shadow-xl rounded-r-3xl overflow-hidden z-10 border-r border-gray-200 dark:border-gray-700/50">
      <div className="w-full flex-shrink-0">
        <div className="mx-auto w-32 h-11 bg-gradient-to-r from-amber-600 to-amber-800 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">PlanWab</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="relative p-3 bg-gradient-to-br from-amber-50 to-amber-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl shadow-lg">
          <div className="relative w-64 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-800/30 flex items-center justify-center">
            <div className="text-5xl">{config.icon}</div>
          </div>
          <div className="absolute -top-2 -right-2 w-14 h-14 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center text-2xl">
            {config.primaryIcon}
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <span className="relative block h-1.5 w-10">
              <span className="absolute top-1/2 block h-0.5 w-full -translate-y-1/2 bg-amber-200 dark:bg-amber-800"></span>
              <span className="absolute left-0 top-0 block aspect-square h-1.5 rounded-full bg-amber-300 dark:bg-amber-600"></span>
            </span>
            <h4 className="font-serif text-xl font-semibold text-gray-800 dark:text-gray-100">{config.tagline}</h4>
            <span className="relative block h-1.5 w-10 rotate-180">
              <span className="absolute top-1/2 block h-0.5 w-full -translate-y-1/2 bg-amber-200 dark:bg-amber-800"></span>
              <span className="absolute left-0 top-0 block aspect-square h-1.5 rounded-full bg-amber-300 dark:bg-amber-600"></span>
            </span>
          </div>
          <p className="font-sans text-sm text-gray-600 dark:text-gray-400 max-w-sm px-4 leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-8">
        {config.features.map((item, index) => (
          <div key={item} className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-gradient-to-b from-amber-50 to-amber-200 dark:from-gray-700 dark:to-gray-600 p-2 shadow-lg">
              <div className="relative aspect-square w-14 overflow-hidden rounded-full border-2 border-white dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center">
                <span className="text-2xl">{config.featureIcons[index]}</span>
              </div>
            </div>
            <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// MOBILE HEADER
// =============================================================================

const MobileHeader = ({ category }) => {
  const config = categoryConfig[category] || categoryConfig.wedding;
  return (
    <div className="lg:hidden w-full p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm fixed top-0 left-0 z-20">
      <div className="flex items-center justify-between">
        <span className="text-amber-700 dark:text-amber-400 font-bold text-lg">PlanWab</span>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <span>{config.icon}</span>
          <span>{config.title}</span>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// EXIT MODAL
// =============================================================================

const ExitModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
      <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Are you sure?</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Your progress will be lost if you exit now.</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 rounded-xl font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Stay
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2 rounded-xl font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors"
        >
          Exit
        </button>
      </div>
    </div>
  </div>
);

// =============================================================================
// STEP HEADER
// =============================================================================

const StepHeader = ({ number, title, totalSteps = 5 }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-3">
      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
        Step {number} of {totalSteps}
      </span>
      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
          style={{ width: `${(number / totalSteps) * 100}%` }}
        />
      </div>
    </div>
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-gray-800 dark:text-gray-100 tracking-tight leading-tight max-w-4xl">
      {title}
    </h2>
  </div>
);

// =============================================================================
// INFO BOX
// =============================================================================

const InfoBox = ({ text, icon: Icon = Lightbulb }) => (
  <div className="mt-8 flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300">
    <Icon size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
    <span className="leading-relaxed text-sm">{text}</span>
  </div>
);

// =============================================================================
// CUSTOM DROPDOWN
// =============================================================================

const CustomDropdown = ({ label, value, onChange, options, placeholder, icon: Icon, optional = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const filteredOptions = (options || []).filter((option) =>
    String(option)?.toLowerCase().includes(searchTerm?.toLowerCase())
  );
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block font-serif font-medium text-gray-700 dark:text-gray-300 mb-3 text-base">
        {label}
        {optional && <span className="ml-2 text-xs font-normal text-gray-400">(Optional)</span>}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-white dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-left focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 flex items-center justify-between hover:border-amber-400 shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
          <span
            className={`text-base ${value ? "text-gray-800 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}
          >
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-30 overflow-hidden">
          {(options || []).length > 5 && (
            <div className="p-2 border-b dark:border-gray-700">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>
          )}
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-amber-50 dark:hover:bg-amber-900/40 transition-colors flex items-center justify-between group ${
                  value === option
                    ? "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-medium"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {String(option)}
                {value === option && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// STEP 1: CITY
// =============================================================================

const StepCity = ({ onNext, formData, category }) => {
  const [selectedCity, setSelectedCity] = useState(formData.city || null);
  const config = categoryConfig[category] || categoryConfig.wedding;
  useEffect(() => {
    if (selectedCity) {
      const timer = setTimeout(() => {
        onNext({ city: selectedCity });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedCity, onNext]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-in">
      <StepHeader number={1} title={config.questions.city} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {config.cities.map((city) => (
          <button
            key={city.name}
            onClick={() => setSelectedCity(city.name)}
            className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 text-center hover:shadow-xl transform hover:-translate-y-1 ${
              selectedCity === city.name
                ? "bg-gradient-to-br from-amber-600 to-amber-800 border-amber-800 shadow-xl text-white scale-105"
                : "bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-amber-400 dark:hover:border-amber-500 text-gray-800 dark:text-gray-200"
            }`}
          >
            <div className={`text-3xl mb-3 ${selectedCity === city.name ? "filter brightness-0 invert" : ""}`}>
              {city.icon}
            </div>
            <span className="font-medium text-xs sm:text-sm">{city.name}</span>
            {selectedCity === city.name && (
              <div className="mt-2">
                <Check className="w-5 h-5 mx-auto" />
              </div>
            )}
          </button>
        ))}
      </div>
      {selectedCity && <InfoBox text={`Great choice! ${selectedCity} ${config.infoMessages.city}`} icon={MapPin} />}
    </div>
  );
};

// =============================================================================
// STEP 2: DATE (Enhanced with Modal)
// =============================================================================

const StepDate = ({ onNext, onPrev, formData, category, setIsNavbarVisible }) => {
  const [selectedDate, setSelectedDate] = useState(formData.selectedDate || "");
  const [selectedTime, setSelectedTime] = useState(formData.timeSlot || "");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const config = categoryConfig[category] || categoryConfig.wedding;
  const haptic = useHapticFeedback();

  const handleDateSave = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleNext = () => {
    if (selectedDate) {
      const dateObj = new Date(selectedDate);
      const month = dateObj.toLocaleDateString("en-US", { month: "long" });
      const year = dateObj.getFullYear();
      const day = dateObj.getDate();

      onNext({
        selectedDate,
        timeSlot: selectedTime,
        month,
        year,
        day,
        // Keep these for backward compatibility
        dateRange: `${day}`,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-in">
      <StepHeader number={2} title={config.questions.date} />

      <div className="space-y-6">
        {/* Date Selection Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            haptic("light");
            setIsDatePickerOpen(true);
            setIsNavbarVisible(false);
          }}
          className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-xl ${
            selectedDate
              ? "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-400 dark:border-amber-600 shadow-lg"
              : "bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 border-dashed hover:border-amber-400"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                selectedDate
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-300"
              }`}
            >
              <CalendarDays size={28} />
            </div>
            <div className="flex-1">
              {selectedDate ? (
                <>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatDate(selectedDate)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getDaysUntil(selectedDate)} days from now
                    {selectedTime && ` • ${selectedTime}`}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Select your event date</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Tap to open the date picker</p>
                </>
              )}
            </div>
            <ChevronRight size={24} className="text-gray-400" />
          </div>
        </motion.button>

        {/* Selected Date Summary */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {new Date(selectedDate).getDate()}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Day</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {new Date(selectedDate).toLocaleDateString("en-US", { month: "short" })}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {new Date(selectedDate).getFullYear()}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Year</p>
            </div>
          </motion.div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400 text-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
          *We will confirm the exact date and time within 48 hours
        </div>
      </div>

      {selectedDate && (
        <InfoBox text={`Perfect! ${formatShortDate(selectedDate)} ${config.infoMessages.date}`} icon={Calendar} />
      )}

      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onPrev}
          className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 flex items-center justify-center shadow-xl hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-2xl transition-all duration-200 transform hover:scale-110"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          disabled={!selectedDate}
          onClick={handleNext}
          className="px-8 py-3 bg-rose-500 rounded-xl text-white font-semibold shadow-xl hover:bg-rose-600 hover:shadow-2xl disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 text-base flex items-center gap-2"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => {
          setIsDatePickerOpen(false);
          setIsNavbarVisible(true);
        }}
        onSave={handleDateSave}
        currentDate={selectedDate}
        currentTime={selectedTime}
        theme={{ primary: config.primary || "#d97706" }}
        eventType={config.title}
      />
    </div>
  );
};

// =============================================================================
// STEP 3: BUDGET (Previously Step 4)
// =============================================================================

const StepBudget = ({ onNext, onPrev, formData, category }) => {
  const [budget, setBudget] = useState(formData.budgetRange || 25);
  const [paymentPreference, setPaymentPreference] = useState(formData.paymentPreference || "");
  const config = categoryConfig[category] || categoryConfig.wedding;
  const budgetValue = React.useMemo(() => {
    if (budget <= 50) return `${budget * 2} Lakhs`;
    if (budget <= 75) return `${(((budget - 50) / 25) * 4 + 1).toFixed(1)} Crores`;
    return `${(((budget - 75) / 25) * 4 + 5).toFixed(1)} Crores`;
  }, [budget]);
  const paymentOptions = ["Full Payment", "Installments", "Part Payment"];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-in">
      <StepHeader number={3} title={config.questions.budget} />
      <div className="space-y-8">
        <div className="p-6 sm:p-8 bg-gradient-to-br from-white to-amber-50 dark:from-gray-700/50 dark:to-amber-900/20 rounded-2xl shadow-lg border border-amber-100 dark:border-amber-900/50">
          <p className="text-center text-3xl sm:text-4xl font-bold text-amber-800 dark:text-amber-300 mb-8">
            ₹{budgetValue}
          </p>
          <input
            type="range"
            min="5"
            max="100"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
            className="w-full h-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-4">
            <span>₹10 Lakhs</span>
            <span>₹9 Crores+</span>
          </div>
        </div>
        <div>
          <CustomDropdown
            label="Payment Preference"
            value={paymentPreference}
            onChange={setPaymentPreference}
            options={paymentOptions}
            placeholder="Select preference"
            icon={DollarSign}
            optional={true}
          />
        </div>
      </div>
      <InfoBox text={config.infoMessages.budget} icon={DollarSign} />
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onPrev}
          className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 flex items-center justify-center shadow-xl hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-2xl transition-all duration-200 transform hover:scale-110"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() =>
            onNext({
              budget: budgetValue,
              paymentPreference: paymentPreference || "",
              budgetRange: budget,
            })
          }
          className="px-8 py-3 bg-rose-500 rounded-xl text-white font-semibold shadow-xl hover:bg-rose-600 hover:shadow-2xl transition-all duration-200 transform hover:scale-105 text-base flex items-center gap-2"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// STEP 4: NAME (with Country Code Picker)
// =============================================================================

const StepName = ({ onNext, onPrev, formData, category, isSubmitting, submitError, setIsNavbarVisible }) => {
  const [name, setName] = useState(formData.name || "");
  const [email, setEmail] = useState(formData.email || "");
  const [phone, setPhone] = useState(formData.phone || "");
  const [selectedCountry, setSelectedCountry] = useState(
    formData.countryCode || { code: "+91", country: "India", flag: "🇮🇳" }
  );
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const config = categoryConfig[category] || categoryConfig.wedding;
  const haptic = useHapticFeedback();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-in">
      <StepHeader number={4} title={config.questions.name} />
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block font-serif font-medium text-gray-700 dark:text-gray-300 mb-3 text-base">
              Your Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-4 pl-12 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base transition-all duration-200 hover:border-amber-400 shadow-sm hover:shadow-md"
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block font-serif font-medium text-gray-700 dark:text-gray-300 mb-3 text-base">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-4 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base transition-all duration-200 hover:border-amber-400 shadow-sm hover:shadow-md"
            />
          </div>
          <div>
            <label className="block font-serif font-medium text-gray-700 dark:text-gray-300 mb-3 text-base">
              Phone Number
            </label>
            <div className="flex gap-2">
              {/* Country Code Selector */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  haptic("light");
                  setIsCountryPickerOpen(true);
                  setIsNavbarVisible(false);
                }}
                className="flex items-center gap-2 px-3 py-4 bg-white dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-amber-400 transition-all shadow-sm hover:shadow-md min-w-[100px]"
              >
                <span className="text-xl">{selectedCountry.flag}</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{selectedCountry.code}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </motion.button>

              {/* Phone Input */}
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="XXXXX XXXXX"
                className="flex-1 p-4 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base transition-all duration-200 hover:border-amber-400 shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>
        {submitError && (
          <div className="my-4 text-center p-3 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 rounded-lg text-sm">
            <strong>Error:</strong> {submitError}
          </div>
        )}
        <InfoBox text={config.infoMessages.name} icon={User} />
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center pt-4 gap-4">
        <button
          onClick={onPrev}
          className="w-full sm:w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl sm:rounded-full text-gray-600 dark:text-gray-300 flex items-center justify-center shadow-xl hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-2xl transition-all duration-200 transform hover:scale-110"
        >
          <ChevronLeft size={20} className="sm:inline" />
          <span className="sm:hidden">Previous Step</span>
        </button>
        <button
          disabled={!name.trim() || !email.trim() || isSubmitting}
          onClick={() =>
            onNext({
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              countryCode: selectedCountry,
              fullPhone: phone.trim() ? `${selectedCountry.code} ${phone.trim()}` : "",
            })
          }
          className="w-full sm:w-auto px-8 py-3 bg-rose-500 rounded-xl text-white font-semibold shadow-xl hover:bg-rose-600 hover:shadow-2xl disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 text-base flex items-center justify-center gap-2"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Country Code Picker Modal */}
      <CountryCodePickerModal
        isOpen={isCountryPickerOpen}
        onClose={() => {
          setIsCountryPickerOpen(false);
          setIsNavbarVisible(true);
        }}
        onSelect={setSelectedCountry}
        selectedCode={selectedCountry}
      />
    </div>
  );
};

// =============================================================================
// STEP 5: LOCATION
// =============================================================================

const StepLocation = ({ onNext, onPrev, formData, category, isSubmitting, submitError, setIsNavbarVisible }) => {
  const [currentLocation, setCurrentLocation] = useState(formData.currentLocation || "");
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const config = categoryConfig[category] || categoryConfig.wedding;
  const haptic = useHapticFeedback();

  const handleLocationSave = (location) => {
    setCurrentLocation(location);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-in">
      <StepHeader number={5} title={config.questions.location} />
      <div className="space-y-6">
        {/* Location Selection Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            haptic("light");
            setIsLocationPickerOpen(true);
            setIsNavbarVisible(false);
          }}
          className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-xl ${
            currentLocation
              ? "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-400 dark:border-amber-600 shadow-lg"
              : "bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 border-dashed hover:border-amber-400"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                currentLocation
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-300"
              }`}
            >
              <MapPin size={28} />
            </div>
            <div className="flex-1">
              {currentLocation ? (
                <>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{currentLocation}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tap to change location</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Set your current location</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Enter manually or detect automatically</p>
                </>
              )}
            </div>
            <ChevronRight size={24} className="text-gray-400" />
          </div>
        </motion.button>

        {currentLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-700 dark:text-green-300">
                Location set successfully! This helps us coordinate better with local teams.
              </p>
            </div>
          </motion.div>
        )}

        {submitError && (
          <div className="my-4 text-center p-3 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 rounded-lg text-sm">
            <strong>Error:</strong> {submitError}
          </div>
        )}

        <InfoBox text={config.infoMessages.location} icon={MapPin} />
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center pt-4 gap-4">
        <button
          onClick={onPrev}
          className="w-full sm:w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl sm:rounded-full text-gray-600 dark:text-gray-300 flex items-center justify-center shadow-xl hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-2xl transition-all duration-200 transform hover:scale-110"
        >
          <ChevronLeft size={20} className="sm:inline" />
          <span className="sm:hidden">Previous Step</span>
        </button>
        <button
          disabled={!currentLocation.trim() || isSubmitting}
          onClick={() =>
            onNext({
              currentLocation: currentLocation.trim(),
            })
          }
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl text-white font-semibold shadow-xl hover:shadow-2xl disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 text-base flex items-center justify-center gap-2"
        >
          {isSubmitting ? "Submitting..." : "Generate My Proposal"}
          {!isSubmitting && <Star className="w-5 h-5" />}
        </button>
      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => {
          setIsLocationPickerOpen(false);
          setIsNavbarVisible(true);
        }}
        onSave={handleLocationSave}
        currentLocation={currentLocation}
      />
    </div>
  );
};

// =============================================================================
// DETAIL ITEM
// =============================================================================

const DetailItem = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg">
      <div className="flex-shrink-0 w-8 h-8 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 rounded-full flex items-center justify-center mt-1">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-800 dark:text-gray-100 text-base">{value}</p>
      </div>
    </div>
  );
};

// =============================================================================
// STEP SUCCESS (Enhanced)
// =============================================================================

const StepSuccess = ({ category, formData, onPrev, onReset }) => {
  const config = categoryConfig[category] || categoryConfig.wedding;
  const fullDate = formData?.selectedDate
    ? formatDate(formData.selectedDate)
    : [formData?.month, formData?.dateRange, formData?.year].filter(Boolean).join(", ");

  // Simulated tracking data
  const trackingSteps = [
    { label: "Request Received", status: "completed", date: "Just now" },
    { label: "Team Assignment", status: "in-progress", date: "Within 2 hours" },
    { label: "Proposal Creation", status: "pending", date: "Within 24 hours" },
    { label: "Review & Finalize", status: "pending", date: "Within 48 hours" },
  ];

  const progressPercentage = 25; // First step completed

  return (
    <div className="w-full max-w-4xl mx-auto text-center space-y-8 animate-slide-in">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative"
      >
        <div className="text-7xl mb-2">🎉</div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-2 -right-2 sm:right-1/4"
        >
          <Sparkles className="w-8 h-8 text-amber-400" />
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-gray-800 dark:text-gray-100">
          Thank You, {formData?.name || "friend"}!
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{config.successMessage}</p>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          We&apos;ll be in touch within 24 hours. A summary of your request is below.
        </p>
      </motion.div>

      {/* Progress Tracking Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Proposal Progress</h3>
          </div>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{progressPercentage}%</span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-amber-200 dark:bg-amber-900/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
          />
        </div>

        {/* Tracking Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {trackingSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className={`p-3 rounded-xl text-center ${
                step.status === "completed"
                  ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                  : step.status === "in-progress"
                  ? "bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700"
                  : "bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
              }`}
            >
              <div className="flex justify-center mb-2">
                {step.status === "completed" ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : step.status === "in-progress" ? (
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-500" />
                )}
              </div>
              <p
                className={`text-xs font-semibold ${
                  step.status === "completed"
                    ? "text-green-700 dark:text-green-300"
                    : step.status === "in-progress"
                    ? "text-amber-700 dark:text-amber-300"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.label}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{step.date}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Plan Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-left bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6"
      >
        <h3 className="text-xl sm:text-2xl font-serif font-semibold text-gray-800 dark:text-gray-100 mb-2 text-center">
          Your Plan Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem icon={MapPin} label="City" value={formData?.city} />
          <DetailItem icon={Calendar} label="Event Date" value={fullDate} />
          <DetailItem icon={DollarSign} label="Estimated Budget" value={formData?.budget} />
          <DetailItem icon={User} label="Contact Name" value={formData?.name} />
          <DetailItem icon={Gift} label="Event Type" value={config?.title} />
          {formData?.timeSlot && <DetailItem icon={Clock} label="Preferred Time" value={formData?.timeSlot} />}
          {formData?.currentLocation && (
            <DetailItem icon={MapPin} label="Your Location" value={formData?.currentLocation} />
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link
          href={`/m/user/proposals/tracking/${genratedPurposalId}`}
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <BarChart3 size={20} />
          Go to Tracking Dashboard
          <ArrowRight size={18} />
        </Link>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Plan Another Event
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="pt-4">
        <Link
          href="/"
          className="text-sm text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium transition-colors"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function PlanMyEventPageWrapper() {
  const { user } = useUser();
  const params = useParams();
  const category = params?.category || "wedding";
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [showExitModal, setShowExitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [genratedPurposalId, setGenratedProposalId] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const { isNavbarVisible, setIsNavbarVisible } = useNavbarVisibilityStore();

  const handleNextStep = async (data) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    if (currentStep === 5) {
      setIsSubmitting(true);
      setSubmitError(null);

      const payload = {
        clerkId: user?.id,
        username: user?.username,
        userId: user?.internalUser?._id,
        category: category,
        city: updatedFormData?.city,
        year: updatedFormData?.year,
        month: updatedFormData?.month,
        dateRange: updatedFormData?.dateRange,
        timeSlot: updatedFormData?.timeSlot,
        selectedDate: updatedFormData?.selectedDate,
        budget: updatedFormData?.budget,
        budgetRange: updatedFormData?.budgetRange,
        paymentPreference: updatedFormData?.paymentPreference || "",
        name: updatedFormData?.name,
        email: updatedFormData?.email,
        phone: updatedFormData?.fullPhone || updatedFormData?.phone,
        countryCode: updatedFormData?.countryCode?.code,
        currentLocation: updatedFormData?.currentLocation,
      };

      try {
        const response = await fetch("/api/plannedevent/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to submit the proposal.");
        }

        const data = await response.json();
        const proposalId = data?.event?.id;
        setGenratedProposalId(proposalId);

        setCurrentStep((prev) => prev + 1);
      } catch (error) {
        setSubmitError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleReset = () => {
    setFormData({});
    setCurrentStep(1);
  };

  const handleExit = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StepCity onNext={handleNextStep} formData={formData} category={category} />;
      case 2:
        return (
          <StepDate
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            formData={formData}
            category={category}
            setIsNavbarVisible={setIsNavbarVisible}
          />
        );
      case 3:
        return <StepBudget onNext={handleNextStep} onPrev={handlePrevStep} formData={formData} category={category} />;
      case 4:
        return (
          <StepName
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            formData={formData}
            category={category}
            isSubmitting={false}
            submitError={null}
            setIsNavbarVisible={setIsNavbarVisible}
          />
        );
      case 5:
        return (
          <StepLocation
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            formData={formData}
            category={category}
            isSubmitting={isSubmitting}
            submitError={submitError}
            setIsNavbarVisible={setIsNavbarVisible}
          />
        );
      case 6:
        return <StepSuccess category={category} formData={formData} onPrev={handlePrevStep} onReset={handleReset} />;
      default:
        return <StepCity onNext={handleNextStep} formData={formData} category={category} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:from-gray-900 dark:to-amber-900/10 relative">
      <ScrollProgressBar />
      <MobileHeader category={category} />
      <LeftPanel category={category} />
      <main className="flex-1 lg:ml-[40%] relative pt-14">
        <button
          onClick={() => setShowExitModal(true)}
          className="fixed top-11 right-5 sm:top-22 sm:right-5 z-30 w-10 h-10 lg:w-12 lg:h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-2xl transition-all duration-200 transform hover:scale-110 border border-gray-200 dark:border-gray-700"
        >
          <X className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] lg:min-h-screen py-12 px-4 sm:px-10 lg:px-20">
          {renderCurrentStep()}
        </div>
      </main>
      {showExitModal && <ExitModal onConfirm={handleExit} onCancel={() => setShowExitModal(false)} />}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d97706 0%, #92400e 100%);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }
        .dark .slider::-webkit-slider-thumb {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        .slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d97706 0%, #92400e 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .dark .slider::-moz-range-thumb {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
