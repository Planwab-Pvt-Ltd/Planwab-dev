import ReelsModel from "../../../../database/models/ReelsModel";
import connectToDatabase from "../../../../database/mongoose";
import { ok, serverError } from "../../../../lib/apiResponse";

export async function GET() {
  try {
    await connectToDatabase();

    const validReelsMatch = {
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    const [overall, byCategory, topReels, recentReels] = await Promise.all([
      ReelsModel.aggregate([
        { $match: validReelsMatch },
        {
          $group: {
            _id: null,
            totalReels:    { $sum: 1 },
            featuredReels: { $sum: { $cond: ["$isFeatured", 1, 0] } },
            sponsoredReels:{ $sum: { $cond: ["$isSponsored", 1, 0] } },
            totalViews:    { $sum: "$viewCount" },
            totalLikes:    { $sum: "$likeCount" },
            totalShares:   { $sum: "$shareCount" },
            totalComments: { $sum: "$commentCount" },
            totalSaves:    { $sum: "$saveCount" },
            avgPriority:   { $avg: "$priority" },
          },
        },
      ]),

      ReelsModel.aggregate([
        { $match: validReelsMatch },
        {
          $group: {
            _id: "$category",
            count:      { $sum: 1 },
            totalViews: { $sum: "$viewCount" },
            totalLikes: { $sum: "$likeCount" },
          },
        },
        { $sort: { count: -1 } },
      ]),

      ReelsModel.find(validReelsMatch)
        .sort({ viewCount: -1 })
        .limit(5)
        .select("title category type subType viewCount likeCount shareCount thumbnailUrl")
        .lean(),

      ReelsModel.find(validReelsMatch)
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title category type subType createdAt thumbnailUrl")
        .lean(),
    ]);

    return ok({
      overall: overall[0] || {},
      byCategory,
      topReels,
      recentReels,
    });
  } catch (error) {
    return serverError("Failed to fetch stats", error);
  }
}