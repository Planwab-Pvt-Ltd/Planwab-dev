// EditEventTab.jsx
"use client";

// ============================================================================
// IMPORTS
// ============================================================================
import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  Clock,
  Users,
  DollarSign,
  FileText,
  Tag,
  Gift,
  Heart,
  Building,
  Sparkles,
  Plus,
  X,
  Check,
  RefreshCw,
  Save,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  Bell,
  ArrowLeft,
  Lock,
  EyeOff,
  Eye,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  Undo2,
  CakeSlice,
  PartyPopper,
  HelpCircle,
  Globe,
  CreditCard,
  Wallet,
  IndianRupee,
  CalendarDays,
  Sun,
  Moon,
  Sunset,
} from "lucide-react";

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
export default function EditEventTab({ event, onBack, onSuccess }) {
  return (
    <ToastProvider>
      <EditEventContent event={event} onBack={onBack} onSuccess={onSuccess} />
    </ToastProvider>
  );
}

// ============================================================================
// ADMIN PASSWORD MODAL COMPONENT
// ============================================================================
const AdminPasswordModal = ({ isOpen, onClose, onSuccess, isLoading }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setPassword("");
      setError("");
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the admin password");
      return;
    }

    // ✅ Just send the password to API, no frontend validation
    onSuccess(password);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Admin Verification</h2>
                <p className="text-white/80 text-sm mt-0.5">Confirm changes with password</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                <Lock size={12} />
                Authentication Required
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Admin Password</label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter admin password"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 outline-none transition-all bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                    error
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                      : "border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm mt-2 flex items-center gap-1.5"
                  >
                    <AlertCircle size={14} />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !password.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Contact your system administrator if you've forgotten the password
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================================
// UNSAVED CHANGES MODAL
// ============================================================================
const UnsavedChangesModal = ({ onDiscard, onCancel, onSave }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="text-amber-600" size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Unsaved Changes</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">You have unsaved changes. What would you like to do?</p>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={onSave}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Save size={16} /> Save Changes
        </button>
        <button
          onClick={onDiscard}
          className="w-full px-4 py-2.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium"
        >
          Discard Changes
        </button>
        <button
          onClick={onCancel}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ============================================================================
// MAIN CONTENT COMPONENT
// ============================================================================
function EditEventContent({ event, onBack, onSuccess }) {
  const { addToast } = useToast();
  const formContainerRef = useRef(null);

  // ============================================================================
  // CATEGORIES CONFIGURATION
  // ============================================================================
  const categories = [
    {
      key: "wedding",
      label: "Wedding",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      description: "Wedding ceremonies & receptions",
    },
    {
      key: "birthday",
      label: "Birthday",
      icon: CakeSlice,
      color: "from-purple-500 to-violet-500",
      description: "Birthday celebrations",
    },
    {
      key: "anniversary",
      label: "Anniversary",
      icon: Sparkles,
      color: "from-amber-500 to-orange-500",
      description: "Anniversary celebrations",
    },
  ];

  // ============================================================================
  // INITIAL FORM DATA FUNCTION
  // ============================================================================
  const initializeFormData = useCallback((eventData) => {
    return {
      category: eventData.category || "",
      city: eventData.city || "",
      eventDetails: eventData.eventDetails || {
        selectedDate: "",
        year: new Date().getFullYear(),
        month: "",
        day: "",
        dateRange: "",
        timeSlot: "",
      },
      budgetDetails: eventData.budgetDetails || {
        valueFormatted: "",
        valueRaw: "",
        paymentPreference: "",
      },
      contactName: eventData.contactName || "",
      contactEmail: eventData.contactEmail || "",
      contactPhone: eventData.contactPhone || "",
      countryCode: eventData.countryCode || "+91",
      fullPhone: eventData.fullPhone || "",
      currentLocation: eventData.currentLocation || "",
      status: eventData.status || "pending",
      source: eventData.source || "admin",
      notes: eventData.notes || "",
      username: eventData.username || "",
    };
  }, []);

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("category");
  const [hasChanges, setHasChanges] = useState(false);
  const [sectionProgress, setSectionProgress] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  // ============================================================================
  // FIELD OPTIONS CONFIGURATION
  // ============================================================================
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
    timeSlots: [
      { key: "morning", label: "Morning (6 AM - 12 PM)", icon: Sun },
      { key: "afternoon", label: "Afternoon (12 PM - 5 PM)", icon: Sun },
      { key: "evening", label: "Evening (5 PM - 9 PM)", icon: Sunset },
      { key: "night", label: "Night (9 PM - 12 AM)", icon: Moon },
      { key: "fullday", label: "Full Day Event", icon: CalendarDays },
    ],
    months: [
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
    ],
    dateRanges: [
      "Flexible - Any weekend",
      "Flexible - Any weekday",
      "First week of the month",
      "Second week of the month",
      "Third week of the month",
      "Last week of the month",
      "Specific date selected",
    ],
    paymentPreferences: [
      { key: "full", label: "Full Payment Upfront", icon: Wallet },
      { key: "installments", label: "Pay in Installments", icon: CreditCard },
      { key: "milestone", label: "Milestone-based Payment", icon: CheckCircle },
      { key: "flexible", label: "Flexible - Discuss Later", icon: HelpCircle },
    ],
    budgetRanges: [
      { value: 5, label: "Under ₹5 Lakhs" },
      { value: 10, label: "₹5 - 10 Lakhs" },
      { value: 25, label: "₹10 - 25 Lakhs" },
      { value: 50, label: "₹25 - 50 Lakhs" },
      { value: 100, label: "₹50 Lakhs - 1 Crore" },
      { value: 200, label: "₹1 - 2 Crores" },
      { value: 500, label: "Above ₹2 Crores" },
    ],
    statuses: [
      { key: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-700" },
      { key: "in-progress", label: "In Progress", color: "bg-blue-100 text-blue-700" },
      { key: "proposal-sent", label: "Proposal Sent", color: "bg-purple-100 text-purple-700" },
      { key: "confirmed", label: "Confirmed", color: "bg-green-100 text-green-700" },
      { key: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700" },
    ],
    sources: ["admin", "web", "mobile", "referral", "social", "other"],
  };

  // ============================================================================
  // SECTIONS CONFIGURATION
  // ============================================================================
  const sections = [
    {
      id: "category",
      label: "Event Type",
      icon: Heart,
      required: ["category", "city"],
      description: "Event category and location",
    },
    {
      id: "datetime",
      label: "Date & Time",
      icon: Calendar,
      required: [],
      description: "When the event will take place",
    },
    {
      id: "budget",
      label: "Budget",
      icon: DollarSign,
      required: ["budgetDetails.valueRaw"],
      description: "Budget expectations",
    },
    {
      id: "contact",
      label: "Contact Info",
      icon: User,
      required: ["contactName", "contactEmail", "contactPhone"],
      description: "Contact details for coordination",
    },
    {
      id: "additional",
      label: "Additional Info",
      icon: FileText,
      required: [],
      description: "Extra details and notes",
    },
  ];

  // ============================================================================
  // EFFECTS
  // ============================================================================
  useEffect(() => {
    if (event) {
      const initialData = initializeFormData(event);
      setFormData(initialData);
      setOriginalData(JSON.parse(JSON.stringify(initialData)));
    }
  }, [event, initializeFormData]);

  useEffect(() => {
    if (originalData && formData) {
      const currentJson = JSON.stringify(formData);
      const originalJson = JSON.stringify(originalData);
      setHasChanges(currentJson !== originalJson);
    }
  }, [formData, originalData]);

  useEffect(() => {
    const progress = {};
    sections.forEach((section) => {
      let filled = 0;
      let total = 0;

      if (section.id === "category") {
        total = 2;
        if (formData.category) filled++;
        if (formData.city) filled++;
      } else if (section.id === "datetime") {
        total = 3;
        if (formData.eventDetails?.selectedDate || formData.eventDetails?.dateRange) filled++;
        if (formData.eventDetails?.timeSlot) filled++;
        if (formData.eventDetails?.month || formData.eventDetails?.year) filled++;
      } else if (section.id === "budget") {
        total = 2;
        if (formData.budgetDetails?.valueRaw) filled++;
        if (formData.budgetDetails?.paymentPreference) filled++;
      } else if (section.id === "contact") {
        total = 4;
        if (formData.contactName) filled++;
        if (formData.contactEmail) filled++;
        if (formData.contactPhone) filled++;
        if (formData.username) filled++;
      } else if (section.id === "additional") {
        total = 2;
        if (formData.currentLocation) filled++;
        if (formData.notes) filled++;
      }

      progress[section.id] = total > 0 ? Math.round((filled / total) * 100) : 0;
    });
    setSectionProgress(progress);
  }, [formData]);

  // ============================================================================
  // SCROLL TO FORM TOP FUNCTION
  // ============================================================================
  const scrollToFormTop = useCallback(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================
  const markFieldTouched = useCallback((field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  }, []);

  const resetSection = useCallback(
    (sectionId) => {
      if (!originalData) return;

      const sectionFields = {
        category: ["category", "city"],
        datetime: ["eventDetails"],
        budget: ["budgetDetails"],
        contact: ["contactName", "contactEmail", "contactPhone", "countryCode", "fullPhone", "username"],
        additional: ["currentLocation", "notes", "status", "source"],
      };

      const fieldsToReset = sectionFields[sectionId] || [];
      setFormData((prev) => {
        const updated = { ...prev };
        fieldsToReset.forEach((field) => {
          if (typeof originalData[field] === "object") {
            updated[field] = JSON.parse(JSON.stringify(originalData[field]));
          } else {
            updated[field] = originalData[field];
          }
        });
        return updated;
      });

      const sectionName = sections.find((s) => s.id === sectionId)?.label || "Section";
      addToast(`${sectionName} has been reset`, "info");
    },
    [originalData, addToast]
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
    [errors]
  );

  // ============================================================================
  // VALIDATION
  // ============================================================================
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.category?.trim()) newErrors.category = "Event category is required";
    if (!formData.city?.trim()) newErrors.city = "City is required";
    if (!formData.contactName?.trim()) newErrors.contactName = "Contact name is required";

    if (!formData.contactEmail?.trim()) {
      newErrors.contactEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    if (!formData.contactPhone?.trim()) {
      newErrors.contactPhone = "Phone number is required";
    }

    if (!formData.budgetDetails?.valueRaw) {
      newErrors["budgetDetails.valueRaw"] = "Budget is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const getErrorsForSection = useCallback(
    (sectionId) => {
      const sectionErrorMap = {
        category: ["category", "city"],
        budget: ["budgetDetails.valueRaw"],
        contact: ["contactName", "contactEmail", "contactPhone"],
      };
      const fields = sectionErrorMap[sectionId] || [];
      return fields.filter((f) => errors[f]);
    },
    [errors]
  );

  // ============================================================================
  // FORM SUBMISSION
  // ============================================================================
  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      const errorSections = sections.filter((s) => getErrorsForSection(s.id).length > 0);
      if (errorSections.length > 0) {
        setActiveSection(errorSections[0].id);
      }
      addToast("Please fix all validation errors before submitting", "error");
      scrollToFormTop();
      return;
    }

    setShowPasswordModal(true);
  }, [validateForm, getErrorsForSection, addToast, scrollToFormTop]);

  const handleConfirmedSubmit = async (password) => {
    setIsSubmitting(true);

    try {
      const fullPhone = `${formData.countryCode}${formData.contactPhone}`;

      let valueFormatted = formData.budgetDetails.valueFormatted;
      const budgetValue = formData.budgetDetails.valueRaw;
      if (!valueFormatted && budgetValue) {
        if (budgetValue >= 100) {
          valueFormatted = `₹${budgetValue / 100} Crore(s)`;
        } else {
          valueFormatted = `₹${budgetValue} Lakhs`;
        }
      }

      const payload = {
        eventId: event._id, // ✅ Changed from 'id' to 'eventId'
        password,
        ...formData,
        fullPhone,
        budgetDetails: {
          ...formData.budgetDetails,
          valueFormatted,
          valueRaw: Number(formData.budgetDetails.valueRaw),
        },
      };

      const response = await fetch("/api/plannedevent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update event");
      }

      addToast("🎉 Event updated successfully!", "success", 5000);
      setShowPasswordModal(false);
      setHasChanges(false);

      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (error) {
      console.error("Submit error:", error);
      addToast(error.message || "Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // NAVIGATION
  // ============================================================================
  const navigateSection = useCallback(
    (direction) => {
      const currentIndex = sections.findIndex((s) => s.id === activeSection);
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < sections.length) {
        setActiveSection(sections[newIndex].id);
        scrollToFormTop();
      }
    },
    [activeSection, scrollToFormTop]
  );

  const handleBack = useCallback(() => {
    if (hasChanges) {
      setShowUnsavedWarning(true);
    } else {
      onBack?.();
    }
  }, [hasChanges, onBack]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  const currentSectionIndex = sections.findIndex((s) => s.id === activeSection);
  const overallProgress = Math.round(Object.values(sectionProgress).reduce((a, b) => a + b, 0) / sections.length);
  const requiredFieldsComplete =
    formData.category &&
    formData.city &&
    formData.contactName &&
    formData.contactEmail &&
    formData.contactPhone &&
    formData.budgetDetails?.valueRaw;

  // Get category info
  const categoryInfo = categories.find((c) => c.key === formData.category);
  const CategoryIcon = categoryInfo?.icon || PartyPopper;

  // ============================================================================
  // LOADING STATE
  // ============================================================================
  if (!event || !formData.category === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin text-purple-500 mx-auto mb-3" size={32} />
          <p className="text-gray-500">Loading event data...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-2 sm:px-4 lg:px-6 w-full max-w-full overflow-x-hidden box-border">
      <div className="w-full max-w-6xl mx-auto overflow-hidden">
        {/* ================================================================== */}
        {/* MAIN FORM CONTAINER */}
        {/* ================================================================== */}
        <div
          ref={formContainerRef}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* ================================================================ */}
          {/* HEADER SECTION */}
          {/* ================================================================ */}
          <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 p-4 md:p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${
                    categoryInfo?.color || "from-purple-500 to-pink-500"
                  } flex items-center justify-center flex-shrink-0 shadow-lg`}
                >
                  <CategoryIcon className="text-white" size={28} />
                </div>
                <div className="text-white min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3 flex-wrap">
                    Edit: {formData.category?.charAt(0).toUpperCase() + formData.category?.slice(1)} Event
                    {hasChanges && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full"
                      >
                        Unsaved Changes
                      </motion.span>
                    )}
                  </h1>
                  <p className="text-white/70 text-sm mt-1">
                    {formData.contactName || "Event Details"} • {formData.city || "Location TBD"}
                  </p>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden max-w-[250px]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${overallProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white/90">{overallProgress}% Complete</span>
                    {requiredFieldsComplete && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-green-400 text-green-900 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg"
                      >
                        <CheckCircle size={14} />
                        Ready to Save
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-all border border-white/20"
                >
                  <ArrowLeft size={16} />
                  <span className="hidden sm:inline">Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !hasChanges}
                  className="px-5 py-2.5 bg-white text-purple-600 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span className="hidden sm:inline">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* SECTION TABS */}
          {/* ================================================================ */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex overflow-x-auto p-2 gap-1.5 no-scrollbar">
              {sections.map((section, index) => {
                const progress = sectionProgress[section.id] || 0;
                const sectionErrors = getErrorsForSection(section.id);
                const hasError = sectionErrors.length > 0;
                const isRequired = section.required.length > 0;
                const isActive = activeSection === section.id;

                return (
                  <motion.button
                    key={section.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveSection(section.id);
                      scrollToFormTop();
                    }}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      isActive
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                        : hasError
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <section.icon size={15} />
                    <span className="hidden md:inline">{section.label}</span>
                    <span className="md:hidden">{index + 1}</span>

                    {!isActive && (
                      <div className="flex items-center gap-1">
                        {isRequired && <span className="text-[9px] text-red-500 font-bold">*</span>}
                        {progress > 0 && progress < 100 && !hasError && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        )}
                        {progress === 100 && !hasError && <CheckCircle size={12} className="text-green-500" />}
                        {hasError && <AlertCircle size={12} className="text-red-500" />}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ================================================================ */}
          {/* SECTION NAVIGATION BAR */}
          {/* ================================================================ */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateSection(-1)}
                disabled={currentSectionIndex === 0}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="text-sm">
                <span className="text-gray-500 font-medium">
                  Section {currentSectionIndex + 1} of {sections.length}
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-semibold ml-2">
                  {sections[currentSectionIndex]?.label}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigateSection(1)}
                disabled={currentSectionIndex === sections.length - 1}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${sectionProgress[activeSection] || 0}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 font-medium">{sectionProgress[activeSection] || 0}%</span>
              </div>
              <button
                type="button"
                onClick={() => resetSection(activeSection)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all font-medium"
                title="Reset this section"
              >
                <Undo2 size={12} />
                <span className="hidden sm:inline">Reset Section</span>
              </button>
            </div>
          </div>

          {/* ================================================================ */}
          {/* SECTION DESCRIPTION */}
          {/* ================================================================ */}
          {sections[currentSectionIndex]?.description && (
            <div className="px-4 md:px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800">
              <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
                <Info size={15} />
                {sections[currentSectionIndex].description}
                {sections[currentSectionIndex].required.length > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full font-medium">
                    Has required fields
                  </span>
                )}
              </p>
            </div>
          )}

          {/* ================================================================ */}
          {/* FORM CONTENT */}
          {/* ================================================================ */}
          <div className="p-4 md:p-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {activeSection === "category" && (
                  <CategorySection
                    data={formData}
                    onChange={handleInputChange}
                    errors={errors}
                    options={fieldOptions}
                    categories={categories}
                    addToast={addToast}
                  />
                )}
                {activeSection === "datetime" && (
                  <DateTimeSection
                    data={formData}
                    onChange={handleInputChange}
                    errors={errors}
                    options={fieldOptions}
                    addToast={addToast}
                  />
                )}
                {activeSection === "budget" && (
                  <BudgetSection
                    data={formData}
                    onChange={handleInputChange}
                    errors={errors}
                    options={fieldOptions}
                    addToast={addToast}
                  />
                )}
                {activeSection === "contact" && (
                  <ContactSection
                    data={formData}
                    onChange={handleInputChange}
                    errors={errors}
                    options={fieldOptions}
                    onBlur={markFieldTouched}
                    addToast={addToast}
                  />
                )}
                {activeSection === "additional" && (
                  <AdditionalSection
                    data={formData}
                    onChange={handleInputChange}
                    errors={errors}
                    options={fieldOptions}
                    addToast={addToast}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ================================================================ */}
          {/* FOOTER NAVIGATION */}
          {/* ================================================================ */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <button
              type="button"
              onClick={() => navigateSection(-1)}
              disabled={currentSectionIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {sections.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setActiveSection(sections[index].id);
                    scrollToFormTop();
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentSectionIndex
                      ? "bg-purple-600 w-6 h-2"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 w-2 h-2"
                  }`}
                />
              ))}
            </div>

            {currentSectionIndex === sections.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !hasChanges}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/25"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigateSection(1)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-xl transition-all shadow-lg"
              >
                Next
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* ================================================================== */}
        {/* FLOATING SAVE BAR */}
        {/* ================================================================== */}
        <AnimatePresence>
          {hasChanges && !isSubmitting && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 max-w-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <Bell size={18} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">You have unsaved changes</p>
                  {!requiredFieldsComplete && <p className="text-xs text-red-500">Complete required fields to save</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm transition-all"
                  disabled={isSubmitting}
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !hasChanges}
                  className="px-5 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 flex items-center gap-2 shadow-lg transition-all"
                >
                  {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                  Save
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==================================================================== */}
      {/* MODALS */}
      {/* ==================================================================== */}
      <AdminPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handleConfirmedSubmit}
        isLoading={isSubmitting}
      />

      <AnimatePresence>
        {showUnsavedWarning && (
          <UnsavedChangesModal
            onDiscard={() => {
              setShowUnsavedWarning(false);
              onBack?.();
            }}
            onCancel={() => setShowUnsavedWarning(false)}
            onSave={() => {
              setShowUnsavedWarning(false);
              handleSubmit();
            }}
          />
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* GLOBAL STYLES */}
      {/* ==================================================================== */}
      <style jsx global>{`
        * {
          min-width: 0;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// SECTION WRAPPER COMPONENT
// ============================================================================
const Section = ({ title, icon: Icon, children, description, badge, tip }) => (
  <div className="space-y-4 mb-8">
    <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2.5 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-xl flex-shrink-0">
          <Icon size={20} className="text-purple-600 dark:text-purple-400" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {badge && (
        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-full flex-shrink-0">
          {badge}
        </span>
      )}
    </div>
    {tip && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
      >
        <Lightbulb size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-200">{tip}</p>
      </motion.div>
    )}
    {children}
  </div>
);

// ============================================================================
// INPUT FIELD COMPONENT
// ============================================================================
const InputField = ({
  label,
  error,
  className = "",
  helperText,
  prefix,
  suffix,
  icon: Icon,
  required,
  onBlur,
  ...props
}) => {
  return (
    <div className={`w-full min-w-0 ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        )}
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          className={`w-full px-3 py-2.5 rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm ${
            Icon ? "pl-10" : prefix ? "pl-12" : ""
          } ${suffix ? "pr-12" : ""} ${
            error
              ? "border-red-400 bg-red-50 dark:bg-red-900/10 focus:ring-red-500/20 focus:border-red-500"
              : "border-gray-200 dark:border-gray-600"
          }`}
          onBlur={onBlur}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {helperText && !error && <p className="text-xs text-gray-500 mt-1.5">{helperText}</p>}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
        >
          <AlertCircle size={12} />
          {error}
        </motion.p>
      )}
    </div>
  );
};

