"use client";

import React, { memo, useCallback, useState, useMemo, useRef, useEffect } from "react";
import SmartMedia from "../SmartMediaLoader";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useCartStore } from "../../../GlobalState/CartDataStore";

const FILTERS = [
  { id: "all", label: "All Vendors", apiQuery: { featured: "true", sortBy: "rating", limit: "8" } },
  { id: "venues", label: "Venues", apiQuery: { categories: "venues", sortBy: "rating", limit: "8" } },
  { id: "planners", label: "Planners", apiQuery: { categories: "planners", sortBy: "rating", limit: "8" } },
  {
    id: "photographers",
    label: "Photographers",
    apiQuery: { categories: "photographers", sortBy: "rating", limit: "8" },
  },
  { id: "djs", label: "DJs", apiQuery: { categories: "djs", sortBy: "rating", limit: "8" } },
  { id: "makeup", label: "Makeup Artists", apiQuery: { categories: "makeup", sortBy: "rating", limit: "8" } },
  { id: "caterers", label: "Caterers", apiQuery: { categories: "caterers", sortBy: "rating", limit: "8" } },
];

const themeConfig = {
  Wedding: {
    text: "text-blue-800",
    pillActive: "bg-blue-100 text-blue-900 border-blue-200",
    pillInactive: "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-100",
  },
  Anniversary: {
    text: "text-pink-700",
    pillActive: "bg-pink-100 text-pink-900 border-pink-200",
    pillInactive: "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-100",
  },
  Birthday: {
    text: "text-yellow-700",
    pillActive: "bg-yellow-100 text-yellow-900 border-yellow-200",
    pillInactive: "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-100",
  },
  Default: {
    text: "text-blue-800",
    pillActive: "bg-blue-100 text-blue-900 border-blue-200",
    pillInactive: "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-100",
  },
  default: {
    text: "text-blue-800",
    pillActive: "bg-blue-100 text-blue-900 border-blue-200",
    pillInactive: "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-100",
  },
};

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50 };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

const ServiceCardSkeleton = memo(() => (
  <div className="flex-shrink-0 flex items-center gap-4 w-[320px] bg-white border border-gray-100 rounded-xl p-3 h-full relative min-h-[150px] max-h-[150px] shadow-sm snap-center">
    <div className="w-[90px] h-[90px] flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden relative animate-shimmer" />
    <div className="flex flex-col justify-center flex-1 min-w-0 pr-2 pb-8 space-y-2">
      <div className="h-4 w-3/4 bg-gray-200 rounded animate-shimmer" />
      <div className="h-3 w-1/2 bg-gray-100 rounded animate-shimmer" />
      <div className="flex items-center space-x-2 mt-1.5">
        <div className="h-4 w-16 bg-gray-200 rounded animate-shimmer" />
        <span className="w-1 h-1 bg-gray-300 rounded-full" />
        <div className="h-3 w-12 bg-gray-100 rounded animate-shimmer" />
      </div>
    </div>
    <div className="absolute bottom-3 right-3 h-7 w-14 bg-gray-200 rounded-lg animate-shimmer" />
  </div>
));

