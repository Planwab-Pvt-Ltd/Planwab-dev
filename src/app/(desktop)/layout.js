import ClientWrapper from "@/components/desktop/ClientWrapper";
import ConditionalNavbar from "../../components/desktop/ConditionalNavbar";

const DOMAIN = "https://www.planwab.com";
 
export const metadata = {
  metadataBase: new URL(DOMAIN),
 
  // Desktop pages are the canonical source of truth.
  // Individual pages MUST override `alternates.canonical` with their own URL.
  alternates: {
    canonical: DOMAIN,
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
    siteName: "PlanWAB",
    locale: "en_IN",
    type: "website",
  },
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