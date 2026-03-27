"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import Image from "next/image";
import { PlayCircle, Image as ImageIcon, AlertCircle } from "lucide-react";

// --- HELPER: Extract object-fit class ---
const extractObjectFit = (className = "") => {
  const objectFitMatch = className.match(/object-(cover|contain|fill|none|scale-down)/);
  return objectFitMatch ? objectFitMatch[1] : null;
};

const SmartMedia = memo(
  ({
    src,
    type = "image",
    alt = "Media content",
    className = "",
    style = {},
    poster = "",
    autoPlay = true,
    priority = false, // CRITICAL: If true, we skip lazy loading logic
    objectFit = "cover",
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    quality = 90,
    unoptimized = false,
    useSkeleton = true,
  }) => {
    // If priority is true, assume loaded immediately to prevent fade-in flash
    const [isLoaded, setIsLoaded] = useState(priority ? true : !useSkeleton);
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef(null);

    const safeSrc = src?.startsWith("/") || src?.startsWith("http") ? src : `/${src}`;
    const detectedObjectFit = extractObjectFit(className);
    const finalObjectFit = detectedObjectFit || objectFit;
    const cleanClassName = className.replace(/object-(cover|contain|fill|none|scale-down)\s?/g, "").trim();

    // --- VIDEO LOGIC ---
    useEffect(() => {
      if (type !== "video" || !videoRef.current) return;

      // If priority video, force play immediately
      if (priority && autoPlay) {
        videoRef.current.play().catch(() => {});
        setIsLoaded(true);
        return;
      }

      // Lazy load non-critical videos
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && autoPlay) {
              videoRef.current?.play().catch(() => {});
            } else {
              videoRef.current?.pause();
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(videoRef.current);
      return () => observer.disconnect();
    }, [type, autoPlay, priority]);

    const containerClass = `relative overflow-hidden bg-gray-100 ${cleanClassName}`;
    
    // REMOVED "opacity-0" for priority items to prevent flash
    const mediaClass = `transition-all duration-700 ease-out ${
      isLoaded || priority ? "opacity-100 scale-100" : "opacity-0 scale-105 blur-sm"
    }`;

    return (
      <div className={containerClass}>
        {/* SKELETON: Only show if NOT loaded and NOT priority */}
        {!isLoaded && !priority && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-200">
             <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
             <div className="relative z-20 text-gray-400 opacity-50">
                {type === "video" ? <PlayCircle /> : <ImageIcon />}
             </div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
            <AlertCircle size={24} />
          </div>
        )}

        {type === "video" ? (
          <video
            ref={videoRef}
            src={safeSrc}
            className={`w-full h-full object-${finalObjectFit} ${mediaClass}`}
            style={style}
            muted
            loop
            playsInline
            poster={poster} // CRITICAL: You MUST provide this prop
            autoPlay={autoPlay}
            // "metadata" is faster than "auto" for non-hero videos
            preload={priority ? "auto" : "metadata"}
            onLoadedData={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        ) : (
          <Image
            src={safeSrc}
            alt={alt}
            fill
            sizes={sizes}
            quality={quality}
            unoptimized={unoptimized}
            priority={priority}
            className={`object-${finalObjectFit} ${mediaClass}`}
            style={style}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            decoding={priority ? "sync" : "async"}
          />
        )}
      </div>
    );
  }
);

SmartMedia.displayName = "SmartMedia";
export default SmartMedia;