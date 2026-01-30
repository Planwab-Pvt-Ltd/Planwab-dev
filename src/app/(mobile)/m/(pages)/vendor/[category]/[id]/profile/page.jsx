import VendorProfilePageWrapper from "@/components/mobile/PagesWrapper/VendorProfilePageWrapper";
import { getVendorById, getVendorProfile, getVendorReviews } from "../../../../../../../../database/actions/FetchActions";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const vendor = await getVendorById(id);
  const profile = await getVendorProfile(id);

  if (!vendor) {
    return { title: "Vendor Not Found | PlanWAB" };
  }

  return {
    title: `${vendor.name} - Profile | Vendors Media Hub`,
    description: profile?.bio 
      ? `${profile.bio.substring(0, 160)}...` 
      : `Book ${vendor.name} for your event.`,
    openGraph: {
      title: `${vendor.name} - PlanWAB`,
      images: vendor.vendorAvatar ? [{ url: vendor.vendorAvatar }] : [],
    },
  };
}

export default async function VendorProfilePage({ params }) {
  const { id } = await params;

  const [vendorData, profileData, reviewsData] = await Promise.all([
    getVendorById(id),
    getVendorProfile(id),
    getVendorReviews(id)
  ]);

  return (
    <VendorProfilePageWrapper 
      initialVendor={vendorData}
      initialProfile={profileData}
      initialReviews={reviewsData?.reviews || []}
      vendorId={id}
    />
  );
}