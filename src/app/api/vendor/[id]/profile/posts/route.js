export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes timeout for Vercel

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import { connectToDatabase } from "../../../../../../database/mongoose";
import VendorProfile from "../../../../../../database/models/VendorProfileModel";

// Cloudinary config
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
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

function generateUniqueFilename(original) {
  const ext = original?.split(".")?.pop()?.toLowerCase() || "bin";
  return `${Date.now()}_${crypto.randomBytes(6).toString("hex")}.${ext}`;
}

// Stream file to buffer in chunks (memory efficient)
async function fileToBuffer(file) {
  try {
    // For smaller files, use arrayBuffer directly
    if (file.size < 50 * 1024 * 1024) { // 50MB threshold
      const arrayBuffer = await file.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
    
    // For larger files, read in chunks
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
    throw new Error("Failed to process file. Please try a smaller file or check your connection.");
  }
}

// Upload video to Bunny with streaming
async function uploadToBunny(buffer, path, contentType, retries = 3) {
  const config = getBunnyConfig();

  if (!config.storageZoneName || !config.storageZonePassword || !config.pullZoneUrl) {
    throw new Error("Bunny.net configuration is incomplete.");
  }

  const url = `https://storage.bunnycdn.com/${config.storageZoneName}/${path}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 min timeout

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

async function deleteFromBunny(path) {
  if (!path) return;
  const config = getBunnyConfig();

  if (!config.storageZoneName || !config.storageZonePassword) {
    return;
  }

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

async function uploadToCloudinary(buffer, vendorId) {
  const cloud = getCloudinary();

  if (!cloud.config().cloud_name) {
    throw new Error("Cloudinary configuration is incomplete.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloud.uploader.upload_stream(
      {
        folder: `vendors/${vendorId}/posts`,
        resource_type: "image",
        transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
        timeout: 120000,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(buffer);
  });
}

async function deleteFromCloudinary(publicId) {
  try {
    const cloud = getCloudinary();
    await cloud.uploader.destroy(publicId);
  } catch (error) {
    console.warn("Cloudinary delete error:", error.message);
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

    // Parse form data with error handling for mobile
    let form;
    try {
      const contentType = request.headers.get("content-type") || "";
      
      if (!contentType.includes("multipart/form-data")) {
        return NextResponse.json(
          { success: false, error: "Invalid content type. Expected multipart/form-data" },
          { status: 400 }
        );
      }

      form = await request.formData();
    } catch (formError) {
      console.error("Form data parsing error:", formError);
      
      // Provide specific error messages for common issues
      if (formError.message?.includes("body") || formError.message?.includes("size")) {
        return NextResponse.json(
          { success: false, error: "File too large. Please try a smaller file or compress the video." },
          { status: 413 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: "Failed to process upload. Please try again." },
        { status: 400 }
      );
    }

    const file = form.get("file");
    const description = form.get("description") || "";
    const location = form.get("location") || "";

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const fileType = file.type || "";
    const isImage = ALLOWED_IMAGE_TYPES.includes(fileType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(fileType);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, error: `Invalid file type: ${fileType}` },
        { status: 400 }
      );
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit` },
        { status: 400 }
      );
    }

    console.log(`Processing ${isImage ? "image" : "video"}: ${file.name} (${Math.round(file.size / (1024 * 1024))}MB)`);

    // Convert file to buffer with memory-efficient method
    let buffer;
    try {
      buffer = await fileToBuffer(file);
    } catch (bufferError) {
      console.error("Buffer error:", bufferError);
      return NextResponse.json(
        { success: false, error: bufferError.message },
        { status: 500 }
      );
    }

    let mediaUrl, storagePath, mediaType;

    if (isImage) {
      const result = await uploadToCloudinary(buffer, vendorId);
      mediaUrl = result.secure_url;
      storagePath = result.public_id;
      mediaType = "image";
      uploadedPath = storagePath;
      uploadedType = "cloudinary";
    } else {
      const filename = generateUniqueFilename(file.name);
      storagePath = `posts/${vendorId}/${filename}`;
      mediaUrl = await uploadToBunny(buffer, storagePath, fileType);
      mediaType = "video";
      uploadedPath = storagePath;
      uploadedType = "bunny";
    }

    // Clear buffer from memory
    buffer = null;

    const newPost = {
      description: description.trim(),
      mediaUrl,
      mediaType,
      storagePath,
      location: location.trim(),
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

    return NextResponse.json({
      success: true,
      data: profile.posts[0],
    });
  } catch (error) {
    console.error("POST error:", error);

    if (uploadedPath) {
      try {
        if (uploadedType === "cloudinary") {
          await deleteFromCloudinary(uploadedPath);
        } else {
          await deleteFromBunny(uploadedPath);
        }
      } catch (e) {
        console.warn("Cleanup failed:", e);
      }
    }

    return NextResponse.json(
      { success: false, error: error.message || "Upload failed" },
      { status: 500 }
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

    const form = await request.formData();
    const description = form.get("description");
    const location = form.get("location");

    const post = profile.posts[postIndex];

    if (description !== null && description !== undefined) {
      post.description = description.trim();
    }

    if (location !== null && location !== undefined) {
      post.location = location.trim();
    }

    await profile.save();

    return NextResponse.json({
      success: true,
      data: profile.posts[postIndex],
    });
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
    console.error("DELETE error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}