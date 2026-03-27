import Blog from "../../../../database/models/BlogModel";
import connectToDatabase from "../../../../database/mongoose";
import {
  ok,
  badRequest,
  notFound,
  unauthorized,
  forbidden,
  serverError,
} from "../../../../lib/apiResponse";



export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).lean();

    if (!blog) return notFound("Blog not found");
    return ok({ data: blog });
  } catch (error) {
    return serverError("Failed to fetch blog", error);
  }
}



export async function PUT(request, { params }) {
  try {
    const clerkUserId = request.headers.get("x-clerk-user-id");
    if (!clerkUserId) return unauthorized("You must be logged in");

    await connectToDatabase();
    const { id } = await params;

    const blog = await Blog.findById(id);
    if (!blog) return notFound("Blog not found");
    if (blog.authorClerkId !== clerkUserId) return forbidden("You can only edit your own blogs");

    const body = await request.json();
    const { title, excerpt, content, coverImage, category, tags, isPublished } = body;

    if (title   !== undefined) blog.title       = title.trim();
    if (excerpt !== undefined) blog.excerpt      = excerpt.trim();
    if (content !== undefined) blog.content      = content.trim();
    if (coverImage !== undefined) blog.coverImage = coverImage?.trim() || null;
    if (category   !== undefined) blog.category  = category;
    if (tags       !== undefined) blog.tags       = Array.isArray(tags) ? tags : [];
    if (isPublished !== undefined) blog.isPublished = isPublished;

    await blog.save();
    return ok({ data: blog, message: "Blog updated successfully" });
  } catch (error) {
    return serverError("Failed to update blog", error);
  }
}



export async function PATCH(request, { params }) {
  return PUT(request, { params });
}



export async function DELETE(request, { params }) {
  try {
    const clerkUserId = request.headers.get("x-clerk-user-id");
    if (!clerkUserId) return unauthorized("You must be logged in");

    await connectToDatabase();
    const { id } = await params;

    const blog = await Blog.findById(id);
    if (!blog) return notFound("Blog not found");
    if (blog.authorClerkId !== clerkUserId) return forbidden("You can only delete your own blogs");

    await blog.deleteOne();
    return ok({ message: "Blog deleted successfully" });
  } catch (error) {
    return serverError("Failed to delete blog", error);
  }
}
