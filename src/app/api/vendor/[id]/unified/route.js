import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "../../../../../database/mongoose";
import {Vendor} from "../../../../../database/models/VendorModel";
import VendorProfile from "../../../../../database/models/VendorProfileModel";
import Review from "../../../../../database/models/VendorsReviewsModel";

// Helper: Calculate review stats
const calculateReviewStats = async (ReviewModel, vendorId) => {
  try {
    const stats = await ReviewModel.aggregate([
      { $match: { vendorId: vendorId, status: "approved" } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          fiveStars: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          fourStars: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          threeStars: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          twoStars: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          oneStars: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const data = stats[0];
    return {
      totalReviews: data.totalReviews,
      averageRating: Math.round(data.averageRating * 10) / 10,
      distribution: {
        5: data.fiveStars,
        4: data.fourStars,
        3: data.threeStars,
        2: data.twoStars,
        1: data.oneStars,
      },
    };
  } catch (error) {
    console.error("Error calculating review stats:", error);
    return {
      totalReviews: 0,
      averageRating: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }
};

// Helper: Transform posts for response
const transformPosts = (posts) => {
  if (!Array.isArray(posts) || posts.length === 0) return [];
  
  return posts.map((post) => ({
    id: post._id?.toString() || post._id || `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    thumbnail: post.thumbnail || post.mediaUrl || "",
    fullImage: post.mediaUrl || post.thumbnail || "",
    mediaType: post.mediaType || "image",
    storagePath: post.storagePath || null,
    caption: post.description || post.caption || "",
    likes: Array.isArray(post.likes) ? post.likes.length : (typeof post.likes === "number" ? post.likes : 0),
    comments: Array.isArray(post.reviews) ? post.reviews.length : (Array.isArray(post.comments) ? post.comments.length : 0),
    date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
    location: post.location || "",
    isLiked: false,
    isSaved: false,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }));
};

// Helper: Transform reels for response
const transformReels = (reels) => {
  if (!Array.isArray(reels) || reels.length === 0) return [];
  
  return reels.map((reel) => ({
    id: reel._id?.toString() || reel._id || `reel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    thumbnail: reel.thumbnail || reel.videoUrl || "",
    videoUrl: reel.videoUrl || "",
    storagePath: reel.storagePath || null,
    thumbnailPath: reel.thumbnailPath || null,
    title: reel.title || "Untitled",
    caption: reel.caption || reel.description || "",
    views: typeof reel.views === "number" ? reel.views : 0,
    likes: Array.isArray(reel.likes) ? reel.likes.length : (typeof reel.likes === "number" ? reel.likes : 0),
    duration: reel.duration || "0:30",
    date: reel.createdAt ? new Date(reel.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
    isLiked: false,
    isSaved: false,
    createdAt: reel.createdAt,
    updatedAt: reel.updatedAt,
  }));
};

// Helper: Transform reviews for response
const transformReviews = (reviews) => {
  if (!Array.isArray(reviews) || reviews.length === 0) return [];
  
  return reviews.map((review) => ({
    _id: review._id?.toString() || review._id,
    id: review._id?.toString() || review._id,
    vendorId: review.vendorId,
    clerkUserId: review.clerkUserId,
    userName: review.userName || "Anonymous",
    userImage: review.userImage || null,
    rating: review.rating || 0,
    title: review.title || "",
    comment: review.comment || review.content || review.text || "",
    images: review.images || [],
    helpful: review.helpful || { count: 0, users: [] },
    status: review.status || "approved",
    reply: review.reply || null,
    eventType: review.eventType || null,
    eventDate: review.eventDate || null,
    verified: review.verified || false,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  }));
};

// GET - Fetch unified vendor data (vendor + profile + reviews)
export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    // Safe param resolution
    const resolvedParams = await params;
    const vendorId = resolvedParams.id;

    if (!vendorId) {
      return NextResponse.json(
        { success: false, message: "Vendor ID is required" },
        { status: 400 }
      );
    }

    // Fetch vendor, profile, reviews, and review stats in parallel
    const [vendor, profile, reviewsData, reviewStats] = await Promise.all([
      Vendor.findById(vendorId).lean().catch(() => null),
      VendorProfile.findOne({ vendorId }).select("-password").lean().catch(() => null),
      Review.find({ vendorId, status: "approved" })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean()
        .catch(() => []),
      calculateReviewStats(Review, vendorId),
    ]);

    // If vendor doesn't exist, return 404
    if (!vendor) {
      return NextResponse.json(
        { success: false, message: "Vendor not found" },
        { status: 404 }
      );
    }

    // Check if current user has reviewed
    let hasUserReviewed = false;
    let currentUserId = null;
    try {
      const { userId } = await auth();
      if (userId) {
        currentUserId = userId;
        const exists = await Review.exists({ vendorId, clerkUserId: userId });
        hasUserReviewed = !!exists;
      }
    } catch (e) {
      // Auth not available or user not signed in
    }

    // Transform posts and reels
    const transformedPosts = transformPosts(profile?.posts || []);
    const transformedReels = transformReels(profile?.reels || []);
    const transformedReviews = transformReviews(reviewsData || []);

    // Calculate counts
    const likesArray = profile?.likes || [];
    const trustedByArray = profile?.trustedBy || [];
    const likesCount = Array.isArray(likesArray) ? likesArray.length : 0;
    const trustCount = typeof profile?.trust === "number" ? profile.trust : 0;
    const reviewsCount = reviewStats?.totalReviews || transformedReviews.length;

    // Build unified response with ALL fields
    const unifiedData = {
      // ==========================================
      // VENDOR BASE DATA
      // ==========================================
      _id: vendor._id?.toString() || vendor._id,
      name: vendor.name || "",
      username: vendor.username || profile?.username || vendor.name?.toLowerCase().replace(/\s+/g, "_") || "",
      category: vendor.category || "",
      
      // Address
      address: {
        street: vendor.address?.street || "",
        city: vendor.address?.city || "",
        state: vendor.address?.state || "",
        postalCode: vendor.address?.postalCode || "",
        country: vendor.address?.country || "",
        googleMapUrl: vendor.address?.googleMapUrl || "",
        coordinates: vendor.address?.coordinates || null,
        ...vendor.address,
      },
      
      // Images
      images: vendor.images || [],
      
      // Status flags
      isVerified: vendor.isVerified || false,
      isPremium: vendor.isPremium || false,
      isActive: vendor.isActive !== false,
      
      // ==========================================
      // PRICING
      // ==========================================
      basePrice: vendor.basePrice || null,
      perDayPrice: {
        min: vendor.perDayPrice?.min || null,
        max: vendor.perDayPrice?.max || null,
        ...vendor.perDayPrice,
      },
      priceUnit: vendor.priceUnit || "day",
      currency: vendor.currency || "INR",
      
      // ==========================================
      // DESCRIPTIONS
      // ==========================================
      shortDescription: vendor.shortDescription || "",
      description: vendor.description || "",
      bio: profile?.bio || vendor.bio || "",
      tagline: vendor.tagline || "",
      
      // ==========================================
      // OPERATING INFO
      // ==========================================
      operatingHours: (vendor.operatingHours || []).map((schedule) => ({
        day: schedule.day || "",
        hours: schedule.hours || "",
        isOpen: schedule.isOpen !== false,
        ...schedule,
      })),
      
      // ==========================================
      // FEATURES & AMENITIES
      // ==========================================
      amenities: vendor.amenities || [],
      facilities: vendor.facilities || [],
      services: vendor.services || [],
      features: vendor.features || [],
      
      // Awards
      awards: (vendor.awards || []).map((award) => ({
        title: award.title || award || "",
        year: award.year || "",
        organization: award.organization || "",
        ...award,
      })),
      
      // Packages
      packages: (vendor.packages || []).map((pkg) => ({
        _id: pkg._id?.toString() || pkg._id,
        id: pkg._id?.toString() || pkg._id || pkg.id,
        name: pkg.name || "",
        title: pkg.title || pkg.name || "",
        description: pkg.description || "",
        price: pkg.price || 0,
        originalPrice: pkg.originalPrice || null,
        duration: pkg.duration || "",
        features: pkg.features || [],
        inclusions: pkg.inclusions || [],
        exclusions: pkg.exclusions || [],
        isPopular: pkg.isPopular || false,
        isBestValue: pkg.isBestValue || false,
        ...pkg,
      })),
      
      // Event types
      eventTypes: vendor.eventTypes || [],
      
      // Highlight points (Why Choose Us)
      highlightPoints: vendor.highlightPoints || [],
      
      // Special offers
      specialOffers: (vendor.specialOffers || []).map((offer) => ({
        title: offer.title || "",
        description: offer.description || "",
        discount: offer.discount || "",
        validTill: offer.validTill || "",
        code: offer.code || "",
        isActive: offer.isActive !== false,
        ...offer,
      })),
      
      // Payment methods
      paymentMethods: vendor.paymentMethods || [],
      
      // ==========================================
      // STATS & HIGHLIGHTS (for insights tab)
      // ==========================================
      highlights: (vendor.highlights || []).map((highlight) => ({
        icon: highlight.icon || "star",
        label: highlight.label || "",
        value: highlight.value || "",
        color: highlight.color || "text-slate-600 dark:text-slate-400",
        ...highlight,
      })),
      
      stats: (vendor.stats || []).map((stat) => ({
        label: stat.label || "",
        value: stat.value || "",
        trend: stat.trend || "",
        positive: stat.positive !== false,
        icon: stat.icon || null,
        ...stat,
      })),
      
      // ==========================================
      // FAQS
      // ==========================================
      faqs: (vendor.faqs || []).map((faq) => ({
        question: faq.question || "",
        answer: faq.answer || "",
        category: faq.category || "",
        ...faq,
      })),
      
      // ==========================================
      // POLICIES
      // ==========================================
      policies: (vendor.policies || []).map((policy) => ({
        title: policy.title || "",
        content: policy.content || "",
        details: policy.details || [],
        icon: policy.icon || null,
        ...policy,
      })),
      
      // ==========================================
      // LOCATION DETAILS
      // ==========================================
      landmarks: (vendor.landmarks || []).map((landmark) => ({
        name: landmark.name || "",
        distance: landmark.distance || "",
        type: landmark.type || "",
        ...landmark,
      })),
      
      directions: (vendor.directions || []).map((direction) => ({
        type: direction.type || "",
        description: direction.description || "",
        icon: direction.icon || null,
        ...direction,
      })),
      
      // ==========================================
      // CONTACT INFO
      // ==========================================
      phone: vendor.phone || profile?.phone || "",
      email: vendor.email || profile?.email || "",
      whatsapp: vendor.whatsapp || profile?.whatsapp || "",
      
      // ==========================================
      // SOCIAL LINKS (from vendor)
      // ==========================================
      socialLinks: {
        instagram: vendor.socialLinks?.instagram || "",
        facebook: vendor.socialLinks?.facebook || "",
        twitter: vendor.socialLinks?.twitter || "",
        youtube: vendor.socialLinks?.youtube || "",
        linkedin: vendor.socialLinks?.linkedin || "",
        pinterest: vendor.socialLinks?.pinterest || "",
        tiktok: vendor.socialLinks?.tiktok || "",
        website: vendor.socialLinks?.website || vendor.website || "",
        ...vendor.socialLinks,
      },
      
      // ==========================================
      // PROFILE-SPECIFIC DATA
      // ==========================================
      vendorProfile: profile || null,
      vendorAvatar: profile?.vendorAvatar || vendor.vendorAvatar || vendor.profileImage || vendor.avatar || null,
      vendorCoverImage: profile?.vendorCoverImage || vendor.vendorCoverImage || vendor.coverImage || null,
      vendorBusinessName: profile?.vendorBusinessName || vendor.businessName || vendor.name || "",
      vendorName: profile?.vendorName || vendor.name || "",
      
      // Profile social links (may differ from vendor social links)
      profileSocialLinks: {
        instagram: profile?.socialLinks?.instagram || "",
        facebook: profile?.socialLinks?.facebook || "",
        twitter: profile?.socialLinks?.twitter || "",
        youtube: profile?.socialLinks?.youtube || "",
        linkedin: profile?.socialLinks?.linkedin || "",
        website: profile?.socialLinks?.website || "",
        ...profile?.socialLinks,
      },
      
      // Website
      website: profile?.website || vendor.website || vendor.socialLinks?.website || null,
      
      // ==========================================
      // CONTENT DATA (transformed)
      // ==========================================
      posts: transformedPosts,
      reels: transformedReels,
      reviews: transformedReviews,
      
      // ==========================================
      // REVIEW STATS
      // ==========================================
      reviewStats: {
        totalReviews: reviewStats.totalReviews,
        averageRating: reviewStats.averageRating,
        distribution: reviewStats.distribution,
      },
      hasUserReviewed,
      
      // ==========================================
      // COUNTS
      // ==========================================
      likesCount,
      trustCount,
      reviewsCount,
      postsCount: transformedPosts.length,
      reelsCount: transformedReels.length,
      followersCount: vendor.followersCount || profile?.followersCount || 0,
      followingCount: vendor.followingCount || profile?.followingCount || 0,
      
      // ==========================================
      // INTERACTION DATA (for user-specific checks)
      // ==========================================
      likes: likesArray.map((id) => id?.toString() || id),
      trustedBy: trustedByArray.map((id) => id?.toString() || id),
      followers: (vendor.followers || profile?.followers || []).map((id) => id?.toString() || id),
      following: (vendor.following || profile?.following || []).map((id) => id?.toString() || id),
      
      // ==========================================
      // META FLAGS
      // ==========================================
      hasProfile: !!profile,
      profileId: profile?._id?.toString() || null,
      
      // ==========================================
      // ADDITIONAL VENDOR FIELDS
      // ==========================================
      experience: vendor.experience || "",
      yearsInBusiness: vendor.yearsInBusiness || null,
      teamSize: vendor.teamSize || null,
      languages: vendor.languages || [],
      specializations: vendor.specializations || [],
      certifications: vendor.certifications || [],
      portfolio: vendor.portfolio || [],
      gallery: vendor.gallery || vendor.images || [],
      testimonials: vendor.testimonials || [],
      
      // ==========================================
      // SEO & META
      // ==========================================
      slug: vendor.slug || "",
      metaTitle: vendor.metaTitle || vendor.name || "",
      metaDescription: vendor.metaDescription || vendor.shortDescription || "",
      keywords: vendor.keywords || [],
      
      // ==========================================
      // TIMESTAMPS
      // ==========================================
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
      profileCreatedAt: profile?.createdAt || null,
      profileUpdatedAt: profile?.updatedAt || null,
      
      // ==========================================
      // RAW DATA (for any missed fields)
      // ==========================================
      _rawVendor: vendor,
      _rawProfile: profile,
    };

    return NextResponse.json({
      success: true,
      data: unifiedData,
    });

  } catch (error) {
    console.error("GET unified vendor data error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}