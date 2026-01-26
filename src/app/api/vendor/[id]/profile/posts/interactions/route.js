import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../../../database/mongoose";
import VendorProfile from "../../../../../../../database/models/VendorProfileModel";

// POST - Handle post interactions (like, review, save)
export async function POST(request, context) {
  try {
    await connectToDatabase();

    const params = await context.params;
    const vendorId = params.id;

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "Vendor ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { postId, action, userId, value, reviewData } = body;

    if (!postId) {
      return NextResponse.json({ success: false, error: "Post ID is required" }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({ success: false, error: "Action is required" }, { status: 400 });
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

    switch (action) {
      case "like": {
        if (!userId) {
          return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        const likeIndex = post.likes.findIndex((l) => l.userId?.toString() === userId);

        if (value && likeIndex === -1) {
          // Add like
          post.likes.push({ userId, likedAt: new Date() });
        } else if (!value && likeIndex !== -1) {
          // Remove like
          post.likes.splice(likeIndex, 1);
        }

        await profile.save();

        return NextResponse.json({
          success: true,
          data: {
            likesCount: post.likes.length,
            isLiked: value,
          },
        });
      }

      case "save": {
        if (!userId) {
          return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        const saveIndex = post.savedBy.findIndex((s) => s.userId?.toString() === userId);

        if (value && saveIndex === -1) {
          // Add save
          post.savedBy.push({ userId, savedAt: new Date() });
        } else if (!value && saveIndex !== -1) {
          // Remove save
          post.savedBy.splice(saveIndex, 1);
        }

        await profile.save();

        return NextResponse.json({
          success: true,
          data: {
            savedCount: post.savedBy.length,
            isSaved: value,
          },
        });
      }

      case "addReview": {
        if (!userId) {
          return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        if (!reviewData || !reviewData.rating) {
          return NextResponse.json({ success: false, error: "Review data with rating is required" }, { status: 400 });
        }

        // Check if user already reviewed
        const existingReviewIndex = post.reviews.findIndex((r) => r.userId?.toString() === userId);
        if (existingReviewIndex !== -1) {
          return NextResponse.json({ success: false, error: "You have already reviewed this post" }, { status: 400 });
        }

        const newReview = {
          userId,
          rating: Math.min(5, Math.max(1, reviewData.rating)),
          comment: reviewData.comment || "",
          createdAt: new Date(),
        };

        post.reviews.push(newReview);
        await profile.save();

        const savedReview = post.reviews[post.reviews.length - 1];

        return NextResponse.json({
          success: true,
          data: {
            review: savedReview,
            reviewsCount: post.reviews.length,
          },
        });
      }

      case "editReview": {
        if (!userId) {
          return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        if (!reviewData) {
          return NextResponse.json({ success: false, error: "Review data is required" }, { status: 400 });
        }

        const reviewIndex = post.reviews.findIndex((r) => r.userId?.toString() === userId);
        if (reviewIndex === -1) {
          return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
        }

        if (reviewData.rating !== undefined) {
          post.reviews[reviewIndex].rating = Math.min(5, Math.max(1, reviewData.rating));
        }
        if (reviewData.comment !== undefined) {
          post.reviews[reviewIndex].comment = reviewData.comment;
        }

        await profile.save();

        return NextResponse.json({
          success: true,
          data: {
            review: post.reviews[reviewIndex],
          },
        });
      }

      case "deleteReview": {
        if (!userId) {
          return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        const reviewIndex = post.reviews.findIndex((r) => r.userId?.toString() === userId);
        if (reviewIndex === -1) {
          return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
        }

        post.reviews.splice(reviewIndex, 1);
        await profile.save();

        return NextResponse.json({
          success: true,
          data: {
            reviewsCount: post.reviews.length,
          },
        });
      }

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("POST interactions error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET - Get post interaction status for a user
export async function GET(request, context) {
  try {
    await connectToDatabase();

    const params = await context.params;
    const vendorId = params.id;

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const userId = searchParams.get("userId");

    if (!vendorId || !postId) {
      return NextResponse.json({ success: false, error: "Vendor ID and Post ID are required" }, { status: 400 });
    }

    const profile = await VendorProfile.findOne({ vendorId }).lean();
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    const post = profile.posts.find((p) => p._id.toString() === postId);
    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const isLiked = userId ? post.likes.some((l) => l.userId?.toString() === userId) : false;
    const isSaved = userId ? post.savedBy.some((s) => s.userId?.toString() === userId) : false;
    const userReview = userId ? post.reviews.find((r) => r.userId?.toString() === userId) : null;

    return NextResponse.json({
      success: true,
      data: {
        likesCount: post.likes.length,
        savedCount: post.savedBy.length,
        reviewsCount: post.reviews.length,
        reviews: post.reviews,
        isLiked,
        isSaved,
        userReview,
      },
    });
  } catch (error) {
    console.error("GET interactions error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}