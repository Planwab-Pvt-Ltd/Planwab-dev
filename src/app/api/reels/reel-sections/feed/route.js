// app/api/reel-sections/feed/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../database/mongoose";
import Reel, { ReelSection } from "../../../../../database/models/ReelsModel";

/**
 * Utility to rigorously clean URL parameters.
 * Converts "null", "undefined", "all", or empty strings into a JS `null`.
 */
const cleanParam = (val) => {
  if (!val) return null;
  const cleaned = val.trim();
  if (cleaned === "" || cleaned === "null" || cleaned === "undefined" || cleaned === "all") {
    return null;
  }
  return cleaned;
};

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    // 1. Extract and sanitize parameters
    const type = cleanParam(searchParams.get("type"));
    const category = cleanParam(searchParams.get("category"));
    const subcategory = cleanParam(searchParams.get("subcategory"));
    const subType = cleanParam(searchParams.get("subType"));
    const nestedType = cleanParam(searchParams.get("nestedType"));

    if (!type) {
      return NextResponse.json(
        { success: false, message: "Event type is required to fetch feed sections" },
        { status: 400 }
      );
    }

    // 2. Construct Dynamic Exact-Match Query
    // We start with the mandatory fields
    const query = { 
      isActive: true, 
      type: type 
    };

    // Standard Filtering Logic:
    // If the frontend provided a parameter, add it to the query for an exact match.
    // If it was omitted, we DO NOT add it. This acts as a wildcard, meaning 
    // it will match the section regardless of what that specific field is set to in the DB.
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (subType) query.subType = subType;
    if (nestedType) query.nestedType = nestedType;

    // 3. Fetch from DB with rigorous population filtering
    const sections = await ReelSection.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .populate({
        path: "linkedReels",
        match: { isActive: true }, // Only populate reels that are currently active
        select: "title thumbnailUrl videoUrl vendorId priority likeCount city location isFeatured isSponsored caption description category type subType nestedType viewCount shareCount saveCount commentCount similarVendors musicTitle musicArtist hashtags ctaText ctaLink publishedAt createdAt"
      })
      .lean();

    // 4. Format the response and prune empty sections
    const formattedSections = sections
      .map((sec) => {
        // Safely extract and format reels, removing any nulls (prevents crashes if a reel was deleted but its ID remained)
        const activeReels = (sec.linkedReels || [])
          .filter(reel => reel !== null)
          .map(reel => ({
            ...reel,
            id: reel._id.toString(),
          }));

        return {
          id: sec._id.toString(),
          title: sec.title || "",
          subtitle: sec.subtitle || "",
          isCustomSection: true,
          items: activeReels,
        };
      })
      // CRITICAL: Filter out any sections that have 0 active reels after population
      .filter((sec) => sec.items.length > 0);

    return NextResponse.json({ 
      success: true, 
      count: formattedSections.length,
      data: formattedSections 
    });

  } catch (error) {
    console.error("Error fetching feed reel sections:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}