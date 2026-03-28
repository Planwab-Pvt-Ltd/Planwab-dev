import { NextResponse } from "next/server";
import connectToDatabase from "@/database/mongoose";
import Newsletter from "@/database/models/NewsletterModel";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const limit = Math.min(10000, parseInt(searchParams.get("limit") || "10000"));

    const query = {};
    if (search.trim()) {
      query.$or = [
        { email: { $regex: search.trim(), $options: "i" } },
        { visitedUrl: { $regex: search.trim(), $options: "i" } },
        { clerkId: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const sortField = ["createdAt", "email"].includes(sortBy) ? sortBy : "createdAt";

    const [data, total] = await Promise.all([
      Newsletter.find(query).sort({ [sortField]: sortOrder }).limit(limit).lean(),
      Newsletter.countDocuments(query),
    ]);

    return NextResponse.json({ success: true, data, total }, { status: 200 });
  } catch (error) {
    console.error("Admin newsletter GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch newsletter subscribers" }, { status: 500 });
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
    const deleted = await Newsletter.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, error: "Subscriber not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Subscriber deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Admin newsletter DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete subscriber" }, { status: 500 });
  }
}
