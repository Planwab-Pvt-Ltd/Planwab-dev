'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DropdownMenu({ trigger, items }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => { const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { setIsOpen(false); } }; document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, []);
    const dropdownVariants = { hidden: { opacity: 0, scale: 0.95, y: -10 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' } } };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="hidden" className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none z-10">
                        <div className="py-1">
                            {items.map((item, index) => (
                                <button key={index} onClick={() => { item.onClick(); setIsOpen(false); }} className={`flex items-center w-full px-4 py-2 text-sm ${item.isDestructive ? 'text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <item.icon className={`w-4 h-4 mr-3 ${item.isDestructive ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}