import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    photo: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },

    plan: { type: String, enum: ["free", "pro", "max"], default: "free" },
    planExpiresAt: { type: Date, default: null },
    planPurchasedAt: { type: Date, default: null },
    billingCycle: { type: String, enum: ["monthly", "yearly", null], default: null },

    role: { type: String, enum: ["user", "vendor", "admin"], default: "user" },

    personalInfo: {
      phone: { type: String, default: "" },
      address: {
        address: { type: String, default: "" },
        city: { type: String, default: "" },
        pincode: { type: String, default: "" },
        state: { type: String, default: "" },
        country: { type: String, default: "India" },
      },
    },

    createdProfiles: { type: [String], default: [] },

    creditBalance: { type: Number, default: 10 },
    vendorDetails: { type: Object, default: null },
    likedVendors: { type: [String], default: [] },
    likedReels: { type: [String], default: [] },
    watchlistReels: { type: [String], default: [] },
    watchlist: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;