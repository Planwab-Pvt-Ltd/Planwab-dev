// lib/reviewUtils.js

import mongoose from "mongoose";

/**
 * Safely convert string to MongoDB ObjectId
 */
export const toObjectId = (id) => {
  if (!id) return null;

  try {
    // Already an ObjectId
    if (id instanceof mongoose.Types.ObjectId) {
      return id;
    }

    // String that looks like ObjectId (24 hex chars)
    if (typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id)) {
      return new mongoose.Types.ObjectId(id);
    }

    return null;
  } catch (error) {
    console.error("Error converting to ObjectId:", error);
    return null;
  }
};

/**
 * Check if a string is a valid MongoDB ObjectId format
 */
export const isValidObjectId = (id) => {
  if (!id) return false;

  try {
    if (typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id)) {
      return true;
    }
    if (id instanceof mongoose.Types.ObjectId) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Format date to "X time ago" string
 */
export const getTimeAgo = (date) => {
  if (!date) return "Unknown";

  try {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 0) return "Just now";
    if (seconds < 60) return "Just now";

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  } catch {
    return "Unknown";
  }
};

/**
 * Get initials from a name
 */
export const getInitials = (name) => {
  if (!name || typeof name !== "string") return "??";

  const trimmed = name.trim();
  if (!trimmed) return "??";

  const parts = trimmed.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return trimmed.substring(0, 2).toUpperCase();
};

/**
 * Sanitize and trim text input
 */
export const sanitizeText = (text, maxLength = 5000) => {
  if (!text || typeof text !== "string") return "";
  return text.trim().substring(0, maxLength);
};

/**
 * Calculate review statistics for a vendor
 */
export const calculateReviewStats = async (Review, vendorId) => {
  try {
    const objectId = toObjectId(vendorId);
    if (!objectId) {
      return getEmptyStats();
    }

    const stats = await Review.aggregate([
      {
        $match: {
          vendorId: objectId,
          status: "approved",
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          rating5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        },
      },
    ]);

    if (!stats || stats.length === 0) {
      return getEmptyStats();
    }

    const { averageRating, totalReviews, rating5, rating4, rating3, rating2, rating1 } = stats[0];

    return {
      averageRating: Math.round((averageRating || 0) * 10) / 10,
      totalReviews: totalReviews || 0,
      distribution: {
        5: totalReviews > 0 ? Math.round((rating5 / totalReviews) * 100) : 0,
        4: totalReviews > 0 ? Math.round((rating4 / totalReviews) * 100) : 0,
        3: totalReviews > 0 ? Math.round((rating3 / totalReviews) * 100) : 0,
        2: totalReviews > 0 ? Math.round((rating2 / totalReviews) * 100) : 0,
        1: totalReviews > 0 ? Math.round((rating1 / totalReviews) * 100) : 0,
      },
      counts: {
        5: rating5 || 0,
        4: rating4 || 0,
        3: rating3 || 0,
        2: rating2 || 0,
        1: rating1 || 0,
      },
    };
  } catch (error) {
    console.error("Error calculating review stats:", error);
    return getEmptyStats();
  }
};

/**
 * Get empty stats object
 */
export const getEmptyStats = () => ({
  averageRating: 0,
  totalReviews: 0,
  distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
});

/**
 * Format a review document for API response
 */
export const formatReviewResponse = (review) => {
  if (!review) return null;

  return {
    id: review._id?.toString() || "",
    clerkUserId: review.clerkUserId || "",
    userName: review.userName || "Anonymous",
    userAvatar: review.userAvatar || "",
    userInitials: getInitials(review.userName),
    rating: review.rating || 0,
    title: review.title || "",
    text: review.text || "",
    eventType: review.eventType || "",
    eventDate: review.eventDate || null,
    images: review.images || [],
    isVerified: review.isVerified || false,
    isBookingVerified: review.isBookingVerified || false,
    helpful: review.helpful?.count || 0,
    notHelpful: review.notHelpful?.count || 0,
    helpfulUsers: review.helpful?.users || [],
    notHelpfulUsers: review.notHelpful?.users || [],
    timeAgo: getTimeAgo(review.createdAt),
    createdAt: review.createdAt || null,
    updatedAt: review.updatedAt || null,
    replies: (review.replies || []).map((reply) => ({
      id: reply._id?.toString() || "",
      clerkUserId: reply.clerkUserId || "",
      userName: reply.userName || "Anonymous",
      userAvatar: reply.userAvatar || "",
      userInitials: getInitials(reply.userName),
      text: reply.text || "",
      isVendorReply: reply.isVendorReply || false,
      timeAgo: getTimeAgo(reply.createdAt),
      createdAt: reply.createdAt || null,
    })),
    vendorResponse: review.vendorResponse?.text
      ? {
          text: review.vendorResponse.text,
          timeAgo: getTimeAgo(review.vendorResponse.respondedAt),
          respondedAt: review.vendorResponse.respondedAt,
        }
      : null,
    status: review.status || "approved",
  };
};
