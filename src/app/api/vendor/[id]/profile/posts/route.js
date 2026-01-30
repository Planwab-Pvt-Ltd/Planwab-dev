// app/api/vendor/[id]/profile/posts/route.js

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

const MAX_POSTS = 6;

// Delete from Bunny (server-side only for cleanup)
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

// GET - Fetch all posts
export async function GET(request, context) {
  try {
    await connectToDatabase();
    const params = await context.params;
    const vendorId = params.id;

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Vendor ID is required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOne({ vendorId }).select("posts").lean();
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: profile.posts || [] });
  } catch (error) {
    console.error("GET posts error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Save post metadata (file already uploaded from client)
export async function POST(request, context) {
  try {
    await connectToDatabase();
    const params = await context.params;
    const vendorId = params.id;

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Vendor ID is required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOne({ vendorId });
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    if (profile.posts && profile.posts.length >= MAX_POSTS) {
      return NextResponse.json({ success: false, error: `Maximum ${MAX_POSTS} posts allowed` }, { status: 400 });
    }

    const body = await request.json();
    const { mediaUrl, mediaType, storagePath, description, location } = body;

    if (!mediaUrl || !storagePath) {
      return NextResponse.json({ success: false, error: "Media URL and storage path are required" }, { status: 400 });
    }

    const newPost = {
      description: description?.trim() || "",
      mediaUrl,
      mediaType: mediaType || "image",
      storagePath,
      location: location?.trim() || "",
      likes: [],
      reviews: [],
      savedBy: [],
      createdAt: new Date(),
    };

    if (!profile.posts) {
      profile.posts = [];
    }
    profile.posts.unshift(newPost);
    await profile.save();

    return NextResponse.json({ success: true, data: profile.posts[0] });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT - Update a post
export async function PUT(request, context) {
  try {
    await connectToDatabase();
    const params = await context.params;
    const vendorId = params.id;
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!vendorId || !postId) {
      return NextResponse.json({ success: false, error: "Vendor ID and Post ID required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOne({ vendorId });
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    const postIndex = profile.posts.findIndex((p) => p._id.toString() === postId);
    if (postIndex === -1) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const body = await request.json();
    const { description, location } = body;

    if (description !== undefined) {
      profile.posts[postIndex].description = description.trim();
    }
    if (location !== undefined) {
      profile.posts[postIndex].location = location.trim();
    }

    await profile.save();
    return NextResponse.json({ success: true, data: profile.posts[postIndex] });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a post
export async function DELETE(request, context) {
  try {
    await connectToDatabase();
    const params = await context.params;
    const vendorId = params.id;
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!vendorId || !postId) {
      return NextResponse.json({ success: false, error: "Vendor ID and Post ID required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOne({ vendorId });
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    const postIndex = profile.posts.findIndex((p) => p._id.toString() === postId);
    if (postIndex === -1) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const post = profile.posts[postIndex];
    if (post.storagePath) {
      await deleteFromBunny(post.storagePath);
    }

    profile.posts.splice(postIndex, 1);
    await profile.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}