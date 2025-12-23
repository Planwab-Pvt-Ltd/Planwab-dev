import { Schema, model, models } from "mongoose";

const PlannedEventSchema = new Schema(
  {
    // --- User & Auth Fields ---
    clerkId: {
      type: String,
      index: true, // Just index, NOT unique - users can have multiple events
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    username: {
      type: String,
      default: "Guest",
    },

    // --- Step 1: Event Category & City ---
    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: {
        values: ["wedding", "anniversary", "birthday"],
        message: "{VALUE} is not a valid category",
      },
      lowercase: true,
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    // --- Step 2: Date & Time ---
    eventDetails: {
      selectedDate: {
        type: String,
      },
      year: {
        type: Number,
      },
      month: {
        type: String,
        trim: true,
      },
      day: {
        type: Number,
      },
      dateRange: {
        type: String,
      },
      timeSlot: {
        type: String,
        trim: true,
      },
    },

    // --- Step 3: Budget ---
    budgetDetails: {
      valueFormatted: {
        type: String,
        required: [true, "Budget value is required"],
      },
      valueRaw: {
        type: Number,
        required: [true, "Budget range is required"],
        min: [0, "Budget cannot be negative"],
      },
      paymentPreference: {
        type: String,
        trim: true,
        required: false,
        default: "",
      },
    },

    // --- Step 4: Contact Info ---
    contactName: {
      type: String,
      required: [true, "Contact name is required"],
      trim: true,
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    countryCode: {
      type: String,
      default: "+91",
    },
    fullPhone: {
      type: String,
      trim: true,
    },

    // --- Step 5: Current Location ---
    currentLocation: {
      type: String,
      trim: true,
    },

    // --- Metadata ---
    status: {
      type: String,
      enum: ["pending", "in-progress", "proposal-sent", "confirmed", "cancelled"],
      default: "pending",
    },
    source: {
      type: String,
      default: "web",
    },
    notes: {
      type: String,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries (no unique constraints)
PlannedEventSchema.index({ category: 1, city: 1 });
PlannedEventSchema.index({ status: 1 });
PlannedEventSchema.index({ createdAt: -1 });
PlannedEventSchema.index({ contactEmail: 1 });

// Delete cached model to force re-registration
if (models.PlannedEvent) {
  delete models.PlannedEvent;
}

const PlannedEvent = model("PlannedEvent", PlannedEventSchema);

// Remove any existing unique index on clerkId (run once)
PlannedEvent.collection.indexes().then((indexes) => {
  const clerkIdIndex = indexes.find((idx) => idx.key && idx.key.clerkId && idx.unique);
  if (clerkIdIndex) {
    PlannedEvent.collection
      .dropIndex(clerkIdIndex.name)
      .then(() => console.log("✅ Removed unique constraint from clerkId"))
      .catch((err) => console.log("Index removal note:", err.message));
  }
});

export default PlannedEvent;
