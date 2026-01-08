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
  Briefcase,
  Users,
  Award,
  FileText,
  Shield,
  Sparkles,
  TrendingUp,
  Image as ImageIcon,
  Check,
  Loader2,
} from "lucide-react";
import { toast, Toaster } from "sonner";

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
  const [touchedFields, setTouchedFields] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);

  const totalSteps = 5;

  const categories = [
    { value: "Event Planner", icon: Briefcase, color: "from-purple-500 to-pink-500" },
    { value: "Venue", icon: Building, color: "from-blue-500 to-cyan-500" },
    { value: "Photographer", icon: Camera, color: "from-orange-500 to-red-500" },
    { value: "Decorator", icon: Sparkles, color: "from-pink-500 to-rose-500" },
    { value: "Caterer", icon: Users, color: "from-green-500 to-emerald-500" },
    { value: "Makeup Artist", icon: Star, color: "from-yellow-500 to-orange-500" },
    { value: "DJ/Music", icon: TrendingUp, color: "from-indigo-500 to-purple-500" },
    { value: "Mehendi Artist", icon: Award, color: "from-red-500 to-pink-500" },
    { value: "Cake", icon: FileText, color: "from-teal-500 to-cyan-500" },
    { value: "Pandit", icon: Shield, color: "from-amber-500 to-yellow-500" },
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
      setTouchedFields((prev) => ({ ...prev, [field]: true }));
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
    toast.success("Service slot added");
  };

  const removeService = (index) => {
    if (formData.services.length === 1) {
      toast.error("At least one service is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
    toast.info("Service removed");
  };

  const updateService = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) => (i === index ? { ...service, [field]: value } : service)),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setImagePreview((prev) => [...prev, ...newPreviews]);
      setFormData((prev) => ({
        ...prev,
        portfolioImages: [...prev.portfolioImages, ...validFiles],
      }));
      toast.success(`${validFiles.length} image(s) added`);
    }
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreview[index]);
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      portfolioImages: prev.portfolioImages.filter((_, i) => i !== index),
    }));
    toast.info("Image removed");
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.businessName.trim()) {
          newErrors.businessName = "Business name is required";
        } else if (formData.businessName.length < 3) {
          newErrors.businessName = "Business name must be at least 3 characters";
        }

        if (!formData.ownerName.trim()) {
          newErrors.ownerName = "Owner name is required";
        } else if (formData.ownerName.length < 3) {
          newErrors.ownerName = "Owner name must be at least 3 characters";
        }

        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Invalid email format";
        }

        if (!formData.phone.trim()) {
          newErrors.phone = "Phone is required";
        } else if (!/^[+]?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ""))) {
          newErrors.phone = "Invalid phone number";
        }

        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        }

        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords don't match";
        }
        break;

      case 2:
        if (!formData.category) {
          newErrors.category = "Category is required";
        }
        if (!formData.experience) {
          newErrors.experience = "Experience is required";
        }
        break;

      case 3:
        if (!formData.address.trim()) {
          newErrors.address = "Address is required";
        }
        if (!formData.city) {
          newErrors.city = "City is required";
        }
        if (!formData.pincode.trim()) {
          newErrors.pincode = "Pincode is required";
        } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
          newErrors.pincode = "Invalid pincode (must be 6 digits)";
        }
        break;

      case 4:
        const validServices = formData.services.filter((s) => s.name.trim() && s.price.trim() && s.duration.trim());
        if (validServices.length === 0) {
          newErrors.services = "At least one complete service is required";
          toast.error("Please fill at least one service completely");
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("Step completed!");
    } else {
      toast.error("Please fix the errors before proceeding");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!formData.agreeToTerms) {
      setErrors({ agreeToTerms: "Please accept terms and conditions" });
      toast.error("Please accept terms and conditions");
      return;
    }

    // Filter out empty services
    const validServices = formData.services.filter((s) => s.name.trim() && s.price.trim() && s.duration.trim());

    if (validServices.length === 0) {
      toast.error("Please add at least one complete service");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting your registration...");

    try {
      // Prepare form data (excluding images for now, handle separately if needed)
      const submitData = {
        ...formData,
        services: validServices,
        registrationType: "full",
      };

      // Remove confirmPassword as it's not in schema
      delete submitData.confirmPassword;
      delete submitData.portfolioImages; // Handle image upload separately if backend supports it

      const response = await fetch("/api/vendor/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("🎉 Registration successful!", {
          id: loadingToast,
          description: "You will receive a confirmation email shortly.",
          duration: 5000,
        });

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            businessName: "",
            ownerName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            category: "",
            subcategory: "",
            experience: "",
            teamSize: "",
            description: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            serviceAreas: [],
            services: [{ name: "", price: "", duration: "" }],
            portfolioImages: [],
            website: "",
            instagram: "",
            facebook: "",
            linkedin: "",
            gstNumber: "",
            panNumber: "",
            agreeToTerms: false,
          });
          setCurrentStep(1);
          setImagePreview([]);
        }, 2000);
      } else {
        if (response.status === 409) {
          toast.error("Email already registered", {
            id: loadingToast,
            description: "A request with this email already exists.",
          });
          setErrors({ email: "A request with this email already exists" });
          setCurrentStep(1); // Go back to first step
        } else if (result.details) {
          toast.error("Validation failed", {
            id: loadingToast,
            description: Array.isArray(result.details) ? result.details.join(", ") : result.details,
          });
        } else {
          throw new Error(result.error || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        id: loadingToast,
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl mb-4">
                <User className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's Get Started</h2>
              <p className="text-gray-600">Tell us about yourself and your business</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    onBlur={() => setTouchedFields((prev) => ({ ...prev, businessName: true }))}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                      touchedFields.businessName && errors.businessName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-pink-500"
                    } focus:outline-none transition-all`}
                    placeholder="e.g., Royal Events & Weddings"
                  />
                </div>
                {touchedFields.businessName && errors.businessName && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.businessName}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Owner Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange("ownerName", e.target.value)}
                    onBlur={() => setTouchedFields((prev) => ({ ...prev, ownerName: true }))}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                      touchedFields.ownerName && errors.ownerName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-pink-500"
                    } focus:outline-none transition-all`}
                    placeholder="Enter owner's full name"
                  />
                </div>
                {touchedFields.ownerName && errors.ownerName && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.ownerName}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => setTouchedFields((prev) => ({ ...prev, email: true }))}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                      touchedFields.email && errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-pink-500"
                    } focus:outline-none transition-all`}
                    placeholder="business@example.com"
                  />
                </div>
                {touchedFields.email && errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.email}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    onBlur={() => setTouchedFields((prev) => ({ ...prev, phone: true }))}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                      touchedFields.phone && errors.phone
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-pink-500"
                    } focus:outline-none transition-all`}
                    placeholder="+91 98765 43210"
                  />
                </div>
                {touchedFields.phone && errors.phone && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.phone}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    onBlur={() => setTouchedFields((prev) => ({ ...prev, password: true }))}
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 ${
                      touchedFields.password && errors.password
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-pink-500"
                    } focus:outline-none transition-all`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {touchedFields.password && errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.password}
                  </motion.p>
                )}
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    onBlur={() => setTouchedFields((prev) => ({ ...prev, confirmPassword: true }))}
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 ${
                      touchedFields.confirmPassword && errors.confirmPassword
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-pink-500"
                    } focus:outline-none transition-all`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {touchedFields.confirmPassword && errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mb-4">
                <Briefcase className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Details</h2>
              <p className="text-gray-600">Help us understand your business better</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Your Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <motion.button
                        key={cat.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleInputChange("category", cat.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.category === cat.value
                            ? `border-pink-500 bg-gradient-to-br ${cat.color} text-white shadow-lg`
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <Icon className={formData.category === cat.value ? "text-white" : "text-gray-600"} size={24} />
                        <p
                          className={`text-sm font-medium mt-2 ${
                            formData.category === cat.value ? "text-white" : "text-gray-700"
                          }`}
                        >
                          {cat.value}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
                {errors.category && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-2 flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.category}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategory (Optional)</label>
                <input
                  type="text"
                  value={formData.subcategory}
                  onChange={(e) => handleInputChange("subcategory", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-all"
                  placeholder="e.g., Candid Photography, Destination Weddings"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["0-1", "1-3", "3-5", "5-10", "10+"].map((exp) => (
                    <motion.button
                      key={exp}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleInputChange("experience", exp)}
                      className={`py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                        formData.experience === exp
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      {exp} years
                    </motion.button>
                  ))}
                </div>
                {errors.experience && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-2 flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.experience}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Team Size</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "1", label: "Just me" },
                    { value: "2-5", label: "2-5" },
                    { value: "6-10", label: "6-10" },
                    { value: "11-20", label: "11-20" },
                    { value: "20+", label: "20+" },
                  ].map((size) => (
                    <motion.button
                      key={size.value}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleInputChange("teamSize", size.value)}
                      className={`py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                        formData.teamSize === size.value
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      {size.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-all resize-none"
                  rows="5"
                  placeholder="Tell us about your business, specialties, and what makes you unique..."
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/1000 characters</p>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4">
                <MapPin className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Location Details</h2>
              <p className="text-gray-600">Where are you based?</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  onBlur={() => setTouchedFields((prev) => ({ ...prev, address: true }))}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    touchedFields.address && errors.address
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-pink-500"
                  } focus:outline-none transition-all resize-none`}
                  rows="3"
                  placeholder="Enter complete business address"
                />
                {touchedFields.address && errors.address && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.address}
                  </motion.p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    onBlur={() => setTouchedFields((prev) => ({ ...prev, city: true }))}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      touchedFields.city && errors.city
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-pink-500"
                    } focus:outline-none bg-white transition-all`}
                  >
                    <option value="">Select city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {touchedFields.city && errors.city && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {errors.city}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value.replace(/\D/g, ""))}
                    onBlur={() => setTouchedFields((prev) => ({ ...prev, pincode: true }))}
                    maxLength={6}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      touchedFields.pincode && errors.pincode
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-pink-500"
                    } focus:outline-none transition-all`}
                    placeholder="110001"
                  />
                  {touchedFields.pincode && errors.pincode && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {errors.pincode}
                    </motion.p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-all"
                  placeholder="Enter state"
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4">
                <IndianRupee className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Services & Portfolio</h2>
              <p className="text-gray-600">Showcase your offerings</p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">Services Offered</label>
                  <span className="text-xs text-gray-500">{formData.services.length} service(s)</span>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {formData.services.map((service, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Award className="text-pink-500" size={16} />
                            Service {index + 1}
                          </span>
                          {formData.services.length > 1 && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeService(index)}
                              className="text-red-500 p-1 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateService(index, "name", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none mb-3 transition-all"
                          placeholder="Service name (e.g., Wedding Photography)"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <IndianRupee
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={16}
                            />
                            <input
                              type="text"
                              value={service.price}
                              onChange={(e) => updateService(index, "price", e.target.value)}
                              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none transition-all"
                              placeholder="Price"
                            />
                          </div>
                          <div className="relative">
                            <Clock
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={16}
                            />
                            <input
                              type="text"
                              value={service.duration}
                              onChange={(e) => updateService(index, "duration", e.target.value)}
                              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none transition-all"
                              placeholder="Duration"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addService}
                  className="w-full mt-3 py-3 border-2 border-dashed border-gray-300 rounded-xl text-pink-600 text-sm font-medium hover:border-pink-500 hover:bg-pink-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add Another Service
                </motion.button>
                {errors.services && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-2 flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.services}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Portfolio Images (Optional)</label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    imagePreview.length > 0 ? "border-pink-300 bg-pink-50" : "border-gray-300 hover:border-pink-400"
                  }`}
                >
                  <Upload size={40} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2 font-medium">Upload your best work</p>
                  <p className="text-xs text-gray-500 mb-4">JPG, PNG or WEBP (max 5MB each)</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="portfolio-upload"
                  />
                  <label
                    htmlFor="portfolio-upload"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-xl text-sm font-medium cursor-pointer hover:shadow-lg transition-all"
                  >
                    <ImageIcon size={18} />
                    Choose Images
                  </label>
                </div>

                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <AnimatePresence>
                      {imagePreview.map((preview, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200"
                        >
                          <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeImage(index)}
                              className="p-2 bg-red-500 text-white rounded-full"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-4">
                <CheckCircle className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost Done!</h2>
              <p className="text-gray-600">Final touches to complete your profile</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-all"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Social Media Profiles</label>

                <div className="relative">
                  <Instagram className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-600" size={20} />
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange("instagram", e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-all"
                    placeholder="Instagram username"
                  />
                </div>

                <div className="relative">
                  <Facebook className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600" size={20} />
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => handleInputChange("facebook", e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-all"
                    placeholder="Facebook page URL"
                  />
                </div>

                <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-700" size={20} />
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange("linkedin", e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-all"
                    placeholder="LinkedIn profile URL"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <label className="block text-sm font-semibold text-gray-700">Legal Documents (Optional)</label>

                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange("gstNumber", e.target.value.toUpperCase())}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-all"
                    placeholder="GST Number"
                    maxLength={15}
                  />
                </div>

                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-all"
                    placeholder="PAN Number"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="pt-4">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`flex items-start gap-3 p-4 rounded-xl transition-all cursor-pointer ${
                    formData.agreeToTerms
                      ? "bg-pink-50 border-2 border-pink-300"
                      : "bg-gray-50 border-2 border-gray-200"
                  }`}
                  onClick={() => handleInputChange("agreeToTerms", !formData.agreeToTerms)}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        formData.agreeToTerms ? "bg-pink-500 border-pink-500" : "border-gray-300 hover:border-pink-300"
                      }`}
                    >
                      {formData.agreeToTerms && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                  <label className="text-sm text-gray-700 cursor-pointer">
                    I agree to the <span className="text-pink-600 font-semibold">Terms & Conditions</span> and{" "}
                    <span className="text-pink-600 font-semibold">Privacy Policy</span>. I understand that my
                    information will be used to create my vendor profile on PlanWAB.
                  </label>
                </motion.div>
                {errors.agreeToTerms && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-2 flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.agreeToTerms}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      <Toaster position="top-center" richColors closeButton />

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Vendor Registration
          </h1>
          <div className="w-10" />
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-4 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-xs font-bold text-pink-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-3">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step < currentStep
                    ? "bg-green-500 text-white"
                    : step === currentStep
                    ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step < currentStep ? <Check size={14} /> : step}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 pb-32 max-w-2xl mx-auto">
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
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-4 shadow-2xl">
        <div className="max-w-2xl mx-auto flex gap-3">
          {currentStep > 1 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={prevStep}
              className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Previous
            </motion.button>
          )}

          {currentStep < totalSteps ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={nextStep}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Next Step
              <ArrowRight size={18} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Complete Registration
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorRegisterPageWrapper;
