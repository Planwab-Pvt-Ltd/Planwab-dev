// app/(mobile)/m/vendors/marketplace/page.jsx
// Mobile marketplace page — internally rewrites from /vendors/marketplace
//
// CRITICAL: This page serves the SAME PUBLIC URL as the desktop version.
// Google's mobile Googlebot hits /vendors/marketplace → middleware rewrites
// internally to /m/vendors/marketplace → THIS file renders.
// The URL in Google's index is /vendors/marketplace — identical to desktop.
//
// Therefore: metadata here must be IDENTICAL in SEO quality to the desktop page.
// Same title, description, canonical, schema. Same robots rules.
// The only difference is the React component rendered (mobile vs desktop UI).

import MarketplacePageWrapper from "@/components/mobile/PagesWrapper/VendorsMarketplacePageWrapper";
import { buildMarketplaceMetadata, buildMarketplaceSchema } from "../../../../../../lib/seo/marketplace";

// ─── Metadata ─────────────────────────────────────────────────────────────────
// Uses the same builder as the desktop page — identical SEO output.
// Google's mobile-first crawler reads THIS metadata for ranking decisions.
export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  return buildMarketplaceMetadata(resolvedParams);
}

// ─── Schema Component ─────────────────────────────────────────────────────────
// Google's mobile crawler indexes this structured data.
// Must be present and complete — mobile schema = what Google actually processes.
function MarketplaceStructuredData() {
  const schema = buildMarketplaceSchema();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function MobileMarketplacePage({ searchParams }) {
  return (
    <>
      <MarketplaceStructuredData />
      <MarketplacePageWrapper />
    </>
  );
}