export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "../../../../../../database/mongoose";
import VendorProfile from "../../../../../../database/models/VendorProfileModel";

// Bunny config
const getBunnyConfig = () => ({
  storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME,
  storageZonePassword: process.env.BUNNY_STORAGE_ZONE_PASSWORD,
  pullZoneUrl: process.env.BUNNY_PULL_ZONE_URL,
});

const MAX_REELS = 12;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function generateUniqueFilename(original) {
  const ext = original?.split(".")?.pop()?.toLowerCase() || "mp4";
  return `${Date.now()}_${crypto.randomBytes(6).toString("hex")}.${ext}`;
}

// Upload to Bunny with retry logic
async function uploadToBunny(buffer, path, contentType, retries = 3) {
  const config = getBunnyConfig();

  if (!config.storageZoneName || !config.storageZonePassword || !config.pullZoneUrl) {
    throw new Error("Bunny.net configuration is incomplete. Check environment variables.");
  }

  const url = `https://storage.bunnycdn.com/${config.storageZoneName}/${path}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          AccessKey: config.storageZonePassword,
          "Content-Type": contentType,
          "Content-Length": buffer.length.toString(),
        },
        body: buffer,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown error");
        throw new Error(`Bunny upload failed (${res.status}): ${errorText}`);
      }

      return `${config.pullZoneUrl}/${path}`;
    } catch (error) {
      console.error(`Bunny upload attempt ${attempt} failed:`, error.message);
      if (attempt === retries) throw error;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

// Delete from Bunny
async function deleteFromBunny(path) {
  if (!path) return;

  const config = getBunnyConfig();

  if (!config.storageZoneName || !config.storageZonePassword) {
    console.warn("Bunny config incomplete, skipping delete");
    return;
  }

  const url = `https://storage.bunnycdn.com/${config.storageZoneName}/${path}`;

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: { AccessKey: config.storageZonePassword },
    });

    if (!res.ok && res.status !== 404) {
      console.warn(`Failed to delete from Bunny: ${res.status}`);
    }
  } catch (error) {
    console.warn("Bunny delete error:", error.message);
  }
}

