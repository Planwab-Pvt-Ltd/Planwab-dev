"use client";

import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShieldCheck,
  CreditCard,
  Calendar,
  Briefcase,
  Save,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowLeft,
  Lock,
  EyeOff,
  Eye,
  KeyRound,
  RefreshCw,
  Search,
  X,
  Plus,
  AlertTriangle,
  Crown,
  Check,
  Navigation,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";

// ============================================================================
// TOAST CONTEXT
// ============================================================================
const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

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
              className={`pointer-events-auto p-4 rounded-xl shadow-2xl border backdrop-blur-sm flex items-start gap-3 ${
                toast.type === "success"
                  ? "bg-green-50/95 border-green-300 text-green-800"
                  : toast.type === "error"
                    ? "bg-red-50/95 border-red-300 text-red-800"
                    : "bg-indigo-50/95 border-indigo-300 text-indigo-800"
              }`}
            >
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
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

export default function EditUserTab({ user, onBack, onSuccess }) {
  return (
    <ToastProvider>
      <EditUserContent user={user} onBack={onBack} onSuccess={onSuccess} />
    </ToastProvider>
  );
}

// ============================================================================
// ADMIN PASSWORD MODAL
// ============================================================================
const AdminPasswordModal = ({ isOpen, onClose, onSuccess, isLoading }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
          <ShieldCheck size={32} className="mx-auto mb-2" />
          <h2 className="text-xl font-bold">Admin Verification</h2>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium mb-2">Admin Password</label>
          <div className="relative mb-6">
            <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:border-indigo-500 bg-gray-50 dark:bg-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <EyeOff size={18} />
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 border-2 rounded-xl font-medium">
              Cancel
            </button>
            <button
              onClick={() => onSuccess(password)}
              disabled={isLoading || !password}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold flex justify-center gap-2"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />} Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// CustomSelect Component (Required for filters)
const CustomSelect = ({ label, options, value, onChange, placeholder = "Select..." }) => (
  <div className="w-full min-w-0">
    {label && <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">{label}</label>}
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm border-gray-200 dark:border-gray-600"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

// New Vendor Select Section
const VendorSelectSection = ({ data, onListChange, addToast }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [availableCities, setAvailableCities] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const searchTimeoutRef = useRef(null);

  const selectedVendors = data.createdProfiles || [];

  const fetchVendors = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setHasSearched(true);
      try {
        const params = new URLSearchParams({ page: page.toString(), limit: "6", sortBy: "trust", sortOrder: "desc" });
        if (searchQuery.trim()) params.set("search", searchQuery.trim());
        if (categoryFilter) params.set("category", categoryFilter);
        if (cityFilter) params.set("city", cityFilter);

        const response = await fetch(`/api/vendor/profile/lists?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
          setVendors(result.data || []);
          setPagination({
            page: result.pagination?.page || 1,
            totalPages: result.pagination?.totalPages || 1,
            total: result.pagination?.total || 0,
          });
          if (result.filters?.availableCities?.length > 0) setAvailableCities(result.filters.availableCities);
          if (result.filters?.availableCategories?.length > 0)
            setAvailableCategories(result.filters.availableCategories);
        }
      } catch (error) {
        console.error("Failed to fetch vendor profiles:", error);
        addToast("Failed to load vendor profiles", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, categoryFilter, cityFilter, addToast],
  );

  useEffect(() => {
    fetchVendors(1);
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => fetchVendors(1), 500);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery, categoryFilter, cityFilter]);

  const toggleVendor = useCallback(
    (vendorId) => {
      const current = data.createdProfiles || [];
      let updated;
      if (current.includes(vendorId)) {
        updated = current.filter((id) => id !== vendorId);
        addToast("Vendor profile removed", "info");
      } else {
        updated = [...current, vendorId];
        addToast("Vendor profile linked", "success");
      }
      onListChange("createdProfiles", updated);
    },
    [data.createdProfiles, onListChange, addToast],
  );

  const removeVendor = useCallback(
    (vendorId) => {
      const updated = (data.createdProfiles || []).filter((id) => id !== vendorId);
      onListChange("createdProfiles", updated);
      addToast("Vendor profile removed", "info");
    },
    [data.createdProfiles, onListChange, addToast],
  );

  return (
    <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
        <div className="flex items-center gap-3">
          <Briefcase className="text-indigo-500" />
          <h2 className="text-lg font-bold">Linked Vendor Profiles</h2>
        </div>
        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full">
          {selectedVendors.length} Linked
        </span>
      </div>

      {/* Selected Vendors Grid */}
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[100px]">
        <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Currently Linked Profiles</p>
        {selectedVendors.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedVendors.map((id) => {
                const vendor = vendors.find((v) => v._id === id);
                return (
                  <motion.div
                    key={id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl"
                  >
                    {vendor?.vendorAvatar && (
                      <img
                        src={vendor.vendorAvatar || vendor.vendorCoverImage}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300 max-w-[160px] truncate">
                      {vendor?.vendorBusinessName || vendor?.username || id.slice(-8)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeVendor(id)}
                      className="p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-md transition-colors"
                    >
                      <X size={14} className="text-indigo-600 dark:text-indigo-400" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No vendor profiles are currently linked to this user.</p>
        )}
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-3">
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
            Search to Link New Profiles
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by business name, city, category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <CustomSelect
          label="Filter by Category"
          options={availableCategories.map((c) => ({ key: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
          value={categoryFilter}
          onChange={setCategoryFilter}
          placeholder="All categories"
        />
        <CustomSelect
          label="Filter by City"
          options={availableCities.map((c) => ({ key: c, label: c }))}
          value={cityFilter}
          onChange={setCityFilter}
          placeholder="All cities"
        />
      </div>

      {/* Search Results Grid */}
      <div className="mt-4">
        {isLoading && vendors.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-700 rounded-xl h-24" />
            ))}
          </div>
        ) : vendors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vendors.map((vendor) => {
                const isSelected = selectedVendors.includes(vendor._id);
                return (
                  <motion.button
                    key={vendor._id}
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleVendor(vendor._id)}
                    className={`relative text-left p-3 rounded-xl border-2 transition-all ${isSelected ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300"}`}
                  >
                    <div
                      className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-300 dark:border-gray-600"}`}
                    >
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                    <div className="flex items-start gap-3 pr-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex-shrink-0 overflow-hidden">
                        {vendor.vendorAvatar ? (
                          <img src={vendor.vendorAvatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 size={16} className="text-indigo-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {vendor.vendorBusinessName || vendor.username || "Unnamed"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {vendor.category && (
                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[9px] font-medium rounded-full capitalize">
                              {vendor.category}
                            </span>
                          )}
                          {vendor.location?.city && (
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
                              <Navigation size={9} />
                              {vendor.location.city}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => fetchVendors(pagination.page - 1)}
                  disabled={pagination.page <= 1 || isLoading}
                  className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => fetchVendors(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                  className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        ) : hasSearched ? (
          <div className="text-center py-6">
            <Search size={28} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No vendor profiles found</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ============================================================================
// CONTENT COMPONENT
// ============================================================================
function EditUserContent({ user: propUser, onBack, onSuccess }) {
  const { addToast } = useToast();
  const { user: clerkUser } = useUser();
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Vendor Linking State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (propUser) {
      const getIsoDate = (d) => {
        if (!d) return "";
        const dateObj = typeof d === "object" && d.$date ? new Date(d.$date) : new Date(d);
        return dateObj.toISOString().split("T")[0];
      };

      const initial = {
        userType: propUser.userType || "regular",
        plan: propUser.plan || "free",
        role: propUser.role || "user",
        billingCycle: propUser.billingCycle || "",
        planPurchasedAt: getIsoDate(propUser.planPurchasedAt),
        planExpiresAt: getIsoDate(propUser.planExpiresAt),
        createdProfiles: propUser.createdProfiles || [],
      };
      setFormData(initial);
      setOriginalData(JSON.parse(JSON.stringify(initial)));
    }
  }, [propUser]);

  useEffect(() => {
    if (originalData && formData) {
      setHasChanges(JSON.stringify(formData) !== JSON.stringify(originalData));
    }
  }, [formData, originalData]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto set purchase date if plan changes
      if (field === "plan" && value !== prev.plan) {
        updated.planPurchasedAt = new Date().toISOString().split("T")[0];
      }
      return updated;
    });
  };

  // Add / Remove Vendor Linked Profiles
  const removeProfile = (clerkIdToRemove) => {
    setFormData((prev) => ({
      ...prev,
      createdProfiles: prev.createdProfiles.filter((id) => id !== clerkIdToRemove),
    }));
  };

  const addProfile = (clerkId) => {
    if (!formData.createdProfiles.includes(clerkId)) {
      setFormData((prev) => ({
        ...prev,
        createdProfiles: [...prev.createdProfiles, clerkId],
      }));
      addToast("Profile ID added to list", "success");
    } else {
      addToast("ID already linked", "info");
    }
    setSearchTerm("");
    setSearchResults([]);
  };

  // Search Users logic
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/user/list?search=${encodeURIComponent(searchTerm)}&limit=5`);
        const json = await res.json();
        if (json.success && json.data) {
          setSearchResults(json.data);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchTerm]);

  const handleSave = async (password) => {
    if (!clerkUser) return addToast("Authentication required", "error");
    setIsSubmitting(true);
    if (password !== "user@planwab@6713") { // <-- Replace with your actual admin password
      addToast("Incorrect admin password. Please try again.", "error");
      setShowPasswordModal(false); // Close modal on failure
      return; // Stop execution, don't hit the API
    }
    try {
      const payload = {
        userId: clerkUser.id,
        id: propUser._id || propUser.id || propUser.clerkId,
        ...formData,
      };

      const res = await fetch("/api/user/updatedittab", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed");

      addToast("User updated successfully!", "success");
      setShowPasswordModal(false);
      setHasChanges(false);
      setTimeout(() => onSuccess?.(), 1000);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!originalData)
    return (
      <div className="p-12 text-center">
        <RefreshCw className="animate-spin text-indigo-500 mx-auto" />
      </div>
    );

  const fullName = `${propUser.firstName || ""} ${propUser.lastName || ""}`.trim() || propUser.username || "User";

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-6 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600">
              <User size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Administrative Data</h1>
              <p className="text-sm text-gray-500">Editing privileges for {fullName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              disabled={!hasChanges || isSubmitting}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-3">
              <ShieldCheck className="text-indigo-500" />
              <h2 className="text-lg font-bold">Role & Permissions</h2>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">User Role</label>
              <select
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full p-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-900 focus:border-indigo-500 outline-none"
              >
                <option value="user">User</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">User Type</label>
              <select
                value={formData.userType}
                onChange={(e) => handleChange("userType", e.target.value)}
                className="w-full p-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-900 focus:border-indigo-500 outline-none"
              >
                <option value="regular">Regular</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>
          </div>

          {/* Subscription Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Crown className="text-indigo-500" />
              <h2 className="text-lg font-bold">Subscription Plan</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Plan Tier</label>
                <select
                  value={formData.plan}
                  onChange={(e) => handleChange("plan", e.target.value)}
                  className="w-full p-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-900 focus:border-indigo-500 outline-none"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="max">Max</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Billing Cycle</label>
                <select
                  value={formData.billingCycle || ""}
                  onChange={(e) => handleChange("billingCycle", e.target.value)}
                  className="w-full p-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-900 focus:border-indigo-500 outline-none"
                >
                  <option value="">None</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Purchased Date</label>
                <input
                  type="date"
                  value={formData.planPurchasedAt}
                  onChange={(e) => handleChange("planPurchasedAt", e.target.value)}
                  className="w-full p-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-900 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Expiry Date</label>
                <input
                  type="date"
                  value={formData.planExpiresAt}
                  onChange={(e) => handleChange("planExpiresAt", e.target.value)}
                  className="w-full p-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-900 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Linked Profiles */}
          <VendorSelectSection
            data={formData}
            onListChange={(field, value) => {
              handleChange(field, value);
            }}
            addToast={addToast}
          />
        </div>
      </div>

      <AdminPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handleSave}
        isLoading={isSubmitting}
      />
    </div>
  );
}
