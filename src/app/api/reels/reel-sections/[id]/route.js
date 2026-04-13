// app/api/reel-sections/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "../../../../../database/mongoose";
import { ReelSection } from "../../../../../database/models/ReelsModel";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid Section ID" }, { status: 400 });
    }

    const section = await ReelSection.findById(id).populate({
      path: "linkedReels",
    });

    if (!section) {
      return NextResponse.json({ success: false, message: "Reel section not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: section });
  } catch (error) {
    console.error("Error fetching reel section:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid Section ID" }, { status: 400 });
    }

    // Optionally append updatedBy if you pass it in the body
    body.updatedAt = new Date();

    const updatedSection = await ReelSection.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate({
      path: "linkedReels",
      select: "title thumbnailUrl viewCount type category videoUrl",
    });

    if (!updatedSection) {
      return NextResponse.json({ success: false, message: "Reel section not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Reel section updated successfully",
      data: updatedSection 
    });
  } catch (error) {
    console.error("Error updating reel section:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid Section ID" }, { status: 400 });
    }

    const deletedSection = await ReelSection.findByIdAndDelete(id);

    if (!deletedSection) {
      return NextResponse.json({ success: false, message: "Reel section not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Reel section deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting reel section:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}