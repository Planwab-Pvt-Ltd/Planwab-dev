import ClientWrapper from "@/components/mobile/ClientWrapper";
import AppEntryGate from "@/components/mobile/AppEntryGate";
import ConditionalNavbar from "@/components/mobile/ConditionalNavbar";
import ForceLightMode from "@/components/mobile/ForceLightMode"; // Import the helper

// 1. SCOPED METADATA (SEO)
export const metadata = {
  title: {
    default: "PlanWAB Marketplace",
    template: "%s | PlanWAB", // Shows "Wedding | PlanWAB" in browser tab
  },
  description: "Book verified event vendors, plan weddings, and manage bookings on the PlanWAB App.",
  // Mobile specific view settings
  appleWebApp: {
    title: "PlanWAB",
    statusBarStyle: "default",
  },
};

export default function MobileLayout({ children }) {
  return (
    <>
      <ForceLightMode>
        <main>
          <ClientWrapper>
            <AppEntryGate>{children}</AppEntryGate>
          </ClientWrapper>
        </main>
        <ConditionalNavbar />
      </ForceLightMode>
    </>
  );
}
