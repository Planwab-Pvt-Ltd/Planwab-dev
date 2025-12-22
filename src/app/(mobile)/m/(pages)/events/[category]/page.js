import CategoryEventsPageWrapper from "@/components/mobile/PagesWrapper/CategoryEventsPageWrapper";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const category = await resolvedParams?.category;
  const formattedCategory = category?.charAt(0)?.toUpperCase() + category?.slice(1);

  return {
    title: `${formattedCategory} Planning Page | PlanWAB - Events Planning And Vendors Marketplace`,
    description: `Plan your perfect ${formattedCategory?.toLowerCase()} with PlanWAB. Find trusted vendors, manage tasks, and create unforgettable ${formattedCategory?.toLowerCase()} events with ease. Start planning today!`,
  };
}

export default function CategoryEventsPage() {
  return (
    <>
      <CategoryEventsPageWrapper />
    </>
  );
}
