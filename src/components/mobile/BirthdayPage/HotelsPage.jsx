'use client';

import React, { useState, useEffect } from 'react';
import { Search, Gift, Star, MapPin, ArrowRight } from 'lucide-react';
import HotelCard from './HotelCard';

export default function HotelsPage({ searchQuery, setSearchQuery, freeHotels, paidHotels, isHotelsLoading, handleSelectHotel }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Filter hotels based on search query
    // (Assuming passed props are already filtered or we filter here if needed, keeping logic same as before but inside new UI)


    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans">
            {/* Hero Section */}
            <div
                className="relative pb-32 pt-32 px-6 rounded-b-[40px] shadow-lg overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/CardsCatPhotos/Birthday_table.png')" }}
            >
                {/* Animated Mesh Gradient Overlay (Simulated via CSS) */}
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)] animate-pulse-slow pointer-events-none"></div>

                <div className={`relative z-10 text-center transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="inline-block bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl mx-4">
                        <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#E5E4E2] bg-clip-text text-transparent drop-shadow-sm">
                            Choose Perfect Place
                        </h1>
                        <p className="text-white/95 text-lg font-medium max-w-md mx-auto drop-shadow-sm">
                            Find the ideal location for your celebration
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Bar - Floating */}
            <div className={`relative -mt-8 mx-6 z-20 transition-all duration-500 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="relative group">
                    <div className="absolute inset-0 bg-pink-500/20 rounded-2xl blur-xl group-hover:bg-pink-500/30 transition-all duration-300"></div>
                    <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center p-2 focus-within:ring-2 focus-within:ring-pink-400/50 transition-all duration-300">
                        <Search className="ml-3 text-pink-500 w-6 h-6 transition-transform duration-300 group-focus-within:rotate-90" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or location..."
                            className="w-full bg-transparent border-none focus:ring-0 text-[#1A1A1A] placeholder-gray-400 text-lg px-4 py-3"
                        />
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="px-4 pb-24 mt-8 space-y-12">

                {/* Free Booking Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6 pl-2">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center animate-bounce-soft">
                            <Gift className="text-[#00D97E] w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#1A1A1A]">Free Booking Places</h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-[#00D97E] to-transparent rounded-full mt-1"></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {isHotelsLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-[20px] h-32 animate-pulse shadow-sm"></div>
                            ))
                        ) : freeHotels.length > 0 ? (
                            freeHotels.map((hotel, index) => (
                                <div
                                    key={hotel._id}
                                    className={`transition-all duration-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <HotelCard
                                        name={hotel.name}
                                        location={hotel.location}
                                        price={hotel.price}
                                        type="free"
                                        images={hotel.images}
                                        onSelect={() => handleSelectHotel(hotel)}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
                                <p className="text-gray-400">No free places found.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Premium Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6 pl-2">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center animate-pulse">
                            <Star className="text-[#FF8A00] w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#1A1A1A]">Premium Places</h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-[#FF8A00] to-transparent rounded-full mt-1"></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {isHotelsLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-[20px] h-32 animate-pulse shadow-sm"></div>
                            ))
                        ) : paidHotels.length > 0 ? (
                            paidHotels.map((hotel, index) => (
                                <div
                                    key={hotel._id}
                                    className={`transition-all duration-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                    style={{ transitionDelay: `${index * 100 + 200}ms` }}
                                >
                                    <HotelCard
                                        name={hotel.name}
                                        location={hotel.location}
                                        price={hotel.price}
                                        type="premium"
                                        images={hotel.images}
                                        onSelect={() => handleSelectHotel(hotel)}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
                                <p className="text-gray-400">No premium places found.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <style jsx global>{`
                @keyframes bounce-soft {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-soft {
                    animation: bounce-soft 2s infinite ease-in-out;
                }
                 .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
}
