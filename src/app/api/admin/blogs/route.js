import { NextResponse } from "next/server";
import connectToDatabase from "@/database/mongoose";
import Blog from "@/database/models/BlogModel";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const published = searchParams.get("published"); // "true" | "false" | undefined (all)
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const limit = Math.min(10000, parseInt(searchParams.get("limit") || "10000"));

    const query = {};
    if (category && category !== "all") query.category = category;
    if (published === "true") query.isPublished = true;
    if (published === "false") query.isPublished = false;

    if (search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { authorName: { $regex: search.trim(), $options: "i" } },
        { category: { $regex: search.trim(), $options: "i" } },
        { tags: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const sortableFields = ["createdAt", "title", "viewCount", "likeCount", "shareCount"];
    const sortField = sortableFields.includes(sortBy) ? sortBy : "createdAt";

    const [data, total, categoryCounts] = await Promise.all([
      Blog.find(query).sort({ [sortField]: sortOrder }).limit(limit).lean(),
      Blog.countDocuments(query),
      Blog.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return NextResponse.json({ success: true, data, total, categoryCounts }, { status: 200 });
  } catch (error) {
    console.error("Admin blogs GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const adminPassword = searchParams.get("adminPassword");

    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: "Invalid admin password" }, { status: 401 });
    }

    await connectToDatabase();
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });

    blog.isPublished = !blog.isPublished;
    await blog.save();

    return NextResponse.json({
      success: true,
      message: `Blog ${blog.isPublished ? "published" : "unpublished"} successfully`,
      data: blog,
    }, { status: 200 });
  } catch (error) {
    console.error("Admin blogs PATCH error:", error);
    return NextResponse.json({ success: false, error: "Failed to toggle publish status" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const adminPassword = searchParams.get("adminPassword");

    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: "Invalid admin password" }, { status: 401 });
    }

    await connectToDatabase();
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Blog deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Admin blogs DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete blog" }, { status: 500 });
  }
}
