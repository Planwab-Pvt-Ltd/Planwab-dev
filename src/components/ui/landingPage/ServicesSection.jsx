"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategoryStore } from '@/GlobalState/CategoryStore';
import Link from "next/link";
import {
    Camera, Utensils, Palette, Music, Gift, Car, Flower, Crown, Home, Heart,
    Cake, Sparkles, Filter, ArrowRight, Briefcase, GraduationCap, Baby,
    PartyPopper, Gem, Mail, ShieldCheck, Calendar
} from "lucide-react";

const categoryThemes = {
    Wedding: {
        primary: "from-rose-500 to-pink-500",
        accent: "bg-white/60 dark:bg-slate-900/60",
        border: "border-rose-200/30 dark:border-rose-500/20",
        text: "text-rose-600 dark:text-rose-400",
        glow: "group-hover:shadow-[0_0_20px_4px_theme(colors.rose.200)] dark:group-hover:shadow-[0_0_20px_4px_theme(colors.rose.500/50%)]",
        iconBg: "bg-white dark:bg-slate-800",
        specialBg: "bg-cover bg-center", // For a potential image/texture background
        specialStyle: { backgroundImage: `url('/pat-white-paper.svg')` } // Subtle texture
    },
    Anniversary: {
        primary: "from-amber-500 to-orange-500",
        accent: "bg-amber-50/60 dark:bg-gray-900/60",
        border: "border-amber-300/30 dark:border-amber-500/20",
        text: "text-amber-600 dark:text-amber-400",
        glow: "group-hover:shadow-[0_0_20px_4px_theme(colors.amber.200)] dark:group-hover:shadow-[0_0_20px_4px_theme(colors.amber.500/50%)]",
        iconBg: "bg-amber-50 dark:bg-gray-800",
        specialBg: "",
        specialStyle: {}
    },
    Birthday: {
        primary: "from-blue-500 to-violet-500",
        accent: "bg-slate-900/80",
        border: "border-transparent", // We use a gradient border instead
        text: "text-blue-400",
        glow: "group-hover:shadow-[0_0_20px_4px_theme(colors.blue.500/50%)]",
        iconBg: "bg-slate-800",
        specialBg: "p-[1px] bg-gradient-to-br from-blue-500 to-violet-500", // Creates gradient border
        specialStyle: {}
    },
    Default: {
        primary: "from-rose-500 to-pink-500",
        accent: "bg-white/60 dark:bg-slate-900/60",
        border: "border-rose-200/30 dark:border-rose-500/20",
        text: "text-rose-600 dark:text-rose-400",
        glow: "group-hover:shadow-[0_0_20px_4px_theme(colors.rose.200)] dark:group-hover:shadow-[0_0_20px_4px_theme(colors.rose.500/50%)]",
        iconBg: "bg-white dark:bg-slate-800",
        specialBg: "bg-cover bg-center", // For a potential image/texture background
        specialStyle: { backgroundImage: `url('/pat-white-paper.svg')` } // Subtle texture
    },
};

const eventTypes = [
    { name: "Wedding", icon: Heart, color: "from-rose-400 to-pink-500", accent: "bg-rose-50 dark:bg-rose-950/50", description: "Elegantly crafted celebrations for your special day.", features: ["Bridal Services", "Grand Venues", "Ceremonies"] },
    { name: "Anniversary", icon: Crown, color: "from-amber-400 to-orange-500", accent: "bg-amber-50 dark:bg-amber-950/50", description: "Commemorate your journey with a memorable event.", features: ["Romantic Settings", "Milestones", "Gatherings"] },
    { name: "Birthday", icon: Cake, color: "from-sky-400 to-blue-500", accent: "bg-sky-50 dark:bg-sky-950/50", description: "Make every birthday unforgettable with fun and flair.", features: ["Theme Parties", "Entertainment", "Surprises"] },
    { name: "Corporate", icon: Briefcase, color: "from-indigo-400 to-purple-500", accent: "bg-indigo-50 dark:bg-indigo-950/50", description: "Professional, seamless events that reflect your brand.", features: ["Team Building", "Launches", "Award Ceremonies"] },
    { name: "Graduation", icon: GraduationCap, color: "from-emerald-400 to-green-500", accent: "bg-emerald-50 dark:bg-emerald-950/50", description: "Celebrate academic achievements in style.", features: ["Ceremony Planning", "Photo Sessions", "Receptions"] },
    { name: "Baby Shower", icon: Baby, color: "from-pink-400 to-fuchsia-500", accent: "bg-pink-50 dark:bg-pink-950/50", description: "Welcome the new arrival with a joyful celebration.", features: ["Gender Reveals", "Decorations", "Fun Activities"] },
    { name: "Festivals", icon: PartyPopper, color: "from-red-400 to-orange-500", accent: "bg-red-50 dark:bg-red-950/50", description: "Vibrant traditional and cultural celebrations.", features: ["Diwali", "Holi", "Christmas Parties"] },
    { name: "Engagement", icon: Gem, color: "from-purple-400 to-violet-500", accent: "bg-purple-50 dark:bg-purple-950/50", description: "Mark the beautiful beginning of your journey to forever.", features: ["Ring Ceremonies", "Photo Shoots", "Family Gatherings"] },
];

