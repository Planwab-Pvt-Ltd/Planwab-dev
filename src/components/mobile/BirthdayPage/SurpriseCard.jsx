'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const surprises = [
    { text: "Free Cake", icon: "🎂", x: -65, y: -55, gradient: "from-pink-400 to-rose-500", delay: 0 },
    { text: "Party Popper", icon: "🎉", x: 65, y: -55, gradient: "from-purple-400 to-indigo-500", delay: 0.1 },
    { text: "Sound And DJ", icon: "🔊", x: -65, y: 55, gradient: "from-blue-400 to-cyan-500", delay: 0.2 },
    { text: "Decoration", icon: "🎈", x: 65, y: 55, gradient: "from-emerald-400 to-green-500", delay: 0.3 },
];

export default function SurpriseCard() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="flex justify-center items-center h-40 relative my-4">
            <motion.div
                className="relative z-10 cursor-pointer"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={() => setIsHovered(!isHovered)} // Handle tap on mobile
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Bouncing Gift Box */}
                <motion.div
                    animate={{
                        y: isHovered ? 0 : [0, -10, 0],
                        scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{
                        y: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        },
                        scale: { duration: 0.2 }
                    }}
                    className="text-8xl filter drop-shadow-2xl relative"
                >
                    🎁
                    {!isHovered && (
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <span className="text-white/90 text-sm font-semibold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 animate-pulse">
                                Open Me 🎁
                            </span>
                        </div>
                    )}
                </motion.div>

                {/* Floating Items */}
                <AnimatePresence>
                    {isHovered && surprises.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                            animate={{ opacity: 1, scale: 1, x: item.x, y: item.y }}
                            exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: item.delay }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none"
                            style={{ width: '80px', height: '80px' }} // Fixed size container for positioning
                        >
                            <div className="w-full h-full bg-gradient-to-br from-[#0F0F1A]/80 via-[#2A1B3D]/80 to-[#0F0F1A]/60 backdrop-blur-xl border border-white/10 p-1 rounded-full flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
                                <span className="text-3xl mb-0.5 filter drop-shadow-lg leading-none">{item.icon}</span>
                                <span className={`text-[10px] uppercase tracking-tighter font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${item.gradient} drop-shadow-sm`}>
                                    {item.text}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
