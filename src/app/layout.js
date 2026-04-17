import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeClerkProvider from "../lib/ThemeClerkProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import ReactQueryProvider from "../components/providers/ReactQueryProvider";
import ClientModalWrapper from "../components/shared/ClientModalWrapper";
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DOMAIN = "https://www.planwab.com";
 
export const metadata = {
  metadataBase: new URL(DOMAIN),
 
  // ─── Title ────────────────────────────────────────────────────────────────
  title: {
    default:
      "PlanWAB – Book Event Vendors for Weddings, Birthdays & Anniversaries in India",
    template: "%s | PlanWAB",
  },
 
  // ─── Description ──────────────────────────────────────────────────────────
  description:
    "India's most affordable event planning marketplace. Find and book verified photographers, decorators, caterers & more for Weddings, Anniversaries and Birthdays. Compare quotes and book online instantly.",
 
  // ─── Keywords ─────────────────────────────────────────────────────────────
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
 
  // ─── Author / Publisher ───────────────────────────────────────────────────
  authors: [{ name: "PlanWAB Team", url: DOMAIN }],
  creator: "PlanWAB",
  publisher: "PlanWAB",
  category: "Events & Wedding Planning",
  classification: "Event Vendor Marketplace",
 
  // ─── Canonical ────────────────────────────────────────────────────────────
  alternates: {
    canonical: DOMAIN,
    languages: {
      "en-IN": DOMAIN,
      "x-default": DOMAIN,
    },
  },
 
  // ─── Robots ───────────────────────────────────────────────────────────────
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
 
  // ─── Open Graph ───────────────────────────────────────────────────────────
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
        url: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771865168/events_osoyqb.png",
        width: 1200,
        height: 630,
        alt: "PlanWAB – Event Vendor Marketplace India – Book Vendors Online",
      },
    ],
  },
 
  // ─── Twitter Card ─────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@planwab",       // ← update with your actual handle
    creator: "@planwab",
    title: "PlanWAB – Book Event Vendors in India",
    description:
      "Find verified vendors for weddings, birthdays & anniversaries. Compare quotes and book online instantly.",
    images: [
      "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771864973/wedding_fplcb3.png",
    ],
  },
 
  // ─── Icons ────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
 
  // ─── PWA / Web App ────────────────────────────────────────────────────────
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "PlanWAB",
    statusBarStyle: "default",
    capable: true,
  },
 
  // ─── Geo / Locale Signals ─────────────────────────────────────────────────
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "DC.language": "en-IN",
    "DC.publisher": "PlanWAB",
    "DC.subject": "Event Planning, Wedding Vendors, Birthday Vendors",
  },
};
 
// ─── Viewport (separate export, not inside metadata) ──────────────────────────
// NOTE: maximumScale:1 + userScalable:false is a Google ranking signal penalty
// on mobile. Changed to allow zooming for accessibility compliance.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  viewportFit: "cover",
};
 
// ─── Root JSON-LD Schema Graph ────────────────────────────────────────────────
// Uses @graph so Google can connect Organization + WebSite + LocalBusiness
// as one unified entity for Knowledge Panel eligibility
function RootStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Organization — brand identity, logo, social profiles
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
        foundingLocation: {
          "@type": "Place",
          name: "Noida, India",
        },
        areaServed: {
          "@type": "Country",
          name: "India",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+91-6267430959",
            contactType: "customer service",
            availableLanguage: ["English", "Hindi"],
            areaServed: "IN",
            contactOption: "TollFree",
          },
        ],
        sameAs: [
          // ← replace with your actual social URLs
          "https://www.instagram.com/planwab.official?igsh=MWlqMmxpcnF6NThjZw==",
          "https://www.facebook.com/planwab",
          "https://twitter.com/planwab",
          "https://www.linkedin.com/company/planwab/",
          "https://www.youtube.com/@planwab",
        ],
      },
 
      // 2. WebSite — enables Sitelinks Searchbox in Google results
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
 
      // 3. LocalBusiness — eligibility for Google Maps, Local Pack
      {
        "@type": ["LocalBusiness", "EventPlanningService"],
        "@id": `${DOMAIN}/#business`,
        name: "PlanWAB",
        url: DOMAIN,
        image: `https://res.cloudinary.com/dhkkvo36x/image/upload/q_auto/f_auto/v1772043937/VenuesEventsDesktopCarHeaderCard_itlslv.png`,
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
              description:
                "Photographers, decorators, caterers, DJs for weddings",
            },
            {
              "@type": "OfferCatalog",
              name: "Birthday Party Vendors",
              description: "Decorators, cakes, entertainment for birthday parties",
            },
            {
              "@type": "OfferCatalog",
              name: "Anniversary Event Vendors",
              description: "Romantic event planners and decorators for anniversaries",
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

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventPlanner",
    name: "PlanWAB",
    url: DOMAIN,
    logo: `${DOMAIN}/planwablogo.png`,
    image: `${DOMAIN}/WeddingDesign.png`,
    description: "PlanWAB is an event planning marketplace connecting users with verified vendors.",
    telephone: "+91-6267430959",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressRegion: "Noida",
    },
    offers: {
      "@type": "Offer",
      description: "Affordable booking for Event Vendors and Full Planning Services",
    },
  };

  return (
    <ThemeProvider>
      <ReactQueryProvider>
      <ThemeClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          </head>
          <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-gray-50 text-gray-900`}>
            <NextTopLoader color="#2563eb" height={3} crawl={false} showSpinner={false} easing="linear" speed={300} shadow={false} zIndex={1600} />
            {children}
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-ML8HLB62X6"} />
            <Toaster position="bottom-center" richColors closeButton />
            <ClientModalWrapper />
          </body>
        </html>
      </ThemeClerkProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}