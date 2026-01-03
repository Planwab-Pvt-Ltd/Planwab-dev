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

const SUBCATEGORY_MAPPINGS = {
  // Venues
  "banquet-halls": { venueType: /banquet.*hall/i },
  farmhouses: { venueType: /farm/i },
  hotels: { venueType: /hotel/i },
  resorts: { venueType: /resort/i },
  lawns: { venueType: /lawn|garden/i },
  destination: { venueType: /destination/i },
  beach: { venueType: /beach/i },
  palace: { venueType: /palace|heritage/i },

  // Photographers
  "wedding-photography": { services: /wedding.*photo/i },
  "pre-wedding": { services: /pre.*wedding/i },
  candid: { services: /candid/i },
  traditional: { services: /traditional/i },
  videography: { services: /videography|video/i },
  drone: { $or: [{ droneAvailable: true }, { services: /drone/i }] },
  album: { services: /album/i },
  photobooth: { services: /photo.*booth/i },

  // Makeup
  "bridal-makeup": { services: /bridal.*makeup/i },
  "party-makeup": { services: /party.*makeup/i },
  airbrush: { services: /airbrush/i },
  "hd-makeup": { services: /hd.*makeup/i },
  engagement: { services: /engagement/i },
  reception: { services: /reception/i },
  "hair-styling": { services: /hair.*styling/i },
  draping: { services: /draping|saree/i },

  // Planners
  "full-planning": { specializations: /full.*planning/i },
  "partial-planning": { specializations: /partial/i },
  "day-coordination": { specializations: /day.*coordination/i },
  "destination-planning": { $or: [{ destinationWeddings: true }, { specializations: /destination/i }] },
  "budget-planning": { specializations: /budget/i },
  "vendor-management": { specializations: /vendor.*management/i },
  "guest-management": { specializations: /guest.*management/i },
  "theme-design": { specializations: /theme.*design/i },

  // Catering
  vegetarian: { menuTypes: /vegetarian|veg/i },
  "non-vegetarian": { menuTypes: /non.*veg/i },
  "multi-cuisine": { cuisines: /multi/i },
  "south-indian": { cuisines: /south.*indian/i },
  "north-indian": { cuisines: /north.*indian/i },
  chinese: { cuisines: /chinese|oriental/i },
  continental: { cuisines: /continental/i },
  "live-counters": { liveCounters: true },

  // Clothes
  "bridal-lehenga": { outfitTypes: /bridal.*lehenga/i },
  "groom-sherwani": { outfitTypes: /sherwani|groom/i },
  "designer-wear": { outfitTypes: /designer/i },
  rental: { rentalAvailable: true },
  accessories: { outfitTypes: /accessories/i },
  jewelry: { outfitTypes: /jewelry|jewellery/i },
  footwear: { outfitTypes: /footwear|shoe/i },
  trousseau: { outfitTypes: /trousseau/i },

  // Mehendi
  "bridal-mehendi": { designs: /bridal/i },
  arabic: { designs: /arabic/i },
  rajasthani: { designs: /rajasthani/i },
  portrait: { designs: /portrait/i },
  minimal: { designs: /minimal/i },
  glitter: { designs: /glitter/i },
  "white-henna": { designs: /white.*henna/i },
  "nail-art": { designs: /nail.*art/i },

  // DJs
  "wedding-dj": { genres: /wedding/i },
  "sangeet-dj": { genres: /sangeet/i },
  cocktail: { genres: /cocktail/i },
  "live-band": { genres: /live.*band/i },
  dhol: { genres: /dhol/i },
  "sound-system": { equipmentProvided: true },
  lighting: { lightingIncluded: true },
  anchoring: { emceeServices: true },
};

// =============================================================================
// SORT MAPPING - Maps frontend sort IDs to MongoDB sort objects
// =============================================================================
const SORT_MAPPINGS = {
  rating: { rating: -1, reviewCount: -1 },
  "price-asc": { basePrice: 1, "perDayPrice.min": 1 },
  "price-desc": { basePrice: -1, "perDayPrice.min": -1 },
  bookings: { bookings: -1, rating: -1 },
  newest: { createdAt: -1 },
  reviews: { reviewCount: -1, rating: -1 },
  createdAt: { createdAt: -1 },
  popular: { isFeatured: -1, rating: -1, bookings: -1 },
};

