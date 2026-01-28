import { headers } from "next/headers";
import VendorDetailsPageWrapper from "@/components/mobile/PagesWrapper/VendorDetailsPageWrapper";

const getServerBaseUrl = async () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  const h = await headers();
  const host = h.get("host");
  const protocol = h.get("x-forwarded-proto") || "http";
  
  return `${protocol}://${host}`;
};

async function getVendorDetails(id) {
  try {
    const baseUrl = await getServerBaseUrl();
    const res = await fetch(`${baseUrl}/api/vendor/${id}`, {
      cache: "no-store", // Ensure fresh data
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Fetch vendor error:", error);
    return null;
  }
}

async function getRelatedVendors(id) {
  try {
    const baseUrl = await getServerBaseUrl();
    const res = await fetch(`${baseUrl}/api/vendor/lists/${id}`, {
      next: { revalidate: 3600 }, // Cache these lists for an hour
    });
    if (!res.ok) return { similarVendors: [], recommendedVendors: [] };
    return res.json();
  } catch (error) {
    console.error("Fetch related error:", error);
    return { similarVendors: [], recommendedVendors: [] };
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const baseUrl = await getServerBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/vendor/${id}`, {
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

export default async function VendorDetailsPage({ params }) {
  const { id } = await params;

  // 3. Fetch Data in Parallel
  const [vendor, relatedData] = await Promise.all([
    getVendorDetails(id),
    getRelatedVendors(id),
  ]);

  // 4. Handle 404
  if (!vendor) {
    return notFound();
  }

  // 5. Pass data as props
  return (
    <VendorDetailsPageWrapper 
      initialVendor={vendor}
      initialSimilar={relatedData?.similarVendors || []}
      initialRecommended={relatedData?.recommendedVendors || []}
    />
  );
}
