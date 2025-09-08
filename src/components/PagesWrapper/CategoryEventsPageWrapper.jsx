'use client';

import { useState, useEffect } from 'react';
import { useCategoryStore } from '@/GlobalState/CategoryStore';
import SkeletonCard from '@/components/SkeletonCard';
import Wedding from '@/components/Wedding';
import Birthday from '@/components/Birthday';
import HeroSection from '@/components/ui/EventsPage/HeroSection';
import Banner1 from '@/components/ui/EventsPage/Banner1';
import HowItWorksSection from '@/components/ui/EventsPage/HowItWorks';
import SearchSection from '@/components/ui/EventsPage/SearchSection';
import Anniversary from '@/components/Anniversary';

export default function CategoryEventsPageWrapper() {
  const activeCategory = useCategoryStore((state) => state.activeCategory);
  const [loading, setLoading] = useState(true);

  const categoryThemes = {
    Wedding: {
      primary: 'from-white via-rose-50/30 to-white dark:from-gray-900 dark:via-rose-900/20 dark:to-gray-900',
      accent: 'from-rose-100/40 to-transparent dark:from-rose-900/30',
      glow: 'bg-rose-200/20 dark:bg-rose-500/10',
    },
    Anniversary: {
      primary: 'from-white via-amber-50/30 to-white dark:from-gray-900 dark:via-amber-900/20 dark:to-gray-900',
      accent: 'from-amber-100/40 to-transparent dark:from-amber-900/30',
      glow: 'bg-amber-200/20 dark:bg-amber-500/10',
    },
    Birthday: {
      primary: 'from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900',
      accent: 'from-blue-100/40 to-transparent dark:from-blue-900/30',
      glow: 'bg-blue-200/20 dark:bg-blue-500/10',
    }
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }
    switch (activeCategory) {
      case 'Wedding': return <Wedding />;
      case 'Anniversary': return <Anniversary />;
      case 'Birthday': return <Birthday />;
      default: return <Wedding />;
    }
  };

  const currentTheme = categoryThemes[activeCategory] || categoryThemes.Wedding;

  return (
    <>
      <div className="relative overflow-x-hidden transition-all duration-1000 ease-out">
        <div className={`fixed inset-0 bg-gradient-to-br ${currentTheme?.primary} transition-all duration-1000 ease-out`} />
        <div className={`fixed inset-0 bg-gradient-radial ${currentTheme?.accent} transition-all duration-1000 ease-out`} />
        <div className={`fixed top-10 right-0 w-64 h-64 md:w-96 md:h-96 md:top-20 md:right-20 ${currentTheme?.glow} rounded-full blur-3xl opacity-50 transition-all duration-1000 ease-out animate-pulse`} />
        <div className={`fixed bottom-10 left-0 w-64 h-64 md:w-80 md:h-80 md:bottom-20 md:left-20 ${currentTheme?.glow} rounded-full blur-2xl opacity-40 transition-all duration-1000 ease-out animate-bounce`} style={{ animationDuration: '3s' }} />
        <div className={`fixed top-1/2 left-1/2 w-48 h-48 md:w-64 md:h-64 ${currentTheme?.glow} rounded-full blur-3xl opacity-30 transition-all duration-1000 ease-out animate-spin`} style={{ transform: 'translate(-50%, -50%)', animationDuration: '8s' }} />
        <div className="relative z-10">
          <HeroSection />
          <Banner1 />
          <HowItWorksSection />
          <div className="px-4 md:px-8 lg:px-12">
            <SearchSection />
            <div className="py-12">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
