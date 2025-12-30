import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "../../../../database/mongoose";
import User from "../../../../database/models/userModel";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId }).select("likedVendors watchlist").lean();

    if (!user) {
      return NextResponse.json({ likedVendors: [], watchlist: [] });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("User Me API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
