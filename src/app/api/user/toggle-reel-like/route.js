import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "../../../../database/mongoose";
import User from "../../../../database/models/userModel";
import ReelsModel from "../../../../database/models/ReelsModel";

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { reelId } = await req.json();

    if (!reelId) {
      return NextResponse.json({ error: "Reel ID required" }, { status: 400 });
    }

    let dbUser = await User.findOne({ clerkId: user.id });

    if (!dbUser) {
      dbUser = await User.create({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        username: user.username || `user_${user.id.slice(0, 8)}`,
        photo: user.imageUrl,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        likedReels: [],
      });
    }

    const isLiked = dbUser.likedReels.includes(reelId);

    if (isLiked) {
      await User.findByIdAndUpdate(dbUser._id, {
        $pull: { likedReels: reelId },
      });

      await ReelsModel.findByIdAndUpdate(reelId, {
        $pull: { likedBy: user.id },
      });

      return NextResponse.json({ isLiked: false, message: "Unliked" });
    } else {
      await User.findByIdAndUpdate(dbUser._id, {
        $addToSet: { likedReels: reelId },
      });

      await ReelsModel.findByIdAndUpdate(reelId, {
        $addToSet: { likedBy: user.id },
      });

      return NextResponse.json({ isLiked: true, message: "Liked" });
    }
  } catch (error) {
    console.error("Toggle Like Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
