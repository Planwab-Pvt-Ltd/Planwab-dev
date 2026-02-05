import React from "react";
// ReactDOM.preload is available in Next.js 14+ (React 18.3/19)
import ReactDOM from "react-dom";

export default function RawHeroMedia({ src, poster }) {
  // 1. PRELOAD (The Magic Trick)
  // This tells the browser: "Download this video NOW, don't wait for parsing."
  ReactDOM.preload(src, { as: "video" });
  if (poster) {
    ReactDOM.preload(poster, { as: "image" });
  }

  // 2. RAW HTML TAG
  // No wrappers, no state, no skeletons. Just the tag.
  return (
    <div className="relative w-full h-full bg-gray-200 overflow-hidden">
      <video
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        // 'metadata' is usually enough, but 'auto' ensures it starts ASAP for Hero
        preload="auto" 
        // fetchPriority (modern browsers) prioritizes this over other images
        fetchPriority="high"
      />
      
      {/* Optional: Dark gradient overlay baked in for text readability */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    </div>
  );
}