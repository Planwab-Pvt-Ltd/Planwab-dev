// app/sitemap.js
// Generates /sitemap.xml dynamically.
//
// STRATEGY:
// - Homepage + marketplace: priority 1.0, changeFreq daily
// - Vendor categories: priority 0.9, changeFreq daily (new vendors added often)
// - Event categories: priority 0.8, changeFreq weekly
// - City landing pages: priority 0.8 (massive long-tail SEO value)
// - Blog / info pages: priority 0.7
// - Legal / auth pages: priority 0.3
//
// NOTE: Dynamic content (vendor profiles, event pages, blog posts, reels)
// should be added via a SEPARATE dynamic sitemap once your vendor/event
// count grows. Add app/sitemap-vendors.xml.js, app/sitemap-events.xml.js etc.
// For now this static sitemap covers all known public routes.

export default function sitemap() {
  const baseUrl = "https://www.planwab.com";
  const now = new Date();

  // Helper to build entries cleanly
  const entry = (path, changeFrequency, priority, lastMod = now) => ({
    url: `${baseUrl}${path}`,
    lastModified: lastMod,
    changeFrequency,
    priority,
  });

  return [
    // ─── Tier 1: Core pages (highest authority) ──────────────────────────────
    entry("/",                  "daily",   1.0),
    entry("/plan-my-event",     "weekly",  0.9),
    entry("/vendors/marketplace", "daily", 0.95),

    // ─── Tier 2: Vendor categories (revenue-critical, crawled daily) ─────────
    entry("/vendors/marketplace/photographers", "daily",  0.9),
    entry("/vendors/marketplace/decors",        "daily",  0.9),
    entry("/vendors/marketplace/caterers",      "daily",  0.9),
    entry("/vendors/marketplace/djs",           "daily",  0.9),
    entry("/vendors/marketplace/makeup",        "daily",  0.9),
    entry("/vendors/marketplace/venues",        "daily",  0.9),
    entry("/vendors/marketplace/planners",      "daily",  0.9),
    entry("/vendors/marketplace/mehendi",       "daily",  0.9),

    // ─── Tier 3: Event category pages ────────────────────────────────────────
    entry("/events/wedding",     "weekly", 0.85),
    entry("/events/anniversary", "weekly", 0.8),
    entry("/events/birthday",    "weekly", 0.8),
    entry("/events/events",      "weekly", 0.8),

    // ─── Tier 4: City landing pages (long-tail gold mine) ────────────────────
    // These pages drive "wedding vendors in [city]" searches.
    // Create app/(desktop)/vendors/marketplace/[city]/page.js for each.
    entry("/vendors/marketplace/photographers?cities=delhi",     "weekly", 0.8),
    entry("/vendors/marketplace/photographers?cities=noida",     "weekly", 0.8),
    entry("/vendors/marketplace/photographers?cities=mumbai",    "weekly", 0.8),
    entry("/vendors/marketplace/photographers?cities=bangalore", "weekly", 0.8),
    entry("/vendors/marketplace/photographers?cities=gurgaon",   "weekly", 0.75),
    entry("/vendors/marketplace/photographers?cities=hyderabad", "weekly", 0.75),
    entry("/vendors/marketplace/photographers?cities=pune",      "weekly", 0.75),
    entry("/vendors/marketplace/photographers?cities=jaipur",    "weekly", 0.75),

    entry("/vendors/marketplace/decors?cities=delhi",     "weekly", 0.8),
    entry("/vendors/marketplace/decors?cities=noida",     "weekly", 0.8),
    entry("/vendors/marketplace/decors?cities=mumbai",    "weekly", 0.8),
    entry("/vendors/marketplace/decors?cities=bangalore", "weekly", 0.75),
    entry("/vendors/marketplace/decors?cities=gurgaon",   "weekly", 0.75),

    entry("/vendors/marketplace/venues?cities=delhi",     "weekly", 0.8),
    entry("/vendors/marketplace/venues?cities=noida",     "weekly", 0.8),
    entry("/vendors/marketplace/venues?cities=mumbai",    "weekly", 0.8),
    entry("/vendors/marketplace/venues?cities=bangalore", "weekly", 0.75),

    // ─── Tier 5: Vendor onboarding (acquisition pages) ───────────────────────
    entry("/vendor/onboarding", "monthly", 0.7),
    entry("/vendor/register",   "monthly", 0.7),

    // ─── Tier 6: Content / blog pages ────────────────────────────────────────
    entry("/about/blogs",   "weekly",  0.75),
    entry("/about",         "monthly", 0.6),
    entry("/about/contact", "yearly",  0.5),
    entry("/pricing",       "monthly", 0.65),
  ];
}











export default function sitemap() {
  const baseUrl = "https://www.planwab.com";
  const lastModified = new Date();

  return [
    // 1. Core Pages (Highest Priority)
    { url: `${baseUrl}`, lastModified, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/plan-my-event`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    
    // 2. Main Event Categories
    { url: `${baseUrl}/events`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events/wedding`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events/anniversary`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events/birthday`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events/events`, lastModified, changeFrequency: 'weekly', priority: 0.8 },

    // 3. Marketplace & Vendor Categories
    { url: `${baseUrl}/vendors/marketplace`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/vendors/marketplace/planners`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/vendors/marketplace/photographers`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/vendors/marketplace/venues`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/vendors/marketplace/makeup`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/vendors/marketplace/catering`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/vendors/marketplace/djs`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/vendors/marketplace/mehendi`, lastModified, changeFrequency: 'daily', priority: 0.8 },

    // 4. Vendor Onboarding
    { url: `${baseUrl}/vendor/onboarding`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/vendor/register`, lastModified, changeFrequency: 'monthly', priority: 0.7 },

    // 5. Informational Pages
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about/blogs`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about/contact`, lastModified, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/pricing`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
  ];
}