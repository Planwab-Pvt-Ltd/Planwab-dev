"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";
import SmartMedia from "../SmartMediaLoader";

const SampleProposal = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const proposals = [
    {
      id: 1,
      title: "Royal Jaipur Palace Wedding",
      location: "Fairmont, Jaipur",
      image: "https://www.theweddingcompany.com/_next/static/media/1.28919306.webp",
      theme: "Traditional Gold & Red",
    },
    {
      id: 2,
      title: "Beachside Sunset Vows",
      location: "Taj Exotica, Goa",
      image: "https://www.theweddingcompany.com/_next/static/media/2.78471c2c.webp",
      theme: "Floral Pastel",
    },
    {
      id: 3,
      title: "Elegant City Reception",
      location: "The Oberoi, Delhi",
      image: "https://www.theweddingcompany.com/_next/static/media/3.2443e50a.webp",
      theme: "Modern Chic",
    },
    {
      id: 4,
      title: "Grand Hotel Celebration",
      location: "The Oberoi, Delhi",
      image: "https://www.theweddingcompany.com/_next/static/media/4.a93956bd.webp",
      theme: "Modern Chic",
    },
  ];

  // Auto-play logic
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + proposals.length) % proposals.length);
  };

  const nextSlide = () => paginate(1);
  const prevSlide = () => paginate(-1);

  return (
    <>
      <div className="py-12 bg-[linear-gradient(180deg,rgba(255,239,244,0.00)_7.21%,rgba(255,239,244,0.70)_70.13%)] relative mb-10">
        {/* Header Section */}
        <div className="px-4 lg:px-10">
          <h2 className="font-serif text-3xl font-medium text-gray-900 mb-3">Sample Proposals</h2>
          <p className="text-base text-gray-500">Explore our curated wedding experiences.</p>
        </div>

        {/* Carousel Container - Added padding here */}
        <div className="relative w-full px-4 lg:px-10 bg-[linear-gradient(180deg,rgba(255,239,244,0.00)_7.21%,rgba(255,239,244,0.70)_70.13%)]">
          <div className="relative w-full aspect-[4/3] lg:aspect-[21/9] overflow-hidden group bg-[linear-gradient(180deg,rgba(255,239,244,0.00)_7.21%,rgba(255,239,244,0.70)_70.13%)] rounded-xl">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    nextSlide();
                  } else if (swipe > swipeConfidenceThreshold) {
                    prevSlide();
                  }
                }}
                className="absolute inset-0 w-full h-full p-2"
              >
                <img
                  src={proposals[currentIndex].image}
                  alt={proposals[currentIndex].title}
                  // Changed object-cover to object-contain for better fitting
                  className="w-full h-full object-contain rounded-lg"
                  loading="lazy"
                  decoding="async"
                />
                <SmartMedia
                  src={proposals[currentIndex].image}
                  type="image"
                  className="w-full h-full object-contain rounded-lg"
                  loaderImage="/GlowLoadingGif.gif"
                  alt={proposals[currentIndex].title}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md p-2 rounded-full hover:bg-white/50 transition-colors z-10 text-white"
              onClick={prevSlide}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md p-2 rounded-full hover:bg-white/50 transition-colors z-10 text-white"
              onClick={nextSlide}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Text Part (Moved outside image) - Removed redundant px-4 */}
          <div className="mt-6">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#FAE8B3] text-[#8B5E34] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={12} /> {proposals[currentIndex].theme}
                </span>
              </div>

              <h3 className="text-2xl font-serif font-medium text-gray-900 mb-2">{proposals[currentIndex].title}</h3>

              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <MapPin size={16} className="text-gray-400" />
                <span>{proposals[currentIndex].location}</span>
              </div>
            </motion.div>

            {/* Dots Indicator */}
            <div className="flex gap-2 mt-6">
              {proposals.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-8 bg-[#C33765]" : "w-2 bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-10 z-50 translate-y-full">
          <div className="relative w-full scale-[-1]">
            <img
              alt=""
              loading="lazy"
              width="100"
              height="8"
              decoding="async"
              data-nimg="1"
              className="max-h-20 w-full object-cover object-top opacity-70"
              style={{ color: "transparent" }}
              src="https://www.theweddingcompany.com/images/HomePage/new/pink-curve.svg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SampleProposal;
