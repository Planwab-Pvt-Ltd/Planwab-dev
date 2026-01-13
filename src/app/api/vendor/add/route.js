// app/api/vendor/add/route.js

import { NextResponse } from "next/server";
import {
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
  DholVendor, // New
  DecorVendor, // New
  BaratVendor, // New
  FireworkVendor, // New
  StageEntryVendor,
  AnchorVendor,
} from "../../../../database/models/VendorModel";
import { connectToDatabase } from "../../../../database/mongoose";

// Category to Model mapping
const categoryModelMap = {
  venues: VenueVendor,
  photographers: PhotographerVendor,
  makeup: MakeupVendor,
  planners: PlannerVendor,
  catering: CatererVendor,
  clothes: ClothesVendor,
  mehendi: MehendiVendor,
  cakes: CakeVendor,
  jewellery: JewelleryVendor,
  invitations: InvitationVendor,
  djs: DjVendor,
  hairstyling: HairstylingVendor,
  dhol: DholVendor,
  decor: DecorVendor,
  barat: BaratVendor,
  fireworks: FireworkVendor,
  stageEntry: StageEntryVendor,
  anchor: AnchorVendor,
  other: OtherVendor,
};

// Helper function to clean and validate data
const cleanVendorData = (data) => {
  const cleaned = { ...data };

  // Remove empty strings from nested objects
  const cleanObject = (obj) => {
    if (!obj || typeof obj !== "object") return obj;

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === "" || value === null || value === undefined) continue;
      if (Array.isArray(value)) {
        const cleanedArray = value.filter((item) => {
          if (typeof item === "string") return item.trim() !== "";
          if (typeof item === "object") {
            const cleanedItem = cleanObject(item);
            return Object.keys(cleanedItem).length > 0;
          }
          return true;
        });
        if (cleanedArray.length > 0) result[key] = cleanedArray;
      } else if (typeof value === "object") {
        const cleanedObj = cleanObject(value);
        if (Object.keys(cleanedObj).length > 0) result[key] = cleanedObj;
      } else {
        result[key] = value;
      }
    }
    return result;
  };

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
      features: pkg.features?.filter((f) => f.trim() !== "") || [],
      notIncluded: pkg.notIncluded?.filter((f) => f.trim() !== "") || [],
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
    cleaned.landmarks = cleaned.landmarks.filter((lm) => lm.name && lm.distance);
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
        details: policy.details?.filter((d) => d.trim() !== "") || [],
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

  // Clean other numeric category fields
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

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { category, ...restData } = body;

    if (restData.vendorProfile) {
      // Convert array to object if needed
      if (Array.isArray(restData.vendorProfile)) {
        restData.vendorProfile = restData.vendorProfile[0] || undefined;
      }

      // Remove if empty object
      if (
        restData.vendorProfile &&
        typeof restData.vendorProfile === "object" &&
        Object.keys(restData.vendorProfile).length === 0
      ) {
        restData.vendorProfile = undefined;
      }

      // Remove if all values are empty
      if (restData.vendorProfile && typeof restData.vendorProfile === "object") {
        const hasActualData = Object.values(restData.vendorProfile).some(
          (value) =>
            value !== null && value !== undefined && value !== "" && (Array.isArray(value) ? value.length > 0 : true)
        );

        if (!hasActualData) {
          restData.vendorProfile = undefined;
        }
      }
    }

    // Validate category
    if (!category || !categoryModelMap[category]) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid vendor category provided.",
          validCategories: Object.keys(categoryModelMap),
        },
        { status: 400 }
      );
    }

    // Clean and validate data
    const vendorData = cleanVendorData({
      ...restData,
      category,
    });

    // Get the appropriate model
    const VendorModel = categoryModelMap[category];

    // Create new vendor
    const newVendor = new VendorModel(vendorData);

    // Save to database
    await newVendor.save();

    return NextResponse.json(
      {
        success: true,
        message: "Vendor registered successfully!",
        vendor: {
          id: newVendor._id,
          name: newVendor.name,
          username: newVendor.username,
          category: newVendor.category,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating vendor:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return NextResponse.json(
        {
          success: false,
          message: "Validation Error",
          errors,
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return NextResponse.json(
        {
          success: false,
          message: `A vendor with this ${field} (${value}) already exists.`,
          field,
        },
        { status: 409 }
      );
    }

    // Handle cast errors (invalid ObjectId, etc.)
    if (error.name === "CastError") {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid value for field: ${error.path}`,
          field: error.path,
        },
        { status: 400 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred on the server.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch vendors (optional, for testing)
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    const query = category && categoryModelMap[category] ? { category } : {};

    const vendors = await (categoryModelMap[category] || VenueVendor)
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .select(
        "name username category rating reviewCount basePrice address.city images defaultImage isVerified isFeatured"
      );

    const total = await (categoryModelMap[category] || VenueVendor).countDocuments(query);

    return NextResponse.json({
      success: true,
      vendors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch vendors",
      },
      { status: 500 }
    );
  }
}
