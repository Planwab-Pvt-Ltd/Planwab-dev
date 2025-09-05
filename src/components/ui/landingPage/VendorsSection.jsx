"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Users,
  Camera,
  Brush,
  UserCheck,
  ArrowRight,
  Award,
  Clock,
  CheckCircle,
  Sparkles,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const vendorsData = [
  {
    id: 1,
    type: "Venue",
    name: "The Marble Palace",
    location: "Udaipur, Rajasthan",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f29c1fe8ea?w=800&q=80",
    capacity: 500,
    price: "5,00,000",
    rating: 4.9,
    verified: true,
    bookings: 150,
  },
  {
    id: 2,
    type: "Photographer",
    name: "Rohan Mehta",
    specialty: "Candid Wedding Photographer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    rating: 4.9,
    experience: 8,
    verified: true,
    portfolio: 200,
  },
  {
    id: 3,
    type: "Decorator",
    name: "Bloom & Petal",
    style: "Modern & Minimalist",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    services: ["Floral Design", "Lighting", "Theming"],
    verified: true,
    projects: 120,
  },
  {
    id: 4,
    type: "Venue",
    name: "Coastal Dreams Resort",
    location: "Goa",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    capacity: 200,
    price: "3,50,000",
    rating: 4.8,
    verified: true,
    bookings: 85,
  },
  {
    id: 5,
    type: "Planner",
    name: "Priya Sharma",
    experience: "10 Years",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b332c913?w=800&q=80",
    tagline: "Flawless execution, unforgettable moments.",
    verified: true,
    events: 300,
  },
  {
    id: 6,
    type: "Photographer",
    name: "Frames & Vows",
    specialty: "Fine Art Storytelling",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
    rating: 5.0,
    experience: 12,
    verified: true,
    portfolio: 350,
  },
  {
    id: 7,
    type: "Decorator",
    name: "The Gilded Lily",
    style: "Royal & Opulent",
    image:
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80",
    services: ["Luxury Drapery", "Chandeliers", "Floral"],
    verified: true,
    projects: 95,
  },
  {
    id: 8,
    type: "Planner",
    name: "The Event Architects",
    experience: "15 Years",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
    tagline: "Your vision, our passion.",
    verified: true,
    events: 450,
  },
];
const filters = [
  {
    label: "All",
    icon: <Sparkles size={18} />,
    gradient: "from-amber-400 to-yellow-500",
  },
  {
    label: "Venues",
    icon: <MapPin size={18} />,
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    label: "Photographers",
    icon: <Camera size={18} />,
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    label: "Decorators",
    icon: <Brush size={18} />,
    gradient: "from-rose-400 to-pink-500",
  },
  {
    label: "Planners",
    icon: <UserCheck size={18} />,
    gradient: "from-amber-400 to-orange-500",
  },
];

