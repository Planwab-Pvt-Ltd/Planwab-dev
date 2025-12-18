import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import SmartMedia from "../SmartMediaLoader";

const CategoryGrid = ({ currentCategory }) => {
  const scrollRef = useRef(null);

  // Initialize with safe defaults (Right is likely scrollable initially)
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 1. Memoize Data: Prevents array recreation on every render
  const categories = useMemo(
    () => [
      {
        name: `${currentCategory === "Default" ? "Event" : currentCategory} Planner`,
        image: "/CardsCatPhotos/PlannerCat.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      {
        name: "Photographer",
        image: "/CardsCatPhotos/PhotographerCat.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      {
        name: `${currentCategory} Venues`,
        // Use a smaller, optimized static image if possible instead of a heavy GIF for thumbnails
        image: "https://cdn.yesmadam.com/images/live/category/Hydra%20Category_Wedding%20Season-18-11-25.gif",
        span: 2,
        widthClass: "w-40",
        pixelWidth: 160,
      },
      { name: "MakeUp", image: "/CardsCatPhotos/MakeUpCat.png", span: 1, widthClass: "w-20", pixelWidth: 80 },
      { name: "Mehndi", image: "/CardsCatPhotos/MehndiCat.png", span: 1, widthClass: "w-20", pixelWidth: 80 },
      { name: "DJs & Sound", image: "/CardsCatPhotos/DJCat.png", span: 1, widthClass: "w-20", pixelWidth: 80 },
      { name: "Dhol", image: "/CardsCatPhotos/DholCat.png", span: 1, widthClass: "w-20", pixelWidth: 80 },
      { name: "Caterers", image: "/CardsCatPhotos/CaterorsCat.png", span: 1, widthClass: "w-20", pixelWidth: 80 },
      { name: "Decor", image: "/CardsCatPhotos/MakeUpCat.png", span: 1, widthClass: "w-20", pixelWidth: 80 }, // Fixed duplicate Name
      { name: "Pandit", image: "/CardsCatPhotos/MehndiCat.png", span: 1, widthClass: "w-20", pixelWidth: 80 }, // Fixed duplicate Name
    ],
    [currentCategory]
  );

  const categoriesBirthday = useMemo(
    () => [
      {
        name: `${currentCategory === "Default" ? "Event" : currentCategory} Planner`,
        image: "/CardsCatPhotos/PlannerCatB.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      {
        name: "Decorator",
        image: "/CardsCatPhotos/DecoratorCatB.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      { name: "DJs & Sound", image: "/CardsCatPhotos/DJCatB.png", span: 1, widthClass: "w-20", pixelWidth: 80 },
      {
        name: "Photographer",
        image: "/CardsCatPhotos/PhotographerCatB.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      {
        name: `${currentCategory} Venues`,
        // Use a smaller, optimized static image if possible instead of a heavy GIF for thumbnails
        image: "https://cdn.yesmadam.com/images/live/category/Hydra%20Category_Wedding%20Season-18-11-25.gif",
        span: 2,
        widthClass: "w-40",
        pixelWidth: 160,
      },
      { name: "Caterers", image: "/CardsCatPhotos/CaterorsCatB.png", span: 1, widthClass: "w-20", pixelWidth: 80 },
      {
        name: "Cake",
        image: "/CardsCatPhotos/CakesCatB.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      { name: "MakeUp", image: "/CardsCatPhotos/MakeUpCatB.png", span: 1, widthClass: "w-20", pixelWidth: 80 },
    ],
    [currentCategory]
  );

  const activeCategories = currentCategory === "Birthday" ? categoriesBirthday : categories;

  // 2. Optimized Scroll Checker (Anti-Thrashing)
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    // Calculate new states
    const newLeft = scrollLeft > 5; // buffer of 5px
    const newRight = scrollLeft < scrollWidth - clientWidth - 5;

    // Only trigger re-render if value DIFFERENT from current state
    if (newLeft !== canScrollLeft) setCanScrollLeft(newLeft);
    if (newRight !== canScrollRight) setCanScrollRight(newRight);
  }, [canScrollLeft, canScrollRight]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);

    // Add passive listener for better scroll performance
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("resize", checkScroll);
      if (ref) {
        ref.removeEventListener("scroll", checkScroll);
      }
    };
  }, [checkScroll]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="p-4 py-2 bg-white mb-2">
      <div className="flex items-center justify-between mb-4">
        {/* Render text as Priority */}
        <h2 className="text-xl font-semibold text-gray-900 leading-none">What are you looking for?</h2>

        {/* --- CONTROL BUTTONS --- */}
        <div className="flex gap-2">
          <ScrollButton onClick={() => scroll("left")} disabled={!canScrollLeft} direction="left" />
          <ScrollButton onClick={() => scroll("right")} disabled={!canScrollRight} direction="right" />
        </div>
      </div>

      {/* --- SCROLL CONTAINER --- */}
      {/* 'will-change-transform' puts this on GPU layer */}
      <div
        ref={scrollRef}
        className="grid grid-rows-2 grid-flow-col gap-x-4 gap-y-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth will-change-scroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch", // Momentum scrolling for iOS
        }}
      >
        {activeCategories.map((item, index) => (
          <div
            key={index} // Keys are stable since list doesn't re-sort
            className={`flex flex-col items-center shrink-0 ${
              item.span === 2 ? "row-span-1 col-span-2" : "col-span-1"
            }`}
          >
            {/* 3. Render Image Container with fixed Aspect Ratio to avoid CLS */}
            <div
              className={`relative rounded-[12px] overflow-hidden bg-gray-100 mb-1.5 shadow-sm transition-transform active:scale-95 hover:scale-[1.02] ${item.widthClass}`}
              style={{ height: "80px" }}
            >
              <SmartMedia
                src={item.image}
                type="image"
                className="w-full h-full object-cover"
                // Important: If SmartMedia supports priority/loading props, use them
                // loading="eager" // for first few items
                width={item.pixelWidth}
                height={80}
                alt={item.name}
              />
            </div>

            <p className="text-xs font-medium font-sans text-center text-gray-800 whitespace-nowrap leading-tight">
              {item.name}
            </p>
          </div>
        ))}
      </div>

      {/* Global Style for scrollbar hiding */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

// Memoize small buttons to prevent re-renders when parent scrolls
const ScrollButton = React.memo(({ onClick, disabled, direction }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-1.5 rounded-full transition-all duration-200 ${
      disabled
        ? "bg-gray-50 text-gray-300 cursor-not-allowed"
        : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600 active:scale-90"
    }`}
    aria-label={`Scroll ${direction}`}
  >
    {direction === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
  </button>
));

export default CategoryGrid;
