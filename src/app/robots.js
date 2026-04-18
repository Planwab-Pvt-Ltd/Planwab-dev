// app/robots.js
// Generates /robots.txt dynamically.
//
// KEY RULES:
// - /m/ is disallowed: it's an internal rewrite path, never a public URL.
//   Desktop users are already redirected away by middleware. Disallowing it
//   prevents Googlebot from ever trying to crawl it directly.
// - All real public pages (/, /vendors, /events, etc.) are allow: "/"
// - Admin, API, and Next.js internals are blocked.

export default function robots() {
  const baseUrl = "https://www.planwab.com";

  return {
    rules: [
      // Main rule — allow all public pages
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",          // API routes — not indexable content
          "/admin/",        // Admin panel — private
          "/user/",         // User dashboard — private
          "/_next/",        // Next.js internals
          "/m/",            // Internal mobile rewrite path — never a public URL
          "/m",             // Cover the exact /m path too
          "/sign-in",       // Auth pages
          "/sign-up",
          "/*?*",           // Block raw query strings (search bots may over-crawl)
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "ChatGPT-User",
        disallow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}