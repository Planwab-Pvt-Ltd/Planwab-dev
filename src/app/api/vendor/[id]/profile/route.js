// app/api/vendor-profile/route.js

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "../../../../../database/mongoose";
import VendorProfile from "../../../../../database/models/VendorProfileModel";

// Helper: Verify password
const verifyPassword = async (vendorId, password) => {
  try {
    const profile = await VendorProfile.findOne({ vendorId }).select("+password");
    if (!profile || !profile.password) return false;
    return await bcrypt.compare(password, profile.password);
  } catch (error) {
    return false;
  }
};

// Helper: Check vendor profile credibility
const checkCredibility = async (vendorId) => {
  try {
    const profile = await VendorProfile.findOne({ vendorId });
    if (!profile) return { valid: false, message: "Profile not found" };

    const hasMinimumPosts = profile.posts?.length >= 3;
    const hasValidTrust = profile.trust >= 50;
    const hasLocation = profile.location?.city && profile.location?.state;
    const hasCategory = !!profile.category;

    const credibilityScore = [hasMinimumPosts, hasValidTrust, hasLocation, hasCategory].filter(Boolean).length;

    return {
      valid: credibilityScore >= 3,
      score: credibilityScore,
      details: {
        hasMinimumPosts,
        hasValidTrust,
        hasLocation,
        hasCategory,
      },
    };
  } catch (error) {
    return { valid: false, message: "Error checking credibility" };
  }
};

// GET - Fetch vendor profile by vendorId
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendorId");

    if (!vendorId) {
      return NextResponse.json({ success: false, message: "Vendor ID is required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOne({ vendorId }).select("-password");

    if (!profile) {
      return NextResponse.json({ success: false, message: "Vendor profile not found" }, { status: 404 });
    }

    const credibility = await checkCredibility(vendorId);

    return NextResponse.json({
      success: true,
      data: profile,
      credibility,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}

// POST - Create new vendor profile
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { vendorId, vendorBusinessName, username, vendorName, location, category, password } = body;

    if (!vendorId || !vendorBusinessName || !username || !vendorName || !category || !password) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const existingProfile = await VendorProfile.findOne({ vendorId });
    if (existingProfile) {
      return NextResponse.json({ success: false, message: "Vendor profile already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const profile = await VendorProfile.create({
      vendorId,
      vendorBusinessName,
      vendorName,
      location,
      category,
      username,
      password: hashedPassword,
      trust: 0,
      highlights: [],
      posts: [],
      reels: [],
    });

    const profileData = profile.toObject();
    delete profileData.password;

    return NextResponse.json(
      {
        success: true,
        message: "Vendor profile created successfully",
        data: profileData,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}

// PUT - Update vendor profile (excluding highlights, reels, posts)
export async function PUT(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { vendorId, password, ...updateData } = body;

    if (!vendorId || !password) {
      return NextResponse.json({ success: false, message: "Vendor ID and password are required" }, { status: 400 });
    }

    const isPasswordValid = await verifyPassword(vendorId, password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
    }

    const allowedUpdates = {
      vendorBusinessName: updateData.vendorBusinessName,
      vendorName: updateData.vendorName,
      location: updateData.location,
      category: updateData.category,
      trust: updateData.trust,
    };

    Object.keys(allowedUpdates).forEach((key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]);

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json({ success: false, message: "No valid fields to update" }, { status: 400 });
    }

    const profile = await VendorProfile.findOneAndUpdate(
      { vendorId },
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!profile) {
      return NextResponse.json({ success: false, message: "Vendor profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}

// DELETE - Delete vendor profile
export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendorId");
    const password = searchParams.get("password");

    if (!vendorId || !password) {
      return NextResponse.json({ success: false, message: "Vendor ID and password are required" }, { status: 400 });
    }

    const isPasswordValid = await verifyPassword(vendorId, password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
    }

    const profile = await VendorProfile.findOneAndDelete({ vendorId });

    if (!profile) {
      return NextResponse.json({ success: false, message: "Vendor profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Vendor profile deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}
