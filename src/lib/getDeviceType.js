import { headers } from "next/headers";
import { userAgent } from "next/server";

export async function getDeviceType() {
  if (typeof process === "undefined") {
    // Fallback for purely client-side logic (rare in Server Components)
    return "desktop";
  }

  const headersList = await headers();
  const userAgentString = headersList.get("user-agent") || "";

  // Simple check for mobile devices
  const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgentString);

  return isMobile ? "mobile" : "desktop";
}
