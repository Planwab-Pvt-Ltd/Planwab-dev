import { clerkClient, WebhookEvent } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { Webhook } from "svix"
import { createUser, deleteUser, updateUser } from '../../../../database/actions/UserActions';


export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is undefined.");
    return new Response("Server configuration error", { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return new Response("Verification error", { status: 400 });
  }

  const eventType = evt.type;

  // ─────────────────────────────────────────────
  // USER CREATED
  // ─────────────────────────────────────────────
  if (eventType === "user.created") {
    const {
      id,
      email_addresses,
      image_url,
      first_name,
      last_name,
      username,
    } = evt.data;

    const email = email_addresses[0]?.email_address || "";
    const safeUsername =
      username ||
      email.split("@")[0] + "_" + id.slice(-4); // fallback username if null

    await connectToDatabase();

    // ✅ Safe upsert — will NEVER throw E11000
    // Uses clerkId as the unique key to find existing doc.
    // If somehow email conflicts, we log and return gracefully.
    let newUser;
    try {
      newUser = await User.findOneAndUpdate(
        { clerkId: id },           
        {
          $setOnInsert: {
            clerkId: id,
            email,
            username: safeUsername,
            photo: image_url || "",
            firstName: first_name || "",
            lastName: last_name || "",
            // Schema defaults handle the rest:
            // plan, planExpiresAt, planPurchasedAt, billingCycle,
            // role, personalInfo, creditBalance, vendorDetails,
            // likedVendors, likedReels, watchlistReels, watchlist
          },
        },
        {
          upsert: true,       // create if not found
          new: true,          // return the document
          setDefaultsOnInsert: true, // apply schema defaults on insert
        }
      );
    } catch (dbErr) {
      // Handle edge case: email already exists from a different clerkId
      // (e.g., user deleted and re-registered with same email)
      if (dbErr.code === 11000) {
        console.error(
          `[Webhook] E11000 — Duplicate key on user.created for email: ${email}. ` +
          `Attempting recovery by updating existing record.`
        );
        // Find the existing user by email and update their clerkId
        newUser = await User.findOneAndUpdate(
          { email },
          {
            $set: {
              clerkId: id,
              photo: image_url || "",
              firstName: first_name || "",
              lastName: last_name || "",
            },
          },
          { new: true }
        );
      } else {
        throw dbErr;
      }
    }

    // Update Clerk public metadata with MongoDB _id
    if (newUser) {
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(id, {
        publicMetadata: { userId: newUser._id.toString() },
      });
    }

    console.log(`[Webhook] user.created handled for clerkId: ${id}`);
    return NextResponse.json({ message: "OK", user: newUser });
  }

  // ─────────────────────────────────────────────
  // USER UPDATED
  // ─────────────────────────────────────────────
  if (eventType === "user.updated") {
    const {
      id,
      email_addresses,
      image_url,
      first_name,
      last_name,
      username,
    } = evt.data;

    const email = email_addresses[0]?.email_address || "";

    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          email,                          // sync email changes
          photo: image_url || "",
          firstName: first_name || "",
          lastName: last_name || "",
          ...(username && { username }),  // only update username if provided
        },
      },
      { new: true }
    );

    console.log(`[Webhook] user.updated handled for clerkId: ${id}`);
    return NextResponse.json({ message: "OK", user: updatedUser });
  }

  // ─────────────────────────────────────────────
  // USER DELETED
  // ─────────────────────────────────────────────
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    await connectToDatabase();

    const deletedUser = await User.findOneAndDelete({ clerkId: id });

    console.log(`[Webhook] user.deleted handled for clerkId: ${id}`);
    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  return new Response("Unhandled event", { status: 200 });
}
