import { NextResponse } from "next/server";
import connectToDatabase from "../../../../database/mongoose";
import User from "../../../../database/models/userModel";
import Vendor from "../../../../database/models/VendorModel";
import ReelsModel from "../../../../database/models/ReelsModel";
import VendorProfile from "../../../../database/models/VendorProfileModel";
import Blog from "../../../../database/models/BlogModel";

export async function POST(req) {
  try {
    const { userId, listType, itemId, vendorProfileId } = await req.json();

    if (!userId || !listType || !itemId) {
      return NextResponse.json(
        { error: "userId, listType, and itemId are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let message = "Removed successfully";

    switch (listType) {
      case "vendors.liked": {
        await Promise.all([
          User.updateOne(
            { clerkId: userId },
            { $pull: { likedVendors: itemId } }
          ),
          Vendor.updateOne(
            { _id: itemId },
            { $pull: { likedBy: userId }, $inc: { likesCount: -1 } }
          ),
        ]);
        message = "Vendor removed from likes";
        break;
      }

      case "vendors.watchlist": {
        await Promise.all([
          User.updateOne(
            { clerkId: userId },
            { $pull: { watchlist: itemId } }
          ),
          Vendor.updateOne(
            { _id: itemId },
            { $pull: { bookmarkedBy: userId }, $inc: { bookmarksCount: -1 } }
          ),
        ]);
        message = "Vendor removed from watchlist";
        break;
      }

      case "reels.liked": {
        await Promise.all([
          User.updateOne(
            { clerkId: userId },
            { $pull: { likedReels: itemId } }
          ),
          ReelsModel.updateOne(
            { _id: itemId },
            { $pull: { likedBy: userId }, $inc: { likeCount: -1 } }
          ),
        ]);
        message = "Reel removed from likes";
        break;
      }

      case "reels.watchlist": {
        await Promise.all([
          User.updateOne(
            { clerkId: userId },
            { $pull: { watchlistReels: itemId } }
          ),
          ReelsModel.updateOne(
            { _id: itemId },
            { $inc: { saveCount: -1 } }
          ),
        ]);
        message = "Reel removed from watchlist";
        break;
      }

      case "vendorProfiles.liked": {
        await VendorProfile.updateOne(
          { _id: itemId },
          { $pull: { likes: userId } }
        );
        message = "Profile removed from likes";
        break;
      }

      case "vendorProfiles.trusted": {
        await VendorProfile.updateOne(
          { _id: itemId },
          { $pull: { trustedBy: userId }, $inc: { trust: -1 } }
        );
        message = "Profile removed from trusted";
        break;
      }

      case "vendorProfiles.posts.liked": {
        if (!vendorProfileId) {
          return NextResponse.json(
            { error: "vendorProfileId is required for this list type" },
            { status: 400 }
          );
        }
        await VendorProfile.updateOne(
          { _id: vendorProfileId, "posts._id": itemId },
          { $pull: { "posts.$.likes": { userId } } }
        );
        message = "Post removed from likes";
        break;
      }

      case "vendorProfiles.posts.watchlist": {
        if (!vendorProfileId) {
          return NextResponse.json(
            { error: "vendorProfileId is required for this list type" },
            { status: 400 }
          );
        }
        await VendorProfile.updateOne(
          { _id: vendorProfileId, "posts._id": itemId },
          { $pull: { "posts.$.savedBy": { userId } } }
        );
        message = "Post removed from saved";
        break;
      }

      case "reels.likedVendorProfileReels": {
        if (!vendorProfileId) {
          return NextResponse.json(
            { error: "vendorProfileId is required for this list type" },
            { status: 400 }
          );
        }
        await VendorProfile.updateOne(
          { _id: vendorProfileId, "reels._id": itemId },
          { $pull: { "reels.$.likes": { userId } } }
        );
        message = "Vendor reel removed from likes";
        break;
      }

      case "reels.watchlistVendorProfileReels": {
        if (!vendorProfileId) {
          return NextResponse.json(
            { error: "vendorProfileId is required for this list type" },
            { status: 400 }
          );
        }
        await VendorProfile.updateOne(
          { _id: vendorProfileId, "reels._id": itemId },
          { $pull: { "reels.$.savedBy": { userId } } }
        );
        message = "Vendor reel removed from saved";
        break;
      }

      case "blogs.liked": {
        await Blog.updateOne(
          { _id: itemId },
          { $pull: { likedBy: userId }, $inc: { likeCount: -1 } }
        );
        message = "Blog removed from likes";
        break;
      }

      case "blogs.watchlist": {
        await Blog.updateOne(
          { _id: itemId },
          { $pull: { savedBy: userId } }
        );
        message = "Blog removed from saved";
        break;
      }

      default:
        return NextResponse.json(
          { error: `Invalid listType: ${listType}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message,
      listType,
      removedItemId: itemId,
    });
  } catch (error) {
    console.error("RemoveFromList API Error:", error.message);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}