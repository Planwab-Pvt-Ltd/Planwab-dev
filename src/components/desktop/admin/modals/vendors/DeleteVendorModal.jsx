// components/modals/vendors/DeleteVendorModal.jsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Trash2, AlertTriangle, Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

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

export default function DeleteVendorModal({ vendor, onClose, onConfirm }) {
  const [step, setStep] = useState(1); // 1: Initial warning, 2: Type vendor name, 3: Enter password
  const [confirmName, setConfirmName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!vendor) return null;

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (confirmName.toLowerCase() === vendor.name.toLowerCase()) {
        setStep(3);
        setError("");
      } else {
        setError("Vendor name doesn't match. Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    if (!password) {
      setError("Please enter admin password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/vendor?id=${vendor._id}&password=${encodeURIComponent(password)}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError("Invalid admin password");
        } else {
          setError(result.message || "Failed to delete vendor");
        }
        return;
      }

      onConfirm?.();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-700 dark:text-red-400">Delete Vendor</h2>
              <p className="text-sm text-red-600 dark:text-red-400/80">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= s ? "bg-red-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                {step > s ? <CheckCircle size={16} /> : s}
              </div>
            ))}
          </div>

          {/* Vendor Info Card */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6">
            <Image
              src={vendor.defaultImage || vendor.images?.[0] || "/placeholder-vendor.jpg"}
              alt={vendor.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">{vendor.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{vendor.username}</p>
            </div>
          </div>

          {/* Step 1: Warning */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Warning</p>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    You are about to permanently delete this vendor and all associated data. This includes:
                  </p>
                  <ul className="mt-2 text-sm text-amber-700 dark:text-amber-400 space-y-1">
                    <li>• All vendor information and settings</li>
                    <li>• All uploaded images and media</li>
                    <li>• All packages and pricing data</li>
                    <li>• All reviews and ratings</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Confirm Name */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-center">
                To confirm deletion, please type the vendor name:
              </p>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                <code className="font-bold text-gray-900 dark:text-white">{vendor.name}</code>
              </div>
              <input
                type="text"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder="Type vendor name here..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                autoFocus
              />
            </div>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 justify-center mb-4">
                <Lock size={24} className="text-red-600" />
                <p className="font-semibold text-gray-900 dark:text-white">Admin Authentication Required</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Enter the admin password to permanently delete this vendor
              </p>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => {
                setStep(step - 1);
                setError("");
              }}
              disabled={isLoading}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          {step < 3 ? (
            <button
              onClick={handleNextStep}
              disabled={step === 2 && !confirmName}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleDelete}
              disabled={!password || isLoading}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={18} />
                  Delete Permanently
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
