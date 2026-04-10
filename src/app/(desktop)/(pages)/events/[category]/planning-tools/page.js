import PlanningToolsPageWrapper from "../../../../../../components/desktop/PagesWrapper/PlanningToolsPageWrapper";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const category = resolvedParams?.category;
  const formattedCategory = category
    ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Event";

  return {
    title: `${formattedCategory} Planning Tools | PlanWAB`,
    description: `Access essential planning tools for your ${formattedCategory.toLowerCase()} event on PlanWAB. Stay organized, on budget, and on time.`,
  };
}

export default function PlanningToolsPage() {
  return (
    <>
      <PlanningToolsPageWrapper />
    </>
  );
}
