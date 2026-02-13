import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[6-9]\d{9}$/.test(v);
        },
        message: "Please enter a valid Indian mobile number",
      },
      index: true,
    },
    actionType: {
      type: String,
      required: true,
      enum: ["revealWhatsapp", "revealEmail", "revealPhone", "downloadBrochure", "bookDemo", "general"],
      default: "general",
    },
    source: {
      type: String,
      default: "website",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "lost"],
      default: "new",
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);