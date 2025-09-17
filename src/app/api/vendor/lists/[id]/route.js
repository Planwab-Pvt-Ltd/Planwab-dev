import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../database/mongoose";
import Vendor from "../../../../../database/models/VendorModel";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Vendor ID is required" }, { status: 400 });
    }

    const vendor = await Vendor.findById(id).lean();
    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    const { category, address, tags, perDayPrice, seating } = vendor;

    const similarConditions = [];
    if (tags && tags.length > 0) {
      similarConditions.push({ tags: { $in: tags } });
    }
    if (perDayPrice?.min !== undefined && perDayPrice?.max !== undefined) {
      similarConditions.push({
        "perDayPrice.min": { $gte: perDayPrice.min * 0.9, $lte: perDayPrice.max * 1.1 },
      });
    }

    const recommendedConditions = [];
    if (seating?.min !== undefined && seating?.max !== undefined) {
      recommendedConditions.push({
        "seating.min": { $gte: seating.min * 0.8, $lte: seating.max * 1.2 },
      });
    }
    recommendedConditions.push({ tags: { $in: ["Popular", "New"] } });


    const [similarVendors, recommendedVendors] = await Promise.all([
      Vendor.find({
        _id: { $ne: id },
        $or: [{ category: category }, { "address.city": address.city }],
        ...(similarConditions.length > 0 && { $or: similarConditions }),
      })
      .limit(4)
      .lean(),

      Vendor.find({
        _id: { $ne: id },
        $or: [{ category: category }, { "address.city": address.city }],
        ...(recommendedConditions.length > 0 && { $or: recommendedConditions }),
      })
      .sort({ rating: -1, bookings: -1 })
      .limit(4)
      .lean(),
    ]);

    const response = {
      similarVendors: similarVendors,
      recommendedVendors: recommendedVendors,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching vendor lists:", error);
    return NextResponse.json({ message: "An unexpected error occurred on the server." }, { status: 500 });
  }
}