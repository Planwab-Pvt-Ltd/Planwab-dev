import React from 'react';
import { ArrowLeft, Search, Calendar, Users, Clock, MessageSquare, User, Phone, CheckCircle, MapPin } from 'lucide-react';
import CelebrationCardsGrid from './CelebrationCardsGrid';

// Reusable Input Component
const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-2">
        <label className="text-gray-600 dark:text-gray-400 text-sm font-medium ml-1">{label}</label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon size={18} />
            </div>
            <input
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all shadow-sm dark:shadow-none"
                {...props}
            />
        </div>
    </div>
);

export default function CampaignDetailsPanel({
    step,
    userForm,
    bookingForm,
    handlers,
    data
}) {
    const {
        handleUserSubmit,
        handleBookingSubmit,
        setSearchQuery,
        handleSelectHotel
    } = handlers;

    const {
        userFormData, setUserFormData, userErrors, isUserSubmitting,
        bookingFormData, setBookingFormData, bookingErrors, isBookingSubmitting,
        searchQuery, freeHotels, paidHotels, isHotelsLoading, confirmationData, selectedHotel
    } = data;

    // --- RENDERERS ---

    const renderUserForm = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Let's Get Started</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Tell us a bit about yourself to begin planning.</p>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-6">
                <InputField
                    label="Comparison Name"
                    icon={User}
                    placeholder="Enter full name"
                    value={userFormData.name}
                    onChange={e => setUserFormData({ ...userFormData, name: e.target.value })}
                />
                {userErrors.name && <p className="text-rose-500 text-sm">{userErrors.name}</p>}

                <InputField
                    label="Phone Number"
                    icon={Phone}
                    placeholder="10-digit mobile number"
                    type="tel"
                    value={userFormData.phone}
                    onChange={e => setUserFormData({ ...userFormData, phone: e.target.value })}
                />
                {userErrors.phone && <p className="text-rose-500 text-sm">{userErrors.phone}</p>}

                <InputField
                    label="Birthday Date"
                    icon={Calendar}
                    type="date"
                    value={userFormData.birthdayDate}
                    onChange={e => setUserFormData({ ...userFormData, birthdayDate: e.target.value })}
                />
                {userErrors.birthdayDate && <p className="text-rose-500 text-sm">{userErrors.birthdayDate}</p>}

                <button
                    type="submit"
                    disabled={isUserSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-lg text-white shadow-lg shadow-purple-900/20 dark:shadow-purple-900/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isUserSubmitting ? 'Saving...' : 'Explore Venues'}
                </button>
            </form>
        </div>
    );

    const renderHotels = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Select Venue</h2>
                <p className="text-gray-600 dark:text-gray-400">Find the perfect spot for your celebration.</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search venues..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white shadow-sm dark:shadow-none focus:border-pink-500 transition-colors"
                />
            </div>

            <CelebrationCardsGrid
                freeHotels={freeHotels}
                paidHotels={paidHotels}
                isLoading={isHotelsLoading}
                onSelect={handleSelectHotel}
            />
        </div>
    );

    const renderBookingForm = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Final Details</h2>
                <p className="text-gray-600 dark:text-gray-400">Customize your event specifics.</p>
            </div>



            {selectedHotel && (
                <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10 space-y-3 shadow-sm dark:shadow-none mb-8">
                    <div className="flex items-start gap-4">
                        <img
                            src={selectedHotel.images[0] || '/placeholder.jpg'}
                            alt={selectedHotel.name}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{selectedHotel.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <MapPin size={12} /> {selectedHotel.location}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        label="Event Date"
                        icon={Calendar}
                        type="date"
                        value={bookingFormData.eventDate}
                        onChange={e => setBookingFormData({ ...bookingFormData, eventDate: e.target.value })}
                    />
                    <InputField
                        label="Guests"
                        icon={Users}
                        type="number"
                        placeholder="Count"
                        value={bookingFormData.guestCount}
                        onChange={e => setBookingFormData({ ...bookingFormData, guestCount: e.target.value })}
                    />
                </div>
                {bookingErrors.eventDate && <p className="text-rose-500 text-sm">{bookingErrors.eventDate}</p>}
                {bookingErrors.guestCount && <p className="text-rose-500 text-sm">{bookingErrors.guestCount}</p>}

                <InputField
                    label="Preferred Time"
                    icon={Clock}
                    type="time"
                    value={bookingFormData.timeSlot}
                    onChange={e => setBookingFormData({ ...bookingFormData, timeSlot: e.target.value })}
                />
                {bookingErrors.timeSlot && <p className="text-rose-500 text-sm">{bookingErrors.timeSlot}</p>}

                <div className="space-y-2">
                    <label className="text-gray-600 dark:text-gray-400 text-sm font-medium ml-1">Special Requests</label>
                    <textarea
                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-pink-500/50 min-h-[120px] shadow-sm dark:shadow-none"
                        placeholder="Dietary restrictions, decorations, etc."
                        value={bookingFormData.specialRequests}
                        onChange={e => setBookingFormData({ ...bookingFormData, specialRequests: e.target.value })}
                    />
                    {bookingErrors.specialRequests && <p className="text-rose-500 text-sm">{bookingErrors.specialRequests}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isBookingSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl font-bold text-lg text-white shadow-lg shadow-pink-900/20 dark:shadow-pink-900/40 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isBookingSubmitting ? 'Confirming...' : 'Confirm Booking'}
                </button>
            </form>
        </div>
    );

    const renderConfirmation = () => {
        if (!confirmationData) return null;
        return (
            <div className="text-center space-y-8 animate-in zoom-in duration-500 py-10">
                <div className="w-24 h-24 bg-green-500/10 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48} className="text-green-600 dark:text-green-500" />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-600 mb-2">IT'S OFFICIAL!</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">Your birthday bash is booked.</p>
                </div>

                <div className="bg-gray-100 dark:bg-white/10 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-md border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Booking ID: {confirmationData.bookingId}</h3>
                    <p className="text-gray-600 dark:text-gray-400">We've sent the details to your phone.</p>
                </div>

                <button
                    onClick={() => window.print()}
                    className="px-8 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl font-semibold text-gray-900 dark:text-white transition-colors"
                >
                    Download Receipt
                </button>
            </div>
        );
    }

    return (
        <div className="pt-4">
            {step === 'home' && renderUserForm()}
            {step === 'hotels' && renderHotels()}
            {step === 'booking' && renderBookingForm()}
            {step === 'confirmation' && renderConfirmation()}
        </div>
    );
}
