import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import { connectToDatabase } from "../../../../../../database/mongoose";
import VendorProfile from "../../../../../../database/models/VendorProfileModel";

// Cloudinary config - initialize only once
const getCloudinary = () => {
  if (!cloudinary.config().cloud_name) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY_POSTS,
      api_secret: process.env.CLOUDINARY_API_SECRET_POSTS,
    });
  }
  return cloudinary;
};

// Bunny config
const getBunnyConfig = () => ({
  storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME,
  storageZonePassword: process.env.BUNNY_STORAGE_ZONE_PASSWORD,
  pullZoneUrl: process.env.BUNNY_PULL_ZONE_URL,
});

const MAX_POSTS = 6;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

function generateUniqueFilename(original) {
  const ext = original?.split(".")?.pop()?.toLowerCase() || "bin";
  return `${Date.now()}_${crypto.randomBytes(6).toString("hex")}.${ext}`;
}

// Upload video to Bunny with retry logic
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
      await new Promise((r) => setTimeout(r, 1000 * attempt)); // Exponential backoff
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

// Upload image to Cloudinary with promise wrapper
async function uploadToCloudinary(buffer, vendorId) {
  const cloud = getCloudinary();

  if (!cloud.config().cloud_name || !cloud.config().api_key || !cloud.config().api_secret) {
    throw new Error("Cloudinary configuration is incomplete. Check environment variables.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloud.uploader.upload_stream(
      {
        folder: `vendors/${vendorId}/posts`,
        resource_type: "image",
        transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(buffer);
  });
}

// Delete from Cloudinary
async function deleteFromCloudinary(publicId) {
  try {
    const cloud = getCloudinary();
    await cloud.uploader.destroy(publicId);
  } catch (error) {
    console.warn("Cloudinary delete error:", error.message);
  }
}

// GET - Fetch all posts for a vendor
export async function GET(request, context) {
  try {
    await connectToDatabase();

    // Handle params properly for Next.js 13+
    const params = await context.params;
    const vendorId = params.id;

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Vendor ID is required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOne({ vendorId }).select("posts").lean();

    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: profile.posts || [],
    });
  } catch (error) {
    console.error("GET posts error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Create a new post
export async function POST(request, context) {
  let uploadedPath = null;
  let uploadedType = null;

  try {
    await connectToDatabase();

    // Handle params properly for Next.js 13+
    const params = await context.params;
    const vendorId = params.id;

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Vendor ID is required" }, { status: 400 });
    }

    console.log(`Processing post upload for vendor: ${vendorId}`);

    const profile = await VendorProfile.findOne({ vendorId });
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    if (profile.posts && profile.posts.length >= MAX_POSTS) {
      return NextResponse.json({ success: false, error: `Maximum ${MAX_POSTS} posts allowed` }, { status: 400 });
    }

    // Parse form data
    let form;
    try {
      form = await request.formData();
    } catch (formError) {
      console.error("Form data parsing error:", formError);
      return NextResponse.json({ success: false, error: "Invalid form data" }, { status: 400 });
    }

    const file = form.get("file");
    const description = form.get("description") || "";
    const location = form.get("location") || "";

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const fileType = file.type || "";
    const isImage = ALLOWED_IMAGE_TYPES.includes(fileType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(fileType);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type: ${fileType}. Allowed: images (JPEG, PNG, WebP, GIF) and videos (MP4, MOV, WebM)`,
        },
        { status: 400 },
      );
    }

    // Validate file size
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `File size (${Math.round(file.size / (1024 * 1024))}MB) exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`,
        },
        { status: 400 },
      );
    }

    console.log(`Uploading ${isImage ? "image" : "video"}: ${file.name} (${Math.round(file.size / 1024)}KB)`);

    // Convert file to buffer
    let buffer;
    try {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } catch (bufferError) {
      console.error("Buffer conversion error:", bufferError);
      return NextResponse.json({ success: false, error: "Failed to process file" }, { status: 500 });
    }

    let mediaUrl, storagePath, mediaType;

    if (isImage) {
      // Upload image to Cloudinary
      console.log("Uploading to Cloudinary...");
      const result = await uploadToCloudinary(buffer, vendorId);
      mediaUrl = result.secure_url;
      storagePath = result.public_id;
      mediaType = "image";
      uploadedPath = storagePath;
      uploadedType = "cloudinary";
      console.log("Cloudinary upload successful:", mediaUrl);
    } else {
      // Upload video to Bunny
      console.log("Uploading to Bunny.net...");
      const filename = generateUniqueFilename(file.name);
      storagePath = `posts/${vendorId}/${filename}`;
      mediaUrl = await uploadToBunny(buffer, storagePath, fileType);
      mediaType = "video";
      uploadedPath = storagePath;
      uploadedType = "bunny";
      console.log("Bunny upload successful:", mediaUrl);
    }

    // Create new post document
    const newPost = {
      description: description.trim(),
      mediaUrl: mediaUrl,
      mediaType,
      storagePath,
      location: location.trim(),
      likes: [],
      reviews: [],
      savedBy: [],
      createdAt: new Date(),
    };

    // Add to profile
    if (!profile.posts) {
      profile.posts = [];
    }
    profile.posts.unshift(newPost);

    await profile.save();

    const savedPost = profile.posts[0];
    console.log("Post saved successfully:", savedPost._id);

    return NextResponse.json({
      success: true,
      data: savedPost,
    });
  } catch (error) {
    console.error("POST posts error:", error);

    // Cleanup uploaded file on error
    if (uploadedPath) {
      try {
        if (uploadedType === "cloudinary") {
          await deleteFromCloudinary(uploadedPath);
        } else if (uploadedType === "bunny") {
          await deleteFromBunny(uploadedPath);
        }
        console.log("Cleaned up uploaded file after error");
      } catch (cleanupError) {
        console.warn("Cleanup failed:", cleanupError.message);
      }
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

// PUT - Update a post
export async function PUT(request, context) {
  try {
    await connectToDatabase();

    const params = await context.params;
    const vendorId = params.id;

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Vendor ID is required" }, { status: 400 });
    }

    if (!postId) {
      return NextResponse.json({ success: false, error: "postId query parameter is required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOne({ vendorId });
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    const postIndex = profile.posts.findIndex((p) => p._id.toString() === postId);
    if (postIndex === -1) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const form = await request.formData();
    const file = form.get("file");
    const description = form.get("description");
    const location = form.get("location");

    const post = profile.posts[postIndex];

    // Update text fields if provided
    if (description !== null && description !== undefined) {
      post.description = description.trim();
    }

    if (location !== null && location !== undefined) {
      post.location = location.trim();
    }

    // Replace media if new file provided
    if (file && typeof file !== "string" && file.size > 0) {
      const fileType = file.type || "";
      const isImage = ALLOWED_IMAGE_TYPES.includes(fileType);
      const isVideo = ALLOWED_VIDEO_TYPES.includes(fileType);

      if (!isImage && !isVideo) {
        return NextResponse.json({ success: false, error: "Invalid file type" }, { status: 400 });
      }

      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
      if (file.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            error: `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`,
          },
          { status: 400 },
        );
      }

      // Delete old media
      if (post.storagePath) {
        try {
          if (post.mediaType === "image") {
            await deleteFromCloudinary(post.storagePath);
          } else {
            await deleteFromBunny(post.storagePath);
          }
        } catch (storageError) {
          console.warn("Failed to delete from storage:", storageError.message);
        }
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      let mediaUrl, storagePath, mediaType;

      if (isImage) {
        const result = await uploadToCloudinary(buffer, vendorId);
        mediaUrl = result.secure_url;
        storagePath = result.public_id;
        mediaType = "image";
      } else {
        const filename = generateUniqueFilename(file.name);
        storagePath = `posts/${vendorId}/${filename}`;
        mediaUrl = await uploadToBunny(buffer, storagePath, fileType);
        mediaType = "video";
      }

      post.image = mediaUrl;
      post.storagePath = storagePath;
      post.mediaType = mediaType;
    }

    await profile.save();

    return NextResponse.json({
      success: true,
      data: profile.posts[postIndex],
    });
  } catch (error) {
    console.error("PUT posts error:", error);
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

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Vendor ID is required" }, { status: 400 });
    }

    if (!postId) {
      return NextResponse.json({ success: false, error: "postId query parameter is required" }, { status: 400 });
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

    // Delete media from storage
    if (post.storagePath) {
      if (post.mediaType === "image") {
        await deleteFromCloudinary(post.storagePath);
      } else {
        await deleteFromBunny(post.storagePath);
      }
    }

    profile.posts.splice(postIndex, 1);
    await profile.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE posts error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
