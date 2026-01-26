// app/api/vendor-profile/route.js

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "../../../../../database/mongoose";
import VendorProfile from "../../../../../database/models/VendorProfileModel";
import Vendor from "../../../../../database/models/VendorModel";

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
    const {
      vendorId,
      vendorBusinessName,
      username,
      vendorName,
      location,
      category,
      password,
      vendorAvatar,
      vendorCoverImage,
      bio,
    } = body;

    if (
      !vendorId ||
      !vendorBusinessName ||
      !username ||
      !vendorName ||
      !category ||
      !password ||
      !vendorAvatar ||
      !bio
    ) {
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
      vendorAvatar,
      vendorCoverImage,
      bio,
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

    await Vendor.findOneAndUpdate(
      { _id: vendorId },
      { $set: { vendorProfileCreated: true } }
    );

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
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();

    const {
      vendorBusinessName,
      username,
      vendorName,
      category,
      bio,
      vendorAvatar,
      vendorCoverImage,
      location,
      newPassword,
    } = body;

    // Find existing profile
    const existingProfile = await VendorProfile.findOne({ vendorId: id });

    if (!existingProfile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    // Build update object
    const updateData = {
      vendorBusinessName: vendorBusinessName || existingProfile.vendorBusinessName,
      username: username || existingProfile.username,
      vendorName: vendorName || existingProfile.vendorName,
      category: category || existingProfile.category,
      bio: bio !== undefined ? bio : existingProfile.bio,
      vendorAvatar: vendorAvatar || existingProfile.vendorAvatar,
      vendorCoverImage: vendorCoverImage !== undefined ? vendorCoverImage : existingProfile.vendorCoverImage,
      location: location || existingProfile.location,
      updatedAt: new Date(),
    };

    // Handle password change if requested
    if (newPassword) {

      // Validate new password
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      updateData.password = hashedPassword;
    }

    // Update profile
    const updatedProfile = await VendorProfile.findOneAndUpdate(
      { vendorId: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile" },
      { status: 500 }
    );
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
