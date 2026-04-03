import mongoose from "mongoose";

const scheduleMeetSchema = new mongoose.Schema(
  {
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    url: {
      type: String,
      default: "", // Can be updated later with a generated Google Meet/Zoom link
    },
    pageUrl: {
        type: String,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorProfile", // Replace with your actual profile/vendor ref name
      required: true,
    },
    userId: {
      type: String, // Clerk userId
      required: true,
    },
    user: {
      firstName: String,
      lastName: String,
      email: String,
      imageUrl: String,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    eventType: {
      type: String,
      enum: ["Wedding", "Anniversary", "Birthday", "Others"],
      required: true,
    },
    otherEventType: {
      type: String, // Populated only if eventType is "Others"
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ScheduleMeetModel = mongoose.models.ScheduleMeet || mongoose.model("ScheduleMeet", scheduleMeetSchema);

export default ScheduleMeetModel;