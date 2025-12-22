"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
import Link from "next/link";
import { Sparkles, Filter } from "lucide-react";

const categoryThemes = {
  Wedding: {
    primary: "from-rose-500 to-pink-500",
    accent: "bg-white/60 dark:bg-slate-900/60",
    border: "border-rose-200/30 dark:border-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
  },
  Anniversary: {
    primary: "from-amber-500 to-orange-500",
    accent: "bg-amber-50/60 dark:bg-gray-900/60",
    border: "border-amber-300/30 dark:border-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
  },
  Birthday: {
    primary: "from-blue-500 to-violet-500",
    accent: "bg-slate-900/80",
    border: "border-transparent",
    text: "text-blue-400",
  },
  Default: {
    primary: "from-rose-500 to-pink-500",
    accent: "bg-white/60 dark:bg-slate-900/60",
    border: "border-rose-200/30 dark:border-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
  },
};

const eventTypes = [
  {
    name: "Wedding",
    imageUrl:
      "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Anniversary",
    imageUrl:
      "https://images.pexels.com/photos/313700/pexels-photo-313700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Birthday",
    imageUrl:
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Corporate",
    imageUrl:
      "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Graduation",
    imageUrl:
      "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Baby Shower",
    imageUrl:
      "https://images.pexels.com/photos/7282367/pexels-photo-7282367.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Festivals",
    imageUrl:
      "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Engagement",
    imageUrl:
      "https://images.pexels.com/photos/931321/pexels-photo-931321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const services = [
  {
    category: "Photography",
    events: ["Wedding", "Anniversary", "Birthday", "Corporate", "Graduation", "Engagement"],
    imageUrl: "/CardsCatPhotos/PhotoGraphyCardPhoto.png",
  },
  {
    category: "Venues",
    events: ["Wedding", "Anniversary", "Birthday", "Corporate", "Graduation"],
    imageUrl:
      "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    category: "Catering",
    events: ["Wedding", "Anniversary", "Birthday", "Corporate", "Festivals"],
    imageUrl: "/CardsCatPhotos/CateringCardPhoto.png",
  },
  {
    category: "Decoration",
    events: ["Wedding", "Anniversary", "Birthday", "Baby Shower", "Festivals"],
    imageUrl: "/CardsCatPhotos/DecorationCardPhoto.png",
  },
  {
    category: "Entertainment",
    events: ["Wedding", "Anniversary", "Birthday", "Corporate", "Festivals"],
    imageUrl: "/CardsCatPhotos/EntertainmentCardPhoto.png",
  },
  {
    category: "Beauty & Styling",
    events: ["Wedding", "Anniversary", "Engagement", "Graduation"],
    imageUrl:
      "https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    category: "Planning",
    events: ["Wedding", "Anniversary", "Birthday", "Corporate", "Graduation"],
    imageUrl: "/CardsCatPhotos/PlannersCardPhoto.png",
  },
  {
    category: "Invitations",
    events: ["Wedding", "Birthday", "Corporate", "Baby Shower", "Engagement"],
    imageUrl: "/CardsCatPhotos/InvitationsCardPhoto.png",
  },
  {
    category: "Gifts & Favors",
    events: ["Wedding", "Birthday", "Anniversary", "Corporate"],
    imageUrl: "/CardsCatPhotos/GiftsAndFavoursCardPhoto.png",
  },
  {
    category: "Cakes & Desserts",
    events: ["Wedding", "Birthday", "Anniversary", "Baby Shower"],
    imageUrl: "/CardsCatPhotos/CakesCardPhoto.png",
  },
  {
    category: "Transport",
    events: ["Wedding", "Anniversary", "Corporate"],
    imageUrl: "/CardsCatPhotos/TransportCardPhoto.png",
  },
  {
    category: "Security",
    events: ["Wedding", "Corporate", "Festivals"],
    imageUrl: "/CardsCatPhotos/SecurityCardPhoto.png",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const EventTypeCard = React.memo(({ event, isActive, onClick, selectedFilter }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.05 }}
    onClick={() => onClick(event.name)}
    className={`group relative h-48 rounded-xl cursor-pointer overflow-hidden shadow-lg transition-all duration-300 ${
      isActive || selectedFilter === event.name
        ? "ring-4 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 ring-rose-500"
        : "ring-1 ring-slate-300/30 dark:ring-slate-700/50"
    }`}
    style={{ backgroundImage: `url(${event.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
  >
    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
    <div className="relative h-full flex items-center justify-center p-4">
      <h4 className="text-white text-2xl font-bold text-center tracking-tight">{event.name}</h4>
    </div>
  </motion.div>
));
EventTypeCard.displayName = "EventTypeCard";

const ServiceCard = React.memo(({ service }) => (
  <motion.div variants={itemVariants} layout transition={{ duration: 0.4, ease: "easeInOut" }}>
    <Link href={`/vendors/marketplace/${service?.category?.toLowerCase()}`} passHref>
      <motion.div
        className="group relative block w-full h-80 rounded-xl overflow-hidden shadow-lg"
        style={{ backgroundImage: `url(${service.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <h3 className="text-white text-2xl font-bold opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
            {service.category}
          </h3>
        </div>
      </motion.div>
    </Link>
  </motion.div>
));
ServiceCard.displayName = "ServiceCard";

export default function ServicesSection() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const activeCategory = useCategoryStore((state) => state.activeCategory);
  const servicesSectionRef = useRef(null);

  const currentTheme = useMemo(() => categoryThemes[activeCategory] || categoryThemes.Default, [activeCategory]);
  const eventFilters = useMemo(() => ["All", ...eventTypes.map((event) => event.name)], []);
  const filteredServices = useMemo(
    () => (selectedFilter === "All" ? services : services.filter((service) => service.events.includes(selectedFilter))),
    [selectedFilter]
  );

  const handleEventTypeClick = (eventName) => {
    setSelectedFilter(eventName);
    servicesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="relative pt-16 md:pt-20 pb-8 overflow-hidden">
        <div
          className="absolute inset-0 -z-20 dark:hidden"
          style={{ background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #f59e0b 100%)" }}
        />
        <div
          className="absolute inset-0 -z-20 hidden dark:block"
          style={{ background: "radial-gradient(125% 125% at 50% 90%, #0d1117 40%, #451a03 100%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${currentTheme.accent} ${currentTheme.border} border backdrop-blur-sm mb-6 shadow-sm`}
            >
              <Sparkles className={`w-5 h-5 ${currentTheme.text}`} />
              <span className={`text-sm font-semibold ${currentTheme.text} tracking-wide`}>
                Complete Event Solutions
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight tracking-tighter">
              Everything You Need, <br />
              <span className={`bg-gradient-to-r ${currentTheme.primary} bg-clip-text text-transparent`}>
                All in One Place
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Discover thousands of verified vendors. From intimate gatherings to grand galas, find the perfect services
              to make your moments unforgettable.
            </p>
          </motion.header>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {eventTypes.map((event) => (
              <EventTypeCard
                key={event.name}
                event={event}
                isActive={activeCategory === event.name}
                onClick={handleEventTypeClick}
                selectedFilter={selectedFilter}
              />
            ))}
          </motion.section>
        </div>
      </section>

      <section ref={servicesSectionRef} className="relative pt-12 pb-16 md:pb-20 overflow-hidden scroll-mt-20">
        <div
          className="absolute inset-0 -z-20 dark:hidden"
          style={{ background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #f59e0b 100%)" }}
        />
        <div
          className="absolute inset-0 -z-20 hidden dark:block"
          style={{ background: "radial-gradient(125% 125% at 50% 10%, #0d1117 40%, #451a03 100%)" }}
        />
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <section className="relative space-y-12">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                Our Premium Services
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Comprehensive solutions for every aspect of your event, tailored to your needs.
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                <Filter className={`w-4 h-4 ${currentTheme.text}`} /> Filter by:
              </span>
              {eventFilters.map((filter) => (
                <motion.button
                  key={filter}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    selectedFilter === filter
                      ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-md`
                      : "bg-white/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {filter}
                </motion.button>
              ))}
            </div>

            {selectedFilter !== "All" && (
              <motion.div
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing services for:{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedFilter}</span>
                </p>
              </motion.div>
            )}

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8" layout>
              <AnimatePresence>
                {filteredServices.map((service) => (
                  <ServiceCard key={service.category} service={service} />
                ))}
              </AnimatePresence>
            </motion.div>
          </section>
        </div>
      </section>
    </>
  );
}
