'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategoryStore } from '@/GlobalState/CategoryStore';
import { MapPin, Star, Users, Palette, UserCheck, Heart, Camera, Brush, ChevronDown, LayoutGrid, Rows3, Square, SlidersHorizontal, IndianRupee, X, Check, ChevronUp, Filter, Search, Sparkles, TrendingUp, Clock, Shield, Award, ChevronLeft, ChevronRight, Eye, Share2, Bookmark, Phone, Mail, Calendar, ArrowUpRight, Zap, DollarSign, Menu, ChevronsLeft, Grid3X3 } from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const vendorsData = [
    { id: 1, type: 'Venue', name: 'The Marble Palace', event: 'Wedding', location: 'Udaipur', image: 'https://images.unsplash.com/photo-1593106579478-675691c2c36a?w=600&q=80', capacity: 500, price: 500000, rating: 4.9, reviews: 234, verified: true, featured: true, availability: 'Available', bookings: 156 },
    { id: 2, type: 'Photographer', name: 'Shutter Stories', event: 'Wedding', specialty: 'Candid', image: 'https://images.unsplash.com/photo-1512295767273-b684ac76586b?w=600&q=80', rating: 4.9, experience: 8, price: 80000, reviews: 189, verified: true, availability: 'Busy', bookings: 278 },
    { id: 3, type: 'Decorator', name: 'Bloom & Petal', event: 'Anniversary', style: 'Modern', image: 'https://images.unsplash.com/photo-1621352402111-a87f2150a112?w=600&q=80', price: 120000, rating: 4.7, reviews: 156, verified: false, availability: 'Available', bookings: 92 },
    { id: 4, type: 'Venue', name: 'Coastal Dreams', event: 'Wedding', location: 'Goa', image: 'https://images.unsplash.com/photo-1602343168117-2567b5b8c381?w=600&q=80', capacity: 200, price: 350000, rating: 4.8, reviews: 312, verified: true, featured: true, availability: 'Available', bookings: 201 },
    { id: 5, type: 'Planner', name: 'Elena White', event: 'Wedding', experience: '8 Years', image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&q=80', price: 200000, rating: 5.0, reviews: 456, verified: true, availability: 'Available', bookings: 342 },
    { id: 6, type: 'Photographer', name: 'Lens Legends', event: 'Birthday', specialty: 'Fine Art', image: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?w=600&q=80', rating: 5.0, experience: 12, price: 150000, reviews: 523, verified: true, featured: true, availability: 'Busy', bookings: 412 },
    { id: 7, type: 'Decorator', name: 'Enchanted Events', event: 'Wedding', style: 'Rustic', image: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=600&q=80', price: 250000, rating: 4.9, reviews: 287, verified: true, availability: 'Available', bookings: 178 },
    { id: 8, type: 'Planner', name: 'The Event Co.', event: 'Anniversary', experience: '12 Years', image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&q=80', price: 300000, rating: 4.8, reviews: 398, verified: true, featured: true, availability: 'Available', bookings: 289 },
    { id: 9, type: 'Venue', name: 'Mountain Retreat', event: 'Birthday', location: 'Lonavla', image: 'https://images.unsplash.com/photo-1582093553258-b62a34349e32?w=600&q=80', capacity: 80, price: 150000, rating: 4.6, reviews: 123, verified: false, availability: 'Available', bookings: 67 },
    { id: 10, type: 'Photographer', name: 'Candid Moments', event: 'Anniversary', specialty: 'Candid', image: 'https://images.unsplash.com/photo-1595299496010-b85292c39e2c?w=600&q=80', rating: 4.7, experience: 5, price: 60000, reviews: 234, verified: true, availability: 'Available', bookings: 145 },
    { id: 11, type: 'Decorator', name: 'Royal Affairs', event: 'Wedding', style: 'Royal', image: 'https://images.unsplash.com/photo-1522165078649-92e7c3a55f14?w=600&q=80', price: 700000, rating: 5.0, reviews: 678, verified: true, featured: true, availability: 'Busy', bookings: 523 },
    { id: 12, type: 'Venue', name: 'The Glass House', event: 'Anniversary', location: 'Bengaluru', image: 'https://images.unsplash.com/photo-1607502231332-47a3297a7a13?w=600&q=80', capacity: 150, price: 280000, rating: 4.9, reviews: 345, verified: true, availability: 'Available', bookings: 267 },
];

const UnifiedCard = ({ vendor, color, onFavorite, isFavorite, onQuickView }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="h-full"
        >
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-2xl border border-gray-100 h-full flex flex-col relative">
                {vendor.featured && (
                    <div className="absolute top-4 left-4 z-20">
                        <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                            <Sparkles size={12} />
                            Featured
                        </div>
                    </div>
                )}

                <div className="relative h-64 overflow-hidden">
                    <img
                        src={vendor?.image}
                        alt={vendor?.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40"
                            >
                                <button
                                    onClick={() => onQuickView(vendor)}
                                    className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                                >
                                    <Eye size={18} />
                                    Quick View
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button
                            onClick={() => onFavorite(vendor.id)}
                            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all"
                        >
                            <Heart size={18} className={isFavorite ? `text-${color}-500 fill-${color}-500` : 'text-gray-600'} />
                        </button>
                        <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all">
                            <Share2 size={18} className="text-gray-600" />
                        </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className={`text-${color}-500 fill-${color}-500`} />
                                        <span className="font-bold">{vendor?.rating}</span>
                                    </div>
                                    <span className="text-sm text-gray-600">({vendor?.reviews} reviews)</span>
                                </div>
                                {vendor.verified && (
                                    <div className="flex items-center gap-1 text-green-600">
                                        <Shield size={16} className="fill-current" />
                                        <span className="text-xs font-medium">Verified</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{vendor?.name}</h3>
                                <span className={`inline-block mt-1 text-xs font-medium px-2 py-1 rounded-full ${vendor.availability === 'Available'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {vendor.availability}
                                </span>
                            </div>
                            <span className={`bg-${color}-50 text-${color}-600 px-3 py-1 rounded-full text-xs font-semibold`}>
                                {vendor?.type}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            {vendor?.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span>{vendor?.location}</span>
                                </div>
                            )}

                            {vendor?.capacity && (
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-gray-400" />
                                    <span>Up to {vendor?.capacity} guests</span>
                                </div>
                            )}

                            {vendor?.specialty && (
                                <div className="flex items-center gap-2">
                                    <Camera size={16} className="text-gray-400" />
                                    <span>{vendor?.specialty} Photography</span>
                                </div>
                            )}

                            {vendor?.style && (
                                <div className="flex items-center gap-2">
                                    <Palette size={16} className="text-gray-400" />
                                    <span>{vendor?.style} Style</span>
                                </div>
                            )}

                            {vendor?.experience && vendor?.type === 'Planner' && (
                                <div className="flex items-center gap-2">
                                    <UserCheck size={16} className="text-gray-400" />
                                    <span>{vendor?.experience} Experience</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 pt-2">
                                <TrendingUp size={16} className="text-gray-400" />
                                <span className="text-xs">{vendor?.bookings} bookings in last 3 months</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Starting from</p>
                                <p className={`font-bold text-2xl text-${color}-600`}>
                                    ₹{vendor?.price.toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button className={`bg-gray-100 hover:bg-gray-200 p-2.5 rounded-lg transition-colors`}>
                                    <Phone size={18} className="text-gray-600" />
                                </button>
                                <button className={`bg-gray-100 hover:bg-gray-200 p-2.5 rounded-lg transition-colors`}>
                                    <Mail size={18} className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                        <button className={`w-full bg-amber-600 text-white hover:bg-amber-700 px-5 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2`}>
                            <Calendar size={18} />
                            Check Availability
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const QuickViewModal = ({ vendor, isOpen, onClose, color }) => {
    if (!isOpen || !vendor) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative h-80">
                            <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">{vendor.name}</h2>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1">
                                            <Star size={18} className={`text-${color}-500 fill-${color}-500`} />
                                            <span className="font-semibold">{vendor.rating}</span>
                                        </div>
                                        <span className="text-gray-600">({vendor.reviews} reviews)</span>
                                        {vendor.verified && (
                                            <div className="flex items-center gap-1 text-green-600">
                                                <Shield size={18} className="fill-current" />
                                                <span className="font-medium">Verified</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Starting from</p>
                                    <p className={`text-3xl font-bold text-${color}-600`}>₹{vendor.price.toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Details</h3>
                                    <div className="space-y-3">
                                        {vendor.location && (
                                            <div className="flex items-center gap-3">
                                                <MapPin size={20} className="text-gray-400" />
                                                <span>{vendor.location}</span>
                                            </div>
                                        )}
                                        {vendor.capacity && (
                                            <div className="flex items-center gap-3">
                                                <Users size={20} className="text-gray-400" />
                                                <span>Capacity: {vendor.capacity} guests</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <TrendingUp size={20} className="text-gray-400" />
                                            <span>{vendor.bookings} bookings in last 3 months</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Contact</h3>
                                    <div className="space-y-3">
                                        <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <Phone size={20} className="text-gray-600" />
                                            <span>Call Now</span>
                                        </button>
                                        <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <Mail size={20} className="text-gray-600" />
                                            <span>Send Email</span>
                                        </button>
                                        <button className={`flex items-center gap-3 w-full p-3 rounded-lg bg-${color}-600 hover:bg-${color}-700 text-white transition-colors`}>
                                            <Calendar size={20} />
                                            <span>Check Availability</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const themeColors = { Wedding: 'rose', Anniversary: 'amber', Birthday: 'blue', Default: 'slate' };

export default function MarketplacePage() {
    const { activeCategory } = useCategoryStore();
    const [allVendors] = useState(vendorsData);
    const [filteredVendors, setFilteredVendors] = useState(vendorsData);
    const [viewMode, setViewMode] = useState('grid-cols-1');
    const [sortBy, setSortBy] = useState('rating');
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [quickViewVendor, setQuickViewVendor] = useState(null);
    const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
    const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
    const [selectedAvailability, setSelectedAvailability] = useState('all');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [compareList, setCompareList] = useState([]);
    const [showComparison, setShowComparison] = useState(false);

    const color = themeColors[activeCategory] || themeColors.Default;
    const vendorCategories = useMemo(() => [...new Set(allVendors.map(v => v.type))], [allVendors]);

    useEffect(() => {
        let vendors = [...allVendors];

        if (searchQuery) {
            vendors = vendors.filter(v =>
                v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.location?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategories.length > 0) {
            vendors = vendors.filter(v => selectedCategories.includes(v.type));
        }

        if (showFeaturedOnly) {
            vendors = vendors.filter(v => v.featured);
        }

        if (showVerifiedOnly) {
            vendors = vendors.filter(v => v.verified);
        }

        if (selectedAvailability !== 'all') {
            vendors = vendors.filter(v => v.availability === selectedAvailability);
        }

        vendors = vendors.filter(v => v.price >= priceRange[0] && v.price <= priceRange[1]);

        vendors.sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'bookings') return b.bookings - a.bookings;
            return 0;
        });

        setFilteredVendors(vendors);
    }, [priceRange, selectedCategories, sortBy, allVendors, searchQuery, showFeaturedOnly, showVerifiedOnly, selectedAvailability]);

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
    };

    const handleFavorite = (vendorId) => {
        setFavorites(prev =>
            prev.includes(vendorId)
                ? prev.filter(id => id !== vendorId)
                : [...prev, vendorId]
        );
    };

    const Sidebar = () => (
        <motion.aside
            initial={{ width: sidebarCollapsed ? 80 : 320 }}
            animate={{ width: sidebarCollapsed ? 80 : 320 }}
            transition={{ duration: 0.3 }}
            className="relative"
        >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-8 sticky top-24">
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className={`absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all ${sidebarCollapsed ? 'rotate-180' : ''}`}
                >
                    <ChevronLeft size={16} />
                </button>
                {!sidebarCollapsed ? (
                    <>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                                <div className={`w-1 h-6 bg-${color}-500 rounded-full mr-3`}></div>
                                Quick Filters
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <Sparkles size={18} className="text-amber-500" />
                                        <span className="font-medium">Featured Only</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={showFeaturedOnly}
                                        onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                                        className={`w-5 h-5 rounded text-${color}-600 focus:ring-${color}-500`}
                                    />
                                </label>

                                <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <Shield size={18} className="text-green-600" />
                                        <span className="font-medium">Verified Only</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={showVerifiedOnly}
                                        onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                                        className={`w-5 h-5 rounded text-${color}-600 focus:ring-${color}-500`}
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                                <div className={`w-1 h-6 bg-${color}-500 rounded-full mr-3`}></div>
                                Availability
                            </h3>
                            <div className="space-y-2">
                                {['all', 'Available', 'Busy'].map(status => (
                                    <label key={status} className="flex items-center group cursor-pointer">
                                        <input
                                            type="radio"
                                            name="availability"
                                            value={status}
                                            checked={selectedAvailability === status}
                                            onChange={(e) => setSelectedAvailability(e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${selectedAvailability === status
                                            ? `border-${color}-500`
                                            : 'border-gray-300 group-hover:border-gray-400'
                                            }`}>
                                            {selectedAvailability === status && (
                                                <div className={`w-2.5 h-2.5 rounded-full bg-${color}-500`} />
                                            )}
                                        </div>
                                        <span className={`transition-colors ${selectedAvailability === status
                                            ? 'text-gray-900 font-medium'
                                            : 'text-gray-600 group-hover:text-gray-900'
                                            }`}>
                                            {status === 'all' ? 'All' : status}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                                <div className={`w-1 h-6 bg-${color}-500 rounded-full mr-3`}></div>
                                Vendor Category
                            </h3>
                            <div className="space-y-3">
                                {vendorCategories.map(cat => (
                                    <label key={cat} className="flex items-center group cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => handleCategoryChange(cat)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded-md border-2 transition-all ${selectedCategories.includes(cat)
                                                ? `bg-${color}-500 border-${color}-500`
                                                : 'border-gray-300 group-hover:border-gray-400'
                                                }`}>
                                                {selectedCategories.includes(cat) && (
                                                    <Check size={14} className="text-white absolute top-0.5 left-0.5" />
                                                )}
                                            </div>
                                        </div>
                                        <span className={`ml-3 transition-colors ${selectedCategories.includes(cat)
                                            ? 'text-gray-900 font-medium'
                                            : 'text-gray-600 group-hover:text-gray-900'
                                            }`}>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                                <div className={`w-1 h-6 bg-${color}-500 rounded-full mr-3`}></div>
                                Price Range
                            </h3>
                            <div className="px-3">
                                <Slider
                                    range
                                    min={0}
                                    max={1000000}
                                    step={10000}
                                    value={priceRange}
                                    onChange={setPriceRange}
                                    styles={{
                                        track: {
                                            backgroundColor: '#e5e7eb',
                                            height: 6,
                                        },
                                        tracks: {
                                            backgroundColor: `var(--color-${color}-500, #ef4444)`,
                                        },
                                        handle: {
                                            backgroundColor: `var(--color-${color}-500, #ef4444)`,
                                            borderColor: `var(--color-${color}-500, #ef4444)`,
                                            width: 20,
                                            height: 20,
                                            marginTop: -7,
                                        },
                                    }}
                                />
                                <div className="flex justify-between mt-4">
                                    <div className="bg-gray-50 px-3 py-2 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-0.5">Min</p>
                                        <p className="font-semibold text-sm">₹{priceRange[0].toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="bg-gray-50 px-3 py-2 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-0.5">Max</p>
                                        <p className="font-semibold text-sm">₹{priceRange[1].toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedCategories([]);
                                setPriceRange([0, 1000000]);
                                setShowFeaturedOnly(false);
                                setShowVerifiedOnly(false);
                                setSelectedAvailability('all');
                            }}
                            className={`w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors`}
                        >
                            Clear All Filters
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-6">
                        <button className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <Filter size={24} className="text-gray-600" />
                        </button>
                        <button className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <Search size={24} className="text-gray-600" />
                        </button>
                        <button className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <DollarSign size={24} className="text-gray-600" />
                        </button>
                    </div>
                )}
            </div>
        </motion.aside>
    );

    const ComparisonBar = () => (
        <AnimatePresence>
            {compareList.length > 0 && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40"
                >
                    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">{compareList.length} vendors selected</span>
                            <div className="flex gap-2">
                                {compareList.map(vendorId => {
                                    const vendor = allVendors.find(v => v.id === vendorId);
                                    return vendor ? (
                                        <div key={vendorId} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                                            <img src={vendor.image} alt={vendor.name} className="w-6 h-6 rounded-full object-cover" />
                                            <span className="text-sm font-medium">{vendor.name}</span>
                                            <button
                                                onClick={() => setCompareList(prev => prev.filter(id => id !== vendorId))}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCompareList([])}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setShowComparison(true)}
                                className={`bg-${color}-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-${color}-700 transition-colors`}
                            >
                                Compare Now
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="min-h-screen pt-20 bg-gray-50">
            <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-blue-50 py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Find Your Perfect Vendor</h1>
                        <p className="text-xl text-gray-600 mb-8">Discover top-rated professionals for your special event</p>

                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search vendors by name or location..."
                                    className="w-full px-6 py-4 pl-14 text-lg rounded-2xl border border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all"
                                />
                                <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[
                            { icon: Award, label: '500+ Verified Vendors', color: 'text-green-600' },
                            { icon: Star, label: '4.8+ Average Rating', color: 'text-amber-600' },
                            { icon: Zap, label: 'Instant Booking', color: 'text-blue-600' },
                            { icon: Shield, label: '100% Secure', color: 'text-rose-600' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center"
                            >
                                <stat.icon size={24} className={`mx-auto mb-2 ${stat.color}`} />
                                <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AnimatePresence>
                    {mobileFiltersOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                            onClick={() => setMobileFiltersOpen(false)}
                        >
                            <motion.div
                                initial={{ x: -300 }}
                                animate={{ x: 0 }}
                                exit={{ x: -300 }}
                                className="w-80 h-full bg-white shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-4 border-b flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Filters</h2>
                                    <button onClick={() => setMobileFiltersOpen(false)}>
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="p-4 overflow-y-auto h-full pb-20">
                                    <Sidebar />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-8">
                    <div className="hidden lg:block">
                        <Sidebar />
                    </div>

                    <main className="flex-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{filteredVendors.length} Vendors Found</h2>
                                    <p className="text-gray-600 mt-1">Showing results for "{activeCategory || 'All Events'}"</p>
                                </div>

                                <div className="flex items-center gap-3 flex-wrap">
                                    <button
                                        onClick={() => setMobileFiltersOpen(true)}
                                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        <SlidersHorizontal size={18} />
                                        <span>Filters</span>
                                    </button>

                                    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                                        <button
                                            onClick={() => setViewMode('grid-cols-1')}
                                            className={`p-2 rounded-md transition-all ${viewMode === 'grid-cols-1'
                                                ? 'bg-white shadow-sm'
                                                : 'hover:bg-gray-200'
                                                }`}
                                            title="1 Column"
                                        >
                                            <Square size={18} className="rotate-90" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid-cols-1 md:grid-cols-2')}
                                            className={`p-2 rounded-md transition-all ${viewMode === 'grid-cols-1 md:grid-cols-2'
                                                ? 'bg-white shadow-sm'
                                                : 'hover:bg-gray-200'
                                                }`}
                                            title="2 Columns"
                                        >
                                            <LayoutGrid size={18} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid-cols-1 md:grid-cols-2 xl:grid-cols-3')}
                                            className={`p-2 rounded-md transition-all rotate-90 ${viewMode === 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                                                ? 'bg-white shadow-sm'
                                                : 'hover:bg-gray-200'
                                                }`}
                                            title="3 Columns"
                                        >
                                            <Rows3 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4')}
                                            className={`p-2 rounded-md transition-all ${viewMode === 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                                ? 'bg-white shadow-sm'
                                                : 'hover:bg-gray-200'
                                                }`}
                                            title="4 Columns"
                                        >
                                            <Grid3X3 size={18} />
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-sm">
                                                {sortBy === 'rating' && 'Top Rated'}
                                                {sortBy === 'price-asc' && 'Price: Low to High'}
                                                {sortBy === 'price-desc' && 'Price: High to Low'}
                                                {sortBy === 'bookings' && 'Most Popular'}
                                            </span>
                                            <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {dropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                                >
                                                    {[
                                                        { value: 'rating', label: 'Top Rated' },
                                                        { value: 'bookings', label: 'Most Popular' },
                                                        { value: 'price-asc', label: 'Price: Low to High' },
                                                        { value: 'price-desc', label: 'Price: High to Low' }
                                                    ].map(option => (
                                                        <button
                                                            key={option.value}
                                                            onClick={() => {
                                                                setSortBy(option.value);
                                                                setDropdownOpen(false);
                                                            }}
                                                            className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${sortBy === option.value ? `text-${color}-600 bg-${color}-50` : 'text-gray-700'
                                                                }`}
                                                        >
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.div layout className={`grid gap-6 ${viewMode} ${compareList.length > 0 ? 'pb-20' : ''}`}>
                            <AnimatePresence mode="popLayout">
                                {filteredVendors.map(vendor => (
                                    <UnifiedCard
                                        key={vendor.id}
                                        vendor={vendor}
                                        color={color}
                                        onFavorite={handleFavorite}
                                        isFavorite={favorites.includes(vendor.id)}
                                        onQuickView={setQuickViewVendor}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {filteredVendors.length === 0 && (
                            <div className="text-center py-16">
                                <Search size={64} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No vendors found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search query</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <QuickViewModal
                vendor={quickViewVendor}
                isOpen={!!quickViewVendor}
                onClose={() => setQuickViewVendor(null)}
                color={color}
            />

            <ComparisonBar />
        </div>
    );
}
