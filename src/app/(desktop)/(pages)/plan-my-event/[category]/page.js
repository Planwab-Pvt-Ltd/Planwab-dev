import PlanMyEventPageWrapper from "@/components/desktop/PagesWrapper/PlanMyEventPageWrapper";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const category = resolvedParams?.category;
  const formattedCategory = category?.charAt(0)?.toUpperCase() + category?.slice(1);

  return {
    title: `${formattedCategory} Planning Requirements | PlanWAB - Events Planning And Vendors Marketplace`,
    description: `Get expert tips and checklists for planning your ${formattedCategory} event. Find trusted vendors, manage tasks, and create unforgettable experiences with PlanWAB. Start planning today!`,
  };
}

export default function PlanMyEventPage() {
  return (
    <>
      <PlanMyEventPageWrapper />
    </>
  );
}
