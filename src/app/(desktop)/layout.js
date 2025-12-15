import ClientWrapper from "@/components/desktop/ClientWrapper";

export const metadata = {
  title: "PlanWAB - Events Planning Made Easy",
  description: "Your one-stop solution for planning Weddings, Anniversaries, and Birthdays.",
};

export default function DesktopLayout({ children }) {
  return (
    <>
      <main>
        <ClientWrapper>{children}</ClientWrapper>
      </main>
    </>
  );
}
