"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <main>{children}</main>
    </>
  );
}
