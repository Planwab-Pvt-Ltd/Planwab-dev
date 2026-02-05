"use client";

import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import SmartMedia from "@/components/mobile/SmartMediaLoader";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* --- 1. Central Video Graphic --- */}
      <div className="w-full max-w-lg aspect-square flex items-center justify-center mb-2">
        <SmartMedia
          src="/Loading/404NotFoundVideo.mp4"
          type="video"
          className="w-full h-full object-contain pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* --- 2. Text & Navigation --- */}
      <div className="text-center space-y-6 z-10">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Oops! Page Not Found</h2>
          <p className="text-gray-500 font-medium max-w-xs mx-auto">
            We couldn't find the page you were looking for. It might have been removed or renamed.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white rounded-full font-bold shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-300"
        >
          <Home size={20} strokeWidth={2.5} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
