import { NextResponse } from "next/server";
import connectToDatabase from "../../../database/mongoose";
import Newsletter from "../../../database/models/NewsletterModel";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email, visitedUrl, clerkId } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    // Check if email already exists
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return NextResponse.json({ 
        success: false, 
        message: "You're already subscribed! Keep an eye on your inbox." 
      }, { status: 400 });
    }

    const subscription = await Newsletter.create({
      email,
      visitedUrl,
      clerkId,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Welcome to the family! Check your email soon.",
      data: subscription 
    });
  } catch (error) {
    console.error("Newsletter API Error:", error);
    
    // Handle MongoDB unique constraint error manually just in case
    if (error.code === 11000) {
      return NextResponse.json({ 
        success: false, 
        message: "This email is already subscribed." 
      }, { status: 400 });
    }

    return NextResponse.json({ success: false, message: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
