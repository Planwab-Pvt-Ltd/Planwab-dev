  // app/(mobile)/m/layout.js
  //
  // Route-group layout for the mobile codebase.
  //
  // ─── ARCHITECTURE CLARIFICATION ───────────────────────────────────────────────
  // Your middleware does an INTERNAL rewrite only:
  //   Mobile user visits /vendors/abc
  //   → middleware rewrites to /m/vendors/abc (internal Next.js rewrite)
  //   → browser URL bar still shows /vendors/abc
  //   → response carries Vary: User-Agent header (already set in middleware)
  //
  // This is called "Dynamic Serving" — same URLs, different HTML by device.
  // Google handles this correctly when Vary: User-Agent is present.
  //
  // WHAT THIS MEANS FOR SEO:
  // - ALL pages must be index:true (they serve real, public, indexed URLs)
  // - NO noindex anywhere in the mobile codebase (that was the bug)
  // - Canonical tags on mobile pages point to the SAME URL (not a separate one)
  //   because the URL never changes from the user/Google perspective
  // ─────────────────────────────────────────────────────────────────────────────

  import ClientWrapper from "@/components/mobile/ClientWrapper";
  import ConditionalNavbar from "@/components/mobile/ConditionalNavbar";
  import ForceLightMode from "@/components/mobile/ForceLightMode";

  const DOMAIN = "https://www.planwab.com";

  export const metadata = {
    metadataBase: new URL(DOMAIN),

    // ✅ index:true — mobile pages serve real public URLs. Must be indexed.
    robots: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // ✅ NO canonical set at layout level.

    openGraph: {
      siteName: "PlanWAB",
      locale: "en_IN",
      type: "website",
    },

    appleWebApp: {
      title: "PlanWAB",
      statusBarStyle: "default",
      capable: true,
    },
  };

  export default function MobileLayout({ children }) {
    return (
      <ForceLightMode>
        <ClientWrapper>
          {children}
        </ClientWrapper>
        <ConditionalNavbar />
      </ForceLightMode>
    );
  }