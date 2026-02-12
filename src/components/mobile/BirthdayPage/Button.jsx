'use client';

export default function Button({ variant = 'primary', isLoading = false, children, className = '', disabled, ...props }) {
    const baseClasses = 'px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105';
    const variants = {
        primary: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg',
        secondary: 'bg-white/20 hover:bg-white/30 text-white border border-white/30',
        success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg',
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    );
}
