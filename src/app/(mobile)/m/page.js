import { Suspense } from "react";
import HomePageWrapper from "@/components/mobile/PagesWrapper/HomePageWrapper";
import {
  AsyncPlannersSection,
  AsyncTrendingSection,
  AsyncMostBookedSection,
} from "@/components/mobile/homepage/AsyncSections";

const CarouselShimmer = () => (
  <div className="w-full overflow-hidden">
    <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
      {[...Array(4)].map((_, i) => (
        <div 
          key={`skeleton-planner-${i}`} 
          className="flex-shrink-0 w-44 bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
        >
          <div className="h-28 bg-gray-200 animate-pulse" />
          <div className="p-3 space-y-3">
            <div className="flex justify-between items-start">
              <div className="h-3.5 w-3/4 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-3.5 w-3.5 rounded-full bg-gray-100 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-1/2 rounded-full bg-gray-100 animate-pulse" />
              <div className="h-2 w-1/3 rounded-full bg-gray-50 animate-pulse" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
              <div className="space-y-1">
                <div className="h-3 w-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-2 w-6 rounded-full bg-gray-50 animate-pulse" />
              </div>
              <div className="h-7 w-12 rounded-lg bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MostBookedShimmer = () => (
  <div className="w-full overflow-hidden my-4">
    <div className="flex gap-4 px-4 overflow-x-auto scrollbar-hide snap-x">
      {[...Array(4)].map((_, i) => (
        <div 
          key={`skeleton-booked-${i}`}
          className="flex-shrink-0 flex items-center gap-4 w-[320px] bg-white border border-gray-100 rounded-xl p-3 h-full relative min-h-[150px] shadow-sm snap-center"
        >
          <div className="w-[90px] h-[90px] flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden animate-pulse" />
          <div className="flex flex-col justify-center flex-1 min-w-0 pr-2 pb-8 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
            <div className="flex items-center space-x-2 mt-1.5">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const metadata = {
  title: "HomePage | PlanWAB - Events Planning And Vendors Marketplace",
  description: "Your one-stop solution for planning Weddings, Anniversaries, and Birthdays.",
};

export default function HomePage() {
  return (
    <HomePageWrapper
      plannersSlot={
        <Suspense fallback={<CarouselShimmer />}>
          <AsyncPlannersSection />
        </Suspense>
      }
      trendingSlot={
        <Suspense fallback={<CarouselShimmer />}>
          <AsyncTrendingSection />
        </Suspense>
      }
      mostBookedSlot={
        <Suspense fallback={<MostBookedShimmer />}>
          <AsyncMostBookedSection />
        </Suspense>
      }
    />
  );
}