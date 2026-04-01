import ClientWrapper from "@/components/desktop/ClientWrapper";
import ConditionalNavbar from "../../components/desktop/ConditionalNavbar";

export const metadata = {
  title: "PlanWAB - Events Planning Made Easy",
  description: "Your one-stop solution for planning Weddings, Anniversaries, and Birthdays.",
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