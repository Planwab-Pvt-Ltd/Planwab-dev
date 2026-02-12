import VendorProfile from "../models/VendorProfileModel";
import { connectToDatabase } from "../mongoose";
import Vendor from './../models/VendorModel';
import Review from './../models/VendorsReviewsModel';

const logAction = (actionName, details = "") => {
  console.log(`[ServerAction] ${new Date().toISOString()} | ${actionName} | ${details}`);
};

const logError = (actionName, error) => {
  console.error(`[ServerAction:ERROR] ${new Date().toISOString()} | ${actionName} |`, error);
};

const sanitize = (data) => JSON.parse(JSON.stringify(data));

export async function getMostBookedVendors() {
  try {
    logAction("getMostBookedVendors", "Start fetching...");
    await connectToDatabase();
    const vendors = await Vendor.find({ isFeatured: true }) // Adjust 'isFeatured' to your schema
      .sort({ rating: -1 })
      .limit(8)
      .lean();

    logAction("getMostBookedVendors", `Success. Found ${vendors.length} vendors.`);  
    return sanitize(vendors);
  } catch (error) {
    logError("getMostBookedVendors", error);
    return [];
  }
}

export async function getTopPlanners() {
  try {
    logAction("getTopPlanners", "Start fetching...");
    await connectToDatabase();
    const vendors = await Vendor.find({ category: "planners" })
      .sort({ rating: -1 })
      .limit(5)
      .lean();
    
    logAction("getTopPlanners", `Success. Found ${vendors.length} planners.`);
    return sanitize(vendors);
  } catch (error) {
    logError("getTopPlanners", error);
    return [];
  }
}

export async function getTrendingVendors() {
  try {
    logAction("getTrendingVendors", "Start fetching...");
    await connectToDatabase();
    const vendors = await Vendor.find({ isFeatured: true })
      .sort({ bookings: -1 })
      .limit(5)
      .lean();
    
    logAction("getTrendingVendors", `Success. Found ${vendors.length} trending vendors.`);
    return sanitize(vendors);
  } catch (error) {
    logError("getTrendingVendors", error);
    return [];
  }
}

// --- 2. Vendor Details & Profile Actions ---

export async function getVendorById(id) {
  try {
    logAction("getVendorById", `Start fetching vendor with ID: ${id}`);
    await connectToDatabase();
    const vendor = await Vendor.findById(id).lean();
    logAction("getVendorById", `Successfully fetched vendor with ID: ${id}`);
    return sanitize(vendor);
  } catch (error) {
    logError("getVendorById", error);
    return null;
  }
}

export async function getVendorProfile(id) {
  try {
    logAction("getVendorProfile", `Start fetching profile for vendor ID: ${id}`);
    await connectToDatabase();
    // Assuming profile is linked via vendorId, or is part of the Vendor doc
    const profile = await VendorProfile.findOne({ vendorId: id }).lean();
    logAction("getVendorProfile", `Successfully fetched profile for vendor ID: ${id}`);
    return sanitize(profile);
  } catch (error) {
    logError("getVendorProfile", error);
    return null;
  }
}

export async function getVendorProfileByUsername(username) {
  try {
    logAction("getVendorProfileByUsername", `Start fetching profile for vendor username: ${username}`);
    await connectToDatabase();
    // Assuming profile is linked via username, or is part of the Vendor doc
    const profile = await VendorProfile.findOne({ username }).lean();
    logAction("getVendorProfileByUsername", `Successfully fetched profile for vendor username: ${username}`);
    return sanitize(profile);
  } catch (error) {
    logError("getVendorProfileByUsername", error);
    return null;
  }
}

export async function getVendorReviews(id) {
  try {
    logAction("getVendorReviews", `Start fetching reviews for vendor ID: ${id}`);
    await connectToDatabase();
    const reviews = await Review.find({ vendorId: id }).lean();
    logAction("getVendorReviews", `Successfully fetched ${reviews.length} reviews for vendor ID: ${id}`);
    return { reviews: sanitize(reviews) };
  } catch (error) {
    logError("getVendorReviews", error);
    return { reviews: [] };
  }
}

export async function getRelatedVendors(id) {
  try {
    logAction("getRelatedVendors", `Start fetching related vendors for ID: ${id}`);
    await connectToDatabase();
    const currentVendor = await Vendor.findById(id).select('category location').lean();
    
    if (!currentVendor) return { similarVendors: [], recommendedVendors: [] };

    // Example logic: Same category = Similar
    const similar = await Vendor.find({
      category: currentVendor.category,
      _id: { $ne: id }
    }).limit(4).lean();

    // Example logic: Same location = Recommended
    const recommended = await Vendor.find({
      location: currentVendor.location,
      _id: { $ne: id }
    }).limit(4).lean();

    logAction("getRelatedVendors", `Successfully fetched related vendors for ID: ${id}`);
    return {
      similarVendors: sanitize(similar),
      recommendedVendors: sanitize(recommended)
    };
  } catch (error) {
    logError("getRelatedVendors", error);
    return { similarVendors: [], recommendedVendors: [] };
  }
}

