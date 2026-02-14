'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

// Desktop UI Components
import DesktopBirthdayLayout from '../ui/birthdayCampaign/DesktopBirthdayLayout';
import BirthdayHeroSection from '../ui/birthdayCampaign/BirthdayHeroSection';
import CampaignDetailsPanel from '../ui/birthdayCampaign/CampaignDetailsPanel';

// Validation functions (Copied from Mobile)
const validateUserDetails = (formData) => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';

    if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        errors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.birthdayDate) errors.birthdayDate = 'Birthday date is required';
    return errors;
};

const validateBookingDetails = (formData) => {
    const errors = {};
    if (!formData.eventDate) errors.eventDate = 'Event date is required';
    if (!formData.guestCount) {
        errors.guestCount = 'Number of guests is required';
    } else if (parseInt(formData.guestCount) < 1) {
        errors.guestCount = 'Must have at least 1 guest';
    }
    if (!formData.timeSlot) errors.timeSlot = 'Time slot is required';
    if (!formData.specialRequests.trim()) errors.specialRequests = 'Special requests are required';
    return errors;
};

// Debounce hook (Copied)
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

export default function BirthdayPlannerWrapper() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentStep = searchParams.get('step') || 'home';
    const sessionId = searchParams.get('sessionId');

    // Loading State for Hydration
    const [isHydrating, setIsHydrating] = useState(true);

    // Page 1: User Details State
    const [userFormData, setUserFormData] = useState({
        name: '',
        phone: '',
        birthdayDate: ''
    });
    const [userErrors, setUserErrors] = useState({});
    const [isUserSubmitting, setIsUserSubmitting] = useState(false);

    // Page 2: Hotels State
    const [searchQuery, setSearchQuery] = useState('');
    const [freeHotels, setFreeHotels] = useState([]);
    const [paidHotels, setPaidHotels] = useState([]);
    const [isHotelsLoading, setIsHotelsLoading] = useState(true);
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Page 3: Booking State
    const [bookingFormData, setBookingFormData] = useState({
        eventDate: '', guestCount: '', timeSlot: '', specialRequests: ''
    });
    const [bookingErrors, setBookingErrors] = useState({});
    const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);

    // Page 4: Confirmation State
    const [confirmationData, setConfirmationData] = useState(null);

    // Hydrate State from Backend 
    useEffect(() => {
        const fetchBookingState = async () => {
            if (!sessionId) {
                setIsHydrating(false);
                return;
            }

            try {
                const response = await fetch(`/api/vendor/requests/birthday-routes?sessionId=${sessionId}`);
                const data = await response.json();

                if (response.ok && data.success && data.data) {
                    const booking = data.data;

                    // 1. Restore User Details
                    if (booking.userDetails) {
                        setUserFormData({
                            name: booking.userDetails.name || '',
                            phone: booking.userDetails.phone || '',
                            birthdayDate: booking.userDetails.birthdayDate ? new Date(booking.userDetails.birthdayDate).toISOString().split('T')[0] : ''
                        });
                    }

                    // 2. Restore Selected Hotel
                    if (booking.venueId) {
                        setSelectedHotel({
                            _id: booking.venueId,
                            name: booking.venueName,
                            location: booking.venueLocation,
                            price: booking.venuePrice,
                            isPaid: (booking.venuePrice || 0) >= 60000,
                            images: []
                        });
                    }

                    // 3. Restore Booking Details
                    if (booking.bookingDetails) {
                        setBookingFormData({
                            eventDate: booking.bookingDetails.eventDate ? new Date(booking.bookingDetails.eventDate).toISOString().split('T')[0] : '',
                            guestCount: booking.bookingDetails.guestCount || '',
                            timeSlot: booking.bookingDetails.timeSlot || '',
                            specialRequests: booking.bookingDetails.specialRequests || ''
                        });
                    }

                    // 4. Restore Confirmation Data
                    if (booking.status === 'completed' || booking.bookingId) {
                        setConfirmationData({
                            bookingId: booking.bookingId || booking._id,
                            hotel: {
                                name: booking.venueName,
                                location: booking.venueLocation,
                                price: booking.venuePrice,
                                isPaid: (booking.venuePrice || 0) >= 60000
                            },
                            bookingDetails: booking.bookingDetails || {},
                        });
                    }

                    // Pre-calculate Event Date
                    if (booking.userDetails?.birthdayDate && (!booking.bookingDetails || !booking.bookingDetails.eventDate)) {
                        const birthday = new Date(booking.userDetails.birthdayDate);
                        const currentYear = new Date().getFullYear();
                        const eventDate = new Date(currentYear, birthday.getMonth(), birthday.getDate());
                        setBookingFormData(prev => ({
                            ...prev,
                            eventDate: eventDate.toISOString().split('T')[0]
                        }));
                    }
                }
            } catch (error) {
                console.error("Failed to hydrate session:", error);
            } finally {
                setIsHydrating(false);
            }
        };

        fetchBookingState();
    }, [sessionId]);

    // Route Protection
    useEffect(() => {
        if (isHydrating) return;

        // NOTE: Adjusted redirects for Desktop routes (removed /m/ prefix logic, relies on relative or absolute path)
        // Actually, user said "Maintain the same page path and behavior."
        // But /m/ is for mobile. Desktop path is /events/...
        // I need to use the correct base path for redirection.
        // Assuming the page is accessed at /events/[category]/birthday-planner

        // Since I don't know the category easily here without params hook (which is available only in page),
        // I will use window.location or just relative paths if possible.
        // The mobile implementation used hardcoded `/m/events/birthday-planner`.
        // I should probably make it dynamic or use `pathname`.

        const basePath = pathname.split('?')[0]; // Current path without params

        if (currentStep === 'hotels' || currentStep === 'booking') {
            if (!sessionId) {
                toast.error('Session expired or invalid.');
                router.push(basePath);
            } else if (!userFormData.name) {
                // strict check skipped as per mobile
            }
        }

        if (currentStep === 'booking' && !selectedHotel && !isHydrating) {
            if (sessionId) {
                toast.error('Please select a hotel first');
                router.push(`${basePath}?step=hotels&sessionId=${sessionId}`);
            }
        }

    }, [currentStep, sessionId, isHydrating, selectedHotel, confirmationData, router, userFormData.name, pathname]);


    // Page 1: Handle User Form Submit
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const errors = validateUserDetails(userFormData);
        if (Object.keys(errors).length > 0) {
            setUserErrors(errors);
            return;
        }
        setIsUserSubmitting(true);
        try {
            const newSessionId = (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'session_' + Date.now());

            const response = await fetch('/api/vendor/requests/birthday-routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: newSessionId,
                    userDetails: userFormData
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Server Error details:", data);
                throw new Error(data.details || data.error || 'Failed to create booking');
            }

            const birthday = new Date(userFormData.birthdayDate);
            const currentYear = new Date().getFullYear();
            const eventDate = new Date(currentYear, birthday.getMonth(), birthday.getDate());
            const eventDateString = eventDate.toISOString().split('T')[0];

            setBookingFormData(prev => ({
                ...prev,
                eventDate: eventDateString
            }));

            toast.success('Details saved successfully! 🎉');
            const basePath = pathname.split('?')[0];
            router.push(`${basePath}?step=hotels&sessionId=${newSessionId}`);
        } catch (error) {
            console.error('Submission Error:', error);
            toast.error(error.message || 'Failed to save details.');
        } finally {
            setIsUserSubmitting(false);
        }
    };

    // Page 2: Fetch Venues
    useEffect(() => {
        const fetchVenues = async () => {
            try {
                setIsHotelsLoading(true);
                let url = '/api/vendor?categories=venues&limit=50&sortBy=rating';
                if (debouncedSearch) {
                    url += `&search=${encodeURIComponent(debouncedSearch)}`;
                }
                const response = await fetch(url);
                const data = await response.json();

                if (data.success && data.data) {
                    const venues = data.data;
                    const free = [];
                    const paid = [];

                    venues.forEach(vendor => {
                        const price = vendor.normalizedPrice ||
                            vendor.perDayPrice?.min ||
                            vendor.basePrice ||
                            vendor.price?.min ||
                            vendor.startingPrice ||
                            0;

                        const normalizedVendor = {
                            _id: vendor._id,
                            name: vendor.name,
                            location: vendor.address?.city || vendor.location || 'Location Unavailable',
                            isPaid: price >= 60000,
                            images: vendor.images?.length > 0 ? vendor.images : (vendor.defaultImage ? [vendor.defaultImage] : ['/placeholder.jpg']),
                            price: price > 0 ? price : null
                        };

                        if (price >= 60000) {
                            paid.push(normalizedVendor);
                        } else {
                            free.push(normalizedVendor);
                        }
                    });

                    free.sort((a, b) => (a.price || 0) - (b.price || 0));
                    paid.sort((a, b) => (b.price || 0) - (a.price || 0));

                    setFreeHotels(free.slice(0, 4));
                    setPaidHotels(paid.slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to fetch venues:", error);
                toast.error("Failed to load venues");
            } finally {
                setIsHotelsLoading(false);
            }
        };

        if (currentStep === 'hotels') {
            fetchVenues();
        }
    }, [currentStep, debouncedSearch]);

    // Page 2: Handle Hotel Selection
    const handleSelectHotel = async (hotel) => {
        if (!sessionId) {
            toast.error("Session missing. Please restart.");
            return;
        }

        try {
            setSelectedHotel(hotel); // Optimistic

            const response = await fetch('/api/vendor/requests/birthday-routes', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    venueId: hotel._id,
                    venueName: hotel.name,
                    venueLocation: hotel.location,
                    venuePrice: hotel.price
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save venue selection');
            }

            toast.success('Hotel selected! 🎉');
            const basePath = pathname.split('?')[0];
            router.push(`${basePath}?step=booking&sessionId=${sessionId}`);
        } catch (error) {
            console.error("Hotel Selection Error:", error);
            toast.error("Failed to save selection. Please try again.");
        }
    };

    // Page 3: Handle Booking Submit
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        const errors = validateBookingDetails(bookingFormData);
        if (Object.keys(errors).length > 0) {
            setBookingErrors(errors);
            return;
        }
        setIsBookingSubmitting(true);
        try {
            if (!sessionId) throw new Error("Session ID missing");

            const response = await fetch('/api/vendor/requests/birthday-routes', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    bookingDetails: bookingFormData
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to confirm booking');
            }

            const confirmation = {
                bookingId: data.data.bookingId || data.data._id || 'BK' + Date.now(),
                hotel: selectedHotel,
                userDetails: userFormData,
                bookingDetails: bookingFormData,
                timestamp: new Date().toISOString()
            };
            setConfirmationData(confirmation);
            toast.success('Booking confirmed! 🎊');
            const basePath = pathname.split('?')[0];
            router.push(`${basePath}?step=confirmation&sessionId=${sessionId}`);
        } catch (error) {
            console.error("Booking Confirmation Error:", error);
            toast.error(error.message || 'Failed to confirm booking.');
        } finally {
            setIsBookingSubmitting(false);
        }
    };

    return (
        <DesktopBirthdayLayout
            hero={<BirthdayHeroSection />}

        >
            <CampaignDetailsPanel
                step={currentStep}
                userForm={{ userFormData, userErrors, isUserSubmitting }}
                bookingForm={{ bookingFormData, bookingErrors, isBookingSubmitting }}
                handlers={{ handleUserSubmit, handleBookingSubmit, setSearchQuery, handleSelectHotel }}
                data={{
                    userFormData, setUserFormData, userErrors, isUserSubmitting,
                    bookingFormData, setBookingFormData, bookingErrors, isBookingSubmitting,
                    searchQuery, freeHotels, paidHotels, isHotelsLoading, confirmationData, selectedHotel
                }}
            />
        </DesktopBirthdayLayout>
    );
}
