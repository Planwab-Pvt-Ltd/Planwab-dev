
import { VendorCarousel } from "../PagesWrapper/FindAVendorPageWrapper";
import MostBooked from "./MostBooked";
import { getMostBookedVendors, getTopPlanners, getTrendingVendors } from "../../../database/actions/FetchActions";

const getPageForCategory = (category) => {
  const map = { Wedding: 1, Anniversary: 2, Birthday: 3, Events: 4 };
  return map[category] || 1;
};

export async function AsyncPlannersSection({ category = "Wedding" }) {
  const page = getPageForCategory(category);
  const planners = await getTopPlanners(page);
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

export async function AsyncTrendingSection({ category = "Wedding" }) {
  const page = getPageForCategory(category);
  const trending = await getTrendingVendors(page);
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

export async function AsyncMostBookedSection({ category = "Wedding" }) {
  const page = getPageForCategory(category);
  const mostBooked = await getMostBookedVendors(page);
  return <MostBooked initialData={mostBooked} />;
}