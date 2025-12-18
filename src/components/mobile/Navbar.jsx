"use client";

import React, { useState, useEffect, useRef, useMemo, useTransition, memo } from "react";
import {
  Home,
  ChartBarStacked,
  Calendar,
  User,
  ShoppingBag,
  Plus,
  X,
  Star,
  Trash2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

// --- MOCK DATA (Moved Outside) ---
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
];

// --- SUB-COMPONENTS (Isolated for Performance) ---

// 1. Explore Drawer Component
const ExploreDrawer = memo(({ onClose, items, onAdd }) => {
  const [activeCat, setActiveCat] = useState("Venues");

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 h-[85vh] bg-gray-50 z-[70] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="bg-white px-5 pt-3 pb-4 shadow-sm z-10 sticky top-0">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-black text-gray-900">Explore Vendors</h2>
              <p className="text-xs text-gray-500 font-medium">Find the best for your event</p>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {DRAWER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCat === cat
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm border border-gray-100">
              <img src={item.img} className="w-24 h-24 rounded-xl object-cover" alt={item.name} loading="lazy" />
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
                  <button
                    onClick={() => onAdd(item)}
                    className="bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-transform"
                  >
                    Add +
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="h-24" />
        </div>
      </motion.div>
    </>
  );
});

// 2. Cart Drawer Component
const CartDrawer = memo(({ onClose, items, onToggle, total, onExplore }) => (
  <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
    />
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 max-h-[75vh] bg-gray-50 z-[70] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
    >
      <div className="bg-white px-5 pt-3 pb-3 border-b border-gray-100">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-blue-600" size={20} />
            <h2 className="text-lg font-black text-gray-900">Your Cart</h2>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {items.length} Items
            </span>
          </div>
          <button onClick={onExplore} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
            + Add More
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.map((item) => (
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
                onClick={() => onToggle(item)}
                className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-5 pb-8 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t border-gray-100">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Subtotal</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
            <span>Grand Total</span>
            <span>₹{(total * 1.05).toLocaleString()}</span>
          </div>
        </div>
        <button className="w-full bg-[#E5B80B] text-blue-900 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-yellow-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          Proceed to Checkout <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  </>
));

const MobileNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // --- OPTIMIZATION 1: useTransition for Instant Feedback ---
  const [isPending, startTransition] = useTransition();
  const [pendingRoute, setPendingRoute] = useState(null); // Track which specific tab is loading

  const [isVisible, setIsVisible] = useState(true);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // --- OPTIMIZATION 2: Throttled Scroll ---
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;
    // Only update state if diff is significant (prevents jitter)
    if (Math.abs(diff) > 10) {
      if (diff > 0 && latest > 100) setIsVisible(false);
      else if (diff < 0) setIsVisible(true);
      lastScrollY.current = latest;
    }
  });

  const navItems = useMemo(
    () => [
      { id: "home", label: "Home", icon: Home, route: "/m" },
      { id: "categories", label: "Categories", icon: ChartBarStacked, route: "/m/vendors/marketplace/venues" },
      { id: "center_fab", type: "center" },
      { id: "bookings", label: "Bookings", icon: Calendar, route: "/m/user/bookings" },
      { id: "profile", label: "Profile", icon: User, route: "/m/user/profile" },
    ],
    []
  );

  const isTabActive = (route) => {
    if (route === "/m") return pathname === "/m";
    return pathname?.startsWith(route);
  };

  // --- OPTIMIZATION 3: Instant Handler ---
  const handleTabChange = (item) => {
    if (item.type === "center") {
      setActiveDrawer(cartItems.length === 0 ? "explore" : "cart");
      return;
    }

    if (pathname === item.route) return; // Don't reload same page

    setPendingRoute(item.route); // 1. Set Loading State IMMEDIATELY

    startTransition(() => {
      router.push(item.route);
    });
  };

  // Reset pending state when path changes (Navigation Complete)
  useEffect(() => {
    setPendingRoute(null);
  }, [pathname]);

  const toggleCartItem = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev.filter((i) => i.id !== item.id);
      return [...prev, item];
    });
  };

  const cartTotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.price, 0), [cartItems]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = activeDrawer ? "hidden" : "unset";
    }
  }, [activeDrawer]);

  return (
    <>
      <motion.div
        animate={{ y: isVisible ? 0 : 120 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-blue-100/50 pb-[env(safe-area-inset-bottom)] pt-0 px-0 shadow-lg rounded-t-2xl will-change-transform"
      >
        <div className="flex items-end justify-between max-w-md mx-auto pb-1 relative">
          {navItems.map((item) => {
            if (item.type === "center") {
              const hasItems = cartItems.length > 0;
              return (
                <div key={item.id} className="relative -top-1 flex justify-center w-full pointer-events-none z-50">
                  <motion.button
                    onClick={() => handleTabChange(item)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="pointer-events-auto flex items-center justify-center focus:outline-none relative"
                  >
                    <motion.div
                      className="flex justify-center items-center w-16 h-14 rounded-full bg-white border-[4px] border-white shadow-[0_12px_24px_rgba(30,58,138,0.2)]"
                      animate={{
                        boxShadow: hasItems ? "0_12px_24px_rgba(229,184,11,0.3)" : "0_12px_24px_rgba(30,58,138,0.2)",
                      }}
                    >
                      <ShoppingBag
                        size={28}
                        className={`transition-colors duration-300 ${hasItems ? "text-blue-900" : "text-slate-400"}`}
                        strokeWidth={2.5}
                      />
                      <AnimatePresence>
                        {hasItems ? (
                          <motion.div
                            key="badge"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#E5B80B] flex items-center justify-center border-2 border-white shadow-sm"
                          >
                            <span className="text-[11px] font-black text-blue-900">{cartItems.length}</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="plus"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white shadow-sm"
                          >
                            <Plus size={14} strokeWidth={4} className="text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.button>
                </div>
              );
            }

            const isActive = isTabActive(item.route);
            // Check if THIS specific route is currently pending load
            const isLoading = isPending && pendingRoute === item.route;

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
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="relative p-1.3">
                  <motion.div animate={isActive ? { y: -3, scale: 1.1 } : { y: 0, scale: 1 }}>
                    {/* SHOW LOADER IF PENDING, ELSE SHOW ICON */}
                    {isLoading ? (
                      <Loader2 size={24} className="text-blue-600 animate-spin" />
                    ) : (
                      <item.icon
                        size={24}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`transition-colors duration-300 ${isActive ? "text-blue-700" : "text-slate-400"}`}
                      />
                    )}
                  </motion.div>
                  {isActive && !isLoading && (
                    <motion.div
                      layoutId="active-dot"
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full ring-2 ring-white shadow-sm"
                    />
                  )}
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

      <AnimatePresence>
        {activeDrawer === "explore" && (
          <ExploreDrawer onClose={() => setActiveDrawer(null)} items={VENDOR_ITEMS} onAdd={toggleCartItem} />
        )}
        {activeDrawer === "cart" && (
          <CartDrawer
            onClose={() => setActiveDrawer(null)}
            items={cartItems}
            onToggle={toggleCartItem}
            total={cartTotal}
            onExplore={() => setActiveDrawer("explore")}
          />
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
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
};

export default MobileNavbar;
