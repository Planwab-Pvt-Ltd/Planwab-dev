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
    vendorId: "",
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

  const [vendorProfileUrl, setVendorProfileUrl] = useState("");

  const filteredCategories = categoryQuery
    ? categories.filter((c) => c.label.toLowerCase().includes(categoryQuery.toLowerCase()))
    : categories;

  useEffect(() => {
    if (typeof window !== "undefined" && formData.vendorId) {
      setVendorProfileUrl(`${window.location.origin}/vendor/${formData.vendorId}`);
    } else if (formData.vendorId) {
      setVendorProfileUrl(`/vendor/${formData.vendorId}`);
    } else {
      setVendorProfileUrl("");
    }
  }, [formData.vendorId]);

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
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "planWab_vendors");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );
    const result = await response.json();
    if (!result.secure_url) throw new Error("Upload failed");
    return result.secure_url;
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfilePicturePreview(reader.result);
    reader.readAsDataURL(file);
    setUploadingProfile(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setProfilePicture(url);
      setFormData((prev) => ({ ...prev, profilePicture: url }));
    } catch (err) {
      setError("Upload failed");
      setProfilePicturePreview(null);
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCoverImagePreview(reader.result);
    reader.readAsDataURL(file);
    setUploadingCover(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setCoverImage(url);
      setFormData((prev) => ({ ...prev, coverImage: url }));
    } catch (err) {
      setError("Upload failed");
      setCoverImagePreview(null);
    } finally {
      setUploadingCover(false);
    }
  };

  const validateStep = () => {
    if (currentStep === 2) {
      if (!formData.vendorBusinessName || !formData.vendorName || !formData.category || !formData.vendorId) {
        setError("Please fill all required fields and enter Vendor ID");
        return false;
      }
    }
    if (currentStep === 3) {
      if (formData.password.length < 6 || formData.password !== formData.confirmPassword) {
        setError("Please verify password requirements");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    if (validateStep()) {
      if (currentStep === 3) {
        setShowPasswordModal(true);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...formData, vendorAvatar: profilePicture, vendorCoverImage: coverImage };
      const response = await fetch(`/api/vendor/${formData.vendorId}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create profile");
      setCreatedProfile(data.data);
      setCurrentStep(4);
    } catch (err) {
      setError(err.message);
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => router.back()} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight">VENDOR ONBOARDING</h1>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Step {currentStep} of 4</p>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            {steps.map((s) => (
              <div key={s.number} className={`h-1.5 rounded-full transition-all duration-500 ${s.number <= currentStep ? "w-10 bg-blue-600" : "w-4 bg-slate-200 dark:bg-slate-700"}`} />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 pb-32">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex p-4 rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-200">
                  <Store size={48} />
                </div>
                <h2 className="text-5xl font-black leading-tight">Grow your business with PlanWAB.</h2>
                <p className="text-xl text-slate-500 leading-relaxed">Setup your professional profile in minutes and start reaching thousands of customers looking for wedding services.</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: ImageIcon, text: "Visual Showcase" },
                    { icon: Shield, text: "Verified Profile" },
                    { icon: Globe, text: "Public URL" },
                    { icon: Lock, text: "Secure Access" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <item.icon className="text-blue-600" size={20} />
                      <span className="font-bold text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 dark:border-slate-800">
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl mb-6">
                  <h4 className="font-bold mb-2">Public Identity Preview</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 w-3/4 rounded animate-pulse" />
                      <div className="h-3 bg-slate-200 w-1/2 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
                <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                  GET STARTED
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
                    <h3 className="text-xl font-black flex items-center gap-3"><Building2 className="text-blue-600" /> Identity Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400">Vendor ID (From URL) *</label>
                        <input name="vendorId" value={formData.vendorId} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-blue-600 focus:bg-white transition-all outline-none font-mono text-sm" placeholder="Paste ID here" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400">Business Name *</label>
                        <input name="vendorBusinessName" value={formData.vendorBusinessName} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-blue-600 focus:bg-white transition-all outline-none" placeholder="e.g. Royal Photographers" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400">Username *</label>
                        <input name="username" value={formData.username} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-blue-600 focus:bg-white transition-all outline-none" placeholder="unique_handle" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400">Category *</label>
                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-blue-600 focus:bg-white transition-all outline-none appearance-none">
                          <option value="">Select Category</option>
                          {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3"><Sparkles className="text-indigo-600" /> Business Bio</h3>
                    <div className="rounded-2xl overflow-hidden border-2 border-slate-100 focus-within:border-blue-600 transition-all">
                      <ReactQuill theme="snow" value={formData.bio} onChange={(val) => setFormData(p => ({ ...p, bio: val }))} modules={quillModules} className="bg-white h-48" />
                    </div>
                  </div>
                </div>

                <div className="md:w-96 space-y-6">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                    <label className="text-xs font-black uppercase text-slate-400 block mb-4">Profile Photo *</label>
                    <div className="relative inline-block group">
                      <div className="w-40 h-40 rounded-[32px] bg-slate-100 overflow-hidden border-4 border-white shadow-xl">
                        {profilePicturePreview ? <img src={profilePicturePreview} className="w-full h-full object-cover" /> : <User className="w-full h-full p-10 text-slate-300" />}
                      </div>
                      <input type="file" onChange={handleProfilePictureChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform"><ImageIcon size={20} /></div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <label className="text-xs font-black uppercase text-slate-400 block mb-4">Cover Image</label>
                    <div className="relative aspect-video rounded-2xl bg-slate-100 overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
                       {coverImagePreview ? <img src={coverImagePreview} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-300" size={32} />}
                       <input type="file" onChange={handleCoverImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto space-y-8 text-center">
              <div className="inline-flex p-6 rounded-[32px] bg-amber-500 text-white shadow-2xl shadow-amber-200 mb-4">
                <Shield size={64} />
              </div>
              <h2 className="text-4xl font-black">Protect Your Profile</h2>
              <p className="text-slate-500">Create a secure password for your vendor dashboard access.</p>
              
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Dashboard Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-blue-600 focus:bg-white transition-all outline-none" placeholder="At least 6 characters" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-blue-600 focus:bg-white transition-all outline-none" />
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 text-blue-700 text-sm font-medium">
                  Note: You will use this password to login to your vendor profile and upload portfolio items.
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center space-y-12">
              <div className="bg-white dark:bg-slate-900 p-16 rounded-[60px] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600" />
                <div className="inline-flex p-8 rounded-full bg-green-100 text-green-600 mb-8">
                  <CheckCircle size={80} />
                </div>
                <h2 className="text-5xl font-black mb-4">You're all set!</h2>
                <p className="text-xl text-slate-500 mb-12">Your profile is now live. Share the link below with your clients.</p>
                
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl flex items-center gap-4 border border-slate-100 mb-12">
                  <Globe className="text-slate-400" size={24} />
                  <span className="flex-1 font-mono text-lg text-slate-600 truncate">{vendorProfileUrl}</span>
                  <button onClick={copyToClipboard} className="px-8 py-4 bg-white dark:bg-slate-700 rounded-2xl font-black text-blue-600 shadow-sm hover:bg-blue-50 transition-all">
                    {linkCopied ? "COPIED" : "COPY LINK"}
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Link href={`/vendor/${formData.category}/${formData.vendorId}`} className="px-10 py-5 bg-black text-white rounded-2xl font-black shadow-xl hover:scale-105 transition-all">VIEW LIVE PROFILE</Link>
                  <Link href="/dashboard" className="px-10 py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 text-slate-900 dark:text-white rounded-2xl font-black shadow-sm hover:bg-slate-50 transition-all">GO TO DASHBOARD</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {currentStep < 4 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 py-6">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
            <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} className={`px-10 py-4 rounded-2xl font-black border-2 border-slate-100 dark:border-slate-700 transition-all ${currentStep === 1 ? "opacity-0 invisible" : "hover:bg-slate-50"}`}>
              BACK
            </button>
            <div className="flex items-center gap-8">
              {error && <span className="text-red-500 font-bold text-sm hidden md:block">{error}</span>}
              <button onClick={handleNext} disabled={uploadingProfile || uploadingCover || loading} className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                {currentStep === 3 ? "CREATE PROFILE" : "CONTINUE"} <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Admin Password Modal - Same logic, Desktop Optimized UI */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-2xl max-w-md w-full border border-slate-100">
               <h3 className="text-2xl font-black mb-2">Admin Security</h3>
               <p className="text-slate-500 mb-8 text-sm font-medium uppercase tracking-widest">Verify credentials to publish</p>
               <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 mb-6 outline-none focus:border-amber-500" placeholder="Admin Passcode" />
               <div className="flex gap-4">
                 <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                 <button onClick={() => {
                   if (adminPassword === "vendorProfile@add@planwab@8086") {
                     setShowPasswordModal(false);
                     handleSubmit();
                   } else {
                     toast.error("Incorrect Admin Password");
                   }
                 }} className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-black shadow-lg shadow-amber-100">CONFIRM</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorProfileOnboardingPageWrapper;