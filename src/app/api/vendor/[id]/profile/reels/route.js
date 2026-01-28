export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes for Vercel

import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "../../../../../../database/mongoose";
import VendorProfile from "../../../../../../database/models/VendorProfileModel";

const getBunnyConfig = () => ({
  storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME,
  storageZonePassword: process.env.BUNNY_STORAGE_ZONE_PASSWORD,
  pullZoneUrl: process.env.BUNNY_PULL_ZONE_URL,
});

const MAX_REELS = 12;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function generateUniqueFilename(original) {
  const ext = original?.split(".")?.pop()?.toLowerCase() || "mp4";
  return `${Date.now()}_${crypto.randomBytes(6).toString("hex")}.${ext}`;
}

// Memory-efficient file to buffer conversion
async function fileToBuffer(file) {
  try {
    if (file.size < 50 * 1024 * 1024) {
      const arrayBuffer = await file.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
    
    const chunks = [];
    const reader = file.stream().getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    return Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));
  } catch (error) {
    console.error("File to buffer error:", error);
    throw new Error("Failed to process video. Please try a smaller file.");
  }
}

async function uploadToBunny(buffer, path, contentType, retries = 3) {
  const config = getBunnyConfig();

  if (!config.storageZoneName || !config.storageZonePassword || !config.pullZoneUrl) {
    throw new Error("Bunny.net configuration is incomplete.");
  }

  const url = `https://storage.bunnycdn.com/${config.storageZoneName}/${path}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          AccessKey: config.storageZonePassword,
          "Content-Type": contentType,
          "Content-Length": buffer.length.toString(),
        },
        body: buffer,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown error");
        throw new Error(`Upload failed (${res.status}): ${errorText}`);
      }

      return `${config.pullZoneUrl}/${path}`;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === retries) throw error;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

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
    console.warn("Delete error:", error.message);
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

    return NextResponse.json({
      success: true,
      data: profile.reels || [],
    });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST
export async function POST(request, context) {
  let uploadedVideoPath = null;
  let uploadedThumbnailPath = null;

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

    // Parse form data with mobile-friendly error handling
    let form;
    try {
      const contentType = request.headers.get("content-type") || "";
      
      if (!contentType.includes("multipart/form-data")) {
        return NextResponse.json(
          { success: false, error: "Invalid content type" },
          { status: 400 }
        );
      }

      form = await request.formData();
    } catch (formError) {
      console.error("Form parsing error:", formError);
      
      if (formError.message?.includes("body") || formError.message?.includes("size")) {
        return NextResponse.json(
          { success: false, error: "Video too large. Try compressing or using a shorter video." },
          { status: 413 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: "Upload failed. Please check your connection and try again." },
        { status: 400 }
      );
    }

    const file = form.get("file");
    const title = form.get("title") || "Untitled Reel";
    const caption = form.get("caption") || "";
    const thumbnailFile = form.get("thumbnail");

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, error: "No video file provided" }, { status: 400 });
    }

    const fileType = file.type || "";
    if (!ALLOWED_VIDEO_TYPES.includes(fileType)) {
      return NextResponse.json(
        { success: false, error: `Invalid video type. Use MP4, MOV, or WebM.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { success: false, error: `Video exceeds ${Math.round(MAX_VIDEO_SIZE / (1024 * 1024))}MB limit` },
        { status: 400 }
      );
    }

    console.log(`Processing reel: ${file.name} (${Math.round(file.size / (1024 * 1024))}MB)`);

    // Convert to buffer with memory-efficient method
    let videoBuffer;
    try {
      videoBuffer = await fileToBuffer(file);
    } catch (bufferError) {
      return NextResponse.json(
        { success: false, error: bufferError.message },
        { status: 500 }
      );
    }

    const videoFilename = generateUniqueFilename(file.name);
    const videoStoragePath = `reels/${vendorId}/${videoFilename}`;
    const videoUrl = await uploadToBunny(videoBuffer, videoStoragePath, fileType);
    uploadedVideoPath = videoStoragePath;

    // Clear video buffer from memory
    videoBuffer = null;

    console.log("Video uploaded:", videoUrl);

    // Handle thumbnail
    let thumbnailUrl = null;
    let thumbnailStoragePath = null;

    if (thumbnailFile && typeof thumbnailFile !== "string" && thumbnailFile.size > 0) {
      const thumbType = thumbnailFile.type || "";

      if (ALLOWED_IMAGE_TYPES.includes(thumbType) && thumbnailFile.size <= MAX_THUMBNAIL_SIZE) {
        try {
          const thumbBuffer = await fileToBuffer(thumbnailFile);
          const thumbFilename = `thumb_${generateUniqueFilename(thumbnailFile.name)}`;
          thumbnailStoragePath = `reels/${vendorId}/thumbnails/${thumbFilename}`;
          thumbnailUrl = await uploadToBunny(thumbBuffer, thumbnailStoragePath, thumbType);
          uploadedThumbnailPath = thumbnailStoragePath;
        } catch (thumbError) {
          console.warn("Thumbnail upload failed:", thumbError.message);
        }
      }
    }

    const newReel = {
      title: title.trim(),
      caption: caption.trim(),
      videoUrl,
      thumbnail: thumbnailUrl,
      storagePath: videoStoragePath,
      thumbnailPath: thumbnailStoragePath,
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

    return NextResponse.json({
      success: true,
      data: profile.reels[0],
    });
  } catch (error) {
    console.error("POST error:", error);

    if (uploadedVideoPath) await deleteFromBunny(uploadedVideoPath);
    if (uploadedThumbnailPath) await deleteFromBunny(uploadedThumbnailPath);

    return NextResponse.json(
      { success: false, error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}

// PUT
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

    const form = await request.formData();
    const title = form.get("title");
    const caption = form.get("caption");

    const reel = profile.reels[reelIndex];

    if (title !== null && title !== undefined) {
      reel.title = title.trim();
    }
    if (caption !== null && caption !== undefined) {
      reel.caption = caption.trim();
    }

    await profile.save();

    return NextResponse.json({
      success: true,
      data: profile.reels[reelIndex],
    });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE
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