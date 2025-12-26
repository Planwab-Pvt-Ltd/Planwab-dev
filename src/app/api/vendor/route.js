// app/api/vendor/route.js

import { NextResponse } from "next/server";
import {
  Vendor,
  VenueVendor,
  CatererVendor,
  PhotographerVendor,
  MakeupVendor,
  PlannerVendor,
  ClothesVendor,
  MehendiVendor,
  CakeVendor,
  JewelleryVendor,
  InvitationVendor,
  DjVendor,
  HairstylingVendor,
  OtherVendor,
} from "@/database/models/VendorModel";
import { connectToDatabase } from "@/database/mongoose";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const cleanVendorData = (data) => {
  const cleaned = { ...data };

  // Clean perDayPrice
  if (cleaned.perDayPrice) {
    if (!cleaned.perDayPrice.min && !cleaned.perDayPrice.max) {
      delete cleaned.perDayPrice;
    } else {
      if (cleaned.perDayPrice.min) cleaned.perDayPrice.min = Number(cleaned.perDayPrice.min);
      if (cleaned.perDayPrice.max) cleaned.perDayPrice.max = Number(cleaned.perDayPrice.max);
    }
  }

  // Ensure basePrice is a number
  if (cleaned.basePrice) {
    cleaned.basePrice = Number(cleaned.basePrice);
  }

  // Clean packages
  if (cleaned.packages && cleaned.packages.length > 0) {
    cleaned.packages = cleaned.packages.map((pkg) => ({
      ...pkg,
      price: Number(pkg.price) || 0,
      originalPrice: pkg.originalPrice ? Number(pkg.originalPrice) : undefined,
      savingsPercentage: pkg.savingsPercentage ? Number(pkg.savingsPercentage) : 0,
      features: pkg.features?.filter((f) => f && f.trim() !== "") || [],
      notIncluded: pkg.notIncluded?.filter((f) => f && f.trim() !== "") || [],
    }));
  }

  // Clean stats
  if (cleaned.stats && cleaned.stats.length > 0) {
    cleaned.stats = cleaned.stats.filter((stat) => stat.label && stat.value);
  }

  // Clean highlights
  if (cleaned.highlights && cleaned.highlights.length > 0) {
    cleaned.highlights = cleaned.highlights.filter((h) => h.label && h.value);
  }

  // Clean operating hours
  if (cleaned.operatingHours && cleaned.operatingHours.length > 0) {
    cleaned.operatingHours = cleaned.operatingHours.filter((oh) => oh.day && oh.hours);
  }

  // Clean landmarks
  if (cleaned.landmarks && cleaned.landmarks.length > 0) {
    cleaned.landmarks = cleaned.landmarks.filter((lm) => lm.name);
  }

  // Clean directions
  if (cleaned.directions && cleaned.directions.length > 0) {
    cleaned.directions = cleaned.directions.filter((dir) => dir.type && dir.description);
  }

  // Clean policies
  if (cleaned.policies && cleaned.policies.length > 0) {
    cleaned.policies = cleaned.policies
      .filter((policy) => policy.title)
      .map((policy) => ({
        ...policy,
        details: policy.details?.filter((d) => d && d.trim() !== "") || [],
      }));
  }

  // Clean FAQs
  if (cleaned.faqs && cleaned.faqs.length > 0) {
    cleaned.faqs = cleaned.faqs.filter((faq) => faq.question && faq.answer);
  }

  // Clean awards
  if (cleaned.awards && cleaned.awards.length > 0) {
    cleaned.awards = cleaned.awards.filter((award) => award.title);
  }

  // Clean special offers
  if (cleaned.specialOffers && cleaned.specialOffers.length > 0) {
    cleaned.specialOffers = cleaned.specialOffers.filter((offer) => offer.title);
  }

  // Clean empty arrays
  const arrayFields = [
    "tags",
    "amenities",
    "facilities",
    "highlightPoints",
    "eventTypes",
    "paymentMethods",
    "metaKeywords",
    "images",
    "gallery",
  ];

  arrayFields.forEach((field) => {
    if (cleaned[field] && Array.isArray(cleaned[field])) {
      cleaned[field] = cleaned[field].filter((item) => {
        if (typeof item === "string") return item.trim() !== "";
        return true;
      });
    }
  });

  // Ensure numeric fields are numbers
  const numericFields = ["rating", "reviewCount", "reviews", "bookings", "yearsExperience"];
  numericFields.forEach((field) => {
    if (cleaned[field] !== undefined) {
      cleaned[field] = Number(cleaned[field]) || 0;
    }
  });

  // Clean category-specific nested numeric fields
  if (cleaned.seating) {
    if (cleaned.seating.min) cleaned.seating.min = Number(cleaned.seating.min);
    if (cleaned.seating.max) cleaned.seating.max = Number(cleaned.seating.max);
  }

  if (cleaned.floating) {
    if (cleaned.floating.min) cleaned.floating.min = Number(cleaned.floating.min);
    if (cleaned.floating.max) cleaned.floating.max = Number(cleaned.floating.max);
  }

  if (cleaned.rooms) {
    if (cleaned.rooms.count) cleaned.rooms.count = Number(cleaned.rooms.count);
    if (cleaned.rooms.max) cleaned.rooms.max = Number(cleaned.rooms.max);
  }

  if (cleaned.parking) {
    if (cleaned.parking.capacity) cleaned.parking.capacity = Number(cleaned.parking.capacity);
  }

  if (cleaned.pricePerPlate) {
    if (cleaned.pricePerPlate.veg) cleaned.pricePerPlate.veg = Number(cleaned.pricePerPlate.veg);
    if (cleaned.pricePerPlate.nonVeg) cleaned.pricePerPlate.nonVeg = Number(cleaned.pricePerPlate.nonVeg);
  }

  if (cleaned.trialPolicy) {
    if (cleaned.trialPolicy.price) cleaned.trialPolicy.price = Number(cleaned.trialPolicy.price);
  }

  if (cleaned.budgetRange) {
    if (cleaned.budgetRange.min) cleaned.budgetRange.min = Number(cleaned.budgetRange.min);
    if (cleaned.budgetRange.max) cleaned.budgetRange.max = Number(cleaned.budgetRange.max);
  }

  const categoryNumericFields = [
    "halls",
    "deliveryTime",
    "teamSize",
    "minCapacity",
    "maxCapacity",
    "pricePerHand",
    "bridalPackagePrice",
    "pricePerKg",
    "minOrderWeight",
    "advanceBookingDays",
    "minOrderQuantity",
    "fittingSessions",
    "vendorNetwork",
  ];

  categoryNumericFields.forEach((field) => {
    if (cleaned[field] !== undefined && cleaned[field] !== "") {
      cleaned[field] = Number(cleaned[field]) || 0;
    }
  });

  return cleaned;
};

