import VendorProfilePageWrapper from "@/components/mobile/PagesWrapper/VendorProfilePageWrapper";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

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

export default function VendorProfilePage() {
  return (
    <>
      <VendorProfilePageWrapper />
    </>
  );
}
