'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, X, AlertTriangle, Lightbulb, ChevronDown, Calendar, MapPin, Users, DollarSign, User, Check, Clock, Gift, Cake, Heart, Star } from 'lucide-react';
import { useParams } from 'next/navigation';

const categoryConfig = {
    wedding: {
        title: 'Wedding',
        icon: '💑',
        primaryIcon: '💍',
        cities: [
            { name: 'Delhi NCR', icon: '🏛️' },
            { name: 'Bengaluru', icon: '🏢' },
            { name: 'Goa', icon: '🏖️' },
            { name: 'Udaipur', icon: '🕌' },
            { name: 'Jaipur', icon: '🏰' },
            { name: 'Jim Corbett', icon: '🐅' },
        ],
        features: ['Venues', 'Decor', 'Catering'],
        featureIcons: ['🏛️', '🎨', '🍽️'],
        questions: {
            city: 'Where do you want to host your wedding?',
            date: 'When do you plan to have your wedding?',
            guests: 'How many guests are you expecting?',
            budget: 'What is your estimated overall budget?',
            name: 'What shall we call you?'
        },
        tagline: 'Your Wedding Requirements',
        description: 'Let\'s start with these details to help us create your personalized proposal, with venue suggestions, decor ideas and more.',
        successMessage: 'Your personalized wedding proposal is being crafted with love and attention to detail.',
        infoMessages: {
            city: 'has amazing venues for memorable weddings.',
            date: 'gives us great time to plan your special day.',
            guests: 'This helps us recommend the perfect venue size and catering arrangements for your celebration.',
            budget: 'We\'ll customize our recommendations to fit perfectly within your budget range.',
            name: 'Your name helps us create a personalized proposal tailored just for you.'
        }
    },
    anniversary: {
        title: 'Anniversary',
        icon: '💕',
        primaryIcon: '🥂',
        cities: [
            { name: 'Mumbai', icon: '🌊' },
            { name: 'Delhi NCR', icon: '🏛️' },
            { name: 'Bangalore', icon: '🏢' },
            { name: 'Kerala', icon: '🌴' },
            { name: 'Shimla', icon: '🏔️' },
            { name: 'Agra', icon: '🕌' },
        ],
        features: ['Venues', 'Entertainment', 'Dining'],
        featureIcons: ['🏛️', '🎵', '🍷'],
        questions: {
            city: 'Where would you like to celebrate your anniversary?',
            date: 'When is your anniversary celebration?',
            guests: 'How many people will join your celebration?',
            budget: 'What is your celebration budget?',
            name: 'How should we address you?'
        },
        tagline: 'Your Anniversary Celebration',
        description: 'Plan a memorable anniversary celebration with personalized venue options, entertainment ideas, and special touches.',
        successMessage: 'Your anniversary celebration proposal is being prepared with special care.',
        infoMessages: {
            city: 'is perfect for creating anniversary memories.',
            date: 'is ideal for your anniversary celebration.',
            guests: 'This helps us arrange the perfect intimate or grand celebration.',
            budget: 'We\'ll create something special within your budget.',
            name: 'Your name helps us personalize your anniversary celebration.'
        }
    },
    birthday: {
        title: 'Birthday',
        icon: '🎂',
        primaryIcon: '🎈',
        cities: [
            { name: 'Mumbai', icon: '🌃' },
            { name: 'Delhi NCR', icon: '🏛️' },
            { name: 'Pune', icon: '🏰' },
            { name: 'Hyderabad', icon: '💎' },
            { name: 'Chennai', icon: '🏖️' },
            { name: 'Kolkata', icon: '🌉' },
        ],
        features: ['Themes', 'Entertainment', 'Cakes'],
        featureIcons: ['🎨', '🎪', '🎂'],
        questions: {
            city: 'Where do you want to host the birthday party?',
            date: 'When is the birthday celebration?',
            guests: 'How many guests are you inviting?',
            budget: 'What\'s your party budget?',
            name: 'Whose birthday are we celebrating?'
        },
        tagline: 'Birthday Party Planning',
        description: 'Create an unforgettable birthday celebration with customized themes, entertainment options, and party ideas.',
        successMessage: 'Your birthday party proposal is being prepared with excitement and creativity.',
        infoMessages: {
            city: 'offers great venues for birthday celebrations.',
            date: 'will be a perfect day for celebration.',
            guests: 'This helps us plan the perfect party size and activities.',
            budget: 'We\'ll make your birthday special within your budget.',
            name: 'This helps us create a personalized birthday experience.'
        }
    }
};

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const dateRanges = [
    '1st - 7th',
    '8th - 15th',
    '16th - 23rd',
    '24th - 31st'
];