// =============================================================================
// GET - Fetch vendors with advanced filtering, search, and pagination
// =============================================================================
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    // =============================================================================
    // EXTRACT QUERY PARAMETERS
    // =============================================================================
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const vendorId = searchParams.get("id");

    // Filter parameters
    const category = searchParams.get("category");
    const categories = searchParams.get("categories");
    const subcategory = searchParams.get("subcategory");
    const availability = searchParams.get("availability");
    const featured = searchParams.get("featured");
    const minRating = searchParams.get("minRating");
    const cities = searchParams.get("cities");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");

    // Sort parameters
    const sortBy = searchParams.get("sortBy") || "rating";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // =============================================================================
    // HANDLE SINGLE VENDOR REQUEST
    // =============================================================================
    if (vendorId) {
      const vendor = await Vendor.findById(vendorId).lean();
      if (!vendor) {
        return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: vendor });
    }

    // =============================================================================
    // BUILD QUERY OBJECT
    // =============================================================================
    const query = {};
    const andConditions = [];

    // ---------------------------------------------------------------------------
    // 1. CATEGORY FILTERING
    // ---------------------------------------------------------------------------
    if (categories) {
      const categoryArray = categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      if (categoryArray.length === 1) {
        query.category = categoryArray[0];
      } else if (categoryArray.length > 1) {
        query.category = { $in: categoryArray };
      }
    } else if (category && category !== "all") {
      query.category = category;
    }

    // ---------------------------------------------------------------------------
    // 2. SUBCATEGORY FILTERING
    // ---------------------------------------------------------------------------
    if (subcategory && subcategory !== "" && SUBCATEGORY_MAPPINGS[subcategory]) {
      const subcategoryQuery = SUBCATEGORY_MAPPINGS[subcategory];
      andConditions.push(subcategoryQuery);
    }

    // ---------------------------------------------------------------------------
    // 3. AVAILABILITY STATUS
    // ---------------------------------------------------------------------------
    if (availability && availability !== "all") {
      query.availabilityStatus = availability;
    }

    // ---------------------------------------------------------------------------
    // 4. FEATURED VENDORS
    // ---------------------------------------------------------------------------
    if (featured === "true") {
      query.isFeatured = true;
    }

    // ---------------------------------------------------------------------------
    // 5. MINIMUM RATING FILTER
    // ---------------------------------------------------------------------------
    if (minRating && !isNaN(parseFloat(minRating))) {
      const ratingValue = parseFloat(minRating);
      if (ratingValue > 0) {
        query.rating = { $gte: ratingValue };
      }
    }

    // ---------------------------------------------------------------------------
    // 6. CITY/LOCATION FILTERING
    // ---------------------------------------------------------------------------
    if (cities) {
      const cityArray = cities
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      if (cityArray.length === 1) {
        query["address.city"] = new RegExp(cityArray[0], "i");
      } else if (cityArray.length > 1) {
        query["address.city"] = { $in: cityArray.map((c) => new RegExp(c, "i")) };
      }
    }

    // ---------------------------------------------------------------------------
    // 7. PRICE RANGE FILTERING
    // ---------------------------------------------------------------------------
    if (minPrice || maxPrice) {
      const priceConditions = [];

      if (minPrice && !isNaN(parseInt(minPrice))) {
        const minPriceValue = parseInt(minPrice);
        priceConditions.push({
          $or: [{ basePrice: { $gte: minPriceValue } }, { "perDayPrice.min": { $gte: minPriceValue } }],
        });
      }

      if (maxPrice && !isNaN(parseInt(maxPrice))) {
        const maxPriceValue = parseInt(maxPrice);
        priceConditions.push({
          $or: [{ basePrice: { $lte: maxPriceValue } }, { "perDayPrice.min": { $lte: maxPriceValue } }],
        });
      }

      if (priceConditions.length > 0) {
        andConditions.push(...priceConditions);
      }
    }

    // ---------------------------------------------------------------------------
    // 8. SEARCH QUERY (Full-text search across multiple fields)
    // ---------------------------------------------------------------------------
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      const searchConditions = [
        { name: searchRegex },
        { email: searchRegex },
        { username: searchRegex },
        { "address.city": searchRegex },
        { "address.state": searchRegex },
        { "address.street": searchRegex },
        { tags: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { amenities: searchRegex },
        { facilities: searchRegex },
        { eventTypes: searchRegex },
      ];

      andConditions.push({ $or: searchConditions });
    }

    // ---------------------------------------------------------------------------
    // 9. COMBINE ALL CONDITIONS
    // ---------------------------------------------------------------------------
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    // =============================================================================
    // BUILD SORT OBJECT
    // =============================================================================
    let sort = {};

    if (SORT_MAPPINGS[sortBy]) {
      // Use predefined sort mapping
      sort = { ...SORT_MAPPINGS[sortBy] };

      // Apply sortOrder to the primary sort field only if it's not a compound sort
      if (sortOrder === "asc" && Object.keys(sort).length === 1) {
        const primaryField = Object.keys(sort)[0];
        sort[primaryField] = 1;
      }
    } else {
      // Fallback: sort by the field name with given order
      sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }

    // Always add _id as secondary sort for consistency
    if (!sort._id) {
      sort._id = -1;
    }

    // =============================================================================
    // PAGINATION CALCULATION
    // =============================================================================
    const skip = (page - 1) * limit;

    // =============================================================================
    // DEBUG LOGGING (Remove in production)
    // =============================================================================
    console.log("=== VENDOR API DEBUG ===");
    console.log("Request URL:", request.url);
    console.log("Query Parameters:", {
      page,
      limit,
      category,
      categories,
      subcategory,
      featured,
      cities,
      minPrice,
      maxPrice,
      minRating,
      search,
      sortBy,
      availability,
    });
    console.log("MongoDB Query:", JSON.stringify(query, null, 2));
    console.log("MongoDB Sort:", JSON.stringify(sort, null, 2));
    console.log("Pagination:", { skip, limit });
    console.log("=======================");

    // =============================================================================
    // EXECUTE QUERY WITH PAGINATION
    // =============================================================================
    const [vendors, total, availableCities] = await Promise.all([
      Vendor.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("-reviewsList -likedBy -bookmarkedBy") // Exclude large arrays
        .collation({ locale: "en", strength: 2 }) // Case-insensitive sorting for text fields
        .lean()
        .exec(),

      Vendor.countDocuments(query).exec(),

      // Get available cities based on current filters (excluding city filter itself)
      Vendor.distinct("address.city", {
        ...query,
        "address.city": undefined, // Remove city filter to get all available cities
      }).exec(),
    ]);

    const processedVendors = vendors.map((vendor) => ({
      ...vendor,
      bookings: vendor.bookings || vendor.totalBookings || 0,
      reviews: vendor.reviews || vendor.reviewCount || vendor.totalReviews || 0,
      rating: vendor.rating || vendor.averageRating || 0,
    }));

    console.log(`Query returned ${processedVendors.length} vendors out of ${total} total`);

    // =============================================================================
    // CALCULATE PAGINATION METADATA
    // =============================================================================
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // =============================================================================
    // PREPARE RESPONSE
    // =============================================================================
    console.log(`Query returned ${vendors.length} vendors out of ${total} total`);

    console.log("=== VENDOR API DEBUG ===");
    console.log("Request URL:", request.url);
    console.log("Query Parameters:", {
      page,
      limit,
      category,
      categories,
      subcategory,
      featured,
      cities,
      minPrice,
      maxPrice,
      minRating,
      search,
      sortBy,
      sortOrder, // **ADD THIS**
      availability,
    });
    console.log("MongoDB Query:", JSON.stringify(query, null, 2));
    console.log("MongoDB Sort:", JSON.stringify(sort, null, 2)); // **ENSURE THIS EXISTS**
    console.log("Sort Mapping Used:", sortBy, "->", SORT_MAPPINGS[sortBy] ? "Custom" : "Dynamic"); // **ADD THIS**
    console.log("Pagination:", { skip, limit });
    console.log("=======================");

    return NextResponse.json({
      success: true,
      data: processedVendors,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
        currentPage: page,
        resultsOnPage: processedVendors.length,
      },
      filters: {
        availableCities: availableCities.filter(Boolean).sort(),
        appliedFilters: {
          category: categories || category,
          subcategory,
          featured: featured === "true",
          cities: cities ? cities.split(",") : [],
          priceRange: {
            min: minPrice ? parseInt(minPrice) : 0,
            max: maxPrice ? parseInt(maxPrice) : null,
          },
          minRating: minRating ? parseFloat(minRating) : 0,
          search: search || null,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        queryExecutionTime: Date.now(),
        sortApplied: {
          // **ADD THIS**
          sortBy,
          sortOrder,
          sortMapping: SORT_MAPPINGS[sortBy] ? "predefined" : "dynamic",
        },
      },
    });
  } catch (error) {
    console.error("=== VENDOR API ERROR ===");
    console.error("Error details:", error);
    console.error("Stack trace:", error.stack);
    console.error("=======================");

    // Handle specific error types
    if (error.name === "CastError") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid parameter format",
          error: error.message,
        },
        { status: 400 }
      );
    }

    if (error.name === "MongooseError" || error.name === "MongoError") {
      return NextResponse.json(
        {
          success: false,
          message: "Database error occurred",
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch vendors",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      },
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
