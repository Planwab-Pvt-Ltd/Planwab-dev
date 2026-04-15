import { NextResponse } from "next/server";
import connectToDatabase from "../../../../database/mongoose";
import ScheduleMeetModel from "../../../../database/models/ScheduleMeetModel";
import VendorProfile from '../../../../database/models/VendorProfileModel';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PlanWAB@12345";
const VENDOR_REQ_EDIT_ADMIN_PASSWORD = process.env.VENDOR_REQ_EDIT_ADMIN_PASSWORD || "EDit@PlanWAB@12345";

const verifyAdminPassword = (password) => {
  return password === ADMIN_PASSWORD;
};

const verifyEditPassword = (password) => {
  return password === VENDOR_REQ_EDIT_ADMIN_PASSWORD || password === ADMIN_PASSWORD;
};

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

export async function PUT(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const password = searchParams.get("adminPassword");

    if (!verifyEditPassword(password)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid admin password" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Meeting ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const allowedUpdates = {};
    if (body.status !== undefined) {
      const validStatuses = ["pending", "approved", "rejected"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }
      allowedUpdates.status = body.status;
    }
    if (body.url !== undefined) {
      allowedUpdates.url = body.url;
    }

    const updated = await ScheduleMeetModel.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: false }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Meeting request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Meeting request updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update meeting request",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const password = searchParams.get("adminPassword");

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid admin password" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Meeting ID is required" },
        { status: 400 }
      );
    }

    const deleted = await ScheduleMeetModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Meeting request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: deleted._id },
      message: "Meeting request deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete meeting request",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
