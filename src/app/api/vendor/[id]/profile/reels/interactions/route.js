import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../../../database/mongoose";
import VendorProfile from "../../../../../../../database/models/VendorProfileModel";

// POST - Handle reel interactions (like, view, save)
export async function POST(request, context) {
  try {
    await connectToDatabase();

    const params = await context.params;
    const vendorId = params.id;

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Vendor ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { reelId, action, userId, value } = body;

    if (!reelId) {
      return NextResponse.json({ success: false, error: "Reel ID is required" }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({ success: false, error: "Action is required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOne({ vendorId });
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    const reelIndex = profile.reels.findIndex((r) => r._id.toString() === reelId);
    if (reelIndex === -1) {
      return NextResponse.json({ success: false, error: "Reel not found" }, { status: 404 });
    }

    const reel = profile.reels[reelIndex];

    switch (action) {
      case "like": {
        if (!userId) {
          return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        const likeIndex = reel.likes.findIndex((l) => l.userId?.toString() === userId);

        if (value && likeIndex === -1) {
          // Add like
          reel.likes.push({ userId, likedAt: new Date() });
        } else if (!value && likeIndex !== -1) {
          // Remove like
          reel.likes.splice(likeIndex, 1);
        }

        await profile.save();

        return NextResponse.json({
          success: true,
          data: {
            likesCount: reel.likes.length,
            isLiked: value,
          },
        });
      }

      case "view": {
        // Increment view count
        reel.views = (reel.views || 0) + 1;
        await profile.save();

        return NextResponse.json({
          success: true,
          data: {
            views: reel.views,
          },
        });
      }

      case "save": {
        if (!userId) {
          return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        const saveIndex = reel.savedBy.findIndex((s) => s.userId?.toString() === userId);

        if (value && saveIndex === -1) {
          // Add save
          reel.savedBy.push({ userId, savedAt: new Date() });
        } else if (!value && saveIndex !== -1) {
          // Remove save
          reel.savedBy.splice(saveIndex, 1);
        }

        await profile.save();

        return NextResponse.json({
          success: true,
          data: {
            savedCount: reel.savedBy.length,
            isSaved: value,
          },
        });
      }

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("POST reel interactions error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET - Get reel interaction status for a user
export async function GET(request, context) {
  try {
    await connectToDatabase();

    const params = await context.params;
    const vendorId = params.id;

    const { searchParams } = new URL(request.url);
    const reelId = searchParams.get("reelId");
    const userId = searchParams.get("userId");

    if (!vendorId || !reelId) {
      return NextResponse.json({ success: false, error: "Vendor ID and Reel ID are required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOne({ vendorId }).lean();
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    const reel = profile.reels.find((r) => r._id.toString() === reelId);
    if (!reel) {
      return NextResponse.json({ success: false, error: "Reel not found" }, { status: 404 });
    }

    const isLiked = userId ? reel.likes.some((l) => l.userId?.toString() === userId) : false;
    const isSaved = userId ? reel.savedBy.some((s) => s.userId?.toString() === userId) : false;

    return NextResponse.json({
      success: true,
      data: {
        likesCount: reel.likes.length,
        savedCount: reel.savedBy.length,
        views: reel.views || 0,
        isLiked,
        isSaved,
      },
    });
  } catch (error) {
    console.error("GET reel interactions error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}