// lib/seo/marketplace.js
// Single source of truth for all marketplace SEO data.
// Used by both desktop and mobile marketplace pages and category pages.
// Update this file when adding new vendor categories.

const DOMAIN = "https://www.planwab.com";
const BASE_URL = `${DOMAIN}/vendors/marketplace`;

// ─── Category SEO Map ─────────────────────────────────────────────────────────
// Key = URL slug (matches [category] param exactly)
// Each entry drives: page title, description, schema, OG image, keywords
export const CATEGORY_SEO = {
  photographers: {
    slug: "photographers",
    name: "Wedding Photographers",
    namePlural: "Photographers",
    shortName: "Photography",
    vendorType: "Photographer",
    serviceType: "Photography",
    description:
      "professional wedding and event photographers who capture every precious moment",
    longDescription:
      "Find and book India's best wedding photographers on PlanWAB. Browse verified photographer portfolios, read real client reviews, compare packages and book instantly. From candid wedding photography to pre-wedding shoots and birthday portraits.",
    keywords: [
      "wedding photographers India",
      "book wedding photographer online",
      "best wedding photography",
      "candid wedding photographers",
      "pre-wedding shoot photographer",
      "event photographer near me",
      "birthday photographer",
      "anniversary photographer India",
    ],
    ogImage:
      "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto/f_auto/v1771428068/photographerCatHeroDesktop_y1cwnd.png",
    schemaType: "PhotographyBusiness",
  },

  decors: {
    slug: "decors",
    name: "Event Decorators",
    namePlural: "Decorators",
    shortName: "Decoration",
    vendorType: "Event Decorator",
    serviceType: "Event Decoration",
    description:
      "creative wedding and event decorators specialising in balloon, floral and theme décor",
    longDescription:
      "Discover the best event decorators on PlanWAB. Browse balloon artists, floral designers and theme decorators for weddings, birthdays and anniversaries. Compare portfolios, get quotes and book verified decorators across India.",
    keywords: [
      "wedding decorators India",
      "event decoration services",
      "balloon decoration near me",
      "floral wedding decoration",
      "birthday party decorators",
      "theme decoration India",
      "wedding stage decoration",
      "anniversary decoration",
    ],
    ogImage:
      "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto,f_auto/v1771865168/events_osoyqb.png",
    schemaType: "HomeAndConstructionBusiness",
  },

  caterers: {
    slug: "caterers",
    name: "Wedding Caterers",
    namePlural: "Caterers",
    shortName: "Catering",
    vendorType: "Caterer",
    serviceType: "Catering",
    description:
      "top wedding and event caterers offering multi-cuisine menus across India",
    longDescription:
      "Book the best wedding caterers on PlanWAB. Find multi-cuisine caterers for weddings, birthday parties, anniversaries and corporate events. Compare menus, per-plate pricing and book verified caterers near you.",
    keywords: [
      "wedding caterers India",
      "event catering services",
      "best caterers near me",
      "wedding food catering",
      "birthday party caterers",
      "outdoor catering India",
      "buffet catering wedding",
      "vegetarian wedding caterers",
    ],
    ogImage:
      "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto/f_auto/v1775567022/DecoratorsCat_hwpgaf.png",
    schemaType: "FoodEstablishment",
  },

  djs: {
    slug: "djs",
    name: "DJs & Entertainment",
    namePlural: "DJs",
    shortName: "DJ",
    vendorType: "DJ",
    serviceType: "Entertainment",
    description:
      "professional DJs and live entertainment artists for weddings and events",
    longDescription:
      "Find and book professional DJs on PlanWAB for your wedding, birthday party or anniversary. Browse DJ profiles, listen to mixes, compare packages and book trusted entertainment artists across India.",
    keywords: [
      "wedding DJ India",
      "DJ for events near me",
      "book DJ online India",
      "birthday party DJ",
      "wedding entertainment",
      "live music wedding India",
      "professional DJ services",
      "anniversary party DJ",
    ],
    ogImage:
      "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto/f_auto/v1771428064/djCatHeroDesktop_olswsk.png",
    schemaType: "EntertainmentBusiness",
  },

  makeup: {
    slug: "makeup",
    name: "Makeup Artists",
    namePlural: "Makeup Artists",
    shortName: "Makeup",
    vendorType: "Makeup Artist",
    serviceType: "Makeup",
    description:
      "experienced bridal and event makeup artists for weddings and special occasions",
    longDescription:
      "Book top bridal makeup artists on PlanWAB. Find verified makeup professionals for weddings, engagements, parties and special occasions. Compare portfolios, read reviews and book bridal makeup near you.",
    keywords: [
      "bridal makeup artist India",
      "wedding makeup near me",
      "book makeup artist online",
      "best makeup artist wedding",
      "party makeup artist",
      "engagement makeup",
      "airbrush bridal makeup",
      "HD bridal makeup India",
    ],
    ogImage:
      "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto/f_auto/v1771428052/makeupCatHeroDesktop_uw2rkm.png",
    schemaType: "BeautySalon",
  },

  venues: {
    slug: "venues",
    name: "Event Venues",
    namePlural: "Venues",
    shortName: "Venues",
    vendorType: "Venue",
    serviceType: "Event Venue",
    description:
      "premium banquet halls, farmhouses and open-air venues for weddings and events",
    longDescription:
      "Find the perfect event venue on PlanWAB. Browse banquet halls, farmhouses, rooftop venues and hotels for weddings, birthday parties and anniversaries. Compare capacity, pricing and amenities — book your dream venue online.",
    keywords: [
      "wedding venues India",
      "banquet halls near me",
      "event venues for rent",
      "farmhouse for wedding",
      "wedding hall booking",
      "birthday party venues",
      "outdoor wedding venues",
      "affordable wedding venues India",
    ],
    ogImage:
      "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto/f_auto/v1775567028/VenuesCat_hgj3l0.png",
    schemaType: "EventVenue",
  },

  planners: {
    slug: "planners",
    name: "Wedding Planners",
    namePlural: "Planners",
    shortName: "Planning",
    vendorType: "Wedding Planner",
    serviceType: "Event Planning",
    description:
      "expert wedding and event planners who manage every detail of your special day",
    longDescription:
      "Hire the best wedding planners on PlanWAB. Find full-service event planners for weddings, anniversaries and corporate events. Compare packages, read reviews and book trusted planners across India.",
    keywords: [
      "wedding planners India",
      "event planner near me",
      "best wedding planner",
      "hire wedding planner online",
      "destination wedding planner",
      "budget wedding planner India",
      "anniversary event planner",
      "birthday party planner India",
    ],
    ogImage:
      "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto/f_auto/v1771428626/PlannerCat_p16v2m.png",
    schemaType: "EventPlanningService",
  },

  mehendi: {
    slug: "mehendi",
    name: "Mehendi Artists",
    namePlural: "Mehendi Artists",
    shortName: "Mehendi",
    vendorType: "Mehendi Artist",
    serviceType: "Mehendi",
    description:
      "talented mehendi artists for bridal and wedding functions across India",
    longDescription:
      "Book skilled mehendi artists on PlanWAB for your wedding, sangeet or function. Browse bridal mehendi designs, compare artist portfolios and book verified mehendi professionals near you across India.",
    keywords: [
      "mehendi artist near me",
      "bridal mehendi artist India",
      "book mehendi artist online",
      "wedding mehendi design",
      "henna artist for wedding",
      "mehendi artist for function",
      "Arabic mehendi artist",
      "bridal henna artist India",
    ],
    ogImage:
      "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto/f_auto/v1771428620/MehndiCat_hdsxxo.png",
    schemaType: "BeautySalon",
  },
};

