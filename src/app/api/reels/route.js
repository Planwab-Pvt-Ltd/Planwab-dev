import ReelsModel from "../../../database/models/ReelsModel";
import connectToDatabase from "../../../database/mongoose";
import { ok, serverError, badRequest } from "../../../lib/apiResponse";

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);

    // ── Pagination ─────────────────────────────────────────────────────
    const page  = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip  = (page - 1) * limit;

    // ── Base Expiry & Active Filter ────────────────────────────────────
    const query = {
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    // ── Dynamic Filters ────────────────────────────────────────────────
    const isActive    = searchParams.get("isActive");
    const category    = searchParams.get("category");
    const city        = searchParams.get("city");
    const type        = searchParams.get("type");
    const subtype     = searchParams.get("subtype") || searchParams.get("subType"); // Map frontend to DB
    const nestedType  = searchParams.get("nestedType");
    const tag         = searchParams.get("tag");
    const hashtag     = searchParams.get("hashtag");
    const minPriority = searchParams.get("minPriority");
    const isFeatured  = searchParams.get("isFeatured");
    const isSponsored = searchParams.get("isSponsored");
    const isPinned    = searchParams.get("isPinned");

    query.isActive = isActive !== "false"; // Default to true unless explicitly false

    if (category)   query.category   = category;
    if (city)       query.city       = new RegExp(`^${city}$`, "i"); // Case-insensitive exact match
    if (type)       query.type       = type;
    if (subtype)    query.subType    = subtype; // NOTE: DB schema uses subType
    if (nestedType) query.nestedType = nestedType;

    if (isFeatured !== null)  query.isFeatured  = isFeatured === "true";
    if (isSponsored !== null) query.isSponsored = isSponsored === "true";
    if (isPinned !== null)    query.isPinned    = isPinned === "true";
    
    // Tag and Hashtag arrays
    if (tag)     query.tags     = { $regex: new RegExp(`^${tag}$`, "i") };
    if (hashtag) query.hashtags = { $regex: new RegExp(`^${hashtag}$`, "i") };
    
    // Rating / Priority
    if (minPriority) query.priority = { $gte: parseInt(minPriority) };

    // ── Sort ───────────────────────────────────────────────────────────
    const sortField = searchParams.get("sortBy") || "priority";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const allowedSortFields = ["priority", "createdAt", "publishedAt", "viewCount", "likeCount"];
    const sort = {
      [allowedSortFields.includes(sortField) ? sortField : "priority"]: sortOrder,
      createdAt: -1,
    };

    // ── Execute ────────────────────────────────────────────────────────
    const [reels, total] = await Promise.all([
      ReelsModel.find(query).sort(sort).skip(skip).limit(limit).lean(),
      ReelsModel.countDocuments(query),
    ]);

    return ok({
      data: reels,
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
    return serverError("Failed to fetch reels", error);
  }
}