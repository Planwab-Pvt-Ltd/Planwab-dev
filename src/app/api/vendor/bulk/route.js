import { NextResponse } from "next/server";
import connectToDatabase from "../../../../database/mongoose";
import Vendor from "../../../../database/models/VendorModel";

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json([]);
    }

    const vendors = await Vendor.find({
      _id: { $in: ids },
    })
      .select("name category images rating address perDayPrice defaultImage")
      .lean();

    return NextResponse.json(vendors);
  } catch (error) {
    console.error("Bulk Vendor Fetch Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
