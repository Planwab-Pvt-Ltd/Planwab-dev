// app/(desktop)/vendors/marketplace/page.jsx
// Main marketplace listing page — /vendors/marketplace
//
// SEO STRATEGY:
// - Clean URL (no params) → index:true, full rich metadata + schema
// - Any filter/sort/price/search/category params → noindex, canonical to clean URL
// - City param → index:true, canonical to clean URL (local SEO in title/desc only)
// - Vary: User-Agent already set by middleware — Google handles dynamic serving

import DesktopMarketplacePageWrapper from "@/components/desktop/PagesWrapper/VendorsMarketplacePageWrapper";
import { buildMarketplaceMetadata, buildMarketplaceSchema } from "../../../../../lib/seo/marketplace";

// ─── Metadata ─────────────────────────────────────────────────────────────────
// searchParams drive noindex/canonical decisions — filter views shouldn't be indexed.
export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  return buildMarketplaceMetadata(resolvedParams);
}

// ─── Schema Component ─────────────────────────────────────────────────────────
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
export default async function MarketplacePage({ searchParams }) {
  return (
    <>
      <MarketplaceStructuredData />
      <DesktopMarketplacePageWrapper />
    </>
  );
}