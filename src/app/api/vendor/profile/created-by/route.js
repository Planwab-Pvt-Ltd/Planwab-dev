import { NextResponse } from "next/server";
import VendorProfile from "../../../../../database/models/VendorProfileModel";
import User from "../../../../../database/models/userModel";
import { connectToDatabase } from '../../../../../database/mongoose';

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    const [vendorDocs, userDoc] = await Promise.all([
      VendorProfile.find({ createdBy: userId }).select("_id").lean(),
      User.findOne({ clerkId: userId }).select("createdProfiles").lean()
    ]);

    const fromVendorField = vendorDocs.map(p => p._id.toString());
    const fromUserModel = userDoc?.createdProfiles || [];

    const combinedProfiles = Array.from(new Set([...fromVendorField, ...fromUserModel]));

    return NextResponse.json({
      success: true,
      data: {
        fromVendorField,
        fromUserModel,
        profiles: combinedProfiles
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}