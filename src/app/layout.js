import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeClerkProvider from "../lib/ThemeClerkProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. DOMAIN CONFIGURATION
const DOMAIN = "https://www.planwab.com";
const SITE_NAME = "PlanWAB";

export const metadata = {
  metadataBase: new URL(DOMAIN),

  // 2. SEO TITLE STRATEGY
  title: {
    default: "PlanWAB - Book Event Vendors & Plan Weddings, Birthdays Online",
    template: "%s | PlanWAB Marketplace",
  },

  // 3. CONVERSION-FOCUSED DESCRIPTION
  description:
    "India's most affordable event planning marketplace. Find and book verified vendors for Weddings, Anniversaries, and Birthdays. One-stop solution for catering, decor, photography, and more.",

  // 4. MARKETPLACE KEYWORDS
  keywords: [
    "Event Vendor Marketplace",
    "Book Wedding Vendors India",
    "Affordable Event Planning",
    "Birthday Party Organizers",
    "Wedding Photographers Booking",
    "Catering Services Price",
    "Anniversary Decoration Ideas",
    "PlanWAB",
    "Event Management Noida",
    "Online Event Booking",
  ],

  authors: [{ name: "PlanWAB Team", url: DOMAIN }],
  creator: "PlanWAB",
  publisher: "PlanWAB",

  // 5. ROBOTS & INDEXING
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // 6. SOCIAL MEDIA SHARING (WhatsApp/Insta/LinkedIn)
  openGraph: {
    title: "PlanWAB - Plan Your Dream Event & Book Vendors",
    description: "Compare and book the best vendors for your Wedding, Anniversary, or Birthday at affordable prices.",
    url: DOMAIN,
    siteName: SITE_NAME,
    locale: "en_US", // or 'en_IN' if you prefer localization strictly to India
    type: "website",
    images: [
      {
        url: "/WeddingDesign.png", // Visually attractive image for social cards
        width: 1200,
        height: 630,
        alt: "PlanWAB Wedding Planning",
      },
      {
        url: "/planwablogo.png",
        width: 800,
        height: 800,
        alt: "PlanWAB Logo",
      },
    ],
  },

  // 7. TWITTER CARDS
  twitter: {
    card: "summary_large_image",
    title: "PlanWAB - The Event Vendor Marketplace",
    description: "Find affordable vendors for weddings and parties. Booking made easy.",
    images: ["/WeddingDesign.png"],
  },

  // 8. CANONICAL TAGS (Prevents Duplicate Content)
  alternates: {
    canonical: DOMAIN,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  // 9. SCHEMA MARKUP (The "Secret Sauce" for Google Rich Results)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventPlanner", // Identifying as an Event Planning Service
    name: "PlanWAB",
    alternateName: "PlanWAB Event Marketplace",
    url: DOMAIN,
    logo: `${DOMAIN}/planwablogo.png`,
    image: `${DOMAIN}/WeddingDesign.png`,
    description:
      "PlanWAB is an event planning marketplace connecting users with verified vendors for weddings, birthdays, and anniversaries at affordable costs.",
    telephone: "+91-6267430959",
    priceRange: "₹₹", // Indicates affordability
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressRegion: "Noida", // Defaulting to your operational hub based on context
    },
    sameAs: [
      // Add your social media links here in the future to build authority
      // "https://www.instagram.com/planwab",
      // "https://www.facebook.com/planwab"
    ],
    offers: {
      "@type": "Offer",
      description: "Affordable booking for Event Vendors and Full Planning Services",
    },
  };

  return (
    <ThemeProvider>
      <ThemeClerkProvider>
        <html lang="en">
          <head>
            {/* Inject Structured Data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          </head>

          {/* Preload Critical Assets */}
          <link rel="preload" href="/Loading/loading1.mp4" as="video" type="video/mp4" />
          <link rel="preload" href="/CatVideos/EventsHeroMob.mp4" as="video" type="video/mp4" />
          <link rel="preload" href="/CatVideos/WeddingHeroMob.mp4" as="video" type="video/mp4" />
          <link rel="preload" href="/CatVideos/AnniversaryHeroMob.mp4" as="video" type="video/mp4" />
          <link rel="preload" href="/CatVideos/BirthdayHeroMob.mp4" as="video" type="video/mp4" />

          <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-gray-50 text-gray-900`}>
            <NextTopLoader
              color="#2563eb"
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #2563eb,0 0 5px #2563eb"
              zIndex={1600}
              showAtBottom={false}
            />
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  padding: "16px",
                  borderRadius: "12px",
                },
                className: "my-toast",
                duration: 4000,
              }}
              richColors
              closeButton
            />
          </body>
        </html>
      </ThemeClerkProvider>
    </ThemeProvider>
  );
}
