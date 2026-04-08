import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../database/mongoose";
import TestimonialModel from "../../../../database/models/TestimonialsModel";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PlanWAB@12345";
const VENDOR_REQ_EDIT_ADMIN_PASSWORD = process.env.VENDOR_REQ_EDIT_ADMIN_PASSWORD || "EDit@PlanWAB@12345";

const verifyAdminPassword = (password) => {
  return password === ADMIN_PASSWORD;
};

const verifyEditPassword = (password) => {
  return password === VENDOR_REQ_EDIT_ADMIN_PASSWORD || password === ADMIN_PASSWORD;
};

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limitParam = searchParams.get("limit");
    
    const query = {};
    if (status) query.status = status;

    let dbQuery = TestimonialModel.find(query).sort({ createdAt: -1 });
    
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (!isNaN(limit) && limit > 0) {
        dbQuery = dbQuery.limit(limit);
      }
    }

    const testimonials = await dbQuery.lean();

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch testimonials",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const {
      name,
      email,
      avatar,
      eventType,
      eventDate,
      location,
      guests,
      rating,
      testimonial,
      vendorUsed,
    } = body;


    if (!name || !email || !eventType || !rating || !testimonial) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = {
      name,
      email,
      avatar: avatar || "",
      eventType,
      rating,
      testimonial,
      status: "PENDING",
    };

    if (eventDate) {
      payload.eventDate = eventDate;
    } else {
      payload.eventDate = new Date();
    }
    if (location) payload.location = location;
    if (guests && guests > 0) payload.guests = guests;
    if (vendorUsed) payload.vendorUsed = vendorUsed;

    const newTestimonial = await TestimonialModel.create(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Testimonial submitted successfully and is pending approval.",
        data: newTestimonial,
      },
      { status: 201 }
    );
  } catch (error) {

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, error: "Validation failed", details: errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to submit testimonial", message: error.message },
      { status: 500 }
    );
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
        { success: false, error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const allowedUpdates = {};
    if (body.status !== undefined) {
      const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }
      allowedUpdates.status = body.status;
    }

    const updated = await TestimonialModel.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: false }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Testimonial updated successfully",
    });
  } catch (error) {

    return NextResponse.json(
      { success: false, error: "Failed to update testimonial", message: error.message },
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
        { success: false, error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    const deleted = await TestimonialModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {

    return NextResponse.json(
      { success: false, error: "Failed to delete testimonial", message: error.message },
      { status: 500 }
    );
  }
}
