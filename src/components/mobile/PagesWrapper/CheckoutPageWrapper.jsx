"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef, memo, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  CreditCard,
  Calendar,
  Gift,
  HelpCircle,
  Home,
  Info,
  Lock,
  MapPin,
  MessageCircle,
  Minus,
  MoreHorizontal,
  Percent,
  Phone,
  Plus,
  Shield,
  ShoppingBag,
  Star,
  Tag,
  Trash2,
  User,
  Users,
  Wallet,
  X,
  AlertCircle,
  Building,
  Mail,
  FileText,
  Sparkles,
  BadgeCheck,
  Copy,
  RefreshCw,
  ChevronLeft,
  Edit3,
  Navigation,
  Banknote,
  Smartphone,
  QrCode,
  Receipt,
  PartyPopper,
  Heart,
  Share2,
  Download,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "../../../GlobalState/CartDataStore";

// =============================================================================
// CONSTANTS
// =============================================================================

const COLORS = {
  primary: "#2563eb",
  primaryLight: "#3b82f6",
  primaryDark: "#1d4ed8",
  secondary: "#f59e0b",
  secondaryLight: "#fbbf24",
  success: "#10b981",
  successLight: "#34d399",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#06b6d4",
};

const SPRING_CONFIG = {
  stiff: { type: "spring", stiffness: 400, damping: 30 },
  gentle: { type: "spring", stiffness: 200, damping: 25 },
  bouncy: { type: "spring", stiffness: 300, damping: 20 },
};

const CHECKOUT_STEPS = [
  { id: 1, label: "Cart", icon: ShoppingBag },
  { id: 2, label: "Details", icon: User },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Confirm", icon: CheckCircle },
];

const PAYMENT_METHODS = [
  { id: "card", label: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
  { id: "upi", label: "UPI", icon: Smartphone, description: "GPay, PhonePe, Paytm" },
  { id: "netbanking", label: "Net Banking", icon: Building, description: "All major banks" },
  { id: "wallet", label: "Wallets", icon: Wallet, description: "Paytm, Mobikwik, Amazon Pay" },
  { id: "emi", label: "EMI", icon: Banknote, description: "No cost EMI available" },
  { id: "cod", label: "Pay Later", icon: Clock, description: "Pay 20% now, rest later" },
];

const POPULAR_BANKS = [
  { id: "hdfc", name: "HDFC Bank" },
  { id: "icici", name: "ICICI Bank" },
  { id: "sbi", name: "State Bank of India" },
  { id: "axis", name: "Axis Bank" },
  { id: "kotak", name: "Kotak Mahindra" },
  { id: "pnb", name: "Punjab National Bank" },
];

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", color: "#4285F4" },
  { id: "phonepe", name: "PhonePe", color: "#5F259F" },
  { id: "paytm", name: "Paytm", color: "#00BAF2" },
  { id: "bhim", name: "BHIM", color: "#00A651" },
];

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = useCallback(
    (value) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, isHydrated];
}

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50, success: [10, 50, 10] };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const formatPrice = (price) => {
  if (isNaN(price) || price === 0) return "0";
  return price.toLocaleString("en-IN");
};

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

const ScrollProgressBar = () => {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: progress > 2 ? 1 : 0 }}
    >
      <motion.div
        className={`h-full bg-gradient-to-r ${"from-blue-600 to-yellow-500"}`}
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone.replace(/\D/g, ""));
};

const validateCard = (number) => {
  const cleaned = number.replace(/\D/g, "");
  return cleaned.length === 16;
};

