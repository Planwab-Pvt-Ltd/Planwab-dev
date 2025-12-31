import React, { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Mail, Phone, MapPin, Briefcase, User, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useNavbarVisibilityStore } from "../../../GlobalState/navbarVisibilityStore";

// Mock SmartMedia component for demo
const SmartMedia = ({ src, alt, className, loading, priority }) => (
  <img src={src} alt={alt} className={className} loading={loading} />
);

const BASE_URL = "https://www.theweddingcompany.com";

export const VendorOnboardingDrawer = ({ isOpen, onClose, haptic }) => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    serviceType: "",
    city: "",
    experience: "",
  });

  // Professional Lock: Prevents the background from scrolling/bouncing while drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // Prevents pull-to-refresh
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "unset";
    };
  }, [isOpen]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with Blur - High Production Quality */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[9998]"
            onClick={onClose}
          />

          {/* Real Bottom Sheet Logic */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            drag="y" // Enable drag to dismiss
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 150) onClose(); // Close if dragged down far enough
            }}
            className="fixed bottom-0 left-0 right-0 bg-gray-50 rounded-t-[32px] z-[9999] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden"
            style={{ height: "92dvh" }} // Dynamic Viewport Height
          >
            {/* The "Handle" - Indicates it can be dragged */}
            <div className="w-full flex justify-center py-4 shrink-0 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Fixed Header */}
            <div className="px-6 pb-4 flex items-center justify-between border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Partner with Us</h2>
                <p className="text-sm text-gray-500 font-medium">Start receiving qualified leads today</p>
              </div>
              <button onClick={onClose} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Scrollable Body - Ensures content never goes "below screen" */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-40">
              <section className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Details</label>
                <div className="space-y-3">
                  <div className="relative group">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C33765] transition-colors"
                    />
                    <input
                      name="name"
                      onChange={handleChange}
                      placeholder="Full Name *"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#C33765]/20 focus:border-[#C33765] transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C33765] transition-colors"
                    />
                    <input
                      name="email"
                      type="email"
                      onChange={handleChange}
                      placeholder="Business Email *"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#C33765]/20 focus:border-[#C33765] transition-all"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Business Info</label>
                <div className="space-y-3">
                  <div className="relative group">
                    <Briefcase
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C33765] transition-colors"
                    />
                    <input
                      name="businessName"
                      onChange={handleChange}
                      placeholder="Brand Name *"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#C33765]/20 focus:border-[#C33765] transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      name="serviceType"
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#C33765]/20 appearance-none text-gray-600"
                    >
                      <option>Category *</option>
                      <option>Photographer</option>
                      <option>Venue</option>
                    </select>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        name="city"
                        onChange={handleChange}
                        placeholder="City *"
                        className="w-full pl-10 pr-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#C33765]/20"
                      />
                    </div>
                  </div>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Tell us about your services..."
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#C33765]/20 resize-none"
                  />
                </div>
              </section>
            </div>

            {/* Sticky Professional Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  haptic?.("success"); /* logic */
                }}
                className="w-full bg-[#C33765] text-white py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
              >
                Complete Registration
                <ChevronRight size={20} />
              </motion.button>
              {/* iOS Home Indicator Spacer */}
              <div className="h-4" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const AreYouAVendorSection = ({ haptic, setIsDrawerOpen }) => {
  const { setIsNavbarVisible } = useNavbarVisibilityStore();

  return (
    <>
      <section
        className="relative overflow-x-hidden px-3 pt-2 md:px-0 md:py-12 !z-10 bg-white pb-12"
        id="are_you_a_vendor_section"
      >
        {/* Background Pattern Left - Decorative */}
        <div className="absolute left-0 top-10 z-0 w-[200px] -translate-x-1/2 md:w-[400px] pointer-events-none">
          <SmartMedia
            src={`${BASE_URL}/images/HomePage/new/big-mandala.webp`}
            type="image"
            alt="" // Empty alt for decorative images
            className="aspect-square w-full h-full opacity-50"
            width={400}
            height={400}
            loading="lazy"
          />
        </div>

        {/* Background Pattern Right - Decorative */}
        <div className="absolute right-0 top-10 z-0 w-[200px] translate-x-1/2 md:w-[400px] pointer-events-none">
          <SmartMedia
            src={`${BASE_URL}/images/HomePage/new/big-mandala.webp`}
            type="image"
            alt=""
            className="aspect-square w-full h-full opacity-50"
            width={400}
            height={400}
            loading="lazy"
          />
        </div>

        <div className="relative z-10 mx-auto grid max-w-screen-lg grid-cols-2 gap-6 md:gap-y-16">
          {/* Left Column: Text & CTA */}
          <div className="col-span-full flex flex-col items-center justify-center gap-y-4 pt-10 md:col-span-1 md:items-start md:justify-start md:gap-y-8">
            <p className="font-serif text-3xl font-semibold md:text-5xl text-gray-900 text-center md:text-left">
              Are you a vendor?
            </p>
            <p className="whitespace-pre-wrap text-center text-base text-gray-600 md:text-start md:text-xl leading-relaxed">
              Want to list your venue or wedding services
              <span className="hidden lg:inline">{"\n"}</span>
              here? Join us today!
            </p>

            <button
              onClick={() => {
                haptic("medium");
                setIsDrawerOpen(true);
                setIsNavbarVisible(false);
              }}
              className="group flex w-max items-center gap-x-2 rounded-2xl border-2 border-[#C33765] px-10 py-3 text-lg font-bold text-[#C33765] transition-all hover:bg-[#C33765] hover:text-white md:px-12 md:text-xl active:scale-95 cursor-pointer"
              id="hp-join-vendor"
              aria-label="Join us as a vendor"
            >
              <span>Join us</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
          </div>

          {/* Right Column: Image Composition */}
          {/* Hidden on mobile to save bandwidth/rendering cost */}
          <div className="col-span-full hidden md:col-span-1 md:block">
            <div className="flex h-full items-center justify-center md:py-10 pr-0">
              <div className="relative h-[280px] w-[400px]">
                {/* Main Center Image */}
                <div className="absolute inset-0 z-10">
                  <SmartMedia
                    alt="Wedding Vendor Main"
                    src={`${BASE_URL}/images/HomePage/new/vendor-1.webp`}
                    type="image"
                    className="rounded-2xl object-cover w-full h-full shadow-lg"
                    loaderImage="/GlowLoadingGif.gif"
                    width={400}
                    height={280}
                    loading="lazy"
                  />
                </div>

                {/* Top Left Floating Image */}
                <div className="absolute -left-8 -top-8 z-20 w-[170px] h-[170px]">
                  <div className="relative w-full h-full rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                    <SmartMedia
                      alt="Wedding Vendor Detail 1"
                      src={`${BASE_URL}/images/HomePage/new/vendor-2.webp`}
                      type="image"
                      className="object-cover w-full h-full"
                      width={170}
                      height={170}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Bottom Right Floating Image */}
                <div className="absolute -bottom-14 -right-10 z-20 w-[220px] h-[220px]">
                  <div className="relative w-full h-full rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                    <SmartMedia
                      alt="Wedding Vendor Detail 2"
                      src={`${BASE_URL}/images/HomePage/new/vendor-3.webp`}
                      type="image"
                      className="object-cover w-full h-full"
                      width={220}
                      height={220}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Static Banner 2 - High Priority */}
        <div className="mx-1 mt-3 px-2 mb-6">
          <Link href={`/m/vendors/explore/wedding`}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => haptic("medium")}
              className="w-full aspect-[1/1.1] relative rounded-xl overflow-hidden"
            >
              <SmartMedia
                src={`/Banners/banner5.gif`}
                type="image"
                className="w-full h-full object-cover object-center"
                loaderImage="/GlowLoadingGif.gif"
                priority={true}
              />
            </motion.div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default memo(AreYouAVendorSection);
