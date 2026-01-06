import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../database/mongoose";
import PlannedEvent from "../../../../database/models/PlannedEvent";
import User from "../../../../database/models/userModel";

// Helper function to safely parse numbers
const safeParseNumber = (value, defaultValue = null) => {
  if (value === null || value === undefined || value === "") {
    return defaultValue;
  }
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to sanitize string
const sanitizeString = (str, defaultValue = "") => {
  if (!str || typeof str !== "string") return defaultValue;
  return str.trim();
};

export async function POST(request) {
  try {
    // 1. Connect to DB
    await connectToDatabase();

    // 2. Parse Body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json({ success: false, message: "Invalid JSON in request body" }, { status: 400 });
    }

    // 3. Destructure inputs
    const {
      username,
      clerkId,
      category,
      city,
      // Date fields (new structure)
      selectedDate,
      year,
      month,
      day,
      dateRange,
      timeSlot,
      // Budget fields
      budget,
      budgetRange,
      paymentPreference,
      // Contact fields
      name,
      email,
      phone,
      countryCode,
      fullPhone,
      // Location field (new)
      currentLocation,
      // Optional metadata
      source,
      notes,
    } = body;

    // 4. Validate required fields
    const errors = [];

    if (!category) {
      errors.push("Event category is required");
    } else if (!["wedding", "anniversary", "birthday"].includes(category.toLowerCase())) {
      errors.push("Invalid event category. Must be wedding, anniversary, or birthday");
    }

    if (!city || !sanitizeString(city)) {
      errors.push("City is required");
    }

    if (!name || !sanitizeString(name)) {
      errors.push("Contact name is required");
    }

    if (!email || !sanitizeString(email)) {
      errors.push("Contact email is required");
    } else if (!isValidEmail(email)) {
      errors.push("Please provide a valid email address");
    }

    if (!budget) {
      errors.push("Budget is required");
    }

    if (budgetRange === undefined || budgetRange === null) {
      errors.push("Budget range is required");
    }

    // Date validation - need at least selectedDate OR (month AND year)
    if (!selectedDate && (!month || !year)) {
      errors.push("Event date is required (either selectedDate or month and year)");
    }

    // Location validation (new required field)
    if (!currentLocation || !sanitizeString(currentLocation)) {
      errors.push("Current location is required");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: errors,
        },
        { status: 400 }
      );
    }

    // 5. Resolve User
    let mongoUserId = null;
    if (clerkId) {
      try {
        const user = await User.findOne({ clerkId: clerkId }).select("_id").lean();
        if (user) {
          mongoUserId = user._id;
        }
      } catch (userError) {
        console.warn("Warning: Could not resolve user:", userError.message);
        // Continue without user reference - don't fail the request
      }
    }

    // 6. Construct Event Object with data cleaning
    const eventData = {
      // User fields
      clerkId: sanitizeString(clerkId) || null,
      userId: mongoUserId,
      username: sanitizeString(username) || "Guest",

      // Event basics
      category: sanitizeString(category).toLowerCase(),
      city: sanitizeString(city),

      // Date details
      eventDetails: {
        selectedDate: sanitizeString(selectedDate) || null,
        year: safeParseNumber(year),
        month: sanitizeString(month),
        day: safeParseNumber(day),
        dateRange: sanitizeString(dateRange),
        timeSlot: sanitizeString(timeSlot),
      },

      // Budget details
      budgetDetails: {
        valueFormatted: sanitizeString(budget),
        valueRaw: safeParseNumber(budgetRange, 0),
        paymentPreference: sanitizeString(paymentPreference) || "", // Optional field
      },

      // Contact details
      contactName: sanitizeString(name),
      contactEmail: sanitizeString(email).toLowerCase(),
      contactPhone: sanitizeString(phone),
      countryCode: sanitizeString(countryCode) || "+91",
      fullPhone: sanitizeString(fullPhone) || (phone ? `${countryCode || "+91"} ${phone}` : ""),

      // Location (new field)
      currentLocation: sanitizeString(currentLocation),

      // Metadata
      status: "pending",
      source: sanitizeString(source) || "web",
      notes: sanitizeString(notes),
    };

    // 7. Save to Database
    const newEvent = new PlannedEvent(eventData);
    const savedEvent = await newEvent.save();

    // 8. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        event: {
          id: savedEvent._id,
          category: savedEvent.category,
          city: savedEvent.city,
          contactName: savedEvent.contactName,
          contactEmail: savedEvent.contactEmail,
          status: savedEvent.status,
          createdAt: savedEvent.createdAt,
          formattedEventDate: savedEvent.formattedEventDate,
          daysUntilEvent: savedEvent.daysUntilEvent,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // 9. Professional Error Handling
    console.error("❌ CREATE_EVENT_ERROR:", {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });

    // Mongoose Validation Error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return NextResponse.json(
        {
          success: false,
          message: "Validation Error",
          errors: messages,
        },
        { status: 400 }
      );
    }

    // Mongoose Duplicate Key Error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return NextResponse.json(
        {
          success: false,
          message: `A record with this ${field} already exists`,
          errors: [`Duplicate ${field}`],
        },
        { status: 409 }
      );
    }

    // Mongoose Cast Error (e.g., invalid ObjectId)
    if (error.name === "CastError") {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid ${error.path}: ${error.value}`,
          errors: [`Invalid data format for ${error.path}`],
        },
        { status: 400 }
      );
    }

    // Connection Error
    if (error.name === "MongoNetworkError" || error.name === "MongooseServerSelectionError") {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection error. Please try again later.",
        },
        { status: 503 }
      );
    }

    // Generic Server Error
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve planned events (bonus - useful for tracking page)
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    // If specific event ID is provided
    if (eventId) {
      const event = await PlannedEvent.findById(eventId).lean();
      if (!event) {
        return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, event }, { status: 200 });
    }

    return NextResponse.json(
      {
        success: true,
        count: events.length,
        events: events,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ GET_EVENTS_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch events",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
