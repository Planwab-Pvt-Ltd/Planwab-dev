import React from 'react';
import { Star, MapPin, Gift, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DesktopHotelCard = ({ hotel, onSelect, type }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="group relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-pink-500/50 dark:hover:border-pink-500/50 transition-all duration-300 cursor-pointer shadow-sm dark:shadow-none hover:shadow-md"
        onClick={() => onSelect(hotel)}
    >
        <div className="h-48 overflow-hidden relative">
            <img
                src={hotel.images[0] || '/placeholder.jpg'}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${type === 'premium'
                    ? 'bg-amber-500/90 text-white shadow-lg'
                    : 'bg-emerald-500/90 text-white shadow-lg'
                    }`}>
                    {type === 'premium' ? 'Premium' : 'Free Booking'}
                </span>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-transparent transition-colors duration-300"></div>
        </div>

        <div className="p-5">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{hotel.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 mb-4">
                <MapPin size={14} /> {hotel.location}
            </p>

            <div className="flex items-center justify-between">
                <div>
                    {hotel.price ? (
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-500">Starting from</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">₹{hotel.price.toLocaleString()}</span>
                        </div>
                    ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Free Booking</span>
                    )}
                </div>
                <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-pink-600 dark:group-hover:bg-pink-600 transition-colors text-gray-400 dark:text-white group-hover:text-white">
                    <CheckCircle size={20} />
                </button>
            </div>
        </div>
    </motion.div>
);

export default function CelebrationCardsGrid({ freeHotels, paidHotels, onSelect, isLoading }) {
    if (isLoading) {
        return <div className="text-gray-500 dark:text-white text-center py-20">Loading venues...</div>;
    }

    return (
        <div className="space-y-10">
            {/* Free Section */}
            {freeHotels?.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Gift size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Free Booking Places</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {freeHotels.map(hotel => (
                            <DesktopHotelCard key={hotel._id} hotel={hotel} type="free" onSelect={onSelect} />
                        ))}
                    </div>
                </section>
            )}

            {/* Premium Section */}
            {paidHotels?.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <Star size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Premium Experiences</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paidHotels.map(hotel => (
                            <DesktopHotelCard key={hotel._id} hotel={hotel} type="premium" onSelect={onSelect} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
