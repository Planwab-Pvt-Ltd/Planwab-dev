"use client";

import { usePathname } from "next/navigation";
import MobileNavbar from "@/components/mobile/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  const hiddenPaths = ["/m/user/checkout"];

  const shouldHide = hiddenPaths.some((path) => pathname.includes(path));

  if (shouldHide) return null;

  return <MobileNavbar />;
}
