"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const MobileNavbar = dynamic(() => import("@/components/desktop/Navbar"), { ssr: false });

export default function ConditionalNavbar() {
  const pathname = usePathname();

  const hiddenPaths = ["/m/user/checkout", "/m/vendor/", "/m/admin/", "/vendor/", '/user/checkout'];
  const shouldHide = hiddenPaths.some((path) => pathname.includes(path));

  if (shouldHide) return null;

  return <MobileNavbar />;
}
