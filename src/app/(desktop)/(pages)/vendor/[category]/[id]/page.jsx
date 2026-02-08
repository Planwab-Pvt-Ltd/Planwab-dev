// REPLACE ENTIRE FILE WITH:
import VendorDetailsPageWrapper from "@/components/desktop/PagesWrapper/VendorDetailsPageWrapper";
import { notFound } from "next/navigation";
import { getRelatedVendors, getVendorById } from "../../../../../../database/actions/FetchActions";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const vendor = await getVendorById(id);

  if (!vendor) {
    return { title: "Vendor Details | PlanWAB Marketplace" };
  }

  return {
    title: `${vendor.name} | PlanWAB Marketplace`,
    description: vendor.description 
      ? `${vendor.description.substring(0, 160)}...` 
      : `Book ${vendor.name} for your event.`,
    openGraph: {
      title: `${vendor.name} - PlanWAB`,
      description: vendor.description || `Book ${vendor.name}`,
      images: vendor.images?.[0] ? [{ url: vendor.images[0] }] : [],
    },
  };
}

export default async function VendorDetailsPage({ params }) {
  const { id } = await params;

  const [vendor, relatedData] = await Promise.all([
    getVendorById(id),
    getRelatedVendors(id),
  ]);

  if (!vendor) {
    return notFound();
  }

  return (
    <VendorDetailsPageWrapper 
      initialVendor={vendor}
      initialSimilar={relatedData?.similarVendors || []}
      initialRecommended={relatedData?.recommendedVendors || []}
    />
  );
}