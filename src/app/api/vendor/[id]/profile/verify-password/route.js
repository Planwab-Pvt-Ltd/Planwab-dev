import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../../../../../database/mongoose";
import VendorProfile from "../../../../../../database/models/VendorProfileModel";

export async function POST(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    const profile = await VendorProfile.findOne({ vendorId: id }).select("password");

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    if (!profile.password) {
      return NextResponse.json(
        { success: false, error: "No password set for this profile" },
        { status: 400 }
      );
    }

    // Compare the provided password with the stored bcrypt hash
    const isMatch = await bcrypt.compare(password, profile.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password verified successfully",
    });
  } catch (error) {
    console.error("Password verification error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}