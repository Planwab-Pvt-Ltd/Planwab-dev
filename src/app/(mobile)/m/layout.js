import ClientWrapper from "@/components/mobile/ClientWrapper";
import ConditionalNavbar from "@/components/mobile/ConditionalNavbar";
import ForceLightMode from "@/components/mobile/ForceLightMode";

// 1. SCOPED METADATA (SEO)
export const metadata = {
  title: {
    default: "PlanWAB Marketplace",
    template: "%s | PlanWAB",
  },
  description: "Book verified event vendors, plan weddings, and manage bookings on the PlanWAB App.",
  appleWebApp: {
    title: "PlanWAB",
    statusBarStyle: "default",
  },
  // CRITICAL: Point Canonical to the ROOT domain, because we are REWRITING, not redirecting.
  // This tells Google "I am the mobile view of the main page."
  alternates: {
    canonical: "https://www.planwab.com", 
  },
};

export default function MobileLayout({ children }) {
  return (
    <ForceLightMode>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      <ConditionalNavbar />
    </ForceLightMode>
  );
}