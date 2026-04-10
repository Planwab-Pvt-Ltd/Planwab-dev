import FindAVendorPageWrapper from "@/components/desktop/PagesWrapper/FindAVendorPageWrapper";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const category = await resolvedParams?.category;
  const formattedCategory = category ? category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Vendor";

  return {
    title: `Find ${formattedCategory} | PlanWAB`,
    description: `Explore and find the best ${formattedCategory} for your event.`,
  };
}

export default function FindAVendorPage() {
  return (
    <>
      <FindAVendorPageWrapper />
    </>
  );
}
