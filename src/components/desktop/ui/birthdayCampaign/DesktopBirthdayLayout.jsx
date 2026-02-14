import React from 'react';
import { motion } from 'framer-motion';

export default function DesktopBirthdayLayout({ children, hero, sidebar }) {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0F0F1A] text-gray-900 dark:text-white flex flex-col lg:flex-row overflow-x-hidden transition-colors duration-300 pt-20">
            {/* 
                Hero Section:
                - Mobile/Tablet: Width 100%, Height 40vh (or auto), Order 1 (Top)
                - Desktop: Flex-1 (Fills remaining width), Height 100%, Order 1 (Left)
            */}
            <div className="w-full lg:flex-1 relative h-[40vh] lg:h-[calc(100vh-80px)] order-1 lg:sticky lg:top-20 z-0">
                {hero}
            </div>

            {/* 
                Interactive Section:
                - Mobile/Tablet: Width 100%, Order 2 (Bottom), Normal scroll with body
                - Desktop: Fixed Width, Independent Scroll, Sidebar pinned
            */}
            <div className="w-full lg:w-[500px] xl:w-[600px] 2xl:w-[700px] bg-white dark:bg-[#0F0F1A]/95 lg:bg-white/80 lg:dark:bg-white/5 backdrop-blur-3xl border-l-0 lg:border-l border-gray-200 dark:border-white/10 flex flex-col min-h-[60vh] lg:h-[calc(100vh-80px)] lg:overflow-y-auto relative z-10 shadow-none lg:shadow-2xl transition-colors duration-300 order-2">
                <div className="p-6 md:p-8 lg:p-12 flex-1 flex flex-col">
                    {children}
                </div>
                {sidebar && (
                    <div className="border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 p-6 transition-colors duration-300 pb-20 lg:pb-6">
                        {sidebar}
                    </div>
                )}
            </div>
        </div>
    );
}
