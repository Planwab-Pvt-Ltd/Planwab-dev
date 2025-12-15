"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Search,
  MapPin,
  X,
  Navigation,
  SlidersHorizontal,
  Home,
  Briefcase,
  Loader2,
  Clock,
  TrendingUp,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

// --- MOCK DATA ---
const POPULAR_CITIES = [
  { id: 1, name: "New Delhi", state: "Delhi", icon: "🏛️" },
  { id: 2, name: "Mumbai", state: "Maharashtra", icon: "🌊" },
  { id: 3, name: "Bangalore", state: "Karnataka", icon: "💻" },
  { id: 4, name: "Gurgaon", state: "Haryana", icon: "🏢" },
  { id: 5, name: "Pune", state: "Maharashtra", icon: "🎓" },
  { id: 6, name: "Hyderabad", state: "Telangana", icon: "🍛" },
];

const SAVED_ADDRESSES = [
  {
    id: "home",
    label: "Home",
    address: "B-204, Ashoka Apartments",
    area: "Sector 18, Rohini",
    city: "New Delhi, Delhi 110085",
    icon: Home,
  },
  {
    id: "work",
    label: "Work",
    address: "Tower B, 5th Floor",
    area: "DLF Cyber Hub, DLF Phase 3",
    city: "Gurgaon, Haryana 122002",
    icon: Briefcase,
  },
];

const RECENT_SEARCHES = [
  { id: "r1", name: "Punjabi Bagh Club", area: "West Delhi, Delhi", time: "2 days ago" },
  { id: "r2", name: "Aerocity Worldmark", area: "Aerocity, New Delhi", time: "1 week ago" },
  { id: "r3", name: "Select Citywalk", area: "Saket, South Delhi", time: "2 weeks ago" },
];

const TRENDING_AREAS = [
  { id: "t1", name: "Connaught Place", label: "Shopping Hub", city: "Central Delhi" },
  { id: "t2", name: "Khan Market", label: "Premium Dining", city: "South Delhi" },
  { id: "t3", name: "Hauz Khas Village", label: "Nightlife", city: "South Delhi" },
  { id: "t4", name: "Cyber Hub", label: "Corporate Area", city: "Gurgaon" },
];

// --- 1. CATEGORY BUTTON (Exact Design from Input) ---
const CategoryButton = ({ category, imageSrc, active, onClick, styles }) => (
  <div
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={`
        relative flex items-center justify-center space-x-2.5 px-4 py-2 mx-0.5 rounded-xl flex-1
        transition-all duration-300 ease-out group
        focus:outline-none bg-pink-50/80
        hover:bg-gray-50 hover:scale-105 hover:shadow-md cursor-pointer
        ${active ? styles : "text-gray-600 hover:text-gray-900"}
    `}
  >
    <div className="relative flex items-center justify-center">
      <img
        src={imageSrc}
        alt={`${category} icon`}
        className={`
            object-contain transition-all duration-300 ease-out
            ${active ? "w-9 h-9" : "w-9 h-8 group-hover:w-7 group-hover:h-7"}
        `}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/38x38/png?text=icon";
        }}
      />
    </div>
    <span
      className={`
        whitespace-nowrap transition-all duration-300 ease-out text-sm
        ${
          active
            ? "font-bold text-white"
            : "font-medium text-gray-700 group-hover:text-gray-900 group-hover:font-semibold"
        }
    `}
    >
      {category}
    </span>
    {/* Active Underline Indicator */}
    <div
      className={`
        absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full
        transition-all duration-400 ease-out
        ${active ? "w-[70%] opacity-100" : "w-0 opacity-0 group-hover:w-[50%] group-hover:opacity-50"}
    `}
    ></div>
  </div>
);

