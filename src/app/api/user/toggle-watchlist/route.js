import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import User from "../../../../database/models/userModel";
import connectToDatabase from "../../../../database/mongoose";

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    const { vendorId } = await req.json();

    if (!vendorId) return NextResponse.json({ error: "Vendor ID required" }, { status: 400 });

    let dbUser = await User.findOne({ clerkId: user.id });

    if (!dbUser) {
      dbUser = await User.create({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        username: user.username || `user_${user.id.slice(0, 8)}`,
        photo: user.imageUrl,
        firstName: user.firstName,
        lastName: user.lastName,
        watchlist: [],
      });
    }

    const isBookmarked = dbUser.watchlist.includes(vendorId);

    if (isBookmarked) {
      await User.findByIdAndUpdate(dbUser._id, {
        $pull: { watchlist: vendorId },
      });
      return NextResponse.json({ isBookmarked: false, message: "Removed from Watchlist" });
    } else {
      await User.findByIdAndUpdate(dbUser._id, {
        $addToSet: { watchlist: vendorId },
      });
      return NextResponse.json({ isBookmarked: true, message: "Added to Watchlist" });
    }
  } catch (error) {
    console.error("Toggle Watchlist Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
