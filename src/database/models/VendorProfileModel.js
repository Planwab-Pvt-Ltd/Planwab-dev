// models/VendorProfile.js

import mongoose from "mongoose";

const highlightItemSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], default: "image" },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const highlightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  items: [highlightItemSchema],
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  description: { type: String, required: true },
  image: { type: String, required: true },
  likes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      likedAt: { type: Date, default: Date.now },
    },
  ],
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  savedBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      savedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const reelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  caption: { type: String },
  videoUrl: { type: String, required: true },
  thumbnail: { type: String },
  views: { type: Number, default: 0 },
  likes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      likedAt: { type: Date, default: Date.now },
    },
  ],
  savedBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      savedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const vendorProfileSchema = new mongoose.Schema(
  {
    vendorId: {
      type: String,
      required: true,
      unique: true,
    },
    vendorBusinessName: {
      type: String,
      required: true,
      trim: true,
    },
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    vendorAvatar: {
      type: String,
      default: "",
    },
    vendorCoverImage: {
      type: String,
      default: "",
    },
    location: {
      address: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    trust: {
      type: Number,
      default: 0,
    },
    highlights: [highlightSchema],
    posts: [postSchema],
    reels: [reelSchema],
  },
  {
    timestamps: true,
  }
);

vendorProfileSchema.index({ vendorId: 1 });
vendorProfileSchema.index({ category: 1 });
vendorProfileSchema.index({ "location.city": 1 });

const VendorProfile = mongoose.models.VendorProfile || mongoose.model("VendorProfile", vendorProfileSchema);

export default VendorProfile;
