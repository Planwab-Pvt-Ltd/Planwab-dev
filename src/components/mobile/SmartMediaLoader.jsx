"use client";

import React, { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, PlayCircle, AlertCircle } from "lucide-react";

const SmartMedia = ({
  src,
  type = "image",
  alt = "Media content",
  className = "",
  poster = "",
  autoPlay = true,
  loaderImage = "",
  width,
  height,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Refs to access the actual DOM elements for cache checking
  const imgRef = useRef(null);
  const videoRef = useRef(null);

  // --- EFFECT: Check if media is ALREADY loaded (Cached) ---
  useEffect(() => {
    if (!src) return;

    if (type === "image" && imgRef.current) {
      // If image is already complete (cached), set loaded immediately
      if (imgRef.current.complete) {
        if (imgRef.current.naturalWidth > 0) {
          setIsLoaded(true);
        } else {
          // If complete but 0 width, it failed (e.g. broken link)
          setHasError(true);
        }
      }
    } else if (type === "video" && videoRef.current) {
      // readyState 3 means HAVE_FUTURE_DATA (enough to start playing)
      if (videoRef.current.readyState >= 3) {
        setIsLoaded(true);
      }
    }
  }, [src, type]);

  // Transition styles
  const transitionStyles = `transition-all duration-700 ease-out ${type === "video" && "w-full h-full object-cover"} ${
    isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
  }`;

  // Helper to handle load events safely
  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    setIsLoaded(false); // Stop loading spinner
    setHasError(true);
  };

  // --- RENDER ---
  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {/* 1. LOADER (Shown if not loaded AND no error) */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50">
          {loaderImage ? (
            <img
              src={loaderImage}
              alt="Loading..."
              className="w-16 h-16 object-contain animate-pulse" // Adjusted size for generic use
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              <div className="text-gray-300 opacity-40">
                {type === "video" ? <PlayCircle size={32} /> : <ImageIcon size={32} />}
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. ERROR STATE */}
      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <AlertCircle size={24} className="mb-1 opacity-50" />
          <span className="text-[10px] font-medium">Failed to load</span>
        </div>
      )}

      {/* 3. MEDIA CONTENT */}
      {type === "video" ? (
        <video
          ref={videoRef}
          src={src}
          className={transitionStyles}
          autoPlay={autoPlay}
          muted
          loop
          playsInline
          poster={poster}
          // Multiple events to catch "ready" state
          onLoadedData={handleLoad}
          onCanPlay={handleLoad}
          onError={handleError}
        />
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={className ? `${className} ${transitionStyles}` : transitionStyles}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

export default SmartMedia;
