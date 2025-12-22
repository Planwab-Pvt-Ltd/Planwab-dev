"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function Loading() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 bg-gradient-to-br from-amber-50 via-white to-white flex items-center justify-center z-[9999]"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{ scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex items-center justify-center w-full h-full max-w-md max-h-md"
        >
          <video src="/Loading/loading1.mp4" alt="PlanWAB Loader" width={280} height={280} autoPlay muted loop />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
