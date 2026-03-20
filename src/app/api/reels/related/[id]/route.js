// app/api/reels/related/[id]/route.js

import mongoose from "mongoose";
import { ok, badRequest, notFound, serverError } from "../../../../../lib/apiResponse";
import connectToDatabase from "../../../../../database/mongoose";
import ReelsModel from "../../../../../database/models/ReelsModel";
import "../../../../../database/models/VendorProfileModel";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return badRequest("Invalid reel ID");

    const { searchParams } = new URL(request.url);
    const limit = Math.min(20, parseInt(searchParams.get("limit") || "6"));

    // Find the source reel
    const source = await ReelsModel.findById(id)
      .select("category tags city similarVendors type subtype nestedType")
      .lean();

    if (!source) return notFound("Source reel not found");

    // ── 1. Fetch related reels ─────────────────────────────────────────
    const reelQuery = {
      _id: { $ne: new mongoose.Types.ObjectId(id) },
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    const relatedReels = await ReelsModel.aggregate([
      { $match: reelQuery },
      {
        $addFields: {
          relevanceScore: {
            $add: [
              { $cond: [{ $eq: ["$category", source.category] }, 10, 0] },
              { $cond: [{ $eq: ["$type", source.type] }, 6, 0] },
              { $cond: [{ $eq: ["$subtype", source.subtype] }, 4, 0] },
              { $cond: [{ $eq: ["$city", source.city] }, 3, 0] },
              {
                $size: {
                  $ifNull: [
                    { $setIntersection: ["$tags", source.tags || []] },
                    [],
                  ],
                },
              },
              "$priority",
            ],
          },
        },
      },
      { $sort: { relevanceScore: -1, publishedAt: -1 } },
      { $limit: limit },
      {
        $project: {
          title: 1,
          category: 1,
          thumbnailUrl: 1,
          videoUrl: 1,
          viewCount: 1,
          likeCount: 1,
          isFeatured: 1,
          type: 1,
          subtype: 1,
          nestedType: 1,
          similarVendors: 1,
          relevanceScore: 1,
        },
      },
    ]);

    // ── 2. Resolve similarVendors to full vendor profiles ──────────────
    let vendorProfiles = [];

    const vendorIds = source.similarVendors || [];

    if (vendorIds.length > 0) {
      // Convert string IDs to ObjectIds, filtering out any invalid ones
      const objectIds = vendorIds
        .filter((vid) => mongoose.Types.ObjectId.isValid(vid))
        .map((vid) => new mongoose.Types.ObjectId(vid));

      if (objectIds.length > 0) {
        vendorProfiles = await mongoose.model("VendorProfile").aggregate([
          { $match: { _id: { $in: objectIds } } },
          {
            $project: {
              vendorBusinessName: 1,
              vendorName: 1,
              username: 1,
              bio: 1,
              vendorAvatar: 1,
              vendorCoverImage: 1,
              category: 1,
              trust: 1,
              location: {
                city: 1,
                state: 1,
                country: 1,
                address: 1,
              },
              likesCount: { $size: { $ifNull: ["$likes", []] } },
              trustedByCount: { $size: { $ifNull: ["$trustedBy", []] } },
              highlightsCount: { $size: { $ifNull: ["$highlights", []] } },
              postsCount: { $size: { $ifNull: ["$posts", []] } },
              reelsCount: { $size: { $ifNull: ["$reels", []] } },
              createdAt: 1,
            },
          },
        ]);
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