import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import connectToDatabase from "../../../../database/mongoose";
import User from "../../../../database/models/userModel";
import { clerkClient } from "@clerk/nextjs/server";

const PLAN_PRICES = {
  pro: { monthly: 499, yearly: 4990 },
  max: { monthly: 999, yearly: 9990 },
};

async function updateClerkMeta(clerkId, plan, role) {
  try {
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(clerkId, {
      publicMetadata: { subscription: plan, role },
    });
  } catch (e) {
    console.error("Clerk metadata update failed:", e.message);
  }
}

function generateReceipt(userId, plan) {
  const short = userId.replace("user_", "").slice(0, 12);
  const ts = Date.now().toString(36);
  return `sub_${short}_${plan}_${ts}`.slice(0, 40);
}

function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_LIVE_KEY_ID;
  const keySecret = process.env.RAZORPAY_LIVE_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials missing");
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isExpired =
      user.plan !== "free" &&
      user.planExpiresAt &&
      new Date(user.planExpiresAt) < new Date();

    if (isExpired) {
      await User.findOneAndUpdate(
        { clerkId: userId },
        {
          plan: "free",
          planExpiresAt: null,
          planPurchasedAt: null,
          billingCycle: null,
        }
      );
      await updateClerkMeta(userId, "free", user.role || "user");
    }

    return NextResponse.json({
      success: true,
      plan: isExpired ? "free" : user.plan,
      planExpiresAt: isExpired ? null : user.planExpiresAt,
      planPurchasedAt: isExpired ? null : user.planPurchasedAt,
      billingCycle: isExpired ? null : user.billingCycle,
      isActive: !isExpired && user.plan !== "free",
    });
  } catch (error) {
    console.error("Subscription GET Error:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { userId, plan, billingCycle } = body;

    if (!userId || !plan || !billingCycle) {
      return NextResponse.json(
        { error: "userId, plan, and billingCycle are required" },
        { status: 400 }
      );
    }

    if (!PLAN_PRICES[plan]) {
      return NextResponse.json(
        { error: `Invalid plan: ${plan}. Must be pro or max` },
        { status: 400 }
      );
    }

    if (!["monthly", "yearly"].includes(billingCycle)) {
      return NextResponse.json(
        { error: "billingCycle must be monthly or yearly" },
        { status: 400 }
      );
    }

    const price = PLAN_PRICES[plan][billingCycle];

    const user = await User.findOne({ clerkId: userId }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.plan === plan && user.planExpiresAt && new Date(user.planExpiresAt) > new Date()) {
      return NextResponse.json(
        { error: "You are already on this plan" },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayInstance();
    const receipt = generateReceipt(userId, plan);

    const order = await razorpay.orders.create({
      amount: price * 100,
      currency: "INR",
      receipt,
      payment_capture: 1,
      notes: {
        userId: userId.slice(0, 50),
        plan,
        billingCycle,
        type: "subscription",
      },
    });

    return NextResponse.json({
      success: true,
      key: process.env.RAZORPAY_LIVE_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      razorpayOrderId: order.id,
      plan,
      billingCycle,
      price,
    });
  } catch (error) {
    console.error("Subscription POST Error:", error.message || error);
    const msg =
      error?.error?.description || error?.message || "Failed to create order";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const {
      userId,
      plan,
      billingCycle,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = body;

    if (!userId || !plan) {
      return NextResponse.json(
        { error: "userId and plan are required" },
        { status: 400 }
      );
    }

    // --- FREE DOWNGRADE ---
    if (plan === "free") {
      const updated = await User.findOneAndUpdate(
        { clerkId: userId },
        {
          $set: {
            plan: "free",
            planExpiresAt: null,
            planPurchasedAt: null,
            billingCycle: null,
          },
        },
        { new: true }
      );

      if (!updated) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      await updateClerkMeta(userId, "free", updated.role || "user");

      console.log("DB updated to free:", updated.plan, updated.planExpiresAt);

      return NextResponse.json({
        success: true,
        plan: "free",
        planExpiresAt: null,
      });
    }

    // --- PAID PLAN UPGRADE ---
    if (!["pro", "max"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Payment verification details required" },
        { status: 400 }
      );
    }

    if (!billingCycle || !["monthly", "yearly"].includes(billingCycle)) {
      return NextResponse.json(
        { error: "Valid billingCycle required" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_LIVE_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Server config error" },
        { status: 500 }
      );
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expected !== razorpaySignature) {
      return NextResponse.json(
        { success: false, error: "Signature verification failed" },
        { status: 400 }
      );
    }

    // Calculate expiry
    const now = new Date();
    const expiresAt = new Date(now);
    if (billingCycle === "monthly") {
      expiresAt.setDate(expiresAt.getDate() + 30);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    // Use $set with findOneAndUpdate — bypasses any strict mode issues
    const updated = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          plan: plan,
          planExpiresAt: expiresAt,
          planPurchasedAt: now,
          billingCycle: billingCycle,
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify it actually saved
    console.log("DB SAVE VERIFIED:", {
      clerkId: userId,
      plan: updated.plan,
      planExpiresAt: updated.planExpiresAt,
      planPurchasedAt: updated.planPurchasedAt,
      billingCycle: updated.billingCycle,
    });

    await updateClerkMeta(userId, plan, updated.role || "user");

    return NextResponse.json({
      success: true,
      plan: updated.plan,
      planExpiresAt: updated.planExpiresAt,
      planPurchasedAt: updated.planPurchasedAt,
      billingCycle: updated.billingCycle,
    });
  } catch (error) {
    console.error("Subscription PUT Error:", error.message || error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}