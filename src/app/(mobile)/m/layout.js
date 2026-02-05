import ClientWrapper from "@/components/mobile/ClientWrapper";
import ConditionalNavbar from "@/components/mobile/ConditionalNavbar";
import ForceLightMode from "@/components/mobile/ForceLightMode";

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