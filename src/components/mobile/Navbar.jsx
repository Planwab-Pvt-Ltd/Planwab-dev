"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Home,
  Grid,
  Calendar,
  User,
  X,
  Plus,
  Minus,
  Search,
  Star,
  ShoppingBag,
  ChevronRight,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

// --- MOCK DATA ---
const DRAWER_CATEGORIES = ["Venues", "Catering", "Photography", "Makeup", "Decor", "Music"];
const VENDOR_ITEMS = [
  {
    id: 1,
    name: "Grand Hyatt",
    category: "Venues",
    price: 250000,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  },
  {
    id: 2,
    name: "Royal Catering",
    category: "Catering",
    price: 850,
    rating: 4.5,
    img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400",
  },
  {
    id: 3,
    name: "Lens Magic",
    category: "Photography",
    price: 45000,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
  },
  {
    id: 4,
    name: "Floral Dreams",
    category: "Decor",
    price: 30000,
    rating: 4.6,
    img: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400",
  },
];

const MobileNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // --- STATES ---
  const [isVisible, setIsVisible] = useState(true);
  const [activeDrawer, setActiveDrawer] = useState(null); // 'explore' | 'cart' | null
  const [cartItems, setCartItems] = useState([]); // Array of full item objects
  const [activeDrawerCat, setActiveDrawerCat] = useState("Venues");

  // --- SCROLL LOGIC (Auto-Hide) ---
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;
    if (diff > 10 && latest > 50) setIsVisible(false);
    else if (diff < -10 || latest < 50) setIsVisible(true);
    lastScrollY.current = latest;
  });

  // --- NAVIGATION CONFIG ---
  const navItems = [
    { id: "home", label: "Home", icon: Home, route: "/m" },
    { id: "categories", label: "Categories", icon: Grid, route: "/m/vendors/marketplace/venues" },
    { id: "center_fab", type: "center" },
    { id: "bookings", label: "Bookings", icon: Calendar, route: "/m/user/bookings" },
    { id: "profile", label: "Profile", icon: User, route: "/m/user/profile" },
  ];

  // Active State Logic based on Route
  const isTabActive = (route) => {
    if (route === "/m") {
      return pathname === "/m";
    }
    return pathname?.startsWith(route);
  };

  const handleTabChange = (item) => {
    if (item.type === "center") {
      // Logic: Empty Cart -> Explore Drawer; Has Items -> Cart Drawer
      if (cartItems.length === 0) {
        setActiveDrawer("explore");
      } else {
        setActiveDrawer("cart");
      }
      return;
    }
    router.push(item.route);
  };

  // --- CART LOGIC ---
  const toggleCartItem = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev.filter((i) => i.id !== item.id);
      return [...prev, item];
    });
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  }, [cartItems]);

  // Lock Body Scroll
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = activeDrawer ? "hidden" : "unset";
    }
  }, [activeDrawer]);

  return (
    <>
      {/* --- NAVBAR CONTAINER --- */}
      <motion.div
        animate={{ y: isVisible ? 0 : 120 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white backdrop-blur-xl border-t border-blue-100/50 pb-safe pt-0 px-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)] rounded-t-2xl"
      >
        <div className="flex items-end justify-between max-w-md mx-auto pb-1 relative">
          {navItems.map((item) => {
            // --- RENDER CENTER FAB ---
            if (item.type === "center") {
              const hasItems = cartItems.length > 0;
              return (
                <div key={item.id} className="relative -top-1 flex justify-center w-full pointer-events-none z-50">
                  <motion.button
                    onClick={() => handleTabChange(item)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="pointer-events-auto flex items-center justify-center focus:outline-none relative"
                  >
                    {/* Main Circular Container */}
                    <motion.div
                      className="flex justify-center items-center w-16 h-14 rounded-full bg-white border-[4px] border-white shadow-[0_12px_24px_rgba(30,58,138,0.2)]"
                      animate={{
                        boxShadow: hasItems ? "0_12px_24px_rgba(229,184,11,0.3)" : "0_12px_24px_rgba(30,58,138,0.2)",
                      }}
                    >
                      {/* Main Cart Icon */}
                      <ShoppingBag
                        size={28}
                        className={`transition-colors duration-300 ${hasItems ? "text-blue-900" : "text-slate-400"}`}
                        strokeWidth={2.5}
                      />

                      {/* Top Right Dynamic Badge */}
                      <AnimatePresence mode="popLayout">
                        <motion.div
                          key={hasItems ? "count-active" : "plus-inactive"}
                          initial={{ scale: 0, opacity: 0, x: 10, y: -10 }}
                          animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                          exit={{ scale: 0, opacity: 0, x: 10, y: -10 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          className={`absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-colors duration-300 ${
                            hasItems ? "bg-[#E5B80B]" : "bg-blue-600"
                          }`}
                        >
                          {hasItems ? (
                            <motion.span
                              initial={{ y: 5, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              className="text-[11px] font-black text-blue-900"
                            >
                              {cartItems.length}
                            </motion.span>
                          ) : (
                            <Plus size={14} strokeWidth={4} className="text-white" />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>

                    {/* Decorative Ring (Optional - adds extra polish when items exist) */}
                    {hasItems && (
                      <motion.div
                        layoutId="glow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl -z-10"
                      />
                    )}
                  </motion.button>
                </div>
              );
            }

            // --- RENDER STANDARD NAV ITEM ---
            const isActive = isTabActive(item.route);

            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item)}
                className="relative flex flex-col items-center justify-center w-full py-2 group focus:outline-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-bg"
                    className="absolute inset-0 bg-blue-50/80 rounded-2xl -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="relative p-1.3">
                  <motion.div
                    animate={isActive ? { y: -3, scale: 1.1 } : { y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <item.icon
                      size={24}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={`transition-colors duration-300 ${
                        isActive ? "text-blue-700" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                  </motion.div>

                  {/* Active Indicator Dot */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full ring-2 ring-white shadow-sm"
                      />
                    )}
                  </AnimatePresence>
                </div>

                <motion.span
                  animate={isActive ? { y: 0, opacity: 1, color: "#1d4ed8" } : { y: 2, opacity: 0.8, color: "#94a3b8" }}
                  className="text-[10px] font-bold tracking-wide"
                >
                  {item.label}
                </motion.span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* --- 1. EXPLORE DRAWER (Full Listings) --- */}
      <AnimatePresence>
        {activeDrawer === "explore" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDrawer(null)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 h-[85vh] bg-gray-50 z-[70] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-white px-5 pt-3 pb-4 shadow-sm z-10 sticky top-0">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Explore Vendors</h2>
                    <p className="text-xs text-gray-500 font-medium">Find the best for your event</p>
                  </div>
                  <button
                    onClick={() => setActiveDrawer(null)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {DRAWER_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveDrawerCat(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                        activeDrawerCat === cat
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {VENDOR_ITEMS.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm border border-gray-100">
                    <img src={item.img} className="w-24 h-24 rounded-xl object-cover" alt={item.name} />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900">{item.name}</h3>
                          <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-green-700">
                            <Star size={10} fill="currentColor" /> {item.rating}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>

                      <div className="flex justify-between items-end">
                        <span className="text-blue-700 font-bold text-sm">₹{item.price.toLocaleString()}</span>
                        {cartItems.find((i) => i.id === item.id) ? (
                          <button
                            onClick={() => toggleCartItem(item)}
                            className="bg-green-100 text-green-700 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            Added
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleCartItem(item)}
                            className="bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-transform"
                          >
                            Add +
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="h-24" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- 2. CART DRAWER (Checkout) --- */}
      <AnimatePresence>
        {activeDrawer === "cart" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDrawer(null)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-h-[75vh] bg-gray-50 z-[70] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-white px-5 pt-3 pb-3 border-b border-gray-100">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="text-blue-600" size={20} />
                    <h2 className="text-lg font-black text-gray-900">Your Cart</h2>
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {cartItems.length} Items
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveDrawer("explore")}
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg"
                  >
                    + Add More
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.img} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-blue-700">₹{item.price.toLocaleString()}</p>
                      <button
                        onClick={() => toggleCartItem(item)}
                        className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Summary */}
              <div className="bg-white p-5 pb-8 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t border-gray-100">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Taxes & Fees (5%)</span>
                    <span>₹{(cartTotal * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Grand Total</span>
                    <span>₹{(cartTotal * 1.05).toLocaleString()}</span>
                  </div>
                </div>

                <button className="w-full bg-[#E5B80B] text-blue-900 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-yellow-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default MobileNavbar;
