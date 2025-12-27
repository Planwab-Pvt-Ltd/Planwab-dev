export default function robots() {
  const baseUrl = "https://www.planwab.com";

  return {
    rules: {
      userAgent: "*", // Applies to all bots (Google, Bing, Yahoo, etc.)
      allow: "/", // Allow crawling of the entire site by default
      disallow: [
        "/m/user/", // BLOCK: Private user dashboard (Profile, Bookings)
        "/api/", // BLOCK: API endpoints (Save crawl budget for real pages)
        "/admin/", // BLOCK: Admin panel (if you have one)
        "/_next/", // BLOCK: Next.js internal build files
        "/private/", // BLOCK: Any other private folders
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Point Google to your Sitemap
  };
}
