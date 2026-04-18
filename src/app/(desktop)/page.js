import DesktopHomePageWrapper from "@/components/desktop/PagesWrapper/HomePageWrapper";

const DOMAIN = "https://www.planwab.com";

// ─── Page Metadata ────────────────────────────────────────────────────────────
export const metadata = {
  // Keyword-first title — Google reads left to right, leading with intent matters.
  // Keep under 60 chars for clean SERP display.
  title: "Book Event Vendors Online – Weddings, Birthdays & Anniversaries",

  description:
    "India's #1 event planning marketplace. Browse 1,000+ verified vendors – photographers, decorators, caterers, DJs & more. Compare prices, read reviews and book your dream event online. Free to search!",

  keywords: [
    "book event vendors online India",
    "wedding vendor marketplace",
    "best wedding photographers India",
    "affordable wedding decorators",
    "birthday party planners near me",
    "anniversary event vendors",
    "online event booking",
    "compare wedding vendors",
    "verified wedding vendors India",
    "event planning platform India",
  ],

  // Canonical points to the homepage — the definitive URL for this content.
  alternates: {
    canonical: `${DOMAIN}/`,
    languages: {
      "en-IN": `${DOMAIN}/`,
      "x-default": `${DOMAIN}/`,
    },
  },

  openGraph: {
    title: "PlanWAB – Plan Your Dream Event & Book Vendors Online",
    description:
      "Find and book the best verified vendors for your Wedding, Anniversary, or Birthday. Affordable prices. Instant booking. Trusted by thousands across India.",
    url: `${DOMAIN}/`,
    siteName: "PlanWAB",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto,f_auto/v1772043937/VenuesEventsDesktopCarHeaderCard_itlslv.png",
        width: 1200,
        height: 630,
        alt: "PlanWAB – Book Event Vendors Online for Weddings & Birthdays in India",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@planwab",
    title: "PlanWAB – India's #1 Event Vendor Marketplace",
    description:
      "Book verified photographers, decorators, caterers and more. Fast, affordable, trusted. Start planning today!",
    images: [
      "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto,f_auto/v1771429701/birthdayRight_tox6wr.jpg",
    ],
  },
};

// ─── Homepage Structured Data ─────────────────────────────────────────────────
// Page-level schema. Adds WebPage + ItemList + FAQPage on top of the root
// layout's Organization/WebSite/LocalBusiness @graph.
// FAQPage targets "People Also Ask" boxes — very high-value SERP real estate.
function HomepageStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // WebPage — marks this as the authoritative homepage document
      {
        "@type": "WebPage",
        "@id": `${DOMAIN}/#webpage`,
        url: `${DOMAIN}/`,
        name: "PlanWAB – Book Event Vendors for Weddings, Birthdays & Anniversaries",
        isPartOf: { "@id": `${DOMAIN}/#website` },
        about: { "@id": `${DOMAIN}/#business` },
        description:
          "Browse and book verified event vendors across India. Compare photographers, decorators, caterers, DJs and more for your wedding, anniversary or birthday.",
        inLanguage: "en-IN",
        datePublished: "2023-01-01",
        // dateModified updates on each build/render → freshness signal for Google
        dateModified: new Date().toISOString().split("T")[0],
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto,f_auto/v1772043937/VenuesEventsDesktopCarHeaderCard_itlslv.png",
          width: 1200,
          height: 630,
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          "@id": `${DOMAIN}/#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${DOMAIN}/`,
            },
          ],
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".hero-description"],
        },
      },

      // ItemList — vendor categories as rich results in Google
      {
        "@type": "ItemList",
        "@id": `${DOMAIN}/vendors/marketplace#itemlist`,
        name: "Event Vendor Categories on PlanWAB",
        description:
          "Browse top event vendor categories available on PlanWAB marketplace across India",
        url: `${DOMAIN}/`,
        numberOfItems: 8,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Wedding Photographers",
            url: `${DOMAIN}/vendors/marketplace/photographers`,
            description: "Professional wedding and event photographers across India",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Event Decorators",
            url: `${DOMAIN}/vendors/marketplace/decors`,
            description:
              "Balloon, floral and theme decorators for weddings and parties",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Wedding Caterers",
            url: `${DOMAIN}/vendors/marketplace/caterers`,
            description:
              "Multi-cuisine caterers for weddings, parties and corporate events",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "DJs & Entertainment",
            url: `${DOMAIN}/vendors/marketplace/djs`,
            description:
              "Professional DJs and live entertainment for events and weddings",
          },
          {
            "@type": "ListItem",
            position: 5,
            name: "Makeup Artists",
            url: `${DOMAIN}/vendors/marketplace/makeup`,
            description: "Bridal and event makeup artists across India",
          },
          {
            "@type": "ListItem",
            position: 6,
            name: "Event Venues",
            url: `${DOMAIN}/vendors/marketplace/venues`,
            description: "Banquet halls, farmhouses and open venues for events",
          },
          {
            "@type": "ListItem",
            position: 7,
            name: "Wedding Planners",
            url: `${DOMAIN}/vendors/marketplace/planners`,
            description: "Full-service wedding and event planners across India",
          },
          {
            "@type": "ListItem",
            position: 8,
            name: "Mehendi Artists",
            url: `${DOMAIN}/vendors/marketplace/mehendi`,
            description:
              "Professional mehendi artists for weddings and functions",
          },
        ],
      },

      // FAQPage — targets "People Also Ask" boxes in Google results.
      // These appear above organic results and drive significant traffic.
      {
        "@type": "FAQPage",
        "@id": `${DOMAIN}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "How does PlanWAB work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "PlanWAB is an event planning marketplace where you can browse and book verified vendors for weddings, birthdays, and anniversaries. Search by category and city, compare vendors, view portfolios and reviews, and book directly online.",
            },
          },
          {
            "@type": "Question",
            name: "Are the vendors on PlanWAB verified?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. All vendors listed on PlanWAB go through a verification process before being listed. You can also read real reviews from previous customers to help you decide.",
            },
          },
          {
            "@type": "Question",
            name: "Is PlanWAB free to use for customers?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, browsing and searching for vendors on PlanWAB is completely free for customers. You only pay when you book a vendor service.",
            },
          },
          {
            "@type": "Question",
            name: "Which cities does PlanWAB cover?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "PlanWAB covers vendors across major Indian cities including Delhi, Noida, Gurgaon, Mumbai, Bangalore, Hyderabad, Pune, Jaipur and many more cities across India.",
            },
          },
          {
            "@type": "Question",
            name: "What types of event vendors can I find on PlanWAB?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "On PlanWAB you can find photographers, videographers, decorators, caterers, DJs, makeup artists, mehendi artists, wedding planners, venues and many more vendor categories for weddings, birthdays and anniversaries.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function HomePage() {
  return (
    <>
      <HomepageStructuredData />
      <DesktopHomePageWrapper />
    </>
  );
}