import { NextResponse } from "next/server";
import connectToDatabase from "../../../database/mongoose";
import User from "../../../database/models/userModel";

export async function GET(req) {
  try {  

    const userId  = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId }).lean();

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("User Me API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
