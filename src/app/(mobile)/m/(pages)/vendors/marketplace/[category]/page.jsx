import MarketplacePageWrapper from "@/components/mobile/PagesWrapper/VendorsMarketplacePageWrapper";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { category } = resolvedParams;

  const formattedCategory = category
    ?.split("-")
    ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
    ?.join(" ");

  return {
    title: `${formattedCategory} - Vendors Marketplace | PlanWAB - Events Planning And Vendors Marketplace`,
    description: `Discover top ${formattedCategory} vendors on PlanWAB's Marketplace. Find trusted professionals for weddings, parties, and corporate events. Start planning today!`,
  };
}

export default function MarketplacePage() {
  return (
    <>
      <MarketplacePageWrapper />
    </>
  );
}
