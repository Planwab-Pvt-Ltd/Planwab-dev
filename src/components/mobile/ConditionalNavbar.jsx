"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const MobileNavbar = dynamic(() => import("@/components/mobile/Navbar"), { ssr: false });

export default function ConditionalNavbar() {
  const pathname = usePathname();

  const hiddenPaths = ["/user/checkout", "/vendor/", "/admin/", "/vendor/", '/user/checkout', "/events/", "/plan-my-event/"];
  const shouldHide = hiddenPaths.some((path) => pathname.includes(path));

  if (shouldHide) return null;

  return <MobileNavbar />;
}
