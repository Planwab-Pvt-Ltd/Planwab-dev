// app/api/vendor/[id]/profile/interactions/route.js

import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../database/mongoose";
import VendorProfile from "../../../../../database/models/VendorProfileModel";

// POST - Handle trust and like interactions
export async function POST(request, context) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Vendor ID is required" }, { status: 400 });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const { action, value, userId, username } = body;

    if (!action || value === undefined) {
      return NextResponse.json({ success: false, error: "Action and value are required" }, { status: 400 });
    }

    // Require userId (Clerk user ID) for all interactions
    if (!userId) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const profile = await VendorProfile.findOne({ username: username });

    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    // Initialize arrays if they don't exist
    if (!profile.likes) profile.likes = [];
    if (!profile.trustedBy) profile.trustedBy = [];

    switch (action) {
      case "trust": {
        const alreadyTrusted = profile.trustedBy.includes(userId);
        const currentTrust = profile.trust || 0;

        if (value && !alreadyTrusted) {
          const newTrust = Math.max(0, currentTrust + 10);

          await VendorProfile.updateOne(
            { _id: profile._id },
            {
              $set: { trust: newTrust },
              $addToSet: { trustedBy: userId },
            },
          );

          return NextResponse.json({
            success: true,
            data: {
              trust: newTrust,
              action: "trust",
              changed: "added",
            },
          });
        }

        if (!value && alreadyTrusted) {
          const newTrust = Math.max(0, currentTrust - 10);

          await VendorProfile.updateOne(
            { _id: profile._id },
            {
              $set: { trust: newTrust },
              $pull: { trustedBy: userId },
            },
          );

          return NextResponse.json({
            success: true,
            data: {
              trust: newTrust,
              action: "trust",
              changed: "removed",
            },
          });
        }

        return NextResponse.json({
          success: true,
          data: {
            trust: Math.max(0, currentTrust),
            action: "trust",
            changed: "none",
            message: value ? "Already trusted" : "Not previously trusted",
          },
        });
      }

      case "like": {
        const alreadyLiked = profile.likes.includes(userId);

        if (value && !alreadyLiked) {
          await VendorProfile.updateOne(
            { _id: profile._id },
            {
              $addToSet: { likes: userId },
            },
          );

          return NextResponse.json({
            success: true,
            data: {
              likesCount: profile.likes.length + 1,
              action: "like",
              changed: "added",
            },
          });
        }

        if (!value && alreadyLiked) {
          await VendorProfile.updateOne(
            { _id: profile._id },
            {
              $pull: { likes: userId },
            },
          );

          return NextResponse.json({
            success: true,
            data: {
              likesCount: Math.max(0, profile.likes.length - 1),
              action: "like",
              changed: "removed",
            },
          });
        }

        return NextResponse.json({
          success: true,
          data: {
            likesCount: profile.likes.length,
            action: "like",
            changed: "none",
            message: value ? "Already liked" : "Not previously liked",
          },
        });
      }

      default:
        return NextResponse.json({ success: false, error: "Invalid action. Use 'trust' or 'like'" }, { status: 400 });
    }
  } catch (error) {
    console.error("Interactions API error:", error);
    return NextResponse.json({ success: false, error: error.message || "Server error" }, { status: 500 });
  }
}

// GET - Get current interaction stats
export async function GET(request, context) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id) {
      return NextResponse.json({ success: false, error: "Vendor ID is required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOne({ _id: id }).select("trust likes trustedBy").lean();

    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    // Check if specific user has interacted
    let userHasLiked = false;
    let userHasTrusted = false;

    if (userId) {
      userHasLiked = profile.likes?.includes(userId) || false;
      userHasTrusted = profile.trustedBy?.includes(userId) || false;
    }

    return NextResponse.json({
      success: true,
      data: {
        trust: Math.max(0, profile.trust || 0),
        likesCount: Math.max(0, profile.likes?.length || 0),
        trustedByCount: profile.trustedBy?.length || 0,
        userHasLiked,
        userHasTrusted,
      },
    });
  } catch (error) {
    console.error("GET interactions error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
