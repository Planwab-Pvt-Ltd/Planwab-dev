import { NextResponse } from "next/server";
import connectToDatabase from "../../../../database/mongoose";
import User from "../../../../database/models/userModel";
import Vendor from "../../../../database/models/VendorModel";
import ReelsModel from "../../../../database/models/ReelsModel";
import VendorProfile from "../../../../database/models/VendorProfileModel";
import Blog from "../../../../database/models/BlogModel";

export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const likedVendorIds = user.likedVendors || [];
    const watchlistVendorIds = user.watchlist || [];
    const likedReelIds = user.likedReels || [];
    const watchlistReelIds = user.watchlistReels || [];

    const allVendorIds = [...new Set([...likedVendorIds, ...watchlistVendorIds])];
    const allReelIds = [...new Set([...likedReelIds, ...watchlistReelIds])];

    const [
      allVendors,
      allReels,
      likedProfiles,
      trustedProfiles,
      likedVPReels,
      savedVPReels,
      likedVPPosts,
      savedVPPosts,
      likedBlogs,
      savedBlogs,
    ] = await Promise.all([
      // 1. Vendors from user.likedVendors + user.watchlist
      allVendorIds.length > 0
        ? Vendor.find({ _id: { $in: allVendorIds } })
            .select("name defaultImageNew rating address category perDayPrice slug shortDescription reviews bookings yearsExperience isVerified isFeatured tags category basePrice")
            .lean()
            .catch(() => [])
        : Promise.resolve([]),

      // 2. Reels from user.likedReels + user.watchlistReels (ReelsModel)
      allReelIds.length > 0
        ? ReelsModel.find({ _id: { $in: allReelIds } })
            .select("_id type thumbnailUrl videoUrl caption vendorName likesCount viewsCount createdAt duration shareCount saveCount category hashtags publishedAt type subtype")
            .lean()
            .catch(() => [])
        : Promise.resolve([]),

      // 3. VendorProfiles liked by user
      VendorProfile.find({ likes: userId })
        .select("vendorBusinessName username category vendorCoverImageNew vendorAvatarNew trust vendorId location likesCount trustCount postsCount reelsCount")
        .limit(30)
        .lean()
        .catch(() => []),

      // 4. VendorProfiles trusted by user
      VendorProfile.find({ trustedBy: userId })
        .select("vendorBusinessName username category vendorCoverImageNew vendorAvatarNew trust vendorId location likesCount trustCount postsCount reelsCount")
        .limit(30)
        .lean()
        .catch(() => []),

      // 5. VendorProfile reels liked by user
     VendorProfile.aggregate([
  { $match: { "reels.likes.userId": userId } },

  // ✅ Add index of each reel BEFORE unwind
  {
    $addFields: {
      reelsWithIndex: {
        $map: {
          input: { $range: [0, { $size: "$reels" }] },
          as: "idx",
          in: {
            $mergeObjects: [
              { $arrayElemAt: ["$reels", "$$idx"] },
              { reelIndex: "$$idx" } // ✅ attach index
            ]
          }
        }
      }
    }
  },

  // ✅ Unwind the new array
  { $unwind: "$reelsWithIndex" },

  // ✅ Match saved reels
  {
    $match: {
      "reelsWithIndex.likes.userId": userId
    }
  },

  { $limit: 30 },

  {
    $project: {
      _id: "$reelsWithIndex._id",
      title: "$reelsWithIndex.title",
      caption: "$reelsWithIndex.caption",
      videoUrl: "$reelsWithIndex.videoUrl",
      thumbnail: "$reelsWithIndex.thumbnail",
      thumbnailPath: "$reelsWithIndex.thumbnailPath",
      views: "$reelsWithIndex.views",
      likesCount: { $size: { $ifNull: ["$reelsWithIndex.likes", []] } },
      savedCount: { $size: { $ifNull: ["$reelsWithIndex.savedBy", []] } },
      vendorName: "$vendorBusinessName",
      vendorAvatarNew: "$vendorAvatarNew",
      vendorProfileId: "$_id",
      username: "$username",
      createdAt: "$reelsWithIndex.createdAt",
      source: { $literal: "vendorProfile" },
      mediaUrl: "$reelsWithIndex.mediaUrl",
      category: "$category",
      vendorId: "$vendorId",
      reelIndex: "$reelsWithIndex.reelIndex"
    }
  }
]).catch(() => []),

      // 6. VendorProfile reels saved by user
      VendorProfile.aggregate([
  { $match: { "reels.savedBy.userId": userId } },

  // ✅ Add index of each reel BEFORE unwind
  {
    $addFields: {
      reelsWithIndex: {
        $map: {
          input: { $range: [0, { $size: "$reels" }] },
          as: "idx",
          in: {
            $mergeObjects: [
              { $arrayElemAt: ["$reels", "$$idx"] },
              { reelIndex: "$$idx" } // ✅ attach index
            ]
          }
        }
      }
    }
  },

  // ✅ Unwind the new array
  { $unwind: "$reelsWithIndex" },

  // ✅ Match saved reels
  {
    $match: {
      "reelsWithIndex.savedBy.userId": userId
    }
  },

  { $limit: 30 },

  {
    $project: {
      _id: "$reelsWithIndex._id",
      title: "$reelsWithIndex.title",
      caption: "$reelsWithIndex.caption",
      videoUrl: "$reelsWithIndex.videoUrl",
      thumbnail: "$reelsWithIndex.thumbnail",
      thumbnailPath: "$reelsWithIndex.thumbnailPath",
      views: "$reelsWithIndex.views",
      likesCount: { $size: { $ifNull: ["$reelsWithIndex.likes", []] } },
      savedCount: { $size: { $ifNull: ["$reelsWithIndex.savedBy", []] } },
      vendorName: "$vendorBusinessName",
      vendorAvatarNew: "$vendorAvatarNew",
      vendorProfileId: "$_id",
      username: "$username",
      createdAt: "$reelsWithIndex.createdAt",
      source: { $literal: "vendorProfile" },
      mediaUrl: "$reelsWithIndex.mediaUrl",
      category: "$category",
      vendorId: "$vendorId",

      // ✅ Correct reel index
      reelIndex: "$reelsWithIndex.reelIndex"
    }
  }
]).catch(() => []),

      // 7. VendorProfile posts liked by user
      VendorProfile.aggregate([
        { $match: { "posts.likes.userId": userId } },
        { $unwind: "$posts" },
        { $match: { "posts.likes.userId": userId } },
        { $limit: 30 },
        {
          $project: {
            _id: "$posts._id",
            description: "$posts.description",
            mediaUrl: "$posts.mediaUrl",
            mediaType: "$posts.mediaType",
            location: "$posts.location",
            likesCount: { $size: { $ifNull: ["$posts.likes", []] } },
            savedCount: { $size: { $ifNull: ["$posts.savedBy", []] } },
            reviewsCount: { $size: { $ifNull: ["$posts.reviews", []] } },
            vendorName: "$vendorBusinessName",
            vendorAvatarNew: "$vendorAvatarNew",
            vendorProfileId: "$_id",
            username: "$username",
            createdAt: "$posts.createdAt",
            source: { $literal: "vendorProfile" },
            mediaUrl: "$posts.mediaUrl",
            category: "$category",
            content : "$posts.content",
            vendorId: "$vendorId",
          },
        },
      ]).catch(() => []),

      // 8. VendorProfile posts saved by user
      VendorProfile.aggregate([
        { $match: { "posts.savedBy.userId": userId } },
        { $unwind: "$posts" },
        { $match: { "posts.savedBy.userId": userId } },
        { $limit: 30 },
        {
          $project: {
            _id: "$posts._id",
            description: "$posts.description",
            mediaUrl: "$posts.mediaUrl",
            mediaType: "$posts.mediaType",
            location: "$posts.location",
            likesCount: { $size: { $ifNull: ["$posts.likes", []] } },
            savedCount: { $size: { $ifNull: ["$posts.savedBy", []] } },
            reviewsCount: { $size: { $ifNull: ["$posts.reviews", []] } },
            vendorName: "$vendorBusinessName",
            vendorAvatarNew: "$vendorAvatarNew",
            vendorProfileId: "$_id",
            username: "$username",
            createdAt: "$posts.createdAt",
            source: { $literal: "vendorProfile" },
            mediaUrl: "$posts.mediaUrl",
            category: "$category",
            vendorId: "$vendorId",
             content : "$posts.content",
          },
        },
      ]).catch(() => []),

      // 9. Blogs liked by user
      Blog.find({ likedBy: userId })
        .select("title slug thumbnail coverImage author category readTime createdAt")
        .limit(30)
        .lean()
        .catch(() => []),

      // 10. Blogs saved by user
      Blog.find({ savedBy: userId })
        .select("title slug thumbnail coverImage author category readTime createdAt excerpt viewCount likeCount authorPhoto createdAt tags shareCount")
        .limit(30)
        .lean()
        .catch(() => []),
    ]);

    const vendorMap = new Map();
    allVendors.forEach((v) => vendorMap.set(v._id.toString(), v));

    const reelMap = new Map();
    allReels.forEach((r) => reelMap.set(r._id.toString(), r));

    return NextResponse.json({
      success: true,
      vendors: {
        liked: likedVendorIds.map((id) => vendorMap.get(id)).filter(Boolean),
        watchlist: watchlistVendorIds.map((id) => vendorMap.get(id)).filter(Boolean),
      },
      reels: {
        liked: likedReelIds.map((id) => reelMap.get(id)).filter(Boolean),
        watchlist: watchlistReelIds.map((id) => reelMap.get(id)).filter(Boolean),
        likedVendorProfileReels: likedVPReels,
        watchlistVendorProfileReels: savedVPReels,
      },
      vendorProfiles: {
        liked: likedProfiles,
        trusted: trustedProfiles,
        posts: {
          liked: likedVPPosts,
          watchlist: savedVPPosts,
        },
      },
      blogs: {
        liked: likedBlogs,
        watchlist: savedBlogs,
      },
    });
  } catch (error) {
    console.error("LikedLists API Error:", error.message);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}