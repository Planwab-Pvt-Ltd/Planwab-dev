import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, AnimatePresence, animate, useTransform } from 'framer-motion';
import { Check, CheckCircle, Feather, Award } from 'lucide-react';

const STEPS = [
    {
        title: '1. Share Your Vision',
        description: 'Tell us about your dream event. Our intuitive platform makes it easy to specify every detail, from guest count to aesthetic.',
        icon: Feather,
        content: (
            <div className="p-4 sm:p-6 h-full flex flex-col bg-white">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center mb-3 sm:mb-4">
                    <Feather className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 text-cyan-500" />
                    Crafting Your Brief
                </h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm flex-grow">
                    <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500">Event Type</p>
                        <p className="font-semibold text-gray-700">Beachside Wedding</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500">Location & Guests</p>
                        <p className="font-semibold text-gray-700">Goa, India ・ Approx. 200</p>
                    </div>
                </div>
                <button className="w-full mt-3 sm:mt-auto bg-cyan-500 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-cyan-600 transition-colors">
                    Get Started
                </button>
            </div>
        ),
    },
    {
        title: '2. Receive Curated Proposals',
        description: 'Forget endless searching. We match you with vetted, world-class vendors who are perfect for your event.',
        icon: Award,
        content: (
            <div className="p-4 sm:p-6 h-full flex flex-col bg-white">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center mb-3 sm:mb-4">
                    <Award className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 text-amber-500" />
                    Your Elite Vendor Matches
                </h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm flex-grow">
                    <div className="p-2 sm:p-3 bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
                        <p className="font-semibold text-gray-800">Taj Exotica Resort & Spa</p>
                        <p className="text-xs text-gray-500">Venue & Catering - ★ 4.9</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
                        <p className="font-semibold text-gray-800">Shutterdown Photography</p>
                        <p className="text-xs text-gray-500">Photography - ★ 5.0</p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: '3. Book with Confidence',
        description: 'Finalize your choices with transparent pricing and contracts. We secure your dream team, stress-free.',
        icon: CheckCircle,
        content: (
            <div className="p-4 sm:p-6 h-full flex flex-col items-center justify-center text-center bg-white">
                <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-green-50 rounded-full flex items-center justify-center mb-3 sm:mb-4 border-4 border-green-100">
                    <Check className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-green-500" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Booking Confirmed!</h3>
                <p className="text-gray-500 mt-1 sm:mt-2 text-xs sm:text-sm max-w-xs">Your perfect day is officially planned. Let the countdown begin!</p>
            </div>
        ),
    },
];

const HowItWorksSection = () => {
    const scrollContainerRef = useRef(null);
    const [activeStep, setActiveStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const touchStartRef = useRef(null);
    const isSwipingRef = useRef(false);
    const stepProgress = useMotionValue(0);

    const rotateX = useTransform(stepProgress, [0, 3], [5, -5]);
    const scale = useTransform(stepProgress, [0, 0.9, 2.1, 3], [0.95, 1, 1, 1.02]);
    const cardOpacity = useTransform(stepProgress, [0, 0.3, 2.7, 3], [0.8, 1, 1, 0.8]);
    const progressHeight = useTransform(stepProgress, [0, 1, 2, 3], ['0%', '33%', '66%', '100%']);

    const handleStepChange = (newStep) => {
        if (newStep !== activeStep && newStep >= 0 && newStep < STEPS.length && !isAnimating) {
            setIsAnimating(true);
            animate(stepProgress, newStep, { duration: 0.5, ease: 'easeOut' });
            setActiveStep(newStep);
            setTimeout(() => setIsAnimating(false), 500);
        }
    };

    const handleWheel = (e) => {
        if (isAnimating) {
            e.preventDefault();
            return;
        }
        const delta = e.deltaY;
        if (delta > 20) {
            if (activeStep < STEPS.length - 1) {
                handleStepChange(activeStep + 1);
                e.preventDefault();
            }
        } else if (delta < -20) {
            if (activeStep > 0) {
                handleStepChange(activeStep - 1);
                e.preventDefault();
            }
        }
    };

    const handleTouchStart = (e) => {
        touchStartRef.current = e.touches[0].clientY;
        isSwipingRef.current = false;
    };

    const handleTouchMove = (e) => {
        if (touchStartRef.current === null) return;
        const touchY = e.touches[0].clientY;
        const delta = touchStartRef.current - touchY;
        if (isSwipingRef.current) {
            e.preventDefault();
            return;
        }
        if (Math.abs(delta) > 30) {
            if (delta > 0 && activeStep < STEPS.length - 1 && !isAnimating) {
                handleStepChange(activeStep + 1);
                isSwipingRef.current = true;
                e.preventDefault();
            } else if (delta < 0 && activeStep > 0 && !isAnimating) {
                handleStepChange(activeStep - 1);
                isSwipingRef.current = true;
                e.preventDefault();
            }
        }
    };

    const handleTouchEnd = () => {
        touchStartRef.current = null;
        isSwipingRef.current = false;
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.1, rootMargin: '-10% 0px 0px 0px' }
        );
        if (scrollContainerRef.current) {
            observer.observe(scrollContainerRef.current);
        }
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isInView) return;
        document.addEventListener('wheel', handleWheel, { passive: false });
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });
        return () => {
            document.removeEventListener('wheel', handleWheel);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isInView, activeStep, isAnimating]);

    return (
        <section ref={scrollContainerRef} className="relative min-h-screen py-8 sm:py-12 md:py-16">
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-white via-amber-25 to-amber-50 px-4 sm:px-6 md:px-8">
                <div className="w-full max-w-[90rem] mx-auto py-6 sm:py-8 md:py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="text-center mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto"
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                            Your Dream Wedding, Simplified
                        </h2>
                        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600">
                            From vision to reality in three seamless steps. We handle the details so you can cherish the moments.
                        </p>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center">
                        <div className="w-full lg:w-1/2">
                            <div className="flex flex-col">
                                {STEPS.map((step, i) => {
                                    const isActive = activeStep === i;
                                    const isCompleted = activeStep > i;

                                    return (
                                        <motion.div
                                            key={step.title}
                                            className="flex items-start gap-4 sm:gap-6 py-4 sm:py-6 md:py-8"
                                            style={{
                                                opacity: useTransform(
                                                    stepProgress,
                                                    [i - 0.3, i, i + 0.3],
                                                    [0.4, 1, activeStep === STEPS.length - 1 && i === STEPS.length - 1 ? 1 : 0.4]
                                                )
                                            }}
                                        >
                                            <motion.div
                                                className="relative z-10 flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg border-4 transition-all duration-500"
                                                style={{
                                                    borderColor: isActive || isCompleted ? '#F9A8D4' : '#F3F4F6',
                                                    backgroundColor: isActive || isCompleted ? '#DB2777' : 'white',
                                                    color: isActive || isCompleted ? 'white' : '#6B7280',
                                                }}
                                                animate={{
                                                    scale: isActive ? 1.1 : 1,
                                                    boxShadow: isActive ? '0 0 20px rgba(219, 39, 119, 0.3)' : '0 0 0px rgba(219, 39, 119, 0)',
                                                }}
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                            >
                                                {isCompleted ? (
                                                    <Check className="w-4 sm:w-5 h-4 sm:h-5" />
                                                ) : (
                                                    <step.icon className="w-4 sm:w-5 h-4 sm:h-5" />
                                                )}
                                            </motion.div>

                                            <motion.div
                                                className="flex-1 min-w-0"
                                                animate={{
                                                    scale: isActive ? 1.02 : 1,
                                                }}
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                            >
                                                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 leading-tight">
                                                    {step.title}
                                                </h3>
                                                <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </motion.div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        <motion.div
                            className="w-full lg:w-1/2"
                            style={{
                                perspective: '1000px',
                                opacity: cardOpacity,
                            }}
                        >
                            <motion.div
                                className="w-full aspect-[4/5] max-h-[28rem] sm:max-h-[32rem] md:max-h-[36rem] rounded-lg sm:rounded-xl lg:rounded-2xl bg-white border border-gray-200/60 shadow-xl overflow-hidden"
                                style={{
                                    rotateX,
                                    scale,
                                }}
                                animate={{
                                    boxShadow: '0 15px 30px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                                }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeStep}
                                        className="absolute inset-0 w-full h-full"
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                            transition: {
                                                duration: 0.5,
                                                ease: 'easeOut',
                                                delay: 0.1
                                            }
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -20,
                                            scale: 1.05,
                                            transition: {
                                                duration: 0.3,
                                                ease: 'easeIn'
                                            }
                                        }}
                                    >
                                        {STEPS[activeStep].content}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;