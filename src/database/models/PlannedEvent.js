import { Schema, model, models } from "mongoose";

const PlannedEventSchema = new Schema(
  {
    // --- User & Auth Fields (from original schema) ---
    clerkId: {
      type: String,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
    },

    // --- Step 1: Event & City ---
    category: {
      type: String,
      required: true, // wedding, anniversary, or birthday
    },
    city: {
      type: String,
      required: true,
    },

    // --- Step 2: Date & Time ---
    eventDetails: {
      year: {
        type: Number,
        required: true,
      },
      month: {
        type: String,
        required: true,
      },
      dateRange: {
        type: String,
      },
      timeSlot: {
        type: String,
      },
    },

    // --- Step 3: Guests ---
    guestDetails: {
      count: {
        type: Number,
        required: true,
      },
      ageGroup: {
        type: String,
      },
    },

    // --- Step 4: Budget ---
    budgetDetails: {
      valueFormatted: {
        type: String,
        required: true,
      },
      valueRaw: {
        type: Number,
        required: true,
      },
      paymentPreference: {
        type: String,
        required: true,
      },
    },

    // --- Step 5: Contact Info ---
    contactName: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

const PlannedEvent =
  models?.PlannedEvent || model("PlannedEvent", PlannedEventSchema);

export default PlannedEvent;