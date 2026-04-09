import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from '../../../../database/mongoose';
import Reel, { ReelSection } from "../../../../database/models/ReelsModel";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const query = {};
    const search = searchParams.get("search");
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const sections = await ReelSection.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "linkedReels",
        select: "title thumbnailUrl viewCount type",
      })
      .lean();

    const total = await ReelSection.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: sections,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reel sections:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch reel sections" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const newSection = await ReelSection.create(body);

    return NextResponse.json(
      { success: true, message: "Reel section created successfully", data: newSection },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating reel section:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create reel section" },
      { status: 500 }
    );
  }
}