// ============================================================================
// TEXTAREA COMPONENT
// ============================================================================
const TextArea = ({ label, error, className = "", helperText, maxLength, required, ...props }) => (
  <div className={`w-full min-w-0 ${className}`}>
    {label && (
      <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      className={`w-full px-3 py-2.5 rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none ${
        error
          ? "border-red-400 bg-red-50 dark:bg-red-900/10 focus:ring-red-500/20 focus:border-red-500"
          : "border-gray-200 dark:border-gray-600"
      }`}
      maxLength={maxLength}
      {...props}
    />
    <div className="flex justify-between mt-1.5">
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
      {maxLength && (
        <p
          className={`text-xs ml-auto ${
            (props.value?.length || 0) > maxLength * 0.9 ? "text-orange-500 font-medium" : "text-gray-400"
          }`}
        >
          {props.value?.length || 0}/{maxLength}
        </p>
      )}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
      >
        <AlertCircle size={12} />
        {error}
      </motion.p>
    )}
  </div>
);

// ============================================================================
// CUSTOM SELECT COMPONENT
// ============================================================================
const CustomSelect = ({ label, options, value, onChange, error, required, placeholder = "Select...", allowCustom }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const isCurrentValueCustom = value && !options.find((o) => (typeof o === "object" ? o.key : o) === value);

  return (
    <div className="w-full min-w-0">
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
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
            className={`flex-1 px-3 py-2.5 rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm ${
              error ? "border-red-400" : "border-gray-200 dark:border-gray-600"
            }`}
          />
          <button
            type="button"
            onClick={() => {
              setIsCustom(false);
              setCustomValue("");
              onChange("");
            }}
            className="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`flex-1 px-3 py-2.5 rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm ${
              error ? "border-red-400" : "border-gray-200 dark:border-gray-600"
            }`}
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
              onClick={() => setIsCustom(true)}
              className="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm flex items-center gap-1"
              title="Add custom value"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
        >
          <AlertCircle size={12} />
          {error}
        </motion.p>
      )}
    </div>
  );
};

// ============================================================================
// CATEGORY SECTION
// ============================================================================
const CategorySection = ({ data, onChange, errors, options, categories, addToast }) => (
  <div className="space-y-8">
    <Section title="Event Category" icon={Heart} description="What type of event is this?" badge="Required">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <motion.button
            key={cat.key}
            type="button"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onChange("category", cat.key);
              addToast(`${cat.label} selected`, "success");
            }}
            className={`relative p-6 rounded-2xl border-2 transition-all text-left overflow-hidden ${
              data.category === cat.key
                ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-lg shadow-purple-500/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 hover:shadow-md"
            }`}
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`}
            />
            <div className="relative z-10">
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-lg`}
              >
                <cat.icon size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{cat.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{cat.description}</p>
              {data.category === cat.key && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Check size={14} className="text-white" />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
      {errors.category && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm flex items-center gap-1.5 mt-2"
        >
          <AlertCircle size={14} />
          {errors.category}
        </motion.p>
      )}
    </Section>

    <Section title="Event Location" icon={MapPin} description="Where will the event take place?" badge="Required">
      <CustomSelect
        label="City"
        options={options.cities}
        value={data.city || ""}
        onChange={(val) => onChange("city", val)}
        required
        error={errors.city}
        placeholder="Select city..."
        allowCustom
      />
    </Section>
  </div>
);

// ============================================================================
// DATE TIME SECTION
// ============================================================================
const DateTimeSection = ({ data, onChange, errors, options, addToast }) => (
  <div className="space-y-8">
    <Section title="Event Date" icon={Calendar} description="When is the event scheduled?">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Specific Date"
          type="date"
          value={data.eventDetails?.selectedDate || ""}
          onChange={(e) => onChange("eventDetails", e.target.value, true, "selectedDate")}
          icon={Calendar}
        />
        <CustomSelect
          label="Or Date Range"
          options={options.dateRanges}
          value={data.eventDetails?.dateRange || ""}
          onChange={(val) => onChange("eventDetails", val, true, "dateRange")}
          placeholder="Choose flexibility..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <CustomSelect
          label="Month"
          options={options.months}
          value={data.eventDetails?.month || ""}
          onChange={(val) => onChange("eventDetails", val, true, "month")}
          placeholder="Select month..."
        />
        <InputField
          label="Year"
          type="number"
          value={data.eventDetails?.year || ""}
          onChange={(e) => onChange("eventDetails", parseInt(e.target.value) || "", true, "year")}
          placeholder="2025"
        />
        <InputField
          label="Day"
          type="number"
          value={data.eventDetails?.day || ""}
          onChange={(e) => onChange("eventDetails", parseInt(e.target.value) || "", true, "day")}
          placeholder="15"
          min={1}
          max={31}
        />
      </div>
    </Section>

    <Section title="Time Slot" icon={Clock} description="Preferred time for the event">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.timeSlots.map((slot) => (
          <motion.button
            key={slot.key}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onChange("eventDetails", slot.label, true, "timeSlot");
              addToast(`${slot.label} selected`, "info");
            }}
            className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
              data.eventDetails?.timeSlot === slot.label
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300"
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                data.eventDetails?.timeSlot === slot.label
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              <slot.icon size={18} />
            </div>
            <span
              className={`text-sm font-medium ${
                data.eventDetails?.timeSlot === slot.label
                  ? "text-purple-700 dark:text-purple-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {slot.label}
            </span>
            {data.eventDetails?.timeSlot === slot.label && (
              <CheckCircle size={16} className="text-purple-500 ml-auto" />
            )}
          </motion.button>
        ))}
      </div>
    </Section>
  </div>
);

