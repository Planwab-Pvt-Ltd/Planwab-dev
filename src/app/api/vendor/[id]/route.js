import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../database/mongoose";
import Vendor from "../../../../database/models/VendorModel";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const vendor = await Vendor.findById(id).lean();

    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json(vendor, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error occurred on the server." }, { status: 500 });
  }
}