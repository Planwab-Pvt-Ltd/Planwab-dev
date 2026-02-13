"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, CalendarCheck, Handshake } from "lucide-react";

const services = [
  {
    icon: <Sparkles className="w-8 h-8 text-amber-500 dark:text-amber-400" />,
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    title: "Curated Vendor Marketplace",
    description:
      "Discover and book from thousands of top-rated venues, photographers, decorators, and more, all vetted for quality.",
  },
  {
    icon: (
      <CalendarCheck className="w-8 h-8 text-rose-500 dark:text-rose-400" />
    ),
    iconBg: "bg-rose-100 dark:bg-rose-900/50",
    title: "Intuitive Planning Tools",
    description:
      "Manage your guest list, track your budget, and follow a personalized checklist to stay organized every step of the way.",
  },
  {
    icon: <Handshake className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />,
    iconBg: "bg-cyan-100 dark:bg-cyan-900/50",
    title: "Expert Consultations",
    description:
      "Connect with our professional event planners for personalized advice, vendor recommendations, and day-of coordination.",
  },
];
const stats = [
  { value: "1,000+", label: "Successful Events" },
  { value: "4.9/5", label: "Client Rating" },
  { value: "25,000+", label: "Vendor Partners" },
];
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ServicesBanner() {
  return (
    <section className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-md py-16 sm:py-24">
      {/* <div
        className="absolute inset-0 -z-20 dark:hidden"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #fff 40%, #f59e0b 100%)",
        }}
      />
      <div
        className="absolute inset-0 -z-20 hidden dark:block"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #0d1117 40%, #451a03 100%)",
        }}
      /> */}
      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          variants={itemVariants}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Your All-in-One Event Planning Partner
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400">
            From finding the perfect venue to managing your guest list, we
            provide the tools and expertise to bring your celebration to life
            without the stress.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-800/50 rounded-xl shadow-lg p-8 text-center flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div
                className={`flex items-center justify-center h-16 w-16 rounded-full ${service.iconBg} mb-6`}
              >
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {service.title}
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400 flex-grow">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
        <motion.div
          variants={itemVariants}
          className="mt-16 sm:mt-20 pt-10 border-t border-gray-900/10 dark:border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <div className="text-3xl sm:text-4xl font-bold text-rose-500 dark:text-rose-400">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
