import { NextResponse } from "next/server";
import connectToDatabase from "../../../../database/mongoose";
import User from "../../../../database/models/userModel";

export async function POST(req) {
  try {
    const { userId, vendorId } = await req.json();

    if (!userId || !vendorId) {
      return NextResponse.json({ isLiked: false, isBookmarked: false });
    }

    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId }, { likedVendors: 1, watchlist: 1, _id: 0 }).lean();

    if (!user) {
      return NextResponse.json({ isLiked: false, isBookmarked: false });
    }

    const targetId = String(vendorId);

    const isLiked = user.likedVendors?.includes(targetId) || false;
    const isBookmarked = user.watchlist?.includes(targetId) || false;

    return NextResponse.json({ isLiked, isBookmarked });
  } catch (error) {
    console.error("[Status API Error]:", error);
    return NextResponse.json({ isLiked: false, isBookmarked: false }, { status: 500 });
  }
}