// ============================================================================
// BUDGET SECTION
// ============================================================================
const BudgetSection = ({ data, onChange, errors, options, addToast }) => (
  <div className="space-y-8">
    <Section title="Event Budget" icon={IndianRupee} description="Budget for this event" badge="Required">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {options.budgetRanges.map((range) => (
          <motion.button
            key={range.value}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onChange("budgetDetails", range.value, true, "valueRaw");
              onChange("budgetDetails", range.label, true, "valueFormatted");
              addToast(`Budget set to ${range.label}`, "success");
            }}
            className={`p-4 rounded-xl border-2 transition-all text-center ${
              data.budgetDetails?.valueRaw === range.value
                ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300"
            }`}
          >
            <IndianRupee
              size={20}
              className={`mx-auto mb-2 ${
                data.budgetDetails?.valueRaw === range.value ? "text-green-600" : "text-gray-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                data.budgetDetails?.valueRaw === range.value
                  ? "text-green-700 dark:text-green-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {range.label}
            </span>
            {data.budgetDetails?.valueRaw === range.value && (
              <CheckCircle size={14} className="text-green-500 mx-auto mt-2" />
            )}
          </motion.button>
        ))}
      </div>
      {errors["budgetDetails.valueRaw"] && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm flex items-center gap-1.5 mt-2"
        >
          <AlertCircle size={14} />
          {errors["budgetDetails.valueRaw"]}
        </motion.p>
      )}

      <div className="mt-6">
        <InputField
          label="Custom Budget (in Lakhs)"
          type="number"
          value={data.budgetDetails?.valueRaw || ""}
          onChange={(e) => {
            const val = parseFloat(e.target.value) || "";
            onChange("budgetDetails", val, true, "valueRaw");
            if (val) {
              const formatted = val >= 100 ? `₹${val / 100} Crore(s)` : `₹${val} Lakhs`;
              onChange("budgetDetails", formatted, true, "valueFormatted");
            }
          }}
          placeholder="e.g., 25"
          prefix="₹"
          suffix="Lakhs"
        />
      </div>
    </Section>

    <Section title="Payment Preference" icon={CreditCard} description="Preferred payment method">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.paymentPreferences.map((pref) => (
          <motion.button
            key={pref.key}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onChange("budgetDetails", pref.key, true, "paymentPreference");
              addToast(`Payment preference: ${pref.label}`, "info");
            }}
            className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
              data.budgetDetails?.paymentPreference === pref.key
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300"
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                data.budgetDetails?.paymentPreference === pref.key
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              <pref.icon size={18} />
            </div>
            <span
              className={`text-sm font-medium ${
                data.budgetDetails?.paymentPreference === pref.key
                  ? "text-purple-700 dark:text-purple-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {pref.label}
            </span>
            {data.budgetDetails?.paymentPreference === pref.key && (
              <CheckCircle size={16} className="text-purple-500 ml-auto" />
            )}
          </motion.button>
        ))}
      </div>
    </Section>
  </div>
);

