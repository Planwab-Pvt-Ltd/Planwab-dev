// app/api/vendors/[vendorId]/reviews/[reviewId]/route.js

import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/database/mongoose";
import mongoose from "mongoose";
import {
  toObjectId,
  isValidObjectId,
  sanitizeText,
  calculateReviewStats,
  formatReviewResponse,
  getInitials,
} from "@/lib/reviewUtils";
import Review from "@/database/models/VendorsReviewsModel";

// =============================================================================
// GET - Get a single review
// =============================================================================
export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { reviewId } = await params;

    if (!isValidObjectId(reviewId)) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    const review = await Review.findById(reviewId).lean();

    if (!review) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: formatReviewResponse(review),
    });
  } catch (error) {
    console.error("GET /reviews/[reviewId] error:", error);
    return NextResponse.json({ success: false, message: "Unable to load review" }, { status: 500 });
  }
}

// =============================================================================
// PUT - Update review (vote, reply, edit, flag, vendor response)
// =============================================================================
export async function PUT(request, { params }) {
  try {
    const { vendorId, reviewId } = await params;

    // Validate IDs
    if (!isValidObjectId(reviewId)) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    // Get current user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Please sign in to continue" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unable to verify your account" }, { status: 401 });
    }

    await connectToDatabase();

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
    }

    const { action, ...data } = body;

    if (!action) {
      return NextResponse.json({ success: false, message: "Action is required" }, { status: 400 });
    }

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    // Handle different actions
    switch (action) {
      // =====================
      // HELPFUL VOTE
      // =====================
      case "helpful": {
        const helpfulUsers = review.helpful?.users || [];
        const notHelpfulUsers = review.notHelpful?.users || [];
        const alreadyHelpful = helpfulUsers.includes(userId);
        const alreadyNotHelpful = notHelpfulUsers.includes(userId);

        if (alreadyHelpful) {
          // Remove vote
          review.helpful.users = helpfulUsers.filter((u) => u !== userId);
          review.helpful.count = Math.max(0, (review.helpful.count || 0) - 1);
        } else {
          // Add helpful vote
          if (!review.helpful) {
            review.helpful = { count: 0, users: [] };
          }
          review.helpful.users.push(userId);
          review.helpful.count = (review.helpful.count || 0) + 1;

          // Remove not helpful if exists
          if (alreadyNotHelpful) {
            review.notHelpful.users = notHelpfulUsers.filter((u) => u !== userId);
            review.notHelpful.count = Math.max(0, (review.notHelpful.count || 0) - 1);
          }
        }

        await review.save();

        return NextResponse.json({
          success: true,
          message: alreadyHelpful ? "Vote removed" : "Thanks for your feedback!",
          data: {
            helpful: review.helpful.count,
            notHelpful: review.notHelpful?.count || 0,
            userVote: alreadyHelpful ? null : "helpful",
            helpfulUsers: review.helpful.users,
            notHelpfulUsers: review.notHelpful?.users || [],
          },
        });
      }

      // =====================
      // NOT HELPFUL VOTE
      // =====================
      case "notHelpful": {
        const helpfulUsers = review.helpful?.users || [];
        const notHelpfulUsers = review.notHelpful?.users || [];
        const alreadyNotHelpful = notHelpfulUsers.includes(userId);
        const alreadyHelpful = helpfulUsers.includes(userId);

        if (alreadyNotHelpful) {
          // Remove vote
          review.notHelpful.users = notHelpfulUsers.filter((u) => u !== userId);
          review.notHelpful.count = Math.max(0, (review.notHelpful.count || 0) - 1);
        } else {
          // Add not helpful vote
          if (!review.notHelpful) {
            review.notHelpful = { count: 0, users: [] };
          }
          review.notHelpful.users.push(userId);
          review.notHelpful.count = (review.notHelpful.count || 0) + 1;

          // Remove helpful if exists
          if (alreadyHelpful) {
            review.helpful.users = helpfulUsers.filter((u) => u !== userId);
            review.helpful.count = Math.max(0, (review.helpful.count || 0) - 1);
          }
        }

        await review.save();

        return NextResponse.json({
          success: true,
          message: alreadyNotHelpful ? "Vote removed" : "Thanks for your feedback!",
          data: {
            helpful: review.helpful?.count || 0,
            notHelpful: review.notHelpful.count,
            userVote: alreadyNotHelpful ? null : "notHelpful",
            helpfulUsers: review.helpful?.users || [],
            notHelpfulUsers: review.notHelpful.users,
          },
        });
      }

      // =====================
      // ADD REPLY
      // =====================
      case "reply": {
        const { text, isVendorReply } = data;

        const cleanText = sanitizeText(text, 2000);
        if (!cleanText) {
          return NextResponse.json({ success: false, message: "Please write your reply" }, { status: 400 });
        }

        const userName =
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`.trim()
            : user.firstName || user.username || "Anonymous";

        const newReply = {
          _id: new mongoose.Types.ObjectId(),
          clerkUserId: userId,
          userName: sanitizeText(userName, 100),
          userAvatar: user.imageUrl || "",
          text: cleanText,
          isVendorReply: !!isVendorReply,
          createdAt: new Date(),
        };

        if (!review.replies) {
          review.replies = [];
        }
        review.replies.push(newReply);
        await review.save();

        return NextResponse.json({
          success: true,
          message: "Reply posted successfully!",
          data: {
            reply: {
              id: newReply._id.toString(),
              clerkUserId: newReply.clerkUserId,
              userName: newReply.userName,
              userAvatar: newReply.userAvatar,
              userInitials: getInitials(newReply.userName),
              text: newReply.text,
              isVendorReply: newReply.isVendorReply,
              timeAgo: "Just now",
              createdAt: newReply.createdAt,
            },
          },
        });
      }

      // =====================
      // FLAG REVIEW
      // =====================
      case "flag": {
        const { reason } = data;

        const flaggedBy = review.flaggedBy || [];
        const alreadyFlagged = flaggedBy.some((f) => f.clerkUserId === userId);

        if (alreadyFlagged) {
          return NextResponse.json(
            { success: false, message: "You have already reported this review" },
            { status: 409 }
          );
        }

        if (!review.flaggedBy) {
          review.flaggedBy = [];
        }

        review.flaggedBy.push({
          clerkUserId: userId,
          reason: sanitizeText(reason, 500) || "Inappropriate content",
          createdAt: new Date(),
        });

        // Auto-flag if reported by 3+ users
        if (review.flaggedBy.length >= 3) {
          review.status = "flagged";
        }

        await review.save();

        return NextResponse.json({
          success: true,
          message: "Thank you for reporting. Our team will review this.",
        });
      }

      // =====================
      // EDIT REVIEW
      // =====================
      case "edit": {
        if (review.clerkUserId !== userId) {
          return NextResponse.json({ success: false, message: "You can only edit your own review" }, { status: 403 });
        }

        const { rating, title, text, eventType } = data;

        if (rating !== undefined) {
          const parsedRating = parseInt(rating);
          if (parsedRating < 1 || parsedRating > 5) {
            return NextResponse.json({ success: false, message: "Rating must be between 1 and 5" }, { status: 400 });
          }
          review.rating = parsedRating;
        }

        if (title !== undefined) {
          review.title = sanitizeText(title, 200);
        }

        if (text !== undefined) {
          const cleanText = sanitizeText(text, 5000);
          if (!cleanText) {
            return NextResponse.json({ success: false, message: "Review text cannot be empty" }, { status: 400 });
          }
          review.text = cleanText;
        }

        if (eventType !== undefined) {
          review.eventType = eventType;
        }

        await review.save();

        // Get updated stats
        const stats = await calculateReviewStats(Review, vendorId);

        return NextResponse.json({
          success: true,
          message: "Your review has been updated!",
          data: {
            review: formatReviewResponse(review.toObject()),
            updatedStats: stats,
          },
        });
      }

      // =====================
      // VENDOR RESPONSE
      // =====================
      case "vendorResponse": {
        const { text } = data;

        // TODO: Add proper vendor ownership check
        // For now, just save the response

        const cleanText = sanitizeText(text, 2000);
        if (!cleanText) {
          return NextResponse.json({ success: false, message: "Please write your response" }, { status: 400 });
        }

        review.vendorResponse = {
          text: cleanText,
          respondedAt: new Date(),
        };

        await review.save();

        return NextResponse.json({
          success: true,
          message: "Response posted successfully!",
          data: {
            vendorResponse: {
              text: review.vendorResponse.text,
              timeAgo: "Just now",
              respondedAt: review.vendorResponse.respondedAt,
            },
          },
        });
      }

      default:
        return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("PUT /reviews/[reviewId] error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Delete a review
// =============================================================================
export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Please sign in to continue" }, { status: 401 });
    }

    await connectToDatabase();

    const { vendorId, reviewId } = await params;

    if (!isValidObjectId(reviewId)) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    // Check ownership
    if (review.clerkUserId !== userId) {
      return NextResponse.json({ success: false, message: "You can only delete your own review" }, { status: 403 });
    }

    await Review.findByIdAndDelete(reviewId);

    // Get updated stats
    const stats = await calculateReviewStats(Review, vendorId);

    return NextResponse.json({
      success: true,
      message: "Your review has been deleted",
      data: {
        updatedStats: stats,
      },
    });
  } catch (error) {
    console.error("DELETE /reviews/[reviewId] error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to delete review. Please try again." },
      { status: 500 }
    );
  }
}
