import React from 'react';
import { motion } from 'framer-motion';

export default function BirthdayHeroSection() {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-60 scale-105"
            >
                <source src="/CatVideos/birthday-hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F1A] via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A] via-transparent to-transparent"></div>

            {/* 
                Typography Scaling:
                - base: text-3xl
                - sm: text-4xl
                - lg (1024px - narrow desktop split): text-5xl (prevent truncation)
                - xl (1280px): text-6xl
                - 2xl (1536px): text-7xl
            */}
            <div className="absolute bottom-8 left-6 md:bottom-12 md:left-10 lg:bottom-20 lg:left-12 xl:left-20 max-w-2xl z-10 pr-4 pointer-events-none">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4C430] to-[#E5E4E2] mb-3 md:mb-6 drop-shadow-2xl leading-tight break-words"
                >
                    CELEBRATE<br />IN STYLE
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm sm:text-lg md:text-xl lg:text-lg xl:text-xl 2xl:text-2xl text-gray-200 font-light leading-relaxed glass-text max-w-xs sm:max-w-md lg:max-w-md xl:max-w-lg"
                >
                    Curate your perfect birthday experience with our premium suite.
                </motion.p>
            </div>
        </div>
    );
}
