'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HotelCard({ name, location, price, type, images, onSelect }) {
    const isFree = type === 'free';
    const isPremium = type === 'premium';
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Ensure images array is valid and has at least one image
    const validImages = images && images.length > 0 ? images : ['/placeholder.jpg'];

    // Auto-slide effect
    useEffect(() => {
        if (validImages.length <= 1 || isHovered) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, [validImages.length, isHovered]);

    const handleNextImage = (e) => {
        e.stopPropagation(); // Prevent card selection
        setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
    };

    const handlePrevImage = (e) => {
        e.stopPropagation(); // Prevent card selection
        setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative h-52 bg-white rounded-[24px] border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(106,13,173,0.15)] hover:border-purple-300 overflow-hidden transition-all duration-500 hover:-translate-y-1 mx-1"
        >
            <div className="flex h-full">
                {/* Left Half - Image Slider (50%) */}
                <div className="w-1/2 relative overflow-hidden bg-gray-100">
                    <AnimatePresence>
                        <motion.img
                            key={currentImageIndex}
                            src={validImages[currentImageIndex]}
                            alt={`${name} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            loading="lazy"
                        />
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                    {/* Navigation Arrows (Only if multiple images) */}
                    {validImages.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors z-10"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors z-10"
                            >
                                <ChevronRight size={14} />
                            </button>

                            {/* Dots Indicator */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                                {validImages.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/40'
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Badge on Image */}
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-sm z-10 ${isFree
                        ? 'bg-green-500/80 text-white'
                        : 'bg-[#6A0DAD]/80 text-white'
                        }`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            {isFree ? 'Free' : (
                                <>
                                    <Star size={10} fill="currentColor" /> Premium
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {/* Right Half - Content (50%) */}
                <div className="w-1/2 p-4 flex flex-col justify-between bg-gradient-to-br from-white to-purple-50/50">
                    <div>
                        <h3 className="text-[16px] leading-snug font-bold text-[#1A1A1A] mb-1 line-clamp-2" title={name}>
                            {name}
                        </h3>
                        <div className="flex items-start text-[#6B7280] gap-1 mb-2">
                            <MapPin size={12} className="shrink-0 mt-0.5" />
                            <span className="text-[12px] leading-tight line-clamp-2">{location}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {/* Price */}
                        {isPremium && price && (
                            <div className="flex items-baseline gap-1">
                                <span className="text-[16px] font-bold text-[#6A0DAD]">
                                    ₹{price.toLocaleString()}
                                </span>
                            </div>
                        )}
                        {!isPremium && <div className="h-4"></div>}

                        {/* Compact Button */}
                        <button
                            onClick={onSelect}
                            className={`w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95 group/btn ${isFree
                                ? 'bg-[#00D97E] hover:bg-[#00c06f] text-white shadow-lg shadow-green-200'
                                : 'bg-gradient-to-r from-[#6A0DAD] to-[#D926A9] text-white shadow-lg shadow-purple-200'
                                }`}
                        >
                            <span className="font-bold text-[11px] tracking-wide uppercase">
                                {isFree ? 'Select' : 'Select'}
                            </span>
                            <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Hover Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 pointer-events-none skew-x-12" />
        </div>
    );
}
