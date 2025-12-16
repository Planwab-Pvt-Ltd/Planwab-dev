"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlanWABLoader({ videoSrc = "", onComplete = () => {} }) {
  // PHASES: 'intro' (video) -> 'locked' (video fades) -> 'opening' (doors swing) -> 'complete'
  const [phase, setPhase] = useState("intro");

  // 1. Handle Video End
  const handleVideoComplete = () => {
    if (phase === "intro") setPhase("locked");
  };

  // 2. Fallback Timer (max 4.5s)
  useEffect(() => {
    if (phase === "intro") {
      const timer = setTimeout(() => handleVideoComplete(), 4500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // 3. Trigger Door Opening Sequence
  useEffect(() => {
    if (phase === "locked") {
      // Short pause after video fades to let user see the closed doors momentarily
      const t = setTimeout(() => setPhase("opening"), 500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === "complete") return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden pointer-events-none"
      // CRITICAL: Perspective creates the 3D depth for the swing effect
      style={{ perspective: "1500px" }}
    >
      {/* --- LAYER 1: WHITE INTRO OVERLAY (Top) --- */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white pointer-events-auto"
          >
            {videoSrc ? (
              <video
                src={videoSrc}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoComplete}
                className="w-full max-w-lg object-contain max-h-[80vh]"
              />
            ) : (
              <h1 className="text-4xl font-bold text-blue-900 animate-pulse">PlanWAB</h1>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LAYER 2: 3D SWINGING DOORS --- */}

      {/* LEFT DOOR */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={phase === "opening" ? { rotateY: -110 } : { rotateY: 0 }}
        transition={{
          duration: 2.2,
          ease: [0.16, 1, 0.3, 1], // "Heavy Door" easing (starts fast, slows down)
        }}
        // origin-left puts the "hinge" on the left edge of the screen
        className="absolute top-0 left-0 w-1/2 h-full z-40 origin-left border-r border-slate-700 bg-[#020617]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Door Design / Texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-950 opacity-100">
          {/* Inner panel highlight for realism */}
          <div className="absolute top-[10%] bottom-[10%] right-8 left-12 border border-slate-800/50 rounded-sm opacity-30" />
          {/* Handle */}
          <div className="absolute top-1/2 right-6 w-1 h-16 bg-gradient-to-b from-yellow-600 to-yellow-400 rounded-full shadow-lg" />
        </div>

        {/* Lighting Overlay: Darkens the door as it swings open (simulates facing away from light) */}
        <motion.div
          animate={phase === "opening" ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ duration: 2.2 }}
          className="absolute inset-0 bg-black pointer-events-none"
        />
      </motion.div>

      {/* RIGHT DOOR */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={phase === "opening" ? { rotateY: 110 } : { rotateY: 0 }}
        transition={{
          duration: 2.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        onAnimationComplete={() => {
          if (phase === "opening") {
            onComplete();
            setTimeout(() => setPhase("complete"), 100);
          }
        }}
        // origin-right puts the "hinge" on the right edge of the screen
        className="absolute top-0 right-0 w-1/2 h-full z-40 origin-right border-l border-slate-700 bg-[#020617]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Door Design */}
        <div className="absolute inset-0 bg-gradient-to-bl from-slate-900 via-[#0f172a] to-slate-950 opacity-100">
          {/* Inner panel highlight */}
          <div className="absolute top-[10%] bottom-[10%] left-8 right-12 border border-slate-800/50 rounded-sm opacity-30" />
          {/* Handle */}
          <div className="absolute top-1/2 left-6 w-1 h-16 bg-gradient-to-b from-yellow-600 to-yellow-400 rounded-full shadow-lg" />
        </div>

        {/* Lighting Overlay */}
        <motion.div
          animate={phase === "opening" ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ duration: 2.2 }}
          className="absolute inset-0 bg-black pointer-events-none"
        />
      </motion.div>

      {/* --- LAYER 3: SEAM GLOW (The crack of light) --- */}
      <AnimatePresence>
        {phase === "locked" && (
          <motion.div
            initial={{ height: "0%", opacity: 0 }}
            animate={{ height: "60%", opacity: 1 }}
            exit={{ height: "100%", opacity: 0, scale: 1.5, filter: "blur(20px)" }}
            transition={{ duration: 0.6 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[4px] bg-yellow-400 z-50 blur-[3px]"
            style={{ boxShadow: "0 0 20px #facc15" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
