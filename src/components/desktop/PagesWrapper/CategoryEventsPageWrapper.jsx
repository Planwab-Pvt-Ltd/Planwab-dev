"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
import SkeletonCard from "@/components/desktop/SkeletonCard";
import Wedding from "@/components/desktop/Wedding";
import Birthday from "@/components/desktop/Birthday";
import HeroSection from "@/components/desktop/ui/EventsPage/HeroSection";
import Banner1 from "@/components/desktop/ui/EventsPage/Banner1";
import HowItWorksSection from "@/components/desktop/ui/EventsPage/HowItWorks";
import SearchSection from "@/components/desktop/ui/EventsPage/SearchSection";
import Anniversary from "@/components/desktop/Anniversary";
import { FAQSection, CTASection } from "@/components/desktop/ui/EventsPage/FAQAndCTA";
import PlanningPreviewSection from "@/components/desktop/ui/EventsPage/PlanningPreviewSection";


export default function CategoryEventsPageWrapper() {
  const router = useRouter();
  const activeCategory = useCategoryStore((state) => state.activeCategory);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState(null);

  const categoryThemes = {
    Wedding: {
      primary: "from-white via-rose-50/30 to-white dark:from-gray-900 dark:via-rose-900/20 dark:to-gray-900",
      accent: "from-rose-100/40 to-transparent dark:from-rose-900/30",
      glow: "bg-rose-200/20 dark:bg-rose-500/10",
    },
    Anniversary: {
      primary: "from-white via-amber-50/30 to-white dark:from-gray-900 dark:via-amber-900/20 dark:to-gray-900",
      accent: "from-amber-100/40 to-transparent dark:from-amber-900/30",
      glow: "bg-amber-200/20 dark:bg-amber-500/10",
    },
    Birthday: {
      primary: "from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900",
      accent: "from-blue-100/40 to-transparent dark:from-blue-900/30",
      glow: "bg-blue-200/20 dark:bg-blue-500/10",
    },
  };

  const [noResults, setNoResults] = useState(false);

  const EVENT_TYPE_TO_CATEGORY = {
    "venues": "venues",
    "photographers": "photographers",
    "makeup": "makeup",
    "planners": "planners",
    "catering": "catering",
    "clothes": "clothes",
    "mehendi": "mehendi",
    "djs": "djs",
  };

  const fetchVenues = useCallback(async (category, params = null) => {
    try {
      setLoading(true);
      setNoResults(false);

      let vendorCategory = "venues";
      if (params?.eventType) {
        const normalized = params.eventType.trim().toLowerCase();
        vendorCategory = EVENT_TYPE_TO_CATEGORY[normalized] || "venues";
      }

      const queryParams = new URLSearchParams({
        categories: vendorCategory,
        page: "1",
        limit: "10",
        sortBy: "rating",
        sortOrder: "desc",
      });
      
      if (params?.location && params.location.trim()) {
        queryParams.set("cities", params.location.trim());
      }

      if (params?.date && params.date.trim()) {
        queryParams.set("eventDate", params.date.trim());
      }
      
      const response = await fetch(`/api/vendor?${queryParams.toString()}`);
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const mapped = result.data.map((v) => ({
          id: v._id,
          name: v.name,
          location: v.address?.city || v.location?.city || "",
          image: v.defaultImage || v.images?.[0] || "",
          tag: v.subcategory || v.category || "",
          onViewDetails: () => {
            if (v.category && v._id) {
              router.push(`/vendor/${v.category}/${v._id}/profile?tab=posts`);
            } else if (v._id) {
              router.push(`/vendor/${v._id}`);
            }
          },
        }));
        setVenues(mapped);
        setNoResults(mapped.length === 0);
      } else {
        setVenues([]);
        setNoResults(true);
      }
    } catch (err) {
      console.error("Failed to fetch venues:", err);
      setVenues([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSearch = (data) => {
    setSearchParams(data);
  };

  useEffect(() => {
    fetchVenues(activeCategory, searchParams);
  }, [activeCategory, searchParams, fetchVenues]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (noResults && searchParams) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No results found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
            We couldn&apos;t find any vendors matching your search. Try adjusting your filters or exploring a different category.
          </p>
          <button
            onClick={() => setSearchParams(null)}
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold hover:opacity-80 transition-opacity"
          >
            Clear filters
          </button>
        </div>
      );
    }

    const getDynamicTitle = (defaultTitle) => {
      const isSearchActive = searchParams && (searchParams.location || searchParams.eventType || searchParams.date);
      if (!isSearchActive) return defaultTitle;
      return `Search Results (${venues.length})`;
    };

    switch (activeCategory) {
      case "Wedding":
        return <Wedding venues={venues} title={getDynamicTitle("Dream Wedding Venues")} />;
      case "Anniversary":
        return <Anniversary venues={venues} title={getDynamicTitle("Unforgettable Anniversary Venues")} />;
      case "Birthday":
        return <Birthday venues={venues} title={getDynamicTitle("Amazing Birthday Party Venues")} />;
      default:
        return <Wedding venues={venues} title={getDynamicTitle("Dream Wedding Venues")} />;
    }
  };

  const currentTheme = categoryThemes[activeCategory] || categoryThemes.Wedding;

  return (
    <>
      <div className="relative overflow-x-clip transition-all duration-1000 ease-out">
        <div
          className={`fixed inset-0 bg-gradient-to-br ${currentTheme?.primary} transition-all duration-1000 ease-out`}
        />
        <div
          className={`fixed inset-0 bg-gradient-radial ${currentTheme?.accent} transition-all duration-1000 ease-out`}
        />
        <div
          className={`fixed top-10 right-0 w-64 h-64 md:w-96 md:h-96 md:top-20 md:right-20 ${currentTheme?.glow} rounded-full blur-3xl opacity-50 transition-all duration-1000 ease-out animate-pulse`}
        />
        <div
          className={`fixed bottom-10 left-0 w-64 h-64 md:w-80 md:h-80 md:bottom-20 md:left-20 ${currentTheme?.glow} rounded-full blur-2xl opacity-40 transition-all duration-1000 ease-out animate-bounce`}
          style={{ animationDuration: "3s" }}
        />
        <div
          className={`fixed top-1/2 left-1/2 w-48 h-48 md:w-64 md:h-64 ${currentTheme?.glow} rounded-full blur-3xl opacity-30 transition-all duration-1000 ease-out animate-spin`}
          style={{ transform: "translate(-50%, -50%)", animationDuration: "8s" }}
        />
        <div className="relative z-10">
          <HeroSection />
          <Banner1 />
          <HowItWorksSection />
          <div className="px-4 md:px-8 lg:px-12">
            <SearchSection onSearch={handleSearch} />
            <div className="py-12">{renderContent()}</div>
            <PlanningPreviewSection category={activeCategory} />
            <FAQSection theme={currentTheme} category={activeCategory} />
            <CTASection theme={currentTheme} category={activeCategory} />
          </div>
        </div>
      </div>
    </>
  );
}
