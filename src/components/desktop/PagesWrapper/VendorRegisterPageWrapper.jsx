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

  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Noida", "Gurgaon"];

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

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
    const maxSize = 5 * 1024 * 1024;
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
    if (step === 1) {
      if (!formData.businessName.trim()) newErrors.businessName = "Required";
      if (!formData.ownerName.trim()) newErrors.ownerName = "Required";
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
      if (!formData.phone.trim()) newErrors.phone = "Required";
      if (!formData.password || formData.password.length < 6) newErrors.password = "Min 6 chars";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mismatch";
    }
    if (step === 2) {
      if (!formData.category) newErrors.category = "Required";
      if (!formData.experience) newErrors.experience = "Required";
    }
    if (step === 3) {
      if (!formData.address.trim()) newErrors.address = "Required";
      if (!formData.city) newErrors.city = "Required";
      if (!/^[0-9]{6}$/.test(formData.pincode)) newErrors.pincode = "Invalid pincode";
    }
    if (step === 4) {
      const valid = formData.services.filter((s) => s.name.trim() && s.price.trim());
      if (valid.length === 0) newErrors.services = "Add at least one service";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please fill all required fields correctly");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!formData.agreeToTerms) {
      toast.error("Please accept terms and conditions");
      return;
    }
    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting registration...");
    try {
      const submitData = { ...formData, registrationType: "full" };
      delete submitData.confirmPassword;
      delete submitData.portfolioImages;

      const response = await fetch("/api/vendor/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success("Registration successful!", { id: loadingToast });
        setCurrentStep(1);
      } else {
        toast.error("Submission failed", { id: loadingToast });
      }
    } catch (error) {
      toast.error("An error occurred", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl mb-4 shadow-lg shadow-pink-100">
                <User className="text-white" size={40} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">Let's Get Started</h2>
              <p className="text-gray-500 mt-2">Create your professional vendor account</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Business Name *</label>
                <div className="relative group">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:bg-white bg-gray-50/50 transition-all outline-none"
                    placeholder="e.g., Royal Events"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Owner Name *</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange("ownerName", e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:bg-white bg-gray-50/50 transition-all outline-none"
                    placeholder="Full Name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address *</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:bg-white bg-gray-50/50 transition-all outline-none"
                    placeholder="vendor@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Phone Number *</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:bg-white bg-gray-50/50 transition-all outline-none"
                    placeholder="+91"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Password *</label>
                <div className="relative group">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:bg-white bg-gray-50/50 transition-all outline-none"
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Confirm Password *</label>
                <div className="relative group">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:bg-white bg-gray-50/50 transition-all outline-none"
                  />
                </div>
                </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl mb-4 shadow-lg shadow-purple-100">
                <Briefcase className="text-white" size={40} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">Business Details</h2>
              <p className="text-gray-500 mt-2">Tell us more about your expertise</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Business Category *</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = formData.category === cat.value;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => handleInputChange("category", cat.value)}
                        className={`flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-300 ${
                          isActive ? `border-pink-500 bg-gradient-to-br ${cat.color} text-white shadow-xl scale-105` : "border-gray-100 bg-white hover:border-pink-200 text-gray-600"
                        }`}
                      >
                        <Icon size={28} className={isActive ? "text-white" : "text-pink-500"} />
                        <span className="text-xs font-bold mt-3 text-center leading-tight">{cat.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Subcategory (Optional)</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange("subcategory", e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-pink-500 outline-none transition-all"
                    placeholder="e.g. Destination Weddings"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Years of Experience *</label>
                  <div className="flex gap-2">
                    {["0-1", "1-3", "3-5", "5+"].map((exp) => (
                      <button
                        key={exp}
                        onClick={() => handleInputChange("experience", exp)}
                        className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${
                          formData.experience === exp ? "border-pink-500 bg-pink-50 text-pink-600" : "border-gray-100 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Team Size</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {["1", "2-5", "6-10", "11-20", "20+"].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleInputChange("teamSize", size)}
                      className={`py-3 rounded-xl border-2 font-bold transition-all ${
                        formData.teamSize === size ? "border-purple-500 bg-purple-50 text-purple-600" : "border-gray-100 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full p-6 rounded-3xl border-2 border-gray-100 focus:border-pink-500 outline-none transition-all resize-none"
                  placeholder="Tell customers what makes your service special..."
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
             <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl mb-4 shadow-lg shadow-blue-100">
                <MapPin className="text-white" size={40} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">Location Details</h2>
              <p className="text-gray-500 mt-2">Where can customers find you?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700">Business Address *</label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full p-6 rounded-3xl border-2 border-gray-100 focus:border-pink-500 outline-none transition-all resize-none"
                  placeholder="Full physical address"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">City *</label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-pink-500 outline-none bg-white transition-all"
                >
                  <option value="">Select City</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Pincode *</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value.replace(/\D/g, ""))}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-pink-500 outline-none transition-all"
                  placeholder="110001"
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl mb-4 shadow-lg shadow-orange-100">
                <IndianRupee className="text-white" size={40} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">Services & Portfolio</h2>
              <p className="text-gray-500 mt-2">Highlight your pricing and portfolio</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">List Your Services</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.services.map((service, index) => (
                  <div key={index} className="p-6 rounded-3xl border-2 border-gray-100 bg-white shadow-sm relative group">
                    <button onClick={() => removeService(index)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={18} />
                    </button>
                    <input
                      type="text"
                      placeholder="Service Title"
                      value={service.name}
                      onChange={(e) => updateService(index, "name", e.target.value)}
                      className="w-full mb-3 font-bold border-b border-gray-100 pb-2 outline-none focus:border-pink-500 transition-all"
                    />
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                          type="text"
                          placeholder="Price"
                          value={service.price}
                          onChange={(e) => updateService(index, "price", e.target.value)}
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-100 outline-none focus:border-pink-500 transition-all"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                          type="text"
                          placeholder="Duration"
                          value={service.duration}
                          onChange={(e) => updateService(index, "duration", e.target.value)}
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-100 outline-none focus:border-pink-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                </div>
                <button onClick={addService} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-pink-500 font-bold hover:bg-pink-50 transition-all flex items-center justify-center gap-2">
                  <Plus size={20} /> Add Service
                </button>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Portfolio Upload</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="aspect-square rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-all cursor-pointer relative overflow-hidden bg-gray-50/50">
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload size={32} />
                    <span className="text-xs font-bold mt-2">Upload Images</span>
                  </div>
                  {imagePreview.map((src, i) => (
                    <div key={i} className="aspect-square rounded-3xl overflow-hidden relative group">
                      <img src={src} className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Trash2 size={24} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl mb-4 shadow-lg shadow-green-100">
                <CheckCircle className="text-white" size={40} />
              </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Final Verification</h2>
            <p className="text-gray-500">Add social links and agree to our terms</p>

            <div className="max-w-xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input type="url" value={formData.website} onChange={(e) => handleInputChange("website", e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 outline-none" placeholder="Website URL" />
                </div>
                <div className="relative">
                  <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={20} />
                  <input type="text" value={formData.instagram} onChange={(e) => handleInputChange("instagram", e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 outline-none" placeholder="Instagram Username" />
                </div>
              </div>

              <div className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${formData.agreeToTerms ? "bg-pink-50 border-pink-500" : "bg-gray-50 border-gray-100"}`} onClick={() => handleInputChange("agreeToTerms", !formData.agreeToTerms)}>
                <div className="flex items-start gap-4 text-left">
                  <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.agreeToTerms ? "bg-pink-500 border-pink-500" : "bg-white border-gray-300"}`}>
                    {formData.agreeToTerms && <Check size={16} className="text-white" />}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    I agree to the <span className="font-bold text-pink-600">Terms of Service</span> and <span className="font-bold text-pink-600">Privacy Policy</span>. I confirm that all information provided is accurate.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 selection:bg-pink-100">
      <Toaster position="top-right" richColors />

      {/* Optimized Header for Desktop */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => window.history.back()} className="p-3 rounded-2xl hover:bg-gray-50 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">VENDOR PORTAL</h1>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s <= currentStep ? "w-6 bg-pink-500" : "w-2 bg-gray-200"}`} />
              ))}
            </div>
          </div>
          <div className="w-12" />
        </div>
      </header>

      {/* Form Area with Multi-Column Logic */}
      <main className="max-w-4xl mx-auto px-6 py-12 pb-40">
        <AnimatePresence mode="wait">
          <div key={currentStep}>
            {renderStep()}
          </div>
        </AnimatePresence>
      </main>

      {/* Desktop Persistent Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between gap-6">
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-400">STEP {currentStep} OF 5</p>
            <p className="text-xs text-gray-400 mt-1">Registration progress: {Math.round((currentStep / 5) * 100)}%</p>
          </div>
          
          <div className="flex-1 flex gap-4 md:flex-initial">
            {currentStep > 1 && (
              <button onClick={prevStep} className="flex-1 md:w-32 py-4 rounded-2xl border-2 border-gray-100 font-bold hover:bg-gray-50 transition-all">
                Back
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button onClick={nextStep} className="flex-1 md:w-64 py-4 rounded-2xl bg-black text-white font-bold shadow-2xl shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Continue <ArrowRight size={20} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 md:w-64 py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-2xl shadow-pink-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <><Sparkles size={20} /> Finish</>}
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VendorRegisterPageWrapper;