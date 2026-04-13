"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Save, 
  X, 
  Search, 
  Film, 
  Type, 
  Layers, 
  CheckCircle, 
  Check, 
  RefreshCw,
  Eye,
  AlertCircle,
  Play,
  Video,
  Lock,
  KeyRound,
  ShieldCheck,
  EyeOff
} from "lucide-react";
import { CustomDropdown, REEL_CATEGORIES, REEL_SUBCATEGORIES, REEL_TYPES, REEL_SUBTYPES } from "../AddReels";

export default function AddEditReelSection({ sectionId, onSuccess, onCancel }) {
  const isEditing = !!sectionId;
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Form State
  // Notice: linkedReels stores full objects to render the "Selected Reels" UI preview
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: "",
    subcategory: "",
    type: "",
    subType: "",
    nestedType: "",
    isActive: true,
    priority: 10,
    linkedReels: [], 
  });

  // Reel Picker & Preview State
  const [availableReels, setAvailableReels] = useState([]);
  const [reelsLoading, setReelsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewReel, setPreviewReel] = useState(null);

  // Fetch Section Data if Editing
  useEffect(() => {
    if (!sectionId) return;
    const fetchSection = async () => {
      try {
        const res = await fetch(`/api/reels/reel-sections/${sectionId}`);
        if (!res.ok) throw new Error("Failed to load section");
        const json = await res.json();
        
        // Keep the populated reel objects in state so we can show them in the "Selected Reels" area
        setFormData(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSection();
  }, [sectionId]);

  // Fetch ALL Available Reels (Unaffected by left-side Target Filters)
  const fetchReelsForPicker = useCallback(async () => {
    setReelsLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" }); 
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`/api/reels?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setAvailableReels(json.data || []);
      }
    } catch (err) {
      console.error("Error fetching reels for picker", err);
    } finally {
      setReelsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => fetchReelsForPicker(), 400);
    return () => clearTimeout(timer);
  }, [fetchReelsForPicker]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Toggle selection using full reel objects
  const toggleReelSelection = (reelObj) => {
    setFormData(prev => {
      const isSelected = prev.linkedReels.some(r => r._id === reelObj._id);
      if (isSelected) {
        return { ...prev, linkedReels: prev.linkedReels.filter(r => r._id !== reelObj._id) };
      } else {
        return { ...prev, linkedReels: [...prev.linkedReels, reelObj] };
      }
    });
  };

 const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError("Section Title is required");
      return;
    }
    if (!formData.type?.trim()) {
      setError("Event Type is required for Target Filters");
      return;
    }

    // Open the password modal instead of saving immediately
    setError(null);
    setShowPasswordModal(true);
  };

  const handleConfirmedSubmit = async (adminPassword) => {
    if (!adminPassword?.trim()) {
      setError("Admin password is required");
      setShowPasswordModal(false);
      return;
    }

    // Verify Password (Change "SectionPlanwab" to your actual desired admin password)
    if (adminPassword !== "AddSectionPlanwab") {
      setError("Incorrect admin password. Please try again.");
      setShowPasswordModal(false);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const url = isEditing ? `/api/reels/reel-sections/${sectionId}` : "/api/reels/reel-sections";
      const method = isEditing ? "PUT" : "POST";

      const payload = {
        ...formData,
        linkedReels: formData.linkedReels.map(r => r._id || r)
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save section");
      }

      setShowPasswordModal(false);
      onSuccess();
    } catch (err) {
      setError(err.message);
      setSaving(false);
      setShowPasswordModal(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Loading section details...</div>;
  }

  // Derived options for nested types
  const getNestedTypeOptions = () => {
    if (!formData.type || !formData.subType) return [];
    const typeGroup = REEL_SUBTYPES[formData.type];
    if (!typeGroup) return [];
    const subTypeData = typeGroup.find(st => st.value === formData.subType);
    return subTypeData?.nestedTypes || [];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Section Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="p-2.5 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
                <Type size={20} className="text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Section Details</h2>
                <p className="text-sm text-gray-500">Visible on the user feed</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Trending Wedding Highlights"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Subtitle (Optional)</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange("subtitle", e.target.value)}
                  placeholder="e.g., Handpicked moments just for you"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              {/* 👈 NEW PRIORITY DROPDOWN START */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                  Display Priority <span className="text-gray-400 text-xs font-normal ml-1">(1 = Top, 10 = Bottom)</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.priority || 10}
                    onChange={(e) => handleInputChange("priority", parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 appearance-none text-gray-900 dark:text-white cursor-pointer"
                  >
                    {[...Array(10)].map((_, i) => {
                      const value = i + 1;
                      return (
                        <option key={value} value={value}>
                          {value} {value === 1 ? "— Highest (Top of Page)" : value === 10 ? "— Lowest (Bottom of Page)" : ""}
                        </option>
                      );
                    })}
                  </select>
                  {/* Custom dropdown arrow to match your UI */}
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
              {/* 👈 NEW PRIORITY DROPDOWN END */}
  
              <label className="flex items-center gap-3 mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange("isActive", e.target.checked)}
                  className="w-4 h-4 text-violet-600 rounded"
                />
                <span className="text-sm font-medium">Active (Visible to users)</span>
              </label>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                <Layers size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Target Filters</h2>
                <p className="text-sm text-gray-500">Only Event Type is mandatory</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Mandatory Field */}
              <CustomDropdown
                label="Event Type"
                placeholder="Select Event Type"
                options={REEL_TYPES}
                value={formData.type}
                required={true}
                onChange={(val) => {
                  handleInputChange("type", val);
                  handleInputChange("subType", "");
                  handleInputChange("nestedType", "");
                }}
              />
              {/* Optional Fields below */}
              <CustomDropdown
                label="Category (Optional)"
                placeholder="All Categories"
                options={REEL_CATEGORIES}
                value={formData.category}
                required={false}
                onChange={(val) => {
                  handleInputChange("category", val);
                  handleInputChange("subcategory", "");
                }}
              />
              <CustomDropdown
                label="Subcategory (Optional)"
                placeholder="All Subcategories"
                options={formData.category ? REEL_SUBCATEGORIES[formData.category] || [] : []}
                value={formData.subcategory}
                required={false}
                onChange={(val) => handleInputChange("subcategory", val)}
                disabled={!formData.category}
              />
              <CustomDropdown
                label="Event Subtype (Optional)"
                placeholder="All Subtypes"
                options={formData.type ? REEL_SUBTYPES[formData.type] || [] : []}
                value={formData.subType}
                required={false}
                onChange={(val) => {
                  handleInputChange("subType", val);
                  handleInputChange("nestedType", "");
                }}
                disabled={!formData.type}
              />
              <CustomDropdown
                label="Event Nested Type (Optional)"
                placeholder="All Nested Types"
                options={getNestedTypeOptions()}
                value={formData.nestedType}
                required={false}
                onChange={(val) => handleInputChange("nestedType", val)}
                disabled={!formData.subType}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Attach Reels UI */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[800px]">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                    <Film size={20} className="text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Attach Reels</h2>
                    <p className="text-sm text-gray-500">Select any reels to feature in this section</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 rounded-full text-sm font-semibold">
                  {formData.linkedReels.length} Selected
                </div>
              </div>
            </div>

            {/* DYNAMIC SECTION: Selected Reels Confirmation */}
            <AnimatePresence>
              {formData.linkedReels.length > 0 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-gray-200 dark:border-gray-700 bg-violet-50/50 dark:bg-violet-900/10 flex-shrink-0 overflow-hidden"
                >
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-violet-900 dark:text-violet-100 mb-3 flex items-center gap-2">
                      <CheckCircle size={16} className="text-violet-500" /> 
                      Confirmed Selections ({formData.linkedReels.length})
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {formData.linkedReels.map(reel => (
                        <motion.div 
                          key={reel._id} 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="relative w-[72px] flex-shrink-0 group"
                        >
                          <div className="aspect-[9/16] rounded-lg overflow-hidden relative bg-gray-200 dark:bg-gray-800 border-2 border-violet-200 dark:border-violet-700 shadow-sm">
                            {reel.thumbnailUrl ? (
                              <Image src={reel.thumbnailUrl} alt={reel.title} fill sizes="80px" className="object-cover" />
                            ) : (
                              <Film size={16} className="absolute inset-0 m-auto text-gray-400" />
                            )}
                            {/* Overlay & Remove Button */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button"
                                onClick={() => toggleReelSelection(reel)}
                                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md cursor-pointer"
                                title="Remove Selection"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                          <p className="text-[10px] mt-1 font-medium text-gray-700 dark:text-gray-300 truncate text-center">
                            {reel.title}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search across all reels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>
            </div>

            {/* Reel Grid */}
            <div className="p-3 md:p-4 flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/20">
              {reelsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <RefreshCw size={24} className="animate-spin text-gray-400" />
                </div>
              ) : availableReels.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  No reels found. Try a different search term.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                  {availableReels.map((reel) => {
                    const isSelected = formData.linkedReels.some(r => r._id === reel._id);
                    return (
                      <div
                        key={reel._id}
                        // Clicking anywhere on the card toggles selection
                        onClick={() => toggleReelSelection(reel)}
                        className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 group ${
                          isSelected 
                            ? "border-2 border-violet-500 ring-2 ring-violet-500/30 scale-[0.98] shadow-md" 
                            : "border-[1.5px] border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <div className="aspect-[9/16] relative bg-gray-200 dark:bg-gray-800">
                          {reel.thumbnailUrl ? (
                            <Image src={reel.thumbnailUrl} alt={reel.title} fill sizes="150px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Film size={18} />
                            </div>
                          )}
                          
                          {/* Standard Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent transition-opacity group-hover:bg-black/50" />
                          
                          {/* Play Preview Button - Moved to BOTTOM RIGHT */}
                          {!isSelected && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents selection from toggling
                                e.preventDefault();
                                setPreviewReel(reel);
                              }}
                              className="absolute bottom-2 right-2 z-30 flex items-center justify-center w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/40 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
                              title="Preview Video"
                            >
                              <Play size={12} className="text-white fill-white ml-0.5" />
                            </button>
                          )}
                          
                          {/* EXPLICIT SELECTION OVERLAY (When added) */}
                          {isSelected && (
                            <>
                              {/* Dark Violet Tint */}
                              <div className="absolute inset-0 bg-violet-900/50 z-10 pointer-events-none" />
                              {/* Centered Check & Text */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                                <div className="bg-violet-600 text-white rounded-full p-2 mb-1.5 shadow-xl shadow-violet-900/50 scale-in">
                                  <Check size={18} strokeWidth={3.5} />
                                </div>
                                <span className="text-[9px] font-black tracking-wider text-white bg-violet-600 px-2 py-0.5 rounded shadow-lg">
                                  ADDED
                                </span>
                              </div>
                            </>
                          )}

                          {/* Info */}
                          {/* Adding pr-8 to avoid text overlapping the play button */}
                          <div className={`absolute bottom-1.5 left-1.5 pr-8 text-white pointer-events-none transition-opacity ${isSelected ? "opacity-30" : "opacity-100"}`}>
                            <p className="text-[9px] font-medium line-clamp-2 leading-snug">{reel.title}</p>
                            <div className="flex items-center gap-1 mt-0.5 text-[8px] text-gray-300">
                              <span className="flex items-center gap-0.5"><Eye size={8} /> {reel.viewCount || 0}</span>
                              {reel.category && <span className="capitalize px-1 py-[1px] bg-black/40 rounded truncate max-w-[50px]">{reel.category}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-4">
        <button
          onClick={onCancel}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          {isEditing ? "Update Section" : "Create Section"}
        </button>
      </div>

      {/* Admin Password Verification Modal */}
      <AdminPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handleConfirmedSubmit}
      />

      {/* Video Preview Modal */}
      <AnimatePresence>
        {previewReel && (
          <VideoPreviewModal
            reel={previewReel}
            onClose={() => setPreviewReel(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Admin Password Modal Subcomponent ──────────────────────────────────────────
const AdminPasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
    if (!isOpen) {
      const t = setTimeout(() => {
        setPassword("");
        setLocalError("");
        setShowPassword(false);
        setIsVerifying(false);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setLocalError("Please enter the admin password");
      return;
    }
    setIsVerifying(true);
    setLocalError("");
    try {
      // Simulate slight network delay for UX
      await new Promise((r) => setTimeout(r, 400));
      await onSuccess(password);
    } catch (err) {
      setLocalError(err.message || "Verification failed");
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
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
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Admin Verification</h2>
                <p className="text-white/80 text-sm mt-0.5">Confirm changes</p>
              </div>
            </div>
          </div>
          <form onSubmit={onSubmit} className="p-6 space-y-5">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                <Lock size={12} />
                Authentication Required to Save
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
                    setLocalError("");
                  }}
                  placeholder="Enter admin password"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 outline-none transition-all bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                    localError
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                      : "border-gray-200 dark:border-gray-600 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
                  }`}
                  disabled={isVerifying}
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
                {localError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm mt-2 flex items-center gap-1.5"
                  >
                    <AlertCircle size={14} />
                    {localError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isVerifying}
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying || !password.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} /> Confirm
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Video Preview Modal Subcomponent ──────────────────────────────────────────
const VideoPreviewModal = ({ reel, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-sm bg-black rounded-2xl overflow-hidden shadow-2xl"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        <X size={16} />
      </button>
      <div className="aspect-[9/16] relative bg-gray-900">
        {reel.videoUrl ? (
          <video
            src={reel.videoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
            poster={reel.thumbnailUrl}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
            <Video size={40} className="mb-2 opacity-50" />
            <p className="text-sm">No video URL available</p>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-900 text-white">
        <h3 className="font-semibold truncate text-sm">{reel.title}</h3>
        {reel.caption && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {reel.caption}
          </p>
        )}
      </div>
    </motion.div>
  </motion.div>
);