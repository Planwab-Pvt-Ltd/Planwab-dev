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