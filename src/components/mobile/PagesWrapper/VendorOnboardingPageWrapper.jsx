// pages/VendorProfileOnboardingPageWrapper.jsx

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CheckCircle,
  Store,
  MapPin,
  Tag,
  Lock,
  Sparkles,
  ArrowLeft,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  Shield,
  Image as ImageIcon,
  User,
  Building2,
  Globe,
  Check,
  View,
} from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link"],
    ["clean"],
  ],
};

const quillFormats = ["header", "bold", "italic", "underline", "strike", "list", "color", "background", "link"];

const categories = [
  { key: "venues", label: "Venues" },
  { key: "photographers", label: "Photographers" },
  { key: "makeup", label: "Makeup" },
  { key: "planners", label: "Planners" },
  { key: "catering", label: "Catering" },
  { key: "clothes", label: "Clothes" },
  { key: "mehendi", label: "Mehendi" },
  { key: "cakes", label: "Cakes" },
  { key: "jewellery", label: "Jewellery" },
  { key: "invitations", label: "Invitations" },
  { key: "djs", label: "DJs" },
  { key: "hairstyling", label: "Hairstyling" },
  { key: "decor", label: "Decorators" },
  { key: "dhol", label: "Dhol" },
  { key: "anchor", label: "Anchor" },
  { key: "stageEntry", label: "Stage Entry" },
  { key: "fireworks", label: "Fireworks" },
  { key: "barat", label: "Barat" },
  { key: "other", label: "Other" },
];

