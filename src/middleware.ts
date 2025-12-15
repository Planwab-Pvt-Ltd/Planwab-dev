import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, userAgent } from "next/server";

// 1. DEFINE PUBLIC ROUTES
// Add any route here that should be accessible WITHOUT logging in.
// We MUST include "/" and "/m" so the Landing Pages are visible.
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/(.*)", "/m(.*)", "/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // 2. PROTECT PRIVATE ROUTES
  // If the route is NOT public, enforce authentication.
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // 3. STOP: Ignore API routes, Next.js internals, and static files
  // We do not want to redirect API calls or image fetches.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") // Skips images (e.g., logo.png), fonts, etc.
  ) {
    return NextResponse.next();
  }

  // 4. IDENTIFY DEVICE
  const { device } = userAgent(req);
  const isMobile = device.type === "mobile";

  // 5. SHARED AUTH EXCEPTION (CRITICAL)
  // Your auth pages are at the root. Do NOT redirect mobile users to "/m/sign-in".
  // This prevents the 404 error on login.
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return NextResponse.next();
  }

  // 6. MOBILE REDIRECT LOGIC
  if (isMobile) {
    // A. If mobile user hits the root "/", send them to "/m"
    if (pathname === "/") {
      url.pathname = "/m";
      return NextResponse.redirect(url);
    }

    // B. If mobile user hits a sub-page (e.g., /about) and is NOT in /m
    if (!pathname.startsWith("/m")) {
      url.pathname = `/m${pathname}`;
      return NextResponse.redirect(url);
    }
  }

  // 7. DESKTOP REDIRECT LOGIC
  // If desktop user tries to access "/m", send them back to the desktop equivalent
  if (!isMobile && pathname.startsWith("/m")) {
    const newPath = pathname.replace("/m", "");
    // If stripping /m leaves an empty string, go to root "/"
    url.pathname = newPath === "" ? "/" : newPath;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Standard Next.js matcher to skip static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
