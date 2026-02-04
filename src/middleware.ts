import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, userAgent } from "next/server";

const isAdminRoute = createRouteMatcher([
  "/admin(.*)", 
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // 1. Auth Protection
 if (isAdminRoute(req)) {
    await auth.protect();
  }

  // 2. Skip internal files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 3. Device Detection
  const { device } = userAgent(req);
  const isMobile = device.type === "mobile";

  // 4. PREVENT DIRECT ACCESS TO /m ON DESKTOP
  // If a desktop user tries to go to planwab.com/m/..., force them to planwab.com/...
  if (!isMobile && pathname.startsWith("/m")) {
    const newPath = pathname.replace("/m", "");
    url.pathname = newPath === "" ? "/" : newPath;
    return NextResponse.redirect(url);
  }

  // 5. ADAPTIVE REWRITE FOR MOBILE
  // If mobile user visits "/", internally fetch "/m" but keep URL as "/"
  if (isMobile) {
    // Prevent redirect loops if already on a rewritten path (rare but safe)
    if (!pathname.startsWith("/m")) {
      url.pathname = `/m${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // FIX: Added 'mp4', 'webm', 'json' to the ignore list so videos load instantly
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm|json)).*)",
    "/(api|trpc)(.*)",
  ],
};