import { NextResponse } from "next/server";
import connectToDatabase from "../../../database/mongoose";
import User from "../../../database/models/userModel";

export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId }).lean();

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    if (
      user.plan !== "free" &&
      user.planExpiresAt &&
      new Date(user.planExpiresAt) < new Date()
    ) {
      await User.findOneAndUpdate(
        { clerkId: userId },
        { plan: "free", planExpiresAt: null, planPurchasedAt: null, billingCycle: null }
      );
      user.plan = "free";
      user.planExpiresAt = null;
      user.planPurchasedAt = null;
      user.billingCycle = null;
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("User GET Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { userId, firstName, lastName, personalInfo } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await connectToDatabase();

    const update = {};
    if (firstName !== undefined) update.firstName = firstName;
    if (lastName !== undefined) update.lastName = lastName;

    if (personalInfo) {
      if (personalInfo.phone !== undefined)
        update["personalInfo.phone"] = personalInfo.phone;
      if (personalInfo.address) {
        const a = personalInfo.address;
        if (a.address !== undefined) update["personalInfo.address.address"] = a.address;
        if (a.city !== undefined) update["personalInfo.address.city"] = a.city;
        if (a.pincode !== undefined) update["personalInfo.address.pincode"] = a.pincode;
        if (a.state !== undefined) update["personalInfo.address.state"] = a.state;
        if (a.country !== undefined) update["personalInfo.address.country"] = a.country;
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: update },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("User PUT Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}