import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../database/mongoose";
import PlannedEvent from "../../../../database/models/PlannedEvent";
import User from "../../../../database/models/userModel";

export async function POST(request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        const {
            username,
            clerkId,
            userId,
            category,
            city,
            year,
            month,
            dateRange,
            timeSlot,
            guests,
            ageGroup,
            budget,
            budgetRange,
            paymentPreference,
            name,
            email,
            phone,
        } = body;

        if (!category || !city || !year || !month || !guests || !budget || !name || !email) {
            return new NextResponse(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 },
            );
        }

        const newEvent = new PlannedEvent({
            clerkId: clerkId,
            userId: userId,
            username: username,
            category,
            city,
            eventDetails: {
                year,
                month,
                dateRange,
                timeSlot,
            },
            guestDetails: {
                count: guests,
                ageGroup,
            },
            budgetDetails: {
                valueFormatted: budget,
                valueRaw: budgetRange,
                paymentPreference,
            },
            contactName: name,
            contactEmail: email,
            contactPhone: phone,
        });

        const savedEvent = await newEvent.save();

        return new NextResponse(JSON.stringify(savedEvent), { status: 201 });
    } catch (error) {
        console.error("CREATE_EVENT_ERROR:", error);
        return new NextResponse(
            JSON.stringify({
                message: "An error occurred while creating the event.",
            }),
            { status: 500 },
        );
    }
}