// GET - Fetch all reels for a vendor
export async function GET(request, context) {
  try {
    await connectToDatabase();

    const params = await context.params;
    const vendorId = params.id;

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Vendor ID is required" }, { status: 400 });
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
    console.error("GET reels error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Create a new reel
export async function POST(request, context) {
  let uploadedVideoPath = null;
  let uploadedThumbnailPath = null;

  try {
    await connectToDatabase();

    const params = await context.params;
    const vendorId = params.id;

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Vendor ID is required" }, { status: 400 });
    }

    console.log(`Processing reel upload for vendor: ${vendorId}`);

    const profile = await VendorProfile.findOne({ vendorId });
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    if (profile.reels && profile.reels.length >= MAX_REELS) {
      return NextResponse.json({ success: false, error: `Maximum ${MAX_REELS} reels allowed` }, { status: 400 });
    }

    // Parse form data
    let form;
    try {
      form = await request.formData();

      if (!form) {
  return NextResponse.json(
    { success: false, error: "Invalid form data" },
    { status: 400 }
  );
}

    } catch (formError) {
      console.error("Form data parsing error:", formError);
      return NextResponse.json({ success: false, error: "Invalid form data" }, { status: 400 });
    }

    const file = form.get("file");
    const title = form.get("title") || "Untitled Reel";
    const caption = form.get("caption") || "";
    const thumbnailFile = form.get("thumbnail");

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, error: "No video file provided" }, { status: 400 });
    }

    // Validate video type
    const fileType = file.type || "";
    if (!ALLOWED_VIDEO_TYPES.includes(fileType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid video type: ${fileType}. Only MP4, MOV, and WebM are allowed for reels.`,
        },
        { status: 400 },
      );
    }

    // Validate video size
    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `Video size (${Math.round(file.size / (1024 * 1024))}MB) exceeds ${Math.round(MAX_VIDEO_SIZE / (1024 * 1024))}MB limit`,
        },
        { status: 400 },
      );
    }

    console.log(`Uploading reel: ${file.name} (${Math.round(file.size / 1024)}KB)`);

    // Upload video to Bunny
    const videoBuffer = Buffer.from(await file.arrayBuffer());
    const videoFilename = generateUniqueFilename(file.name);
    const videoStoragePath = `reels/${vendorId}/${videoFilename}`;
    const videoUrl = await uploadToBunny(videoBuffer, videoStoragePath, fileType);
    uploadedVideoPath = videoStoragePath;

    console.log("Video upload successful:", videoUrl);

    // Upload thumbnail if provided
    let thumbnailUrl = null;
    let thumbnailStoragePath = null;

    if (thumbnailFile && typeof thumbnailFile !== "string" && thumbnailFile.size > 0) {
      const thumbType = thumbnailFile.type || "";

      if (!ALLOWED_IMAGE_TYPES.includes(thumbType)) {
        console.warn("Invalid thumbnail type, skipping:", thumbType);
      } else if (thumbnailFile.size > MAX_THUMBNAIL_SIZE) {
        console.warn("Thumbnail too large, skipping");
      } else {
        try {
          const thumbBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
          const thumbFilename = `thumb_${generateUniqueFilename(thumbnailFile.name)}`;
          thumbnailStoragePath = `reels/${vendorId}/thumbnails/${thumbFilename}`;
          thumbnailUrl = await uploadToBunny(thumbBuffer, thumbnailStoragePath, thumbType);
          uploadedThumbnailPath = thumbnailStoragePath;
          console.log("Thumbnail upload successful:", thumbnailUrl);
        } catch (thumbError) {
          console.warn("Thumbnail upload failed, continuing without:", thumbError.message);
        }
      }
    }

    // Create new reel document
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

    // Add to profile
    if (!profile.reels) {
      profile.reels = [];
    }
    profile.reels.unshift(newReel);

    await profile.save();

    const savedReel = profile.reels[0];
    console.log("Reel saved successfully:", savedReel._id);

    return NextResponse.json({
      success: true,
      data: savedReel,
    });
  } catch (error) {
    console.error("POST reels error:", error);

    // Cleanup uploaded files on error
    if (uploadedVideoPath) {
      await deleteFromBunny(uploadedVideoPath);
      console.log("Cleaned up video after error");
    }
    if (uploadedThumbnailPath) {
      await deleteFromBunny(uploadedThumbnailPath);
      console.log("Cleaned up thumbnail after error");
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Upload failed",
      },
      { status: 500 },
    );
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

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Vendor ID is required" }, { status: 400 });
    }

    if (!reelId) {
      return NextResponse.json({ success: false, error: "reelId query parameter is required" }, { status: 400 });
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
    const file = form.get("file");
    const title = form.get("title");
    const caption = form.get("caption");
    const thumbnailFile = form.get("thumbnail");

    const reel = profile.reels[reelIndex];

    // Update text fields if provided
    if (title !== null && title !== undefined) {
      reel.title = title.trim();
    }
    if (caption !== null && caption !== undefined) {
      reel.caption = caption.trim();
    }

    // Replace video if new file provided
    if (file && typeof file !== "string" && file.size > 0) {
      const fileType = file.type || "";

      if (!ALLOWED_VIDEO_TYPES.includes(fileType)) {
        return NextResponse.json({ success: false, error: "Only video files allowed" }, { status: 400 });
      }

      if (file.size > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `Video size exceeds ${Math.round(MAX_VIDEO_SIZE / (1024 * 1024))}MB limit`,
          },
          { status: 400 },
        );
      }

      // Delete old video
      await deleteFromBunny(reel.storagePath);

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = generateUniqueFilename(file.name);
      const storagePath = `reels/${vendorId}/${filename}`;
      const videoUrl = await uploadToBunny(buffer, storagePath, fileType);

      reel.videoUrl = videoUrl;
      reel.storagePath = storagePath;
    }

    // Replace thumbnail if provided
    if (thumbnailFile && typeof thumbnailFile !== "string" && thumbnailFile.size > 0) {
      const thumbType = thumbnailFile.type || "";

      if (ALLOWED_IMAGE_TYPES.includes(thumbType) && thumbnailFile.size <= MAX_THUMBNAIL_SIZE) {
        // Delete old thumbnail
        await deleteFromBunny(reel.thumbnailPath);

        const thumbBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
        const thumbFilename = `thumb_${generateUniqueFilename(thumbnailFile.name)}`;
        const thumbnailPath = `reels/${vendorId}/thumbnails/${thumbFilename}`;
        const thumbnailUrl = await uploadToBunny(thumbBuffer, thumbnailPath, thumbType);

        reel.thumbnail = thumbnailUrl;
        reel.thumbnailPath = thumbnailPath;
      }
    }

    await profile.save();

    return NextResponse.json({
      success: true,
      data: profile.reels[reelIndex],
    });
  } catch (error) {
    console.error("PUT reels error:", error);
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

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Vendor ID is required" }, { status: 400 });
    }

    if (!reelId) {
      return NextResponse.json({ success: false, error: "reelId query parameter is required" }, { status: 400 });
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

    try {
      await deleteFromBunny(reel.storagePath);
    } catch (error) {
      console.warn("Failed to delete video from storage:", error.message);
    }

    // Delete thumbnail from storage
    try {
      await deleteFromBunny(reel.thumbnailPath);
    } catch (error) {
      console.warn("Failed to delete thumbnail from storage:", error.message);
    }

    profile.reels.splice(reelIndex, 1);
    await profile.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE reels error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
