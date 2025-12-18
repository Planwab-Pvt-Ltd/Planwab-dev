import VendorDetailsPageWrapper from "@/components/mobile/PagesWrapper/VendorDetailsPageWrapper";

// --- Helper to get the correct Base URL for Server Side Fetch ---
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000"; // Fallback for local dev
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const response = await fetch(`${getBaseUrl()}/api/vendor/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return {
        title: "Vendor Details | PlanWAB Marketplace",
        description: "Find trusted professionals for your events on PlanWAB.",
      };
    }

    const vendor = await response.json();

    return {
      title: `${vendor.name} | PlanWAB Marketplace`,
      description: vendor.description
        ? `${vendor.description.substring(0, 160)}...`
        : `Book ${vendor.name} for your event. Rated ${vendor.rating} stars.`,
      openGraph: {
        title: `${vendor.name} - PlanWAB`,
        description: `Check availability and pricing for ${vendor.name}.`,
        images:
          vendor.images && vendor.images.length > 0
            ? [{ url: vendor.images[0], width: 800, height: 600, alt: vendor.name }]
            : [],
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "Vendor Marketplace | PlanWAB",
    };
  }
}

export default function VendorDetailsPage() {
  return (
    <>
      <VendorDetailsPageWrapper />
    </>
  );
}
