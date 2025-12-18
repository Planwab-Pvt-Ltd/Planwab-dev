"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import Image from "next/image";
import { PlayCircle, Image as ImageIcon, AlertCircle } from "lucide-react";

// --- HELPER: Fixes paths automatically ---
const getSafeSrc = (src) => {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("https")) return src;
  if (!src.startsWith("/")) return `/${src}`;
  return src;
};

const SmartMedia = memo(
  ({
    src,
    type = "image",
    alt = "Media content",
    className = "",
    poster = "",
    autoPlay = true,
    priority = false, // True for LCP (Hero images)
    objectFit = "cover", // 'cover' | 'contain'
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef(null);

    // Apply safe path fix
    const safeSrc = getSafeSrc(src);

    // --- VIDEO OPTIMIZATION: Play only when visible ---
    useEffect(() => {
      if (type !== "video" || !videoRef.current) return;

      // FIX: Check if video is ALREADY ready (e.g. from cache)
      if (videoRef.current.readyState >= 3) {
        setIsLoaded(true);
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && autoPlay) {
              // Promise handling prevents "The play() request was interrupted" errors
              const playPromise = videoRef.current?.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {});
              }
            } else {
              videoRef.current?.pause();
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(videoRef.current);
      return () => observer.disconnect();
    }, [type, autoPlay]);

    // --- STYLES ---
    const containerClass = `relative overflow-hidden bg-gray-200 ${className}`;
    const mediaClass = `duration-700 ease-out transition-all ${
      isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-lg"
    }`;

    return (
      <div className={containerClass}>
        {/* 1. DYNAMIC SHIMMER SKELETON */}
        {/* This overlay sits on top until the media is fully loaded. */}
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center bg-gray-200 transition-opacity duration-500 ${
            isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          aria-hidden="true"
        >
          {/* The Shimmer Animation Layer */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Subtle Type Icon (Centered) */}
          <div className="relative z-20 text-gray-400 opacity-40">
            {type === "video" ? <PlayCircle size={24} /> : <ImageIcon size={24} />}
          </div>
        </div>

        {/* 2. ERROR FALLBACK */}
        {hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
            <AlertCircle size={24} className="mb-1 opacity-50" />
            <span className="text-[10px] font-medium">Failed</span>
          </div>
        )}

        {/* 3. MEDIA RENDERER */}
        {type === "video" ? (
          <video
            ref={videoRef}
            src={safeSrc}
            className={`w-full h-full object-${objectFit} ${mediaClass}`}
            muted
            loop
            playsInline
            poster={poster}
            preload={priority ? "auto" : "metadata"}
            // FIX: Add onCanPlay for better reliability
            onCanPlay={() => setIsLoaded(true)}
            onLoadedData={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        ) : (
          <Image
            src={safeSrc}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className={`object-${objectFit} ${mediaClass}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            decoding="async"
          />
        )}

        {/* CSS Animation Keyframes (Global Scope for simplicity) */}
        <style jsx global>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    );
  }
);

SmartMedia.displayName = "SmartMedia";

export default SmartMedia;