const ServiceCard = memo(({ service, themeTextClass, theme }) => {
  const { addToCart, removeFromCart, cartItems } = useCartStore();
  const haptic = useHapticFeedback();

  if (!service || !service._id) {
    return null;
  }

  const vendorId = service._id || service.id;

  const inCart = useMemo(
    () => cartItems?.some((item) => (item._id || item.id) === vendorId) || false,
    [cartItems, vendorId]
  );

  const handleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    haptic("medium");

    if (inCart) {
      removeFromCart(vendorId);
    } else {
      const cartItem = {
        _id: vendorId,
        id: vendorId,
        name: service.name,
        category: service.category,
        price: service.perDayPrice?.min || (typeof service.basePrice === "number" ? service.basePrice : 0),
        image: service.defaultImage || service.images?.[0] || "",
        quantity: 1,
        address: service.address,
        rating: service.rating,
        reviews: service.reviews,
        verified: service.verified,
      };
      addToCart(cartItem);
    }
  };

  const borderColorClass = useMemo(() => {
    const colorMap = {
      "text-blue-800": "border-blue-200",
      "text-pink-700": "border-pink-200",
      "text-yellow-700": "border-yellow-200",
    };
    return colorMap[themeTextClass] || "border-gray-100";
  }, [themeTextClass]);

  const buttonColorClass = useMemo(() => {
    if (inCart) return "bg-green-500 text-white border-green-600";

    const colorMap = {
      "text-blue-800": "bg-blue-600 text-white hover:bg-blue-700 border-blue-700",
      "text-pink-700": "bg-pink-600 text-white hover:bg-pink-700 border-pink-700",
      "text-yellow-700": "bg-yellow-600 text-white hover:bg-yellow-700 border-yellow-700",
    };
    return colorMap[themeTextClass] || "bg-gray-900 text-white hover:bg-gray-800 border-gray-900";
  }, [inCart, themeTextClass]);

  const vendorUrl = useMemo(() => {
    if (!service?._id) return "#";
    const category = service?.category?.toLowerCase().replace(/\s+/g, "-") || "vendors";
    return `/m/vendor/${category}/${service._id}`;
  }, [service?._id, service?.category]);

  return (
    <Link
      href={vendorUrl}
      onClick={() => haptic("medium")}
      className={`flex-shrink-0 flex items-center gap-4 w-[320px] bg-white border rounded-xl p-3 h-full relative min-h-[150px] max-h-[150px] shadow-sm transition-transform active:scale-98 animate-fade-in snap-center ${borderColorClass}`}
    >
      <div className="w-[90px] h-[130px] flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden relative">
        <SmartMedia
          src={service.defaultImage || service.images?.[0] || ""}
          type="image"
          className="w-full h-full object-cover"
          loaderImage="/GlowLoadingGif.gif"
          width={90}
          height={90}
          alt={service.name}
          loading="lazy"
        />
      </div>

      <div className="flex flex-col justify-center flex-1 min-w-0 pr-2 pb-8">
        <p className={`text-sm font-semibold line-clamp-2 leading-tight ${themeTextClass}`}>{service.name}</p>
        {service.category ? (
          <p className="text-gray-500 text-[10px] mt-1 line-clamp-1">{service?.category}</p>
        ) : (
          <div className="h-4" />
        )}
        <div className="flex items-center space-x-2 mt-1.5">
          <p className="text-sm font-bold text-gray-900">
            {service?.perDayPrice?.min
              ? `₹${service?.perDayPrice.min}`
              : typeof service?.basePrice === "string" || typeof service?.basePrice === "number"
              ? service?.basePrice
              : "Contact"}
          </p>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <p className="text-[10px] text-gray-500">Per Event</p>
        </div>
      </div>

      <button
        onClick={handleCart}
        className={`absolute bottom-3 right-3 inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg text-[10px] font-bold gap-1 transition-all active:scale-90 border ${buttonColorClass}`}
      >
        {inCart ? (
          <>
            <Check size={10} /> Added
          </>
        ) : (
          <>
            <Plus size={10} /> Add
          </>
        )}
      </button>
    </Link>
  );
});

const FilterPill = memo(({ filter, isActive, onClick, theme }) => {
  const haptic = useHapticFeedback();
  return (
    <button
      onClick={() => {
        haptic("light");
        onClick(filter.id);
      }}
      className={`
        p-2 px-3 rounded-lg cursor-pointer text-xs whitespace-nowrap font-medium transition-all duration-200 border active:scale-95
        ${isActive ? theme.pillActive : theme.pillInactive}
      `}
    >
      {filter.label}
    </button>
  );
});

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

