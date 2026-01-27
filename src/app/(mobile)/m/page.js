import HomePageWrapper from "@/components/mobile/PagesWrapper/HomePageWrapper";

// Helper for API URL
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

async function getMostBookedVendors() {
  try {
    // Matches the 'all' filter query: { featured: "true", sortBy: "rating", limit: "8" }
    const params = new URLSearchParams({
      featured: "true",
      sortBy: "rating",
      limit: "8",
    });
    const res = await fetch(`${getBaseUrl()}/api/vendor?${params}`, {
      next: { revalidate: 3600 } 
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Server fetch error (most booked):", error);
    return [];
  }
}

// Fetch Top Planners (Server Side)
async function getTopPlanners() {
  try {
    const params = new URLSearchParams({
      categories: "planners",
      sortBy: "rating",
      limit: "5",
    });
    const res = await fetch(`${getBaseUrl()}/api/vendor?${params}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Server fetch error (planners):", error);
    return [];
  }
}

// Fetch Trending Vendors (Server Side)
async function getTrendingVendors() {
  try {
    const params = new URLSearchParams({
      featured: "true",
      sortBy: "bookings",
      limit: "5",
    });
    const res = await fetch(`${getBaseUrl()}/api/vendor?${params}`, {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Server fetch error (trending):", error);
    return [];
  }
}

export const metadata = {
  title: "HomePage | PlanWAB - Events Planning And Vendors Marketplace",
  description:
    "Your one-stop solution for planning Weddings, Anniversaries, and Birthdays. Find trusted vendors, manage tasks, and create unforgettable events with ease. Start planning today!",
};

export default async function HomePage() {
  // Fetch both in parallel
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