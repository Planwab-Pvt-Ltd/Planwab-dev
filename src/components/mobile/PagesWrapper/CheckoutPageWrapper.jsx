"use client";

import React, { useState, useMemo, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  Calendar,
  Gift,
  Info,
  Lock,
  MapPin,
  MessageCircle,
  Percent,
  Phone,
  Shield,
  ShoppingBag,
  Star,
  Tag,
  Trash2,
  User,
  Users,
  X,
  AlertCircle,
  Mail,
  FileText,
  BadgeCheck,
  Copy,
  RefreshCw,
  Receipt,
  PartyPopper,
  Share2,
  Download,
  Navigation,
  Globe,
  Wallet,
  Smartphone,
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
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
};

const CHECKOUT_STEPS = [
  { id: 1, label: "Cart", icon: ShoppingBag },
  { id: 2, label: "Details", icon: User },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Confirm", icon: CheckCircle },
];

const PAYMENT_METHODS = [
  { id: "ONLINE", label: "Pay Online", icon: Globe, description: "UPI, Cards, NetBanking, Wallets" },
  { id: "COD", label: "Cash on Delivery", icon: Clock, description: "Currently Unavailable", disabled: true },
];

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
// UTILS & HOOKS
// =============================================================================

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(type === "medium" ? 25 : type === "success" ? [10, 50, 10] : 10);
    }
  }, []);
}

const formatPrice = (price) => (isNaN(price) || price === 0 ? "0" : price.toLocaleString("en-IN"));
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""));

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const ScrollProgressBar = () => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setWidth((window.scrollY / totalHeight) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 h-1 bg-blue-500 z-[100] transition-all duration-100"
      style={{ width: `${width}%` }}
    />
  );
};

// =============================================================================
// SUB-COMPONENTS (Original UI Restored)
// =============================================================================

const Toast = memo(({ message, type = "success", isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bg = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className={`fixed top-4 left-4 right-4 z-[300] ${bg} text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3`}
    >
      <Info size={20} />
      <span className="flex-1 font-medium text-sm">{message}</span>
      <button onClick={onClose}>
        <X size={16} />
      </button>
    </motion.div>
  );
});
Toast.displayName = "Toast";

