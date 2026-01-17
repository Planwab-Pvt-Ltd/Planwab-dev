import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "../../../../../database/mongoose"; 
import Review from "../../../../../database/models/VendorsReviewsModel"; 
import { sanitizeText, calculateReviewStats, formatReviewResponse, getEmptyStats } from "@/lib/reviewUtils"; 

// Force dynamic to prevent caching of reviews
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    // 1. Safe Param Resolution
    const resolvedParams = await params;
    const vendorId = resolvedParams.id; 

    // 2. Parse Query Params
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit")) || 5));
    const sortBy = searchParams.get("sortBy") || "recent";
    const ratingFilter = searchParams.get("rating");

    // 3. Build Database Query (Fixes Filters)
    const query = { vendorId: vendorId, status: "approved" };

    // Apply Star Filter
    if (ratingFilter && ratingFilter !== "all") {
      query.rating = parseInt(ratingFilter);
    }

    // Apply Sorting
    let sortOptions = { createdAt: -1 }; 
    switch (sortBy) {
      case "helpful":
        sortOptions = { "helpful.count": -1, createdAt: -1 };
        break;
      case "rating_high":
        sortOptions = { rating: -1, createdAt: -1 };
        break;
      case "rating_low":
        sortOptions = { rating: 1, createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
    }

    // 4. Fetch Data & Calculate Stats 
    const [reviews, total, stats] = await Promise.all([
      Review.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
      calculateReviewStats(Review, vendorId),
    ]);

    let hasUserReviewed = false;
    try {
      const { userId } = await auth();
      if (userId) {
        const exists = await Review.exists({ vendorId, clerkUserId: userId });
        hasUserReviewed = !!exists;
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        stats,
        hasUserReviewed,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
        },
      },
    });
  } catch (error) {
    console.error("GET Reviews Error:", error);
    return NextResponse.json({ success: false, message: "Server Error", error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    // 1. Auth Check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    await connectToDatabase();

    // 2. Params & Body
    const { id } = await params;
    const vendorId = id;

    const body = await request.json();
    const { rating, text, title, eventType } = body;

    // 3. Duplicate Check
    const existingReview = await Review.findOne({ vendorId, clerkUserId: userId });
    if (existingReview) {
      return NextResponse.json({ success: false, message: "You have already reviewed this vendor." }, { status: 409 });
    }

    // 4. Create Review
    const review = await Review.create({
      vendorId,
      clerkUserId: userId,
      userName: user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.username || "User",
      userAvatar: user.imageUrl,
      userEmail: user.emailAddresses[0]?.emailAddress,
      rating,
      text: sanitizeText ? sanitizeText(text) : text, 
      title: title || "Review",
      eventType: eventType || "General",
      status: "approved",
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Review created successfully",
        data: review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Review Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 } 
    );
  }
}
