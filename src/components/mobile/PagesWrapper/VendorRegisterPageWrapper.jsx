"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Upload,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";

const VendorRegisterPageWrapper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Business Details
    category: "",
    subcategory: "",
    experience: "",
    teamSize: "",
    description: "",

    // Location
    address: "",
    city: "",
    state: "",
    pincode: "",
    serviceAreas: [],

    // Services & Pricing
    services: [{ name: "", price: "", duration: "" }],
    portfolioImages: [],

    // Social & Legal
    website: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    gstNumber: "",
    panNumber: "",

    // Terms
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 5;

  const categories = [
    "Event Planner",
    "Venue",
    "Photographer",
    "Decorator",
    "Caterer",
    "Makeup Artist",
    "DJ/Music",
    "Mehendi Artist",
    "Cake",
    "Pandit",
  ];

  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Noida",
    "Gurgaon",
  ];

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { name: "", price: "", duration: "" }],
    }));
  };

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const updateService = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) => (i === index ? { ...service, [field]: value } : service)),
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
        if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords don't match";
        }
        break;
      case 2:
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.experience) newErrors.experience = "Experience is required";
        break;
      case 3:
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!formData.agreeToTerms) {
      setErrors({ agreeToTerms: "Please accept terms and conditions" });
      return;
    }

    setIsSubmitting(true);
    try {
      // API call to submit vendor request
      const response = await fetch("/api/vendor/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          registrationType: "full",
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Registration successful! You will receive a confirmation email shortly.");
        // Reset form or redirect as needed
      } else {
        if (response.status === 409) {
          setErrors({ email: "A request with this email already exists" });
        } else {
          throw new Error(result.error || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.businessName ? "border-red-500" : "border-gray-200"
                } focus:border-pink-500 focus:outline-none`}
                placeholder="Enter your business name"
              />
              {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleInputChange("ownerName", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.ownerName ? "border-red-500" : "border-gray-200"
                } focus:border-pink-500 focus:outline-none`}
                placeholder="Enter owner's full name"
              />
              {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.email ? "border-red-500" : "border-gray-200"
                } focus:border-pink-500 focus:outline-none`}
                placeholder="business@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.phone ? "border-red-500" : "border-gray-200"
                } focus:border-pink-500 focus:outline-none`}
                placeholder="+91 98765 43210"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  } focus:border-pink-500 focus:outline-none`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-200"
                  } focus:border-pink-500 focus:outline-none`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Business Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.category ? "border-red-500" : "border-gray-200"
                } focus:border-pink-500 focus:outline-none bg-white`}
              >
                <option value="">Select your business category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
              <select
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.experience ? "border-red-500" : "border-gray-200"
                } focus:border-pink-500 focus:outline-none bg-white`}
              >
                <option value="">Select experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
              {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
              <select
                value={formData.teamSize}
                onChange={(e) => handleInputChange("teamSize", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none bg-white"
              >
                <option value="">Select team size</option>
                <option value="1">Just me</option>
                <option value="2-5">2-5 people</option>
                <option value="6-10">6-10 people</option>
                <option value="11-20">11-20 people</option>
                <option value="20+">20+ people</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none"
                rows="4"
                placeholder="Tell us about your business, specialties, and what makes you unique..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Location Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Address *</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.address ? "border-red-500" : "border-gray-200"
                } focus:border-pink-500 focus:outline-none`}
                rows="3"
                placeholder="Enter complete business address"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.city ? "border-red-500" : "border-gray-200"
                  } focus:border-pink-500 focus:outline-none bg-white`}
                >
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.pincode ? "border-red-500" : "border-gray-200"
                  } focus:border-pink-500 focus:outline-none`}
                  placeholder="110001"
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none"
                placeholder="Enter state"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Services & Portfolio</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Services Offered</label>
              {formData.services.map((service, index) => (
                <div key={index} className="space-y-3 p-4 border border-gray-200 rounded-xl mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Service {index + 1}</span>
                    {formData.services.length > 1 && (
                      <button onClick={() => removeService(index)} className="text-red-500 p-1">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => updateService(index, "name", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none"
                    placeholder="Service name"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={service.price}
                      onChange={(e) => updateService(index, "price", e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none"
                      placeholder="Price (₹)"
                    />
                    <input
                      type="text"
                      value={service.duration}
                      onChange={(e) => updateService(index, "duration", e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none"
                      placeholder="Duration"
                    />
                  </div>
                </div>
              ))}
              <button onClick={addService} className="flex items-center gap-2 text-pink-600 text-sm font-medium">
                <Plus size={16} /> Add Another Service
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Portfolio Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload your best work</p>
                <input type="file" multiple accept="image/*" className="hidden" id="portfolio-upload" />
                <label
                  htmlFor="portfolio-upload"
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                >
                  Choose Images
                </label>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Final Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Social Media</label>

              <div className="flex items-center gap-3">
                <Instagram size={20} className="text-pink-600" />
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange("instagram", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none"
                  placeholder="Instagram username"
                />
              </div>

              <div className="flex items-center gap-3">
                <Facebook size={20} className="text-blue-600" />
                <input
                  type="text"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange("facebook", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none"
                  placeholder="Facebook page URL"
                />
              </div>

              <div className="flex items-center gap-3">
                <Linkedin size={20} className="text-blue-700" />
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none"
                  placeholder="LinkedIn profile URL"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Legal Documents (Optional)</label>

              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none"
                placeholder="GST Number"
              />

              <input
                type="text"
                value={formData.panNumber}
                onChange={(e) => handleInputChange("panNumber", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none"
                placeholder="PAN Number"
              />
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the <span className="text-pink-600 font-medium">Terms & Conditions</span> and{" "}
                <span className="text-pink-600 font-medium">Privacy Policy</span>. I understand that my information will
                be used to create my vendor profile on PlanWAB.
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">Vendor Registration</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-4">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-xs text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-medium"
            >
              Previous
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Submitting...
                </>
              ) : (
                "Complete Registration"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorRegisterPageWrapper;
