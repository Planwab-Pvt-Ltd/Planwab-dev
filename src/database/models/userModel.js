import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    planId: {
      type: Number,
      default: 1,
    },
    creditBalance: {
      type: Number,
      default: 10,
    },
    userType: {
      type: String,
      enum: ["regular", "vendor", "admin"],
      default: "regular",
    },
    vendorDetails: {
      type: Object,
      default: null,
    },
    likedVendors: {
      type: [String],
      default: [],
    },
    watchlist: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const User = models?.User || model("User", UserSchema);

export default User;