// ─── Major Indian Cities for SEO signals ─────────────────────────────────────
export const MAJOR_CITIES = {
  "Delhi NCR":   "Delhi NCR",
  "delhi":       "Delhi",
  "noida":       "Noida",
  "gurgaon":     "Gurgaon",
  "mumbai":      "Mumbai",
  "bangalore":   "Bangalore",
  "hyderabad":   "Hyderabad",
  "pune":        "Pune",
  "jaipur":      "Jaipur",
  "kolkata":     "Kolkata",
  "chennai":     "Chennai",
  "ahmedabad":   "Ahmedabad",
};

// ─── Metadata builders ────────────────────────────────────────────────────────

/**
 * Builds metadata for the main /vendors/marketplace page.
 * Handles search params: canonical is always the clean URL.
 * Filter/sort/price params → noindex (avoid indexing transient filtered views).
 */
export function buildMarketplaceMetadata(searchParams = {}) {
  const { sortBy, search, minPrice, maxPrice, categories, cities } = searchParams;

  // Any "filter" param degrades the page for indexing.
  // Search, sort, price — these are user session states, not indexable content.
  const hasFilterParams = !!(sortBy || search || minPrice || maxPrice || categories);

  const cityLabel = cities ? ` in ${MAJOR_CITIES[cities] || cities}` : "";

  const title = search
    ? `Search: "${search}" – Event Vendors | PlanWAB`
    : cities
    ? `Event Vendors${cityLabel} – Book Photographers, Decorators & More`
    : "Event Vendor Marketplace – Book Photographers, Decorators, Caterers & More";

  const description = cities
    ? `Find and book the best event vendors${cityLabel} on PlanWAB. Compare photographers, decorators, caterers, DJs and more. Verified vendors, real reviews, instant booking.`
    : "Browse 1,000+ verified event vendors on PlanWAB Marketplace. Compare photographers, decorators, caterers, DJs, makeup artists and more for your wedding, birthday or anniversary. Book online instantly.";

  return {
    title,
    description,
    keywords: [
      "event vendor marketplace India",
      "book event vendors online",
      "wedding vendors near me",
      "compare event vendors",
      "verified event vendors India",
      "PlanWAB marketplace",
      ...(cities ? [`event vendors ${cityLabel}`, `wedding vendors${cityLabel}`] : []),
    ],
    // Canonical always points to the clean base URL — filter state is not indexable
    alternates: {
      canonical: `${BASE_URL}/`,
    },
    // Noindex when filters/sort/price/search are active — these are transient views
    robots: hasFilterParams
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        }
      : {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
          },
        },
    openGraph: {
      title: `PlanWAB Marketplace – Browse Event Vendors${cityLabel}`,
      description,
      url: `${BASE_URL}/`,
      siteName: "PlanWAB",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto,f_auto/v1772043937/VenuesEventsDesktopCarHeaderCard_itlslv.png",
          width: 1200,
          height: 630,
          alt: "PlanWAB Event Vendor Marketplace – Book Vendors Across India",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@planwab",
      title: `PlanWAB Marketplace – Browse Event Vendors${cityLabel}`,
      description,
      images: [
        "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto,f_auto/v1772043937/VenuesEventsDesktopCarHeaderCard_itlslv.png",
      ],
    },
  };
}

