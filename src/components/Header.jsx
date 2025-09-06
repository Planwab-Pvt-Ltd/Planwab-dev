"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Globe,
  Menu,
  UserCircle,
  ChevronDown,
  Search,
  MapPin,
  User,
  Settings,
  LogOut,
  CreditCard,
  Heart,
  Star,
  X,
  Sun,
  Moon,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { SignedIn, SignedOut, SignInButton, SignUpButton, useClerk, UserButton, useUser } from "@clerk/nextjs";

const CategoryButton = ({ category, imageSrc, active }) => (
  <div
    role="tab"
    aria-selected={active}
    className={`
            relative flex items-center justify-center space-x-2.5 px-4 py-2.5 mx-0.5 rounded-xl
            transition-all duration-300 ease-out group
            focus:outline-none
            hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:scale-105 hover:shadow-md cursor-pointer
            ${active ? "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"}
        `}
  >
    <div className="relative flex items-center justify-center">
      <img
        src={imageSrc}
        alt={`${category} icon`}
        className={`
                    object-contain transition-all duration-300 ease-out
                    ${active ? "w-7 h-7" : "w-6 h-6 group-hover:w-7 group-hover:h-7"}
                `}
      />
    </div>
    <span
      className={`
            whitespace-nowrap transition-all duration-300 ease-out
            ${active ? "text-base font-bold text-gray-900 dark:text-gray-100" : "text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 group-hover:font-semibold"}
        `}
    >
      {category}
    </span>
    <div
      className={`
            absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full
            transition-all duration-400 ease-out
            ${active ? "w-[70%] opacity-100" : "w-0 opacity-0 group-hover:w-[50%] group-hover:opacity-50"}
        `}
    ></div>
  </div>
);

const PlannerDropdown = ({ isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-6 px-6 z-50 transform transition-all duration-300 ease-out animate-in fade-in-0 slide-in-from-top-2">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          {" "}
          <Star className="w-8 h-8 text-white" />{" "}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Become a Planner
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Join our community of professional event planners and start earning
        </p>
        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
            {" "}
            Start Application{" "}
          </button>
          <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
            {" "}
            Learn More{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

const LocationDropdown = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const cities = [
    "Mumbai, Maharashtra",
    "Delhi, Delhi",
    "Bangalore, Karnataka",
    "Hyderabad, Telangana",
    "Chennai, Tamil Nadu",
    "Kolkata, West Bengal",
    "Pune, Maharashtra",
    "Ahmedabad, Gujarat",
    "Jaipur, Rajasthan",
    "Lucknow, Uttar Pradesh",
    "Kanpur, Uttar Pradesh",
    "Nagpur, Maharashtra",
    "Indore, Madhya Pradesh",
    "Thane, Maharashtra",
    "Bhopal, Madhya Pradesh",
    "Visakhapatnam, Andhra Pradesh",
    "Vadodara, Gujarat",
    "Firozabad, Uttar Pradesh",
    "Ludhiana, Punjab",
    "Rajkot, Gujarat",
    "Agra, Uttar Pradesh",
    "Siliguri, West Bengal",
    "Nashik, Maharashtra",
    "Faridabad, Haryana",
    "Patiala, Punjab",
    "Meerut, Uttar Pradesh",
    "Kalyan-Dombivali, Maharashtra",
    "Vasai-Virar, Maharashtra",
    "Varanasi, Uttar Pradesh",
    "Srinagar, Jammu and Kashmir",
    "Dhanbad, Jharkhand",
    "Jodhpur, Rajasthan",
    "Amritsar, Punjab",
    "Raipur, Chhattisgarh",
    "Allahabad, Uttar Pradesh",
    "Coimbatore, Tamil Nadu",
    "Jabalpur, Madhya Pradesh",
    "Gwalior, Madhya Pradesh",
    "Vijayawada, Andhra Pradesh",
    "Madurai, Tamil Nadu",
  ];
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCity = localStorage.getItem("activeCity");
      if (savedCity) {
        setCurrentCity(savedCity);
      }
    }
  }, []);

  const handleCitySelect = (city) => {
    setCurrentCity(city);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeCity", city);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-4 z-50 transform transition-all duration-300 ease-out animate-in fade-in-0 slide-in-from-top-2">
      <div className="px-4 pb-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
          {" "}
          <MapPin className="w-5 h-5 mr-2 text-blue-500" /> Select Your
          City{" "}
        </h3>
        {currentCity && (
          <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-800/60">
            {" "}
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium flex items-center">
              {" "}
              <MapPin className="w-4 h-4 mr-2" /> Current: {currentCity}{" "}
            </p>{" "}
          </div>
        )}
        <div className="relative">
          {" "}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />{" "}
          <input
            type="text"
            placeholder="Search for your city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />{" "}
        </div>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {filteredCities.map((city, index) => (
          <button
            key={index}
            onClick={() => handleCitySelect(city)}
            className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center ${currentCity === city ? "bg-blue-50 dark:bg-blue-900/40 border-r-2 border-blue-500" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
          >
            {" "}
            <MapPin
              className={`w-4 h-4 mr-3 ${currentCity === city ? "text-blue-500" : "text-gray-400"}`}
            />{" "}
            <span
              className={`${currentCity === city ? "text-blue-700 dark:text-blue-300 font-medium" : "text-gray-700 dark:text-gray-300"}`}
            >
              {city}
            </span>{" "}
          </button>
        ))}
      </div>
      {filteredCities.length === 0 && (
        <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
          {" "}
          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />{" "}
          <p>No cities found</p>{" "}
        </div>
      )}
    </div>
  );
};

