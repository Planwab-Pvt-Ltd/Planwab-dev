"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, Star } from "lucide-react";
import { useCategoryStore } from "@/GlobalState/CategoryStore";

const SearchSection = ({ onSearch }) => {
  const activeCategory = useCategoryStore((state) => state.activeCategory);
  const [activeField, setActiveField] = useState(null);
  const [searchData, setSearchData] = useState({ 
    location: "", 
    eventType: activeCategory === "Default" || !activeCategory ? "" : activeCategory, 
    date: "" 
  });
  
  const [showSuggestions, setShowSuggestions] = useState({ location: false, eventType: false, date: false });
  const searchRef = useRef(null);
  
  const locationSuggestions = [
    { name: "Mumbai", venues: 150, state: "Maharashtra" }, 
    { name: "Delhi", venues: 200, state: "Delhi" }, 
    { name: "Bangalore", venues: 120, state: "Karnataka" }, 
    { name: "Pune", venues: 80, state: "Maharashtra" }, 
    { name: "Indore", venues: 45, state: "Madhya Pradesh" }, 
    { name: "Jaipur", venues: 65, state: "Rajasthan" }, 
    { name: "Chennai", venues: 85, state: "Tamil Nadu" }, 
    { name: "Hyderabad", venues: 90, state: "Telangana" }
  ];

  const eventTypeSuggestions = [
    { name: "Venues", desc: "Banquet Halls, Farmhouses, Hotels", icon: "🏛️" },
    { name: "Photographers", desc: "Wedding, Pre-Wedding, Candid", icon: "📷" },
    { name: "Makeup", desc: "Bridal, Airbrush, HD Makeup", icon: "💄" },
    { name: "Planners", desc: "Full Planning, Day Coordination", icon: "📋" },
    { name: "Catering", desc: "Veg, Non-Veg, Multi-Cuisine", icon: "🍽️" },
    { name: "Clothes", desc: "Lehenga, Sherwani, Designer Wear", icon: "👗" },
    { name: "Mehendi", desc: "Bridal, Arabic, Rajasthani", icon: "🖐️" },
    { name: "DJs", desc: "Wedding DJ, Sangeet, Live Band", icon: "🎵" },
  ];
  
  const generateCalendarDates = () => { 
    const today = new Date(); 
    const dates = []; 
    for (let i = 0; i < 60; i++) { 
      const date = new Date(today); 
      date.setDate(today.getDate() + i); 
      dates.push({ 
        date: date, 
        formatted: date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), 
        fullFormatted: date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }), 
        isWeekend: date.getDay() === 0 || date.getDay() === 6, 
        isToday: i === 0 
      }); 
    } 
    return dates; 
  };
  
  const calendarDates = generateCalendarDates();

  useEffect(() => {
    setSearchData((prev) => ({ ...prev, eventType: activeCategory === "Default" || !activeCategory ? "" : activeCategory }));
  }, [activeCategory]);

  useEffect(() => { 
    const handleClickOutside = (event) => { 
      if (searchRef.current && !searchRef.current.contains(event.target)) { 
        setActiveField(null); 
        setShowSuggestions({ location: false, eventType: false, date: false }); 
      } 
    }; 
    document.addEventListener("mousedown", handleClickOutside); 
    return () => { document.removeEventListener("mousedown", handleClickOutside); }; 
  }, []);
  
  const handleFieldFocus = (field) => { 
    setActiveField(field); 
    setShowSuggestions((prev) => ({ location: false, eventType: false, date: false, [field]: true })); 
  };
  
  const handleInputChange = (field, value) => { 
    setSearchData((prev) => ({ ...prev, [field]: value })); 
  };
  
  const handleSuggestionClick = (field, value) => { 
    setSearchData((prev) => ({ ...prev, [field]: value })); 
    setShowSuggestions((prev) => ({ ...prev, [field]: false })); 
    setActiveField(null); 
  };
  
  const handleDateSelect = (dateObj) => { 
    setSearchData((prev) => ({ ...prev, date: dateObj.fullFormatted })); 
    setShowSuggestions((prev) => ({ ...prev, date: false })); 
    setActiveField(null); 
  };
  
  const handleSearch = () => { 
    if (onSearch) {
      onSearch(searchData);
    } 
    setActiveField(null);
    setShowSuggestions({ location: false, eventType: false, date: false }); 
  };

  const isAnyActive = !!activeField;

  const SearchField = ({ id, label, placeholder, value, type = "text", wrapperClasses = "" }) => {
    const isActive = activeField === id;
    
    return (
      <div 
        onClick={() => handleFieldFocus(id)}
        className={`relative flex flex-col justify-center px-12 py-6 rounded-full cursor-pointer transition-all duration-200 ${wrapperClasses} ${
          isActive 
            ? 'bg-white shadow-[0_6px_24px_rgba(0,0,0,0.12)] z-20 hover:bg-white' 
            : 'hover:bg-gray-200/60 z-10'
        }`}
      >
        <label className="text-xs font-bold text-gray-800 tracking-wide mb-0.5 pointer-events-none cursor-pointer">
          {label}
        </label>
        {id === 'date' ? (
          <div className={`text-sm truncate select-none ${value ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            {value || placeholder}
          </div>
        ) : (
          <input 
            type={type}
            value={value}
            onChange={(e) => handleInputChange(id, e.target.value)}
            placeholder={placeholder}
            className="w-full text-sm text-gray-900 font-medium bg-transparent focus:outline-none placeholder-gray-500 cursor-pointer"
            autoComplete="off"
          />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-16 relative flex justify-center w-full z-50" ref={searchRef}>
      
      <div 
        className={`flex items-center rounded-full border border-gray-200 transition-colors duration-300 w-full md:w-[920px] ${
          isAnyActive ? 'bg-[#ebebeb]' : 'bg-white shadow-[0_3px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]'
        }`}
      >
        <div className="flex flex-col md:flex-row w-full relative">
          
          <SearchField 
            id="location" 
            label="Location" 
            placeholder="Search destination" 
            value={searchData.location} 
            wrapperClasses="w-full md:w-[300px]"
          />

          <div className="hidden md:flex items-center">
            <div className={`w-px h-12 transition-colors ${activeField === 'location' || activeField === 'eventType' ? 'bg-transparent' : 'bg-gray-300'}`} />
          </div>

          <SearchField 
            id="eventType" 
            label="Event Type" 
            placeholder="Add event type" 
            value={searchData.eventType} 
            wrapperClasses="w-full md:w-[300px]"
          />

          <div className="hidden md:flex items-center">
            <div className={`w-px h-12 transition-colors ${activeField === 'eventType' || activeField === 'date' ? 'bg-transparent' : 'bg-gray-300'}`} />
          </div>

          <SearchField 
            id="date" 
            label="Date" 
            placeholder="Add dates" 
            value={searchData.date} 
            wrapperClasses="w-full md:w-[320px] pr-[100px]"
          />

          <div className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 transition-all ${isAnyActive ? 'scale-[1.02]' : ''}`}>
            <button 
              onClick={(e) => { e.stopPropagation(); handleSearch(); }}
              className={`flex items-center justify-center rounded-full transition-all duration-300 text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-md
                ${isAnyActive ? 'h-[60px] px-6 gap-2' : 'w-[60px] h-[60px]'}
              `}
            >
              <Search size={22} className="shrink-0" strokeWidth={2.5} />
              {isAnyActive && <span className="font-bold text-sm tracking-wide">Search</span>}
            </button>
          </div>
          
        </div>
      </div>

      <div className="absolute top-full left-0 w-full mt-4 flex justify-center z-50 pointer-events-none">
        
        {showSuggestions.location && (
          <div className="w-[400px] bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden pointer-events-auto origin-top mr-[400px]">
            <div className="p-6">
              <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider mb-4 px-2">
                Popular destinations
              </h3>
              <div className="grid grid-cols-1 gap-1 max-h-80 overflow-y-auto">
                {locationSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick('location', suggestion.name)}
                    className="flex items-center gap-4 text-left p-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="w-12 h-12 bg-gray-200/60 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 block">{suggestion.name}</span>
                      <span className="text-sm text-gray-500">{suggestion.state} • {suggestion.venues} venues</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showSuggestions.eventType && (
          <div className="w-[420px] bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden pointer-events-auto origin-top">
            <div className="p-6">
              <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider mb-4 px-2">
                Select Event Type
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {eventTypeSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick('eventType', suggestion.name)}
                    className="flex flex-col items-start p-4 rounded-2xl hover:bg-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-200"
                  >
                    <div className="text-[28px] mb-2">{suggestion.icon}</div>
                    <span className="font-semibold text-gray-900 text-[15px] mb-0.5">{suggestion.name}</span>
                    <span className="text-xs text-gray-500 text-left line-clamp-1">{suggestion.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showSuggestions.date && (
          <div className="w-[420px] bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden pointer-events-auto origin-top ml-[400px]">
            <div className="p-6">
              <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider mb-4 px-2">
                Select your event date
              </h3>
              <div className="mb-2">
                <div className="grid grid-cols-7 gap-1">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-[10px] font-bold text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-7 gap-y-2 gap-x-1 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {calendarDates.map((dateObj, index) => (
                  <div key={index} className="flex justify-center">
                    <button
                      onClick={() => handleDateSelect(dateObj)}
                      className={`
                        w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200
                        ${dateObj.isToday ? 'bg-gray-900 text-white hover:bg-black shadow-md' : 
                          dateObj.isWeekend ? 'text-rose-600 hover:bg-gray-100 border border-transparent hover:border-gray-200' : 
                          'text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200'}
                      `}
                    >
                      {dateObj.date.getDate()}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSection;
