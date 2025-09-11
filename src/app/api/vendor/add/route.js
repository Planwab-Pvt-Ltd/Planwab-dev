import { NextResponse } from "next/server";
import {
  VenueVendor,
  CatererVendor,
  PhotographerVendor,
  MakeupVendor,
  PlannerVendor,
  ClothesVendor,
  MehendiVendor,
  CakeVendor,
  JewelleryVendor,
  InvitationVendor,
  DjVendor,
  HairstylingVendor,
  OtherVendor,
} from "../../../../database/models/VendorModel";
import { connectToDatabase } from "../../../../database/mongoose";

const categoryModelMap = {
  venues: VenueVendor,
  photographers: PhotographerVendor,
  makeup: MakeupVendor,
  planners: PlannerVendor,
  catering: CatererVendor,
  clothes: ClothesVendor,
  mehendi: MehendiVendor,
  cakes: CakeVendor,
  jewellery: JewelleryVendor,
  invitations: InvitationVendor,
  djs: DjVendor,
  hairstyling: HairstylingVendor,
  other: OtherVendor,
};

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const { activeCategory, categoryData, ...baseData } = body;

    if (!activeCategory || !categoryModelMap[activeCategory]) {
      return NextResponse.json(
        { message: "Invalid vendor category provided." },
        { status: 400 }
      );
    }
    
    const vendorData = {
      ...baseData,
      category: activeCategory,
      ...categoryData,
    };

    const VendorModel = categoryModelMap[activeCategory];
    
    const newVendor = new VendorModel(vendorData);

    await newVendor.save();

    return NextResponse.json(
      {
        message: "Vendor registered successfully!",
        vendor: newVendor,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return NextResponse.json({ message: "Validation Error", errors }, { status: 400 });
    }
    
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return NextResponse.json(
            { message: `A vendor with this ${field} already exists.` },
            { status: 409 }
        );
    }

    console.error("Error creating vendor:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred on the server." },
      { status: 500 }
    );
  }
}