const ProgressSteps = memo(({ currentStep, colorPrimary }) => (
  <div className="px-4 py-3 bg-white border-b border-gray-100">
    <div className="flex items-center justify-between">
      {CHECKOUT_STEPS.map((step, index) => {
        const Icon = step.icon;
        const active = currentStep === step.id;
        const done = currentStep > step.id;
        return (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            <motion.div
              animate={{
                scale: active ? 1.1 : 1,
                backgroundColor: done ? COLORS.success : active ? colorPrimary : "#f3f4f6",
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                done || active ? "text-white" : "text-gray-400"
              }`}
            >
              {done ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
            </motion.div>
            <span className={`text-[10px] font-semibold mt-1 ${active ? "text-gray-900" : "text-gray-400"}`}>
              {step.label}
            </span>
            {index < CHECKOUT_STEPS.length - 1 && (
              <div className="absolute left-1/2 top-5 w-full h-0.5 bg-gray-200 -z-10 ml-5">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: done ? "100%" : "0%" }}
                  className="h-full bg-green-500"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
));
ProgressSteps.displayName = "ProgressSteps";

const CartItemCard = memo(({ item, onRemove, colorPrimary }) => {
  const [expanded, setExpanded] = useState(false);
  const itemTotal = item.price + (item.addons?.reduce((sum, a) => sum + a.price, 0) || 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-3 overflow-hidden"
    >
      <div className="p-4 flex gap-3">
        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Calendar size={10} /> {formatDate(item.date)}
              </p>
            </div>
            <button onClick={() => onRemove(item.id || item._id)} className="p-2 bg-red-50 text-red-500 rounded-lg">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
            <span className="text-lg font-bold" style={{ color: colorPrimary }}>
              ₹{formatPrice(itemTotal)}
            </span>
            {item.addons?.length > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-semibold text-gray-500 flex items-center gap-1"
              >
                {item.addons.length} Add-ons{" "}
                <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        </div>
      </div>
      {expanded && (
        <div className="bg-gray-50 p-4 border-t border-gray-100 space-y-2">
          {item.addons.map((addon, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span>{addon.name}</span>
              <span className="font-bold">+₹{addon.price}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
});
CartItemCard.displayName = "CartItemCard";

const CouponSection = memo(({ appliedCoupon, onApplyCoupon, onRemoveCoupon, colorPrimary, subtotal }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleApply = () => {
    const coupon = MOCK_COUPONS.find((c) => c.code === code.toUpperCase());
    if (!coupon) return setError("Invalid Code");
    if (subtotal < coupon.minOrder) return setError(`Min order ₹${formatPrice(coupon.minOrder)}`);
    onApplyCoupon(coupon);
    setExpanded(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
      {appliedCoupon ? (
        <div className="p-4 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Tag size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-bold text-green-600 text-sm">{appliedCoupon.code}</p>
              <p className="text-xs text-gray-500">{appliedCoupon.description}</p>
            </div>
          </div>
          <button onClick={onRemoveCoupon}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>
      ) : (
        <>
          <button onClick={() => setExpanded(!expanded)} className="w-full p-4 flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Percent size={20} className="text-orange-500" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Apply Coupon</p>
                <p className="text-xs text-gray-500">Save more on your order</p>
              </div>
            </div>
            <ChevronDown size={20} className={`text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          {expanded && (
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="flex gap-2 mb-2">
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter code"
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm"
                />
                <button
                  onClick={handleApply}
                  className="px-4 py-2 rounded-xl text-white font-bold text-sm"
                  style={{ backgroundColor: colorPrimary }}
                >
                  Apply
                </button>
              </div>
              {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={10} /> {error}
                </p>
              )}
              <div className="mt-3 space-y-2">
                {MOCK_COUPONS.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCode(c.code);
                      setError("");
                    }}
                    className="w-full text-left p-2 bg-white rounded-lg border border-gray-100 text-xs"
                  >
                    <div className="font-bold">{c.code}</div>
                    <div className="text-gray-500">{c.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
});
CouponSection.displayName = "CouponSection";

const PriceSummary = memo(({ subtotal, discount, couponDiscount, taxes, total, colorPrimary }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
    <h3 className="font-bold text-gray-900 mb-3">Price Details</h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">₹{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between">
          <span className="text-green-600">Vendor Discount</span>
          <span className="font-medium text-green-600">-₹{formatPrice(discount)}</span>
        </div>
      )}
      {couponDiscount > 0 && (
        <div className="flex justify-between">
          <span className="text-green-600">Coupon Discount</span>
          <span className="font-medium text-green-600">-₹{formatPrice(couponDiscount)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-gray-600">Taxes (18%) & Fees</span>
        <span className="font-medium">₹{formatPrice(taxes)}</span>
      </div>
      <div className="flex justify-between pt-3 border-t font-bold text-lg">
        <span className="text-gray-900">Total Amount</span>
        <span style={{ color: colorPrimary }}>₹{formatPrice(total)}</span>
      </div>
    </div>
  </div>
));
PriceSummary.displayName = "PriceSummary";

const FormInput = memo(({ label, error, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-600">{label}</label>
    <div
      className={`flex items-center px-4 py-3 bg-gray-50 rounded-xl border-2 ${
        error ? "border-red-300 bg-red-50" : "border-transparent focus-within:border-blue-400 focus-within:bg-white"
      }`}
    >
      {props.icon && <props.icon size={18} className="text-gray-400 mr-3" />}
      <input
        {...props}
        className="flex-1 bg-transparent text-sm font-medium outline-none text-gray-900 placeholder-gray-400"
      />
    </div>
    {error && (
      <p className="text-xs text-red-500 flex gap-1 items-center">
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
));
FormInput.displayName = "FormInput";

// =============================================================================
// STEP COMPONENTS (Original Structure)
// =============================================================================

const CartStep = ({
  cartItems,
  removeFromCart,
  appliedCoupon,
  setAppliedCoupon,
  priceDetails,
  colorPrimary,
  showToast,
}) => (
  <div className="px-4 py-4 space-y-4">
    {cartItems.length === 0 ? (
      <div className="text-center py-16">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="font-bold text-gray-900">Cart is empty</h3>
        <Link href="/m/marketplace" className="text-blue-600 text-sm font-bold mt-2 inline-block">
          Browse Vendors
        </Link>
      </div>
    ) : (
      <>
        <div>
          {cartItems.map((item, index) => (
            <CartItemCard
              key={index}
              item={item}
              onRemove={(id) => {
                removeFromCart(id);
                showToast("Removed", "info");
              }}
              colorPrimary={colorPrimary}
            />
          ))}
        </div>
        <CouponSection
          appliedCoupon={appliedCoupon}
          onApplyCoupon={setAppliedCoupon}
          onRemoveCoupon={() => setAppliedCoupon(null)}
          subtotal={priceDetails.subtotal}
          colorPrimary={colorPrimary}
        />
        <PriceSummary {...priceDetails} colorPrimary={colorPrimary} />
        <div className="p-4 bg-gray-50 rounded-2xl flex gap-4 text-xs font-medium text-gray-600">
          <div className="flex gap-1">
            <Shield size={14} className="text-green-500" /> 100% Secure
          </div>
          <div className="flex gap-1">
            <BadgeCheck size={14} className="text-blue-500" /> Verified Vendors
          </div>
        </div>
      </>
    )}
  </div>
);

const DetailsStep = ({ eventDetails, setEventDetails, contactDetails, setContactDetails, errors, colorPrimary }) => (
  <div className="px-4 py-4 space-y-4 overflow-x-hidden">
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h3 className="font-bold mb-4 flex gap-2 items-center">
        <Calendar size={18} style={{ color: colorPrimary }} /> Event Details
      </h3>
      <div className="space-y-4">
        <FormInput
          label="Event Name"
          icon={PartyPopper}
          value={eventDetails.eventName}
          onChange={(e) => setEventDetails({ ...eventDetails, eventName: e.target.value })}
          error={errors.eventName}
          placeholder="e.g. Wedding"
        />
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Date"
            icon={Calendar}
            type="date"
            value={eventDetails.eventDate}
            onChange={(e) => setEventDetails({ ...eventDetails, eventDate: e.target.value })}
            error={errors.eventDate}
          />
          <FormInput
            label="Guests"
            icon={Users}
            type="number"
            value={eventDetails.guestCount}
            onChange={(e) => setEventDetails({ ...eventDetails, guestCount: e.target.value })}
            error={errors.guestCount}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">Special Request</label>
          <textarea
            rows={2}
            className="w-full bg-gray-50 rounded-xl p-3 text-sm border-transparent focus:bg-white focus:border-blue-400 border-2 outline-none"
            placeholder="Any specific requirements..."
            value={eventDetails.specialRequests}
            onChange={(e) => setEventDetails({ ...eventDetails, specialRequests: e.target.value })}
          />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h3 className="font-bold mb-4 flex gap-2 items-center">
        <User size={18} style={{ color: colorPrimary }} /> Contact Info
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="First Name"
            value={contactDetails.firstName}
            onChange={(e) => setContactDetails({ ...contactDetails, firstName: e.target.value })}
            error={errors.firstName}
          />
          <FormInput
            label="Last Name"
            value={contactDetails.lastName}
            onChange={(e) => setContactDetails({ ...contactDetails, lastName: e.target.value })}
            error={errors.lastName}
          />
        </div>
        <FormInput
          label="Email"
          icon={Mail}
          type="email"
          value={contactDetails.email}
          onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
          error={errors.email}
        />
        <FormInput
          label="Phone"
          icon={Phone}
          type="tel"
          value={contactDetails.phone}
          onChange={(e) => setContactDetails({ ...contactDetails, phone: e.target.value })}
          error={errors.phone}
        />
        <FormInput
          label="Address"
          icon={MapPin}
          value={contactDetails.address}
          onChange={(e) => setContactDetails({ ...contactDetails, address: e.target.value })}
          error={errors.address}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="City"
            value={contactDetails.city}
            onChange={(e) => setContactDetails({ ...contactDetails, city: e.target.value })}
            error={errors.city}
          />
          <FormInput
            label="Pincode"
            value={contactDetails.pincode}
            onChange={(e) => setContactDetails({ ...contactDetails, pincode: e.target.value })}
            error={errors.pincode}
          />
        </div>
      </div>
    </div>
  </div>
);

const PaymentStep = ({ paymentMethod, setPaymentMethod, colorPrimary, priceDetails }) => (
  <div className="px-4 py-4 space-y-4">
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white">
      <p className="text-sm opacity-80">Total Payable</p>
      <p className="text-3xl font-black">₹{formatPrice(priceDetails.total)}</p>
      <div className="flex items-center gap-2 mt-2 text-xs opacity-80">
        <Shield size={12} /> Secure Payment Gateway
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h3 className="font-bold mb-4 flex gap-2 items-center">
        <CreditCard size={18} style={{ color: colorPrimary }} /> Payment Method
      </h3>
      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => !method.disabled && setPaymentMethod(method.id)}
            disabled={method.disabled}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              paymentMethod === method.id ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-white"
            } ${method.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <method.icon size={20} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900">{method.label}</p>
              <p className="text-xs text-gray-500">{method.description}</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === method.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
              }`}
            >
              {paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </button>
        ))}
      </div>
    </div>

    {/* Razorpay Info Banner */}
    {paymentMethod === "ONLINE" && (
      <div className="p-4 bg-blue-50 rounded-2xl flex gap-3 items-start">
        <Smartphone size={20} className="text-blue-600 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-800">Razorpay Secure</p>
          <p className="text-xs text-blue-600 mt-1">
            You will be redirected to Razorpay to complete your payment securely via UPI, Card, or Netbanking.
          </p>
        </div>
      </div>
    )}
  </div>
);

const ConfirmationStep = ({ cartItems, eventDetails, contactDetails, priceDetails, paymentMethod, colorPrimary }) => (
  <div className="px-4 py-4 space-y-4">
    <div className="bg-amber-50 p-4 rounded-xl flex gap-3 items-start">
      <AlertCircle size={20} className="text-amber-500 mt-0.5" />
      <div>
        <p className="font-bold text-amber-800 text-sm">Review your order</p>
        <p className="text-xs text-amber-700">Verify all details before confirming.</p>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold flex gap-2 items-center">
        <Receipt size={18} style={{ color: colorPrimary }} /> Order Summary
      </div>
      <div className="p-4 space-y-4">
        <div className="p-3 bg-gray-50 rounded-xl space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase">Event</p>
          <p className="font-semibold">{eventDetails.eventName}</p>
          <p className="text-xs text-gray-500">
            {eventDetails.eventType} • {formatDate(eventDetails.eventDate)} • {eventDetails.guestCount} Guests
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase">Contact</p>
          <p className="font-semibold">
            {contactDetails.firstName} {contactDetails.lastName}
          </p>
          <p className="text-xs text-gray-500">
            {contactDetails.email} • {contactDetails.phone}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Items</p>
          {cartItems.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
              <span>{item.name}</span> <span className="font-bold">₹{formatPrice(item.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-500">Total Payable</p>
        <p className="text-xl font-black" style={{ color: colorPrimary }}>
          ₹{formatPrice(priceDetails.total)}
        </p>
      </div>
      <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
        {paymentMethod === "ONLINE" ? "Razorpay" : "COD"}
      </div>
    </div>
  </div>
);

// =============================================================================
// MAIN WRAPPER
// =============================================================================

export default function CheckoutPageWrapper() {
  const router = useRouter();
  const haptic = useHapticFeedback();
  const { cartItems, removeFromCart, clearCart } = useCartStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [finalOrderData, setFinalOrderData] = useState(null);

  // Data States
  const [appliedCoupon, setAppliedCoupon] = useState(null);
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
    address: "",
    city: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ isVisible: false, message: "" });

  const priceDetails = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price + (item.addons?.reduce((s, a) => s + a.price, 0) || 0),
      0
    );
    const taxes = Math.round(subtotal * 0.18);
    const platformFee = Math.round(subtotal * 0.02);
    let couponDiscount = 0;

    if (appliedCoupon) {
      couponDiscount =
        appliedCoupon.type === "percent"
          ? Math.min((subtotal * appliedCoupon.discount) / 100, appliedCoupon.maxDiscount)
          : appliedCoupon.discount;
    }

    const vendorDiscount = 0; // Can be calculated if needed
    return {
      subtotal,
      taxes,
      platformFee,
      vendorDiscount,
      couponDiscount,
      total: subtotal + taxes + platformFee - couponDiscount,
    };
  }, [cartItems, appliedCoupon]);

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 2) {
      if (!eventDetails.eventName) newErrors.eventName = "Required";
      if (!eventDetails.eventDate) newErrors.eventDate = "Required";
      if (!eventDetails.guestCount) newErrors.guestCount = "Required";
      if (!contactDetails.firstName) newErrors.firstName = "Required";
      if (!contactDetails.email || !validateEmail(contactDetails.email)) newErrors.email = "Invalid Email";
      if (!contactDetails.phone || !validatePhone(contactDetails.phone)) newErrors.phone = "Invalid Phone";
      if (!contactDetails.address) newErrors.address = "Required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && cartItems.length === 0)
      return setToast({ isVisible: true, message: "Cart is empty", type: "error" });
    if (currentStep > 1 && !validateStep(currentStep))
      return setToast({ isVisible: true, message: "Please fill all details", type: "error" });

    if (currentStep === 4) {
      initiatePayment();
    } else {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const initiatePayment = async () => {
    setIsProcessing(true);
    const res = await loadRazorpayScript();

    if (!res) {
      setIsProcessing(false);
      return setToast({ isVisible: true, message: "Razorpay SDK failed to load", type: "error" });
    }

    try {
      // 1. Create Order
      const createOrderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems, eventDetails, contactDetails, priceDetails, paymentMethod }),
      });

      const orderData = await createOrderRes.json();
      if (!orderData.success) throw new Error("Order creation failed");

      // 2. Open Razorpay
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PlanWale",
        description: `Order #${orderData.orderId}`,
        order_id: orderData.razorpayOrderId,
        modal: {
          ondismiss: function () {
            setIsProcessing(false); // Stop the loader
            setToast({
              isVisible: true,
              message: "Payment Cancelled. You can try again.",
              type: "warning", // Orange warning color
            });
          },
        },
        handler: async function (response) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch("/api/orders", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setFinalOrderData({
                orderId: verifyData.order._id,
                amount: priceDetails.total,
                date: new Date(),
              });
              setOrderComplete(true);
              clearCart();
            } else {
              setToast({ isVisible: true, message: "Payment Verification Failed", type: "error" });
            }
          } catch (err) {
            console.error(err);
            setToast({ isVisible: true, message: "Server error during verification", type: "error" });
          }
          setIsProcessing(false);
        },
        prefill: {
          name: `${contactDetails.firstName} ${contactDetails.lastName}`,
          email: contactDetails.email,
          contact: contactDetails.phone,
        },
        theme: { color: COLORS.primary },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      paymentObject.on("payment.failed", function (response) {
        setToast({ isVisible: true, message: response.error.description, type: "error" });
        setIsProcessing(false);
      });
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setToast({ isVisible: true, message: "Something went wrong", type: "error" });
    }
  };

  // SUCCESS SCREEN
  if (orderComplete && finalOrderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle size={48} className="text-green-600" />
        </motion.div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-8 text-center">
          Your order has been placed successfully.
          <br />
          Vendors will contact you shortly.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-full max-w-sm mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Order ID</span>
            <span className="font-mono font-bold">{finalOrderData.orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase">Amount Paid</span>
            <span className="font-bold text-green-600">₹{formatPrice(finalOrderData.amount)}</span>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <Link href="/m/bookings">
            <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200">
              View My Bookings
            </button>
          </Link>
          <Link href="/m/marketplace">
            <button className="w-full py-4 rounded-xl text-gray-500 font-bold">Continue Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  // MAIN RENDER
  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <ScrollProgressBar />
      <Toast {...toast} onClose={() => setToast({ ...toast, isVisible: false })} />

      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100 safe-area-top">
        <div className="flex items-center p-4">
          <button
            onClick={() => (currentStep === 1 ? router.back() : setCurrentStep((c) => c - 1))}
            className="p-2 -ml-2"
          >
            <ArrowLeft />
          </button>
          <span className="font-bold text-lg ml-2">Checkout</span>
        </div>
        <ProgressSteps currentStep={currentStep} colorPrimary={COLORS.primary} />
      </div>

      {/* Steps Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {currentStep === 1 && (
            <CartStep
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              appliedCoupon={appliedCoupon}
              setAppliedCoupon={setAppliedCoupon}
              priceDetails={priceDetails}
              colorPrimary={COLORS.primary}
              showToast={(m, t) => setToast({ isVisible: true, message: m, type: t })}
            />
          )}
          {currentStep === 2 && (
            <DetailsStep
              eventDetails={eventDetails}
              setEventDetails={setEventDetails}
              contactDetails={contactDetails}
              setContactDetails={setContactDetails}
              errors={errors}
              colorPrimary={COLORS.primary}
            />
          )}
          {currentStep === 3 && (
            <PaymentStep
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              priceDetails={priceDetails}
              colorPrimary={COLORS.primary}
            />
          )}
          {currentStep === 4 && (
            <ConfirmationStep
              cartItems={cartItems}
              eventDetails={eventDetails}
              contactDetails={contactDetails}
              priceDetails={priceDetails}
              paymentMethod={paymentMethod}
              colorPrimary={COLORS.primary}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-20 safe-area-bottom">
        <button
          onClick={handleNext}
          disabled={isProcessing}
          className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ backgroundColor: COLORS.primary }}
        >
          {isProcessing ? (
            <RefreshCw className="animate-spin" />
          ) : currentStep === 4 ? (
            `Pay ₹${formatPrice(priceDetails.total)}`
          ) : (
            "Continue"
          )}
        </button>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-white/90 z-50 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
          <p className="font-bold text-xl">Processing Payment...</p>
          <p className="text-sm text-gray-500">Please do not close this window.</p>
        </div>
      )}
    </div>
  );
}
