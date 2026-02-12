'use client';

import React, { useState } from 'react';

export default function FloatingInput({ label, error, type = 'text', className = '', ...props }) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value);

    // Update hasValue when props.value changes
    React.useEffect(() => {
        setHasValue(!!props.value);
    }, [props.value]);

    const handleFocus = (e) => {
        setIsFocused(true);
        if (props.onFocus) props.onFocus(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (props.onBlur) props.onBlur(e);
    };

    const isActive = isFocused || hasValue || type === 'date';

    return (
        <div className={`relative ${className}`}>
            <div className={`relative px-4 py-2 bg-white/80 backdrop-blur-md border-2 rounded-2xl transition-all duration-300 ${error
                ? 'border-red-400 bg-red-50/50'
                : isFocused
                    ? 'border-[#FF7A18] bg-white shadow-[0_0_0_3px_rgba(255,122,24,0.1)]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                <label
                    className={`absolute left-4 transition-all duration-300 pointer-events-none font-medium ${isActive
                        ? 'top-2 text-xs text-gray-600'
                        : 'top-1/2 -translate-y-1/2 text-gray-500 text-base'
                        }`}
                >
                    {label}
                </label>
                <input
                    type={type}
                    className={`w-full bg-transparent text-gray-900 placeholder-transparent focus:outline-none transition-all duration-300 font-medium ${isActive ? 'pt-4 pb-1' : 'py-2'
                        }`}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />
            </div>
            {error && (
                <div className="absolute -bottom-5 left-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500"></span>
                    <p className="text-xs text-red-500 font-medium tracking-wide">{error}</p>
                </div>
            )}
        </div>
    );
}
