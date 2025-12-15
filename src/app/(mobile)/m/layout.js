import ClientWrapper from "@/components/mobile/ClientWrapper";

export const metadata = {
  title: "PlanWAB - Events Planning Made Easy",
  description: "Your one-stop solution for planning Weddings, Anniversaries, and Birthdays.",
};

export default function MobileLayout({ children }) {
  return (
    <>
      <main>
        <ClientWrapper>{children}</ClientWrapper>
      </main>
    </>
  );
}