const ProfileDropdown = ({ isOpen }) => {

  const { user } = useUser();
  const { signOut } = useClerk();

  console.log(user);

  if (!isOpen) return null;
  const menuItems = [
    {
      icon: User,
      label: "Profile",
      description: "Manage your account",
      href: "/admin/settings",
    },
    {
      icon: Heart,
      label: "Favorites",
      description: "Your saved items",
      href: "/",
    },
    {
      icon: CreditCard,
      label: "Billing",
      description: "Payment methods",
      href: "/",
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Preferences",
      href: "/admin/settings",
    },
  ];
  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 !z-50 transform transition-all duration-300 ease-out animate-in fade-in-0 slide-in-from-top-2 px-2">
      <SignedIn>
        <button
          className="text-left"
        >
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
              <img src={user?.imageUrl} alt={user?.fullName} className="w-10 h-10 rounded-xl" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {user?.username || user?.fullName || "User"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </button>
      </SignedIn>
      <div className="py-2">
        {" "}
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 flex items-center space-x-3 group"
          >
            {" "}
            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />{" "}
            <div>
              {" "}
              <p className="font-medium text-gray-900 dark:text-gray-200">
                {item.label}
              </p>{" "}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </p>{" "}
            </div>{" "}
          </Link>
        ))}{" "}
      </div>
      <SignedOut>
        <AnimatePresence>
          <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-gray-700 pt-2 justify-center items-center">
            <SignInButton>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-[90%] px-4 py-3 text-left flex items-center space-x-3 rounded-xl 
                     bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 
                     dark:hover:bg-amber-800/50 transition-colors duration-200 group cursor-pointer pr-7 justify-center"
              >
                <LogIn className="w-5 h-5 text-amber-500 group-hover:text-amber-600 transition-colors" />
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="font-medium text-amber-700 dark:text-amber-300"
                >
                  Login
                </motion.span>
              </motion.button>
            </SignInButton>
            <SignUpButton>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-[90%] px-4 py-3 text-left flex items-center space-x-3 rounded-xl 
                     bg-green-100 dark:bg-green-700/30 hover:bg-green-200 
                     dark:hover:bg-green-800/50 transition-colors duration-200 group cursor-pointer pr-7 justify-center"
              >
                <UserPlus className="w-5 h-5 text-green-500 group-hover:text-green-600 transition-colors" />
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="font-medium text-green-700 dark:text-green-300"
                >
                  Sign Up
                </motion.span>
              </motion.button>
            </SignUpButton>
          </div>
        </AnimatePresence>
      </SignedOut>
      <SignedIn>
        <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
          {" "}
          <button className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/40 transition-all duration-200 flex items-center space-x-3 group" onClick={() => signOut()}>
            {" "}
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-600" />{" "}
            <span className="font-medium text-red-600 dark:text-red-400">
              Sign out
            </span>{" "}
          </button>{" "}
        </div>
      </SignedIn>
    </div>
  );
};

const MobileMenu = ({ categories, pathname, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="lg:hidden fixed top-20 left-0 right-0 bottom-0 bg-white dark:bg-gray-900 z-40 p-6"
    >
      <div className="flex flex-col space-y-4">
        {categories.map((cat) => {
          const categoryPath = `/events/${cat.name.toLowerCase()}`;
          const isActive =
            pathname === categoryPath ||
            pathname === `/plan-my-event/${cat.name.toLowerCase()}`;
          return (
            <Link href={categoryPath} key={cat.name} passHref>
              <span
                onClick={onClose}
                className={`flex items-center space-x-4 p-4 rounded-xl text-lg font-semibold ${isActive ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-300"}`}
              >
                <img src={cat.image} alt={cat.name} className="w-8 h-8" />
                <span>{cat.name}</span>
              </span>
            </Link>
          );
        })}
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        <button className="flex items-center space-x-4 p-4 rounded-xl text-lg font-semibold text-gray-600 dark:text-gray-300 w-full text-left">
          <Star className="w-6 h-6 text-gray-400" />
          <span>Become a Planner</span>
        </button>
        <button className="flex items-center space-x-4 p-4 rounded-xl text-lg font-semibold text-gray-600 dark:text-gray-300 w-full text-left">
          <UserCircle className="w-6 h-6 text-gray-400" />
          <span>Account</span>
        </button>
      </div>
    </motion.div>
  );
};

