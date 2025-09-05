"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Filter,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";

const SearchSection = () => {
  const [activeField, setActiveField] = useState(null);
  const [searchData, setSearchData] = useState({
    location: "",
    eventType: "",
    date: "",
    guests: 1,
    budget: "",
  });
  const [showSuggestions, setShowSuggestions] = useState({
    location: false,
    eventType: false,
    date: false,
    guests: false,
  });
  const [guestCounts, setGuestCounts] = useState({ adults: 1, children: 0 });
  const searchRef = useRef(null);
  const locationSuggestions = [
    { name: "Mumbai", venues: 150, state: "Maharashtra" },
    { name: "Delhi", venues: 200, state: "Delhi" },
    { name: "Bangalore", venues: 120, state: "Karnataka" },
    { name: "Pune", venues: 80, state: "Maharashtra" },
    { name: "Indore", venues: 45, state: "Madhya Pradesh" },
    { name: "Jaipur", venues: 65, state: "Rajasthan" },
    { name: "Chennai", venues: 85, state: "Tamil Nadu" },
    { name: "Hyderabad", venues: 90, state: "Telangana" },
  ];
  const eventTypeSuggestions = [
    {
      name: "Intimate Wedding",
      guests: "50-100",
      icon: "💒",
      description: "Close family and friends",
      budget: "₹2-5L",
    },
    {
      name: "Grand Wedding",
      guests: "200+",
      icon: "🎊",
      description: "Large celebration",
      budget: "₹10L+",
    },
    {
      name: "Anniversary Party",
      guests: "20-50",
      icon: "💝",
      description: "Celebrate love milestones",
      budget: "₹1-3L",
    },
    {
      name: "Birthday Celebration",
      guests: "30-80",
      icon: "🎂",
      description: "Special birthday party",
      budget: "₹50K-2L",
    },
    {
      name: "Engagement Ceremony",
      guests: "50-150",
      icon: "💍",
      description: "Ring ceremony celebration",
      budget: "₹1-4L",
    },
    {
      name: "Baby Shower",
      guests: "15-40",
      icon: "👶",
      description: "Welcome the little one",
      budget: "₹30K-1L",
    },
  ];

  const generateCalendarDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date,
        formatted: date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        fullFormatted: date.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isToday: i === 0,
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
          guests: false,
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFieldFocus = (field) => {
    setActiveField(field);
    setShowSuggestions((prev) => ({
      location: false,
      eventType: false,
      date: false,
      guests: false,
      [field]: true,
    }));
  };

  const handleInputChange = (field, value) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSuggestionClick = (field, value, displayValue = null) => {
    setSearchData((prev) => ({ ...prev, [field]: displayValue || value }));
    setShowSuggestions((prev) => ({ ...prev, [field]: false }));
    setActiveField(null);
  };

  const handleDateSelect = (dateObj) => {
    setSearchData((prev) => ({ ...prev, date: dateObj.fullFormatted }));
    setShowSuggestions((prev) => ({ ...prev, date: false }));
    setActiveField(null);
  };

  const handleGuestCountChange = (type, operation) => {
    setGuestCounts((prev) => {
      const newCounts = { ...prev };
      if (operation === "increment") {
        newCounts[type] = Math.min(
          newCounts[type] + 1,
          type === "adults" ? 20 : 10,
        );
      } else {
        newCounts[type] = Math.max(
          newCounts[type] - 1,
          type === "adults" ? 1 : 0,
        );
      }
      const totalGuests = newCounts.adults + newCounts.children;
      setSearchData((prevSearch) => ({ ...prevSearch, guests: totalGuests }));
      return newCounts;
    });
  };

  const getGuestsDisplayText = () => {
    const total = guestCounts.adults + guestCounts.children;
    if (total === 1) return "1 guest";
    return `${total} guests`;
  };

  const handleSearch = () => {
    console.log("Searching with:", searchData);
    console.log("Guest breakdown:", guestCounts);
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 mb-12 relative" ref={searchRef}>
      <div
        className={`rounded-2xl shadow-2xl border border-gray-200 p-3 transition-all duration-500 ease-out backdrop-blur-sm bg-white/95 ${activeField ? "shadow-3xl" : "hover:shadow-xl"}`}
      >
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
          <div className="flex-1 relative w-full">
            <button
              onClick={() => handleFieldFocus("location")}
              className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 ease-out ${activeField === "location" ? "bg-rose-50 shadow-lg" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-rose-500" />
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Where
                  </label>
                  <input
                    type="text"
                    placeholder="Search destinations"
                    value={searchData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full text-sm text-gray-600 bg-transparent focus:outline-none placeholder-gray-400 font-medium"
                    onFocus={() => handleFieldFocus("location")}
                  />
                </div>
              </div>
            </button>
          </div>
          <div className="h-0.5 w-full bg-gray-200 md:h-8 md:w-px md:border-l md:bg-transparent border-gray-300 mx-1"></div>
          <div className="flex-1 relative w-full">
            <button
              onClick={() => handleFieldFocus("eventType")}
              className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 ease-out ${activeField === "eventType" ? "bg-amber-50 shadow-lg" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center space-x-3">
                <Star size={18} className="text-amber-500" />
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Event Type
                  </label>
                  <input
                    type="text"
                    placeholder="Wedding, Anniversary..."
                    value={searchData.eventType}
                    onChange={(e) =>
                      handleInputChange("eventType", e.target.value)
                    }
                    className="w-full text-sm text-gray-600 bg-transparent focus:outline-none placeholder-gray-400 font-medium"
                    onFocus={() => handleFieldFocus("eventType")}
                  />
                </div>
              </div>
            </button>
          </div>
          <div className="h-0.5 w-full bg-gray-200 md:h-8 md:w-px md:border-l md:bg-transparent border-gray-300 mx-1"></div>
          <div className="flex-1 relative w-full">
            <button
              onClick={() => handleFieldFocus("date")}
              className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 ease-out ${activeField === "date" ? "bg-green-50 shadow-lg" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center space-x-3">
                <Calendar size={18} className="text-green-500" />
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    When
                  </label>
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
          <div className="h-0.5 w-full bg-gray-200 md:h-8 md:w-px md:border-l md:bg-transparent border-gray-300 mx-1"></div>
          <div className="flex-1 relative w-full">
            <div className="flex items-center">
              <button
                onClick={() => handleFieldFocus("guests")}
                className={`flex-1 text-left px-6 py-4 rounded-xl transition-all duration-300 ease-out ${activeField === "guests" ? "bg-purple-50 shadow-lg" : "hover:bg-gray-50"}`}
              >
                <div className="flex items-center space-x-3">
                  <Users size={18} className="text-purple-500" />
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Guests
                    </label>
                    <div className="text-sm text-gray-600 font-medium">
                      {getGuestsDisplayText()}
                    </div>
                  </div>
                </div>
              </button>
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full p-4 ml-3 hover:from-rose-600 hover:to-pink-700 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-rose-200 hover:scale-105 hover:shadow-xl"
              >
                <Search size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
