export default function robots() {
  const baseUrl = "https://www.planwab.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",            // Block backend API routes
        "/m/user/",         // Block user dashboard/private pages
        "/admin/",          // Block admin panels
        "/_next/",          // Block internal Next.js files
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}