const MostBooked = ({ initialData }) => {
  const searchParams = useSearchParams();
  const haptic = useHapticFeedback();
  const rawCategory = searchParams.get("category");

  let categoryKey = rawCategory ? rawCategory : "default";
  if (categoryKey === "event") categoryKey = "wedding";
  const theme = themeConfig[categoryKey] || themeConfig.default;

  const filterParam = searchParams.get("filter") || "all";
  const [activeFilterId, setActiveFilterId] = useState(filterParam);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isFirstRender = useRef(true);

  const currentFilter = useMemo(() => FILTERS.find((f) => f.id === activeFilterId), [activeFilterId]);

  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam && FILTERS.some((f) => f.id === filterParam)) {
      setActiveFilterId(filterParam);
      fetchServicesData(filterParam);
    }else {
      setServices(initialData || []);
    }
  }, [searchParams]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const filterParam = params.get("filter") || "all";
      if (FILTERS.some((f) => f.id === filterParam)) {
        setActiveFilterId(filterParam);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

   const fetchServicesData = async (filterId) => {
    setIsLoading(true);

    try {
      const filterConfig = FILTERS.find(f => f.id === filterId);
      if (!filterConfig) return;

      const params = new URLSearchParams(filterConfig.apiQuery);
      const response = await fetch(`/api/vendor?${params.toString()}`);
      const data = await response.json();

      if (data.success && data.data) {
        setServices(data.data);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterClick = useCallback((id) => {
    setActiveFilterId(id);

    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("filter", id);
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

    window.history.pushState({ filter: id }, "", newUrl);

    if (scrollRef.current) scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });

    fetchServicesData(id);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const newFilter = params.get("filter") || "all";
      
      if (newFilter !== activeFilterId && FILTERS.some((f) => f.id === newFilter)) {
        setActiveFilterId(newFilter);
        fetchServicesData(newFilter); // Fetch data to match the URL we just went back to
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeFilterId]);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    const newLeft = scrollLeft > 5;
    const newRight = scrollLeft < scrollWidth - clientWidth - 5;

    if (newLeft !== canScrollLeft) setCanScrollLeft(newLeft);
    if (newRight !== canScrollRight) setCanScrollRight(newRight);
  }, [canScrollLeft, canScrollRight]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    const ref = scrollRef.current;
    if (ref) ref.addEventListener("scroll", checkScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkScroll);
      if (ref) ref.removeEventListener("scroll", checkScroll);
    };
  }, [checkScroll, services]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="p-4 pt-4 mt-1 bg-white mb-2 content-visibility-auto contain-intrinsic-size-[300px] rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Most Booked</h2>

        {(services.length > 0 || isLoading) && (
          <div className="flex gap-2">
            <ScrollButton
              onClick={() => {
                scroll("left");
                haptic("light");
              }}
              disabled={!canScrollLeft}
              direction="left"
            />
            <ScrollButton
              onClick={() => {
                scroll("right");
                haptic("light");
              }}
              disabled={!canScrollRight}
              direction="right"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 text-sm mb-4 overflow-x-auto scrollbar-hide pb-2 no-scrollbar touch-pan-x">
        {FILTERS.map((filter) => (
          <FilterPill
            key={filter.id}
            filter={filter}
            isActive={activeFilterId === filter.id}
            onClick={handleFilterClick}
            theme={theme}
          />
        ))}
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto w-full gap-4 scrollbar-hide pb-4 no-scrollbar touch-pan-x touch-pan-y will-change-scroll min-h-[170px] snap-x snap-mandatory"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        {isLoading ? (
          [...Array(4)].map((_, i) => <ServiceCardSkeleton key={`skeleton-${i}`} />)
        ) : services.length > 0 ? (
          services.map((service, index) => (
            <ServiceCard
              key={service._id || service.id || `service-${index}`}
              service={service}
              themeTextClass={theme.text}
              theme={theme}
            />
          ))
        ) : (
          <div className="w-full flex items-center justify-center text-gray-400 text-sm italic py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No services found for this category.
          </div>
        )}

        <div className="w-1 flex-shrink-0" />
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .will-change-scroll {
          will-change: transform;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes shimmer {
          0% {
            background-position: -400px 0;
          }
          100% {
            background-position: 400px 0;
          }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
          background-size: 800px 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(MostBooked);
