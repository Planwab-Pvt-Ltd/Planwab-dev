"use client";

import { SignUp, useSignUp } from "@clerk/nextjs";
import React from "react";
import { motion } from "framer-motion";
import AuthPromo from "@/components/desktop/AuthPromo";
import Image from "next/image"; // Import for logo
import Link from "next/link";
import { X } from "lucide-react";

const SignUpPageWrapper = () => {
  const { isLoaded } = useSignUp();

  return (
    <main className="min-h-screen relative overflow-hidden bg-white dark:bg-black">
      {/* ----------------------------------------------------------------------- */}
      {/* 1. DESKTOP VIEW (Visible only on Large screens)                         */}
      {/* Logic: 'hidden lg:block' keeps this completely invisible on mobile      */}
      {/* ----------------------------------------------------------------------- */}
      <div className="hidden lg:block h-full w-full">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px, 30px 30px, 25px 25px",
            backgroundPosition: "0 0, 10px 10px, 15px 5px",
          }}
        />

        <svg className="absolute w-0 h-0">
          <defs>
            <clipPath id="shatterClip" clipPathUnits="objectBoundingBox">
              <path d="M 0 0 L 0.93 0 C 0.94 0.1, 0.9 0.15, 0.95 0.2 C 0.92 0.28, 0.97 0.35, 0.93 0.4 C 0.96 0.48, 0.92 0.53, 0.98 0.6 C 0.94 0.68, 0.99 0.75, 0.92 0.8 C 0.97 0.88, 0.93 0.95, 1 1 L 0 1 Z" />
            </clipPath>
          </defs>
        </svg>

        <div className="flex min-h-screen">
          <AuthPromo pageType="sign-up" />

          <div className="w-full lg:w-1/2 lg:ml-[50%] flex flex-col h-full min-h-screen overflow-y-auto">
            <div className="flex-1 flex items-center justify-center p-6 md:p-8">
              <div className="w-full max-w-sm xl:max-w-md mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="w-full"
                >
                  {!isLoaded ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <SignUp />
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* 2. MOBILE VIEW (Visible only on Mobile/Tablet)                          */}
      {/* Logic: 'block lg:hidden' renders this separate HTML on small devices    */}
      {/* ----------------------------------------------------------------------- */}
      <div className="block lg:hidden min-h-screen relative">
        {/* Mobile Background: Consistent with Sign In Page */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-white to-fuchsia-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950/30 z-0" />

        {/* Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-pink-300/30 dark:bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col min-h-screen p-6 justify-between">
          <Link
            href="/m"
            className="absolute top-6 right-6 z-50 p-2.5 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-full text-gray-600 dark:text-gray-300 shadow-sm active:scale-95 transition-all hover:bg-white/60 dark:hover:bg-black/60"
          >
            <X size={20} strokeWidth={2.5} />
          </Link>
          {/* Mobile Header / Branding */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center pt-10 pb-4"
          >
            {/* Logo Container */}
            <div className="relative w-16 h-16 mb-5 rounded-2xl bg-white dark:bg-gray-800 shadow-lg shadow-violet-200/50 dark:shadow-none flex items-center justify-center p-3 ring-1 ring-gray-100 dark:ring-gray-700">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 opacity-10 blur-md dark:opacity-20"></div>
              <Image
                src="/planwablogo.png"
                alt="PlanWAB Logo"
                width={60}
                height={60}
                className="object-contain relative z-10"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 tracking-tight">
              Create Account
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300 mt-2 font-medium">Join PlanWAB today</p>
          </motion.div>

          {/* Mobile Auth Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center justify-start w-full pt-4"
          >
            <div className="w-full max-w-sm">
              {!isLoaded ? (
                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center min-h-[300px] border border-white/50 dark:border-gray-800/50">
                  <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
                </div>
              ) : (
                // Clerk SignUp Component
                <div className="signin-wrapper-mobile">
                  <SignUp
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-none bg-transparent w-full p-0",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        // Consistent styling with Sign In
                        formFieldInput:
                          "rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900/50 focus:ring-2 focus:ring-violet-500 py-3 text-base",
                        formButtonPrimary:
                          "rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 py-3 text-base font-semibold shadow-md shadow-violet-500/20",
                        footer: "hidden",
                        formFieldLabel: "text-gray-700 dark:text-gray-300 font-medium ml-1",
                        identityPreviewText: "text-gray-700 dark:text-gray-300 text-base",
                        identityPreviewEditButtonIcon: "text-violet-500",
                        formResendCodeLink: "text-violet-600 dark:text-violet-400 font-medium",
                        otpCodeFieldInput: "!rounded-xl border-gray-200 dark:border-gray-700 !text-lg",
                      },
                      layout: {
                        shimmer: false,
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Mobile Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="py-4 text-center pb-8"
          >
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">© 2025 PlanWAB. All rights reserved.</p>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default SignUpPageWrapper;
