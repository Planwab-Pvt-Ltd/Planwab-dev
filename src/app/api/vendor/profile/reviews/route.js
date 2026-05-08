import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "../../../../../database/mongoose"; 
import Review from "../../../../../database/models/VendorsReviewsModel"; 
import { sanitizeText, calculateReviewStats, formatReviewResponse, getEmptyStats } from "@/lib/reviewUtils"; 

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit")) || 5));
    const sortBy = searchParams.get("sortBy") || "recent";
    const ratingFilter = searchParams.get("rating");

    if (!username) {
      return NextResponse.json({ success: false, message: "Username is required" }, { status: 400 });
    }

    const query = { username, status: "approved" };

    if (ratingFilter && ratingFilter !== "all") {
      query.rating = parseInt(ratingFilter);
    }

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

    const [reviews, total, stats] = await Promise.all([
      Review.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
      calculateReviewStats(Review, username),
    ]);

    let hasUserReviewed = false;
    try {
      const { userId } = await auth();
      if (userId) {
        const exists = await Review.exists({ username, clerkUserId: userId });
        hasUserReviewed = !!exists;
      }
    } catch (e) {
      console.error("Auth check failed:", e);
    }

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
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { username, rating, text, title, eventType } = body;

    if (!username) {
      return NextResponse.json({ success: false, message: "Username is required" }, { status: 400 });
    }

    const existingReview = await Review.findOne({ userName: username, clerkUserId: userId });
    if (existingReview) {
      return NextResponse.json(
        { success: false, message: "You have already reviewed this vendor." },
        { status: 409 }
      );
    }

    const review = await Review.create({
      username,
      clerkUserId: userId,
      userName: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.username || "User",
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