const categories = [
  {
    name: "Wedding",
    image: "https://cdn-icons-png.flaticon.com/512/3176/3176366.png",
  },
  {
    name: "Anniversary",
    image: "https://cdn-icons-png.flaticon.com/512/1077/1077035.png",
  },
  {
    name: "Birthday",
    image: "https://cdn-icons-png.flaticon.com/512/857/857681.png",
  },
];

export default function Header() {
  const { setActiveCategory } = useCategoryStore();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const plannerRef = useRef(null);
  const locationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const currentCategory = categories.find(
      (cat) =>
        pathname.startsWith(`/events/${cat.name.toLowerCase()}`) ||
        pathname.startsWith(`/plan-my-event/${cat.name.toLowerCase()}`),
    );
    if (currentCategory) {
      setActiveCategory(currentCategory.name);
    }
  }, [pathname, setActiveCategory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        plannerRef.current &&
        !plannerRef.current.contains(event.target) &&
        locationRef.current &&
        !locationRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 !z-50 transition-all duration-500 ease-out rounded-b-3xl ${isScrolled ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-xl" : "bg-white/10 dark:bg-black/10 backdrop-blur-2xl"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex items-center space-x-2 cursor-pointer group transition-all duration-400 ease-out hover:scale-110"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="relative">
                  <Image
                    src="/planwablogo.png"
                    alt="PlanWAB Logo"
                    width={38}
                    height={38}
                    className={`transition-all duration-400 ease-out ${isHovered ? "rotate-12 scale-110" : ""}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/38x38/FDE2E8/C1284A?text=P";
                    }}
                  />
                </div>
                <span
                  className={`text-2xl font-bold tracking-tight transition-all duration-400 ease-out bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-[#f59e0b] dark:text-transparent ${isHovered ? "scale-105" : ""}`}
                >
                  planWAB
                </span>
              </Link>
            </div>

            <div className="hidden lg:flex flex-1 justify-center items-center h-full max-w-lg">
              <div
                className={`flex items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-1.5 shadow-inner border border-gray-200/50 dark:border-gray-700/50`}
              >
                {categories.map((cat) => {
                  const categoryPath = `/events/${cat.name.toLowerCase()}`;
                  const isActive =
                    pathname === categoryPath ||
                    pathname === `/plan-my-event/${cat.name.toLowerCase()}`;
                  return (
                    <Link href={categoryPath} key={cat.name} passHref>
                      <CategoryButton
                        category={cat.name}
                        imageSrc={cat.image}
                        active={isActive}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg cursor-pointer"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="relative" ref={plannerRef}>
                <button
                  onClick={() => handleDropdownToggle("planner")}
                  className="flex items-center space-x-1 font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 rounded-xl px-4 py-2.5 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer"
                >
                  <span>Become a Planner</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${openDropdown === "planner" ? "rotate-180" : ""}`}
                  />
                </button>
                <PlannerDropdown isOpen={openDropdown === "planner"} />
              </div>
              <div className="relative" ref={locationRef}>
                <button
                  onClick={() => handleDropdownToggle("location")}
                  className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg hover:rotate-12 cursor-pointer"
                >
                  <Globe size={20} />
                </button>
                <LocationDropdown
                  isOpen={openDropdown === "location"}
                  onClose={() => setOpenDropdown(null)}
                />
              </div>
              <div className="relative" ref={profileRef}>
                <button
                  className="flex items-center space-x-2.5 border border-gray-300 dark:border-gray-700 rounded-2xl p-1.5 pl-3 pr-2 shadow-lg hover:shadow-xl transition-all duration-400 ease-out hover:scale-105 bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-white hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600"
                >
                  {openDropdown !== "profile" ? (
                    <Menu
                      size={16}
                      className="text-gray-700 dark:text-gray-300 cursor-pointer"
                      onClick={() => handleDropdownToggle("profile")}
                    />
                  ) : (
                    <X
                      size={16}
                      className="text-gray-700 dark:text-gray-300 cursor-pointer"
                      onClick={() => handleDropdownToggle("profile")}
                    />
                  )}
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                    <SignedOut>
                      <UserCircle className="w-5 h-5 text-gray-300" />
                    </SignedOut>
                  </div>
                </button>
                <ProfileDropdown isOpen={openDropdown === "profile"} />
              </div>
            </div>
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl cursor-pointer"
              >
                {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        <div
          className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent transition-all duration-500 ease-out ${isScrolled ? "opacity-100 scale-x-100" : "opacity-0 scale-x-50"}`}
        ></div>
      </header>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            categories={categories}
            pathname={pathname}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
