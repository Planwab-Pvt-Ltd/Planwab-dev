import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../database/mongoose";
import Vendor from "../../../database/models/VendorModel";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    // =================================================================
    // PAGINATION PARAMETERS
    // =================================================================
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const skip = (page - 1) * limit;

    // =================================================================
    // FILTER PARAMETERS
    // =================================================================
    const sortBy = searchParams.get("sortBy") || "rating";
    const searchQuery = searchParams.get("search")?.trim();
    const categoriesParam = searchParams.get("categories");
    const minPrice = parseFloat(searchParams.get("minPrice"));
    const maxPrice = parseFloat(searchParams.get("maxPrice"));
    const isFeatured = searchParams.get("featured") === "true";
    const citiesParam = searchParams.get("cities");
    const minRating = parseFloat(searchParams.get("minRating"));
    const guestCapacity = parseInt(searchParams.get("guestCapacity"));
    const amenitiesParam = searchParams.get("amenities");
    const isVerified = searchParams.get("verified") === "true";
    const hasDiscount = searchParams.get("hasDiscount") === "true";

    // Parse comma-separated values
    const categories = categoriesParam
      ? categoriesParam
          .split(",")
          .map((c) => c.trim().toLowerCase())
          .filter(Boolean)
      : [];
    const cities = citiesParam
      ? citiesParam
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];
    const amenities = amenitiesParam
      ? amenitiesParam
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      : [];

    // =================================================================
    // BUILD QUERY OBJECT
    // =================================================================
    let query = {};
    let andConditions = [];

    // -------------------------------------------------------------
    // SEARCH QUERY - Full text search across multiple fields
    // -------------------------------------------------------------
    if (searchQuery && searchQuery.length > 0) {
      const searchRegex = new RegExp(searchQuery, "i");
      andConditions.push({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { "address.city": searchRegex },
          { "address.state": searchRegex },
          { "address.area": searchRegex },
          { "address.landmark": searchRegex },
          { tags: { $in: [searchRegex] } },
          { availableAreas: { $in: [searchRegex] } },
          { category: searchRegex },
          { specializations: { $in: [searchRegex] } },
          { services: { $elemMatch: { name: searchRegex } } },
        ],
      });
    }

    // -------------------------------------------------------------
    // CATEGORY FILTER
    // -------------------------------------------------------------
    if (categories.length > 0) {
      const categoryRegexes = categories.map((cat) => new RegExp(`^${cat}$`, "i"));
      andConditions.push({
        $or: categoryRegexes.map((regex) => ({ category: regex })),
      });
    }

    // -------------------------------------------------------------
    // FEATURED/POPULAR FILTER
    // -------------------------------------------------------------
    if (isFeatured) {
      andConditions.push({
        $or: [
          { tags: { $in: ["Popular", "Featured", "Top Rated", "Trending"] } },
          { isFeatured: true },
          { rating: { $gte: 4.5 } },
        ],
      });
    }

    // -------------------------------------------------------------
    // VERIFIED FILTER
    // -------------------------------------------------------------
    if (isVerified) {
      andConditions.push({
        $or: [{ tags: { $in: ["Verified"] } }, { isVerified: true }],
      });
    }

    // -------------------------------------------------------------
    // CITY FILTER
    // -------------------------------------------------------------
    if (cities.length > 0) {
      const cityRegexes = cities.map((city) => new RegExp(city, "i"));
      andConditions.push({
        $or: [
          { "address.city": { $in: cityRegexes } },
          { availableAreas: { $in: cityRegexes } },
          { serviceAreas: { $in: cityRegexes } },
        ],
      });
    }

    // -------------------------------------------------------------
    // PRICE FILTER - Handles different price fields based on category
    // -------------------------------------------------------------
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      const priceConditions = [];

      const priceRange = {};
      if (!isNaN(minPrice) && minPrice > 0) {
        priceRange.$gte = minPrice;
      }
      if (!isNaN(maxPrice) && maxPrice < 10000000) {
        priceRange.$lte = maxPrice;
      }

      if (Object.keys(priceRange).length > 0) {
        priceConditions.push({ "perDayPrice.min": priceRange });
        priceConditions.push({ "perDayPrice.max": priceRange });
        priceConditions.push({ basePrice: priceRange });
        priceConditions.push({ "price.min": priceRange });
        priceConditions.push({ "price.max": priceRange });
        priceConditions.push({ startingPrice: priceRange });
        priceConditions.push({ pricePerDay: priceRange });
        priceConditions.push({ pricePerEvent: priceRange });

        andConditions.push({ $or: priceConditions });
      }
    }

    // -------------------------------------------------------------
    // RATING FILTER
    // -------------------------------------------------------------
    if (!isNaN(minRating) && minRating > 0) {
      andConditions.push({
        $or: [{ rating: { $gte: minRating } }, { averageRating: { $gte: minRating } }],
      });
    }

    // -------------------------------------------------------------
    // GUEST CAPACITY FILTER (for venues)
    // -------------------------------------------------------------
    if (!isNaN(guestCapacity) && guestCapacity > 0) {
      andConditions.push({
        $or: [
          {
            $and: [{ "seating.min": { $lte: guestCapacity } }, { "seating.max": { $gte: guestCapacity } }],
          },
          { capacity: { $gte: guestCapacity } },
          { maxCapacity: { $gte: guestCapacity } },
          { guestCapacity: { $gte: guestCapacity } },
        ],
      });
    }

    // -------------------------------------------------------------
    // AMENITIES FILTER
    // -------------------------------------------------------------
    if (amenities.length > 0) {
      const amenityRegexes = amenities.map((a) => new RegExp(a, "i"));
      andConditions.push({
        $or: [
          { amenities: { $all: amenityRegexes } },
          { facilities: { $all: amenityRegexes } },
          { features: { $all: amenityRegexes } },
        ],
      });
    }

    // -------------------------------------------------------------
    // DISCOUNT FILTER
    // -------------------------------------------------------------
    if (hasDiscount) {
      andConditions.push({
        $or: [{ discount: { $gt: 0 } }, { hasOffer: true }, { "offers.0": { $exists: true } }],
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    // =================================================================
    // BUILD SORT OPTIONS
    // =================================================================
    let sortOptions = {};

    switch (sortBy) {
      case "price-asc":
        // Sort by lowest price first
        sortOptions = {
          "perDayPrice.min": 1,
          basePrice: 1,
          "price.min": 1,
          startingPrice: 1,
        };
        break;

      case "price-desc":
        sortOptions = {
          "perDayPrice.min": -1,
          basePrice: -1,
          "price.min": -1,
          startingPrice: -1,
        };
        break;

      case "bookings":
        sortOptions = {
          bookings: -1,
          totalBookings: -1,
          rating: -1,
        };
        break;

      case "newest":
        sortOptions = {
          createdAt: -1,
          _id: -1,
        };
        break;

      case "reviews":
        sortOptions = {
          reviews: -1,
          totalReviews: -1,
          reviewCount: -1,
          rating: -1,
        };
        break;

      case "popularity":
        sortOptions = {
          popularityScore: -1,
          bookings: -1,
          views: -1,
          rating: -1,
        };
        break;

      case "rating":
      default:
        sortOptions = {
          rating: -1,
          averageRating: -1,
          reviews: -1,
        };
        break;
    }

    // =================================================================
    // EXECUTE DATABASE QUERIES
    // =================================================================

    const vendors = await Vendor.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select({
        name: 1,
        category: 1,
        description: 1,
        images: 1,
        defaultImage: 1,
        coverImage: 1,
        rating: 1,
        averageRating: 1,
        reviews: 1,
        totalReviews: 1,
        reviewCount: 1,
        bookings: 1,
        totalBookings: 1,
        address: 1,
        perDayPrice: 1,
        basePrice: 1,
        price: 1,
        startingPrice: 1,
        originalPrice: 1,
        discount: 1,
        tags: 1,
        seating: 1,
        capacity: 1,
        amenities: 1,
        facilities: 1,
        phone: 1,
        email: 1,
        website: 1,
        responseTime: 1,
        isVerified: 1,
        isFeatured: 1,
        availableAreas: 1,
        serviceAreas: 1,
        specializations: 1,
        experience: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .lean();

    const totalVendors = await Vendor.countDocuments(query);
    const totalPages = Math.ceil(totalVendors / limit);

    // =================================================================
    // GET AGGREGATED DATA FOR FILTERS
    // =================================================================

    // Get available cities for filter options
    const citiesAggregation = await Vendor.aggregate([
      { $match: categories.length > 0 ? { category: { $in: categories.map((c) => new RegExp(`^${c}$`, "i")) } } : {} },
      { $group: { _id: "$address.city" } },
      { $match: { _id: { $ne: null, $ne: "" } } },
      { $sort: { _id: 1 } },
      { $limit: 50 },
    ]);
    const availableCities = citiesAggregation.map((c) => c._id).filter(Boolean);

    // Get price range for filter options
    const priceAggregation = await Vendor.aggregate([
      { $match: categories.length > 0 ? { category: { $in: categories.map((c) => new RegExp(`^${c}$`, "i")) } } : {} },
      {
        $group: {
          _id: null,
          minPrice: {
            $min: {
              $ifNull: ["$perDayPrice.min", { $ifNull: ["$basePrice", { $ifNull: ["$price.min", "$startingPrice"] }] }],
            },
          },
          maxPrice: {
            $max: {
              $ifNull: ["$perDayPrice.max", { $ifNull: ["$basePrice", { $ifNull: ["$price.max", "$startingPrice"] }] }],
            },
          },
        },
      },
    ]);
    const priceRange = priceAggregation[0] || { minPrice: 0, maxPrice: 1000000 };

    // Get available categories
    const categoriesAggregation = await Vendor.aggregate([
      { $group: { _id: "$category" } },
      { $match: { _id: { $ne: null, $ne: "" } } },
      { $sort: { _id: 1 } },
    ]);
    const availableCategories = categoriesAggregation.map((c) => c._id).filter(Boolean);

    // =================================================================
    // PROCESS AND NORMALIZE VENDOR DATA
    // =================================================================
    const processedVendors = vendors.map((vendor) => {
      // Normalize price field
      const price = vendor.perDayPrice?.min || vendor.basePrice || vendor.price?.min || vendor.startingPrice || 0;

      // Normalize images
      const images =
        vendor.images?.filter(Boolean) ||
        (vendor.defaultImage ? [vendor.defaultImage] : []) ||
        (vendor.coverImage ? [vendor.coverImage] : []);

      // Normalize rating
      const rating = vendor.rating || vendor.averageRating || 0;

      // Normalize reviews count
      const reviewCount = vendor.reviews || vendor.totalReviews || vendor.reviewCount || 0;

      // Normalize bookings count
      const bookingsCount = vendor.bookings || vendor.totalBookings || 0;

      // Normalize capacity
      const capacity = vendor.seating?.max || vendor.capacity || vendor.maxCapacity || null;

      return {
        ...vendor,
        // Normalized fields
        normalizedPrice: price,
        normalizedRating: rating,
        normalizedReviews: reviewCount,
        normalizedBookings: bookingsCount,
        normalizedCapacity: capacity,
        normalizedImages: images,
        // Ensure these fields exist
        images: images.length > 0 ? images : ["/placeholder-vendor.jpg"],
        rating: rating,
        reviews: reviewCount,
        bookings: bookingsCount,
        // Add computed fields
        priceDisplay: price > 0 ? `₹${price.toLocaleString("en-IN")}` : "Contact for price",
        hasMultipleImages: images.length > 1,
        isPopular: vendor.tags?.includes("Popular") || bookingsCount > 50,
        isNew: vendor.createdAt && Date.now() - new Date(vendor.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000,
        isVerified: vendor.isVerified || vendor.tags?.includes("Verified"),
      };
    });

    // =================================================================
    // RETURN RESPONSE
    // =================================================================
    return NextResponse.json(
      {
        success: true,
        message: "Vendors fetched successfully",
        data: processedVendors,
        pagination: {
          totalVendors,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filters: {
          availableCities,
          availableCategories,
          priceRange: {
            min: priceRange.minPrice || 0,
            max: priceRange.maxPrice || 1000000,
          },
        },
        appliedFilters: {
          search: searchQuery || null,
          categories: categories.length > 0 ? categories : null,
          cities: cities.length > 0 ? cities : null,
          priceRange: !isNaN(minPrice) || !isNaN(maxPrice) ? { min: minPrice, max: maxPrice } : null,
          minRating: !isNaN(minRating) ? minRating : null,
          featured: isFeatured || null,
          sortBy,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching vendors:", error);

    // Return detailed error in development
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `Error: ${error.message}`
        : "An unexpected error occurred while fetching vendors.";

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        data: [],
        pagination: {
          totalVendors: 0,
          totalPages: 0,
          currentPage: 1,
          itemsPerPage: 12,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/vendor
 * Create a new vendor (if needed)
 */
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "category"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            message: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    const vendor = new Vendor(body);
    await vendor.save();

    return NextResponse.json(
      {
        success: true,
        message: "Vendor created successfully",
        data: vendor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create vendor",
      },
      { status: 500 }
    );
  }
}
