'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2, MapPin, Calendar, Users, Clock, Download, Home, Sparkles, Gift, Music, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ConfirmationPage({ confirmationData }) {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        setShowConfetti(true);
        // Hide confetti after animation
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans relative overflow-hidden">
            {/* Confetti Effect */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: '-10px',
                                animationDelay: `${Math.random() * 0.5}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        >
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: ['#FF7A18', '#FF3CAC', '#784BA0', '#FFD700', '#10B981'][Math.floor(Math.random() * 5)]
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}



            <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-32">
                {/* Success Animation */}
                <div className={`text-center mb-12 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
                    {/* Animated Success Icon */}
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A18] via-[#FF3CAC] to-[#784BA0] rounded-full blur-2xl opacity-50 animate-pulse"></div>
                        <div className="relative w-24 h-24 bg-gradient-to-r from-[#FF7A18] via-[#FF3CAC] to-[#784BA0] rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
                            <CheckCircle2 size={48} className="text-white" strokeWidth={3} />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight bg-gradient-to-r from-[#FF7A18] via-[#FF3CAC] to-[#784BA0] bg-clip-text text-transparent">
                        Booking Confirmed! 🎉
                    </h1>
                    <p className="text-gray-700 text-xl font-medium max-w-md mx-auto flex items-center justify-center gap-2">
                        <Sparkles size={20} className="text-[#FF7A18]" />
                        Your birthday celebration is all set
                        <Sparkles size={20} className="text-[#FF3CAC]" />
                    </p>
                </div>

                {confirmationData && (
                    <div className="space-y-6">


                        {/* Free Gift Card - User Centric & Aesthetic */}
                        <div className={`transition-all duration-700 delay-400 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="relative overflow-hidden bg-gradient-to-r from-[#FFF0F5] to-[#F3E5F5] rounded-3xl border border-pink-100 shadow-xl p-6 group hover:shadow-2xl transition-all duration-300">
                                {/* Decorative Background Icon */}
                                <div className="absolute right-0 top-0 -mt-4 -mr-4 text-pink-200 opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                    <Gift size={120} />
                                </div>

                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 relative z-10">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF3CAC] to-[#784BA0] flex items-center justify-center shadow-md">
                                        <Gift size={16} className="text-white" />
                                    </div>
                                    <span className="bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] bg-clip-text text-transparent">
                                        Free Gift Includes
                                    </span>
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                                    {/* Item 1: Cake */}
                                    <div className="flex items-center gap-3 bg-white/60 p-3 rounded-2xl border border-white/50 backdrop-blur-sm">
                                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                                            <span className="text-xl">🎂</span>
                                        </div>
                                        <span className="font-bold text-gray-800">Delicious Cake</span>
                                    </div>

                                    {/* Item 2: DJ & Sound */}
                                    <div className="flex items-center gap-3 bg-white/60 p-3 rounded-2xl border border-white/50 backdrop-blur-sm">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                            <Music size={20} />
                                        </div>
                                        <span className="font-bold text-gray-800">DJ & Sound</span>
                                    </div>

                                    {/* Item 3: Decoration */}
                                    <div className="flex items-center gap-3 bg-white/60 p-3 rounded-2xl border border-white/50 backdrop-blur-sm">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                            <Sparkles size={20} />
                                        </div>
                                        <span className="font-bold text-gray-800">Birthday Decoration</span>
                                    </div>
                                </div>

                                {/* Disclaimer */}
                                <div className="mt-5 flex items-start gap-2 text-red-500/80 text-sm font-medium bg-red-50/50 p-3 rounded-xl border border-red-100/50">
                                    <Info size={16} className="mt-0.5 flex-shrink-0" />
                                    <p>Note: Dinner/Food is not included in this package.</p>
                                </div>

                            </div>
                        </div>


                        {/* Main Details Grid */}
                        <div className={`grid md:grid-cols-2 gap-6 transition-all duration-700 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            {/* Event Details Card */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7A18] to-[#FF3CAC] flex items-center justify-center">
                                        <Calendar size={16} className="text-white" />
                                    </div>
                                    Event Details
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-pink-50">
                                        <Calendar size={20} className="text-[#FF7A18] mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium mb-1">Event Date</p>
                                            <p className="text-gray-900 font-bold">{confirmationData.bookingDetails.eventDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-pink-50">
                                        <Users size={20} className="text-[#FF3CAC] mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium mb-1">Number of Guests</p>
                                            <p className="text-gray-900 font-bold">{confirmationData.bookingDetails.guestCount} guests</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-pink-50">
                                        <Clock size={20} className="text-[#784BA0] mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium mb-1">Time Slot</p>
                                            <p className="text-gray-900 font-bold capitalize">{confirmationData.bookingDetails.timeSlot}</p>
                                        </div>
                                    </div>
                                    {confirmationData.bookingDetails.specialRequests && (
                                        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                                            <p className="text-xs text-gray-600 font-medium mb-2">Special Requests</p>
                                            <p className="text-gray-800 text-sm leading-relaxed">{confirmationData.bookingDetails.specialRequests}</p>
                                        </div>
                                    )}
                                    {/* Booking ID Card */}
                                    <div className={`transition-all duration-700 delay-200 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 text-center mt-4">
                                            <p className="text-sm text-gray-600 mb-2 font-medium">Booking Reference</p>
                                            <p className="text-lg font-bold bg-gradient-to-r from-[#FF7A18] to-[#FF3CAC] bg-clip-text text-transparent tracking-wider">
                                                {confirmationData.bookingId}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Venue Details Card */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#784BA0] to-[#FF3CAC] flex items-center justify-center">
                                        <MapPin size={16} className="text-white" />
                                    </div>
                                    Venue Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-600 font-medium mb-2">Venue Name</p>
                                        <p className="text-lg text-gray-900 font-bold">{confirmationData.hotel.name}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin size={18} className="text-[#FF7A18] mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium mb-1">Location</p>
                                            <p className="text-gray-900 font-semibold">{confirmationData.hotel.location}</p>
                                        </div>
                                    </div>
                                    {confirmationData.hotel.isPaid && confirmationData.hotel.price ? (
                                        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#FF7A18] to-[#FF3CAC] text-white">
                                            <p className="text-sm font-medium mb-1 opacity-90">Package Price</p>
                                            <p className="text-3xl font-black">₹{confirmationData.hotel.price.toLocaleString()}</p>
                                            <p className="text-xs mt-1 opacity-80">Premium Package</p>
                                        </div>
                                    ) : (
                                        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white">
                                            <p className="text-lg font-bold">Free Booking Package</p>
                                            <p className="text-sm opacity-90">No charges apply</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>



                        {/* Action Buttons */}
                        <div className={`flex flex-col sm:flex-row gap-4 pt-6 transition-all duration-700 delay-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <button
                                onClick={() => window.print()}
                                className="flex-1 py-4 px-6 rounded-2xl bg-white border-2 border-gray-200 text-gray-900 font-bold hover:border-[#FF7A18] hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Download size={20} />
                                Print Confirmation
                            </button>
                            <button
                                onClick={() => {
                                    // Keep session ID logic if needed, but for "Home" usually we clear or reset.
                                    // User said "go back button", usually means the main CTA at bottom.
                                    router.push('/m');
                                }}
                                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF7A18] via-[#FF3CAC] to-[#784BA0] text-white font-bold shadow-[0_8px_24px_rgba(255,122,24,0.35)] hover:shadow-[0_12px_32px_rgba(255,122,24,0.45)] transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <Home size={20} />
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                .bg-gradient-radial {
                    background: radial-gradient(circle, var(--tw-gradient-stops));
                }
                @keyframes confetti {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-confetti {
                    animation: confetti linear forwards;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