// ============================================================================
// CONTACT SECTION
// ============================================================================
const ContactSection = ({ data, onChange, errors, options, onBlur, addToast }) => (
  <div className="space-y-8">
    <Section title="Contact Information" icon={User} description="Contact details for this event" badge="Required">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Full Name"
          value={data.contactName || ""}
          onChange={(e) => onChange("contactName", e.target.value)}
          onBlur={() => onBlur?.("contactName")}
          required
          error={errors.contactName}
          placeholder="Contact name"
          icon={User}
        />
        <InputField
          label="Username"
          value={data.username || ""}
          onChange={(e) => onChange("username", e.target.value)}
          placeholder="Username (optional)"
          icon={Tag}
        />
        <InputField
          label="Email Address"
          type="email"
          value={data.contactEmail || ""}
          onChange={(e) => onChange("contactEmail", e.target.value)}
          onBlur={() => onBlur?.("contactEmail")}
          required
          error={errors.contactEmail}
          placeholder="email@example.com"
          icon={Mail}
        />
        <div className="flex gap-2">
          <div className="w-24">
            <InputField
              label="Code"
              value={data.countryCode || "+91"}
              onChange={(e) => onChange("countryCode", e.target.value)}
              placeholder="+91"
            />
          </div>
          <div className="flex-1">
            <InputField
              label="Phone Number"
              value={data.contactPhone || ""}
              onChange={(e) => onChange("contactPhone", e.target.value)}
              onBlur={() => onBlur?.("contactPhone")}
              required
              error={errors.contactPhone}
              placeholder="98765 43210"
              icon={Phone}
            />
          </div>
        </div>
      </div>
    </Section>
  </div>
);

