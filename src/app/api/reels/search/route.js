import ReelsModel from "../../../../database/models/ReelsModel";
import connectToDatabase from "../../../../database/mongoose";
import { ok, badRequest, serverError } from "../../../../lib/apiResponse";

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const q          = searchParams.get("q")?.trim();
    const page       = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit      = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const skip       = (page - 1) * limit;
    
    const category   = searchParams.get("category");
    const city       = searchParams.get("city");
    const type       = searchParams.get("type");
    const subType    = searchParams.get("subtype") || searchParams.get("subType");

    if (!q || q.length < 2) {
      return badRequest("Search query must be at least 2 characters");
    }

    // ── Base Active Filter ─────────────────────────────────────────────
    const baseFilter = {
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    if (category) baseFilter.category = category;
    if (city)     baseFilter.city     = new RegExp(`^${city}$`, "i");
    if (type)     baseFilter.type     = type;
    if (subType)  baseFilter.subType  = subType;

    // ── Comprehensive Regex Search ─────────────────────────────────────
    // This ensures partial matches across ANY relevant field work perfectly.
    const searchRegex = new RegExp(q, "i");
    
    const searchQuery = {
      ...baseFilter,
      $or: [
        { title: searchRegex },
        { caption: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { type: searchRegex },
        { subType: searchRegex },
        { nestedType: searchRegex },
        { city: searchRegex },
        { tags: { $elemMatch: { $regex: searchRegex } } },
        { hashtags: { $elemMatch: { $regex: searchRegex } } },
      ],
    };

    const [reels, total] = await Promise.all([
      ReelsModel.find(searchQuery)
        .sort({ priority: -1, viewCount: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReelsModel.countDocuments(searchQuery)
    ]);

    return ok({
      reels,
      query: q,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return serverError("Search failed", error);
  }
}