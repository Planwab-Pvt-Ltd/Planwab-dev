import mongoose from "mongoose";

const scheduleMeetSchema = new mongoose.Schema(
  {
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    url: {
      type: String,
      default: "",
    },
    pageUrl: {
        type: String,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorProfile",
      required: true,
    },
    userId: {
      type: String,
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
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ScheduleMeetModel = mongoose.models.ScheduleMeet || mongoose.model("ScheduleMeet", scheduleMeetSchema);

export default ScheduleMeetModel;