/**
 * Builds metadata for /vendors/marketplace/[category] pages.
 * Category name comes from the URL path — always properly indexed.
 * Filter/sort/price/search params → noindex (transient state).
 * City param → keep indexed but canonical strips city (consolidates authority).
 */
export function buildCategoryMetadata(categorySlug, searchParams = {}) {
  const { sortBy, search, minPrice, maxPrice, cities } = searchParams;

  const cat = CATEGORY_SEO[categorySlug];

  // Unknown category — graceful fallback
  if (!cat) {
    const formattedName = categorySlug
      ?.split("-")
      ?.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      ?.join(" ");

    return {
      title: `${formattedName} Vendors – Marketplace | PlanWAB`,
      description: `Find and book trusted ${formattedName} vendors on PlanWAB Marketplace. Compare portfolios, read reviews and book online.`,
      alternates: { canonical: `${BASE_URL}/${categorySlug}` },
      robots: { index: true, follow: true },
    };
  }

  const hasFilterParams = !!(sortBy || search || minPrice || maxPrice);
  const cityLabel = cities ? ` in ${MAJOR_CITIES[cities] || cities}` : "";
  const canonicalUrl = `${BASE_URL}/${cat.slug}`;

  const title = search
    ? `Search: "${search}" in ${cat.name} | PlanWAB`
    : cities
    ? `${cat.name}${cityLabel} – Book Verified ${cat.namePlural} | PlanWAB`
    : `${cat.name} – Book Verified ${cat.namePlural} in India | PlanWAB`;

  const description = cities
    ? `Find and book the best ${cat.vendorType.toLowerCase()}s${cityLabel} on PlanWAB. Compare portfolios, read reviews and book instantly. Verified ${cat.namePlural.toLowerCase()} for weddings, birthdays and anniversaries.`
    : cat.longDescription;

  return {
    title,
    description,
    keywords: [
      ...cat.keywords,
      ...(cities
        ? [
            `${cat.vendorType.toLowerCase()} ${MAJOR_CITIES[cities] || cities}`,
            `book ${cat.vendorType.toLowerCase()} ${MAJOR_CITIES[cities] || cities}`,
          ]
        : []),
    ],
    // Canonical always the clean category URL — strips city and filter params.
    // City data is valuable in title/description but we consolidate link equity
    // to the base category URL rather than fragmenting it across ?cities= variants.
    alternates: {
      canonical: canonicalUrl,
    },
    robots: hasFilterParams
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        }
      : {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
          },
        },
    openGraph: {
      title: `PlanWAB – ${cat.name}${cityLabel} | Book Verified ${cat.namePlural}`,
      description,
      url: canonicalUrl,
      siteName: "PlanWAB",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: cat.ogImage,
          width: 1200,
          height: 630,
          alt: `PlanWAB – ${cat.name} in India – Book Verified ${cat.namePlural} Online`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@planwab",
      title: `${cat.name}${cityLabel} – Book on PlanWAB`,
      description,
      images: [cat.ogImage],
    },
  };
}

