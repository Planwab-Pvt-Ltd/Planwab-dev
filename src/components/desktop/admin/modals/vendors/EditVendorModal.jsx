// components/modals/vendors/EditVendorModal.jsx

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Save,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Import the same form components used in AddVendor
// For brevity, I'll include the essential structure

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

// Password Confirmation Modal
const PasswordConfirmModal = ({ isOpen, onConfirm, onCancel, isLoading, error }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Lock size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Admin Password Required</h3>
            <p className="text-sm text-gray-500">Enter admin password to save changes</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(password)}
            disabled={!password || isLoading}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
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
      </motion.div>
    </div>
  );
};

// Simple Input Field
const InputField = ({ label, error, className = "", ...props }) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      }`}
      {...props}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// Simple Select Field
const SelectField = ({ label, options, value, onChange, error }) => (
  <div>
    {label && <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">{label}</label>}
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      }`}
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

// Checkbox Field
const CheckboxField = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
  </label>
);

// Tag Input
const TagInput = ({ label, tags = [], onChange, placeholder }) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      onChange([...tags, input.trim()]);
      setInput("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 min-h-[48px]">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium flex items-center gap-1.5"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((_, i) => i !== idx))}
              className="hover:text-red-500"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className="flex-1 min-w-[100px] outline-none bg-transparent text-sm"
        />
      </div>
    </div>
  );
};

