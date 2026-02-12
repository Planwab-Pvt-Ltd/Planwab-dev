'use client';

import Button from './Button';
import FloatingInput from './FloatingInput';
import { MapPin, Calendar, Users, Clock, Edit2, PhoneCall } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function BookingPage({ bookingFormData, setBookingFormData, bookingErrors, isBookingSubmitting, selectedHotel, handleBookingSubmit }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFF1EB] via-[#FAFAFA] to-[#ACE0F9] font-sans">
            {/* Hero Section with Radial Glow */}
            <div className="relative pt-24 pb-12 px-6 overflow-hidden">
                {/* Radial Gradient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-[rgba(255,122,24,0.15)] via-[rgba(255,60,172,0.1)] to-transparent blur-3xl pointer-events-none"></div>

                <div className={`relative z-10 text-center transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight bg-gradient-to-r from-[#FF7A18] via-[#FF3CAC] to-[#784BA0] bg-clip-text text-transparent drop-shadow-sm">
                        Complete Your Booking
                    </h1>
                    <p className="text-gray-700 text-lg font-medium max-w-md mx-auto">
                        Finalize the details for your perfect celebration ✨
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 pb-32">
                {/* Selected Venue Card - Glassmorphic */}
                {selectedHotel && (
                    <div className={`mb-6 transition-all duration-700 delay-100 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="relative bg-white/75 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(255,122,24,0.1)] overflow-hidden group hover:shadow-[0_12px_48px_rgba(0,0,0,0.12),0_4px_16px_rgba(255,122,24,0.15)] transition-all duration-300">
                            {/* Gradient Border Accent */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A18] via-[#FF3CAC] to-[#784BA0] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ padding: '1px', borderRadius: '24px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}></div>

                            <div className="relative p-5">
                                <div className="flex items-start gap-4">
                                    {/* Venue Image */}
                                    {selectedHotel.images && selectedHotel.images[0] && (
                                        <div className="w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg ring-2 ring-white/50">
                                            <img
                                                src={selectedHotel.images[0]}
                                                alt={selectedHotel.name}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}

                                    {/* Venue Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{selectedHotel.name}</h3>
                                        </div>

                                        <div className="flex items-center text-gray-600 text-sm mb-3">
                                            <MapPin size={14} className="mr-1.5 text-[#FF7A18]" />
                                            <span>{selectedHotel.location}</span>
                                        </div>

                                        {/* Badge */}
                                        {selectedHotel.isPaid && selectedHotel.price ? (
                                            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FF7A18] to-[#FF3CAC] text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-orange-200">
                                                <span>₹{selectedHotel.price.toLocaleString()}</span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-emerald-200">
                                                <span>Free Booking</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Event Details Form - Glassmorphic */}
                <div className={`transition-all duration-700 delay-200 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7A18] to-[#FF3CAC] flex items-center justify-center shadow-lg">
                            <Calendar size={16} className="text-white" />
                        </div>
                        Event Details
                    </h2>

                    <div className="relative bg-white/75 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(255,122,24,0.1)] p-6">
                        <form onSubmit={handleBookingSubmit} className="space-y-6">




                            {/* Number of Guests */}
                            <div className="group">
                                <FloatingInput
                                    label="Number of Guests"
                                    type="number"
                                    value={bookingFormData.guestCount}
                                    onChange={(e) => setBookingFormData({ ...bookingFormData, guestCount: e.target.value })}
                                    placeholder="Expected number of guests"
                                    error={bookingErrors.guestCount}
                                />
                            </div>

                            {/* Time Slot - Premium Selector */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Clock size={16} className="text-[#FF7A18]" />
                                    Preferred Time Slot
                                </label>
                                <select
                                    value={bookingFormData.timeSlot}
                                    onChange={(e) => setBookingFormData({ ...bookingFormData, timeSlot: e.target.value })}
                                    className={`w-full px-4 py-4 bg-white/80 border-2 rounded-2xl text-gray-900 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7A18] focus:border-transparent transition-all duration-200 hover:shadow-md active:scale-[0.99] ${bookingErrors.timeSlot ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#FF7A18]'
                                        }`}
                                >
                                    <option value="">Select a time slot</option>
                                    <option value="morning">🌅 Morning (9AM - 12PM)</option>
                                    <option value="afternoon">☀️ Afternoon (12PM - 4PM)</option>
                                    <option value="evening">🌆 Evening (4PM - 8PM)</option>
                                    <option value="night">🌙 Night (8PM - 12AM)</option>
                                </select>
                                {bookingErrors.timeSlot && (
                                    <p className="mt-2 text-sm text-red-500 font-medium">{bookingErrors.timeSlot}</p>
                                )}
                            </div>

                            {/* Special Requests - Elevated Textarea */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Special Requests <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <textarea
                                    className={`w-full px-4 py-4 bg-white/80 border-2 rounded-2xl text-gray-900 placeholder-gray-400 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7A18] focus:border-transparent transition-all duration-200 h-32 resize-none hover:shadow-md ${bookingErrors.specialRequests ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#FF7A18]'
                                        }`}
                                    value={bookingFormData.specialRequests}
                                    onChange={(e) => setBookingFormData({ ...bookingFormData, specialRequests: e.target.value })}
                                    placeholder="E.g., Birthday cake, specific seating, dietary requirements, decorations..."
                                />
                                {bookingErrors.specialRequests && (
                                    <p className="mt-2 text-sm text-red-500 font-medium">{bookingErrors.specialRequests}</p>
                                )}
                            </div>


                            {/* Confirmation Call Notice */}
                            <div className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white/60 shadow-sm p-4 group hover:shadow-md transition-all duration-300">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#FF7A18] to-[#FF3CAC]"></div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF7A18]/10 to-[#FF3CAC]/10 flex items-center justify-center flex-shrink-0">
                                        <PhoneCall size={20} className="text-[#FF7A18]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">Next Step</h4>
                                        <p className="text-sm text-gray-600 leading-snug mt-0.5">
                                            You will receive a call regarding booking confirmation from Us.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button - Premium Gradient with Glow */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isBookingSubmitting}
                                    className="relative w-full py-5 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-[#FF7A18] via-[#FF3CAC] to-[#784BA0] shadow-[0_8px_24px_rgba(255,122,24,0.35)] hover:shadow-[0_12px_32px_rgba(255,122,24,0.45)] transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                                >
                                    {/* Animated Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                                    <span className="relative flex items-center justify-center gap-2">
                                        {isBookingSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Confirm Booking
                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Custom Styles for Radial Gradient */}
            <style jsx>{`
                .bg-gradient-radial {
                    background: radial-gradient(circle, var(--tw-gradient-stops));
                }
            `}</style>
        </div>
    );
}