// ─── Structured Data builders ─────────────────────────────────────────────────

/**
 * Generates JSON-LD for the main marketplace page.
 * Includes: CollectionPage + BreadcrumbList + ItemList of all categories.
 */
export function buildMarketplaceSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${BASE_URL}/#collectionpage`,
        url: `${BASE_URL}/`,
        name: "PlanWAB Event Vendor Marketplace",
        description:
          "Browse and book verified event vendors across India. Find photographers, decorators, caterers, DJs and more for your wedding, birthday or anniversary.",
        isPartOf: { "@id": `${DOMAIN}/#website` },
        about: { "@id": `${DOMAIN}/#business` },
        inLanguage: "en-IN",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${DOMAIN}/` },
            { "@type": "ListItem", position: 2, name: "Vendors", item: `${DOMAIN}/vendors` },
            { "@type": "ListItem", position: 3, name: "Marketplace", item: `${BASE_URL}/` },
          ],
        },
      },
      {
        "@type": "ItemList",
        "@id": `${BASE_URL}/#categories`,
        name: "Event Vendor Categories",
        description: "All vendor categories available on PlanWAB Marketplace",
        url: `${BASE_URL}/`,
        numberOfItems: Object.keys(CATEGORY_SEO).length,
        itemListElement: Object.values(CATEGORY_SEO).map((cat, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: cat.name,
          url: `${BASE_URL}/${cat.slug}`,
          description: cat.description,
        })),
      },
    ],
  };
}

/**
 * Generates JSON-LD for a specific category page.
 * Includes: CollectionPage + BreadcrumbList + Service + ItemList (for rich snippets).
 */
export function buildCategorySchema(categorySlug, cityLabel = "") {
  const cat = CATEGORY_SEO[categorySlug];
  if (!cat) return null;

  const pageUrl = `${BASE_URL}/${cat.slug}`;
  const pageName = `${cat.name}${cityLabel ? ` in ${cityLabel}` : ""} – PlanWAB`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}/#collectionpage`,
        url: pageUrl,
        name: pageName,
        description: cat.longDescription,
        isPartOf: { "@id": `${DOMAIN}/#website` },
        about: { "@id": `${DOMAIN}/#business` },
        inLanguage: "en-IN",
        breadcrumb: {
          "@type": "BreadcrumbList",
          "@id": `${pageUrl}/#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home",        item: `${DOMAIN}/` },
            { "@type": "ListItem", position: 2, name: "Vendors",     item: `${DOMAIN}/vendors` },
            { "@type": "ListItem", position: 3, name: "Marketplace", item: `${BASE_URL}/` },
            { "@type": "ListItem", position: 4, name: cat.name,      item: pageUrl },
            ...(cityLabel
              ? [{ "@type": "ListItem", position: 5, name: cityLabel, item: pageUrl }]
              : []),
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}/#service`,
        name: `${cat.name} Booking`,
        description: cat.longDescription,
        provider: { "@id": `${DOMAIN}/#organization` },
        areaServed: { "@type": "Country", name: "India" },
        serviceType: cat.serviceType,
        url: pageUrl,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          seller: { "@id": `${DOMAIN}/#organization` },
        },
      },
    ],
  };
}