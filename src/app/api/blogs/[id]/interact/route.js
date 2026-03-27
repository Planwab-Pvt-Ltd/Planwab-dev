import Blog from "../../../../../database/models/BlogModel";
import connectToDatabase from "../../../../../database/mongoose";
import {
  ok,
  badRequest,
  unauthorized,
  serverError,
} from "../../../../../lib/apiResponse";



export async function POST(request, { params }) {
  try {
    const clerkUserId = request.headers.get("x-clerk-user-id");
    if (!clerkUserId) return unauthorized("You must be signed in to interact");

    const { id } = await params;
    if (!id) return badRequest("Blog ID is required");

    const body = await request.json();
    const { action } = body;

    if (!["like", "save", "share"].includes(action)) {
      return badRequest("Invalid action. Must be 'like', 'save', or 'share'.");
    }

    await connectToDatabase();
    const blog = await Blog.findById(id);

    if (!blog) return badRequest("Blog not found");

    if (!blog.likedBy) blog.likedBy = [];
    if (!blog.savedBy) blog.savedBy = [];

    let updatedMetrics = {};

    switch (action) {
      case "like": {
        const isLiked = blog.likedBy.includes(clerkUserId);
        if (isLiked) {
          blog.likedBy = blog.likedBy.filter((uid) => uid !== clerkUserId);
          blog.likeCount = Math.max(0, blog.likeCount - 1);
        } else {
          blog.likedBy.push(clerkUserId);
          blog.likeCount += 1;
        }
        updatedMetrics = { isLiked: !isLiked, likeCount: blog.likeCount };
        break;
      }
      case "save": {
        const isSaved = blog.savedBy.includes(clerkUserId);
        if (isSaved) {
          blog.savedBy = blog.savedBy.filter((uid) => uid !== clerkUserId);
        } else {
          blog.savedBy.push(clerkUserId);
        }
        updatedMetrics = { isSaved: !isSaved, saveCount: blog.savedBy.length };
        break;
      }
      case "share": {
        blog.shareCount = (blog.shareCount || 0) + 1;
        updatedMetrics = { shareCount: blog.shareCount };
        break;
      }
    }

    await blog.save();

    return ok({ 
      message: `Action ${action} handled successfully`, 
      ...updatedMetrics 
    });
  } catch (error) {
    console.error(`[API] Error handling interaction for blog ${id}:`, error);
    return serverError("Failed to handle interaction");
  }
}