const formatCardNumber = (value) => {
  const cleaned = value.replace(/\D/g, "");
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(" ") : cleaned;
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const MOCK_COUPONS = [
  {
    code: "FIRST20",
    discount: 20,
    type: "percent",
    maxDiscount: 25000,
    minOrder: 100000,
    description: "20% off on first booking",
  },
  {
    code: "WEDDING10",
    discount: 10,
    type: "percent",
    maxDiscount: 15000,
    minOrder: 50000,
    description: "10% off on wedding bookings",
  },
  { code: "FLAT5K", discount: 5000, type: "flat", minOrder: 75000, description: "Flat ₹5,000 off" },
];

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

// -----------------------------------------------------------------------------
// Toast Notification
// -----------------------------------------------------------------------------
const Toast = memo(({ message, type = "success", isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const icons = { success: CheckCircle, error: AlertCircle, info: Info, warning: AlertCircle };
  const Icon = icons[type];
  const colors = { success: "bg-green-500", error: "bg-red-500", info: "bg-blue-500", warning: "bg-amber-500" };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={`fixed top-4 left-4 right-4 z-[300] ${colors[type]} text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3`}
        >
          <Icon size={20} />
          <span className="flex-1 font-medium text-sm">{message}</span>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
Toast.displayName = "Toast";

// -----------------------------------------------------------------------------
// Progress Steps Indicator
// -----------------------------------------------------------------------------
const ProgressSteps = memo(({ currentStep, colorPrimary }) => {
  return (
    <div className="px-4 py-3 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between">
        {CHECKOUT_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted ? COLORS.success : isCurrent ? colorPrimary : "#f3f4f6",
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted || isCurrent ? "text-white" : "text-gray-400"
                  }`}
                >
                  {isCompleted ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                </motion.div>
                <span
                  className={`text-[10px] font-semibold mt-1 ${
                    isCurrent ? "text-gray-900" : isCompleted ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < CHECKOUT_STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 relative top-[-12px]">
                  <div className="absolute inset-0 bg-gray-200 rounded-full" />
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: COLORS.success }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
});
ProgressSteps.displayName = "ProgressSteps";

// -----------------------------------------------------------------------------
// Cart Item Card
// -----------------------------------------------------------------------------
const CartItemCard = memo(({ item, onRemove, onUpdateAddons, colorPrimary }) => {
  const [expanded, setExpanded] = useState(false);
  const haptic = useHapticFeedback();

  const itemTotal = useMemo(() => {
    const addonsTotal = item.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0;
    return item.price + addonsTotal;
  }, [item]);

  const discount = item.originalPrice > item.price ? item.originalPrice - item.price : 0;
  const discountPercent = discount > 0 ? Math.round((discount / item.originalPrice) * 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-3"
    >
      {/* Main Content */}
      <div className="p-4">
        <div className="flex gap-3">
          {/* Image */}
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            {item.isVerified && (
              <div className="absolute top-1 left-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <BadgeCheck size={12} className="text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
                  <span className="text-xs text-gray-400">({item.reviews})</span>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  haptic("medium");
                  onRemove(item?._id);
                }}
                className="p-2 bg-red-50 rounded-lg text-red-500"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                <Calendar size={11} className="text-gray-500" />
                <span className="text-[10px] font-medium text-gray-600">{formatDate(item.date)}</span>
              </div>
              {item.timeSlot && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                  <Clock size={11} className="text-gray-500" />
                  <span className="text-[10px] font-medium text-gray-600">{item.timeSlot.split(" ")[0]}</span>
                </div>
              )}
              {item.guests && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                  <Users size={11} className="text-gray-500" />
                  <span className="text-[10px] font-medium text-gray-600">{item.guests}</span>
                </div>
              )}
            </div>

            {/* Package/Menu Info */}
            {item.package && <p className="text-xs text-gray-500 mt-1.5">{item.package}</p>}
            {item.menuType && (
              <p className="text-xs text-gray-500 mt-1.5">
                {item.menuType} • ₹{item.pricePerPlate}/plate
              </p>
            )}
          </div>
        </div>

        {/* Price Row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold" style={{ color: colorPrimary }}>
                ₹{formatPrice(itemTotal)}
              </span>
              {discount > 0 && (
                <span className="text-sm text-gray-400 line-through">₹{formatPrice(item.originalPrice)}</span>
              )}
            </div>
            {discount > 0 && (
              <span className="text-[10px] font-bold text-green-600">
                You save ₹{formatPrice(discount)} ({discountPercent}%)
              </span>
            )}
          </div>

          {item.addons?.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptic("light");
                setExpanded(!expanded);
              }}
              className="flex items-center gap-1 text-xs font-semibold text-gray-500"
            >
              {item.addons.length} add-ons
              <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
                <ChevronDown size={16} />
              </motion.div>
            </motion.button>
          )}
        </div>
      </div>

      {/* Expanded Add-ons */}
      <AnimatePresence>
        {expanded && item.addons?.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 bg-gray-50 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase">Selected Add-ons</p>
              {item.addons.map((addon) => (
                <div key={addon.id} className="flex items-center justify-between bg-white p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{addon.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">+₹{formatPrice(addon.price)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
CartItemCard.displayName = "CartItemCard";

// -----------------------------------------------------------------------------
// Coupon Input Section
// -----------------------------------------------------------------------------
const CouponSection = memo(({ appliedCoupon, onApplyCoupon, onRemoveCoupon, colorPrimary, subtotal }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const haptic = useHapticFeedback();

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    haptic("light");
    setIsLoading(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const coupon = MOCK_COUPONS.find((c) => c?.code?.toLowerCase() === couponCode?.trim()?.toLowerCase());

    if (!coupon) {
      setError("Invalid coupon code");
      setIsLoading(false);
      return;
    }

    if (subtotal < coupon.minOrder) {
      setError(`Minimum order of ₹${formatPrice(coupon.minOrder)} required`);
      setIsLoading(false);
      return;
    }

    haptic("success");
    onApplyCoupon(coupon);
    setCouponCode("");
    setIsExpanded(false);
    setIsLoading(false);
  }, [couponCode, subtotal, onApplyCoupon, haptic]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
      {appliedCoupon ? (
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Tag size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-bold text-green-600 text-sm">{appliedCoupon.code}</p>
                <p className="text-xs text-gray-500">{appliedCoupon.description}</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                haptic("light");
                onRemoveCoupon();
              }}
              className="p-2 text-gray-400"
            >
              <X size={18} />
            </motion.button>
          </div>
        </div>
      ) : (
        <>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              haptic("light");
              setIsExpanded(!isExpanded);
            }}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Percent size={20} className="text-orange-500" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Apply Coupon</p>
                <p className="text-xs text-gray-500">You have 3 coupons available</p>
              </div>
            </div>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
              <ChevronDown size={20} className="text-gray-400" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-100 overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setError("");
                      }}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleApplyCoupon}
                      disabled={isLoading}
                      className="px-5 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60"
                      style={{ backgroundColor: colorPrimary }}
                    >
                      {isLoading ? <RefreshCw size={18} className="animate-spin" /> : "Apply"}
                    </motion.button>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 font-medium flex items-center gap-1"
                    >
                      <AlertCircle size={12} /> {error}
                    </motion.p>
                  )}

                  <div className="pt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Available Coupons</p>
                    <div className="space-y-2">
                      {MOCK_COUPONS.map((coupon) => (
                        <motion.button
                          key={coupon.code}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setCouponCode(coupon.code);
                            setError("");
                          }}
                          className="w-full p-3 bg-gray-50 rounded-xl flex items-center justify-between text-left"
                        >
                          <div>
                            <p className="text-sm font-bold text-gray-900">{coupon.code}</p>
                            <p className="text-xs text-gray-500">{coupon.description}</p>
                          </div>
                          <div className="text-xs text-gray-400">Min: ₹{formatPrice(coupon.minOrder)}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
});
CouponSection.displayName = "CouponSection";

// -----------------------------------------------------------------------------
// Price Summary Section
// -----------------------------------------------------------------------------
const PriceSummary = memo(({ subtotal, discount, couponDiscount, taxes, total, colorPrimary }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const haptic = useHapticFeedback();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">Price Details</h3>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              haptic("light");
              setShowBreakdown(!showBreakdown);
            }}
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: colorPrimary }}
          >
            {showBreakdown ? "Hide" : "Show"} breakdown
            <motion.div animate={{ rotate: showBreakdown ? 180 : 0 }}>
              <ChevronDown size={14} />
            </motion.div>
          </motion.button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">₹{formatPrice(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Vendor Discount</span>
              <span className="font-medium text-green-600">-₹{formatPrice(discount)}</span>
            </div>
          )}

          {couponDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Coupon Discount</span>
              <span className="font-medium text-green-600">-₹{formatPrice(couponDiscount)}</span>
            </div>
          )}

          <AnimatePresence>
            {showBreakdown && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 pt-2 border-t border-dashed border-gray-200"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Platform Fee</span>
                  <span className="font-medium text-gray-700">₹{formatPrice(Math.round(subtotal * 0.02))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GST (18%)</span>
                  <span className="font-medium text-gray-700">₹{formatPrice(taxes)}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Taxes & Fees</span>
            <span className="font-medium text-gray-900">₹{formatPrice(taxes)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <span className="text-base font-bold text-gray-900">Total Amount</span>
          <span className="text-xl font-black" style={{ color: colorPrimary }}>
            ₹{formatPrice(total)}
          </span>
        </div>

        {(discount > 0 || couponDiscount > 0) && (
          <div className="mt-3 p-3 bg-green-50 rounded-xl">
            <p className="text-sm font-bold text-green-700 flex items-center gap-2">
              <Sparkles size={16} />
              You're saving ₹{formatPrice(discount + couponDiscount)} on this order!
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
PriceSummary.displayName = "PriceSummary";

// -----------------------------------------------------------------------------
// Form Input Component
// -----------------------------------------------------------------------------
const FormInput = memo(({ label, icon: Icon, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600 block">{label}</label>
      <div
        className={`flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border-2 transition-colors ${
          error ? "border-red-300 bg-red-50" : isFocused ? "border-blue-400 bg-white" : "border-transparent"
        }`}
      >
        {Icon && <Icon size={18} className={error ? "text-red-400" : "text-gray-400"} />}
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className="flex-1 bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 font-medium flex items-center gap-1"
        >
          <AlertCircle size={11} /> {error}
        </motion.p>
      )}
    </div>
  );
});
FormInput.displayName = "FormInput";

// -----------------------------------------------------------------------------
// Event Details Form
// -----------------------------------------------------------------------------
const EventDetailsForm = memo(({ eventDetails, setEventDetails, errors, colorPrimary }) => {
  const haptic = useHapticFeedback();

  const eventTypes = ["Wedding", "Engagement", "Birthday", "Corporate Event", "Anniversary", "Other"];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={18} style={{ color: colorPrimary }} />
          Event Information
        </h3>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 block">Event Type</label>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <motion.button
                  key={type}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    haptic("light");
                    setEventDetails({ ...eventDetails, eventType: type });
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                    eventDetails.eventType === type
                      ? "text-white border-transparent"
                      : "bg-white text-gray-600 border-gray-200"
                  }`}
                  style={eventDetails.eventType === type ? { backgroundColor: colorPrimary } : {}}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>

          <FormInput
            label="Event Name"
            icon={PartyPopper}
            placeholder="e.g., Priya & Rahul's Wedding"
            value={eventDetails.eventName}
            onChange={(e) => setEventDetails({ ...eventDetails, eventName: e.target.value })}
            error={errors.eventName}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Event Date"
              icon={Calendar}
              type="date"
              value={eventDetails.eventDate}
              onChange={(e) => setEventDetails({ ...eventDetails, eventDate: e.target.value })}
              error={errors.eventDate}
            />
            <FormInput
              label="Expected Guests"
              icon={Users}
              type="number"
              placeholder="250"
              value={eventDetails.guestCount}
              onChange={(e) => setEventDetails({ ...eventDetails, guestCount: e.target.value })}
              error={errors.guestCount}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 block">Special Requirements</label>
            <textarea
              placeholder="Any special requests or requirements..."
              value={eventDetails.specialRequests}
              onChange={(e) => setEventDetails({ ...eventDetails, specialRequests: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 focus:bg-white resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
});
EventDetailsForm.displayName = "EventDetailsForm";

// -----------------------------------------------------------------------------
// Contact Details Form
// -----------------------------------------------------------------------------
const ContactDetailsForm = memo(({ contactDetails, setContactDetails, errors, colorPrimary }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mt-4">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <User size={18} style={{ color: colorPrimary }} />
        Contact Information
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="First Name"
            icon={User}
            placeholder="John"
            value={contactDetails.firstName}
            onChange={(e) => setContactDetails({ ...contactDetails, firstName: e.target.value })}
            error={errors.firstName}
          />
          <FormInput
            label="Last Name"
            icon={User}
            placeholder="Doe"
            value={contactDetails.lastName}
            onChange={(e) => setContactDetails({ ...contactDetails, lastName: e.target.value })}
            error={errors.lastName}
          />
        </div>

        <FormInput
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="john@example.com"
          value={contactDetails.email}
          onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
          error={errors.email}
        />

        <FormInput
          label="Phone Number"
          icon={Phone}
          type="tel"
          placeholder="9876543210"
          value={contactDetails.phone}
          onChange={(e) => setContactDetails({ ...contactDetails, phone: e.target.value })}
          error={errors.phone}
        />

        <FormInput
          label="Alternate Phone (Optional)"
          icon={Phone}
          type="tel"
          placeholder="9876543210"
          value={contactDetails.altPhone}
          onChange={(e) => setContactDetails({ ...contactDetails, altPhone: e.target.value })}
        />

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 block">Full Address</label>
          <textarea
            placeholder="Enter your complete address..."
            value={contactDetails.address}
            onChange={(e) => setContactDetails({ ...contactDetails, address: e.target.value })}
            rows={2}
            className={`w-full px-4 py-3 bg-gray-50 rounded-xl border-2 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 focus:bg-white resize-none ${
              errors.address ? "border-red-300 bg-red-50" : "border-transparent"
            }`}
          />
          {errors.address && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1">
              <AlertCircle size={11} /> {errors.address}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="City"
            icon={MapPin}
            placeholder="Mumbai"
            value={contactDetails.city}
            onChange={(e) => setContactDetails({ ...contactDetails, city: e.target.value })}
            error={errors.city}
          />
          <FormInput
            label="Pincode"
            icon={Navigation}
            placeholder="400001"
            value={contactDetails.pincode}
            onChange={(e) => setContactDetails({ ...contactDetails, pincode: e.target.value })}
            error={errors.pincode}
          />
        </div>
      </div>
    </div>
  );
});
ContactDetailsForm.displayName = "ContactDetailsForm";

// -----------------------------------------------------------------------------
// Payment Method Selector
// -----------------------------------------------------------------------------
const PaymentMethodSelector = memo(({ selectedMethod, onSelectMethod, colorPrimary }) => {
  const haptic = useHapticFeedback();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CreditCard size={18} style={{ color: colorPrimary }} />
        Payment Method
      </h3>

      <div className="space-y-2">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <motion.button
              key={method.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                haptic("light");
                onSelectMethod(method.id);
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                isSelected ? "border-transparent bg-blue-50" : "border-gray-100 bg-white"
              }`}
              style={isSelected ? { borderColor: colorPrimary } : {}}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isSelected ? "bg-white shadow-sm" : "bg-gray-100"
                }`}
              >
                <Icon size={22} style={{ color: isSelected ? colorPrimary : "#6b7280" }} />
              </div>
              <div className="flex-1 text-left">
                <p className={`font-semibold ${isSelected ? "text-gray-900" : "text-gray-700"}`}>{method.label}</p>
                <p className="text-xs text-gray-500">{method.description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? "" : "border-gray-300"
                }`}
                style={isSelected ? { borderColor: colorPrimary, backgroundColor: colorPrimary } : {}}
              >
                {isSelected && <Check size={14} className="text-white" />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});
