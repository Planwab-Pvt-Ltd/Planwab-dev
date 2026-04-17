import { Suspense } from "react";
import HomePageWrapper from "@/components/mobile/PagesWrapper/HomePageWrapper";
import {
  AsyncPlannersSection,
  AsyncTrendingSection,
  AsyncMostBookedSection,
} from "@/components/mobile/homepage/AsyncSections";

const DOMAIN = "https://www.planwab.com";

// ─── Page Metadata ────────────────────────────────────────────────────────────
export const metadata = {
  title:
    "Book Event Vendors Online – Weddings, Birthdays & Anniversaries",

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
        url: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772043937/VenuesEventsDesktopCarHeaderCard_itlslv.png",
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
      "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429701/birthdayRight_tox6wr.jpg",
    ],
  },
};

// ─── Homepage Structured Data ─────────────────────────────────────────────────
// Separate from root layout schema. Adds WebPage + ItemList for the homepage
// specifically, which helps Google understand the page's purpose and content.
function HomepageStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // WebPage — signals this is the authoritative homepage
      {
        "@type": "WebPage",
        "@id": `${DOMAIN}/#webpage`,
        url: DOMAIN,
        name: "PlanWAB – Book Event Vendors for Weddings, Birthdays & Anniversaries",
        isPartOf: { "@id": `${DOMAIN}/#website` },
        about: { "@id": `${DOMAIN}/#business` },
        description:
          "Browse and book verified event vendors across India. Compare photographers, decorators, caterers, DJs and more for your wedding, anniversary or birthday.",
        inLanguage: "en-IN",
        datePublished: "2023-01-01",
        dateModified: new Date().toISOString().split("T")[0],
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto/f_auto/v1772043937/VenuesEventsDesktopCarHeaderCard_itlslv.png",
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
              item: DOMAIN,
            },
          ],
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${DOMAIN}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".hero-description"],
        },
      },

      // ItemList — top vendor categories, helps Google show rich category results
      {
        "@type": "ItemList",
        "@id": `${DOMAIN}/vendors/marketplace#itemlist`,
        name: "Event Vendor Categories on PlanWAB",
        description:
          "Browse top event vendor categories available on PlanWAB marketplace across India",
        url: DOMAIN,
        numberOfItems: 8,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Wedding Photographers",
            url: `${DOMAIN}/vendors/marketplace/photographers`,
            description:
              "Professional wedding and event photographers across India",
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
            description:
              "Full-service wedding and event planners across India",
          },
          {
            "@type": "ListItem",
            position: 8,
            name: "Mehendi Artists",
            url: `${DOMAIN}/vendors/marketplace/mehendi`,
            description: "Professional mehendi artists for weddings and functions",
          },
        ],
      },

      // FAQPage — targets featured snippet / PAA boxes in Google
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
              text: "PlanWAB covers vendors across major Indian cities including Delhi, Noida, Mumbai, Bangalore, Hyderabad, Pune, and many more cities across India.",
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


const CarouselShimmer = () => (
  <div className="w-full overflow-hidden">
    <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
      {[...Array(4)].map((_, i) => (
        <div
          key={`skeleton-planner-${i}`}
          className="flex-shrink-0 w-44 bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
        >
          <div className="h-28 bg-gray-200 animate-pulse" />
          <div className="p-3 space-y-3">
            <div className="flex justify-between items-start">
              <div className="h-3.5 w-3/4 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-3.5 w-3.5 rounded-full bg-gray-100 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-1/2 rounded-full bg-gray-100 animate-pulse" />
              <div className="h-2 w-1/3 rounded-full bg-gray-50 animate-pulse" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
              <div className="space-y-1">
                <div className="h-3 w-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-2 w-6 rounded-full bg-gray-50 animate-pulse" />
              </div>
              <div className="h-7 w-12 rounded-lg bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MostBookedShimmer = () => (
  <div className="w-full overflow-hidden my-4">
    <div className="flex gap-4 px-4 overflow-x-auto scrollbar-hide snap-x">
      {[...Array(4)].map((_, i) => (
        <div
          key={`skeleton-booked-${i}`}
          className="flex-shrink-0 flex items-center gap-4 w-[320px] bg-white border border-gray-100 rounded-xl p-3 h-full relative min-h-[150px] shadow-sm snap-center"
        >
          <div className="w-[90px] h-[90px] flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden animate-pulse" />
          <div className="flex flex-col justify-center flex-1 min-w-0 pr-2 pb-8 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
            <div className="flex items-center space-x-2 mt-1.5">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Page Component ────────────────────────────────────────────────────────────
export default async function MobileHomePage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category || "Wedding";
  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  return (
    <HomePageWrapper
      plannersSlot={
        <Suspense
          key={`planners-${formattedCategory}`}
          fallback={<CarouselShimmer />}
        >
          <AsyncPlannersSection category={formattedCategory} />
        </Suspense>
      }
      trendingSlot={
        <Suspense
          key={`trending-${formattedCategory}`}
          fallback={<CarouselShimmer />}
        >
          <AsyncTrendingSection category={formattedCategory} />
        </Suspense>
      }
      mostBookedSlot={
        <Suspense
          key={`booked-${formattedCategory}`}
          fallback={<MostBookedShimmer />}
        >
          <AsyncMostBookedSection category={formattedCategory} />
        </Suspense>
      }
    />
  );
}