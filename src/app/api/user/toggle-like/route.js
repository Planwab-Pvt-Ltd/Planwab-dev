import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "../../../../database/mongoose";
import User from "../../../../database/models/userModel";
import Vendor from "../../../../database/models/VendorModel";

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { vendorId } = await req.json();

    if (!vendorId) {
      return NextResponse.json({ error: "Vendor ID required" }, { status: 400 });
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
        likedVendors: [],
      });
    }

    const isLiked = dbUser.likedVendors.includes(vendorId);

    if (isLiked) {
      await User.findByIdAndUpdate(dbUser._id, {
        $pull: { likedVendors: vendorId },
      });

      await Vendor.findByIdAndUpdate(vendorId, {
        $inc: { likes: -1 },
      });

      return NextResponse.json({ isLiked: false, message: "Unliked" });
    } else {
      await User.findByIdAndUpdate(dbUser._id, {
        $addToSet: { likedVendors: vendorId },
      });

      await Vendor.findByIdAndUpdate(vendorId, {
        $inc: { likes: 1 },
      });

      return NextResponse.json({ isLiked: true, message: "Liked" });
    }
  } catch (error) {
    console.error("Toggle Like Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