// ============================================================================
// ADDITIONAL SECTION
// ============================================================================
const AdditionalSection = ({ data, onChange, errors, options, addToast }) => (
  <div className="space-y-8">
    <Section title="Current Location" icon={MapPin} description="Client's current location">
      <InputField
        label="Location"
        value={data.currentLocation || ""}
        onChange={(e) => onChange("currentLocation", e.target.value)}
        placeholder="e.g., Noida, Uttar Pradesh, India"
        icon={MapPin}
      />
    </Section>

    <Section title="Event Status" icon={Tag} description="Current status of this event">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {options.statuses.map((status) => (
          <motion.button
            key={status.key}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onChange("status", status.key);
              addToast(`Status set to ${status.label}`, "info");
            }}
            className={`p-3 rounded-xl border-2 transition-all text-center ${
              data.status === status.key
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300"
            }`}
          >
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.color}`}>{status.label}</span>
          </motion.button>
        ))}
      </div>
    </Section>

    <Section title="Source" icon={Globe} description="Event request source">
      <CustomSelect
        label="Source"
        options={options.sources}
        value={data.source || "admin"}
        onChange={(val) => onChange("source", val)}
        placeholder="Select source..."
      />
    </Section>

    <Section title="Additional Notes" icon={FileText} description="Any additional information">
      <TextArea
        label="Notes"
        value={data.notes || ""}
        onChange={(e) => onChange("notes", e.target.value)}
        placeholder="Enter any additional notes or special requirements..."
        rows={5}
        maxLength={1000}
      />
    </Section>
  </div>
);