PaymentMethodSelector.displayName = "PaymentMethodSelector";

// -----------------------------------------------------------------------------
// Card Payment Form
// -----------------------------------------------------------------------------
const CardPaymentForm = memo(({ cardDetails, setCardDetails, errors, colorPrimary }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mt-4 overflow-hidden"
    >
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CreditCard size={18} style={{ color: colorPrimary }} />
        Card Details
      </h3>

      <div className="space-y-4">
        <FormInput
          label="Card Number"
          icon={CreditCard}
          placeholder="1234 5678 9012 3456"
          value={cardDetails.number}
          onChange={(e) => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })}
          maxLength={19}
          error={errors.cardNumber}
        />

        <FormInput
          label="Cardholder Name"
          icon={User}
          placeholder="JOHN DOE"
          value={cardDetails.name}
          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })}
          error={errors.cardName}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Expiry Date"
            icon={Calendar}
            placeholder="MM/YY"
            value={cardDetails.expiry}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, "");
              if (value.length >= 2) {
                value = value.slice(0, 2) + "/" + value.slice(2, 4);
              }
              setCardDetails({ ...cardDetails, expiry: value });
            }}
            maxLength={5}
            error={errors.cardExpiry}
          />
          <FormInput
            label="CVV"
            icon={Lock}
            type="password"
            placeholder="•••"
            value={cardDetails.cvv}
            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })}
            maxLength={4}
            error={errors.cardCvv}
          />
        </div>

        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
          <Shield size={16} className="text-green-600" />
          <p className="text-xs text-green-700 font-medium">Your card details are secured with 256-bit encryption</p>
        </div>
      </div>
    </motion.div>
  );
});
CardPaymentForm.displayName = "CardPaymentForm";

