// app/api/vendor/[id]/profile/reels/route.js

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../../database/mongoose";
import VendorProfile from "../../../../../../database/models/VendorProfileModel";

const getBunnyConfig = () => ({
  storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME,
  storageZonePassword: process.env.BUNNY_STORAGE_ZONE_PASSWORD,
  pullZoneUrl: process.env.BUNNY_PULL_ZONE_URL,
});

const MAX_REELS = 12;

async function deleteFromBunny(path) {
  if (!path) return;
  const config = getBunnyConfig();
  if (!config.storageZoneName || !config.storageZonePassword) return;

  const url = `https://storage.bunnycdn.com/${config.storageZoneName}/${path}`;
  try {
    await fetch(url, {
      method: "DELETE",
      headers: { AccessKey: config.storageZonePassword },
    });
  } catch (error) {
    console.warn("Bunny delete error:", error.message);
  }
}

// GET
export async function GET(request, context) {
  try {
    await connectToDatabase();
    const params = await context.params;
    const vendorId = params.id;

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Vendor ID required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOne({ vendorId }).select("reels").lean();
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: profile.reels || [] });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Save reel metadata (file already uploaded from client)
export async function POST(request, context) {
  try {
    await connectToDatabase();
    const params = await context.params;
    const vendorId = params.id;

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Vendor ID required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOne({ vendorId });
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    if (profile.reels && profile.reels.length >= MAX_REELS) {
      return NextResponse.json({ success: false, error: `Maximum ${MAX_REELS} reels allowed` }, { status: 400 });
    }

    const body = await request.json();
    const { videoUrl, thumbnail, storagePath, thumbnailPath, title, caption } = body;

    if (!videoUrl || !storagePath) {
      return NextResponse.json({ success: false, error: "Video URL and storage path are required" }, { status: 400 });
    }

    const newReel = {
      title: title?.trim() || "Untitled Reel",
      caption: caption?.trim() || "",
      videoUrl,
      thumbnail: thumbnail || null,
      storagePath,
      thumbnailPath: thumbnailPath || null,
      views: 0,
      likes: [],
      savedBy: [],
      createdAt: new Date(),
    };

    if (!profile.reels) {
      profile.reels = [];
    }
    profile.reels.unshift(newReel);
    await profile.save();

    return NextResponse.json({ success: true, data: profile.reels[0] });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT - Update a reel
export async function PUT(request, context) {
  try {
    await connectToDatabase();
    const params = await context.params;
    const vendorId = params.id;
    const { searchParams } = new URL(request.url);
    const reelId = searchParams.get("reelId");

    if (!vendorId || !reelId) {
      return NextResponse.json({ success: false, error: "Vendor ID and Reel ID required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOne({ vendorId });
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    const reelIndex = profile.reels.findIndex((r) => r._id.toString() === reelId);
    if (reelIndex === -1) {
      return NextResponse.json({ success: false, error: "Reel not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, caption } = body;

    if (title !== undefined) {
      profile.reels[reelIndex].title = title.trim();
    }
    if (caption !== undefined) {
      profile.reels[reelIndex].caption = caption.trim();
    }

    await profile.save();
    return NextResponse.json({ success: true, data: profile.reels[reelIndex] });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a reel
export async function DELETE(request, context) {
  try {
    await connectToDatabase();
    const params = await context.params;
    const vendorId = params.id;
    const { searchParams } = new URL(request.url);
    const reelId = searchParams.get("reelId");

    if (!vendorId || !reelId) {
      return NextResponse.json({ success: false, error: "Vendor ID and Reel ID required" }, { status: 400 });
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
    await deleteFromBunny(reel.storagePath);
    await deleteFromBunny(reel.thumbnailPath);

    profile.reels.splice(reelIndex, 1);
    await profile.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}