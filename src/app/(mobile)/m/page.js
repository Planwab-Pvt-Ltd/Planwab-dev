import HomePageWrapper from "@/components/mobile/PagesWrapper/HomePageWrapper";
import { getMostBookedVendors, getTopPlanners, getTrendingVendors } from "../../../database/actions/FetchActions";

export const metadata = {
  title: "HomePage | PlanWAB - Events Planning And Vendors Marketplace",
  description:
    "Your one-stop solution for planning Weddings, Anniversaries, and Birthdays. Find trusted vendors, manage tasks, and create unforgettable events with ease. Start planning today!",
};

export default async function HomePage() {

  const [planners, trending, mostBooked] = await Promise.all([
    getTopPlanners(),
    getTrendingVendors(),
    getMostBookedVendors()
  ]);

  return (
    <>
      <HomePageWrapper 
        initialPlanners={planners} 
        initialTrending={trending}
        initialMostBooked={mostBooked}
      />
    </>
  );
}