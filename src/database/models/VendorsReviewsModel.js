// models/Review.js

import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor ID is required"],
      index: true,
    },
    clerkUserId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    userAvatar: {
      type: String,
      default: "",
    },
    userEmail: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
      default: "",
    },
    text: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
      maxlength: [5000, "Review cannot exceed 5000 characters"],
    },
    eventType: {
      type: String,
      enum: [
        "",
        "Wedding",
        "Corporate",
        "Birthday",
        "Conference",
        "Reception",
        "Engagement",
        "Anniversary",
        "Party",
        "Other",
      ],
      default: "",
    },
    eventDate: {
      type: Date,
      default: null,
    },
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: "" },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBookingVerified: {
      type: Boolean,
      default: false,
    },
    helpful: {
      count: { type: Number, default: 0 },
      users: [{ type: String }],
    },
    notHelpful: {
      count: { type: Number, default: 0 },
      users: [{ type: String }],
    },
    replies: [
      {
        clerkUserId: { type: String, required: true },
        userName: { type: String, required: true },
        userAvatar: { type: String, default: "" },
        text: { type: String, required: true },
        isVendorReply: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "flagged"],
      default: "approved",
    },
    flaggedBy: [
      {
        clerkUserId: { type: String, required: true },
        reason: { type: String, default: "Inappropriate content" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    vendorResponse: {
      text: { type: String, default: "" },
      respondedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index - one review per user per vendor
ReviewSchema.index({ vendorId: 1, clerkUserId: 1 }, { unique: true });
ReviewSchema.index({ vendorId: 1, createdAt: -1 });
ReviewSchema.index({ vendorId: 1, rating: -1 });
ReviewSchema.index({ status: 1 });

// Pre-save middleware to ensure rating is integer
ReviewSchema.pre("save", function (next) {
  if (this.rating) {
    this.rating = Math.round(this.rating);
  }
  next();
});

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;
