
import { VendorCarousel } from "../PagesWrapper/FindAVendorPageWrapper";
import MostBooked from "./MostBooked";
import { getMostBookedVendors, getTopPlanners, getTrendingVendors } from "../../../database/actions/FetchActions";

export async function AsyncPlannersSection() {
  const planners = await getTopPlanners();
  return (
    <VendorCarousel
      title="Top Event Planners"
      subtitle="Make your dream wedding happen"
      vendors={planners}
      icon="calendar"
      color="#8b5cf6"
    />
  );
}

export async function AsyncTrendingSection() {
  const trending = await getTrendingVendors();
  return (
    <VendorCarousel
      title="Trending Vendors"
      subtitle="What's hot right now"
      vendors={trending}
      icon="zap"
      color="#f97316"
    />
  );
}

export async function AsyncMostBookedSection() {
  const mostBooked = await getMostBookedVendors();
  return <MostBooked initialData={mostBooked} />;
}