export const VenueCard = ({ vendor }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -30, scale: 0.95 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="group relative bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100/50 dark:border-gray-700/50 min-h-[480px] flex flex-col"
  >
    <div className="relative overflow-hidden h-56 flex-shrink-0">
      <img
        src={vendor?.image}
        alt={vendor?.name}
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        onError={(e) => {
          e.target.src =
            "https://images.unsplash.com/photo-1519167758481-83f29c1fe8ea?w=800&q=80";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute top-4 right-4 flex gap-2">
        {vendor?.verified && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-emerald-500 p-2 rounded-full shadow-lg"
          >
            <CheckCircle size={16} className="text-white" />
          </motion.div>
        )}
        <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
          <Star size={16} className="text-amber-500 fill-amber-500" />
          <span className="font-bold text-gray-900">{vendor?.rating}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
          {vendor?.name}
        </h3>
        <div className="flex items-center text-white/90 text-sm">
          <MapPin size={14} className="mr-2" />
          <span>{vendor?.location}</span>
        </div>
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-1">
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          <div className="bg-amber-50 dark:bg-amber-900/50 p-2.5 rounded-xl">
            <Users size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-semibold text-sm">Capacity</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Up to {vendor?.capacity} guests
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Starting from
          </p>
          <p className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            ₹{vendor?.price}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{vendor?.bookings} bookings</span>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-medium">
          Available
        </div>
      </div>
      <motion.button
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 mt-auto"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        Book Venue <ArrowRight size={16} />
      </motion.button>
    </div>
  </motion.div>
);

export const PhotographerCard = ({ vendor }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -30, scale: 0.95 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="group relative bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100/50 dark:border-gray-700/50 min-h-[480px] flex flex-col"
  >
    <div className="relative h-64 flex-shrink-0">
      <img
        src={vendor?.image}
        alt={vendor?.name}
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        onError={(e) => {
          e.target.src =
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute top-4 right-4">
        {vendor?.verified && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-emerald-500 p-2 rounded-full shadow-lg"
          >
            <CheckCircle size={16} className="text-white" />
          </motion.div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-2xl font-bold text-white mb-1">{vendor?.name}</h3>
        <p className="text-white/80 text-sm mb-3">{vendor?.specialty}</p>
        <div className="flex items-center justify-between bg-white/15 dark:bg-black/30 backdrop-blur-sm rounded-2xl p-3">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-amber-400 fill-amber-400" />
            <span className="font-bold text-white">{vendor?.rating}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 dark:bg-black/20 px-3 py-1.5 rounded-full">
            <Clock size={14} className="text-white" />
            <span className="text-sm font-medium text-white">
              {vendor?.experience}Y Exp
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Camera size={12} />
          <span>{vendor?.portfolio} photos</span>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
          Portfolio Ready
        </div>
      </div>
      <motion.button
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 mt-auto"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        View Portfolio <Camera size={16} />
      </motion.button>
    </div>
  </motion.div>
);

export const DecoratorCard = ({ vendor }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -30, scale: 0.95 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="group bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100/50 dark:border-gray-700/50 min-h-[480px] flex flex-col"
  >
    <div className="p-6 flex-1 flex flex-col">
      <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 flex-shrink-0">
        <img
          src={vendor?.image}
          alt={vendor?.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {vendor?.verified && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-3 right-3 bg-emerald-500 p-2 rounded-full shadow-lg"
          >
            <CheckCircle size={14} className="text-white" />
          </motion.div>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {vendor?.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {vendor?.style}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-4 flex-1">
          {vendor?.services?.slice(0, 3).map((service, index) => (
            <motion.span
              key={service}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/50 dark:to-pink-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-rose-200 dark:border-rose-800/60"
            >
              {service}
            </motion.span>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Brush size={12} />
            <span>{vendor?.projects} projects</span>
          </div>
          <div className="bg-rose-50 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 px-2 py-1 rounded-full font-medium">
            Available
          </div>
        </div>
        <motion.button
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 mt-auto"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          View Designs <Brush size={16} />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

export const PlannerCard = ({ vendor }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -30, scale: 0.95 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="group bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100/50 dark:border-gray-700/50 min-h-[480px] flex flex-col"
  >
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex items-start gap-4 mb-6">
        <div className="relative flex-shrink-0">
          <img
            src={vendor?.image}
            alt={vendor?.name}
            className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-gray-700 shadow-lg transition-all duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1494790108755-2616b332c913?w=800&q=80";
            }}
          />
          {vendor?.verified && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-1 -right-1 bg-emerald-500 p-1.5 rounded-full shadow-lg"
            >
              <CheckCircle size={12} className="text-white" />
            </motion.div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Award size={12} />
              VERIFIED PLANNER
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {vendor?.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
            <Clock size={14} />
            {vendor?.experience} Experience
          </p>
        </div>
      </div>
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-4 mb-4 flex-1 flex items-center">
        <p className="text-gray-700 dark:text-gray-300 italic text-center leading-relaxed text-sm">
          "{vendor?.tagline}"
        </p>
      </div>
      <div className="flex items-center justify-between mb-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{vendor?.events} events</span>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full font-medium">
          Taking Bookings
        </div>
      </div>
      <div className="flex gap-2">
        <motion.button
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Phone size={14} />
          Contact
        </motion.button>
        <motion.button
          className="px-4 py-3 bg-white dark:bg-gray-700 border-2 border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-300 rounded-2xl font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Mail size={16} />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

export default function VendorsSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const router = useRouter();
  const filteredVendors =
    activeFilter === "All"
      ? vendorsData
      : vendorsData.filter(
          (vendor) => vendor.type === activeFilter.slice(0, -1),
        );

  const getCardComponent = (vendor) => {
    const cardProps = { vendor };
    switch (vendor.type) {
      case "Venue":
        return <VenueCard {...cardProps} key={vendor.id} />;
      case "Photographer":
        return <PhotographerCard {...cardProps} key={vendor.id} />;
      case "Decorator":
        return <DecoratorCard {...cardProps} key={vendor.id} />;
      case "Planner":
        return <PlannerCard {...cardProps} key={vendor.id} />;
      default:
        return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-amber-900/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.12),transparent_50%)] pointer-events-none" />
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          className="text-center max-w-4xl mx-auto mb-12 sm:mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100/80 to-yellow-100/80 dark:from-amber-900/50 dark:to-yellow-900/50 backdrop-blur-sm text-amber-700 dark:text-amber-300 px-6 py-3 rounded-full text-sm font-bold mb-6 border border-amber-200/50 dark:border-amber-800/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Sparkles size={16} />
            Premium Event Partners
          </motion.div>
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-amber-800 to-gray-900 dark:from-gray-100 dark:via-amber-300 dark:to-gray-100 bg-clip-text text-transparent tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover Elite{" "}
            <span className="block bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-500 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent">
              Event Professionals
            </span>
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-gray-700 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Connect with our carefully curated network of top-tier vendors who
            will bring your dream event to life with unmatched expertise and
            creativity.
          </motion.p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-12 sm:mb-16"
        >
          <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-2 shadow-xl border border-amber-100/50 dark:border-gray-700/50">
            <div className="flex flex-wrap justify-center gap-2">
              {filters.map((filter) => (
                <motion.button
                  key={filter.label}
                  onClick={() => setActiveFilter(filter.label)}
                  className={`relative px-4 sm:px-6 py-3 text-sm font-bold rounded-2xl transition-all duration-400 ${activeFilter === filter.label ? "text-white shadow-lg scale-105" : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-amber-50/50 dark:hover:bg-gray-700/50"}`}
                  whileHover={{
                    scale: activeFilter !== filter.label ? 1.05 : 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeFilter === filter.label && (
                    <motion.div
                      layoutId="activeFilter"
                      className={`absolute inset-0 bg-gradient-to-r ${filter.gradient} rounded-2xl shadow-lg`}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {filter.icon} {filter.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
          layout
          variants={containerVariants}
        >
          <AnimatePresence mode="wait">
            {filteredVendors.map((vendor) => getCardComponent(vendor))}
          </AnimatePresence>
        </motion.div>
        <motion.div variants={itemVariants} className="text-center mt-16">
          <motion.button
            className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white px-8 sm:px-10 py-4 rounded-3xl font-bold text-base sm:text-lg flex items-center gap-3 mx-auto hover:shadow-2xl transition-all duration-400 border-2 border-amber-300/50"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/vendors/marketplace")}
          >
            <Sparkles size={20} />
            Explore All Premium Vendors
            <ArrowRight size={20} />
          </motion.button>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
            Join 10,000+ satisfied customers who found their perfect vendors
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