// --- 3. Marketplace Data Fetching (MATCHES API ROUTE EXACTLY) ---

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

export async function getMarketplaceVendors(params = {}) {
  try {
    const {
      page = "1",
      limit = "12",
      search = "",
      category = "",
      categories = "",
      subcategory = "",
      sortBy = "rating",
      sortOrder = "desc",
      minPrice,
      maxPrice,
      cities = "",
      minRating,
      featured,
      availability,
    } = params;

    logAction("getMarketplaceVendors", `Fetching with params: ${JSON.stringify(params)}`);
    await connectToDatabase();

    // =============================================================================
    // BUILD QUERY OBJECT (EXACT MATCH TO API ROUTE)
    // =============================================================================
    const query = {};
    const andConditions = [];

    // ---------------------------------------------------------------------------
    // 1. CATEGORY FILTERING
    // ---------------------------------------------------------------------------
    if (categories && categories.trim()) {
      const categoryArray = categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      if (categoryArray.length === 1) {
        query.category = categoryArray[0];
      } else if (categoryArray.length > 1) {
        query.category = { $in: categoryArray };
      }
    } else if (category && category.trim() && category !== "all") {
      query.category = category.trim();
    }

    // ---------------------------------------------------------------------------
    // 2. SUBCATEGORY FILTERING
    // ---------------------------------------------------------------------------
    if (subcategory && subcategory.trim() && SUBCATEGORY_MAPPINGS[subcategory]) {
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
    if (cities && cities.trim()) {
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
    // 8. SEARCH QUERY
    // ---------------------------------------------------------------------------
    if (search && search.trim()) {
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
    // BUILD SORT OBJECT (EXACT MATCH TO API ROUTE)
    // =============================================================================
    let sort = {};

    if (SORT_MAPPINGS[sortBy]) {
      sort = { ...SORT_MAPPINGS[sortBy] };

      // Apply sortOrder to primary field only if not compound
      if (sortOrder === "asc" && Object.keys(sort).length === 1) {
        const primaryField = Object.keys(sort)[0];
        sort[primaryField] = 1;
      }
    } else {
      sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }

    // Always add _id as secondary sort
    if (!sort._id) {
      sort._id = -1;
    }

    // =============================================================================
    // PAGINATION
    // =============================================================================
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // =============================================================================
    // OPTIMIZED: Conditional cities fetch
    // =============================================================================
    const shouldFetchCities = !cities || !cities.trim();
    const citiesQuery = shouldFetchCities ? { ...query, "address.city": undefined } : null;

    // =============================================================================
    // EXECUTE QUERIES IN PARALLEL
    // =============================================================================
    const [vendors, total, availableCities] = await Promise.all([
      Vendor.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select("-reviewsList -likedBy -bookmarkedBy -__v")
        .collation({ locale: "en", strength: 2 })
        .lean({ virtuals: false })
        .exec(),

      Vendor.countDocuments(query).exec(),

      shouldFetchCities ? Vendor.distinct("address.city", citiesQuery).exec() : Promise.resolve([]),
    ]);

    // =============================================================================
    // PROCESS VENDORS (MATCH API LOGIC)
    // =============================================================================
    const processedVendors = vendors.map((vendor) => ({
      ...vendor,
      bookings: vendor.bookings ?? vendor.totalBookings ?? 0,
      reviews: vendor.reviews ?? vendor.reviewCount ?? vendor.totalReviews ?? 0,
      rating: vendor.rating ?? vendor.averageRating ?? 0,
    }));

    // =============================================================================
    // PAGINATION METADATA
    // =============================================================================
    const totalPages = Math.ceil(total / limitNum);

    const result = {
      vendors: sanitize(processedVendors),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
        currentPage: pageNum,
        resultsOnPage: processedVendors.length,
      },
      filters: {
        availableCities: shouldFetchCities ? availableCities.filter(Boolean).sort() : [],
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
        sortApplied: {
          sortBy,
          sortOrder,
          sortMapping: SORT_MAPPINGS[sortBy] ? "predefined" : "dynamic",
        },
      },
    };

    logAction("getMarketplaceVendors", `Success. Found ${vendors.length} vendors out of ${total} total.`);
    return result;
  } catch (error) {
    logError("getMarketplaceVendors", error);
    return {
      vendors: [],
      pagination: { currentPage: 1, totalPages: 1, total: 0, limit: 12, hasNext: false, hasPrev: false },
      filters: { availableCities: [], appliedFilters: {} },
      meta: { timestamp: new Date().toISOString() },
    };
  }
}