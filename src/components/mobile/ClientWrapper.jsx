"use client";

import { usePathname } from "next/navigation";
import MobileHeader from "@/components/mobile/Header";
import Footer from "./Footer";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  return (
    <>
      {!isAdminRoute && <MobileHeader />}
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
