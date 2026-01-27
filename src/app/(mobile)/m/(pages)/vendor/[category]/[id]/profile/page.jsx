import VendorProfilePageWrapper from "@/components/mobile/PagesWrapper/VendorProfilePageWrapper";
import { notFound } from "next/navigation";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

// 1. Fetch Functions (moved outside component for clarity)
async function getVendorDetails(id) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/vendor/${id}`, { 
      cache: 'no-store' // Ensure fresh data
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

async function getVendorProfile(id) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/vendor/${id}/profile?vendorId=${id}`, { 
      next: { revalidate: 3600 } 
    });
    if (!res.ok) return { success: false, data: null };
    return res.json();
  } catch (error) {
    return { success: false, data: null };
  }
}

async function getVendorReviews(id) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/vendor/${id}/reviews`, { 
      cache: 'no-store' 
    });
    if (!res.ok) return { success: true, data: { reviews: [] } };
    return res.json();
  } catch (error) {
    return { success: true, data: { reviews: [] } };
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const response = await fetch(`${getBaseUrl()}/api/vendor/${id}/profile?vendorId=${id}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return {
        title: "Vendor Profile | PlanWAB Platform",
        description: "Access and see and explore vendor profile.",
      };
    }

    const result = await response.json();
    const vendor = result.data;

    if (!vendor) {
      return {
        title: "Vendor Not Found | PlanWAB",
      };
    }

    return {
      title: `${vendor.vendorName} - Profile | Vendors Media Hub`,
      description: vendor.bio
        ? `${vendor.bio.substring(0, 160)}...`
        : `Book ${vendor.vendorName} for your event. Rated ${vendor.trust || 5} stars.`,
      openGraph: {
        title: `${vendor.vendorName} - PlanWAB`,
        description: `Check availability and pricing for ${vendor.vendorName}.`,
        images: vendor.vendorAvatar
          ? [{ url: vendor.vendorAvatar, width: 800, height: 600, alt: vendor.vendorName }]
          : [],
      },
    };
  } catch (error) {
    return {
      title: "Vendor Marketplace | PlanWAB",
    };
  }
}

export default async function VendorProfilePage({ params }) {
 const { id } = await params;

 const [vendorData, profileJson, reviewsJson] = await Promise.all([
    getVendorDetails(id),
    getVendorProfile(id),
    getVendorReviews(id)
  ]);

  if (!vendorData) {
    return notFound();
  }
  return (
    <>
     <VendorProfilePageWrapper 
      initialVendor={vendorData}
      initialProfile={profileJson?.data || null}
      initialReviews={reviewsJson?.data?.reviews || []}
      vendorId={id}
    />
    </>
  );
}
