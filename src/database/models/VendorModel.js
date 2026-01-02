// database/models/VendorModel.js

import mongoose, { Schema, model, models } from "mongoose";

// =============================================================================
// SUB-SCHEMAS (REUSABLE COMPONENTS)
// =============================================================================

const AddressSchema = new Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true, required: true, index: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, default: "India" },
    googleMapUrl: { type: String, trim: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  { _id: false }
);

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    category: { type: String, default: "General" },
    aspectRatio: { type: String, enum: ["portrait", "landscape", "square"], default: "landscape" },
  },
  { _id: false }
);

const PackageSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  duration: { type: String },
  features: { type: [String], default: [] },
  notIncluded: { type: [String], default: [] },
  isPopular: { type: Boolean, default: false },
  savingsPercentage: { type: Number, default: 0 },
});

const ReviewReplySchema = new Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, maxlength: 2000 },
    eventType: { type: String },
    images: { type: [String], default: [] },
    isVerified: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    helpfulBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    replies: [ReviewReplySchema],
    isFlagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PolicyDetailSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String },
    details: { type: [String], default: [] },
    icon: { type: String },
    iconColor: { type: String },
  },
  { _id: false }
);

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const AwardSchema = new Schema(
  {
    title: { type: String, required: true },
    year: { type: String },
    icon: { type: String },
  },
  { _id: false }
);

const LandmarkSchema = new Schema(
  {
    name: { type: String, required: true },
    distance: { type: String },
    type: { type: String },
  },
  { _id: false }
);

const OperatingHoursSchema = new Schema(
  {
    day: { type: String, required: true },
    hours: { type: String, required: true },
    isClosed: { type: Boolean, default: false },
  },
  { _id: false }
);

const SpecialOfferSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    discount: { type: String },
    validUntil: { type: Date },
    code: { type: String },
    type: { type: String, enum: ["percentage", "fixed", "freebie"], default: "percentage" },
    icon: { type: String },
    gradient: { type: String },
  },
  { _id: false }
);

const StatSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    trend: { type: String },
    positive: { type: Boolean, default: true },
  },
  { _id: false }
);

const HighlightSchema = new Schema(
  {
    icon: { type: String },
    label: { type: String, required: true },
    value: { type: String, required: true },
    color: { type: String },
    bg: { type: String },
  },
  { _id: false }
);

const TechnicalSpecSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const DirectionSchema = new Schema(
  {
    type: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String },
    color: { type: String },
  },
  { _id: false }
);

// =============================================================================
// BASE VENDOR SCHEMA
// =============================================================================

