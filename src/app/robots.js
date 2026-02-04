export default function robots() {
  const baseUrl = "https://www.planwab.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",            // Block backend API routes
        "/user/",           // Block user dashboard (removed /m/ prefix to cover rewrite)
        "/m/user/",         // Explicitly block underlying path just in case
        "/admin/",          // Block admin panels
        "/m/admin/",        // Block underlying admin path
        "/_next/",          // Block internal Next.js files
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}