// -----------------------------------------------------------------------------
// UPI Payment Form
// -----------------------------------------------------------------------------
const UPIPaymentForm = memo(({ upiId, setUpiId, error, colorPrimary }) => {
  const haptic = useHapticFeedback();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mt-4 overflow-hidden"
    >
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Smartphone size={18} style={{ color: colorPrimary }} />
        UPI Payment
      </h3>

      <div className="space-y-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {UPI_APPS.map((app) => (
            <motion.button
              key={app.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptic("light");
              }}
              className="flex flex-col items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl min-w-[80px]"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: app.color }}
              >
                {app.name.charAt(0)}
              </div>
              <span className="text-xs font-medium text-gray-600">{app.name}</span>
            </motion.button>
          ))}
        </div>

        <div className="text-center text-xs text-gray-400 font-medium">OR</div>

        <FormInput
          label="Enter UPI ID"
          icon={QrCode}
          placeholder="yourname@upi"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          error={error}
        />

        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
          <Info size={16} className="text-blue-600" />
          <p className="text-xs text-blue-700 font-medium">You'll receive a payment request on your UPI app</p>
        </div>
      </div>
    </motion.div>
  );
});
UPIPaymentForm.displayName = "UPIPaymentForm";

// -----------------------------------------------------------------------------
// Net Banking Form
// -----------------------------------------------------------------------------
const NetBankingForm = memo(({ selectedBank, setSelectedBank, colorPrimary }) => {
  const haptic = useHapticFeedback();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mt-4 overflow-hidden"
    >
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Building size={18} style={{ color: colorPrimary }} />
        Select Bank
      </h3>

      <div className="space-y-2">
        {POPULAR_BANKS.map((bank) => (
          <motion.button
            key={bank.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              haptic("light");
              setSelectedBank(bank.id);
            }}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              selectedBank === bank.id ? "border-blue-400 bg-blue-50" : "border-gray-100 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building size={18} className="text-gray-500" />
              </div>
              <span className="font-medium text-gray-700">{bank.name}</span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                selectedBank === bank.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
              }`}
            >
              {selectedBank === bank.id && <Check size={12} className="text-white m-0.5" />}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
});
NetBankingForm.displayName = "NetBankingForm";

// -----------------------------------------------------------------------------
// Order Summary Card
// -----------------------------------------------------------------------------
const OrderSummaryCard = memo(({ items, eventDetails, contactDetails, colorPrimary }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Receipt size={18} style={{ color: colorPrimary }} />
          Order Summary
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Event Info */}
        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Event Details</p>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900">{eventDetails.eventName || "Your Event"}</p>
            <p className="text-xs text-gray-600">
              {eventDetails.eventType} • {formatDate(eventDetails.eventDate || new Date())}
            </p>
            <p className="text-xs text-gray-600">{eventDetails.guestCount || 0} guests expected</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Contact Details</p>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900">
              {contactDetails.firstName} {contactDetails.lastName}
            </p>
            <p className="text-xs text-gray-600">{contactDetails.email}</p>
            <p className="text-xs text-gray-600">{contactDetails.phone}</p>
          </div>
        </div>

        {/* Booked Vendors */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Booked Services ({items.length})</p>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                </div>
                <p className="text-sm font-bold" style={{ color: colorPrimary }}>
                  ₹{formatPrice(item.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
OrderSummaryCard.displayName = "OrderSummaryCard";

// -----------------------------------------------------------------------------
// Success Screen
// -----------------------------------------------------------------------------
const SuccessScreen = memo(({ orderDetails, colorPrimary }) => {
  const haptic = useHapticFeedback();
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = useCallback(async () => {
    haptic("light");
    const success = await copyToClipboard(orderDetails.orderId);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [orderDetails.orderId, haptic]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gray-50 px-4 py-8"
    >
      {/* Success Animation */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}>
            <CheckCircle size={48} className="text-green-500" />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500">Your vendors have been notified</p>
        </motion.div>
      </div>

      {/* Order ID Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-400 uppercase">Order ID</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyOrderId}
            className="flex items-center gap-1 text-xs font-semibold"
            style={{ color: colorPrimary }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </motion.button>
        </div>
        <p className="text-lg font-mono font-bold text-gray-900">{orderDetails.orderId}</p>
      </motion.div>

      {/* Order Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4"
      >
        <h3 className="font-bold text-gray-900 mb-4">Booking Details</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Event</span>
            <span className="text-sm font-semibold text-gray-900">{orderDetails.eventName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Date</span>
            <span className="text-sm font-semibold text-gray-900">{formatDate(orderDetails.eventDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Vendors Booked</span>
            <span className="text-sm font-semibold text-gray-900">{orderDetails.vendorCount}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Total Paid</span>
            <span className="text-lg font-black" style={{ color: colorPrimary }}>
              ₹{formatPrice(orderDetails.totalPaid)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* What's Next */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6"
      >
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Info size={18} style={{ color: colorPrimary }} />
          What's Next?
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold" style={{ color: colorPrimary }}>
                1
              </span>
            </div>
            <p className="text-sm text-gray-600">Vendors will contact you within 24 hours to confirm details</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold" style={{ color: colorPrimary }}>
                2
              </span>
            </div>
            <p className="text-sm text-gray-600">Check your email for detailed booking confirmation</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold" style={{ color: colorPrimary }}>
                3
              </span>
            </div>
            <p className="text-sm text-gray-600">Track your booking status in "My Bookings"</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-3"
      >
        <Link href="/m/bookings" className="block">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg flex items-center justify-center gap-2"
            style={{ backgroundColor: colorPrimary }}
          >
            <FileText size={20} />
            View My Bookings
          </motion.button>
        </Link>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 text-sm flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Share
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 text-sm flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download
          </motion.button>
        </div>

        <Link href="/m/marketplace" className="block">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl text-gray-500 font-semibold text-sm"
          >
            Continue Shopping
          </motion.button>
        </Link>
      </motion.div>

      {/* Support Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 p-4 bg-gray-100 rounded-2xl flex items-center gap-3"
      >
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <MessageCircle size={20} className="text-gray-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Need Help?</p>
          <p className="text-xs text-gray-500">Contact support 24/7</p>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </motion.div>
    </motion.div>
  );
});
SuccessScreen.displayName = "SuccessScreen";

// -----------------------------------------------------------------------------
// Security Badges
// -----------------------------------------------------------------------------
const SecurityBadges = memo(() => {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <div className="flex items-center gap-1.5 text-gray-400">
        <Lock size={14} />
        <span className="text-xs font-medium">Secure</span>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      <div className="flex items-center gap-1.5 text-gray-400">
        <Shield size={14} />
        <span className="text-xs font-medium">256-bit SSL</span>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      <div className="flex items-center gap-1.5 text-gray-400">
        <BadgeCheck size={14} />
        <span className="text-xs font-medium">Verified</span>
      </div>
    </div>
  );
});
SecurityBadges.displayName = "SecurityBadges";

// =============================================================================
// STEP COMPONENTS
// =============================================================================

// -----------------------------------------------------------------------------
// Step 1: Cart Review
// -----------------------------------------------------------------------------
const CartStep = memo(
  ({ cartItems, removeFromCart, appliedCoupon, setAppliedCoupon, priceDetails, colorPrimary, showToast }) => {
    const handleRemoveItem = useCallback(
      (itemId) => {
        removeFromCart(itemId);
        showToast("Item removed from cart", "info");
      },
      [removeFromCart, showToast]
    );

    if (cartItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 text-sm text-center mb-6">
            Explore our marketplace to find the perfect vendors for your event
          </p>
          <Link href="/m/marketplace">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 text-white font-bold rounded-xl shadow-lg"
              style={{ backgroundColor: colorPrimary }}
            >
              Browse Vendors
            </motion.button>
          </Link>
        </div>
      );
    }

    return (
      <div className="px-4 py-4">
        {/* Cart Items */}
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase mb-3">Your Selection ({cartItems.length} items)</h2>
          <AnimatePresence>
            {cartItems.map((item, index) => (
              <CartItemCard key={index} item={item} onRemove={handleRemoveItem} colorPrimary={colorPrimary} />
            ))}
          </AnimatePresence>
        </div>

        {/* Coupon Section */}
        <CouponSection
          appliedCoupon={appliedCoupon}
          onApplyCoupon={setAppliedCoupon}
          onRemoveCoupon={() => setAppliedCoupon(null)}
          colorPrimary={colorPrimary}
          subtotal={priceDetails.subtotal}
        />

        {/* Price Summary */}
        <PriceSummary
          subtotal={priceDetails.subtotal}
          discount={priceDetails.vendorDiscount}
          couponDiscount={priceDetails.couponDiscount}
          taxes={priceDetails.taxes}
          total={priceDetails.total}
          colorPrimary={colorPrimary}
        />

        {/* Trust Indicators */}
        <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-green-500" />
              <span className="text-xs font-medium text-gray-600">100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck size={16} className="text-blue-500" />
              <span className="text-xs font-medium text-gray-600">Verified Vendors</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber-500" />
              <span className="text-xs font-medium text-gray-600">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
CartStep.displayName = "CartStep";

// -----------------------------------------------------------------------------
// Step 2: Event & Contact Details
// -----------------------------------------------------------------------------
const DetailsStep = memo(
  ({ eventDetails, setEventDetails, contactDetails, setContactDetails, errors, colorPrimary }) => {
    return (
      <div className="px-4 py-4">
        <EventDetailsForm
          eventDetails={eventDetails}
          setEventDetails={setEventDetails}
          errors={errors}
          colorPrimary={colorPrimary}
        />
        <ContactDetailsForm
          contactDetails={contactDetails}
          setContactDetails={setContactDetails}
          errors={errors}
          colorPrimary={colorPrimary}
        />
        <SecurityBadges />
      </div>
    );
  }
);
DetailsStep.displayName = "DetailsStep";

// -----------------------------------------------------------------------------
// Step 3: Payment
// -----------------------------------------------------------------------------
const PaymentStep = memo(
  ({
    paymentMethod,
    setPaymentMethod,
    cardDetails,
    setCardDetails,
    upiId,
    setUpiId,
    selectedBank,
    setSelectedBank,
    errors,
    priceDetails,
    colorPrimary,
  }) => {
    return (
      <div className="px-4 py-4">
        {/* Amount to Pay */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 mb-4 text-white">
          <p className="text-sm opacity-80 mb-1">Amount to Pay</p>
          <p className="text-3xl font-black">₹{formatPrice(priceDetails.total)}</p>
          <div className="flex items-center gap-2 mt-2 text-sm opacity-80">
            <Lock size={14} />
            <span>Secure Payment Gateway</span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <PaymentMethodSelector
          selectedMethod={paymentMethod}
          onSelectMethod={setPaymentMethod}
          colorPrimary={colorPrimary}
        />

        {/* Payment Forms */}
        <AnimatePresence mode="wait">
          {paymentMethod === "card" && (
            <CardPaymentForm
              cardDetails={cardDetails}
              setCardDetails={setCardDetails}
              errors={errors}
              colorPrimary={colorPrimary}
            />
          )}
          {paymentMethod === "upi" && (
            <UPIPaymentForm upiId={upiId} setUpiId={setUpiId} error={errors.upiId} colorPrimary={colorPrimary} />
          )}
          {paymentMethod === "netbanking" && (
            <NetBankingForm selectedBank={selectedBank} setSelectedBank={setSelectedBank} colorPrimary={colorPrimary} />
          )}
        </AnimatePresence>

        {/* EMI Info */}
        {paymentMethod === "emi" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-amber-50 rounded-2xl p-4 mt-4"
          >
            <p className="text-sm text-amber-800 font-medium">
              EMI options will be shown on the payment gateway. No cost EMI available on selected banks.
            </p>
          </motion.div>
        )}

        {/* Pay Later Info */}
        {paymentMethod === "cod" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-blue-50 rounded-2xl p-4 mt-4"
          >
            <p className="text-sm text-blue-800 font-medium mb-2">
              Pay 20% now (₹{formatPrice(Math.round(priceDetails.total * 0.2))}) and rest before the event.
            </p>
            <p className="text-xs text-blue-600">
              Remaining amount: ₹{formatPrice(Math.round(priceDetails.total * 0.8))}
            </p>
          </motion.div>
        )}

        <SecurityBadges />
      </div>
    );
  }
);
PaymentStep.displayName = "PaymentStep";

// -----------------------------------------------------------------------------
// Step 4: Confirmation
// -----------------------------------------------------------------------------
const ConfirmationStep = memo(
  ({ cartItems, eventDetails, contactDetails, priceDetails, paymentMethod, colorPrimary }) => {
    const paymentMethodLabel = PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label || paymentMethod;

    return (
      <div className="px-4 py-4">
        <div className="bg-amber-50 rounded-2xl p-4 mb-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Review your order</p>
            <p className="text-xs text-amber-700 mt-1">Please verify all details before confirming your booking</p>
          </div>
        </div>

        <OrderSummaryCard
          items={cartItems}
          eventDetails={eventDetails}
          contactDetails={contactDetails}
          colorPrimary={colorPrimary}
        />

        {/* Payment Method Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mt-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <CreditCard size={18} style={{ color: colorPrimary }} />
            Payment Method
          </h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="font-medium text-gray-700">{paymentMethodLabel}</span>
            <span className="text-lg font-bold" style={{ color: colorPrimary }}>
              ₹{formatPrice(priceDetails.total)}
            </span>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
          <p className="text-xs text-gray-500 leading-relaxed">
            By clicking "Confirm Booking", you agree to our{" "}
            <span className="font-semibold text-gray-700">Terms of Service</span>,{" "}
            <span className="font-semibold text-gray-700">Cancellation Policy</span>, and{" "}
            <span className="font-semibold text-gray-700">Privacy Policy</span>.
          </p>
        </div>

        <SecurityBadges />
      </div>
    );
  }
);
ConfirmationStep.displayName = "ConfirmationStep";

// =============================================================================
// MAIN CHECKOUT COMPONENT
// =============================================================================

export default function CheckoutPageWrapper() {
  const router = useRouter();
  const haptic = useHapticFeedback();

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Cart State
  const { cartItems, removeFromCart } = useCartStore();
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Form States
  const [eventDetails, setEventDetails] = useState({
    eventType: "Wedding",
    eventName: "",
    eventDate: "",
    guestCount: "",
    specialRequests: "",
  });

  const [contactDetails, setContactDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    altPhone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "success", isVisible: false });

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  const priceDetails = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const addonsTotal = item.addons?.reduce((a, addon) => a + addon.price, 0) || 0;
      return sum + item.price + addonsTotal;
    }, 0);

    const originalTotal = cartItems.reduce((sum, item) => sum + item.originalPrice, 0);
    const vendorDiscount = originalTotal - cartItems.reduce((sum, item) => sum + item.price, 0);

    let couponDiscount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === "percent") {
        couponDiscount = Math.min(
          Math.round((subtotal * appliedCoupon.discount) / 100),
          appliedCoupon.maxDiscount || Infinity
        );
      } else {
        couponDiscount = appliedCoupon.discount;
      }
    }

    const afterDiscount = subtotal - couponDiscount;
    const taxes = Math.round(afterDiscount * 0.18);
    const platformFee = Math.round(subtotal * 0.02);
    const total = afterDiscount + taxes + platformFee;

    return {
      subtotal,
      vendorDiscount,
      couponDiscount,
      taxes,
      platformFee,
      total,
    };
  }, [cartItems, appliedCoupon]);

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  const validateStep = useCallback(
    (step) => {
      const newErrors = {};

      if (step === 2) {
        if (!eventDetails.eventName.trim()) newErrors.eventName = "Event name is required";
        if (!eventDetails.eventDate) newErrors.eventDate = "Event date is required";
        if (!eventDetails.guestCount) newErrors.guestCount = "Guest count is required";

        if (!contactDetails.firstName.trim()) newErrors.firstName = "First name is required";
        if (!contactDetails.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!contactDetails.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!validateEmail(contactDetails.email)) {
          newErrors.email = "Invalid email address";
        }
        if (!contactDetails.phone.trim()) {
          newErrors.phone = "Phone number is required";
        } else if (!validatePhone(contactDetails.phone)) {
          newErrors.phone = "Invalid phone number";
        }
        if (!contactDetails.address.trim()) newErrors.address = "Address is required";
        if (!contactDetails.city.trim()) newErrors.city = "City is required";
        if (!contactDetails.pincode.trim()) newErrors.pincode = "Pincode is required";
      }

      if (step === 3) {
        if (paymentMethod === "card") {
          if (!validateCard(cardDetails.number)) newErrors.cardNumber = "Invalid card number";
          if (!cardDetails.name.trim()) newErrors.cardName = "Cardholder name is required";
          if (!cardDetails.expiry || cardDetails.expiry.length < 5) newErrors.cardExpiry = "Invalid expiry";
          if (!cardDetails.cvv || cardDetails.cvv.length < 3) newErrors.cardCvv = "Invalid CVV";
        }
        if (paymentMethod === "upi" && !upiId.includes("@")) {
          newErrors.upiId = "Invalid UPI ID";
        }
        if (paymentMethod === "netbanking" && !selectedBank) {
          newErrors.bank = "Please select a bank";
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [eventDetails, contactDetails, paymentMethod, cardDetails, upiId, selectedBank]
  );

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, isVisible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep === 1 && cartItems.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    if (currentStep > 1 && !validateStep(currentStep)) {
      showToast("Please fill all required fields", "error");
      haptic("medium");
      return;
    }

    haptic("light");

    if (currentStep === 4) {
      handlePlaceOrder();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, cartItems.length, validateStep, showToast, haptic]);

  const handleBack = useCallback(() => {
    haptic("light");
    if (currentStep === 1) {
      router.back();
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, router, haptic]);

  const handlePlaceOrder = useCallback(async () => {
    setIsProcessing(true);
    haptic("medium");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const orderId = `PWB${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    setOrderDetails({
      orderId,
      eventName: eventDetails.eventName,
      eventDate: eventDetails.eventDate,
      vendorCount: cartItems.length,
      totalPaid: priceDetails.total,
    });

    setIsProcessing(false);
    setOrderComplete(true);
    haptic("success");
  }, [eventDetails, cartItems.length, priceDetails.total, haptic]);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  const getStepContent = useCallback(() => {
    switch (currentStep) {
      case 1:
        return (
          <CartStep
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
            priceDetails={priceDetails}
            colorPrimary={COLORS.primary}
            showToast={showToast}
          />
        );
      case 2:
        return (
          <DetailsStep
            eventDetails={eventDetails}
            setEventDetails={setEventDetails}
            contactDetails={contactDetails}
            setContactDetails={setContactDetails}
            errors={errors}
            colorPrimary={COLORS.primary}
          />
        );
      case 3:
        return (
          <PaymentStep
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cardDetails={cardDetails}
            setCardDetails={setCardDetails}
            upiId={upiId}
            setUpiId={setUpiId}
            selectedBank={selectedBank}
            setSelectedBank={setSelectedBank}
            errors={errors}
            priceDetails={priceDetails}
            colorPrimary={COLORS.primary}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            cartItems={cartItems}
            eventDetails={eventDetails}
            contactDetails={contactDetails}
            priceDetails={priceDetails}
            paymentMethod={paymentMethod}
            colorPrimary={COLORS.primary}
          />
        );
      default:
        return null;
    }
  }, [
    currentStep,
    cartItems,
    appliedCoupon,
    priceDetails,
    eventDetails,
    contactDetails,
    errors,
    paymentMethod,
    cardDetails,
    upiId,
    selectedBank,
    showToast,
  ]);

  const getButtonText = useCallback(() => {
    switch (currentStep) {
      case 1:
        return "Proceed to Details";
      case 2:
        return "Continue to Payment";
      case 3:
        return "Review Order";
      case 4:
        return `Pay ₹${formatPrice(priceDetails.total)}`;
      default:
        return "Continue";
    }
  }, [currentStep, priceDetails.total]);

  // ==========================================================================
  // RENDER - SUCCESS SCREEN
  // ==========================================================================

  if (orderComplete && orderDetails) {
    return <SuccessScreen orderDetails={orderDetails} colorPrimary={COLORS.primary} />;
  }

  // ==========================================================================
  // RENDER - MAIN CHECKOUT
  // ==========================================================================

  return (
    <div className="min-h-screen bg-gray-50 pb-32 overflow-x-hidden">
      <ScrollProgressBar />
      {/* Global Styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0.5;
        }
      `}</style>

      {/* Toast */}
      <Toast {...toast} onClose={hideToast} />

      {/* ====================================================================
          HEADER SECTION
          ==================================================================== */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 safe-area-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleBack} className="p-2 -ml-2 rounded-xl text-gray-600">
            <ArrowLeft size={24} />
          </motion.button>
          <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Progress Steps */}
        <ProgressSteps currentStep={currentStep} colorPrimary={COLORS.primary} />
      </header>

      {/* ====================================================================
          MAIN CONTENT SECTION
          ==================================================================== */}
      <main className="min-h-[60vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {getStepContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ====================================================================
          FOOTER / CTA SECTION
          ==================================================================== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-area-bottom">
        {/* Price Summary Row */}
        {currentStep !== 4 && cartItems.length > 0 && (
          <div className="px-4 pt-3 pb-2 flex items-center justify-between bg-gray-50">
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Total Amount</p>
              <p className="text-lg font-black" style={{ color: COLORS.primary }}>
                ₹{formatPrice(priceDetails.total)}
              </p>
            </div>
            {priceDetails.vendorDiscount + priceDetails.couponDiscount > 0 && (
              <div className="px-3 py-1.5 bg-green-100 rounded-lg">
                <p className="text-xs font-bold text-green-700">
                  Saving ₹{formatPrice(priceDetails.vendorDiscount + priceDetails.couponDiscount)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-4 pb-4 pt-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={isProcessing || (currentStep === 1 && cartItems.length === 0)}
            className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ backgroundColor: COLORS.primary }}
          >
            {isProcessing ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {currentStep === 4 && <Lock size={18} />}
                {getButtonText()}
                {currentStep < 4 && <ChevronRight size={20} />}
              </>
            )}
          </motion.button>

          {/* Secure Payment Note */}
          {currentStep >= 3 && (
            <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
              <Lock size={12} />
              Secured by 256-bit SSL encryption
            </p>
          )}
        </div>
      </div>

      {/* ====================================================================
          PROCESSING OVERLAY
          ==================================================================== */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Lock size={24} style={{ color: COLORS.primary }} />
              </motion.div>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-bold text-gray-900 mb-2"
            >
              Processing Payment
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-500"
            >
              Please don't close this window
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-20 left-0 right-0 px-8"
            >
              <div className="flex items-center justify-center gap-4 text-gray-400">
                <Shield size={16} />
                <span className="text-xs font-medium">Secure Payment Processing</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
