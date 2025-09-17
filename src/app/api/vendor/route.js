import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../database/mongoose";
import Vendor from "../../../database/models/VendorModel";

export async function GET(request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const sortBy = searchParams.get("sortBy");
        
        const searchQuery = searchParams.get("search");
        const categories = searchParams.get("categories")?.split(",");
        const minPrice = parseInt(searchParams.get("minPrice"));
        const maxPrice = parseInt(searchParams.get("maxPrice"));
        const isFeatured = searchParams.get("featured") === "true";
        const cities = searchParams.get("cities")?.split(",");
        const guestCapacity = parseInt(searchParams.get("guestCapacity"));

        let query = {};

        if (searchQuery) {
            query.$or = [
                { name: { $regex: searchQuery, $options: "i" } },
                { "address.city": { $regex: searchQuery, $options: "i" } },
                { tags: { $in: [new RegExp(searchQuery, "i")] } },
                { availableAreas: { $in: [new RegExp(searchQuery, "i")] } },
            ];
        }

        if (categories && categories.length > 0 && categories[0] !== '') {
            query.category = { $in: categories };
        }

        const requiredTags = [];
        if (isFeatured) requiredTags.push("Popular");
        if (requiredTags.length > 0) {
            query.tags = { $all: requiredTags };
        }

        if (cities && cities.length > 0) {
            query["address.city"] = { $in: cities };
        }

        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            if (categories && categories.includes('venues')) {
                query['perDayPrice.min'] = { $gte: minPrice, $lte: maxPrice };
            } else {
                query.basePrice = { $gte: minPrice, $lte: maxPrice };
            }
        }

        if (!isNaN(guestCapacity) && guestCapacity > 0 && categories && categories.includes('venues')) {
            query['seating.min'] = { $lte: guestCapacity };
            query['seating.max'] = { $gte: guestCapacity };
        }

        let sortOptions = {};
        switch (sortBy) {
            case "price-asc":
                if (categories && categories.includes('venues')) {
                    sortOptions['perDayPrice.min'] = 1;
                } else {
                    sortOptions.basePrice = 1;
                }
                break;
            case "price-desc":
                if (categories && categories.includes('venues')) {
                    sortOptions['perDayPrice.min'] = -1;
                } else {
                    sortOptions.basePrice = -1;
                }
                break;
            case "bookings":
                sortOptions.bookings = -1;
                break;
            case "rating":
            default:
                sortOptions.rating = -1;
                break;
        }

        const skip = (page - 1) * limit;
        const vendors = await Vendor.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean();

        const totalVendors = await Vendor.countDocuments(query);
        const totalPages = Math.ceil(totalVendors / limit);

        return NextResponse.json({
            message: "Vendors fetched successfully",
            data: vendors,
            pagination: {
                totalVendors,
                totalPages,
                currentPage: page,
            },
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching vendors:", error);
        return NextResponse.json(
            { message: "An unexpected error occurred on the server." },
            { status: 500 }
        );
    }
}