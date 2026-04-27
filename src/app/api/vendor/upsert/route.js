import { NextResponse } from "next/server";
import VendorProfile from "../../../../database/models/VendorProfileModel";
import { connectToDatabase } from "../../../../database/mongoose";

export async function PATCH(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { vendorProfileId, username, packages } = body;

    if (!vendorProfileId && !username) {
      return NextResponse.json(
        { success: false, message: "vendorProfileId or username required" },
        { status: 400 }
      );
    }

    const query = vendorProfileId ? { _id: vendorProfileId } : { username };

    const updated = await VendorProfile.findOneAndUpdate(
      query,
      { $set: { packages } },
      { new: true, lean: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Vendor profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Packages updated successfully",
      data: updated,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}