const verifyAdminPassword = (password) => {
  const adminPassword = process.env.ADMIN_VENDOR_PASSWORD || "admin@vendor123";
  return password === adminPassword;
};

// =============================================================================
// GET - Fetch all vendors with pagination, filters, and search
// =============================================================================

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const availability = searchParams.get("availability");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const vendorId = searchParams.get("id");

    // If specific vendor ID is provided, return that vendor
    if (vendorId) {
      const vendor = await Vendor.findById(vendorId).lean();
      if (!vendor) {
        return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: vendor });
    }

    // Build query
    const query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (availability && availability !== "all") {
      query.availabilityStatus = availability;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [vendors, total] = await Promise.all([
      Vendor.find(query).sort(sort).skip(skip).limit(limit).select("-reviewsList -likedBy -bookmarkedBy").lean(),
      Vendor.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: vendors,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch vendors", error: error.message },
      { status: 500 }
    );
  }
}

// =============================================================================
// PUT - Update vendor (requires admin password)
// =============================================================================

export async function PUT(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { id, password, ...updateData } = body;

    // Validate ID
    if (!id) {
      return NextResponse.json({ success: false, message: "Vendor ID is required" }, { status: 400 });
    }

    // Verify admin password
    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ success: false, message: "Invalid admin password" }, { status: 401 });
    }

    // Find existing vendor
    const existingVendor = await Vendor.findById(id);
    if (!existingVendor) {
      return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 });
    }

    // Clean and prepare update data
    const cleanedData = cleanVendorData(updateData);

    // Remove fields that shouldn't be updated
    delete cleanedData._id;
    delete cleanedData.createdAt;
    delete cleanedData.category; // Category cannot be changed
    delete cleanedData.__v;

    // Update vendor
    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      { $set: cleanedData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json({
      success: true,
      message: "Vendor updated successfully!",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error("Error updating vendor:", error);

    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return NextResponse.json({ success: false, message: "Validation Error", errors }, { status: 400 });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        { success: false, message: `A vendor with this ${field} already exists.` },
        { status: 409 }
      );
    }

    if (error.name === "CastError") {
      return NextResponse.json({ success: false, message: "Invalid vendor ID format" }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: "Failed to update vendor", error: error.message },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Delete vendor (requires admin password)
// =============================================================================

export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const password = searchParams.get("password");

    // Validate ID
    if (!id) {
      return NextResponse.json({ success: false, message: "Vendor ID is required" }, { status: 400 });
    }

    // Verify admin password
    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ success: false, message: "Invalid admin password" }, { status: 401 });
    }

    // Find and delete vendor
    const deletedVendor = await Vendor.findByIdAndDelete(id);

    if (!deletedVendor) {
      return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Vendor deleted successfully!",
      vendor: {
        id: deletedVendor._id,
        name: deletedVendor.name,
        username: deletedVendor.username,
      },
    });
  } catch (error) {
    console.error("Error deleting vendor:", error);

    if (error.name === "CastError") {
      return NextResponse.json({ success: false, message: "Invalid vendor ID format" }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: "Failed to delete vendor", error: error.message },
      { status: 500 }
    );
  }
}
