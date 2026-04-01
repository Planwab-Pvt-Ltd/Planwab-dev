import mongoose from "mongoose";
import { ok, badRequest, notFound, serverError } from "../../../../../lib/apiResponse";
import connectToDatabase from "../../../../../database/mongoose";
import ReelsModel from "../../../../../database/models/ReelsModel";
import "../../../../../database/models/VendorProfileModel";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequest("Invalid reel ID");
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(20, parseInt(searchParams.get("limit") || "6"));

    const source = await ReelsModel.findById(id)
      .select("category tags city similarVendors type subType nestedType")
      .lean();

    if (!source) return notFound("Source reel not found");

    // ── 1. Fetch Related Reels via Aggregation ─────────────────────────
    const relatedReels = await ReelsModel.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(id) },
          isActive: true,
          $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } },
          ],
        },
      },
      {
        $addFields: {
          relevanceScore: {
            $add: [
              { $cond: [{ $eq: ["$category", source.category] }, 10, 0] },
              { $cond: [{ $eq: ["$type", source.type] }, 6, 0] },
              { $cond: [{ $eq: ["$subType", source.subType] }, 4, 0] }, // Fixed schema casing
              { $cond: [{ $eq: ["$city", source.city] }, 3, 0] },
              {
                $size: {
                  $ifNull: [
                    { $setIntersection: ["$tags", source.tags || []] },
                    [],
                  ],
                },
              },
              { $multiply: [{ $ifNull: ["$priority", 0] }, 0.1] }, // Scale priority down so it doesn't override relevance
            ],
          },
        },
      },
      { $sort: { relevanceScore: -1, publishedAt: -1 } },
      { $limit: limit },
      {
        $project: {
          title: 1, category: 1, thumbnailUrl: 1, videoUrl: 1,
          viewCount: 1, likeCount: 1, isFeatured: 1, type: 1,
          subType: 1, nestedType: 1, similarVendors: 1, relevanceScore: 1,
        },
      },
    ]);

    // ── 2. Resolve Similar Vendors ─────────────────────────────────────
    let vendorProfiles = [];
    const vendorIds = source.similarVendors || [];

    if (vendorIds.length > 0) {
      const objectIds = vendorIds
        .filter((vid) => mongoose.Types.ObjectId.isValid(vid))
        .map((vid) => new mongoose.Types.ObjectId(vid));

      if (objectIds.length > 0) {
        vendorProfiles = await mongoose.model("VendorProfile").find({
          _id: { $in: objectIds }
        }).select(
          "vendorBusinessName vendorName username bio vendorAvatar vendorCoverImage category trust location likes trustedBy highlights posts reels createdAt"
        ).lean();
        
        // Clean up arrays to counts as requested by frontend
        vendorProfiles = vendorProfiles.map(vp => ({
          ...vp,
          likesCount: vp.likes?.length || 0,
          trustedByCount: vp.trustedBy?.length || 0,
          highlightsCount: vp.highlights?.length || 0,
          postsCount: vp.posts?.length || 0,
          reelsCount: vp.reels?.length || 0,
        }));
      }
    }

    return ok({
      reels: relatedReels,
      similarVendors: vendorProfiles,
      count: relatedReels.length,
      vendorCount: vendorProfiles.length,
    });
  } catch (error) {
    return serverError("Failed to fetch related reels", error);
  }
}