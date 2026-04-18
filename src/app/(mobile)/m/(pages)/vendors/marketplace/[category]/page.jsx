// app/(mobile)/m/vendors/marketplace/[category]/page.jsx
// Mobile category marketplace page — internally rewrites from /vendors/marketplace/:category
//
// CRITICAL: Google's mobile Googlebot hits /vendors/marketplace/photographers
// → middleware rewrites to /m/vendors/marketplace/photographers → THIS renders.
// The public URL is /vendors/marketplace/photographers — same as desktop.
//
// Since Google uses mobile-first indexing, THIS page's metadata and schema are
// what actually determine rankings. Must be SEO-complete, not a stripped version.

import MarketplacePageWrapper from "@/components/mobile/PagesWrapper/VendorsMarketplacePageWrapper";
import {
  buildCategoryMetadata,
  buildCategorySchema,
  CATEGORY_SEO,
  MAJOR_CITIES,
} from "../../../../../../../lib/seo/marketplace";

// ─── generateStaticParams ──────────────────────────────────────────────────────
// Pre-renders all known mobile category pages at build time.
// Means Google's mobile bot hits pre-rendered HTML — best possible TTFB + LCP.
export async function generateStaticParams() {
  return Object.keys(CATEGORY_SEO).map((slug) => ({ category: slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
// Same builder as desktop. Identical SEO output.
// This is the metadata Google's mobile crawler actually reads.
export async function generateMetadata({ params, searchParams }) {
  const [resolvedParams, resolvedSearch] = await Promise.all([
    params,
    searchParams,
  ]);
  return buildCategoryMetadata(resolvedParams.category, resolvedSearch);
}

// ─── Schema Component ─────────────────────────────────────────────────────────
function CategoryStructuredData({ categorySlug, cityLabel }) {
  const schema = buildCategorySchema(categorySlug, cityLabel);
  if (!schema) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function MobileCategoryMarketplacePage({ params, searchParams }) {
  const [resolvedParams, resolvedSearch] = await Promise.all([
    params,
    searchParams,
  ]);
  const { category } = resolvedParams;
  const { cities } = resolvedSearch;
  const cityLabel = cities ? (MAJOR_CITIES[cities] || cities) : "";

  return (
    <>
      <CategoryStructuredData categorySlug={category} cityLabel={cityLabel} />
      <MarketplacePageWrapper />
    </>
  );
}