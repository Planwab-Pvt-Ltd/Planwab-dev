import connectToDatabase from "../database/mongoose";
import VendorProfile from './../database/models/VendorProfileModel';

export default async function sitemap() {
  const baseUrl = "https://www.planwab.com";

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/vendors/marketplace`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    // Category Pages
    { url: `${baseUrl}?category=Wedding`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}?category=Anniversary`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}?category=Birthday`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    // Event Pages
    { url: `${baseUrl}/events/wedding`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/events/anniversary`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/events/birthday`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    // Planning Tools
    { url: `${baseUrl}/plan-my-event/wedding`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/plan-my-event/anniversary`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/plan-my-event/birthday`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // 2. Dynamic Vendor Routes (Enhancement)
  let vendorRoutes = [];
  try {
    await connectToDatabase();
    const vendors = await VendorProfile.find({}, "vendorId updatedAt").lean();

    vendorRoutes = vendors.map((vendor) => ({
      url: `${baseUrl}/vendor/${vendor.vendorId}/profile`, 
      lastModified: vendor.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [...staticRoutes, ...vendorRoutes];
}