export default function sitemap() {
  const baseUrl = "https://www.planwab.com";

  return [
    // 1. HOME PAGE (Highest Priority)
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },

    // 2. MAIN CATEGORY PAGES (High Priority)
    // These are major entry points for users
    {
      url: `${baseUrl}/m?category=Wedding`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/m?category=Anniversary`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/m?category=Birthday`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // 3. VENDOR MARKETPLACE (Crucial for Business)
    {
      url: `${baseUrl}/m/vendors/marketplace`,
      lastModified: new Date(),
      changeFrequency: "daily", // Likely updates often with new vendors
      priority: 0.9,
    },

    // 4. SPECIFIC EVENT LISTINGS
    {
      url: `${baseUrl}/m/events/Wedding`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/m/events/Anniversary`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/m/events/Birthday`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // 5. PLANNING TOOLS ("Plan My Event")
    // Highly engaging pages for conversion
    {
      url: `${baseUrl}/m/plan-my-event/wedding`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/m/plan-my-event/anniversary`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/m/plan-my-event/Birthday`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // 6. USER PAGES (Lower Priority for Search)
    // Note: Technically, Google can't access these if they are behind a login,
    // but including them in sitemap helps discoverability of the login structure.
    {
      url: `${baseUrl}/m/user/bookings`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/m/user/profile`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.5,
    },
  ];
}
