import ReelsModel from "../../../../database/models/ReelsModel";
import connectToDatabase from "../../../../database/mongoose";
import { ok, serverError } from "../../../../lib/apiResponse";

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const limit    = Math.min(50, parseInt(searchParams.get("limit") || "12"));
    const category = searchParams.get("category");
    const type     = searchParams.get("type");
    const days     = parseInt(searchParams.get("days") || "30");

    const since = new Date();
    since.setDate(since.getDate() - days);

    const query = {
      isActive: true,
      publishedAt: { $gte: since },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    if (category) query.category = category;
    if (type)     query.type = type;

    const reels = await ReelsModel.aggregate([
      { $match: query },
      {
        $addFields: {
          trendScore: {
            $add: [
              { $ifNull: ["$viewCount", 0] },
              { $multiply: [{ $ifNull: ["$likeCount", 0] }, 3] },
              { $multiply: [{ $ifNull: ["$shareCount", 0] }, 5] },
              { $multiply: [{ $ifNull: ["$commentCount", 0] }, 2] },
              { $multiply: [{ $ifNull: ["$priority", 0] }, 10] },
            ],
          },
        },
      },
      { $sort: { trendScore: -1 } },
      { $limit: limit },
      {
        $project: {
          title: 1, vendorName: 1, vendorUsername: 1, category: 1, type: 1, subType: 1,
          thumbnailUrl: 1, videoUrl: 1, viewCount: 1, likeCount: 1,
          shareCount: 1, commentCount: 1, saveCount: 1, publishedAt: 1,
          priority: 1, isFeatured: 1, trendScore: 1, city: 1, location: 1
        },
      },
    ]);

    return ok({ reels, count: reels.length, period: `${days} days` });
  } catch (error) {
    return serverError("Failed to fetch trending reels", error);
  }
}