const VendorProfileOnboardingPageWrapper = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [createdProfile, setCreatedProfile] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState("");
  const categoryRef = useRef(null);

  const [formData, setFormData] = useState({
    vendorBusinessName: "",
    username: "",
    vendorName: "",
    category: "",
    bio: "",
    profilePicture: "",
    coverImage: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    password: "",
    confirmPassword: "",
  });
  const filteredCategories = categoryQuery
    ? categories.filter((c) => c.label.toLowerCase().includes(categoryQuery.toLowerCase()))
    : categories;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadImageToBunny = async (file) => {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

      const storageZone = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME;
      const accessKey = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE_PASSWORD;
      const cdnHostname = process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME; // Full CDN URL e.g., https://yourpullzone.b-cdn.net

      if (!storageZone || !accessKey || !cdnHostname) {
        console.error("Missing config:", { storageZone, accessKey: !!accessKey, cdnHostname });
        throw new Error("Bunny CDN configuration is missing");
      }

      // Storage API endpoint for upload (PUT request)
      // Always uses storage.bunnycdn.com for uploads
      const uploadUrl = `https://storage.bunnycdn.com/${storageZone}/vendor-profiles/${fileName}`;

      console.log("Uploading to:", uploadUrl);

      // Upload the file
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          AccessKey: accessKey,
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Bunny upload failed:", response.status, errorText);
        throw new Error(`Upload failed: ${response.status}`);
      }

      console.log("Upload successful");

      // Return the CDN URL for public access (this is what users will access)
      const publicUrl = `${cdnHostname}/vendor-profiles/${fileName}`;
      console.log("Public URL:", publicUrl);

      return publicUrl;
    } catch (error) {
      console.error("Bunny upload error:", error);
      throw new Error(error.message || "Failed to upload image");
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicturePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingProfile(true);
    setError("");

    try {
      const url = await uploadImageToBunny(file);
      setProfilePicture(url);
      setFormData((prev) => ({ ...prev, profilePicture: url }));
    } catch (err) {
      setError("Failed to upload profile picture. Please try again.");
      setProfilePicturePreview(null);
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingCover(true);
    setError("");

    try {
      const url = await uploadImageToBunny(file);
      setCoverImage(url);
      setFormData((prev) => ({ ...prev, coverImage: url }));
    } catch (err) {
      setError("Failed to upload cover image. Please try again.");
      setCoverImagePreview(null);
    } finally {
      setUploadingCover(false);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
    setFormData((prev) => ({ ...prev, profilePicture: "" }));
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
    setFormData((prev) => ({ ...prev, coverImage: "" }));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(vendorProfileUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const validateStep = () => {
    if (currentStep === 2) {
      if (!formData.vendorBusinessName || !formData.vendorName || !formData.category) {
        setError("Please fill all required fields");
        return false;
      }
      if (!profilePicture) {
        setError("Profile picture is required");
        return false;
      }
    }
    if (currentStep === 3) {
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setError("");
      return;
    }

    if (validateStep()) {
      if (currentStep === 2) {
      }

      if (currentStep === 3) {
        setShowPasswordModal(true);
        setAdminPassword("");
        setPasswordError("");
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setError("");
    }
  };

  const handlePasswordVerification = () => {
    if (!adminPassword) {
      setPasswordError("Password is required");
      return;
    }

    setVerifying(true);
    setPasswordError("");

    const ADMIN_PASSWORD = "vendorProfile@add@planwab@8086";

    setTimeout(() => {
      if (adminPassword === ADMIN_PASSWORD) {
        setShowPasswordModal(false);
        setAdminPassword("");
        setVerifying(false);
        handleSubmit();
      } else {
        setPasswordError("Incorrect password");
        setTimeout(() => {
          setShowPasswordModal(false);
          setAdminPassword("");
          setPasswordError("");
          setError("Authorization failed - Profile creation cancelled");
          setVerifying(false);
        }, 1500);
      }
    }, 800);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        vendorBusinessName: formData.vendorBusinessName,
        username: formData.username,
        vendorName: formData.vendorName,
        category: formData.category,
        bio: formData.bio || "",
        vendorAvatar: profilePicture,
        vendorCoverImage: coverImage || "",
        location: formData.location,
        password: formData.password,
      };

      const response = await fetch(`/api/vendor/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Get response as text first to handle empty/invalid JSON
      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("Failed to parse response:", text);
        throw new Error("Invalid response from server. Please try again.");
      }

      if (!response.ok) {
        throw new Error(data.message || `Server error (${response.status}). Please try again.`);
      }

      if (data.token) {
        localStorage.setItem("vendorToken", data.token);
      }

      setCreatedProfile(data.data);
      setCurrentStep(4);
    } catch (err) {
      console.error("Profile creation error:", err);
      setError(err.message || "Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Welcome", icon: Sparkles },
    { number: 2, title: "Profile Info", icon: User },
    { number: 3, title: "Security", icon: Shield },
    { number: 4, title: "Complete", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Create Vendor Profile</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {"New Vendor"} • Step {currentStep} of 4
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Draft</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative">
            <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 rounded-full">
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
              />
            </div>

            <div className="relative flex items-start justify-between">
              {steps.map((step, idx) => {
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div key={step.number} className="flex flex-col items-center" style={{ width: "80px" }}>
                    <motion.div
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative z-10"
                    >
                      <motion.div
                        animate={{
                          backgroundColor: isCompleted
                            ? "rgb(34, 197, 94)"
                            : isActive
                              ? "rgb(59, 130, 246)"
                              : "rgb(241, 245, 249)",
                          boxShadow: isActive
                            ? "0 0 0 4px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(59, 130, 246, 0.3)"
                            : "0 2px 4px rgba(0, 0, 0, 0.05)",
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900"
                      >
                        {isCompleted ? (
                          <Check size={20} className="text-white" strokeWidth={3} />
                        ) : (
                          <step.icon
                            size={18}
                            className={isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}
                          />
                        )}
                      </motion.div>
                    </motion.div>

                    <span
                      className={`mt-2 text-xs font-medium text-center leading-tight ${
                        isActive || isCompleted
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Welcome Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 px-8 py-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                  >
                    <Store size={48} className="text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-3">Welcome to Your Vendor Journey!</h2>
                  <p className="text-blue-100 max-w-md mx-auto">
                    Let's set up your vendor profile to showcase your business and connect with customers
                  </p>
                </div>

                <div className="p-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">What you'll set up:</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { icon: Building2, title: "Business Identity", desc: "Your business name, category & branding" },
                      { icon: ImageIcon, title: "Visual Profile", desc: "Profile picture and cover image" },
                      { icon: MapPin, title: "Location Details", desc: "Where your business operates" },
                      { icon: Lock, title: "Secure Access", desc: "Password to protect your profile" },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                          <item.icon size={22} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Profile Info */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
                >
                  <X size={18} className="text-red-600 dark:text-red-400 shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Basic Info Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Building2 size={20} className="text-blue-600" />
                  Business Information
                </h3>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Business Name *</label>
                    <input
                      type="text"
                      name="vendorBusinessName"
                      value={formData.vendorBusinessName}
                      onChange={handleInputChange}
                      placeholder="Enter your business name"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username *</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Choose a username"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Name *</label>
                    <input
                      type="text"
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      placeholder="Enter contact person name"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Tag size={14} />
                      Category *
                    </label>

                    <div ref={categoryRef} className="relative">
                      <input
                        type="text"
                        value={categoryOpen ? categoryQuery : formData.category}
                        placeholder="Search & select category"
                        onFocus={() => {
                          setCategoryOpen(true);
                          setCategoryQuery("");
                        }}
                        onChange={(e) => {
                          setCategoryQuery(e.target.value);
                          setCategoryOpen(true);
                        }}
                        className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all text-sm pr-10 ${
                          categoryOpen
                            ? "border-blue-500 dark:border-blue-400"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      />

                      <ChevronDown
                        size={16}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${
                          categoryOpen ? "rotate-180" : ""
                        }`}
                      />

                      {categoryOpen && (
                        <div className="absolute z-50 mt-2 w-full max-h-56 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                          {filteredCategories.length === 0 && (
                            <div className="px-4 py-3 text-sm text-slate-500">No category found</div>
                          )}

                          {filteredCategories.map((item) => (
                            <div
                              key={item.key}
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, category: item.key }));
                                setCategoryQuery("");
                                setCategoryOpen(false);
                              }}
                              className={`px-4 py-2.5 cursor-pointer text-sm flex items-center justify-between transition-colors ${
                                formData.category === item.key
                                  ? "bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                              }`}
                            >
                              <span>{item.label}</span>
                              {formData.category === item.key && <Check size={14} />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Images Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <ImageIcon size={20} className="text-purple-600" />
                  Profile Images
                </h3>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Profile Picture */}
                  <div className="space-y-3 p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800/50">
                    <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      Profile Picture *<span className="text-xs font-normal text-slate-500">(Required)</span>
                    </label>

                    {profilePicturePreview ? (
                      <div className="relative">
                        <div className="relative w-full aspect-square max-w-[180px] mx-auto rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                          <img src={profilePicturePreview} alt="Profile" className="w-full h-full object-cover" />
                          {uploadingProfile && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                              <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        {!uploadingProfile && (
                          <div className="flex gap-2 mt-3">
                            <label className="flex-1 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium text-xs cursor-pointer flex items-center justify-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-700">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                className="hidden"
                              />
                              Change
                            </label>
                            <button
                              onClick={removeProfilePicture}
                              className="flex-1 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 font-medium text-xs hover:bg-red-100"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <label className="block w-full aspect-square max-w-[180px] mx-auto rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer transition-all">
                        <input type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
                        <div className="h-full flex flex-col items-center justify-center p-4">
                          <Store size={32} className="text-purple-500 mb-2" />
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">
                            Upload Profile Picture
                          </p>
                        </div>
                      </label>
                    )}
                  </div>

                  {/* Cover Image */}
                  <div className="space-y-3 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800/50">
                    <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      Cover Image
                      <span className="text-xs font-normal text-slate-500">(Optional)</span>
                    </label>

                    {coverImagePreview ? (
                      <div className="relative">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                          <img src={coverImagePreview} alt="Cover" className="w-full h-full object-cover" />
                          {uploadingCover && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                              <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        {!uploadingCover && (
                          <div className="flex gap-2 mt-3">
                            <label className="flex-1 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium text-xs cursor-pointer flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverImageChange}
                                className="hidden"
                              />
                              Change
                            </label>
                            <button
                              onClick={removeCoverImage}
                              className="flex-1 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 font-medium text-xs hover:bg-red-100"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer transition-all">
                        <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" />
                        <div className="h-full flex flex-col items-center justify-center p-4">
                          <MapPin size={32} className="text-blue-500 mb-2" />
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">
                            Upload Cover Image
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-indigo-600" />
                  About Your Business
                </h3>

                <div className="rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <ReactQuill
                    theme="snow"
                    value={formData.bio}
                    onChange={(content, delta, source, editor) => {
                      const plainText = editor.getText().trim();
                      if (plainText.length <= 1000) {
                        setFormData((prev) => ({ ...prev, bio: content }));
                      }
                    }}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Tell customers about your business, services, and what makes you unique..."
                    className="custom-quill-editor"
                  />
                </div>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-slate-500">Rich text formatting supported</span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      (formData.bio?.replace(/<[^>]*>/g, "").trim().length || 0) > 900
                        ? "bg-red-100 text-red-600"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {formData.bio?.replace(/<[^>]*>/g, "").trim().length || 0}/1000
                  </span>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-green-600" />
                  Location (Optional)
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none text-sm"
                  />
                  <input
                    type="text"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none text-sm"
                  />
                  <input
                    type="text"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    className="px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none text-sm"
                  />
                  <input
                    type="text"
                    name="location.zipCode"
                    value={formData.location.zipCode}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                    className="px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Security */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
                >
                  <X size={18} className="text-red-600 dark:text-red-400 shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 px-6 py-8 text-center border-b border-slate-200 dark:border-slate-800">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/30">
                    <Shield size={40} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Secure Your Profile</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                    Create a password to protect your vendor profile. You'll need this to manage content and settings.
                  </p>
                </div>

                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Lock size={16} />
                      Create Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password (min. 6 characters)"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-500 dark:focus:border-amber-400 outline-none transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Lock size={16} />
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Re-enter your password"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-500 dark:focus:border-amber-400 outline-none transition-colors text-sm"
                    />
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                      🔒 <strong>Important:</strong> Keep this password safe! You'll need it to upload content, edit
                      your profile, and manage your vendor settings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Preview */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Profile Preview</h3>

                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  {profilePicturePreview ? (
                    <img src={profilePicturePreview} alt="Profile" className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <Store size={24} className="text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate">
                      {formData.vendorBusinessName || "Business Name"}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      @{formData.username || "username"} • {formData.category || "Category"}
                    </p>
                    {formData.location.city && (
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        {formData.location.city}, {formData.location.state}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 px-8 py-16 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                  >
                    <CheckCircle size={56} className="text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-3">Profile Created Successfully!</h2>
                  <p className="text-green-100 max-w-md mx-auto">
                    Your vendor profile is now live and ready to showcase your business
                  </p>
                </div>

                <div className="p-8 space-y-6">
                  {/* Quick Actions */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Link
                      href={`/vendor/${formData?.category}/profile/${formData?.username}?upload=true`}
                      className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg">
                        <ImageIcon size={22} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Add Content</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Upload photos & videos</p>
                      </div>
                    </Link>
                    <Link
                      href={`/vendor/${formData?.category}/profile/${formData?.username}`}
                      className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      {" "}
                      <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg">
                        {" "}
                        <View size={22} className="text-white" />{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        <h4 className="font-bold text-slate-900 dark:text-white">See Profile</h4>{" "}
                        <p className="text-xs text-slate-600 dark:text-slate-400">Browse your live profile</p>{" "}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      {currentStep < 4 && (
        <div className="sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              {currentStep > 1 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={18} />
                  Back
                </motion.button>
              ) : (
                <div />
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={loading || uploadingProfile || uploadingCover}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {currentStep === 3 ? "Create Profile" : "Continue"}
                    <ChevronRight size={18} />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => !verifying && setShowPasswordModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Lock size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Admin Authorization</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Confirm to create profile</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 space-y-4">
                {passwordError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
                  >
                    <X size={16} className="text-red-600 dark:text-red-400" />
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">{passwordError}</p>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Lock size={16} />
                    Admin Password
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setPasswordError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !verifying) {
                        handlePasswordVerification();
                      }
                    }}
                    placeholder="Enter admin password"
                    disabled={verifying}
                    autoFocus
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-500 outline-none text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setAdminPassword("");
                    setPasswordError("");
                  }}
                  disabled={verifying}
                  className="flex-1 px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordVerification}
                  disabled={verifying || !adminPassword}
                  className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Confirm
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorProfileOnboardingPageWrapper;
