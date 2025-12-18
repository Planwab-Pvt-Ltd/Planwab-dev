import ClientWrapper from "@/components/mobile/ClientWrapper";
import AppEntryGate from "@/components/mobile/AppEntryGate";
import MobileNavbar from "@/components/mobile/Navbar";

export const metadata = {
  title: "PlanWAB - Events Planning Made Easy",
  description: "Your one-stop solution for planning Weddings, Anniversaries, and Birthdays.",
};

export default function MobileLayout({ children }) {
  return (
    <>
      <main>
        <ClientWrapper>
          <AppEntryGate>{children}</AppEntryGate>
        </ClientWrapper>
      </main>
      <MobileNavbar />
    </>
  );
}
