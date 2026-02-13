import { NextResponse } from "next/server";
import { headers } from "next/headers";
import connectToDatabase from "../../../database/mongoose";
import LeadsModel from "../../../database/models/LeadsModel";

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, phone, actionType } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
    }

    if (name.length < 2 || !/^[a-zA-Z\s]+$/.test(name)) {
      return NextResponse.json({ error: "Invalid name format" }, { status: 400 });
    }

    const headersList = headers();
    const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    const existingLead = await LeadsModel.findOne({
      phone: cleanPhone,
      actionType: actionType || "general",
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (existingLead) {
      return NextResponse.json(
        {
          success: true,
          message: "Lead already exists",
          lead: existingLead,
          isExisting: true,
        },
        { status: 200 }
      );
    }

    const lead = await LeadsModel.create({
      name: name.trim(),
      phone: cleanPhone,
      actionType: actionType || "general",
      ipAddress,
      userAgent,
      source: "website",
      status: "new",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lead created successfully",
        lead,
        isExisting: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead creation error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json({ error: "Validation error", details: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const actionType = searchParams.get("actionType");

    const query = {};
    if (status) query.status = status;
    if (actionType) query.actionType = actionType;

    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Lead.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        leads,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Leads fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}