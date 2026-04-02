import { NextResponse } from "next/server";
import User from "../../../../database/models/userModel";
import connectToDatabase from "../../../../database/mongoose";

export async function POST(request) {
  try {
    await connectToDatabase();
    const { userId, vendorProfileId } = await request.json();

    if (!userId || !vendorProfileId) {
      return NextResponse.json(
        { success: false, message: "userId and vendorProfileId are required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { $addToSet: { createdProfiles: vendorProfileId } },
      { new: true } 
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile ID added to user model",
      data: updatedUser.createdProfiles
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}