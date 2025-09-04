'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useAnimationControls, useMotionValue } from 'framer-motion';
import {
    Star,
    ChevronLeft,
    ChevronRight,
    MessageSquarePlus,
    X,
    Quote,
    Calendar,
    Heart,
    MapPin,
    Users,
    Camera,
    Brush,
    UserCheck,
    Sparkles,
    Award,
    CheckCircle
} from 'lucide-react';

const testimonialsData = [
    {
        id: 1,
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c913?w=150&q=80',
        eventType: 'Wedding',
        eventDate: '2024-03-15',
        location: 'Udaipur, Rajasthan',
        guests: 450,
        rating: 5,
        testimonial: 'EventCraft made our dream wedding come true! The vendors they connected us with were absolutely phenomenal. From the breathtaking venue at The Marble Palace to the incredible photography by Rohan Mehta, every detail was perfect. The planning process was seamless and stress-free.',
        vendorUsed: 'The Marble Palace, Rohan Mehta Photography',
        verified: true,
        featured: true
    },
    {
        id: 2,
        name: 'Rajesh & Meera Gupta',
        email: 'rajesh.gupta@email.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
        eventType: 'Anniversary',
        eventDate: '2024-01-20',
        location: 'Goa',
        guests: 150,
        rating: 5,
        testimonial: 'Our 25th anniversary celebration was magical thanks to EventCraft. Coastal Dreams Resort provided the perfect beachside setting, and Bloom & Petal created the most romantic floral arrangements. Highly recommend!',
        vendorUsed: 'Coastal Dreams Resort, Bloom & Petal',
        verified: true,
        featured: false
    },
    {
        id: 3,
        name: 'Ananya Singh',
        email: 'ananya.singh@email.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
        eventType: 'Birthday',
        eventDate: '2024-02-10',
        location: 'Mumbai',
        guests: 80,
        rating: 4,
        testimonial: 'Amazing experience planning my milestone birthday party! The Event Architects understood my vision perfectly and executed it flawlessly. The decorations by The Gilded Lily were absolutely stunning.',
        vendorUsed: 'The Event Architects, The Gilded Lily',
        verified: true,
        featured: false
    },
    {
        id: 4,
        name: 'Vikram Patel',
        email: 'vikram.patel@email.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
        eventType: 'Corporate Event',
        eventDate: '2024-02-28',
        location: 'Bangalore',
        guests: 300,
        rating: 5,
        testimonial: 'Professional service from start to finish. EventCraft helped us find the perfect venue and vendors for our annual company retreat. Everything was organized perfectly and within budget.',
        vendorUsed: 'Multiple Vendors',
        verified: true,
        featured: true
    },
    {
        id: 5,
        name: 'Kavita Joshi',
        email: 'kavita.joshi@email.com',
        avatar: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&q=80',
        eventType: 'Wedding',
        eventDate: '2024-01-05',
        location: 'Jaipur',
        guests: 600,
        rating: 5,
        testimonial: 'EventCraft exceeded all our expectations! Priya Sharma was an incredible planner who managed every detail perfectly. The photography by Frames & Vows captured our special moments beautifully.',
        vendorUsed: 'Priya Sharma Events, Frames & Vows',
        verified: true,
        featured: false
    },
    {
        id: 6,
        name: 'Rohit Malhotra',
        email: 'rohit.malhotra@email.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
        eventType: 'Engagement',
        eventDate: '2024-03-01',
        location: 'Delhi',
        guests: 200,
        rating: 4,
        testimonial: 'Great platform with excellent vendor options. The booking process was smooth and the customer support was very helpful throughout our engagement planning journey.',
        vendorUsed: 'Various Vendors',
        verified: true,
        featured: false
    }
];

const eventTypeIcons = {
    Wedding: <Heart size={14} className="text-rose-500" />,
    Anniversary: <Calendar size={14} className="text-amber-500" />,
    Birthday: <Sparkles size={14} className="text-purple-500" />,
    'Corporate Event': <Users size={14} className="text-blue-500" />,
    Engagement: <Award size={14} className="text-pink-500" />
};

