"use client";

import { usePathname } from "next/navigation";
import DesktopHeader from "@/components/desktop/Header";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  return (
    <>
      {!isAdminRoute && <DesktopHeader />}
      <main>{children}</main>
    </>
  );
}
