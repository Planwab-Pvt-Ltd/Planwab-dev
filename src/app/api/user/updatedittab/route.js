import { NextResponse } from "next/server";
import connectToDatabase from "../../../../database/mongoose"; 
import User from "../../../../database/models/userModel";

export async function PUT(req) {
  try {
    const body = await req.json();
    
    // Destructure strictly ONLY the fields sent by EditUserTab
    const { 
      id,
      userId,
      role,
      userType,
      plan,
      billingCycle,
      planPurchasedAt,
      planExpiresAt,
      createdProfiles
    } = body;

    // Use either id (from our edit tab) or userId (fallback)
    const targetId = id || userId;

    if (!targetId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const update = {};

    // 1. Standard Fields
    if (role !== undefined) update.role = role;
    if (userType !== undefined) update.userType = userType;
    if (plan !== undefined) update.plan = plan;

    // 2. Array Field
    if (createdProfiles !== undefined && Array.isArray(createdProfiles)) {
      update.createdProfiles = createdProfiles;
    }

    // 3. Safe Parsing for Dates and Enums 
    // (Prevents MongoDB CastErrors if the frontend sends an empty string when clearing a field)
    if (billingCycle !== undefined) {
      update.billingCycle = billingCycle === "" ? null : billingCycle;
    }

    if (planPurchasedAt !== undefined) {
      update.planPurchasedAt = planPurchasedAt === "" ? null : new Date(planPurchasedAt);
    }

    if (planExpiresAt !== undefined) {
      update.planExpiresAt = planExpiresAt === "" ? null : new Date(planExpiresAt);
    }

    // 4. Smart ID Lookup
    // Checks if the targetId is a valid 24-character MongoDB ObjectId. 
    // If it is, search by _id. If not, assume it's a Clerk ID.
    const query = targetId.match(/^[0-9a-fA-F]{24}$/) 
      ? { _id: targetId } 
      : { clerkId: targetId };

    const updatedUser = await User.findOneAndUpdate(
      query,
      { $set: update },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Admin data updated successfully",
      user: updatedUser 
    });

  } catch (error) {
    console.error("UpdateEditTab PUT Error:", error);
    return NextResponse.json({ 
      error: "Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}