const ViewTestimonialModal = ({ testimonial, onClose }) => {
    if (!testimonial) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white/95 backdrop-blur-sm rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-amber-200/20"
            >
                <div className="grid md:grid-cols-5">
                    <div className="md:col-span-2 bg-gradient-to-br from-amber-50 to-yellow-50 p-8 flex flex-col items-center justify-center text-center border-r border-amber-200/30">
                        <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-28 h-28 mb-6 rounded-full object-cover border-4 border-white shadow-lg"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b332c913?w=150&q=80';
                            }}
                        />

                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{testimonial.name}</h3>
                            {testimonial.verified && (
                                <CheckCircle size={20} className="text-emerald-500" />
                            )}
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{testimonial.email}</p>

                        {testimonial.featured && (
                            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 flex items-center gap-1">
                                <Award size={12} />
                                Featured Review
                            </div>
                        )}

                        <div className="space-y-3 text-left w-full text-sm">
                            <div className="flex items-center gap-3 text-gray-700 bg-white/50 rounded-xl p-3">
                                {eventTypeIcons[testimonial.eventType] || <Calendar size={14} />}
                                <div>
                                    <p className="font-semibold">{testimonial.eventType}</p>
                                    <p className="text-xs text-gray-500">{new Date(testimonial.eventDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-gray-700 bg-white/50 rounded-xl p-3">
                                <MapPin size={14} className="text-emerald-500" />
                                <div>
                                    <p className="font-semibold">{testimonial.location}</p>
                                    <p className="text-xs text-gray-500">{testimonial.guests} guests</p>
                                </div>
                            </div>

                            <div className="bg-white/50 rounded-xl p-3">
                                <p className="font-semibold text-gray-700 mb-1">Vendors Used:</p>
                                <p className="text-xs text-gray-600">{testimonial.vendorUsed}</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-3 p-8 flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={20}
                                        className={`${i < testimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-2xl font-bold text-amber-600">{testimonial.rating}.0</span>
                        </div>

                        <div className="relative flex-grow">
                            <Quote className="absolute -top-2 -left-2 w-12 h-12 text-amber-200" />
                            <p className="relative text-gray-800 text-lg leading-relaxed pl-6">
                                {testimonial.testimonial}
                            </p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Event Date: {new Date(testimonial.eventDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200 shadow-lg"
                >
                    <X size={18} />
                </button>
            </motion.div>
        </motion.div>
    );
};

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMarqueeActive, setIsMarqueeActive] = useState(false);
    const [viewModalData, setViewModalData] = useState(null);

    useEffect(() => {
        const loadTestimonials = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setTestimonials(testimonialsData);
            setIsLoading(false);
        };
        loadTestimonials();
    }, []);

    useEffect(() => {
        if (viewModalData) {
            document.body.style.overflow = "hidden";
            controls.stop();
        } else {
            document.body.style.overflow = "auto";
            if (!hoverRef.current && isMarqueeActive) {
                startMarquee();
            }
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [viewModalData]);

    const containerRef = useRef(null);
    const contentRef = useRef(null);

    const duplicatedTestimonials = useMemo(
        () => (isMarqueeActive ? [...testimonials, ...testimonials] : testimonials),
        [testimonials, isMarqueeActive]
    );

    const CARD_WIDTH = 400;
    const GAP = 24;
    const TOTAL_CARD_WIDTH = CARD_WIDTH + GAP;
    const MARQUEE_DURATION = 45;

    const controls = useAnimationControls();
    const x = useMotionValue(0);
    const hoverRef = useRef(false);

    const totalWidth = TOTAL_CARD_WIDTH * testimonials.length;

    const startMarquee = () => {
        if (!isMarqueeActive) return;
        controls.start({
            x: -totalWidth,
            transition: {
                duration: MARQUEE_DURATION,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
            },
        });
    };

    useEffect(() => {
        if (isLoading || testimonials.length === 0) return;

        const checkWidth = () => {
            if (containerRef.current && contentRef.current) {
                const contentWidth = contentRef.current.scrollWidth;
                const containerWidth = containerRef.current.offsetWidth;
                setIsMarqueeActive(contentWidth > containerWidth);
            }
        };

        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, [isLoading, testimonials]);

    useEffect(() => {
        if (isMarqueeActive && !viewModalData) {
            startMarquee();
        } else {
            controls.stop();
            x.set(0);
        }
    }, [isMarqueeActive, viewModalData]);

    const handleMouseEnter = () => {
        if (!isMarqueeActive) return;
        hoverRef.current = true;
        controls.stop();
    };

    const handleMouseLeave = () => {
        if (!isMarqueeActive) return;
        hoverRef.current = false;
        startMarquee();
    };

    const handleNavigation = (direction) => {
        if (!isMarqueeActive) return;
        controls.stop();
        const currentX = x.get();
        let targetX = direction === "next"
            ? currentX - TOTAL_CARD_WIDTH
            : currentX + TOTAL_CARD_WIDTH;
        targetX = Math.min(0, targetX);

        controls.start({
            x: targetX,
            transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] },
        }).then(() => {
            if (totalWidth > 0) {
                const finalX = x.get();
                const wrappedX = finalX % totalWidth;
                if (finalX !== wrappedX) {
                    x.set(wrappedX);
                }
            }
            if (!hoverRef.current) {
                startMarquee();
            }
        });
    };

    return (
        <section className="py-24 bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.06),transparent_50%)]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-16"
                >
                    <div className="text-center lg:text-left">

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-gray-900 via-amber-800 to-gray-900 bg-clip-text text-transparent">
                                What Our Clients
                            </span>
                            <span className="block bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                                Are Saying
                            </span>
                        </h2>

                        <p className="text-gray-700 text-lg max-w-2xl leading-relaxed">
                            Real stories from couples and event hosts who trusted EventCraft to make their special moments unforgettable.
                        </p>
                    </div>

                    <div className="flex-shrink-0 flex items-center justify-center lg:justify-start gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <span className="flex items-center gap-2">
                                <MessageSquarePlus size={18} />
                                Share Your Story
                            </span>
                        </motion.button>

                        {isMarqueeActive && (
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleNavigation("prev")}
                                    className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl text-amber-600 hover:bg-white hover:text-amber-700 transition-all duration-300 shadow-lg"
                                >
                                    <ChevronLeft size={20} />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleNavigation("next")}
                                    className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl text-amber-600 hover:bg-white hover:text-amber-700 transition-all duration-300 shadow-lg"
                                >
                                    <ChevronRight size={20} />
                                </motion.button>
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    {isMarqueeActive && (
                        <>
                            <div className="absolute -inset-y-4 left-0 w-24 z-10 bg-gradient-to-r from-amber-50/80 via-amber-50/40 to-transparent pointer-events-none" />
                            <div className="absolute -inset-y-4 right-0 w-24 z-10 bg-gradient-to-l from-amber-50/80 via-amber-50/40 to-transparent pointer-events-none" />
                        </>
                    )}

                    {isLoading ? (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center gap-3 text-amber-600">
                                <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-lg font-medium">Loading testimonials...</span>
                            </div>
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-16 border border-amber-200/50">
                            <Quote size={48} className="mx-auto mb-6 text-amber-300" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Reviews Yet</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Be the first to share your amazing event experience with EventCraft.
                            </p>
                        </div>
                    ) : (
                        <div
                            ref={containerRef}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className={`flex gap-6 ${isMarqueeActive ? "overflow-hidden cursor-grab active:cursor-grabbing" : "justify-center flex-wrap"}`}
                        >
                            <motion.div
                                ref={contentRef}
                                className="flex shrink-0 gap-6"
                                animate={controls}
                                style={{ x }}
                            >
                                {duplicatedTestimonials.map((testimonial, index) => (
                                    <motion.div
                                        key={`${testimonial.id}-${index}`}
                                        onClick={() => setViewModalData(testimonial)}
                                        className="w-[350px] sm:w-[400px] shrink-0 bg-white/90 backdrop-blur-sm rounded-3xl border border-amber-200/50 p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-amber-300 hover:bg-white group"
                                        whileHover={{ y: -5, scale: 1.02 }}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={testimonial.avatar}
                                                    alt={testimonial.name}
                                                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-200 shadow-md group-hover:border-amber-300 transition-all duration-300"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b332c913?w=150&q=80';
                                                    }}
                                                />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                                                        {testimonial.verified && (
                                                            <CheckCircle size={16} className="text-emerald-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 text-sm">{testimonial.email}</p>
                                                </div>
                                            </div>

                                            {testimonial.featured && (
                                                <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    Featured
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={`${i < testimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                                                />
                                            ))}
                                            <span className="text-sm font-semibold text-amber-600 ml-1">
                                                {testimonial.rating}.0
                                            </span>
                                        </div>

                                        <p className="text-gray-700 leading-relaxed mb-4 text-sm line-clamp-3">
                                            "{testimonial.testimonial.substr(0, 120)}..."
                                        </p>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                {eventTypeIcons[testimonial.eventType]}
                                                <span className="font-medium">{testimonial.eventType}</span>
                                                <span className="text-gray-400">•</span>
                                                <span>{testimonial.location}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Users size={12} />
                                                    <span>{testimonial.guests} guests</span>
                                                </div>
                                                <span>{new Date(testimonial.eventDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </div>

            {viewModalData && (
                <ViewTestimonialModal
                    testimonial={viewModalData}
                    onClose={() => setViewModalData(null)}
                />
            )}
        </section>
    );
};

export default Testimonials;