const services = [
    { category: "Photography", icon: Camera, events: ["Wedding", "Anniversary", "Birthday", "Corporate", "Graduation", "Engagement"], subcategories: ["Candid Photographers", "Videographers", "Drone Shoots", "Photo Booths"], description: "Capture every precious moment with our professional photo and video services.", popularity: "Most Popular" },
    { category: "Venues", icon: Home, events: ["Wedding", "Anniversary", "Birthday", "Corporate", "Graduation"], subcategories: ["Banquet Halls", "Outdoor Lawns", "Luxury Hotels", "Private Farmhouses"], description: "Find the perfect and exclusive setting for your memorable celebration.", popularity: "Essential" },
    { category: "Catering", icon: Utensils, events: ["Wedding", "Anniversary", "Birthday", "Corporate", "Festivals"], subcategories: ["Multi-cuisine Menus", "Live Counters", "Artisan Cakes", "Bartending"], description: "Delicious culinary experiences tailored to your event's theme and guest list.", popularity: "Trending" },
    { category: "Decoration", icon: Flower, events: ["Wedding", "Anniversary", "Birthday", "Baby Shower", "Festivals"], subcategories: ["Floral Arrangements", "Stage Design", "Thematic Decor", "Lighting Design"], description: "Transform any venue into a stunning masterpiece with our creative decor solutions.", popularity: null },
    { category: "Entertainment", icon: Music, events: ["Wedding", "Anniversary", "Birthday", "Corporate", "Festivals"], subcategories: ["DJs", "Live Bands", "Dancers", "Anchors & Hosts"], description: "Keep your guests engaged and entertained with amazing music and performances.", popularity: "Popular" },
    { category: "Beauty & Styling", icon: Palette, events: ["Wedding", "Anniversary", "Engagement", "Graduation"], subcategories: ["Bridal Makeup", "Hair Styling", "Mehendi Artists", "Grooming Services"], description: "Look and feel your absolute best with our expert beauty and styling professionals.", popularity: null },
    { category: "Planning", icon: Calendar, events: ["Wedding", "Anniversary", "Birthday", "Corporate", "Graduation"], subcategories: ["Full Event Planning", "Day-of Coordination", "Vendor Management", "Budget Planning"], description: "Our expert planners handle every detail, ensuring a flawless and stress-free event.", popularity: "Recommended" },
    { category: "Invitations", icon: Mail, events: ["Wedding", "Birthday", "Corporate", "Baby Shower", "Engagement"], subcategories: ["Digital E-vites", "Luxury Card Stock", "Custom Designs", "Calligraphy Services"], description: "Set the tone for your event with beautiful, custom-designed invitations.", popularity: null },
    { category: "Gifts & Favors", icon: Gift, events: ["Wedding", "Birthday", "Anniversary", "Corporate"], subcategories: ["Personalized Gifts", "Welcome Hampers", "Return Favors", "Luxury Gifting"], description: "Delight your guests with thoughtful and unique gifts and party favors.", popularity: "New" },
    { category: "Cakes & Desserts", icon: Cake, events: ["Wedding", "Birthday", "Anniversary", "Baby Shower"], subcategories: ["Custom Wedding Cakes", "Themed Birthday Cakes", "Dessert Tables", "Chocolatiers"], description: "The sweetest part of any celebration, crafted by artisan bakers and confectioners.", popularity: null },
    { category: "Transport", icon: Car, events: ["Wedding", "Anniversary", "Corporate"], subcategories: ["Luxury Sedans", "Vintage Cars", "Guest Shuttles", "Valet Services"], description: "Arrive in style and ensure seamless transport for you and your guests.", popularity: null },
    { category: "Security", icon: ShieldCheck, events: ["Wedding", "Corporate", "Festivals"], subcategories: ["Event Security Staff", "Crowd Management", "VIP Protection", "Parking Security"], description: "Ensure a safe and secure environment for your event and all your guests.", popularity: null },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const EventTypeCard = React.memo(({ event, isActive }) => {
    const Icon = event.icon;
    return (
        <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.03 }} className={`group relative cursor-pointer transition-all duration-300 ${isActive ? 'scale-105' : ''}`}>
            <div className={`absolute -inset-px bg-gradient-to-r ${event.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${isActive ? 'opacity-80' : ''}`} />
            <div className={`relative ${event.accent} backdrop-blur-sm rounded-xl p-6 border ${isActive ? 'border-slate-400 dark:border-slate-600' : 'border-slate-200 dark:border-slate-800'} shadow-md group-hover:shadow-xl transition-shadow duration-300 h-full flex flex-col`}>
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${event.color} p-4 mb-5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{event.name}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow mb-4">{event.description}</p>
                <div className="space-y-2 mt-auto">
                    {event.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${event.color}`} />
                            <span className="font-medium">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
});
EventTypeCard.displayName = 'EventTypeCard';

const ServiceCard = React.memo(({ service, theme }) => {
    const Icon = service.icon;
    const cardContent = (
        <>
            {service.popularity && (
                <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r ${theme.primary} text-white text-xs font-bold shadow-md z-10`}>
                    {service.popularity}
                </div>
            )}
            <div className="flex items-start justify-between mb-5">
                <div className={`w-16 h-16 rounded-xl ${theme.iconBg} p-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-full h-full rounded-lg bg-gradient-to-br ${theme.primary} p-2 flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
            <h3 className={`text-2xl font-bold ${theme.text} mb-3`}>{service.category}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed flex-grow">{service.description}</p>
            <div className="space-y-3 mb-6">
                {service.subcategories.slice(0, 4).map((sub) => (
                    <div key={sub} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.primary} flex-shrink-0`} />
                        <span>{sub}</span>
                    </div>
                ))}
            </div>
            <Link href={`/vendors/marketplace/${service.category.toLowerCase()}`} className={`w-full mt-auto py-3 px-6 rounded-lg bg-gradient-to-r ${theme.primary} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}>
                Explore
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </>
    );

    return (
        <motion.div variants={itemVariants} layout transition={{ duration: 0.4, ease: "easeInOut" }} className={`group relative ${theme.specialBg} rounded-xl`}>
            <div className={`relative ${theme.accent} backdrop-blur-2xl rounded-xl p-6 border ${theme.border} transition-all duration-300 h-full flex flex-col ${theme.glow} ${theme.specialBg && 'rounded-[11px]'}`} style={theme.specialStyle}>
                {cardContent}
            </div>
        </motion.div>
    );
});
ServiceCard.displayName = 'ServiceCard';


export default function ServicesSection() {
    const [selectedFilter, setSelectedFilter] = useState("All");
    const activeCategory = useCategoryStore(state => state.activeCategory);

    const currentTheme = useMemo(() => categoryThemes[activeCategory] || categoryThemes.Default, [activeCategory]);
    const eventFilters = useMemo(() => ["All", ...eventTypes.map(event => event.name)], []);
    const filteredServices = useMemo(() => selectedFilter === "All" ? services : services.filter(service => service.events.includes(selectedFilter)), [selectedFilter]);

    return (
        <>
            <section className="relative py-16 md:py-20 overflow-hidden">
                <div className="absolute inset-0 -z-20 dark:hidden" style={{ background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #f59e0b 100%)" }} />
                <div className="absolute inset-0 -z-20 hidden dark:block" style={{ background: "radial-gradient(125% 125% at 50% 90%, #0d1117 40%, #451a03 100%)" }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">
                    <motion.header initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${currentTheme.accent} ${currentTheme.border} border backdrop-blur-sm mb-6 shadow-sm`}>
                            <Sparkles className={`w-5 h-5 ${currentTheme.text}`} />
                            <span className={`text-sm font-semibold ${currentTheme.text} tracking-wide`}>Complete Event Solutions</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight tracking-tighter">
                            Everything You Need, <br />
                            <span className={`bg-gradient-to-r ${currentTheme.primary} bg-clip-text text-transparent`}>All in One Place</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            Discover thousands of verified vendors. From intimate gatherings to grand galas, find the perfect services to make your moments unforgettable.
                        </p>
                    </motion.header>

                    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {eventTypes.map((event) => (
                            <EventTypeCard key={event.name} event={event} isActive={activeCategory === event.name} />
                        ))}
                    </motion.section>
                </div>
            </section>
            <section className="relative py-16 md:py-20 overflow-hidden">
                <div
                    className="absolute inset-0 -z-20 dark:hidden"
                    style={{
                        background:
                            "radial-gradient(125% 125% at 50% 10%, #fff 40%, #f59e0b 100%)",
                    }}
                />
                <div
                    className="absolute inset-0 -z-20 hidden dark:block"
                    style={{
                        background:
                            "radial-gradient(125% 125% at 50% 10%, #0d1117 40%, #451a03 100%)",
                    }}
                />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-16">
                    <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
                    <section className="relative space-y-12 pt-8">
                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">Our Premium Services</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Comprehensive solutions for every aspect of your event, tailored to your needs.</p>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                <Filter className={`w-4 h-4 ${currentTheme.text}`} /> Filter by:
                            </span>
                            {eventFilters.map((filter) => (
                                <motion.button key={filter} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} layout onClick={() => setSelectedFilter(filter)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${selectedFilter === filter ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-md` : 'bg-white/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
                                    {filter}
                                </motion.button>
                            ))}
                        </div>

                        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8" layout>
                            <AnimatePresence>
                                {filteredServices.map((service) => (
                                    <ServiceCard key={service.category} service={service} theme={currentTheme} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </section>
                </div>
            </section>
        </>
    );
}