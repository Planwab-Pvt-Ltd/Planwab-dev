import { NextResponse } from "next/server";
import User from './../../../../database/models/userModel';
import connectToDatabase from "../../../../database/mongoose";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 100;
    const search = searchParams.get("search") || "";
    const userType = searchParams.get("userType") || "all";
    const plan = searchParams.get("plan") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const id = searchParams.get("id");
    const userId = searchParams.get("userId") || searchParams.get("id");

    const skip = (page - 1) * limit;

    let query = {};

    if (id) {
      query._id = id;
    }

    if (userId) {
      query.$or = [{ clerkId: userId }];
      // Only push to _id if it's a valid MongoDB ObjectId to prevent casting errors
      if (userId.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: userId });
      }
    }else{
    // Search logic mapped to User schema
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { "personalInfo.phone": { $regex: search, $options: "i" } },
      ];
    }

    if (userType !== "all") {
      query.userType = userType;
    }

    if (plan !== "all") {
      query.plan = plan;
    }
}

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Fetch users and total count
    const [users, totalCount] = await Promise.all([
      User.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Aggregate User Stats
    const statsAggregation = await User.aggregate([
      { $match: {} },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          regularCount: {
            $sum: { $cond: [{ $eq: ["$userType", "regular"] }, 1, 0] },
          },
          vendorCount: {
            $sum: { $cond: [{ $eq: ["$userType", "vendor"] }, 1, 0] },
          },
          proPlanCount: {
            $sum: { $cond: [{ $eq: ["$plan", "pro"] }, 1, 0] },
          },
          adminCount: {
            $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] },
          },
        },
      },
    ]);

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [thisMonthCount, lastMonthCount] = await Promise.all([
      User.countDocuments({
        createdAt: { $gte: thisMonthStart },
      }),
      User.countDocuments({
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
      }),
    ]);

    const stats = statsAggregation[0] || {
      totalUsers: 0,
      regularCount: 0,
      vendorCount: 0,
      proPlanCount: 0,
      adminCount: 0,
    };

    const growthRate =
      lastMonthCount > 0
        ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100)
        : thisMonthCount > 0
        ? 100
        : 0;

    return NextResponse.json(
      {
        success: true,
        data: users,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPrevPage,
          skip,
        },
        stats: {
          total: stats.totalUsers,
          regular: stats.regularCount,
          vendors: stats.vendorCount,
          proUsers: stats.proPlanCount,
          admins: stats.adminCount,
          thisMonth: thisMonthCount,
          lastMonth: lastMonthCount,
          growthRate,
        },
        filters: {
          search,
          userType,
          plan,
          sortBy,
          sortOrder,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("❌ GET_ALL_USERS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      },
      { status: 500 }
    );
  }
}