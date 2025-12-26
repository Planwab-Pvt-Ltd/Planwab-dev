// app/api/vendors/[vendorId]/reviews/route.js

import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/database/mongoose";
import {
  toObjectId,
  isValidObjectId,
  sanitizeText,
  calculateReviewStats,
  formatReviewResponse,
  getEmptyStats,
} from "@/lib/reviewUtils";
import Review from "@/database/models/VendorsReviewsModel";

// =============================================================================
// GET - Fetch reviews for a vendor
// =============================================================================
export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { vendorId } = await params;
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit")) || 10));
    const sortBy = searchParams.get("sortBy") || "recent";
    const filterRating = searchParams.get("rating");
    const filterType = searchParams.get("type");

    // Validate vendor ID
    if (!isValidObjectId(vendorId)) {
      return NextResponse.json({
        success: true,
        data: {
          reviews: [],
          stats: getEmptyStats(),
          userReview: null,
          hasUserReviewed: false,
          pagination: {
            page: 1,
            limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        },
      });
    }

    const vendorObjectId = toObjectId(vendorId);

    // Get current user from Clerk
    let clerkUserId = null;
    try {
      const { userId } = await auth();
      clerkUserId = userId;
    } catch (e) {
      // User not authenticated, continue without user context
    }

    // Build query
    const query = {
      vendorId: vendorObjectId,
      status: "approved",
    };

    // Filter by rating
    if (filterRating && filterRating !== "all") {
      const rating = parseInt(filterRating);
      if (rating >= 1 && rating <= 5) {
        query.rating = rating;
      }
    }

    // Filter by type
    if (filterType === "photos") {
      query["images.0"] = { $exists: true };
    } else if (filterType === "verified") {
      query.$or = [{ isVerified: true }, { isBookingVerified: true }];
    }

    // Build sort
    let sort = { createdAt: -1 };
    switch (sortBy) {
      case "helpful":
        sort = { "helpful.count": -1, createdAt: -1 };
        break;
      case "rating_high":
        sort = { rating: -1, createdAt: -1 };
        break;
      case "rating_low":
        sort = { rating: 1, createdAt: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [reviews, total, stats] = await Promise.all([
      Review.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Review.countDocuments(query),
      calculateReviewStats(Review, vendorId),
    ]);

    // Check if current user has reviewed
    let userReview = null;
    let hasUserReviewed = false;

    if (clerkUserId) {
      const existingReview = await Review.findOne({
        vendorId: vendorObjectId,
        clerkUserId: clerkUserId,
      }).lean();

      if (existingReview) {
        hasUserReviewed = true;
        userReview = formatReviewResponse(existingReview);
      }
    }

    // Format reviews
    const formattedReviews = reviews.map(formatReviewResponse);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        reviews: formattedReviews,
        stats,
        userReview,
        hasUserReviewed,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("GET /reviews error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to load reviews. Please try again.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Create a new review
// =============================================================================
export async function POST(request, { params }) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Please sign in to write a review" }, { status: 401 });
    }

    // Get user details from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unable to verify your account. Please try again." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { id } = await params;

    const vendorObjectId = id;

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
    }

    const { rating, title, text, eventType, eventDate, images } = body;

    // Validate rating
    const parsedRating = parseInt(rating);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { success: false, message: "Please select a rating between 1 and 5 stars" },
        { status: 400 }
      );
    }

    // Validate review text
    const cleanText = sanitizeText(text, 5000);
    if (!cleanText) {
      return NextResponse.json({ success: false, message: "Please write your review" }, { status: 400 });
    }

    // Check for existing review
    const existingReview = await Review.findOne({
      vendorId: vendorObjectId,
      clerkUserId: userId,
    });

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already reviewed this vendor. You can edit your existing review.",
          existingReviewId: existingReview._id.toString(),
        },
        { status: 409 }
      );
    }

    // Get user name from Clerk
    const userName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`.trim()
        : user.firstName || user.username || user.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Anonymous User";

    // Create review
    const review = new Review({
      vendorId: vendorObjectId,
      clerkUserId: userId,
      userName: sanitizeText(userName, 100),
      userAvatar: user.imageUrl || "",
      userEmail: user.emailAddresses?.[0]?.emailAddress || "",
      rating: parsedRating,
      title: sanitizeText(title, 200),
      text: cleanText,
      eventType: eventType || "",
      eventDate: eventDate ? new Date(eventDate) : null,
      images: Array.isArray(images) ? images.slice(0, 10) : [],
      status: "approved",
    });

    await review.save();

    // Calculate updated stats
    const stats = await calculateReviewStats(Review, vendorId);

    // Format response
    const formattedReview = formatReviewResponse(review.toObject());

    return NextResponse.json(
      {
        success: true,
        message: "Your review has been posted successfully!",
        data: {
          review: formattedReview,
          updatedStats: stats,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /reviews error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "You have already reviewed this vendor" }, { status: 409 });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0];
      return NextResponse.json(
        { success: false, message: firstError?.message || "Invalid review data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to post your review. Please try again.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
