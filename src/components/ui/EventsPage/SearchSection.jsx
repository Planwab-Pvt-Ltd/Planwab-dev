import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Star, Filter, ChevronDown, Plus, Minus } from 'lucide-react';

const SearchSection = () => {
    const [activeField, setActiveField] = useState(null);
    const [searchData, setSearchData] = useState({
        location: '',
        eventType: '',
        date: '',
        guests: 1,
        budget: ''
    });
    const [showSuggestions, setShowSuggestions] = useState({
        location: false,
        eventType: false,
        date: false,
        guests: false
    });
    const [guestCounts, setGuestCounts] = useState({
        adults: 1,
        children: 0
    });
    
    const searchRef = useRef(null);
    
    const locationSuggestions = [
        { name: 'Mumbai', venues: 150, state: 'Maharashtra' },
        { name: 'Delhi', venues: 200, state: 'Delhi' },
        { name: 'Bangalore', venues: 120, state: 'Karnataka' },
        { name: 'Pune', venues: 80, state: 'Maharashtra' },
        { name: 'Indore', venues: 45, state: 'Madhya Pradesh' },
        { name: 'Jaipur', venues: 65, state: 'Rajasthan' },
        { name: 'Chennai', venues: 85, state: 'Tamil Nadu' },
        { name: 'Hyderabad', venues: 90, state: 'Telangana' }
    ];
    
    const eventTypeSuggestions = [
        { 
            name: 'Intimate Wedding', 
            guests: '50-100', 
            icon: '💒',
            description: 'Close family and friends',
            budget: '₹2-5L'
        },
        { 
            name: 'Grand Wedding', 
            guests: '200+', 
            icon: '🎊',
            description: 'Large celebration',
            budget: '₹10L+'
        },
        { 
            name: 'Anniversary Party', 
            guests: '20-50', 
            icon: '💝',
            description: 'Celebrate love milestones',
            budget: '₹1-3L'
        },
        { 
            name: 'Birthday Celebration', 
            guests: '30-80', 
            icon: '🎂',
            description: 'Special birthday party',
            budget: '₹50K-2L'
        },
        { 
            name: 'Engagement Ceremony', 
            guests: '50-150', 
            icon: '💍',
            description: 'Ring ceremony celebration',
            budget: '₹1-4L'
        },
        { 
            name: 'Baby Shower', 
            guests: '15-40', 
            icon: '👶',
            description: 'Welcome the little one',
            budget: '₹30K-1L'
        }
    ];

    const generateCalendarDates = () => {
        const today = new Date();
        const dates = [];
        
        for (let i = 0; i < 60; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push({
                date: date,
                formatted: date.toLocaleDateString('en-IN', { 
                    day: 'numeric',
                    month: 'short'
                }),
                fullFormatted: date.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }),
                isWeekend: date.getDay() === 0 || date.getDay() === 6,
                isToday: i === 0
            });
        }
        return dates;
    };

    const calendarDates = generateCalendarDates();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setActiveField(null);
                setShowSuggestions({
                    location: false,
                    eventType: false,
                    date: false,
                    guests: false
                });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFieldFocus = (field) => {
        setActiveField(field);
        setShowSuggestions(prev => ({
            location: false,
            eventType: false,
            date: false,
            guests: false,
            [field]: true
        }));
    };

    const handleInputChange = (field, value) => {
        setSearchData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSuggestionClick = (field, value, displayValue = null) => {
        setSearchData(prev => ({
            ...prev,
            [field]: displayValue || value
        }));
        setShowSuggestions(prev => ({
            ...prev,
            [field]: false
        }));
        setActiveField(null);
    };

    const handleDateSelect = (dateObj) => {
        setSearchData(prev => ({
            ...prev,
            date: dateObj.fullFormatted
        }));
        setShowSuggestions(prev => ({
            ...prev,
            date: false
        }));
        setActiveField(null);
    };

    const handleGuestCountChange = (type, operation) => {
        setGuestCounts(prev => {
            const newCounts = { ...prev };
            if (operation === 'increment') {
                newCounts[type] = Math.min(newCounts[type] + 1, type === 'adults' ? 20 : 10);
            } else {
                newCounts[type] = Math.max(newCounts[type] - 1, type === 'adults' ? 1 : 0);
            }
            
            const totalGuests = newCounts.adults + newCounts.children;
            setSearchData(prevSearch => ({
                ...prevSearch,
                guests: totalGuests
            }));
            
            return newCounts;
        });
    };

    const getGuestsDisplayText = () => {
        const total = guestCounts.adults + guestCounts.children;
        if (total === 1) return '1 guest';
        return `${total} guests`;
    };

    const handleSearch = () => {
        console.log('Searching with:', searchData);
        console.log('Guest breakdown:', guestCounts);
    };

    return (
        <div className="max-w-6xl mx-auto mt-8 mb-12 relative" ref={searchRef}>
            <div className={`
                bg-white rounded-2xl shadow-2xl border border-gray-200 p-3
                transition-all duration-500 ease-out
                ${activeField ? 'shadow-3xl scale-[1.02] border-blue-300' : 'hover:shadow-xl'}
                backdrop-blur-sm bg-white/95
            `}>
                <div className="flex items-center">
                    {/* Location Field */}
                    <div className="flex-1 relative">
                        <button 
                            onClick={() => handleFieldFocus('location')}
                            className={`
                                w-full text-left px-6 py-4 rounded-xl transition-all duration-300 ease-out
                                ${activeField === 'location' ? 'bg-rose-50 shadow-lg scale-105' : 'hover:bg-gray-50'}
                            `}
                        >
                            <div className="flex items-center space-x-3">
                                <MapPin size={18} className="text-rose-500" />
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-800 mb-1">Where</label>
                                    <input 
                                        type="text" 
                                        placeholder="Search destinations" 
                                        value={searchData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        className="w-full text-sm text-gray-600 bg-transparent focus:outline-none placeholder-gray-400 font-medium"
                                        onFocus={() => handleFieldFocus('location')}
                                    />
                                </div>
                            </div>
                        </button>
                    </div>

                    <div className="h-8 border-l border-gray-300 mx-1"></div>

                    {/* Event Type Field */}
                    <div className="flex-1 relative">
                        <button 
                            onClick={() => handleFieldFocus('eventType')}
                            className={`
                                w-full text-left px-6 py-4 rounded-xl transition-all duration-300 ease-out
                                ${activeField === 'eventType' ? 'bg-amber-50 shadow-lg scale-105' : 'hover:bg-gray-50'}
                            `}
                        >
                            <div className="flex items-center space-x-3">
                                <Star size={18} className="text-amber-500" />
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-800 mb-1">Event Type</label>
                                    <input 
                                        type="text" 
                                        placeholder="Wedding, Anniversary..." 
                                        value={searchData.eventType}
                                        onChange={(e) => handleInputChange('eventType', e.target.value)}
                                        className="w-full text-sm text-gray-600 bg-transparent focus:outline-none placeholder-gray-400 font-medium"
                                        onFocus={() => handleFieldFocus('eventType')}
                                    />
                                </div>
                            </div>
                        </button>
                    </div>

                    <div className="h-8 border-l border-gray-300 mx-1"></div>

                    {/* Date Field */}
                    <div className="flex-1 relative">
                        <button 
                            onClick={() => handleFieldFocus('date')}
                            className={`
                                w-full text-left px-6 py-4 rounded-xl transition-all duration-300 ease-out
                                ${activeField === 'date' ? 'bg-green-50 shadow-lg scale-105' : 'hover:bg-gray-50'}
                            `}
                        >
                            <div className="flex items-center space-x-3">
                                <Calendar size={18} className="text-green-500" />
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-800 mb-1">When</label>
                                    <input 
                                        type="text" 
                                        placeholder="Add dates" 
                                        value={searchData.date}
                                        readOnly
                                        className="w-full text-sm text-gray-600 bg-transparent focus:outline-none placeholder-gray-400 font-medium cursor-pointer"
                                    />
                                </div>
                            </div>
                        </button>
                    </div>

                    <div className="h-8 border-l border-gray-300 mx-1"></div>

                    {/* Guests & Search */}
                    <div className="flex-1 relative">
                        <div className="flex items-center">
                            <button 
                                onClick={() => handleFieldFocus('guests')}
                                className={`
                                    flex-1 text-left px-6 py-4 rounded-xl transition-all duration-300 ease-out
                                    ${activeField === 'guests' ? 'bg-purple-50 shadow-lg scale-105' : 'hover:bg-gray-50'}
                                `}
                            >
                                <div className="flex items-center space-x-3">
                                    <Users size={18} className="text-purple-500" />
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-800 mb-1">Guests</label>
                                        <div className="text-sm text-gray-600 font-medium">
                                            {getGuestsDisplayText()}
                                        </div>
                                    </div>
                                </div>
                            </button>
                            
                            <button 
                                onClick={handleSearch}
                                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full p-4 ml-3 hover:from-rose-600 hover:to-pink-700 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-rose-200 hover:scale-110 hover:shadow-2xl"
                            >
                                <Search size={22} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Location Suggestions Dropdown */}
            {showSuggestions.location && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
                            <MapPin size={16} className="text-rose-500 mr-2" />
                            Popular destinations
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {locationSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick('location', suggestion.name)}
                                    className="text-left p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md border border-transparent hover:border-gray-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-semibold text-gray-800 block">{suggestion.name}</span>
                                            <span className="text-xs text-gray-500">{suggestion.state}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-medium text-rose-600">{suggestion.venues} venues</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Event Type Suggestions Dropdown */}
            {showSuggestions.eventType && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
                            <Star size={16} className="text-amber-500 mr-2" />
                            Popular event types
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {eventTypeSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick('eventType', suggestion.name)}
                                    className="text-left p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md border border-transparent hover:border-gray-200"
                                >
                                    <div className="flex items-start space-x-3">
                                        <span className="text-2xl">{suggestion.icon}</span>
                                        <div className="flex-1">
                                            <span className="font-semibold text-gray-800 block">{suggestion.name}</span>
                                            <span className="text-xs text-gray-500 block mb-1">{suggestion.description}</span>
                                            <div className="flex items-center space-x-3 text-xs">
                                                <span className="text-purple-600 font-medium">{suggestion.guests} guests</span>
                                                <span className="text-green-600 font-medium">{suggestion.budget}</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Date Calendar Dropdown */}
            {showSuggestions.date && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
                            <Calendar size={16} className="text-green-500 mr-2" />
                            Select your event date
                        </h3>
                        <div className="grid grid-cols-7 gap-2 max-h-64 overflow-y-auto">
                            {calendarDates.map((dateObj, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDateSelect(dateObj)}
                                    className={`
                                        p-3 rounded-xl text-center transition-all duration-200 hover:shadow-md
                                        ${dateObj.isToday ? 'bg-green-100 border-2 border-green-500 text-green-800' : 
                                          dateObj.isWeekend ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 
                                          'bg-gray-50 hover:bg-gray-100 text-gray-700'}
                                    `}
                                >
                                    <div className="text-xs font-medium">{dateObj.formatted}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {dateObj.date.toLocaleDateString('en-IN', { weekday: 'short' })}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Guests Counter Dropdown */}
            {showSuggestions.guests && (
                <div className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden w-80">
                    <div className="p-6">
                        <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center">
                            <Users size={16} className="text-purple-500 mr-2" />
                            Add guests
                        </h3>
                        
                        <div className="space-y-4">
                            {/* Adults */}
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <div className="font-medium text-gray-800">Adults</div>
                                    <div className="text-sm text-gray-500">Ages 13 or above</div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleGuestCountChange('adults', 'decrement')}
                                        disabled={guestCounts.adults <= 1}
                                        className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center font-medium">{guestCounts.adults}</span>
                                    <button
                                        onClick={() => handleGuestCountChange('adults', 'increment')}
                                        disabled={guestCounts.adults >= 20}
                                        className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Children */}
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <div className="font-medium text-gray-800">Children</div>
                                    <div className="text-sm text-gray-500">Ages 2-12</div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleGuestCountChange('children', 'decrement')}
                                        disabled={guestCounts.children <= 0}
                                        className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center font-medium">{guestCounts.children}</span>
                                    <button
                                        onClick={() => handleGuestCountChange('children', 'increment')}
                                        disabled={guestCounts.children >= 10}
                                        className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 mt-6 border-t border-gray-200">
                            <button 
                                onClick={() => {
                                    setShowSuggestions(prev => ({ ...prev, guests: false }));
                                    setActiveField(null);
                                }}
                                className="w-full bg-purple-500 text-white rounded-xl py-3 font-medium hover:bg-purple-600 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            {/* <div className="flex justify-center items-center space-x-8 mt-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span>500+ Venues</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>50+ Cities</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>10,000+ Happy Events</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Expert Planners</span>
                </div>
            </div> */}
        </div>
    );
};

export default SearchSection;