const VendorBaseSchema = new Schema(
  {
    // --- Identity & Contact ---
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100, index: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, "Invalid email format"] },
    phoneNo: { type: String, required: true, trim: true },
    whatsappNo: { type: String, trim: true },
    contactPerson: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
    },

    // --- Location ---
    address: { type: AddressSchema, required: true },
    landmarks: [LandmarkSchema],
    directions: [DirectionSchema],

    // --- Status & Meta ---
    isVerified: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    tags: { type: [String], default: [], index: true },
    availabilityStatus: {
      type: String,
      default: "Available",
      enum: ["Available", "Busy", "Unavailable", "Closed"],
    },
    subcategory: { type: String, index: true },

    // --- Content & Media ---
    description: { type: String, maxlength: 5000 },
    shortDescription: { type: String, maxlength: 200 },
    defaultImage: { type: String },
    images: { type: [String], default: [] },
    gallery: { type: [ImageSchema], default: [] },
    videoUrl: { type: String },

    // --- Stats & Ratings ---
    rating: { type: Number, default: 0, min: 0, max: 5, index: true },
    reviewCount: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },
    yearsExperience: { type: Number, default: 0 },
    responseTime: { type: String, default: "Within 2 hours" },
    repeatCustomerRate: { type: String },
    responseRate: { type: String, default: "98%" },

    // --- Stats Display (for Overview section) ---
    stats: [StatSchema],
    highlights: [HighlightSchema],

    // --- Operating Hours ---
    operatingHours: [OperatingHoursSchema],

    // --- Features ---
    amenities: { type: [String], default: [] },
    facilities: { type: [String], default: [] },
    highlightPoints: { type: [String], default: [] },
    awards: [AwardSchema],
    specialOffers: [SpecialOfferSchema],

    // --- Event Types Supported ---
    eventTypes: {
      type: [String],
      default: ["Weddings", "Corporate", "Birthday", "Conference", "Reception", "Engagement", "Anniversary"],
    },

    // --- Pricing & Packages ---
    basePrice: { type: Number, required: true, index: true },
    priceUnit: { type: String, default: "day" },
    perDayPrice: {
      min: { type: Number, index: true },
      max: { type: Number },
    },
    packages: [PackageSchema],
    paymentMethods: { type: [String], default: ["Cash", "UPI", "Bank Transfer"] },

    // --- Information Data ---
    policies: [PolicyDetailSchema],
    faqs: [FAQSchema],

    // --- Reviews (Embedded) ---
    reviewsList: [ReviewSchema],

    // --- Social Interactions ---
    likesCount: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    bookmarksCount: { type: Number, default: 0 },
    bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],

    // --- Social Links ---
    socialLinks: {
      website: { type: String },
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      youtube: { type: String },
      linkedin: { type: String },
    },

    // --- SEO ---
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: [String], default: [] },
  },
  {
    timestamps: true,
    discriminatorKey: "category",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// GeoJSON Indexing
VendorBaseSchema.index({ "address.location": "2dsphere" });

// Initialize Base Model
const Vendor = models.Vendor || model("Vendor", VendorBaseSchema);

// Helper to avoid OverwriteModelError
const createDiscriminator = (name, schema) => {
  try {
    return models[name] || Vendor.discriminator(name, schema);
  } catch (e) {
    if (e.name === "OverwriteModelError") {
      return models[name];
    }
    throw e;
  }
};

// =============================================================================
// CATEGORY SPECIFIC SCHEMAS (DISCRIMINATORS)
// =============================================================================

const VenueVendor = createDiscriminator(
  "venues",
  new Schema({
    seating: { min: { type: Number }, max: { type: Number } },
    floating: { min: { type: Number }, max: { type: Number } },
    rooms: {
      count: { type: Number },
      max: { type: Number },
      ac: { type: Boolean, default: true },
    },
    halls: { type: Number, default: 1 },
    parking: {
      capacity: { type: Number },
      valet: { type: Boolean, default: false },
    },
    areas: { type: [String], default: [] },
    technicalSpecs: [TechnicalSpecSchema],
    foodPolicy: { type: String, enum: ["Veg Only", "Non-Veg Allowed", "Outside Food Allowed", ""] },
    venueType: { type: String },
    ceilingHeight: { type: String },
    powerBackup: { type: String },
    stageSize: { type: String },
  })
);

const PhotographerVendor = createDiscriminator(
  "photographers",
  new Schema({
    services: [String],
    deliverables: [String],
    deliveryTime: { type: Number, default: 4 },
    equipment: [String],
    travelCost: { type: String, enum: ["Included", "Extra", ""] },
    teamSize: { type: Number },
    photoEditingStyle: { type: String },
    videographyIncluded: { type: Boolean, default: false },
    droneAvailable: { type: Boolean, default: false },
    albumTypes: [String],
  })
);

const MakeupVendor = createDiscriminator(
  "makeup",
  new Schema({
    services: [String],
    brandsUsed: [String],
    trialPolicy: {
      available: { type: Boolean, default: false },
      paid: { type: Boolean, default: true },
      price: { type: Number },
    },
    travelToVenue: { type: Boolean, default: true },
    makeupStyles: [String],
    skinTypes: [String],
    assistantsAvailable: { type: Boolean, default: false },
  })
);

const PlannerVendor = createDiscriminator(
  "planners",
  new Schema({
    specializations: [String],
    eventsManaged: [String],
    teamSize: { type: Number },
    feeStructure: { type: String, enum: ["Fixed Fee", "Percentage of Budget", "Hourly", ""] },
    destinationWeddings: { type: Boolean, default: false },
    vendorNetwork: { type: Number },
    budgetRange: { min: { type: Number }, max: { type: Number } },
  })
);

const CatererVendor = createDiscriminator(
  "catering",
  new Schema({
    cuisines: [String],
    menuTypes: [String],
    minCapacity: { type: Number },
    maxCapacity: { type: Number },
    liveCounters: { type: Boolean, default: false },
    pricePerPlate: {
      veg: { type: Number },
      nonVeg: { type: Number },
    },
    servingStaff: { type: Boolean, default: true },
    crockeryProvided: { type: Boolean, default: true },
    tastingSession: { type: Boolean, default: false },
    specialDiets: [String],
  })
);

const ClothesVendor = createDiscriminator(
  "clothes",
  new Schema({
    outfitTypes: [String],
    wearType: { type: String, enum: ["Bridal", "Groom", "Party", "Casual", "All", ""] },
    customization: { type: Boolean, default: false },
    rentalAvailable: { type: Boolean, default: false },
    leadTime: { type: String },
    sizeRange: { type: String },
    designers: [String],
    fittingSessions: { type: Number },
    alterationsIncluded: { type: Boolean, default: false },
  })
);

const MehendiVendor = createDiscriminator(
  "mehendi",
  new Schema({
    designs: [String],
    organic: { type: Boolean, default: true },
    pricePerHand: { type: Number },
    bridalPackagePrice: { type: Number },
    travelToVenue: { type: Boolean, default: true },
    teamSize: { type: Number },
    dryingTime: { type: String },
    colorGuarantee: { type: String },
  })
);

const DjVendor = createDiscriminator(
  "djs",
  new Schema({
    genres: [String],
    equipmentProvided: { type: Boolean, default: true },
    performanceDuration: { type: String },
    backupAvailable: { type: Boolean, default: true },
    lightingIncluded: { type: Boolean, default: false },
    emceeServices: { type: Boolean, default: false },
    soundSystemPower: { type: String },
    setupTime: { type: String },
  })
);

const CakeVendor = createDiscriminator(
  "cakes",
  new Schema({
    flavors: [String],
    speciality: [String],
    pricePerKg: { type: Number },
    deliveryAvailable: { type: Boolean, default: true },
    customDesigns: { type: Boolean, default: true },
    eggless: { type: Boolean, default: false },
    sugarFree: { type: Boolean, default: false },
    minOrderWeight: { type: Number },
    advanceBookingDays: { type: Number },
  })
);

const JewelleryVendor = createDiscriminator(
  "jewellery",
  new Schema({
    material: [String],
    styles: [String],
    customization: { type: Boolean, default: false },
    rentalAvailable: { type: Boolean, default: false },
    certificationProvided: { type: Boolean, default: false },
    returnPolicy: { type: String },
    insuranceAvailable: { type: Boolean, default: false },
    homeTrialAvailable: { type: Boolean, default: false },
  })
);

const InvitationVendor = createDiscriminator(
  "invitations",
  new Schema({
    types: [String],
    minOrderQuantity: { type: Number },
    digitalDeliveryTime: { type: String },
    physicalDeliveryTime: { type: String },
    customDesign: { type: Boolean, default: true },
    printingMethods: [String],
    paperTypes: [String],
    languages: [String],
  })
);

const HairstylingVendor = createDiscriminator(
  "hairstyling",
  new Schema({
    styles: [String],
    extensionsProvided: { type: Boolean, default: false },
    drapingIncluded: { type: Boolean, default: false },
    travelToVenue: { type: Boolean, default: true },
    trialAvailable: { type: Boolean, default: true },
    productsUsed: [String],
    accessoriesProvided: { type: Boolean, default: false },
  })
);

const OtherVendor = createDiscriminator(
  "other",
  new Schema({
    serviceType: { type: String, required: true },
    details: { type: Map, of: String },
    customFields: [{ label: String, value: String }],
  })
);

export {
  Vendor,
  VenueVendor,
  PhotographerVendor,
  MakeupVendor,
  PlannerVendor,
  CatererVendor,
  ClothesVendor,
  MehendiVendor,
  CakeVendor,
  JewelleryVendor,
  InvitationVendor,
  DjVendor,
  HairstylingVendor,
  OtherVendor,
};

export default Vendor;
