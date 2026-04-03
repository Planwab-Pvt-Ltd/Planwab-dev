import { NextResponse } from "next/server";
import connectToDatabase from "../../../../database/mongoose";
import VendorProfile from "../../../../database/models/VendorProfileModel";
import ScheduleMeetModel from './../../../../database/models/ScheduleMeetModel';

export async function GET(req) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    // 1. Fetch meets without Mongoose populate, using .lean() to get raw JS objects
    const meets = await ScheduleMeetModel.find({
      userId,
      status: { $in: ["pending", "confirmed"] },
    })
      .sort({ scheduledDate: 1 })
      .lean();

    // 2. Extract all saved IDs from the meets
    const savedIds = [...new Set(meets.map((m) => m.profileId?.toString()).filter(Boolean))];

    if (savedIds.length > 0) {
      // 3. Robust Lookup: Find profiles where either _id OR vendorId matches the saved ID.
      // This catches records where the vendor ID was accidentally saved instead of the profile ID.
      const profiles = await VendorProfile.find({
        $or: [
          { _id: { $in: savedIds } }, 
          { vendorId: { $in: savedIds } }
        ],
      })
        .select("vendorAvatar username vendorId _id category vendorBusinessName")
        .lean();

      // 4. Create quick-lookup dictionaries
      const profileById = {};
      const profileByVendorId = {};
      
      profiles.forEach((p) => {
        if (p._id) profileById[p._id.toString()] = p;
        if (p.vendorId) profileByVendorId[p.vendorId.toString()] = p;
      });

      // 5. Manually attach the correct profile to each meet
      meets.forEach((meet) => {
        if (meet.profileId) {
          const idStr = meet.profileId.toString();
          // Try matching by Profile _id first, then fallback to Vendor ID
          meet.profileId = profileById[idStr] || profileByVendorId[idStr] || null;
        }
      });
    }

    return NextResponse.json({ success: true, data: meets }, { status: 200 });
  } catch (error) {
    console.error("Fetch Meets Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { 
      profileId, 
      scheduledDate, 
      eventType, 
      otherEventType, 
      url, 
      pageUrl,
      userDetails,
      userId,
    } = body;

    if (!profileId || !scheduledDate || !eventType) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newMeet = await ScheduleMeetModel.create({
      profileId,
      userId, // Securely set from Clerk auth()
      user: userDetails, // Set from frontend payload
      scheduledDate,
      eventType,
      otherEventType: eventType === "Others" ? otherEventType : "",
      url: url || "", 
      pageUrl: pageUrl || "", 
    });

    return NextResponse.json({ success: true, data: newMeet }, { status: 201 });
  } catch (error) {
    console.error("Schedule Meet Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
   const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { meetId, status } = await req.json();

    if (!meetId || status !== "cancelled") {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }

    const updatedMeet = await ScheduleMeetModel.findOneAndUpdate(
      { _id: meetId, userId },
      { status: "cancelled" },
      { new: true }
    );

    if (!updatedMeet) {
      return NextResponse.json({ success: false, error: "Meeting not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedMeet }, { status: 200 });
  } catch (error) {
    console.error("Cancel Meet Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}