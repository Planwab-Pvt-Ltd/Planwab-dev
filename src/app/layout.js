import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeClerkProvider from "../lib/ThemeClerkProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import ReactQueryProvider from "../components/providers/ReactQueryProvider";
import ClientModalWrapper from "../components/shared/ClientModalWrapper";
import { GoogleAnalytics } from "@next/third-parties/google";

// display:"swap" prevents render-blocking fonts → better LCP score
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const DOMAIN = "https://www.planwab.com";

// ─── Site-wide Metadata ───────────────────────────────────────────────────────
export const metadata = {
  metadataBase: new URL(DOMAIN),

  title: {
    default:
      "PlanWAB – Book Event Vendors for Weddings, Birthdays & Anniversaries in India",
    template: "%s | PlanWAB",
  },

  description:
    "India's most affordable event planning marketplace. Find and book verified photographers, decorators, caterers & more for Weddings, Anniversaries and Birthdays. Compare quotes and book online instantly.",

  keywords: [
    "event vendor marketplace India",
    "book wedding vendors online",
    "affordable wedding planning India",
    "birthday party vendors near me",
    "anniversary event planning",
    "wedding photographers India",
    "event decorators near me",
    "wedding caterers India",
    "online event booking platform",
    "PlanWAB",
    "shaadi vendors online",
    "wedding vendors Delhi NCR",
    "wedding vendors Noida",
    "wedding vendors Mumbai",
    "best wedding marketplace India",
    "budget wedding vendors",
  ],

  authors: [{ name: "PlanWAB Team", url: DOMAIN }],
  creator: "PlanWAB",
  publisher: "PlanWAB",
  category: "Events & Wedding Planning",
  classification: "Event Vendor Marketplace",

  alternates: {
    canonical: DOMAIN,
    languages: {
      "en-IN": DOMAIN,
      "x-default": DOMAIN,
    },
  },

  robots: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "PlanWAB – India's Event Vendor Marketplace",
    description:
      "Book verified photographers, decorators, caterers and more for your Wedding, Anniversary or Birthday. Affordable prices, trusted vendors across India.",
    url: DOMAIN,
    siteName: "PlanWAB",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto,f_auto/v1772043937/VenuesEventsDesktopCarHeaderCard_itlslv.png",
        width: 1200,
        height: 630,
        alt: "PlanWAB – Event Vendor Marketplace India – Book Vendors Online",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@planwab",
    creator: "@planwab",
    title: "PlanWAB – Book Event Vendors in India",
    description:
      "Find verified vendors for weddings, birthdays & anniversaries. Compare quotes and book online instantly.",
    images: [
      "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto,f_auto/v1771864973/wedding_fplcb3.png",
    ],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },

  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "PlanWAB",
    statusBarStyle: "default",
    capable: true,
  },

  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "DC.language": "en-IN",
    "DC.publisher": "PlanWAB",
    "DC.subject": "Event Planning, Wedding Vendors, Birthday Vendors",
  },
};

// ─── Viewport ─────────────────────────────────────────────────────────────────
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

function RootStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Organization — brand identity, logo, social profiles for Knowledge Panel
      {
        "@type": "Organization",
        "@id": `${DOMAIN}/#organization`,
        name: "PlanWAB",
        alternateName: "Plan WAB",
        url: DOMAIN,
        logo: {
          "@type": "ImageObject",
          "@id": `${DOMAIN}/#logo`,
          url: `${DOMAIN}/planwablogo.png`,
          contentUrl: `${DOMAIN}/planwablogo.png`,
          width: 200,
          height: 60,
          caption: "PlanWAB Logo",
        },
        image: { "@id": `${DOMAIN}/#logo` },
        description:
          "PlanWAB is India's most affordable event planning marketplace connecting users with verified vendors for weddings, anniversaries, and birthdays.",
        foundingDate: "2023",
        foundingLocation: { "@type": "Place", name: "Noida, India" },
        areaServed: { "@type": "Country", name: "India" },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+91-6267430959",
            contactType: "customer service",
            availableLanguage: ["English", "Hindi"],
            areaServed: "IN",
          },
        ],
        sameAs: [
          "https://www.instagram.com/planwab.official?igsh=MWlqMmxpcnF6NThjZw==",
          "https://www.facebook.com/planwab",
          "https://twitter.com/planwab",
          "https://www.linkedin.com/company/planwab/",
          "https://www.youtube.com/@planwab",
        ],
      },

      // 2. WebSite — enables the Sitelinks Searchbox in Google results
      {
        "@type": "WebSite",
        "@id": `${DOMAIN}/#website`,
        url: DOMAIN,
        name: "PlanWAB",
        description:
          "India's most affordable event planning and vendor booking marketplace",
        publisher: { "@id": `${DOMAIN}/#organization` },
        inLanguage: "en-IN",
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${DOMAIN}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        ],
      },

      // 3. LocalBusiness — Google Maps / Local Pack eligibility
      {
        "@type": ["LocalBusiness", "EventPlanningService"],
        "@id": `${DOMAIN}/#business`,
        name: "PlanWAB",
        url: DOMAIN,
        image:
          "https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto,f_auto/v1772043937/VenuesEventsDesktopCarHeaderCard_itlslv.png",
        logo: `${DOMAIN}/planwablogo.png`,
        description:
          "PlanWAB is India's leading event planning marketplace. Book verified photographers, decorators, caterers, DJs and more for weddings, anniversaries, and birthdays.",
        telephone: "+91-6267430959",
        priceRange: "₹₹",
        currenciesAccepted: "INR",
        paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Net Banking",
        openingHours: "Mo-Su 09:00-21:00",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
          addressRegion: "Uttar Pradesh",
          addressLocality: "Noida",
        },
        areaServed: [
          { "@type": "City", name: "Delhi" },
          { "@type": "City", name: "Noida" },
          { "@type": "City", name: "Mumbai" },
          { "@type": "City", name: "Bangalore" },
          { "@type": "State", name: "India" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Event Vendor Services",
          itemListElement: [
            {
              "@type": "OfferCatalog",
              name: "Wedding Vendors",
              description: "Photographers, decorators, caterers, DJs for weddings",
            },
            {
              "@type": "OfferCatalog",
              name: "Birthday Party Vendors",
              description: "Decorators, cakes, entertainment for birthday parties",
            },
            {
              "@type": "OfferCatalog",
              name: "Anniversary Event Vendors",
              description:
                "Romantic event planners and decorators for anniversaries",
            },
          ],
        },
        parentOrganization: { "@id": `${DOMAIN}/#organization` },
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

// ─── Root Layout Component ────────────────────────────────────────────────────
export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <ThemeClerkProvider>
          <html lang="en-IN" suppressHydrationWarning>
            <head>
              <RootStructuredData />

              <link rel="preconnect" href="https://res.cloudinary.com" />
              <link rel="preconnect" href="https://planwab.b-cdn.net" />
              <link rel="dns-prefetch" href="https://www.google-analytics.com" />
            </head>
            <body
              className={`${geistSans.variable} ${geistMono.variable} font-sans bg-gray-50 text-gray-900`}
            >
              <NextTopLoader
                color="#2563eb"
                height={3}
                crawl={false}
                showSpinner={false}
                easing="linear"
                speed={300}
                shadow={false}
                zIndex={1600}
              />
              {children}
              <GoogleAnalytics
                gaId={process.env.NEXT_PUBLIC_GA_ID || "G-ML8HLB62X6"}
              />
              <Toaster position="bottom-center" richColors closeButton />
              <ClientModalWrapper />
            </body>
          </html>
        </ThemeClerkProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}