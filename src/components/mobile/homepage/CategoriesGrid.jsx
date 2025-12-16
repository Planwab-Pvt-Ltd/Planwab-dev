import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion"; // Import motion
import SmartMedia from "../SmartMediaLoader";

const CategoryGrid = ({ currentCategory }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const categories = [
    {
      name: `${currentCategory === "Default" ? "Event" : currentCategory} Planner`,
      image: "/CardsCatPhotos/PlannerCat.png",
      span: 1,
      widthClass: "w-20",
    },
    {
      name: "Photographer",
      image: "/CardsCatPhotos/PhotographerCat.png",
      span: 1,
      widthClass: "w-20",
    },
    {
      name: `${currentCategory} Venues`,
      image: "https://cdn.yesmadam.com/images/live/category/Hydra%20Category_Wedding%20Season-18-11-25.gif",
      span: 2,
      widthClass: "w-40",
    },
    {
      name: "MakeUp",
      image: "/CardsCatPhotos/MakeUpCat.png",
      span: 1,
      widthClass: "w-20",
    },
    {
      name: "Mehndi",
      image: "/CardsCatPhotos/MehndiCat.png",
      span: 1,
      widthClass: "w-20",
    },
    {
      name: "DJs & Sound",
      image: "/CardsCatPhotos/DJCat.png",
      span: 1,
      widthClass: "w-20",
    },
    {
      name: "Dhol",
      image: "/CardsCatPhotos/DholCat.png",
      span: 1,
      widthClass: "w-20",
    },
    {
      name: "Caterors",
      image: "/CardsCatPhotos/CaterorsCat.png",
      span: 1,
      widthClass: "w-20",
    },
    {
      name: "MakeUp",
      image: "/CardsCatPhotos/MakeUpCat.png",
      span: 1,
      widthClass: "w-20",
    },
    {
      name: "Mehndi",
      image: "/CardsCatPhotos/MehndiCat.png",
      span: 1,
      widthClass: "w-20",
    },
  ];

  // --- SCROLL LOGIC & STATE CHECK ---
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Allow a small buffer (1px) for rounding errors
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    // Check initial state
    checkScroll();
    // Add resize listener to re-evaluate if screen size changes
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; // Increased slightly for better slide feel
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      // Note: State updates happen via the onScroll listener on the div
    }
  };

  return (
    <>
      <div className="p-4 py-2 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900" aria-hidden="true">
            What are you looking for ?
          </h2>

          {/* --- CONTROL BUTTONS --- */}
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-1.5 rounded-full bg-gray-100 transition-colors ${
                !canScrollLeft
                  ? "opacity-40 cursor-not-allowed text-gray-400"
                  : "hover:bg-gray-200 text-gray-700 cursor-pointer"
              }`}
            >
              <ChevronLeft size={20} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-1.5 rounded-full bg-gray-100 transition-colors ${
                !canScrollRight
                  ? "opacity-40 cursor-not-allowed text-gray-400"
                  : "hover:bg-gray-200 text-gray-700 cursor-pointer"
              }`}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>

        {/* --- SCROLL CONTAINER --- */}
        <div
          ref={scrollRef}
          onScroll={checkScroll} // Updates button state during scroll
          className="grid grid-rows-2 grid-flow-col gap-x-4 gap-y-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((item, index) => (
            <motion.div
              layout // Helps smooth out layout shifts
              key={index}
              className={`flex items-center flex-col shrink-0 ${
                item.span === 2 ? "row-span-1 col-span-2" : "col-span-1"
              }`}
            >
              <SmartMedia
                src={item.image}
                type="image"
                className={`rounded-[12px] object-cover h-20 ${item.widthClass} shadow-sm transition-transform hover:scale-[1.02]`}
                loaderImage="/GlowLoadingGif.gif"
                width={item.widthClass === "w-40" ? 150 : 74}
                height={74}
                alt={item.name}
              />
              <p className="m-1 p-0 text-xs font-sans text-center text-black whitespace-nowrap">{item.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryGrid;