// --- 2. MAIN HEADER COMPONENT ---
const MobileHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Logic: Get active category from URL or default to 'Wedding'
  const currentCategoryParam = searchParams.get("category");
  const activeTabId = currentCategoryParam;

  // Theme Configuration
  const tabs = [
    {
      id: "Wedding",
      label: "Wedding",
      styles: "!bg-linear-to-r from-gray-800/85 via-blue-700/85 to-gray-900/85 bg-gradient-animated",
      image: "/WeddingCat.png",
      placeholderContext: ["Wedding Venues", "Bridal Makeup", "Mehndi Artists", "Wedding Photographers"],
    },
    {
      id: "Anniversary",
      label: "Anniversary",
      styles: "!bg-linear-to-r from-gray-800/85 via-pink-700/80 to-gray-900/85 bg-gradient-animated",
      image: "/AnniversaryCat.png",
      placeholderContext: ["Romantic Dinner", "Flower Bouquets", "Couple Spa", "Anniversary Cakes"],
    },
    {
      id: "Birthday",
      label: "Birthday",
      styles: "!bg-linear-to-r from-gray-800/65 via-yellow-400/90 to-gray-900/65 bg-gradient-animated",
      image: "/BirthdayCat.png",
      placeholderContext: ["Birthday Cakes", "Party Decor", "Event Planners", "Entertainment"],
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // States
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(SAVED_ADDRESSES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Address Drawer Logic
  const [addressSearchQuery, setAddressSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Dynamic Placeholder Effect
  useEffect(() => {
    const length = currentTab.placeholderContext.length;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeTabId, currentTab]);

  // Body Scroll Lock
  useEffect(() => {
    document.body.style.overflow = isAddressDrawerOpen ? "hidden" : "unset";
  }, [isAddressDrawerOpen]);

  // Handle Category Click -> Updates URL
  const handleCategoryClick = (id) => {
    router.push(`?category=${id}`, { scroll: false });
    setPlaceholderIndex(0);
  };

  // Mock GPS
  const getCurrentLocation = async () => {
    setIsLocating(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSelectedAddress({
      label: "Current Location",
      address: "28.6139° N, 77.2090° E",
      area: "Detected via GPS",
      city: "New Delhi, Delhi",
    });
    setIsLocating(false);
    setIsAddressDrawerOpen(false);
  };

  // Mock Autocomplete
  useEffect(() => {
    const timer = setTimeout(() => {
      if (addressSearchQuery.length > 2) {
        setIsSearchingAddress(true);
        setTimeout(() => {
          setSuggestions([
            { id: 1, name: `${addressSearchQuery} Market`, area: "Connaught Place", city: "New Delhi" },
            { id: 2, name: `${addressSearchQuery} Mall`, area: "Sector 18", city: "Noida" },
            { id: 3, name: `${addressSearchQuery} Plaza`, area: "MG Road", city: "Gurgaon" },
          ]);
          setIsSearchingAddress(false);
        }, 500);
      } else setSuggestions([]);
    }, 400);
    return () => clearTimeout(timer);
  }, [addressSearchQuery]);

  return (
    <>
      {/* --- Floating Header (Absolute) --- */}
      <div className="absolute top-0 left-0 w-full z-50 pt-1 pb-2 bg-gradient-to-b from-black/60 via-black/20 to-transparent">
        {/* A. Categories Section (White Pill Container) */}
        <div className="px-0 mb-2">
          <div className="flex items-center justify-between bg-white/10 rounded-2xl p-1.5 shadow-inner border border-gray-200/50">
            {tabs.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <CategoryButton
                  key={tab.id}
                  category={tab.label}
                  styles={tab.styles}
                  imageSrc={tab.image}
                  active={isActive}
                  onClick={() => handleCategoryClick(tab.id)}
                />
              );
            })}
          </div>
        </div>

        {/* B. Address Pill */}
        <div className="px-3 mb-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddressDrawerOpen(true)}
            className="w-full flex items-center gap-3 bg-white/10 rounded-2xl p-2 pr-4 shadow-sm active:bg-white/25 transition-all"
          >
            {/* Icon Box */}
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white shadow-inner backdrop-blur-sm">
              <MapPin size={20} fill="currentColor" fillOpacity={0.3} strokeWidth={2.5} />
            </div>

            {/* Text Content */}
            <div className="flex-1 text-left overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-white truncate max-w-[200px] drop-shadow-md">
                  {selectedAddress.label}
                </span>
                <ChevronDown size={14} className="text-white/80 stroke-[3px]" />
              </div>
              <p className="text-[11px] text-white/90 truncate font-medium leading-tight drop-shadow-sm">
                {selectedAddress.area}, {selectedAddress.city.split(",")[0]}
              </p>
            </div>
          </motion.button>
        </div>

        {/* C. Search Bar */}
        <div className="px-3 flex items-center gap-3">
          <div className="flex-1 h-12 bg-white/15 backdrop-blur-md rounded-2xl shadow-sm border border-white/20 flex items-center px-4 relative transition-all active:scale-[0.99]">
            <Search className="text-white/70 w-5 h-5 mr-3" strokeWidth={2.5} />
            <div className="relative flex-1 h-full overflow-hidden">
              <AnimatePresence mode="wait">
                {!searchQuery && (
                  <motion.span
                    key={`${activeTabId}-${placeholderIndex}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-0 bottom-0 flex items-center text-[13px] font-semibold text-white/70 w-full truncate pointer-events-none"
                  >
                    Search for "{currentTab.placeholderContext[placeholderIndex]}"
                  </motion.span>
                )}
              </AnimatePresence>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none text-sm text-white font-semibold relative z-10 placeholder-transparent"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 bg-white/20 rounded-full z-10 hover:bg-white/30"
              >
                <X size={12} className="text-white" />
              </button>
            )}
          </div>

          <button className="h-12 w-12 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-sm active:scale-95 transition-transform text-white">
            <SlidersHorizontal size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* --- Address Drawer (Fixed Overlay) --- */}
      <AnimatePresence>
        {isAddressDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddressDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] h-[65vh] flex flex-col shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="px-4 pt-2 pb-3 border-b border-gray-100 bg-white z-10 sticky top-0">
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-black text-gray-900">Select Location</h3>
                  <button
                    onClick={() => setIsAddressDrawerOpen(false)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <X size={18} className="text-gray-600" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <input
                    value={addressSearchQuery}
                    onChange={(e) => setAddressSearchQuery(e.target.value)}
                    placeholder="Search area, street name..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-sm font-medium focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    autoFocus
                  />
                  {isSearchingAddress && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="animate-spin w-4 h-4 text-blue-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto">
                {addressSearchQuery.length > 2 ? (
                  <div className="p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search Results</p>
                    <div className="space-y-1">
                      {suggestions.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedAddress({
                              label: item.name,
                              address: item.name,
                              area: item.area,
                              city: item.city,
                            });
                            setIsAddressDrawerOpen(false);
                            setAddressSearchQuery("");
                          }}
                          className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                        >
                          <MapPin size={18} className="mt-0.5 text-gray-400" />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.area}, {item.city}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-6">
                    <button
                      onClick={getCurrentLocation}
                      disabled={isLocating}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100"
                    >
                      <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        {isLocating ? (
                          <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                          <Navigation size={20} className="fill-current" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-blue-700 font-bold text-sm">Use Current Location</p>
                        <p className="text-xs text-blue-600 font-medium">
                          {isLocating ? "Detecting..." : "Enable GPS"}
                        </p>
                      </div>
                    </button>

                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Saved Addresses</p>
                      <div className="space-y-2">
                        {SAVED_ADDRESSES.map((addr) => (
                          <button
                            key={addr.id}
                            onClick={() => {
                              setSelectedAddress(addr);
                              setIsAddressDrawerOpen(false);
                            }}
                            className="w-full flex items-start gap-3 p-3 rounded-xl border border-gray-200 text-left"
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <addr.icon size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{addr.label}</p>
                              <p className="text-xs text-gray-500">{addr.area}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock size={14} className="text-gray-400" />
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent</p>
                      </div>
                      {RECENT_SEARCHES.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedAddress({
                              label: item.name,
                              address: item.name,
                              area: item.area,
                              city: item.area,
                            });
                            setIsAddressDrawerOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-left"
                        >
                          <div className="flex items-center gap-3">
                            <Clock size={15} className="text-gray-400" />
                            <div>
                              <p className="text-sm font-bold text-gray-800">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.area}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 size={14} className="text-gray-500" />
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Popular Cities</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        {POPULAR_CITIES.map((city) => (
                          <button
                            key={city.id}
                            onClick={() => {
                              setSelectedAddress({
                                label: city.name,
                                address: city.name,
                                area: "City Center",
                                city: `${city.name}, ${city.state}`,
                              });
                              setIsAddressDrawerOpen(false);
                            }}
                            className="flex flex-col items-center gap-2 py-3 rounded-xl border border-gray-200 bg-white shadow-sm"
                          >
                            <span className="text-2xl">{city.icon}</span>
                            <span className="text-[11px] font-bold text-gray-800">{city.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp size={14} className="text-green-500" />
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trending Areas</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {TRENDING_AREAS.map((area) => (
                          <button
                            key={area.id}
                            className="p-3 bg-green-50 border border-green-200 rounded-xl text-left"
                          >
                            <p className="text-xs font-bold text-green-800">{area.name}</p>
                            <p className="text-[9px] text-green-600">{area.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileHeader;
