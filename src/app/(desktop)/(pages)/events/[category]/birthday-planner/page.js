import BirthdayPlannerWrapper from '@/components/desktop/PagesWrapper/BirthdayPlannerWrapper';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const category = resolvedParams?.category;
  const formattedCategory = category
    ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Event";

  return {
    title: `${formattedCategory} Birthday Planner | PlanWAB`,
    description: `Plan the perfect ${formattedCategory.toLowerCase()} birthday party with PlanWAB. Find vendors, organize tasks, and make it unforgettable.`,
  };
}

export default function BirthdayPlannerPage() {
    return <BirthdayPlannerWrapper />;
}
