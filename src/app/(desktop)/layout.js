import ClientWrapper from "@/components/desktop/ClientWrapper";
import ConditionalNavbar from "../../components/desktop/ConditionalNavbar";

const DOMAIN = "https://www.planwab.com";

export const metadata = {
  metadataBase: new URL(DOMAIN),

  // Desktop route group inherits site-wide robots from root layout.
  // Restating them here as an explicit safety net.
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
    siteName: "PlanWAB",
    locale: "en_IN",
    type: "website",
  },

  // NOTE: No canonical set at layout level.
  // Each page sets its own canonical to its specific URL.
  // If we set canonical: DOMAIN here, every desktop sub-page would
  // wrongly claim its canonical is the homepage.
};

export default function DesktopLayout({ children }) {
  return (
    <>
      <ClientWrapper>
        {children}
      </ClientWrapper>
      <ConditionalNavbar />
    </>
  );
}