export default function EditVendorModal({ vendor, onClose, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [activeSection, setActiveSection] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Initialize form data from vendor
  useEffect(() => {
    if (vendor) {
      setFormData({
        ...vendor,
        contactPerson: vendor.contactPerson || { firstName: "", lastName: "" },
        address: vendor.address || { street: "", city: "", state: "", postalCode: "", country: "India" },
        socialLinks: vendor.socialLinks || {},
        perDayPrice: vendor.perDayPrice || { min: "", max: "" },
      });
    }
  }, [vendor]);

  const sections = [
    { id: 0, label: "Basic Info" },
    { id: 1, label: "Location" },
    { id: 2, label: "Description" },
    { id: 3, label: "Pricing" },
    { id: 4, label: "Features" },
    { id: 5, label: "Status" },
  ];

  const handleInputChange = (field, value, isNested = false, nestedField = "") => {
    setFormData((prev) => {
      if (isNested) {
        return { ...prev, [field]: { ...(prev[field] || {}), [nestedField]: value } };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSave = () => {
    setShowPasswordModal(true);
    setPasswordError("");
  };

  const handlePasswordConfirm = async (password) => {
    setIsLoading(true);
    setPasswordError("");

    try {
      const response = await fetch("/api/vendor", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: vendor._id,
          password,
          ...formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setPasswordError("Invalid admin password");
        } else {
          setPasswordError(result.message || "Failed to update vendor");
        }
        return;
      }

      setShowPasswordModal(false);
      onSuccess?.();
    } catch (err) {
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!vendor) return null;

  return (
    <>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building2 size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Vendor</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{vendor.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Section Navigation */}
          <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <div className="flex gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Basic Info Section */}
            {activeSection === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Business Name"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                  <InputField
                    label="Username"
                    value={formData.username || ""}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    required
                    disabled
                  />
                  <InputField
                    label="Email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  <InputField
                    label="Phone"
                    value={formData.phoneNo || ""}
                    onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                  />
                  <InputField
                    label="WhatsApp"
                    value={formData.whatsappNo || ""}
                    onChange={(e) => handleInputChange("whatsappNo", e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="Contact First Name"
                      value={formData.contactPerson?.firstName || ""}
                      onChange={(e) => handleInputChange("contactPerson", e.target.value, true, "firstName")}
                    />
                    <InputField
                      label="Last Name"
                      value={formData.contactPerson?.lastName || ""}
                      onChange={(e) => handleInputChange("contactPerson", e.target.value, true, "lastName")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Location Section */}
            {activeSection === 1 && (
              <div className="space-y-4">
                <InputField
                  label="Street Address"
                  value={formData.address?.street || ""}
                  onChange={(e) => handleInputChange("address", e.target.value, true, "street")}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="City"
                    value={formData.address?.city || ""}
                    onChange={(e) => handleInputChange("address", e.target.value, true, "city")}
                  />
                  <InputField
                    label="State"
                    value={formData.address?.state || ""}
                    onChange={(e) => handleInputChange("address", e.target.value, true, "state")}
                  />
                  <InputField
                    label="Postal Code"
                    value={formData.address?.postalCode || ""}
                    onChange={(e) => handleInputChange("address", e.target.value, true, "postalCode")}
                  />
                  <InputField
                    label="Country"
                    value={formData.address?.country || "India"}
                    onChange={(e) => handleInputChange("address", e.target.value, true, "country")}
                  />
                </div>
                <InputField
                  label="Google Maps URL"
                  value={formData.address?.googleMapUrl || ""}
                  onChange={(e) => handleInputChange("address", e.target.value, true, "googleMapUrl")}
                />
              </div>
            )}

            {/* Description Section */}
            {activeSection === 2 && (
              <div className="space-y-4">
                <InputField
                  label="Short Description"
                  value={formData.shortDescription || ""}
                  onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                  maxLength={200}
                />
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Full Description
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl h-40 resize-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            )}

            {/* Pricing Section */}
            {activeSection === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Base Price (₹)"
                    type="number"
                    value={formData.basePrice || ""}
                    onChange={(e) => handleInputChange("basePrice", e.target.value)}
                  />
                  <SelectField
                    label="Price Unit"
                    options={["day", "plate", "hour", "event", "package", "item", "session", "person"]}
                    value={formData.priceUnit || "day"}
                    onChange={(val) => handleInputChange("priceUnit", val)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="Min Price"
                      type="number"
                      value={formData.perDayPrice?.min || ""}
                      onChange={(e) => handleInputChange("perDayPrice", e.target.value, true, "min")}
                    />
                    <InputField
                      label="Max Price"
                      type="number"
                      value={formData.perDayPrice?.max || ""}
                      onChange={(e) => handleInputChange("perDayPrice", e.target.value, true, "max")}
                    />
                  </div>
                </div>
                <TagInput
                  label="Payment Methods"
                  tags={formData.paymentMethods || []}
                  onChange={(val) => handleInputChange("paymentMethods", val)}
                  placeholder="Add payment method..."
                />
              </div>
            )}

            {/* Features Section */}
            {activeSection === 4 && (
              <div className="space-y-4">
                <TagInput
                  label="Amenities"
                  tags={formData.amenities || []}
                  onChange={(val) => handleInputChange("amenities", val)}
                  placeholder="Add amenity..."
                />
                <TagInput
                  label="Facilities"
                  tags={formData.facilities || []}
                  onChange={(val) => handleInputChange("facilities", val)}
                  placeholder="Add facility..."
                />
                <TagInput
                  label="Event Types"
                  tags={formData.eventTypes || []}
                  onChange={(val) => handleInputChange("eventTypes", val)}
                  placeholder="Add event type..."
                />
                <TagInput
                  label="Tags"
                  tags={formData.tags || []}
                  onChange={(val) => handleInputChange("tags", val)}
                  placeholder="Add tag..."
                />
              </div>
            )}

            {/* Status Section */}
            {activeSection === 5 && (
              <div className="space-y-4">
                <SelectField
                  label="Availability Status"
                  options={["Available", "Busy", "Unavailable", "Closed"]}
                  value={formData.availabilityStatus || "Available"}
                  onChange={(val) => handleInputChange("availabilityStatus", val)}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Rating (0-5)"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating || ""}
                    onChange={(e) => handleInputChange("rating", e.target.value)}
                  />
                  <InputField
                    label="Years Experience"
                    type="number"
                    value={formData.yearsExperience || ""}
                    onChange={(e) => handleInputChange("yearsExperience", e.target.value)}
                  />
                  <InputField
                    label="Total Bookings"
                    type="number"
                    value={formData.bookings || ""}
                    onChange={(e) => handleInputChange("bookings", e.target.value)}
                  />
                </div>
                <InputField
                  label="Response Time"
                  value={formData.responseTime || ""}
                  onChange={(e) => handleInputChange("responseTime", e.target.value)}
                />
                <div className="flex flex-wrap gap-4 pt-4">
                  <CheckboxField
                    label="Verified Vendor"
                    checked={formData.isVerified || false}
                    onChange={(e) => handleInputChange("isVerified", e.target.checked)}
                  />
                  <CheckboxField
                    label="Featured Listing"
                    checked={formData.isFeatured || false}
                    onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
                  />
                  <CheckboxField
                    label="Active Listing"
                    checked={formData.isActive !== false}
                    onChange={(e) => handleInputChange("isActive", e.target.checked)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                disabled={activeSection === 0}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-500">
                {activeSection + 1} / {sections.length}
              </span>
              <button
                onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                disabled={activeSection === sections.length - 1}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Password Confirmation Modal */}
      <PasswordConfirmModal
        isOpen={showPasswordModal}
        onConfirm={handlePasswordConfirm}
        onCancel={() => {
          setShowPasswordModal(false);
          setPasswordError("");
        }}
        isLoading={isLoading}
        error={passwordError}
      />
    </>
  );
}
