import Blog from "../../../database/models/BlogModel";
import connectToDatabase from "../../../database/mongoose";
import {
  ok,
  created,
  badRequest,
  unauthorized,
  serverError,
} from "../../../lib/apiResponse";



export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);


    const page  = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "9")));
    const skip  = (page - 1) * limit;


    const query = { isPublished: true };

    const category      = searchParams.get("category");
    const search        = searchParams.get("search");
    const authorClerkId = searchParams.get("authorClerkId");

    if (category && category !== "all") query.category = category;
    if (authorClerkId) query.authorClerkId = authorClerkId;

    if (search?.trim()) {
      query.$text = { $search: search.trim() };
    }


    const sortBy = searchParams.get("sortBy") || "newest";
    const sortMap = {
      newest:  { createdAt: -1 },
      oldest:  { createdAt:  1 },
      views:   { viewCount: -1, createdAt: -1 },
      likes:   { likeCount: -1, createdAt: -1 },
    };
    const sort = sortMap[sortBy] || sortMap.newest;

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Blog.countDocuments(query),
    ]);


    const categoryCounts = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    return ok({
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
      categoryCounts,
    });
  } catch (error) {
    return serverError("Failed to fetch blogs", error);
  }
}



export async function POST(request) {
  try {
    const clerkUserId = request.headers.get("x-clerk-user-id");
    if (!clerkUserId) return unauthorized("You must be logged in to create a blog");

    const body = await request.json();
    const { title, excerpt, content, coverImage, category, tags, authorName, authorPhoto } = body;

    if (!title?.trim())   return badRequest("Title is required");
    if (!content?.trim()) return badRequest("Content is required");
    if (!authorName)      return badRequest("Author name is required");

    await connectToDatabase();

    const blog = await Blog.create({
      title: title.trim(),
      excerpt: excerpt?.trim(),
      content: content.trim(),
      coverImage: coverImage?.trim() || null,
      category: category || "other",
      tags: Array.isArray(tags) ? tags : [],
      authorClerkId: clerkUserId,
      authorName,
      authorPhoto: authorPhoto || null,
    });

    return created({ data: blog, message: "Blog created successfully" });
  } catch (error) {
    return serverError("Failed to create blog", error);
  }
}
