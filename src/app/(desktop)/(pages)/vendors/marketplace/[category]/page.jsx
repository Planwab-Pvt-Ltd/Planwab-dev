// app/(desktop)/vendors/marketplace/[category]/page.jsx
// Dynamic category marketplace page — /vendors/marketplace/:category
//
// SEO STRATEGY:
// - Category from PATH (not query param) → properly indexable static URL
// - Each category gets its own rich title, description, keywords, OG image, schema
// - Filter/sort/price/search params → noindex (transient filtered views)
// - City param → index:true (city in title/desc), canonical to clean category URL
//   (consolidates all ?cities= variants' link equity into the base category URL)
// - BreadcrumbList + CollectionPage + Service schema for every category

import DesktopMarketplacePageWrapper from "@/components/desktop/PagesWrapper/VendorsMarketplacePageWrapper";
import {
  buildCategoryMetadata,
  buildCategorySchema,
  CATEGORY_SEO,
  MAJOR_CITIES,
} from "../../../../../../lib/seo/marketplace";

export async function generateStaticParams() {
  return Object.keys(CATEGORY_SEO).map((slug) => ({ category: slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
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
export default async function CategoryMarketplacePage({ params, searchParams }) {
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
      <DesktopMarketplacePageWrapper />
    </>
  );
}