const timeSlots = [
    'Morning (8 AM - 12 PM)',
    'Afternoon (12 PM - 4 PM)',
    'Evening (4 PM - 8 PM)',
    'Night (8 PM - 12 AM)'
];

const LeftPanel = ({ category }) => {
    const config = categoryConfig[category] || categoryConfig.wedding;

    return (
        <div className="hidden lg:flex fixed top-16 left-0 w-[40%] h-[calc(100vh-4rem)] flex-col items-center justify-between py-8 px-8 bg-white shadow-xl rounded-r-3xl overflow-hidden z-10">
            <div className="w-full flex-shrink-0">
                <div className="mx-auto w-32 h-11 bg-gradient-to-r from-amber-600 to-amber-800 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">PlanWab</span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-8 text-center">
                <div className="relative p-3 bg-gradient-to-br from-amber-50 to-amber-200 rounded-3xl shadow-lg">
                    <div className="relative w-64 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                        <div className="text-5xl">{config.icon}</div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl">
                        {config.primaryIcon}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="flex items-center justify-center gap-3">
                        <span className="relative block h-1.5 w-10">
                            <span className="absolute top-1/2 block h-0.5 w-full -translate-y-1/2 bg-amber-200"></span>
                            <span className="absolute left-0 top-0 block aspect-square h-1.5 rounded-full bg-amber-300"></span>
                        </span>
                        <h4 className="font-serif text-xl font-semibold text-gray-800">{config.tagline}</h4>
                        <span className="relative block h-1.5 w-10 rotate-180">
                            <span className="absolute top-1/2 block h-0.5 w-full -translate-y-1/2 bg-amber-200"></span>
                            <span className="absolute left-0 top-0 block aspect-square h-1.5 rounded-full bg-amber-300"></span>
                        </span>
                    </div>
                    <p className="font-sans text-sm text-gray-600 max-w-sm px-4 leading-relaxed">
                        {config.description}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center gap-8">
                {config.features.map((item, index) => (
                    <div key={item} className="flex flex-col items-center gap-3">
                        <div className="rounded-full bg-gradient-to-b from-amber-50 to-amber-200 p-2 shadow-lg">
                            <div className="relative aspect-square w-14 overflow-hidden rounded-full border-2 border-white bg-white flex items-center justify-center">
                                <span className="text-2xl">
                                    {config.featureIcons[index]}
                                </span>
                            </div>
                        </div>
                        <span className="text-sm font-semibold text-amber-800">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ExitModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h2>
            <p className="text-gray-600 mb-6">Your progress will be lost if you exit now.</p>
            <div className="flex justify-center gap-4">
                <button
                    onClick={onCancel}
                    className="px-6 py-2 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    Stay
                </button>
                <button
                    onClick={onConfirm}
                    className="px-6 py-2 rounded-xl font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors"
                >
                    Exit
                </button>
            </div>
        </div>
    </div>
);

const StepHeader = ({ number, title, totalSteps = 5 }) => (
    <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-semibold text-gray-500">Step {number} of {totalSteps}</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                    style={{ width: `${(number / totalSteps) * 100}%` }}
                />
            </div>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-gray-800 tracking-tight leading-tight max-w-4xl">
            {title}
        </h2>
    </div>
);

const NextButton = ({ disabled, onClick, children = <ChevronRight size={20} /> }) => (
    <button
        disabled={disabled}
        onClick={onClick}
        className="w-12 h-12 bg-rose-500 rounded-full text-white flex items-center justify-center shadow-xl hover:bg-rose-600 hover:shadow-2xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110"
    >
        {children}
    </button>
);

const PrevButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="w-12 h-12 bg-gray-200 rounded-full text-gray-600 flex items-center justify-center shadow-xl hover:bg-gray-300 hover:shadow-2xl transition-all duration-200 transform hover:scale-110"
    >
        <ChevronLeft size={20} />
    </button>
);

const InfoBox = ({ text, icon: Icon = Lightbulb }) => (
    <div className="mt-8 flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200 text-amber-700">
        <Icon size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed text-sm">{text}</span>
    </div>
);

const CustomDropdown = ({ label, value, onChange, options, placeholder, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const filteredOptions = (options || []).filter(option =>
        String(option).toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <label className="block font-serif font-medium text-gray-700 mb-3 text-base">{label}</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 bg-white border-2 border-gray-300 rounded-xl text-left focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 flex items-center justify-between hover:border-amber-400 shadow-sm hover:shadow-md"
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-5 h-5 text-gray-500" />}
                    <span className={`text-base ${value ? 'text-gray-800' : 'text-gray-400'}`}>
                        {value || placeholder}
                    </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-30 overflow-hidden">
                    {(options || []).length > 5 && (
                        <div className="p-2 border-b">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                            />
                        </div>
                    )}
                    <div className="max-h-64 overflow-y-auto">
                        {filteredOptions.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                    setSearchTerm('');
                                }}
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-amber-50 transition-colors flex items-center justify-between group ${value === option ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-700'
                                    }`}
                            >
                                <span>{String(option)}</span>
                                {value === option && <Check className="w-4 h-4 text-amber-600" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const StepCity = ({ onNext, formData, category }) => {
    const [selectedCity, setSelectedCity] = useState(formData.city || null);
    const config = categoryConfig[category] || categoryConfig.wedding;

    useEffect(() => {
        if (selectedCity) {
            const timer = setTimeout(() => {
                onNext({ city: selectedCity });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [selectedCity, onNext]);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-in">
            <StepHeader number={1} title={config.questions.city} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {config.cities.map((city) => (
                    <button
                        key={city.name}
                        onClick={() => setSelectedCity(city.name)}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center hover:shadow-xl transform hover:-translate-y-1 ${selectedCity === city.name
                                ? 'bg-gradient-to-br from-amber-600 to-amber-800 border-amber-800 shadow-xl text-white scale-105'
                                : 'bg-white border-gray-200 hover:border-amber-400'
                            }`}
                    >
                        <div className={`text-3xl mb-3 ${selectedCity === city.name ? 'filter brightness-0 invert' : ''}`}>
                            {city.icon}
                        </div>
                        <span className="font-medium text-sm">{city.name}</span>
                        {selectedCity === city.name && (
                            <div className="mt-2">
                                <Check className="w-5 h-5 mx-auto" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
            {selectedCity && (
                <InfoBox
                    text={`Great choice! ${selectedCity} ${config.infoMessages.city}`}
                    icon={MapPin}
                />
            )}
        </div>
    );
};

const StepDate = ({ onNext, onPrev, formData, category }) => {
    const [year, setYear] = useState(formData.year || null);
    const [month, setMonth] = useState(formData.month || '');
    const [dateRange, setDateRange] = useState(formData.dateRange || '');
    const [timeSlot, setTimeSlot] = useState(formData.timeSlot || '');
    const config = categoryConfig[category] || categoryConfig.wedding;

    const years = [2025, 2026, 2027];

    useEffect(() => {
        if (year && month) {
            const timer = setTimeout(() => {
                onNext({ year, month, dateRange, timeSlot });
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [year, month, dateRange, timeSlot, onNext]);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-in">
            <StepHeader number={2} title={config.questions.date} />

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomDropdown
                        label="Select Month"
                        value={month}
                        onChange={setMonth}
                        options={months}
                        placeholder="Choose month"
                        icon={Calendar}
                    />
                    <CustomDropdown
                        label="Select Year"
                        value={year}
                        onChange={setYear}
                        options={years}
                        placeholder="Choose year"
                        icon={Calendar}
                    />
                    <CustomDropdown
                        label="Date Range (Optional)"
                        value={dateRange}
                        onChange={setDateRange}
                        options={dateRanges}
                        placeholder="Select range"
                        icon={Calendar}
                    />
                    <CustomDropdown
                        label="Preferred Time (Optional)"
                        value={timeSlot}
                        onChange={setTimeSlot}
                        options={timeSlots}
                        placeholder="Select time"
                        icon={Clock}
                    />
                </div>
                <div className="text-sm text-gray-500 text-center bg-gray-50 rounded-xl p-3">
                    *We will confirm the exact date and time within 48 hours
                </div>
            </div>

            {year && month && (
                <InfoBox
                    text={`Perfect! ${month} ${year} ${config.infoMessages.date}`}
                    icon={Calendar}
                />
            )}

            <div className="flex justify-between">
                <PrevButton onClick={onPrev} />
            </div>
        </div>
    );
};

const StepGuests = ({ onNext, onPrev, formData, category }) => {
    const [guests, setGuests] = useState(formData.guests?.toString() || '');
    const [ageGroup, setAgeGroup] = useState(formData.ageGroup || '');
    const config = categoryConfig[category] || categoryConfig.wedding;

    const ageGroups = category === 'birthday'
        ? ['Kids (Under 12)', 'Teens (13-19)', 'Adults (20+)', 'Mixed Ages']
        : ['Adults Only', 'Family Friendly', 'Mixed Ages'];

    useEffect(() => {
        if (guests && parseInt(guests) > 0) {
            const timer = setTimeout(() => {
                onNext({ guests: parseInt(guests), ageGroup });
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [guests, ageGroup, onNext]);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-in">
            <StepHeader number={3} title={config.questions.guests} />
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-serif font-medium text-gray-700 mb-3 text-base">Number of Guests</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={guests}
                                onChange={e => setGuests(e.target.value)}
                                placeholder="Enter number"
                                min="1"
                                className="w-full p-4 pl-12 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base transition-all duration-200 hover:border-amber-400 shadow-sm hover:shadow-md"
                            />
                            <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        </div>
                    </div>
                    <CustomDropdown
                        label="Guest Type"
                        value={ageGroup}
                        onChange={setAgeGroup}
                        options={ageGroups}
                        placeholder="Select type"
                        icon={Users}
                    />
                </div>

                {guests && parseInt(guests) > 0 && (
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-amber-600">{guests}</p>
                            <p className="text-xs text-gray-600 mt-1">Total Guests</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-amber-600">{Math.ceil(parseInt(guests) / 8)}</p>
                            <p className="text-xs text-gray-600 mt-1">Tables Needed</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-amber-600">{Math.ceil(parseInt(guests) * 15)}</p>
                            <p className="text-xs text-gray-600 mt-1">Sq.ft. Required</p>
                        </div>
                    </div>
                )}
                <InfoBox
                    text={config.infoMessages.guests}
                    icon={Users}
                />
            </div>
            <div className="flex justify-between">
                <PrevButton onClick={onPrev} />
            </div>
        </div>
    );
};

const StepBudget = ({ onNext, onPrev, formData, category }) => {
    const [budget, setBudget] = useState(formData.budgetRange || 25);
    const [paymentPreference, setPaymentPreference] = useState(formData.paymentPreference || '');
    const config = categoryConfig[category] || categoryConfig.wedding;

    const budgetValue = React.useMemo(() => {
        if (budget <= 50) return `${budget * 2} Lakhs`;
        if (budget <= 75) return `${((budget - 50) / 25 * 4 + 1).toFixed(1)} Crores`;
        return `${((budget - 75) / 25 * 4 + 5).toFixed(1)} Crores`;
    }, [budget]);


    const paymentOptions = ['Full Payment', 'Installments', 'Part Payment'];

    useEffect(() => {
        if (paymentPreference) {
            const timer = setTimeout(() => {
                onNext({ budget: budgetValue, paymentPreference, budgetRange: budget });
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [budgetValue, paymentPreference, onNext, budget]);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-in">
            <StepHeader number={4} title={config.questions.budget} />
            <div className="space-y-8">
                <div className="p-8 bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg border border-amber-100">
                    <p className="text-center text-4xl font-bold text-amber-800 mb-8">₹{budgetValue}</p>
                    <input
                        type="range"
                        min="5"
                        max="100"
                        value={budget}
                        onChange={e => setBudget(parseInt(e.target.value))}
                        className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-4">
                        <span>₹10 Lakhs</span>
                        <span>₹9 Crores+</span>
                    </div>
                </div>

                <div>
                    <CustomDropdown
                        label="Payment Preference"
                        value={paymentPreference}
                        onChange={setPaymentPreference}
                        options={paymentOptions}
                        placeholder="Select preference"
                        icon={DollarSign}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="text-center">
                        <Gift className="w-7 h-7 text-amber-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">Venue & Decor</p>
                        <p className="text-base font-bold text-gray-800 mt-1">40%</p>
                    </div>
                    <div className="text-center">
                        <Cake className="w-7 h-7 text-amber-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">Catering</p>
                        <p className="text-base font-bold text-gray-800 mt-1">35%</p>
                    </div>
                    <div className="text-center">
                        <Star className="w-7 h-7 text-amber-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">Entertainment</p>
                        <p className="text-base font-bold text-gray-800 mt-1">25%</p>
                    </div>
                </div>
            </div>

            <InfoBox
                text={config.infoMessages.budget}
                icon={DollarSign}
            />

            <div className="flex justify-between">
                <PrevButton onClick={onPrev} />
            </div>
        </div>
    );
};

const StepName = ({ onNext, onPrev, formData, category }) => {
    const [name, setName] = useState(formData.name || '');
    const [email, setEmail] = useState(formData.email || '');
    const [phone, setPhone] = useState(formData.phone || '');
    const config = categoryConfig[category] || categoryConfig.wedding;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-slide-in">
            <StepHeader number={5} title={config.questions.name} />

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block font-serif font-medium text-gray-700 mb-3 text-base">Your Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full p-4 pl-12 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base transition-all duration-200 hover:border-amber-400 shadow-sm hover:shadow-md"
                            />
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block font-serif font-medium text-gray-700 mb-3 text-base">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full p-4 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base transition-all duration-200 hover:border-amber-400 shadow-sm hover:shadow-md"
                        />
                    </div>
                    <div>
                        <label className="block font-serif font-medium text-gray-700 mb-3 text-base">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full p-4 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base transition-all duration-200 hover:border-amber-400 shadow-sm hover:shadow-md"
                        />
                    </div>
                </div>
                <InfoBox
                    text={config.infoMessages.name}
                    icon={User}
                />
            </div>
            <div className="flex justify-between items-center pt-4">
                <PrevButton onClick={onPrev} />
                {name.trim() && email.trim() && (
                    <button
                        onClick={() => onNext({ name: name.trim(), email: email.trim(), phone: phone.trim() })}
                        className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 text-base flex items-center gap-2"
                    >
                        Generate My Proposal
                        <Star className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

const StepSuccess = ({ category }) => {
    const config = categoryConfig[category] || categoryConfig.wedding;

    return (
        <div className="w-full max-w-4xl mx-auto text-center space-y-8 animate-slide-in">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-4xl font-serif font-semibold text-gray-800 mb-6">Thank You!</h2>

            <div className="space-y-4">
                <p className="text-xl text-gray-600 leading-relaxed">
                    {config.successMessage}
                </p>
                <p className="text-base text-gray-500">
                    We&apos;ll be in touch within 24 hours with your custom {config.title.toLowerCase()} plan.
                </p>
            </div>

            <div className="mt-10 p-6 bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl border border-amber-200">
                <p className="text-amber-700 font-medium text-base">
                    {category === 'wedding' && '💍 Get ready to celebrate your dream wedding! 💍'}
                    {category === 'anniversary' && '🥂 Get ready for an unforgettable anniversary celebration! 🥂'}
                    {category === 'birthday' && '🎈 Get ready for the most amazing birthday party! 🎈'}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10">
                <div className="p-5 bg-white rounded-xl shadow-md">
                    <Heart className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                    <p className="font-semibold text-gray-800 text-sm">Personalized</p>
                    <p className="text-xs text-gray-600 mt-1">Tailored to your needs</p>
                </div>
                <div className="p-5 bg-white rounded-xl shadow-md">
                    <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <p className="font-semibold text-gray-800 text-sm">Quick Response</p>
                    <p className="text-xs text-gray-600 mt-1">Within 24 hours</p>
                </div>
                <div className="p-5 bg-white rounded-xl shadow-md">
                    <Star className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                    <p className="font-semibold text-gray-800 text-sm">Expert Planning</p>
                    <p className="text-xs text-gray-600 mt-1">Professional guidance</p>
                </div>
            </div>
        </div>
    );
};

export default function PlanMyEventPage() {
    const params = useParams();
    const category = params?.category || 'wedding';
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [showExitModal, setShowExitModal] = useState(false);

    const handleNextStep = (data) => {
        setFormData(prev => ({ ...prev, ...data }));
        setCurrentStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => Math.max(1, prev - 1));
    };

    const handleExit = () => {
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return <StepCity onNext={handleNextStep} formData={formData} category={category} />;
            case 2:
                return <StepDate onNext={handleNextStep} onPrev={handlePrevStep} formData={formData} category={category} />;
            case 3:
                return <StepGuests onNext={handleNextStep} onPrev={handlePrevStep} formData={formData} category={category} />;
            case 4:
                return <StepBudget onNext={handleNextStep} onPrev={handlePrevStep} formData={formData} category={category} />;
            case 5:
                return <StepName onNext={handleNextStep} onPrev={handlePrevStep} formData={formData} category={category} />;
            case 6:
                return <StepSuccess category={category} />;
            default:
                return <StepCity onNext={handleNextStep} formData={formData} category={category} />;
        }
    };

    return (
        <div className="min-h-screen pt-20 flex bg-gradient-to-br from-[#FFFBF2] to-[#FEF7ED] relative">
            <LeftPanel category={category} />

            <div className="flex-1 lg:ml-[40%] relative">
                <button
                    onClick={() => setShowExitModal(true)}
                    className="fixed top-24 right-8 z-30 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-gray-50 hover:shadow-2xl transition-all duration-200 transform hover:scale-110 border border-gray-200"
                >
                    <X className="w-6 h-6 text-gray-600" />
                </button>

                <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] py-12 px-6 sm:px-10 lg:px-20">
                    {renderCurrentStep()}
                </div>
            </div>

            {showExitModal && (
                <ExitModal
                    onConfirm={handleExit}
                    onCancel={() => setShowExitModal(false)}
                />
            )}

            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #D97706 0%, #92400E 100%);
                    cursor: pointer;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    transition: all 0.2s;
                }
                .slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
                }
                .slider::-moz-range-thumb {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #D97706 0%, #92400E 100%);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-in {
                    animation: slideIn 0.4s ease-out;
                }
            `}</style>
        </div>
    );
}