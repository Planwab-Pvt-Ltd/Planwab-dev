'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center z-[9999]"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0.7 }}
        animate={{ scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex items-center justify-center"
      >
        <div className="absolute h-28 w-28">
            <span className="absolute h-full w-full animate-spin rounded-full border-2 border-amber-300/50 border-t-amber-400" />
        </div>
        <Image
          src="/planwablogo.png"
          alt="PlanWAB Loader"
          width={80}
          height={80}
          priority
        />
      </motion.div>
    </motion.div>
  );
}